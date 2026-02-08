
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Permissions, Announcement, Program, SiteConfig, SchoolProfile, RolePermission, UserCredential } from '../types';

interface AppContextType {
  user: User | null;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  permissions: Permissions;
  updatePermissions: (newPermissions: Permissions) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  programs: Program[];
  addProgram: (program: Program) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (id: number) => void;
  
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: SchoolProfile) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  isSyncing: boolean;
  checkPermission: (module: string, type?: string) => boolean;

  // New RBAC features
  rolePermissions: Record<string, RolePermission>;
  updateRolePermissions: (role: string, perms: RolePermission) => void;
  userCredentials: Record<string, UserCredential>;
  updateUserCredentials: (role: string, creds: UserCredential) => void;
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
  gkmp: { ...defaultRolePermission, canUpdateKurikulumJK: true, canUpdateJadualPemantauan: true },
  panitia: { ...defaultRolePermission, canUpdateKurikulumJK: true },
  guru: { ...defaultRolePermission },
  su_pentadbir: { ...defaultRolePermission, canUpdatePentadbiranJK: true, canUpdatePentadbiranTakwim: true, canUpdateTakwimGlobal: true, canUpdateJadualGanti: true },
  su_hem: { ...defaultRolePermission, canUpdateHEMJK: true, canUpdateHEMKehadiran: true, canUpdateJadualGuruKelas: true },
  su_kuri: { ...defaultRolePermission, canUpdateKurikulumJK: true, canUpdateKurikulumPeperiksaan: true, canUpdateJadualKelas: true },
  su_koko: { ...defaultRolePermission, canUpdateKokoJK: true, canUpdateKokoTakwim: true, canUpdateJadualBerucap: true },
};

const initialCredentials: Record<string, UserCredential> = {
  adminsistem: { username: 'adminsistem', password: 'admin123', label: 'Superadmin' },
  admin: { username: 'admin', password: 'admin123', label: 'Admin' },
  gkmp: { username: 'gkmp', password: 'gkmp123', label: 'GKMP' },
  panitia: { username: 'panitia', password: 'panitia123', label: 'Panitia' },
  guru: { username: 'guru', password: 'guru123', label: 'Guru' },
  su_pentadbir: { username: 'supentadbir', password: 'su123', label: 'SU Pentadbir' },
  su_hem: { username: 'suhem', password: 'su123', label: 'SU HEM' },
  su_kuri: { username: 'sukuri', password: 'su123', label: 'SU Kurikulum' },
  su_koko: { username: 'sukoko', password: 'su123', label: 'SU Kokurikulum' },
};

