
import { NewsItem, Teacher } from './types';

export const SCHOOL_NAME = "Sekolah Kebangsaan Gemilang";
export const SCHOOL_SLOGAN = "Ilmu Penyuluh Hidup, Akhlak Membentuk Peribadi";

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Kejayaan Pasukan Robotik Sekolah di Peringkat Kebangsaan',
    date: '15 Mei 2024',
    category: 'Akademik',
    summary: 'Pasukan robotik SK Gemilang berjaya merangkul pingat emas dalam Pertandingan Robotik Kebangsaan yang berlangsung di Kuala Lumpur.',
    image: 'https://picsum.photos/seed/robotics/800/600'
  },
  {
    id: '2',
    title: 'Hari Sukan Tahunan SK Gemilang 2024',
    date: '2 Jun 2024',
    category: 'Sukan',
    summary: 'Kemeriahan sukan tahunan dengan semangat kesukanan yang tinggi dikalangan murid dan guru.',
    image: 'https://picsum.photos/seed/sports/800/600'
  },
  {
    id: '3',
    title: 'Program Motivasi Kecemerlangan UPSR',
    date: '20 Jun 2024',
    category: 'Akademik',
    summary: 'Pakar motivasi jemputan memberikan tips dan teknik menjawab soalan kepada murid-murid tahun 6.',
    image: 'https://picsum.photos/seed/study/800/600'
  }
];

export const TEACHERS: Teacher[] = [
  {
    name: "En. Ahmad Zaki bin Ibrahim",
    position: "Guru Besar",
    image: "https://i.pravatar.cc/150?u=ahmad"
  },
  {
    name: "Pn. Sarah binti Abdullah",
    position: "GPK Pentadbiran",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "En. Lim Wei Kiat",
    position: "GPK Hal Ehwal Murid",
    image: "https://i.pravatar.cc/150?u=lim"
  },
  {
    name: "Pn. Kavitha Rajan",
    position: "GPK Kokurikulum",
    image: "https://i.pravatar.cc/150?u=kavitha"
  }
];
