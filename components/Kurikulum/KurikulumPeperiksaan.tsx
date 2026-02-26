import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

type Tab = 'info' | 'jadual' | 'analisis' | 'laporan';

interface Exam {
  id: number;
  name: string;
  code: string;
  dateStart: string;
  dateEnd: string;
  status: 'Selesai' | 'Sedang Berjalan' | 'Akan Datang';
}

interface ScheduleSlot {
  id: number;
  waktu: string;
  waktuMula: string;
  waktuTamat: string;
  subjek: string;
  durasi: string;
  guruA: string;
  guruB: string;
}

interface DetailedScheduleRow {
  id: number;
  hari: string;
  tarikh: string;
  tarikhDisplay: string;
  slots: ScheduleSlot[];
}

const TEACHER_SHORT_NAMES = [
  "UZ ZULKEFFLE", "UZH ATIKAH", "UZ SHAHARER", "UZ ZULKIFLI",
  "C. ROS", "C. ZAHRAH", "C. MAZUIN", "C. AIND",
  "UZH SAEMAH", "UZH NOR AZEAN", "C. FIKRUDDIN", "C. FIRROS",
  "C. LIYANA", "T. HAKIM", "T. IZATI", "C. SHIDAH",
  "T. AIN", "C. IZZATI", "C. SYAFIQAH", "C. LIZA",
  "C. HAFIZ", "C. AMIRA", "UZH LELA", "UZH AYUNI",
  "UZ SALMAN", "UZ MNUR", "UZH HIDAYAH", "UZH MASYITAH",
  "UZ SUKRI", "UZ MNOR", "UZH LIYANA", "UZH AMINAH",
  "UZH NAJIHAH", "UZH ZARITH"
];

const dummyExams: Exam[] = [
  { id: 1, name: 'Ujian Pentaksiran 1', code: 'UP1', dateStart: '10-03-2026', dateEnd: '14-03-2026', status: 'Akan Datang' },
  { id: 2, name: 'Peperiksaan Pertengahan Tahun', code: 'PPT', dateStart: '15-06-2026', dateEnd: '26-06-2026', status: 'Akan Datang' },
  { id: 3, name: 'Percubaan SPM', code: 'TRIAL', dateStart: '01-11-2026', dateEnd: '20-11-2026', status: 'Akan Datang' },
  { id: 4, name: 'Peperiksaan Akhir Tahun', code: 'PAT', dateStart: '15-01-2027', dateEnd: '05-02-2027', status: 'Akan Datang' },
];

const initialSchedule: DetailedScheduleRow[] = [
  {
    id: 1,
    hari: "ISNIN",
    tarikh: "2026-03-10",
    tarikhDisplay: "10 MAC 2026",
    slots: [
      { id: 101, waktu: "08:00 AM - 10:00 AM", waktuMula: "08:00", waktuTamat: "10:00", subjek: "BAHASA MELAYU Kertas 1", durasi: "2 JAM", guruA: "C. ROS", guruB: "C. HAFIZ" },
      { id: 102, waktu: "11:00 AM - 01:30 PM", waktuMula: "11:00", waktuTamat: "13:30", subjek: "BAHASA MELAYU Kertas 2", durasi: "2 JAM 30 MIN", guruA: "C. ROS", guruB: "C. HAFIZ" }
    ]
  },
  {
    id: 2,
    hari: "SELASA",
    tarikh: "2026-03-11",
    tarikhDisplay: "11 MAC 2026",
    slots: [
      { id: 201, waktu: "08:00 AM - 09:30 AM", waktuMula: "08:00", waktuTamat: "09:30", subjek: "BAHASA INGGERIS Kertas 1", durasi: "1 JAM 30 MIN", guruA: "T. IZATI", guruB: "T. HAKIM" },
      { id: 202, waktu: "10:30 AM - 12:00 PM", waktuMula: "10:30", waktuTamat: "12:00", subjek: "BAHASA INGGERIS Kertas 2", durasi: "1 JAM 30 MIN", guruA: "T. IZATI", guruB: "T. HAKIM" }
    ]
  },
  {
    id: 3,
    hari: "RABU",
    tarikh: "2026-03-12",
    tarikhDisplay: "12 MAC 2026",
    slots: [
      { id: 301, waktu: "08:00 AM - 09:00 AM", waktuMula: "08:00", waktuTamat: "09:00", subjek: "SEJARAH Kertas 1", durasi: "1 JAM", guruA: "C. AIND", guruB: "C. FIKRUDDIN" },
      { id: 302, waktu: "10:00 AM - 12:30 PM", waktuMula: "10:00", waktuTamat: "12:30", subjek: "SEJARAH Kertas 2", durasi: "2 JAM 30 MIN", guruA: "C. AIND", guruB: "C. FIKRUDDIN" }
    ]
  },
  {
    id: 4,
    hari: "KHAMIS",
    tarikh: "2026-03-13",
    tarikhDisplay: "13 MAC 2026",
    slots: [
      { id: 401, waktu: "08:00 AM - 09:30 AM", waktuMula: "08:00", waktuTamat: "09:30", subjek: "MATEMATIK Kertas 1", durasi: "1 JAM 30 MIN", guruA: "C. IZZATI", guruB: "UZ ZULKIFLI" },
      { id: 402, waktu: "10:30 AM - 01:00 PM", waktuMula: "10:30", waktuTamat: "13:00", subjek: "MATEMATIK Kertas 2", durasi: "2 JAM 30 MIN", guruA: "C. IZZATI", guruB: "UZ ZULKIFLI" }
    ]
  }
];

