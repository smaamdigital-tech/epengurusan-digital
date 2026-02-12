
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdminSettings } from './components/AdminSettings';
import { LoginModal } from './components/LoginModal';
import { Toast } from './components/Toast';
import { UnitContent } from './components/UnitContent';
import { TakwimPlanner } from './components/TakwimPlanner';
import { ProgramView } from './components/ProgramView';
import { JadualModule } from './components/JadualModule';
import { ProfilSekolah } from './components/ProfilSekolah';
import { KurikulumPeperiksaan } from './components/KurikulumPeperiksaan';
import { HemKehadiran } from './components/HemKehadiran';
import { GuruGanti } from './components/GuruGanti';
import { Footer } from './components/Footer';
import { useApp } from './context/AppContext';

// Enhanced placeholder to show hierarchy
const PlaceholderPage: React.FC<{ title: string, subtitle?: string, icon: string }> = ({ title, subtitle, icon }) => (
  <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-gray-700 fade-in">
    <div className="text-6xl mb-4 opacity-20 text-[#006D77]">{icon}</div>
    <h2 className="text-2xl font-bold text-[#0B132B]">{title}</h2>
    {subtitle && (
      <span className="mt-1 bg-[#1C2541] px-3 py-1 rounded-full text-[#006D77] font-bold text-sm border border-[#006D77]">
        {subtitle}
      </span>
    )}
    <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
      Modul <span className="text-[#006D77] font-semibold">{subtitle || title}</span> sedang dalam pembangunan. 
      Akan datang dengan ciri-ciri lengkap.
    </p>
  </div>
);

const App: React.FC = () => {
  const { activeTab } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    // Handle Submenus (Pattern: "Parent - Child")
    if (activeTab.includes(' - ')) {
      const [parent, child] = activeTab.split(' - ');
      
      const standardUnits = ['Pentadbiran', 'Kurikulum', 'Hal Ehwal Murid', 'Kokurikulum'];
      
      if (parent === 'Kurikulum' && child === 'Peperiksaan') {
        return <KurikulumPeperiksaan />;
      }

      if (parent === 'Kurikulum' && child === 'Guru Ganti') {
        return <GuruGanti />;
      }

      if (parent === 'Hal Ehwal Murid' && child === 'Enrolmen Murid') {
        return <HemKehadiran />;
      }

      if (parent === 'Hal Ehwal Murid' && child === 'Guru Kelas') {
        return <JadualModule type="Guru Kelas" />;
      }

      if (standardUnits.includes(parent) && (child === 'Jawatankuasa' || child === 'Takwim')) {
        return <UnitContent unit={parent} type={child} />;
      }

      if (parent === 'Jadual') {
        return <JadualModule type={child} />;
      }

      if (parent === 'Takwim') {
        return <TakwimPlanner type={child} />;
      }
      
      let icon = '📂';
      if (parent === 'Pentadbiran') icon = '👔';
      if (parent === 'Kurikulum') icon = '📚';
      if (parent === 'Hal Ehwal Murid') icon = '👨‍🎓';
      if (parent === 'Kokurikulum') icon = '🏆';
      if (parent === 'Jadual') icon = '🗓️';
      if (parent === 'Takwim') icon = '📅';

      return <PlaceholderPage title={parent} subtitle={child} icon={icon} />;
    }

    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Tetapan Admin':
        return <AdminSettings />;
      case 'Profil Sekolah': 
        return <ProfilSekolah />;
      case 'Pentadbiran': 
        return <PlaceholderPage title="Pentadbiran" subtitle="Menu Utama" icon="👔" />;
      case 'Kurikulum': 
        return <PlaceholderPage title="Kurikulum" subtitle="Menu Utama" icon="📚" />;
      case 'Hal Ehwal Murid': 
        return <PlaceholderPage title="Hal Ehwal Murid" subtitle="Menu Utama" icon="👨‍🎓" />;
      case 'Kokurikulum': 
        return <PlaceholderPage title="Kokurikulum" subtitle="Menu Utama" icon="🏆" />;
      case 'Takwim': 
        return <TakwimPlanner type="Kalendar" />;
      case 'Jadual': 
        return <JadualModule type="Jadual Persendirian" />;
      case 'Program': 
        return <ProgramView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    // Main App Container - Restored to Standard Scrolling Layout
    <div className="flex min-h-screen w-full bg-app-layer text-[#1C2541] font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Sticky on Desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex-shrink-0 shadow-2xl`}>
        <Sidebar 
          onOpenLogin={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} 
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Layout Column (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header - Sticky Top */}
        <div className="sticky top-0 z-40 shadow-md">
           {/* Mobile Header Bar */}
           <div className="md:hidden p-4 bg-[#0B132B] border-b border-[#006D77] flex justify-between items-center">
               <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#006D77] text-2xl">
                 ☰
               </button>
               <span className="font-bold text-white font-montserrat uppercase tracking-tight">SMAAM DIGITAL</span>
               <div className="w-8"></div>
           </div>
           {/* Desktop Header */}
           <div className="hidden md:block">
               <Header />
           </div>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-[#A9CCE3]/80 backdrop-blur-sm">
          <div className="flex-grow p-0">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Toast />
    </div>
  );
};

export default App;
