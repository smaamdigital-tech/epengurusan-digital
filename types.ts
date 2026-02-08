export interface User {
  username: string;
  role: 'admin' | 'adminsistem' | null;
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

export interface ActionPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  save: boolean;
  download: boolean;
}

export type PermissionKey = 
  | 'dashboard' 
  | 'pengguna' 
  | 'jawatankuasa' 
  | 'tugasFungsi' 
  | 'program' 
  | 'dokumentasi' 
  | 'laporan' 
  | 'tetapan';

export type Permissions = Record<PermissionKey, ActionPermissions>;

export interface SiteConfig {
  systemTitle: string;
  schoolName: string;
  welcomeMessage: string;
  googleScriptUrl?: string;
}