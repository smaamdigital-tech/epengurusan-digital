import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PrintPreviewModal } from '../PrintPreviewModal';

interface PersonalScheduleSlot {
  id: string;
  teacher: string;
  day: string;
  time: string;
  subject: string;
  className: string;
  color: string;
}

const TEACHER_FULL_NAMES = [
    "ZULKEFFLE BIN MUHAMMAD", "NORATIKAH ABD. KADIR", "SHAHARER BIN HJ HUSAIN", "ZULKIFLI BIN MD ASPAN",
    "ROSMAWATI @ ROHAYATI BINTI HUSSIN", "ZAHRAH KHAIRIAH NASUTION BINTI SALEH", "MAZUIN BINTI MAT",
    "NOORAIND BINTI ALI", "SAEMAH BINTI SUPANDI", "NOR AZEAN BINTI ISMAIL", "AHMAD FIKRUDDIN BIN AHMAD RAZA'I",
    "MOHAMMAD FIRROS BIN ROSOOL GANI", "LIYANA BINTI ISKANDAR", "MOHAMAD NASREEN HAKIM BIN CHE MOHAMED",
    "NIK NOORIZATI BINTI AB KAHAR", "NORASHIDAH BINTI A WAHAB", "NOR AIN BINTI MOHAMED JORI",
    "NURUL IZZATI BINTI ROSLIN", "NURUL SYAFIQAH BINTI HUSIN", "SITI NURUL LIZA BINTI SIDIN",
    "MUHAMMAD HAFIZ BIN JALIL", "NUURUL AMIRA BINTI RAZAK", "NOORLELA BINTI ZAINUDIN",
    "ANNUR AYUNI BINTI MOHAMED", "SALMAN BIN A RAHMAN", "MOHD NUR BIN AHMAD", "NOR HIDAYAH BINTI MAHADUN",
    "MASYITAH BINTI RAZALI", "MOHAMAD SUKRI BIN ALI", "MOHD NOR BIN SALIKIN", "NORLIYANA BINTI MHD. AMIN",
    "SITI AMINAH BINTI MOHAMED", "SYAHIDATUN NAJIHAH BINTI AZIZ", "ZARITH NAJIHA BINTI JAMAL"
];

const TEACHER_LIST = [
    "UZ ZULKEFFLE", "UZH ATIKAH", "UZ SHAHARER", "C. ZULKIFLI", 
    "C. ROS", "C. ZAHRAH", "C. MAZUIN", "C. AIND", 
    "UZH SAEMAH", "UZH AZEAN", "C. FIKRUDIN", "C. FIRROS", 
    "C. LIYANA", "T. HAKIM", "T. IZATI", "C. SHIDAH", 
    "T. AIN", "C. IZZATI", "C. SYAFIQAH", "C. LIZA", 
    "C. HAFIZ", "C. AMIRA", "UZH LELA", "UZH AYUNI", 
    "UZ SALMAN", "UZ MNUR", "UZH HIDAYAH", "UZH MASYITAH", 
    "UZ SUKRI", "UZ MNOR", "UZH LIYANA", "UZH AMINAH", 
    "UZH NAJIHAH", "UZH ZARITH"
];

const PERSENDIRIAN_SUBJECTS = [
  'BM', 'BI', 'MAT', 'SCN', 'SEJ', 'PNG', 'PSV', 'PJPK', 'GEO',
  'SYA', 'USL', 'LAM', 'MAN', 'ADB', 'DATA', 'PPPSS', 'OB',
  'GMLM', 'KOKO', 'SUKAN/PERMAINAN', 'PER/UB/KELAB', 'SOLAT JUMAAT',
  'RBT', 'MAA', 'AWAB', 'KKQ', 'ZUHUR', 'PER'
];

const PERSENDIRIAN_CLASSES = [
  '1H', '1S', '1M', '2H', '2S', '2M', '3H', '3S', '3M', '4H', '4S', '5H', '5S'
];