const initialNotes = [
  "Calon dikehendaki membawa slip peperiksaan dan kad pengenalan ke dalam dewan.",
  "Sila berada di dewan peperiksaan sekurang-kurangnya 15 minit sebelum waktu bermula.",
  "Guru bertugas dikehendaki mengambil fail soalan di bilik peperiksaan 20 minit sebelum waktu."
];

const formatTimeDisplay = (time24: string) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return '';
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  
  const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (totalMinutes < 0) return 'Invalid';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  let res = '';
  if (hours > 0) res += `${hours} JAM `;
  if (minutes > 0) res += `${minutes} MIN`;
  return res.trim();
};

const getMalayDay = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
  return days[date.getDay()];
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGOS', 'SEP', 'OKT', 'NOV', 'DIS'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// --- HELPER: PAGINATION LOGIC ---
const paginateScheduleData = (data: DetailedScheduleRow[], slotsPerPage: number = 5) => {
    const pages: DetailedScheduleRow[][] = [];
    let currentPage: DetailedScheduleRow[] = [];
    let currentSlotsInPage = 0;

    data.forEach(dayRow => {
        if (currentSlotsInPage + dayRow.slots.length > slotsPerPage) {
            if (currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [];
                currentSlotsInPage = 0;
            }
        }
        currentPage.push(dayRow);
        currentSlotsInPage += dayRow.slots.length;
    });

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages;
};

