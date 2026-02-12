
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface JadualModuleProps {
  type: string;
}

interface ClassTeacher {
  id: number;
  form: string;
  class: string;
  teacher: string;
}

interface Coordinator {
  id: number;
  form: string;
  name: string;
}

interface MonitoringItem {
  code: string;
  name: string;
}

interface MonitoringGroup {
  id: number;
  monitor: string;
  position: string;
  items: MonitoringItem[];
}

interface PersonalScheduleSlot {
  id: string;
  teacher: string;
  day: string;
  time: string;
  subject: string;
  className: string;
  color: string;
}

// Interface for Class Schedule Slot (New)
interface ClassScheduleSlot {
  id: string;
  className: string; // The class identifier
  day: string;
  time: string;
  subject: string;
  teacher: string; // Teacher name teaching this slot
  color: string;
}

// Initial Data for Guru Kelas
const INITIAL_CLASS_TEACHERS: ClassTeacher[] = [
  { id: 1, form: '1', class: '1 Al-Hanafi', teacher: 'Cikgu A' },
  { id: 2, form: '1', class: '1 Al-Syafie', teacher: 'Cikgu B' },
  { id: 3, form: '1', class: '1 Al-Maliki', teacher: 'Cikgu C' },
  { id: 4, form: '2', class: '2 Al-Hanafi', teacher: 'Cikgu D' },
  { id: 5, form: '2', class: '2 Al-Syafie', teacher: 'Cikgu E' },
  { id: 6, form: '2', class: '2 Al-Maliki', teacher: 'Cikgu F' },
  { id: 7, form: '3', class: '3 Al-Hanafi', teacher: 'Cikgu G' },
  { id: 8, form: '3', class: '3 Al-Syafie', teacher: 'Cikgu H' },
  { id: 9, form: '3', class: '3 Al-Maliki', teacher: 'Cikgu I' },
  { id: 10, form: '4', class: '4 Al-Hanafi', teacher: 'Cikgu J' },
  { id: 11, form: '4', class: '4 Al-Syafie', teacher: 'Cikgu K' },
  { id: 12, form: '5', class: '5 Al-Hanafi', teacher: 'Cikgu L' },
  { id: 13, form: '5', class: '5 Al-Syafie', teacher: 'Cikgu M' },
];

const INITIAL_COORDINATORS: Coordinator[] = [
  { id: 1, form: 'Tingkatan 1', name: 'Penyelaras T1' },
  { id: 2, form: 'Tingkatan 2', name: 'Penyelaras T2' },
  { id: 3, form: 'Tingkatan 3', name: 'Penyelaras T3' },
  { id: 4, form: 'Tingkatan 4', name: 'Penyelaras T4' },
  { id: 5, form: 'Tingkatan 5', name: 'Penyelaras T5' },
];

const INITIAL_MONITORING_LIST: MonitoringGroup[] = [
  {
    id: 1,
    monitor: 'ZULKEFFLE BIN MUHAMMAD',
    position: 'PENGETUA',
    items: [
        { code: '1.1', name: 'Noratikah binti Abd. Kadir' },
        { code: '1.2', name: 'Shaharer bin Hj Husain' },
        { code: '1.3', name: 'Zulkifli bin Md Aspan' },
    ]
  },
  {
    id: 2,
    monitor: 'NORATIKAH BINTI ABD. KADIR',
    position: 'GPK PENTADBIRAN',
    items: [
        { code: '2.1', name: 'Noorlela binti Zainudin' },
        { code: '2.2', name: 'Nor Azean binti Ismail' },
        { code: '2.3', name: 'Saemah binti Supandi' },
    ]
  },
  {
    id: 3,
    monitor: 'SHAHARER BIN HJ HUSAIN',
    position: 'GPK HAL EHWAL MURID',
    items: [
        { code: '3.1', name: 'Rosmawati @ Rohayati binti Hussin' },
        { code: '3.2', name: 'Salman bin A Rahman' },
        { code: '3.3', name: 'Muhammad Hafiz bin Jalil' },
    ]
  },
  {
    id: 4,
    monitor: 'ZULKIFLI BIN MD ASPAN',
    position: 'GPK KOKURIKULUM',
    items: [
        { code: '4.1', name: 'Mazuin binti Mat' },
        { code: '4.2', name: 'Mohd Nur bin Ahmad' },
        { code: '4.3', name: 'Nooraind binti Ali' },
        { code: '4.4', name: 'Zahrah Khairiah Nasution binti Saleh' },
    ]
  },
  {
    id: 5,
    monitor: 'SAEMAH BINTI SUPANDI',
    position: 'GKMP AGAMA',
    items: [
        { code: '5.1', name: 'Annur Ayuni binti Mohamed' },
        { code: '5.2', name: 'Masyitah binti Razali' },
        { code: '5.3', name: 'Mohamad Sukri bin Ali' },
        { code: '5.4', name: 'Nor Hidayah binti Mahadun' },
    ]
  },
  {
    id: 6,
    monitor: 'NOR AZEAN BINTI ISMAIL',
    position: 'GKMP DINI',
    items: [
        { code: '6.1', name: 'Norliyana binti Mhd. Amin' },
        { code: '6.2', name: 'Siti Aminah binti Mohamed' },
        { code: '6.3', name: 'Zarith Najiha binti Jamal' },
    ]
  },
  {
    id: 7,
    monitor: 'ROSMAWATI @ ROHAYATI BINTI HUSSIN',
    position: 'GKMP BAHASA',
    items: [
        { code: '7.1', name: 'Mohamad Nasreen Hakim bin Che Mohamed' },
        { code: '7.2', name: 'Nor Ain binti Mohamed Jori' },
        { code: '7.3', name: 'Siti Nurul Liza binti Sidin' },
    ]
  },
  {
    id: 8,
    monitor: 'ZAHRAH KHAIRIAH NASUTION BINTI SALEH',
    position: 'GKMP SAINS & MATEMATIK',
    items: [
        { code: '8.1', name: 'Liyana binti Iskandar' },
        { code: '8.2', name: 'Nik Noorizati binti Ab Kahar' },
        { code: '8.3', name: 'Norashidah binti A Wahab' },
    ]
  },
  {
    id: 9,
    monitor: 'NOORAIND BINTI ALI',
    position: 'GKMP KEMANUSIAAN',
    items: [
        { code: '9.1', name: 'Mohd Nor bin Salikin' },
        { code: '9.2', name: 'Nurul Izzati binti Roslin' },
        { code: '9.3', name: 'Syahidatun Najihah binti Aziz' },
    ]
  },
  {
    id: 10,
    monitor: 'MAZUIN BINTI MAT',
    position: 'GKMP TEKNIK & VOKASIONAL',
    items: [
        { code: '10.1', name: "Ahmad Fikruddin bin Ahmad Raza'i" },
        { code: '10.2', name: 'Nurul Syafiqah binti Husin' },
        { code: '10.3', name: 'Nuurul Amira binti Razak' },
        { code: '10.4', name: 'Mohammad Firros bin Rosool Gani' },
    ]
  },
];

