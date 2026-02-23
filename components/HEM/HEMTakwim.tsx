
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

// --- INTERFACES ---
interface SumurEvent {
  id: number;
  date: string;
  program: string;
  teacher: string;
  activity: string;
}

interface HipEvent {
  id: number;
  date: string;
  program: string;
  teacher: string;
  activity: string;
}

// --- HELPER FUNCTIONS ---
const generateRangeItems = (start: string, end: string, event: string) => {
    const sParts = start.split('-').map(Number);
    const eParts = end.split('-').map(Number);
    const sDate = new Date(sParts[2], sParts[1]-1, sParts[0]);
    const eDate = new Date(eParts[2], eParts[1]-1, eParts[0]);
    const items = [];
    
    let loop = new Date(sDate);
    while (loop <= eDate) {
        const d = String(loop.getDate()).padStart(2, '0');
        const m = String(loop.getMonth() + 1).padStart(2, '0');
        const y = loop.getFullYear();
        const dateId = parseInt(`${y}${m}${d}`);
        items.push({
            id: dateId * 1000 + Math.floor(Math.random() * 999), 
            event: event,
            date: `${d}-${m}-${y}`,
            status: 'Akan Datang'
        });
        loop.setDate(loop.getDate() + 1);
    }
    return items;
};

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
    if (mIndex < 0 || mIndex > 11) return isoStr;
    return `${parseInt(day)} ${malayMonths[mIndex]} ${year}`;
};

const parseDateForSort = (dateStr: string) => {
    const months: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'ogo':7, 'sep':8, 'okt':9, 'nov':10, 'dis':11 };
    const parts = dateStr.split(' ');
    if (parts.length < 3) return 0;
    const day = parseInt(parts[0]);
    const month = months[parts[1].toLowerCase().substring(0,3)] || 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day).getTime();
};

const getBulletColor = (type: string) => {
    switch (type) {
        case 'hip': return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
        case 'hayya': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        case 'sumur': return 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]';
        default: return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
    }
};

const getProgramColor = (program: string) => {
    const p = program.toUpperCase();
    if (p.includes('ENGLISH')) return 'text-blue-400';
    if (p.includes('HAYYA')) return 'text-emerald-400';
    if (p.includes('SUMUR')) return 'text-[#C9B458]';
    return 'text-white';
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

// --- DYNAMIC STATUS CALCULATOR ---
const getDynamicStatus = (dateStr: string) => {
    if (!dateStr) return 'Akan Datang';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start: Date, end: Date;

    if (dateStr.includes('–') || dateStr.includes('-') && dateStr.length > 12 || dateStr.includes('hingga')) {
       const range = parseRangeFromString(dateStr.replace('hingga', '–'));
       if (range) {
           start = range.start;
           end = range.end;
       } else {
           start = new Date(); 
           end = new Date();
       }
    } else {
        const parts = dateStr.split(/[-. ]/); 
        if (parts.length >= 3) {
             const d = parseInt(parts[0]);
             const mStr = parts[1];
             const y = parseInt(parts[2]);
             let m = parseInt(mStr) - 1;
             
             if (isNaN(m)) {
                 const monthMap: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'ogo':7, 'ogos':7, 'sep':8, 'okt':9, 'nov':10, 'dis':11 };
                 m = monthMap[mStr.toLowerCase().substring(0,3)] || 0;
             }
             
             start = new Date(y, m, d);
             end = new Date(y, m, d);
             end.setHours(23, 59, 59, 999);
        } else {
            return 'Akan Datang';
        }
    }

    if (today > end) return 'Selesai';
    if (today >= start && today <= end) return 'Sedang Berjalan';
    return 'Akan Datang';
};

// --- DATA ---
const malayMonths = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
const daysLetters = ['I', 'S', 'R', 'K', 'J', 'S', 'A']; 
const year = 2026;

