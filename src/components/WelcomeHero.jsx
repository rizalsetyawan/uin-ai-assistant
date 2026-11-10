import React from "react";

export default function WelcomeHero({ currentMode, onSetMode, onSelectPrompt }) {
  const examplePrompts = [
    {
      icon: "science",
      category: "Saintek / Komputer",
      text: "Jelaskan perbedaan algoritma Dijkstra dan A* Search beserta kompleksitas waktunya!"
    },
    {
      icon: "gavel",
      category: "Syari'ah & Hukum",
      text: "Bagaimana status hukum akad jual beli online berbasis Smart Contract dalam Fikih Muamalah?"
    },
    {
      icon: "trending_up",
      category: "FEBI / Ekonomi",
      text: "Jelaskan mekanisme mitigasi risiko pembiayaan Mudharabah pada perbankan syariah!"
    },
    {
      icon: "auto_stories",
      category: "Interkoneksi UIN",
      text: "Bagaimana penerapan paradigma Integrasi-Interkoneksi Amin Abdullah dalam menyusun latar belakang skripsi?"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Hero Introduction Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0a2722] to-[#071b18] border border-brand-cardBorder relative overflow-hidden shadow-lg">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow p-1.5">
            <img src="/logo-uin.svg" alt="Logo UIN Sunan Kalijaga" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-white leading-snug tracking-tight">
              Chatbot Akademik UIN Sunan Kalijaga
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Dilengkapi <strong className="text-emerald-300 font-semibold">Cloud History Database</strong>, <strong className="text-emerald-300 font-semibold">Auto-Failover System</strong>, dan <strong className="text-emerald-300 font-semibold">Presisi Ranah Ilmu</strong> (sains murni saintifik, agama dengan dalil sahih).
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Mode 1: Tugas Biasa */}
        <div
          onClick={() => onSetMode("simple")}
          className={`p-3.5 sm:p-4 rounded-xl border-2 shadow-sm relative transition-all cursor-pointer ${
            currentMode === "simple"
              ? "bg-[#09221e] border-emerald-500/70"
              : "bg-brand-dark border-brand-cardBorder hover:border-brand-cardBorderHover"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">bolt</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-300">Mode Tugas Biasa (Super Cepat)</span>
            </div>
            {currentMode === "simple" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-brand-darkest font-bold uppercase tracking-wider">
                Aktif
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
            Jawaban <strong className="text-white font-medium">singkat, padat, dan langsung ke inti</strong>. Sumber rujukan seperlunya sesuai bidang ilmu tugas kuliah.
          </p>
        </div>

        {/* Mode 2: Riset Detail */}
        <div
          onClick={() => onSetMode("detail")}
          className={`p-3.5 sm:p-4 rounded-xl border-2 shadow-sm transition-all cursor-pointer ${
            currentMode === "detail"
              ? "bg-[#09221e] border-amber-400/80"
              : "bg-brand-dark border-brand-cardBorder hover:border-brand-cardBorderHover"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">menu_book</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Mode Riset Detail</span>
            </div>
            {currentMode === "detail" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-brand-darkest font-bold uppercase tracking-wider">
                Aktif
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
            Pembahasan <strong className="text-slate-300 font-medium">mendalam &amp; komprehensif</strong>, teori akademik spesifik, metodologi, dan rujukan jurnal ilmiah lengkap.
          </p>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center space-x-1.5 px-1">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">lightbulb</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
            Contoh Pertanyaan Lintas Disiplin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(p.text)}
              className="text-left p-3 rounded-xl bg-brand-dark border border-brand-cardBorder hover:border-emerald-500/50 hover:bg-[#09221e] transition-all flex items-start space-x-2.5 group shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-emerald-400">
                <span className="material-symbols-outlined text-emerald-400 text-[14px]">{p.icon}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400/90 block">{p.category}</span>
                <span className="text-xs text-gray-200 leading-snug line-clamp-2">{p.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

