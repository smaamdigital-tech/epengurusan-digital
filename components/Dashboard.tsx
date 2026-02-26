
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getInitialItems } from './UnitContent';
import { Announcement, Program } from '../types';

// Minimalist Corporate Icon Components
const Icons = {
  Teachers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Students: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a3 3 0 0 1 0 6" /><path d="M10 8h4l4 4-4 4h-4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" /><path d="M6 15h0" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  CalendarCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" />
    </svg>
  ),
  HandHeart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Globe: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
};

// Helper: Parse Malay Date Range String (e.g., "12 – 16 Jan 2026")
const isDateInCurrentWeek = (dateRangeStr: string): boolean => {
  if (!dateRangeStr) return false;

  const months: { [key: string]: number } = {
    'jan': 0, 'feb': 1, 'mac': 2, 'apr': 3, 'mei': 4, 'jun': 5,
    'jul': 6, 'ogos': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dis': 11
  };

  try {
    // Basic cleaning and splitting
    // Format expected: "DD – DD MMM YYYY" or "DD MMM – DD MMM YYYY"
    const parts = dateRangeStr.split('–').map(s => s.trim());
    if (parts.length !== 2) return false;

    const endPart = parts[1]; // "16 Jan 2026"
    const endPieces = endPart.split(' ');
    
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let dayEnd = 0;

    if (endPieces.length >= 3) {
       year = parseInt(endPieces[2]);
       const monthStr = endPieces[1].toLowerCase();
       month = months[monthStr] !== undefined ? months[monthStr] : 0;
       dayEnd = parseInt(endPieces[0]);
    }

    // Construct End Date Object
    const endDate = new Date(year, month, dayEnd);
    endDate.setHours(23, 59, 59);

    // Construct Start Date Object
    // Assume start date uses same month/year unless specified otherwise, simplified for this specific format
    const startPart = parts[0]; // "12" or "30 Mac"
    const startPieces = startPart.split(' ');
    const dayStart = parseInt(startPieces[0]);
    let startMonth = month;
    
    if (startPieces.length > 1) {
        // Start part has its own month e.g. "30 Mac"
        const mStr = startPieces[1].toLowerCase();
        if (months[mStr] !== undefined) startMonth = months[mStr];
    }

    // Handle year rollover if needed (rare for weekly view but possible)
    const startDate = new Date(year, startMonth, dayStart);
    startDate.setHours(0, 0, 0);

    const today = new Date();
    
    // Check if today is between start and end
    return today >= startDate && today <= endDate;

  } catch {
    return false;
  }
};

const isEventInWeek = (eventDateStr: string, weekDateRangeStr: string): boolean => {
    if (!eventDateStr || !weekDateRangeStr) return false;
    
    const months: { [key: string]: number } = { 'jan': 0, 'feb': 1, 'mac': 2, 'apr': 3, 'mei': 4, 'jun': 5, 'jul': 6, 'ogos': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dis': 11 };

    try {
        // Parse Week Range "12 – 16 Jan 2026"
        const rangeParts = weekDateRangeStr.split('–').map(s => s.trim());
        if (rangeParts.length !== 2) return false;

        const endPart = rangeParts[1]; 
        const endPieces = endPart.split(' ');
        const year = parseInt(endPieces[2]);
        const month = months[endPieces[1].toLowerCase()] || 0;
        const dayEnd = parseInt(endPieces[0]);
        
        const endDate = new Date(year, month, dayEnd);
        endDate.setHours(23, 59, 59);

        const startPart = rangeParts[0];
        const startPieces = startPart.split(' ');
        const dayStart = parseInt(startPieces[0]);
        let startMonth = month;
        if (startPieces.length > 1) {
            startMonth = months[startPieces[1].toLowerCase()] || month;
        }
        const startDate = new Date(year, startMonth, dayStart);
        startDate.setHours(0, 0, 0);

        // Parse Event Date "26 Jan 2026"
        const eventParts = eventDateStr.split(' ');
        if (eventParts.length < 3) return false;
        const eDay = parseInt(eventParts[0]);
        const eMonth = months[eventParts[1].toLowerCase()] || 0;
        const eYear = parseInt(eventParts[2]);
        
        const eventDate = new Date(eYear, eMonth, eDay);
        
        return eventDate >= startDate && eventDate <= endDate;
    } catch {
        return false;
    }
};

// NEW: Helper to parse specific Malay date string to Date object
const parseMalayDate = (dateStr: string): Date | null => {
  const months: { [key: string]: number } = {
    'jan': 0, 'feb': 1, 'mac': 2, 'apr': 3, 'mei': 4, 'jun': 5,
    'jul': 6, 'ogos': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dis': 11,
    'ogo': 7
  };
  try {
    const parts = dateStr.trim().split(' ');
    if (parts.length < 3) return null;
    const day = parseInt(parts[0]);
    const monthStr = parts[1].toLowerCase().substring(0, 3);
    const year = parseInt(parts[2]);
    const month = months[monthStr];
    if (isNaN(day) || isNaN(year) || month === undefined) return null;
    return new Date(year, month, day);
  } catch { return null; }
};

// NEW: Helper to get current week range (Monday - Sunday) based on system date
const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  // Adjust to make Monday (1) the start of week. If Sunday (0), go back 6 days.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
};

