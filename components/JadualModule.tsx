import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface JadualModuleProps {
  type: string;
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
  "BM", "BI", "SEJ", "MAT", "SCN", "GEO", "PSV", "RBT", "USL", "SYA", "LAM", "PJPK", "UN", "1M1S", "KELAB"
];

const SUBJECTS_UPPER = [
  "BM", "BI", "SEJ", "MAT", "SCN", "PNG", "USL", "SYA", "LAM", "MAA", "ADB", "PJPK", "UN", "1M1S", "KELAB"
];

const CLASS_CODES = [
  "1H", "1S", "1M",
  "2H", "2S", "2M",
  "3H", "3S", "3M",
  "4H", "4S",
  "5H", "5S"
];

const ALL_SUBJECTS = Array.from(new Set([...SUBJECTS_LOWER, ...SUBJECTS_UPPER])).sort();

const GROUP_MEMBERS_DATA = [
  { id: 1, name: "KUMPULAN 1", members: ["Muhammad Hafiz bin Jalil", "Norashidah binti A Wahab", "Syahidatun Najihah binti Aziz", "Nik Noorizati binti Ab Kahar", "Noorlela binti Zainudin"] },
  { id: 2, name: "KUMPULAN 2", members: ["Ahmad Fikruddin bin Ahmad Raza'i", "Nooraind binti Ali", "Siti Aminah binti Mohamed", "Masyitah binti Razali", "Nor Ain binti Mohamed Jori"] },
  { id: 3, name: "KUMPULAN 3", members: ["Mohamad Sukri bin Ali", "Mazuin binti Mat", "Siti Nurul Liza binti Sidin", "Zarith Najiha binti Jamal", "Nurul Izzati binti Roslin"] },
  { id: 4, name: "KUMPULAN 4", members: ["Mohd Nur bin Ahmad", "Rosmawati binti Hussin", "Saemah binti Supandi", "Annur Ayuni binti Mohamed", "Nuurul Amira binti Razak"] },
  { id: 5, name: "KUMPULAN 5", members: ["Mohamad Nasreen Hakim bin Che Mohamed", "Mohd Nor bin Salikin", "Zahrah Khairiah Nasution binti Saleh", "Nor Hidayah binti Mahadun", "Nurul Syafiqah binti Husin"] },
  { id: 6, name: "KUMPULAN 6", members: ["Salman bin A Rahman", "Mohammad Firros bin Rosool Gani", "Nor Azean binti Ismail", "Norliyana binti Mhd Amin", "Liyana binti Iskandar"] }
];

