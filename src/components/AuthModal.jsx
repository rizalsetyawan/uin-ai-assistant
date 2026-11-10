import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const { login, signup, isConfigured, openFirebaseModal } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  if (!isConfigured) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#07201c] border border-brand-cardBorder rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[28px]">database</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Firebase Belum Dikonfigurasi</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Silakan masukkan konfigurasi Firebase Anda terlebih dahulu.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 bg-brand-dark border border-brand-cardBorder hover:text-white"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                openFirebaseModal();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-brand-darkest hover:bg-emerald-400 shadow-md"
            >
              Buka Konfigurasi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      if (isRegister) {
        await signup(username, password);
        if (onShowToast) onShowToast(`Akun @${username.trim()} berhasil dibuat!`);
      } else {
        await login(username, password);
        if (onShowToast) onShowToast(`Selamat datang kembali, @${username.trim()}!`);
      }
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      const code = err.code || "";
      if (code.includes("email-already-in-use")) {
        setErrorMsg("Username ini sudah terdaftar. Silakan login atau pilih username lain.");
      } else if (code.includes("wrong-password") || code.includes("user-not-found") || code.includes("invalid-credential")) {
        setErrorMsg("Username atau kata sandi tidak cocok.");
      } else if (code.includes("weak-password")) {
        setErrorMsg("Kata sandi terlalu pendek (minimal 6 karakter).");
      } else {
        setErrorMsg(err.message || "Terjadi kesalahan masuk.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#07201c] border border-brand-cardBorder rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cardBorder/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center p-1 shadow">
              <img src="/logo-uin.svg" alt="UIN" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {isRegister ? "Daftar Akun Baru" : "Masuk Akun"}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">Simpan &amp; Akses Riwayat Chat</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0 text-red-400">error</span>
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Username & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">person</span>
              <span>Username:</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cth. rizal_uin atau 2110605001"
              required
              autoFocus
              className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white placeholder-gray-500 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-emerald-500/70"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">lock</span>
              <span>Kata Sandi:</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              required
              minLength={6}
              className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white placeholder-gray-500 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-emerald-500/70"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 mt-2"
          >
            {submitting ? (
              <span>Memproses...</span>
            ) : isRegister ? (
              <>
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Buat Akun Baru</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center pt-1 border-t border-brand-cardBorder/50">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {isRegister ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Buat akun di sini"}
          </button>
        </div>

      </div>
    </div>
  );
}
