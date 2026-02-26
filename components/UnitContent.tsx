
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

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

// --- HELPER FUNCTIONS ---
const generateRangeItems = (start: string, end: string, event: string) => {
    const sParts = start.split('-').map(Number);
    const eParts = end.split('-').map(Number);
    const sDate = new Date(sParts[2], sParts[1]-1, sParts[0]);
    const eDate = new Date(eParts[2], eParts[1]-1, eParts[0]);
    const items = [];
    
    const loop = new Date(sDate);
    while (loop <= eDate) {
        const d = String(loop.getDate()).padStart(2, '0');
        const m = String(loop.getMonth() + 1).padStart(2, '0');
        const y = loop.getFullYear();
        const dateId = parseInt(`${y}${m}${d}`);
        items.push({
            id: dateId * 1000 + Math.floor(Math.random() * 999), 
            event: event,
            date: `${d}-${m}-${y}`,
            status: 'Akan Datang'
        });
        loop.setDate(loop.getDate() + 1);
    }
    return items;
};

// Helper to render exam cell content with bullets
const renderExamCell = (content: string, colorClass: string) => {
    if (!content) return null;
    return (
        <div className={`text-left align-top leading-tight break-words ${colorClass} font-semibold whitespace-pre-wrap`}>
            {content.split('\n').map((line, i) => {
                let displayLine = line;
                if (line.trim() === 'PPT') displayLine = 'Peperiksaan Pertengahan Tahun';
                else if (line.trim() === 'UASA') displayLine = 'Ujian Akhir Sesi Akademik';
                
                return (
                    <div key={i} className="flex gap-1.5 items-start">
                        <span className="text-white mt-1 text-[6px]">•</span> 
                        <span>{displayLine}</span>
                    </div>
                );
            })}
        </div>
    );
};

// --- TEACHER LIST ---
const TEACHER_FULL_NAMES = [
    "ZULKEFFLE BIN MUHAMMAD", "NORATIKAH ABD. KADIR", "SHAHARER BIN HJ HUSAIN", "ZULKIFLI BIN MD ASPAN",
    "ROSMAWATI @ ROHAYATI BINTI HUSSIN", "ZAHRAH KHAIRIAH NASUTION BINTI SALEH", "MAZUIN BINTI MAT",
    "NOORAIND BINTI ALI", "SAEMAH BINTI SUPANDI", "NOR AZEAN BINTI ISMAIL", "AHMAD FIKRUDDIN BIN AHMAD RAZA'I",
    "MOHAMMAD FIRROS BIN ROSOOL GANI", "LIYANA BINTI ISKANDAR", "MOHAMAD NASREEN HAKIM BIN CHE MOHAMED",
    "NIK NOORIZATI BINTI AB KAHAR", "NORASHIDAH BINTI A WAHAB", "NOR AIN BINTI MOHAMED JORI",
    "NURUL IZZATI BINTI ROSLIN", "NURUL SYAFIQAH BINTI HUSIN", "SITI NURUL LIZA BINTI SIDIN",
    "MUHAMMAD HAFIZ BIN JALIL", "NUURUL AMIRA BINTI RAZAK", "NOORLELA BINTI ZAINUDIN",
    "ANNUR AYUNI BINTI MOHAMED", "SALMAN BIN A RAHMAN", "MOHD NUR BIN AHMAD", "NOR HIDAYAH BINTI MAHADUN",
    "MASYITAH BINTI RAZALI", "MOHAMAD SUKRI BIN ALI", "MOHD NOR BIN SALIKIN", "NORLIYANA BINTI MHD. AMIN",
    "SITI AMINAH BINTI MOHAMED", "SYAHIDATUN NAJIHAH BINTI AZIZ", "ZARITH NAJIHA BINTI JAMAL",
    "ISLAHUDDIN BIN MUCHTAR", "NURULASHIQIN BINTI RAZALI"
];

const PENTADBIRAN_JK_LIST = [
  "Jawatankuasa Pengurusan & Pentadbiran",
  "Jawatankuasa Kewangan & Akaun",
  "Jawatankuasa Pembangunan & Penyelenggaraan",
  "Jawatankuasa Latihan Personel",
  "Jawatankuasa Pengurusan Maklumat Sekolah (JPMS)",
  "Jawatankuasa Aset Alih Kerajaan (JKPA)",
  "Jawatankuasa SKPM Kualiti @ Sekolah",
  "Jawatankuasa PBPPP",
  "Jawatankuasa Bencana Sekolah",
  "Jawatankuasa Pengurusan Sumber Manusia",
  "Jawatankuasa PIBG",
  "Jawatankuasa Kajian Tindakan",
  "Jawatankuasa Pemandu KBAT",
  "Jawatankuasa Pemandu TS25"
];

const KURIKULUM_JK_LIST = [
  "Jawatankuasa Induk Kurikulum",
  "Jawatankuasa Panitia Mata Pelajaran",
  "Jawatankuasa Pentaksiran & Peperiksaan",
  "Jawatankuasa Pusat Sumber Sekolah",
  "Jawatankuasa Jadual Waktu",
  "Jawatankuasa Kecemerlangan Akademik",
  "Jawatankuasa Pencerapan",
  "Jawatankuasa Semakan Buku Latihan"
];

const HEM_JK_LIST = [
  "Jawatankuasa Pengurusan Hal Ehwal Murid",
  "Jawatankuasa 3K (Keselamatan, Kesihatan Dan Keceriaan)",
  "Jawatankuasa Biasiswa Dan Bantuan Murid",
  "Jawatankuasa Buli Dan Gangguan Seksual",
  "Jawatankuasa Karektor Murid Johor",
  "Jawatankuasa Pengurusan Asrama",
  "Jawatankuasa Pengurusan Disiplin Murid",
  "Jawatankuasa Pengurusan Kelas",
  "Jawatankuasa Perhimpunan Dan Pengumuman Harian",
  "Jawatankuasa Skim Pinjaman Buku Teks (SPBT)",
  "Jawatankuasa Student Leader Board",
  "Jawatankuasa Sumur Dan Badar",
  "Jawatankuasa Surau Ar-Rasyidin",
  "Jawatankuasa Unit Bimbingan Dan Kaunseling",
  "Jawatankuasa Unit Dan Sistem Maklumat HEM"
];

const KOKO_JK_LIST = [
  "Jawatankuasa Induk Kokurikulum",
  "Jawatankuasa Unit Beruniform",
  "Jawatankuasa Kelab & Persatuan",
  "Jawatankuasa Sukan & Permainan",
  "Jawatankuasa Majlis Sukan Sekolah",
  "Jawatankuasa Pembangunan Sukan",
  "Jawatankuasa Penilaian PAJSK",
  "Jawatankuasa Koperasi Sekolah"
];

