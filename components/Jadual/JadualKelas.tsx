import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface ClassScheduleSlot {
  id: string;
  className: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  color: string;
}

const CLASS_LIST = [
    "1 Al-Hanafi", "1 Al-Syafie", "1 Al-Maliki",
    "2 Al-Hanafi", "2 Al-Syafie", "2 Al-Maliki",
    "3 Al-Hanafi", "3 Al-Syafie", "3 Al-Maliki",
    "4 Al-Hanafi", "4 Al-Syafie",
    "5 Al-Hanafi", "5 Al-Syafie"
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
  'RBT', 'MAA', 'AWAB', 'KKQ',
  'PER', 'ZUHUR', 'PERSATUAN/KELAB/UNIT BERUNIFORM', 'SUMUR/BUDAYA QURAN/TAHBIBUL LUGHAH'
];

const LONG_SUBJECTS = [
    'PERSATUAN/KELAB/UNIT BERUNIFORM',
    'SUKAN/PERMAINAN',
    'SUMUR/BUDAYA QURAN/TAHBIBUL LUGHAH'
];

const PERSENDIRIAN_COLORS = [
    { value: 'bg-blue-100 text-blue-900 border-blue-200', label: 'Biru (Teknik Vokasional)' },
    { value: 'bg-orange-100 text-orange-900 border-orange-200', label: 'Oren (Mate & Sains)' },
    { value: 'bg-yellow-100 text-yellow-900 border-yellow-200', label: 'Kuning (Kemanusiaan)' },
    { value: 'bg-green-100 text-green-900 border-green-200', label: 'Hijau (Agama)' },
    { value: 'bg-red-100 text-red-900 border-red-200', label: 'Merah (Sukan/Koko)' },
    { value: 'bg-purple-100 text-purple-900 border-purple-200', label: 'Ungu (Bahasa)' },
    { value: 'bg-gray-200 text-gray-700 border-gray-300', label: 'Kelabu (Rehat)' },
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

const INITIAL_CLASS_SCHEDULE: ClassScheduleSlot[] = [];

export const JadualKelas: React.FC = () => {
  const { checkPermission, showToast } = useApp();
  const canEdit = checkPermission('canUpdateJadualKelas');
  
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  
  // --- LAZY INITIALIZATION ---
  const [classSchedule, setClassSchedule] = useState<ClassScheduleSlot[]>(() => {
      try {
          const saved = localStorage.getItem('smaam_class_schedule');
          return saved ? JSON.parse(saved) : INITIAL_CLASS_SCHEDULE;
      } catch (e) {
          return INITIAL_CLASS_SCHEDULE;
      }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const saveToStorage = (data: ClassScheduleSlot[]) => {
    localStorage.setItem('smaam_class_schedule', JSON.stringify(data));
    setClassSchedule(data);
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
        teacher: item.teacher || '',
        color: defaultColor
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ClassScheduleSlot = {
        id: editingItem?.id || `${selectedClass}-${formData.day}-${formData.time}`,
        className: selectedClass,
        day: formData.day,
        time: formData.time,
        subject: formData.subject,
        teacher: formData.teacher,
        color: formData.color
    };
    const filtered = classSchedule.filter(s => !(s.className === selectedClass && s.day === formData.day && s.time === formData.time));
    saveToStorage([...filtered, payload]);
    showToast("Jadual kelas dikemaskini.");
    setIsModalOpen(false);
  };

  const handleDeleteSlot = () => {
      const filtered = classSchedule.filter(s => !(s.className === selectedClass && s.day === editingItem.day && s.time === editingItem.time));
      saveToStorage(filtered);
      showToast("Slot dipadam.");
      setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          Jadual Waktu Kelas
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">Pengurusan jadual waktu mengikut kelas.</p>
      </div>

      <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                    <label className="text-[#2DD4BF] font-bold uppercase tracking-wider text-sm block mb-1">Pilih Kelas</label>
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-[#2DD4BF] min-w-[200px]"
                    >
                        {CLASS_LIST.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300">
            <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                <table className="w-full text-center border-separate border-spacing-0 table-fixed min-w-[1500px] md:min-w-full">
                    <thead>
                        <tr className="bg-[#004e64] text-white text-xs font-normal tracking-wide uppercase">
                            {/* Sticky First Column */}
                            <th className="p-1 border-y border-l border-gray-600 bg-[#0B132B] w-24 md:w-20 font-bold sticky left-0 z-20 shadow-md">HARI/MASA</th>
                            {PERSENDIRIAN_PERIODS.map((p, i) => {
                                const parts = p.split(' - ');
                                return (
                                    <th key={i} className="p-1 border-y border-l border-gray-600 h-16 align-middle font-normal last:border-r">
                                        <div className="flex flex-col items-center justify-center leading-none text-[10px] md:text-[8px] lg:text-[10px]">
                                            <span>{parts[0]}</span>
                                            <span className="my-0.5 opacity-70">-</span>
                                            <span>{parts[1]}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-xs md:text-[9px] lg:text-[10px] text-gray-800 font-normal">
                        {PERSENDIRIAN_DAYS.map((day, dIdx) => (
                            <tr key={day} className="hover:bg-gray-50 transition-colors h-16 md:h-14">
                                {/* Sticky First Column */}
                                <td className="p-1 border-b border-l border-gray-300 bg-[#1C2541] text-[#2DD4BF] font-medium shadow-md sticky left-0 z-10 text-[10px] md:text-[9px]">
                                    {day}
                                </td>
                                {PERSENDIRIAN_PERIODS.map((p, pIdx) => {
                                    if (p === '10.30 - 11.00') {
                                        return (
                                            <td key={pIdx} className="bg-gray-300 border-b border-l border-gray-300 text-gray-500 font-medium p-0 last:border-r">
                                                <div className="h-full w-full flex items-center justify-center -rotate-90 text-[10px] md:text-[8px]">REHAT</div>
                                            </td>
                                        );
                                    }
                                    const slot = classSchedule.find(s => s.className === selectedClass && s.day === day && s.time === p);

                                    return (
                                        <td 
                                            key={pIdx} 
                                            className={`p-0 border-b border-l border-gray-300 h-full align-middle cursor-pointer hover:bg-gray-100 transition-colors last:border-r ${slot ? slot.color.split(' ')[0] : ''}`}
                                            onClick={() => canEdit && openEditModal({ day, time: p, ...slot })}
                                        >
                                            {slot && (
                                                <div className={`flex flex-col items-center justify-center h-full w-full p-0.5 rounded ${slot.color}`}>
                                                    <span className={`font-medium leading-tight text-center break-words ${LONG_SUBJECTS.includes(slot.subject) ? 'text-[6px] md:text-[5px] lg:text-[7px]' : 'text-xs md:text-[8px] lg:text-[10px]'}`}>
                                                        {slot.subject}
                                                    </span>
                                                    {slot.teacher && (
                                                        <span className="text-[10px] md:text-[7px] lg:text-[9px] mt-0.5 italic leading-tight opacity-90 text-center break-words">{slot.teacher}</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Kemaskini Slot Kelas</h3>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="text-xs text-gray-400 mb-2">Slot: <span className="text-white font-bold">{formData.day} @ {formData.time}</span></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Kosong</option>{PERSENDIRIAN_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru</label><select value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Tiada</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
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
