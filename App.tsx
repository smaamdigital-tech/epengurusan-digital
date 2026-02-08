
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
import { Footer } from './components/Footer';
import { useApp } from './context/AppContext';

// Enhanced placeholder to show hierarchy
const PlaceholderPage: React.FC<{ title: string, subtitle?: string, icon: string }> = ({ title, subtitle, icon }) => (
  <div className="p-10 flex flex-col items-center justify-center h-full text-gray-700 fade-in min-h-[60vh]">
    <div className="text-6xl mb-4 opacity-20">{icon}</div>
    <h2 className="text-2xl font-bold text-[#0B132B]">{title}</h2>
    {subtitle && (
      <span className="mt-1 bg-[#1C2541] px-3 py-1 rounded-full text-[#C9B458] text-sm border border-[#3A506B]">
        {subtitle}
      </span>
    )}
    <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
      Modul <span className="text-[#0B132B] font-semibold">{subtitle || title}</span> sedang dalam pembangunan. 
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

      if (parent === 'Hal Ehwal Murid' && child === 'Kehadiran') {
        return <HemKehadiran />;
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
        return <JadualModule type="Guru Ganti" />;
      case 'Program': 
        return <ProgramView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#A9CCE3] text-[#1C2541] font-sans overflow-x-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          onOpenLogin={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} 
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col relative w-full md:ml-64 transition-all duration-300">
        <div className="md:hidden p-4 bg-[#0B132B] border-b border-gray-800 flex justify-between items-center sticky top-0 z-30">
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#C9B458] text-2xl">
             ☰
           </button>
           <span className="font-bold text-white font-montserrat uppercase tracking-tight">SMAAM DIGITAL</span>
           <div className="w-8"></div>
        </div>

        <div className="hidden md:block">
           <Header />
        </div>
        
        <main className="flex-1 overflow-y-auto bg-[#A9CCE3] w-full flex flex-col">
          <div className="flex-grow">
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
