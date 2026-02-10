
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface JadualModuleProps {
  type: string;
}

// --- HELPERS ---
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper to identify system/locked data (Assumes initial data IDs are small integers < 1 billion)
const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false; 
};

// Helper for date conversion: "DD-MM-YYYY" <-> "YYYY-MM-DD"
const dmyToIso = (dmy: string) => {
    if(!dmy) return '';
    if(dmy.match(/^\d{4}-\d{2}-\d{2}$/)) return dmy; // already iso
    const [d, m, y] = dmy.split('-');
    if(!d || !m || !y) return '';
    return `${y}-${m}-${d}`;
}
const isoToDmy = (iso: string) => {
    if(!iso) return '';
    const [y, m, d] = iso.split('-');
    if(!y || !m || !d) return '';
    return `${d}-${m}-${y}`;
}

// --- CONSTANTS ---

const TEACHER_LIST = [
  "Zulkeffle bin Muhammad",
  "Noratikah binti Abd. Kadir",
  "Shaharer bin Hj Husain",
  "Zulkifli bin Md Aspan",
  "Saemah binti Supandi",
  "Rosmawati @ Rohayati binti Hussin",
  "Nooraind binti Ali",
  "Zahrah Khairiah Nasution binti Saleh",
  "Mazuin binti Mat",
  "Ahmad Fikruddin bin Ahmad Raza'i",
  "Annur Ayuni binti Mohamed",
  "Liyana binti Iskandar",
  "Masyitah binti Razali",
  "Mohamad Nasreen Hakim bin Che Mohamed",
  "Mohamad Sukri bin Ali",
  "Mohammad Firros bin Rosool Gani",
  "Mohd Nor bin Salikin",
  "Mohd Nur bin Ahmad",
  "Muhammad Hafiz bin Jalil",
  "Nik Noorizati binti Ab Kahar",
  "Noorlela binti Zainudin",
  "Nor Ain binti Mohamed Jori",
  "Nor Azean binti Ismail",
  "Nor Hidayah binti Mahadun",
  "Norashidah binti A Wahab",
  "Norliyana binti Mhd. Amin",
  "Nurul Izzati binti Roslin",
  "Nurul Syafiqah binti Husin",
  "Nuurul Amira binti Razak",
  "Salman bin A Rahman",
  "Siti Aminah binti Mohamed",
  "Siti Nurul Liza binti Sidin",
  "Syahidatun Najihah binti Aziz",
  "Zarith Najiha binti Jamal"
];

const SUBJECTS_LOWER = [
  "BM", "BI", "SEJ", "MAT", "SCN", "GEO", "PSV", "RBT", "USL", "SYA", "LAM", "PJPK", "UN", "1M1S", "KELAB", "KOKO", "SUKAN"
];

const SUBJECTS_UPPER = [
  "BM", "BI", "SEJ", "MAT", "SCN", "PNG", "USL", "SYA", "LAM", "MAA", "ADB", "PJPK", "UN", "1M1S", "KELAB", "KOKO", "SUKAN"
];

const CLASS_CODES = [
  "1H", "1S", "1M",
  "2H", "2S", "2M",
  "3H", "3S", "3M",
  "4H", "4S",
  "5H", "5S"
];

const ALL_SUBJECTS = Array.from(new Set([...SUBJECTS_LOWER, ...SUBJECTS_UPPER])).sort();