const PERSENDIRIAN_COLORS = [
    { value: 'bg-blue-100 text-blue-900 border-blue-200', label: 'Biru (Teknik Vokasional)' },
    { value: 'bg-orange-100 text-orange-900 border-orange-200', label: 'Oren (Mate & Sains)' },
    { value: 'bg-yellow-100 text-yellow-900 border-yellow-200', label: 'Kuning (Kemanusiaan)' },
    { value: 'bg-green-100 text-green-900 border-green-200', label: 'Hijau (Agama)' },
    { value: 'bg-red-100 text-red-900 border-red-200', label: 'Merah (Sukan/Koko)' },
    { value: 'bg-purple-100 text-purple-900 border-purple-200', label: 'Ungu (Bahasa)' },
    { value: 'bg-gray-200 text-gray-700 border-gray-300', label: 'Kelabu (Rehat/Zuhur)' },
    { value: 'bg-white text-gray-900 border-gray-200', label: 'Putih (Umum)' },
];

const PERSENDIRIAN_DAYS = ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT'];
const PERSENDIRIAN_PERIODS = [
  '7.30 - 8.00', '8.00 - 8.30', '8.30 - 9.00', '9.00 - 9.30', '9.30 - 10.00',
  '10.00 - 10.30', '10.30 - 11.00', '11.00 - 11.30', '11.30 - 12.00',
  '12.00 - 12.30', '12.30 - 1.00', '1.00 - 1.30', '1.30 - 2.00',
  '2.00 - 2.30', '2.30 - 3.00', '3.00 - 3.30', '3.30 - 4.00',
  '4.00 - 4.30', '4.30 - 5.00'
];

const INITIAL_PERSONAL_SCHEDULE: PersonalScheduleSlot[] = [];

const getShortName = (fullName: string) => {
    const index = TEACHER_FULL_NAMES.indexOf(fullName);
    return index !== -1 ? TEACHER_LIST[index] : fullName;
}

