
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHijriDateStringForDate } from '../utils/calendarData';

interface HeaderProps {
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  const [time, setTime] = useState(new Date());
  const { user, siteConfig, logout } = useApp();

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

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('ms-MY', { weekday: 'long' }).format(date).toUpperCase();
  };

  return (
    // Updated Header: Luminous Navy Blue theme
    <div className="h-20 w-full bg-gradient-to-r from-[#001F3F] to-[#00509E] flex items-center justify-between px-6 relative shadow-[0_0_15px_rgba(0,80,158,0.5)] overflow-hidden">
      
      {/* Tech Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Moving Grid Background */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
               backgroundSize: '30px 30px'
             }}>
        </div>
        
        {/* Floating Geometric Shapes (Squares & Circles) - Increased Quantity */}
        <div className="absolute top-[-10%] left-[5%] w-32 h-32 border border-white/10 rounded-full animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[10%] w-48 h-48 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
        <div className="absolute top-[20%] right-[30%] w-16 h-16 border border-white/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[20%] w-12 h-12 border border-white/10 rotate-12 animate-bounce" style={{ animationDuration: '8s' }}></div>
        
        {/* Additional Geometric Shapes */}
        <div className="absolute top-[10%] left-[40%] w-24 h-24 border-2 border-dashed border-white/5 rounded-full animate-[spin_25s_linear_infinite]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-20 h-20 border border-white/10 rotate-45 animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-[50%] right-[5%] w-32 h-32 border border-white/5 rounded-lg rotate-12 animate-[spin_30s_linear_infinite_reverse]"></div>
        <div className="absolute top-[5%] right-[50%] w-10 h-10 border-2 border-white/10 rotate-45 animate-spin" style={{ animationDuration: '10s' }}></div>

        {/* Random Blinking Dots - Increased Quantity & Variety */}
        <div className="absolute top-[15%] left-[25%] w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[75%] left-[65%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[40%] right-[15%] w-1 h-1 bg-white/70 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-[10%] right-[40%] w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDuration: '3.5s' }}></div>
        
        {/* Extra Blinking Dots */}
        <div className="absolute top-[30%] left-[10%] w-1 h-1 bg-[#2DD4BF]/60 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[40%] right-[20%] w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[60%] left-[50%] w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-[20%] right-[5%] w-1 h-1 bg-[#C9B458]/60 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute bottom-[10%] left-[30%] w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-[80%] right-[40%] w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDuration: '4.5s' }}></div>

        {/* Updated Jaringan Tech (Network Data Effect) */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
           <defs>
             <pattern id="network-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
               {/* Moving Dashed Lines */}
               <path d="M10 10 L90 90 M90 10 L10 90" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.5">
                 <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
               </path>
               <path d="M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.3" strokeDasharray="8 4" opacity="0.3">
                 <animate attributeName="stroke-dashoffset" from="0" to="24" dur="5s" repeatCount="indefinite" />
               </path>
               
               {/* Pulsing Nodes (Circles & Squares) */}
               <circle cx="10" cy="10" r="1.5" fill="#2DD4BF">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
               </circle>
               <circle cx="90" cy="90" r="1.5" fill="#2DD4BF">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="1s" />
               </circle>
               <rect x="48.5" y="48.5" width="3" height="3" fill="#C9B458">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
               </rect>
               <circle cx="90" cy="10" r="1" fill="white">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
               </circle>
               <circle cx="10" cy="90" r="1" fill="white">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
               </circle>
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#network-pattern)" />
        </svg>
      </div>

      {/* Left: Logo & School Title */}
      <div className="flex items-center gap-4 relative z-10">
        {siteConfig.logoUrl ? (
          <img src={siteConfig.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
        ) : (
          <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" alt="Logo" className="w-12 h-12 object-contain" />
        )}
        <div className="flex flex-col">
          <h1 className="font-bold text-lg md:text-xl text-white tracking-tight leading-tight">
            {siteConfig.schoolName}
          </h1>
          <p className="text-xs text-gray-300 font-medium tracking-wide">
            {siteConfig.systemTitle}
          </p>
        </div>
      </div>

      {/* Right Section: Clock & Profile */}
      <div className="flex items-center gap-6 relative z-10">
        
        {/* Jam Digital - Simplified as per image */}
        <div className="hidden md:flex flex-col items-end leading-tight text-white/90">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{formatDate(time)}</span>
            <span className="opacity-50">|</span>
            <span>{getDayName(time)}</span>
          </div>
          <div className="text-[0.7rem] opacity-70 mt-0.5">
            {getHijriDateStringForDate(time)}
          </div>
        </div>

        {/* Profile Button - Turquoise Blue background with Turquoise Green shadow & Illumination */}
        <div 
          onClick={user ? logout : onOpenLogin}
          className="flex items-center gap-3 bg-[#00BCD4] hover:bg-[#00BCD4]/90 px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_#69F0AE] hover:shadow-[0_0_25px_#69F0AE] ring-1 ring-[#69F0AE]/50 group relative overflow-hidden cursor-pointer"
        >
          {/* Illumination Effect */}
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm relative z-10">
            {user ? user.name.charAt(0) : <Icons.User />}
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-sm font-bold text-white tracking-wide leading-none">
              {user ? user.name : 'Tetamu'}
            </span>
            <span className="text-[0.65rem] text-white/90 font-medium uppercase tracking-wider mt-0.5 group-hover:text-white transition-colors">
              {user ? 'Log Keluar' : 'Log Masuk'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add User icon to Icons if not present, or use a simple SVG
const Icons = {
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
};