export const KurikulumPeperiksaan: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [exams, setExams] = useState(dummyExams);
  
  // State for Form Selection
  const [selectedForm, setSelectedForm] = useState<string>('5');

  // Schedule State - Multi-form support
  const [schedules, setSchedules] = useState<Record<string, DetailedScheduleRow[]>>({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': initialSchedule // Default data in Form 5
  });

  const [scheduleTitle, setScheduleTitle] = useState("Jadual Waktu Peperiksaan Akhir Tahun");
  const [scheduleSubtitle, setScheduleSubtitle] = useState("Sesi Akademik 2025/2026");
  const [examNotes, setExamNotes] = useState<string[]>(initialNotes);
  const [suName, setSuName] = useState("SITI KHADIJAH BINTI MOH ZAIN");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<'header' | 'slot' | 'notes' | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const canEdit = user?.role === 'adminsistem' || user?.role === 'su_kuri';
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // Current Schedule Data based on Selection
  const currentScheduleData = schedules[selectedForm] || [];

  // Generate paginated data for PDF
  const pdfPages = paginateScheduleData(currentScheduleData, 5); // 5 slots per page

  const handleAddExam = () => {
    if (!isAdmin) return;
    const timestamp = Date.now();
    const newExam: Exam = {
      id: timestamp,
      name: 'Ujian Baru',
      code: 'NEW',
      dateStart: 'DD-MM-YYYY',
      dateEnd: 'DD-MM-YYYY',
      status: 'Akan Datang'
    };
    setExams([...exams, newExam]);
    showToast("Peperiksaan baharu ditambah.");
  };

  const openHeaderEdit = () => {
    setEditType('header');
    setEditData({ title: scheduleTitle, subtitle: scheduleSubtitle, suName: suName });
    setIsEditModalOpen(true);
  };

  const openNoteEdit = () => {
    setEditType('notes');
    setEditData({ text: examNotes.join('\n') });
    setIsEditModalOpen(true);
  };

  const openSlotEdit = (dayRow?: DetailedScheduleRow, slot?: ScheduleSlot) => {
    setEditType('slot');
    if (dayRow && slot) {
        setEditData({
            isNew: false,
            originalDate: dayRow.tarikh,
            slotId: slot.id,
            date: dayRow.tarikh,
            startTime: slot.waktuMula,
            endTime: slot.waktuTamat,
            subject: slot.subjek,
            duration: slot.durasi,
            teacherAList: slot.guruA ? slot.guruA.split('\n') : [],
            teacherBList: slot.guruB ? slot.guruB.split('\n') : [],
            tempTeacherA: '',
            tempTeacherB: ''
        });
    } else {
        setEditData({
            isNew: true,
            date: new Date().toISOString().split('T')[0],
            startTime: '08:00',
            endTime: '10:00',
            subject: '',
            duration: '2 JAM',
            teacherAList: [],
            teacherBList: [],
            tempTeacherA: '',
            tempTeacherB: ''
        });
    }
    setIsEditModalOpen(true);
  };

  const handleDeleteSlot = (date: string, slotId: number) => {
      if(!window.confirm("Padam slot ini?")) return;
      
      const newSchedule = currentScheduleData.map(day => {
          if (day.tarikh === date) {
              return { ...day, slots: day.slots.filter(s => s.id !== slotId) };
          }
          return day;
      }).filter(day => day.slots.length > 0);

      setSchedules({ ...schedules, [selectedForm]: newSchedule });
      showToast("Slot dipadam.");
  };

  const addTeacherToList = (venue: 'A' | 'B') => {
      const teacher = venue === 'A' ? editData.tempTeacherA : editData.tempTeacherB;
      if (!teacher) return;
      const listKey = venue === 'A' ? 'teacherAList' : 'teacherBList';
      const currentList = editData[listKey];
      if (currentList.length >= 7) { showToast("Maksima 7 pengawas sahaja."); return; }
      if (currentList.includes(teacher)) { showToast("Guru sudah ditambah."); return; }
      setEditData({
          ...editData,
          [listKey]: [...currentList, teacher],
          [venue === 'A' ? 'tempTeacherA' : 'tempTeacherB']: ''
      });
  };

  const removeTeacherFromList = (venue: 'A' | 'B', index: number) => {
      const listKey = venue === 'A' ? 'teacherAList' : 'teacherBList';
      const newList = editData[listKey].filter((_: string, i: number) => i !== index);
      setEditData({ ...editData, [listKey]: newList });
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
      const newData = { ...editData, [field]: value };
      if (newData.startTime && newData.endTime) {
          newData.duration = calculateDuration(newData.startTime, newData.endTime);
      }
      setEditData(newData);
  };

  const handleSave = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (editType === 'header') {
          setScheduleTitle(editData.title);
          setScheduleSubtitle(editData.subtitle);
          setSuName(editData.suName);
          showToast("Maklumat utama dikemaskini.");
      } else if (editType === 'notes') {
          setExamNotes(editData.text.split('\n').filter((n: string) => n.trim() !== ''));
          showToast("Nota dikemaskini.");
      } else if (editType === 'slot') {
          const timestamp = Date.now();
          const timeDisplay = `${formatTimeDisplay(editData.startTime)} - ${formatTimeDisplay(editData.endTime)}`;
          const newSlot: ScheduleSlot = {
              id: editData.isNew ? timestamp : editData.slotId,
              waktu: timeDisplay,
              waktuMula: editData.startTime,
              waktuTamat: editData.endTime,
              subjek: editData.subject,
              durasi: editData.duration,
              guruA: editData.teacherAList.join('\n'),
              guruB: editData.teacherBList.join('\n')
          };
          
          let newSchedule = [...currentScheduleData];
          
          if (!editData.isNew) {
              newSchedule = newSchedule.map(day => {
                  if (day.tarikh === editData.originalDate) {
                      return { ...day, slots: day.slots.filter(s => s.id !== editData.slotId) };
                  }
                  return day;
              }).filter(day => day.slots.length > 0);
          }
          
          const dayIndex = newSchedule.findIndex(d => d.tarikh === editData.date);
          if (dayIndex >= 0) {
              newSchedule[dayIndex].slots.push(newSlot);
              newSchedule[dayIndex].slots.sort((a, b) => a.waktuMula.localeCompare(b.waktuMula));
          } else {
              newSchedule.push({
                  id: timestamp,
                  tarikh: editData.date,
                  hari: getMalayDay(editData.date),
                  tarikhDisplay: formatDateDisplay(editData.date).toUpperCase(),
                  slots: [newSlot]
              });
          }
          newSchedule.sort((a, b) => a.tarikh.localeCompare(b.tarikh));
          
          setSchedules(prev => ({ ...prev, [selectedForm]: newSchedule }));
          showToast(editData.isNew ? "Slot ditambah." : "Slot dikemaskini.");
      }
      setIsEditModalOpen(false);
  }, [editType, editData, currentScheduleData, selectedForm, showToast, schedules]);

  // --- MULTI-PAGE PDF GENERATION (HIGH RESOLUTION) ---
  const handlePrintSchedule = async () => {
    if (!selectedForm) { showToast("Sila pilih tingkatan."); return; }
    if (currentScheduleData.length === 0) { showToast("Tiada data jadual untuk dijana."); return; }
    if (pdfPages.length === 0) { showToast("Ralat pemprosesan jadual."); return; }

    showToast("Sedang menjana PDF Resolusi Tinggi...");

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
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 800)); // Ensure render

        const { jsPDF } = (window as any).jspdf;
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = 297; // A4 Landscape width
        const pdfHeight = 210; // A4 Landscape height

        // Loop through each pre-rendered page div
        for (let i = 0; i < pdfPages.length; i++) {
            const pageElement = document.getElementById(`pdf-page-${i}`);
            if (!pageElement) continue;

            // Capture page with High Quality settings
            const canvas = await (window as any).html2canvas(pageElement, {
                scale: 4, // High Resolution (approx 300 DPI)
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: pageElement.scrollWidth,
                windowHeight: pageElement.scrollHeight,
                imageTimeout: 0,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            if (i > 0) pdf.addPage();
            
            // Add image to PDF exactly fitting A4
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`Jadual_Peperiksaan_Tingkatan_${selectedForm}.pdf`);
        showToast("PDF siap dimuat turun.");

    } catch (err) {
        console.error("PDF Gen Error:", err);
        showToast("Gagal menjana PDF.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-[#1C2541] rounded-xl p-6 border border-gray-700 shadow-lg hover:border-[#C9B458] transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#3A506B] text-white text-xs font-bold px-2 py-1 rounded">{exam.code}</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${exam.status === 'Selesai' ? 'bg-green-900/50 text-green-400 border-green-600' : exam.status === 'Sedang Berjalan' ? 'bg-blue-900/50 text-blue-400 border-blue-600' : 'bg-yellow-900/30 text-[#C9B458] border-[#C9B458]'}`}>{exam.status}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#C9B458] transition-colors">{exam.name}</h3>
                <div className="text-gray-400 text-sm space-y-1"><p>📅 Mula: <span className="text-gray-200">{exam.dateStart}</span></p><p>🏁 Tamat: <span className="text-gray-200">{exam.dateEnd}</span></p></div>
                {isAdmin && (<div className="mt-4 pt-4 border-t border-gray-700 flex justify-end"><button className="text-sm text-blue-400 hover:text-white flex items-center gap-1"><span>✏️</span> Edit</button></div>)}
              </div>
            ))}
            {isAdmin && (<div onClick={handleAddExam} className="bg-[#1C2541]/50 border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9B458] hover:bg-[#1C2541] transition-all min-h-[200px]"><div className="text-4xl text-gray-500 mb-2">+</div><p className="text-gray-400 font-semibold">Tambah Peperiksaan</p></div>)}
          </div>
        );
      case 'jadual':
        return (
          <div className="space-y-6 fade-in font-poppins pb-20">
            {/* Form Selector */}
            <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-thin pb-2">
                {['1', '2', '3', '4', '5'].map(f => (
                    <button
                        key={f}
                        onClick={() => setSelectedForm(f)}
                        className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md whitespace-nowrap
                            ${selectedForm === f 
                                ? 'bg-[#C9B458] text-[#0B132B] scale-105' 
                                : 'bg-[#1C2541] text-gray-400 hover:text-white hover:bg-[#253252]'}`}
                    >
                        Tingkatan {f}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center bg-gray-100 p-5 rounded-xl border border-gray-300 shadow-lg relative group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700 text-xl shadow-inner border border-gray-300">📅</div>
                 <div>
                     <h4 className="text-gray-800 font-bold uppercase text-base tracking-widest font-poppins">{scheduleTitle}</h4>
                     <p className="text-xs text-gray-500 font-medium font-poppins">{scheduleSubtitle} • TINGKATAN {selectedForm}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                  {canEdit && (<button onClick={openHeaderEdit} className="bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors shadow-md">✏️ Edit Tajuk</button>)}
                  <button onClick={handlePrintSchedule} className="bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 border border-gray-600 font-poppins"><span>📥</span> CETAK JADUAL</button>
              </div>
            </div>
            
            {canEdit && (<div className="flex justify-end"><button onClick={() => openSlotEdit()} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 shadow-lg flex items-center gap-2">+ Tambah Slot Baru (Ting {selectedForm})</button></div>)}
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse min-w-[1100px] font-poppins">
                  <thead>
                    <tr className="bg-gray-200 text-gray-800 text-sm font-bold uppercase tracking-wider">
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-44 align-middle text-center">Hari / Tarikh</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-56 align-middle text-center">Sesi / Masa</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 align-middle text-center">Mata Pelajaran Peperiksaan</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-36 align-middle text-center">Tempoh</th>
                      <th colSpan={2} className="px-6 py-4 border border-gray-300 bg-gray-300 text-gray-900 align-middle text-center">Guru Bertugas</th>
                      {canEdit && <th rowSpan={2} className="px-4 py-6 border border-gray-300 w-20 bg-gray-100 align-middle text-center">Aksi</th>}
                    </tr>
                    <tr className="bg-gray-100 text-gray-700 text-[11px] font-black uppercase tracking-[0.2em]">
                        <th className="px-4 py-3 border border-gray-300 align-middle text-center">{selectedForm} AL-HANAFI</th>
                        <th className="px-4 py-3 border border-gray-300 align-middle text-center">{selectedForm} AL-SYAFIE</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentScheduleData.length === 0 ? (<tr><td colSpan={canEdit ? 7 : 6} className="py-8 text-gray-500 italic">Tiada jadual ditetapkan untuk Tingkatan {selectedForm}.</td></tr>) : (currentScheduleData.map((dayRow) => (<React.Fragment key={dayRow.id}>{dayRow.slots.map((slot, idx) => (<tr key={`${dayRow.id}-${idx}`} className="hover:bg-gray-50 transition-all duration-300 text-gray-800 group">{idx === 0 && (<td rowSpan={dayRow.slots.length} className="px-4 py-8 border border-gray-300 font-bold bg-gray-50 text-center relative overflow-hidden align-middle"><div className="absolute top-0 left-0 w-1.5 h-full bg-gray-400"></div><div className="flex flex-col gap-1 relative z-10"><span className="text-gray-900 text-2xl font-black leading-none font-poppins">{dayRow.hari}</span><span className="text-[11px] text-gray-500 font-bold tracking-widest mt-1 font-poppins">{dayRow.tarikhDisplay}</span></div></td>)}<td className="px-4 py-6 border border-gray-300 font-mono text-[13px] text-gray-700 bg-gray-50/50 align-middle text-center">{slot.waktu}</td><td className="px-4 py-6 border border-gray-300 font-black text-gray-900 uppercase tracking-wider text-[15px] font-poppins align-middle text-center">{slot.subjek}</td><td className="px-4 py-6 border border-gray-300 font-bold text-gray-800 bg-gray-50/30 font-poppins align-middle text-center">{slot.durasi}</td><td className="px-4 py-4 border border-gray-300 font-bold text-center bg-white align-middle text-[12px] leading-relaxed"><div className="bg-gray-100 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-800 font-poppins whitespace-pre-wrap">{slot.guruA || "-"}</div></td><td className="px-4 py-4 border border-gray-300 font-bold text-center bg-white align-middle text-[12px] leading-relaxed"><div className="bg-gray-100 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-800 font-poppins whitespace-pre-wrap">{slot.guruB || "-"}</div></td>{canEdit && (<td className="px-2 py-3 border border-gray-300 bg-gray-50 text-center align-middle"><div className="flex flex-col gap-2 justify-center items-center h-full"><button onClick={() => openSlotEdit(dayRow, slot)} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Edit</button><button onClick={() => handleDeleteSlot(dayRow.tarikh, slot.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Padam</button></div></td>)}</tr>))}<tr className="bg-gray-50 h-4"><td colSpan={canEdit ? 7 : 6} className="border-y border-gray-200"></td></tr></React.Fragment>)))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-100 p-5 rounded-2xl border border-gray-300 flex items-start gap-4 relative group"><div className="text-2xl mt-1">⚠️</div><div className="flex-1"><p className="text-gray-700 font-bold text-sm uppercase mb-1 font-poppins">Nota Penting Pengurusan Peperiksaan:</p><ul className="text-[11px] text-gray-500 list-disc list-outside ml-4 space-y-1 font-poppins">{examNotes.map((note, i) => (<li key={i}>{note}</li>))}</ul></div>{canEdit && (<button onClick={openNoteEdit} className="absolute top-4 right-4 text-gray-400 hover:text-[#0B132B]">✏️</button>)}</div>
          </div>
        );
      case 'analisis':
      case 'laporan':
        // Reuse similar simple returns or the full code if needed, keeping it concise here for the patch
        return <div className="p-10 text-center text-gray-400">Modul dalam pembangunan.</div>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      {/* HEADER SECTION */}
      <div className="border-b border-gray-400 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2">
           <span className="font-bold">KURIKULUM</span><span className="opacity-50">/</span><span className="uppercase font-bold opacity-80">PEPERIKSAAN</span>
        </div>
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase">Pengurusan Peperiksaan</h2>
        <p className="text-black mt-1 opacity-70 font-semibold">Portal rasmi pengurusan takwim, jadual, dan analisis peperiksaan SMAAM.</p>
      </div>

      <div className="flex border-b border-slate-blue mb-8">
        {[{ key: 'info', label: 'Maklumat', icon: 'ℹ️' }, { key: 'jadual', label: 'Jadual Waktu', icon: '📅' }, { key: 'analisis', label: 'Analisis', icon: '📈' }, { key: 'laporan', label: 'Pelaporan', icon: '📑' }].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as Tab)} className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === tab.key ? 'text-gold' : 'text-gray-400 hover:text-white'}`}>
            <span className="mr-2">{tab.icon}</span>{tab.label}
            {activeTab === tab.key && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_10px_rgba(201,180,88,0.5)]"></div>}
          </button>
        ))}
      </div>

      <div>{renderTabContent()}</div>

      {/* --- PRINTABLE CONTAINER (HIDDEN BUT VISIBLE OFF-SCREEN) --- */}
      {/* 
          ENFORCED STYLE FOR PRINTING:
          - Pure Black Text (#000000)
          - High Contrast Borders
          - High DPI (Scale 4) friendly font weights
          - Font Family: Poppins (Same as web app)
          - Table Layout: Fixed
          - Columns:
            - Hari: 10%
            - Masa: 12%
            - Subjek: 28% (Fit Content)
            - Tempoh: 10%
            - Guru A: 20% (Wide & Centered)
            - Guru B: 20% (Wide & Centered)
      */}
      <div 
        id="pdf-content"
        style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            display: 'block',
            visibility: 'visible',
            backgroundColor: '#ffffff', // Required for clean capture
            zIndex: -1,
        }}
      >
        {pdfPages.length > 0 ? (
            pdfPages.map((pageData, index) => (
                <div 
                    key={index} 
                    id={`pdf-page-${index}`}
                    style={{
                        width: '297mm', // A4 Landscape
                        height: '210mm',
                        backgroundColor: '#ffffff',
                        padding: '10mm',
                        boxSizing: 'border-box',
                        position: 'relative',
                        marginBottom: '0',
                        color: '#000000', // FORCE BLACK TEXT
                        fontFamily: "'Poppins', sans-serif", // MATCH WEB APP FONT
                    }}
                >
                    {/* LETTERHEAD (Repeats on every page) */}
                    <div className="flex items-center gap-6 border-b-2 border-black pb-4 mb-6">
                        <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" alt="Logo Sekolah" className="w-24 h-auto object-contain" crossOrigin="anonymous" />
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl font-black uppercase tracking-wide leading-tight text-black">SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
                            <p className="text-sm font-bold uppercase mt-1 text-black">Jadual Waktu Peperiksaan</p>
                        </div>
                    </div>

                    {/* TITLE & INFO (Repeats on every page) */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-2">{scheduleTitle}</h2>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">{scheduleSubtitle}</p>
                        <p className="text-lg font-black uppercase text-black mt-2">TINGKATAN {selectedForm}</p>
                    </div>

                    {/* TABLE (Sliced Content) */}
                    <div className="mb-4 flex-1">
                        <table className="w-full text-sm text-left border-collapse border border-black table-fixed">
                            <thead className="text-xs uppercase bg-gray-100 tracking-wider text-black">
                                <tr>
                                    <th rowSpan={2} className="px-2 py-3 border border-black text-center align-middle font-black" style={{width: '10%'}}>Hari / Tarikh</th>
                                    <th rowSpan={2} className="px-2 py-3 border border-black text-center align-middle font-black" style={{width: '12%'}}>Sesi / Masa</th>
                                    <th rowSpan={2} className="px-2 py-3 border border-black font-black text-center align-middle" style={{width: '28%'}}>Mata Pelajaran Peperiksaan</th>
                                    <th rowSpan={2} className="px-2 py-3 border border-black text-center align-middle font-black" style={{width: '10%'}}>Tempoh</th>
                                    <th colSpan={2} className="px-2 py-2 border border-black bg-gray-200 text-center align-middle font-black" style={{width: '40%'}}>Guru Bertugas</th>
                                </tr>
                                <tr>
                                    <th className="px-2 py-2 border border-black text-center align-middle text-[10px] font-bold" style={{width: '20%'}}>{selectedForm} AL-HANAFI</th>
                                    <th className="px-2 py-2 border border-black text-center align-middle text-[10px] font-bold" style={{width: '20%'}}>{selectedForm} AL-SYAFIE</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-black font-medium">
                                {pageData.map((dayRow) => (
                                    <React.Fragment key={dayRow.id}>
                                        {dayRow.slots.map((slot, idx) => (
                                            <tr key={`${dayRow.id}-${idx}`}>
                                                {/* Logic to show date only on first slot of the day WITHIN this page. */}
                                                {idx === 0 && (
                                                    <td rowSpan={dayRow.slots.length} className="px-4 py-4 border border-black font-bold align-middle bg-white text-center">
                                                        <div className="text-sm uppercase text-black">{dayRow.hari}</div>
                                                        <div className="text-[10px] mt-1 text-black tracking-wide">{dayRow.tarikhDisplay}</div>
                                                    </td>
                                                )}
                                                <td className="px-2 py-3 border border-black font-bold text-center text-black align-middle">{slot.waktu}</td>
                                                <td className="px-2 py-3 border border-black font-bold text-center uppercase text-black align-middle">{slot.subjek}</td>
                                                <td className="px-2 py-3 border border-black text-center text-black font-bold align-middle">{slot.durasi}</td>
                                                <td className="px-2 py-3 border border-black text-center align-middle whitespace-pre-wrap leading-tight text-black">{slot.guruA || "-"}</td>
                                                <td className="px-2 py-3 border border-black text-center align-middle whitespace-pre-wrap leading-tight text-black">{slot.guruB || "-"}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER (Only on last page) */}
                    <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex justify-between items-end">
                            <div className="text-left w-1/3">
                                {/* Only show signature on the very last page of the PDF */}
                                {index === pdfPages.length - 1 && (
                                    <>
                                        <p className="text-xs font-bold mb-4 text-black">Disediakan Oleh,</p>
                                        <div className="flex flex-col items-start justify-center mb-1 w-full relative h-20">
                                            <img src="https://i.postimg.cc/dtSB936F/1.png" alt="Tandatangan" className="h-20 object-contain absolute bottom-0 left-0 grayscale brightness-0 contrast-200" crossOrigin="anonymous" />
                                        </div>
                                        <div className="border-b-2 border-black w-full mb-1"></div>
                                        <p className="text-xs font-black uppercase text-black">({suName})</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-black">SETIAUSAHA PEPERIKSAAN DALAMAN</p>
                                    </>
                                )}
                            </div>
                            <div className="text-right w-1/3">
                                <p className="text-[10px] text-black font-bold">Muka Surat {index + 1} dari {pdfPages.length}</p>
                                <p className="text-[10px] text-black italic">Dicetak pada: {new Date().toLocaleDateString('ms-MY')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="p-10 text-black">Tiada Data</div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm fade-in px-4 pt-24 overflow-y-auto">
              <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl relative mb-20">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                      {editType === 'header' ? 'Edit Tajuk Jadual' : editType === 'notes' ? 'Edit Nota Kaki' : 'Edit Slot Jadual'}
                  </h3>
                  <form onSubmit={handleSave} className="space-y-4">
                      {editType === 'header' && (
                          <>
                              <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Tajuk Utama</label>
                                  <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" />
                              </div>
                              <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Sub-Tajuk</label>
                                  <input type="text" value={editData.subtitle} onChange={e => setEditData({...editData, subtitle: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" />
                              </div>
                              <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Nama S/U Peperiksaan</label>
                                  <input type="text" value={editData.suName} onChange={e => setEditData({...editData, suName: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" />
                              </div>
                          </>
                      )}
                      {editType === 'notes' && (
                          <div>
                              <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Senarai Nota (Satu nota per baris)</label>
                              <textarea value={editData.text} onChange={e => setEditData({...editData, text: e.target.value})} className="w-full h-40 bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" />
                          </div>
                      )}
                      {editType === 'slot' && (
                          <>
                              <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Tarikh</label>
                                  <input 
                                    type="date" 
                                    value={editData.date} 
                                    onChange={e => setEditData({...editData, date: e.target.value})} 
                                    className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                                  />
                                  <p className="text-[10px] text-gray-400 mt-1">Hari: <span className="text-white font-bold">{getMalayDay(editData.date)}</span></p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Masa Mula</label>
                                      <input type="time" value={editData.startTime} onChange={e => handleTimeChange('startTime', e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Masa Tamat</label>
                                      <input type="time" value={editData.endTime} onChange={e => handleTimeChange('endTime', e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Mata Pelajaran</label>
                                  <input type="text" value={editData.subject} onChange={e => setEditData({...editData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" placeholder="Cth: BAHASA MELAYU Kertas 1" />
                                </div>
                                <div>
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Tempoh (Manual)</label>
                                  <input type="text" value={editData.duration} onChange={e => setEditData({...editData, duration: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white outline-none focus:border-[#C9B458]" />
                                </div>
                              </div>
                              <div className="border-t border-gray-700 pt-3">
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Guru Pengawas ({selectedForm} AL-HANAFI)</label>
                                  <div className="flex gap-2 mb-2">
                                      <select 
                                        value={editData.tempTeacherA} 
                                        onChange={e => setEditData({...editData, tempTeacherA: e.target.value})} 
                                        className="flex-1 bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-xs outline-none focus:border-[#C9B458]"
                                      >
                                          <option value="">Pilih Guru...</option>
                                          {TEACHER_SHORT_NAMES.map(t => <option key={t} value={t}>{t}</option>)}
                                      </select>
                                      <button type="button" onClick={() => addTeacherToList('A')} className="bg-green-600 px-3 rounded text-white font-bold text-xs hover:bg-green-500">+</button>
                                  </div>
                                  <div className="bg-[#0B132B] p-2 rounded border border-gray-700 min-h-[50px] max-h-[100px] overflow-y-auto">
                                      {editData.teacherAList.map((t: string, i: number) => (
                                          <div key={i} className="flex justify-between items-center text-xs text-white mb-1 last:mb-0 bg-gray-800 px-2 py-1 rounded">
                                              <span>{t}</span>
                                              <button type="button" onClick={() => removeTeacherFromList('A', i)} className="text-red-400 hover:text-white font-bold">×</button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="border-t border-gray-700 pt-3">
                                  <label className="text-xs text-[#C9B458] font-bold uppercase block mb-1">Guru Pengawas ({selectedForm} AL-SYAFIE)</label>
                                  <div className="flex gap-2 mb-2">
                                      <select 
                                        value={editData.tempTeacherB} 
                                        onChange={e => setEditData({...editData, tempTeacherB: e.target.value})} 
                                        className="flex-1 bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-xs outline-none focus:border-[#C9B458]"
                                      >
                                          <option value="">Pilih Guru...</option>
                                          {TEACHER_SHORT_NAMES.map(t => <option key={t} value={t}>{t}</option>)}
                                      </select>
                                      <button type="button" onClick={() => addTeacherToList('B')} className="bg-green-600 px-3 rounded text-white font-bold text-xs hover:bg-green-500">+</button>
                                  </div>
                                  <div className="bg-[#0B132B] p-2 rounded border border-gray-700 min-h-[50px] max-h-[100px] overflow-y-auto">
                                      {editData.teacherBList.map((t: string, i: number) => (
                                          <div key={i} className="flex justify-between items-center text-xs text-white mb-1 last:mb-0 bg-gray-800 px-2 py-1 rounded">
                                              <span>{t}</span>
                                              <button type="button" onClick={() => removeTeacherFromList('B', i)} className="text-red-400 hover:text-white font-bold">×</button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </>
                      )}
                      <div className="flex gap-3 pt-4">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 font-bold">Batal</button>
                          <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] rounded font-bold hover:bg-yellow-400 shadow-lg">Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};