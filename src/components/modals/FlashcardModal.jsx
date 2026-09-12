import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardModal({ isOpen, onClose, namesData, lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || !namesData || namesData.length === 0) return null;

  const currentItem = namesData[currentIndex];

  // Nom va ma'nolarni xavfsiz olish
  const trans = currentItem?.transliteration || currentItem?.trans || '';
  const meaning = typeof currentItem?.meaning === 'object' 
    ? currentItem?.meaning[lang] || currentItem?.meaning['uz'] 
    : currentItem?.meaning || '';

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % namesData.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + namesData.length) % namesData.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col items-center"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl p-2 transition"
          >
            ✕
          </button>

          {/* Sarlavha va Progress */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-amber-400">Flashcard — Yodlash</h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentIndex + 1} / {namesData.length}
            </p>
          </div>

          {/* Kartochka (Flip effekti) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-64 cursor-pointer perspective-1000 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 p-6 flex flex-col items-center justify-center text-center shadow-lg transform-style-3d hover:border-amber-500/50 transition"
            >
              {/* Old tomoni (Arabcha & Transliteratsiya) */}
              <div className={`space-y-4 ${isFlipped ? 'hidden' : 'block'}`}>
                <span className="text-amber-500 text-sm font-semibold">#{currentItem.id}</span>
                <h3 className="text-4xl font-bold text-amber-300 font-serif">{currentItem.arabic}</h3>
                <p className="text-xl font-medium text-slate-200">{trans}</p>
                <p className="text-xs text-slate-500 mt-4">💡 Ma'nosini ko'rish uchun bosing</p>
              </div>

              {/* Orqa tomoni (Ma'nosi) */}
              <div
                className={`space-y-3 ${isFlipped ? 'block' : 'hidden'}`}
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className="text-amber-400 text-xs uppercase tracking-wider">Ma'nosi</span>
                <p className="text-lg font-medium text-amber-100 leading-relaxed">{meaning}</p>
              </div>
            </motion.div>
          </div>

          {/* Boshqaruv tugmalari */}
          <div className="flex items-center justify-between w-full mt-6 gap-4">
            <button
              onClick={handlePrev}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition active:scale-95 text-sm"
            >
              ← Oldingisi
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition active:scale-95 text-sm"
            >
              Keyingisi →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}