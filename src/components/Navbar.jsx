import React from 'react';

export default function Navbar({
  isAutoPlay,
  startAutoPlayAll,
  t,
  setActiveModal,
  openTasbeh,
  namesData,
  setSelectedItem,
  isFavOnly,
  setIsFavOnly,
  favoritesCount,
  handleInstallPWA,
  lang,
  setLang,
  isDark,
  setIsDark,
  startQuiz,
}) {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/85 border-b border-slate-800/80 text-slate-100 px-3 sm:px-6 py-2.5 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Navigatsiya Menyulari */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={startAutoPlayAll}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              isAutoPlay
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-amber-500/20'
                : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800'
            }`}
            title="Barchasini ketma-ket tinglash"
          >
            <span>{isAutoPlay ? '⏸️' : '▶️'}</span>
            <span>{isAutoPlay ? "To'xtatish" : 'Ketma-ket tinglash'}</span>
          </button>

          <button
            onClick={() => openTasbeh(namesData[0])}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>📿</span>
            <span>Tasbeh</span>
          </button>

          <button
            onClick={() => setActiveModal('qibla')}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>🧭</span>
            <span>Qibla ko'rsatgich</span>
          </button>

          <button
            onClick={() => setActiveModal('hadiths')}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>📖</span>
            <span>Hadis va Hikmatlar</span>
          </button>

          <button
            onClick={startQuiz}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>🧠</span>
            <span>Bilimni sinash</span>
          </button>

          <button
            onClick={() => setActiveModal('flashcard')}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>🎴</span>
            <span>Eslab qolish kartalari</span>
          </button>

          <button
            onClick={() => setActiveModal('duas')}
            className="px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>🤲</span>
            <span>Muborak duolar</span>
          </button>

          <button
            onClick={() => setIsFavOnly(!isFavOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              isFavOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-rose-500/50 hover:text-rose-400 hover:bg-slate-800'
            }`}
          >
            <span>❤️</span>
            <span>Tanlanganlar</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded-full font-bold ml-0.5">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* O'ng taraf: Tillar & Sozlamalar */}
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm"
          >
            <option value="uz">🇺🇿 UZ</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ru">🇷🇺 RU</option>
          </select>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs hover:border-amber-500/50 transition shadow-sm"
            title="Mavzuni o'zgartirish"
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          <button
            onClick={handleInstallPWA}
            className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-semibold transition hidden sm:flex items-center gap-1 shadow-sm"
            title="Ilovani o'rnatish"
          >
            📲
          </button>
        </div>

      </div>
    </nav>
  );
}