// --- DATA JADUAL PEMANTAUAN (10 KAD) ---
const initialPemantauanData = [
  {
    id: 1,
    monitor: "ZULKEFFLE BIN MUHAMMAD",
    position: "PENGETUA",
    items: [
      { code: "2.1", name: "Noratikah binti Abd. Kadir" },
      { code: "2.2", name: "Shaharer bin Hj Husain" },
      { code: "2.3", name: "Zulkifli bin Md Aspan" }
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
      { code: "4.1", name: "Rosmawati @ Rohayati binti Hussin" },
      { code: "4.2", name: "Salman bin A Rahman" },
      { code: "4.3", name: "Muhammad Hafiz bin Jalil" }
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
      { code: "6.1", name: "Annur Ayuni binti Mohamed" },
      { code: "6.2", name: "Masyitah binti Razali" },
      { code: "6.3", name: "Mohamad Sukri bin Ali" },
      { code: "6.4", name: "Nor Hidayah binti Mahadun" }
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
      { code: "8.1", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
      { code: "8.2", name: "Nor Ain binti Mohamed Jori" },
      { code: "8.3", name: "Siti Nurul Liza binti Sidin" }
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
      { code: "10.1", name: "Mohd Nor bin Salikin" },
      { code: "10.2", name: "Nurul Izzati binti Roslin" },
      { code: "10.3", name: "Syahidatun Najihah binti Aziz" }
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
      { code: "10.4", name: "Мohammad Firros bin Rosool Gani" }
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

const initialSpeechSchedule = [
  { id: 1, week: "1", date: "12 – 16 Jan 2026", group: "KUMPULAN 1", speaker: "Pengetua", topic: "Ahlan wa Sahlan wa Marhaban bikum", civic: "KASIH SAYANG", sumur: "MUTADAYYIN" },
  { id: 2, week: "2", date: "19 – 23 Jan 2026", group: "KUMPULAN 2", speaker: "Muhammad Hafiz bin Jalil", topic: "Sekolah Penyayang Murid Gemilang", civic: "", sumur: "" },
  { id: 3, week: "3", date: "26 – 30 Jan 2026", group: "KUMPULAN 3", speaker: "Ahmad Fikruddin bin Ahmad Raza'i", topic: "Fizikal Cergas Mental Sihat", civic: "", sumur: "" },
  { id: 4, week: "4", date: "2 – 6 Feb 2026", group: "KUMPULAN 4", speaker: "Mohamad Sukri bin Ali", topic: "Kasihi Yang Muda Hormati Yang Tua", civic: "", sumur: "" },
  { id: 5, week: "5", date: "9 – 13 Feb 2026", group: "KUMPULAN 5", speaker: "Mohd Nur bin Ahmad", topic: "Ramadhan Kareem", civic: "", sumur: "" },
  { id: 6, week: "6", date: "16 – 20 Feb 2026", group: "KUMPULAN 6", speaker: "Mohamad Nasreen Hakim bin Che Mohamed", topic: "Hormat Membina Hubungan Mengukuhkan Persahabatan", civic: "HORMAT MENGHORMATI", sumur: "" },
  { id: 7, week: "7", date: "23 – 27 Feb 2026", group: "KUMPULAN 1", speaker: "Salman bin A Rahman", topic: "Eid Mubarak", civic: "", sumur: "" },
  { id: 8, week: "8", date: "2 – 6 Mac 2026", group: "KUMPULAN 2", speaker: "Norashidah binti A Wahab", topic: "Adab dengan rakan", civic: "", sumur: "" },
  { id: 9, week: "9", date: "9 – 13 Mac 2026", group: "KUMPULAN 3", speaker: "Nooraind binti Ali", topic: "Adab dan akhlak sebelum ilmu", civic: "", sumur: "" },
  { id: 10, week: "10", date: "16 – 20 Mac 2026", group: "KUMPULAN 4", speaker: "Mazuin binti Mat", topic: "Keutamaan sifat malu", civic: "BERTANGGUNG JAWAB", sumur: "" },
  { id: 11, week: "11", date: "30 Mac – 3 Apr 2026", group: "KUMPULAN 5", speaker: "Rosmawati binti Hussin", topic: "Amar Makruf Nahi Munkar", civic: "", sumur: "" },
  { id: 12, week: "12", date: "6 – 10 Apr 2026", group: "KUMPULAN 6", speaker: "Mohd Nor bin Salikin", topic: "Hargai Diri", civic: "", sumur: "" },
  { id: 13, week: "13", date: "13 – 17 Apr 2026", group: "KUMPULAN 1", speaker: "Mohammad Firros bin Rosool Gani", topic: "Sayangi Sekolah", civic: "", sumur: "" },
  { id: 14, week: "14", date: "20 – 24 Apr 2026", group: "KUMPULAN 2", speaker: "Syahidatun Najihah binti Aziz", topic: "Kejayaan tidak datang bergolek", civic: "KEGEMBIRAAN", sumur: "BUDI BAHASA" },
  { id: 15, week: "15", date: "27 Apr – 1 Mei 2026", group: "KUMPULAN 3", speaker: "Siti Aminah binti Mohamed", topic: "Mensyukuri Nikmat Sang Pencipta", civic: "", sumur: "" },
  { id: 16, week: "16", date: "4 – 8 Mei 2026", group: "KUMPULAN 4", speaker: "Siti Nurul Liza binti Sidin", topic: "Terima Kasih Warga Sekolah", civic: "", sumur: "" },
  { id: 17, week: "17", date: "11 – 15 Mei 2026", group: "KUMPULAN 5", speaker: "Saemah binti Supandi", topic: "Kegembiraan Adalah Pilihan Kita", civic: "", sumur: "" },
  { id: 18, week: "18", date: "18 – 22 Mei 2026", group: "KUMPULAN 6", speaker: "Zahrah Khairiah Nasution binti Saleh", topic: "Budi Bahasa Budaya Kita", civic: "KASIH SAYANG", sumur: "" },
  { id: 19, week: "19", date: "8 – 12 Jun 2026", group: "KUMPULAN 1", speaker: "Norliyana binti Mhd Amin", topic: "Sayangi Sahabat", civic: "", sumur: "" },
  { id: 20, week: "20", date: "15 – 19 Jun 2026", group: "KUMPULAN 2", speaker: "Nik Noorizati binti Ab Kahar", topic: "Teguran Tanda Sayang", civic: "", sumur: "" },
  { id: 21, week: "21", date: "22 – 26 Jun 2026", group: "KUMPULAN 3", speaker: "Masyitah binti Razali", topic: "Memuliakan Orang Tua", civic: "HORMAT MENGHORMATI", sumur: "JATI DIRI" },
  { id: 22, week: "22", date: "29 Jun – 3 Jul 2026", group: "KUMPULAN 4", speaker: "Zarith Najiha binti Jamal", topic: "Sikap Saling Menghormati", civic: "", sumur: "" },
  { id: 23, week: "23", date: "6 – 10 Jul 2026", group: "KUMPULAN 5", speaker: "Annur Ayuni binti Mohamed", topic: "Pengurusan Masa Yang Sistematik", civic: "", sumur: "" },
  { id: 24, week: "24", date: "13 – 17 Jul 2026", group: "KUMPULAN 6", speaker: "Nor Hidayah binti Mahadun", topic: "Tanggungjawab Seorang Pemimpin", civic: "BERTANGGUNG JAWAB", sumur: "JATI DIRI" },
  { id: 25, week: "25", date: "20 – 24 Jul 2026", group: "KUMPULAN 1", speaker: "Liyana binti Iskandar", topic: "", civic: "", sumur: "" },
  { id: 26, week: "26", date: "27 – 31 Jul 2026", group: "KUMPULAN 2", speaker: "Noorlela binti Zainudin", topic: "Sayangi Buku Teks Anda", civic: "", sumur: "" },
  { id: 27, week: "27", date: "3 – 7 Ogos 2026", group: "KUMPULAN 3", speaker: "Nor Ain binti Mohamed Jori", topic: "Tanggungjawab Anak Terhadap Ibu bapa", civic: "", sumur: "" },
  { id: 28, week: "28", date: "10 – 14 Ogos 2026", group: "KUMPULAN 4", speaker: "Nurul Izzati binti Roslin", topic: "Sayangilah Alam Sekitar", civic: "KEGEMBIRAAN", sumur: "PENAMPILAN DIRI" },
  { id: 29, week: "29", date: "17 – 21 Ogos 2026", group: "KUMPULAN 5", speaker: "Nuurul Amira binti Razak", topic: "Interkasi Sihat", civic: "", sumur: "" },
  { id: 30, week: "30", date: "24 – 28 Ogos 2026", group: "KUMPULAN 6", speaker: "Nurul Syafiqah binti Husin", topic: "Jasamu Dikenang", civic: "", sumur: "" },
  { id: 31, week: "31", date: "7 – 11 Sep 2026", group: "KUMPULAN 1", speaker: "Nor Azean binti Ismail", topic: "Pengorbanan Yang Berbaloi", civic: "", sumur: "" },
  { id: 32, week: "32", date: "14 – 18 Sep 2026", group: "KUMPULAN 2", speaker: "Muhammad Hafiz bin Jalil", topic: "Pengurusan Emosi Menjelang Peperiksaan", civic: "KASIH SAYANG", sumur: "" },
  { id: 33, week: "33", date: "21 – 25 Sep 2026", group: "KUMPULAN 3", speaker: "Ahmad Fikruddin bin Ahmad Raza'i", topic: "Cintai Malaysia", civic: "", sumur: "" },
  { id: 34, week: "34", date: "28 Sep – 2 Okt 2026", group: "KUMPULAN 4", speaker: "Mohamad Sukri bin Ali", topic: "Indahnya Menutup Aurat", civic: "", sumur: "" },
  { id: 35, week: "35", date: "5 – 9 Okt 2026", group: "KUMPULAN 5", speaker: "Mohd Nur bin Ahmad", topic: "Rasulullah Qudwah Hasanah", civic: "", sumur: "" },
  { id: 36, week: "36", date: "12 – 16 Okt 2026", group: "KUMPULAN 6", speaker: "Mohamad Nasreen Hakim bin Che Mohamed", topic: "Toleransi Sesama Manusia", civic: "HORMAT MENGHORMATI", sumur: "" },
  { id: 37, week: "37", date: "19 – 23 Okt 2026", group: "KUMPULAN 1", speaker: "Salman bin A Rahman", topic: "Santuni al-Quran", civic: "", sumur: "" },
  { id: 38, week: "38", date: "26 – 30 Okt 2026", group: "KUMPULAN 2", speaker: "Norashidah binti A Wahab", topic: "Menjaga Ikhtilat", civic: "", sumur: "" },
  { id: 39, week: "39", date: "2 – 6 Nov 2026", group: "KUMPULAN 3", speaker: "Nooraind binti Ali", topic: "Patriotisme Asas Kemajuan Negara", civic: "", sumur: "" },
  { id: 40, week: "40", date: "9 – 13 Nov 2026", group: "KUMPULAN 4", speaker: "Mazuin binti Mat", topic: "Sayangi Harta Benda", civic: "BERTANGGUNG JAWAB", sumur: "" },
  { id: 41, week: "41", date: "16 – 20 Nov 2026", group: "KUMPULAN 5", speaker: "Rosmawati binti Hussin", topic: "Membazir Amalan Syaitan", civic: "", sumur: "" },
  { id: 42, week: "42", date: "23 – 27 Nov 2026", group: "KUMPULAN 6", speaker: "Mohd Nor bin Salikin", topic: "Tarbiah Asas Kecemerlangan", civic: "", sumur: "" },
  { id: 43, week: "43", date: "30 Nov – 4 Dis 2026", group: "", speaker: "", topic: "", civic: "", sumur: "" },
];

// Generate Time Slots 7:30 to 16:00 (30 mins) in 12h format
const generateTimeSlots = () => {
  const slots = [];
  let current = 7.5; // 7:30
  const end = 16.0; // 16:00
  
  while (current < end) {
    const hour = Math.floor(current);
    const min = (current - hour) * 60;
    
    // Format to 12h
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    const timeLabel = `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
    
    slots.push(timeLabel);
    current += 0.5;
  }
  return slots;
};

const timeSlots = generateTimeSlots();
// Start with Isnin as requested
const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

export const JadualModule: React.FC<JadualModuleProps> = ({ type }) => {
  const { user, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- STATE MANAGEMENT ---
  const [reliefList, setReliefList] = useState(initialGuruGanti);
  const [coordinators, setCoordinators] = useState(initialFormCoordinators);
  const [classTeachers, setClassTeachers] = useState(initialClassTeachers);
  const [speechList, setSpeechList] = useState(initialSpeechSchedule);
  const [monitoringList, setMonitoringList] = useState(initialPemantauanData);
  
  // Schedule Overrides (Key: "Context-Day-Time", Value: { subject, code, color, teacher })
  // Context is either Teacher Name or Class Name
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'relief' | 'coordinator' | 'classTeacher' | 'scheduleSlot' | 'addClass' | 'speech' | 'monitoring'>('relief');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form Data State
  const [formData, setFormData] = useState<any>({});

  // Context Selectors for Schedules
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHER_LIST[0]);
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
    // Split by case-insensitive ' bin ' or ' binti '
    const split = fullName.split(/ bin | binti /i);
    return split[0];
  };

  // --- HELPER: Format Date for Input ---
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  };

  // --- MOCK GENERATORS (Fallback if no state override) ---
  const getPersonalSlotData = (day: string, time: string) => {
    const key = `${selectedTeacher}-${day}-${time}`;
    if (scheduleData[key]) return scheduleData[key]; // Return override if exists

    // Default Mock (Just for demo visualization)
    const hash = (day.length + time.length + selectedTeacher.length) % 7;
    if (hash === 0) return { subject: 'Rehat', code: 'REHAT', color: 'bg-gray-700 text-gray-300' };
    if (hash === 1 || hash === 4) return { subject: 'MAT', code: '4H', color: 'bg-blue-900/60 text-blue-200 border-blue-700' };
    if (hash === 2) return { subject: 'KOKO', code: 'KOKO', color: 'bg-orange-900/60 text-orange-200 border-orange-700' };
    return null;
  };

  const getClassSlotData = (day: string, time: string) => {
    const key = `${selectedClass}-${day}-${time}`;
    if (scheduleData[key]) return scheduleData[key]; // Return override if exists

    // Default Mock
    const hash = (day.length + time.length + selectedClass.length) % 5;
    if (time.includes('10:00') || time.includes('10:30')) return { subject: 'REHAT', teacher: '', color: 'bg-gray-700 text-gray-300' };
    if (hash === 0) return { subject: 'BM', teacher: 'Siti Aminah binti Mohamed', color: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' };
    if (hash === 1) return { subject: 'SEJ', teacher: 'Saemah binti Supandi', color: 'bg-yellow-900/40 text-yellow-200 border-yellow-700' };
    if (hash === 2) return { subject: 'MAT', teacher: 'Zulkeffle bin Muhammad', color: 'bg-blue-900/60 text-blue-200 border-blue-700' };
    return null; 
  };

  // --- HANDLERS ---

  const openEditModal = (type: typeof modalType, item: any, extraData?: any) => {
    setModalType(type);
    setEditingItem(item); // item might be null for new slots
    setIsModalOpen(true);

    if (type === 'relief') {
        setFormData(item || { date: '', time: '', class: '', subject: '', absent: '', relief: '', status: 'Ganti' });
    } else if (type === 'coordinator') {
        setFormData(item);
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
        // extraData contains { day, time, context }
        const existingData = item;
        setFormData({
            ...extraData,
            subject: existingData?.subject || '',
            code: existingData?.code || '',
            teacher: existingData?.teacher || '',
            color: existingData?.color || 'bg-blue-900/60 text-blue-200 border-blue-700'
        });
    }
  };

  const handleDeleteSpeech = (id: number) => {
      if(window.confirm("Padam rekod jadual berucap ini?")) {
          setSpeechList(speechList.filter(s => s.id !== id));
          showToast("Rekod dipadam.");
      }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === 'relief') {
        if (editingItem) {
            setReliefList(reliefList.map(r => r.id === editingItem.id ? { ...formData, id: r.id } : r));
            showToast("Jadual guru ganti dikemaskini");
        }
    } else if (modalType === 'coordinator') {
        setCoordinators(coordinators.map(c => c.id === editingItem.id ? { ...c, name: formData.name } : c));
        showToast("Penyelaras dikemaskini");
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
        setSelectedClass(formData.className); // Auto select new class
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
            setSpeechList(speechList.map(s => s.id === editingItem.id ? payload : s));
            showToast("Jadual berucap dikemaskini");
        } else {
            setSpeechList([...speechList, payload]);
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
        // Save to Schedule Override Dictionary
        const key = `${formData.context}-${formData.day}-${formData.time}`;
        
        const newSlotData = {
            subject: formData.subject,
            code: formData.code, // used in personal schedule
            teacher: formData.teacher, // used in class schedule
            color: formData.color
        };

        setScheduleData(prev => ({
            ...prev,
            [key]: newSlotData
        }));
        showToast("Slot jadual dikemaskini");
    }

    setIsModalOpen(false);
  };

  const colorOptions = [
      { label: 'Biru (Math/Sains)', value: 'bg-blue-900/60 text-blue-200 border-blue-700' },
      { label: 'Hijau (Bahasa)', value: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' },
      { label: 'Kuning (Sejarah/Geo)', value: 'bg-yellow-900/40 text-yellow-200 border-yellow-700' },
      { label: 'Oren (Sukan/Koko)', value: 'bg-orange-900/60 text-orange-200 border-orange-700' },
      { label: 'Kelabu (Rehat)', value: 'bg-gray-700 text-gray-300' },
      { label: 'Ungu (Agama)', value: 'bg-purple-900/60 text-purple-200 border-purple-700' },
  ];

  // --- SUB-COMPONENTS (With Edit Wrappers) ---

  // 1. GURU GANTI VIEW
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
              {isAdmin && <th className="px-6 py-4 text-center">Tindakan</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {reliefList.map((item) => (
              <tr key={item.id} className="hover:bg-[#253252] transition-colors">
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
                {isAdmin && (
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => openEditModal('relief', item)}
                            className="text-blue-400 hover:text-white bg-[#3A506B]/50 hover:bg-[#3A506B] p-2 rounded transition-colors"
                        >
                            ✏️ Edit
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

  // 2. GURU KELAS VIEW
  const GuruKelasView = () => (
    <div className="space-y-8 fade-in">
      {/* Coordinators */}
      <div className="bg-[#1C2541] rounded-xl border-l-4 border-[#C9B458] p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Penyelaras Tingkatan</h3>
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
               {isAdmin && (
                   <button 
                    onClick={() => openEditModal('coordinator', coord)}
                    className="text-gray-500 hover:text-[#C9B458] opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                       ✏️
                   </button>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Class Teachers List */}
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
           <h3 className="text-xl font-bold text-white">Senarai Guru Kelas</h3>
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
                            {isAdmin && (
                                <button 
                                    onClick={() => openEditModal('classTeacher', ct)}
                                    className="text-gray-600 hover:text-[#C9B458] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✏️
                                </button>
                            )}
                          </div>
                       </div>
                    ))}
                    {classTeachers.filter(t => t.form === formLevel.toString()).length === 0 && (
                      <p className="text-gray-600 italic text-sm">Tiada data kelas.</p>
                    )}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );

  // 3. JADUAL BERUCAP VIEW
  const JadualBerucapView = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSpeech = speechList.filter(s => 
       s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
       s.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
       s.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 fade-in font-poppins">
            {/* GROUP CARDS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GROUP_MEMBERS_DATA.map((group) => (
                    <div key={group.id} className="bg-[#1C2541] rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col hover:border-[#C9B458] transition-colors">
                        <div className="bg-[#0B132B] p-3 border-b border-[#C9B458] flex justify-between items-center">
                            <h4 className="font-bold text-[#C9B458] text-sm uppercase tracking-wider">{group.name}</h4>
                            <span className="bg-[#3A506B] text-white text-xs px-2 py-0.5 rounded font-mono font-bold">{group.id}</span>
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

            {/* SCHEDULE TABLE SECTION */}
            <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 flex flex-col h-full">
                <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-white font-montserrat">Jadual Guru Bertugas / Berucap</h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input 
                        type="text" 
                        placeholder="Cari guru, kumpulan atau tajuk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1C2541] border border-gray-600 text-white rounded px-4 py-2 focus:border-[#C9B458] outline-none text-sm w-full md:w-64"
                        />
                        {isAdmin && (
                            <button 
                            onClick={() => openEditModal('speech', null)}
                            className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded text-sm font-bold hover:bg-yellow-400 whitespace-nowrap"
                            >
                                + Tambah
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[1000px] text-left border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-[#3A506B]/20 text-[#C9B458] text-base font-bold uppercase tracking-wider text-center font-montserrat">
                                <th className="px-4 py-5 w-16 border border-gray-700">M</th>
                                <th className="px-4 py-5 w-40 border border-gray-700">TARIKH</th>
                                <th className="px-4 py-5 w-40 border border-gray-700">KUMPULAN BERTUGAS / PELAPOR</th>
                                <th className="px-4 py-5 w-1/4 border border-gray-700 text-center">GURU BERUCAP</th>
                                <th className="px-4 py-5 w-1/4 border border-gray-700 text-center">TAJUK</th>
                                <th className="px-4 py-5 w-40 border border-gray-700">SIVIK / SUMUR</th>
                                {isAdmin && <th className="px-4 py-5 w-20 text-center border border-gray-700">EDIT</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredSpeech.map((item) => (
                                <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                    <td className="px-4 py-5 font-mono text-center font-bold text-[#C9B458] border border-gray-700 align-top text-lg">{item.week}</td>
                                    <td className="px-4 py-5 font-mono text-gray-200 border border-gray-700 align-top text-sm font-medium text-center">{item.date}</td>
                                    <td className="px-4 py-5 text-center font-bold text-white border border-gray-700 align-top">
                                        {item.group && (
                                            <span className="inline-block bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs shadow-md">
                                                {item.group.replace('KUMPULAN ', 'K')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 border border-gray-700 align-top">
                                        <span className="text-white font-semibold text-base block mb-1 font-poppins">{item.speaker}</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Guru Berucap</span>
                                    </td>
                                    <td className="px-6 py-5 border border-gray-700 align-top">
                                        <span className="text-gray-300 italic leading-relaxed font-poppins block">
                                            "{item.topic}"
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 align-top space-y-2 text-center border border-gray-700">
                                        {item.civic && (
                                            <div className="bg-blue-900/40 border border-blue-600/50 rounded p-1.5 shadow-sm inline-block w-full">
                                                <span className="block text-[9px] text-blue-300 font-bold uppercase tracking-wider">Sivik</span>
                                                <span className="block text-white font-bold text-xs truncate">{item.civic}</span>
                                            </div>
                                        )}
                                        {item.sumur && (
                                            <div className="bg-green-900/40 border border-green-600/50 rounded p-1.5 shadow-sm inline-block w-full">
                                                <span className="block text-[9px] text-green-300 font-bold uppercase tracking-wider">Sumur</span>
                                                <span className="block text-white font-bold text-xs truncate">{item.sumur}</span>
                                            </div>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-4 py-5 text-right align-top border border-gray-700">
                                            <div className="flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal('speech', item)} className="text-blue-400 hover:text-white bg-[#3A506B]/50 hover:bg-[#3A506B] p-2 rounded transition-colors" title="Edit">✏️</button>
                                                <button onClick={() => handleDeleteSpeech(item.id)} className="text-red-400 hover:text-white bg-red-900/30 hover:bg-red-900/60 p-2 rounded transition-colors" title="Padam">🗑️</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredSpeech.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-gray-500 italic bg-[#1C2541] border border-gray-700">
                                        Tiada rekod dijumpai untuk carian "{searchQuery}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  };

  // 4. JADUAL PERSENDIRIAN (TIMETABLE GRID)
  const JadualPersendirianView = () => {
     return (
       <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full">
          <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex flex-col sm:flex-row justify-between items-center gap-4">
             <h3 className="text-xl font-bold text-white">Jadual Waktu Persendirian</h3>
             <select 
                className="bg-[#1C2541] border border-gray-600 text-white rounded px-4 py-2 focus:border-[#C9B458] outline-none min-w-[250px]"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
             >
                {TEACHER_LIST.map((teacher) => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
             </select>
          </div>
          
          <div className="overflow-x-auto p-4 custom-scrollbar">
             <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                   <tr>
                      <th className="p-3 border border-gray-700 bg-[#0B132B] text-[#C9B458] text-sm font-extrabold w-24 sticky left-0 z-10 text-center">HARI / MASA</th>
                      {timeSlots.map(slot => (
                         <th key={slot} className="p-2 border border-gray-700 bg-[#0B132B] text-gray-400 text-xs font-bold font-mono w-20 whitespace-nowrap text-center">
                            {slot}
                         </th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {days.map(day => (
                      <tr key={day}>
                         <td className="p-3 border border-gray-700 bg-[#1C2541] font-bold text-white sticky left-0 z-10 text-sm">
                            {day}
                         </td>
                         {timeSlots.map(slot => {
                            const data = getPersonalSlotData(day, slot);
                            return (
                               <td 
                                key={slot} 
                                className={`border border-gray-700 p-1 h-16 relative transition-colors ${isAdmin ? 'hover:bg-[#253252] cursor-pointer' : ''}`}
                                onClick={() => isAdmin && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedTeacher })}
                               >
                                  {data && (
                                     <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm`}>
                                        <span className="font-bold truncate w-full text-center">{data.code}</span>
                                        <span className="truncate w-full text-center opacity-80">{data.subject}</span>
                                     </div>
                                  )}
                                  {isAdmin && !data && <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-xs text-gray-600">+</div>}
                               </td>
                            );
                         })}
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          {isAdmin && <div className="px-6 py-2 text-xs text-gray-500 italic">* Klik pada kotak masa untuk mengedit (Admin Sahaja).</div>}
       </div>
     );
  };

  // 5. JADUAL KELAS (TIMETABLE GRID)
  const JadualKelasView = () => {
    // Filter unique class names from classTeachers for dropdown
    const availableClasses = Array.from(new Set(classTeachers.map(ct => ct.class))).sort();

    return (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full">
         <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-white">Jadual Waktu Kelas</h3>
            <div className="flex gap-2">
                <select 
                   className="bg-[#1C2541] border border-gray-600 text-white rounded-l px-4 py-2 focus:border-[#C9B458] outline-none min-w-[200px]"
                   value={selectedClass}
                   onChange={(e) => setSelectedClass(e.target.value)}
                >
                   {availableClasses.map(cls => (
                       <option key={cls} value={cls}>{cls}</option>
                   ))}
                </select>
                {isAdmin && (
                    <button 
                        onClick={() => openEditModal('addClass', null)}
                        className="bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-r font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-1"
                        title="Tambah Kelas Baru"
                    >
                        <span>+</span> Kelas
                    </button>
                )}
            </div>
         </div>
         
         <div className="overflow-x-auto p-4 custom-scrollbar">
            <table className="w-full border-collapse min-w-[1200px]">
               <thead>
                  <tr>
                     <th className="p-3 border border-gray-700 bg-[#0B132B] text-[#C9B458] text-sm font-extrabold w-24 sticky left-0 z-10 text-center">HARI / MASA</th>
                     {timeSlots.map(slot => (
                        <th key={slot} className="p-2 border border-gray-700 bg-[#0B132B] text-gray-400 text-xs font-bold font-mono w-20 whitespace-nowrap text-center">
                           {slot}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {days.map(day => (
                     <tr key={day}>
                        <td className="p-3 border border-gray-700 bg-[#1C2541] font-bold text-white sticky left-0 z-10 text-sm">
                           {day}
                        </td>
                        {timeSlots.map(slot => {
                           const data = getClassSlotData(day, slot);
                           return (
                              <td 
                                key={slot} 
                                className={`border border-gray-700 p-1 h-20 relative transition-colors ${isAdmin ? 'hover:bg-[#253252] cursor-pointer' : ''}`}
                                onClick={() => isAdmin && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedClass })}
                              >
                                 {data && (
                                    <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm group`}>
                                       <span className="font-bold truncate w-full text-center">{data.subject}</span>
                                       {data.teacher && (
                                           <span className="truncate w-full text-center opacity-80 mt-1">
                                               {getShortName(data.teacher)}
                                           </span>
                                       )}
                                    </div>
                                 )}
                                 {isAdmin && !data && <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-xs text-gray-600">+</div>}
                              </td>
                           );
                        })}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {isAdmin && <div className="px-6 py-2 text-xs text-gray-500 italic">* Klik pada kotak masa untuk mengedit (Admin Sahaja).</div>}
      </div>
    );
 };

  // 6. JADUAL PEMANTAUAN VIEW
  const JadualPemantauanView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const isSystemAdmin = user?.role === 'adminsistem';

    const filteredData = monitoringList.filter(group => {
      const monitorMatch = group.monitor.toLowerCase().includes(searchQuery.toLowerCase());
      const superviseeMatch = group.items.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return monitorMatch || superviseeMatch;
    });

    return (
      <div className="space-y-6 fade-in">
         {/* Search Filter */}
         <div className="bg-[#1C2541] p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-white flex-1">Jadual Pemantauan Pengajaran & Pemudahcaraan</h3>
            <div className="relative w-full md:w-1/3">
               <input 
                 type="text" 
                 placeholder="Cari nama pemantau atau guru..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#0B132B] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#C9B458] outline-none"
               />
               <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
         </div>

         {/* Grid Cards (10 Cards) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(group => (
               <div key={group.id} className="bg-[#1C2541] rounded-xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow flex flex-col group relative">
                  {isSystemAdmin && (
                      <button onClick={() => openEditModal('monitoring', group)} className="absolute top-2 right-2 text-gray-400 hover:text-white z-20 bg-black/30 rounded-full p-1 w-8 h-8 flex items-center justify-center">✏️</button>
                  )}
                  {/* Header (Monitor) */}
                  <div className="bg-[#0B132B] p-4 border-b border-[#C9B458] border-opacity-50 flex justify-between items-start relative overflow-hidden">
                     <div className="z-10">
                        <h4 className="text-[#C9B458] font-bold text-sm uppercase tracking-wide pr-2">{group.monitor}</h4>
                        <p className="text-gray-400 text-xs font-semibold mt-1 uppercase tracking-wider">{group.position}</p>
                     </div>
                     <div className="flex flex-col items-center justify-center bg-[#3A506B] text-white w-12 h-12 rounded-lg font-bold shadow-lg z-10 border border-gray-600">
                        <span className="text-[8px] uppercase">Kad</span>
                        <span className="text-xl leading-none">{group.id}</span>
                     </div>
                     {/* Watermark Decoration */}
                     <div className="absolute -right-4 -bottom-4 text-6xl opacity-5 pointer-events-none">
                        📋
                     </div>
                  </div>

                  {/* Body (Supervisees) - Left Code, Right Name */}
                  <div className="p-4 flex-1 bg-[#1C2541] relative">
                     <ul className="space-y-3">
                        {group.items.map((item, idx) => (
                           <li key={idx} className="flex items-center text-sm border-b border-gray-700 last:border-0 pb-2 last:pb-0 hover:bg-[#253252] rounded px-2 -mx-2 transition-colors">
                              <span className="text-[#C9B458] font-mono text-xs font-bold w-12 flex-shrink-0 bg-[#0B132B] px-1 py-0.5 rounded text-center border border-gray-600">
                                  {item.code}
                              </span>
                              <span className="text-gray-200 ml-3 truncate" title={item.name}>{item.name}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            ))}
         </div>

         {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-[#1C2541] rounded-xl border border-gray-700 border-dashed">
               Tiada rekod dijumpai untuk carian "{searchQuery}".
            </div>
         )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
       {/* Breadcrumb Header */}
       <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
           <span>JADUAL</span>
           <span>/</span>
           <span className="uppercase">{type}</span>
       </div>
       
       <h2 className="text-3xl font-bold text-white font-montserrat mb-6">
         {type}
       </h2>

       {type === 'Guru Ganti' && <GuruGantiView />}
       {type === 'Guru Kelas' && <GuruKelasView />}
       {type === 'Jadual Persendirian' && <JadualPersendirianView />}
       {type === 'Jadual Kelas' && <JadualKelasView />}
       {type === 'Jadual Berucap' && <JadualBerucapView />}
       {type === 'Jadual Pemantauan' && <JadualPemantauanView />}

       {/* --- UNIVERSAL EDIT MODAL --- */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                    {modalType === 'scheduleSlot' ? `Edit Slot (${formData.day} ${formData.time})` : 
                     modalType === 'addClass' ? 'Tambah Kelas Baru' : 
                     modalType === 'speech' ? 'Jadual Berucap' : 
                     modalType === 'monitoring' ? `Edit Kad Pemantauan #${editingItem.id}` : 'Kemaskini Maklumat'}
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    {modalType === 'relief' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Masa</label>
                              <input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Kelas</label>
                              <input type="text" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Subjek</label>
                              <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Tidak Hadir</label>
                              <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.absent}
                                onChange={e => setFormData({...formData, absent: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Ganti</label>
                              <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.relief}
                                onChange={e => setFormData({...formData, relief: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                        </>
                    )}

                    {modalType === 'monitoring' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Pemantau</label>
                              <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.monitor}
                                onChange={e => setFormData({...formData, monitor: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t.toUpperCase()}>{t.toUpperCase()}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Jawatan</label>
                              <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold mb-1 block">Senarai Guru Diselia (Format: Kod | Nama)</label>
                              <textarea 
                                value={formData.itemsStr} 
                                onChange={e => setFormData({...formData, itemsStr: e.target.value})} 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-48 font-mono text-sm"
                                placeholder={`2.1 | Nama Guru A\n2.2 | Nama Guru B`}
                              />
                              <p className="text-[10px] text-gray-500 mt-1">* Gunakan simbol paip (|) untuk memisahkan kod dan nama. Satu guru per baris.</p>
                           </div>
                        </>
                    )}

                    {modalType === 'coordinator' && (
                        <div>
                             <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Penyelaras ({formData.form})</label>
                             <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                             >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                    )}

                    {modalType === 'classTeacher' && (
                         <div>
                             <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru Kelas ({formData.class})</label>
                             <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.teacher}
                                onChange={e => setFormData({...formData, teacher: e.target.value})}
                             >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                    )}

                    {modalType === 'speech' && (
                        <>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Minggu (M)</label>
                                  <input type="text" value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                </div>
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Tarikh</label>
                                  <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                               </div>
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Kumpulan</label>
                              <input type="text" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Berucap</label>
                              <input type="text" value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Tajuk</label>
                              <input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Sivik</label>
                                  <input type="text" value={formData.civic} onChange={e => setFormData({...formData, civic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                               </div>
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Sumur</label>
                                  <input type="text" value={formData.sumur} onChange={e => setFormData({...formData, sumur: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                               </div>
                           </div>
                        </>
                    )}

                    {modalType === 'addClass' && (
                         <>
                            <div>
                                <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Kelas (Cth: 4 Al-Hanafi)</label>
                                <input required type="text" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" placeholder="Nama Kelas" />
                            </div>
                            <div>
                                <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru Kelas</label>
                                <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.teacherName}
                                    onChange={e => setFormData({...formData, teacherName: e.target.value})}
                                >
                                    <option value="">-- Pilih Guru --</option>
                                    {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                         </>
                    )}

                    {modalType === 'scheduleSlot' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Subjek</label>
                              
                              {/* Logic for Dropdown in Jadual Kelas OR Jadual Persendirian */}
                              {type === 'Jadual Kelas' ? (
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                  >
                                      <option value="">-- Pilih Subjek --</option>
                                      <option value="REHAT">REHAT</option>
                                      {(getFormLevel(selectedClass) >= 4 ? SUBJECTS_UPPER : SUBJECTS_LOWER).map(sub => (
                                          <option key={sub} value={sub}>{sub}</option>
                                      ))}
                                      {/* Fallback to custom value if it exists but isn't in list */}
                                      {!SUBJECTS_LOWER.includes(formData.subject) && !SUBJECTS_UPPER.includes(formData.subject) && formData.subject !== 'REHAT' && formData.subject !== '' && (
                                          <option value={formData.subject}>{formData.subject}</option>
                                      )}
                                  </select>
                              ) : (
                                  // For Personal Schedule, show all subjects in dropdown for convenience
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                  >
                                      <option value="">-- Pilih Subjek / Aktiviti --</option>
                                      <option value="REHAT">REHAT</option>
                                      {ALL_SUBJECTS.map(sub => (
                                          <option key={sub} value={sub}>{sub}</option>
                                      ))}
                                      {/* Allow keeping custom value if user manually entered it before */}
                                      {!ALL_SUBJECTS.includes(formData.subject) && formData.subject !== 'REHAT' && formData.subject !== '' && (
                                          <option value={formData.subject}>{formData.subject}</option>
                                      )}
                                  </select>
                              )}
                           </div>

                           {/* If editing personal schedule, ask for Class Code. If Class schedule, ask for Teacher */}
                           {type === 'Jadual Persendirian' ? (
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Kod Kelas / Catatan</label>
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value})}
                                  >
                                      <option value="">-- Pilih Kod --</option>
                                      {CLASS_CODES.map(code => (
                                          <option key={code} value={code}>{code}</option>
                                      ))}
                                  </select>
                                </div>
                           ) : (
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru</label>
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.teacher}
                                    onChange={e => setFormData({...formData, teacher: e.target.value})}
                                  >
                                    <option value="">-- Pilih Guru --</option>
                                    {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                </div>
                           )}
                           
                           <div>
                               <label className="text-xs text-[#C9B458] uppercase font-bold">Warna Label</label>
                               <div className="grid grid-cols-1 gap-2 mt-1">
                                   {colorOptions.map(opt => (
                                       <label key={opt.label} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#0B132B]">
                                           <input 
                                             type="radio" 
                                             name="color" 
                                             value={opt.value} 
                                             checked={formData.color === opt.value}
                                             onChange={() => setFormData({...formData, color: opt.value})}
                                             className="accent-[#C9B458]"
                                           />
                                           <span className={`w-4 h-4 rounded-full border ${opt.value.split(' ')[0]} ${opt.value.split(' ')[2]}`}></span>
                                           <span className="text-sm text-gray-300">{opt.label}</span>
                                       </label>
                                   ))}
                               </div>
                           </div>
                        </>
                    )}

                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                    </div>
                </form>
             </div>
           </div>
       )}
    </div>
  );
};