import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface MenuItem {
  name: string;
  icon: string;
  subItems?: string[];
  permissionKey?: string; // Links to permission object key
}

interface SidebarProps {
  onOpenLogin: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenLogin, onCloseMobile }) => {
  const { activeTab, setActiveTab, user, logout, checkPermission } = useApp();
  const [expanded, setExpanded] = useState<string[]>([]);

  // Automatically expand the parent menu if a submenu is active
  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.subItems && activeTab.startsWith(item.name)
    );
    if (activeParent && !expanded.includes(activeParent.name)) {
      setExpanded(prev => [...prev, activeParent.name]);
    }
  }, [activeTab]);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: '📊', permissionKey: 'dashboard' },
    { name: 'Profil Sekolah', icon: '🏫' }, // Public access usually, but could be 'dashboard' or none
    { 
      name: 'Pentadbiran', 
      icon: '👔',
      subItems: ['Jawatankuasa', 'Takwim'],
      permissionKey: 'jawatankuasa' // Maps to permissions.jawatankuasa.view
    },
    { 
      name: 'Kurikulum', 
      icon: '📚',
      subItems: ['Jawatankuasa', 'Takwim', 'Peperiksaan'],
      permissionKey: 'jawatankuasa'
    },
    { 
      name: 'Hal Ehwal Murid', 
      icon: '👨‍🎓',
      subItems: ['Jawatankuasa', 'Takwim', 'Kehadiran Murid'],
      permissionKey: 'jawatankuasa'
    },
    { 
      name: 'Kokurikulum', 
      icon: '🏆',
      subItems: ['Jawatankuasa', 'Takwim'],
      permissionKey: 'jawatankuasa'
    },
    { 
      name: 'Takwim/Planner', 
      icon: '📅',
      subItems: [
        'Kalendar',
        'Kalendar Akademik',
        'Cuti Perayaan',
        'Cuti Umum Johor',
        'Minggu Persekolahan',
        'Takwim Peperiksaan'
      ],
      permissionKey: 'dashboard' // Assuming standard view
    },
    { name: 'Program', icon: '🎯', permissionKey: 'program' },
    { 
      name: 'Jadual', 
      icon: '🗓️',
      subItems: [
        'Guru Ganti', 
        'Guru Kelas', 
        'Jadual Kelas', 
        'Jadual Berucap', 
        'Jadual Persendirian',
        'Jadual Pemantauan'
      ],
      permissionKey: 'dashboard'
    },
    { name: 'Laporan & Cetakan', icon: '📄', permissionKey: 'laporan' },
  ];

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
    setActiveTab(`${parentName} - ${subName}`);
    if(onCloseMobile) onCloseMobile();
  };

  return (
    <div className="w-64 h-full bg-[#1C2541] flex flex-col shadow-2xl border-r border-gray-800">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-700 bg-[#0B132B]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#C9B458] rounded-full flex items-center justify-center text-[#0B132B] font-bold text-xl mr-3">
            S
          </div>
          <span className="font-bold text-lg text-white font-montserrat tracking-wider">SMAAM</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile} 
          className="md:hidden text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {menuItems.map((item) => {
          // CHECK VIEW PERMISSION
          // If no permissionKey defined, assume viewable by all (or standard logic)
          // 'any' casting used to map string to PermissionKey safely for checkPermission
          if (item.permissionKey && !checkPermission(item.permissionKey as any, 'view')) {
              return null;
          }

          const isParentActive = activeTab.startsWith(item.name);
          const isExpanded = expanded.includes(item.name);
          const hasSub = !!item.subItems;

          return (
            <div key={item.name} className="mb-1">
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-6 py-3 flex items-center justify-between transition-all duration-300 group
                  ${(isParentActive && !hasSub) || (isParentActive && !isExpanded)
                    ? 'bg-[#3A506B] text-[#C9B458] border-r-4 border-[#C9B458]' 
                    : 'text-gray-400 hover:bg-[#253252] hover:text-white'
                  }`}
              >
                <div className="flex items-center">
                  <span className={`mr-4 text-xl transition-transform ${isParentActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {hasSub && (
                  <span className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </button>

              {/* Submenu */}
              {hasSub && (
                <div className={`overflow-hidden transition-all duration-300 bg-[#0B132B]/50 ${isExpanded ? 'max-h-80 py-2' : 'max-h-0'}`}>
                  {item.subItems?.map((sub) => {
                    const fullTabName = `${item.name} - ${sub}`;
                    const isSubActive = activeTab === fullTabName;
                    
                    return (
                      <button
                        key={sub}
                        onClick={() => handleSubItemClick(item.name, sub)}
                        className={`w-full text-left pl-16 pr-6 py-2 text-sm transition-colors block
                          ${isSubActive 
                            ? 'text-[#C9B458] font-semibold' 
                            : 'text-gray-500 hover:text-gray-200'
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

        {/* Admin Settings Link - Controlled by checkPermission */}
        {checkPermission('tetapan', 'view') && (
          <button
            onClick={() => { setActiveTab('Tetapan Admin'); if(onCloseMobile) onCloseMobile(); }}
            className={`w-full text-left px-6 py-3 my-1 mt-6 flex items-center transition-all duration-300
              ${activeTab === 'Tetapan Admin' 
                ? 'bg-[#3A506B] text-[#C9B458] border-r-4 border-[#C9B458]' 
                : 'text-gray-400 hover:bg-[#253252] hover:text-[#C9B458]'
              }`}
          >
            <span className="mr-4 text-xl">⚙️</span>
            <span className="font-medium">Tetapan Admin</span>
          </button>
        )}
      </div>

      {/* Footer / Login Status */}
      <div className="p-4 border-t border-gray-700 bg-[#0B132B]">
        {user ? (
          <button
            onClick={logout}
            className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 py-2 rounded-md transition-colors flex items-center justify-center gap-2 border border-red-800"
          >
            <span>🚪</span> Log Keluar
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full bg-[#3A506B] hover:bg-[#4a6382] text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 border border-[#C9B458]"
          >
            <span>🔐</span> Log Masuk
          </button>
        )}
      </div>
    </div>
  );
};