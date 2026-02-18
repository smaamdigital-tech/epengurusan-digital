import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

// --- CONSTANTS & MOCK DATA ---
const TEACHER_NAMES = [
  "Zulkeffle bin Muhammad", "Noratikah binti Abd. Kadir", "Shaharer bin Hj Husain", "Zulkifli bin Md Aspan",
  "Saemah binti Supandi", "Rosmawati binti Hussin", "Nooraind binti Ali", "Zahrah Khairiah binti Saleh",
  "Mazuin binti Mat", "Ahmad Fikruddin bin Ahmad Raza'i", "Annur Ayuni binti Mohamed", "Muhammad Hafiz bin Jalil",
  "Nik Noorizati binti Ab Kahar", "Noorlela binti Zainudin", "Nor Azean binti Ismail", "Salman bin A Rahman",
  "Siti Aminah binti Mohamed", "Syahidatun Najihah binti Aziz", "Mohd Nor bin Salikin"
];

const REASONS = ['Cuti Sakit (MC)', 'Cuti Rehat Khas (CRK)', 'Berkursus', 'Mesyuarat Luar', 'Urusan Keluarga', 'Mengiringi Murid', 'Lain-lain'];

const TIME_SLOTS = [
  { id: '1', label: '07:30 - 08:00' }, { id: '2', label: '08:00 - 08:30' }, { id: '3', label: '08:30 - 09:00' },
  { id: '4', label: '09:00 - 09:30' }, { id: '5', label: '09:30 - 10:00' }, { id: '6', label: '10:00 - 10:30 (Rehat)' },
  { id: '7', label: '10:30 - 11:00' }, { id: '8', label: '11:00 - 11:30' }, { id: '9', label: '11:30 - 12:00' },
  { id: '10', label: '12:00 - 12:30' }, { id: '11', label: '12:30 - 01:00' }
];

// --- ICONS ---
const Icons = {
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Print: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  UserX: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>,
  ShieldOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"/><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
};

// --- TYPES ---
interface AbsentRecord {
  id: string;
  teacherName: string;
  reason: string;
  status: 'PERLU_DIGANTI' | 'TIDAK_PERLU';
  date: string;
}

interface ReliefAssignment {
  recordId: string;
  slotId: string;
  className: string;
  subject: string;
  reliefTeacher: string;
  candidates: { name: string, currentLoad: number }[];
}

