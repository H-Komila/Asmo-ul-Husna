import React from 'react';

export default function HadithsModal({ isOpen, onClose, hadithsData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold p-1">
          ✕
        </button>
        <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center border-b border-amber-500/20 pb-3">
          📜 Hadislar
        </h2>
        <div className="space-y-4">
          {hadithsData && hadithsData.length > 0 ? (
            hadithsData.map((hadith, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-slate-200 leading-relaxed mb-2">"{hadith.text || hadith}"</p>
                {hadith.source && <p className="text-xs text-amber-400 text-right">— {hadith.source}</p>}
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-6">Hadislar yuklanmoqda...</p>
          )}
        </div>
      </div>
    </div>
  );
}