// --- SPECIFIC HOLIDAYS FOR KURIKULUM ANNUAL VIEW ---
const SCHOOL_HOLIDAYS = [
    { id: 1001, event: 'Cuti Penggal 1', date: '21 – 29 Mac 2026' },
    { id: 1002, event: 'Cuti Pertengahan Tahun', date: '23.05.2026 – 07.06.2026' },
    { id: 1003, event: 'Cuti Penggal 2', date: '29.08.2026 – 06.09.2026' },
    { id: 1004, event: 'Cuti Akhir Persekolahan', date: '01.12.2026 – 31.12.2026' },
];

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
    { id: 11, week: '11', date: '30 Mac – 3 Apr 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)' },
    { id: 12, week: '12', date: '6 – 10 Apr 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)' },
    { id: 13, week: '13', date: '13 – 17 Apr 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)' },
    { id: 14, week: '14', date: '20 – 24 Apr 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)' },
    { id: 15, week: '15', date: '27 Apr – 1 Mei 2026', dalaman: '1 Mei (Hari Pekerja)', jaj: '1 Mei (Hari Pekerja)', awam: '1 Mei (Hari Pekerja)\nKerja Kursus Al-Syariah (5402/2)' },
    { id: 16, week: '16', date: '4 – 8 Mei 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 17, week: '17', date: '11 – 15 Mei 2026', dalaman: 'PPT', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 18, week: '18', date: '18 – 22 Mei 2026', dalaman: 'PPT', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 1002, week: '', date: '23.05.2026 – 07.06.2026', dalaman: 'CUTI PERTENGAHAN TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 19, week: '19', date: '8 – 12 Jun 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 20, week: '20', date: '15 – 19 Jun 2026', dalaman: '17 Jun (Awal Muharram)', jaj: '17 Jun (Awal Muharram)', awam: '17 Jun (Awal Muharram)\nKerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 21, week: '21', date: '22 – 26 Jun 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 22, week: '22', date: '29 Jun – 3 Jul 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 23, week: '23', date: '6 – 10 Jul 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 24, week: '24', date: '13 – 17 Jul 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 25, week: '25', date: '20 – 24 Jul 2026', dalaman: '21 Jul (Hari Hol — Johor)', jaj: '21 Jul (Hari Hol — Johor)', awam: '21 Jul (Hari Hol — Johor)\nKerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 26, week: '26', date: '27 – 31 Jul 2026', dalaman: '', jaj: '', awam: 'Kerja Kursus Al-Syariah (5402/2)\nKerja Kursus Perniagaan (3766/3)' },
    { id: 27, week: '27', date: '3 – 7 Ogos 2026', dalaman: '', jaj: '03 – 12 Ogos 2026: Peperiksaan SIB', awam: 'Kerja Kursus Perniagaan (3766/3)' },
    { id: 28, week: '28', date: '10 – 14 Ogos 2026', dalaman: '', jaj: '03 – 12 Ogos 2026: Peperiksaan SIB', awam: 'Lisan Manahij Al-Ulum Al-Islamiah (5404/2)' },
    { id: 29, week: '29', date: '17 – 21 Ogos 2026', dalaman: '', jaj: '17 – 28 Ogos 2026: Peperiksaan SMRA\n17 – 28 Ogos 2026: Peperiksaan SMA', awam: 'Lisan Al-Adab wa Al-Balaghah (5405/2)' },
    { id: 30, week: '30', date: '24 – 28 Ogos 2026', dalaman: '', jaj: '17 – 28 Ogos 2026: Peperiksaan SMRA\n17 – 28 Ogos 2026: Peperiksaan SMA', awam: 'Lisan Usul Al-Din (5401/2)' },
    { id: 1003, week: '', date: '29.08.2026 – 06.09.2026', dalaman: 'Cuti Penggal 2', jaj: '', awam: '', isHoliday: true },
    { id: 31, week: '31', date: '7 – 11 Sep 2026', dalaman: '', jaj: '07 – 14 September 2026: Peperiksaan SDEA', awam: 'Lisan Al-Lughah Al-‘Arabiah Al-Mu‘asirah (5403/2)' },
    { id: 32, week: '32', date: '14 – 18 Sep 2026', dalaman: '16 Sept (Hari Malaysia)', jaj: '07 – 14 September 2026: Peperiksaan SDEA\n12 – 19 September 2026: Peperiksaan SDKA\n14 – 23 September 2026: Peperiksaan SMA\n16 Sept (Hari Malaysia)', awam: '16 Sept (Hari Malaysia)' },
    { id: 33, week: '33', date: '21 – 25 Sep 2026', dalaman: '', jaj: '14 – 23 September 2026: Peperiksaan SMA', awam: '' },
    { id: 34, week: '34', date: '28 Sep – 2 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 35, week: '35', date: '5 – 9 Okt 2026', dalaman: '', jaj: '05 – 07 Oktober 2026: Peperiksaan SMRA', awam: '' },
    { id: 36, week: '36', date: '12 – 16 Okt 2026', dalaman: '', jaj: '12 – 16 Oktober 2026: Peperiksaan SMA', awam: '' },
    { id: 37, week: '37', date: '19 – 23 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 38, week: '38', date: '26 – 30 Okt 2026', dalaman: 'UASA', jaj: '', awam: '' },
    { id: 39, week: '39', date: '2 – 6 Nov 2026', dalaman: 'UASA', jaj: '', awam: '' },
    { id: 40, week: '40', date: '9 – 13 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 41, week: '41', date: '16 – 20 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 42, week: '42', date: '23 – 27 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 43, week: '43', date: '30 Nov – 4 Dis 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1004, week: '', date: '01.12.2026 – 31.12.2026', dalaman: 'Cuti Akhir Persekolahan Tahun 2026', jaj: '', awam: '', isHoliday: true }
];

// --- INITIAL KURIKULUM TAKWIM DATA ---
const INITIAL_KURIKULUM_TAKWIM_DATA = [
    { id: 20260108, event: "Mesyuarat Pentadbiran & Kurikulum", date: "08-01-2026", status: "Selesai" },
    { id: 20260111, event: "Pendaftaran", date: "11-01-2026", status: "Selesai" },
    { id: 20260112, event: "Mesyuarat Panitia 1", date: "12-01-2026", status: "Selesai" },
    { id: 20260113, event: "PLC Panitia", date: "13-01-2026", status: "Selesai" },
    { id: 20260127, event: "PLC Panitia", date: "27-01-2026", status: "Selesai" },
    { id: 20260201, event: "PLC Panitia", date: "01-02-2026", status: "Akan Datang" },
    { id: 20260210, event: "PLC Panitia", date: "10-02-2026", status: "Akan Datang" },
    ...generateRangeItems("17-02-2026", "18-02-2026", "Tahun Baru Cina"),
    { id: 20260219, event: "Awal Ramadan", date: "19-02-2026", status: "Akan Datang" },
    { id: 20260310, event: "PLC Panitia", date: "10-03-2026", status: "Akan Datang" },
    ...generateRangeItems("24-03-2026", "30-03-2026", "Cuti Penggal 1"),
    { id: 20260414, event: "Mesyuarat Kurikulum 2", date: "14-04-2026", status: "Akan Datang" },
    ...generateRangeItems("21-04-2026", "23-04-2026", "Hari Raya Aidilfitri"),
    { id: 20260505, event: "PLC Panitia", date: "05-05-2026", status: "Akan Datang" },
    ...generateRangeItems("11-05-2026", "22-05-2026", "PPT"),
    ...generateRangeItems("23-05-2026", "30-05-2026", "Cuti Pertengahan Tahun"),
    { id: 20260606, event: "PLC Panitia", date: "06-06-2026", status: "Akan Datang" },
    { id: 20260615, event: "Ujian Isbat Tahfiz 1", date: "15-06-2026", status: "Akan Datang" },
    { id: 20260627, event: "Hari Raya Haji", date: "27-06-2026", status: "Akan Datang" },
    { id: 20260701, event: "PLC Panitia", date: "01-07-2026", status: "Akan Datang" },
    { id: 20260713, event: "Mesyuarat Kurikulum 3", date: "13-07-2026", status: "Akan Datang" },
    { id: 20260721, event: "Hari Hol Almarhum Sultan Iskandar", date: "21-07-2026", status: "Akan Datang" },
    { id: 20260806, event: "PLC Panitia", date: "06-08-2026", status: "Akan Datang" },
    { id: 20260808, event: "PLC Panitia", date: "08-08-2026", status: "Akan Datang" },
    { id: 20260831, event: "Hari Kebangsaan", date: "31-08-2026", status: "Akan Datang" },
    { id: 20260916, event: "Hari Malaysia", date: "16-09-2026", status: "Akan Datang" },
    { id: 20260920, event: "PLC Panitia", date: "20-09-2026", status: "Akan Datang" },
    ...generateRangeItems("29-09-2026", "30-09-2026", "Cuti Penggal 2"),
    ...generateRangeItems("02-10-2026", "04-10-2026", "UASA"),
    { id: 20261008, event: "Hari Deepavali", date: "08-10-2026", status: "Akan Datang" },
    ...generateRangeItems("19-10-2026", "23-10-2026", "Ujian Isbat Tahfiz 2"),
    { id: 20261025, event: "Maulidur Rasul", date: "25-10-2026", status: "Akan Datang" },
    ...generateRangeItems("01-12-2026", "31-12-2026", "Cuti Akhir Tahun")
];

const INITIAL_HEM_TAKWIM_DATA = [
    { id: 20260106, event: "Mesyuarat HEM 1", date: "09-01-2026", status: "Selesai" },
    { id: 20260107, event: "Mesyuarat HEM 2", date: "07-04-2026", status: "Akan Datang" },
    { id: 20260111, event: "Pendaftaran", date: "11-01-2026", status: "Selesai" },
    ...generateRangeItems("17-02-2026", "18-02-2026", "Tahun Baru Cina"),
    { id: 20260219, event: "Awal Ramadan", date: "19-02-2026", status: "Akan Datang" },
    { id: 20260312, event: "3K Gotong-royong", date: "12-03-2026", status: "Akan Datang" },
    { id: 20260313, event: "Iftar Jamaei dan Majlis Khatam al-Quran", date: "13-03-2026", status: "Akan Datang" },
    ...generateRangeItems("21-03-2026", "29-03-2026", "Cuti Penggal 1"),
    ...generateRangeItems("21-04-2026", "23-04-2026", "Hari Raya Aidilfitri"),
    { id: 20260520, event: "Kem Kepimpinan 1", date: "20-05-2026", status: "Akan Datang" },
    ...generateRangeItems("23-05-2026", "07-06-2026", "Cuti Penggal 2"),
    { id: 202606062, event: "Mesyuarat HEM 3", date: "06-06-2026", status: "Akan Datang" },
    { id: 20260620, event: "Kem Kepimpinan 2", date: "20-06-2026", status: "Akan Datang" },
    { id: 20260627, event: "Hari Raya Haji", date: "27-06-2026", status: "Akan Datang" },
    { id: 20260706, event: "Mesyuarat HEM 4", date: "06-07-2026", status: "Akan Datang" },
    { id: 20260721, event: "Hari Hol Almarhum Sultan Iskandar", date: "21-07-2026", status: "Akan Datang" },
    { id: 20260831, event: "Hari Kebangsaan", date: "31-08-2026", status: "Akan Datang" },
    { id: 20260916, event: "Hari Malaysia", date: "16-09-2026", status: "Akan Datang" },
    { id: 20260928, event: "Sambutan Maulidur Rasul Peringkat Sekolah", date: "28-09-2026", status: "Akan Datang" },
    ...generateRangeItems("29-08-2026", "06-09-2026", "Cuti Pertengahan Tahun"),
    { id: 20261008, event: "Hari Deepavali", date: "08-10-2026", status: "Akan Datang" },
    { id: 20261025, event: "Maulidur Rasul", date: "25-10-2026", status: "Akan Datang" },
    ...generateRangeItems("02-12-2026", "31-12-2026", "Cuti Akhir Persekolahan Tahun"),
    { id: 20261225, event: "Hari Krismas", date: "25-12-2026", status: "Akan Datang" }
];

const INITIAL_HEM_JK_DATA = [
  { id: 1, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad', committeeId: 'jk_hem_0' },
  { id: 2, role: 'Timbalan Pengerusi', position: 'GPK Hal Ehwal Murid', teacherName: 'Shaharer bin Hj Husain', committeeId: 'jk_hem_0' },
  { id: 3, role: 'Naib Pengerusi 1', position: 'GPK Pentadbiran', teacherName: 'Noratikah binti Abd. Kadir', committeeId: 'jk_hem_0' },
  { id: 4, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'Zulkifli bin Md Aspan', committeeId: 'jk_hem_0' },
  { id: 5, role: 'Setiausaha', position: 'Setiausaha Pengurusan Hal Ehwal Murid', teacherName: 'Norliyana binti Mhd. Amin', committeeId: 'jk_hem_0' },
  { id: 6, role: 'AJK', position: 'Guru Disiplin', teacherName: 'Salman bin A Rahman', committeeId: 'jk_hem_0' },
  { id: 7, role: 'AJK', position: 'Penyelaras MPP dan Lembaga Pengawas', teacherName: 'Mohammad Firros Bin Rosool Gani', committeeId: 'jk_hem_0' },
  { id: 8, role: 'AJK', position: 'Penyelaras Perhimpunan dan Pengumuman Harian', teacherName: 'Nor Azean binti Ismail', committeeId: 'jk_hem_0' },
  { id: 9, role: 'AJK', position: 'Guru Bimbingan & Kaunseling', teacherName: 'Muhammad Hafiz bin Jalil', committeeId: 'jk_hem_0' },
  { id: 10, role: 'AJK', position: 'Guru Biasiswa dan Bantuan Murid', teacherName: 'Annur Ayuni binti Mohamed', committeeId: 'jk_hem_0' },
  { id: 11, role: 'AJK', position: 'Penyelaras SUMUR', teacherName: 'Saemah binti Supandi', committeeId: 'jk_hem_0' },
  { id: 12, role: 'AJK', position: 'Penyelaras SPBT', teacherName: "Ahmad Fikruddin bin Ahmad Raza'i", committeeId: 'jk_hem_0' },
  { id: 13, role: 'AJK', position: 'Pengurusan Kantin', teacherName: 'Islahuddin bin Muchtar', committeeId: 'jk_hem_0' },
  { id: 14, role: 'AJK', position: 'Pengurusan Pencegahan Jenayah, Dadah dan Denggi', teacherName: 'Mohd Nur bin Ahmad', committeeId: 'jk_hem_0' },
  { id: 15, role: 'AJK', position: 'Pengurusan 3K  (Kesihatan, Kebersihan & keselamatan)', teacherName: 'Mohd Nor bin Salikin', committeeId: 'jk_hem_0' },
  { id: 16, role: 'AJK', position: 'Pengurusan Unit Pendaftaran dan Rekod', teacherName: 'Nurulashiqin binti Razali', committeeId: 'jk_hem_0' },
  { id: 17, role: 'AJK', position: 'Pengurusan Unit Data (IDME)', teacherName: 'Noorlela binti Zainudin', committeeId: 'jk_hem_0' },
  { id: 18, role: 'AJK', position: 'Ketua Warden', teacherName: 'Salman bin A Rahman', committeeId: 'jk_hem_0' },
];

const INITIAL_HEM_3K_DATA = [
  { id: 101, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad', committeeId: 'jk_hem_1' },
  { id: 102, role: 'Timbalan Pengerusi', position: 'GPK Hal Ehwal Murid', teacherName: 'Shaharer bin Hj Husain', committeeId: 'jk_hem_1' },
  { id: 103, role: 'Naib Pengerusi 1', position: 'GPK Pentadbiran', teacherName: 'Noratikah binti Abd. Kadir', committeeId: 'jk_hem_1' },
  { id: 104, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'Zulkifli bin Md Aspan', committeeId: 'jk_hem_1' },
  { id: 105, role: 'Penyelaras', position: 'Pengurusan 3K (Kesihatan, Kebersihan & keselamatan)', teacherName: 'Mohd Nor bin Salikin', committeeId: 'jk_hem_1' },
  { id: 106, role: 'AJK', position: 'Pengurusan Program Kesihatan / Covid-19', teacherName: 'Mohd Nur bin Ahmad', committeeId: 'jk_hem_1' },
  { id: 107, role: 'AJK', position: 'Pengurusan Kantin', teacherName: 'Islahuddin bin Muchtar', committeeId: 'jk_hem_1' },
  { id: 108, role: 'AJK', position: 'Pengurusan Pencegahan Jenayah, Dadah dan Denggi', teacherName: 'Mohd Nur bin Ahmad', committeeId: 'jk_hem_1' },
  { id: 109, role: 'AJK', position: 'Pengurusan Pintu & Pagar Masuk Sekolah & Asrama', teacherName: 'Pengawal Keselamatan Sekolah', committeeId: 'jk_hem_1' },
  { id: 110, role: 'AJK', position: 'Pengurusan Penyelenggaraan Semula', teacherName: 'Islahuddin bin Muchtar', committeeId: 'jk_hem_1' },
  { id: 111, role: 'AJK', position: 'Perhubungan Luar', teacherName: 'Ali bin A Rahman', committeeId: 'jk_hem_1' },
];

// --- DATE HELPERS ---
const malayMonths = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];

// Helper to convert "14 Jan 2026" to "2026-01-14" for input type="date"
const dateToISO = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parts = dateStr.split(' ');
    if (parts.length < 3) return '';
    let day = parts[0].padStart(2, '0');
    const monthStr = parts[1].toLowerCase().substring(0, 3);
    const year = parts[2];
    const monthMap: Record<string, string> = {
        'jan': '01', 'feb': '02', 'mac': '03', 'apr': '04', 'mei': '05', 'jun': '06',
        'jul': '07', 'ogo': '08', 'sep': '09', 'okt': '10', 'nov': '11', 'dis': '12'
    };
    const month = monthMap[monthStr];
    if (!month) return ''; 
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

// Helper to check if a specific date falls within a string range (e.g., "12 – 16 Jan 2026")
const parseRangeFromString = (rangeStr: string): { start: Date, end: Date } | null => {
  if (!rangeStr) return null;
  const monthsMap: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'julai':6, 'ogos':7, 'ogo':7, 'sep':8, 'sept':8, 'okt':9, 'nov':10, 'dis':11 };
  
  const cleanRange = rangeStr.replace(/\s+/g, ' ').trim();
  const parts = cleanRange.split(/–|-/).map(s => s.trim());
  if (parts.length !== 2) return null;

  let start: Date, end: Date;

  // Type 1: Dot Format (23.05.2026)
  if (parts[0].includes('.')) {
     const parseDot = (s: string) => {
         const [d, m, y] = s.split('.').map(Number);
         return new Date(y, m-1, d);
     };
     start = parseDot(parts[0]);
     end = parseDot(parts[1]);
  } else {
     // Text Format: "12 – 16 Jan 2026" OR "30 Mac – 3 Apr 2026"
     const endParts = parts[1].split(' '); // "16 Jan 2026"
     if (endParts.length < 3) return null;
     
     const year = parseInt(endParts[endParts.length - 1]);
     const endMonthStr = endParts[endParts.length - 2].toLowerCase();
     const endMonth = monthsMap[endMonthStr] || 0;
     const endDay = parseInt(endParts[0]);
     
     end = new Date(year, endMonth, endDay);

     const startParts = parts[0].split(' '); // "12" or "30 Mac"
     let startDay = parseInt(startParts[0]);
     let startMonth = endMonth; // Default to same month
     
     if (startParts.length > 1) {
         const startMonthStr = startParts[1].toLowerCase();
         if (monthsMap[startMonthStr] !== undefined) startMonth = monthsMap[startMonthStr];
     }
     
     start = new Date(year, startMonth, startDay);
  }
  
  // Normalize hours for accurate day comparison
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  
  return { start, end };
};

const isDateInRange = (targetDate: Date, rangeStr: string): boolean => {
  const range = parseRangeFromString(rangeStr);
  if (!range) return false;
  
  const target = new Date(targetDate);
  target.setHours(12,0,0,0);

  return target >= range.start && target <= range.end;
};

// Helper to format teacher names correctly
const formatTeacherName = (name: string): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word === 'bin' || word === 'binti') return word;
      if (word.includes('@')) {
          return word.split('@').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('@');
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
};

const getBulletColor = (type: string, isHoliday?: boolean) => {
    if (isHoliday || type === 'cuti') return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
    switch (type) {
        case 'hip': return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
        case 'hayya': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        case 'exam_dalaman': return 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]';
        case 'exam_jaj': return 'bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        case 'exam_awam': return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]';
        case 'sumur': return 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]';
        default: return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'; // UPDATED
    }
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  "jk_pentadbiran_0": `1. Mengadakan mesyuarat sekurang-kurang dua (2) kali setahun.
2. Menentukan dasar dan hala tuju sekolah.
3. Merancang dan mengurus pengoperasian sekolah.
4. Merancang dan mengawal pengurusan sumber di sekolah.
5. Mengenal pasti dan menyelesaikan isu dan permasalahan di sekolah.`,
  
  "jk_pentadbiran_9": `(A) ANGGARAN BELANJA MENGURUS (ABM) PERJAWATAN 
Membuat unjuran keperluan perjawatan guru berdasarkan bilangan murid, kelas dan aliran untuk sesi persekolahan tahun hadapan berdasarkan data 1 Oktober tahun semasa. 
Mengurus permohonan buka/tutup kelas/aliran pada sesi persekolahan tahun hadapan kepada pendaftar sekolah sebelum bulan Mac tahun semasa. 
Melakukan semakan unjuran keperluan perjawatan dan kelas selewat-lewatnya bulan Mac tahun semasa untuk sesi persekolahan tahun hadapan. 
Mengurus permohonan pengisian perjawatan jika ada kekosongan di sekolah. 

(B) PENILAIAN PRESTASI  
(B1) PENILAIAN BERSEPADU PEGAWAI PERKHIDMATAN PENDIDIKAN (PBPPP) 
Menubuhkan Jawatankuasa PBPPP Organisasi tahun berkenaan.
Memastikan maklumat PPP di setiap organisasi dikemas kini dan lengkap. 
Mengenal pasti PPP yang layak dinilai mengikut syarat Pegawai Yang Dinilai (PYD). 
Mengenal pasti Pegawai Penilai (PP) mengikut syarat penetapan PP. 
PYD, PP1 dan PP2 menyediakan dan menetapkan sasaran keberhasilan mengikut garis panduan yang ditetapkan. 
Mengemaskinikan fail pengurusan PBPPP mengikut tatacara pengurusan fail AM 435 kategori Terhad.  
Melaksanakan mesyuarat panel untuk pemilihan cadangan calon yang akan menerima Anugerah Perkhidmatan Cemerlang (APC). 

(B2) LAPORAN NILAIAN PRESTASI TAHUNAN (LNPT) 
Melakukan pengemaskinian maklumat pegawai di bawah seliaan di dalam sistem yang sedang berkuat kuasa. 
Membuat lantikan Pegawai Penilai (PP) kepada semua Anggota Kumpulan Pelaksana (AKP). 
Melaksanakan taklimat/penataran kepada semua PP dan Pegawai Yang Dinilai (PYD).
Melaksanakan sesi bersemuka antara PP dan PYD berdasarkan sasaran kerja tahunan (SKT) yang dikemukakan PYD. 
Melaksanakan mesyuarat panel untuk pemilihan/cadangan calon yang akan menerima Anugerah Khidmat Cemerlang (APC). 

(C) PENGURUSAN STAF BERMASALAH DAN TATATERTIB 
Memastikan semua pegawai menandatangani Surat Aku Janji untuk penjawat awam dan memperbaharui ikrar aku janji untuk penjawat awam setiap tahun. 
Memberi taklimat peraturan-peraturan am penjawat awam dan perbuatan-perbuatan yang boleh disabitkan sebagai salahlaku tatatertib dan jenis-jenis hukuman-hukuman tatatertib kepada pegawai seliaan.
Memastikan pematuhan prosedur tatatertib selaras dengan peraturan sedia ada.
Memastikan pengurusan fail tatatertib dibuat mengikut prosedur yang ditetapkan.
Mempertingkatkan pengetahuan dan pengalaman tentang pengurusan tatatertib perkhidmatan awam yang terkini. 
Membuat penilaian dan saringan kepada guru dan staf yang bermasalah dan merujuk kepada Kaunselor Pendidikan Daerah (KPD) bagi mendapatkan perkhidmatan sesi kaunseling/bimbingan. 
Melaporkan salah laku pegawai ke Lembaga Tatatertib (LTT) di Jabatan/Kementerian.
Melaksanakan;  
Tindakan pengesanan/mengenal pasti masalah terhadap pegawai
Tindakan dalam bentuk pembetulan dan pembaikan 
Tindakan lain secara pentadbiran 
Tindakan dalam bentuk hukuman 
Tanggungjawab selepas pegawai dikenakan hukuman tatatertib

(D) LATIHAN PROFESIONALISME (GURU DAN BUKAN GURU)
Memastikan guru menghadiri kursus/bengkel, mesyuarat dan PLC yang dianjurkan oleh pihak sekolah/PPD/JPN/KPM.
Merancang dan melaksanakan program kemajuan guru dan staf berdasarkan Analisis Keperluan Latihan – Training Needs Analysis (TNA).
Memastikan pegawai dalam seliaan menghadiri sekurang-kurangnya jumlah hari/jam latihan (jangka pendek) berdasarkan pekeliling/arahan oleh agensi pusat yang sedang berkuat kuasa.
Merancang keperluan latihan (POL).
Melatih dan membimbing guru dalam aspek psikologi bagi tujuan pengurusan murid.
Melaksanakan latihan melalui pelbagai kaedah bagi memenuhi jumlah hari/jam latihan yang ditetapkan dalam setahun melalui latihan secara formal, sesi pembelajaran dan pembelajaran kendiri termasuk pembelajaran secara dalam talian sekurang-kurangnya lima (5) hari setahun.
Meningkatkan kecekapan dalam mengurus sumber.
Menjalankan tindakan susulan.
Memastikan laporan dan dokumentasi disediakan.
Mengenal pasti kompetensi dan potensi pegawai yang dinilai agar membolehkan pembangunan profesionalisme berterusan dilaksanakan.
Mengenal pasti keperluan untuk pembangunan laluan kerjaya.
Mengurus dan membantu menghasilkan bahan kursus LADAP (CPD) untuk guru-guru dan staf.
Membantu dan membimbing guru-guru baru dan guru-guru yang tidak mencapai tahap pengajaran yang baik dalam PdP. (under performing teacher)
Membantu guru dalam menyediakan sasaran tahunan (Performance Management Systems -PMS).
Membantu guru dalam meningkatkan strategik pengajaran dan pembelajaran. (Teach Smart)
Mendalami kepakaran PdP secara am dan khusus dari segi aspek pilihan.
Melaksanakan perkongsian kemahiran/kepakaran yang diperoleh daripada sesi bengkel/kursus di luar dalam kalangan warga sekolah mengikut kesesuaian.
Membuat penilaian program latihan.

(E) PROGRAM PEMBANGUNAN GURU BAHARU (PPGB)
Memastikan pelaksanaan PPGB mengikut tatacara penyediaan dan penggunaan dokumen iaitu:
Surat lantikan mentor oleh pentadbir sekolah 
Akuan terima guru mentor dan guru baharu 
Log pementoran 
Borang penilaian guru baharu 
Laporan status pelaksanaan PPGB 
Memastikan pelaksanaan PPGB distrukturkan secara tiga (3) fasa iaitu fasa orientasi, fasa pementoran dan fasa pembangunan profesionalisme dalam tempoh tiga (3) tahun pertama perkhidmatan.
Pelaksanaan ketiga-tiga fasa dalam program ini boleh berlaku secara serentak.

(F) URUSAN NAIK PANGKAT 
Membuat semakan iklan kenaikan pangkat dalam sistem ePangkat.
Mengedarkan borang permohonan kenaikan pangkat kepada pegawai terlibat.
Membuat lantikan PP1, PP2 dan KPP.
Melaksanakan penilaian berdasarkan semakan dokumen dan pembentangan (jika perlu).
Memastikan semua pegawai yang layak untuk kenaikan pangkat dilakukan penilaian dan tiada faktor keciciran berlaku.

(G) HRMIS
Menyediakan data asas HRMIS seperti carta organisasi yang kemas kini, perjawatan mengikut tempat kerja dan buku perjawatan, dan senarai perjawatan dengan penyandang.
Menyedia dan memantapkan rangkaian dalaman agensi (Local Area Network – LAN).
Menediakan komputer tambahan mengikut keperluan agensi yang memenuhi spesifikasi HRMIS.
Menyediakan sumber yang secukupnya dari segi personel dan kewangan bagi membiayai perbelanjaan aktiviti pelaksanaan HRMIS seperti latihan, pengumpulan dan pengemaskinian data, peningkatan dan pertambahan peralatan serta bayaran caj rangkaian.
Bagi membolehkan aplikasi HRMIS digunakan, aktiviti yang perlu disempurnakan oleh agensi ialah :
Melantik seorang pegawai kanan sebagai pentadbir sistem yang bertanggungjawab menyediakan hak capaian mengikut peranan pegawai dan proses PSM.
Melengkapkan nilai dalam jadual Iook-up sekiranya diperlukan.
Melengkapkan maklumat sandangan pegawai, jawatan sebenar, unit organisasi dan aktiviti organisasi.
Menetapkan aliran kerja mengikut peranan pegawai.
Melengkapkan maklumat peribadi bagi setiap pegawai.
Melengkapkan data dalam profil perkhidmatan.
Memasukkan data transaksi tertentu bagi membolehkan sesuatu modul dilaksanakan.

(H) PEMIMPIN PERTENGAHAN 
Pentadbir sekolah mengenal pasti guru-guru dalam kategori pemimpin pertengahan (Middle Leader Team- MLT).
Memberikan ruang dan peluang kepada guru-guru pemimpin pertengahan untuk menunjukkan kebolehan dan bakat kepimpinan masing-masing.
Merancang dan melaksanakan program peningkatan kompetensi guru-guru pemimpin pertengahan sebagai barisan pelapis kepimpinan sekolah.
Menilai kompetensi guru-guru pemimpin pertengahan untuk dicadangkan kepada perjawatan hakiki tertentu.

(I) PERKHIDMATAN
Memastikan urusan perkhidmatan guru dan staf sekolah diurus secara cekap mengikut prosedur dan pekeliling yang sedang berkuat kuasa.
 
(J) PENGURUSAN KESEJAHTERAAN PSIKOLOGI
Menyediakan sesi khidmat kepakaran kaunseling/bimbingan/konsultasi/advokasi kepada warga KPM.
Merancang operasi penyampaian perkhidmatan kaunseling dan psikologi dalam aspek pembangunan, pencegahan dan pemulihan (3P) bagi memastikan kesejahteraan insan.
Merancang operasi penyampaian perkhidmatan kaunseling dan psikologi dalam aspek pembangunan dan pemerkasaan bagi memastikan kesejahteraan organisasi.
Memastikan kumpulan berisiko dirujuk menghadiri program pencegahan dan pemulihan bagi tujuan pengupayaan diri.
Mewujudkan kumpulan Rakan Pembimbing Perkhidmatan Awam (AKRAB) sebagai kumpulan sokongan.`,
  
  "jk_kurikulum_0": `1. Memastikan pelaksanaan Kurikulum Standard Sekolah Menengah (KSSM) dipatuhi.
2. Merancang program peningkatan akademik.
3. Memastikan sukatan pelajaran diselesaikan mengikut takwim.
4. Menganalisis keputusan peperiksaan dan merangka intervensi.`,

  "jk_hem_0": `1. Mengadakan mesyuarat sekurang-kurang dua (2) kali setahun.
2. Menentukan dasar dan hala tuju pengurusan hal ehwal murid sekolah.
3. Merancang dan mengurus pengoperasian hal ehwal murid di sekolah.
4. Merancang dan mengawal pengurusan sumber berkaitan hal ehwal murid di sekolah.
5. Mengenal pasti dan menyelesaikan isu dan permasalahan berkaitan hal ehwal murid di sekolah.
6. Merancang, memantau, menilai dan menambahbaik pelaksanaan program dan aktiviti hal ehwal murid di sekolah.
7. Membina hubungan seranta dengan ibu bapa, komuniti dan pihak yang berkepentingan.
8. Melapor dan mendokumenkan program dan aktiviti berkaitan hal ehwal murid di sekolah.
9. Mengurus dan menyelia pengoperasian bilik-bilik khas berkaitan hal ehwal murid.
10. Merancang, menyusun dan melaksanakan program-program dan aktiviti-aktiviti untuk meningkatkan tahap pencapaian sekolah di bidang pengurusan kokurikulum, keceriaan, kebersihan, kesihatan dan keselamatan (3K).
11. Membuat penilaian kendiri tahap pencapaian sekolah berdasarkan keputusan Pelaporan Sekolah Menengah.
12. Melaksanakan tugas PPS di bawah komponen terlibat untuk mengurus pelaporan SKPMg2.`,

  "jk_hem_1": `(A) TUGAS UTAMA JAWATANKUASA 3K
1. PGB dan GPK melakukan pemantauan, kawal selia dan pengesahan prestasi perkhidmatan kerja-kerja pembersihan dan keselamatan di sekolah.
2. Mengadakan mesyuarat Jawatankuasa 3K peringkat sekolah tiga (3) kali setahun (Januari, Jun dan September).
3. Merancang dan mengemaskinikan Program 3K peringkat sekolah.
4. Memastikan warga sekolah melaksanakan Program 3K.
5. Mendapatkan kerjasama daripada PIBG dan agensi berkaitan untuk menyokong pelaksanaan Program 3K.
6. Menyediakan laporan pelaksanaan Program 3K peringkat sekolah.
7. Mengemukakan laporan segera kes aduan mengikut tempoh 1:3:7 kepada PPD (1 hari laporan awal, 3 hari laporan lengkap, 7 hari kes selesai dan tindakan diambil).
8. Mengumpul maklumat Program 3K seperti:
8.1 Penggredan Kendiri Kantin Sekolah (oleh pengusaha kantin).
8.2 Senarai Semak Keselamatan Sekolah.

(B) KEBERSIHAN DAN KECERIAAN
1. Memastikan iklim sekolah menekankan aspek kebersihan pada setiap masa.
2. Memastikan panduan kebersihan sekolah dipatuhi.
3. Melibatkan semua warga sekolah dalam perancangan dan pelaksanaan program peningkatan kebersihan.
4. Melaksanakan saranan dalam Buku Garis Panduan Amalan Kebersihan Sekolah.
5. Menggunakan inisiatif dan kreativiti bagi memastikan sekolah sentiasa bersih dan indah.
6. Memupuk kesedaran dan tanggungjawab menjaga kebersihan sebagai amalan berterusan.
7. Menangani masalah disiplin melalui persekitaran sosial yang sihat.
8. Merancang peningkatan keceriaan dan kebersihan persekitaran termasuk tandas.
9. Menjadi Jawatankuasa Pelaksana Aktiviti Gotong-royong.
10. Melaksanakan langkah pencegahan denggi seperti:
10.1 Merancang pelan tindakan pencegahan pembiakan nyamuk aedes.
10.2 Memberi garis panduan aktiviti pendidikan pencegahan denggi.
10.3 Menyebar maklumat bahaya aedes dan demam denggi melalui pelbagai media.
10.4 Melibatkan agensi kerajaan dan swasta dalam program pencegahan denggi.
10.5 Memantau dan melaporkan pelaksanaan Pendidikan Pencegahan Denggi.
10.6 Melapor dan merujuk kes disyaki demam denggi kepada pihak berwajib.

(C) KESIHATAN
1. Mengurus dan memastikan bilik rawatan serta peti ubat lengkap.
2. Mengurus kad kesihatan dengan kerjasama guru kelas/Penyelaras Tingkatan.
3. Membantu pegawai kesihatan dalam pemeriksaan gigi dan suntikan.
4. Membantu murid yang memerlukan rawatan awal.
5. Menyimpan minit mesyuarat JK Pengurusan 3K.
6. Memastikan premis sekolah termasuk bilik darjah, tandas, asrama dan kantin sentiasa bersih dan selamat.
7. Melaporkan kes penyakit berjangkit kepada Pejabat Kesihatan dan menghalang murid berjangkit hadir ke sekolah mengikut arahan pegawai kesihatan.
8. Menggalakkan amalan kebersihan diri seperti:
8.1 Membasuh tangan selepas ke tandas.
8.2 Membasuh tangan sebelum makan.
8.3 Menjaga kebersihan tandas.
9. Memberi penekanan terhadap kesihatan diri, makanan, pemakanan dan pencegahan penyakit berjangkit.
10. Melarang murid membeli makanan/minuman daripada penjaja luar kawasan sekolah.
11. Menggalakkan kerjasama ibu bapa, komuniti dan agensi kesihatan mewujudkan sekolah sihat.

(D) KESELAMATAN
1. Melaporkan isu risiko keselamatan kepada GPK HEM.
2. Menyediakan papan maklumat pelawat mendapatkan kebenaran PGB.
3. Mencadangkan lantikan pengawal lalu lintas sekolah.
4. Mendapatkan kerjasama polis jika perlu.
5. Merancang dan melaksanakan program keselamatan.
6. Mengadakan latihan mengosongkan bangunan sekurang-kurangnya sekali setahun.
7. Memastikan pelan laluan dan peraturan keselamatan ditampal di bilik darjah dan buku latihan.
8. Memastikan alat pemadam api berada di lokasi sesuai dan belum luput.
9. Meletakkan tanda amaran “BAHAYA” di kawasan berisiko.
10. Merancang pergerakan lalu lintas semasa majlis rasmi.
11. Menetapkan laluan murid bagi mengelakkan kesesakan.
12. Melaporkan kerosakan elektrik kepada pentadbir.
13. Memaklumkan ibu bapa jika berlaku kecemasan melalui platform komunikasi sedia ada.
14. Mengisi Sistem Penarafan Keselamatan Sekolah (SPKS).

(D1) KESELAMATAN DIRI MURID
1. Mendapatkan kerjasama polis dan ibu bapa untuk rondaan kawasan berisiko.
2. Memastikan kawasan laluan murid bersih dan selamat.
3. Mempamerkan poster/peraturan keselamatan.
4. Menggalakkan murid bergerak berkumpulan dan melarang berseorangan di tempat sunyi.
5. Menggunakan pelbagai platform untuk peringatan keselamatan warga sekolah.
6. Bekerjasama merancang aktiviti bersama Kelab Pencegahan Jenayah.

(D2) KESELAMATAN BANGUNAN DAN PENCEGAHAN KEBAKARAN
1. Memastikan pendawaian bangunan berfungsi dan selamat dengan rujukan kepada JKR dan PPD/JPN.
2. Memohon penggantian pendawaian melebihi piawaian JKR.
3. Memastikan sistem pencegahan kebakaran berfungsi dengan baik.
4. Mengadakan ceramah dan pameran bomba.
5. Mengadakan fire drill melibatkan seluruh warga sekolah.
6. Mengadakan demonstrasi penggunaan alat pemadam api.
7. Mengadakan hari/minggu pencegahan kebakaran.
8. Menyediakan pelan keselamatan kebakaran sekolah.

(D3) PROGRAM SEKOLAH SELAMAT
1. Memberi pendedahan kepada warga sekolah tentang tujuan Program Sekolah Selamat.
2. Mengadakan taklimat bersama agensi kerajaan, bukan kerajaan dan komuniti setempat bagi mempertingkat keselamatan sekolah.`,

  "jk_kokurikulum_0": `1. Merancang takwim aktiviti kokurikulum tahunan.
2. Memantau kehadiran dan penglibatan murid dalam PAJSK.
3. Menguruskan penyertaan sekolah dalam pertandingan luar.
4. Memastikan keselamatan murid semasa aktiviti dijalankan.`
};

