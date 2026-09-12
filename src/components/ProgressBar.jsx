import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ t, learnedCount, totalCount, sortType, setSortType }) {
  const progressPercentage = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
      <div className="bg-slate-900/50 border border-amber-500/20 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-[11px] sm:text-xs text-amber-400 font-bold mb-1">
            <span>{t.progressTitle}</span>
            <span>{learnedCount} / {totalCount} ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 sm:h-3 rounded-full overflow-hidden border border-amber-500/20">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-amber-500/30 text-[11px] sm:text-xs px-3 py-2 rounded-xl text-inherit focus:outline-none"
          >
            <option value="default">Tartib bo'yicha (1-99)</option>
            <option value="alphabet">Alifbo bo'yicha (A-Z)</option>
            <option value="learned">Faqat Yod olinganlar</option>
          </select>
        </div>
      </div>
    </div>
  );
}