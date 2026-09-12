import React, { useState, useEffect, useCallback } from 'react';

export default function QiblaModal({ isOpen, onClose }) {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Makkah koordinatalari: 21.4225° N, 39.8262° E
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  // Qibla burchagini hisoblash (Great Circle formula)
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

  // Sensor ma'lumotlarini qayta ishlash
  const handleOrientation = useCallback((e) => {
    let compass = null;

    // 1. iOS qurilmalari uchun (Safari)
    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
      compass = e.webkitCompassHeading;
    } 
    // 2. Android va boshqa standart brauzerlar uchun (Absolute orientation)
    else if (e.absolute !== undefined && e.alpha !== null) {
      compass = 360 - e.alpha; // Alpha qiymatini shimolga nisbatan burchakka o'girish
    } else if (e.alpha !== null) {
      compass = 360 - e.alpha;
    }

    if (compass !== null) {
      setHeading(compass);
    }
  }, []);

  // iOS 13+ uchun sensor ruxsatini so'rash
  const requestIOSPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setErrorMsg("Kompas sensori uchun ruxsat berilmadi.");
        }
      } catch (err) {
        setErrorMsg("Sensor ruxsatini so'rashda xatolik yuz berdi.");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // iOS qurilmasi ekanligini aniqlash
    const isIOSDevice =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';
    setIsIOS(isIOSDevice);

    // GPS orqali joylashuvni olish
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const deg = calculateQibla(pos.coords.latitude, pos.coords.longitude);
          setQiblaDirection(deg);
        },
        () => {
          // Geolocation rad etilsa (Toshkent uchun standart Qibla azimuti ~240°)
          setQiblaDirection(240);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setQiblaDirection(240);
    }

    // Android va boshqa sensorlar uchun tinglovchilarni ulash
    if (!isIOSDevice) {
      if ('ondeviceorientationabsolute' in window) {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      } else {
        setErrorMsg("Qurilmangizda kompas sensori qo'llab-quvvatlanmaydi.");
      }
    }

    return () => {
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      }
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen, handleOrientation]);

  if (!isOpen) return null;

  // Igna va dial rotatsiyasi
  const dialRotation = -heading; // Kompas diski qurilma burilishiga teskari aylanadi
  const needleRotation = qiblaDirection !== null ? qiblaDirection : 0; // Igna dial ustida Qiblani ko'rsatadi

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 text-center flex flex-col items-center">
        
        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 text-xl font-bold p-1 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent mb-1">
          🧭 Qibla Kompasi
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Qurilmangizni gorizontal va tekis tuting
        </p>

        {/* iOS uchun maxsus Ruxsat Tugmasi */}
        {isIOS && !permissionGranted && (
          <button
            onClick={requestIOSPermission}
            className="mb-4 px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full text-xs font-semibold hover:bg-amber-500/30 transition"
          >
            🔔 Sensorga ruxsat berish
          </button>
        )}

        {/* Kompas Interfeysi */}
        <div className="relative w-60 h-60 rounded-full border-4 border-amber-500/30 bg-slate-950 flex items-center justify-center shadow-inner my-2 overflow-hidden">
          
          {/* Aylanuvchi Kompas Diski (Dial) */}
          <div
            className="absolute inset-0 w-full h-full rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${dialRotation}deg)` }}
          >
            {/* Shimol, Sharq, Janub, G'arb ko'rsatkichlari */}
            <span className="absolute top-3 text-xs font-black text-red-500 tracking-wider">N</span>
            <span className="absolute right-4 text-xs font-bold text-slate-400">E</span>
            <span className="absolute bottom-3 text-xs font-bold text-slate-400">S</span>
            <span className="absolute left-4 text-xs font-bold text-slate-400">W</span>

            {/* Dial gradient va daraja chiziqlari */}
            <div className="w-48 h-48 rounded-full border border-slate-800/80 pointer-events-none" />

            {/* Qibla Ignasi (Dial bilan birga aylanadi va Qibla darajasiga ishora qiladi) */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="flex flex-col items-center -mt-24">
                <span className="text-2xl animate-bounce mb-1">🕋</span>
                <div className="w-1.5 h-14 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full shadow-lg shadow-amber-500/50" />
              </div>
            </div>
          </div>

          {/* Kompas markaziy nuqtasi */}
          <div className="w-4 h-4 bg-amber-400 rounded-full z-10 border-2 border-slate-900 shadow-md"></div>
        </div>

        {/* Ma'lumotlar bloki */}
        {qiblaDirection !== null && (
          <div className="mt-4 space-y-1">
            <p className="text-xs text-amber-300/90 font-medium">
              Qibla azimuti: <span className="font-bold text-amber-400">{Math.round(qiblaDirection)}°</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Qurilma yoʻnalishi: {Math.round(heading)}°
            </p>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg mt-3">
            {errorMsg}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          Yopish
        </button>
      </div>
    </div>
  );
}