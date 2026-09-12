import React, { useState, useEffect } from 'react';

export default function QiblaModal({ isOpen, onClose }) {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Makkah koordinatalari: 21.4225° N, 39.8262° E
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  const calculateQibla = (lat, lng) => {
    const phiK = (MECCA_LAT * Math.PI) / 180;
    const lambdaK = (MECCA_LNG * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180;

    const qiblaRad = Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

    let qiblaDeg = (qiblaRad * 180) / Math.PI;
    if (qiblaDeg < 0) qiblaDeg += 360;
    return qiblaDeg;
  };

  useEffect(() => {
    if (!isOpen) return;

    // GPS orqali foydalanuvchi joylashuvini olish
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const deg = calculateQibla(pos.coords.latitude, pos.coords.longitude);
          setQiblaDirection(deg);
        },
        () => {
          // Geolocation rad etilsa (masalan, Toshkent uchun standart Qibla azimuti ~240°)
          setQiblaDirection(240);
        }
      );
    } else {
      setQiblaDirection(240);
    }

    // Qurilma kompas sensori
    const handleOrientation = (e) => {
      let compass = e.alpha;
      if (e.webkitCompassHeading) {
        compass = e.webkitCompassHeading; // iOS uchun
      }
      if (compass !== null && compass !== undefined) {
        setHeading(compass);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setErrorMsg("Qurilmangizda kompas sensori qo'llab-quvvatlanmaydi.");
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Qibla strelkasi burchagi
  const needleRotation = qiblaDirection !== null ? qiblaDirection - heading : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 text-center flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-amber-400 mb-1">🧭 Qibla Kompasi</h2>
        <p className="text-xs text-slate-400 mb-6">
          Qurilmangizni tekis tuting va oltin strelka yo'nalishiga qarang
        </p>

        {/* Kompas diski */}
        <div className="relative w-56 h-56 rounded-full border-4 border-amber-500/30 bg-slate-950 flex items-center justify-center shadow-inner my-2">
          {/* Shimol, Sharq, Janub, G'arb belgilari */}
          <span className="absolute top-2 text-xs font-bold text-red-400">N</span>
          <span className="absolute right-3 text-xs font-bold text-slate-400">E</span>
          <span className="absolute bottom-2 text-xs font-bold text-slate-400">S</span>
          <span className="absolute left-3 text-xs font-bold text-slate-400">W</span>

          {/* Qibla strelkasi */}
          <div
            className="w-full h-full absolute top-0 left-0 flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            <div className="flex flex-col items-center -mt-20">
              <span className="text-2xl">🕋</span>
              <div className="w-1.5 h-16 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full shadow-lg"></div>
            </div>
          </div>

          <div className="w-4 h-4 bg-amber-400 rounded-full z-10 border-2 border-slate-900 shadow"></div>
        </div>

        {qiblaDirection !== null && (
          <p className="text-xs text-amber-300/80 mt-4">
            Qibla burchagi: <span className="font-bold">{Math.round(qiblaDirection)}°</span>
          </p>
        )}

        {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          Yopish
        </button>
      </div>
    </div>
  );
}