export const Dashboard: React.FC = () => {
  const { 
    user, permissions, announcements, siteConfig, updateSiteConfig, 
    addAnnouncement, updateAnnouncement, deleteAnnouncement, 
    checkPermission, showToast,
    speechSchedule, teacherGroups, kokoWeeklyData, kokoAssemblyData,
    sumurSchedule, hipSchedule
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempWelcome, setTempWelcome] = useState(siteConfig.welcomeMessage);
  
  // Current Week Logic (Derived)
  const { currentWeekItem, currentGroupMembers, currentKokoActivity, currentKokoAssembly } = React.useMemo(() => {
      const found = speechSchedule.find(item => isDateInCurrentWeek(item.date));
      if (!found) return { currentWeekItem: null, currentGroupMembers: [], currentKokoActivity: null, currentKokoAssembly: null };

      const group = teacherGroups.find(g => g.name === found.group);
      const members = group ? group.members : [];
      
      const kokoMatch = kokoWeeklyData.find(k => isEventInWeek(k.date, found.date));
      const kokoAssemblyMatch = kokoAssemblyData.find(k => isEventInWeek(k.date, found.date));

      return {
          currentWeekItem: found,
          currentGroupMembers: members,
          currentKokoActivity: kokoMatch || null,
          currentKokoAssembly: kokoAssemblyMatch || null
      };
  }, [speechSchedule, teacherGroups, kokoWeeklyData, kokoAssemblyData]);
  
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  
  // Specific Program Logic (Derived)
  const { currentSumurProgram, currentHayyaProgram, currentEnglishProgram } = React.useMemo(() => {
      const { start, end } = getCurrentWeekRange();

      // Filter sumurSchedule for current week matches
      const weeklySumurEvents = sumurSchedule.filter(s => {
          const d = parseMalayDate(s.date);
          return d && d >= start && d <= end;
      });

      return {
          currentSumurProgram: weeklySumurEvents.find(e => e.program.trim().toUpperCase() === 'SUMUR') || null,
          currentHayyaProgram: weeklySumurEvents.find(e => e.program.trim().toUpperCase().includes('HAYYA')) || null,
          currentEnglishProgram: weeklySumurEvents.find(e => e.program.trim().toUpperCase().includes('ENGLISH')) || null
      };
  }, [sumurSchedule]);

  // Announcement Modal State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState<Partial<Announcement>>({ title: '', date: '', summary: '' });
  
  // View Announcement Modal State
  const [viewingAnnounce, setViewingAnnounce] = useState<Announcement | null>(null);

  // Program Modal State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programForm, setProgramForm] = useState<Partial<Program>>({ 
      title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' 
  });

  const canEditWelcome = user?.role === 'adminsistem'; 
  const canUpdatePengumuman = checkPermission('canUpdatePengumuman');

  const saveEdit = () => {
    updateSiteConfig({ welcomeMessage: tempWelcome });
    setIsEditing(false);
  };

  const handleOpenAnnounceModal = (ann?: Announcement) => {
    setAnnounceForm(ann || { title: '', date: '', summary: '' });
    setShowAnnounceModal(true);
  };

  const [viewedIds, setViewedIds] = useState<number[]>(() => {
    try {
        const stored = sessionStorage.getItem('viewed_announcements');
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try {
        const stored = localStorage.getItem('liked_announcements');
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const upcomingTakwimActivities = React.useMemo(() => {
    const units = ['Pentadbiran', 'Kurikulum', 'Hal Ehwal Murid', 'Kokurikulum'];
    const allActivities: { id: number; event: string; date: string; status: string; unit: string; dateObj: Date }[] = [];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed
    const currentYear = currentDate.getFullYear();

    // 1. Standard Takwim from LocalStorage for each unit
    units.forEach(unit => {
      const storageKey = `smaam_data_${unit}_Takwim`;
      const localData = localStorage.getItem(storageKey);
      let items: { id: number; event: string; date: string; status: string }[];
      if (localData && localData !== "undefined" && localData !== "null") {
        try {
          items = JSON.parse(localData);
        } catch {
          items = getInitialItems(unit, 'Takwim');
        }
      } else {
        items = getInitialItems(unit, 'Takwim');
      }

      items.forEach((item) => {
        if (item.date && item.event) {
          const parts = item.date.split('-');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            
            if (month === (currentMonth + 1) && year === currentYear) {
              const dateObj = new Date(year, month - 1, day);
              allActivities.push({
                ...item,
                unit,
                dateObj
              });
            }
          }
        }
      });
    });

    // 2. Koko Weekly Data
    kokoWeeklyData.forEach(item => {
        const d = parseMalayDate(item.date);
        if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            allActivities.push({
                id: item.id + 20000,
                event: item.activity,
                date: item.date,
                status: 'Akan Datang',
                unit: 'Kokurikulum',
                dateObj: d
            });
        }
    });

    // 3. Koko Assembly Data
    kokoAssemblyData.forEach(item => {
        const d = parseMalayDate(item.date);
        if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            allActivities.push({
                id: item.id + 30000,
                event: `Perhimpunan Bulanan: ${item.unit}`,
                date: item.date,
                status: 'Akan Datang',
                unit: 'Kokurikulum',
                dateObj: d
            });
        }
    });

    // 4. Sumur Schedule
    sumurSchedule.forEach(item => {
        const d = parseMalayDate(item.date);
        if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            allActivities.push({
                id: item.id + 40000,
                event: `${item.program}: ${item.activity}`,
                date: item.date,
                status: 'Akan Datang',
                unit: 'Hal Ehwal Murid',
                dateObj: d
            });
        }
    });

    // 5. HIP Schedule
    hipSchedule.forEach(item => {
        const d = parseMalayDate(item.date);
        if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            allActivities.push({
                id: item.id + 50000,
                event: `${item.program}: ${item.activity}`,
                date: item.date,
                status: 'Akan Datang',
                unit: 'Hal Ehwal Murid',
                dateObj: d
            });
        }
    });

    // 6. Exam Weeks (Peperiksaan)
    const examDataKey = 'smaam_data_Kurikulum_Peperiksaan';
    const savedExams = localStorage.getItem(examDataKey);
    let examItems: any[] = [];
    if (savedExams) {
        try { examItems = JSON.parse(savedExams); } catch { examItems = []; }
    }

    examItems.forEach((item: any) => {
        // Exam dates are ranges like "12 – 16 Jan 2026"
        // We check if the range overlaps with the current month
        const rangeParts = item.date.split('–').map((s: string) => s.trim());
        if (rangeParts.length === 2) {
            const endD = parseMalayDate(rangeParts[1]);
            if (endD && endD.getMonth() === currentMonth && endD.getFullYear() === currentYear) {
                // Check if there's actual exam content
                const content = [item.dalaman, item.jaj, item.awam].filter(c => c && c.trim() !== '').join('; ');
                if (content && !item.isHoliday) {
                    allActivities.push({
                        id: item.id + 60000,
                        event: `Peperiksaan: ${content}`,
                        date: item.date,
                        status: 'Akan Datang',
                        unit: 'Kurikulum',
                        dateObj: endD
                    });
                }
            }
        }
    });

    // Group by date
    const grouped: { [key: string]: { id: number; event: string; date: string; status: string; unit: string; dateObj: Date; unitList: string[]; eventList: string[] } } = {};
    allActivities.forEach(item => {
      const dateKey = item.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          ...item,
          unitList: [item.unit],
          eventList: [item.event]
        };
      } else {
        if (!grouped[dateKey].unitList.includes(item.unit)) {
            grouped[dateKey].unitList.push(item.unit);
        }
        if (!grouped[dateKey].eventList.includes(item.event)) {
          grouped[dateKey].eventList.push(item.event);
        }
      }
    });

    const finalActivities = Object.values(grouped).map((group) => ({
      ...group,
      unit: group.unitList.join('/'),
      event: group.eventList.join(' / ')
    }));

    finalActivities.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    return finalActivities;
  }, [kokoWeeklyData, kokoAssemblyData, sumurSchedule, hipSchedule]);

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...announceForm, id: announceForm.id || Date.now(), views: announceForm.views || 0, likes: announceForm.likes || 0 } as Announcement;
    if (announceForm.id) {
        updateAnnouncement(payload);
    } else {
        addAnnouncement(payload);
    }
    showToast(announceForm.id ? "Pengumuman dikemaskini." : "Pengumuman ditambah.");
    setShowAnnounceModal(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
      if(window.confirm("Padam pengumuman ini?")) { deleteAnnouncement(id); showToast("Pengumuman dipadam."); }
  };

  // --- Handlers for Likes and Views ---

  const handleViewAnnouncement = (item: Announcement) => {
      setViewingAnnounce(item);
      
      // Increment view only if not viewed in this session
      if (!viewedIds.includes(item.id)) {
          const newViews = (item.views || 0) + 1;
          const updatedItem = { ...item, views: newViews };
          
          // Update global state
          updateAnnouncement(updatedItem);
          
          // Update session storage
          const newViewedIds = [...viewedIds, item.id];
          setViewedIds(newViewedIds);
          sessionStorage.setItem('viewed_announcements', JSON.stringify(newViewedIds));
      }
  };

  const handleLikeAnnouncement = (e: React.MouseEvent, item: Announcement) => {
      e.stopPropagation();
      const isLiked = likedIds.includes(item.id);
      
      // If liked, unlike (decrement). If not liked, like (increment).
      const newLikes = isLiked ? Math.max(0, (item.likes || 0) - 1) : (item.likes || 0) + 1;
      const updatedItem = { ...item, likes: newLikes };
      
      updateAnnouncement(updatedItem);

      // Update Local Storage
      let newLikedIds;
      if (isLiked) {
          newLikedIds = likedIds.filter(id => id !== item.id);
          showToast("Batal suka.");
      } else {
          newLikedIds = [...likedIds, item.id];
          showToast("Anda menyukai pengumuman ini.");
      }
      setLikedIds(newLikedIds);
      localStorage.setItem('liked_announcements', JSON.stringify(newLikedIds));
  };

  const handleDateChange = (value: string, type: 'announce' | 'program') => {
      const parts = value.split('-');
      const formatted = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
      if (type === 'announce') {
          setAnnounceForm({...announceForm, date: formatted});
      } else {
          setProgramForm({...programForm, date: formatted});
      }
  };

  const formatDateForInput = (dateStr?: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  };

  const formatDisplayDate = (dateStr: string) => {
      if (!dateStr) return '';
      // Check if already in dd-mm-yyyy to avoid double formatting if data source changes
      if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}-${m}-${y}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in pb-24 relative font-sans">
      
      {/* Sticky Section Header */}
      <div className="sticky top-0 z-20 bg-[#A9CCE3]/95 backdrop-blur-md pt-4 pb-4 border-b border-[#2DD4BF] flex flex-col md:flex-row justify-between items-end gap-2 -mx-4 md:-mx-8 px-4 md:px-8 mb-6 shadow-sm">
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={tempWelcome} 
                onChange={(e) => setTempWelcome(e.target.value)}
                className="bg-white border border-[#2DD4BF] text-[#0B132B] px-3 py-1.5 rounded font-bold shadow-inner w-full md:w-96"
              />
              <button onClick={saveEdit} className="text-white bg-[#006D77] px-4 py-1.5 rounded text-sm font-bold shadow-md">Simpan</button>
            </div>
          ) : (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B132B] tracking-tight drop-shadow-sm leading-tight">
              {siteConfig.welcomeMessage}
              {canEditWelcome && (
                <button onClick={() => setIsEditing(true)} className="ml-3 text-sm text-[#006064] hover:text-[#0B132B] font-medium underline">
                  Edit
                </button>
              )}
            </h2>
          )}
          <p className="text-[#1C2541] font-semibold opacity-80 mt-1 text-sm tracking-wide">Paparan Utama Maklumat Digital SMAAM 2026</p>
        </div>
        <div className="text-[#006064] text-xs md:text-sm font-black uppercase tracking-widest border-b-4 border-[#2DD4BF] pb-1">
          SESI PERSEKOLAHAN 2026
        </div>
      </div>

      {/* STATS BOXES - ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        
        {/* CARD 1: Guru Bertugas Minggu Ini */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-[#2DD4BF] hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.Teachers />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div>
                <p className="text-[#2DD4BF] text-xs font-bold uppercase tracking-widest mb-1">Guru Bertugas Minggu Ini</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-medium text-white group-hover:text-[#2DD4BF] transition-colors leading-tight">
                        {currentWeekItem ? currentWeekItem.group : "Tiada rekod minggu ini"}
                    </h3>
                    {currentWeekItem && (
                        <span className="text-[10px] bg-[#2DD4BF] text-[#0B132B] px-1.5 py-0.5 rounded font-bold">M{currentWeekItem.week}</span>
                    )}
                </div>
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-[#2DD4BF]/30 text-[#2DD4BF] shadow-inner group-hover:scale-110 group-hover:bg-[#2DD4BF] group-hover:text-[#0B132B] transition-all">
                <Icons.Teachers />
              </div>
            </div>
            <div className="relative z-10 mt-2">
                {currentGroupMembers.length > 0 ? (
                    <ul className="text-xs text-gray-300 space-y-1">
                        {currentGroupMembers.slice(0, 3).map((m, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>
                                <span className="line-clamp-1">{m}</span>
                            </li>
                        ))}
                        {currentGroupMembers.length > 3 && (
                            <li 
                                className="text-[#2DD4BF] font-bold pl-2.5 cursor-pointer hover:underline hover:text-white transition-colors italic"
                                onClick={() => setShowTeachersModal(true)}
                            >
                                Lihat Semua...
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-xs text-gray-500 italic">-</p>
                )}
            </div>
        </div>

        {/* CARD 2: PERHIMPUNAN (Revised Logic) */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-[#C9B458] hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.Students />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="flex-1 pr-2">
                <p className="text-[#C9B458] text-xs font-bold uppercase tracking-widest mb-1">
                    {currentKokoAssembly ? "PERHIMPUNAN KOKURIKULUM" : "PERHIMPUNAN RASMI"}
                </p>
                {currentKokoAssembly ? (
                    <>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Unit Bertugas:</span>
                        <h3 className="text-lg font-medium text-white group-hover:text-[#C9B458] transition-colors leading-tight line-clamp-2">
                           {currentKokoAssembly.unit}
                        </h3>
                    </>
                ) : (
                    currentWeekItem ? (
                        <>
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Guru Berucap:</span>
                            <h3 className="text-lg font-medium text-white group-hover:text-[#C9B458] transition-colors leading-tight line-clamp-2">
                                {currentWeekItem.speaker}
                            </h3>
                        </>
                    ) : (
                        <h3 className="text-lg font-medium text-white group-hover:text-[#C9B458] transition-colors leading-tight line-clamp-2">
                            Tiada rekod minggu ini
                        </h3>
                    )
                )}
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-[#C9B458]/30 text-[#C9B458] shadow-inner group-hover:scale-110 group-hover:bg-[#C9B458] group-hover:text-[#0B132B] transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
            </div>
            <div className="relative z-10 mt-auto">
                {currentKokoAssembly ? (
                    <>
                        <p className="text-xs text-white font-semibold line-clamp-1 italic mb-1">{currentKokoAssembly.notes}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{currentKokoAssembly.date}</p>
                    </>
                ) : (
                    currentWeekItem ? (
                        <>
                            <p className="text-xs text-white font-semibold line-clamp-1 italic mb-1">"{currentWeekItem.topic}"</p>
                            <p className="text-[10px] text-gray-400 font-mono">{currentWeekItem.date}</p>
                        </>
                    ) : (
                        <p className="text-xs text-gray-500 italic">-</p>
                    )
                )}
            </div>
        </div>

        {/* CARD 3: PERJUMPAAN KOKURIKULUM MINGGU INI (NEW) */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-green-400 hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.CalendarCheck />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="flex-1 pr-2">
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1 leading-tight">PERJUMPAAN KOKURIKULUM MINGGU INI</p>
                {currentKokoActivity ? (
                    <>
                       <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors leading-tight line-clamp-3 mt-1">
                           {currentKokoActivity.activity}
                       </h3>
                       <p className="text-xs text-green-200/80 font-mono mt-2">{currentKokoActivity.date}</p>
                    </>
                ) : (
                    <h3 className="text-base font-bold text-gray-400 italic mt-2">Tiada perjumpaan minggu ini</h3>
                )}
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-green-400/30 text-green-400 shadow-inner group-hover:scale-110 group-hover:bg-green-400 group-hover:text-[#0B132B] transition-all">
                <Icons.CalendarCheck />
              </div>
            </div>
        </div>

      </div>

      {/* STATS BOXES - ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 4: SUMUR (PINK) */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-pink-500 hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.HandHeart />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="flex-1 pr-2">
                <p className="text-pink-500 text-xs font-bold uppercase tracking-widest mb-1">SUMUR</p>
                {currentSumurProgram ? (
                    <>
                        <h3 className="text-lg font-medium text-white group-hover:text-pink-300 transition-colors leading-tight line-clamp-2 mt-1">
                            {currentSumurProgram.activity || "SUMUR"}
                        </h3>
                        <p className="text-[10px] text-pink-200/70 font-mono mt-2">{currentSumurProgram.date}</p>
                    </>
                ) : (
                    <p className="text-xs text-gray-500 italic mt-2">Tiada aktiviti minggu ini</p>
                )}
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-pink-500/30 text-pink-500 shadow-inner group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-[#0B132B] transition-all">
                <Icons.HandHeart />
              </div>
            </div>
        </div>

        {/* CARD 5: HAYYA BIL ARABIAH (PURPLE) */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-purple-400 hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.BookOpen />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="flex-1 pr-2">
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">HAYYA BIL ARABIAH</p>
                {currentHayyaProgram ? (
                    <>
                        <h3 className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors leading-tight line-clamp-2 mt-1">
                            {currentHayyaProgram.activity}
                        </h3>
                        {currentHayyaProgram.teacher && (
                            <p className="text-[10px] text-gray-300 mt-1 line-clamp-1">Guru: {currentHayyaProgram.teacher}</p>
                        )}
                        <p className="text-[10px] text-purple-200/70 font-mono mt-1">{currentHayyaProgram.date}</p>
                    </>
                ) : (
                    <p className="text-xs text-gray-500 italic mt-2">Tiada aktiviti minggu ini</p>
                )}
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-purple-400/30 text-purple-400 shadow-inner group-hover:scale-110 group-hover:bg-purple-400 group-hover:text-[#0B132B] transition-all">
                <Icons.BookOpen />
              </div>
            </div>
        </div>

        {/* CARD 6: OH MY ENGLISH ! */}
        <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-orange-400 hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               <Icons.Globe />
            </div>
            <div className="flex justify-between items-start relative z-10 mb-2">
              <div className="flex-1 pr-2">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">OH MY ENGLISH !</p>
                {currentEnglishProgram ? (
                    <>
                        <h3 className="text-lg font-medium text-white group-hover:text-orange-300 transition-colors leading-tight line-clamp-2 mt-1">
                            {currentEnglishProgram.activity || "English Day"}
                        </h3>
                        {currentEnglishProgram.teacher && (
                            <p className="text-[10px] text-gray-300 mt-1 line-clamp-1">Guru: {currentEnglishProgram.teacher}</p>
                        )}
                        <p className="text-[10px] text-orange-200/70 font-mono mt-1">{currentEnglishProgram.date}</p>
                    </>
                ) : (
                    <p className="text-xs text-gray-500 italic mt-2">Tiada aktiviti minggu ini</p>
                )}
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-orange-400/30 text-orange-400 shadow-inner group-hover:scale-110 group-hover:bg-orange-400 group-hover:text-[#0B132B] transition-all">
                <Icons.Globe />
              </div>
            </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PENGUMUMAN - Dark Navy Background with Turquoise Highlights */}
        {permissions.pengumuman && (
          <div className="lg:col-span-2 bg-[#0B132B] rounded-xl shadow-2xl overflow-hidden border border-[#2DD4BF]/30 flex flex-col">
            <div className="p-5 border-b border-[#2DD4BF]/30 flex justify-between items-center bg-[#003840]/30">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#2DD4BF]"><Icons.Megaphone /></span> Pengumuman Terkini
              </h3>
              {canUpdatePengumuman && (
                <button 
                  onClick={() => handleOpenAnnounceModal()}
                  className="text-xs bg-[#006064] text-white px-4 py-2 rounded-full font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] transition-colors uppercase tracking-wider flex items-center gap-2 shadow-lg border border-[#2DD4BF]/50"
                >
                  <Icons.Plus /> Tambah
                </button>
              )}
            </div>
            <div className="p-6 space-y-4 flex-1">
              {announcements.map((item) => (
                <div key={item.id} className="bg-[#162e4a] p-5 rounded-xl border border-[#2DD4BF]/10 hover:border-[#2DD4BF]/50 transition-all group shadow-lg relative">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                    <h4 
                        onClick={() => handleViewAnnouncement(item)}
                        className="font-bold text-white text-lg hover:text-[#2DD4BF] transition-colors leading-tight cursor-pointer"
                    >
                        {item.title}
                    </h4>
                    <span className="text-xs bg-[#004e64] text-[#2DD4BF] border border-[#2DD4BF]/30 px-2 py-1 rounded font-bold self-start">
                        {formatDisplayDate(item.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed">{item.summary}</p>
                  
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span className="flex items-center gap-1 cursor-default text-[#2DD4BF]">
                          👁️ {item.views} Paparan
                        </span>
                        <span 
                            onClick={(e) => handleLikeAnnouncement(e, item)}
                            className={`flex items-center gap-1 cursor-pointer transition-colors hover:scale-110 active:scale-95 ${likedIds.includes(item.id) ? 'text-red-500' : 'hover:text-red-400'}`}
                        >
                          ❤️ {item.likes} Suka
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                         <button onClick={() => handleViewAnnouncement(item)} className="text-[#2DD4BF] hover:text-white text-xs font-bold bg-[#0B132B] px-3 py-1.5 rounded border border-[#2DD4BF]/50">BACA</button>
                         {canUpdatePengumuman && (
                             <>
                                <button onClick={() => handleOpenAnnounceModal(item)} className="text-blue-300 hover:text-white text-sm bg-[#0B132B] p-1.5 rounded border border-blue-900" title="Edit">✏️</button>
                                <button onClick={() => handleDeleteAnnouncement(item.id)} className="text-red-400 hover:text-white text-sm bg-[#0B132B] p-1.5 rounded border border-red-900" title="Hapus">🗑️</button>
                             </>
                         )}
                      </div>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-gray-500 text-center text-sm py-8 italic">Tiada pengumuman.</p>}
            </div>
          </div>
        )}

        {/* PROGRAM - Dark Navy with Turquoise Accents */}
        {permissions.program && (
          <div className="bg-[#0B132B] rounded-xl shadow-2xl overflow-hidden border border-[#2DD4BF]/30 flex flex-col">
             <div className="p-5 border-b border-[#2DD4BF]/30 flex justify-between items-center bg-[#003840]/30">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#2DD4BF]"><Icons.Target /></span> Program Bulan Ini
              </h3>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar max-h-[500px]">
              {upcomingTakwimActivities.map((prog, idx) => (
                <div key={`${prog.id}-${idx}`} className="relative pl-6 border-l-2 border-[#2DD4BF]/20 hover:border-[#2DD4BF] transition-colors group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0B132B] border-2 border-[#2DD4BF] group-hover:scale-110 transition-transform"></div>
                  <span className="text-xs text-[#2DD4BF] font-bold mb-1 block uppercase tracking-wider">{formatDisplayDate(prog.date)}</span>
                  <div className="flex justify-between items-start">
                     <h4 className="text-sm font-bold text-white uppercase leading-tight">{prog.event}</h4>
                  </div>
                  <span className="inline-block mt-3 text-[0.65rem] font-bold bg-[#003840] px-3 py-1 rounded-full text-[#2DD4BF] border border-[#2DD4BF]/30 uppercase tracking-wider">
                    {prog.unit}
                  </span>
                </div>
              ))}
              {upcomingTakwimActivities.length === 0 && <p className="text-gray-500 text-center text-sm py-8 italic">Tiada aktiviti takwim sepanjang bulan ini.</p>}
            </div>
          </div>
        )}
      </div>

      {/* VIEW ALL TEACHERS MODAL */}
      {showTeachersModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm fade-in px-4 pt-24" onClick={() => setShowTeachersModal(false)}>
            <div className="bg-[#1C2541] w-full max-w-sm p-6 rounded-xl border-2 border-[#2DD4BF] shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b border-[#2DD4BF]/30 pb-3">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">Guru Bertugas</h3>
                    <button onClick={() => setShowTeachersModal(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                
                <div className="mb-4">
                    <p className="text-xs text-[#2DD4BF] uppercase font-bold tracking-widest">Kumpulan</p>
                    <p className="text-white font-black text-xl">{currentWeekItem?.group || "Tiada Data"}</p>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-[#0B132B]/50 rounded-lg border border-gray-700 p-2">
                    {currentGroupMembers.length > 0 ? (
                        <ul className="space-y-2">
                            {currentGroupMembers.map((m, i) => (
                                <li key={i} className="flex items-center gap-3 p-2 hover:bg-[#253252] rounded transition-colors group">
                                    <span className="w-6 h-6 rounded-full bg-[#2DD4BF] text-[#0B132B] flex items-center justify-center text-xs font-bold shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-300 text-sm font-medium group-hover:text-white">{m}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 text-sm py-4 italic">Tiada senarai nama.</p>
                    )}
                </div>
                
                <div className="mt-4 text-center">
                    <button onClick={() => setShowTeachersModal(false)} className="text-xs text-gray-400 hover:text-white underline">Tutup Senarai</button>
                </div>
            </div>
        </div>
      )}

      {/* VIEW ANNOUNCEMENT MODAL */}
      {viewingAnnounce && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md fade-in px-4" onClick={() => setViewingAnnounce(null)}>
             <div className="bg-[#1C2541] w-full max-w-2xl p-8 rounded-2xl border-2 border-[#2DD4BF] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative" onClick={(e) => e.stopPropagation()}>
                 <button onClick={() => setViewingAnnounce(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>
                 
                 <div className="mb-6 border-b border-gray-700 pb-4">
                    <span className="text-xs bg-[#004e64] text-[#2DD4BF] border border-[#2DD4BF]/30 px-3 py-1 rounded font-bold">{formatDisplayDate(viewingAnnounce.date)}</span>
                    <h3 className="text-2xl font-bold text-white mt-3 leading-tight">{viewingAnnounce.title}</h3>
                 </div>
                 
                 <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                    {viewingAnnounce.summary}
                 </div>

                 <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex gap-4 text-sm font-bold">
                        <span className="text-[#2DD4BF]">👁️ {viewingAnnounce.views}</span>
                        <span className="text-red-400">❤️ {viewingAnnounce.likes}</span>
                    </div>
                    <button onClick={() => setViewingAnnounce(null)} className="bg-[#006064] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] transition-colors text-sm">
                        Tutup
                    </button>
                 </div>
             </div>
          </div>
      )}

      {/* Reusable Edit/Add Modal Structure */}
      {(showAnnounceModal || showProgramModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-2xl border-2 border-[#2DD4BF] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 uppercase tracking-wide">
                     {showAnnounceModal 
                        ? (announceForm.id ? 'Kemaskini Pengumuman' : 'Tambah Pengumuman') 
                        : (programForm.id ? 'Kemaskini Program' : 'Tambah Program')
                     }
                 </h3>
                 
                 <form onSubmit={showAnnounceModal ? handleSaveAnnouncement : handleSaveProgram} className="space-y-5">
                     {showAnnounceModal ? (
                       <>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Tajuk</label>
                             <input required type="text" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#2DD4BF] outline-none transition-all text-sm" />
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Tarikh</label>
                             <input required type="date" value={formatDateForInput(announceForm.date)} onChange={e => handleDateChange(e.target.value, 'announce')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#2DD4BF] outline-none text-sm" />
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Kandungan Ringkas</label>
                             <textarea required value={announceForm.summary} onChange={e => setAnnounceForm({...announceForm, summary: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white h-32 focus:border-[#2DD4BF] outline-none resize-none text-sm leading-relaxed" />
                         </div>
                       </>
                     ) : (
                       <>
                         {/* Program Fields */}
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Nama Program</label>
                             <input required type="text" value={programForm.title} onChange={e => setProgramForm({...programForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2DD4BF] outline-none text-sm" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Tarikh</label><input required type="date" value={formatDateForInput(programForm.date)} onChange={e => handleDateChange(e.target.value, 'program')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                             <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Masa</label><input type="text" value={programForm.time} onChange={e => setProgramForm({...programForm, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                         </div>
                         <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Tempat</label><input type="text" value={programForm.location} onChange={e => setProgramForm({...programForm, location: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Kategori</label>
                             <select required value={programForm.category} onChange={e => setProgramForm({...programForm, category: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]">
                                 <option value="Kurikulum">Kurikulum</option><option value="HEM">HEM</option><option value="Kokurikulum">Kokurikulum</option><option value="Sukan">Sukan</option><option value="Lain-lain">Lain-lain</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Laporan</label>
                             <textarea required value={programForm.description} onChange={e => setProgramForm({...programForm, description: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white h-24 text-sm focus:border-[#2DD4BF] outline-none" />
                         </div>
                       </>
                     )}
                     
                     <div className="flex gap-3 pt-4">
                         <button type="button" onClick={() => { setShowAnnounceModal(false); setShowProgramModal(false); }} className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 font-bold transition-all text-sm uppercase tracking-wide">Batal</button>
                         <button type="submit" className="flex-1 py-3 bg-[#006064] text-white rounded-xl font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] shadow-lg transition-all text-sm uppercase tracking-wide">SIMPAN</button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};
