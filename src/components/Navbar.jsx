import React from 'react';

export default function Navbar({
  isAutoPlay,
  startAutoPlayAll,
  t,
  setActiveModal,
  setFcIndex,
  setIsFlipped,
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
  startQuiz
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-amber-500/20 p-2.5 sm:p-4 flex justify-center flex-wrap gap-1.5 sm:gap-3">
      {/* Avto-tinglash */}
      <button 
        onClick={startAutoPlayAll} 
        className={`border px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
          isAutoPlay 
            ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold animate-pulse' 
            : 'bg-slate-800/80 border-amber-500/30 text-slate-200 hover:border-amber-500/60'
        }`}
      >
        {isAutoPlay ? t.stopAutoPlay : t.autoPlay}
      </button>

      {/* Test / Viktorina */}
      <button 
        onClick={startQuiz} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        {t.test}
      </button>

      {/* Flashcard */}
      <button 
        onClick={() => { 
          if (typeof setFcIndex === 'function') setFcIndex(0); 
          if (typeof setIsFlipped === 'function') setIsFlipped(false); 
          setActiveModal('flashcard'); 
        }} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        {t.flashcard}
      </button>

      {/* Tasbeh Modal */}
      <button 
        onClick={() => {
          if (typeof openTasbeh === 'function') {
            openTasbeh(namesData?.[0]);
          } else {
            if (namesData && namesData.length > 0) setSelectedItem(namesData[0]);
            setActiveModal('tasbeh');
          }
        }} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        {t.tasbeh}
      </button>

      {/* Duolar */}
      <button 
        onClick={() => setActiveModal('duas')} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        {t.duas}
      </button>

      {/* Tasodifiy Ism */}
      <button 
        onClick={() => { 
          if (namesData && namesData.length > 0) {
            setSelectedItem(namesData[Math.floor(Math.random() * namesData.length)]); 
          }
          setActiveModal('random'); 
        }} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        {t.random}
      </button>

      {/* Saralanganlar (Favorites) */}
      <button 
        onClick={() => setIsFavOnly(!isFavOnly)} 
        className={`border border-amber-500/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
          isFavOnly 
            ? 'bg-amber-500 text-slate-950 font-bold' 
            : 'bg-slate-800/80 text-slate-200 hover:border-amber-500/60'
        }`}
      >
        {t.favs} ({favoritesCount || 0})
      </button>

      {/* Hadislar */}
      <button 
        onClick={() => setActiveModal('hadiths')} 
        className="bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
      >
        📜 Hadislar
      </button>

      {/* PWA O'rnatish */}
      <button 
        onClick={handleInstallPWA} 
        className="bg-slate-800/80 border border-amber-500/30 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition hover:border-amber-500" 
        title="Ilovani o'rnatish"
      >
        📲
      </button>
      
      {/* Tillar selektori */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-slate-800 border border-amber-500/30 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-amber-400 focus:outline-none cursor-pointer"
      >
        <option value="uz">UZ</option>
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>

      {/* Dark/Light mode */}
      <button 
        onClick={() => setIsDark(!isDark)} 
        className="bg-slate-800/80 border border-amber-500/30 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition hover:border-amber-500"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}