const INITIAL_HEM_TAKWIM_DATA = [
    { id: 20260106, event: "Mesyuarat HEM 1", date: "09-01-2026", status: "Selesai" },
    { id: 20260107, event: "Mesyuarat HEM 2", date: "07-04-2026", status: "Akan Datang" },
    { id: 20260111, event: "Pendaftaran", date: "11-01-2026", status: "Selesai" },
    ...generateRangeItems("17-02-2026", "18-02-2026", "Tahun Baru Cina"),
    { id: 20260219, event: "Awal Ramadan", date: "19-02-2026", status: "Akan Datang" },
    { id: 20260223, event: "Peluncuran Ihya' Ramadan", date: "23-02-2026", status: "Akan Datang" },
    { id: 20260312, event: "3K Gotong-royong", date: "12-03-2026", status: "Akan Datang" },
    { id: 20260313, event: "Iftar Jamaei dan Majlis Khatam al-Quran", date: "13-03-2026", status: "Akan Datang" },
    ...generateRangeItems("21-03-2026", "29-03-2026", "Cuti Penggal 1"),
    ...generateRangeItems("21-04-2026", "23-04-2026", "Hari Raya Aidilfitri"),
    { id: 20260520, event: "Kem Kepimpinan 1", date: "20-05-2026", status: "Akan Datang" },
    ...generateRangeItems("23-05-2026", "07-06-2026", "Cuti Penggal 2"),
    { id: 202606062, event: "Mesyuarat HEM 3", date: "06-06-2026", status: "Akan Datang" },
    { id: 20260620, event: "Kem Kepimpinan 2", date: "20-06-2026", status: "Akan Datang" },
    { id: 20260627, event: "Hari Raya Haji", date: "27-06-2026", status: "Akan Datang" },
    { id: 20260706, event: "Mesyuarat HEM 4", date: "06-07-2026", status: "Akan Datang" },
    { id: 20260721, event: "Hari Hol Almarhum Sultan Iskandar", date: "21-07-2026", status: "Akan Datang" },
    { id: 20260831, event: "Hari Kebangsaan", date: "31-08-2026", status: "Akan Datang" },
    { id: 20260916, event: "Hari Malaysia", date: "16-09-2026", status: "Akan Datang" },
    { id: 20260928, event: "Sambutan Maulidur Rasul Peringkat Sekolah", date: "28-09-2026", status: "Akan Datang" },
    ...generateRangeItems("29-08-2026", "06-09-2026", "Cuti Pertengahan Tahun"),
    { id: 20261008, event: "Hari Deepavali", date: "08-10-2026", status: "Akan Datang" },
    { id: 20261025, event: "Maulidur Rasul", date: "25-10-2026", status: "Akan Datang" },
    ...generateRangeItems("02-12-2026", "31-12-2026", "Cuti Akhir Persekolahan Tahun"),
    { id: 20261225, event: "Hari Krismas", date: "25-12-2026", status: "Akan Datang" }
];

const getDayLetter = (monthIdx: number, day: number) => {
    const d = new Date(year, monthIdx, day);
    if (d.getMonth() !== monthIdx) return null; 
    const dayIndex = d.getDay(); 
    const mappedIndex = (dayIndex + 6) % 7;
    return daysLetters[mappedIndex];
};