// --- DATA JADUAL PEMANTAUAN (DIKEMASKINI URUTAN & KOD GURU) ---
const initialPemantauanData = [
  {
    id: 1,
    monitor: "ZULKEFFLE BIN MUHAMMAD",
    position: "PENGETUA",
    items: [
      { code: "1.1", name: "Noratikah binti Abd. Kadir" },
      { code: "1.2", name: "Shaharer bin Hj Husain" },
      { code: "1.3", name: "Zulkifli bin Md Aspan" }
    ]
  },
  {
    id: 2,
    monitor: "NORATIKAH BINTI ABD. KADIR",
    position: "GPK PENTADBIRAN",
    items: [
      { code: "2.1", name: "Noorlela binti Zainudin" },
      { code: "2.2", name: "Nor Azean binti Ismail" },
      { code: "2.3", name: "Saemah binti Supandi" }
    ]
  },
  {
    id: 3,
    monitor: "SHAHARER BIN HJ HUSAIN",
    position: "GPK HAL EHWAL MURID",
    items: [
      { code: "3.1", name: "Rosmawati @ Rohayati binti Hussin" },
      { code: "3.2", name: "Salman bin A Rahman" },
      { code: "3.3", name: "Muhammad Hafiz bin Jalil" }
    ]
  },
  {
    id: 4,
    monitor: "ZULKIFLI BIN MD ASPAN",
    position: "GPK KOKURIKULUM",
    items: [
      { code: "4.1", name: "Mazuin binti Mat" },
      { code: "4.2", name: "Mohd Nur bin Ahmad" },
      { code: "4.3", name: "Nooraind binti Ali" },
      { code: "4.4", name: "Zahrah Khairiah Nasution binti Saleh" }
    ]
  },
  {
    id: 5,
    monitor: "SAEMAH BINTI SUPANDI",
    position: "GKMP AGAMA",
    items: [
      { code: "5.1", name: "Annur Ayuni binti Mohamed" },
      { code: "5.2", name: "Masyitah binti Razali" },
      { code: "5.3", name: "Mohamad Sukri bin Ali" },
      { code: "5.4", name: "Nor Hidayah binti Mahadun" }
    ]
  },
  {
    id: 6,
    monitor: "NOR AZEAN BINTI ISMAIL",
    position: "GKMP DINI",
    items: [
      { code: "6.1", name: "Norliyana binti Mhd. Amin" },
      { code: "6.2", name: "Siti Aminah binti Mohamed" },
      { code: "6.3", name: "Zarith Najiha binti Jamal" }
    ]
  },
  {
    id: 7,
    monitor: "ROSMAWATI @ ROHAYATI BINTI HUSSIN",
    position: "GKMP BAHASA",
    items: [
      { code: "7.1", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
      { code: "7.2", name: "Nor Ain binti Mohamed Jori" },
      { code: "7.3", name: "Siti Nurul Liza binti Sidin" }
    ]
  },
  {
    id: 8,
    monitor: "ZAHRAH KHAIRIAH NASUTION BINTI SALEH",
    position: "GKMP SAINS & MATEMATIK",
    items: [
      { code: "8.1", name: "Liyana binti Iskandar" },
      { code: "8.2", name: "Nik Noorizati binti Ab Kahar" },
      { code: "8.3", name: "Norashidah binti A Wahab" }
    ]
  },
  {
    id: 9,
    monitor: "NOORAIND BINTI ALI",
    position: "GKMP KEMANUSIAAN",
    items: [
      { code: "9.1", name: "Mohd Nor bin Salikin" },
      { code: "9.2", name: "Nurul Izzati binti Roslin" },
      { code: "9.3", name: "Syahidatun Najihah binti Aziz" }
    ]
  },
  {
    id: 10,
    monitor: "MAZUIN BINTI MAT",
    position: "GKMP TEKNIK & VOKASIONAL",
    items: [
      { code: "10.1", name: "Ahmad Fikruddin bin Ahmad Raza'i" },
      { code: "10.2", name: "Nurul Syafiqah binti Husin" },
      { code: "10.3", name: "Nuurul Amira binti Razak" },
      { code: "10.4", name: "Mohammad Firros bin Rosool Gani" }
    ]
  }
];

// --- MOCK DATA INITIALIZERS ---

const initialGuruGanti = [
  { id: 1, date: '26-10-2026', time: '08:00 AM - 09:00 AM', class: '5 Al-Hanafi', subject: 'MAT', absent: 'Zulkeffle bin Muhammad', relief: 'Zulkifli bin Md Aspan', status: 'Ganti' },
  { id: 2, date: '26-10-2026', time: '10:30 AM - 11:30 AM', class: '3 Al-Syafie', subject: 'SEJ', absent: 'Siti Aminah binti Mohamed', relief: 'Noratikah binti Abd. Kadir', status: 'Ganti' },
  { id: 3, date: '26-10-2026', time: '12:00 PM - 01:00 PM', class: '4 Al-Hanafi', subject: 'PNG', absent: 'Mohd Nor bin Salikin', relief: 'Annur Ayuni binti Mohamed', status: 'Ganti' },
  { id: 4, date: '27-10-2026', time: '07:30 AM - 08:30 AM', class: '1 Al-Maliki', subject: 'SCN', absent: 'Masyitah binti Razali', relief: 'Mohamad Nasreen Hakim bin Che Mohamed', status: 'Relief' },
];

const initialFormCoordinators = [
  { id: 1, form: 'Penyelaras Tahfiz', name: 'Salman bin A Rahman' },
  { id: 2, form: 'Penyelaras Tingkatan 1', name: 'Mohammad Firros bin Rosool Gani' },
  { id: 3, form: 'Penyelaras Tingkatan 2', name: "Ahmad Fikruddin bin Ahmad Raza'i" },
  { id: 4, form: 'Penyelaras Tingkatan 3', name: 'Siti Aminah binti Mohamed' },
  { id: 5, form: 'Penyelaras Tingkatan 4', name: 'Nik Noorizati binti Ab Kahar' },
  { id: 6, form: 'Penyelaras Tingkatan 5', name: 'Norashidah binti A Wahab' },
];

const initialClassTeachers = [
  // Tingkatan 1
  { id: 1, form: '1', class: '1 Al-Hanafi', teacher: 'Mohammad Firros bin Rosool Gani' },
  { id: 2, form: '1', class: '1 Al-Syafie', teacher: 'Nurul Syafiqah binti Husin' },
  { id: 3, form: '1', class: '1 Al-Maliki', teacher: 'Syahidatun Najihah binti Aziz' },
  // Tingkatan 2
  { id: 4, form: '2', class: '2 Al-Hanafi', teacher: 'Siti Nurul Liza binti Sidin' },
  { id: 5, form: '2', class: '2 Al-Syafie', teacher: 'Masyitah binti Razali' },
  { id: 6, form: '2', class: '2 Al-Maliki', teacher: "Ahmad Fikruddin bin Ahmad Raza'i" },
  // Tingkatan 3
  { id: 7, form: '3', class: '3 Al-Hanafi', teacher: 'Nor Hidayah binti Mahadun' },
  { id: 8, form: '3', class: '3 Al-Syafie', teacher: 'Mohd Nur bin Ahmad' },
  { id: 9, form: '3', class: '3 Al-Maliki', teacher: 'Siti Aminah binti Mohamed' },
  // Tingkatan 4
  { id: 10, form: '4', class: '4 Al-Hanafi', teacher: 'Nik Noorizati binti Ab Kahar' },
  { id: 11, form: '4', class: '4 Al-Syafie', teacher: 'Annur Ayuni binti Mohamed' },
  // Tingkatan 5
  { id: 12, form: '5', class: '5 Al-Hanafi', teacher: 'Norashidah binti A Wahab' },
  { id: 13, form: '5', class: '5 Al-Syafie', teacher: 'Nurul Izzati binti Roslin' },
];

// Generate Time Slots 7:30 to 17:00 (30 mins) with "7.30 - 8.00" stack format
const generateTimeSlots = () => {
  const slots = [];
  let current = 7.5; // 7:30
  const end = 17.0; // 17:00
  
  while (current < end) {
    const startVal = current;
    const endVal = current + 0.5;
    
    const format = (val: number) => {
        let h = Math.floor(val);
        const m = Math.round((val - h) * 60);
        if (h > 12) h -= 12;
        return `${h}.${m.toString().padStart(2, '0')}`;
    }
    
    const label = `${format(startVal)}\n-\n${format(endVal)}`;
    slots.push(label);
    current += 0.5;
  }
  return slots;
};

const timeSlots = generateTimeSlots();
const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

export const JadualModule: React.FC<JadualModuleProps> = ({ type }) => {
  const { 
    user, showToast, checkPermission, 
    teacherGroups, updateTeacherGroups, 
    speechSchedule, updateSpeechSchedule 
  } = useApp();
  
  const isSuperAdmin = user?.role === 'adminsistem';
  
  // Determine specific permission based on type
  const getPermissionKey = () => {
    switch (type) {
        case 'Guru Ganti': return 'canUpdateJadualGanti';
        case 'Guru Kelas': return 'canUpdateJadualGuruKelas';
        case 'Jadual Persendirian': return 'canUpdateJadualPersendirian';
        case 'Jadual Kelas': return 'canUpdateJadualKelas';
        case 'Jadual Berucap': return 'canUpdateJadualBerucap';
        case 'Jadual Pemantauan': return 'canUpdateJadualPemantauan';
        default: return 'canUpdateJadualGlobal';
    }
  };

  const permKey = getPermissionKey();
  const canEdit = checkPermission(permKey);

  // --- STATE MANAGEMENT ---
  const [teacherList, setTeacherList] = useState(TEACHER_LIST);
  const [reliefList, setReliefList] = useState(initialGuruGanti);
  const [coordinators, setCoordinators] = useState(initialFormCoordinators);
  const [classTeachers, setClassTeachers] = useState(initialClassTeachers);
  const [monitoringList, setMonitoringList] = useState(initialPemantauanData);
  
  // Schedule Overrides (Key: "Context-Day-Time", Value: { subject, code, color, teacher })
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'relief' | 'coordinator' | 'classTeacher' | 'scheduleSlot' | 'addClass' | 'speech' | 'monitoring' | 'editGroup' | 'addCoordinator' | 'addTeacher'>('relief');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form Data State
  const [formData, setFormData] = useState<any>({});

  // Context Selectors for Schedules
  const [selectedTeacher, setSelectedTeacher] = useState(teacherList[0]);
  const [selectedClass, setSelectedClass] = useState('5 Al-Hanafi');

  // --- HELPER: Detect Form Level ---
  const getFormLevel = (className: string) => {
    const firstChar = className.trim().charAt(0);
    const level = parseInt(firstChar);
    return isNaN(level) ? 1 : level;
  };

  // --- HELPER: Get Short Name (Before bin/binti) ---
  const getShortName = (fullName: string) => {
    if (!fullName) return '';
    const split = fullName.split(/ bin | binti /i);
    return split[0];
  };

  // --- MOCK GENERATORS (Fallback if no state override) ---
  const getPersonalSlotData = (day: string, time: string) => {
    const key = `${selectedTeacher}-${day}-${time}`;
    // Clear default data, only return user-entered data
    return scheduleData[key] || null;
  };

  const getClassSlotData = (day: string, time: string) => {
    const key = `${selectedClass}-${day}-${time}`;
    // Clear default data, only return user-entered data
    return scheduleData[key] || null;
  };

  // --- HANDLERS ---

  const openEditModal = (type: typeof modalType, item: any, extraData?: any) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);

    if (type === 'relief') {
        setFormData(item || { date: '', time: '', class: '', subject: '', absent: '', relief: '', status: 'Ganti' });
    } else if (type === 'coordinator') {
        setFormData(item);
    } else if (type === 'addCoordinator') {
        setFormData({ form: '', name: '' });
    } else if (type === 'classTeacher') {
        setFormData(item);
    } else if (type === 'addClass') {
        setFormData({ className: '', teacherName: '' });
    } else if (type === 'speech') {
        setFormData(item || { week: '', date: '', group: '', speaker: '', topic: '', civic: '', sumur: '' });
    } else if (type === 'monitoring') {
        const itemsStr = item.items.map((i: any) => `${i.code}|${i.name}`).join('\n');
        setFormData({ ...item, itemsStr });
    } else if (type === 'scheduleSlot') {
        setFormData({
            ...extraData,
            subject: item?.subject || '',
            code: item?.code || '',
            teacher: item?.teacher || '',
            color: item?.color || 'bg-blue-100 text-blue-900 border border-blue-200' // Default to Blue
        });
    } else if (type === 'editGroup') {
        setFormData({ ...item, membersStr: item.members.join('\n') });
    } else if (type === 'addTeacher') {
        setFormData({ name: '' });
    }
  };

  const handleDeleteSpeech = (id: number) => {
      if (isSystemData(id) && !isSuperAdmin) {
          showToast("Akses Ditolak: Data asal sistem dikunci.");
          return;
      }
      if(window.confirm("Padam rekod jadual berucap ini?")) {
          updateSpeechSchedule(speechSchedule.filter(s => s.id !== id));
          showToast("Rekod dipadam.");
      }
  };
  
  const handleDeleteCoordinator = (id: number) => {
      if (isSystemData(id) && !isSuperAdmin) {
          showToast("Akses Ditolak: Data asal sistem dikunci.");
          return;
      }
      if(window.confirm("Padam penyelaras ini?")) {
          setCoordinators(coordinators.filter(c => c.id !== id));
          showToast("Penyelaras dipadam.");
      }
  };

  const handleDeleteClassTeacher = (id: number) => {
      if (isSystemData(id) && !isSuperAdmin) {
          showToast("Akses Ditolak: Data asal sistem dikunci.");
          return;
      }
      if(window.confirm("Padam guru kelas ini?")) {
          setClassTeachers(classTeachers.filter(c => c.id !== id));
          showToast("Guru kelas dipadam.");
      }
  };

  const handleDeleteSlot = () => {
      if (window.confirm("Adakah anda pasti ingin memadam data slot ini?")) {
          const key = `${formData.context}-${formData.day}-${formData.time}`;
          const newScheduleData = { ...scheduleData };
          delete newScheduleData[key];
          setScheduleData(newScheduleData);
          setIsModalOpen(false);
          showToast("Data slot berjaya dipadam.");
      }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if editing a system/locked item (using ID check < 1 billion)
    // Allow Super Admin to bypass this check
    if (editingItem && editingItem.id && isSystemData(editingItem.id) && !isSuperAdmin) {
        showToast("Akses Ditolak: Data asal sistem dikunci dan tidak boleh diubah.");
        setIsModalOpen(false);
        return;
    }

    if (modalType === 'relief') {
        if (editingItem) {
            setReliefList(reliefList.map(r => r.id === editingItem.id ? { ...formData, id: r.id } : r));
            showToast("Jadual guru ganti dikemaskini");
        } else {
            setReliefList([...reliefList, { ...formData, id: Date.now() }]);
            showToast("Jadual guru ganti ditambah");
        }
    } else if (modalType === 'coordinator') {
        setCoordinators(coordinators.map(c => c.id === editingItem.id ? { ...c, name: formData.name } : c));
        showToast("Penyelaras dikemaskini");
    } else if (modalType === 'addCoordinator') {
        setCoordinators([...coordinators, { id: Date.now(), form: formData.form, name: formData.name }]);
        showToast("Penyelaras ditambah");
    } else if (modalType === 'classTeacher') {
        setClassTeachers(classTeachers.map(c => c.id === editingItem.id ? { ...c, teacher: formData.teacher } : c));
        showToast("Guru kelas dikemaskini");
    } else if (modalType === 'addClass') {
        const newClass = {
            id: Date.now(),
            form: getFormLevel(formData.className).toString(),
            class: formData.className,
            teacher: formData.teacherName
        };
        setClassTeachers([...classTeachers, newClass]);
        setSelectedClass(formData.className);
        showToast(`Kelas ${formData.className} berjaya ditambah.`);
    } else if (modalType === 'speech') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            week: formData.week,
            date: formData.date,
            group: formData.group,
            speaker: formData.speaker,
            topic: formData.topic,
            civic: formData.civic,
            sumur: formData.sumur
        };

        if (editingItem) {
            updateSpeechSchedule(speechSchedule.map(s => s.id === editingItem.id ? payload : s));
            showToast("Jadual berucap dikemaskini");
        } else {
            updateSpeechSchedule([...speechSchedule, payload]);
            showToast("Jadual berucap ditambah");
        }
    } else if (modalType === 'monitoring') {
        const newItems = formData.itemsStr.split('\n').map((line: string) => {
            const [code, name] = line.split('|');
            return { code: code?.trim(), name: name?.trim() };
        }).filter((i: any) => i.code && i.name);

        const updatedGroup = {
            ...editingItem,
            monitor: formData.monitor,
            position: formData.position,
            items: newItems
        };
        
        setMonitoringList(monitoringList.map(g => g.id === editingItem.id ? updatedGroup : g));
        showToast("Jadual pemantauan dikemaskini");
    } else if (modalType === 'scheduleSlot') {
        const key = `${formData.context}-${formData.day}-${formData.time}`;
        const newSlotData = {
            subject: formData.subject,
            code: formData.code,
            teacher: formData.teacher,
            color: formData.color
        };

        setScheduleData(prev => ({
            ...prev,
            [key]: newSlotData
        }));
        showToast("Slot jadual dikemaskini");
    } else if (modalType === 'editGroup') {
        const newMembers = formData.membersStr.split('\n').filter((m: string) => m.trim() !== '');
        const updatedGroup = { ...editingItem, members: newMembers };
        updateTeacherGroups(teacherGroups.map(g => g.id === editingItem.id ? updatedGroup : g));
        showToast(`Ahli kumpulan ${editingItem.name} dikemaskini.`);
    } else if (modalType === 'addTeacher') {
        if (formData.name && !teacherList.includes(formData.name)) {
            setTeacherList([...teacherList, formData.name]);
            setSelectedTeacher(formData.name);
            showToast(`Guru ${formData.name} berjaya ditambah.`);
        } else {
            showToast(`Guru ${formData.name} sudah wujud atau nama tidak sah.`);
        }
    }

    setIsModalOpen(false);
  };

  const colorOptions = [
      { label: 'Biru (Teknik Vokasional)', value: 'bg-blue-100 text-blue-900 border border-blue-200' },
      { label: 'Oren (Mate & Sains)', value: 'bg-orange-100 text-orange-900 border border-orange-200' },
      { label: 'Kuning (Kemanusiaan)', value: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
      { label: 'Hijau (Agama)', value: 'bg-green-100 text-green-900 border border-green-200' },
      { label: 'Merah (Sukan/Koko)', value: 'bg-red-100 text-red-900 border border-red-200' },
      { label: 'Ungu (Bahasa)', value: 'bg-purple-100 text-purple-900 border border-purple-200' },
      { label: 'Kelabu (Rehat)', value: 'bg-gray-200 text-gray-600 border border-gray-300' },
      { label: 'Kosong', value: 'hidden' },
  ];

  const renderCross = (colorClass: string) => {
      if (colorClass.includes('has-cross-red')) return <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><svg viewBox="0 0 24 24" width="40" height="40" stroke="red" strokeWidth="1" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg></div>;
      if (colorClass.includes('has-cross-green')) return <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><svg viewBox="0 0 24 24" width="40" height="40" stroke="green" strokeWidth="1" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg></div>;
      if (colorClass.includes('has-cross-purple')) return <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><svg viewBox="0 0 24 24" width="40" height="40" stroke="purple" strokeWidth="1" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg></div>;
      return null;
  }

  // --- SUB-COMPONENTS ---

  const GuruGantiView = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
      <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Jadual Guru Ganti (Harian)</h3>
            <span className="bg-[#3A506B] text-[#C9B458] px-3 py-1 rounded text-sm font-mono">{new Date().toLocaleDateString('ms-MY')}</span>
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-[#3A506B]/20 text-[#C9B458] text-sm font-extrabold uppercase tracking-wider text-center">
              <th className="px-6 py-4">Masa</th>
              <th className="px-6 py-4">Kelas & Subjek</th>
              <th className="px-6 py-4">Guru Tidak Hadir</th>
              <th className="px-6 py-4">Guru Ganti</th>
              <th className="px-6 py-4">Status</th>
              {canEdit && <th className="px-6 py-4 text-center">Tindakan</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {reliefList.map((item) => (
              <tr key={item.id} className="hover:bg-[#253252] transition-colors text-center">
                <td className="px-6 py-4 font-mono text-gray-300 whitespace-nowrap">{item.time}</td>
                <td className="px-6 py-4">
                   <div className="font-bold text-white">{item.class}</div>
                   <div className="text-xs text-gray-500">{item.subject}</div>
                </td>
                <td className="px-6 py-4 text-gray-400">{item.absent}</td>
                <td className="px-6 py-4 font-medium text-[#C9B458]">{item.relief}</td>
                <td className="px-6 py-4 text-center">
                   <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-xs border border-green-800">
                     {item.status}
                   </span>
                </td>
                {canEdit && (
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => openEditModal('relief', item)}
                            className={`${isSystemData(item.id) && !isSuperAdmin ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-white'}`}
                            title={isSystemData(item.id) && !isSuperAdmin ? 'Dikunci' : 'Kemaskini'}
                        >
                            {isSystemData(item.id) && !isSuperAdmin ? '🔒' : '✏️ Edit'}
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

  const GuruKelasView = () => (
    <div className="space-y-8 fade-in">
      <div className="bg-[#1C2541] rounded-xl border-l-4 border-[#C9B458] p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Penyelaras Tingkatan</h3>
            {canEdit && (
                <button onClick={() => openEditModal('addCoordinator', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah</button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coordinators.map((coord) => (
            <div key={coord.id} className="flex items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-lg border border-gray-700 group">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#3A506B] flex items-center justify-center font-bold text-[#C9B458]">
                      {coord.id}
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{coord.form}</p>
                      <p className="font-semibold text-white">{coord.name}</p>
                   </div>
               </div>
               {canEdit && (
                   <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                           onClick={() => openEditModal('coordinator', coord)} 
                           className={`${isSystemData(coord.id) && !isSuperAdmin ? 'text-gray-500' : 'text-gray-500 hover:text-[#C9B458]'}`}
                       >
                           {isSystemData(coord.id) && !isSuperAdmin ? '🔒' : '✏️'}
                       </button>
                       {(!isSystemData(coord.id) || isSuperAdmin) && (
                           <button onClick={() => handleDeleteCoordinator(coord.id)} className="text-red-500 hover:text-red-400">🗑️</button>
                       )}
                   </div>
               )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
           <h3 className="text-xl font-bold text-white">Senarai Guru Kelas</h3>
           {canEdit && (
              <button onClick={() => openEditModal('addClass', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah Kelas</button>
           )}
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
           {[1, 2, 3, 4, 5].map(formLevel => (
              <div key={formLevel} className="space-y-3">
                 <h4 className="text-[#C9B458] font-bold border-b border-gray-700 pb-2">Tingkatan {formLevel}</h4>
                 <div className="space-y-2">
                    {classTeachers.filter(t => t.form === formLevel.toString()).map((ct) => (
                       <div key={ct.id} className="flex justify-between items-center bg-[#0B132B]/50 p-3 rounded hover:bg-[#253252] transition-colors group">
                          <span className="font-mono text-white font-medium">{ct.class}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-sm">{ct.teacher}</span>
                            {canEdit && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditModal('classTeacher', ct)}
                                        className={`${isSystemData(ct.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-600 hover:text-[#C9B458] text-xs'}`}
                                    >
                                        {isSystemData(ct.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                    </button>
                                    {(!isSystemData(ct.id) || isSuperAdmin) && (
                                        <button 
                                            onClick={() => handleDeleteClassTeacher(ct.id)}
                                            className="text-red-600 hover:text-red-400 text-xs"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );

  const JadualBerucapView = () => (
    <div className="space-y-8 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherGroups.map((group) => (
                <div key={group.id} className="bg-[#1C2541] rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col hover:border-[#C9B458] transition-colors group">
                    <div className="bg-[#0B132B] p-3 border-b border-[#C9B458] flex justify-between items-center">
                        <h4 className="font-bold text-[#C9B458] text-sm uppercase tracking-wider">{group.name}</h4>
                        <div className="flex gap-2 items-center">
                            {canEdit && (
                                <button 
                                    onClick={() => openEditModal('editGroup', group)} 
                                    className={`${isSystemData(group.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity'}`}
                                >
                                    {isSystemData(group.id) && !isSuperAdmin ? '🔒' : '✏️ Edit'}
                                </button>
                            )}
                            <span className="bg-[#3A506B] text-white text-xs px-2 py-0.5 rounded font-mono font-bold">{group.id}</span>
                        </div>
                    </div>
                    <div className="p-4 flex-1">
                        <ul className="space-y-2">
                            {group.members.map((member, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-[#3A506B] mt-1 text-[10px]">●</span>
                                    <span className="leading-tight">{member}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Jadual Guru Berucap</h3>
                {canEdit && <button onClick={() => openEditModal('speech', null)} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah</button>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left border-collapse">
                    <thead>
                        <tr className="bg-[#3A506B]/20 text-[#C9B458] text-xs font-bold uppercase tracking-wider text-center">
                            <th className="px-4 py-4 border border-gray-700">M</th>
                            <th className="px-4 py-4 border border-gray-700">TARIKH</th>
                            <th className="px-4 py-4 border border-gray-700">KUMPULAN</th>
                            <th className="px-4 py-4 border border-gray-700">GURU BERUCAP</th>
                            <th className="px-4 py-4 border border-gray-700">TAJUK</th>
                            <th className="px-4 py-4 border border-gray-700">SIVIK/SUMUR</th>
                            {canEdit && <th className="px-4 py-4 border border-gray-700">AKSI</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm font-poppins">
                        {speechSchedule.map((item) => (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                <td className="px-2 py-4 text-center font-normal text-white border border-gray-700">{item.week}</td>
                                <td className="px-4 py-4 border border-gray-700 text-gray-300 text-xs text-center font-normal">{item.date}</td>
                                <td className="px-4 py-4 border border-gray-700 text-[#C9B458] font-normal text-center">{toTitleCase(item.group)}</td>
                                <td className="px-4 py-4 border border-gray-700 text-white font-normal">{item.speaker}</td>
                                <td className="px-4 py-4 border border-gray-700 text-gray-400 italic text-xs font-normal">"{item.topic}"</td>
                                <td className="px-4 py-4 border border-gray-700 text-center font-normal">
                                    {item.civic && <div className="text-blue-400 text-[10px] font-normal">{toTitleCase(item.civic)}</div>}
                                    {item.sumur && <div className="text-green-400 text-[10px] font-normal">{toTitleCase(item.sumur)}</div>}
                                </td>
                                {canEdit && (
                                    <td className="px-4 py-4 border border-gray-700 text-center">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openEditModal('speech', item)} 
                                                className={`${isSystemData(item.id) && !isSuperAdmin ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400'}`}
                                            >
                                                {isSystemData(item.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                            </button>
                                            {(!isSystemData(item.id) || isSuperAdmin) && (
                                                <button onClick={() => handleDeleteSpeech(item.id)} className="text-red-400">🗑️</button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const JadualPersendirianView = () => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 fade-in flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 bg-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">Jadual Waktu Persendirian</h3>
            <div className="flex gap-2 w-full sm:w-auto">
                <select className="bg-white border border-gray-300 text-gray-800 rounded-l px-4 py-2 focus:border-yellow-400 outline-none flex-1 sm:min-w-[250px]" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                    {teacherList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {canEdit && (
                    <button onClick={() => openEditModal('addTeacher', null)} className="bg-blue-600 text-white px-3 py-2 rounded-r font-bold hover:bg-blue-500 whitespace-nowrap">
                        + Guru
                    </button>
                )}
            </div>
        </div>
        <div className="overflow-x-auto p-4 custom-scrollbar">
            <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                    <tr>
                        <th className="p-3 border border-gray-300 bg-gray-100 text-gray-600 text-sm font-extrabold w-32 sticky left-0 z-20 text-center shadow-lg">HARI / MASA</th>
                        {timeSlots.map(slot => (
                            <th key={slot} className="p-1 border border-gray-300 bg-gray-100 text-gray-600 text-[10px] font-bold font-mono min-w-[60px] text-center leading-tight whitespace-pre">
                                {slot}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day}>
                            <td className="p-3 border border-gray-300 bg-gray-50 font-bold text-gray-800 sticky left-0 z-10 text-sm text-center uppercase shadow-lg">
                                {day}
                            </td>
                            {timeSlots.map(slot => {
                                const data = getPersonalSlotData(day, slot);
                                return (
                                    <td key={slot} 
                                        className={`border border-gray-200 p-1 h-20 relative transition-colors ${canEdit ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                                        onClick={() => canEdit && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedTeacher })}
                                    >
                                        {data && (
                                            <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm overflow-hidden relative`}>
                                                {renderCross(data.color)}
                                                <span className="font-bold truncate w-full text-center leading-tight relative z-10">{data.code}</span>
                                                <span className="truncate w-full text-center opacity-80 leading-tight text-[9px] relative z-10">{data.subject}</span>
                                            </div>
                                        )}
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

  const JadualKelasView = () => {
    const availableClasses = Array.from(new Set(classTeachers.map(ct => ct.class))).sort();
    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 fade-in flex flex-col h-full">
         <div className="p-6 border-b border-gray-200 bg-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">Jadual Waktu Kelas</h3>
            <div className="flex gap-2">
                <select className="bg-white border border-gray-300 text-gray-800 rounded-l px-4 py-2 focus:border-yellow-400 outline-none min-w-[200px]" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                   {availableClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                {canEdit && <button onClick={() => openEditModal('addClass', null)} className="bg-blue-600 text-white px-4 py-2 rounded-r font-bold hover:bg-blue-500">+ Tambah Kelas</button>}
            </div>
         </div>
         <div className="overflow-x-auto p-4 custom-scrollbar">
            <table className="w-full border-collapse min-w-[1200px]">
               <thead>
                  <tr>
                     <th className="p-3 border border-gray-300 bg-gray-100 text-gray-600 text-sm font-extrabold w-32 sticky left-0 z-20 text-center shadow-lg">HARI / MASA</th>
                     {timeSlots.map(slot => (
                        <th key={slot} className="p-1 border border-gray-300 bg-gray-100 text-gray-600 text-[10px] font-bold font-mono min-w-[60px] text-center leading-tight whitespace-pre">
                            {slot}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {days.map(day => (
                     <tr key={day}>
                        <td className="p-3 border border-gray-300 bg-gray-50 font-bold text-gray-800 sticky left-0 z-10 text-sm text-center uppercase shadow-lg">
                            {day}
                        </td>
                         {timeSlots.map(slot => {
                            const data = getClassSlotData(day, slot);
                            return (
                               <td key={slot} 
                                  className={`border border-gray-200 p-1 h-20 relative transition-colors ${canEdit ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                                  onClick={() => canEdit && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedClass })}
                               >
                                  {data && (
                                     <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm overflow-hidden relative`}>
                                        {renderCross(data.color)}
                                        <span className="font-bold truncate w-full text-center leading-tight relative z-10">{data.subject}</span>
                                        <span className="truncate w-full text-center opacity-80 leading-tight text-[9px] relative z-10">{getShortName(data.teacher)}</span>
                                     </div>
                                  )}
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

  const JadualPemantauanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
        {monitoringList.map((group) => (
            <div key={group.id} className="bg-[#1C2541] rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col hover:border-[#C9B458] transition-colors group">
                <div className="bg-[#0B132B] p-4 border-b border-[#C9B458] flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-white text-sm uppercase">{group.monitor}</h4>
                        <p className="text-[10px] text-[#C9B458] font-bold tracking-widest">{group.position}</p>
                    </div>
                    {canEdit && (
                        <button 
                            onClick={() => openEditModal('monitoring', group)} 
                            className={`${isSystemData(group.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                        >
                            {isSystemData(group.id) && !isSuperAdmin ? '🔒' : '✏️'}
                        </button>
                    )}
                </div>
                <div className="p-4 flex-1">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-800">
                                <th className="text-left py-1">KOD</th>
                                <th className="text-left py-1">NAMA GURU</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {group.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-800/30">
                                    <td className="py-2 font-mono text-[#C9B458]">{item.code}</td>
                                    <td className="py-2">{item.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ))}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'Guru Ganti': return <GuruGantiView />;
      case 'Guru Kelas': return <GuruKelasView />;
      case 'Jadual Persendirian': return <JadualPersendirianView />;
      case 'Jadual Kelas': return <JadualKelasView />;
      case 'Jadual Berucap': return <JadualBerucapView />;
      case 'Jadual Pemantauan': return <JadualPemantauanView />;
      default: return <GuruGantiView />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      {renderContent()}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4 py-6 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-full overflow-y-auto scrollbar-thin">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">{editingItem ? 'Kemaskini' : 'Tambah'} {modalType.replace(/([A-Z])/g, ' $1')}</h3>
            <form onSubmit={handleSave} className="space-y-4">
               {modalType === 'relief' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label>
                            <input 
                                type="date" 
                                value={dmyToIso(formData.date)} 
                                onChange={e => setFormData({...formData, date: isoToDmy(e.target.value)})} 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                            />
                        </div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Masa</label><input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kelas</label><input type="text" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Tidak Hadir</label><select value={formData.absent} onChange={e => setFormData({...formData, absent: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Ganti</label><select value={formData.relief} onChange={e => setFormData({...formData, relief: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {(modalType === 'coordinator' || modalType === 'classTeacher') && (
                 <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru</label><select value={modalType === 'coordinator' ? formData.name : formData.teacher} onChange={e => setFormData({...formData, [modalType === 'coordinator' ? 'name' : 'teacher']: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm">{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
               )}
               {modalType === 'addCoordinator' && (
                 <>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tajuk / Penyelaras</label><input type="text" value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Contoh: Penyelaras Tingkatan 6" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru</label><select value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {modalType === 'addClass' && (
                 <>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Kelas</label><input type="text" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Cth: 4 Al-Maliki" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Kelas</label><select value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {modalType === 'speech' && (
                 <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Minggu</label><input type="text" value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kumpulan</label><select value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Kumpulan</option>{teacherGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Berucap</label><select value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tajuk</label><input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Sivik</label><input type="text" value={formData.civic} onChange={e => setFormData({...formData, civic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Sumur</label><input type="text" value={formData.sumur} onChange={e => setFormData({...formData, sumur: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                 </div>
               )}
               {modalType === 'monitoring' && (
                 <>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Pemantau</label><input type="text" value={formData.monitor} onChange={e => setFormData({...formData, monitor: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Senarai Guru (Format: Kod|Nama)</label><textarea value={formData.itemsStr} onChange={e => setFormData({...formData, itemsStr: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-xs h-32 font-mono" /></div>
                 </>
               )}
               {modalType === 'scheduleSlot' && (
                 <>
                    <div className="text-xs text-gray-400 mb-2">Mengedit: <span className="text-white">{formData.day} @ {formData.time}</span></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Kosong</option><option value="REHAT">REHAT</option>{ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Warna</label><select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm">{colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                    </div>
                    {formData.context === selectedTeacher ? (
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kod Kelas / Aktiviti</label><input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    ) : (
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Mengajar</label><select value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Tiada</option>{teacherList.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    )}
                 </>
               )}
               {modalType === 'editGroup' && (
                   <>
                      <div className="text-xs text-gray-400 mb-2">Ahli Kumpulan: <span className="text-[#C9B458] font-bold">{formData.name}</span></div>
                      <div>
                          <label className="text-[10px] text-[#C9B458] font-bold uppercase">Senarai Nama (Satu nama per baris)</label>
                          <textarea 
                             value={formData.membersStr} 
                             onChange={e => setFormData({...formData, membersStr: e.target.value})} 
                             className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm h-48"
                          />
                      </div>
                   </>
               )}
               {modalType === 'addTeacher' && (
                   <>
                      <div>
                          <label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru Baru</label>
                          <input 
                             type="text"
                             value={formData.name} 
                             onChange={e => setFormData({...formData, name: e.target.value})} 
                             className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"
                             placeholder="Masukkan nama penuh..."
                          />
                      </div>
                   </>
               )}

               <div className="flex gap-2 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
                       {isSystemData(editingItem?.id) && !isSuperAdmin ? 'Tutup' : 'Batal'}
                   </button>
                   {modalType === 'scheduleSlot' && (
                       <button type="button" onClick={handleDeleteSlot} className="flex-1 py-2 bg-red-900/60 text-red-200 border border-red-700 rounded hover:bg-red-800">Hapus</button>
                   )}
                   {(!isSystemData(editingItem?.id) || isSuperAdmin) && (
                       <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                   )}
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
