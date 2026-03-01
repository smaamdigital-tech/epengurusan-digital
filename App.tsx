
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { AdminSettings } from '@/components/AdminSettings';
import { LoginModal } from '@/components/LoginModal';
import { Toast } from '@/components/Toast';
import { ProgramView } from '@/components/ProgramView';
import { ProfilSekolah } from '@/components/ProfilSekolah';
import { Organisasi } from '@/components/Organisasi';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';

// --- IMPORTS: UNIT PENTADBIRAN ---
import { PentadbiranJawatankuasa } from '@/components/Pentadbiran/PentadbiranJawatankuasa';
import { PentadbiranTakwim } from '@/components/Pentadbiran/PentadbiranTakwim';

// --- IMPORTS: UNIT KURIKULUM ---
import { KurikulumJawatankuasa } from '@/components/Kurikulum/KurikulumJawatankuasa';
import { KurikulumTakwim } from '@/components/Kurikulum/KurikulumTakwim';
import { KurikulumPeperiksaan } from '@/components/Kurikulum/KurikulumPeperiksaan';
import { GuruGanti } from '@/components/Kurikulum/GuruGanti';

// --- IMPORTS: UNIT HAL EHWAL MURID ---
import { HEMJawatankuasa } from '@/components/HEM/HEMJawatankuasa';
import { HEMTakwim } from '@/components/HEM/HEMTakwim';
import { PengurusanMurid } from '@/components/HEM/PengurusanMurid';
import { PengurusanKelas } from '@/components/HEM/PengurusanKelas';

// --- IMPORTS: UNIT KOKURIKULUM ---
import { KokoJawatankuasa } from '@/components/Kokurikulum/KokoJawatankuasa';
import { KokoTakwim } from '@/components/Kokurikulum/KokoTakwim';

// --- IMPORTS: TAKWIM (GLOBAL) ---
import { TakwimPlanner } from '@/components/Takwim/TakwimPlanner';

// --- IMPORTS: JADUAL ---
import { JadualPersendirian } from '@/components/Jadual/JadualPersendirian';
import { JadualKelas } from '@/components/Jadual/JadualKelas';
import { JadualBerucap } from '@/components/Jadual/JadualBerucap';
import { JadualPemantauan } from '@/components/Jadual/JadualPemantauan';

// Placeholder untuk modul yang belum siap
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
  const { activeTab, user } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if the user is an admin to adjust background brightness
  const isAdmin = user?.role?.toLowerCase().includes('admin') || user?.role?.toLowerCase().includes('pentadbir');
  const backgroundOverlay = isAdmin 
    ? 'rgba(225, 229, 235, 0.95)' // Slightly darker/grayer for admins (Anti-glare)
    : 'rgba(255, 255, 255, 0.9)'; // Bright white for others

  // --- PEMETAAN KOMPONEN (COMPONENT MAPPING) ---
  // Ini memastikan setiap tab yang dipilih di Sidebar mempunyai komponen yang tepat.
  const renderContent = () => {
    
    // 1. Modul Utama
    if (activeTab === 'Dashboard') return <Dashboard />;
    if (activeTab === 'Profil Sekolah') return <ProfilSekolah />;
    if (activeTab === 'Organisasi') return <Organisasi />;
    if (activeTab === 'Program') return <ProgramView />;
    if (activeTab === 'Tetapan Admin') return <AdminSettings />;

    // 2. Modul Takwim (Menggunakan Props Dynamic)
    // Format: "Takwim - [Jenis Takwim]"
    if (activeTab.startsWith('Takwim - ')) {
       const takwimType = activeTab.split(' - ')[1];
       return <TakwimPlanner type={takwimType} key={activeTab} />;
    }

    // 3. Pemetaan Modul Spesifik
    switch (activeTab) {
      // --- PENTADBIRAN ---
      case 'Pentadbiran - Jawatankuasa': return <PentadbiranJawatankuasa />;
      case 'Pentadbiran - Takwim': return <PentadbiranTakwim />;

      // --- KURIKULUM ---
      case 'Kurikulum - Jawatankuasa': return <KurikulumJawatankuasa />;
      case 'Kurikulum - Takwim': return <KurikulumTakwim />;
      case 'Kurikulum - Guru Ganti': return <GuruGanti />;
      case 'Kurikulum - Peperiksaan': return <KurikulumPeperiksaan />;

      // --- HAL EHWAL MURID ---
      case 'Hal Ehwal Murid - Jawatankuasa': return <HEMJawatankuasa />;
      case 'Hal Ehwal Murid - Takwim': return <HEMTakwim />;
      case 'Hal Ehwal Murid - Pengurusan Kelas': return <PengurusanKelas />;
      case 'Hal Ehwal Murid - Pengurusan Murid': return <PengurusanMurid />;

      // --- KOKURIKULUM ---
      case 'Kokurikulum - Jawatankuasa': return <KokoJawatankuasa />;
      case 'Kokurikulum - Takwim': return <KokoTakwim />;

      // --- JADUAL ---
      case 'Jadual - Jadual Persendirian': return <JadualPersendirian />;
      case 'Jadual - Jadual Kelas': return <JadualKelas />;
      case 'Jadual - Jadual Berucap': return <JadualBerucap />;
      case 'Jadual - Jadual Pemantauan': return <JadualPemantauan />;

      // Fallback untuk route yang tidak dijumpai atau masih dalam pembinaan
      default: {
        // Cuba dapatkan nama induk untuk paparan placeholder
        const [parent, child] = activeTab.includes(' - ') ? activeTab.split(' - ') : [activeTab, ''];
        let icon = '📂';
        if (parent === 'Pentadbiran') icon = '👔';
        if (parent === 'Kurikulum') icon = '📚';
        if (parent === 'Hal Ehwal Murid') icon = '👨‍🎓';
        if (parent === 'Kokurikulum') icon = '🏆';
        if (parent === 'Jadual') icon = '🗓️';
        
        return <PlaceholderPage title={parent} subtitle={child} icon={icon} />;
      }
    }
  };

  return (
    <div className="flex w-full bg-app-layer text-[#1C2541] font-sans items-stretch min-h-screen">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex-shrink-0 shadow-2xl`}>
        <Sidebar 
          onOpenLogin={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} 
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="sticky top-0 z-40 shadow-md">
           <div className="md:hidden p-4 bg-[#0B132B] border-b border-[#006D77] flex justify-between items-center">
               <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#006D77] text-2xl">☰</button>
               <span className="font-bold text-white font-montserrat uppercase tracking-tight">SMAAM DIGITAL</span>
               <div className="w-8"></div>
           </div>
           <div className="hidden md:block">
               <Header onOpenLogin={() => setIsLoginOpen(true)} />
           </div>
        </div>
        
        <main 
          className="flex-1 flex flex-col transition-all duration-500"
          style={activeTab !== 'Profil Sekolah' ? {
            backgroundImage: `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url('https://i.postimg.cc/D0pqvnTy/SMAAM2024.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          } : {
            backgroundColor: '#A9CCE3'
          }}
        >
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
