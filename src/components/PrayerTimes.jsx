import React, { useState, useEffect } from 'react';
import { translations } from '../data/translations';

export default function PrayerTimesCard({ lang }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [city, setCity] = useState('Tashkent');
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uzbekistan&method=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setPrayerTimes(data.data.timings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  const prayerNames = [
    { key: 'Fajr', name: 'Bamdod', icon: '🌅' },
    { key: 'Sunrise', name: 'Quyosh', icon: '☀️' },
    { key: 'Dhuhr', name: 'Peshin', icon: '🌤️' },
    { key: 'Asr', name: 'Asr', icon: '🕞' },
    { key: 'Maghrib', name: 'Shom', icon: '🌇' },
    { key: 'Isha', name: 'Xufton', icon: '🌙' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
      <div className="bg-slate-900/60 border border-amber-500/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">
              {t.prayerTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <select
            value={city}
            onChange={(e) => { setLoading(true); setCity(e.target.value); }}
            className="w-full sm:w-auto bg-slate-800 border border-amber-500/40 text-amber-400 text-xs sm:text-sm px-4 py-2 rounded-full focus:outline-none cursor-pointer"
          >
            <option value="Tashkent">Toshkent</option>
            <option value="Samarkand">Samarqand</option>
            <option value="Bukhara">Buxoro</option>
            <option value="Andijan">Andijon</option>
            <option value="Namangan">Namangan</option>
            <option value="Fergana">Farg'ona</option>
            <option value="Khiva">Xiva</option>
            <option value="Nukus">Nukus</option>
          </select>
        </div>

        {loading ? (
          <div className="text-amber-400 text-xs sm:text-sm animate-pulse py-4">Yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {prayerNames.map((item) => (
              <div key={item.key} className="bg-slate-800/50 border border-amber-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center">
                <span className="text-lg sm:text-2xl mb-0.5 sm:mb-1">{item.icon}</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{item.name}</span>
                <span className="text-sm sm:text-lg font-extrabold text-amber-400 mt-0.5 sm:mt-1">
                  {prayerTimes ? prayerTimes[item.key] : '--:--'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}