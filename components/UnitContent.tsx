
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SumurEvent, HipEvent } from '../types';

interface UnitContentProps {
  unit: string;
  type: string;
}

interface Committee {
  id: string;
  name: string;
}

interface ExamWeekRow {
  id: number;
  week: string;
  date: string;
  dalaman: string;
  jaj: string;
  awam: string;
  isHoliday?: boolean;
}

// --- INITIAL DATA (EXAM WEEKS) ---
const INITIAL_EXAM_WEEKS: ExamWeekRow[] = [
    { id: 1, week: '1', date: '12 – 16 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 2, week: '2', date: '19 – 23 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 3, week: '3', date: '26 – 30 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 4, week: '4', date: '2 – 6 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 5, week: '5', date: '9 – 13 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 6, week: '6', date: '16 – 20 Feb 2026', dalaman: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', jaj: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', awam: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)' },
    { id: 7, week: '7', date: '23 – 27 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 8, week: '8', date: '2 – 6 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 9, week: '9', date: '9 – 13 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 10, week: '10', date: '16 – 20 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1001, week: '', date: '21 – 29 Mac 2026', dalaman: 'CUTI PENGGAL 1, TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 11, week: '11', date: '30 Mac – 3 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 12, week: '12', date: '6 – 10 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 13, week: '13', date: '13 – 17 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 14, week: '14', date: '20 – 24 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 15, week: '15', date: '27 Apr – 1 Mei 2026', dalaman: '1 Mei (Hari Pekerja)', jaj: '1 Mei (Hari Pekerja)', awam: '1 Mei (Hari Pekerja)' },
    { id: 16, week: '16', date: '4 – 8 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 17, week: '17', date: '11 – 15 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 18, week: '18', date: '18 – 22 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1002, week: '', date: '23.05.2026 – 07.06.2026', dalaman: 'CUTI PERTENGAHAN TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 19, week: '19', date: '8 – 12 Jun 2026', dalaman: '', jaj: '', awam: '' },
    { id: 20, week: '20', date: '15 – 19 Jun 2026', dalaman: '17 Jun (Awal Muharram)', jaj: '17 Jun (Awal Muharram)', awam: '17 Jun (Awal Muharram)' },
    { id: 21, week: '21', date: '22 – 26 Jun 2026', dalaman: '', jaj: '', awam: '' },
    { id: 22, week: '22', date: '29 Jun – 3 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 23, week: '23', date: '6 – 10 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 24, week: '24', date: '13 – 17 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 25, week: '25', date: '20 – 24 Jul 2026', dalaman: '21 Jul (Hari Hol — Johor)', jaj: '21 Jul (Hari Hol — Johor)', awam: '21 Jul (Hari Hol — Johor)' },
    { id: 26, week: '26', date: '27 – 31 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 27, week: '27', date: '3 – 7 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 28, week: '28', date: '10 – 14 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 29, week: '29', date: '17 – 21 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 30, week: '30', date: '24 – 28 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1003, week: '', date: '29.08.2026 – 06.09.2026', dalaman: 'CUTI PENGGAL 2, TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 31, week: '31', date: '7 – 11 Sep 2026', dalaman: '-', jaj: '', awam: '' },
    { id: 32, week: '32', date: '14 – 18 Sep 2026', dalaman: '16 Sept (Hari Malaysia)', jaj: '16 Sept (Hari Malaysia)', awam: '16 Sept (Hari Malaysia)' },
    { id: 33, week: '33', date: '21 – 25 Sep 2026', dalaman: '', jaj: '', awam: '' },
    { id: 34, week: '34', date: '28 Sep – 2 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 35, week: '35', date: '5 – 9 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 36, week: '36', date: '12 – 16 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 37, week: '37', date: '19 – 23 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 38, week: '38', date: '26 – 30 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 39, week: '39', date: '2 – 6 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 40, week: '40', date: '9 – 13 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 41, week: '41', date: '16 – 20 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 42, week: '42', date: '23 – 27 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 43, week: '43', date: '30 Nov – 4 Dis 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1004, week: '', date: '05.12.2026 – 31.12.2026', dalaman: 'CUTI AKHIR PERSEKOLAHAN TAHUN 2026', jaj: '', awam: '', isHoliday: true },
];

// --- PRE-DEFINED LISTS FOR ALL UNITS ---
const PENTADBIRAN_JK_LIST = [
  "Jawatankuasa Induk Pengurusan Dan Pentadbiran",
  "Jawatankuasa Pengurusan Dan Kepimpinan Organisasi",
  "Jawatankuasa Pengurusan Persekitaran Dan Kemudahan Fizikal",
  "Jawatankuasa Program Transformasi Sekolah 2025 (Ts25), Kajian Tindakan Dan Inovasi",
  "Jawatankuasa Kajian Tindakan Dan Inovasi",
  "Jawatankuasa Standard Sekolah (Jkss)",
  "Jawatankuasa Pengurusan Maklumat Sekolah (Jpms)",
  "Jawatankuasa Perhubungan Luar",
  "Jawatankuasa Penilaian Bersepadu Pegawai Perkhidmatan Pendidikan (Pbppp)",
  "Jawatankuasa Smart Digital Hub",
  "Jawatankuasa Pengurusan Dan Pembangunan Sumber Manusia",
  "Jawatankuasa Kelab Kebajikan Guru Dan Staf (Kebirus)",
  "Jawatankuasa Pengurusan Kewangan",
  "Jawatankuasa Pengurusan Aset",
  "Jawatankuasa Pengurusan Akaun Sekolah"
];

const KURIKULUM_JK_LIST = [
  "Jawatankuasa Induk Kurikulum",
  "Jawatankuasa Panitia Mata Pelajaran",
  "Jawatankuasa Jadual Waktu & Guru Ganti",
  "Jawatankuasa Peperiksaan & Penilaian",
  "Jawatankuasa Pentaksiran Bilik Darjah (PBD)",
  "Jawatankuasa Pusat Sumber Sekolah (PSS)",
  "Jawatankuasa Program Kecemerlangan Akademik",
  "Jawatankuasa MBMMBI",
  "Jawatankuasa STEM",
  "Jawatankuasa Pemulihan Khas"
];

const HEM_JK_LIST = [
  "Jawatankuasa Induk Hal Ehwal Murid",
  "Jawatankuasa Lembaga Disiplin Sekolah",
  "Jawatankuasa Pengawas Sekolah",
  "Jawatankuasa Bimbingan & Kaunseling",
  "Jawatankuasa Skim Pinjaman Buku Teks (SPBT)",
  "Jawatankuasa Kantin Sekolah",
  "Jawatankuasa Kebajikan & Bantuan Murid",
  "Jawatankuasa Keselamatan, Kebersihan & Kesihatan (3K)",
  "Jawatankuasa APDM / Data Murid",
  "Jawatankuasa PPDa (Pendidikan Pencegahan Dadah)",
  "Jawatankuasa Kelab Pencegahan Jenayah"
];

const KOKO_JK_LIST = [
  "Jawatankuasa Induk Kokurikulum",
  "Jawatankuasa Pembangunan Sukan Sekolah",
  "Jawatankuasa Badan Beruniform",
  "Jawatankuasa Kelab & Persatuan",
  "Jawatankuasa Sukan & Permainan",
  "Jawatankuasa Rumah Sukan",
  "Jawatankuasa Koperasi Sekolah",
  "Jawatankuasa Majalah Sekolah",
  "Jawatankuasa PAJSK",
  "Jawatankuasa RIMUP"
];

// --- DATE HELPERS ---
const malayMonths = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];

// Helper to convert "14 Jan 2026" to "2026-01-14" for input type="date"
const dateToISO = (dateStr: string) => {
    if (!dateStr) return '';
    // Handle already ISO format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    
    // Handle DD MMM YYYY or DD Month YYYY
    const parts = dateStr.split(' ');
    if (parts.length < 3) return '';
    
    let day = parts[0].padStart(2, '0');
    // Normalize month string to handle "Ogos" vs "Ogo" vs "August" if any
    const monthStr = parts[1].toLowerCase().substring(0, 3);
    const year = parts[2];
    
    const monthMap: Record<string, string> = {
        'jan': '01', 'feb': '02', 'mac': '03', 'apr': '04', 'mei': '05', 'jun': '06',
        'jul': '07', 'ogo': '08', 'sep': '09', 'okt': '10', 'nov': '11', 'dis': '12'
    };
    
    const month = monthMap[monthStr];
    if (!month) return ''; // invalid month
    
    return `${year}-${month}-${day}`;
};

// Helper to convert "2026-01-14" to "14 Jan 2026"
const ISOToMalay = (isoStr: string) => {
    if (!isoStr) return '';
    const [year, month, day] = isoStr.split('-');
    if (!year || !month || !day) return isoStr;
    const mIndex = parseInt(month) - 1;
    if (mIndex < 0 || mIndex > 11) return isoStr;
    return `${parseInt(day)} ${malayMonths[mIndex]} ${year}`;
};

// Helper to format teacher names correctly
const formatTeacherName = (name: string): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Keep bin and binti in lowercase
      if (word === 'bin' || word === 'binti') return word;
      // Handle words with special characters like @
      if (word.includes('@')) {
          return word.split('@').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('@');
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Helper for Title Case (huruf kecil kecuali pangkal perkataan)
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper to identify system/locked data
const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
};

// Default descriptions map (Committee ID -> Description)
const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  // Jawatankuasa Induk Pengurusan dan Pentadbiran (Index 0)
  "jk_pentadbiran_0": `1. Mengadakan mesyuarat sekurang-kurang dua (2) kali setahun.

2. Menentukan dasar dan hala tuju sekolah.

3. Merancang dan mengurus pengoperasian sekolah.

4. Merancang dan mengawal pengurusan sumber di sekolah.

5. Mengenal pasti dan menyelesaikan isu dan permasalahan di sekolah.

6. Merancang, memantau, menilai dan menambahbaikan pelaksanaan program dan aktiviti sekolah.

7. Membina hubungan seranta dengan ibu bapa, komuniti dan pihak yang berkepentingan.

8. Melapor dan mendokumenkan program dan aktiviti sekolah.

9. Mengurus dan menyelia pengoperasian bilik khas berkaitan kurikulum.

10. Merancang, menyusun dan melaksana program-program dan aktiviti-aktiviti untuk meningkatkan tahap pencahaian sekolah dalam bidang pengurusan, akademik, kemenjadian murid, kokurikulum dan keceriaan.

11. Membuat penilaian kendiri tahap pencapaian sekolah berdasarkan keputusan Pelaporan Sekolah Rendah dan PBD.

12. Melaksanakan tugas PPS di bawah komponen terlibat untuk mengurus pelaporan SKPMg2.`,
  
  "jk_kurikulum_0": `1. Memastikan pelaksanaan Kurikulum Standard Sekolah Menengah (KSSM) dipatuhi.

2. Merancang program peningkatan akademik.

3. Memastikan sukatan pelajaran diselesaikan mengikut takwim.

4. Menganalisis keputusan peperiksaan dan merangka intervensi.`,

  "jk_hem_0": `1. Menguruskan pendaftaran dan data murid (APDM).

2. Memastikan disiplin dan sahsiah murid terkawal.

3. Menguruskan kebajikan dan bantuan murid miskin/yatim.

4. Memantau aspek keselamatan dan kesihatan murid di sekolah.`,

  "jk_kokurikulum_0": `1. Merancang takwim aktiviti kokurikulum tahunan.

2. Memantau kehadiran dan penglibatan murid dalam PAJSK.

3. Menguruskan penyertaan sekolah dalam pertandingan luar.

4. Memastikan keselamatan murid semasa aktiviti dijalankan.`
};

