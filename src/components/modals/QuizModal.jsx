import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizModal({ isOpen, onClose, namesData, lang }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState([]);
  const [quizList, setQuizList] = useState([]);

  // Test savollarini tasodifiy hosil qilish
  useEffect(() => {
    if (isOpen && namesData && namesData.length > 0) {
      const shuffled = [...namesData].sort(() => 0.5 - Math.random());
      setQuizList(shuffled.slice(0, 10)); // 10 ta savol
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [isOpen, namesData]);

  // Har bir savol uchun variantlarni shakllantirish
  useEffect(() => {
    if (quizList.length > 0 && currentQuestionIndex < quizList.length) {
      const currentItem = quizList[currentQuestionIndex];
      const correctMeaning = typeof currentItem.meaning === 'object'
        ? currentItem.meaning[lang] || currentItem.meaning['uz']
        : currentItem.meaning;

      // Noto'g'ri variantlarni tanlash
      const otherMeanings = namesData
        .filter(item => item.id !== currentItem.id)
        .map(item => typeof item.meaning === 'object' ? item.meaning[lang] || item.meaning['uz'] : item.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // To'g'ri va noto'g'ri variantlarni aralashtirish
      const allOptions = [...otherMeanings, correctMeaning].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
    }
  }, [currentQuestionIndex, quizList, lang, namesData]);

  if (!isOpen || quizList.length === 0) return null;

  const currentItem = quizList[currentQuestionIndex];
  const correctMeaning = typeof currentItem?.meaning === 'object'
    ? currentItem.meaning[lang] || currentItem.meaning['uz']
    : currentItem?.meaning;

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === correctMeaning) {
      setScore(prev => prev + 1);
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
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl p-2 transition"
          >
            ✕
          </button>

          {!isFinished ? (
            <>
              {/* Header va Progress */}
              <div className="mb-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Viktorina — Savol {currentQuestionIndex + 1} / {quizList.length}
                </span>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quizList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Savol kartochkasi */}
              <div className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6 text-center mb-6">
                <h3 className="text-3xl font-bold text-amber-300 font-serif mb-2">
                  {currentItem?.arabic}
                </h3>
                <p className="text-xl font-medium text-slate-200">
                  {currentItem?.transliteration || currentItem?.trans}
                </p>
                <p className="text-xs text-slate-400 mt-2">Ushbu ismning to'g'ri ma'nosini toping:</p>
              </div>

              {/* Variantlar */}
              <div className="space-y-3">
                {options.map((option, idx) => {
                  let btnStyle = "bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500/50";
                  
                  if (isAnswered) {
                    if (option === correctMeaning) {
                      btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold";
                    } else if (option === selectedAnswer) {
                      btnStyle = "bg-rose-600/30 border-rose-500 text-rose-200";
                    } else {
                      btnStyle = "bg-slate-800/40 border-slate-800 text-slate-500 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && option === correctMeaning && <span>✓</span>}
                      {isAnswered && option === selectedAnswer && option !== correctMeaning && <span>✕</span>}
                    </button>
                  );
                })}
              </div>

              {/* Keyingi savolga o'tish tugmasi */}
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition active:scale-95 text-sm"
                >
                  {currentQuestionIndex + 1 === quizList.length ? "Natijani ko'rish" : "Keyingi savol →"}
                </button>
              )}
            </>
          ) : (
            /* Natija oynasi */
            <div className="text-center py-6 space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold text-amber-400">Test Yakunlandi!</h2>
              <p className="text-slate-300 text-sm">
                Siz <strong>{quizList.length}</strong> ta savoldan <strong>{score}</strong> tasiga to'g'ri javob berdingiz.
              </p>
              <div className="text-3xl font-extrabold text-amber-300 py-2">
                {Math.round((score / quizList.length) * 100)}%
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={restartQuiz}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition text-sm"
                >
                  Qayta urinish 🔄
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition text-sm"
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