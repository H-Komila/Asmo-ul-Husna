import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HadithsModal({ isOpen, onClose, hadithsData }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Modal Sarlavhasi */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📖</span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Hadis va Hikmatlar
                </h2>
                <p className="text-xs text-slate-400">
                  Zikr va Allohning go'zal ismlari fazilatlari haqida
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

          {/* Hadislar Ro'yxati */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-amber-500/20">
            {hadithsData && hadithsData.length > 0 ? (
              hadithsData.map((hadith) => (
                <div
                  key={hadith.id}
                  className="p-4 sm:p-5 bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/40 rounded-2xl transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[11px] font-semibold">
                      #{hadith.id} Hikmat
                    </span>
                    <span className="text-xs text-slate-400 italic">
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
                    <p className="text-xs sm:text-sm text-slate-300 italic font-mono bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                      {hadith.trans}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {hadith.meaning}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-8 text-sm">
                Hadislar yuklanmadi.
              </p>
            )}
          </div>

          {/* Yopish tugmasi */}
          <div className="pt-3 border-t border-slate-800 text-right">
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