export const JadualPersendirian: React.FC = () => {
  const { checkPermission, showToast } = useApp();
  const canEdit = checkPermission('canUpdateJadualPersendirian');
  
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHER_FULL_NAMES[0]);
  
  // --- LAZY INITIALIZATION ---
  const [personalSchedule, setPersonalSchedule] = useState<PersonalScheduleSlot[]>(() => {
      try {
          const saved = localStorage.getItem('smaam_personal_schedule');
          return saved ? JSON.parse(saved) : INITIAL_PERSONAL_SCHEDULE;
      } catch {
          return INITIAL_PERSONAL_SCHEDULE;
      }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonalScheduleSlot | null>(null);
  const [formData, setFormData] = useState<Partial<PersonalScheduleSlot>>({});

  const handleDownloadPDF = () => {
      setShowPreview(true);
  };

  const executeDownload = () => {
      const element = document.getElementById('pdf-content');
      if (!element) return;
      
      showToast("Sedang menjana PDF...");
      
      const opt = {
          margin: 5,
          filename: `Jadual_Persendirian_${selectedTeacher.replace(/\s+/g, '_')}.pdf`,
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

  const saveToStorage = (data: PersonalScheduleSlot[]) => {
    localStorage.setItem('smaam_personal_schedule', JSON.stringify(data));
    setPersonalSchedule(data);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    let defaultColor = PERSENDIRIAN_COLORS[0].value;
    if (item.color) {
        const match = PERSENDIRIAN_COLORS.find(c => c.value === item.color);
        if (match) defaultColor = match.value;
        else defaultColor = item.color;
    }
    setFormData({
        day: item.day,
        time: item.time,
        subject: item.subject || '',
        className: item.className || '',
        color: defaultColor
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const shortName = getShortName(selectedTeacher);
    const payload: PersonalScheduleSlot = {
        id: editingItem?.id || `${selectedTeacher}-${formData.day}-${formData.time}`,
        teacher: selectedTeacher, 
        day: formData.day,
        time: formData.time,
        subject: formData.subject,
        className: formData.className,
        color: formData.color
    };
    
    const filtered = personalSchedule.filter(s => 
        !((s.teacher === selectedTeacher || s.teacher === shortName) && s.day === formData.day && s.time === formData.time)
    );
    saveToStorage([...filtered, payload]);
    showToast("Slot jadual dikemaskini.");
    setIsModalOpen(false);
  };

  const handleDeleteSlot = () => {
      if (!editingItem) return;
      const shortName = getShortName(selectedTeacher);
      const filtered = personalSchedule.filter(s => 
          !((s.teacher === selectedTeacher || s.teacher === shortName) && s.day === editingItem.day && s.time === editingItem.time)
      );
      saveToStorage(filtered);
      showToast("Slot dipadam.");
      setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          Jadual Waktu Persendirian
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">Pengurusan jadual waktu mengajar individu guru.</p>
      </div>

      <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                    <label className="text-[#C9B458] font-bold uppercase tracking-wider text-sm block mb-1">Pilih Guru</label>
                    <select 
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-[#C9B458] min-w-[350px]"
                    >
                        {TEACHER_FULL_NAMES.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={handleDownloadPDF} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
                📥 Muat Turun PDF
            </button>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300">
            <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                <table className="w-full text-center border-separate border-spacing-0 table-fixed min-w-[1500px] md:min-w-full">
                    <thead>
                        <tr className="bg-gray-100 text-gray-900 text-[11px] md:text-[9px] lg:text-[10px] uppercase font-medium tracking-wide">
                            {/* Sticky First Column */}
                            <th className="p-0 border-y border-l border-gray-400 w-28 md:w-20 relative h-24 overflow-hidden bg-[#1C2541] sticky left-0 z-20 shadow-lg">
                                <div className="absolute inset-0 w-full h-full" style={{
                                     background: 'linear-gradient(to bottom left, transparent calc(50% - 0.5px), #C9B458 calc(50% - 0.5px), #C9B458 calc(50% + 0.5px), transparent calc(50% + 0.5px))'
                                }}></div>
                                <div className="absolute top-2 right-2 text-xs font-bold leading-none text-[#C9B458]">MASA</div>
                                <div className="absolute bottom-2 left-2 text-xs font-bold leading-none text-[#C9B458]">HARI</div>
                            </th>
                            {PERSENDIRIAN_PERIODS.map((p, i) => {
                                const parts = p.split(' - ');
                                return (
                                    <th key={i} className="p-1 border-y border-l border-gray-400 font-medium leading-tight last:border-r">
                                        <div className="flex flex-col gap-1 items-center justify-center h-full text-[11px] md:text-[8px] lg:text-[10px]">
                                            <span>{parts[0]}</span>
                                            <span className="opacity-60 md:hidden">-</span>
                                            <span>{parts[1]}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-[11px] md:text-[9px] lg:text-[10px] text-gray-800 font-semibold">
                        {PERSENDIRIAN_DAYS.map((day, dIdx) => (
                            <tr key={day} className="hover:bg-gray-50 transition-colors h-20 md:h-16">
                                {/* Sticky First Column */}
                                <td className="p-1 border-b border-l border-gray-400 bg-gray-200 text-gray-900 font-bold shadow-md text-xs sticky left-0 z-10">
                                    {day}
                                </td>
                                {PERSENDIRIAN_PERIODS.map((p, pIdx) => {
                                    if (p === '10.30 - 11.00') {
                                        return (
                                            <td key={pIdx} className="p-0 border-b border-l border-gray-400 bg-gray-300 align-middle last:border-r">
                                                <div className="flex items-center justify-center h-full w-full">
                                                    <span className="text-gray-600 text-[10px] md:text-[8px] font-bold -rotate-90 whitespace-nowrap tracking-widest">REHAT</span>
                                                </div>
                                            </td>
                                        );
                                    }
                                    const shortName = getShortName(selectedTeacher);
                                    const slot = personalSchedule.find(s => (s.teacher === selectedTeacher || s.teacher === shortName) && s.day === day && s.time === p);
                                    
                                    return (
                                        <td 
                                            key={pIdx} 
                                            className={`p-0 border-b border-l border-gray-400 h-full align-middle cursor-pointer hover:bg-gray-100 transition-colors last:border-r ${slot ? slot.color.split(' ')[0] : ''}`}
                                            onClick={() => canEdit && openEditModal({ day, time: p, ...slot })}
                                        >
                                            {slot && (
                                                <div className={`flex flex-col items-center justify-center h-full w-full p-1 rounded ${slot.color}`}>
                                                    <span className="font-bold text-[10px] md:text-[8px] lg:text-[10px] leading-tight break-words text-center">{slot.subject}</span>
                                                    {slot.className && (
                                                        <span className="text-[9px] md:text-[7px] lg:text-[9px] mt-0.5 italic leading-tight opacity-90 break-words text-center">{slot.className}</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onDownload={executeDownload}
        onPrint={handlePrint}
        title={`Pratonton Jadual Persendirian ${selectedTeacher}`}
        orientation="landscape"
      >
        <div className="flex items-center gap-4 border-b-2 border-black pb-6 mb-8">
            <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" className="h-24 w-auto object-contain" alt="Logo Sekolah" crossOrigin="anonymous" />
            <div className="flex-1 text-center text-black">
                <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
                <h2 className="text-xl font-bold uppercase text-black">JADUAL WAKTU PERSENDIRIAN</h2>
                <p className="text-lg font-bold mt-1 uppercase text-black tracking-widest bg-gray-200 inline-block px-4 py-1 rounded border border-black">
                    {selectedTeacher}
                </p>
            </div>
        </div>

        <div className="mb-8">
            <table className="w-full text-center border-collapse border border-black table-fixed">
                <thead>
                    <tr className="bg-gray-300 text-black text-[10px] font-bold uppercase tracking-wide">
                        <th className="p-1 border border-black w-20">HARI/MASA</th>
                        {PERSENDIRIAN_PERIODS.map((p, i) => {
                            const parts = p.split(' - ');
                            return (
                                <th key={i} className="p-1 border border-black h-12 align-middle">
                                    <div className="flex flex-col items-center justify-center leading-none text-[9px]">
                                        <span>{parts[0]}</span>
                                        <span className="my-0.5">-</span>
                                        <span>{parts[1]}</span>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="text-[9px] text-black font-medium">
                    {PERSENDIRIAN_DAYS.map((day) => (
                        <tr key={day} className="h-16">
                            <td className="p-1 border border-black bg-gray-200 font-bold text-[10px]">
                                {day}
                            </td>
                            {PERSENDIRIAN_PERIODS.map((p, pIdx) => {
                                if (p === '10.30 - 11.00') {
                                    return (
                                        <td key={pIdx} className="bg-gray-400 border border-black p-0">
                                            <div className="h-full w-full flex items-center justify-center -rotate-90 text-[8px] font-bold text-white">REHAT</div>
                                        </td>
                                    );
                                }
                                const shortName = getShortName(selectedTeacher);
                                const slot = personalSchedule.find(s => (s.teacher === selectedTeacher || s.teacher === shortName) && s.day === day && s.time === p);

                                return (
                                    <td key={pIdx} className="p-0 border border-black h-full align-middle">
                                        {slot && (
                                            <div className="flex flex-col items-center justify-center h-full w-full p-0.5">
                                                <span className="font-bold leading-tight text-center break-words text-[9px]">
                                                    {slot.subject}
                                                </span>
                                                {slot.className && (
                                                    <span className="text-[8px] mt-0.5 italic leading-tight text-center break-words">{slot.className}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-12 pt-8 border-t border-black flex justify-between text-xs font-bold uppercase">
            <div className="text-center w-1/3">
                <p className="mb-16">Disediakan Oleh:</p>
                <div className="border-t border-black w-2/3 mx-auto"></div>
                <p className="mt-2">Guru Mata Pelajaran</p>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Kemaskini Slot Jadual</h3>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="text-xs text-gray-400 mb-2">Slot: <span className="text-white font-bold">{formData.day} @ {formData.time}</span></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Kosong</option>{PERSENDIRIAN_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kelas</label><select value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Tiada</option>{PERSENDIRIAN_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Warna Label</label><select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm">{PERSENDIRIAN_COLORS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                
                <div className="flex gap-2 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                   <button type="button" onClick={handleDeleteSlot} className="flex-1 py-2 bg-red-900/60 text-red-200 border border-red-700 rounded hover:bg-red-800">Padam Slot</button>
                   <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
