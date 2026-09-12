import React, { useState, useEffect } from 'react';

export default function DailyStreakModal({ isOpen, onClose, learnedCount, totalCount }) {
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const currentStreak = parseInt(localStorage.getItem('userStreak') || '1', 10);
    const today = new Date().toDateString();

    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      const diffTime = Math.abs(new Date() - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Kecha kirgan, streak davom etadi
        if (lastVisit !== today) {
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          localStorage.setItem('userStreak', newStreak);
          localStorage.setItem('lastVisitDate', today);
        }
      } else if (diffDays > 1) {
        // Uzilib qolgan
        setStreak(1);
        localStorage.setItem('userStreak', 1);
        localStorage.setItem('lastVisitDate', today);
      }
    } else {
      localStorage.setItem('lastVisitDate', today);
      localStorage.setItem('userStreak', 1);
    }
  }, []);

  if (!isOpen) return null;

  const percentage = Math.round((learnedCount / totalCount) * 100) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold">✕</button>

        <div className="text-4xl mb-2">🔥</div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">{streak} Kun Ketma-ket!</h2>
        <p className="text-xs text-slate-400 mb-6 text-center">Har kuni kirib ismlarni yodlashda davom eting</p>

        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Yodlangan ismlar:</span>
            <span className="font-bold text-amber-400">{learnedCount} / {totalCount} ({percentage}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl text-center">
            <span className="text-xs text-slate-400 block">Joriy Streak</span>
            <span className="text-xl font-bold text-amber-300">{streak} kun</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl text-center">
            <span className="text-xs text-slate-400 block">Maqsad</span>
            <span className="text-xl font-bold text-emerald-400">99 ta Ism</span>
          </div>
        </div>
      </div>
    </div>
  );
}