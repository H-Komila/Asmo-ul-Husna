import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../data/translations';

export default function PrayerTimesCard({ lang }) {
  // State-lar
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [city, setCity] = useState(() => localStorage.getItem('prayer_city') || 'Tashkent');
  const [method, setMethod] = useState(() => localStorage.getItem('prayer_method') || '3');
  const [loading, setLoading] = useState(true);

  // Settings & Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => JSON.parse(localStorage.getItem('prayer_notify')) || false
  );
  const [soundEnabled, setSoundEnabled] = useState(
    () => JSON.parse(localStorage.getItem('prayer_sound')) || false
  );
  const [selectedAdhan, setSelectedAdhan] = useState(
    () => localStorage.getItem('prayer_adhan_voice') || 'makkah'
  );
  
  // Views & Modals
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'monthly' | 'qibla' | 'ramadan'
  const [showSettings, setShowSettings] = useState(false);

  // Timers & Active state
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [activePrayer, setActivePrayer] = useState('');
  const [qiblaDegree, setQiblaDegree] = useState(null);

  const t = translations[lang] || { prayerTitle: "Namoz Vaqtlari" };
  const audioRef = useRef(null);

  // Azon manbalari
  const adhanAudioSources = {
    makkah: "https://cdn.islamic.finder/azan/makkah.mp3",
    madinah: "https://cdn.islamic.finder/azan/madinah.mp3",
    egypt: "https://cdn.islamic.finder/azan/egypt.mp3"
  };

  const prayerNames = [
    { key: 'Fajr', name: 'Bamdod', icon: '🌅' },
    { key: 'Sunrise', name: 'Quyosh', icon: '☀️' },
    { key: 'Dhuhr', name: 'Peshin', icon: '🌤️' },
    { key: 'Asr', name: 'Asr', icon: '🕞' },
    { key: 'Maghrib', name: 'Shom', icon: '🌇' },
    { key: 'Isha', name: 'Xufton', icon: '🌙' },
  ];

  // 1. Bugungi va oylik vaqtlarni API va Offline kesh orqali olish
  useEffect(() => {
    setLoading(true);
    localStorage.setItem('prayer_city', city);
    localStorage.setItem('prayer_method', method);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Bugungi vaqtlar
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uzbekistan&method=${method}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setPrayerTimes(data.data.timings);
          setHijriDate(data.data.date.hijri);
          localStorage.setItem(`cache_today_${city}`, JSON.stringify(data.data));
        }
        setLoading(false);
      })
      .catch(() => {
        // Offline keshdan tiklash
        const cached = localStorage.getItem(`cache_today_${city}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setPrayerTimes(parsed.timings);
          setHijriDate(parsed.date.hijri);
        }
        setLoading(false);
      });

    // Oylik vaqtlar
    fetch(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=Uzbekistan&method=${method}&month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setMonthlyData(data.data);
      })
      .catch((err) => console.log('Oylik ma\'lumot xatosi:', err));

  }, [city, method]);

  // 2. Settings-ni saqlash
  useEffect(() => {
    localStorage.setItem('prayer_notify', JSON.stringify(notificationsEnabled));
    localStorage.setItem('prayer_sound', JSON.stringify(soundEnabled));
    localStorage.setItem('prayer_adhan_voice', selectedAdhan);
  }, [notificationsEnabled, soundEnabled, selectedAdhan]);

  // 3. Notification permission
  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert("Brauzeringiz bildirishnomalarni qo'llab-quvvatlamaydi!");
      return;
    }
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
    }
  };

  // 4. GPS & Qibla hisoblash
  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.data) {
                setPrayerTimes(data.data.timings);
                setHijriDate(data.data.date.hijri);
              }
              setLoading(false);
            });

          // Qibla burchagini olish
          fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.data) setQiblaDegree(data.data.direction);
            });
        },
        () => {
          alert("Joylashuvni aniqlashga ruxsat berilmadi.");
          setLoading(false);
        }
      );
    }
  };

  // 5. Taymer, Aktiv namoz va Bildirishnomalar
  useEffect(() => {
    if (!prayerTimes) return;

    const timer = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let upcoming = null;
      let currentActive = 'Isha';

      for (let i = 0; i < prayerNames.length; i++) {
        const pKey = prayerNames[i].key;
        const timeStr = prayerTimes[pKey];
        if (!timeStr) continue;

        const [h, m] = timeStr.split(':').map(Number);
        const prayerMinutes = h * 60 + m;

        if (prayerMinutes > currentMinutes) {
          upcoming = { ...prayerNames[i], minutes: prayerMinutes };
          currentActive = i > 0 ? prayerNames[i - 1].key : 'Isha';
          break;
        }
      }

      if (!upcoming) {
        const [h, m] = prayerTimes['Fajr'].split(':').map(Number);
        upcoming = { ...prayerNames[0], minutes: h * 60 + m + 24 * 60 };
        currentActive = 'Isha';
      }

      setActivePrayer(currentActive);
      setNextPrayer(upcoming);

      let diffMinutes = upcoming.minutes - currentMinutes;
      const targetTime = new Date();
      targetTime.setMinutes(targetTime.getMinutes() + diffMinutes);
      targetTime.setSeconds(0);

      const diffMs = targetTime - now;
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );

      // Vaqt kelganda bildirishnoma va Azon
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      prayerNames.forEach((item) => {
        if (prayerTimes[item.key] === currentTimeStr && now.getSeconds() === 0) {
          if (notificationsEnabled) {
            new Notification(`${item.name} vaqti bo'ldi! ${item.icon}`, {
              body: `${city} shahri uchun ${item.name} namozi vaqti kirdi.`,
            });
          }
          if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch((err) => console.log('Audio error:', err));
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, notificationsEnabled, soundEnabled, city]);

  // PDF / Chop etish
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 print:m-0 print:p-0">
      {/* Audio pleyer */}
      <audio ref={audioRef} src={adhanAudioSources[selectedAdhan]} preload="auto" />

      <div className="bg-slate-900/80 border border-amber-500/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100">
        
        {/* Yuqori Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">
              {t.prayerTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 justify-center md:justify-start">
              <span>{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {hijriDate && (
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  {hijriDate.day} {hijriDate.month.en} {hijriDate.year} H
                </span>
              )}
            </div>
          </div>

          {/* Menyu Tugmalari */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleGPSLocation}
              title="GPS orqali joylashuvni aniqlash"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-400 rounded-full transition"
            >
              📍
            </button>

            <button
              onClick={toggleNotifications}
              className={`text-xs px-3 py-2 rounded-full border transition ${
                notificationsEnabled ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-amber-500/40 text-slate-400'
              }`}
            >
              {notificationsEnabled ? '🔔 Bildirishnoma Yoqilgan' : '🔕 Bildirishnoma'}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`text-xs px-3 py-2 rounded-full border transition ${
                soundEnabled ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-800 border-amber-500/40 text-slate-400'
              }`}
            >
              {soundEnabled ? '🔊 Azon' : '🔇 Ovoz'}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-400 rounded-full transition"
              title="Sozlamalar"
            >
              ⚙️
            </button>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-slate-800 border border-amber-500/40 text-amber-400 text-xs sm:text-sm px-4 py-2 rounded-full focus:outline-none cursor-pointer"
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
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-amber-500/20 mb-6 gap-2 sm:gap-4 justify-center sm:justify-start print:hidden overflow-x-auto pb-2">
          {[
            { id: 'daily', label: 'Kunlik', icon: '🗓️' },
            { id: 'ramadan', label: 'Ramazon / Roʻza', icon: '🌙' },
            { id: 'monthly', label: 'Oylik Taqvim', icon: '📅' },
            { id: 'qibla', label: 'Qibla Kompasi', icon: '🧩' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal: Sozlamalar */}
        {showSettings && (
          <div className="mb-6 p-4 bg-slate-800/90 border border-amber-500/40 rounded-2xl print:hidden">
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center justify-between">
              <span>⚙️ Qoshimcha Sozlamalar</span>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Hisoblash Metodi:</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-amber-400"
                >
                  <option value="3">Muslim World League (MWL)</option>
                  <option value="13">Diyanet İşleri Başkanlığı</option>
                  <option value="2">ISNA (Shimoliy Amerika)</option>
                  <option value="5">Egyptian General Authority</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Azon Ovozini Tanlang:</label>
                <select
                  value={selectedAdhan}
                  onChange={(e) => setSelectedAdhan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-amber-400"
                >
                  <option value="makkah">Makka Azoni</option>
                  <option value="madinah">Madina Azoni</option>
                  <option value="egypt">Misr Azoni</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 1. KUNLIK KO'RINISH (DAILY VIEW) */}
        {activeTab === 'daily' && (
          <>
            {/* Next Prayer Countdown */}
            {nextPrayer && !loading && (
              <div className="mb-6 p-4 bg-slate-800/60 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{nextPrayer.icon}</span>
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Keyingi namoz vaqti</p>
                    <p className="text-lg font-bold text-amber-300">{nextPrayer.name}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xs text-slate-400">Qolgan vaqt</p>
                  <p className="text-2xl font-mono font-black text-amber-400 tracking-widest">{timeLeft}</p>
                </div>
              </div>
            )}

            {/* Namoz vaqtlari grid-i */}
            {loading ? (
              <div className="text-amber-400 text-xs animate-pulse py-8 text-center">Yuklanmoqda...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {prayerNames.map((item) => {
                  const isActive = activePrayer === item.key;
                  return (
                    <div
                      key={item.key}
                      className={`p-3 rounded-2xl flex flex-col items-center border transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-800/40 border-amber-500/15 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className={`text-xs font-medium ${isActive ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                        {item.name}
                      </span>
                      <span className={`text-base sm:text-lg font-extrabold mt-1 ${isActive ? 'text-yellow-200' : 'text-amber-400'}`}>
                        {prayerTimes ? prayerTimes[item.key] : '--:--'}
                      </span>
                      {isActive && (
                        <span className="mt-1 text-[9px] bg-amber-500/40 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                          Hozirgi
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Kunlik Oyat / Hadis Karti */}
            <div className="mt-6 p-4 bg-slate-800/40 border border-amber-500/20 rounded-2xl text-center">
              <span className="text-xs text-amber-400/80 font-bold tracking-wider uppercase">Kun Oyati</span>
              <p className="text-xs sm:text-sm text-slate-300 italic mt-1">
                «Albatta, namoz moʻminlarga vaqtida farz qilindi.» (Niso surasi, 103-oyat)
              </p>
            </div>
          </>
        )}

        {/* 2. RAMAZON / RO'ZA REJIMI */}
        {activeTab === 'ramadan' && prayerTimes && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Saharlik (Bamdodgacha)</p>
                  <p className="text-xl font-bold text-amber-300">{prayerTimes['Fajr']}</p>
                </div>
                <span className="text-3xl">🌙</span>
              </div>
              <div className="p-4 bg-slate-800/50 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Iftorlik (Shom vaqti)</p>
                  <p className="text-xl font-bold text-amber-300">{prayerTimes['Maghrib']}</p>
                </div>
                <span className="text-3xl">🌇</span>
              </div>
            </div>

            {/* Duolar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 mb-1">Saharlik (Ogʻiz yopish) duosi:</h4>
                <p className="text-xs text-slate-300 italic">
                  "Navaytu an asuma sovma shahri ramazona minal fajri ilal maghribi, kholisan lillahi ta'ala. Allohu akbar."
                </p>
              </div>
              <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 mb-1">Iftorlik (Ogʻiz ochish) duosi:</h4>
                <p className="text-xs text-slate-300 italic">
                  "Allohumma laka sumtu va bika aamantu va 'alayka tavakkaltu va 'ala rizqika aftartu..."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. OYLIK TAQVIM VIEW */}
        {activeTab === 'monthly' && (
          <div>
            <div className="flex justify-between items-center mb-4 print:hidden">
              <p className="text-xs text-slate-400">{city} boʻyicha oylik jadval</p>
              <button
                onClick={handlePrint}
                className="text-xs px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 transition"
              >
                🖨️ Chop etish / PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/30 text-amber-300">
                    <th className="p-2">Kun</th>
                    <th className="p-2">Bamdod</th>
                    <th className="p-2">Quyosh</th>
                    <th className="p-2">Peshin</th>
                    <th className="p-2">Asr</th>
                    <th className="p-2">Shom</th>
                    <th className="p-2">Xufton</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((dayData, index) => {
                    const isToday = new Date().getDate() === index + 1;
                    return (
                      <tr
                        key={index}
                        className={`border-b border-slate-800 ${
                          isToday ? 'bg-amber-500/20 font-bold text-amber-200' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="p-2">{dayData.date.gregorian.day}</td>
                        <td className="p-2">{dayData.timings.Fajr.split(' ')[0]}</td>
                        <td className="p-2">{dayData.timings.Sunrise.split(' ')[0]}</td>
                        <td className="p-2">{dayData.timings.Dhuhr.split(' ')[0]}</td>
                        <td className="p-2">{dayData.timings.Asr.split(' ')[0]}</td>
                        <td className="p-2">{dayData.timings.Maghrib.split(' ')[0]}</td>
                        <td className="p-2">{dayData.timings.Isha.split(' ')[0]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. QIBLA KOMPASI VIEW */}
        {activeTab === 'qibla' && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-amber-500/40 flex items-center justify-center bg-slate-800/50 shadow-inner">
              {/* Kompas ko'rsatgichi */}
              <div
                className="w-1 h-24 bg-gradient-to-t from-transparent to-amber-400 absolute transition-transform duration-700 rounded-full"
                style={{ transform: `rotate(${qiblaDegree || 240}deg)` }}
              >
                <div className="w-3 h-3 bg-amber-300 rounded-full -top-1 -left-1 absolute animate-ping" />
              </div>
              <span className="text-2xl font-bold text-amber-300">🕋</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              {qiblaDegree ? `Makkaga yo'nalish: ${Math.round(qiblaDegree)}°` : "GPS tugmasini bosib darajani aniqlang"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}