// Mock Lists for Selectors - UPDATED WITH SHORT NAMES
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

// FULL NAME LIST FOR JADUAL PERSENDIRIAN
const TEACHER_FULL_NAMES = [
    "ZULKEFFLE BIN MUHAMMAD",
    "NORATIKAH ABD. KADIR",
    "SHAHARER BIN HJ HUSAIN",
    "ZULKIFLI BIN MD ASPAN",
    "ROSMAWATI @ ROHAYATI BINTI HUSSIN",
    "ZAHRAH KHAIRIAH NASUTION BINTI SALEH",
    "MAZUIN BINTI MAT",
    "NOORAIND BINTI ALI",
    "SAEMAH BINTI SUPANDI",
    "NOR AZEAN BINTI ISMAIL",
    "AHMAD FIKRUDDIN BIN AHMAD RAZA'I",
    "MOHAMMAD FIRROS BIN ROSOOL GANI",
    "LIYANA BINTI ISKANDAR",
    "MOHAMAD NASREEN HAKIM BIN CHE MOHAMED",
    "NIK NOORIZATI BINTI AB KAHAR",
    "NORASHIDAH BINTI A WAHAB",
    "NOR AIN BINTI MOHAMED JORI",
    "NURUL IZZATI BINTI ROSLIN",
    "NURUL SYAFIQAH BINTI HUSIN",
    "SITI NURUL LIZA BINTI SIDIN",
    "MUHAMMAD HAFIZ BIN JALIL",
    "NUURUL AMIRA BINTI RAZAK",
    "NOORLELA BINTI ZAINUDIN",
    "ANNUR AYUNI BINTI MOHAMED",
    "SALMAN BIN A RAHMAN",
    "MOHD NUR BIN AHMAD",
    "NOR HIDAYAH BINTI MAHADUN",
    "MASYITAH BINTI RAZALI",
    "MOHAMAD SUKRI BIN ALI",
    "MOHD NOR BIN SALIKIN",
    "NORLIYANA BINTI MHD. AMIN",
    "SITI AMINAH BINTI MOHAMED",
    "SYAHIDATUN NAJIHAH BINTI AZIZ",
    "ZARITH NAJIHA BINTI JAMAL"
];

const CLASS_LIST = [
    "1 Al-Hanafi", "1 Al-Syafie", "1 Al-Maliki",
    "2 Al-Hanafi", "2 Al-Syafie", "2 Al-Maliki",
    "3 Al-Hanafi", "3 Al-Syafie", "3 Al-Maliki",
    "4 Al-Hanafi", "4 Al-Syafie",
    "5 Al-Hanafi", "5 Al-Syafie"
];

// --- UPDATED SUBJECT LIST AS REQUESTED ---
const PERSENDIRIAN_SUBJECTS = [
  'BM', 'BI', 'MAT', 'SCN', 'SEJ', 'PNG', 'PSV', 'PJPK', 'GEO',
  'SYA', 'USL', 'LAM', 'MAN', 'ADB', 'DATA', 'PPPSS', 'OB',
  'GMLM', 'KOKO', 'SUKAN/PERMAINAN', 'PER/UB/KELAB', 'SOLAT JUMAAT'
];

const PERSENDIRIAN_CLASSES = [
  '1H', '1S', '1M',
  '2H', '2S', '2M',
  '3H', '3S', '3M',
  '4H', '4S',
  '5H', '5S'
];

const PERSENDIRIAN_COLORS = [
    { value: 'bg-blue-100 text-blue-900 border-blue-200', label: 'Biru (Teknik Vokasional)' },
    { value: 'bg-orange-100 text-orange-900 border-orange-200', label: 'Oren (Mate & Sains)' },
    { value: 'bg-yellow-100 text-yellow-900 border-yellow-200', label: 'Kuning (Kemanusiaan)' },
    { value: 'bg-green-100 text-green-900 border-green-200', label: 'Hijau (Agama)' },
    { value: 'bg-red-100 text-red-900 border-red-200', label: 'Merah (Sukan/Koko)' },
    { value: 'bg-purple-100 text-purple-900 border-purple-200', label: 'Ungu (Bahasa)' },
    { value: 'bg-gray-200 text-gray-700 border-gray-300', label: 'Kelabu (Rehat)' },
];

