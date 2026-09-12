import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TasbehModal({ isOpen, onClose, selectedItem, lang }) {
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(33);

  // Modal ochilganda sanoqni nolga tushirish
  useEffect(() => {
    if (isOpen) {
      setCount(0);
    }
  }, [isOpen, selectedItem]);

  if (!isOpen || !selectedItem) return null;

  // Nom va ma'nolarni xavfsiz olish
  const trans = selectedItem?.transliteration || selectedItem?.trans || '';
  const meaning = typeof selectedItem?.meaning === 'object'
    ? selectedItem?.meaning[lang] || selectedItem?.meaning['uz']
    : selectedItem?.meaning || '';

  const handleIncrement = () => {
    // Mobil qurilmalarda yengil vibratsiya (qo'llab-quvvatlansa)
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    setCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === targetCount && navigator.vibrate) {
        // Maqsadga yetganda kuchliroq vibratsiya
        navigator.vibrate([100, 50, 100]);
      }
      return nextCount;
    });
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col items-center"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl p-2 transition"
          >
            ✕
          </button>

          {/* Sarlavha */}
          <div className="text-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Elektron Tasbeh
            </span>
            <h3 className="text-2xl font-bold text-amber-300 font-serif mt-1">
              {selectedItem?.arabic}
            </h3>
            <p className="text-base font-medium text-slate-200">{trans}</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{meaning}</p>
          </div>

          {/* Sanoq maqsadi (33 / 99) */}
          <div className="flex gap-2 mb-6">
            {[33, 99, 100].map((target) => (
              <button
                key={target}
                onClick={() => setTargetCount(target)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  targetCount === target
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {target} ta
              </button>
            ))}
          </div>

          {/* Katta bosiladigan Tasbeh tugmasi */}
          <button
            onClick={handleIncrement}
            className="w-44 h-44 rounded-full bg-gradient-to-b from-amber-500 to-amber-600 active:scale-95 text-slate-950 font-extrabold flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 border-4 border-amber-300/30 transition-transform cursor-pointer select-none"
          >
            <span className="text-5xl tracking-tight">{count}</span>
            <span className="text-xs font-bold text-slate-900/80 mt-1">
              / {targetCount}
            </span>
          </button>

          {/* Qayta nolga tushirish (Reset) */}
          <div className="flex justify-between items-center w-full mt-6 px-2">
            <button
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition flex items-center gap-1"
            >
              🔄 Qayta boshlash
            </button>
            <span className="text-xs text-slate-500">
              {count >= targetCount ? '🎉 Yakunlandi!' : 'Bosish uchun tugmani bosing'}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}