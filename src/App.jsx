import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data importlari
import { namesData } from './data/namesData';
import { translations } from './data/translations';
import { duasData } from './data/duasData';
import { hadithsData } from './data/hadithsData';

// Komponentlar importi
import Navbar from './components/Navbar';
import PrayerTimesCard from './components/PrayerTimes';
import ProgressBar from './components/ProgressBar';
import NameCard from './components/NameCard';

// Modallar importi
import TasbehModal from './components/modals/TasbehModal';
import QuizModal from './components/modals/QuizModal';
import FlashcardModal from './components/modals/FlashcardModal';
import DuasModal from './components/modals/DuasModal';
import MatchGameModal from './components/modals/MatchGameModal';
import CardExportModal from './components/modals/CardExportModal';
import DailyStreakModal from './components/modals/DailyStreakModal';
import AudioSettingsModal from './components/modals/AudioSettingsModal';

import "./App.css";

export default function AsmaUlHusnaApp() {
  const [lang, setLang] = useState('uz');
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favNames')) || []);
  const [learnedNames, setLearnedNames] = useState(() => JSON.parse(localStorage.getItem('learnedNames')) || []);
  const [sortType, setSortType] = useState('default');
  const [isFavOnly, setIsFavOnly] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Audio & Speed
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const autoPlayIndex = useRef(0);
  const audioRef = useRef(new Audio());

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    localStorage.setItem('favNames', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('learnedNames', JSON.stringify(learnedNames));
  }, [learnedNames]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') setDeferredPrompt(null);
      });
    } else {
      alert("Ilovani brauzer menyusi orqali (+ Ekraningizga qo'shish) o'rnatishingiz mumkin.");
    }
  };

  const playAudio = (item) => {
    if (playingAudioId === item.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
      setIsAutoPlay(false);
    } else {
      audioRef.current.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${item.audio || String(item.id).padStart(3, '0')}.mp3`;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(() => {
        const utterance = new SpeechSynthesisUtterance(item.arabic);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
      });
      setPlayingAudioId(item.id);
      audioRef.current.onended = () => {
        if (isAutoPlay) playNextAutoPlay();
        else setPlayingAudioId(null);
      };
    }
  };

  const startAutoPlayAll = () => {
    if (isAutoPlay) {
      audioRef.current.pause();
      setIsAutoPlay(false);
      setPlayingAudioId(null);
    } else {
      setIsAutoPlay(true);
      autoPlayIndex.current = 0;
      playAudio(namesData[0]);
    }
  };

  const playNextAutoPlay = () => {
    if (autoPlayIndex.current < namesData.length - 1) {
      autoPlayIndex.current += 1;
      playAudio(namesData[autoPlayIndex.current]);
    } else {
      setIsAutoPlay(false);
      setPlayingAudioId(null);
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setSearchTerm(e.results[0][0].transcript);
    recognition.start();
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  const toggleLearned = (id) => {
    setLearnedNames(prev => prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]);
  };

  const openExportModal = (item) => {
    setSelectedItem(item);
    setActiveModal('exportCard');
  };

  const openTasbeh = (item = namesData[0]) => {
    setSelectedItem(item);
    setActiveModal('tasbeh');
  };

  let filteredData = namesData.filter(item => {
    const search = searchTerm ? searchTerm.toLowerCase().trim() : '';
    const transText = (item.transliteration || item.trans || '').toLowerCase();
    const meaningText = (typeof item.meaning === 'object' ? (item.meaning[lang] || '') : (item.meaning || '')).toLowerCase();
    
    const matchesSearch = transText.includes(search) ||
                          meaningText.includes(search) ||
                          String(item.id) === search;

    return isFavOnly ? matchesSearch && favorites.includes(item.id) : matchesSearch;
  });

  if (sortType === 'alphabet') {
    filteredData = [...filteredData].sort((a, b) => {
      const nameA = a.transliteration || a.trans || '';
      const nameB = b.transliteration || b.trans || '';
      return nameA.localeCompare(nameB);
    });
  } else if (sortType === 'learned') {
    filteredData = [...filteredData].filter(item => learnedNames.includes(item.id));
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-16 sm:pb-20 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      <Navbar
        isAutoPlay={isAutoPlay}
        startAutoPlayAll={startAutoPlayAll}
        t={t}
        setActiveModal={setActiveModal}
        openTasbeh={openTasbeh}
        namesData={namesData}
        setSelectedItem={setSelectedItem}
        isFavOnly={isFavOnly}
        setIsFavOnly={setIsFavOnly}
        favoritesCount={favorites.length}
        handleInstallPWA={handleInstallPWA}
        lang={lang}
        setLang={setLang}
        isDark={isDark}
        setIsDark={setIsDark}
        startQuiz={() => setActiveModal('quiz')}
      />

      {/* Tezkor Tugmalar paneli (Streak, Match, Audio Sozlama) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveModal('streak')}
          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold hover:bg-amber-500/20 transition flex items-center gap-1.5"
        >
          🔥 Streak & Statistika
        </button>

        <button
          onClick={() => setActiveModal('matchGame')}
          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold hover:bg-amber-500/20 transition flex items-center gap-1.5"
        >
          🧩 Moslash O'yini
        </button>

        <button
          onClick={() => setActiveModal('audioSettings')}
          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold hover:bg-amber-500/20 transition flex items-center gap-1.5"
        >
          ⚙️ Audio ({playbackRate}x)
        </button>
      </div>

      <PrayerTimesCard lang={lang} />

      <ProgressBar
        t={t}
        learnedCount={learnedNames.length}
        totalCount={namesData.length}
        sortType={sortType}
        setSortType={setSortType}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-slate-400 mt-1.5 sm:mt-2 text-xs sm:text-sm">{t.subtitle}</p>
          
          <div className="relative mt-4 sm:mt-6 max-w-xl mx-auto flex items-center">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 sm:px-6 py-3 sm:py-3.5 pr-12 rounded-full border border-amber-500/30 bg-slate-900/50 text-xs sm:text-sm text-inherit focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
            <button
              onClick={startVoiceSearch}
              className={`absolute right-3.5 sm:right-4 p-1.5 sm:p-2 rounded-full transition ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              🎤
            </button>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredData.map(item => (
              <div key={item.id} className="relative group">
                <NameCard
                  item={item}
                  lang={lang}
                  favorites={favorites}
                  learnedNames={learnedNames}
                  playingAudioId={playingAudioId}
                  toggleFavorite={toggleFavorite}
                  toggleLearned={toggleLearned}
                  playAudio={playAudio}
                  openTasbeh={openTasbeh}
                />
                <button
                  onClick={() => openExportModal(item)}
                  title="Rasm yuklab olish"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-slate-900/80 border border-amber-500/40 text-amber-400 p-1.5 rounded-lg text-xs hover:bg-amber-500 hover:text-slate-950"
                >
                  🖼️
                </button>
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Modallar */}
      <TasbehModal
        isOpen={activeModal === 'tasbeh'}
        onClose={() => setActiveModal(null)}
        selectedItem={selectedItem || namesData[0]}
        lang={lang}
      />

      <QuizModal
        isOpen={activeModal === 'quiz'}
        onClose={() => setActiveModal(null)}
        namesData={namesData}
        lang={lang}
      />

      <FlashcardModal
        isOpen={activeModal === 'flashcard'}
        onClose={() => setActiveModal(null)}
        namesData={namesData}
        lang={lang}
      />

      <DuasModal
        isOpen={activeModal === 'duas'}
        onClose={() => setActiveModal(null)}
        duasData={duasData}
        lang={lang}
      />

      <MatchGameModal
        isOpen={activeModal === 'matchGame'}
        onClose={() => setActiveModal(null)}
        namesData={namesData}
        lang={lang}
      />

      <CardExportModal
        isOpen={activeModal === 'exportCard'}
        onClose={() => setActiveModal(null)}
        selectedItem={selectedItem}
        lang={lang}
      />

      <DailyStreakModal
        isOpen={activeModal === 'streak'}
        onClose={() => setActiveModal(null)}
        learnedCount={learnedNames.length}
        totalCount={namesData.length}
      />

      <AudioSettingsModal
        isOpen={activeModal === 'audioSettings'}
        onClose={() => setActiveModal(null)}
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
      />
    </div>
  );
}