import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const { loginGoogle, loginEmail, signupEmail, isConfigured, openFirebaseModal } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
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
              Untuk mengaktifkan login Google dan penyimpanan riwayat chat cloud, silakan masukkan Firebase Config proyek Anda terlebih dahulu.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 bg-brand-dark border border-brand-cardBorder hover:text-white"
            >
              Nanti Saja
            </button>
            <button
              onClick={() => {
                onClose();
                openFirebaseModal();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-brand-darkest hover:bg-emerald-400 shadow-md"
            >
              Masukkan Firebase Config
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMsg("");
      await loginGoogle();
      if (onShowToast) onShowToast("Berhasil masuk dengan Google!");
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk dengan Google.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      if (isRegister) {
        await signupEmail(email, password, displayName);
        if (onShowToast) onShowToast("Akun berhasil dibuat!");
      } else {
        await loginEmail(email, password);
        if (onShowToast) onShowToast("Berhasil masuk!");
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan autentikasi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#07201c] border border-brand-cardBorder rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cardBorder/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center p-1">
              <img src="/logo-uin.svg" alt="UIN" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              {isRegister ? "Daftar Akun Baru" : "Masuk ke AI UIN"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-mono tracking-wider">
          <div className="flex-1 h-px bg-brand-cardBorder"></div>
          <span>atau dengan email</span>
          <div className="flex-1 h-px bg-brand-cardBorder"></div>
        </div>

        {/* Form Email & Password */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Lengkap:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="cth. Muhammad Rizal"
                className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@student.uin-suka.ac.id"
              required
              className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kata Sandi:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              required
              minLength={6}
              className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] pt-2"
          >
            {submitting ? "Memproses..." : isRegister ? "Daftar Akun" : "Masuk"}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            {isRegister ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Daftar sekarang"}
          </button>
        </div>

      </div>
    </div>
  );
}

