import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage'; // <-- Import yo'li to'g'rilandi

export default function TasbehModal({ isOpen, onClose, selectedItem, lang }) {
  const [count, setCount] = useLocalStorage('tasbeh_count', 0);
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage('app_sound_enabled', true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useLocalStorage('app_voice_enabled', false);
  const [targetCount, setTargetCount] = useState(33); // <-- Etishmayotgan state qo'shildi

  const audioCtxRef = useRef(null);

  // Audio Context yaratish (Chertish ovozi uchun)
  const playClickSound = () => {
    if (!isSoundEnabled) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  // Ovozli talaffuz (Web Speech API)
  const speakArabic = (text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window) || !text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Modal ochilganda sanoqni va audio holatini sozlash
  useEffect(() => {
    if (isOpen) {
      setCount(0);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, selectedItem, setCount]);

  if (!isOpen || !selectedItem) return null;

  const trans = selectedItem?.transliteration || selectedItem?.trans || '';
  const meaning = typeof selectedItem?.meaning === 'object'
    ? selectedItem?.meaning[lang] || selectedItem?.meaning['uz']
    : selectedItem?.meaning || '';

  const handleIncrement = () => {
    playClickSound();

    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (isVoiceEnabled && selectedItem?.arabic) {
      speakArabic(selectedItem.arabic);
    }

    setCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === targetCount && navigator.vibrate) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col items-center"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl p-2 transition rounded-full"
          >
            ✕
          </button>

          {/* Ovoz sozlamalari (Tugmalar) */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title="Effekt ovozi"
              className={`p-2 text-xs rounded-full border transition ${
                isSoundEnabled
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {isSoundEnabled ? '🔔' : '🔕'}
            </button>
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              title="Arabcha qiroat"
              className={`p-2 text-xs rounded-full border transition ${
                isVoiceEnabled
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              🗣️
            </button>
          </div>

          {/* Sarlavha */}
          <div className="text-center mt-6 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Elektron Tasbeh
            </span>
            <h3 className="text-3xl font-bold text-amber-300 font-serif mt-3 tracking-wide">
              {selectedItem?.arabic}
            </h3>
            <p className="text-sm font-medium text-slate-200 mt-1">{trans}</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed px-2">
              {meaning}
            </p>
          </div>

          {/* Sanoq maqsadi (33 / 99 / 100) */}
          <div className="flex gap-2 mb-6">
            {[33, 99, 100].map((target) => (
              <button
                key={target}
                onClick={() => setTargetCount(target)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  targetCount === target
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {target} ta
              </button>
            ))}
          </div>

          {/* Katta tasbeh tugmasi */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleIncrement}
            className="w-44 h-44 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold flex flex-col items-center justify-center shadow-xl shadow-amber-500/25 border-4 border-amber-200/40 cursor-pointer select-none relative overflow-hidden group"
          >
            <motion.span
              key={count}
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl tracking-tight text-slate-950 drop-shadow-sm font-sans"
            >
              {count}
            </motion.span>
            <span className="text-xs font-bold text-slate-900/70 mt-1">
              / {targetCount}
            </span>
          </motion.button>

          {/* Qayta tiklash va Holat */}
          <div className="flex justify-between items-center w-full mt-6 px-2">
            <button
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-rose-500/10"
            >
              🔄 Qayta boshlash
            </button>
            <span className="text-xs text-slate-400 font-medium">
              {count >= targetCount ? (
                <span className="text-emerald-400 font-bold animate-pulse">
                  🎉 Yakunlandi!
                </span>
              ) : (
                'Bosish uchun tugmani bosing'
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}