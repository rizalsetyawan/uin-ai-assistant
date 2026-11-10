import React from "react";
import MarkdownMath from "./MarkdownMath";

export default function ChatList({ messages, isGenerating, activeModelName, onCopyText }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";

        if (isUser) {
          return (
            <div key={index} className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 sm:p-3.5 shadow-md">
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        }

        // Assistant Message
        const isLoadingMessage = isGenerating && index === messages.length - 1 && !msg.content;
        const isStreaming = isGenerating && index === messages.length - 1 && Boolean(msg.content);

        return (
          <div key={index} className="flex items-start gap-2.5 sm:gap-3">
            
            {/* Assistant Avatar: Official UIN Logo (Spins when loading) */}
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow mt-0.5 p-1 transition-all overflow-hidden">
              <img
                src="/logo-uin.svg"
                alt="UIN AI"
                className={`w-full h-full object-contain ${isLoadingMessage ? "animate-spin" : ""}`}
              />
            </div>

            {/* Bubble Container */}
            <div className="flex-1 max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-card border border-brand-cardBorder p-3.5 sm:p-4 shadow-lg space-y-2">
              
              {/* Message Header: Model Badge + Copy Button */}
              <div className="flex items-center justify-between border-b border-brand-cardBorder/50 pb-1.5 text-[10px] text-gray-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoadingMessage || isStreaming ? "bg-emerald-400 animate-pulse" : "bg-emerald-500"}`}></span>
                  <span className="text-emerald-300 font-semibold">{msg.modelUsed || activeModelName || "Gemini Engine"}</span>
                </div>

                {msg.content && !isLoadingMessage && (
                  <button
                    onClick={() => onCopyText(msg.content)}
                    className="text-gray-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    title="Salin jawaban"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Salin</span>
                  </button>
                )}
              </div>

              {/* Content / Loading Indicator */}
              <div className={`min-h-[20px] ${isStreaming ? "stream-cursor" : ""}`}>
                {isLoadingMessage ? (
                  <div className="flex items-center gap-2 py-1 text-xs text-gray-400 font-mono">
                    <span>Menghubungkan ke {activeModelName || "Gemini"}...</span>
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot"></div>
                    </div>
                  </div>
                ) : msg.isError ? (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>Gagal mendapatkan respon:</span>
                    </div>
                    <p>{msg.content}</p>
                    <p className="text-[10px] text-gray-400">Silakan periksa API Key atau coba beberapa saat lagi.</p>
                  </div>
                ) : (
                  <MarkdownMath content={msg.content} />
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