// Helper for sorting combined array
const parseDateForSort = (dateStr: string) => {
    if (!dateStr) return 0; // Safety Check
    // format "12 Jan 2026"
    const months: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'ogo':7, 'sep':8, 'okt':9, 'nov':10, 'dis':11 };
    const parts = dateStr.split(' ');
    if (parts.length < 3) return 0;
    const day = parseInt(parts[0]);
    const month = months[parts[1].toLowerCase().substring(0,3)] || 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day).getTime();
  };

// --- DYNAMIC STATUS CALCULATOR ---
const getDynamicStatus = (dateStr: string) => {
    if (!dateStr) return 'Akan Datang';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    let start: Date, end: Date;

    // Check for ranges using "–" or "hingga"
    if (dateStr.includes('–') || dateStr.includes('-') && dateStr.length > 12 || dateStr.includes('hingga')) {
       // Simplify range parsing for comparison
       const range = parseRangeFromString(dateStr.replace('hingga', '–'));
       if (range) {
           start = range.start;
           end = range.end;
       } else {
           // Fallback
           start = new Date(); 
           end = new Date();
       }
    } else {
        // Single Date
        const parts = dateStr.split(/[-. ]/); // matches -, ., or space
        if (parts.length >= 3) {
             const d = parseInt(parts[0]);
             const mStr = parts[1];
             const y = parseInt(parts[2]);
             let m = parseInt(mStr) - 1;
             
             if (isNaN(m)) {
                 const monthMap: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'ogo':7, 'ogos':7, 'sep':8, 'okt':9, 'nov':10, 'dis':11 };
                 m = monthMap[mStr.toLowerCase().substring(0,3)] || 0;
             }
             
             start = new Date(y, m, d);
             end = new Date(y, m, d);
             end.setHours(23, 59, 59, 999);
        } else {
            return 'Akan Datang';
        }
    }

    if (today > end) return 'Selesai';
    if (today >= start && today <= end) return 'Sedang Berjalan';
    return 'Akan Datang';
};

