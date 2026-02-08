
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
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ms-MY', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase();
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('ms-MY', { weekday: 'long' }).format(date).toUpperCase();
  };

  const formatHijriDate = (date: Date) => {
    return "20 Sya'aban 1447 H";
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
          <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white tracking-tight tabular-nums">
            <span>{formatDate(time)}</span>
            <span className="text-[#006D77] mx-1">|</span>
            <span className="text-[#4FD1C5]">{formatTime(time)}</span>
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
