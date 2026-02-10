
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, UserRole, Announcement, Program, SchoolProfile, 
  RolePermission, UserCredential, Permissions, SiteConfig,
  TeacherGroup, SpeechScheduleItem, KokoActivity, SumurEvent, HipEvent, KokoAssemblyEvent
} from '../types';

interface AppContextType {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  permissions: Permissions;
  rolePermissions: Record<string, RolePermission>;
  updateRolePermissions: (role: string, perms: RolePermission) => void;
  userCredentials: Record<string, UserCredential>;
  updateUserCredentials: (role: string, creds: UserCredential) => void;
  announcements: Announcement[];
  addAnnouncement: (a: Announcement) => void;
  updateAnnouncement: (a: Announcement) => void;
  deleteAnnouncement: (id: number) => void;
  programs: Program[];
  addProgram: (p: Program) => void;
  updateProgram: (p: Program) => void;
  deleteProgram: (id: number) => void;
  siteConfig: SiteConfig;
  updateSiteConfig: (c: Partial<SiteConfig>) => void;
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (p: SchoolProfile) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  checkPermission: (permissionKey: string) => boolean;
  teacherGroups: TeacherGroup[];
  updateTeacherGroups: (groups: TeacherGroup[]) => void;
  speechSchedule: SpeechScheduleItem[];
  updateSpeechSchedule: (schedule: SpeechScheduleItem[]) => void;
  kokoWeeklyData: KokoActivity[];
  updateKokoWeeklyData: (data: KokoActivity[]) => void;
  kokoAssemblyData: KokoAssemblyEvent[];
  updateKokoAssemblyData: (data: KokoAssemblyEvent[]) => void;
  sumurSchedule: SumurEvent[];
  updateSumurSchedule: (data: SumurEvent[]) => void;
  hipSchedule: HipEvent[];
  updateHipSchedule: (data: HipEvent[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultRolePermission: RolePermission = {
  canUpdateProfil: false,
  canUpdateProgram: false,
  canUpdatePengumuman: false,
  canUpdatePentadbiranJK: false,
  canUpdatePentadbiranTakwim: false,
  canUpdateKurikulumJK: false,
  canUpdateKurikulumTakwim: false,
  canUpdateKurikulumPeperiksaan: false,
  canUpdateHEMJK: false,
  canUpdateHEMTakwim: false,
  canUpdateHEMKehadiran: false,
  canUpdateKokoJK: false,
  canUpdateKokoTakwim: false,
  canUpdateTakwimGlobal: false,
  canUpdateJadualGanti: false,
  canUpdateJadualGuruKelas: false,
  canUpdateJadualPersendirian: false,
  canUpdateJadualKelas: false,
  canUpdateJadualBerucap: false,
  canUpdateJadualPemantauan: false,
  canUpdateJadualGlobal: false,
};

const initialRolePermissions: Record<string, RolePermission> = {
  admin: { ...defaultRolePermission, canUpdateProgram: true, canUpdatePengumuman: true },
  pengetua: {
    canUpdateProfil: true,
    canUpdateProgram: true,
    canUpdatePengumuman: true,
    canUpdatePentadbiranJK: true,
    canUpdatePentadbiranTakwim: true,
    canUpdateKurikulumJK: true,
    canUpdateKurikulumTakwim: true,
    canUpdateKurikulumPeperiksaan: true,
    canUpdateHEMJK: true,
    canUpdateHEMTakwim: true,
    canUpdateHEMKehadiran: true,
    canUpdateKokoJK: true,
    canUpdateKokoTakwim: true,
    canUpdateTakwimGlobal: true,
    canUpdateJadualGanti: true,
    canUpdateJadualGuruKelas: true,
    canUpdateJadualPersendirian: true,
    canUpdateJadualKelas: true,
    canUpdateJadualBerucap: true,
    canUpdateJadualPemantauan: true,
    canUpdateJadualGlobal: true,
  },
  gpk_pentadbiran: {
    ...defaultRolePermission,
    canUpdatePentadbiranJK: true,
    canUpdatePentadbiranTakwim: true,
    canUpdateTakwimGlobal: true,
    canUpdateJadualGanti: true,
    canUpdateJadualPersendirian: true,
    canUpdateJadualKelas: true,
    canUpdateJadualPemantauan: true,
  },
  gpk_hem: {
    ...defaultRolePermission,
    canUpdateHEMJK: true,
    canUpdateHEMTakwim: true,
    canUpdateHEMKehadiran: true,
    canUpdateJadualGuruKelas: true,
  },
  gpk_koko: {
    ...defaultRolePermission,
    canUpdateKokoJK: true,
    canUpdateKokoTakwim: true,
    canUpdateJadualBerucap: true,
  },
  gkmp: { ...defaultRolePermission, canUpdateKurikulumJK: true, canUpdateJadualPemantauan: true },
  panitia: { ...defaultRolePermission, canUpdateKurikulumJK: true },
  guru: { ...defaultRolePermission, canUpdateJadualPersendirian: true, canUpdateJadualKelas: true },
  su_pentadbir: { ...defaultRolePermission, canUpdatePentadbiranJK: true, canUpdatePentadbiranTakwim: true, canUpdateTakwimGlobal: true, canUpdateJadualGanti: true },
  su_hem: { ...defaultRolePermission, canUpdateHEMJK: true, canUpdateHEMKehadiran: true, canUpdateJadualGuruKelas: true },
  su_kuri: { ...defaultRolePermission, canUpdateKurikulumJK: true, canUpdateKurikulumPeperiksaan: true, canUpdateJadualKelas: true },
  su_koko: { ...defaultRolePermission, canUpdateKokoJK: true, canUpdateKokoTakwim: true, canUpdateJadualBerucap: true },
};

const INITIAL_GROUP_MEMBERS_DATA: TeacherGroup[] = [
  { id: 1, name: "KUMPULAN 1", members: ["Muhammad Hafiz bin Jalil", "Norashidah binti A Wahab", "Syahidatun Najihah binti Aziz", "Nik Noorizati binti Ab Kahar", "Noorlela binti Zainudin"] },
  { id: 2, name: "KUMPULAN 2", members: ["Ahmad Fikruddin bin Ahmad Raza'i", "Nooraind binti Ali", "Siti Aminah binti Mohamed", "Masyitah binti Razali", "Nor Ain binti Mohamed Jori"] },
  { id: 3, name: "KUMPULAN 3", members: ["Mohamad Sukri bin Ali", "Mazuin binti Mat", "Siti Nurul Liza binti Sidin", "Zarith Najiha binti Jamal", "Nurul Izzati binti Roslin"] },
  { id: 4, name: "KUMPULAN 4", members: ["Mohd Nur bin Ahmad", "Rosmawati binti Hussin", "Saemah binti Supandi", "Annur Ayuni binti Mohamed", "Nuurul Amira binti Razak"] },
  { id: 5, name: "KUMPULAN 5", members: ["Mohamad Nasreen Hakim bin Che Mohamed", "Mohd Nor bin Salikin", "Zahrah Khairiah Nasution binti Saleh", "Nor Hidayah binti Mahadun", "Nurul Syafiqah binti Husin"] },
  { id: 6, name: "KUMPULAN 6", members: ["Salman bin A Rahman", "Mohammad Firros bin Rosool Gani", "Nor Azean binti Ismail", "Norliyana binti Mhd Amin", "Liyana binti Iskandar"] }
];

const INITIAL_SPEECH_SCHEDULE_DATA: SpeechScheduleItem[] = [
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
  { id: 12, week: "12", date: "6 – 10 Apr 2026", group: "KUMPULAN 6", speaker: "Mohd Nur bin Salikin", topic: "Hargai Diri", civic: "", sumur: "" },
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
  { id: 42, week: "42", date: "23 – 27 Nov 2026", group: "KUMPULAN 6", speaker: "Mohd Nur bin Salikin", topic: "Tarbiah Asas Kecemerlangan", civic: "", sumur: "" },
  { id: 43, week: "43", date: "30 Nov – 4 Dis 2026", group: "", speaker: "", topic: "", civic: "", sumur: "" },
];

const INITIAL_KOKO_WEEKLY_DATA: KokoActivity[] = [
  { id: 1, date: '14 Jan 2026', activity: 'Pendaftaran Keahlian Persatuan/Kelab/Unit Beruniform/1M1S' },
  { id: 2, date: '21 Jan 2026', activity: 'Perjumpaan Unit Beruniform 1 & Kelab 1M1S (L1)' },
  { id: 3, date: '28 Jan 2026', activity: 'Perjumpaan Kelab/Persatuan 1 & Kelab 1M1S (P1)' },
  { id: 4, date: '4 Feb 2026', activity: 'Perjumpaan Unit Beruniform 2 & Kelab 1M1S (L2)' },
  { id: 5, date: '11 Feb 2026', activity: 'Perjumpaan Kelab/Persatuan 2 & Kelab 1M1S (P2)' },
  { id: 6, date: '28 Feb 2026', activity: 'Koko Ramadhan' },
  { id: 7, date: '4 Mac 2026', activity: 'Koko Ramadhan' },
  { id: 8, date: '11 Mac 2026', activity: 'Koko Ramadhan' },
  { id: 9, date: '18 Mac 2026', activity: 'Koko Ramadhan' },
  { id: 10, date: '1 April 2026', activity: 'Perjumpaan Unit Beruniform 3 & Kelab 1M1S (L3)' },
  { id: 11, date: '8 April 2026', activity: 'Perjumpaan Kelab/Persatuan 3 & Kelab 1M1S (P3)' },
  { id: 12, date: '15 April 2026', activity: 'Perjumpaan Unit Beruniform 4 & Kelab 1M1S (L4)' },
  { id: 13, date: '22 April 2026', activity: 'Perjumpaan Kelab/Persatuan 4 & Kelab 1M1S (P4)' },
  { id: 14, date: '29 April 2026', activity: 'Perjumpaan Unit Beruniform 5 & Kelab 1M1S (L5)' },
  { id: 15, date: '6 Mei 2026', activity: 'Perjumpaan Kelab/Persatuan 5 & Kelab 1M1S (P5)' },
  { id: 16, date: '13 Mei 2026', activity: 'Perjumpaan Unit Beruniform 6 & Kelab 1M1S (L6)' },
  { id: 17, date: '20 Mei 2026', activity: 'Perjumpaan Kelab/Persatuan 6 & Kelab 1M1S (P6)' },
  { id: 18, date: '10 Jun 2026', activity: 'Perjumpaan Unit Beruniform 7 & Kelab 1M1S (L7)' },
  { id: 19, date: '24 Jun 2026', activity: 'Perjumpaan Kelab/Persatuan 7 & Kelab 1M1S (P7)' },
  { id: 20, date: '1 Julai 2026', activity: 'Perjumpaan Unit Beruniform 8 & Kelab 1M1S (L8)' },
  { id: 21, date: '8 Julai 2026', activity: 'Perjumpaan Kelab/Persatuan 8 & Kelab 1M1S (P8)' },
  { id: 22, date: '15 Julai 2026', activity: 'Perjumpaan Unit Beruniform 9 & Kelab 1M1S (L9)' },
  { id: 23, date: '22 Julai 2026', activity: 'Perjumpaan Kelab/Persatuan 9 & Kelab 1M1S (P9)' },
  { id: 24, date: '29 Julai 2026', activity: 'Perjumpaan Unit Beruniform 10 & Kelab 1M1S (L10)' },
  { id: 25, date: '5 Ogos 2026', activity: 'Perjumpaan Kelab/Persatuan 10 & Kelab 1M1S (P10)' },
  { id: 26, date: '12 Ogos 2026', activity: 'Perjumpaan Unit Beruniform 11 & Kelab 1M1S (L11)' },
  { id: 27, date: '19 Ogos 2026', activity: 'Perjumpaan Kelab/Persatuan 11 & Kelab 1M1S (P11)' },
  { id: 28, date: '26 Ogos 2026', activity: 'Perjumpaan Unit Beruniform 12 & Kelab 1M1S (L12)' },
  { id: 29, date: '9 Sept 2026', activity: 'Perjumpaan Kelab/Persatuan 12 & Kelab 1M1S (P12)' },
  { id: 30, date: '23 Sept 2026', activity: 'Penyelarasan PAJSK 1' },
  { id: 31, date: '30 Sept 2026', activity: 'Penyelarasan PAJSK 2' },
];

const INITIAL_KOKO_ASSEMBLY_DATA: KokoAssemblyEvent[] = [
  { id: 1, month: 'Jan', date: '19 Jan 2026', unit: 'Kadet Remaja Sekolah', notes: 'Pakaian: Uniform No. 3 / Lengkap' },
  { id: 2, month: 'Feb', date: '16 Feb 2026', unit: 'Pergerakan Puteri Islam Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 3, month: 'Mac', date: '16 Mac 2026', unit: 'Pergerakan Pengakap Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 4, month: 'April', date: '13 April 2026', unit: 'Pergerakan Pandu Puteri Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 5, month: 'Mei', date: '18 Mei 2026', unit: 'Kadet Remaja Sekolah', notes: 'Pakaian: Uniform No. 3 / Lengkap' },
  { id: 6, month: 'Jun', date: '15 Jun 2026', unit: 'Pergerakan Puteri Islam Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 7, month: 'Julai', date: '13 Julai 2026', unit: 'Pergerakan Pengakap Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 8, month: 'Ogos', date: '17 Ogos 2026', unit: 'Pergerakan Pandu Puteri Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 9, month: 'September', date: '14 Sep 2026', unit: 'Kadet Remaja Sekolah', notes: 'Pakaian: Uniform No. 3 / Lengkap' },
  { id: 10, month: 'Oktober', date: '19 Okt 2026', unit: 'Pergerakan Puteri Islam Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 11, month: 'November', date: '16 Nov 2026', unit: 'Pergerakan Pengakap Malaysia', notes: 'Pakaian: Uniform Lengkap' },
  { id: 12, month: 'Disember', date: '14 Dis 2026', unit: 'Cuti Sekolah', notes: '-' },
];

const INITIAL_SUMUR_DATA: SumurEvent[] = [
  { id: 1, date: '15 Jan 2026', program: 'SUMUR', teacher: '', activity: '' },
  { id: 2, date: '22 Jan 2026', program: 'HAYYA BIL ARABIAH', teacher: 'U.LIYANA, U.AZEAN, U.AYUNI', activity: 'HIWAR' },
  { id: 3, date: '29 Jan 2026', program: 'SUMUR', teacher: '', activity: '' },
  { id: 4, date: '5 Feb 2026', program: 'OH MY ENGLISH !', teacher: 'KP BI', activity: '' },
  { id: 5, date: '12 Feb 2026', program: 'SUMUR', teacher: '', activity: '' },
  { id: 6, date: '19 Feb 2026', program: 'HAYYA BIL ARABIAH', teacher: 'U.M.NOR (S), U.HIDAYAH, U.JIHA', activity: 'PERTANDINGAN HIWAR SPONTAN' },
  { id: 7, date: '26 Feb 2026', program: 'SUMUR', teacher: '', activity: '' },
  { id: 8, date: '5 Mac 2026', program: 'OH MY ENGLISH !', teacher: 'KP BI', activity: '' },
  { id: 9, date: '12 Mac 2026', program: 'SUMUR', teacher: '', activity: '' },
  { id: 10, date: '19 Mac 2026', program: 'HAYYA BIL ARABIAH', teacher: 'U.ZARITH, U.AMINAH, U.M.NUR (A)', activity: 'GAME SAMBUNG PERKATAAN' },
];

const INITIAL_HIP_DATA: HipEvent[] = [
  { id: 1, date: '19 Jan 2026', program: 'English Assembly', teacher: 'Puan Siti Aminah binti Rahmat', activity: 'Public Speaking & Storytelling' },
  { id: 2, date: '16 Feb 2026', program: 'Speaker Corner', teacher: 'Cikgu Zarith Najiha binti Jamal', activity: 'Topic: My Ambition' },
  { id: 3, date: '23 Mac 2026', program: 'English Camp Launch', teacher: 'Panitia Bahasa Inggeris', activity: 'Opening Ceremony & Briefing' },
  { id: 4, date: '20 Apr 2026', program: 'Scrabble Competition', teacher: 'Cikgu Nurul Izzati binti Roslin', activity: 'Inter-class competition' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [teacherGroups, setTeacherGroups] = useState<TeacherGroup[]>(INITIAL_GROUP_MEMBERS_DATA);
  const [speechSchedule, setSpeechSchedule] = useState<SpeechScheduleItem[]>(INITIAL_SPEECH_SCHEDULE_DATA);
  const [kokoWeeklyData, setKokoWeeklyData] = useState<KokoActivity[]>(INITIAL_KOKO_WEEKLY_DATA);
  const [kokoAssemblyData, setKokoAssemblyData] = useState<KokoAssemblyEvent[]>(INITIAL_KOKO_ASSEMBLY_DATA);
  const [sumurSchedule, setSumurSchedule] = useState<SumurEvent[]>(INITIAL_SUMUR_DATA);
  const [hipSchedule, setHipSchedule] = useState<HipEvent[]>(INITIAL_HIP_DATA);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: 'Mesyuarat Agung PIBG', date: '2026-03-15', summary: 'Semua ibu bapa dijemput hadir ke Dewan Utama.', views: 0, likes: 0 },
    { id: 2, title: 'Cuti Perayaan Tahun Baru Cina', date: '2026-02-17', summary: 'Sekolah akan bercuti selama seminggu sempena TBC.', views: 0, likes: 0 },
  ]);

  const [programs, setPrograms] = useState<Program[]>([
    { id: 1, title: 'Kejohanan Olahraga Tahunan', date: '2026-04-20', category: 'Sukan', description: 'Acara balapan dan padang antara rumah sukan.', time: '8:00 PG', location: 'Padang Sekolah' },
    { id: 2, title: 'Minggu Bahasa', date: '2026-05-10', category: 'Kurikulum', description: 'Pertandingan pidato, sajak dan bercerita.', time: '10:00 PG', location: 'Dewan Terbuka' },
  ]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    systemTitle: 'SISTEM PENGURUSAN DIGITAL',
    schoolName: 'SMA AL-KHAIRIAH AL-ISLAMIAH MERSING',
    welcomeMessage: 'SELAMAT DATANG KE ePENGURUSAN DIGITAL SMAAM',
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    pengetuaName: 'Zulkeffle bin Muhammad',
    pengetuaQuote: `Segala puji dan syukur ke hadrat Allah SWT, selawat dan salam ke atas junjungan besar Nabi Muhammad SAW, penghulu sekalian umat, pembawa rahmat dan hidayah untuk seluruh alam.

Bagi sesi 2026, Sekolah Menengah Agama Al Khairiah Al Islamiah, Mersing bertekad untuk melangkah ke hadapan dengan memberi fokus kepada pengurusan dan pembelajaran secara digital. Ini merupakan usaha untuk memastikan pendidikan yang disampaikan bukan sahaja selari dengan perkembangan teknologi semasa, tetapi juga mengakar kepada nilai-nilai Islam yang murni.

Dalam konteks ini, penting bagi kita memahami bahawa kerja itu adalah satu ibadah, dan setiap tugas yang dilaksanakan mesti bersandarkan konsep ittqan, iaitu melaksanakan sesuatu pekerjaan dengan penuh kesungguhan, ketelitian, dan kejujuran. Allah SWT berfirman:

"Dan katakanlah (wahai Muhammad), bekerjalah kamu, maka Allah, Rasul-Nya dan orang-orang mukmin akan melihat pekerjaan kamu."
(Surah At-Taubah, ayat 105)

Sebagai guru dan kakitangan sekolah, kita memikul amanah yang besar untuk mendidik generasi muda agar mereka menjadi insan yang bukan sahaja berilmu, tetapi juga berakhlak mulia, bertakwa, dan mampu menjadi agen perubahan dalam masyarakat. Dengan semangat itqan, kita mampu mengubah cabaran menjadi peluang dan menjadikan usaha kita lebih bermakna di sisi Allah SWT.

Saya juga menyeru semua pelajar agar menanamkan sifat itqan dalam pembelajaran, kerana inilah jalan menuju kejayaan. Belajarlah dengan niat untuk mendapatkan ilmu yang bermanfaat, agar ia dapat digunakan untuk kebaikan diri, keluarga, masyarakat, dan ummah.

Akhir kata, saya merakamkan penghargaan kepada semua warga sekolah, ibu bapa, dan masyarakat setempat atas sokongan padu dalam merealisasikan misi dan visi sekolah. Semoga segala usaha kita diberkati dan dirahmati oleh Allah SWT.

Sekian, terima kasih.


Yang Menjalankan Amanah,
Haji Zulkeffle bin Muhammad 
Pengetua,
Sekolah Menengah Agama Al-Khairiah Al-Islamiah Mersing`,
    pengetuaImage: 'https://i.postimg.cc/GpTZX8V9/us_zul.png',
    schoolName: 'SMA AL-KHAIRIAH AL-ISLAMIAH MERSING',
    schoolCode: 'JFT4001',
    address: '49/3, Jalan Awang Daik, 86800 Mersing, Johor',
    email: 'smaam_mersing@yahoo.com.my',
    phone: '07-7996272',
    location: 'https://sites.google.com/moe-dl.edu.my/smaam-hebat/utama',
    visi: 'Sekolah Menengah Agama Al-Khairiah Al- Islamiah Mersing Ke Arah Pendidikan Berkualiti Insan Terdidik Negara Sejahtera',
    misi: 'Melestarikan Sistem Pendidikan Yang Berkualiti Untuk Membangunkan Potensi Individu Bagi Memenuhi Aspirasi Negara',
    piagam: `Kami; Pentadbir, Guru Dan Kakitangan SMA Al-Khairiah Al-Islamiah Mersing Dengan Penuh Tekad Dan Iltizam Berikrar Memberikan Perkhidmatan Terbaik Kepada Semua Pelanggan Dengan:

* Prihatin Dalam Semua Perkara Serta Berusaha Mengatasi Sebarang Masalah Yang Mereka Hadapi Dengan Penuh Kasih Sayang

* Berkesan Dalam Mendidik Untuk Mencapai Kecemerlangan Akademik, Sahsiah Dan Kokurikulum

* Penuh Ikhlas Dan Bertenaga Untuk Merealisasikan Visi Dan Misi Sekolah

* Amanah Dan Ikhlas Dalam Mentarbiah Supaya Mendapat Keredhaan Daripada Allah SWT

* Segera Bertindak Melaksanakan Tugas, Proaktif, Kreatif Dan Inovatif`,
    moto: 'Al-Quran Panduan Hidup',
    slogan: 'SMAAM Hebat',
    status: 'Sekolah Bantuan Kerajaan (SABK)',
    logoUrl: 'https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png',
    stats: {
      lulusSpm: '98.5%',
      gred: '1.85',
      guruTotal: 34,
      guruLelaki: 14,
      guruPerempuan: 20,
      muridTotal: 316,
      muridLelaki: 156,
      muridPerempuan: 160,
    }
  });

  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);

  const [userCredentials, setUserCredentials] = useState<Record<string, UserCredential>>({
    adminsistem: { username: 'adminsistem', password: '123', label: 'Super Admin' },
    admin: { username: 'admin', password: '123', label: 'Admin' },
    pengetua: { username: 'pengetua', password: '123', label: 'Pengetua' },
    gpk_pentadbiran: { username: 'gpk_pentadbiran', password: '123', label: 'GPK Pentadbiran' },
    gpk_hem: { username: 'gpk_hem', password: '123', label: 'GPK HEM' },
    gpk_koko: { username: 'gpk_koko', password: '123', label: 'GPK Kokurikulum' },
    gkmp: { username: 'gkmp', password: '123', label: 'GKMP' },
    panitia: { username: 'panitia', password: '123', label: 'Ketua Panitia' },
    guru: { username: 'guru', password: '123', label: 'Guru' },
    su_pentadbir: { username: 'su_pentadbir', password: '123', label: 'SU Pentadbiran' },
    su_hem: { username: 'su_hem', password: '123', label: 'SU HEM' },
    su_kuri: { username: 'su_kuri', password: '123', label: 'SU Kurikulum' },
    su_koko: { username: 'su_koko', password: '123', label: 'SU Kokurikulum' },
  });

  const login = (username: string, role: UserRole) => {
    setUser({ username, role, name: username.toUpperCase() });
    showToast(`Selamat datang, ${username}!`);
  };

  const logout = () => {
    setUser(null);
    setActiveTab('Dashboard');
    showToast("Anda telah log keluar.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const checkPermission = (permissionKey: string): boolean => {
    if (!user || !user.role) return false;
    if (user.role === 'adminsistem') return true;
    const userRolePermissions = rolePermissions[user.role];
    if (!userRolePermissions) return false;
    return !!userRolePermissions[permissionKey as keyof RolePermission];
  };

  const permissions: Permissions = {
    pentadbiran: true, 
    kurikulum: true,
    hem: true,
    kokurikulum: true,
    takwim: true,
    program: true,
    pengumuman: true,
    jadual: true,
  };

  const addAnnouncement = (a: Announcement) => setAnnouncements([a, ...announcements]);
  const updateAnnouncement = (a: Announcement) => setAnnouncements(announcements.map(item => item.id === a.id ? a : item));
  const deleteAnnouncement = (id: number) => setAnnouncements(announcements.filter(item => item.id !== id));
  
  const addProgram = (p: Program) => setPrograms([p, ...programs]);
  const updateProgram = (p: Program) => setPrograms(programs.map(prog => prog.id === p.id ? p : prog));
  const deleteProgram = (id: number) => setPrograms(programs.filter(p => p.id !== id));
  
  const updateSiteConfig = (c: Partial<SiteConfig>) => setSiteConfig({ ...siteConfig, ...c });
  const updateSchoolProfile = (p: SchoolProfile) => setSchoolProfile(p);
  const updateUserCredentials = (role: string, creds: UserCredential) => setUserCredentials({ ...userCredentials, [role]: creds });
  const updateRolePermissions = (role: string, perms: RolePermission) => setRolePermissions({ ...rolePermissions, [role]: perms });

  const updateTeacherGroups = (groups: TeacherGroup[]) => setTeacherGroups(groups);
  const updateSpeechSchedule = (schedule: SpeechScheduleItem[]) => setSpeechSchedule(schedule);
  const updateKokoWeeklyData = (data: KokoActivity[]) => setKokoWeeklyData(data);
  const updateKokoAssemblyData = (data: KokoAssemblyEvent[]) => setKokoAssemblyData(data);
  const updateSumurSchedule = (data: SumurEvent[]) => setSumurSchedule(data);
  const updateHipSchedule = (data: HipEvent[]) => setHipSchedule(data);

  return (
    <AppContext.Provider value={{
      user, activeTab, setActiveTab, login, logout,
      permissions, rolePermissions, updateRolePermissions,
      userCredentials, updateUserCredentials,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      programs, addProgram, updateProgram, deleteProgram,
      siteConfig, updateSiteConfig,
      schoolProfile, updateSchoolProfile,
      toastMessage, showToast, checkPermission,
      teacherGroups, updateTeacherGroups,
      speechSchedule, updateSpeechSchedule,
      kokoWeeklyData, updateKokoWeeklyData,
      kokoAssemblyData, updateKokoAssemblyData,
      sumurSchedule, updateSumurSchedule,
      hipSchedule, updateHipSchedule
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