// --- HELPER FOR LIST VIEW GROUPING (New) ---
const getConsolidatedItems = (rawItems: any[]) => {
    if (!rawItems.length) return [];

    const parseDate = (d: string) => {
        if (!d) return 0; // Safety Check
        const parts = d.split('-').map(Number);
        if(parts.length !== 3) return 0;
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    };

    const sorted = [...rawItems].sort((a, b) => {
        const da = a.date || '';
        const db = b.date || '';
        return parseDate(da) - parseDate(db);
    });
    const grouped: any[] = [];
    
    if (sorted.length === 0) return [];

    let currentGroup: any = { 
        ...sorted[0], 
        endDate: sorted[0].date, 
        originalIds: [sorted[0].id] 
    };

    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        const prevDate = parseDate(currentGroup.endDate);
        const currDate = parseDate(item.date);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (item.event === currentGroup.event && item.status === currentGroup.status && diffDays <= 1.5) {
             currentGroup.endDate = item.date;
             currentGroup.originalIds.push(item.id);
        } else {
            grouped.push(currentGroup);
            currentGroup = { ...item, endDate: item.date, originalIds: [item.id] };
        }
    }
    grouped.push(currentGroup);

    // --- UPDATE: RENAME & NUMBERING & DATE RANGE ---
    const renamed = grouped.map(g => {
        let displayEvent = g.event;
        // 1. Rename PPT
        if (displayEvent === 'PPT') displayEvent = 'Peperiksaan Pertengahan Tahun';
        // 2. Rename UASA for List View
        if (displayEvent === 'UASA') displayEvent = 'Ujian Akhir Sesi Akademik';
        
        // 3. Date Format
        let dateDisplay = g.date;
        if (g.date !== g.endDate) {
            dateDisplay = `${g.date} hingga ${g.endDate}`;
        }
        
        const status = getDynamicStatus(g.date);

        return { ...g, event: displayEvent, dateDisplay, status, isGroup: g.originalIds.length > 1 };
    });

    const finalItems: any[] = [];
    const eventCounts: Record<string, number> = {};
    const eventOccurrences: Record<string, number> = {};

    renamed.forEach(item => {
        eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
    });

    // 4. Numbering for duplicates
    for (const item of renamed) {
        if (eventCounts[item.event] > 1) {
            eventOccurrences[item.event] = (eventOccurrences[item.event] || 0) + 1;
            finalItems.push({
                ...item,
                event: `${item.event} ${eventOccurrences[item.event]}`
            });
        } else {
            finalItems.push(item);
        }
    }

    return finalItems;
};

