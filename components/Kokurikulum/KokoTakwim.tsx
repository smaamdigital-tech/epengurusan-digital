import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { apiService } from '@/services/api';
import { PrintPreviewModal } from '../PrintPreviewModal';

// --- HELPER FUNCTIONS ---
const dateToISO = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parts = dateStr.split(' ');
    if (parts.length < 3) return '';
    
    const monthMap: Record<string, string> = {
        'jan': '01', 'feb': '02', 'mac': '03', 'apr': '04', 'mei': '05', 'jun': '06',
        'jul': '07', 'ogos': '08', 'ogo': '08', 'sep': '09', 'okt': '10', 'nov': '11', 'dis': '12'
    };
    
    let day = parts[0].padStart(2, '0');
    const monthStr = parts[1].toLowerCase().substring(0, 3);
    const year = parts[2];
    
    const month = monthMap[monthStr];
    if (!month) return ''; 
    return `${year}-${month}-${day}`;
};

const ISOToMalay = (isoStr: string) => {
    if (!isoStr) return '';
    const [year, month, day] = isoStr.split('-');
    if (!year || !month || !day) return isoStr;
    const mIndex = parseInt(month) - 1;
    const malayMonths = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
    if (mIndex < 0 || mIndex > 11) return isoStr;
    return `${parseInt(day)} ${malayMonths[mIndex]} ${year}`;
};

const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date(8640000000000000); 
    
    const months: Record<string, number> = {
        'jan': 0, 'feb': 1, 'mac': 2, 'apr': 3, 'mei': 4, 'jun': 5,
        'jul': 6, 'ogos': 7, 'ogo': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dis': 11,
        'sept': 8, 'julai': 6
    };
    
    try {
        const parts = dateStr.trim().split(' ');
        if (parts.length < 3) return new Date(8640000000000000);
        
        const day = parseInt(parts[0]);
        const monthStr = parts[1].toLowerCase().substring(0, 3);
        const year = parseInt(parts[2]);
        
        const month = months[monthStr] !== undefined ? months[monthStr] : 0;
        return new Date(year, month, day);
    } catch {
        return new Date(8640000000000000);
    }
};

const parseRangeFromString = (rangeStr: string): { start: Date, end: Date } | null => {
  if (!rangeStr) return null;
  const monthsMap: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'julai':6, 'ogos':7, 'ogo':7, 'sep':8, 'sept':8, 'okt':9, 'nov':10, 'dis':11 };
  
  const cleanRange = rangeStr.replace(/\s+/g, ' ').trim();
  const parts = cleanRange.split(/–|-/).map(s => s.trim());
  if (parts.length !== 2) return null;

  let start: Date, end: Date;

  if (parts[0].includes('.')) {
     const parseDot = (s: string) => {
         const [d, m, y] = s.split('.').map(Number);
         return new Date(y, m-1, d);
     };
     start = parseDot(parts[0]);
     end = parseDot(parts[1]);
  } else {
     const endParts = parts[1].split(' '); 
     if (endParts.length < 3) return null;
     
     const year = parseInt(endParts[endParts.length - 1]);
     const endMonthStr = endParts[endParts.length - 2].toLowerCase();
     const endMonth = monthsMap[endMonthStr] || 0;
     const endDay = parseInt(endParts[0]);
     
     end = new Date(year, endMonth, endDay);

     const startParts = parts[0].split(' ');
     let startDay = parseInt(startParts[0]);
     let startMonth = endMonth; 
     
     if (startParts.length > 1) {
         const startMonthStr = startParts[1].toLowerCase();
         if (monthsMap[startMonthStr] !== undefined) startMonth = monthsMap[startMonthStr];
     }
     
     start = new Date(year, startMonth, startDay);
  }
  
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  
  return { start, end };
};

