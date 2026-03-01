import React from 'react';

export interface CalendarEvent {
  day: number;
  label: string;
  isHoliday?: boolean;
  isSchoolHoliday?: boolean;
  color?: string;
  icon?: string;
}

export interface MonthData {
  id: number;
  name: string;
  islamicMonth: string;
  headerColor1: string;
  headerColor2: string;
  startDay: number;
  daysInMonth: number;
  catatan: React.ReactNode;
  events: CalendarEvent[];
  hijriDayStart: number;
  hijriMonth1: string;
  hijriMonth2: string;
  hijriTransitionDay: number;
  rujukan: string[];
}

export const getHijriLabel = (month: MonthData, day: number) => {
    let hijriDay = 0, hijriMonthName = "";
    if (day < month.hijriTransitionDay) { hijriDay = month.hijriDayStart + (day - 1); hijriMonthName = month.hijriMonth1; }
    else { hijriDay = (day - month.hijriTransitionDay) + 1; hijriMonthName = month.hijriMonth2; }
    return `${hijriDay} ${hijriMonthName}`;
};

export const calendar2026Data: MonthData[] = [
  {
    id: 0, name: 'JANUARI 2026', islamicMonth: "REJAB - SYA'ABAN 1447", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 4, daysInMonth: 31, hijriDayStart: 11, hijriMonth1: "Rejab", hijriMonth2: "Sya'aban", hijriTransitionDay: 20,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 2<br/>Sesi Persekolahan 2025/2026</h4>
          <div className="mt-2 text-xs">
            <p className="font-bold text-blue-800">Kump. A</p><p>19.12.2025 hingga 10.1.2026</p>
            <p className="font-bold text-blue-800 mt-1">Kump. B</p><p>20.12.2025 hingga 11.1.2026</p>
            <p className="mt-1 font-bold">(23 hari)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-[#1a237e]">Mula Persekolahan<br/>Sesi Akademik 2026</h4>
          <div className="mt-2 text-xs"><p className="font-bold">Kump. A: 11.01.2026 (Ahad)</p><p className="font-bold">Kump. B: 12.01.2026 (Isnin)</p></div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
      { day: 1, label: 'Tahun Baru', isHoliday: true },
      { day: 2, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 3, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 4, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 5, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 6, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 7, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 8, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 9, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 10, label: 'Cuti Sekolah', isSchoolHoliday: true },
      { day: 11, label: 'Sesi Persekolahan 2026 Bermula', icon: '🎒' },
      { day: 12, label: 'Sesi Persekolahan 2026 Bermula', icon: '🎒' },
      { day: 14, label: 'Hari Keputeraan YDP Besar N.Sembilan', color: 'bg-yellow-400' },
      { day: 17, label: 'Israk & Mikraj', color: 'bg-purple-600 text-white', icon: '🕌' },
      { day: 22, label: 'Bayaran Gaji Penjawat Awam', icon: '💵', color: 'bg-green-200' },
    ]
  },
  {
    id: 1, name: 'FEBRUARI 2026', islamicMonth: "SYA'ABAN - RAMADAN 1447", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 0, daysInMonth: 28, hijriDayStart: 13, hijriMonth1: "Sya'aban", hijriMonth2: "Ramadan", hijriTransitionDay: 19,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
         <div>
          <h4 className="font-bold text-red-600">Cuti Perayaan<br/>(TAHUN BARU CINA)</h4>
          <div className="mt-2 text-xs">
            <p className="font-bold">Kump. A</p><p>15.02.2026 (Ahad)</p><p>16.02.2026 (Isnin)</p><p>19.02.2026 (Khamis)</p>
            <p className="font-bold mt-1">Kump. B</p><p>16.02.2026 (Isnin)</p><p>19.02.2026 (Khamis)</p><p>20.02.2026 (Jumaat)</p>
            <p className="mt-2 italic text-gray-600">Tiga (3) Hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 1, label: 'Thaipusam / Hari Wilayah', isHoliday: true, icon: '🕯️' },
        { day: 12, label: 'Bayaran Gaji Penjawat Awam', icon: '💵', color: 'bg-green-200' },
        { day: 15, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 16, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 17, label: 'Tahun Baru Cina', isHoliday: true, color: 'bg-red-500 text-white', icon: '🏮' },
        { day: 18, label: 'Tahun Baru Cina', isHoliday: true, color: 'bg-red-500 text-white', icon: '🏮' },
        { day: 19, label: '1 Ramadan', color: 'bg-purple-500 text-white', icon: '🌙' },
        { day: 20, label: 'Cuti Sekolah', isSchoolHoliday: true },
    ]
  },
  {
    id: 2, name: 'MAC 2026', islamicMonth: "RAMADAN - SYAWAL 1447", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 0, daysInMonth: 31, hijriDayStart: 11, hijriMonth1: "Ramadan", hijriMonth2: "Syawal", hijriTransitionDay: 21,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 1<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>20.03.2026 hingga 28.03.2026</p>
             <p className="font-bold mt-1">Kump. B</p><p>21.03.2026 hingga 29.03.2026</p><p className="font-bold">(9 hari)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-green-700">Cuti Penggal 1/2026</h4>
          <p className="text-xs font-bold mt-1">Cuti Sekolah Cuti Sekolah</p><p className="text-xs font-bold">Cuti Sekolah</p>
          <h4 className="font-bold text-red-600 mt-2">Cuti Perayaan<br/>(HARI RAYA AIDILFITRI)</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>19.03.2026 (Khamis)</p>
             <p className="font-bold mt-1">Kump. B</p><p>19.03.2026 (Khamis)</p><p>20.03.2026 (Jumaat)</p>
             <p className="mt-2 italic text-gray-600">Satu (1) hari Cuti Tambahan KPM untuk Kumpulan A dan Dua (2) hari Cuti Tambahan KPM untuk Kumpulan B</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
       { day: 4, label: 'Ulang Tahun Pertabalan Sultan Terengganu', isHoliday: true },
       { day: 7, label: 'Nuzul Al-Quran', isHoliday: true, icon: '📖' },
       { day: 8, label: 'Selamat Hari Wanita', color: 'bg-pink-200' },
       { day: 19, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 20, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 21, label: 'Hari Raya Aidilfitri', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
       { day: 22, label: 'Hari Raya Aidilfitri', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
       { day: 23, label: 'Hari Keputeraan Sultan Johor', isHoliday: true, color: 'bg-blue-800 text-white' },
       { day: 24, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 25, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 26, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 27, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 28, label: 'Cuti Sekolah', isSchoolHoliday: true },
       { day: 29, label: 'Cuti Sekolah', isSchoolHoliday: true },
    ]
  },
  {
    id: 3, name: 'APRIL 2026', islamicMonth: "SYAWAL - ZULKAEDAH 1447", headerColor1: 'bg-red-600', headerColor2: 'bg-[#2e7d32]', startDay: 3, daysInMonth: 30, hijriDayStart: 13, hijriMonth1: "Syawal", hijriMonth2: "Zulkaedah", hijriTransitionDay: 19,
    catatan: (<div className="space-y-4 text-sm text-gray-800 font-inter"></div>),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [{ day: 26, label: 'Hari Keputeraan Sultan Terengganu', isHoliday: true }]
  },
  {
    id: 4, name: 'MEI 2026', islamicMonth: "ZULKAEDAH - ZULHIJJAH 1447", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 5, daysInMonth: 31, hijriDayStart: 14, hijriMonth1: "Zulkaedah", hijriMonth2: "Zulhijjah", hijriTransitionDay: 18,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PERTENGAHAN TAHUN<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>22.05.2026 hingga 06.06.2026</p>
             <p className="font-bold mt-1">Kump. B</p><p>23.05.2026 hingga 07.06.2026</p><p className="font-bold">(16 hari)</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 1, label: 'Hari Pekerja', isHoliday: true },
        { day: 4, label: 'Hari Wesak', isHoliday: true, icon: '🪷' },
        { day: 17, label: 'Hari Keputeraan Raja Perlis', isHoliday: true },
        { day: 22, label: 'Hari Hol Pahang / Cuti Sekolah', isSchoolHoliday: true },
        { day: 23, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 24, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 25, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 26, label: 'Cuti Sekolah / Hari Arafah', isSchoolHoliday: true },
        { day: 27, label: 'Hari Raya Aidiladha', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
        { day: 28, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 30, label: 'Pesta Kaamatan', isHoliday: true },
        { day: 31, label: 'Pesta Kaamatan', isHoliday: true },
    ]
  },
  {
    id: 5, name: 'JUN 2026', islamicMonth: "ZULHIJJAH 1447 - MUHARAM 1448", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 1, daysInMonth: 30, hijriDayStart: 15, hijriMonth1: "Zulhijjah", hijriMonth2: "Muharram", hijriTransitionDay: 17,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PERTENGAHAN TAHUN<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>22.05.2026 hingga 06.06.2026</p>
             <p className="font-bold mt-1">Kump. B</p><p>23.05.2026 hingga 07.06.2026</p><p className="font-bold">(16 hari)</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 1, label: 'Hari Gawai / Keputeraan YDP Agong', isHoliday: true },
        { day: 2, label: 'Hari Gawai', isHoliday: true },
        { day: 3, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 4, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 7, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 17, label: 'Awal Muharram', isHoliday: true, color: 'bg-purple-600 text-white', icon: '🕌' },
        { day: 21, label: 'Hari Keputeraan Sultan Kedah', isHoliday: true },
    ]
  },
  {
    id: 6, name: 'JULAI 2026', islamicMonth: "MUHARAM - SAFAR 1448", headerColor1: 'bg-red-600', headerColor2: 'bg-[#2e7d32]', startDay: 3, daysInMonth: 31, hijriDayStart: 15, hijriMonth1: "Muharram", hijriMonth2: "Safar", hijriTransitionDay: 16,
    catatan: (<div className="space-y-4 text-sm text-gray-800 font-inter"></div>),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 7, label: 'Hari Warisan Dunia Georgetown', color: 'bg-yellow-200' },
        { day: 11, label: 'Hari Kelahiran TYT P.Pinang', isHoliday: true },
        { day: 21, label: 'Hari Hol Johor', isHoliday: true },
        { day: 30, label: 'Hari Keputeraan Sultan Pahang', isHoliday: true },
    ]
  },
  {
    id: 7, name: 'OGOS 2026', islamicMonth: "SAFAR - RABIULAWAL 1448", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 6, daysInMonth: 31, hijriDayStart: 17, hijriMonth1: "Safar", hijriMonth2: "Rabiulawal", hijriTransitionDay: 14,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 2<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>28.08.2026 hingga 05.09.2026</p>
             <p className="font-bold mt-1">Kump. B</p><p>29.08.2026 hingga 06.09.2026</p><p className="font-bold">(9 hari)</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 24, label: 'Hari Kelahiran TYT Melaka', isHoliday: true },
        { day: 25, label: 'Maulidur Rasul', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
        { day: 28, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 30, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 31, label: 'Hari Kebangsaan / Cuti Sekolah', isHoliday: true, icon: '🇲🇾', color: 'bg-blue-800 text-white' },
    ]
  },
  {
    id: 8, name: 'SEPTEMBER 2026', islamicMonth: "RABIULAWAL - RABIULAKHIR 1448", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 2, daysInMonth: 30, hijriDayStart: 19, hijriMonth1: "Rabiulawal", hijriMonth2: "Rabiulakhir", hijriTransitionDay: 13,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 2<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>28.08.2026 hingga 05.09.2026</p>
             <p className="font-bold mt-1">Kump. B</p><p>29.08.2026 hingga 06.09.2026</p><p className="font-bold">(9 hari)</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 1, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 2, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 3, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 4, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 16, label: 'Hari Malaysia', isHoliday: true, icon: '🇲🇾' },
        { day: 29, label: 'Hari Keputeraan Sultan Kelantan', isHoliday: true },
        { day: 30, label: 'Hari Keputeraan Sultan Kelantan', isHoliday: true },
    ]
  },
  {
    id: 9, name: 'OKTOBER 2026', islamicMonth: "RABIULAKHIR - JAMADILAWAL 1448", headerColor1: 'bg-red-600', headerColor2: 'bg-[#2e7d32]', startDay: 4, daysInMonth: 31, hijriDayStart: 19, hijriMonth1: "Rabiulakhir", hijriMonth2: "Jamadilawal", hijriTransitionDay: 12,
    catatan: (<div className="space-y-4 text-sm text-gray-800 font-inter"></div>),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [{ day: 10, label: 'Hari Kelahiran TYT Sarawak', isHoliday: true }]
  },
  {
    id: 10, name: 'NOVEMBER 2026', islamicMonth: "JAMADILAWAL - JAMADILAKHIR 1448", headerColor1: 'bg-red-600', headerColor2: 'bg-[#2e7d32]', startDay: 0, daysInMonth: 30, hijriDayStart: 21, hijriMonth1: "Jamadilawal", hijriMonth2: "Jamadilakhir", hijriTransitionDay: 11,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
         <div>
          <h4 className="font-bold text-[#1a237e]">Cuti Perayaan Deepavali<br/>(DEEPAVALI)</h4>
          <div className="mt-2 text-xs">
            <p className="font-bold">Kump. A</p><p>09.11.2026 (Isnin)</p>
            <p className="font-bold mt-1">Kump. B</p><p>10.11.2026 (Selasa)</p>
            <p className="mt-2">Semua Negeri Kumpulan B kecuali Negeri Sarawak</p><p>09.11.2026 (Isnin)</p>
            <p className="font-bold">Negeri Sarawak Sahaja</p>
            <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
              <p>Satu (1) hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B</p>
              <p>Satu (1) hari Cuti Peruntukan KPM untuk Negeri Sarawak</p>
            </div>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 6, label: 'Hari Keputeraan Sultan Perak', isHoliday: true },
        { day: 8, label: 'Deepavali', isHoliday: true, icon: '🪔', color: 'bg-purple-800 text-white' },
        { day: 9, label: 'Cuti Deepavali', isHoliday: true, color: 'bg-purple-800 text-white' },
        { day: 10, label: 'Cuti Deepavali', isHoliday: true, color: 'bg-purple-800 text-white' },
    ]
  },
  {
    id: 11, name: 'DISEMBER 2026', islamicMonth: "JAMADILAKHIR - REJAB 1448", headerColor1: 'bg-[#1a237e]', headerColor2: 'bg-[#2e7d32]', startDay: 2, daysInMonth: 31, hijriDayStart: 21, hijriMonth1: "Jamadilakhir", hijriMonth2: "Rejab", hijriTransitionDay: 11,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800 font-inter">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI AKHIR<br/>PERSEKOLAHAN 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A</p><p>04.12.2026 hingga 31.12.2026</p><p className="font-bold">(28 hari)</p>
             <p className="font-bold mt-1">Kump. B</p><p>05.12.2026 hingga 31.12.2026</p><p className="font-bold">(27 hari)</p>
          </div>
        </div>
      </div>
    ),
    rujukan: ["Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan Kementerian Pendidikan", "Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025 - Tarikh dan Peraturan Pembayaran Emolumen Tahun 2026"],
    events: [
        { day: 4, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 11, label: 'Hari Keputeraan Sultan Selangor', isHoliday: true },
        { day: 25, label: 'Hari Krismas', isHoliday: true, icon: '🎄', color: 'bg-red-600 text-white' },
        { day: 26, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 27, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 28, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 30, label: 'Cuti Sekolah', isSchoolHoliday: true },
        { day: 31, label: 'Cuti Sekolah', isSchoolHoliday: true },
    ]
  },
];

export const getHijriDateStringForDate = (date: Date): string => {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const day = date.getDate();

  if (year === 2026) {
    const monthData = calendar2026Data[monthIndex];
    if (monthData) {
       const label = getHijriLabel(monthData, day);
       const islamicMonthStr = monthData.islamicMonth;
       const yearMatch = islamicMonthStr.match(/\d{4}/);
       const hijriYear = yearMatch ? yearMatch[0] : '';
       return `${label} ${hijriYear}`;
    }
  }

  try {
    return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
  } catch (e) {
    return "";
  }
};

