import React, { useState } from "react";
import { getFirebaseConfig } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function FirebaseModal({ isOpen, onClose, onShowToast }) {
  const { reloadFirebaseConfig } = useAuth();
  const currentConfig = getFirebaseConfig();

  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(currentConfig, null, 2)
  );

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.apiKey || !parsed.projectId) {
        alert("Config harus memiliki minimal 'apiKey' dan 'projectId'.");
        return;
      }
      localStorage.setItem("uin_firebase_config", JSON.stringify(parsed));
      if (onShowToast) onShowToast("Firebase Config tersimpan! Memuat ulang...");
      onClose();
      reloadFirebaseConfig();
    } catch (e) {
      alert("Format JSON tidak valid. Pastikan format JSON benar.");
    }
  };

  const handleClear = () => {
    if (window.confirm("Hapus Firebase Config lokal?")) {
      localStorage.removeItem("uin_firebase_config");
      onClose();
      reloadFirebaseConfig();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#07201c] border border-brand-cardBorder rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cardBorder/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">database</span>
            <h3 className="font-bold text-sm sm:text-base text-white">Konfigurasi Cloud Firebase</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3 rounded-xl bg-brand-dark border border-emerald-500/30 text-xs text-gray-300 space-y-1.5 leading-relaxed">
          <p className="font-bold text-emerald-300">Cara mendapatkan Firebase Config:</p>
          <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-gray-300">
            <li>Buka <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">console.firebase.google.com</a> dan buat proyek baru.</li>
            <li>Di Project Settings, tambahkan Web App (ikon &lt;/&gt;) dan salin objek <code>firebaseConfig</code>.</li>
            <li>Aktifkan <strong>Authentication</strong> (Google &amp; Email) dan <strong>Firestore Database</strong>.</li>
          </ol>
        </div>

        {/* JSON Config Textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">Firebase Config Object (JSON):</label>
          <textarea
            rows={7}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "proyek.firebaseapp.com",\n  "projectId": "proyek-id",\n  "storageBucket": "proyek.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
            className="w-full bg-brand-dark border border-brand-cardBorder text-[11px] text-emerald-300 rounded-xl p-3 font-mono focus:outline-none focus:border-emerald-500/60 leading-5"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 underline font-medium"
          >
            Hapus Config
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-brand-dark border border-brand-cardBorder"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-brand-darkest hover:bg-emerald-400 shadow-md"
            >
              Simpan &amp; Hubungkan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

