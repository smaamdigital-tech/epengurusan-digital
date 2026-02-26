
import React, { useState } from 'react';
import { SCHOOL_NAME } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 hidden sm:block">
                {SCHOOL_NAME}
              </span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Utama</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Tentang Kami</a>
              <a href="#news" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Berita</a>
              <a href="#staff" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Guru & Kakitangan</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Hubungi</a>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg hidden sm:block">
              Portal Murid
            </button>
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-2">
          <a href="#" className="block text-slate-600 hover:text-blue-600 py-2">Utama</a>
          <a href="#about" className="block text-slate-600 hover:text-blue-600 py-2">Tentang Kami</a>
          <a href="#news" className="block text-slate-600 hover:text-blue-600 py-2">Berita</a>
          <a href="#staff" className="block text-slate-600 hover:text-blue-600 py-2">Guru & Kakitangan</a>
          <a href="#contact" className="block text-slate-600 hover:text-blue-600 py-2">Hubungi</a>
          <button className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold mt-4">
            Portal Murid
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
