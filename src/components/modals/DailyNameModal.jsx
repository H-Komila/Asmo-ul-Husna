import React, { useState, useEffect } from 'react';

export default function DailyNameModal({ isOpen, onClose, namesData, lang, openTasbeh }) {
  const [dailyItem, setDailyItem] = useState(null);

  useEffect(() => {
    if (namesData && namesData.length > 0) {
      // Sana asosida kunlik ismni aniqlash
      const today = new Date();
      const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      const nameIndex = dayOfYear % namesData.length;
      setDailyItem(namesData[nameIndex]);
    }
  }, [namesData]);

  if (!isOpen || !dailyItem) return null;

  const trans = dailyItem.transliteration || dailyItem.trans || '';
  const meaning =
    typeof dailyItem.meaning === 'object'
      ? dailyItem.meaning[lang] || dailyItem.meaning['uz']
      : dailyItem.meaning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 text-center flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold"
        >
          ✕
        </button>

        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-3">
          🌟 Kunning Ismi
        </span>

        <h2 className="text-4xl font-serif text-amber-300 my-3" dir="rtl">
          {dailyItem.arabic}
        </h2>

        <h3 className="text-xl font-bold text-slate-100 mb-2">{trans}</h3>

        <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-6">
          {meaning}
        </p>

        <div className="flex gap-2 w-full">
          <button
            onClick={() => {
              onClose();
              openTasbeh(dailyItem);
            }}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition text-xs"
          >
            📿 Tasbeh aytish
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-xs border border-slate-700"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}