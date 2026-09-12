import React from 'react';

export default function RandomModal({ isOpen, onClose, selectedItem, lang, onNextRandom }) {
  if (!isOpen || !selectedItem) return null;

  const trans = selectedItem?.transliteration || selectedItem?.trans || '';
  const meaning = typeof selectedItem?.meaning === 'object'
    ? (selectedItem?.meaning[lang] || selectedItem?.meaning['uz'])
    : selectedItem?.meaning || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold p-1">
          ✕
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">🎲 Tasodifiy Ism</span>
        <div className="bg-slate-800/60 border border-amber-500/20 rounded-xl p-6 w-full mb-6">
          <span className="text-amber-500 text-sm font-semibold">#{selectedItem.id}</span>
          <h3 className="text-4xl font-serif text-amber-300 my-3" dir="rtl">{selectedItem.arabic}</h3>
          <h4 className="text-lg font-bold text-slate-100 mb-2">{trans}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{meaning}</p>
        </div>
        {onNextRandom && (
          <button onClick={onNextRandom} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition">
            Boshqasi 🔄
          </button>
        )}
      </div>
    </div>
  );
}