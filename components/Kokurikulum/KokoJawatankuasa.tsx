import React, { useState, useRef } from 'react';

// Icons components (Lucide style)
const Download = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const Users = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const FileText = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const ChevronRight = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);


// Data
const menuItems = [
  { id: 1, label: "INDUK PENGURUSAN KOKURIKULUM SEKOLAH" },
  { id: 2, label: "PENILAIAN AKTIVITI JASMANI, SUKAN & KOKURIKULUM" },
  { id: 3, label: "BIMBINGAN PELAJAR SEKOLAH (JBPS)" },
  { id: 4, label: "BADAN BERUNIFORM" },
  { id: 5, label: "PERSATUAN DAN KELAB" },
  { id: 6, label: "FIRQAH" },
  { id: 7, label: "MAJLIS SUKAN SEKOLAH DAN 1M1S" },
  { id: 8, label: "RIMUP" },
];

const committeeData: Record<number, { role: string; position: string; name: string }[]> = {
  1: [
    { role: "Pengerusi", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Timb. Pengerusi", position: "PK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Naib Pengerusi 1", position: "PK Pentadbiran", name: "Noratikah binti Abd. Kadir" },
    { role: "Naib Pengerusi 2", position: "PK Hal Ehwal Murid", name: "Shaharer bin Hj Husain" },
    { role: "SU Kokurikulum", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Setiausaha Sukan", position: "-", name: "Zarith Najiha binti Jamal" },
    { role: "Penyelaras", position: "Unit Beruniform", name: "Siti Nurul Liza binti Sidin" },
    { role: "Penyelaras", position: "Kelab dan Persatuan", name: "Nurul Syafiqah binti Husin" },
    { role: "Penyelaras", position: "Sukan dan Permainan", name: "Zarith Najiha binti Jamal" },
    { role: "Penyelaras", position: "RIMUP", name: "Zulkifli bin Md Aspan" },
    { role: "AJK", position: "-", name: "Semua Ketua Guru Pemimpin Unit Beruniform" },
    { role: "AJK", position: "-", name: "Semua Ketua Guru Penasihat Kelab dan Persatuan" },
    { role: "AJK", position: "-", name: "Semua Ketua Guru Pembimbing Sukan dan Permainan" },
    { role: "AJK", position: "-", name: "Semua Ketua Penasihat Rumah Sukan" },
    { role: "AJK", position: "-", name: "JK Penilaian Kokurikulum" },
  ],
  2: [
    { role: "Pengerusi", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Timb. Pengerusi", position: "GPK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Naib Pengerusi 1", position: "GPK Pentadbiran", name: "Noratikah binti Abd. Kadir" },
    { role: "Naib Pengerusi 2", position: "GPK HEM", name: "Shaharer bin Hj Husain" },
    { role: "Setiausaha 1", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Setiausaha 2", position: "-", name: "Zarith Najiha binti Jamal" },
    { role: "AJK", position: "-", name: "Semua Guru Pemimpin Badan Beruniform" },
    { role: "AJK", position: "-", name: "Semua Guru Penasihat Persatuan dan Kelab" },
    { role: "AJK", position: "-", name: "Semua Guru Pembimbing Kelab 1M1S" },
    { role: "AJK", position: "-", name: "Pengurus Pasukan Sukan Sekolah" },
    { role: "AJK", position: "-", name: "Pembimbing Acara Ilmiah / Ko-Akademik" },
    { role: "AJK", position: "-", name: "Semua Ketua Firqah" },
    { role: "AJK", position: "-", name: "Semua Guru Kelas" },
  ],
  3: [
    { role: "Pengerusi", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Timb. Pengerusi", position: "PK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Setiausaha Kokurikulum", position: "-", name: "Shaharer bin Hj Husain" },
    { role: "Setiausaha Sukan", position: "-", name: "Zarith Najiha binti Jamal" },
    { role: "AJK", position: "Wakil PIBG", name: "Rashidi Fairuz bin Abd Hamid" },
    { role: "AJK", position: "Wakil Masyarakat", name: "-" },
    { role: "AJK", position: "Wakil JPS", name: "Abd Hamed bin Othman" },
    { role: "AJK", position: "Wakil Alumni", name: "Ilyas bin Yusof" },
    { role: "AJK", position: "Wakil Guru", name: "Nor Azean binti Ismail" },
    { role: "AJK", position: "Wakil PBDS", name: "Nurul Nadia binti Salehuddin" },
    { role: "AJK", position: "Wakil Pelajar", name: "Ketua Pelajar" },
  ],
  4: [
    { role: "Penasihat", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Pengerusi", position: "GPK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Setiausaha Kokurikulum", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Penyelaras Unit Berunifom", position: "-", name: "Siti Nurul Liza binti Sidin" },
    { role: "Ketua Penasihat", position: "Kadet Remaja Sekolah", name: "Mohd Nur bin Ahmad" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Nik Noorizati binti Ab Kahar" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Muhammad Hafiz bin Jalil" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Siti Aminah binti Mohamed" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Nuurul Amira binti Razak" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Ahmad Fikruddin bin Ahmad Raza'i" },
    { role: "Guru Penasihat", position: "Kadet Remaja Sekolah", name: "Masyitah binti Razali" },
    { role: "Ketua Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Mohamad Sukri bin Ali" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Мohammad Firros Bin Rosool Gani" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Nooraind binti Ali" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Mazuin binti Mat" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Liyana binti Iskandar" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Nor Ain binti Mohamed Jori" },
    { role: "Guru Penasihat", position: "Pergerakan Pengakap Malaysia", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
    { role: "Ketua Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Siti Nurul Liza binti Sidin" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Saemah binti Supandi" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Nor Azean binti Ismail" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Annur Ayuni binti Mohamed" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Zarith Najiha binti Jamal" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Nurul Syafiqah binti Husin" },
    { role: "Guru Penasihat", position: "Pergerakan Puteri Islam Malaysia", name: "Syahidatun Najihah binti Aziz" },
    { role: "Ketua Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Norliyana binti Mhd. Amin" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Zahrah Khairiah Nasution binti Saleh" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Nor Hidayah binti Mahadun" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Norashidah binti A Wahab" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Rosmawati @ Rohayati binti Hussin" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Nurul Izzati binti Roslin" },
    { role: "Guru Penasihat", position: "Pergerakan Pandu Puteri Malaysia", name: "Noorlela binti Zainudin" },
  ],
  5: [
    { role: "Penasihat", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Pengerusi", position: "GPK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Setiausaha Kokurikulum", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Penyelaras Persatuan dan Kelab", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Ketua Penasihat", position: "Persatuan Pendidikan Islam", name: "Saemah binti Supandi" },
    { role: "Guru Penasihat", position: "Persatuan Pendidikan Islam", name: "Siti Aminah binti Mohamed" },
    { role: "Guru Penasihat", position: "Persatuan Pendidikan Islam", name: "Masyitah binti Razali" },
    { role: "Ketua Penasihat", position: "Persatuan Bahasa Arab", name: "Nor Azean binti Ismail" },
    { role: "Guru Penasihat", position: "Persatuan Bahasa Arab", name: "Mohamad Sukri bin Ali" },
    { role: "Guru Penasihat", position: "Persatuan Bahasa Arab", name: "Norliyana binti Mhd. Amin" },
    { role: "Ketua Penasihat", position: "Persatuan Bahasa Melayu", name: "Rosmawati @ Rohayati binti Hussin" },
    { role: "Guru Penasihat", position: "Persatuan Bahasa Melayu", name: "Siti Nurul Liza binti Sidin" },
    { role: "Ketua Penasihat", position: "English Language Society", name: "Nik Noorizati binti Ab Kahar" },
    { role: "Guru Penasihat", position: "English Language Society", name: "Nor Ain binti Mohamed Jori" },
    { role: "Guru Penasihat", position: "English Language Society", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
    { role: "Ketua Penasihat", position: "Persatuan STEM", name: "Zahrah Khairiah Nasution binti Saleh" },
    { role: "Guru Penasihat", position: "Persatuan STEM", name: "Liyana binti Iskandar" },
    { role: "Guru Penasihat", position: "Persatuan STEM", name: "Nooraind binti Ali" },
    { role: "Guru Penasihat", position: "Persatuan STEM", name: "Norashidah binti A Wahab" },
    { role: "Ketua Penasihat", position: "Persatuan Teknik & Vokasional", name: "Mazuin binti Mat" },
    { role: "Guru Penasihat", position: "Persatuan Teknik & Vokasional", name: "Мohammad Firros Bin Rosool Gani" },
    { role: "Ketua Penasihat", position: "Persatuan Geografi, Cinta Alam dan Kitar Semula", name: "Nurul Syafiqah binti Husin" },
    { role: "Ketua Penasihat", position: "Kelab Komputer", name: "Noorlela binti Zainudin" },
    { role: "Guru Penasihat", position: "Kelab Komputer", name: "Syahidatun Najihah binti Aziz" },
    { role: "Ketua Penasihat", position: "Kelab Seni", name: "Norashidah binti A Wahab" },
    { role: "Guru Penasihat", position: "Kelab Seni", name: "Mohd Nur bin Ahmad" },
    { role: "Ketua Penasihat", position: "Kelab Tahfiz dan KKQ", name: "Salman bin A Rahman" },
    { role: "Guru Penasihat", position: "Kelab Tahfiz dan KKQ", name: "Annur Ayuni binti Mohamed" },
    { role: "Ketua Penasihat", position: "Kelab Sejarah dan Rukun Negara & Pencegahan Jenayah", name: "Nurul Izzati binti Roslin" },
    { role: "Guru Penasihat", position: "Kelab Sejarah dan Rukun Negara & Pencegahan Jenayah", name: "Ahmad Fikruddin bin Ahmad Raza'i" },
    { role: "Ketua Penasihat", position: "Kelab Pelaburan Bijak PNB & Kelab Usahawan Muda & Pengguna", name: "Nuurul Amira binti Razak" },
    { role: "Guru Penasihat", position: "Kelab Pelaburan Bijak PNB & Kelab Usahawan Muda & Pengguna", name: "Nor Hidayah binti Mahadun" },
  ],
  6: [
    { role: "Penasihat", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Pengerusi", position: "PK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Setiausaha Kokurikulum", position: "-", name: "Nurul Syafiqah Binti Husin" },
    { role: "Penyelaras Firqah", position: "-", name: "Nor Hidayah Binti Mahadun" },
    { role: "Ketua Penasihat", position: "Firqah Saidina Abu Bakar", name: "Masyitah binti Razali" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Muhammad Hafiz Bin Jalil" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Nuurul Amira Binti Razak" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Ahmad Fikruddin Bin Ahmad Raza'i" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Noorlela Binti Zainudin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Nurul Syafiqah Binti Husin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Abu Bakar", name: "Zulkifli Bin Md Aspan" },
    { role: "Ketua Penasihat", position: "Firqah Saidina Umar", name: "Syahidatun Najihah binti Aziz" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Nor Azean binti Ismail" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Zarith Najiha binti Jamal" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Norliyana binti Mhd. Amin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Annur Ayuni binti Mohamed" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Rosmawati @ Rohayati binti Hussin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Shaharer bin Hj Husain" },
    { role: "Guru Penasihat", position: "Firqah Saidina Umar", name: "Mohd Nor bin Salikin" },
    { role: "Ketua Penasihat", position: "Firqah Saidina Usman", name: "Nor Ain binti Mohamed Jori" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Norashidah binti A Wahab" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Zahrah Khairiah Nasution binti Saleh" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Salman bin A Rahman" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Saemah binti Supandi" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Nooraind binti Ali" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Siti Aminah binti Mohamed" },
    { role: "Guru Penasihat", position: "Firqah Saidina Usman", name: "Liyana binti Iskandar" },
    { role: "Ketua Penasihat", position: "Firqah Saidina Ali", name: "Nor Hidayah binti Mahadun" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Mohamad Sukri bin Ali" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Mohd Nur bin Ahmad" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Siti Nurul Liza binti Sidin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Mazuin binti Mat" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Nurul Izzati binti Roslin" },
    { role: "Guru Penasihat", position: "Firqah Saidina Ali", name: "Nik Noorizati binti Ab Kahar" },
  ],
  7: [
    { role: "Penasihat", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Pengerusi", position: "GPK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Setiausaha", position: "-", name: "Zarith Najiha binti Jamal" },
    { role: "Ketua Penasihat", position: "Kelab Sepak Takraw", name: "Mohamad Nasreen Hakim bin Che Mohamed" },
    { role: "Guru Penasihat", position: "Kelab Sepak Takraw", name: "Mohamad Sukri bin Ali" },
    { role: "Ketua Penasihat", position: "Kelab Bola Jaring", name: "Liyana binti Iskandar" },
    { role: "Guru Penasihat", position: "Kelab Bola Jaring", name: "Norliyana binti Mhd. Amin" },
    { role: "Guru Penasihat", position: "Kelab Bola Jaring", name: "Masyitah binti Razali" },
    { role: "Ketua Penasihat", position: "Kelab Bola Tampar", name: "Мohammad Firros Bin Rosool Gani" },
    { role: "Guru Penasihat", position: "Kelab Bola Tampar", name: "Annur Ayuni binti Mohamed" },
    { role: "Guru Penasihat", position: "Kelab Bola Tampar", name: "Nor Azean binti Ismail" },
    { role: "Ketua Penasihat", position: "Kelab Ping Pong", name: "Mohd Nor bin Salikin" },
    { role: "Guru Penasihat", position: "Kelab Ping Pong", name: "Siti Nurul Liza binti Sidin" },
    { role: "Guru Penasihat", position: "Kelab Ping Pong", name: "Noorlela binti Zainudin" },
    { role: "Ketua Penasihat", position: "Kelab Badminton", name: "Ahmad Fikruddin bin Ahmad Raza'i" },
    { role: "Guru Penasihat", position: "Kelab Badminton", name: "Saemah binti Supandi" },
    { role: "Guru Penasihat", position: "Kelab Badminton", name: "Norashidah binti A Wahab" },
    { role: "Ketua Penasihat", position: "Kelab Olahraga", name: "Nooraind binti Ali" },
    { role: "Guru Penasihat", position: "Kelab Olahraga", name: "Rosmawati @ Rohayati binti Hussin" },
    { role: "Guru Penasihat", position: "Kelab Olahraga", name: "Mazuin binti Mat" },
    { role: "Guru Penasihat", position: "Kelab Olahraga", name: "Syahidatun Najihah binti Aziz" },
    { role: "Guru Penasihat", position: "Kelab Olahraga", name: "Zahrah Khairiah Nasution Binti Saleh" },
    { role: "Guru Penasihat", position: "Kelab Olahraga", name: "Nor Ain binti Mohamed Jori" },
    { role: "Ketua Penasihat", position: "Kelab Catur", name: "Muhammad Hafiz bin Jalil" },
    { role: "Guru Penasihat", position: "Kelab Catur", name: "Nurul Syafiqah binti Husin" },
    { role: "Guru Penasihat", position: "Kelab Catur", name: "Nor Hidayah binti Mahadun" },
    { role: "Guru Penasihat", position: "Kelab Catur", name: "Nik Noorizati binti Ab Kahar" },
    { role: "Guru Penasihat", position: "Kelab Catur", name: "Nurul Izzati binti Roslin" },
    { role: "Ketua Penasihat", position: "Kelab Memanah", name: "Siti Aminah binti Mohamed" },
    { role: "Guru Penasihat", position: "Kelab Memanah", name: "Mohd Nur bin Ahmad" },
    { role: "Guru Penasihat", position: "Kelab Memanah", name: "Nuurul Amira binti Razak" },
  ],
  8: [
    { role: "Pengerusi", position: "Pengetua", name: "Zulkeffle bin Muhammad" },
    { role: "Timb. Pengerusi", position: "GPK Kokurikulum", name: "Zulkifli bin Md Aspan" },
    { role: "Naib Pengerusi 1", position: "PK Pentadbiran", name: "Noratikah binti Abd. Kadir" },
    { role: "Naib Pengerusi 2", position: "PK HEM", name: "Shaharer bin Hj Husain" },
    { role: "Setiausaha", position: "-", name: "Nurul Syafiqah binti Husin" },
    { role: "Ahli Jawatankuasa", position: "Sukan / Permainan", name: "Zarith Najiha binti Jamal" },
    { role: "Ahli Jawatankuasa", position: "Kurikulum", name: "Saemah binti Supandi" },
    { role: "Ahli Jawatankuasa", position: "Patriotisme", name: "Nooraind binti Ali" },
    { role: "Ahli Jawatankuasa", position: "Kebudayaan", name: "Siti Nurul Liza binti Sidin" },
    { role: "Ahli Jawatankuasa", position: "Khidmat Masyarakat", name: "Mazuin binti Mat" },
  ]
};

const tasksData: Record<number, string[]> = {
  1: [
    "Merancang, menyelaras dan melaksana gerak kerja kokurikulum dengan teratur dan terperinci dengan menggembleng tenaga golongan murid, guru dan bukan guru, ibu bapa dan masyarakat.",
    "Berusaha menyediakan kemudahan-kemudahan dan peralatan-peralatan gerak kerja kokurikulum.",
    "Berusaha meningkatkan lagi penyertaan murid, ibu bapa dan masyarakat.",
    "Berusaha mewujudkan semangat kekitaan di sekolah dan di kalangan masyarakat setempat terhadap sekolah.",
    "Berusaha menerapkan nilai-nilai sosial yang positif, membina sikap dan tabiat serta budi pekerti yang baik di kalangan murid.",
    "Memberi penghargaan terhadap murid dan pihak-pihak lain yang berusaha meningkatkan penglibatan dan prestasi gerak kerja kokurikulum.",
    "Menilai keberkesanan gerak kerja kokurikulum dari semasa ke semasa."
  ],
  2: [
    "Memastikan semua murid mempunyai rekod peribadi pentaksiran aktiviti jasmani, sukan dan kokurikulum semasa.",
    "Mentaksir penglibatan dan pencapaian murid mengikut unit masing-masing selayaknya.",
    "Menyerahkan rekod PAJSK murid kepada GPK Kokurikulum untuk pemantauan dan pengesahan.",
    "Menilai keberkesanan program terhadap penglibatan dan pencapaian murid dalam aktiviti kokurikulum di dalam dan luar sekolah."
  ],
  3: [
    "Memberi galakan kepada penglibatan murid dalam aktiiviti kokurikulum yang telah dirancang di peringkat sekolah sehingga ke peringkat tertinggi.",
    "Membantu menyumbang idea, masa dan dana dalam aktiviti kokurikulum sekolah melibatkan semua murid.",
    "Menghadirkan diri dalam majlis dan acara kokurikulum sekolah."
  ],
  4: [
    "Memastikan setiap murid didaftarkan di dalam unit beruniform sekolah.",
    "Setiap unit beruniform mempunyai sekurang-kurangnya satu platun ahli yang mahir berkawat kaki.",
    "Menganjurkan satu program perdana yang melibatkan murid-mudid baru dalam unit beruniform sekurang-kurangnya di peringkat sekolah seperti perkhemahan.",
    "Semua unit beruniform hendaklah berbakti kepada sekolah terutamanya semasa majlis-majlis rasmi dan membuat catatan dalam buku log masing – masing.",
    "Merancang aktiviti setiap kali perjumpaan berasaskan sukatan pelajaran unit masing – masing.",
    "Memastikan murid hadir dalam setiap perjumpaan.",
    "Bekerjasama dan mengenalpasti pihak luar yang dapat memberi pendedahan dan pengalaman kepada para murid.",
    "Memberi penghargaan dan insentif kepada murid yang mengharumkan nama sekolah.",
    "Memastikan semua aktiviti permainan dalam & luar sekolah sepanjang tahun 2019 didokumentasikan dari semasa ke semasa.",
    "Menyediakan laporan pencapaian bagi aktiviti yang telah dijalankan.",
    "Memastikan setiap ahli berada dalam platun yang ditetapkan.",
    "Pastikan papan kenyataan setiap unit dikemaskinikan."
  ],
  5: [
    "Memastikan setiap murid didaftarkan di dalam kelab atau persatuan yang telah dibahagikan.",
    "Merancang aktiviti tahunan persatuan / kelab.",
    "Penglibatan murid sekurang-kurangnya ke peringkat daerah.",
    "Dapat menyertai pertandingan peringkat daerah sekurang-kurangnya dalam dua acara dalam unit persatuan dan kelab.",
    "Melibatkan murid dalam aktiviti ko akademik semasa perhimpunan diadakan seperti pidato atau pengucapan awam.",
    "Bekerjasama dengan pihak luar yang dapat memberi pendedahan dan pengalaman kepada para murid.",
    "Memberi penghargaan dan insentif murid yang mengharumkan nama sekolah atau aktif di bidang kokurikulum.",
    "Memastikan semua aktiviti persatuan dalam dan luar sekolah sepanjang tahun didokumentasikan dari semasa dan semasa.",
    "Menyediakan laporan pencapaian bagi ahli persatuan / kelab cemerlang.",
    "Menanam nilai-nilai murni seperti kesopanan, patriotism dll dalam diri murid melalui aktiviti persatuan.",
    "Menganjurkan sesuatu aktiviti-aktiviti penghayatan sempena Hari Kemerdekaan mulai 15 Ogos hingga 15 September.",
    "Menyediakan satu papan kenyataan khas yang memberi informasi dan maklumat terkini.",
    "Berusaha untuk mengadakan jalinan aktiviti dengan sekolah lain atau badan-badan luar."
  ],
  6: [
    "Memastikan semua murid mendaftar sebagai ahli rumah sukan.",
    "Murid baru perlu didaftar oleh GPK atau SU sukan.",
    "Latihan rumah sukan diadakan 2 kali seminggu sehingga kejohanan diadakan.",
    "Semua murid wajib menyertai Kejohanan Merentas Desa peringkat sekolah.",
    "Semua murid digalakkan mengambil bahagian dalam acara sukantara.",
    "Setiap rumah sukan wajib mengambil bahagian dalan semua acara sukan peringkat sekolah."
  ],
  7: [
    "Memastikan semua murid didaftarkan di dalam kelab sukan dan permainan.",
    "Melaksanakan aktiviti tahunan yang telah dijadualkan dan dirancang.",
    "Merancang untuk melayakkan diri ke sukan permainan di peringkat daerah.",
    "Memperoleh penglibatan / pencapaian membanggakan di peringkat daerah.",
    "Mengadakan satu program khas untuk mencungkil pelapis dan bakat baru.",
    "Sentiasa bekerjasama dan mengenal pasti pihak luar yang dapat memberi pendedahan dan pengalaman kepada para pemain.",
    "Memberi penghargaan dan insentif kepada murid yang mengharumkan nama sekolah.",
    "Memastikan semua aktiviti permainan dalam & luar sekolah sepanjang sesi 2024/2025 didokumentasikan dari semasa ke semasa.",
    "Menyediakan laporan pencapaian bagi murid cemerlang."
  ],
  8: [
    "Perancangan dan Pelaksanaan: Merancang dan melaksanakan aktiviti tahunan yang melibatkan murid pelbagai kaum, guru, dan masyarakat setempat.",
    "Pemantauan Program: Memantau perjalanan aktiviti bagi memastikan objektif perpaduan tercapai.",
    "Mesyuarat: Mengadakan mesyuarat Jawatankuasa RIMUP (peringkat sekolah atau kelompok) sekurang-kurangnya dua kali setahun.",
    "Dokumentasi dan Laporan: Menyediakan laporan aktiviti, dokumentasi program, dan mengemas kini fail untuk diserahkan kepada PPD atau Jabatan Pendidikan.",
    "Perhubungan: Menjalin kerjasama dengan pihak luar (PIBG/Agensi Luar) bagi memperkukuh program perpaduan."
  ]
};

export const KokoJawatankuasa: React.FC = () => {
  const [activeItem, setActiveItem] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  const activeLabel = menuItems.find(item => item.id === activeItem)?.label || "";
  const activeMembers = committeeData[activeItem] || [];
  const activeTasks = tasksData[activeItem] || [];

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    setIsGenerating(true);

    const generate = () => {
        // Inject style to expand scrollable areas for PDF
        const style = document.createElement('style');
        style.innerHTML = `
            #pdf-content .overflow-y-auto {
                overflow: visible !important;
                height: auto !important;
            }
            #pdf-content .h-full {
                height: auto !important;
            }
            #pdf-content .min-h-screen {
                min-height: 0 !important;
            }
        `;
        document.head.appendChild(style);

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Jawatankuasa_Kokurikulum_${activeLabel.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        (window as any).html2pdf().set(opt).from(element).save().then(() => {
            setIsGenerating(false);
            document.head.removeChild(style);
        }).catch((err: any) => {
            console.error(err);
            setIsGenerating(false);
            document.head.removeChild(style);
            alert("Ralat menjana PDF.");
        });
    };

    if (typeof (window as any).html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = generate;
        document.body.appendChild(script);
    } else {
        generate();
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-transparent">
      <div ref={contentRef} id="pdf-content" className="min-h-screen bg-transparent">
        <header className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left w-full">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold tracking-wider text-black uppercase mb-1">
                  <span>Kokurikulum</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Jawatankuasa</span>
                </div>
                <h1 className="text-2xl font-bold text-black text-center md:text-left">Pengurusan Jawatankuasa Kokurikulum</h1>
                <p className="text-sm text-black mt-1 text-center md:text-left">Senarai jawatankuasa dan ahli bagi unit Kokurikulum.</p>
              </div>
              <button 
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                data-html2canvas-ignore="true"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Menjana...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Muat Turun PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div 
                className="bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-950 rounded-xl shadow-sm border border-blue-700 p-6 text-center text-white"
                data-print-style="dark"
              >
                <div className="text-4xl font-bold text-white mb-1">{menuItems.length}</div>
                <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Senarai Jawatankuasa</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id)}
                      className={`text-left px-5 py-3.5 text-sm font-medium transition-all border-l-4 ${
                        activeItem === item.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.id}. {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div 
                  className="px-6 py-5 border-b border-blue-800 bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 rounded-t-xl shadow-inner"
                  data-print-style="dark"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Organisasi</span>
                    <h2 className="text-lg font-bold text-yellow-400 uppercase">Jawatankuasa {activeLabel}</h2>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div 
                    className="grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-[#7E57C2] via-[#42A5F5] to-[#26C6DA] border-b border-gray-100 text-xs font-semibold text-white uppercase tracking-wider"
                    data-print-style="gradient"
                  >
                    <div className="col-span-3">Peranan</div>
                    <div className="col-span-4">Jawatan</div>
                    <div className="col-span-5">Nama Guru</div>
                  </div>

                  {activeMembers.length > 0 ? (
                    <div className="overflow-y-auto">
                      {activeMembers.map((member, index) => {
                        let positionStyle = "text-gray-600";
                        if (activeItem === 6) {
                          const pos = member.position.toLowerCase();
                          if (pos.includes("abu bakar")) positionStyle = "text-green-600 font-bold";
                          else if (pos.includes("umar")) positionStyle = "text-blue-600 font-bold";
                          else if (pos.includes("usman")) positionStyle = "text-yellow-600 font-bold";
                          else if (pos.includes("ali")) positionStyle = "text-red-600 font-bold";
                        } else if (activeItem === 4) {
                          const pos = member.position.toLowerCase();
                          if (pos.includes("kadet remaja")) positionStyle = "text-emerald-700 font-bold";
                          else if (pos.includes("pengakap")) positionStyle = "text-slate-600 font-bold";
                          else if (pos.includes("puteri islam")) positionStyle = "text-pink-600 font-bold";
                          else if (pos.includes("pandu puteri")) positionStyle = "text-blue-600 font-bold";
                        } else if (activeItem === 7) {
                          const pos = member.position.toLowerCase();
                          if (pos.includes("sepak takraw")) positionStyle = "text-orange-600 font-bold";
                          else if (pos.includes("bola jaring")) positionStyle = "text-pink-600 font-bold";
                          else if (pos.includes("bola tampar")) positionStyle = "text-blue-600 font-bold";
                          else if (pos.includes("ping pong")) positionStyle = "text-green-600 font-bold";
                          else if (pos.includes("badminton")) positionStyle = "text-purple-600 font-bold";
                          else if (pos.includes("olahraga")) positionStyle = "text-red-600 font-bold";
                          else if (pos.includes("catur")) positionStyle = "text-slate-700 font-bold";
                          else if (pos.includes("memanah")) positionStyle = "text-amber-700 font-bold";
                        } else if (activeItem === 5) {
                          const pos = member.position.toLowerCase();
                          
                          if (pos.includes("pendidikan islam")) positionStyle = "text-emerald-700 font-bold";
                          else if (pos.includes("bahasa arab")) positionStyle = "text-amber-600 font-bold";
                          else if (pos.includes("bahasa melayu")) positionStyle = "text-red-600 font-bold";
                          else if (pos.includes("english language")) positionStyle = "text-blue-700 font-bold";
                          else if (pos.includes("stem")) positionStyle = "text-purple-600 font-bold";
                          else if (pos.includes("teknik")) positionStyle = "text-orange-600 font-bold";
                          else if (pos.includes("geografi")) positionStyle = "text-teal-600 font-bold";
                          else if (pos.includes("komputer")) positionStyle = "text-cyan-600 font-bold";
                          else if (pos.includes("seni")) positionStyle = "text-pink-600 font-bold";
                          else if (pos.includes("tahfiz")) positionStyle = "text-green-800 font-bold";
                          else if (pos.includes("sejarah")) positionStyle = "text-yellow-700 font-bold";
                          else if (pos.includes("pelaburan") || pos.includes("usahawan")) positionStyle = "text-indigo-600 font-bold";
                          else if (pos.includes("persatuan") || pos.includes("society")) positionStyle = "text-blue-600 font-bold"; // Fallback
                          else if (pos.includes("kelab")) positionStyle = "text-emerald-600 font-bold"; // Fallback
                        }

                        return (
                          <div 
                            key={index} 
                            className={`grid grid-cols-12 gap-4 px-6 py-4 text-sm border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                            }`}
                          >
                            <div className="col-span-3 font-medium text-indigo-900">{member.role}</div>
                            <div className={`col-span-4 ${positionStyle}`}>{member.position}</div>
                            <div className="col-span-5 font-medium text-gray-900">{member.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Tiada ahli direkodkan</h3>
                      <p className="text-xs text-gray-500 max-w-xs">
                        Belum ada ahli jawatankuasa yang dilantik untuk unit ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div 
                  className="px-6 py-5 border-b border-blue-800 bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 rounded-t-xl shadow-inner"
                  data-print-style="dark"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Tugas & Fungsi</span>
                    <h2 className="text-sm font-bold text-yellow-400 uppercase">Jawatankuasa {activeLabel}</h2>
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-6">
                  {activeTasks.length > 0 ? (
                    <ul className="space-y-4">
                      {activeTasks.map((task, index) => (
                        <li key={index} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                            {index + 1}
                          </span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px]">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Tiada maklumat fungsi ditetapkan.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
