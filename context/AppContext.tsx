
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, UserRole, Announcement, Program, SchoolProfile, 
  RolePermission, UserCredential, Permissions, SiteConfig 
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock Data States
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: 'Mesyuarat Agung PIBG', date: '2026-03-15', summary: 'Semua ibu bapa dijemput hadir ke Dewan Utama.', views: 120, likes: 45 },
    { id: 2, title: 'Cuti Perayaan Tahun Baru Cina', date: '2026-02-17', summary: 'Sekolah akan bercuti selama seminggu sempena TBC.', views: 300, likes: 80 },
  ]);

  const [programs, setPrograms] = useState<Program[]>([
    { id: 1, title: 'Kejohanan Olahraga Tahunan', date: '2026-04-20', category: 'Sukan', description: 'Acara balapan dan padang antara rumah sukan.', time: '8:00 PG', location: 'Padang Sekolah' },
    { id: 2, title: 'Minggu Bahasa', date: '2026-05-10', category: 'Kurikulum', description: 'Pertandingan pidato, sajak dan bercerita.', time: '10:00 PG', location: 'Dewan Terbuka' },
  ]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    systemTitle: 'SISTEM PENGURUSAN DIGITAL',
    schoolName: 'SMA AL-KHAIRIAH AL-ISLAMIAH MERSING',
    welcomeMessage: 'SELAMAT DATANG KE PORTAL RASMI',
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    pengetuaName: 'Zulkeffle bin Muhammad',
    pengetuaQuote: 'Kami; Pentadbir, Guru Dan Kakitangan SMA Al-Khairiah Al-Islamiah Mersing Dengan Penuh Tekad Dan Iltizam Berikrar Memberikan Perkhidmatan Terbaik Kepada Semua Pelanggan.',
    pengetuaImage: '',
    schoolName: 'SMA AL-KHAIRIAH AL-ISLAMIAH MERSING',
    schoolCode: 'JFT4001',
    address: '49/3, Jalan Awang Daik, 86800 Mersing, Johor',
    email: 'smaam_mersing@yahoo.com.my',
    phone: '07-7996272',
    location: 'Mersing, Johor',
    visi: 'Sekolah Menengah Agama Al-Khairiah Al- Islamiah Mersing Ke Arah Pendidikan Berkualiti Insan Terdidik Negara Sejahtera',
    misi: 'Melestarikan Sistem Pendidikan Yang Berkualiti Untuk Membangunkan Potensi Individu Bagi Memenuhi Aspirasi Negara',
    moto: 'Al-Quran Panduan Hidup',
    slogan: 'SMAAM Hebat',
    status: 'Sekolah Bantuan Kerajaan (SABK)',
    logoUrl: 'https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png',
    stats: {
      lulusSpm: '98.5%',
      gred: '1.85',
      guruTotal: 45,
      guruLelaki: 15,
      guruPerempuan: 30,
      muridTotal: 850,
      muridLelaki: 420,
      muridPerempuan: 430,
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

  return (
    <AppContext.Provider value={{
      user, activeTab, setActiveTab, login, logout,
      permissions, rolePermissions, updateRolePermissions,
      userCredentials, updateUserCredentials,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      programs, addProgram, updateProgram, deleteProgram,
      siteConfig, updateSiteConfig,
      schoolProfile, updateSchoolProfile,
      toastMessage, showToast, checkPermission
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
