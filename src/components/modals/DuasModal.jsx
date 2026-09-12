import React from 'react';

export default function DuasModal({ isOpen, onClose, duasData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Yopish tugmasi */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold p-1 transition-colors"
        >
          ✕
        </button>

        {/* Sarlavha */}
        <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center border-b border-amber-500/20 pb-3">
          🤲 Duolar
        </h2>

        {/* Duolar ro'yxati */}
        <div className="space-y-4">
          {duasData && duasData.length > 0 ? (
            duasData.map((dua, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 transition hover:border-amber-500/40">
                {dua.title && <h3 className="text-lg font-semibold text-amber-300 mb-2">{dua.title}</h3>}
                {dua.arabic && <p className="text-right text-2xl font-serif text-amber-100 mb-3 leading-relaxed" dir="rtl">{dua.arabic}</p>}
                {dua.meaning && <p className="text-sm text-slate-300 leading-relaxed">{dua.meaning}</p>}
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-6">Duolar yuklanmoqda yoki mavjud emas...</p>
          )}
        </div>
      </div>
    </div>
  );
}