// Timetable Structure
const DAYS = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS'];
const PERSENDIRIAN_DAYS = ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT'];

// New Expanded Periods for Jadual Persendirian & Jadual Kelas (7.30 - 5.00)
const PERSENDIRIAN_PERIODS = [
  '7.30 - 8.00', '8.00 - 8.30', '8.30 - 9.00', '9.00 - 9.30', '9.30 - 10.00',
  '10.00 - 10.30', '10.30 - 11.00', '11.00 - 11.30', '11.30 - 12.00',
  '12.00 - 12.30', '12.30 - 1.00', '1.00 - 1.30', '1.30 - 2.00',
  '2.00 - 2.30', '2.30 - 3.00', '3.00 - 3.30', '3.30 - 4.00',
  '4.00 - 4.30', '4.30 - 5.00'
];

// Helper Functions for Name Mapping
const getShortName = (fullName: string) => {
    const index = TEACHER_FULL_NAMES.indexOf(fullName);
    return index !== -1 ? TEACHER_LIST[index] : fullName;
}

export const JadualModule: React.FC<JadualModuleProps> = ({ type }) => {
  const { 
    user, showToast, checkPermission, 
    speechSchedule, updateSpeechSchedule, 
    teacherGroups, updateTeacherGroups 
  } = useApp();
  const isSuperAdmin = user?.role === 'adminsistem';
  
  // Permission check based on type
  const canEdit = checkPermission(
    type === 'Guru Kelas' ? 'canUpdateJadualGuruKelas' : 
    type === 'Jadual Persendirian' ? 'canUpdateJadualPersendirian' :
    type === 'Jadual Kelas' ? 'canUpdateJadualKelas' :
    type === 'Jadual Berucap' ? 'canUpdateJadualBerucap' :
    type === 'Jadual Pemantauan' ? 'canUpdateJadualPemantauan' :
    'canUpdateJadualGlobal'
  );

  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>(INITIAL_CLASS_TEACHERS);
  const [coordinators, setCoordinators] = useState<Coordinator[]>(INITIAL_COORDINATORS);
  const [monitoringList, setMonitoringList] = useState<MonitoringGroup[]>(INITIAL_MONITORING_LIST);
  
  // States for other views
  // Initialize with Full Name for Persendirian View
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHER_FULL_NAMES[0]);
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [personalSchedule, setPersonalSchedule] = useState<PersonalScheduleSlot[]>([]);
  const [classSchedule, setClassSchedule] = useState<ClassScheduleSlot[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'classTeacher' | 'coordinator' | 'addClass' | 'addCoordinator' | 'monitoring' | 'scheduleSlot' | 'relief' | 'speech' | 'editGroup' | 'addGroup' | 'addTeacher' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // --- EDITABLE TITLES STATE ---
  const [sectionTitles, setSectionTitles] = useState({
    guruKelas_list: 'Senarai Guru Kelas',
    guruKelas_coord: 'Penyelaras Tingkatan',
    berucap_table: 'Kumpulan Bertugas dan Guru Berucap',
    berucap_list: 'Senarai Kumpulan',
    persendirian_select: 'Pilih Guru',
    kelas_select: 'Pilih Kelas',
  });

  // Persistence
  useEffect(() => {
    const savedCT = localStorage.getItem('smaam_class_teachers');
    const savedCoord = localStorage.getItem('smaam_coordinators');
    const savedMonitor = localStorage.getItem('smaam_monitoring_list');
    const savedTitles = localStorage.getItem('smaam_jadual_titles');
    const savedPersonalSchedule = localStorage.getItem('smaam_personal_schedule');
    const savedClassSchedule = localStorage.getItem('smaam_class_schedule');

    if (savedCT) setClassTeachers(JSON.parse(savedCT));
    if (savedCoord) setCoordinators(JSON.parse(savedCoord));
    if (savedMonitor) setMonitoringList(JSON.parse(savedMonitor));
    if (savedPersonalSchedule) setPersonalSchedule(JSON.parse(savedPersonalSchedule));
    if (savedClassSchedule) setClassSchedule(JSON.parse(savedClassSchedule));
    if (savedTitles) {
        try { setSectionTitles(JSON.parse(savedTitles)); } catch {}
    }
  }, []);

  const saveToStorage = () => {
    localStorage.setItem('smaam_class_teachers', JSON.stringify(classTeachers));
    localStorage.setItem('smaam_coordinators', JSON.stringify(coordinators));
    localStorage.setItem('smaam_monitoring_list', JSON.stringify(monitoringList));
    localStorage.setItem('smaam_personal_schedule', JSON.stringify(personalSchedule));
    localStorage.setItem('smaam_class_schedule', JSON.stringify(classSchedule));
  };

  const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
  };

  // Helper for Group Color
  const getGroupColor = (groupName: string) => {
      const match = groupName.match(/\d+/);
      const num = match ? match[0] : '0';
      
      switch (num) {
          case '1': return 'bg-pink-600 border-pink-400 text-white shadow-pink-900/30';
          case '2': return 'bg-blue-600 border-blue-400 text-white shadow-blue-900/30';
          case '3': return 'bg-green-600 border-green-400 text-white shadow-green-900/30';
          case '4': return 'bg-yellow-600 border-yellow-400 text-white shadow-yellow-900/30';
          case '5': return 'bg-purple-600 border-purple-400 text-white shadow-purple-900/30';
          case '6': return 'bg-orange-600 border-orange-400 text-white shadow-orange-900/30';
          default: return 'bg-gray-600 border-gray-400 text-white';
      }
  };

  const handleEditTitle = (key: keyof typeof sectionTitles) => {
    const newVal = prompt("Ubah Tajuk:", sectionTitles[key]);
    if (newVal && newVal.trim() !== "") {
      const updated = { ...sectionTitles, [key]: newVal };
      setSectionTitles(updated);
      localStorage.setItem('smaam_jadual_titles', JSON.stringify(updated));
      showToast("Tajuk berjaya dikemaskini.");
    }
  };

  const EditableHeader = ({ tKey, className, children }: { tKey: keyof typeof sectionTitles, className: string, children?: React.ReactNode }) => (
    <div className="flex items-center gap-2 group">
      <h3 className={className}>
        {children}
        {sectionTitles[tKey]}
      </h3>
      {canEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleEditTitle(tKey); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-[#C9B458] text-xs"
          title="Edit Tajuk"
        >
          ✏️
        </button>
      )}
    </div>
  );

  const EditableLabel = ({ tKey, className }: { tKey: keyof typeof sectionTitles, className: string }) => (
    <div className="flex items-center gap-2 group mb-1">
       <h4 className={className}>{sectionTitles[tKey]}</h4>
       {canEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleEditTitle(tKey); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#C9B458] text-xs"
        >
          ✏️
        </button>
      )}
    </div>
  );

  const openEditModal = (mType: any, item: any) => {
    setModalType(mType);
    setEditingItem(item);
    if (item) {
        if (mType === 'monitoring') {
            setFormData({ 
                monitor: item.monitor,
                position: item.position,
                itemsStr: item.items.map((i: any) => `${i.code}|${i.name}`).join('\n') 
            });
        } else if (mType === 'editGroup') {
            setFormData({
                name: item.name,
                membersStr: item.members.join('\n')
            });
        } else if (mType === 'scheduleSlot') {
            // Check if existing item color exists in PERSENDIRIAN_COLORS, if not default to first
            let defaultColor = PERSENDIRIAN_COLORS[0].value;
            if (item.color) {
                // Try to find if item.color matches any value
                const match = PERSENDIRIAN_COLORS.find(c => c.value === item.color);
                if (match) defaultColor = match.value;
                // If not exact match (legacy data), maybe keep it or default. For now, trust item.color if set.
                else defaultColor = item.color;
            }

            setFormData({
                day: item.day,
                time: item.time,
                subject: item.subject || '',
                className: item.className || '',
                teacher: item.teacher || '', // Add teacher for class schedule editing
                color: defaultColor
            });
        } else {
            setFormData({ ...item });
        }
    } else {
        setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'classTeacher' || modalType === 'addClass') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form,
            class: formData.class,
            teacher: formData.teacher
        };
        if (editingItem) {
            setClassTeachers(classTeachers.map(ct => ct.id === payload.id ? payload : ct));
        } else {
            setClassTeachers([...classTeachers, payload]);
        }
        showToast("Data Guru Kelas disimpan.");
    } else if (modalType === 'coordinator' || modalType === 'addCoordinator') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form,
            name: formData.name
        };
        if (editingItem) {
            setCoordinators(coordinators.map(c => c.id === payload.id ? payload : c));
        } else {
            setCoordinators([...coordinators, payload]);
        }
        showToast("Data Penyelaras disimpan.");
    } else if (modalType === 'monitoring') {
        const items = formData.itemsStr ? formData.itemsStr.split('\n').map((line: string) => {
            const [code, name] = line.split('|');
            return { code: code?.trim(), name: name?.trim() };
        }).filter((i: any) => i.code && i.name) : [];

        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            monitor: formData.monitor,
            position: formData.position || 'PEMANTAU',
            items: items
        };
        
        if (editingItem) {
            setMonitoringList(monitoringList.map(m => m.id === payload.id ? payload : m));
        } else {
            setMonitoringList([...monitoringList, payload]);
        }
        showToast("Data Pemantauan disimpan.");
    } else if (modalType === 'speech') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            week: formData.week,
            date: formData.date,
            group: formData.group,
            speaker: formData.speaker,
            topic: formData.topic || '',
            civic: formData.civic || '',
            sumur: formData.sumur || ''
        };
        const newSchedule = editingItem 
            ? speechSchedule.map(s => s.id === payload.id ? payload : s)
            : [...speechSchedule, payload];
        
        updateSpeechSchedule(newSchedule);
        showToast("Jadual Berucap disimpan.");
    } else if (modalType === 'editGroup') {
        const members = formData.membersStr ? formData.membersStr.split('\n').filter((m: string) => m.trim() !== '') : [];
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            name: formData.name, 
            members: members
        };
        const newGroups = editingItem
            ? teacherGroups.map(g => g.id === payload.id ? payload : g)
            : [...teacherGroups, payload];
        updateTeacherGroups(newGroups);
        showToast("Kumpulan disimpan.");
    } else if (modalType === 'addGroup') {
         const members = formData.membersStr ? formData.membersStr.split('\n').filter((m: string) => m.trim() !== '') : [];
         const payload = {
            id: Date.now(),
            name: formData.name,
            members: members
         };
         updateTeacherGroups([...teacherGroups, payload]);
         showToast("Kumpulan baru ditambah.");
    } else if (modalType === 'scheduleSlot') {
        
        if (type === 'Jadual Kelas') {
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
            setClassSchedule([...filtered, payload]);
            showToast("Jadual kelas dikemaskini.");
        } else {
            // Jadual Persendirian
            // Use selectedTeacher which is Full Name in Persendirian View
            // But we must check against both Full and Short name to replace properly if exists
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
            setPersonalSchedule([...filtered, payload]);
            showToast("Slot jadual dikemaskini.");
        }
    }

    saveToStorage();
    setIsModalOpen(false);
  };

  const handleDeleteClassTeacher = (id: number) => {
      if (confirm("Padam data ini?")) {
          setClassTeachers(classTeachers.filter(ct => ct.id !== id));
          saveToStorage();
          showToast("Data dipadam.");
      }
  };

  const handleDeleteCoordinator = (id: number) => {
      if (confirm("Padam data ini?")) {
          setCoordinators(coordinators.filter(c => c.id !== id));
          saveToStorage();
          showToast("Data dipadam.");
      }
  };

  const handleDeleteMonitoring = (id: number) => {
      if (confirm("Padam kumpulan pemantauan ini?")) {
          setMonitoringList(monitoringList.filter(m => m.id !== id));
          saveToStorage();
          showToast("Kumpulan dipadam.");
      }
  };

  const handleDeleteSlot = () => {
      if (editingItem && editingItem.day && editingItem.time) {
          if (type === 'Jadual Kelas') {
              const filtered = classSchedule.filter(s => !(s.className === selectedClass && s.day === editingItem.day && s.time === editingItem.time));
              setClassSchedule(filtered);
          } else {
              const shortName = getShortName(selectedTeacher);
              const filtered = personalSchedule.filter(s => 
                  !((s.teacher === selectedTeacher || s.teacher === shortName) && s.day === editingItem.day && s.time === editingItem.time)
              );
              setPersonalSchedule(filtered);
          }
          saveToStorage();
          showToast("Slot jadual dipadam.");
          setIsModalOpen(false);
      }
  };

  const handleDeleteSpeech = (id: number) => {
      if(confirm("Padam slot ini?")) {
          updateSpeechSchedule(speechSchedule.filter(s => s.id !== id));
          showToast("Slot dipadam.");
      }
  };

  const handleDeleteGroup = (id: number) => {
      if(confirm("Padam kumpulan ini?")) {
          updateTeacherGroups(teacherGroups.filter(g => g.id !== id));
          showToast("Kumpulan dipadam.");
      }
  };

  // --- VIEWS ---

  const GuruKelasView = () => (
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SENARAI GURU KELAS */}
        <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 h-full">
                <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
                <EditableHeader tKey="guruKelas_list" className="text-xl font-bold text-white" />
                {canEdit && (
                    <button onClick={() => openEditModal('addClass', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah Kelas</button>
                )}
                </div>
                <div className="p-6 space-y-6">
                {[1, 2, 3, 4, 5].map(formLevel => (
                    <div key={formLevel} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                            <span className="bg-[#3A506B] text-white text-xs font-bold px-2 py-1 rounded">Tingkatan {formLevel}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {classTeachers.filter(t => t.form === formLevel.toString()).map((ct, idx) => (
                            <div key={ct.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0B132B]/50 p-3 rounded border border-gray-700/50 hover:bg-[#253252] hover:border-[#C9B458]/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/50 flex items-center justify-center font-bold text-xs shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <span className="font-mono text-white font-bold text-sm">{ct.class}</span>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="text-gray-300 text-sm font-medium">{ct.teacher}</span>
                                    {canEdit && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openEditModal('classTeacher', ct)}
                                                className={`${isSystemData(ct.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:text-white'}`}
                                            >
                                                {isSystemData(ct.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                            </button>
                                            {(!isSystemData(ct.id) || isSuperAdmin) && (
                                                <button 
                                                    onClick={() => handleDeleteClassTeacher(ct.id)}
                                                    className="text-red-500 hover:text-red-400"
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

        {/* RIGHT COLUMN: PENYELARAS TINGKATAN */}
        <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-[#1C2541] rounded-xl border-l-4 border-[#C9B458] p-6 shadow-[0_0_20px_rgba(201,180,88,0.15)] hover:shadow-[0_0_30px_rgba(201,180,88,0.25)] transition-shadow duration-500 sticky top-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <EditableHeader tKey="guruKelas_coord" className="text-lg font-bold text-white tracking-wide" />
                    {canEdit && (
                        <button onClick={() => openEditModal('addCoordinator', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded text-[10px] font-bold hover:bg-yellow-400">+ Tambah</button>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                {coordinators.map((coord) => (
                    <div key={coord.id} className="flex items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-lg border border-gray-700 group hover:border-[#C9B458] transition-colors shadow-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-[#3A506B] flex items-center justify-center font-bold text-[#C9B458] shrink-0 text-sm border border-[#C9B458]/30">
                                {coord.form.replace(/[^0-9]/g, '') || 'T'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-[#2DD4BF] uppercase tracking-widest font-bold truncate">{coord.form}</p>
                                <p className="font-semibold text-white text-xs truncate">{coord.name}</p>
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal('coordinator', coord)} 
                                    className={`${isSystemData(coord.id) && !isSuperAdmin ? 'text-gray-600' : 'text-gray-500 hover:text-[#C9B458]'}`}
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
        </div>

      </div>
    </div>
  );

  const JadualBerucapView = () => (
    <div className="fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT: JADUAL (Table) */}
        <div className="xl:col-span-8 bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700 bg-[#0B132B] relative flex justify-center items-center min-h-[60px]">
                <EditableHeader tKey="berucap_table" className="text-xl font-bold text-white text-center" />
                {canEdit && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <button onClick={() => openEditModal('speech', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah</button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#253252] text-[#C9B458] text-xs font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                            <th className="px-2 py-3 text-center w-12">Minggu</th>
                            <th className="px-2 py-3 w-24 text-center">Tarikh</th>
                            <th className="px-2 py-3 w-24 text-center">KUMPULAN BERTUGAS</th>
                            <th className="px-2 py-3 pl-4">Guru Berucap</th>
                            <th className="px-2 py-3">Tajuk / Tema</th>
                            {canEdit && <th className="px-2 py-3 text-center w-16">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-xs font-inter leading-relaxed">
                        {speechSchedule.map((item) => (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                <td className="px-2 py-3 text-center font-normal text-[#0B132B] bg-white border-r border-gray-200">{item.week}</td>
                                <td className="px-2 py-3 text-[#0B132B] font-mono text-center whitespace-nowrap bg-white border-r border-gray-200">{item.date}</td>
                                <td className="px-2 py-3 text-center bg-white border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border shadow-sm ${getGroupColor(item.group)}`}>
                                        {item.group.replace('KUMPULAN ', 'K')}
                                    </span>
                                </td>
                                <td className="px-2 py-3 pl-4 font-semibold text-[#0B132B] whitespace-nowrap bg-white border-r border-gray-200">{item.speaker}</td>
                                <td className="px-2 py-3 text-gray-800 bg-white border-r border-gray-200">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#0B132B] font-medium">{item.topic || '-'}</span>
                                        {item.civic && <span className="text-[9px] text-[#C9B458] uppercase tracking-wider border border-[#C9B458]/30 px-1 rounded w-fit">Sivik: {item.civic}</span>}
                                        {item.sumur && <span className="text-[9px] text-pink-400 uppercase tracking-wider border border-pink-400/30 px-1 rounded w-fit">Sumur: {item.sumur}</span>}
                                    </div>
                                </td>
                                {canEdit && (
                                    <td className="px-2 py-3 text-center">
                                        <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal('speech', item)} className="text-blue-400 hover:text-white" title="Edit">✏️</button>
                                            <button onClick={() => handleDeleteSpeech(item.id)} className="text-red-400 hover:text-white" title="Hapus">🗑️</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* RIGHT: KUMPULAN BERTUGAS (List) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-[#0B132B] p-4 rounded-xl border-l-4 border-[#C9B458] shadow-lg flex justify-between items-center">
                <div>
                    <EditableHeader tKey="berucap_list" className="text-lg font-bold text-white uppercase tracking-wide" />
                    <p className="text-xs text-gray-400">Anggota kumpulan bertugas mingguan.</p>
                </div>
                {canEdit && (
                    <button onClick={() => openEditModal('addGroup', null)} className="bg-[#C9B458] text-[#0B132B] px-2 py-1 rounded text-[10px] font-bold hover:bg-yellow-400">+</button>
                )}
            </div>
            
            <div className="space-y-4">
                {teacherGroups.map((group) => (
                    <div key={group.id} className={`bg-[#1C2541] rounded-xl border shadow-md hover:border-white transition-all group overflow-hidden ${getGroupColor(group.name).replace('text-white', '').replace('bg-', 'border-').split(' ')[1]}`}>
                        <div className={`px-4 py-2 border-b border-gray-700 flex justify-between items-center ${getGroupColor(group.name).split(' ')[0]} bg-opacity-20`}>
                            <h4 className={`font-bold text-sm ${getGroupColor(group.name).split(' ')[2]}`}>{group.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#0B132B] text-gray-400 px-2 py-0.5 rounded-full">{group.members.length} Ahli</span>
                                {canEdit && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal('editGroup', group)} className="text-xs text-blue-300 hover:text-white">✏️</button>
                                        <button onClick={() => handleDeleteGroup(group.id)} className="text-xs text-red-300 hover:text-white">🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul className="p-4 space-y-2">
                            {group.members.map((member, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                                    <span className={`w-1.5 h-1.5 rounded-full ${getGroupColor(group.name).split(' ')[0]}`}></span>
                                    {member}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const JadualPersendirianView = () => (
    <div className="fade-in space-y-6">
        {/* Selector Header - No Icon */}
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                    <EditableLabel tKey="persendirian_select" className="text-[#C9B458] font-bold uppercase tracking-wider text-sm" />
                    <select 
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm mt-1 outline-none focus:border-[#C9B458] min-w-[350px]"
                    >
                        {TEACHER_FULL_NAMES.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            {canEdit && (
                <button className="bg-[#0B132B] text-white border border-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#C9B458] hover:text-[#0B132B] transition-colors flex items-center gap-2">
                    <span>✏️</span> Kemaskini Jadual
                </button>
            )}
        </div>

        {/* Timetable Grid with New Time Format (30min intervals 7:30 - 5:00) */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300">
            <div className="w-full">
                <table className="w-full text-center border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-100 text-gray-900 text-[11px] uppercase font-medium tracking-wide">
                            <th className="p-0 border border-gray-400 w-28 relative h-24 overflow-hidden bg-[#1C2541]">
                                <div className="absolute inset-0 w-full h-full" style={{
                                     background: 'linear-gradient(to bottom left, transparent calc(50% - 0.5px), #C9B458 calc(50% - 0.5px), #C9B458 calc(50% + 0.5px), transparent calc(50% + 0.5px))'
                                }}></div>
                                <div className="absolute top-2 right-2 text-xs font-bold leading-none text-[#C9B458]">MASA</div>
                                <div className="absolute bottom-2 left-2 text-xs font-bold leading-none text-[#C9B458]">HARI</div>
                            </th>
                            {PERSENDIRIAN_PERIODS.map((p, i) => {
                                const parts = p.split(' - ');
                                return (
                                    <th key={i} className="p-1 border border-gray-400 font-medium leading-tight">
                                        <div className="flex flex-col gap-1 items-center justify-center h-full text-[11px]">
                                            <span>{parts[0]}</span>
                                            <span className="text-[9px] opacity-60">-</span>
                                            <span>{parts[1]}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-[11px] text-gray-800 font-semibold">
                        {PERSENDIRIAN_DAYS.map((day, dIdx) => (
                            <tr key={day} className="hover:bg-gray-50 transition-colors h-20">
                                <td className="p-1 border border-gray-400 bg-gray-200 text-gray-900 font-bold shadow-sm text-xs">
                                    {day}
                                </td>
                                {PERSENDIRIAN_PERIODS.map((p, pIdx) => {
                                    // Logic Rehat 10.30 - 11.00
                                    if (p === '10.30 - 11.00') {
                                        return (
                                            <td key={pIdx} className="p-0 border border-gray-400 bg-gray-300 align-middle">
                                                <div className="flex items-center justify-center h-full w-full">
                                                    <span className="text-gray-600 text-[10px] font-bold -rotate-90 whitespace-nowrap tracking-widest">REHAT</span>
                                                </div>
                                            </td>
                                        );
                                    }

                                    // Retrieve slot data for this teacher, day, and time
                                    // Match against Full Name (new) OR Short Name (old/compatibility)
                                    const shortName = getShortName(selectedTeacher);
                                    const slot = personalSchedule.find(s => (s.teacher === selectedTeacher || s.teacher === shortName) && s.day === day && s.time === p);
                                    
                                    return (
                                        <td 
                                            key={pIdx} 
                                            className={`p-0 border border-gray-400 h-full align-middle cursor-pointer hover:bg-gray-100 transition-colors ${slot ? slot.color.split(' ')[0] : ''}`}
                                            onClick={() => canEdit && openEditModal('scheduleSlot', { day, time: p, ...slot })}
                                        >
                                            {slot && (
                                                <div className={`flex flex-col items-center justify-center h-full w-full p-1 rounded ${slot.color}`}>
                                                    <span className="font-bold text-[10px] leading-tight break-words text-center">{slot.subject}</span>
                                                    {slot.className && (
                                                        <span className="text-[9px] mt-0.5 italic leading-tight opacity-90 break-words text-center">{slot.className}</span>
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
    </div>
  );

  const JadualKelasView = () => (
    <div className="fade-in space-y-6">
        {/* Selector Header - Updated: Removed Icons */}
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                    <EditableLabel tKey="kelas_select" className="text-[#2DD4BF] font-bold uppercase tracking-wider text-sm" />
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm mt-1 outline-none focus:border-[#2DD4BF] min-w-[200px]"
                    >
                        {CLASS_LIST.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            {canEdit && (
                <button className="bg-[#0B132B] text-white border border-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] transition-colors flex items-center gap-2">
                    <span>✏️</span> Kemaskini Jadual
                </button>
            )}
        </div>

        {/* Timetable Grid - Updated: Fixed width, Vertical Time, 30 min intervals */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300">
            <div className="w-full">
                <table className="w-full text-center border-collapse table-fixed">
                    <thead>
                        <tr className="bg-[#004e64] text-white text-xs font-normal tracking-wide uppercase">
                            <th className="p-1 border border-gray-600 bg-[#0B132B] w-24 font-bold">HARI/MASA</th>
                            {PERSENDIRIAN_PERIODS.map((p, i) => {
                                const parts = p.split(' - ');
                                return (
                                    <th key={i} className="p-1 border border-gray-600 h-16 align-middle font-normal">
                                        <div className="flex flex-col items-center justify-center leading-none text-[10px]">
                                            <span>{parts[0]}</span>
                                            <span className="my-0.5 opacity-70">-</span>
                                            <span>{parts[1]}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-800 font-normal">
                        {PERSENDIRIAN_DAYS.map((day, dIdx) => (
                            <tr key={day} className="hover:bg-gray-50 transition-colors h-16">
                                <td className="p-1 border border-gray-300 bg-[#1C2541] text-[#2DD4BF] font-medium shadow-md">
                                    {day}
                                </td>
                                {PERSENDIRIAN_PERIODS.map((p, pIdx) => {
                                    // Logic Rehat 10.30 - 11.00
                                    if (p === '10.30 - 11.00') {
                                        return (
                                            <td key={pIdx} className="bg-gray-300 border border-gray-300 text-gray-500 font-medium p-0">
                                                <div className="h-full w-full flex items-center justify-center -rotate-90">REHAT</div>
                                            </td>
                                        );
                                    }

                                    // Retrieve slot data for this class, day, and time
                                    const slot = classSchedule.find(s => s.className === selectedClass && s.day === day && s.time === p);

                                    return (
                                        <td 
                                            key={pIdx} 
                                            className={`p-0 border border-gray-300 h-full align-middle cursor-pointer hover:bg-gray-100 transition-colors ${slot ? slot.color.split(' ')[0] : ''}`}
                                            onClick={() => canEdit && openEditModal('scheduleSlot', { day, time: p, ...slot })}
                                        >
                                            {slot && (
                                                <div className={`flex flex-col items-center justify-center h-full w-full p-0.5 rounded ${slot.color}`}>
                                                    <span className="font-medium text-xs leading-tight text-center break-words">{slot.subject}</span>
                                                    {slot.teacher && (
                                                        <span className="text-[10px] mt-0.5 italic leading-tight opacity-90 text-center break-words">{slot.teacher}</span>
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
    </div>
  );

  const JadualPemantauanView = () => (
    <div className="space-y-6 fade-in">
        {/* ADD BUTTON SECTION */}
        {canEdit && (
            <div className="flex justify-end">
                <button 
                    onClick={() => openEditModal('monitoring', null)}
                    className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 shadow-lg flex items-center gap-2"
                >
                    <span>+</span> Tambah Kumpulan
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitoringList.map((group) => (
                <div key={group.id} className="bg-[#0B132B] rounded-xl border border-[#1e293b] shadow-lg overflow-hidden flex flex-col hover:border-[#C9B458] transition-all duration-300 group h-full">
                    {/* Header Section - Uniform Background, separated by line */}
                    <div className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white text-sm md:text-base uppercase leading-tight tracking-wide">{group.monitor}</h4>
                                <p className="text-[10px] md:text-xs text-[#C9B458] font-bold tracking-widest uppercase mt-1.5">{group.position}</p>
                            </div>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openEditModal('monitoring', group)} 
                                        className={`${isSystemData(group.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {isSystemData(group.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                    </button>
                                    {(!isSystemData(group.id) || isSuperAdmin) && (
                                        <button onClick={() => handleDeleteMonitoring(group.id)} className="text-gray-500 hover:text-red-500">
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className="h-px bg-gradient-to-r from-[#C9B458]/50 to-transparent mx-5"></div>

                    {/* Body Section - Brightened Background */}
                    <div className="p-5 pt-3 flex-1 bg-white/5">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-gray-400 font-bold uppercase tracking-wider">
                                    <th className="text-left py-2 w-16 text-[#C9B458]">BIL</th>
                                    <th className="text-left py-2 text-[#C9B458]">NAMA GURU</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300">
                                {group.items.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-700/50 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 font-mono text-white">{item.code}</td>
                                        <td className="py-2.5 font-medium">{item.name}</td>
                                    </tr>
                                ))}
                                {group.items.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="py-4 text-center text-gray-600 italic">Tiada senarai guru.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'Guru Kelas': return <GuruKelasView />;
      case 'Jadual Persendirian': return <JadualPersendirianView />;
      case 'Jadual Kelas': return <JadualKelasView />;
      case 'Jadual Berucap': return <JadualBerucapView />;
      case 'Jadual Pemantauan': return <JadualPemantauanView />;
      default: return <JadualPersendirianView />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      <div className="border-b border-gray-400 pb-4">
        {/* Removed Icon for Jadual Persendirian and Jadual Kelas */}
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          {type !== 'Jadual Pemantauan' && type !== 'Jadual Berucap' && type !== 'Jadual Persendirian' && type !== 'Jadual Kelas' && <span>📅</span>}
          {type === 'Jadual Persendirian' ? 'Pengurusan Jadual Waktu Persendirian' : `Pengurusan ${type}`}
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">
            {type === 'Guru Kelas' ? 'Senarai Guru Kelas dan Penyelaras Tingkatan.' : 
             type === 'Jadual Berucap' ? 'Jadual Guru Berucap dan Kumpulan Bertugas.' :
             type === 'Jadual Persendirian' ? 'Jadual waktu mengajar individu.' :
             type === 'Jadual Kelas' ? 'Jadual waktu mengikut kelas.' :
             type === 'Jadual Pemantauan' ? 'Jadual pencerapan guru dan pemantauan.' :
             `Paparan dan pengurusan ${type.toLowerCase()}.`}
        </p>
      </div>

      {renderContent()}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-full overflow-y-auto scrollbar-thin">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">{editingItem ? 'Kemaskini' : 'Tambah'} {modalType?.replace(/([A-Z])/g, ' $1')}</h3>
            <form onSubmit={handleSave} className="space-y-4">
               {modalType === 'relief' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Masa</label><input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kelas</label><input type="text" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Tidak Hadir</label><select value={formData.absent} onChange={e => setFormData({...formData, absent: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Ganti</label><select value={formData.relief} onChange={e => setFormData({...formData, relief: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {(modalType === 'coordinator' || modalType === 'classTeacher') && (
                 <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru</label><select value={modalType === 'coordinator' ? formData.name : formData.teacher} onChange={e => setFormData({...formData, [modalType === 'coordinator' ? 'name' : 'teacher']: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm">{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
               )}
               {modalType === 'addCoordinator' && (
                 <>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tajuk / Penyelaras</label><input type="text" value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Contoh: Penyelaras Tingkatan 6" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru</label><select value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {modalType === 'addClass' && (
                 <>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Kelas</label><input type="text" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Cth: 4 Al-Maliki" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Kelas</label><select value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </>
               )}
               {modalType === 'speech' && (
                 <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Minggu</label><input type="text" value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kumpulan</label><select value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Kumpulan</option>{teacherGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Berucap</label><select value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
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
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Jawatan</label><input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Contoh: PENGETUA" /></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Senarai Guru (Format: Kod|Nama)</label><textarea value={formData.itemsStr} onChange={e => setFormData({...formData, itemsStr: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-xs h-32 font-mono" /></div>
                 </>
               )}
               {modalType === 'scheduleSlot' && (
                 <>
                    <div className="text-xs text-gray-400 mb-2">Slot: <span className="text-white font-bold">{formData.day} @ {formData.time}</span></div>
                    
                    {type === 'Jadual Kelas' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Kosong</option>{PERSENDIRIAN_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru</label><select value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Tiada</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Subjek</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Kosong</option>{PERSENDIRIAN_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                            <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kelas</label><select value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Tiada</option>{PERSENDIRIAN_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        </div>
                    )}
                    
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Warna Label</label><select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm">{PERSENDIRIAN_COLORS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                 </>
               )}
               {(modalType === 'editGroup' || modalType === 'addGroup') && (
                   <>
                      {modalType === 'addGroup' && (
                          <div>
                              <label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Kumpulan</label>
                              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" />
                          </div>
                      )}
                      {modalType === 'editGroup' && <div className="text-xs text-gray-400 mb-2">Ahli Kumpulan: <span className="text-[#C9B458] font-bold">{formData.name}</span></div>}
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
                       <button type="button" onClick={handleDeleteSlot} className="flex-1 py-2 bg-red-900/60 text-red-200 border border-red-700 rounded hover:bg-red-800">Padam Slot</button>
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
