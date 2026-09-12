import React from 'react';
import { motion } from 'framer-motion';

export default function NameCard({
  item,
  lang = 'uz',
  favorites,
  learnedNames,
  playingAudioId,
  toggleFavorite,
  toggleLearned,
  playAudio,
  openTasbeh,
  shareToSocial,
  copyText
}) {
  const isFav = favorites.includes(item.id);
  const isLearned = learnedNames.includes(item.id);
  const isPlaying = playingAudioId === item.id;

  // Transliteration va Meaningni xavfsiz o'qib olish
  const trans = item.transliteration || item.trans || '';
  const meaning = typeof item.meaning === 'object'
    ? (item.meaning[lang] || item.meaning['uz'] || '')
    : (item.meaning || '');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between border rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition shadow-lg hover:shadow-2xl hover:border-amber-500/60 ${
        isLearned ? 'bg-amber-950/20 border-amber-500/50' : 'bg-slate-900/40 border-slate-800'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-slate-800/80 border border-amber-500/30 text-[10px] sm:text-xs font-bold text-amber-400">
          {item.id}
        </span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => toggleFavorite(item.id)} className="text-base sm:text-lg hover:scale-125 transition">
            {isFav ? '❤️' : '🤍'}
          </button>
          <button
            onClick={() => toggleLearned(item.id)}
            className={`text-xs px-2 py-0.5 rounded-full border transition ${
              isLearned ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'border-slate-700 text-slate-400 hover:border-amber-500'
            }`}
          >
            {isLearned ? '✓ Yodlandi' : '+ Yod oldim'}
          </button>
        </div>
      </div>

      <div className="text-center my-2 sm:my-3">
        <h3 className="text-3xl sm:text-4xl font-serif text-amber-400 mb-2 leading-relaxed" dir="rtl">
          {item.arabic}
        </h3>
        <h4 className="text-base sm:text-lg font-bold text-slate-100">{trans}</h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">{meaning}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-3">
        {item.quran && (
          <span className="text-[10px] sm:text-xs text-amber-500/80 font-medium text-center">📍 {item.quran}</span>
        )}
        <div className="flex justify-around items-center pt-1">
          <button
            onClick={() => playAudio(item)}
            className={`p-2 rounded-full border transition ${
              isPlaying ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' : 'bg-slate-800/80 border-slate-700 hover:border-amber-500 text-amber-400'
            }`}
          >
            {isPlaying ? '⏸️' : '🔊'}
          </button>
          <button onClick={() => openTasbeh(item)} className="p-2 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 transition">
            📿
          </button>
          <button onClick={() => shareToSocial(item, 'telegram')} className="p-2 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 transition">
            ✈️
          </button>
          <button onClick={() => copyText(item)} className="p-2 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 transition">
            📋
          </button>
        </div>
      </div>
    </motion.div>
  );
}