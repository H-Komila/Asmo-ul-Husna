import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function CardExportModal({ isOpen, onClose, selectedItem, lang }) {
  const exportRef = useRef(null);

  if (!isOpen || !selectedItem) return null;

  const trans = selectedItem.transliteration || selectedItem.trans || '';
  const meaning = typeof selectedItem.meaning === 'object' ? (selectedItem.meaning[lang] || selectedItem.meaning['uz']) : selectedItem.meaning;

  const downloadImage = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { backgroundColor: '#020617' });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${trans}-AsmaUlHusna.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold">✕</button>
        
        <h3 className="text-lg font-bold text-amber-400 mb-4">🖼️ Rasm ko'rinishida yuklash</h3>

        {/* Generatsiya qilinadigan karta */}
        <div ref={exportRef} className="w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl my-2">
          <span className="text-amber-500/60 text-xs tracking-widest uppercase mb-2">Asma-ul-Husna #{selectedItem.id}</span>
          <h2 className="text-5xl font-serif text-amber-300 my-4 leading-relaxed" dir="rtl">{selectedItem.arabic}</h2>
          <h4 className="text-xl font-bold text-slate-100 mb-2">{trans}</h4>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">{meaning}</p>
        </div>

        <button onClick={downloadImage} className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition">
          Rasmni saqlash 📥
        </button>
      </div>
    </div>
  );
}