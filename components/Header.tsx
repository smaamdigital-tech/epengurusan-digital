
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { user, siteConfig } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    // Format: dd Januari YYYY
    return date.toLocaleDateString('ms-MY', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTimeCustom = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    let suffix = 'mlm'; // Default covers 19:00 - 00:59 (7pm - 12am+)

    // 1 pagi sampai 11.59 pagi - guna pagi
    if (hours >= 1 && hours < 12) {
      suffix = 'pagi';
    } 
    // 12.00 - 1.59 - guna tghr
    else if (hours >= 12 && hours < 14) {
      suffix = 'tghr';
    } 
    // 2.00 - 6.59 - guna ptg
    else if (hours >= 14 && hours < 19) {
      suffix = 'ptg';
    }
    // 7.00 - 12.00 (dan seterusnya hingga 1 pagi) - guna mlm (covered by default)

    // Convert to 12-hour format
    let displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;

    return `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('ms-MY', { weekday: 'long' }).format(date).toUpperCase();
  };

  const formatHijriDate = (date: Date) => {
    try {
      // Pelarasan Kalendar Hijri -1 Hari
      // Untuk memastikan 1 Ramadan 1447H jatuh pada 19 Februari 2026 (Standard: 18 Feb)
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() - 1);

      // Menggunakan Intl API untuk tarikh Hijrah dinamik (Umm al-Qura)
      const formatted = new Intl.DateTimeFormat('ms-MY-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kuala_Lumpur'
      }).format(adjustedDate);
      
      let finalDate = formatted;
      // Replace Syaaban with Sya'aban if present
      finalDate = finalDate.replace(/Syaaban/gi, "Sya'aban");

      // Semak jika sudah ada H atau Hijrah untuk elak huruf ganda
      if (finalDate.match(/H|Hijrah/i)) {
          return finalDate;
      }
      return finalDate + ' H';
    } catch (error) {
      return "Kalendar Hijrah H";
    }
  };

  return (
    // Fixed Header with updated typography hierarchy
    <div className="h-auto min-h-[6rem] w-full bg-[#0B132B] flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 relative shadow-xl border-b border-[#006D77] overflow-hidden">
      
      {/* --- ANIMATED GEOMETRIC BACKGROUND (Subtle) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute w-64 h-64 bg-[#006D77] rounded-full blur-[100px] -top-32 -left-10 opacity-20"></div>
        <div className="absolute w-32 h-32 border border-[#006D77]/30 rounded-full animate-spin-slow bottom-[-50px] right-[20%]"></div>
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#0B132B] via-[#006D77] to-[#0B132B] opacity-50"></div>
      </div>

      {/* Left: System Title - Typography Update */}
      <div className="flex flex-col relative z-10 w-full md:w-auto text-center md:text-left mb-2 md:mb-0">
        <h1 className="font-bold text-lg md:text-xl lg:text-2xl text-white tracking-tight leading-tight uppercase drop-shadow-md">
          {siteConfig.systemTitle}
        </h1>
        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
           <div className="hidden md:block h-0.5 w-6 bg-[#006D77]"></div>
           <p className="text-[0.65rem] md:text-xs text-[#4FD1C5] font-semibold tracking-widest uppercase">
             {siteConfig.schoolName}
           </p>
        </div>
      </div>

      {/* Right Section: Clock & Profile - Typography Update */}
      <div className="flex items-center gap-4 md:gap-8 relative z-10 w-full md:w-auto justify-center md:justify-end">
        
        {/* Jam Digital */}
        <div className="flex flex-col items-center md:items-end border-r-0 md:border-r border-[#1C2541] pr-0 md:pr-8 leading-tight">
          <div className="flex items-center gap-2 tracking-tight tabular-nums">
            <span className="text-[#4FD1C5] font-medium text-sm md:text-base">{formatDate(time)}</span>
            <span className="text-[#006D77] mx-1">|</span>
            <span className="text-[#4FD1C5] font-medium text-sm md:text-base">{formatTimeCustom(time)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 justify-center md:justify-end">
             <span className="text-[0.65rem] md:text-xs bg-[#1C2541] px-2 py-0.5 rounded text-[#C9B458] font-bold uppercase border border-[#C9B458]/30 tracking-wider">
                {getDayName(time)}
             </span>
             <span className="text-[0.65rem] md:text-xs text-gray-400 font-medium tracking-wide">
                {formatHijriDate(time)}
             </span>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-white tracking-normal group-hover:text-[#4FD1C5] transition-colors">
              {user ? user.name : 'PELAWAT'}
            </p>
            <div className="flex justify-end mt-0.5">
               <span className="text-[0.6rem] text-white font-bold uppercase tracking-wider bg-[#006D77] px-2 py-0.5 rounded shadow-sm">
                 {user ? (user.role === 'adminsistem' ? 'Super Admin' : 'Admin') : 'Akses Terhad'}
               </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#1C2541] border border-[#006D77] flex items-center justify-center text-[#4FD1C5] font-bold text-lg shadow-lg group-hover:border-[#4FD1C5] group-hover:bg-[#006D77] group-hover:text-white transition-all duration-300">
            {user ? user.name.charAt(0) : 'U'}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}} />
    </div>
  );
};
