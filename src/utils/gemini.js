export const DEFAULT_API_KEY = atob("QVEuQWI4Uk42S2NtNTJSU18xTXVCYmdGTFp2NjNLLUFwVTU0T1lBSGh4V0RVV09lSzhxcUE=");

export const MODEL_FALLBACK_QUEUE = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest"
];

export function getApiKey() {
  return localStorage.getItem("uin_gemini_api_key") || DEFAULT_API_KEY;
}

export function saveApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem("uin_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("uin_gemini_api_key");
  }
}

const waitDelay = (ms) => new Promise(res => setTimeout(res, ms));

export async function generateStreamWithFailover({
  history,
  systemPrompt,
  signal,
  onStartModel,
  onFirstToken,
  onChunk
}) {
  const apiKey = getApiKey();
  let lastError = null;

  for (let i = 0; i < MODEL_FALLBACK_QUEUE.length; i++) {
    const modelName = MODEL_FALLBACK_QUEUE[i];
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    if (onStartModel) onStartModel(modelName);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
    
    const payload = {
      contents: history,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.2
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const parsed = JSON.parse(errBody);
          if (parsed.error && parsed.error.message) {
            errorMsg = parsed.error.message;
          }
        } catch (_) {}
        
        // Overload, quota, or transient failover
        if (response.status === 503 || response.status === 429 || response.status === 404 || errorMsg.includes("high demand") || errorMsg.includes("quota")) {
          console.warn(`Model ${modelName} unavailable (${errorMsg}). Mengalihkan ke model cadangan...`);
          lastError = new Error(errorMsg);
          await waitDelay(1200);
          continue;
        } else {
          throw new Error(errorMsg);
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let firstTokenReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const data = JSON.parse(jsonStr);
              if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const parts = data.candidates[0].content.parts;
                if (parts) {
                  for (const part of parts) {
                    if (part.text) {
                      if (!firstTokenReceived) {
                        firstTokenReceived = true;
                        if (onFirstToken) onFirstToken(modelName);
                      }
                      if (onChunk) onChunk(part.text);
                    }
                  }
                }
              }
            } catch (e) {}
          }
        }
      }

      return; // Success!

    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") throw fetchErr;
      console.warn(`Error with ${modelName}:`, fetchErr);
      lastError = fetchErr;
    }
  }

  throw lastError || new Error("Semua jalur server sedang mengalami lonjakan antrian. Coba sesaat lagi.");
}