const defaultProfile: SchoolProfile = {
  pengetuaName: "Zulkeffle bin Muhammad",
  pengetuaQuote: "Selamat datang ke SMA Al-Khairiah Al-Islamiah Mersing. Bersama-sama kita membentuk generasi ulul albab yang cemerlang di dunia and akhirat.",
  pengetuaImage: "",
  schoolName: "SMA AL-KHAIRIAH AL-ISLAMIAH MERSING",
  schoolCode: "JFT4001",
  address: "Jalan Dato' Onn, 86800 Mersing, Johor",
  email: "jft4001@moe.edu.my",
  phone: "07-7996272",
  location: "Luar Bandar (A)",
  visi: "Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera.",
  misi: "Mengekalkan kegemilangan sekolah dan melahirkan generasi berilmu, beramal dan bertaqwa melalui tadbir urus yang lestari.",
  moto: "Ilmu. Iman. Amal.",
  slogan: "SMAAM Gemilang!",
  status: "Sekolah Gred A",
  stats: {
    lulusSpm: "98%",
    gred: "Gred A",
    guruTotal: 45,
    guruLelaki: 10,
    guruPerempuan: 35,
    muridTotal: 650,
    muridLelaki: 320,
    muridPerempuan: 330
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    pentadbiran: true, kurikulum: true, hem: true, kokurikulum: true,
    takwim: true, program: true, pengumuman: true, jadual: true,
  });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(defaultProfile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    systemTitle: "PENGURUSAN DIGITAL SMAAM",
    schoolName: "SMA Al-Khairiah Al-Islamiah Mersing",
    welcomeMessage: "Selamat Datang ke Dashboard Utama",
    googleScriptUrl: ""
  });

  const [rolePermissions, setRolePermissions] = useState<Record<string, RolePermission>>(initialRolePermissions);
  const [userCredentials, setUserCredentials] = useState<Record<string, UserCredential>>(initialCredentials);

  useEffect(() => {
    const savedPermissions = localStorage.getItem('smaam_permissions');
    if (savedPermissions) setPermissions(JSON.parse(savedPermissions));

    const savedConfig = localStorage.getItem('smaam_config');
    if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

    const savedProfile = localStorage.getItem('smaam_profile');
    if (savedProfile) setSchoolProfile(JSON.parse(savedProfile));
    
    const savedRolePerms = localStorage.getItem('smaam_role_permissions');
    if (savedRolePerms) setRolePermissions(JSON.parse(savedRolePerms));

    const savedCreds = localStorage.getItem('smaam_credentials');
    if (savedCreds) setUserCredentials(JSON.parse(savedCreds));

    const savedUser = sessionStorage.getItem('smaam_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (username: string, role: UserRole) => {
    const label = userCredentials[role as string]?.label || 'Pengguna';
    const newUser: User = { username, role, name: label };
    setUser(newUser);
    sessionStorage.setItem('smaam_user', JSON.stringify(newUser));
    showToast(`Selamat datang, ${label}`);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smaam_user');
    setActiveTab('Dashboard');
    showToast("Log keluar berjaya");
  };

  const updatePermissions = (newPermissions: Permissions) => {
    setPermissions(newPermissions);
    localStorage.setItem('smaam_permissions', JSON.stringify(newPermissions));
  };

  const updateRolePermissions = (role: string, perms: RolePermission) => {
    const newPerms = { ...rolePermissions, [role]: perms };
    setRolePermissions(newPerms);
    localStorage.setItem('smaam_role_permissions', JSON.stringify(newPerms));
  };

  const updateUserCredentials = (role: string, creds: UserCredential) => {
    const newCreds = { ...userCredentials, [role]: creds };
    setUserCredentials(newCreds);
    localStorage.setItem('smaam_credentials', JSON.stringify(newCreds));
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    const newConfig = { ...siteConfig, ...config };
    setSiteConfig(newConfig);
    localStorage.setItem('smaam_config', JSON.stringify(newConfig));
  };

  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    localStorage.setItem('smaam_profile', JSON.stringify(profile));
  };

  const addAnnouncement = (item: Announcement) => {
    setAnnouncements([item, ...announcements]);
    showToast("Pengumuman ditambah");
  };

  const addProgram = (item: Program) => {
    setPrograms([item, ...programs]);
    showToast("Program ditambah");
  };

  const updateProgram = (updatedItem: Program) => {
    setPrograms(programs.map(p => p.id === updatedItem.id ? updatedItem : p));
    showToast("Program dikemaskini");
  };

  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
    showToast("Program dipadam");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveToCloud = async () => {
    if (!siteConfig.googleScriptUrl) return;
    setIsSyncing(true);
    try {
      const payload = { action: 'save', data: { permissions, siteConfig, announcements, programs, schoolProfile, rolePermissions, userCredentials } };
      await fetch(siteConfig.googleScriptUrl, { method: 'POST', body: JSON.stringify(payload) });
      showToast("✅ Berjaya disimpan!");
    } catch (e) { showToast("❌ Gagal menyambung."); }
    finally { setIsSyncing(false); }
  };

  const loadFromCloud = async () => {
    if (!siteConfig.googleScriptUrl) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`${siteConfig.googleScriptUrl}?action=read`);
      const result = await res.json();
      if (result.status === 'success' && result.data) {
        const d = result.data;
        if(d.permissions) setPermissions(d.permissions);
        if(d.siteConfig) setSiteConfig({ ...d.siteConfig, googleScriptUrl: siteConfig.googleScriptUrl });
        if(d.schoolProfile) setSchoolProfile(d.schoolProfile);
        if(d.rolePermissions) setRolePermissions(d.rolePermissions);
        if(d.userCredentials) setUserCredentials(d.userCredentials);
        showToast("✅ Data berjaya dimuat turun!");
      }
    } catch (e) { showToast("❌ Gagal memuat turun."); }
    finally { setIsSyncing(false); }
  };

  const checkPermission = (module: string, type: string = 'edit'): boolean => {
    if (!user) return false;
    if (user.role === 'adminsistem') return true;
    
    const rolePerm = rolePermissions[user.role as string];
    if (!rolePerm) return false;

    const m = module.toLowerCase();
    const t = type.toLowerCase();

    // Mapping based on new RolePermission structure
    if (m === 'profil' || m === 'profil sekolah') return rolePerm.canUpdateProfil;
    if (m === 'program') return rolePerm.canUpdateProgram;
    if (m === 'pengumuman') return rolePerm.canUpdatePengumuman;
    
    if (m === 'pentadbiran') {
      if (t === 'jawatankuasa') return rolePerm.canUpdatePentadbiranJK;
      if (t === 'takwim') return rolePerm.canUpdatePentadbiranTakwim;
      return rolePerm.canUpdatePentadbiranJK || rolePerm.canUpdatePentadbiranTakwim;
    }

    if (m === 'kurikulum') {
      if (t === 'jawatankuasa') return rolePerm.canUpdateKurikulumJK;
      if (t === 'takwim') return rolePerm.canUpdateKurikulumTakwim;
      if (t === 'peperiksaan') return rolePerm.canUpdateKurikulumPeperiksaan;
      return rolePerm.canUpdateKurikulumJK;
    }

    if (m === 'hal ehwal murid') {
      if (t === 'jawatankuasa') return rolePerm.canUpdateHEMJK;
      if (t === 'takwim') return rolePerm.canUpdateHEMTakwim;
      if (t === 'kehadiran') return rolePerm.canUpdateHEMKehadiran;
      return rolePerm.canUpdateHEMJK;
    }

    if (m === 'kokurikulum') {
      if (t === 'jawatankuasa') return rolePerm.canUpdateKokoJK;
      if (t === 'takwim') return rolePerm.canUpdateKokoTakwim;
      return rolePerm.canUpdateKokoJK;
    }

    if (m === 'takwim') return rolePerm.canUpdateTakwimGlobal;
    
    if (m === 'jadual') {
      if (t === 'guru ganti') return rolePerm.canUpdateJadualGanti;
      if (t === 'guru kelas') return rolePerm.canUpdateJadualGuruKelas;
      if (t === 'jadual persendirian') return rolePerm.canUpdateJadualPersendirian;
      if (t === 'jadual kelas') return rolePerm.canUpdateJadualKelas;
      if (t === 'jadual berucap') return rolePerm.canUpdateJadualBerucap;
      if (t === 'jadual pemantauan') return rolePerm.canUpdateJadualPemantauan;
      return rolePerm.canUpdateJadualGlobal;
    }

    return false;
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, permissions, updatePermissions, activeTab, setActiveTab,
      announcements, addAnnouncement, programs, addProgram, updateProgram, deleteProgram,
      siteConfig, updateSiteConfig, schoolProfile, updateSchoolProfile, toastMessage, showToast,
      saveToCloud, loadFromCloud, isSyncing, checkPermission,
      rolePermissions, updateRolePermissions, userCredentials, updateUserCredentials
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