const getUnitBadgeColor = (unit: string) => {
    const u = unit.toLowerCase();
    if (u.includes('cuti')) return 'bg-red-900/50 text-red-300';
    if (u.includes('kadet remaja sekolah')) return 'bg-teal-900/60 text-teal-200'; 
    if (u.includes('puteri islam')) return 'bg-pink-900/60 text-pink-300'; 
    if (u.includes('pengakap')) return 'bg-slate-600/60 text-slate-300'; 
    if (u.includes('pandu puteri')) return 'bg-sky-900/60 text-sky-300'; 
    return 'bg-blue-900/30 text-blue-200'; 
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGOS', 'SEP', 'OKT', 'NOV', 'DIS'];
const daysLetters = ['I', 'S', 'R', 'K', 'J', 'S', 'A']; 
const year = 2026;

// --- HOLIDAY DATA (Synced with Kurikulum) ---
const SCHOOL_HOLIDAYS = [
    { id: 1001, event: 'Cuti Penggal 1', date: '21 – 29 Mac 2026' },
    { id: 1002, event: 'Cuti Penggal 2', date: '23.05.2026 – 07.06.2026' },
    { id: 1003, event: 'Cuti Pertengahan Tahun', date: '29.08.2026 – 06.09.2026' },
    { id: 1004, event: 'Cuti Akhir Persekolahan Tahun', date: '02.12.2026 – 31.12.2026' },
];

const getDayLetter = (monthIdx: number, day: number) => {
    const d = new Date(year, monthIdx, day);
    if (d.getMonth() !== monthIdx) return null; 
    const dayIndex = d.getDay(); 
    const mappedIndex = (dayIndex + 6) % 7;
    return daysLetters[mappedIndex];
};

export const KokoTakwim: React.FC = () => {
  const { 
    user, showToast, checkPermission, 
    kokoWeeklyData, updateKokoWeeklyData,
    kokoAssemblyData, updateKokoAssemblyData
  } = useApp();

  const isSystemAdmin = user?.role === 'adminsistem';
  const canEdit = checkPermission('canUpdateKokoTakwim');

  // Local State
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'weekly' | 'monthly' | 'title_weekly' | 'title_monthly' | null>(null);
  
  const [kokoTitles, setKokoTitles] = useState({
      weekly: 'TAKWIM PERJUMPAAN MINGGUAN KOKURIKULUM – TAHUN 2026',
      monthly: 'JADUAL PERHIMPUNAN BULANAN KOKURIKULUM – TAHUN 2026'
  });

  const [formData, setFormData] = useState({
    date: '', 
    activity: '', 
    month: '', 
    unit: '', 
    title: '', 
    notes: ''
  });

  // Load Data with Safety Check
  useEffect(() => {
    const loadKoko = async () => {
        const savedWeekly = await apiService.read('smaam_koko_weekly');
        const savedAssembly = await apiService.read('smaam_koko_assembly');
        const savedTitles = await apiService.read('smaam_koko_titles');
        
        if (savedWeekly && Array.isArray(savedWeekly) && savedWeekly.length > 0) {
            updateKokoWeeklyData(savedWeekly);
        }
        if (savedAssembly && Array.isArray(savedAssembly) && savedAssembly.length > 0) {
            updateKokoAssemblyData(savedAssembly);
        }
        if (savedTitles) setKokoTitles(savedTitles);
    };
    loadKoko();
  }, []);

  // Handlers
  const handleOpenModal = (type: 'weekly' | 'monthly' | 'title_weekly' | 'title_monthly', item?: any) => {
      setEditingType(type);
      setEditingId(item ? item.id : null);
      
      if (type === 'weekly') {
          setFormData({ ...formData, date: item?.date || '', activity: item?.activity || '' });
      } else if (type === 'monthly') {
          setFormData({ ...formData, month: item?.month || '', date: item?.date || '', unit: item?.unit || '', notes: item?.notes || '' });
      } else if (type.startsWith('title')) {
          setFormData({ ...formData, title: type === 'title_weekly' ? kokoTitles.weekly : kokoTitles.monthly });
      }
      
      setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editingType === 'title_weekly' || editingType === 'title_monthly') {
          const newTitles = { ...kokoTitles };
          if (editingType === 'title_weekly') newTitles.weekly = formData.title;
          else newTitles.monthly = formData.title;
          setKokoTitles(newTitles);
          apiService.write('smaam_koko_titles', newTitles);
          showToast("Tajuk dikemaskini.");
      } else if (editingType === 'weekly') {
          const payload = { id: editingId || Date.now(), date: formData.date, activity: formData.activity };
          const newData = editingId ? kokoWeeklyData.map(i => i.id === editingId ? payload : i) : [...kokoWeeklyData, payload];
          updateKokoWeeklyData(newData);
          apiService.write('smaam_koko_weekly', newData);
          showToast(editingId ? "Rekod dikemaskini." : "Rekod ditambah.");
      } else if (editingType === 'monthly') {
          const payload = { id: editingId || Date.now(), month: formData.month, date: formData.date, unit: formData.unit, notes: formData.notes };
          const newData = editingId ? kokoAssemblyData.map(i => i.id === editingId ? payload : i) : [...kokoAssemblyData, payload];
          updateKokoAssemblyData(newData);
          apiService.write('smaam_koko_assembly', newData);
          showToast(editingId ? "Rekod dikemaskini." : "Rekod ditambah.");
      }
      
      setIsModalOpen(false);
  };

  const handleDelete = (type: 'weekly' | 'monthly', id: number) => {
      if(confirm("Padam rekod ini?")) {
          if (type === 'weekly') {
              const newData = kokoWeeklyData.filter(i => i.id !== id);
              updateKokoWeeklyData(newData);
              apiService.write('smaam_koko_weekly', newData);
          } else {
              const newData = kokoAssemblyData.filter(i => i.id !== id);
              updateKokoAssemblyData(newData);
              apiService.write('smaam_koko_assembly', newData);
          }
          showToast("Rekod dipadam.");
      }
  };

  const handleResetData = () => {
      if(confirm("AMARAN: Ini akan memadamkan semua data yang disimpan dan mengembalikan data asal (default). Teruskan?")) {
          localStorage.removeItem('smaam_koko_weekly');
          localStorage.removeItem('smaam_koko_assembly');
          window.location.reload();
      }
  };

  const [showPreview, setShowPreview] = useState(false);

  const handleDownloadPDF = () => {
      setShowPreview(true);
  };

  const executeDownload = () => {
      const element = document.getElementById('pdf-content');
      if (!element) return;
      
      showToast("Sedang menjana PDF...");
      
      const opt = {
          margin: 5,
          filename: `Takwim_Kokurikulum_${year}_${viewMode}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      
      (window as any).html2pdf().set(opt).from(element).save().then(() => {
          showToast("PDF berjaya dimuat turun.");
      }).catch((err: any) => {
          console.error("PDF Error:", err);
          showToast("Gagal menjana PDF.");
      });
  };

  const handlePrint = () => {
      window.print();
  };

  // --- RENDER ANNUAL VIEW (GRID LAYOUT) ---
  const renderAnnualView = () => {
      return (
          <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
              <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#C9B458] font-montserrat uppercase">PERANCANGAN TAHUNAN KOKURIKULUM TAHUN {year}</h3>
              </div>
              <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full min-w-[1000px] border-collapse text-xs border border-gray-800">
                      <thead>
                          <tr>
                              <th className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm w-12 border border-[#0B132B] sticky left-0 z-20">HB</th>
                              {months.map(m => (
                                  <th key={m} className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm border border-[#0B132B] min-w-[80px]">{m}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                              <tr key={date}>
                                  <td className="bg-[#0B132B] text-[#C9B458] font-bold text-center border border-gray-700 sticky left-0 z-10 p-1">{date}</td>
                                  {months.map((_, monthIdx) => {
                                      const dayLetter = getDayLetter(monthIdx, date);
                                      if (!dayLetter) return <td key={monthIdx} className="bg-black/40 border border-gray-800"></td>;
                                      
                                      // Construct date object to match data
                                      const cellDate = new Date(year, monthIdx, date);
                                      cellDate.setHours(12, 0, 0, 0);

                                      // CHECK HOLIDAY
                                      let isHolidayDate = false;
                                      let holidayName = '';
                                      SCHOOL_HOLIDAYS.forEach(h => {
                                          const range = parseRangeFromString(h.date);
                                          if (range && cellDate >= range.start && cellDate <= range.end) {
                                              isHolidayDate = true;
                                              holidayName = h.event;
                                          }
                                      });
                                      
                                      // Find events matching this date
                                      const weeklyEvents = kokoWeeklyData.filter(item => {
                                          const d = parseDate(item.date);
                                          return d.getDate() === date && d.getMonth() === monthIdx && d.getFullYear() === year;
                                      });
                                      
                                      const assemblyEvents = kokoAssemblyData.filter(item => {
                                          const d = parseDate(item.date);
                                          return d.getDate() === date && d.getMonth() === monthIdx && d.getFullYear() === year;
                                      });

                                      return (
                                          <td key={monthIdx} className={`${isHolidayDate ? 'bg-yellow-200 text-black' : 'bg-[#1C2541]'} border border-gray-700 relative min-h-[48px] p-1 align-top hover:bg-[#253252] transition-colors`}>
                                              <span className={`absolute top-0.5 right-1 text-[8px] font-mono ${isHolidayDate ? 'text-black/60' : 'text-gray-500'}`}>{dayLetter}</span>
                                              
                                              <div className="mt-3 flex flex-col gap-1">
                                                  {/* Render Holidays */}
                                                  {isHolidayDate && (
                                                      <div className="flex items-start gap-1.5 group cursor-pointer" title={holidayName}>
                                                          <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>
                                                          <span className="text-[9px] font-bold leading-tight text-black whitespace-normal break-words">
                                                              {holidayName}
                                                          </span>
                                                      </div>
                                                  )}

                                                  {/* Render Weekly Events */}
                                                  {weeklyEvents.map((event, idx) => (
                                                      <div 
                                                        key={`w-${idx}`} 
                                                        className="flex items-start gap-1.5 group cursor-pointer"
                                                        title={event.activity}
                                                        onClick={() => canEdit && handleOpenModal('weekly', event)}
                                                      >
                                                          <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                                                          <span className={`text-[9px] leading-tight group-hover:text-white whitespace-normal break-words ${isHolidayDate ? 'text-black' : 'text-gray-300'}`}>
                                                              {event.activity}
                                                          </span>
                                                      </div>
                                                  ))}

                                                  {/* Render Assembly Events */}
                                                  {assemblyEvents.map((event, idx) => (
                                                      <div 
                                                        key={`a-${idx}`} 
                                                        className="flex items-start gap-1.5 group cursor-pointer"
                                                        title={`Perhimpunan: ${event.unit}`}
                                                        onClick={() => canEdit && handleOpenModal('monthly', event)}
                                                      >
                                                          <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)]"></div>
                                                          <span className={`text-[9px] leading-tight group-hover:text-white whitespace-normal break-words ${isHolidayDate ? 'text-black' : 'text-gray-300'}`}>
                                                              {event.unit}
                                                          </span>
                                                      </div>
                                                  ))}
                                              </div>
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2">
             <span className="font-bold">KOKURIKULUM</span><span className="opacity-50">/</span><span className="font-bold opacity-80">TAKWIM</span>
          </div>
          <h2 className="text-[22px] md:text-3xl font-bold text-black font-montserrat uppercase">Pengurusan Takwim Kokurikulum</h2>
          <p className="text-black/80 mt-1 text-[13px] font-medium">Jadual perjumpaan mingguan dan perhimpunan bulanan unit beruniform, kelab & sukan.</p>
        </div>
        <div className="flex gap-3">
            {canEdit && (
                <button onClick={handleResetData} className="flex items-center gap-2 bg-red-800 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg text-[11px]">
                    ⚠️ Reset Data
                </button>
            )}
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#1C2541] border border-[#C9B458] text-[#C9B458] px-4 py-2 rounded-lg font-semibold hover:bg-[#253252] transition-colors shadow-lg text-[13px]">
                📥 <span className="hidden sm:inline">Muat Turun PDF</span>
            </button>
        </div>
      </div>

      {/* Tabs - ICONS REMOVED as requested */}
      <div className="flex gap-2 overflow-x-auto pb-1">
          <button 
            onClick={() => setViewMode('weekly')} 
            className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'weekly' ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' : 'bg-[#0B132B]/10 text-gray-600 hover:bg-[#0B132B]/20'}`}
          >
            Perjumpaan Mingguan
          </button>
          <button 
            onClick={() => setViewMode('monthly')} 
            className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'monthly' ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' : 'bg-[#0B132B]/10 text-gray-600 hover:bg-[#0B132B]/20'}`}
          >
            Perhimpunan Bulanan
          </button>
          <button 
            onClick={() => setViewMode('annual')} 
            className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'annual' ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' : 'bg-[#0B132B]/10 text-gray-600 hover:bg-[#0B132B]/20'}`}
          >
            Takwim Tahunan
          </button>
      </div>

      {/* Content Area */}
      <div className={`${viewMode === 'annual' ? '' : 'bg-[#1C2541] rounded-xl rounded-tl-none shadow-xl overflow-hidden border border-gray-700 min-h-[400px]'}`}>
          
          {/* WEEKLY VIEW */}
          {viewMode === 'weekly' && (
            <>
                <div className="p-5 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="text-[#C9B458] font-bold text-base md:text-lg uppercase tracking-wide text-center md:text-left">
                        {kokoTitles.weekly}
                    </h4>
                    {canEdit && (
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleOpenModal('title_weekly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button>
                            <button onClick={() => handleOpenModal('weekly')} className="bg-[#C9B458] text-[#0B132B] px-4 py-1.5 rounded font-bold text-xs hover:bg-yellow-400 border border-yellow-600 transition-transform hover:scale-105">+ Tambah Aktiviti</button>
                        </div>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                                <th className="px-6 py-4 w-16 text-center">BIL</th>
                                <th className="px-6 py-4 w-48 text-center">TARIKH</th>
                                <th className="px-6 py-4">AKTIVITI</th>
                                {canEdit && <th className="px-6 py-4 w-28 text-center">AKSI</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.4]">
                            {kokoWeeklyData.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                    <td className="px-6 py-3 font-medium text-white text-center">{idx + 1}</td>
                                    <td className="px-6 py-3 text-white text-center font-mono bg-white/5 rounded mx-2">{item.date}</td>
                                    <td className="px-6 py-3 text-gray-300 font-medium">{item.activity}</td>
                                    {canEdit && (
                                        <td className="px-6 py-3 text-center">
                                            <div className={`flex justify-center gap-2 ${isSystemAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                <button onClick={() => handleOpenModal('weekly', item)} className="text-blue-400 hover:text-white p-1 rounded hover:bg-blue-900/30" title="Kemaskini">✏️</button>
                                                <button onClick={() => handleDelete('weekly', item.id)} className="text-red-400 hover:text-white p-1 rounded hover:bg-red-900/30" title="Hapus">🗑️</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {kokoWeeklyData.length === 0 && (
                                <tr><td colSpan={4} className="py-8 text-center text-gray-500 italic">Tiada rekod perjumpaan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
          )}

          {/* MONTHLY VIEW */}
          {viewMode === 'monthly' && (
            <>
                <div className="p-5 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="text-[#C9B458] font-bold text-base md:text-lg uppercase tracking-wide text-center md:text-left">
                        {kokoTitles.monthly}
                    </h4>
                    {canEdit && (
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleOpenModal('title_monthly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button>
                            <button onClick={() => handleOpenModal('monthly')} className="bg-[#C9B458] text-[#0B132B] px-4 py-1.5 rounded font-bold text-xs hover:bg-yellow-400 border border-yellow-600 transition-transform hover:scale-105">+ Tambah Jadual</button>
                        </div>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                                <th className="px-6 py-4 w-16 text-center">BIL</th>
                                <th className="px-6 py-4 w-32 text-center">BULAN</th>
                                <th className="px-6 py-4 w-40 text-center">TARIKH</th>
                                <th className="px-6 py-4">UNIT BERTUGAS</th>
                                <th className="px-6 py-4">CATATAN</th>
                                {canEdit && <th className="px-6 py-4 w-28 text-center">AKSI</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.4]">
                            {kokoAssemblyData.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white text-center">{idx + 1}</td>
                                    <td className="px-6 py-4 text-gray-300 text-center uppercase font-bold tracking-wider">{item.month}</td>
                                    <td className="px-6 py-4 text-white text-center font-mono bg-white/5 rounded">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wide border border-opacity-20 ${getUnitBadgeColor(item.unit)}`}>
                                            {toTitleCase(item.unit)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs italic">{item.notes || '-'}</td>
                                    {canEdit && (
                                        <td className="px-6 py-3 text-center">
                                            <div className={`flex justify-center gap-2 ${isSystemAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                <button onClick={() => handleOpenModal('monthly', item)} className="text-blue-400 hover:text-white p-1 rounded hover:bg-blue-900/30" title="Kemaskini">✏️</button>
                                                <button onClick={() => handleDelete('monthly', item.id)} className="text-red-400 hover:text-white p-1 rounded hover:bg-red-900/30" title="Hapus">🗑️</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {kokoAssemblyData.length === 0 && (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-500 italic">Tiada rekod perhimpunan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
          )}

          {/* ANNUAL VIEW GRID */}
          {viewMode === 'annual' && renderAnnualView()}
      </div>

      {/* PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onDownload={executeDownload}
        onPrint={handlePrint}
        title={`Pratonton Pengurusan Kokurikulum ${year}`}
        orientation="landscape"
      >
        <div className="flex items-center gap-4 border-b-2 border-black pb-6 mb-8">
            <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" className="h-24 w-auto object-contain" alt="Logo Sekolah" crossOrigin="anonymous" />
            <div className="flex-1 text-center text-black">
                <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
                <h2 className="text-xl font-bold uppercase text-black">PENGURUSAN KOKURIKULUM TAHUN {year}</h2>
                <p className="text-sm font-semibold mt-1 uppercase text-black tracking-widest">
                    {viewMode === 'weekly' ? 'JADUAL PERJUMPAAN MINGGUAN' : viewMode === 'monthly' ? 'JADUAL PERHIMPUNAN BULANAN' : 'TAKWIM TAHUNAN'}
                </p>
            </div>
        </div>

        {viewMode === 'weekly' && (
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-400 pb-2">{kokoTitles.weekly}</h3>
                <table className="w-full text-left border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="border border-black px-3 py-2 text-center w-16">BIL</th>
                            <th className="border border-black px-3 py-2 text-center w-40">TARIKH</th>
                            <th className="border border-black px-3 py-2 text-center">AKTIVITI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kokoWeeklyData.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="border border-black px-3 py-2 text-center">{idx + 1}</td>
                                <td className="border border-black px-3 py-2 text-center font-mono">{item.date}</td>
                                <td className="border border-black px-3 py-2">{item.activity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {viewMode === 'monthly' && (
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-400 pb-2">{kokoTitles.monthly}</h3>
                <table className="w-full text-left border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="border border-black px-3 py-2 text-center w-16">BIL</th>
                            <th className="border border-black px-3 py-2 text-center w-32">BULAN</th>
                            <th className="border border-black px-3 py-2 text-center w-40">TARIKH</th>
                            <th className="border border-black px-3 py-2 text-center">UNIT BERTUGAS</th>
                            <th className="border border-black px-3 py-2 text-center">CATATAN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kokoAssemblyData.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="border border-black px-3 py-2 text-center">{idx + 1}</td>
                                <td className="border border-black px-3 py-2 text-center uppercase font-bold">{item.month}</td>
                                <td className="border border-black px-3 py-2 text-center font-mono">{item.date}</td>
                                <td className="border border-black px-3 py-2 uppercase font-bold text-center">{item.unit}</td>
                                <td className="border border-black px-3 py-2 italic text-center text-xs">{item.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {viewMode === 'annual' && (
            <div className="mb-8 overflow-x-auto">
                <h3 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-400 pb-2">PERANCANGAN TAHUNAN KOKURIKULUM {year}</h3>
                <table className="w-full border-collapse text-[8px] border border-black table-fixed">
                    <thead>
                        <tr>
                            <th className="bg-gray-300 text-black p-1 font-bold border border-black w-8 text-center">HB</th>
                            {months.map(m => (
                                <th key={m} className="bg-gray-300 text-black p-1 font-bold border border-black text-center">{m}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                            <tr key={date}>
                                <td className="bg-gray-200 text-black font-bold text-center border border-black p-1">{date}</td>
                                {months.map((_, monthIdx) => {
                                    const dayLetter = getDayLetter(monthIdx, date);
                                    if (!dayLetter) return <td key={monthIdx} className="bg-gray-100 border border-black"></td>;
                                    
                                    // Construct date object to match data
                                    const cellDate = new Date(year, monthIdx, date);
                                    cellDate.setHours(12, 0, 0, 0);

                                    // CHECK HOLIDAY
                                    let isHolidayDate = false;
                                    let holidayName = '';
                                    SCHOOL_HOLIDAYS.forEach(h => {
                                        const range = parseRangeFromString(h.date);
                                        if (range && cellDate >= range.start && cellDate <= range.end) {
                                            isHolidayDate = true;
                                            holidayName = h.event;
                                        }
                                    });
                                    
                                    // Find events matching this date
                                    const weeklyEvents = kokoWeeklyData.filter(item => {
                                        const d = parseDate(item.date);
                                        return d.getDate() === date && d.getMonth() === monthIdx && d.getFullYear() === year;
                                    });
                                    
                                    const assemblyEvents = kokoAssemblyData.filter(item => {
                                        const d = parseDate(item.date);
                                        return d.getDate() === date && d.getMonth() === monthIdx && d.getFullYear() === year;
                                    });

                                    return (
                                        <td key={monthIdx} className={`border border-black relative min-h-[40px] p-0.5 align-top ${isHolidayDate ? 'bg-gray-300' : ''}`}>
                                            <span className="absolute top-0 right-0.5 text-[6px] font-mono text-gray-600">{dayLetter}</span>
                                            
                                            <div className="mt-2 flex flex-col gap-0.5">
                                                {isHolidayDate && (
                                                    <div className="text-[6px] font-bold leading-none text-black uppercase bg-gray-400 px-0.5 rounded-sm whitespace-normal">
                                                        {holidayName}
                                                    </div>
                                                )}
                                                {weeklyEvents.map((event, idx) => (
                                                    <div key={`w-${idx}`} className="text-[6px] leading-tight text-blue-900 font-bold whitespace-normal">
                                                        • {event.activity}
                                                    </div>
                                                ))}
                                                {assemblyEvents.map((event, idx) => (
                                                    <div key={`a-${idx}`} className="text-[6px] leading-tight text-red-900 font-bold whitespace-normal">
                                                        • {event.unit}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <div className="mt-12 pt-8 border-t border-black flex justify-between text-xs font-bold uppercase">
            <div className="text-center w-1/3">
                <p className="mb-16">Disediakan Oleh:</p>
                <div className="border-t border-black w-2/3 mx-auto"></div>
                <p className="mt-2">Setiausaha Kokurikulum</p>
            </div>
            <div className="text-center w-1/3">
                <p className="mb-16">Disahkan Oleh:</p>
                <div className="border-t border-black w-2/3 mx-auto"></div>
                <p className="mt-2">Pengetua</p>
            </div>
        </div>
        <div className="mt-8 text-center text-[10px] italic text-gray-500">
            Dicetak pada {new Date().toLocaleDateString('ms-MY')} melalui Sistem Pengurusan Digital SMAAM
        </div>
      </PrintPreviewModal>

      {/* MODALS */}
      {isModalOpen && canEdit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm fade-in px-4 pt-24 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-lg p-8 rounded-xl shadow-2xl border border-[#C9B458] mb-20 relative">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-4">
                {editingType?.startsWith('title') ? 'Kemaskini Tajuk' : editingId ? 'Kemaskini Rekod' : 'Tambah Rekod Baru'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-5">
               {/* Title Editing */}
               {(editingType === 'title_weekly' || editingType === 'title_monthly') && (
                   <div>
                       <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tajuk Jadual</label>
                       <input 
                           required 
                           type="text" 
                           value={formData.title} 
                           onChange={(e) => setFormData({...formData, title: e.target.value})} 
                           className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" 
                       />
                   </div>
               )}

               {/* Weekly Record */}
               {editingType === 'weekly' && (
                   <>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label>
                           <input 
                               required 
                               type="date" 
                               value={dateToISO(formData.date)} 
                               onChange={(e) => setFormData({...formData, date: ISOToMalay(e.target.value)})} 
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label>
                           <input 
                               required 
                               type="text" 
                               value={formData.activity} 
                               onChange={(e) => setFormData({...formData, activity: e.target.value})} 
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" 
                               placeholder="Contoh: Perjumpaan Unit Beruniform" 
                           />
                       </div>
                   </>
               )}

               {/* Monthly Record */}
               {editingType === 'monthly' && (
                   <>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Bulan</label>
                               <input 
                                   required 
                                   type="text" 
                                   value={formData.month} 
                                   onChange={(e) => setFormData({...formData, month: e.target.value})} 
                                   className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" 
                                   placeholder="Contoh: Jan" 
                               />
                           </div>
                           <div>
                               <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label>
                               <input 
                                   required 
                                   type="date" 
                                   value={dateToISO(formData.date)} 
                                   onChange={(e) => setFormData({...formData, date: ISOToMalay(e.target.value)})} 
                                   className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                               />
                           </div>
                       </div>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Unit Bertugas</label>
                           <input 
                               required 
                               type="text" 
                               value={formData.unit} 
                               onChange={(e) => setFormData({...formData, unit: e.target.value})} 
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" 
                               placeholder="Contoh: Kadet Remaja Sekolah" 
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Catatan</label>
                           <input 
                               type="text" 
                               value={formData.notes} 
                               onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" 
                               placeholder="Contoh: Pakaian Uniform Lengkap" 
                           />
                       </div>
                   </>
               )}

               <div className="flex gap-4 pt-6">
                   <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)} 
                       className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium uppercase tracking-wide text-xs"
                   >
                       Batal
                   </button>
                   <button 
                       type="submit" 
                       className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5 uppercase tracking-wide text-xs"
                   >
                       SIMPAN
                   </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};