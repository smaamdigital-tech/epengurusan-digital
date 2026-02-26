
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B132B] py-6 mt-auto border-t border-[#C9B458]/30 shadow-2xl">
      <div className="container mx-auto px-6 text-center">
        <p className="text-white text-sm md:text-base tracking-widest mb-1 font-normal">
          Hak Cipta Terpelihara ePengurusan Digital SMAAM @ 2026
        </p>
        <p className="text-gray-500 text-xs md:text-sm tracking-[0.2em] font-medium uppercase">
          SMA Al-Khairiah Al-Islamiah Mersing
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-0.5 w-8 bg-[#C9B458]/10 rounded-full"></div>
          <div className="h-0.5 w-8 bg-[#C9B458]/20 rounded-full"></div>
          <div className="h-0.5 w-8 bg-[#C9B458]/10 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
};