export const GuruGanti: React.FC = () => {
  const { showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Step 1 State
  const [formTeacher, setFormTeacher] = useState<string>('');
  const [formReason, setFormReason] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'PERLU_DIGANTI' | 'TIDAK_PERLU'>('PERLU_DIGANTI');
  const [absentList, setAbsentList] = useState<AbsentRecord[]>([]);

  // Step 2 State (Pengecualian)
  const [exemptedTeachers, setExemptedTeachers] = useState<string[]>([]);
  const [selectedExempt, setSelectedExempt] = useState<string>('');

  // Step 3 State (Jana)
  const [assignments, setAssignments] = useState<ReliefAssignment[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Print Preview State
  const [showPreview, setShowPreview] = useState(false);

  // --- LOGIC: MOCK GENERATOR ---
  const generateSchedule = () => {
    setIsProcessing(true);
    setTimeout(() => {
        const newAssignments: ReliefAssignment[] = [];
        
        absentList.forEach(absent => {
            if (absent.status === 'TIDAK_PERLU') return;

            const classCount = Math.floor(Math.random() * 3) + 2; 
            const usedSlots = new Set();

            for(let i=0; i<classCount; i++) {
                let slotIdx = Math.floor(Math.random() * TIME_SLOTS.length);
                if (slotIdx === 5) slotIdx++; // Skip Rehat
                const slot = TIME_SLOTS[slotIdx];
                
                if (usedSlots.has(slot.id)) continue;
                usedSlots.add(slot.id);

                const candidates = TEACHER_NAMES
                    .filter(t => 
                        t !== absent.teacherName &&
                        !absentList.find(a => a.teacherName === t) &&
                        !exemptedTeachers.includes(t)
                    )
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(t => ({ name: t, currentLoad: Math.floor(Math.random() * 5) }));

                const assignedTeacher = candidates.length > 0 ? candidates[0].name : "TIADA GURU (SILA PILIH)";

                newAssignments.push({
                    recordId: absent.id,
                    slotId: slot.id,
                    className: `${Math.floor(Math.random()*5)+1} ${['Al-Hanafi', 'Al-Syafie', 'Al-Maliki'][Math.floor(Math.random()*3)]}`,
                    subject: ['BM', 'BI', 'MAT', 'SEJ', 'PI', 'SAINS'][Math.floor(Math.random()*6)],
                    reliefTeacher: assignedTeacher,
                    candidates: candidates
                });
            }
        });

        newAssignments.sort((a, b) => parseInt(a.slotId) - parseInt(b.slotId));

        setAssignments(newAssignments);
        setIsGenerated(true);
        setIsProcessing(false);
        showToast("Jadual ganti berjaya dijana.");
    }, 1000);
  };

  const handleAddAbsent = () => {
    if (!formTeacher || !formReason) {
        alert("Sila pilih nama guru dan sebab.");
        return;
    }
    
    if (absentList.find(a => a.teacherName === formTeacher)) {
        alert("Guru ini telah ditambah dalam senarai.");
        return;
    }

    const newRecord: AbsentRecord = {
        id: Math.random().toString(36).substr(2, 9),
        teacherName: formTeacher,
        reason: formReason,
        status: formStatus,
        date: selectedDate
    };

    setAbsentList([...absentList, newRecord]);
    setFormTeacher('');
    setFormReason('');
    setExemptedTeachers(prev => prev.filter(t => t !== formTeacher));
    setIsGenerated(false);
  };

  const handleRemoveAbsent = (id: string) => {
    setAbsentList(absentList.filter(a => a.id !== id));
    setIsGenerated(false);
  };

  const handleAddExempt = () => {
      if (!selectedExempt) return;
      if (exemptedTeachers.includes(selectedExempt)) {
          alert("Guru ini telah dikecualikan.");
          return;
      }
      setExemptedTeachers([...exemptedTeachers, selectedExempt]);
      setSelectedExempt('');
      setIsGenerated(false); 
  };

  const handleRemoveExempt = (name: string) => {
      setExemptedTeachers(exemptedTeachers.filter(t => t !== name));
      setIsGenerated(false);
  };

  const handleOverrideRelief = (slotId: string, recordId: string, newTeacher: string) => {
      setAssignments(prev => prev.map(a => {
          if (a.slotId === slotId && a.recordId === recordId) {
              return { ...a, reliefTeacher: newTeacher };
          }
          return a;
      }));
  };

  const handlePrint = () => {
      const originalTitle = document.title;
      const formattedDate = selectedDate.split('-').reverse().join('-');
      document.title = `Jadual_Guru_Ganti_${formattedDate}`;
      window.print();
      setTimeout(() => {
         document.title = originalTitle; 
      }, 500);
  };

  const handleDownloadPDF = () => {
      const element = document.getElementById('pdf-content');
      if (!element) return;

      showToast("Sedang menjana PDF...");

      if (typeof (window as any).html2pdf === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = () => generatePDF(element);
          document.body.appendChild(script);
      } else {
          generatePDF(element);
      }
  };

  const generatePDF = (element: HTMLElement) => {
      const formattedDate = selectedDate.split('-').reverse().join('-');
      const opt = {
          margin: 0, 
          filename: `Jadual_Guru_Ganti_${formattedDate}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      (window as any).html2pdf().set(opt).from(element).save().then(() => {
          showToast("PDF berjaya dimuat turun.");
      });
  };

  const getDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ms-MY', { weekday: 'long' });
  };

  const getFormattedDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  };

  const availableForExemption = TEACHER_NAMES.filter(t => !absentList.find(a => a.teacherName === t));

  return (
    <div className="font-poppins min-h-screen text-gray-100 p-4 md:p-8 fade-in">
        <style>{`
            @media print {
                body * { visibility: hidden; }
                #print-preview-modal, #print-preview-modal * { visibility: visible; color: black !important; }
                #print-preview-modal { position: absolute; left: 0; top: 0; width: 100%; height: auto; margin: 0; padding: 0; background: white; z-index: 99999; overflow: visible; }
                .no-print { display: none !important; }
                @page { size: A4 portrait; margin: 10mm; }
            }
        `}</style>

        <div className="bg-transparent p-6 mb-6 border-l-8 border-red-600 print:hidden relative">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-[#1C2541] rounded-full flex items-center justify-center border-2 border-red-600/50 shadow-lg text-white">
                    <span className="text-3xl">🔄</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-wide font-montserrat text-black">PENGURUSAN GURU GANTI</h1>
                    <h2 className="text-sm font-light tracking-widest text-gray-600 uppercase">Sistem Penjanaan Automatik (SITIGANTI)</h2>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto pb-20 print:p-0 print:max-w-none">
            {/* Step 1: Maklumat Ketidakhadiran */}
            <section className="bg-[#1C2541] rounded-xl shadow-lg border border-gray-700 p-6 mb-8 relative overflow-hidden print:hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C9B458]"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center text-white">
                    <span className="bg-[#0B132B] p-2 rounded-lg mr-3 text-[#C9B458] border border-gray-600"><Icons.UserX /></span>
                    Langkah 1: Rekod Ketidakhadiran
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-[#C9B458] mb-1 tracking-widest">Tarikh</label>
                        <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setAbsentList([]); setAssignments([]); setExemptedTeachers([]); setIsGenerated(false); }} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                        <p className="text-[10px] text-gray-400 mt-1 font-bold bg-white/5 inline-block px-2 py-1 rounded">Hari: {getDayName(selectedDate)}</p>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-[#C9B458] mb-1 tracking-widest">Nama Guru</label>
                        <select value={formTeacher} onChange={(e) => setFormTeacher(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none"><option value="">Pilih Guru...</option>{TEACHER_NAMES.map(name => (<option key={name} value={name}>{name}</option>))}</select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-[#C9B458] mb-1 tracking-widest">Sebab</label>
                        <select value={formReason} onChange={(e) => setFormReason(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none"><option value="">Pilih Sebab...</option>{REASONS.map(r => (<option key={r} value={r}>{r}</option>))}</select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-[#C9B458] mb-1 tracking-widest">Status</label>
                        <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none"><option value="PERLU_DIGANTI">Perlu Diganti</option><option value="TIDAK_PERLU">Tidak Perlu</option></select>
                    </div>
                    <div className="lg:col-span-1 flex items-end">
                        <button onClick={handleAddAbsent} className="w-full bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg h-[42px]"><Icons.Plus /> Tambah</button>
                    </div>
                </div>
                {absentList.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="min-w-full text-left">
                            <thead className="bg-[#0B132B] text-[#C9B458] text-xs uppercase font-bold"><tr><th className="px-6 py-3">Nama Guru</th><th className="px-6 py-3">Sebab</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-center">Tindakan</th></tr></thead>
                            <tbody className="bg-[#1C2541] divide-y divide-gray-700 text-sm">{absentList.map(record => (<tr key={record.id} className="hover:bg-[#253252]"><td className="px-6 py-4 font-medium text-white">{record.teacherName}</td><td className="px-6 py-4 text-gray-400">{record.reason}</td><td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${record.status === 'PERLU_DIGANTI' ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-green-900/50 text-green-400 border border-green-800'}`}>{record.status === 'PERLU_DIGANTI' ? 'Perlu Ganti' : 'Tidak Perlu'}</span></td><td className="px-6 py-4 text-center"><button onClick={() => handleRemoveAbsent(record.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-full transition-colors"><Icons.Trash /></button></td></tr>))}</tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Step 2: Pengecualian Ganti */}
            <section className="bg-[#1C2541] rounded-xl shadow-lg border border-gray-700 p-6 mb-8 relative overflow-hidden print:hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center text-white"><span className="bg-[#0B132B] p-2 rounded-lg mr-3 text-red-500 border border-gray-600"><Icons.ShieldOff /></span> Langkah 2: Pengecualian Ganti</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-1 lg:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Pilih Guru Untuk Dikecualikan</label>
                        <div className="flex gap-2"><select value={selectedExempt} onChange={(e) => setSelectedExempt(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none text-sm"><option value="">-- Pilih Guru --</option>{availableForExemption.map(name => (<option key={name} value={name}>{name}</option>))}</select><button onClick={handleAddExempt} className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 px-4 rounded-lg font-bold">+</button></div>
                    </div>
                    <div className="md:col-span-1 lg:col-span-2 bg-[#0B132B] rounded-xl p-4 border border-gray-700 min-h-[100px]">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Senarai Pengecualian ({exemptedTeachers.length})</label>
                        <div className="flex flex-wrap gap-2">{exemptedTeachers.length === 0 && <span className="text-gray-600 text-xs italic p-2">Tiada guru dikecualikan.</span>}{exemptedTeachers.map(teacher => (<span key={teacher} className="bg-red-900/30 text-red-300 border border-red-800 rounded-lg px-3 py-1 text-xs flex items-center gap-2">{teacher}<button onClick={() => handleRemoveExempt(teacher)} className="hover:text-white font-bold text-red-500 hover:text-red-200">×</button></span>))}</div>
                    </div>
                </div>
            </section>

            {/* Step 3: Generate */}
            <section className="bg-[#1C2541] rounded-xl shadow-lg border border-gray-700 p-6 relative overflow-hidden print:hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#3A506B]"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center text-white"><span className="bg-[#0B132B] p-2 rounded-lg mr-3 text-[#3A506B] border border-gray-600"><Icons.Refresh /></span> Langkah 3: Penjanaan Jadual</h3>
                    {absentList.length > 0 && (<button onClick={generateSchedule} disabled={isProcessing} className={`mt-4 md:mt-0 px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all flex items-center gap-2 ${isProcessing ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#3A506B] hover:bg-[#4a6382] border border-gray-500'}`}>{isProcessing ? 'Sedang Menjana...' : 'Jana Jadual Automatik'}</button>)}
                </div>
                {!isGenerated && !isProcessing && absentList.length > 0 && (<p className="text-gray-500 italic text-center py-8 bg-[#0B132B] rounded-xl border border-dashed border-gray-700">Klik butang 'Jana Jadual Automatik' untuk mendapatkan cadangan guru ganti.</p>)}
                {isGenerated && (
                    <div className="space-y-8 animate-in fade-in">
                        {absentList.filter(a => a.status === 'PERLU_DIGANTI').map((absentTeacher) => {
                            const teacherAssignments = assignments.filter(a => a.recordId === absentTeacher.id);
                            return (
                                <div key={absentTeacher.id} className="border border-gray-700 rounded-xl overflow-hidden bg-[#0B132B]">
                                    <div className="bg-[#253252] px-6 py-3 border-b border-gray-700 flex justify-between items-center"><h4 className="font-bold text-white flex items-center gap-2"><span className="text-red-400">GURU TIDAK HADIR:</span> {absentTeacher.teacherName}</h4><span className="text-xs text-[#C9B458] font-bold bg-[#0B132B] px-3 py-1 rounded border border-[#C9B458]">{teacherAssignments.length} Kelas</span></div>
                                    <div className="overflow-x-auto"><table className="min-w-full text-left"><thead><tr className="bg-[#0B132B] text-gray-400 text-xs uppercase font-bold border-b border-gray-700"><th className="px-6 py-3">Masa</th><th className="px-6 py-3">Kelas</th><th className="px-6 py-3">Subjek</th><th className="px-6 py-3 w-1/3">Guru Ganti (Cadangan Sistem)</th><th className="px-6 py-3 text-center">Padam</th></tr></thead><tbody className="divide-y divide-gray-700 text-sm">{teacherAssignments.length === 0 ? (<tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">Tiada kelas perlu diganti.</td></tr>) : (teacherAssignments.map((assign, idx) => { const slotLabel = TIME_SLOTS.find(s => s.id === assign.slotId)?.label || assign.slotId; return (<tr key={`${assign.recordId}-${assign.slotId}`} className={idx % 2 === 0 ? 'bg-[#1C2541]' : 'bg-[#1C2541]/50'}><td className="px-6 py-3 font-mono text-[#C9B458]">{slotLabel}</td><td className="px-6 py-3 font-bold text-white">{assign.className}</td><td className="px-6 py-3 text-gray-300">{assign.subject}</td><td className="px-6 py-3"><select className="w-full bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white focus:border-[#C9B458] outline-none" value={assign.reliefTeacher || ""} onChange={(e) => handleOverrideRelief(assign.slotId, assign.recordId, e.target.value)}>{!assign.reliefTeacher && <option value="">-- Tiada Guru --</option>}{assign.reliefTeacher && <option value={assign.reliefTeacher}>{assign.reliefTeacher} (Cadangan)</option>}<optgroup label="Pilihan Lain">{assign.candidates.map(c => { if (c.name === assign.reliefTeacher) return null; return (<option key={c.name} value={c.name}>{c.name} (Beban: {c.currentLoad})</option>) })}</optgroup></select></td><td className="px-6 py-3 text-center"><button onClick={() => handleOverrideRelief(assign.slotId, assign.recordId, "")} title="Kosongkan" className="text-gray-500 hover:text-red-400 transition-colors"><Icons.Trash /></button></td></tr>); }))}</tbody></table></div>
                                </div>
                            )
                        })}
                        <div className="flex justify-end pt-4 border-t border-gray-700"><button onClick={() => setShowPreview(true)} className="bg-[#C9B458] text-[#0B132B] font-black py-3 px-8 rounded-lg shadow-xl flex items-center gap-2 transform transition-all hover:scale-105 border-2 border-[#0B132B]"><Icons.Eye /> PRATONTON & CETAK PDF</button></div>
                    </div>
                )}
            </section>

            {/* --- PRINT PREVIEW MODAL --- */}
            {showPreview && (
                <div id="print-preview-modal" className="fixed inset-0 z-50 bg-gray-900/95 flex justify-center items-start overflow-y-auto pt-10 pb-20">
                    <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative mx-auto my-auto print:shadow-none print:w-full print:max-w-none">
                        <div className="no-print sticky top-0 left-0 right-0 bg-[#3A506B] text-white p-4 flex justify-between items-center shadow-md z-50 mb-8 rounded-t-lg"><h3 className="font-bold text-lg flex items-center gap-2"><Icons.Print /> Pratonton Cetakan</h3><div className="flex gap-3"><button onClick={() => setShowPreview(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"><Icons.Close /> Tutup</button><button onClick={handleDownloadPDF} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors"><Icons.Download /> Muat Turun PDF</button><button onClick={handlePrint} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors">🖨️ Cetak / Simpan PDF</button></div></div>
                        <div id="pdf-content" className="p-10 font-serif text-black">
                            <div className="flex items-center gap-4 border-b-2 border-black pb-6 mb-8"><img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" className="h-28 w-auto object-contain" alt="Logo Sekolah" /><div className="flex-1 text-center text-black"><h1 className="text-3xl font-extrabold uppercase tracking-wide mb-1">JADUAL GURU GANTI</h1><h2 className="text-xl font-bold uppercase text-black">{getFormattedDate(selectedDate)}</h2><p className="text-sm font-semibold mt-1 uppercase text-black tracking-widest">SMA Al-Khairiah Al-Islamiah Mersing</p></div></div>
                            {absentList.filter(a => a.status === 'PERLU_DIGANTI').map((absentTeacher) => {
                                const teacherAssignments = assignments.filter(a => a.recordId === absentTeacher.id);
                                if (teacherAssignments.length === 0) return null;
                                return (
                                    <div key={absentTeacher.id} className="mb-10 break-inside-avoid text-black">
                                        <div className="mb-4 bg-gray-100 p-3 border-l-4 border-black"><p className="font-bold text-lg uppercase text-black">{absentTeacher.teacherName}</p><p className="text-sm italic text-black">Sebab: {absentTeacher.reason}</p></div>
                                        <table className="w-full text-left border-collapse border border-black mb-4 text-sm text-black"><thead><tr className="bg-gray-200 text-black"><th className="border border-black px-3 py-2 font-bold uppercase w-32 text-center text-black">Masa</th><th className="border border-black px-3 py-2 font-bold uppercase w-48 text-black">Kelas / Subjek</th><th className="border border-black px-3 py-2 font-bold uppercase text-black text-center">Guru Ganti</th><th className="border border-black px-3 py-2 font-bold uppercase w-32 text-center text-black">CATATAN</th></tr></thead><tbody>{teacherAssignments.map((assign) => { const slotLabel = TIME_SLOTS.find(s => s.id === assign.slotId)?.label || assign.slotId; return (<tr key={assign.slotId}><td className="border border-black px-3 py-2 font-semibold text-xs text-center align-middle text-black">{slotLabel}</td><td className="border border-black px-3 py-2 align-middle text-black"><div className="font-bold text-base text-black">{assign.className}</div><div className="text-xs uppercase bg-black text-white inline-block px-1 rounded mt-1">{assign.subject}</div></td><td className="border border-black px-3 py-2 font-bold uppercase align-middle text-lg text-black text-center">{assign.reliefTeacher || "TIADA GURU"}</td><td className="border border-black px-3 py-2"></td></tr>); })}</tbody></table>
                                    </div>
                                );
                            })}
                            <div className="mt-20 pt-10 border-t border-gray-400 break-inside-avoid text-black"><div className="flex justify-between items-end px-12"><div className="text-center w-1/3"><p className="mb-20 font-bold text-sm uppercase text-black">Disediakan Oleh,</p><div className="border-t border-black w-full mt-2"></div><p className="font-bold text-xs mt-2 uppercase tracking-wide text-black">Penyelaras Jadual Ganti</p></div><div className="text-center w-1/3"><p className="mb-20 font-bold text-sm uppercase text-black">Disahkan Oleh,</p><div className="border-t border-black w-full mt-2"></div><p className="font-bold text-xs mt-2 uppercase tracking-wide text-black">Pengetua / PK Pentadbiran</p></div></div><div className="mt-12 text-center text-[10px] text-black pt-4 border-t border-dotted border-gray-400">Dicetak secara automatik melalui Sistem Pengurusan Digital SMAAM pada {new Date().toLocaleString('ms-MY')}</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};