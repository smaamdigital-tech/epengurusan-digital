
export type UserRole = 'adminsistem' | 'admin' | 'pengetua' | 'gpk_pentadbiran' | 'gpk_hem' | 'gpk_koko' | 'gkmp' | 'panitia' | 'guru' | 'su_pentadbir' | 'su_hem' | 'su_kuri' | 'su_koko' | null;

export interface User {
  username: string;
  role: UserRole;
  name: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  summary: string;
  views: number;
  likes: number;
}

export interface Program {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  description: string;
  image1?: string;
  image2?: string;
}

export interface SchoolProfile {
  pengetuaName: string;
  pengetuaQuote: string;
  pengetuaImage: string;
  schoolName: string;
  schoolCode: string;
  address: string;
  email: string;
  phone: string;
  location: string;
  visi: string;
  misi: string;
  piagam: string;
  moto: string;
  slogan: string;
  status: string;
  logoUrl?: string;
  stats: {
    lulusSpm: string;
    gred: string;
    guruTotal: number;
    guruLelaki: number;
    guruPerempuan: number;
    muridTotal: number;
    muridLelaki: number;
    muridPerempuan: number;
  };
}

export interface RolePermission {
  // Asas
  canUpdateProfil: boolean;
  canUpdateProgram: boolean;
  canUpdatePengumuman: boolean;
  // Pentadbiran
  canUpdatePentadbiranJK: boolean;
  canUpdatePentadbiranTakwim: boolean;
  // Kurikulum
  canUpdateKurikulumJK: boolean;
  canUpdateKurikulumTakwim: boolean;
  canUpdateKurikulumPeperiksaan: boolean;
  // HEM
  canUpdateHEMJK: boolean;
  canUpdateHEMTakwim: boolean;
  canUpdateHEMEnrolmen: boolean;
  // Kokurikulum
  canUpdateKokoJK: boolean;
  canUpdateKokoTakwim: boolean;
  // Global Takwim
  canUpdateTakwimGlobal: boolean;
  // Global Jadual (Submenu)
  canUpdateJadualGanti: boolean;
  canUpdateJadualGuruKelas: boolean;
  canUpdateJadualPersendirian: boolean;
  canUpdateJadualKelas: boolean;
  canUpdateJadualBerucap: boolean;
  canUpdateJadualPemantauan: boolean;
  canUpdateJadualGlobal: boolean;
}

export interface UserCredential {
  username: string;
  password: string;
  label: string;
}

export interface Permissions {
  pentadbiran: boolean;
  kurikulum: boolean;
  hem: boolean;
  kokurikulum: boolean;
  takwim: boolean;
  program: boolean;
  pengumuman: boolean;
  jadual: boolean;
}

export interface SiteConfig {
  systemTitle: string;
  schoolName: string;
  welcomeMessage: string;
  googleScriptUrl?: string;
}

export interface TeacherGroup {
  id: number;
  name: string;
  members: string[];
}

export interface SpeechScheduleItem {
  id: number;
  week: string;
  date: string;
  group: string;
  speaker: string;
  topic: string;
  civic: string;
  sumur: string;
}

export interface KokoActivity {
  id: number;
  date: string;
  activity: string;
}

export interface KokoAssemblyEvent {
  id: number;
  month: string;
  date: string;
  unit: string;
  notes: string;
}

export interface SumurEvent {
  id: number;
  date: string;
  program: string;
  teacher: string;
  activity: string;
}

export interface HipEvent {
  id: number;
  date: string;
  program: string;
  teacher: string;
  activity: string;
}

export interface ExamItem {
  id: number;
  date: string;
  dalaman?: string;
  jaj?: string;
  awam?: string;
  isHoliday?: boolean;
}

export interface DetailedScheduleRow {
  id: number;
  hari: string;
  tarikh: string;
  tarikhDisplay: string;
  slots: unknown[]; 
}
