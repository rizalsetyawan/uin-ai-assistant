import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenFirebaseModal,
  onOpenAuthModal
}) {
  const { user, isConfigured, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static top-0 bottom-0 left-0 z-50
        w-72 bg-[#041210] border-r border-brand-cardBorder flex flex-col
        transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
      `}>
        
        {/* Top Header & New Chat Button */}
        <div className="p-3.5 border-b border-brand-cardBorder/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">forum</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Riwayat Obrolan</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-emerald-950/60 text-gray-400 hover:text-white md:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Obrolan Baru</span>
          </button>

          {/* Search box if chats exist */}
          {chats.length > 3 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Cari obrolan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#081f1b] border border-brand-cardBorder text-xs text-white placeholder-gray-400 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500/60"
              />
              <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-2.5 top-2 pointer-events-none">
                search
              </span>
            </div>
          )}
        </div>

        {/* Chat List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500 space-y-2">
              <span className="material-symbols-outlined text-[28px] text-gray-600">chat_bubble_outline</span>
              <p className="text-xs font-mono">Belum ada riwayat percakapan.</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Mulai obrolan baru untuk menyimpan riwayat pertanyaan &amp; riset Anda.
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-semibold shadow-sm"
                      : "text-gray-300 hover:bg-[#07201c] hover:text-white"
                  }`}
                  onClick={() => {
                    onSelectChat(chat.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  <div className="flex items-center gap-2 truncate pr-6">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400/80 shrink-0">
                      chat
                    </span>
                    <span className="truncate">{chat.title || "Percakapan Baru"}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Hapus obrolan ini dari riwayat?")) {
                        onDeleteChat(chat.id);
                      }
                    }}
                    title="Hapus"
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: User Account / Cloud Sync Status */}
        <div className="p-3 border-t border-brand-cardBorder/60 bg-[#030e0c] space-y-2 shrink-0">
          {user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-brand-dark border border-brand-cardBorder">
              <div className="flex items-center gap-2 truncate">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{user.displayName || "Pengguna UIN"}</p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Firebase Sync Aktif</span>
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Keluar"
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-brand-dark border border-emerald-500/30 space-y-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[18px] shrink-0 mt-0.5">cloud_off</span>
                <div className="text-[11px] text-gray-300 leading-snug">
                  <strong className="text-white block">Mode Tamu (Lokal)</strong>
                  Riwayat disimpan di browser lokal. Masuk untuk sinkronisasi cloud Firebase.
                </div>
              </div>
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={isConfigured ? onOpenAuthModal : onOpenFirebaseModal}
                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all text-center"
                >
                  {isConfigured ? "Masuk Akun" : "Konfigurasi Firebase"}
                </button>
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}