// Helper to get initial items (Mock Data logic moved here)
export const getInitialItems = (unit: string, type: string) => {
    if (type === 'Jawatankuasa') {
      if (unit === 'Pentadbiran') {
         return [
            { id: 1, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad', committeeId: 'jk_pentadbiran_0' },
            { id: 2, role: 'Timbalan Pengerusi', position: 'GPK Pentadbiran', teacherName: 'Noratikah binti Abd. Kadir', committeeId: 'jk_pentadbiran_0' },
            { id: 3, role: 'Naib Pengerusi 1', position: 'GPK Hal Ehwal Murid', teacherName: 'Shaharer bin Hj Husain', committeeId: 'jk_pentadbiran_0' },
            { id: 4, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'Zulkifli bin Md Aspan', committeeId: 'jk_pentadbiran_0' },
            { id: 5, role: 'Setiausaha', position: 'Setiausaha Pengurusan Pentadbiran', teacherName: 'Nooraind binti Ali', committeeId: 'jk_pentadbiran_0' },
            { id: 6, role: 'AJK', position: 'GKMP Agama', teacherName: 'Saemah binti Supandi', committeeId: 'jk_pentadbiran_0' },
            { id: 7, role: 'AJK', position: 'GKMP Dini', teacherName: 'Nor Azean binti Ismail', committeeId: 'jk_pentadbiran_0' },
            { id: 8, role: 'AJK', position: 'GKMP Bahasa', teacherName: 'Rosmawati @ Rohayati binti Hussin', committeeId: 'jk_pentadbiran_0' },
            { id: 9, role: 'AJK', position: 'GKMP Kemanusiaan', teacherName: 'Nooraind binti Ali', committeeId: 'jk_pentadbiran_0' },
            { id: 10, role: 'AJK', position: 'GKMP Sains & Matematik', teacherName: 'Zahrah Khairiah Nasution binti Saleh', committeeId: 'jk_pentadbiran_0' },
            { id: 11, role: 'AJK', position: 'GKMP Teknik & Vokasional', teacherName: 'Mazuin binti Mat', committeeId: 'jk_pentadbiran_0' },
            { id: 12, role: 'AJK', position: 'Guru Bimbingan & Kaunseling', teacherName: 'Muhammad Hafiz bin Jalil', committeeId: 'jk_pentadbiran_0' },
            { id: 13, role: 'AJK', position: 'Guru Perpustakaan & Media', teacherName: 'Nuurul Amira binti Razak', committeeId: 'jk_pentadbiran_0' },
            { id: 14, role: 'AJK', position: 'Guru Data', teacherName: 'Noorlela binti Zainudin', committeeId: 'jk_pentadbiran_0' },
            { id: 15, role: 'AJK', position: 'Penyelaras ICT/DELIMA', teacherName: 'Syahidatun Najihah binti Aziz', committeeId: 'jk_pentadbiran_0' },
            { id: 16, role: 'AJK', position: 'Guru Disiplin', teacherName: 'Salman bin A Rahman', committeeId: 'jk_pentadbiran_0' },
            { id: 17, role: 'AJK', position: 'Penyelaras Program TS25', teacherName: "Ahmad Fikruddin bin Ahmad Raza'i", committeeId: 'jk_pentadbiran_0' },
            { id: 18, role: 'AJK', position: 'Penyelia Asrama', teacherName: 'Islahuddin bin Muchtar', committeeId: 'jk_pentadbiran_0' },
            { id: 19, role: 'AJK', position: 'Ketua Anggota Kumpulan Pelaksana', teacherName: 'Yati binti Ani', committeeId: 'jk_pentadbiran_0' },
            { id: 20, role: 'AJK', position: 'Ketua Warden', teacherName: 'Salman bin A Rahman', committeeId: 'jk_pentadbiran_0' },
            
            // Jawatankuasa Pengurusan Sumber Manusia (No 10)
            { id: 1001, role: 'Pengerusi', position: 'Pengetua', teacherName: 'Zulkeffle bin Muhammad', committeeId: 'jk_pentadbiran_9' },
            { id: 1002, role: 'Timbalan Pengerusi', position: 'GPK Pentadbiran', teacherName: 'Noratikah binti Abd. Kadir', committeeId: 'jk_pentadbiran_9' },
            { id: 1003, role: 'Naib Pengerusi 1', position: 'GPK Hal Ehwal Murid', teacherName: 'Shaharer bin Hj Husain', committeeId: 'jk_pentadbiran_9' },
            { id: 1004, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'Zulkifli bin Md Aspan', committeeId: 'jk_pentadbiran_9' },
            { id: 1005, role: 'Setiausaha', position: 'Ketua Anggota Kumpulan Pelaksana', teacherName: 'Yati binti Ani', committeeId: 'jk_pentadbiran_9' },
            { id: 1006, role: 'AJK', position: 'Guru Bimbingan & Kaunseling', teacherName: 'Muhammad Hafiz bin Jalil', committeeId: 'jk_pentadbiran_9' },
            { id: 1007, role: 'AJK', position: 'Setiausaha Pengurusan Latihan Personel', teacherName: 'Liyana binti Iskandar', committeeId: 'jk_pentadbiran_9' },
            { id: 1008, role: 'AJK', position: 'Guru Disiplin', teacherName: 'Salman bin A Rahman', committeeId: 'jk_pentadbiran_9' },
            { id: 1009, role: 'AJK', position: 'Setiausaha Program Pembangunan Guru Baharu (PPGB)', teacherName: 'Mazuin binti Mat', committeeId: 'jk_pentadbiran_9' },
            { id: 1010, role: 'AJK', position: 'Semua GKMP', teacherName: '', committeeId: 'jk_pentadbiran_9' },
            { id: 1011, role: 'AJK', position: '', teacherName: 'Nur Farhana binti Hassan', committeeId: 'jk_pentadbiran_9' },
            { id: 1012, role: 'AJK', position: '', teacherName: 'Nurulashiqin binti Razali', committeeId: 'jk_pentadbiran_9' },
            { id: 1013, role: 'AJK', position: '', teacherName: 'Sadan bin Md Seth', committeeId: 'jk_pentadbiran_9' },
            { id: 1014, role: 'AJK', position: '', teacherName: 'Islahuddin bin Muchtar', committeeId: 'jk_pentadbiran_9' },
         ];
      }
      if (unit === 'Hal Ehwal Murid') {
          // Merge default HEM JK and new 3K data
          return [...INITIAL_HEM_JK_DATA, ...INITIAL_HEM_3K_DATA];
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
      // SPECIAL CASE: HEM TAKWIM DEFAULT DATA
      if (unit === 'Hal Ehwal Murid' && type === 'Takwim') {
          return INITIAL_HEM_TAKWIM_DATA;
      }
      // SPECIAL CASE: KURIKULUM TAKWIM DEFAULT DATA (NEW)
      if (unit === 'Kurikulum' && type === 'Takwim') {
          return INITIAL_KURIKULUM_TAKWIM_DATA;
      }
      return [
        { id: 1, event: unit === 'Pentadbiran' ? 'Taklimat Pembugaran PLC 2026' : `Mesyuarat ${unit} Bil 1/2026`, date: unit === 'Pentadbiran' ? '25-02-2026' : '15-01-2026', status: unit === 'Pentadbiran' ? 'Selesai' : 'Selesai' },
        { id: 2, event: unit === 'Pentadbiran' ? 'Mesyuarat Pentadbiran Bil 1/2026' : 'Bengkel Pemantapan', date: unit === 'Pentadbiran' ? '02-03-2026' : '22-02-2026', status: 'Dalam Perancangan' },
        { id: 3, event: 'Semakan Fail', date: '10-03-2026', status: 'Akan Datang' },
      ];
    }
};

export const UnitContent: React.FC<UnitContentProps> = ({ unit, type }) => {
  const { 
    user, showToast, checkPermission, 
    kokoWeeklyData, updateKokoWeeklyData,
    kokoAssemblyData, updateKokoAssemblyData, 
    sumurSchedule, updateSumurSchedule,
    hipSchedule, updateHipSchedule
  } = useApp();
  
  const getPermissionKey = (): string => {
    if (unit === 'Pentadbiran') return type === 'Jawatankuasa' ? 'canUpdatePentadbiranJK' : 'canUpdatePentadbiranTakwim';
    if (unit === 'Kurikulum') return type === 'Jawatankuasa' ? 'canUpdateKurikulumJK' : 'canUpdateKurikulumTakwim';
    if (unit === 'Hal Ehwal Murid') return type === 'Jawatankuasa' ? 'canUpdateHEMJK' : 'canUpdateHEMTakwim';
    if (unit === 'Kokurikulum') return type === 'Jawatankuasa' ? 'canUpdateKokoJK' : 'canUpdateKokoTakwim';
    return '';
  };

  const permKey = getPermissionKey();
  const canEdit = checkPermission(permKey);
  const canDelete = checkPermission(permKey);
  const canSave = checkPermission(permKey);
  const canDownload = true; 
  const isSystemAdmin = user?.role === 'adminsistem';

  // --- LAZY INITIALIZATION FOR STATES ---

  const [items, setItems] = useState<any[]>(() => {
      const storageKey = `smaam_data_${unit}_${type}`;
      const localData = localStorage.getItem(storageKey);
      
      if (localData && localData !== "undefined" && localData !== "null") {
          let loadedItems = JSON.parse(localData);
          
          // Special Checks moved from useEffect
          if (unit === 'Hal Ehwal Murid' && type === 'Takwim') {
               const isOldMock = loadedItems.length < 5 && loadedItems.some((i:any) => i.id === 1 && i.event.includes('Mesyuarat'));
               if (isOldMock) return INITIAL_HEM_TAKWIM_DATA;
          }
          if (unit === 'Hal Ehwal Murid' && type === 'Jawatankuasa') {
               // Check if data is sparse/generic
               const isPlaceholder = loadedItems.length <= 10 && loadedItems.some((i:any) => i.teacherName === '(Nama Guru)' || i.teacherName === '(Lantikan Khas)');
               // If placeholder detected, return MERGED list to ensure 3K data is present
               if (isPlaceholder) return [...INITIAL_HEM_JK_DATA, ...INITIAL_HEM_3K_DATA];
          }
          if (unit === 'Kurikulum' && type === 'Takwim') {
               const isOldMock = loadedItems.length < 5; 
               if (isOldMock) return INITIAL_KURIKULUM_TAKWIM_DATA;
               // HOTFIX: Remove isolated Hari Krismas to fix grouping for Cuti Akhir Tahun
               const christmasIndex = loadedItems.findIndex((i:any) => i.id === 20261225 && i.event === "Hari Krismas");
               if (christmasIndex !== -1) {
                   return loadedItems.filter((i:any) => i.id !== 20261225);
               }
          }
          return loadedItems;
      }
      return getInitialItems(unit, type);
  });

  const [committees, setCommittees] = useState<Committee[]>(() => {
      if (type !== 'Jawatankuasa') return [];
      const key = `smaam_committees_list_${unit}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      
      let targetList: string[] = [];
      let prefix = '';
      if (unit === 'Pentadbiran') { targetList = PENTADBIRAN_JK_LIST; prefix = 'jk_pentadbiran_'; }
      else if (unit === 'Kurikulum') { targetList = KURIKULUM_JK_LIST; prefix = 'jk_kurikulum_'; }
      else if (unit === 'Hal Ehwal Murid') { targetList = HEM_JK_LIST; prefix = 'jk_hem_'; }
      else if (unit === 'Kokurikulum') { targetList = KOKO_JK_LIST; prefix = 'jk_koko_'; }
      else { targetList = ["Jawatankuasa Induk"]; prefix = 'jk_general_'; }
      
      return targetList.map((name, index) => ({ id: `${prefix}${index}`, name: name }));
  });

  const [activeCommitteeId, setActiveCommitteeId] = useState<string>(() => {
      if (type !== 'Jawatankuasa') return 'default';
      const key = `smaam_committees_list_${unit}`;
      const saved = localStorage.getItem(key);
      if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) return parsed[0].id;
      }
      // Defaults based on unit logic
      let prefix = '';
      if (unit === 'Pentadbiran') prefix = 'jk_pentadbiran_';
      else if (unit === 'Kurikulum') prefix = 'jk_kurikulum_';
      else if (unit === 'Hal Ehwal Murid') prefix = 'jk_hem_';
      else if (unit === 'Kokurikulum') prefix = 'jk_koko_';
      else prefix = 'jk_general_';
      return `${prefix}0`;
  });

  const [description, setDescription] = useState<string>(() => {
      if (type !== 'Jawatankuasa') return '';
      // Since activeCommitteeId is computed in render, we might not have access to the *final* one if it changed.
      // But we can approximate. For simplicity, we initialize with empty or rely on useEffect to update it.
      // However, to support instant load for the default committee:
      
      // Calculate initial Active ID (replicated logic)
      let initialId = 'default';
      const keyCom = `smaam_committees_list_${unit}`;
      const savedCom = localStorage.getItem(keyCom);
      if (savedCom) {
          const parsed = JSON.parse(savedCom);
          if (parsed.length > 0) initialId = parsed[0].id;
      } else {
          let prefix = '';
          if (unit === 'Pentadbiran') prefix = 'jk_pentadbiran_';
          else if (unit === 'Kurikulum') prefix = 'jk_kurikulum_';
          else if (unit === 'Hal Ehwal Murid') prefix = 'jk_hem_';
          else if (unit === 'Kokurikulum') prefix = 'jk_koko_';
          else prefix = 'jk_general_';
          initialId = `${prefix}0`;
      }

      const descKey = `smaam_desc_${unit}_${initialId}`;
      const stored = localStorage.getItem(descKey);
      return stored || DEFAULT_DESCRIPTIONS[initialId] || '';
  });

  // --- OTHER STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // New State for Bulk Input
  const [isBulkEntry, setIsBulkEntry] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const [kokoTitles, setKokoTitles] = useState({
      weekly: 'TAKWIM PERJUMPAAN MINGGUAN KOKURIKULUM – TAHUN 2026',
      monthly: 'JADUAL PERHIMPUNAN BULANAN KOKURIKULUM – TAHUN 2026'
  });
  const [editingKokoType, setEditingKokoType] = useState<'weekly' | 'monthly' | 'title_weekly' | 'title_monthly' | 'exam_week' | 'sumur' | 'hip' | null>(null);
  const [examWeeks, setExamWeeks] = useState<ExamWeekRow[]>(INITIAL_EXAM_WEEKS);
  
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);
  const [isEditCommitteeModalOpen, setIsEditCommitteeModalOpen] = useState(false);
  const [newCommitteeName, setNewCommitteeName] = useState('');
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState('');
  const [takwimView, setTakwimView] = useState<'list' | 'annual' | 'koko_weekly' | 'koko_monthly' | 'exam_schedule' | 'sumur_schedule' | 'hip_schedule'>('list');

  const [formData, setFormData] = useState({
    role: '', position: '', teacherName: '',
    event: '', date: '', status: '',
    activity: '', month: '', unit: '', title: '', notes: '',
    week: '', dalaman: '', jaj: '', awam: '',
    program: '', teacher: ''
  });

  const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
  const daysLetters = ['I', 'S', 'R', 'K', 'J', 'S', 'A']; 
  const year = 2026; 

  // --- HELPER FOR SORTING ---
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
      return 99; 
  };

  // --- CALCULATE FILTERED ITEMS (Moved up for use in handler) ---
  const filteredItems = (type === 'Jawatankuasa' 
    ? items.filter(item => item.committeeId === activeCommitteeId || (!item.committeeId && activeCommitteeId === 'jk_induk')).sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role))
    : items).map(item => {
        // Apply dynamic status for Takwim items
        if (type === 'Takwim' && item.date) {
            return { ...item, status: getDynamicStatus(item.date) };
        }
        return item;
    });

  // Calculate Consolidated List for List View
  const consolidatedList = getConsolidatedItems(items);

  // --- EFFECTS FOR SYNC & SECONDARY DATA ---

  // Sync Koko/Exam/Sumur/Hip data on mount
  useEffect(() => {
    if (unit === 'Kokurikulum' && type === 'Takwim') {
        const loadKoko = async () => {
            const savedWeekly = await apiService.read('smaam_koko_weekly');
            const savedAssembly = await apiService.read('smaam_koko_assembly');
            const savedTitles = await apiService.read('smaam_koko_titles');
            if (savedWeekly) updateKokoWeeklyData(savedWeekly);
            if (savedAssembly) updateKokoAssemblyData(savedAssembly);
            if (savedTitles) setKokoTitles(savedTitles);
        };
        loadKoko();
    }
    
    if (unit === 'Kurikulum' && type === 'Takwim') {
        const loadExam = async () => {
            const savedExamWeeks = await apiService.read('smaam_exam_weeks');
            if (savedExamWeeks) setExamWeeks(savedExamWeeks);
        };
        loadExam();
    }

    if (unit === 'Hal Ehwal Murid' && type === 'Takwim') {
        const loadSumurHip = async () => {
            const savedSumur = await apiService.read('smaam_sumur_schedule');
            const savedHip = await apiService.read('smaam_hip_schedule');
            if (savedSumur) updateSumurSchedule(savedSumur);
            if (savedHip) updateHipSchedule(savedHip);
        };
        loadSumurHip();
    }
  }, [unit, type]);

  // Sync Committees List on mount
  useEffect(() => {
    if (type === 'Jawatankuasa') {
      const committeesKey = `smaam_committees_list_${unit}`;
      const loadCommittees = async () => {
          const savedCommittees = await apiService.read(committeesKey);
          if (savedCommittees && savedCommittees.length > 0) {
              setCommittees(savedCommittees);
              // Note: We don't override activeCommitteeId here to avoid jumping if user already selected something
          }
      };
      loadCommittees();
    }
  }, [unit, type]);

  // Sync Main Items (Background)
  useEffect(() => {
    const storageKey = `smaam_data_${unit}_${type}`;
    // Background Sync (Silent Update)
    apiService.read(storageKey).then((remoteData) => {
        if (remoteData && Array.isArray(remoteData)) {
            setItems(remoteData);
        } else {
            // If no remote data, ensure we have initial items for this unit/type
            setItems(getInitialItems(unit, type));
        }
    });
  }, [unit, type]);

  // Update description when active committee changes
  useEffect(() => {
    if (type === 'Jawatankuasa') {
      const descKey = `smaam_desc_${unit}_${activeCommitteeId}`;
      const storedDesc = localStorage.getItem(descKey);
      if (storedDesc) {
        setDescription(storedDesc);
      } else {
        setDescription(DEFAULT_DESCRIPTIONS[activeCommitteeId] || '');
      }
    }
  }, [activeCommitteeId, unit, type]);

  const saveToStorage = (newItems: any[]) => {
    const storageKey = `smaam_data_${unit}_${type}`;
    // Instant Save
    localStorage.setItem(storageKey, JSON.stringify(newItems));
    apiService.write(storageKey, newItems);
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
    apiService.write(committeesKey, newList);
    setCommittees(newList);
  };

  const handleEditKoko = (type: 'weekly' | 'monthly', item?: any) => {
      setEditingKokoType(type);
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      if (type === 'weekly') {
          setFormData({ ...formData, date: item?.date || '', activity: item?.activity || '' });
      } else {
          setFormData({ ...formData, month: item?.month || '', date: item?.date || '', unit: item?.unit || '', notes: item?.notes || '' });
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
              apiService.write('smaam_koko_weekly', newData);
          } else {
              const newData = kokoAssemblyData.filter(i => i.id !== id);
              updateKokoAssemblyData(newData);
              apiService.write('smaam_koko_assembly', newData);
          }
          showToast("Rekod dipadam.");
      }
  };

  const handleEditSumur = (item: any) => {
      setEditingKokoType('sumur');
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      setFormData({ ...formData, date: item?.date || '', program: item?.program || '', teacher: item?.teacher || '', activity: item?.activity || '' });
  };

  const handleDeleteSumur = (id: number) => {
      if(confirm("Padam rekod SUMUR ini?")) {
          const newData = sumurSchedule.filter(i => i.id !== id);
          updateSumurSchedule(newData);
          apiService.write('smaam_sumur_schedule', newData);
          showToast("Rekod dipadam.");
      }
  };

  const handleEditHip = (item: any) => {
      setEditingKokoType('hip');
      setEditingId(item ? item.id : null);
      setIsModalOpen(true);
      setFormData({ ...formData, date: item?.date || '', program: item?.program || '', teacher: item?.teacher || '', activity: item?.activity || '' });
  };

  const handleDeleteHip = (id: number) => {
      if(confirm("Padam rekod HIP ini?")) {
          const newData = hipSchedule.filter(i => i.id !== id);
          updateHipSchedule(newData);
          apiService.write('smaam_hip_schedule', newData);
          showToast("Rekod dipadam.");
      }
  };

  const handleEditExamWeek = (item: any) => {
      if (isSystemData(item.id) && !isSystemAdmin) {
          showToast("Akses Ditolak: Data asal sistem dikunci dan tidak boleh diubah.");
          return;
      }
      setEditingKokoType('exam_week');
      setEditingId(item.id);
      setIsModalOpen(true);
      setFormData({ ...formData, week: item.week, date: item.date, dalaman: item.dalaman, jaj: item.jaj, awam: item.awam });
  };

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
      const updatedList = committees.map(c => c.id === editingCommitteeId ? { ...c, name: newCommitteeName } : c);
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
      if (committees.length <= 1) { alert("Anda tidak boleh memadam jawatankuasa terakhir."); return; }
      if (window.confirm(`Adakah anda pasti ingin memadam "${name}"? Semua data ahli berkaitan akan turut dipadam.`)) {
          const updatedList = committees.filter(c => c.id !== id);
          saveCommitteesList(updatedList);
          const updatedItems = items.filter(item => item.committeeId !== id);
          saveToStorage(updatedItems);
          localStorage.removeItem(`smaam_desc_${unit}_${id}`);
          if (activeCommitteeId === id) setActiveCommitteeId(updatedList[0].id);
          showToast(`Jawatankuasa "${name}" telah dipadam.`);
      }
  }

  // --- NEW: Handle Delete All Members In Current Committee ---
  const handleDeleteAllInCommittee = async () => {
      // Prompt confirm text changed as per requirement
      if (confirm("Adakah anda pasti mahu kosongkan semua data jawatankuasa?")) {
          const key = `smaam_data_${unit}_${type}`;
          
          // 1. Clear Local State & Storage immediately (No filtering)
          setItems([]); 
          localStorage.removeItem(key);

          // 2. Call Backend Action 'clearOrganisasi'
          try {
             // For simpler implementations without full CORS setup, fire and forget or check result if possible
             // We call clearData which sends action='clearOrganisasi'
             await apiService.clearData(key);
             showToast("Data berjaya dikosongkan.");
          } catch (e) {
             console.error(e);
             showToast("Ralat semasa mengosongkan data.");
          }
      }
  };

  const handleResetForm = () => {
      setFormData({
        role: '', position: '', teacherName: '',
        event: '', date: '', status: 'Akan Datang',
        activity: '', month: '', unit: '', title: '', notes: '',
        week: '', dalaman: '', jaj: '', awam: '',
        program: '', teacher: ''
      });
      setBulkText('');
      showToast("Borang ditetapkan semula.");
  };

  // --- NEW: Group Deletion for Consolidated Items ---
  const handleDeleteGroup = (ids: (number | string)[]) => {
      if (window.confirm(`Adakah anda pasti ingin memadam kumpulan aktiviti ini (${ids.length} hari)?`)) {
          const stringIds = ids.map(id => id.toString());
          const newItems = items.filter(i => !stringIds.includes(i.id.toString()));
          saveToStorage(newItems);
          showToast("Kumpulan aktiviti berjaya dipadam.");
      }
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; 
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
      if (d.getMonth() !== monthIdx) return null; 
      const dayIndex = d.getDay(); 
      const mappedIndex = (dayIndex + 6) % 7;
      return daysLetters[mappedIndex];
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Selesai': return 'bg-green-600 text-white';
          case 'Sedang Berjalan': return 'bg-blue-600 text-white';
          case 'Akan Datang': return 'bg-[#C9B458] text-[#0B132B]';
          default: return 'bg-gray-600 text-gray-200';
      }
  };

  const getUnitBadgeColor = (unit: string) => {
      const u = unit.toLowerCase();
      if (u.includes('cuti')) return 'bg-red-900/50 text-red-300';
      if (u.includes('kadet remaja sekolah')) return 'bg-teal-900/60 text-teal-200'; 
      if (u.includes('puteri islam')) return 'bg-pink-900/60 text-pink-300'; 
      if (u.includes('pengakap')) return 'bg-slate-600/60 text-slate-300'; 
      if (u.includes('pandu puteri')) return 'bg-sky-900/60 text-sky-300'; 
      return 'bg-blue-900/30 text-blue-200'; 
  };

  const handleOpenModal = (item?: any) => {
    setEditingKokoType(null); 
    // Reset bulk mode on open
    setIsBulkEntry(false);
    setBulkText('');

    if (item && item.id) {
      setEditingId(item.id);
      setFormData({
        role: item.role || '', position: item.position || '', teacherName: item.teacherName || '',
        event: item.event || '', date: item.date || '', status: item.status || 'Akan Datang',
        activity: '', month: '', unit: '', title: '', notes: '',
        week: '', dalaman: '', jaj: '', awam: '', program: '', teacher: ''
      });
    } else {
      setEditingId(null);
      setFormData({
        role: '', position: '', teacherName: '', event: '', status: 'Akan Datang', date: item?.date || '',
        activity: '', month: '', unit: '', title: '', notes: '',
        week: '', dalaman: '', jaj: '', awam: '', program: '', teacher: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm("Adakah anda pasti ingin memadam rekod ini?")) {
      const newItems = items.filter(item => item.id.toString() !== id.toString());
      saveToStorage(newItems);
      showToast("Rekod berjaya dipadam.");
    }
  };

  const handleResetTakwim = () => {
    if (window.confirm("Adakah anda pasti ingin mengosongkan senarai aktiviti ini? Semua data akan dipadam.")) {
      saveToStorage([]);
      showToast("Senarai aktiviti dikosongkan.");
    }
  };

  const handleCleanEmptyRows = () => {
    const newItems = items.filter(item => item.event && item.event.trim() !== '');
    if (newItems.length !== items.length) {
        saveToStorage(newItems);
        showToast("Baris kosong telah dibersihkan.");
    } else {
        showToast("Tiada baris kosong dijumpai.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly') {
        const newTitles = { ...kokoTitles };
        if (editingKokoType === 'title_weekly') newTitles.weekly = formData.title;
        else newTitles.monthly = formData.title;
        setKokoTitles(newTitles);
        apiService.write('smaam_koko_titles', newTitles);
        showToast("Tajuk dikemaskini.");
        setIsModalOpen(false);
        return;
    }
    if (editingKokoType === 'weekly') {
        const payload = { id: editingId || Date.now(), date: formData.date, activity: formData.activity };
        let newData = editingId ? kokoWeeklyData.map(i => i.id === editingId ? payload : i) : [...kokoWeeklyData, payload];
        updateKokoWeeklyData(newData);
        apiService.write('smaam_koko_weekly', newData);
        showToast("Rekod mingguan dikemaskini.");
        setIsModalOpen(false);
        return;
    }
    if (editingKokoType === 'monthly') {
        const payload = { id: editingId || Date.now(), month: formData.month, date: formData.date, unit: formData.unit, notes: formData.notes };
        let newData = editingId ? kokoAssemblyData.map(i => i.id === editingId ? payload : i) : [...kokoAssemblyData, payload];
        updateKokoAssemblyData(newData);
        apiService.write('smaam_koko_assembly', newData);
        showToast("Rekod bulanan dikemaskini.");
        setIsModalOpen(false);
        return;
    }
    if (editingKokoType === 'sumur') {
        const payload = { id: editingId || Date.now(), date: formData.date, program: formData.program, teacher: formData.teacher, activity: formData.activity };
        let newData = editingId ? sumurSchedule.map(i => i.id === editingId ? payload : i) : [...sumurSchedule, payload];
        updateSumurSchedule(newData);
        apiService.write('smaam_sumur_schedule', newData);
        showToast("Takwim SUMUR dikemaskini.");
        setIsModalOpen(false);
        return;
    }
    if (editingKokoType === 'hip') {
        const payload = { id: editingId || Date.now(), date: formData.date, program: formData.program, teacher: formData.teacher, activity: formData.activity };
        let newData = editingId ? hipSchedule.map(i => i.id === editingId ? payload : i) : [...hipSchedule, payload];
        updateHipSchedule(newData);
        apiService.write('smaam_hip_schedule', newData);
        showToast("Takwim HIP dikemaskini.");
        setIsModalOpen(false);
        return;
    }
    if (editingKokoType === 'exam_week') {
        const payload = { id: editingId!, week: formData.week, date: formData.date, dalaman: formData.dalaman, jaj: formData.jaj, awam: formData.awam, isHoliday: examWeeks.find(s => s.id === editingId)?.isHoliday };
        const newExamWeeks = examWeeks.map(item => item.id === editingId ? { ...item, ...payload } : item);
        setExamWeeks(newExamWeeks);
        apiService.write('smaam_exam_weeks', newExamWeeks);
        showToast("Takwim peperiksaan dikemaskini.");
        setIsModalOpen(false);
        return;
    }

    // --- BULK IMPORT LOGIC ---
    if (isBulkEntry && type === 'Jawatankuasa' && !editingId) {
        const lines = bulkText.split('\n').filter(l => l.trim());
        const newItems = lines.map((line, idx) => {
            // Try tab split first (Excel copy), then pipe
            let parts = line.split('\t');
            if (parts.length < 2) parts = line.split('|');
            
            const role = parts[0]?.trim() || '';
            const position = parts[1]?.trim() || '';
            const teacherName = parts[2]?.trim() || ''; 
            
            return {
                id: Date.now() + idx + Math.random(),
                role,
                position,
                teacherName: formatTeacherName(teacherName),
                committeeId: activeCommitteeId
            };
        });
        
        saveToStorage([...items, ...newItems]);
        showToast(`${newItems.length} ahli berjaya ditambah.`);
        setIsModalOpen(false);
        return;
    }

    let newItem: any;
    if (type === 'Jawatankuasa') {
      newItem = { role: formData.role, position: formData.position, teacherName: formatTeacherName(formData.teacherName), committeeId: activeCommitteeId };
    } else {
      newItem = { event: formData.event, date: formData.date, status: formData.status };
    }

    if (editingId) {
      const updatedItems = items.map(item => item.id === editingId ? { ...item, ...newItem } : item);
      saveToStorage(updatedItems);
      showToast("Rekod berjaya dikemaskini.");
    } else {
      newItem.id = Date.now();
      saveToStorage([...items, newItem]);
      showToast("Rekod baru berjaya ditambah.");
    }
    setIsModalOpen(false);
  };

  const handleDownloadPDF = () => { showToast("Memuat turun PDF..."); };

  // --- RENDERERS ---
  const renderPerjumpaanMingguan = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center gap-2">
            <h4 className="text-[#C9B458] font-bold flex items-center gap-2 text-[16px]">{kokoTitles.weekly}</h4>
            {isSystemAdmin && (<div className="flex gap-2"><button onClick={() => handleEditKokoTitle('title_weekly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button><button onClick={() => handleEditKoko('weekly', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button></div>)}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter sticky top-0 z-20">
                        <th className="px-6 py-4 w-16 text-center sticky left-0 z-30 bg-[#253252]">BIL</th>
                        <th className="px-6 py-4 w-40 text-center">TARIKH</th>
                        <th className="px-6 py-4">AKTIVITI</th>
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {kokoWeeklyData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{idx + 1}</td>
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
            <h4 className="text-[#C9B458] font-bold flex items-center gap-2 text-[16px]">{kokoTitles.monthly}</h4>
            {isSystemAdmin && (<div className="flex gap-2"><button onClick={() => handleEditKokoTitle('title_monthly')} className="text-xs text-blue-400 hover:text-white underline">Edit Tajuk</button><button onClick={() => handleEditKoko('monthly', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ Tambah</button></div>)}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter sticky top-0 z-20">
                        <th className="px-6 py-4 w-16 text-center sticky left-0 z-30 bg-[#253252]">BIL</th>
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
                            <td className="px-6 py-4 font-medium text-white text-center sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{idx + 1}</td>
                            <td className="px-6 py-4 text-gray-300 text-center uppercase font-bold">{item.month}</td>
                            <td className="px-6 py-4 text-white text-center font-mono">{item.date}</td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded text-xs font-bold ${getUnitBadgeColor(item.unit)}`}>{toTitleCase(item.unit)}</span></td>
                            <td className="px-6 py-4 text-gray-300 text-sm">{item.notes}</td>
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

  const renderTakwimSumur = () => {
    // Combine and sort
    const combined = [
        ...sumurSchedule.map(s => ({ ...s, source: 'sumur' as const })),
        ...hipSchedule.map(h => ({ ...h, source: 'hip' as const }))
    ].sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));

    const getProgramColor = (program: string) => {
        const p = program.toUpperCase();
        if (p.includes('ENGLISH')) return 'text-blue-400';
        if (p.includes('HAYYA')) return 'text-emerald-400';
        if (p.includes('SUMUR')) return 'text-[#C9B458]';
        return 'text-white';
    };

    return (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-2">
            <h4 className="text-[#C9B458] font-bold flex items-center gap-2 text-[16px]">TAKWIM PENGGILIRAN HIP, HA & SUMUR 2026</h4>
            {isSystemAdmin && (
                <div className="flex gap-2">
                    <button onClick={() => handleEditSumur(null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400">+ SUMUR</button>
                    <button onClick={() => handleEditHip(null)} className="bg-purple-500 text-white px-3 py-1 rounded font-bold text-xs hover:bg-purple-600">+ HIP</button>
                </div>
            )}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter sticky top-0 z-20">
                        <th className="px-6 py-4 w-16 text-center sticky left-0 z-30 bg-[#253252]">NO</th>
                        <th className="px-6 py-4 w-40 text-center">TARIKH</th>
                        <th className="px-6 py-4">PROGRAM</th>
                        <th className="px-6 py-4">GURU BERTUGAS</th>
                        <th className="px-6 py-4">AKTIVITI</th>
                        {isSystemAdmin && <th className="px-6 py-4 w-24 text-center">AKSI</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                    {combined.map((item, idx) => (
                        <tr key={`${item.source}-${item.id}`} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-3 font-medium text-white text-center sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{idx + 1}</td>
                            <td className="px-6 py-3 text-white text-center font-mono">{item.date}</td>
                            <td className={`px-6 py-3 font-bold ${getProgramColor(item.program)}`}>
                                {item.program}
                            </td>
                            <td className="px-6 py-3 text-white">{item.teacher}</td>
                            <td className="px-6 py-3 text-gray-300">{item.activity}</td>
                            {isSystemAdmin && (
                                <td className="px-6 py-3 text-center flex justify-center gap-2">
                                    <button 
                                        onClick={() => item.source === 'sumur' ? handleEditSumur(item) : handleEditHip(item)} 
                                        className="text-blue-400 hover:text-white" 
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => item.source === 'sumur' ? handleDeleteSumur(item.id) : handleDeleteHip(item.id)} 
                                        className="text-red-400 hover:text-white" 
                                        title="Hapus"
                                    >
                                        🗑️
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
  };

  const renderTakwimPeperiksaan = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full max-h-[70vh]">
        <div className="p-4 md:p-6 bg-[#0B132B] border-b border-gray-700 flex-none"><h3 className="text-lg md:text-xl font-bold text-[#C9B458] font-montserrat uppercase flex items-center gap-2">TAKWIM PEPERIKSAAN 2026</h3></div>
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-center border-collapse border border-gray-600 min-w-[650px] md:min-w-[900px] text-[10px] md:text-sm table-fixed">
                <thead>
                    <tr className="bg-[#C9B458] text-[#0B132B] uppercase font-bold sticky top-0 z-30">
                        <th className="border border-gray-600 px-1 py-3 w-8 md:w-16 sticky left-0 z-40 bg-[#C9B458]">M</th>
                        <th className="border border-gray-600 px-2 py-3 w-24 md:w-40 sticky left-[32px] md:left-[64px] z-40 bg-[#C9B458]">TARIKH</th>
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
                                <td colSpan={2} className="border border-gray-600 py-2 px-1 text-center sticky left-0 z-10 bg-[#C9B458]">{item.date}</td>
                                <td colSpan={3} className="border border-gray-600 py-2 px-1 text-center whitespace-normal break-words">{item.dalaman}</td>
                                {isSystemAdmin && (
                                    <td className="border border-gray-600 py-2 px-1 bg-[#0B132B]">
                                        <button onClick={() => handleEditExamWeek(item)} className={`${isSystemData(item.id) && !isSystemAdmin ? 'text-gray-500' : 'text-[#C9B458] hover:text-white'}`}>
                                            {isSystemData(item.id) && !isSystemAdmin ? '🔒' : '✏️'}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ) : (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                <td className="border border-gray-600 py-2 font-mono text-[#C9B458] font-bold sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{item.week}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 whitespace-normal break-words text-white sticky left-[32px] md:left-[64px] z-10 bg-[#1C2541] group-hover:bg-[#253252]">{item.date}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 whitespace-normal break-words">{renderExamCell(item.dalaman, 'text-pink-500')}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 whitespace-normal break-words">{renderExamCell(item.jaj, 'text-green-400')}</td>
                                <td className="border border-gray-600 py-2 px-1 md:px-2 whitespace-normal break-words">{renderExamCell(item.awam, 'text-cyan-400')}</td>
                                {isSystemAdmin && (
                                    <td className="border border-gray-600 py-2 px-1 text-center">
                                        <button onClick={() => handleEditExamWeek(item)} className={`${isSystemData(item.id) && !isSystemAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-[#C9B458]'}`}>
                                            {isSystemData(item.id) && !isSystemAdmin ? '🔒' : '✏️'}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col p-2 md:p-8 gap-6 relative fade-in w-full h-auto">
      <div className="flex-none flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-black font-mono mb-1 font-inter">
             <span className="font-bold">{unit.toUpperCase()}</span><span className="opacity-50">/</span><span className="font-bold opacity-80">{type.toUpperCase()}</span>
          </div>
          <h2 className="text-[22px] md:text-3xl font-bold text-black font-montserrat uppercase">
            PENGURUSAN {type} {type === 'Takwim' ? unit : ''}
          </h2>
          <p className="text-black/80 mt-1 text-[13px] font-inter font-medium">{type === 'Jawatankuasa' ? `Senarai jawatankuasa dan ahli bagi unit ${unit}.` : `Kalendar dan jadual aktiviti bagi unit ${unit}.`}</p>
        </div>
        <div className="flex gap-3">
            {canDownload && (<button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#1C2541] border border-[#C9B458] text-[#C9B458] px-4 py-2 rounded-lg font-semibold hover:bg-[#253252] transition-colors shadow-lg text-[13px]">📥 <span className="hidden sm:inline">Muat Turun PDF</span></button>)}
            {(canEdit || canSave) && (type === 'Takwim' && ((unit === 'Kokurikulum' && (takwimView !== 'list' && takwimView !== 'annual')) || (unit === 'Kurikulum' && takwimView === 'exam_schedule') || (unit === 'Hal Ehwal Murid' && (takwimView === 'sumur_schedule'))) ? null : ((canEdit || canSave) && (<button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20 text-[13px]">➕ <span className="hidden sm:inline">{type === 'Jawatankuasa' ? 'Tambah Ahli' : 'Tambah Aktiviti'}</span></button>)))}
        </div>
      </div>

      {type === 'Jawatankuasa' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Section (now includes Dropdown in header) */}
            <div className="lg:col-span-7 flex flex-col">
                <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-800 flex flex-col">
                    {/* Header with Dropdown - EQUAL HEIGHT */}
                    <div className="flex-none bg-[#0B132B] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md border-b border-gray-700 min-h-[72px]">
                        <div className="flex-1 w-full flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                            <div className="flex items-center justify-between w-full md:w-auto gap-2">
                                <label className="text-xs font-bold text-[#C9B458] uppercase tracking-wider whitespace-nowrap">
                                    PILIH JAWATANKUASA:
                                </label>
                                <span className="bg-[#3A506B] text-white text-[10px] px-2 py-0.5 rounded-full border border-gray-600 font-mono shadow-sm whitespace-nowrap">
                                    {committees.length} Jawatankuasa
                                </span>
                            </div>
                            <div className="relative w-full md:flex-1">
                                <select 
                                    value={activeCommitteeId}
                                    onChange={(e) => setActiveCommitteeId(e.target.value)}
                                    className="w-full bg-[#1C2541] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C9B458] outline-none transition-all cursor-pointer font-semibold shadow-inner"
                                >
                                    {committees.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Admin Actions */}
                        {isSystemAdmin && (
                            <div className="flex gap-2 shrink-0 items-center mt-2 md:mt-0 w-full md:w-auto justify-end">
                                <button 
                                    onClick={() => setIsAddCommitteeModalOpen(true)}
                                    className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
                                    title="Tambah Jawatankuasa"
                                >
                                    +
                                </button>
                                {activeCommitteeId && activeCommitteeId !== 'default' && (
                                    <>
                                        <button 
                                            onClick={(e) => {
                                                const c = committees.find(com => com.id === activeCommitteeId);
                                                if (c) openEditCommitteeModal(e, c);
                                            }}
                                            className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors"
                                            title="Edit Nama"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                const c = committees.find(com => com.id === activeCommitteeId);
                                                if (c) handleDeleteCommittee(e, c.id, c.name);
                                            }}
                                            className="bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors"
                                            title="Hapus"
                                        >
                                            🗑️
                                        </button>
                                    </>
                                )}
                                {/* MOVED DELETE ALL BUTTON HERE */}
                                {(canDelete && filteredItems.length > 0) && (
                                    <button 
                                        onClick={handleDeleteAllInCommittee}
                                        className="text-xs text-red-400 hover:text-white hover:bg-red-900/50 px-3 py-1.5 rounded transition-colors flex items-center gap-1 border border-red-900/30 font-bold ml-1" 
                                        title="Kosongkan Semua Data"
                                    >
                                        🗑️ Reset
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto relative custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[300px] md:min-w-[500px]">
                            <thead className="shadow-sm">
                                <tr className="bg-[#253252] border-b border-gray-700 sticky top-0 z-20">
                                    <th className="px-2 py-2 md:px-4 md:py-3 w-1/4 text-[#C9B458] text-xs md:text-sm font-bold font-['Century_Gothic'] uppercase tracking-wider text-left sticky left-0 z-30 bg-[#253252]">Peranan</th>
                                    <th className="px-2 py-2 md:px-4 md:py-3 w-1/4 text-[#C9B458] text-xs md:text-sm font-bold font-['Century_Gothic'] uppercase tracking-wider text-left">Jawatan</th>
                                    <th className="px-2 py-2 md:px-4 md:py-3 w-1/3 text-[#C9B458] text-xs md:text-sm font-bold font-['Century_Gothic'] uppercase tracking-wider text-left">Nama Guru</th>
                                    {(canEdit || canDelete) && <th className="px-2 py-2 md:px-4 md:py-3 text-right text-[#C9B458] text-xs md:text-sm font-bold font-['Century_Gothic'] uppercase tracking-wider">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 text-xs md:text-[13px] font-inter leading-[1.3]">
                                {filteredItems.length > 0 ? (filteredItems.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                        <td className="px-2 py-2 md:px-4 md:py-3 font-normal text-white border-r border-gray-800/50 sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{item.role}</td>
                                        <td className="px-2 py-2 md:px-4 md:py-3 text-gray-400 italic">{item.position}</td>
                                        <td className="px-2 py-2 md:px-4 md:py-3 font-semibold text-[#C9B458]">{formatTeacherName(item.teacherName)}</td>
                                        {(canEdit || canDelete) && (
                                            <td className="px-2 py-2 md:px-4 md:py-3 text-right">
                                                <div className={`flex justify-end gap-2 ${isSystemAdmin ? 'opacity-100' : 'md:opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                    {canEdit && <button onClick={() => handleOpenModal(item)} className="text-blue-400 hover:text-white" title="Edit">✏️</button>}
                                                    {canDelete && <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-white" title="Hapus">🗑️</button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))) : (
                                    <tr><td colSpan={(canEdit || canDelete) ? 4 : 3} className="px-6 py-12 text-center text-gray-500 italic">Tiada ahli direkodkan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Description Section (Right) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#1C2541] rounded-xl shadow-xl border border-gray-800 overflow-hidden flex flex-col">
                  {/* Header - EQUAL HEIGHT */}
                  <div className="flex-none bg-[#0B132B] p-4 border-b border-gray-700 flex items-center justify-between shadow-md min-h-[72px]">
                      <span className="text-[#C9B458] text-sm font-bold font-['Century_Gothic'] uppercase tracking-wider">TUGAS & FUNGSI</span>
                      {canEdit && (
                          <button onClick={() => { if (!isEditingDesc) setTempDesc(description); setIsEditingDesc(!isEditingDesc); }} className="text-[10px] text-gray-400 hover:text-[#C9B458] border border-gray-600 px-2 py-1 rounded transition-colors" title={isEditingDesc ? 'Batal' : 'Edit Fungsi'}>
                              {isEditingDesc ? 'Batal' : 'Edit'}
                          </button>
                      )}
                  </div>
                  <div className="p-6">
                    <div className="min-h-[150px]">
                        {isEditingDesc ? (
                            <div className="space-y-4 fade-in">
                                <textarea value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} className="w-full bg-[#0B132B] border border-[#C9B458] rounded-lg p-3 text-[13px] text-white h-64 focus:outline-none focus:ring-1 focus:ring-[#C9B458] leading-[1.3] custom-scrollbar" placeholder={`Masukkan fungsi untuk ${committees.find(c => c.id === activeCommitteeId)?.name}...`} />
                                {canEdit && (<button onClick={saveDescription} className="w-full bg-[#C9B458] text-[#0B132B] py-2 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-colors shadow-lg">Simpan Maklumat</button>)}
                            </div>
                        ) : (
                            <p className="text-gray-200 text-[13px] leading-[1.6] whitespace-pre-line text-left font-normal font-inter">
                                {description || "Tiada maklumat fungsi ditetapkan."}
                            </p>
                        )}
                    </div>
                  </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="w-full">
             <div className="flex flex-wrap gap-2 mb-2">
                <button onClick={() => setTakwimView('list')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'list' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Senarai Aktiviti</button>
                {unit === 'Kokurikulum' && (<><button onClick={() => setTakwimView('koko_weekly')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'koko_weekly' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Perjumpaan Mingguan</button><button onClick={() => setTakwimView('koko_monthly')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'koko_monthly' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Perhimpunan Bulanan</button></>)}
                {unit === 'Kurikulum' && (<button onClick={() => setTakwimView('exam_schedule')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'exam_schedule' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Takwim Peperiksaan</button>)}
                {unit === 'Hal Ehwal Murid' && (<><button onClick={() => setTakwimView('sumur_schedule')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'sumur_schedule' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Takwim Penggiliran HIP, HA & SUMUR</button></>)}
                <button onClick={() => setTakwimView('annual')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${takwimView === 'annual' ? 'bg-[#3A506B] text-white shadow-md' : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}>Takwim Tahunan</button>
            </div>

            {takwimView === 'annual' && (
              <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col mb-4">
                  <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex items-center justify-between"><h3 className="text-lg font-bold text-[#C9B458] font-montserrat uppercase">PERANCANGAN TAHUNAN {unit.toUpperCase()} TAHUN {year}</h3></div>
                  <div className="overflow-x-auto w-full custom-scrollbar">
                      <table className="w-full min-w-[1000px] border-collapse text-xs border border-gray-800">
                          <thead>
                              <tr className="sticky top-0 z-30">
                                  <th className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm w-12 border border-[#0B132B] sticky left-0 z-40">HB</th>
                                  {months.map(m => (<th key={m} className="bg-[#C9B458] text-[#0B132B] p-2 font-extrabold text-sm border border-[#0B132B] min-w-[80px]">{m}</th>))}
                              </tr>
                          </thead>
                          <tbody>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                  <tr key={date}>
                                      <td className="bg-[#0B132B] text-[#C9B458] font-bold text-center border border-gray-700 sticky left-0 z-10 p-1">{date}</td>
                                      {months.map((_, monthIdx) => {
                            const dayLetter = getDayLetter(monthIdx, date);
                            if (!dayLetter) return <td key={monthIdx} className="bg-black/40 border border-gray-800"></td>;
                            
                            const dateStr = `${(date).toString().padStart(2, '0')}-${(monthIdx + 1).toString().padStart(2, '0')}-${year}`;
                            
                            // 1. Generic Items
                            let eventsOnDay = items.filter(item => item.date === dateStr).map(i => ({...i, type: 'activity'}));

                            // 2. HEM: SUMUR & HIP Integration
                            if (unit === 'Hal Ehwal Murid') {
                                const sumurDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                                const sumurEvents = sumurSchedule.filter(s => s.date === sumurDateStr).map(s => {
                                    // Check if program is HAYYA BIL ARABIAH for distinct color
                                    const isHayya = s.program.toUpperCase().includes('HAYYA');
                                    return {
                                        id: `sumur-${s.id}`, // Ensure unique key
                                        event: s.program,
                                        date: dateStr,
                                        status: 'Akan Datang',
                                        type: isHayya ? 'hayya' : 'sumur'
                                    };
                                });
                                
                                const hipDateStr = `${date} ${malayMonths[monthIdx]} ${year}`;
                                const hipEvents = hipSchedule.filter(h => h.date === hipDateStr).map(h => ({
                                    id: `hip-${h.id}`,
                                    event: h.program,
                                    date: dateStr,
                                    status: 'Akan Datang',
                                    type: 'hip'
                                }));
                                eventsOnDay = [...eventsOnDay, ...sumurEvents, ...hipEvents];
                            }

                            let isHolidayDate = false;
                            let holidayName = "";

                            // 3. Kurikulum: Exam Integration (HIP removed)
                            if (unit === 'Kurikulum') {
                                const currentDate = new Date(year, monthIdx, date);
                                currentDate.setHours(12,0,0,0);

                                // Check specific holidays for Yellow Background
                                SCHOOL_HOLIDAYS.forEach(h => {
                                    const range = parseRangeFromString(h.date);
                                    if (range && currentDate >= range.start && currentDate <= range.end) {
                                        isHolidayDate = true;
                                        holidayName = h.event;
                                    }
                                });

                                // Filter out the "Cuti..." entries from examWeeks/eventsOnDay to avoid duplicates/messy text
                                eventsOnDay = eventsOnDay.filter(e => !e.event.toLowerCase().includes('cuti'));
                                
                                if (isHolidayDate) {
                                     eventsOnDay.unshift({
                                         id: `hol-${date}`,
                                         event: holidayName,
                                         date: dateStr,
                                         status: 'Akan Datang',
                                         type: 'cuti'
                                     });
                                }

                                examWeeks.forEach(ew => {
                                    const range = parseRangeFromString(ew.date);
                                    if (!range) return;
                                    
                                    // Check if current date is strictly within the row's date range
                                    if (currentDate >= range.start && currentDate <= range.end) {
                                         const checkAndPush = (text: string, type: string) => {
                                             if (!text || text.trim() === '' || text === '-') return;
                                             
                                             // Regex to match "DD MMM" pattern e.g. "17 Feb"
                                             const dateRegex = /(\d{1,2})\s+(Jan|Feb|Mac|Apr|Mei|Jun|Jul|Ogos|Sep|Okt|Nov|Dis)/i;
                                             const lines = text.split('\n');
                                             
                                             // Check if text has any date pattern
                                             const hasDates = lines.some(l => dateRegex.test(l));
                                             
                                             if (hasDates) {
                                                 // If text has dates, only add if current date matches specifically
                                                 lines.forEach(line => {
                                                     const match = line.match(dateRegex);
                                                     if (match) {
                                                         const d = parseInt(match[1]);
                                                         const mStr = match[2].toLowerCase();
                                                         const mMap: Record<string, number> = { 'jan':0, 'feb':1, 'mac':2, 'apr':3, 'mei':4, 'jun':5, 'jul':6, 'ogos':7, 'ogo':7, 'sep':8, 'okt':9, 'nov':10, 'dis':11 };
                                                         
                                                         // Check match
                                                         if (d === currentDate.getDate() && mMap[mStr] === currentDate.getMonth()) {
                                                             // Add unique event
                                                             if (!eventsOnDay.some(e => e.event === line.trim())) {
                                                                 eventsOnDay.push({
                                                                     id: `exam-${ew.id}-${date}-${Math.random()}`,
                                                                     event: line.trim(),
                                                                     date: dateStr,
                                                                     status: 'Akan Datang',
                                                                     type: type
                                                                 });
                                                             }
                                                         }
                                                     }
                                                 });
                                             } else {
                                                 // No specific date in text, applies to whole range (e.g. "Peperiksaan Akhir Tahun")
                                                 // Only push if it's NOT a generic holiday we handled above
                                                 if (!eventsOnDay.some(e => e.event === text.trim()) && !text.toLowerCase().includes('cuti')) {
                                                     eventsOnDay.push({
                                                         id: `exam-${ew.id}-${date}-${Math.random()}`,
                                                         event: text.trim(),
                                                         date: dateStr,
                                                         status: 'Akan Datang',
                                                         type: type
                                                     });
                                                 }
                                             }
                                         };

                                         if (ew.dalaman) checkAndPush(ew.dalaman, 'exam_dalaman');
                                         if (ew.jaj && !ew.isHoliday) checkAndPush(ew.jaj, 'exam_jaj');
                                         if (ew.awam && !ew.isHoliday) checkAndPush(ew.awam, 'exam_awam');
                                    }
                                });
                            }

                            return (
                              <td key={monthIdx} className={`${isHolidayDate ? 'bg-yellow-200 text-black' : 'bg-[#1C2541]'} border border-gray-700 relative min-h-[48px] p-1 align-top hover:bg-[#253252] transition-colors ${canEdit ? 'cursor-pointer' : ''}`} onClick={() => { if (canEdit) handleOpenModal(eventsOnDay.length > 0 ? eventsOnDay[0] : { date: dateStr }); }}>
                                <span className={`absolute top-0.5 right-1 text-[8px] font-mono ${isHolidayDate ? 'text-black/60' : 'text-gray-500'}`}>{dayLetter}</span>
                                <div className="mt-3 flex flex-col gap-1">
                                {eventsOnDay.map((event, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 group" title={event.event}>
                                      <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${getBulletColor(event.type, isHolidayDate)}`}></div>
                                      <span className={`text-[9px] leading-tight group-hover:text-white whitespace-normal break-words ${isHolidayDate ? 'text-black font-semibold' : 'text-gray-300'}`}>{event.event}</span>
                                  </div>
                                ))}
                                </div>
                              </td>
                            );
                          })}</tr>))}</tbody>
                      </table>
                  </div>
              </div>
            )}

            {takwimView === 'list' && (
                <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 mb-4">
                  <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col md:flex-row justify-between items-center gap-2">
                    <h4 className="text-white font-bold flex items-center gap-2 text-[16px]">Senarai Aktiviti</h4>
                    {isSystemAdmin && (
                        <div className="flex gap-2">
                            <button onClick={handleCleanEmptyRows} className="text-[11px] text-blue-400 hover:text-white border border-blue-900/30 px-2 py-1 rounded font-bold" title="Bersihkan baris tanpa nama aktiviti">🧹 Bersih</button>
                            <button onClick={handleResetTakwim} className="text-[11px] text-red-400 hover:text-white border border-red-900/30 px-2 py-1 rounded font-bold" title="Padam semua aktiviti">🗑️ Reset</button>
                        </div>
                    )}
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter sticky top-0 z-20">
                          <th className="px-6 py-4 sticky left-0 z-30 bg-[#253252]">Nama Program / Aktiviti</th>
                          <th className="px-6 py-4">Tarikh Pelaksanaan</th>
                          <th className="px-6 py-4">Status</th>
                          {(canEdit || canDelete) && <th className="px-6 py-4 text-right">Tindakan</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 text-[13px] font-inter leading-[1.3]">
                        {consolidatedList.length > 0 ? (consolidatedList.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                                <td className="px-6 py-4 font-medium text-white sticky left-0 z-10 bg-[#1C2541] group-hover:bg-[#253252]">{item.event}</td>
                                <td className="px-6 py-4 text-gray-300 font-mono">{item.dateDisplay || item.date}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>{item.status}</span></td>
                                {(canEdit || canDelete) && (
                                    <td className="px-6 py-4 text-right">
                                        <div className={`flex justify-end gap-2 ${isSystemAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                            {canEdit && <button onClick={() => handleOpenModal(item)} className="p-2 bg-[#3A506B] text-white rounded" title="Edit">✏️</button>}
                                            {canDelete && <button onClick={() => item.isGroup ? handleDeleteGroup(item.originalIds) : handleDelete(item.id)} className="p-2 bg-red-900/50 text-red-200 rounded" title="Hapus">🗑️</button>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))) : (<tr><td colSpan={(canEdit || canDelete) ? 4 : 3} className="px-6 py-12 text-center text-gray-500 italic">Tiada aktiviti direkodkan.</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

            {takwimView === 'koko_weekly' && unit === 'Kokurikulum' && renderPerjumpaanMingguan()}
            {takwimView === 'koko_monthly' && unit === 'Kokurikulum' && renderPerhimpunanBulanan()}
            {takwimView === 'exam_schedule' && unit === 'Kurikulum' && renderTakwimPeperiksaan()}
            {takwimView === 'sumur_schedule' && unit === 'Hal Ehwal Murid' && renderTakwimSumur()}
        </div>
      )}

      {isModalOpen && (canEdit || canSave) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm fade-in px-4 pt-24 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-lg p-8 rounded-xl shadow-2xl border border-[#C9B458] mb-20 relative">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-4">{editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly' ? 'Kemaskini Tajuk' : editingId ? 'Kemaskini Rekod' : 'Tambah Rekod Baru'}</h3>
            <form onSubmit={handleSave} className="space-y-5">
               {(editingKokoType === 'title_weekly' || editingKokoType === 'title_monthly') && (<div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tajuk Jadual</label><input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>)}
               {editingKokoType === 'weekly' && (<><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input required type="date" value={dateToISO(formData.date)} onChange={(e) => setFormData({...formData, date: ISOToMalay(e.target.value)})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label><input required type="text" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Contoh: Perjumpaan Unit Beruniform" /></div></>)}
               {editingKokoType === 'monthly' && (<><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Bulan</label><input required type="text" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Contoh: Jan" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input required type="date" value={dateToISO(formData.date)} onChange={(e) => setFormData({...formData, date: ISOToMalay(e.target.value)})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Unit Bertugas</label><input required type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Contoh: Kadet Remaja Sekolah" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Catatan</label><input type="text" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Contoh: Pakaian Uniform Lengkap" /></div></>)}
               {editingKokoType === 'sumur' && (<><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input required type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: 15 Jan 2026" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Program</label><input required type="text" value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: SUMUR" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Guru Bertugas</label><input type="text" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label><input required type="text" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div></>)}
               {editingKokoType === 'hip' && (<><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input required type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: 15 Jan 2026" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Program</label><input required type="text" value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: OH MY ENGLISH" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Guru Bertugas</label><input type="text" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Aktiviti</label><input required type="text" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div></>)}
               {editingKokoType === 'exam_week' && (<>
                   <div className="grid grid-cols-2 gap-4">
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Minggu</label><input type="text" value={formData.week} onChange={(e) => setFormData({...formData, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                   </div>
                   {!examWeeks.find(s => s.id === editingId)?.isHoliday && (<><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan Dalaman</label><textarea value={formData.dalaman} onChange={(e) => setFormData({...formData, dalaman: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan JAJ</label><textarea value={formData.jaj} onChange={(e) => setFormData({...formData, jaj: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20" /></div><div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peperiksaan Awam</label><textarea value={formData.awam} onChange={(e) => setFormData({...formData, awam: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none h-20" /></div></>)}
                   {examWeeks.find(s => s.id === editingId)?.isHoliday && (<div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Keterangan Cuti</label><input type="text" value={formData.dalaman} onChange={(e) => setFormData({...formData, dalaman: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>)}
               </>)}
               {!['weekly','monthly','title_weekly','title_monthly','sumur','hip','exam_week'].includes(editingKokoType || '') && (
                   <>
                       {type === 'Jawatankuasa' ? (
                           <>
                               {!editingId && (
                                   <div className="flex justify-end mb-4">
                                       <button 
                                           type="button" 
                                           onClick={() => setIsBulkEntry(!isBulkEntry)} 
                                           className="text-xs text-[#C9B458] underline hover:text-white"
                                       >
                                           {isBulkEntry ? "Kembali ke Borang Biasa" : "Guna Input Pukal (Copy-Paste)"}
                                       </button>
                                   </div>
                               )}
                               
                               {isBulkEntry ? (
                                   <div>
                                       <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">
                                           Tampal Data Organisasi (Excel / Teks)
                                       </label>
                                       <p className="text-[10px] text-gray-400 mb-2">
                                           Format: <code>Peranan [TAB] Jawatan [TAB] Nama Guru</code><br/>
                                           Atau: <code>Peranan | Jawatan | Nama Guru</code>
                                       </p>
                                       <textarea 
                                           value={bulkText} 
                                           onChange={e => setBulkText(e.target.value)} 
                                           className="w-full bg-[#0B132B] border border-gray-600 rounded-lg p-3 text-white h-48 text-xs font-mono focus:border-[#C9B458] outline-none whitespace-pre" 
                                           placeholder={`Pengerusi\tPengetua\tAli bin Abu\nTimbalan Pengerusi\tGPK HEM\tAbu bin Ali`}
                                       />
                                   </div>
                               ) : (
                                   <>
                                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peranan (cth: Pengerusi)</label><input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Jawatan (cth: Pengetua)</label><input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                                       <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Guru</label><select value={formData.teacherName} onChange={(e) => setFormData({...formData, teacherName: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none"><option value="">Pilih Guru...</option>{TEACHER_FULL_NAMES.map((t, i) => <option key={i} value={t}>{t}</option>)}</select></div>
                                   </>
                               )}
                           </>
                       ) : (<>
                           <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Program / Aktiviti</label><input type="text" value={formData.event} onChange={(e) => setFormData({...formData, event: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                           <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label><input type="date" value={formatDateForInput(formData.date)} onChange={handleDateChange} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" /></div>
                       </>)}
                   </>
               )}

               <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium uppercase tracking-wide text-xs">Batal</button>
                   <button type="button" onClick={handleResetForm} className="flex-1 px-4 py-3 rounded-lg border border-red-900/50 text-red-300 hover:bg-red-900/20 transition-colors font-medium uppercase tracking-wide text-xs">
                       Reset
                   </button>
                   <button type="submit" className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5 uppercase tracking-wide text-xs">SIMPAN</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {isAddCommitteeModalOpen && isSystemAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
              <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-xl shadow-2xl border border-[#C9B458]">
                  <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2">Tambah Jawatankuasa Baru</h3>
                  <form onSubmit={handleAddCommittee} className="space-y-4">
                      <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Jawatankuasa</label><input autoFocus required type="text" value={newCommitteeName} onChange={(e) => setNewCommitteeName(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: Jawatankuasa Disiplin" /></div>
                      <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsAddCommitteeModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium uppercase tracking-wide text-xs">Batal</button><button type="submit" className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg uppercase tracking-wide text-xs">Tambah</button></div>
                  </form>
              </div>
          </div>
      )}

      {isEditCommitteeModalOpen && isSystemAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
              <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-xl shadow-2xl border border-[#C9B458]">
                  <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2">Kemaskini Nama Jawatankuasa</h3>
                  <form onSubmit={handleEditCommitteeName} className="space-y-4">
                      <div><label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Jawatankuasa</label><input autoFocus required type="text" value={newCommitteeName} onChange={(e) => setNewCommitteeName(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] outline-none" /></div>
                      <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsEditCommitteeModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium uppercase tracking-wide text-xs">Batal</button><button type="submit" className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg uppercase tracking-wide text-xs">Simpan</button></div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
