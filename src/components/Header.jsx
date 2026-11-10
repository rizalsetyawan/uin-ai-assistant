import React, { useState } from "react";
import { FACULTY_MAP } from "../utils/prompts";
import { useAuth } from "../context/AuthContext";

export default function Header({
  selectedFaculty,
  onSelectFaculty,
  currentMode,
  onSetMode,
  onToggleSidebar,
  onOpenApiKeyModal
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isConfigured, openAuthModal, openFirebaseModal, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const facultyCfg = FACULTY_MAP[selectedFaculty] || { icon: "public", label: selectedFaculty };

  return (
    <header className="sticky top-0 z-30 bg-[#051311]/95 backdrop-blur-md border-b border-brand-cardBorder shrink-0 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Hamburger + UIN Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            title="Buka/Tutup Riwayat Chat"
            className="p-1.5 rounded-xl hover:bg-emerald-950/60 text-gray-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center p-1 shadow">
              <img src="/logo-uin.svg" alt="Logo UIN" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>AI UIN Sunan Kalijaga</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium border border-emerald-500/30">v2.0</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-mono">Presisi Akademik &amp; Cloud History</p>
            </div>
          </div>
        </div>

        {/* Center: Faculty Selector & Mode Switches */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Faculty Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-dark border border-brand-cardBorder hover:border-emerald-500/60 text-xs text-slate-200 transition-all font-medium shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">{facultyCfg.icon}</span>
              <span className="max-w-[110px] sm:max-w-[160px] truncate">{facultyCfg.label}</span>
              <span className={`material-symbols-outlined text-[16px] text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-[#07201c] border border-brand-cardBorder rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-mono text-emerald-300 border-b border-brand-cardBorder/50 mb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">domain</span>
                    <span>Pilih Ranah Fakultas</span>
                  </div>
                  {Object.entries(FACULTY_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onSelectFaculty(key);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-xl flex items-center gap-2.5 text-xs transition-colors ${
                        selectedFaculty === key ? "bg-emerald-950/70 text-emerald-300 font-semibold" : "text-gray-300 hover:bg-brand-dark hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-400">{val.icon}</span>
                      <span className="truncate">{val.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center bg-[#061916] border border-brand-cardBorder rounded-xl p-0.5">
            <button
              onClick={() => onSetMode("simple")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                currentMode === "simple"
                  ? "bg-emerald-500 text-brand-darkest shadow"
                  : "text-gray-400 hover:text-slate-200"
              }`}
              title="Mode Tugas Biasa (Cepat & Langsung Inti)"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span className="hidden md:inline">Tugas Biasa</span>
            </button>
            <button
              onClick={() => onSetMode("detail")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                currentMode === "detail"
                  ? "bg-amber-400 text-brand-darkest shadow"
                  : "text-gray-400 hover:text-slate-200"
              }`}
              title="Mode Riset Detail (Mendalam & Rujukan Ilmiah)"
            >
              <span className="material-symbols-outlined text-[14px]">menu_book</span>
              <span className="hidden md:inline">Riset Detail</span>
            </button>
          </div>
        </div>

        {/* Right: Settings & User Account / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Settings Button */}
          <button
            onClick={onOpenApiKeyModal}
            title="Pengaturan Model & API Key"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-brand-dark border border-brand-cardBorder hover:border-emerald-500/50 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-400">tune</span>
            <span className="hidden lg:inline text-xs font-medium">Model</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-brand-dark border border-emerald-500/40 rounded-xl hover:border-emerald-400 transition-all"
              >
                <span className="hidden sm:inline text-xs font-medium text-emerald-300 max-w-[90px] truncate">
                  {user.displayName || user.email?.split("@")[0] || "Akun"}
                </span>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-lg object-cover border border-emerald-400/40" />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-[#07201c] border border-brand-cardBorder rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-brand-cardBorder/50">
                      <p className="text-xs font-bold text-white truncate">{user.displayName || "Pengguna UIN"}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        openFirebaseModal();
                      }}
                      className="w-full px-3 py-2 text-left rounded-xl flex items-center gap-2 text-xs text-gray-300 hover:bg-brand-dark hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-400">database</span>
                      <span>Firebase Database Config</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left rounded-xl flex items-center gap-2 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={isConfigured ? openAuthModal : openFirebaseModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Masuk</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

