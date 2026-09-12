import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HadithsModal({ isOpen, onClose, hadithsData = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  if (!isOpen) return null;

  const categories = ['Barchasi', 'Zikr', 'Dua', 'Istig\'for', 'Salovot'];

  const filteredHadiths = hadithsData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Barchasi' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trans.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (hadith) => {
    const textToCopy = `${hadith.title}\n\n${hadith.arabic}\n${hadith.trans}\n\nMa'nosi: ${hadith.meaning}\nManba: ${hadith.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (hadith) => {
    if ('speechSynthesis' in window) {
      if (speakingId === hadith.id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(hadith.trans);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      setSpeakingId(hadith.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl text-xl">
                📖
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Hadis va Hikmatlar
                </h2>
                <p className="text-xs text-slate-400">
                  Zikr va Allohning go'zal ismlari fazilatlari ({filteredHadiths.length} ta)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              ✕
            </button>
          </div>

          {/* Search & Filters */}
          <div className="py-3 space-y-2 border-b border-slate-800/80">
            <input
              type="text"
              placeholder="Hadislar ichidan qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition placeholder:text-slate-500"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Hadiths List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-amber-500/20">
            {filteredHadiths.length > 0 ? (
              filteredHadiths.map((hadith) => (
                <div
                  key={hadith.id}
                  className="p-4 sm:p-5 bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/40 rounded-2xl transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[11px] font-semibold">
                        #{hadith.id}
                      </span>
                      {hadith.tag && (
                        <span className="px-2 py-0.5 bg-slate-700/60 text-slate-300 rounded-md text-[10px]">
                          {hadith.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 italic">
                      {hadith.source}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-amber-300">
                    {hadith.title}
                  </h3>

                  {hadith.arabic && (
                    <p className="text-right text-lg sm:text-xl font-serif text-amber-100 leading-relaxed dir-rtl pt-1">
                      {hadith.arabic}
                    </p>
                  )}

                  {hadith.trans && (
                    <div className="flex items-center justify-between gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                      <p className="text-xs sm:text-sm text-slate-300 italic font-mono flex-1">
                        {hadith.trans}
                      </p>
                      <button
                        onClick={() => handleSpeak(hadith)}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          speakingId === hadith.id
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                        }`}
                        title="Ovozli eshitish"
                      >
                        🔊
                      </button>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {hadith.meaning}
                  </p>

                  <div className="flex items-center justify-end pt-2 border-t border-slate-800/50">
                    <button
                      onClick={() => handleCopy(hadith)}
                      className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-400 transition"
                    >
                      {copiedId === hadith.id ? (
                        <>
                          <span>✓</span> Nusxalandi!
                        </>
                      ) : (
                        <>
                          <span>📋</span> Nusxalash
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-10 text-sm">
                Qidiruv bo'yicha hadislar topilmadi.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Manba: Imom Buxoriy, Muslim, Termiziy rivoyatlari</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              Yopish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}