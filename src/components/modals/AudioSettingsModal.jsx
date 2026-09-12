import React from 'react';

export default function AudioSettingsModal({ isOpen, onClose, playbackRate, setPlaybackRate }) {
  if (!isOpen) return null;

  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold">✕</button>

        <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">⚙️ Audio Sozlamalari</h3>

        <div className="mb-6">
          <label className="text-xs text-slate-400 block mb-2 font-medium">Ijro etish tezligi:</label>
          <div className="grid grid-cols-4 gap-2">
            {speeds.map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackRate(speed)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  playbackRate === speed
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/50'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="w-full py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 rounded-xl transition font-semibold text-xs">
          Saqlash va Yopish
        </button>
      </div>
    </div>
  );
}