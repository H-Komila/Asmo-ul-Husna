import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MatchGameModal({ isOpen, onClose, namesData, lang }) {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      startNewGame();
    }
  }, [isOpen]);

  const startNewGame = () => {
    // 6 ta random ismni tanlab olamiz
    const shuffledNames = [...namesData].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    const arabicCards = shuffledNames.map(item => ({
      id: `${item.id}-ar`,
      nameId: item.id,
      text: item.arabic,
      type: 'arabic'
    }));

    const meaningCards = shuffledNames.map(item => ({
      id: `${item.id}-mean`,
      nameId: item.id,
      text: item.transliteration || item.trans,
      type: 'meaning'
    }));

    const combined = [...arabicCards, ...meaningCards].sort(() => 0.5 - Math.random());
    setCards(combined);
    setSelectedCards([]);
    setMatchedIds([]);
    setScore(0);
  };

  const handleCardClick = (card) => {
    if (selectedCards.length === 2 || matchedIds.includes(card.nameId) || selectedCards.some(c => c.id === card.id)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].nameId === newSelected[1].nameId && newSelected[0].type !== newSelected[1].type) {
        setMatchedIds(prev => [...prev, newSelected[0].nameId]);
        setScore(prev => prev + 10);
        setSelectedCards([]);
      } else {
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold">✕</button>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-amber-400">🧩 Kartalarni Moslash O'yini</h2>
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-semibold">Ball: {score}</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {cards.map(card => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            const isMatched = matchedIds.includes(card.nameId);

            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card)}
                className={`h-24 rounded-xl border flex items-center justify-center p-2 text-center transition-all ${
                  isMatched
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 opacity-50 cursor-default'
                    : isSelected
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-500/50'
                }`}
              >
                <span className={card.type === 'arabic' ? 'text-2xl font-serif' : 'text-xs font-medium'}>
                  {card.text}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <button onClick={startNewGame} className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition text-xs font-semibold">
            Qayta boshlash 🔄
          </button>
          {matchedIds.length === 6 && (
            <p className="text-emerald-400 text-sm font-bold">Barakalla! Barchasini topdingiz! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}