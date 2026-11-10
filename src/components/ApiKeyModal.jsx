import React, { useState } from "react";
import { getApiKey, saveApiKey } from "../utils/gemini";

export default function ApiKeyModal({ isOpen, onClose, onShowToast }) {
  const [keyInput, setKeyInput] = useState(getApiKey());

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(keyInput);
    if (onShowToast) onShowToast("API Key berhasil disimpan!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#07201c] border border-brand-cardBorder rounded-2xl p-5 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cardBorder/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">tune</span>
            <h3 className="font-bold text-sm sm:text-base text-white">Pengaturan Model &amp; API Key</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Failover info */}
        <div className="p-3 rounded-xl bg-brand-dark border border-emerald-500/30 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0 mt-0.5">shield</span>
          <div className="text-[11px] text-gray-300 leading-relaxed">
            <strong className="text-emerald-300">Auto-Failover Aktif:</strong> Bila server Google sibuk, sistem otomatis mengalihkan permintaan ke model berkuota tinggi (<code className="text-emerald-300">gemini-3.5-flash-lite</code> &rarr; <code className="text-emerald-300">gemini-flash-lite-latest</code>) tanpa henti.
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">Google Gemini API Key:</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Masukkan Gemini API Key..."
            className="w-full bg-brand-dark border border-brand-cardBorder text-xs text-white rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-emerald-500/60"
          />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Tersimpan aman di peramban lokal Anda.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
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
            Simpan Pengaturan
          </button>
        </div>

      </div>
    </div>
  );
}