export const UnitContent: React.FC<UnitContentProps> = ({ unit, type }) => {
  const { 
    user, showToast, checkPermission, 
    kokoWeeklyData, updateKokoWeeklyData,
    kokoAssemblyData, updateKokoAssemblyData, 
    sumurSchedule, updateSumurSchedule,
    hipSchedule, updateHipSchedule
  } = useApp();
  
  // Dynamic Permission Key Calculation
  const getPermissionKey = (): string => {
    if (unit === 'Pentadbiran') {
      return type === 'Jawatankuasa' ? 'canUpdatePentadbiranJK' : 'canUpdatePentadbiranTakwim';
    }
    if (unit === 'Kurikulum') {
      return type === 'Jawatankuasa' ? 'canUpdateKurikulumJK' : 'canUpdateKurikulumTakwim';
    }
    if (unit === 'Hal Ehwal Murid') {
      return type === 'Jawatankuasa' ? 'canUpdateHEMJK' : 'canUpdateHEMTakwim';
    }
    if (unit === 'Kokurikulum') {
      return type === 'Jawatankuasa' ? 'canUpdateKokoJK' : 'canUpdateKokoTakwim';
    }
    return ''; // Fallback or strict deny
  };

  const permKey = getPermissionKey();
  const canEdit = checkPermission(permKey);
  const canDelete = checkPermission(permKey);
  const canSave = checkPermission(permKey);
  const canDownload = true; // Everyone can download mostly

  const isSystemAdmin = user?.role === 'adminsistem';

  // --- State Management ---
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Koko & Special Types State
  const [kokoTitles, setKokoTitles] = useState({
      weekly: 'TAKWIM PERJUMPAAN MINGGUAN KOKURIKULUM – TAHUN 2026',
      monthly: 'JADUAL PERHIMPUNAN BULANAN KOKURIKULUM – TAHUN 2026'
  });
  const [editingKokoType, setEditingKokoType] = useState<'weekly' | 'monthly' | 'title_weekly' | 'title_monthly' | 'exam_week' | 'sumur' | 'hip' | null>(null);

  // Exam Weeks State (For Kurikulum -> Takwim -> Takwim Peperiksaan)
  const [examWeeks, setExamWeeks] = useState<ExamWeekRow[]>(INITIAL_EXAM_WEEKS);

  // Committee Management State
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>('default');
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);
  const [isEditCommitteeModalOpen, setIsEditCommitteeModalOpen] = useState(false);
  const [newCommitteeName, setNewCommitteeName] = useState('');
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);

  // Description State for Jawatankuasa (Right Column)
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState('');

  // Takwim View State (Extended for Kokurikulum and Kurikulum)
  const [takwimView, setTakwimView] = useState<'list' | 'annual' | 'koko_weekly' | 'koko_monthly' | 'exam_schedule' | 'sumur_schedule' | 'hip_schedule'>('list');

  // Form State
  const [formData, setFormData] = useState({
    // Jawatankuasa fields
    role: '',
    position: '',
    teacherName: '',
    // Takwim fields
    event: '',
    date: '',
    status: '',
    // Koko fields
    activity: '',
    month: '',
    unit: '',
    title: '',
    notes: '',
    // Exam Week fields
    week: '',
    dalaman: '',
    jaj: '',
    awam: '',
    // Sumur & HIP fields (Shared)
    program: '',
    teacher: ''
  });

  // --- CONSTANTS FOR ANNUAL VIEW ---
  const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
  const daysLetters = ['I', 'S', 'R', 'K', 'J', 'S', 'A']; // Isnin...Ahad
  const year = 2026; // Fixed year for this session

  // --- Data Initialization & Persistence ---
  
  useEffect(() => {
    // Load Koko Data from LocalStorage
    if (unit === 'Kokurikulum' && type === 'Takwim') {
        const savedWeekly = localStorage.getItem('smaam_koko_weekly');
        const savedAssembly = localStorage.getItem('smaam_koko_assembly');
        const savedTitles = localStorage.getItem('smaam_koko_titles');

        // Only update if local storage has data, otherwise context provides initial data
        if (savedWeekly) updateKokoWeeklyData(JSON.parse(savedWeekly));
        if (savedAssembly) updateKokoAssemblyData(JSON.parse(savedAssembly));
        if (savedTitles) setKokoTitles(JSON.parse(savedTitles));
    }
    
    // Load Exam Weeks Data from LocalStorage
    if (unit === 'Kurikulum' && type === 'Takwim') {
        const savedExamWeeks = localStorage.getItem('smaam_exam_weeks');
        if (savedExamWeeks) setExamWeeks(JSON.parse(savedExamWeeks));
        
        const savedHip = localStorage.getItem('smaam_hip_schedule');
        if (savedHip) updateHipSchedule(JSON.parse(savedHip));
    }

    // Load Sumur Data from LocalStorage
    if (unit === 'Hal Ehwal Murid' && type === 'Takwim') {
        const savedSumur = localStorage.getItem('smaam_sumur_schedule');
        if (savedSumur) updateSumurSchedule(JSON.parse(savedSumur));
    }
  }, [unit, type]);

  useEffect(() => {
    if (type === 'Jawatankuasa') {
      const committeesKey = `smaam_committees_list_${unit}`;
      const savedCommittees = localStorage.getItem(committeesKey);
      
      // Determine the default list based on unit
      let targetList: string[] = [];
      let prefix = '';
      if (unit === 'Pentadbiran') { targetList = PENTADBIRAN_JK_LIST; prefix = 'jk_pentadbiran_'; }
      else if (unit === 'Kurikulum') { targetList = KURIKULUM_JK_LIST; prefix = 'jk_kurikulum_'; }
      else if (unit === 'Hal Ehwal Murid') { targetList = HEM_JK_LIST; prefix = 'jk_hem_'; }
      else if (unit === 'Kokurikulum') { targetList = KOKO_JK_LIST; prefix = 'jk_koko_'; }
      else { targetList = ["Jawatankuasa Induk"]; prefix = 'jk_general_'; }

      if (savedCommittees) {
        const parsed = JSON.parse(savedCommittees);
        const needsUpdate = parsed.length === 0 || (parsed.length === 1 && parsed[0].id === 'jk_induk' && unit !== 'Lain-lain');

        if (needsUpdate) {
             const seedData = targetList.map((name, index) => ({
                id: `${prefix}${index}`,
                name: name
             }));
             setCommittees(seedData);
             setActiveCommitteeId(seedData[0].id);
             localStorage.setItem(committeesKey, JSON.stringify(seedData));
        } else {
            setCommittees(parsed);
            if (parsed.length > 0 && activeCommitteeId === 'default') {
                setActiveCommitteeId(parsed[0].id);
            }
        }
      } else {
        const defaultCommittees = targetList.map((name, index) => ({
            id: `${prefix}${index}`,
            name: name
        }));
        setCommittees(defaultCommittees);
        setActiveCommitteeId(defaultCommittees[0].id);
        localStorage.setItem(committeesKey, JSON.stringify(defaultCommittees));
      }
    }
  }, [unit, type]);

  useEffect(() => {
    const storageKey = `smaam_data_${unit}_${type}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      setItems(JSON.parse(storedData));
    } else {
      const initialData = getMockData();
      if (type === 'Jawatankuasa') {
          let prefix = '';
          if (unit === 'Pentadbiran') prefix = 'jk_pentadbiran_0';
          else if (unit === 'Kurikulum') prefix = 'jk_kurikulum_0';
          else if (unit === 'Hal Ehwal Murid') prefix = 'jk_hem_0';
          else if (unit === 'Kokurikulum') prefix = 'jk_kokurikulum_0';
          else prefix = 'jk_induk';

          const mappedData = initialData.map((d: any) => ({ ...d, committeeId: prefix }));
          setItems(mappedData);
          localStorage.setItem(storageKey, JSON.stringify(mappedData));
      } else {
          setItems(initialData);
          localStorage.setItem(storageKey, JSON.stringify(initialData));
      }
    }

    if (type === 'Jawatankuasa') {
      const descKey = `smaam_desc_${unit}_${activeCommitteeId}`;
      const storedDesc = localStorage.getItem(descKey);
      if (storedDesc) {
        setDescription(storedDesc);
      } else {
        setDescription(DEFAULT_DESCRIPTIONS[activeCommitteeId] || '');
      }
    }
  }, [unit, type, activeCommitteeId]);

  const saveToStorage = (newItems: any[]) => {
    const storageKey = `smaam_data_${unit}_${type}`;
    localStorage.setItem(storageKey, JSON.stringify(newItems));
    setItems(newItems);
  };

  const saveDescription = () => {
    const descKey = `smaam_desc_${unit}_${activeCommitteeId}`;
    setDescription(tempDesc);
    localStorage.setItem(descKey, tempDesc);
    setIsEditingDesc(false);
    showToast("Maklumat fungsi dikemaskini.");
  };

  const saveCommitteesList = (newList: Committee[]) => {
    const committeesKey = `smaam_committees_list_${unit}`;
    localStorage.setItem(committeesKey, JSON.stringify(newList));
    setCommittees(newList);
  };

  // --- Koko Data Handlers ---
  const handleEditKoko = (type: 'weekly' | 'monthly', item?: any) => {
      setEditingKokoType(type);
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      if (type === 'weekly') {
          setFormData({ ...formData, date: item?.date || '', activity: item?.activity || '' });
      } else {
          setFormData({ 
            ...formData, 
            month: item?.month || '', 
            date: item?.date || '', 
            unit: item?.unit || '',
            notes: item?.notes || ''
          });
      }
  };

  const handleEditKokoTitle = (type: 'title_weekly' | 'title_monthly') => {
      setEditingKokoType(type);
      setIsModalOpen(true);
      setFormData({ ...formData, title: type === 'title_weekly' ? kokoTitles.weekly : kokoTitles.monthly });
  };

  const handleDeleteKoko = (type: 'weekly' | 'monthly', id: number) => {
      if(confirm("Padam rekod ini?")) {
          if (type === 'weekly') {
              const newData = kokoWeeklyData.filter(i => i.id !== id);
              updateKokoWeeklyData(newData);
              localStorage.setItem('smaam_koko_weekly', JSON.stringify(newData));
          } else {
              const newData = kokoAssemblyData.filter(i => i.id !== id);
              updateKokoAssemblyData(newData);
              localStorage.setItem('smaam_koko_assembly', JSON.stringify(newData));
          }
          showToast("Rekod dipadam.");
      }
  };

  // --- Sumur Data Handlers ---
  const handleEditSumur = (item: any) => {
      setEditingKokoType('sumur');
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      setFormData({
          ...formData,
          date: item?.date || '',
          program: item?.program || '',
          teacher: item?.teacher || '',
          activity: item?.activity || ''
      });
  };

  const handleDeleteSumur = (id: number) => {
      if(confirm("Padam rekod SUMUR ini?")) {
          const newData = sumurSchedule.filter(i => i.id !== id);
          updateSumurSchedule(newData);
          localStorage.setItem('smaam_sumur_schedule', JSON.stringify(newData));
          showToast("Rekod dipadam.");
      }
  };

  // --- HIP Data Handlers ---
  const handleEditHip = (item: any) => {
      setEditingKokoType('hip');
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      setFormData({
          ...formData,
          date: item?.date || '',
          program: item?.program || '',
          teacher: item?.teacher || '',
          activity: item?.activity || ''
      });
  };

  const handleDeleteHip = (id: number) => {
      if(confirm("Padam rekod HIP ini?")) {
          const newData = hipSchedule.filter(i => i.id !== id);
          updateHipSchedule(newData);
          localStorage.setItem('smaam_hip_schedule', JSON.stringify(newData));
          showToast("Rekod dipadam.");
      }
  };

  // --- Exam Week Handlers ---
  const handleEditExamWeek = (item: any) => {
      if (isSystemData(item.id) && !isSystemAdmin) {
          showToast("Akses Ditolak: Data asal sistem dikunci dan tidak boleh diubah.");
          return;
      }
      setEditingKokoType('exam_week');
      setEditingId(item.id);
      setIsModalOpen(true);
      setFormData({
          ...formData,
          week: item.week,
          date: item.date,
          dalaman: item.dalaman,
          jaj: item.jaj,
          awam: item.awam
      });
  };

  // --- Committee Management Handlers ---
  const handleAddCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitteeName.trim()) return;

    const newId = `jk_${Date.now()}`;
    const newCommittee = { id: newId, name: newCommitteeName };
    const updatedList = [...committees, newCommittee];
    
    saveCommitteesList(updatedList);
    setActiveCommitteeId(newId);
    setNewCommitteeName('');
    setIsAddCommitteeModalOpen(false);
    showToast(`Jawatankuasa "${newCommitteeName}" berjaya ditambah.`);
  };

  const handleEditCommitteeName = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCommitteeName.trim() || !editingCommitteeId) return;

      const updatedList = committees.map(c => 
          c.id === editingCommitteeId ? { ...c, name: newCommitteeName } : c
      );
      saveCommitteesList(updatedList);
      setNewCommitteeName('');
      setEditingCommitteeId(null);
      setIsEditCommitteeModalOpen(false);
      showToast("Nama jawatankuasa dikemaskini.");
  };

  const openEditCommitteeModal = (e: React.MouseEvent, committee: Committee) => {
      e.stopPropagation();
      setNewCommitteeName(committee.name);
      setEditingCommitteeId(committee.id);
      setIsEditCommitteeModalOpen(true);
  };

  const handleDeleteCommittee = (e: React.MouseEvent, id: string, name: string) => {
      e.stopPropagation();
      if (committees.length <= 1) {
          alert("Anda tidak boleh memadam jawatankuasa terakhir.");
          return;
      }
      if (window.confirm(`Adakah anda pasti ingin memadam "${name}"? Semua data ahli berkaitan akan turut dipadam.`)) {
          const updatedList = committees.filter(c => c.id !== id);
          saveCommitteesList(updatedList);

          const updatedItems = items.filter(item => item.committeeId !== id);
          saveToStorage(updatedItems);

          localStorage.removeItem(`smaam_desc_${unit}_${id}`);

          if (activeCommitteeId === id) {
              setActiveCommitteeId(updatedList[0].id);
          }
          showToast(`Jawatankuasa "${name}" telah dipadam.`);
      }
  }

  const getMockData = () => {
    if (type === 'Jawatankuasa') {
      if (unit === 'Pentadbiran') {
         return [
            { id: 1, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad' },
            { id: 2, role: 'Timbalan Pengerusi', position: 'GPK Pentadbiran', teacherName: 'Noratikah binti Abd. Kadir' },
            { id: 3, role: 'Naib Pengerusi 1', position: 'GPK Hal Ehwal Murid', teacherName: 'Shaharer bin Hj Husain' },
            { id: 4, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'Zulkifli bin Md Aspan' },
            { id: 5, role: 'Setiausaha', position: 'Setiausaha Pengurusan Pentadbiran', teacherName: 'Nooraind binti Ali' },
            { id: 6, role: 'AJK', position: 'GKMP Agama', teacherName: 'Saemah binti Supandi' },
            { id: 7, role: 'AJK', position: 'GKMP Dini', teacherName: 'Nor Azean binti Ismail' },
            { id: 8, role: 'AJK', position: 'GKMP Bahasa', teacherName: 'Rosmawati @ Rohayati binti Hussin' },
            { id: 9, role: 'AJK', position: 'GKMP Kemanusiaan', teacherName: 'Nooraind binti Ali' },
            { id: 10, role: 'AJK', position: 'GKMP Sains & Matematik', teacherName: 'Zahrah Khairiah Nasution binti Saleh' },
            { id: 11, role: 'AJK', position: 'GKMP Teknik & Vokasional', teacherName: 'Mazuin binti Mat' },
            { id: 12, role: 'AJK', position: 'Guru Bimbingan & Kaunseling', teacherName: 'Muhammad Hafiz bin Jalil' },
            { id: 13, role: 'AJK', position: 'Guru Perpustakaan & Media', teacherName: 'Nuurul Amira binti Razak' },
            { id: 14, role: 'AJK', position: 'Guru Data', teacherName: 'Noorlela binti Zainudin' },
            { id: 15, role: 'AJK', position: 'Penyelaras ICT/DELIMA', teacherName: 'Syahidatun Najihah binti Aziz' },
            { id: 16, role: 'AJK', position: 'Guru Disiplin', teacherName: 'Salman bin A Rahman' },
            { id: 17, role: 'AJK', position: 'Penyelaras Program TS25', teacherName: "Ahmad Fikruddin bin Ahmad Raza'i" },
            { id: 18, role: 'AJK', position: 'Penyelia Asrama', teacherName: 'Islahuddin bin Muchtar' },
            { id: 19, role: 'AJK', position: 'Ketua Anggota Kumpulan Pelaksana', teacherName: 'Yati binti Ani' },
            { id: 20, role: 'AJK', position: 'Ketua Warden', teacherName: 'Salman bin A Rahman' },
         ];
      }
      return [
        { id: 1, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad' },
        { id: 2, role: 'Timbalan Pengerusi', position: unit === 'Kurikulum' ? 'GPK Pentadbiran' : unit === 'Hal Ehwal Murid' ? 'GPK HEM' : 'GPK Kokurikulum', teacherName: unit === 'Kurikulum' ? 'Noratikah binti Abd. Kadir' : unit === 'Hal Ehwal Murid' ? 'Shaharer bin Hj Husain' : 'Zulkifli bin Md Aspan' },
        { id: 3, role: 'Naib Pengerusi', position: 'GPK', teacherName: '(Lantikan Khas)' },
        { id: 4, role: 'Setiausaha', position: 'SU Unit', teacherName: '(Nama Guru)' },
        { id: 5, role: 'Pen. Setiausaha', position: 'Pen. SU', teacherName: '(Nama Guru)' },
        { id: 6, role: 'AJK', position: 'Ahli Jawatankuasa', teacherName: '(Nama Guru)' },
      ];
    } else {
      return [
        { id: 1, event: `Mesyuarat ${unit} Bil 1/2026`, date: '15-01-2026', status: 'Selesai' },
        { id: 2, event: 'Bengkel Pemantapan', date: '22-02-2026', status: 'Dalam Perancangan' },
        { id: 3, event: 'Semakan Fail', date: '10-03-2026', status: 'Akan Datang' },
      ];
    }
  };

  const getRolePriority = (role: string) => {
      const r = role.toLowerCase();
      if (r.includes('pengerusi') && !r.includes('timbalan') && !r.includes('naib')) return 1;
      if (r.includes('timbalan pengerusi')) return 2;
      if (r.includes('naib pengerusi 1')) return 3;
      if (r.includes('naib pengerusi 2')) return 4;
      if (r.includes('naib pengerusi')) return 5;
      if (r.includes('setiausaha') && !r.includes('penolong') && !r.includes('pen.')) return 6;
      if (r.includes('penolong setiausaha') || r.includes('pen. setiausaha')) return 7;
      if (r.includes('bendahari')) return 8;
      if (r.includes('pen. bendahari') || r.includes('penolong bendahari')) return 9;
      if (r.includes('penyelaras')) return 10;
      if (r.includes('ajk') || r.includes('ahli')) return 11;
      return 99; // Others
  };

  // --- Date Helpers ---
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // YYYY-MM-DD
    if (rawValue) {
        const parts = rawValue.split('-');
        const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
        setFormData({ ...formData, date: formatted });
    } else {
        setFormData({ ...formData, date: '' });
    }
  };

  const getDayLetter = (monthIdx: number, day: number) => {
      const d = new Date(year, monthIdx, day);
      if (d.getMonth() !== monthIdx) return null; // Invalid date (e.g. Feb 30)
      
      const dayIndex = d.getDay(); // 0 (Sun) to 6 (Sat)
      const mappedIndex = (dayIndex + 6) % 7;
      return daysLetters[mappedIndex];
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Selesai': return 'bg-green-600 text-white';
          case 'Dalam Perancangan': return 'bg-blue-600 text-white';
          case 'Akan Datang': return 'bg-[#C9B458] text-[#0B132B]';
          default: return 'bg-gray-600 text-gray-200';
      }
  };

  // --- Unit Badge Color Helper ---
  const getUnitBadgeColor = (unit: string) => {
      const u = unit.toLowerCase();
      if (u.includes('cuti')) return 'bg-red-900/50 text-red-300';
      if (u.includes('kadet remaja sekolah')) return 'bg-teal-900/60 text-teal-200'; // Hijau Turqoise Terang
      if (u.includes('puteri islam')) return 'bg-pink-900/60 text-pink-300'; // Pink
      if (u.includes('pengakap')) return 'bg-slate-600/60 text-slate-300'; // Silver (Gray/Slate)
      if (u.includes('pandu puteri')) return 'bg-sky-900/60 text-sky-300'; // Sky Blue
      return 'bg-blue-900/30 text-blue-200'; // Default
  };

  // --- Handlers ---
  const handleOpenModal = (item?: any) => {
    setEditingKokoType(null); // Reset Koko type just in case
    if (item && item.id) {
      setEditingId(item.id);
      setFormData({
        role: item.role || '',
        position: item.position || '',
        teacherName: item.teacherName || '',
        event: item.event || '',
        date: item.date || '',
        status: item.status || 'Akan Datang',
        activity: '', month: '', unit: '', title: '', notes: '',
        week: '', dalaman: '', jaj: '', awam: '',
        program: '', teacher: ''
      });
    } else {
      setEditingId(null);
      setFormData({
        role: '', position: '', teacherName: '',
        event: '', 
        status: 'Akan Datang',
        date: item?.date || '',
        activity: '', month: '', unit: '', title: '', notes: '',
        week: '', dalaman: '', jaj: '', awam: '',
        program: '', teacher: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Adakah anda pasti ingin memadam rekod ini?")) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
      showToast("Rekod berjaya dipadam.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- Koko Title Editing ---
    if (editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly') {
        const newTitles = { ...kokoTitles };
        if (editingKokoType === 'title_weekly') newTitles.weekly = formData.title;
        else newTitles.monthly = formData.title;
        setKokoTitles(newTitles);
        localStorage.setItem('smaam_koko_titles', JSON.stringify(newTitles));
        showToast("Tajuk dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- Koko Weekly Editing ---
    if (editingKokoType === 'weekly') {
        const payload = {
            id: editingId || Date.now(),
            date: formData.date,
            activity: formData.activity
        };
        let newData;
        if (editingId) {
            newData = kokoWeeklyData.map(i => i.id === editingId ? payload : i);
        } else {
            newData = [...kokoWeeklyData, payload];
        }
        updateKokoWeeklyData(newData);
        localStorage.setItem('smaam_koko_weekly', JSON.stringify(newData));
        showToast("Rekod mingguan dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- Koko Monthly Editing ---
    if (editingKokoType === 'monthly') {
        const payload = {
            id: editingId || Date.now(),
            month: formData.month,
            date: formData.date,
            unit: formData.unit,
            notes: formData.notes
        };
        let newData;
        if (editingId) {
            newData = kokoAssemblyData.map(i => i.id === editingId ? payload : i);
        } else {
            newData = [...kokoAssemblyData, payload];
        }
        updateKokoAssemblyData(newData);
        localStorage.setItem('smaam_koko_assembly', JSON.stringify(newData));
        showToast("Rekod bulanan dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- Sumur Editing ---
    if (editingKokoType === 'sumur') {
        const payload = {
            id: editingId || Date.now(),
            date: formData.date,
            program: formData.program,
            teacher: formData.teacher,
            activity: formData.activity
        };
        let newData;
        if (editingId) {
            newData = sumurSchedule.map(i => i.id === editingId ? payload : i);
        } else {
            newData = [...sumurSchedule, payload];
        }
        updateSumurSchedule(newData);
        localStorage.setItem('smaam_sumur_schedule', JSON.stringify(newData));
        showToast("Takwim SUMUR dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- HIP Editing ---
    if (editingKokoType === 'hip') {
        const payload = {
            id: editingId || Date.now(),
            date: formData.date,
            program: formData.program,
            teacher: formData.teacher,
            activity: formData.activity
        };
        let newData;
        if (editingId) {
            newData = hipSchedule.map(i => i.id === editingId ? payload : i);
        } else {
            newData = [...hipSchedule, payload];
        }
        updateHipSchedule(newData);
        localStorage.setItem('smaam_hip_schedule', JSON.stringify(newData));
        showToast("Takwim HIP dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- Exam Weeks Editing ---
    if (editingKokoType === 'exam_week') {
        const payload = {
            id: editingId!, // Should exist if editing
            week: formData.week,
            date: formData.date,
            dalaman: formData.dalaman,
            jaj: formData.jaj,
            awam: formData.awam,
            isHoliday: examWeeks.find(s => s.id === editingId)?.isHoliday
        };
        
        const newExamWeeks = examWeeks.map(item => item.id === editingId ? { ...item, ...payload } : item);
        setExamWeeks(newExamWeeks);
        localStorage.setItem('smaam_exam_weeks', JSON.stringify(newExamWeeks));
        showToast("Takwim peperiksaan dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- General Jawatankuasa / Takwim Handling ---
    let newItem: any;
    if (type === 'Jawatankuasa') {
      newItem = {
        role: formData.role,
        position: formData.position,
        // Automatically format teacher name on save
        teacherName: formatTeacherName(formData.teacherName),
        committeeId: activeCommitteeId 
      };
    } else {
      newItem = {
        event: formData.event,
        date: formData.date,
        status: formData.status
      };
    }

    if (editingId) {
      const updatedItems = items.map(item => 
        item.id === editingId ? { ...item, ...newItem } : item
      );
      saveToStorage(updatedItems);
      showToast("Rekod berjaya dikemaskini.");
    } else {
      newItem.id = Date.now();
      saveToStorage([...items, newItem]);
      showToast("Rekod baru berjaya ditambah.");
    }
    
    setIsModalOpen(false);
  };

  const handleDownloadPDF = () => {
    showToast("Memuat turun PDF...");
  };

  const filteredItems = type === 'Jawatankuasa' 
    ? items
        .filter(item => item.committeeId === activeCommitteeId || (!item.committeeId && activeCommitteeId === 'jk_induk'))
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role))
    : items;

  // --- RENDERERS FOR KOKURIKULUM SPECIFIC TABS ---
  const renderPerjumpaanMingguan = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center gap-2">
            <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">
                <span className="text-[#C9B458]">🗓️</span> {kokoTitles.weekly}
            </h4>
            {isSystemAdmin && (
                <div className="flex gap-2">
                    <button onClick={() => handleEditKokoTitle('title_weekly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button>
                    <button onClick={() => handleEditKoko('weekly', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button>
                </div>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                        <th className="px-6 py-4 w-16 text-center">BIL</th>
                        <th className="px-6 py-4 w-40 text-center">TARIKH</th>
                        <th className="px-6 py-4">AKTIVITI</th>
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {kokoWeeklyData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center">{idx + 1}</td>
                            <td className="px-6 py-3 text-white text-center font-mono">{item.date}</td>
                            <td className="px-6 py-3 text-gray-300 font-medium">{item.activity}</td>
                            {isSystemAdmin && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button onClick={() => handleEditKoko('weekly', item)} className="text-blue-400 hover:text-white">✏️</button>
                                    <button onClick={() => handleDeleteKoko('weekly', item.id)} className="text-red-400 hover:text-white">🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderPerhimpunanBulanan = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center gap-2">
            <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">
                <span className="text-[#C9B458]">📢</span> {kokoTitles.monthly}
            </h4>
            {isSystemAdmin && (
                <div className="flex gap-2">
                    <button onClick={() => handleEditKokoTitle('title_monthly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button>
                    <button onClick={() => handleEditKoko('monthly', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button>
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
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {kokoAssemblyData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-4 font-medium text-white text-center">{idx + 1}</td>
                            <td className="px-6 py-4 text-gray-300 text-center uppercase font-bold">{item.month}</td>
                            <td className="px-6 py-4 text-white text-center font-mono">{item.date}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded text-xs font-bold ${getUnitBadgeColor(item.unit)}`}>
                                    {toTitleCase(item.unit)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-sm">
                                {item.notes}
                            </td>
                            {isSystemAdmin && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button onClick={() => handleEditKoko('monthly', item)} className="text-blue-400 hover:text-white">✏️</button>
                                    <button onClick={() => handleDeleteKoko('monthly', item.id)} className="text-red-400 hover:text-white">🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderTakwimSumur = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center gap-2">
            <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">
                <span className="text-[#C9B458]">🕌</span> TAKWIM SUMUR 2026
            </h4>
            {isSystemAdmin && (
                <button onClick={() => handleEditSumur(null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button>
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
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {sumurSchedule.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center">{idx + 1}</td>
                            <td className="px-6 py-3 text-white text-center font-mono">{item.date}</td>
                            <td className="px-6 py-3 text-[#C9B458] font-bold">{item.program}</td>
                            <td className="px-6 py-3 text-white">{item.teacher}</td>
                            <td className="px-6 py-3 text-gray-300">{item.activity}</td>
                            {isSystemAdmin && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button onClick={() => handleEditSumur(item)} className="text-blue-400 hover:text-white">✏️</button>
                                    <button onClick={() => handleDeleteSumur(item.id)} className="text-red-400 hover:text-white">🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderTakwimHip = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center gap-2">
            <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">
                <span className="text-[#C9B458]">🗣️</span> TAKWIM HIP 2026
            </h4>
            {isSystemAdmin && (
                <button onClick={() => handleEditHip(null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button>
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
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {hipSchedule.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center">{idx + 1}</td>
                            <td className="px-6 py-3 text-white text-center font-mono">{item.date}</td>
                            <td className="px-6 py-3 text-[#C9B458] font-bold">{item.program}</td>
                            <td className="px-6 py-3 text-white">{item.teacher}</td>
                            <td className="px-6 py-3 text-gray-300">{item.activity}</td>
                            {isSystemAdmin && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button onClick={() => handleEditHip(item)} className="text-blue-400 hover:text-white">✏️</button>
                                    <button onClick={() => handleDeleteHip(item.id)} className="text-red-400 hover:text-white">🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderTakwimPeperiksaan = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
        <div className="p-4 md:p-6 bg-[#0B132B] border-b border-gray-700"><h3 className="text-lg md:text-xl font-bold text-white font-montserrat uppercase flex items-center gap-2"><span className="text-[#C9B458]">📅</span> TAKWIM PEPERIKSAAN 2026</h3></div>
        <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-gray-600 min-w-[650px] md:min-w-[900px] text-[10px] md:text-sm table-fixed">
                <thead>
                    <tr className="bg-[#C9B458] text-[#0B132B] uppercase font-bold">
                        <th className="border border-gray-600 px-1 py-3 w-8 md:w-16">M</th>
                        <th className="border border-gray-600 px-2 py-3 w-24 md:w-40">TARIKH</th>
                        <th className="border border-gray-600 px-2 py-3">DALAMAN</th>
                        <th className="border border-gray-600 px-2 py-3">JAJ</th>
                        <th className="border border-gray-600 px-2 py-3">AWAM</th>
                        {isSystemAdmin && <th className="border border-gray-600 px-1 py-3 w-8 md:w-16">EDIT</th>}
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {examWeeks.map((item) => (
                        item.isHoliday ? (
                             <tr key={item.id} className="bg-[#C9B458] text-[#0B132B] font-bold uppercase border-b border-gray-600">
                                 <td colSpan={2} className="border border-gray-600 py-2 px-1 text-center">{item.date}</td>
                                 <td colSpan={3} className="border border-gray-600 py-2 px-1 text-center truncate">{item.dalaman}</td>
                                 {isSystemAdmin && <td className="border border-gray-600 py-2 px-1 bg-[#0B132B]">
                                     <button onClick={() => handleEditExamWeek(item)} className={`${isSystemData(item.id) && !isSystemAdmin ? 'text-gray-500' : 'text-[#C9B458] hover:text-white'}`}>
                                         {isSystemData(item.id) && !isSystemAdmin ? '🔒' : '✏️'}
                                     </button>
                                 </td>}
                             </tr>
                        ) : (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                <td className="border border-gray-600 py-2 font-mono text-[#C9B458] font-bold">{item.week}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 whitespace-nowrap text-white">{item.date}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 text-left align-top leading-tight break-words">{item.dalaman}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 text-left align-top leading-tight break-words">{item.jaj}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 text-left align-top leading-tight break-words">{item.awam}</td>
                                {isSystemAdmin && <td className="border border-gray-600 py-2 px-1 text-center">
                                    <button 
                                        onClick={() => handleEditExamWeek(item)} 
                                        className={`${isSystemData(item.id) && !isSystemAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-[#C9B458]'}`}
                                    >
                                        {isSystemData(item.id) && !isSystemAdmin ? '🔒' : '✏️'}
                                    </button>
                                </td>}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 relative fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-black font-mono mb-1 font-inter">
             <span className="font-bold">{unit.toUpperCase()}</span>
             <span className="opacity-50">/</span>
             <span className="font-bold opacity-80">{type.toUpperCase()}</span>
          </div>
          <h2 className="text-[22px] md:text-3xl font-bold text-black font-montserrat">
            Pengurusan {type}
          </h2>
          <p className="text-black/80 mt-1 text-[13px] font-inter font-medium">
            {type === 'Jawatankuasa' 
              ? `Senarai jawatankuasa dan ahli bagi unit ${unit}.`
              : `Kalendar dan jadual aktiviti bagi unit ${unit}.`
            }
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex gap-3">
            {canDownload && (
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-[#1C2541] border border-[#C9B458] text-[#C9B458] px-4 py-2 rounded-lg font-semibold hover:bg-[#253252] transition-colors shadow-lg text-[13px]"
                >
                  📥 <span className="hidden sm:inline">Muat Turun PDF</span>
                </button>
            )}
            
            {(canEdit || canSave) && (type === 'Takwim' && (
                (unit === 'Kokurikulum' && (takwimView !== 'list' && takwimView !== 'annual')) || 
                (unit === 'Kurikulum' && (takwimView === 'exam_schedule' || takwimView === 'hip_schedule')) || 
                (unit === 'Hal Ehwal Murid' && takwimView === 'sumur_schedule')
            ) ? null : (
                (canEdit || canSave) && (
                    <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20 text-[13px]"
                    >
                    ➕ <span className="hidden sm:inline">
                        {type === 'Jawatankuasa' ? 'Tambah Ahli' : 'Tambah Aktiviti'}
                    </span>
                    </button>
                )
            ))}
        </div>
      </div>

      {/* --- CONTENT LAYOUT --- */}
      {type === 'Jawatankuasa' ? (
        // 3-COLUMN LAYOUT FOR JAWATANKUASA
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
            
            {/* COL 1: COMMITTEE LIST (Compact Sidebar) */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                <div className="bg-[#0B132B] p-4 rounded-xl border border-gray-700 text-center shadow-lg relative overflow-hidden group shrink-0">
                    <div className="absolute inset-0 border border-[#C9B458]/20 rounded-xl pointer-events-none"></div>
                    <span className="block text-4xl font-bold text-[#C9B458] font-['Century_Gothic']">{committees.length}</span>
                    <h3 className="text-gray-400 mt-1 text-[13px] font-sans uppercase tracking-widest font-bold">SENARAI JAWATANKUASA</h3>
                    {isSystemAdmin && (
                        <button
                            onClick={() => setIsAddCommitteeModalOpen(true)}
                            className="absolute top-2 right-2 text-[10px] text-gray-500 hover:text-white transition-colors"
                            title="Tambah Jawatankuasa"
                        >
                            +
                        </button>
                    )}
                </div>
                
                <div className="bg-[#1C2541] rounded-lg border border-gray-700 overflow-y-auto custom-scrollbar flex-1 shadow-inner">
                    <div className="flex flex-col">
                        {committees.map((committee, index) => (
                            <div 
                                key={committee.id}
                                onClick={() => setActiveCommitteeId(committee.id)}
                                className={`group flex justify-between items-center px-4 py-3 cursor-pointer border-b border-gray-800 transition-all duration-200
                                    ${activeCommitteeId === committee.id 
                                        ? 'bg-[#3A506B] text-white font-bold border-l-4 border-l-[#C9B458]' 
                                        : 'text-gray-400 hover:bg-[#253252] hover:text-gray-200'}`}
                            >
                                <span className="leading-[1.3] line-clamp-2 text-[13px] font-medium font-inter">
                                    {index + 1}. {committee.name.replace(/^Jawatankuasa\s+/i, '')}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isSystemAdmin && (
                                        <button onClick={(e) => openEditCommitteeModal(e, committee)} className="hover:text-[#C9B458]" title="Edit Nama">✏️</button>
                                    )}
                                    {isSystemAdmin && (
                                        <button onClick={(e) => handleDeleteCommittee(e, committee.id, committee.name)} className="hover:text-red-400" title="Hapus Jawatankuasa">🗑️</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* COL 2: MEMBER TABLE */}
            <div className="lg:col-span-6 flex flex-col h-full">
                <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-800 flex flex-col h-full">
                    <div className="bg-[#0B132B] p-6 border-b border-gray-700 flex flex-col items-center justify-center text-center shadow-md min-h-[120px] shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9B458]/50 to-transparent"></div>
                        <span className="text-white text-[16px] font-bold font-['Century_Gothic'] uppercase tracking-wider mb-1">ORGANISASI</span>
                        <h3 className="text-[#C9B458] font-bold text-[16px] leading-snug font-['Century_Gothic'] uppercase tracking-wider px-4">
                            {committees.find(c => c.id === activeCommitteeId)?.name || "Pilih Jawatankuasa"}
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                                    <th className="px-4 py-3 w-1/4">Peranan</th>
                                    <th className="px-4 py-3 w-1/4">Jawatan</th>
                                    <th className="px-4 py-3 w-1/3">Nama Guru</th>
                                    {(canEdit || canDelete) && <th className="px-4 py-3 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                            {/* Font role tidak bold */}
                                            <td className="px-4 py-3 font-normal text-white border-r border-gray-800/50">{item.role}</td>
                                            <td className="px-4 py-3 text-gray-400 italic">{item.position}</td>
                                            {/* Font nama guru format Title Case & lowercase bin/binti */}
                                            <td className="px-4 py-3 font-semibold text-[#C9B458]">{formatTeacherName(item.teacherName)}</td>
                                            {(canEdit || canDelete) && (
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {canEdit && <button onClick={() => handleOpenModal(item)} className="text-blue-400 hover:text-white" title="Edit">✏️</button>}
                                                        {canDelete && <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-white" title="Hapus">🗑️</button>}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={(canEdit || canDelete) ? 4 : 3} className="px-6 py-12 text-center text-gray-500 italic">
                                            Tiada ahli direkodkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* COL 3: INFO PANEL */}
            <div className="lg:col-span-3 h-full">
              <div className="bg-[#1C2541] rounded-xl shadow-xl border border-gray-800 sticky top-24 overflow-hidden h-full flex flex-col">
                  <div className="bg-[#0B132B] p-6 border-b border-gray-700 flex flex-col items-center justify-center text-center shadow-md min-h-[120px] shrink-0 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9B458]/50 to-transparent"></div>
                      <span className="text-white text-[16px] font-bold font-['Century_Gothic'] uppercase tracking-wider mb-1">TUGAS & FUNGSI</span>
                      <h3 className="text-[#C9B458] font-bold text-[16px] leading-snug font-['Century_Gothic'] uppercase tracking-wider px-4">
                          {committees.find(c => c.id === activeCommitteeId)?.name || "Pilih Jawatankuasa"}
                      </h3>
                      
                      {canEdit && (
                        <button 
                          onClick={() => { 
                            if (!isEditingDesc) setTempDesc(description); 
                            setIsEditingDesc(!isEditingDesc); 
                          }} 
                          className="absolute top-3 right-3 text-[10px] text-gray-600 hover:text-[#C9B458] transition-colors"
                          title={isEditingDesc ? 'Batal' : 'Edit Fungsi'}
                        >
                           ✏️
                        </button>
                     )}
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="min-h-[150px]">
                        {isEditingDesc ? (
                        <div className="space-y-4 fade-in">
                            <textarea 
                                value={tempDesc}
                                onChange={(e) => setTempDesc(e.target.value)}
                                className="w-full bg-[#0B132B] border border-[#C9B458] rounded-lg p-3 text-[13px] text-white h-48 focus:outline-none focus:ring-1 focus:ring-[#C9B458] leading-[1.3]"
                                placeholder={`Masukkan fungsi untuk ${committees.find(c => c.id === activeCommitteeId)?.name}...`}
                            />
                            {canEdit && (
                                <button 
                                    onClick={saveDescription} 
                                    className="w-full bg-[#C9B458] text-[#0B132B] py-2 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-colors"
                                >
                                    Simpan Maklumat
                                </button>
                            )}
                        </div>
                        ) : (
                        <p className="text-gray-200 text-[13px] leading-[1.3] whitespace-pre-line text-left font-normal font-inter">
                            {description || "Tiada maklumat fungsi ditetapkan."}
                        </p>
                        )}
                    </div>
                  </div>
              </div>
           </div>

        </div>
      ) : (
        // --- TAKWIM VIEW LAYOUT ---
        <div className="grid grid-cols-1 gap-6">
             <div className="flex flex-wrap gap-2 mb-2">
                <button
                    onClick={() => setTakwimView('list')}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                      ${takwimView === 'list' 
                        ? 'bg-[#3A506B] text-white shadow-md' 
                        : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                >
                    📋 Senarai Aktiviti
                </button>
                
                {/* Specific tabs for Kokurikulum */}
                {unit === 'Kokurikulum' && (
                    <>
                        <button
                            onClick={() => setTakwimView('koko_weekly')}
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                            ${takwimView === 'koko_weekly' 
                                ? 'bg-[#3A506B] text-white shadow-md' 
                                : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                        >
                            🗓️ Perjumpaan Mingguan
                        </button>
                        <button
                            onClick={() => setTakwimView('koko_monthly')}
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                            ${takwimView === 'koko_monthly' 
                                ? 'bg-[#3A506B] text-white shadow-md' 
                                : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                        >
                            📢 Perhimpunan Bulanan
                        </button>
                    </>
                )}

                {/* Specific tabs for Kurikulum */}
                {unit === 'Kurikulum' && (
                    <>
                        <button
                            onClick={() => setTakwimView('exam_schedule')}
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                            ${takwimView === 'exam_schedule' 
                                ? 'bg-[#3A506B] text-white shadow-md' 
                                : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                        >
                            📝 Takwim Peperiksaan
                        </button>
                        <button
                            onClick={() => setTakwimView('hip_schedule')}
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                            ${takwimView === 'hip_schedule' 
                                ? 'bg-[#3A506B] text-white shadow-md' 
                                : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                        >
                            🗣️ Takwim HIP
                        </button>
                    </>
                )}

                {/* Specific tabs for Hal Ehwal Murid */}
                {unit === 'Hal Ehwal Murid' && (
                    <button
                        onClick={() => setTakwimView('sumur_schedule')}
                        className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                        ${takwimView === 'sumur_schedule' 
                            ? 'bg-[#3A506B] text-white shadow-md' 
                            : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                    >
                        🕌 Takwim SUMUR
                    </button>
                )}

                <button
                    onClick={() => setTakwimView('annual')}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all
                      ${takwimView === 'annual' 
                        ? 'bg-[#3A506B] text-white shadow-md' 
                        : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
                >
                    🗓️ Takwim Tahunan
                </button>
            </div>

            {/* Annual View */}
            {takwimView === 'annual' && (
              <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
                  <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex items-center justify-between">
                     <h3 className="text-lg font-bold text-[#C9B458] font-montserrat uppercase">
                       PERANCANGAN TAHUNAN: {unit} ({year})
                     </h3>
                  </div>
                  
                  <div className="overflow-x-auto w-full custom-scrollbar">
                      <table className="w-full min-w-[1000px] border-collapse text-xs border border-gray-800">
                          <thead>
                              <tr>
                                  <th className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm w-12 border border-[#0B132B] sticky left-0 z-20">HB</th>
                                  {months.map(m => (
                                      <th key={m} className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm border border-[#0B132B] min-w-[80px]">
                                          {m}
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                  <tr key={date}>
                                      <td className="bg-[#0B132B] text-[#C9B458] font-bold text-center border border-gray-700 sticky left-0 z-10 p-1">
                                          {date}
                                      </td>
                                      {months.map((_, monthIdx) => {
                                          const dayLetter = getDayLetter(monthIdx, date);
                                          if (!dayLetter) return <td key={monthIdx} className="bg-black/40 border border-gray-800"></td>;
                                          const dateStr = `${(date).toString().padStart(2, '0')}-${(monthIdx + 1).toString().padStart(2, '0')}-${year}`;
                                          
                                          // Find ALL events for this day
                                          const eventsOnDay = items.filter(item => item.date === dateStr);

                                          return (
                                              <td 
                                                key={monthIdx} 
                                                className={`bg-[#1C2541] border border-gray-700 relative h-12 p-1 align-middle hover:bg-[#253252] transition-colors ${canEdit ? 'cursor-pointer' : ''}`}
                                                onClick={() => { if (canEdit) eventsOnDay.length > 0 ? handleOpenModal(eventsOnDay[0]) : handleOpenModal({ date: dateStr }); }}
                                              >
                                                  <span className="absolute top-0.5 right-1 text-[8px] text-gray-500 font-mono">{dayLetter}</span>
                                                  {eventsOnDay.map((event, idx) => (
                                                      <div key={idx} className={`w-full rounded flex items-center justify-center text-[9px] font-bold text-center leading-tight px-1 shadow-sm mb-1 ${getStatusColor(event.status)}`} title={event.event}>
                                                          {event.event.length > 15 ? event.event.substring(0, 15) + '...' : event.event}
                                                      </div>
                                                  ))}
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
            )}

            {/* List View */}
            {takwimView === 'list' && (
                <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
                  <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col gap-2">
                     <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">
                        <span className="text-[#C9B458]">📋</span> Senarai Aktiviti
                     </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                          <th className="px-6 py-4">Nama Program / Aktiviti</th>
                          <th className="px-6 py-4">Tarikh Pelaksanaan</th>
                          <th className="px-6 py-4">Status</th>
                          {(canEdit || canDelete) && <th className="px-6 py-4 text-right">Tindakan</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                              <td className="px-6 py-4 font-medium text-white">{item.event}</td>
                              <td className="px-6 py-4 text-gray-300">{item.date}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                  ${item.status === 'Selesai' ? 'bg-green-900/50 text-green-400' : 
                                    item.status === 'Dalam Perancangan' ? 'bg-blue-900/50 text-blue-400' :
                                    'bg-yellow-900/30 text-yellow-500'}
                                `}>
                                  {item.status}
                                </span>
                              </td>
                              {(canEdit || canDelete) && (
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {canEdit && <button onClick={() => handleOpenModal(item)} className="p-2 bg-[#3A506B] text-white rounded" title="Edit">✏️</button>}
                                    {canDelete && <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/50 text-red-200 rounded" title="Hapus">🗑️</button>}
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={(canEdit || canDelete) ? 4 : 3} className="px-6 py-12 text-center text-gray-500 italic">
                              Tiada aktiviti direkodkan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

            {/* Koko Weekly Meeting View */}
            {takwimView === 'koko_weekly' && unit === 'Kokurikulum' && renderPerjumpaanMingguan()}

            {/* Koko Monthly Assembly View */}
            {takwimView === 'koko_monthly' && unit === 'Kokurikulum' && renderPerhimpunanBulanan()}

            {/* Takwim Peperiksaan View */}
            {takwimView === 'exam_schedule' && unit === 'Kurikulum' && renderTakwimPeperiksaan()}

            {/* Takwim HIP View */}
            {takwimView === 'hip_schedule' && unit === 'Kurikulum' && renderTakwimHip()}

            {/* Takwim SUMUR View */}
            {takwimView === 'sumur_schedule' && unit === 'Hal Ehwal Murid' && renderTakwimSumur()}
        </div>
      )}

      {/* --- ADD / EDIT MEMBER MODAL --- */}
      {isModalOpen && (canEdit || canSave) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
          <div className="bg-[#1C2541] w-full max-w-lg p-8 rounded-xl shadow-2xl border border-[#C9B458]">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-4">
              {editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly' 
                ? 'Kemaskini Tajuk' 
                : editingId ? 'Kemaskini Rekod' : 'Tambah Rekod Baru'
              }
            </h3>
            
            <form onSubmit={handleSave} className="space-y-5">
               {/* Title Editing Mode */}
               {(editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly') && (
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

               {/* Koko Weekly Editing Mode */}
               {editingKokoType === 'weekly' && (
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

               {/* Koko Monthly Editing Mode */}
               {editingKokoType === 'monthly' && (
                   <>
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

               {/* Exam Week Editing Mode */}
               {editingKokoType === 'exam_week' && (
                   <>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Minggu (M)</label>
                               <input 
                                   type="text" 
                                   value={formData.week}
                                   onChange={(e) => setFormData({...formData, week: e.target.value})}
                                   className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"
                               />
                           </div>
                           <div>
                               <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label>
                               <input 
                                   type="text" 
                                   value={formData.date}
                                   onChange={(e) => setFormData({...formData, date: e.target.value})}
                                   className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"
                               />
                           </div>
                       </div>
                       
                       {examWeeks.find(s => s.id === editingId)?.isHoliday ? (
                           <div>
                               <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Keterangan Cuti</label>
                               <input 
                                   type="text" 
                                   value={formData.dalaman} 
                                   onChange={e => setFormData({...formData, dalaman: e.target.value})} 
                                   className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"
                               />
                           </div>
                       ) : (
                           <>
                               <div>
                                   <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan Dalaman</label>
                                   <textarea 
                                       value={formData.dalaman}
                                       onChange={(e) => setFormData({...formData, dalaman: e.target.value})}
                                       className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20"
                                   />
                               </div>
                               <div>
                                   <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan JAJ</label>
                                   <textarea 
                                       value={formData.jaj}
                                       onChange={(e) => setFormData({...formData, jaj: e.target.value})}
                                       className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20"
                                   />
                               </div>
                               <div>
                                   <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan Awam</label>
                                   <textarea 
                                       value={formData.awam}
                                       onChange={(e) => setFormData({...formData, awam: e.target.value})}
                                       className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20"
                                   />
                               </div>
                           </>
                       )}
                   </>
               )}

               {/* Sumur & HIP Editing Mode (Shared) */}
               {(editingKokoType === 'sumur' || editingKokoType === 'hip') && (
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
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Program</label>
                           <input 
                               required
                               type="text" 
                               value={formData.program}
                               onChange={(e) => setFormData({...formData, program: e.target.value})}
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"
                               placeholder="Contoh: Modul Budi Bahasa / English Assembly"
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Guru Bertugas</label>
                           <input 
                               required
                               type="text" 
                               value={formData.teacher}
                               onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"
                               placeholder="Nama Guru"
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label>
                           <textarea 
                               value={formData.activity}
                               onChange={(e) => setFormData({...formData, activity: e.target.value})}
                               className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-24"
                               placeholder="Ringkasan aktiviti..."
                           />
                       </div>
                   </>
               )}

               {/* Default Jawatankuasa/Generic Takwim Editing Mode */}
               {!editingKokoType && type === 'Jawatankuasa' && (
                <>
                  <div className="bg-[#0B132B] p-3 rounded border border-gray-700 mb-4 text-sm text-gray-400">
                    Menambah ahli ke: <span className="text-[#C9B458] font-bold block mt-1">{committees.find(c => c.id === activeCommitteeId)?.name}</span>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peranan</label>
                    <input 
                      required
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Contoh: Pengerusi, Setiausaha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Jawatan Hakiki</label>
                    <input 
                      required
                      type="text" 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Contoh: Pengetua, GPK HEM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Guru</label>
                    <input 
                      required
                      type="text" 
                      value={formData.teacherName}
                      onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Nama penuh guru"
                    />
                  </div>
                </>
              )}
              
              {!editingKokoType && type !== 'Jawatankuasa' && (
                <>
                   <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Program / Aktiviti</label>
                    <input 
                      required
                      type="text" 
                      value={formData.event}
                      onChange={(e) => setFormData({...formData, event: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Masukkan nama program"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label>
                    <div className="relative group">
                      <input 
                        required
                        type="date" 
                        value={formatDateForInput(formData.date)}
                        onChange={handleDateChange}
                        className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all shadow-sm
                        [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Status</label>
                    <div className="relative">
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all appearance-none"
                      >
                        <option value="Akan Datang">Akan Datang</option>
                        <option value="Dalam Perancangan">Dalam Perancangan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5"
                >
                  {editingId || (editingKokoType && (editingKokoType.startsWith('title') || editingKokoType === 'sumur' || editingKokoType === 'hip' || editingKokoType === 'weekly' || editingKokoType === 'monthly')) ? 'Simpan Perubahan' : 'Tambah Rekod'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD COMMITTEE MODAL --- */}
      {isAddCommitteeModalOpen && isSystemAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
          <div className="bg-[#1C2541] w-full max-w-sm p-6 rounded-xl shadow-2xl border border-[#C9B458]">
            <h3 className="text-lg font-bold text-white mb-4">Tambah Jawatankuasa</h3>
            <form onSubmit={handleAddCommittee}>
                <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Jawatankuasa</label>
                <input 
                    autoFocus
                    required
                    type="text" 
                    value={newCommitteeName}
                    onChange={(e) => setNewCommitteeName(e.target.value)}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] mb-4"
                    placeholder="Contoh: JK Kewangan"
                />
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsAddCommitteeModalOpen(false)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-lg font-bold hover:bg-yellow-500"
                    >
                        Tambah
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT COMMITTEE NAME MODAL --- */}
      {isEditCommitteeModalOpen && isSystemAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
          <div className="bg-[#1C2541] w-full max-w-sm p-6 rounded-xl shadow-2xl border border-[#C9B458]">
            <h3 className="text-lg font-bold text-white mb-4">Edit Nama Jawatankuasa</h3>
            <form onSubmit={handleEditCommitteeName}>
                <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Jawatankuasa</label>
                <input 
                    autoFocus
                    required
                    type="text" 
                    value={newCommitteeName}
                    onChange={(e) => setNewCommitteeName(e.target.value)}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] mb-4"
                />
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsEditCommitteeModalOpen(false)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-lg font-bold hover:bg-yellow-500"
                    >
                        Simpan
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
