import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duasData } from './duasData';
import { translations } from './translations';
import "./App.css";

// 99 TA ISMLAR BAZASI
const namesData = [
  { id: 1, arabic: "الله", trans: "Alloh", meaning: "Yagona va mutlaq ibodatga loyiq Zot.", quran: "Al-Fotiha surasi, 1-oyat", audio: "001" },
  { id: 2, arabic: "الرحمن", trans: "Ar-Rohman", meaning: "O'ta mehribon, barchaga rahm qiluvchi.", quran: "Ar-Rohman surasi, 1-oyat", audio: "002" },
  { id: 3, arabic: "الرحيم", trans: "Ar-Rohim", meaning: "Juda rahmli, faqat mo'minlarga rahm qiluvchi.", quran: "Al-Ahzob surasi, 43-oyat", audio: "003" },
  { id: 4, arabic: "الملك", trans: "Al-Malik", meaning: "Barcha narsaning haqiqiy egasi va podshohi.", quran: "Al-Hashr surasi, 23-oyat", audio: "004" },
  { id: 5, arabic: "القدوس", trans: "Al-Quddus", meaning: "Har qanday nuqson va ayblardan xoli, muqaddas.", quran: "Al-Jumu'a surasi, 1-oyat", audio: "005" },
  { id: 6, arabic: "السلام", trans: "As-Salam", meaning: "Tinchlik va omondorlik beruvchi.", quran: "Al-Hashr surasi, 23-oyat", audio: "006" },
  { id: 7, arabic: "المؤمن", trans: "Al-Mu'min", meaning: "Amonlik va imon beruvchi, va'dasiga vafodor.", quran: "Al-Hashr surasi, 23-oyat", audio: "007" },
  { id: 8, arabic: "المهيمن", trans: "Al-Muhaymin", meaning: "Hamma narsani kuzatib, hifzu himoyasida tutuvchi.", quran: "Al-Hashr surasi, 23-oyat", audio: "008" },
  { id: 9, arabic: "العزيز", trans: "Al-Aziz", meaning: "Barchadan ustun, yengilmas va qudratli.", quran: "Al-Baqara surasi, 209-oyat", audio: "009" },
  { id: 10, arabic: "الجبار", trans: "Al-Jabbor", meaning: "O'z hukmini o'tkazuvchi, kamchiliklarni tuzatuvchi.", quran: "Al-Hashr surasi, 23-oyat", audio: "010" },
  { id: 11, arabic: "المتكبر", trans: "Al-Mutakabbir", meaning: "Kattalik va ulug'lik o'ziga yarashgan Zot.", quran: "Al-Hashr surasi, 23-oyat", audio: "011" },
  { id: 12, arabic: "الخالق", trans: "Al-Xoliq", meaning: "Yo'qdan bor qiluvchi, o'lchov bilan yaratuvchi.", quran: "Al-Hashr surasi, 24-oyat", audio: "012" },
  { id: 13, arabic: "الباري", trans: "Al-Bari'", meaning: "Nuqsonsiz va mutanosib qilib yaratuvchi.", quran: "Al-Hashr surasi, 24-oyat", audio: "013" },
  { id: 14, arabic: "المصور", trans: "Al-Musavvir", meaning: "Maxluqlarga surat va shakl beruvchi.", quran: "Al-Hashr surasi, 24-oyat", audio: "014" },
  { id: 15, arabic: "الغفار", trans: "Al-G'affor", meaning: "Gunohlarni ko'p yashiruvchi va mag'firat qiluvchi.", quran: "Toh surasi, 82-oyat", audio: "015" },
  { id: 16, arabic: "القهار", trans: "Al-Qahhor", meaning: "Barcha maxluqlarni o'ziga bo'ysundiruvchi Qudratli.", quran: "Ar-Ro'd surasi, 16-oyat", audio: "016" },
  { id: 17, arabic: "الوهاب", trans: "Al-Vahhob", meaning: "Ne'matlarni tekinga, ko'p beruvchi.", quran: "Sod surasi, 9-oyat", audio: "017" },
  { id: 18, arabic: "الرزاق", trans: "Ar-Rozzoq", meaning: "Barcha rizqlarni yaratuvchi va yetkazib beruvchi.", quran: "Az-Zoriyot surasi, 58-oyat", audio: "018" },
  { id: 19, arabic: "الفتاح", trans: "Al-Fattah", meaning: "Hukm qiluvchi, rahmat eshiklarini ochuvchi.", quran: "Saba surasi, 26-oyat", audio: "019" },
  { id: 20, arabic: "العليم", trans: "Al-Alim", meaning: "Barcha narsani o'ta yaxshi biluvchi Olim.", quran: "Al-Baqara surasi, 158-oyat", audio: "020" },
  { id: 21, arabic: "القابض", trans: "Al-Qobid", meaning: "Rizqni qisqartiruvchi va ruhlarni oluvchi.", quran: "Al-Baqara surasi, 245-oyat", audio: "021" },
  { id: 22, arabic: "الباسط", trans: "Al-Basit", meaning: "Rizqni kengaytiruvchi va qalblarga surur beruvchi.", quran: "Al-Baqara surasi, 245-oyat", audio: "022" },
  { id: 23, arabic: "الخافض", trans: "Al-Xofid", meaning: "Kofirlar va zolimlarning obro'sini tushiruvchi.", quran: "Voqea surasi, 3-oyat", audio: "023" },
  { id: 24, arabic: "الرافع", trans: "Ar-Rofi'", meaning: "Mo'minlarning darajasini ko'taruvchi.", quran: "Al-An'om surasi, 83-oyat", audio: "024" },
  { id: 25, arabic: "المعز", trans: "Al-Mu'izz", meaning: "Izzat va obro' beruvchi.", quran: "Oli Imron surasi, 26-oyat", audio: "025" },
  { id: 26, arabic: "المذل", trans: "Al-Muzil", meaning: "Xohlagan kishisini xor qiluvchi.", quran: "Oli Imron surasi, 26-oyat", audio: "026" },
  { id: 27, arabic: "السميع", trans: "As-Sami'", meaning: "Barcha ovozlarni eshituvchi.", quran: "Al-Baqara surasi, 127-oyat", audio: "027" },
  { id: 28, arabic: "البصير", trans: "Al-Basir", meaning: "Barcha narsani ko'rib turuvchi.", quran: "Al-Hujurot surasi, 18-oyat", audio: "028" },
  { id: 29, arabic: "الحكم", trans: "Al-Hakam", meaning: "Adolat bilan hukm qiluvchi.", quran: "Al-An'om surasi, 114-oyat", audio: "029" },
  { id: 30, arabic: "العدل", trans: "Al-Adl", meaning: "Mutlaq adolat egasi.", quran: "Al-An'om surasi, 115-oyat", audio: "030" },
  { id: 31, arabic: "اللطيف", trans: "Al-Latif", meaning: "Lutf qiluvchi, nozik sirlarni biluvchi.", quran: "Al-Mulk surasi, 14-oyat", audio: "031" },
  { id: 32, arabic: "الخبير", trans: "Al-Xobir", meaning: "Barcha narsaning ichki siridan xabardor.", quran: "Al-An'om surasi, 18-oyat", audio: "032" },
  { id: 33, arabic: "الحليم", trans: "Al-Halim", meaning: "Jazolashga shoshilmaydigan, yumshoq tabiatli.", quran: "Al-Baqara surasi, 235-oyat", audio: "033" },
  { id: 34, arabic: "العظيم", trans: "Al-Azim", meaning: "Ulug'lik va azamat egasi.", quran: "Al-Baqara surasi, 255-oyat", audio: "034" },
  { id: 35, arabic: "الغفور", trans: "Al-G'ofur", meaning: "Ko'p mag'firat qiluvchi.", quran: "Al-Baqara surasi, 173-oyat", audio: "035" },
  { id: 36, arabic: "الشكور", trans: "Ash-Shakur", meaning: "Oz amalga ham ko'p savob beruvchi.", quran: "Fotir surasi, 30-oyat", audio: "036" },
  { id: 37, arabic: "العلي", trans: "Al-Aliy", meaning: "O'ta oliy maqomli, ulug'.", quran: "Al-Baqara surasi, 255-oyat", audio: "037" },
  { id: 38, arabic: "الكبير", trans: "Al-Kabir", meaning: "Har jihatdan ulug' va buyuk.", quran: "Ar-Ro'd surasi, 9-oyat", audio: "038" },
  { id: 39, arabic: "الحفيظ", trans: "Al-Hafiz", meaning: "Har narsani saqlovchi va muhofaza qiluvchi.", quran: "Hud surasi, 57-oyat", audio: "039" },
  { id: 40, arabic: "المقيت", trans: "Al-Muqit", meaning: "Barcha maxluqotning ozuqasini yetkazuvchi.", quran: "An-Niso surasi, 85-oyat", audio: "040" },
  { id: 41, arabic: "الحسيب", trans: "Al-Hasib", meaning: "Bandalarga yetarli bo'luvchi, hisob qiluvchi.", quran: "An-Niso surasi, 6-oyat", audio: "041" },
  { id: 42, arabic: "الجليل", trans: "Al-Jalil", meaning: "Ulug'vorlik va sifatlar egasi.", quran: "Ar-Rohman surasi, 27-oyat", audio: "042" },
  { id: 43, arabic: "الكريم", trans: "Al-Karim", meaning: "Juda saxiy, marhamatli va karamli.", quran: "An-Naml surasi, 40-oyat", audio: "043" },
  { id: 44, arabic: "الرقيب", trans: "Ar-Roqib", meaning: "Doimo kuzatib turuvchi.", quran: "An-Niso surasi, 1-oyat", audio: "044" },
  { id: 45, arabic: "المجيب", trans: "Al-Mujib", meaning: "Duo va iltimoslarni ijobat qiluvchi.", quran: "Hud surasi, 61-oyat", audio: "045" },
  { id: 46, arabic: "الواسع", trans: "Al-Vasi'", meaning: "Ilmi va rahmati keng.", quran: "Al-Baqara surasi, 268-oyat", audio: "046" },
  { id: 47, arabic: "الحكيم", trans: "Al-Hakim", meaning: "Hikmat egasi, har bir ishni hikmat bilan qiluvchi.", quran: "Al-Baqara surasi, 32-oyat", audio: "047" },
  { id: 48, arabic: "الودود", trans: "Al-Vadud", meaning: "Bandalarni sevuvchi va seviluvchi.", quran: "Hud surasi, 90-oyat", audio: "048" },
  { id: 49, arabic: "المجيد", trans: "Al-Majid", meaning: "Shon-shuhrati va ulug'ligi cheksiz.", quran: "Hud surasi, 73-oyat", audio: "049" },
  { id: 50, arabic: "الباعث", trans: "Al-Ba'is", meaning: "O'liklarni tiriltiruvchi va payg'ambarlar yuboruvchi.", quran: "Al-Haj surasi, 7-oyat", audio: "050" },
  { id: 51, arabic: "الشهيد", trans: "Ash-Shahid", meaning: "Har joyda hoziru nozir va guvoh.", quran: "Al-Moida surasi, 117-oyat", audio: "051" },
  { id: 52, arabic: "الحق", trans: "Al-Haqq", meaning: "Haqiqat va vujudga ega bo'lgan Zot.", quran: "Al-Haj surasi, 6-oyat", audio: "052" },
  { id: 53, arabic: "الوكيل", trans: "Al-Vakil", meaning: "Barchaning ishini o'z zimmasiga oluvchi.", quran: "Oli Imron surasi, 173-oyat", audio: "053" },
  { id: 54, arabic: "القوي", trans: "Al-Qaviy", meaning: "Cheksiz quvvat va qudrat egasi.", quran: "Al-Haj surasi, 40-oyat", audio: "054" },
  { id: 55, arabic: "المتين", trans: "Al-Matin", meaning: "Quvvati va matonati o'ta mustahkam.", quran: "Az-Zoriyot surasi, 58-oyat", audio: "055" },
  { id: 56, arabic: "الولي", trans: "Al-Valiy", meaning: "Mo'minlarning do'sti va homiysi.", quran: "Al-Baqara surasi, 257-oyat", audio: "056" },
  { id: 57, arabic: "الحميد", trans: "Al-Hamid", meaning: "Barcha maqtovlar o'ziga loyiq bo'lgan Zot.", quran: "Ibrohim surasi, 8-oyat", audio: "057" },
  { id: 58, arabic: "المحصي", trans: "Al-Muhsiy", meaning: "Barcha narsaning sonini birma-bir biluvchi.", quran: "Maryam surasi, 94-oyat", audio: "058" },
  { id: 59, arabic: "المبدئ", trans: "Al-Mubdi'", meaning: "Maxluqlarni avvaldan boshlab yaratuvchi.", quran: "Al-Buruj surasi, 13-oyat", audio: "059" },
  { id: 60, arabic: "المعيد", trans: "Al-Mu'id", meaning: "O'lganlarni qaytadan tiriltiruvchi.", quran: "Al-Buruj surasi, 13-oyat", audio: "060" },
  { id: 61, arabic: "المحيي", trans: "Al-Muhyi", meaning: "Hayot beruvchi, hayot baxsh etuvchi.", quran: "Ar-Rum surasi, 50-oyat", audio: "061" },
  { id: 62, arabic: "المميت", trans: "Al-Mumit", meaning: "O'lim beruvchi, jon oluvchi.", quran: "Oli Imron surasi, 156-oyat", audio: "062" },
  { id: 63, arabic: "الحي", trans: "Al-Hayy", meaning: "Abadiy tirik, o'lmaydigan Zot.", quran: "Al-Baqara surasi, 255-oyat", audio: "063" },
  { id: 64, arabic: "القيوم", trans: "Al-Qayyum", meaning: "O'zi turguvchi va barchani turg'azuvchi.", quran: "Al-Baqara surasi, 255-oyat", audio: "064" },
  { id: 65, arabic: "الواجد", trans: "Al-Vajid", meaning: "Xohlagan narsasini topuvchi, muhtoj bo'lmagan.", quran: "Ad-Duho surasi, 7-oyat", audio: "065" },
  { id: 66, arabic: "الماجد", trans: "Al-Majid", meaning: "Oliy sharaf va ulug'lik egasi.", quran: "Hud surasi, 73-oyat", audio: "066" },
  { id: 67, arabic: "الواحد", trans: "Al-Vohid", meaning: "Yagona, sherigi yo'q Zot.", quran: "Al-Baqara surasi, 163-oyat", audio: "067" },
  { id: 68, arabic: "الصمد", trans: "As-Somad", meaning: "Hamma unga muhtoj, o'zi hech kimga muhtoj emas.", quran: "Al-Ixlos surasi, 2-oyat", audio: "068" },
  { id: 69, arabic: "القادر", trans: "Al-Qodir", meaning: "Har bir narsaga qodir Zot.", quran: "Al-An'om surasi, 65-oyat", audio: "069" },
  { id: 70, arabic: "المقتدر", trans: "Al-Muqtadir", meaning: "Cheksiz qudrat egasi, o'ta qudratli.", quran: "Al-Qamar surasi, 42-oyat", audio: "070" },
  { id: 71, arabic: "المقدم", trans: "Al-Muqaddim", meaning: "Xohlagan narsasini oldinga suruvchi.", quran: "Qof surasi, 28-oyat", audio: "071" },
  { id: 72, arabic: "المؤخر", trans: "Al-Mu'axxir", meaning: "Xohlagan narsasini orqaga suruvchi.", quran: "Nuh surasi, 4-oyat", audio: "072" },
  { id: 73, arabic: "الأول", trans: "Al-Avval", meaning: "Barchadan avval mavjud bo'lgan.", quran: "Al-Hadid surasi, 3-oyat", audio: "073" },
  { id: 74, arabic: "الآخر", trans: "Al-Axir", meaning: "Barchadan keyin ham abadiy qoluvchi.", quran: "Al-Hadid surasi, 3-oyat", audio: "074" },
  { id: 75, arabic: "الظاهر", trans: "Az-Zohir", meaning: "Borligi ochiq-oydin ko'rinib turguvchi.", quran: "Al-Hadid surasi, 3-oyat", audio: "075" },
  { id: 76, arabic: "الباطن", trans: "Al-Botin", meaning: "Ko'zlardan pinhona, sirlarni biluvchi.", quran: "Al-Hadid surasi, 3-oyat", audio: "076" },
  { id: 77, arabic: "الوالي", trans: "Al-Valiy", meaning: "Barcha koinotni boshqarib turguvchi.", quran: "Ar-Ro'd surasi, 11-oyat", audio: "077" },
  { id: 78, arabic: "المتعالي", trans: "Al-Muta'aliy", meaning: "Maxluqlarning sifatidan juda oliy va pok.", quran: "Ar-Ro'd surasi, 9-oyat", audio: "078" },
  { id: 79, arabic: "البر", trans: "Al-Barr", meaning: "Bandalariga yaxshilik va ehson qiluvchi.", quran: "Tur surasi, 28-oyat", audio: "079" },
  { id: 80, arabic: "التواب", trans: "At-Tavvob", meaning: "Tavbalarni ko'plab qabul etuvchi.", quran: "Al-Baqara surasi, 128-oyat", audio: "080" },
  { id: 81, arabic: "المنتقم", trans: "Al-Muntaqim", meaning: "Zolimlardan qasos oluvchi, jazolovchi.", quran: "As-Sajda surasi, 22-oyat", audio: "081" },
  { id: 82, arabic: "العفو", trans: "Al-Afuvv", meaning: "Gunohlarni kechirib yuboruvchi, afv etuvchi.", quran: "An-Niso surasi, 99-oyat", audio: "082" },
  { id: 83, arabic: "الرؤوف", trans: "Ar-Ro'uf", meaning: "O'ta shafqatli va mehribon.", quran: "Oli Imron surasi, 30-oyat", audio: "083" },
  { id: 84, arabic: "مالك الملك", trans: "Malik-ul-Mulk", meaning: "Mulkning haqiqiy va mutlaq egasi.", quran: "Oli Imron surasi, 26-oyat", audio: "084" },
  { id: 85, arabic: "ذو الجلال والإكرام", trans: "Zul-Jaloli val-Ikrom", meaning: "Ulug'lik va karam egasi.", quran: "Ar-Rohman surasi, 27-oyat", audio: "085" },
  { id: 86, arabic: "المقسط", trans: "Al-Muqsit", meaning: "Adolat bilan xolis hukm qiluvchi.", quran: "Oli Imron surasi, 18-oyat", audio: "086" },
  { id: 87, arabic: "الجامع", trans: "Al-Jami'", meaning: "Qiyomat kuni barchani jamlovchi.", quran: "Oli Imron surasi, 9-oyat", audio: "087" },
  { id: 88, arabic: "الغني", trans: "Al-G'aniy", meaning: "Behojat, hech nimaga muhtoj bo'lmagan Boy.", quran: "Fatir surasi, 15-oyat", audio: "088" },
  { id: 89, arabic: "المغني", trans: "Al-Mug'niy", meaning: "Bandalarini behojat va boy qiluvchi.", quran: "An-Najm surasi, 48-oyat", audio: "089" },
  { id: 90, arabic: "المانع", trans: "Al-Mani'", meaning: "Ziyon yetkazuvchi narsalarni man qiluvchi.", quran: "An-Naba surasi, 1-oyat", audio: "090" },
  { id: 91, arabic: "الضار", trans: "Ad-Dorr", meaning: "Ziyon yetkazuvchi (sinov uchun).", quran: "Al-An'om surasi, 17-oyat", audio: "091" },
  { id: 92, arabic: "النافع", trans: "An-Nafi'", meaning: "Manfaat va foyda keltiruvchi.", quran: "Al-An'om surasi, 17-oyat", audio: "092" },
  { id: 93, arabic: "النور", trans: "An-Nur", meaning: "Koinotni yorituvchi, Nur beruvchi.", quran: "Nur surasi, 35-oyat", audio: "093" },
  { id: 94, arabic: "الهادي", trans: "Al-Hadiy", meaning: "To'g'ri yo'lga boshlovchi Hidoyat beruvchi.", quran: "Al-Haj surasi, 54-oyat", audio: "094" },
  { id: 95, arabic: "البديع", trans: "Al-Badi'", meaning: "O'xshashi yo'q ajoyib narsalarni yaratuvchi.", quran: "Al-Baqara surasi, 117-oyat", audio: "095" },
  { id: 96, arabic: "الباقي", trans: "Al-Baqiy", meaning: "Abadiy qoluvchi, yo'q bo'lmaydigan Zot.", quran: "Ar-Rohman surasi, 27-oyat", audio: "096" },
  { id: 97, arabic: "الوارث", trans: "Al-Voris", meaning: "Barcha narsa yo'q bo'lganda qoluvchi Merosxo'r.", quran: "Al-Haj surasi, 23-oyat", audio: "097" },
  { id: 98, arabic: "الرشيد", trans: "Ar-Rashid", meaning: "To'g'ri yo'lga boshlovchi, hikmatli.", quran: "Hud surasi, 87-oyat", audio: "098" },
  { id: 99, arabic: "الصبور", trans: "As-Sobur", meaning: "Juda sabrli, jazolashga shoshilmaydigan.", quran: "Al-Baqara surasi, 153-oyat", audio: "099" }
];

