import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from "../../hooks/useLocalStorage"; // <-- Import qo'shildi

export default function QuizModal({ isOpen, onClose, namesData, lang }) {
  const [highScore, setHighScore] = useLocalStorage('quiz_highscore', 0);
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage('quiz_sound_enabled', true); // <-- LocalStorage ga o'tkazildi

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);

  const audioCtxRef = useRef(null);

  // Audio effektlarni yaratish
  const playFeedbackSound = (isCorrect) => {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  // Arabcha ismni talaffuz qilish
  const speakArabic = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Testni shakllantirish
  useEffect(() => {
    if (isOpen && namesData && namesData.length > 0) {
      const shuffled = [...namesData].sort(() => 0.5 - Math.random());
      setQuizList(shuffled.slice(0, 10));
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    }
  }, [isOpen, namesData]);

  // Savol almashganda variantlar va taymerni yangilash
  useEffect(() => {
    if (quizList.length > 0 && currentQuestionIndex < quizList.length) {
      const currentItem = quizList[currentQuestionIndex];
      const correctMeaning = typeof currentItem.meaning === 'object'
        ? currentItem.meaning[lang] || currentItem.meaning['uz']
        : currentItem.meaning;

      const otherMeanings = namesData
        .filter(item => item.id !== currentItem.id)
        .map(item => typeof item.meaning === 'object' ? item.meaning[lang] || item.meaning['uz'] : item.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [...otherMeanings, correctMeaning].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setTimeLeft(15);
    }
  }, [currentQuestionIndex, quizList, lang, namesData]);

  // Taymer mantig'i
  useEffect(() => {
    if (!isOpen || isFinished || isAnswered || quizList.length === 0) return;

    if (timeLeft === 0) {
      setIsAnswered(true);
      playFeedbackSound(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished, isOpen, quizList]);

  // HighScore-ni yangilash mantig'i
  useEffect(() => {
    if (isFinished && score > highScore) {
      setHighScore(score);
    }
  }, [isFinished, score, highScore, setHighScore]);

  if (!isOpen || quizList.length === 0) return null;

  const currentItem = quizList[currentQuestionIndex];
  const correctMeaning = typeof currentItem?.meaning === 'object'
    ? currentItem.meaning[lang] || currentItem.meaning['uz']
    : currentItem?.meaning;

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === correctMeaning;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    playFeedbackSound(isCorrect);

    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? 50 : [50, 50, 50]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizList.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    const shuffled = [...namesData].sort(() => 0.5 - Math.random());
    setQuizList(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(15);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col"
        >
          {/* Yopish va Ovoz tugmalari */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2 text-xs rounded-full border transition ${
                isSoundEnabled
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {isSoundEnabled ? '🔔' : '🔕'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl p-2 transition"
          >
            ✕
          </button>

          {!isFinished ? (
            <>
              {/* Header va Progress Bar */}
              <div className="mt-4 mb-4 text-center">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Viktorina — {currentQuestionIndex + 1} / {quizList.length}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    timeLeft <= 5 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quizList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Savol Kartochkasi */}
              <div className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-5 text-center mb-4 relative group">
                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-3xl font-bold text-amber-300 font-serif">
                    {currentItem?.arabic}
                  </h3>
                  <button
                    onClick={() => speakArabic(currentItem?.arabic)}
                    className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                    title="Ovozli eshitish"
                  >
                    🗣️
                  </button>
                </div>
                <p className="text-lg font-medium text-slate-200 mt-1">
                  {currentItem?.transliteration || currentItem?.trans}
                </p>
                <p className="text-xs text-slate-400 mt-1">Ushbu ismning to'g'ri ma'nosini toping:</p>
              </div>

              {/* Variantlar */}
              <div className="space-y-2.5">
                {options.map((option, idx) => {
                  let btnStyle = "bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500/50";

                  if (isAnswered) {
                    if (option === correctMeaning) {
                      btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold";
                    } else if (option === selectedAnswer) {
                      btnStyle = "bg-rose-600/30 border-rose-500 text-rose-200";
                    } else {
                      btnStyle = "bg-slate-800/40 border-slate-800 text-slate-500 opacity-40";
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="pr-2">{option}</span>
                      {isAnswered && option === correctMeaning && <span className="text-emerald-400 font-bold">✓</span>}
                      {isAnswered && option === selectedAnswer && option !== correctMeaning && <span className="text-rose-400 font-bold">✕</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Keyingi Savol Tugmasi */}
              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNextQuestion}
                  className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold transition active:scale-95 text-sm shadow-lg shadow-amber-500/20"
                >
                  {currentQuestionIndex + 1 === quizList.length ? "Natijani ko'rish" : "Keyingi savol →"}
                </motion.button>
              )}
            </>
          ) : (
            /* Natija Oynasi */
            <div className="text-center py-6 space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-amber-400">Test Yakunlandi!</h2>
              <p className="text-slate-300 text-sm">
                Siz <strong>{quizList.length}</strong> ta savoldan <strong>{score}</strong> tasiga to'g'ri javob berdingiz.
              </p>
              
              {/* Natija va Eng yuqori ball (HighScore) */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 my-2 flex justify-around items-center">
                <div>
                  <span className="text-xs text-slate-400 block">Joriy Natija</span>
                  <span className="text-2xl font-extrabold text-amber-400">
                    {Math.round((score / quizList.length) * 100)}%
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-700" />
                <div>
                  <span className="text-xs text-slate-400 block">Eng Yuqori Rekord</span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {highScore} / {quizList.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={restartQuiz}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition text-sm shadow-md"
                >
                  Qayta urinish 🔄
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition text-sm border border-slate-700"
                >
                  Yopish
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}