export const HEMTakwim: React.FC = () => {
  const { user, showToast, checkPermission, sumurSchedule, updateSumurSchedule, hipSchedule, updateHipSchedule } = useApp();
  const canEdit = checkPermission('canUpdateHEMTakwim');
  const isSystemAdmin = user?.role === 'adminsistem';

  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'annual' | 'sumur_schedule'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'item' | 'sumur' | 'hip'>('item');
  const [formData, setFormData] = useState({ event: '', date: '', status: '', program: '', teacher: '', activity: '' });

  // Data Loading
  useEffect(() => {
    const loadData = async () => {
        const localTakwim = localStorage.getItem('smaam_data_Hal Ehwal Murid_Takwim');
        if (localTakwim) {
            setItems(JSON.parse(localTakwim));
        } else {
            setItems(INITIAL_HEM_TAKWIM_DATA);
        }

        const savedSumur = await apiService.read('smaam_sumur_schedule');
        const savedHip = await apiService.read('smaam_hip_schedule');
        if (savedSumur) updateSumurSchedule(savedSumur);
        if (savedHip) updateHipSchedule(savedHip);

        const remoteTakwim = await apiService.read('smaam_data_Hal Ehwal Murid_Takwim');
        if (remoteTakwim) setItems(remoteTakwim);
    };
    loadData();
  }, []);

  const saveItems = (newItems: any[]) => {
      setItems(newItems);
      localStorage.setItem('smaam_data_Hal Ehwal Murid_Takwim', JSON.stringify(newItems));
      apiService.write('smaam_data_Hal Ehwal Murid_Takwim', newItems);
  };

  const handleOpenModal = (type: 'item' | 'sumur' | 'hip', item?: any) => {
      setEditingType(type);
      setEditingId(item ? item.id : null);
      if (type === 'item') {
          setFormData({
              event: item?.event || '',
              date: item?.date || '',
              status: item?.status || 'Akan Datang',
              program: '', teacher: '', activity: ''
          });
      } else {
          setFormData({
              event: '', status: '',
              date: item?.date || '',
              program: item?.program || '',
              teacher: item?.teacher || '',
              activity: item?.activity || ''
          });
      }
      setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingType === 'item') {
          const newItem = {
              id: editingId || Date.now(),
              event: formData.event,
              date: formData.date,
              status: formData.status
          };
          if (editingId) {
              saveItems(items.map(i => i.id === editingId ? { ...i, ...newItem } : i));
              showToast("Aktiviti dikemaskini.");
          } else {
              saveItems([...items, newItem]);
              showToast("Aktiviti ditambah.");
          }
      } else if (editingType === 'sumur') {
          const payload = { id: editingId || Date.now(), date: formData.date, program: formData.program, teacher: formData.teacher, activity: formData.activity };
          let newData = editingId ? sumurSchedule.map(i => i.id === editingId ? payload : i) : [...sumurSchedule, payload];
          updateSumurSchedule(newData);
          apiService.write('smaam_sumur_schedule', newData);
          showToast("Takwim SUMUR dikemaskini.");
      } else if (editingType === 'hip') {
          const payload = { id: editingId || Date.now(), date: formData.date, program: formData.program, teacher: formData.teacher, activity: formData.activity };
          let newData = editingId ? hipSchedule.map(i => i.id === editingId ? payload : i) : [...hipSchedule, payload];
          updateHipSchedule(newData);
          apiService.write('smaam_hip_schedule', newData);
          showToast("Takwim HIP dikemaskini.");
      }
      setIsModalOpen(false);
  };

  const handleDelete = (type: 'item' | 'sumur' | 'hip', id: number) => {
      if (confirm("Padam rekod ini?")) {
          if (type === 'item') {
              saveItems(items.filter(i => i.id !== id));
          } else if (type === 'sumur') {
              const newData = sumurSchedule.filter(i => i.id !== id);
              updateSumurSchedule(newData);
              apiService.write('smaam_sumur_schedule', newData);
          } else if (type === 'hip') {
              const newData = hipSchedule.filter(i => i.id !== id);
              updateHipSchedule(newData);
              apiService.write('smaam_hip_schedule', newData);
          }
          showToast("Rekod dipadam.");
      }
  };

  const handleDeleteGroup = (ids: number[]) => {
      if (confirm(`Padam kumpulan aktiviti ini (${ids.length} hari)?`)) {
          const newItems = items.filter(i => !ids.includes(i.id));
          saveItems(newItems);
          showToast("Aktiviti berjaya dipadam.");
      }
  };

  // --- HELPER FOR LIST VIEW GROUPING ---
  const getConsolidatedItems = (rawItems: any[]) => {
    if (!rawItems.length) return [];

    const parseDate = (d: string) => {
        const parts = d.split('-').map(Number);
        if(parts.length !== 3) return 0;
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    };

    const sorted = [...rawItems].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    const grouped: any[] = [];
    
    if (sorted.length === 0) return [];

    let currentGroup: any = { 
        ...sorted[0], 
        endDate: sorted[0].date, 
        originalIds: [sorted[0].id] 
    };

    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        const prevDate = parseDate(currentGroup.endDate);
        const currDate = parseDate(item.date);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (item.event === currentGroup.event && item.status === currentGroup.status && diffDays <= 1.5) {
             currentGroup.endDate = item.date;
             currentGroup.originalIds.push(item.id);
        } else {
            grouped.push(currentGroup);
            currentGroup = { ...item, endDate: item.date, originalIds: [item.id] };
        }
    }
    grouped.push(currentGroup);

    // --- UPDATE: RENAME & NUMBERING ---
    const renamed = grouped.map(g => {
        let displayEvent = g.event;
        // Change PPT to full name for list view only
        if (displayEvent === 'PPT') displayEvent = 'Peperiksaan Pertengahan Tahun';
        
        let dateDisplay = g.date;
        if (g.date !== g.endDate) {
            dateDisplay = `${g.date} hingga ${g.endDate}`;
        }
        
        const status = getDynamicStatus(g.date);

        return { ...g, event: displayEvent, dateDisplay, status, isGroup: g.originalIds.length > 1 };
    });

    const finalItems: any[] = [];
    const eventCounts: Record<string, number> = {};
    const eventOccurrences: Record<string, number> = {};

    renamed.forEach(item => {
        eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
    });

    for (const item of renamed) {
        if (eventCounts[item.event] > 1) {
            eventOccurrences[item.event] = (eventOccurrences[item.event] || 0) + 1;
            finalItems.push({
                ...item,
                event: `${item.event} ${eventOccurrences[item.event]}`
            });
        } else {
            finalItems.push(item);
        }
    }

    return finalItems;
  };

  const combinedSumurHip = [
        ...sumurSchedule.map(s => ({ ...s, source: 'sumur' as const })),
        ...hipSchedule.map(h => ({ ...h, source: 'hip' as const }))
  ].sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));

  // --- PDF GENERATION ---
  const handleDownloadPDF = async () => {
      showToast("Sedang menjana PDF (A4 Landskap)...");
      
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(script);
        });
      };

      try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          
          const elementId = 'print-container';
          const element = document.getElementById(elementId);
          if (!element) {
              showToast("Gagal mencari elemen untuk dicetak.");
              return;
          }

          const canvas = await (window as any).html2canvas(element, {
              scale: 2, 
              useCORS: true,
              backgroundColor: "#ffffff" // Force white background
          });

          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const { jsPDF } = (window as any).jspdf;
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          
          const imgWidth = 297; 
          const pageHeight = 210; 
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          pdf.save(`Takwim_HEM_${view}_2026.pdf`);
          showToast("PDF berjaya dimuat turun.");

      } catch (err) {
          console.error("PDF Gen Error:", err);
          showToast("Gagal menjana PDF.");
      }
  };

  // --- RENDERERS ---

  const renderAnnual = () => (
      <div id="takwim-container" className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
          <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex items-center justify-between"><h3 className="text-lg font-bold text-[#C9B458] font-montserrat uppercase">PERANCANGAN TAHUNAN HAL EHWAL MURID TAHUN {year}</h3></div>
          <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full min-w-[1000px] border-collapse text-xs border border-gray-800">
                  <thead><tr><th className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm w-12 border border-[#0B132B] sticky left-0 z-20">HB</th>{months.map(m => (<th key={m} className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm border border-[#0B132B] min-w-[80px]">{m}</th>))}</tr></thead>
                  <tbody>{Array.from({ length: 31 }, (_, i) => i + 1).map(date => (<tr key={date}><td className="bg-[#0B132B] text-[#C9B458] font-bold text-center border border-gray-700 sticky left-0 z-10 p-1">{date}</td>{months.map((_, monthIdx) => {
                    const dayLetter = getDayLetter(monthIdx, date);
                    if (!dayLetter) return <td key={monthIdx} className="bg-black/40 border border-gray-800"></td>;
                    
                    const dateStr = `${(date).toString().padStart(2, '0')}-${(monthIdx + 1).toString().padStart(2, '0')}-${year}`;
                    
                    let eventsOnDay = items.filter(item => item.date === dateStr).map(i => ({...i, type: 'activity'}));

                    const sumurDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                    const sumurEvents = sumurSchedule.filter(s => s.date === sumurDateStr).map(s => {
                        const isHayya = s.program.toUpperCase().includes('HAYYA');
                        return { id: `sumur-${s.id}`, event: s.program, date: dateStr, status: 'Akan Datang', type: isHayya ? 'hayya' : 'sumur' };
                    });
                    
                    const hipDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                    const hipEvents = hipSchedule.filter(h => h.date === hipDateStr).map(h => ({ id: `hip-${h.id}`, event: h.program, date: dateStr, status: 'Akan Datang', type: 'hip' }));
                    
                    eventsOnDay = [...eventsOnDay, ...sumurEvents, ...hipEvents];

                    const isHolidayDate = eventsOnDay.some(e => e.event.toLowerCase().includes('cuti'));

                    return (
                      <td key={monthIdx} className={`${isHolidayDate ? 'bg-yellow-200 text-black' : 'bg-[#1C2541]'} border border-gray-700 relative h-12 p-1 align-top hover:bg-[#253252] transition-colors ${canEdit ? 'cursor-pointer' : ''}`} onClick={() => { if (canEdit && eventsOnDay.length === 0) handleOpenModal('item', { date: dateStr }); }}>
                        <span className={`absolute top-0.5 right-1 text-[8px] font-mono ${isHolidayDate ? 'text-black/60' : 'text-gray-500'}`}>{dayLetter}</span>
                        <div className="mt-3 flex flex-col gap-1">
                        {eventsOnDay.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 group cursor-pointer" title={event.event} onClick={(e) => { e.stopPropagation(); if (canEdit && event.type === 'activity') handleOpenModal('item', event); }}>
                              <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${getBulletColor(event.type)}`}></div>
                              <span className={`text-[9px] leading-tight line-clamp-2 ${isHolidayDate ? 'text-black font-semibold' : 'text-gray-300 group-hover:text-white'}`}>{event.event}</span>
                          </div>
                        ))}
                        </div>
                      </td>
                    );
                  })}</tr>))}</tbody>
              </table>
          </div>
      </div>
  );

  const renderSumurSchedule = () => {
    return (
    <div id="sumur-container" className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-2">
            <h4 className="text-white font-bold flex items-center gap-2 text-[16px]"><span className="text-[#C9B458]"></span> TAKWIM PENGGILIRAN HIP, HA & SUMUR 2026</h4>
            {canEdit && (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenModal('sumur')} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ SUMUR</button>
                    <button onClick={() => handleOpenModal('hip')} className="bg-purple-500 text-white px-3 py-1 rounded font-bold text-xs hover:bg-purple-600">+ HIP</button>
                </div>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                        <th className="px-6 py-4 w-16 text-center">NO</th>
                        <th className="px-6 py-4 w-40 text-center">TARIKH</th>
                        <th className="px-6 py-4">PROGRAM</th>
                        <th className="px-6 py-4">GURU BERTUGAS</th>
                        <th className="px-6 py-4">AKTIVITI</th>
                        {canEdit && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {combinedSumurHip.map((item, idx) => (
                        <tr key={`${item.source}-${item.id}`} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center">{idx + 1}</td>
                            <td className="px-6 py-3 text-white text-center font-mono">{item.date}</td>
                            <td className={`px-6 py-3 font-bold ${getProgramColor(item.program)}`}>{item.program}</td>
                            <td className="px-6 py-3 text-white">{item.teacher}</td>
                            <td className="px-6 py-3 text-gray-300">{item.activity}</td>
                            {canEdit && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button 
                                        onClick={() => item.source === 'sumur' ? handleOpenModal(item.source, item) : handleOpenModal(item.source, item)} 
                                        className="text-blue-400 hover:text-white" 
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.source, item.id)} 
                                        className="text-red-400 hover:text-white" 
                                        title="Hapus"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
  };

  const consolidatedList = getConsolidatedItems(items);

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 relative fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-black font-mono mb-1 font-inter">
             <span className="font-bold">HEM</span><span className="opacity-50">/</span><span className="font-bold opacity-80">TAKWIM</span>
          </div>
          <h2 className="text-[22px] md:text-3xl font-bold text-black font-montserrat">Pengurusan Takwim HEM</h2>
          <p className="text-black/80 mt-1 text-[13px] font-inter font-medium">Kalendar aktiviti, program HIP, HA dan SUMUR.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#1C2541] border border-[#C9B458] text-[#C9B458] px-4 py-2 rounded-lg font-semibold hover:bg-[#253252] transition-colors shadow-lg text-[13px]">📥 <span className="hidden sm:inline">Muat Turun PDF</span></button>
            {canEdit && (<button onClick={() => handleOpenModal('item')} className="flex items-center gap-2 bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20 text-[13px]">➕ <span className="hidden sm:inline">Tambah Aktiviti</span></button>)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${view === 'list' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Senarai Aktiviti</button>
        <button onClick={() => setView('sumur_schedule')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${view === 'sumur_schedule' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Takwim HIP, HA & SUMUR</button>
        <button onClick={() => setView('annual')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${view === 'annual' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Takwim Tahunan</button>
      </div>

      {view === 'annual' && renderAnnual()}
      {view === 'sumur_schedule' && renderSumurSchedule()}
      {view === 'list' && (
        <div id="list-container" className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
            {/* ICON REMOVED */}
            <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col gap-2"><h4 className="text-white font-bold flex items-center gap-2 text-[16px]">Senarai Aktiviti</h4></div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead><tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter"><th className="px-6 py-4">Nama Program / Aktiviti</th><th className="px-6 py-4">Tarikh Pelaksanaan</th><th className="px-6 py-4">Status</th>{canEdit && <th className="px-6 py-4 text-right">Tindakan</th>}</tr></thead>
                    <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">{consolidatedList.length > 0 ? (consolidatedList.map((item: any) => (<tr key={item.id} className="hover:bg-[#253252] transition-colors group"><td className="px-6 py-4 font-medium text-white">{item.event}</td><td className="px-6 py-4 text-gray-300 font-mono">{item.dateDisplay || item.date}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Selesai' ? 'bg-green-900/50 text-green-400' : item.status === 'Sedang Berjalan' ? 'bg-blue-900/50 text-blue-400' :'bg-yellow-900/30 text-yellow-500'}`}>{item.status}</span></td>{canEdit && (<td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleOpenModal('item', item)} className="p-2 bg-[#3A506B] text-white rounded" title="Edit">✏️</button><button onClick={() => item.isGroup ? handleDeleteGroup(item.originalIds) : handleDelete('item', item.id)} className="p-2 bg-red-900/50 text-red-200 rounded" title="Hapus">🗑️</button></div></td>)}</tr>))) : (<tr><td colSpan={canEdit ? 4 : 3} className="px-6 py-12 text-center text-gray-500 italic">Tiada aktiviti direkodkan.</td></tr>)}</tbody>
                </table>
            </div>
        </div>
      )}

      {/* PRINTABLE CONTENT (HIDDEN) */}
      <div id="print-container" style={{ position: 'absolute', top: 0, left: '-9999px', width: '297mm', minHeight: '210mm', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif', padding: '10mm', display: 'block' }}>
        <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold uppercase tracking-wide">SMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
            <h2 className="text-xl font-bold uppercase mt-2">
                {view === 'annual' ? `PERANCANGAN TAHUNAN HAL EHWAL MURID TAHUN ${year}` : 
                 view === 'sumur_schedule' ? 'TAKWIM PENGGILIRAN HIP, HA & SUMUR 2026' : 
                 'SENARAI AKTIVITI HAL EHWAL MURID'}
            </h2>
        </div>

        {view === 'annual' && (
            <table className="w-full border-collapse border border-black text-[10px]" style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-1 text-center w-8">HB</th>
                        {months.map(m => <th key={m} className="border border-black p-1 text-center">{m}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                        <tr key={date}>
                            <td className="border border-black p-1 text-center font-bold bg-gray-100">{date}</td>
                            {months.map((_, monthIdx) => {
                                const dateStr = `${(date).toString().padStart(2, '0')}-${(monthIdx + 1).toString().padStart(2, '0')}-${year}`;
                                
                                let eventsOnDay = items.filter(item => item.date === dateStr).map(i => ({...i, type: 'activity'}));
                                
                                const sumurDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                                const sumurEvents = sumurSchedule.filter(s => s.date === sumurDateStr).map(s => {
                                    const isHayya = s.program.toUpperCase().includes('HAYYA');
                                    return { id: `sumur-${s.id}`, event: s.program, date: dateStr, status: 'Akan Datang', type: isHayya ? 'hayya' : 'sumur' };
                                });
                                
                                const hipDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                                const hipEvents = hipSchedule.filter(h => h.date === hipDateStr).map(h => ({ id: `hip-${h.id}`, event: h.program, date: dateStr, status: 'Akan Datang', type: 'hip' }));
                                
                                eventsOnDay = [...eventsOnDay, ...sumurEvents, ...hipEvents];
                                const isHolidayDate = eventsOnDay.some(e => e.event.toLowerCase().includes('cuti'));

                                return (
                                    <td key={monthIdx} className={`border border-black p-1 align-top h-12 ${isHolidayDate ? 'bg-gray-100' : ''}`}>
                                        {eventsOnDay.map((event, idx) => (
                                            <div key={idx} className="mb-1 leading-tight">
                                                <span className={`block ${isHolidayDate ? 'font-bold' : ''}`} style={{ fontSize: '9px' }}>• {event.event}</span>
                                            </div>
                                        ))}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        
        {view === 'list' && (
             <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-2 text-left">Nama Program / Aktiviti</th>
                        <th className="border border-black p-2 text-center w-40">Tarikh</th>
                        <th className="border border-black p-2 text-center w-32">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {consolidatedList.map((item: any) => (
                        <tr key={item.id}>
                            <td className="border border-black p-2 font-bold">{item.event}</td>
                            <td className="border border-black p-2 text-center">{item.dateDisplay || item.date}</td>
                            <td className="border border-black p-2 text-center">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        )}

        {view === 'sumur_schedule' && (
             <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-2 text-center w-12">NO</th>
                        <th className="border border-black p-2 text-center w-32">TARIKH</th>
                        <th className="border border-black p-2 text-left">PROGRAM</th>
                        <th className="border border-black p-2 text-left">GURU BERTUGAS</th>
                        <th className="border border-black p-2 text-left">AKTIVITI</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedSumurHip.map((item, idx) => (
                        <tr key={`${item.source}-${item.id}`}>
                            <td className="border border-black p-2 text-center">{idx + 1}</td>
                            <td className="border border-black p-2 text-center">{item.date}</td>
                            <td className="border border-black p-2 font-bold">{item.program}</td>
                            <td className="border border-black p-2">{item.teacher}</td>
                            <td className="border border-black p-2">{item.activity}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        )}
        
        <div className="mt-8 text-xs text-right italic">
            Dicetak pada: {new Date().toLocaleDateString('ms-MY')}
        </div>
      </div>

      {isModalOpen && canEdit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm fade-in px-4 pt-24 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-lg p-8 rounded-xl shadow-2xl border border-[#C9B458] mb-20 relative">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-4">{editingType === 'item' ? (editingId ? 'Kemaskini Aktiviti' : 'Tambah Aktiviti Baru') : (editingId ? `Kemaskini ${editingType.toUpperCase()}` : `Tambah ${editingType.toUpperCase()}`)}</h3>
            <form onSubmit={handleSave} className="space-y-5">
               {editingType === 'item' ? (
                   <>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Program / Aktiviti</label><input type="text" value={formData.event} onChange={(e) => setFormData({...formData, event: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input type="date" value={dateToISO(formData.date)} onChange={(e) => setFormData({...formData, date: ISOToMalay(e.target.value)})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" /></div>
                   </>
               ) : (
                   <>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input required type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: 15 Jan 2026" /></div>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Program</label><input required type="text" value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder={editingType === 'sumur' ? "Cth: SUMUR" : "Cth: OH MY ENGLISH"} /></div>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Guru Bertugas</label><input type="text" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label><input required type="text" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                   </>
               )}
               <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-600 transition-colors font-medium uppercase tracking-wide text-xs">Batal</button>
                   <button type="submit" className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5 uppercase tracking-wide text-xs">SIMPAN</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