// NAMOZ VAQTLARI
function PrayerTimesCard({ lang }) {
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
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-slate-900/60 border border-amber-500/30 backdrop-blur-md rounded-3xl p-6 text-center shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">
              {t.prayerTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <select
            value={city}
            onChange={(e) => { setLoading(true); setCity(e.target.value); }}
            className="bg-slate-800 border border-amber-500/40 text-amber-400 text-sm px-4 py-2 rounded-full focus:outline-none cursor-pointer"
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
          <div className="text-amber-400 text-sm animate-pulse py-4">Yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {prayerNames.map((item) => (
              <div key={item.key} className="bg-slate-800/50 border border-amber-500/20 p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs text-slate-400 font-medium">{item.name}</span>
                <span className="text-lg font-extrabold text-amber-400 mt-1">
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

export default function AsmaUlHusnaApp() {
  const [lang, setLang] = useState('uz');
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favNames')) || []);
  const [learnedNames, setLearnedNames] = useState(() => JSON.parse(localStorage.getItem('learnedNames')) || []);
  const [sortType, setSortType] = useState('default');
  const [isFavOnly, setIsFavOnly] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Audio va Auto-Play state
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const autoPlayIndex = useRef(0);
  const audioRef = useRef(new Audio());

  // Ovozli qidiruv
  const [isListening, setIsListening] = useState(false);

  // Modallar
  const [activeModal, setActiveModal] = useState(null); // 'tasbeh' | 'quran' | 'quiz' | 'flashcard' | 'random' | 'poster' | 'duas'
  const [selectedItem, setSelectedItem] = useState(null);

  // Tasbeh state
  const [tasbehCount, setTasbehCount] = useState(0);
  const [tasbehTarget, setTasbehTarget] = useState(33);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState(null);

  // Flashcard state
  const [fcIndex, setFcIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    localStorage.setItem('favNames', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('learnedNames', JSON.stringify(learnedNames));
  }, [learnedNames]);

  // PWA o'rnatish hodisasini tutib olish
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
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      alert("Ilovani brauzer menyusi orqali (+ Ekraningizga qo'shish) o'rnatishingiz mumkin.");
    }
  };

  // Audio pleyer & Auto-Play mantiqi
  const playAudio = (item) => {
    if (playingAudioId === item.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
      setIsAutoPlay(false);
    } else {
      audioRef.current.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${item.audio}.mp3`;
      audioRef.current.play().catch(() => {
        const utterance = new SpeechSynthesisUtterance(item.arabic);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
      });
      setPlayingAudioId(item.id);
      audioRef.current.onended = () => {
        if (isAutoPlay) {
          playNextAutoPlay();
        } else {
          setPlayingAudioId(null);
        }
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

  const shareToSocial = (item, platform) => {
    const text = encodeURIComponent(`✨ Asmoul Husno: ${item.trans} (${item.arabic})\n📖 Ma'nosi: ${item.meaning}\n📍 ${item.quran}`);
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${window.location.href}&text=${text}`);
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`);
    }
  };

  const copyText = (item) => {
    const text = `✨ Asmoul Husno: ${item.trans} (${item.arabic})\n📖 Ma'nosi: ${item.meaning}\n📍 ${item.quran}`;
    navigator.clipboard.writeText(text);
    alert("Nusxalandi!");
  };

  const openTasbeh = (item = namesData[0]) => {
    setSelectedItem(item);
    setTasbehCount(0);
    setActiveModal('tasbeh');
  };

  const handleTasbehClick = () => {
    const nextCount = tasbehCount + 1;
    setTasbehCount(nextCount);
    if (nextCount === tasbehTarget) {
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      alert(`MashaAlloh! ${tasbehTarget} ta zikr yakunlandi.`);
    }
  };

  const generateQuiz = () => {
    const current = namesData[Math.floor(Math.random() * namesData.length)];
    const options = [current];
    while (options.length < 4) {
      const rand = namesData[Math.floor(Math.random() * namesData.length)];
      if (!options.some(opt => opt.id === rand.id)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);
    setQuizQuestion({ current, options });
  };

  const startQuiz = () => {
    setQuizScore(0);
    generateQuiz();
    setActiveModal('quiz');
  };

  let filteredData = namesData.filter(item => {
    const matchesSearch = item.trans.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(item.id) === searchTerm;
    return isFavOnly ? matchesSearch && favorites.includes(item.id) : matchesSearch;
  });

  if (sortType === 'alphabet') {
    filteredData = [...filteredData].sort((a, b) => a.trans.localeCompare(b.trans));
  } else if (sortType === 'learned') {
    filteredData = [...filteredData].filter(item => learnedNames.includes(item.id));
  }

  const progressPercentage = Math.round((learnedNames.length / namesData.length) * 100);

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/60 border-b border-amber-500/20 p-4 flex justify-center flex-wrap gap-2 sm:gap-3">
        <button onClick={startAutoPlayAll} className={`border px-4 py-2 rounded-full text-sm font-medium transition ${isAutoPlay ? 'bg-amber-500 text-black border-amber-500 font-bold animate-pulse' : 'bg-slate-800/80 border-amber-500/30'}`}>
          {isAutoPlay ? t.stopAutoPlay : t.autoPlay}
        </button>
        <button onClick={() => startQuiz()} className="bg-slate-800/80 hover:bg-amber-500 hover:text-black border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition">
          {t.test}
        </button>
        <button onClick={() => { setFcIndex(0); setIsFlipped(false); setActiveModal('flashcard'); }} className="bg-slate-800/80 hover:bg-amber-500 hover:text-black border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition">
          {t.flashcard}
        </button>
        <button onClick={() => openTasbeh()} className="bg-slate-800/80 hover:bg-amber-500 hover:text-black border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition">
          {t.tasbeh}
        </button>
        <button onClick={() => setActiveModal('duas')} className="bg-slate-800/80 hover:bg-amber-500 hover:text-black border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition">
          {t.duas}
        </button>
        <button onClick={() => { setSelectedItem(namesData[Math.floor(Math.random() * namesData.length)]); setActiveModal('random'); }} className="bg-slate-800/80 hover:bg-amber-500 hover:text-black border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition">
          {t.random}
        </button>
        <button onClick={() => setIsFavOnly(!isFavOnly)} className={`border border-amber-500/30 px-4 py-2 rounded-full text-sm font-medium transition ${isFavOnly ? 'bg-amber-500 text-black' : 'bg-slate-800/80'}`}>
          {t.favs} ({favorites.length})
        </button>
        <button onClick={handleInstallPWA} className="bg-slate-800/80 border border-amber-500/30 px-3 py-2 rounded-full text-sm transition" title="Ilovani o'rnatish">
          📲
        </button>
        
        {/* Tilni almashtirish */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-slate-800 border border-amber-500/30 text-xs px-3 py-2 rounded-full text-amber-400 focus:outline-none cursor-pointer"
        >
          <option value="uz">UZ</option>
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>

        <button onClick={() => setIsDark(!isDark)} className="bg-slate-800/80 border border-amber-500/30 px-3 py-2 rounded-full text-sm transition">
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Namoz vaqtlari */}
      <PrayerTimesCard lang={lang} />

      {/* Progress Bar Section */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-slate-900/50 border border-amber-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-xs text-amber-400 font-bold mb-1">
              <span>{t.progressTitle}</span>
              <span>{learnedNames.length} / 99 ({progressPercentage}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-amber-500/20">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-slate-800 border border-amber-500/30 text-xs px-3 py-2 rounded-xl text-inherit focus:outline-none"
            >
              <option value="default">Tartib bo'yicha (1-99)</option>
              <option value="alphabet">Alifbo bo'yicha (A-Z)</option>
              <option value="learned">Faqat Yod olinganlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">{t.subtitle}</p>
          
          <div className="relative mt-6 max-w-xl mx-auto flex items-center">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3.5 pr-12 rounded-full border border-amber-500/30 bg-slate-900/50 text-inherit focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
            <button
              onClick={startVoiceSearch}
              className={`absolute right-4 p-2 rounded-full transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-amber-400'}`}
              title="Ovozli qidiruv"
            >
              🎤
            </button>
          </div>
        </div>

        {/* Card Grid with Framer Motion */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredData.map(item => {
              const isFav = favorites.includes(item.id);
              const isLearned = learnedNames.includes(item.id);
              const isPlaying = playingAudioId === item.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className={`relative group bg-slate-900/40 border backdrop-blur-md rounded-3xl p-6 text-center flex flex-col justify-between hover:-translate-y-1 transition duration-300 shadow-lg ${isLearned ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-amber-500/20 hover:border-amber-500/60'}`}
                >
                  <span className="absolute top-4 left-5 text-xs font-bold opacity-60">#{item.id}</span>
                  <button
                    onClick={() => toggleLearned(item.id)}
                    className={`absolute top-4 right-5 text-xs px-2.5 py-1 rounded-full border transition ${isLearned ? 'bg-emerald-500 text-black border-emerald-500 font-bold' : 'border-slate-700 text-slate-500 hover:border-amber-500'}`}
                  >
                    {isLearned ? `✓ ${t.learned}` : t.addLearned}
                  </button>

                  <div className="my-4">
                    <h2 className="text-4xl font-serif text-amber-400 mb-2" dir="rtl">{item.arabic}</h2>
                    <h3 className="text-xl font-bold">{item.trans}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.meaning}</p>
                  </div>

                  <div className="flex justify-center flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/60">
                    <button onClick={() => playAudio(item)} className={`w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center transition ${isPlaying ? 'bg-amber-500 text-black animate-pulse' : 'hover:bg-amber-500 hover:text-black'}`} title="Eshitish">
                      {isPlaying ? '⏸' : '🔊'}
                    </button>
                    <button onClick={() => toggleFavorite(item.id)} className={`w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center transition ${isFav ? 'bg-red-500/20 border-red-500 text-red-500' : 'hover:bg-amber-500 hover:text-black'}`} title="Saralash">⭐</button>
                    <button onClick={() => { setSelectedItem(item); setActiveModal('quran'); }} className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-black transition" title="Qur'ondagi o'rni">📖</button>
                    <button onClick={() => openTasbeh(item)} className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-black transition" title="Tasbeh">📿</button>
                    <button onClick={() => { setSelectedItem(item); setActiveModal('poster'); }} className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-black transition" title="Poster yaratish">🖼</button>
                    <button onClick={() => copyText(item)} className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-black transition" title="Nusxalash">📋</button>
                    <button onClick={() => shareToSocial(item, 'telegram')} className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center hover:bg-blue-500 hover:text-white transition" title="Telegramda ulashish">✈️</button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Modals Container */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-center shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-5 text-2xl text-slate-400 hover:text-white">✕</button>

              {/* Poster Modal */}
              {activeModal === 'poster' && selectedItem && (
                <div>
                  <h3 className="text-lg font-bold mb-4">{t.downloadPoster}</h3>
                  <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-2 border-amber-500 p-8 rounded-2xl text-center shadow-2xl my-4">
                    <span className="text-amber-400 text-xs font-bold block mb-2"># {selectedItem.id} - Asmaul Husna</span>
                    <h2 className="text-5xl font-serif text-amber-300 my-4" dir="rtl">{selectedItem.arabic}</h2>
                    <h3 className="text-2xl font-extrabold text-white">{selectedItem.trans}</h3>
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">{selectedItem.meaning}</p>
                    <p className="text-[10px] text-amber-500/60 mt-4 border-t border-amber-500/20 pt-2">{selectedItem.quran}</p>
                  </div>
                  <p className="text-xs text-slate-400">Ushbu chiroyli kartochkani skrinshot qilib saqlab olishingiz mumkin!</p>
                </div>
              )}

              {/* Duas Modal */}
              {activeModal === 'duas' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">🤲 Ismlarga Bog'liq Duolar</h3>
                  <div className="flex flex-col gap-4 text-left">
                    {duasData.map(d => (
                      <div key={d.id} className="bg-slate-800/60 border border-amber-500/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm mb-1">{d.title}</h4>
                        <p className="text-xl font-serif text-right text-amber-200 my-2" dir="rtl">{d.arabic}</p>
                        <p className="text-xs text-slate-300 italic mb-1">{d.trans}</p>
                        <p className="text-xs text-slate-400">{d.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasbeh Modal */}
              {activeModal === 'tasbeh' && selectedItem && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{selectedItem.trans} ({selectedItem.arabic})</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    {[33, 99, 100].map(t => (
                      <button key={t} onClick={() => { setTasbehTarget(t); setTasbehCount(0); }} className={`px-3 py-1 rounded-lg border text-sm ${tasbehTarget === t ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-amber-500/30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="text-5xl font-extrabold text-amber-400 my-6">{tasbehCount} / {tasbehTarget}</div>
                  <button onClick={handleTasbehClick} className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg shadow-lg active:scale-95 transition">
                    Zikr qilish
                  </button>
                  <button onClick={() => setTasbehCount(0)} className="mt-4 px-4 py-2 border border-amber-500/30 rounded-full text-xs text-slate-400 hover:text-white">
                    Qayta boshlash
                  </button>
                </div>
              )}

              {/* Quran Verse Modal */}
              {activeModal === 'quran' && selectedItem && (
                <div>
                  <h3 className="text-xl font-bold mb-3">{selectedItem.trans} - Qur'ondagi o'rni</h3>
                  <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-amber-500/20 my-4 text-sm leading-relaxed">{selectedItem.quran}</p>
                </div>
              )}

              {/* Quiz Modal */}
              {activeModal === 'quiz' && quizQuestion && (
                <div>
                  <div className="text-sm text-amber-400 font-bold mb-2">To'plangan ball: {quizScore}</div>
                  <h3 className="text-lg font-bold mb-4">"{quizQuestion.current.trans}" ismining ma'nosi nima?</h3>
                  <div className="flex flex-col gap-2">
                    {quizQuestion.options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          if (opt.id === quizQuestion.current.id) {
                            setQuizScore(s => s + 1);
                            alert("To'g'ri! 🎉");
                          } else {
                            alert(`Xato! To'g'ri: ${quizQuestion.current.meaning}`);
                          }
                          generateQuiz();
                        }}
                        className="p-3 rounded-full border border-amber-500/30 bg-slate-800/40 hover:bg-amber-500 hover:text-black text-sm transition"
                      >
                        {opt.meaning}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flashcard Modal */}
              {activeModal === 'flashcard' && (
                <div>
                  <div className="text-xs text-slate-400 mb-2">{fcIndex + 1} / {namesData.length}</div>
                  <motion.div
                    onClick={() => setIsFlipped(!isFlipped)}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-48 bg-slate-800/80 border-2 border-amber-500 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer my-4 shadow-inner"
                  >
                    {!isFlipped ? (
                      <div>
                        <span className="text-xs text-amber-400 mb-2 block">#{namesData[fcIndex].id}</span>
                        <h2 className="text-4xl font-serif text-amber-400">{namesData[fcIndex].arabic}</h2>
                        <p className="text-lg font-bold mt-2">{namesData[fcIndex].trans}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-200 transform [transform:rotateY(180deg)]">{namesData[fcIndex].meaning}</p>
                    )}
                  </motion.div>
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => { setIsFlipped(false); setFcIndex((fcIndex - 1 + namesData.length) % namesData.length); }} className="px-4 py-2 border border-amber-500/30 rounded-full text-sm">Oldingisi</button>
                    <button onClick={() => { setIsFlipped(false); setFcIndex((fcIndex + 1) % namesData.length); }} className="px-4 py-2 border border-amber-500/30 rounded-full text-sm">Keyingisi</button>
                  </div>
                </div>
              )}

              {/* Random Name Modal */}
              {activeModal === 'random' && selectedItem && (
                <div>
                  <span className="text-xs text-amber-400">Kun Ismi</span>
                  <h2 className="text-5xl font-serif text-amber-400 my-3" dir="rtl">{selectedItem.arabic}</h2>
                  <h3 className="text-2xl font-bold">{selectedItem.trans}</h3>
                  <p className="text-sm text-slate-300 mt-3 bg-slate-800/50 p-3 rounded-xl border border-amber-500/20">{selectedItem.meaning}</p>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}