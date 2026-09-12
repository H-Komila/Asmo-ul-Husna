import React from 'react';

export default function TagFilter({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { id: 'all', label: 'Barchasi ✨' },
    { id: 'rahmat', label: "Rahmat & Mag'firat 🤲" },
    { id: 'qudrat', label: 'Qudrat & Buyuklik ⚡' },
    { id: 'rizq', label: 'Rizq & Baraka 🌾' },
    { id: 'ilm', label: 'Bilim & Hikmat 📖' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto my-4 px-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            selectedCategory === cat.id
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
              : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-amber-500/50 hover:text-amber-400'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}