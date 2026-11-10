import React, { useRef, useEffect } from "react";

export default function ChatInput({
  input,
  setInput,
  isGenerating,
  onSubmit,
  onStop,
  currentMode,
  onToggleMode
}) {
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating) {
        onStop();
      } else {
        onSubmit();
      }
    }
  };

  return (
    <footer className="fixed md:static bottom-0 left-0 right-0 z-30 bg-[#051311] md:bg-[#051311]/95 md:backdrop-blur-md border-t border-brand-cardBorder px-3.5 sm:px-6 pt-2.5 pb-2 sm:pb-4 safe-area-bottom shadow-2xl shrink-0">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Form Container */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isGenerating) onStop();
            else onSubmit();
          }}
          className="relative flex items-center bg-[#09221e] border border-brand-cardBorder focus-within:border-emerald-500/70 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-inner transition-all"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan algoritma, matematika, sains, sosiologi, fikih, atau metodologi skripsi..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 border-0 p-0 leading-5 resize-none max-h-32 min-h-[36px]"
          />

          <button
            type="submit"
            title={isGenerating ? "Hentikan Generasi" : "Kirim Pesan"}
            className={`p-2 rounded-xl transition-all shrink-0 ml-2 shadow-md ${
              isGenerating
                ? "bg-amber-500 text-white hover:bg-amber-400"
                : "bg-emerald-400 text-brand-darkest hover:bg-emerald-300 active:scale-95"
            }`}
          >
            {isGenerating ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        {/* Footer Mode & Failover Indicator */}
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-gray-400">Mode:</span>
            {currentMode === "simple" ? (
              <span className="text-emerald-400 font-medium truncate inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                <span>Tugas Biasa (Cepat)</span>
              </span>
            ) : (
              <span className="text-amber-400 font-medium truncate inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">menu_book</span>
                <span>Riset Detail</span>
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Failover: 3.5 Flash Lite &rarr; Flash Lite Latest</span>
          </div>

          <button
            type="button"
            onClick={onToggleMode}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 shrink-0"
          >
            {currentMode === "simple" ? "Ganti ke Riset Detail" : "Ganti ke Tugas Biasa"}
          </button>
        </div>

      </div>
    </footer>
  );
}

