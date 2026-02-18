
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
}

interface SidebarProps {
  onOpenLogin: () => void;
  onCloseMobile?: () => void;
}

// Minimalist Icon Components
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Profile: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7v14m18-14v14M3 7l9-4 9 4M9 21V11h6v10" />
    </svg>
  ),
  Admin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Kurikulum: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  HEM: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Koko: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  ),
  Takwim: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  Program: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

export const Sidebar: React.FC<SidebarProps> = ({ onOpenLogin, onCloseMobile }) => {
  const { activeTab, setActiveTab, user, logout, permissions, schoolProfile } = useApp();
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.subItems && activeTab.startsWith(item.name)
    );
    if (activeParent && !expanded.includes(activeParent.name)) {
      setExpanded(prev => [...prev, activeParent.name]);
    }
  }, [activeTab]);

  // MENU ITEMS DEFINITION (Matched to App.tsx mapping)
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <Icons.Dashboard /> },
    { name: 'Profil Sekolah', icon: <Icons.Profile /> },
    { name: 'Program', icon: <Icons.Program /> },
    { 
      name: 'Pentadbiran', 
      icon: <Icons.Admin />,
      subItems: ['Jawatankuasa', 'Takwim']
    },
    { 
      name: 'Kurikulum', 
      icon: <Icons.Kurikulum />,
      subItems: ['Jawatankuasa', 'Takwim', 'Guru Ganti', 'Peperiksaan']
    },
    { 
      name: 'Hal Ehwal Murid', 
      icon: <Icons.HEM />,
      subItems: ['Jawatankuasa', 'Takwim', 'Pengurusan Kelas', 'Pengurusan Murid']
    },
    { 
      name: 'Kokurikulum', 
      icon: <Icons.Koko />,
      subItems: ['Jawatankuasa', 'Takwim']
    },
    { 
      name: 'Takwim', 
      icon: <Icons.Takwim />,
      subItems: [
        'Kalendar',
        'Kalendar Akademik',
        'Minggu Persekolahan',
        'Cuti Perayaan',
        'Cuti Umum Johor',
      ]
    },
    { 
      name: 'Jadual', 
      icon: <Icons.Calendar />,
      subItems: [
        'Jadual Persendirian',
        'Jadual Kelas',
        'Jadual Berucap',
        'Jadual Pemantauan'
      ]
    },
  ].filter(item => {
    const pKey = item.name.toLowerCase();
    if (pKey === 'dashboard' || pKey === 'profil sekolah' || pKey === 'program') return true;
    if (pKey === 'pentadbiran') return permissions.pentadbiran;
    if (pKey === 'kurikulum') return permissions.kurikulum;
    if (pKey === 'hal ehwal murid') return permissions.hem;
    if (pKey === 'kokurikulum') return permissions.kokurikulum;
    if (pKey === 'takwim') return permissions.takwim;
    if (pKey === 'jadual') return permissions.jadual;
    return true;
  });

  const toggleExpand = (name: string) => {
    if (expanded.includes(name)) {
      setExpanded(expanded.filter(n => n !== name));
    } else {
      setExpanded([...expanded, name]);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      toggleExpand(item.name);
    } else {
      setActiveTab(item.name);
      if(onCloseMobile) onCloseMobile();
    }
  };

  const handleSubItemClick = (parentName: string, subName: string) => {
    // This string format matches the parsing logic in App.tsx
    setActiveTab(`${parentName} - ${subName}`);
    if(onCloseMobile) onCloseMobile();
  };

  return (
    // Updated Sidebar: Navy Blue (#0B132B) to Deep Teal/Turquoise (#006064) Gradient
    <div className="w-full h-full bg-gradient-to-b from-[#0B132B] via-[#004e64] to-[#006064] flex flex-col border-r border-[#2DD4BF]/30 relative overflow-hidden shadow-2xl font-sans">
      
      {/* Background Pattern: Preserved transparency & blend mode */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: 'url(https://i.postimg.cc/D0pqvnTy/SMAAM2024.png)' }}
      ></div>

      {/* Main Content Wrapper */}
      <div className="flex flex-col h-full relative z-10">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-between px-5 border-b border-[#2DD4BF]/30 bg-[#0B132B]/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {schoolProfile?.logoUrl ? (
              <img src={schoolProfile.logoUrl} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5 border-2 border-[#2DD4BF]" />
            ) : (
              <div className="w-10 h-10 bg-[#006064] rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-[#2DD4BF]">
                S
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-wide leading-none">SMAAM</span>
              <span className="text-[0.65rem] text-[#2DD4BF] font-semibold tracking-widest uppercase mt-1">Digital System</span>
            </div>
          </div>
          
          <button 
            onClick={onCloseMobile} 
            className="md:hidden text-[#2DD4BF] hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin custom-scrollbar">
          {menuItems.map((item) => {
            const isParentActive = activeTab.startsWith(item.name);
            const isExpanded = expanded.includes(item.name);
            const hasSub = !!item.subItems;

            return (
              <div key={item.name} className="mb-1">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-all duration-200 group border-l-4
                    ${(isParentActive && !hasSub) || (isParentActive && !isExpanded)
                      ? 'bg-gradient-to-r from-[#2DD4BF]/20 to-transparent text-[#2DD4BF] border-[#2DD4BF]' 
                      : 'text-gray-300 border-transparent hover:bg-[#2DD4BF]/10 hover:text-white hover:border-[#2DD4BF]/50'
                    }`}
                >
                  <div className="flex items-center">
                    <span className={`mr-4 transition-transform duration-300 ${isParentActive ? 'scale-110 text-[#2DD4BF]' : 'group-hover:scale-110 group-hover:text-[#2DD4BF]'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm tracking-wide">{item.name}</span>
                  </div>
                  {hasSub && (
                    <span className={`text-[0.6rem] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#2DD4BF]' : 'text-gray-500'}`}>
                      ▼
                    </span>
                  )}
                </button>

                {/* Submenu */}
                {hasSub && (
                  <div className={`overflow-hidden transition-all duration-300 bg-[#000000]/20 ${isExpanded ? 'max-h-[400px] py-1 border-b border-[#2DD4BF]/20' : 'max-h-0'}`}>
                    {item.subItems?.map((sub) => {
                      const fullTabName = `${item.name} - ${sub}`;
                      const isSubActive = activeTab === fullTabName;
                      
                      return (
                        <button
                          key={sub}
                          onClick={() => handleSubItemClick(item.name, sub)}
                          className={`w-full text-left pl-14 pr-6 py-2.5 text-xs font-medium transition-colors block border-l-2
                            ${isSubActive 
                              ? 'text-[#2DD4BF] font-semibold bg-[#2DD4BF]/10 border-[#2DD4BF]' 
                              : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                            }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Admin Settings Link */}
          {user?.role === 'adminsistem' && (
            <button
              onClick={() => { setActiveTab('Tetapan Admin'); if(onCloseMobile) onCloseMobile(); }}
              className={`w-full text-left px-5 py-3.5 mt-4 flex items-center transition-all duration-200 group border-l-4
                ${activeTab === 'Tetapan Admin' 
                  ? 'bg-gradient-to-r from-[#2DD4BF]/20 to-transparent text-[#2DD4BF] border-[#2DD4BF]' 
                  : 'text-gray-300 border-transparent hover:bg-[#2DD4BF]/10 hover:text-white'
                }`}
            >
              <span className={`mr-4 transition-transform duration-300 ${activeTab === 'Tetapan Admin' ? 'scale-110 text-[#2DD4BF]' : 'group-hover:scale-110 group-hover:text-[#2DD4BF]'}`}>
                <Icons.Settings />
              </span>
              <span className="font-medium text-sm tracking-wide">Admin Sistem</span>
            </button>
          )}
        </div>

        {/* Footer / Login Status */}
        <div className="p-4 border-t border-[#2DD4BF]/30 bg-[#0B132B]/30 backdrop-blur-sm">
          {user ? (
            <button
              onClick={logout}
              className="w-full bg-[#1C2541]/50 hover:bg-red-900/30 text-red-300 py-3 rounded-lg transition-colors flex items-center justify-center gap-3 border border-red-900/30 hover:border-red-500/50 font-bold text-xs uppercase tracking-wider group"
            >
              <span className="group-hover:-translate-x-1 transition-transform"><Icons.Logout /></span>
              Log Keluar
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full bg-[#006064]/40 hover:bg-[#006064]/60 text-[#2DD4BF] py-3 rounded-lg transition-colors flex items-center justify-center gap-3 border border-[#2DD4BF]/50 font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Log Masuk
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
