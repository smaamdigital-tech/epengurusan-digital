
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type Tab = 'info' | 'jadual' | 'analisis' | 'laporan';

interface Exam {
  id: number;
  name: string;
  code: string;
  dateStart: string;
  dateEnd: string;
  status: 'Selesai' | 'Sedang Berjalan' | 'Akan Datang';
}

interface DetailedScheduleRow {
  id: number;
  hari: string;
  tarikh: string;
  slots: {
    waktu: string;
    subjek: string;
    durasi: string;
    guruA: string;
    guruB: string;
  }[];
}

const dummyExams: Exam[] = [
  { id: 1, name: 'Ujian Pentaksiran 1', code: 'UP1', dateStart: '10-03-2026', dateEnd: '14-03-2026', status: 'Akan Datang' },
  { id: 2, name: 'Peperiksaan Pertengahan Tahun', code: 'PPT', dateStart: '15-06-2026', dateEnd: '26-06-2026', status: 'Akan Datang' },
  { id: 3, name: 'Percubaan SPM', code: 'TRIAL', dateStart: '01-11-2026', dateEnd: '20-11-2026', status: 'Akan Datang' },
  { id: 4, name: 'Peperiksaan Akhir Tahun', code: 'PAT', dateStart: '15-01-2027', dateEnd: '05-02-2027', status: 'Akan Datang' },
];

const detailedSchedule: DetailedScheduleRow[] = [
  {
    id: 1,
    hari: "ISNIN",
    tarikh: "10 MAC 2026",
    slots: [
      { waktu: "08:00 AM - 10:00 AM", subjek: "BAHASA MELAYU Kertas 1", durasi: "2 JAM", guruA: "CIKGU ROSMAWATI", guruB: "CIKGU HAFIZ" },
      { waktu: "11:00 AM - 01:30 PM", subjek: "BAHASA MELAYU Kertas 2", durasi: "2 JAM 30 MIN", guruA: "CIKGU ROSMAWATI", guruB: "CIKGU HAFIZ" }
    ]
  },
  {
    id: 2,
    hari: "SELASA",
    tarikh: "11 MAC 2026",
    slots: [
      { waktu: "08:00 AM - 09:30 AM", subjek: "BAHASA INGGERIS Kertas 1", durasi: "1 JAM 30 MIN", guruA: "CIKGU NOORIZATI", guruB: "CIKGU HAKIM" },
      { waktu: "10:30 AM - 12:00 PM", subjek: "BAHASA INGGERIS Kertas 2", durasi: "1 JAM 30 MIN", guruA: "CIKGU NOORIZATI", guruB: "CIKGU HAKIM" }
    ]
  },
  {
    id: 3,
    hari: "RABU",
    tarikh: "12 MAC 2026",
    slots: [
      { waktu: "08:00 AM - 09:00 AM", subjek: "SEJARAH Kertas 1", durasi: "1 JAM", guruA: "CIKGU AIND", guruB: "CIKGU SUFIAN" },
      { waktu: "10:00 AM - 12:30 PM", subjek: "SEJARAH Kertas 2", durasi: "2 JAM 30 MIN", guruA: "CIKGU AIND", guruB: "CIKGU SUFIAN" }
    ]
  },
  {
    id: 4,
    hari: "KHAMIS",
    tarikh: "13 MAC 2026",
    slots: [
      { waktu: "08:00 AM - 09:30 AM", subjek: "MATEMATIK Kertas 1", durasi: "1 JAM 30 MIN", guruA: "CIKGU ANIS", guruB: "CIKGU ZULKIFLI" },
      { waktu: "10:30 AM - 01:00 PM", subjek: "MATEMATIK Kertas 2", durasi: "2 JAM 30 MIN", guruA: "CIKGU ANIS", guruB: "CIKGU ZULKIFLI" }
    ]
  }
];

const dummyAnalysis = {
  examName: 'Peperiksaan Akhir Tahun 2025',
  gpa: 4.12,
  passPercentage: 88.5,
  bestSubject: 'Pendidikan Islam',
  weakSubject: 'Matematik Tambahan',
};

export const KurikulumPeperiksaan: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [exams, setExams] = useState(dummyExams);

  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  const handleAddExam = () => {
    if (!isAdmin) return;
    const newExam: Exam = {
      id: Date.now(),
      name: 'Ujian Baru',
      code: 'NEW',
      dateStart: 'DD-MM-YYYY',
      dateEnd: 'DD-MM-YYYY',
      status: 'Akan Datang'
    };
    setExams([...exams, newExam]);
    showToast("Peperiksaan baharu ditambah.");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-[#1C2541] rounded-xl p-6 border border-gray-700 shadow-lg hover:border-[#C9B458] transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#3A506B] text-white text-xs font-bold px-2 py-1 rounded">
                    {exam.code}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                    exam.status === 'Selesai' ? 'bg-green-900/50 text-green-400 border-green-600' : 
                    exam.status === 'Sedang Berjalan' ? 'bg-blue-900/50 text-blue-400 border-blue-600' :
                    'bg-yellow-900/30 text-[#C9B458] border-[#C9B458]'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#C9B458] transition-colors">
                  {exam.name}
                </h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>📅 Mula: <span className="text-gray-200">{exam.dateStart}</span></p>
                  <p>🏁 Tamat: <span className="text-gray-200">{exam.dateEnd}</span></p>
                </div>
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                    <button className="text-sm text-blue-400 hover:text-white flex items-center gap-1">
                      <span>✏️</span> Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <div onClick={handleAddExam} className="bg-[#1C2541]/50 border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9B458] hover:bg-[#1C2541] transition-all min-h-[200px]">
                <div className="text-4xl text-gray-500 mb-2">+</div>
                <p className="text-gray-400 font-semibold">Tambah Peperiksaan</p>
              </div>
            )}
          </div>
        );

      case 'jadual':
        return (
          <div className="space-y-6 fade-in font-poppins">
            <div className="flex justify-between items-center bg-gray-100 p-5 rounded-xl border border-gray-300 shadow-lg">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700 text-xl shadow-inner border border-gray-300">
                    📅
                 </div>
                 <div>
                    <h4 className="text-gray-800 font-bold uppercase text-base tracking-widest font-poppins">Jadual Waktu Peperiksaan Akhir Tahun</h4>
                    <p className="text-xs text-gray-500 font-medium font-poppins">Sesi Akademik 2025/2026 • Tingkatan 5</p>
                 </div>
              </div>
              <button 
                onClick={() => showToast("Menjana Laporan PDF...")}
                className="bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 border border-gray-600 font-poppins"
              >
                <span>📥</span> CETAK JADUAL LENGKAP
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse min-w-[1100px] font-poppins">
                  <thead>
                    <tr className="bg-gray-200 text-gray-800 text-sm font-bold uppercase tracking-wider">
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-44">Hari / Tarikh</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-56">Sesi / Masa</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300">Mata Pelajaran Peperiksaan</th>
                      <th rowSpan={2} className="px-6 py-6 border border-gray-300 w-36">Tempoh</th>
                      <th colSpan={2} className="px-6 py-4 border border-gray-300 bg-gray-300 text-gray-900">Guru Bertugas Mengawas</th>
                    </tr>
                    <tr className="bg-gray-100 text-gray-700 text-[11px] font-black uppercase tracking-[0.2em]">
                      <th className="px-4 py-3 border border-gray-300">5 AL-HANAFI</th>
                      <th className="px-4 py-3 border border-gray-300">5 AL-SYAFIE</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {detailedSchedule.map((dayRow) => (
                      <React.Fragment key={dayRow.id}>
                        {dayRow.slots.map((slot, idx) => (
                          <tr key={`${dayRow.id}-${idx}`} className="hover:bg-gray-50 transition-all duration-300 text-gray-800">
                            {idx === 0 && (
                              <td rowSpan={dayRow.slots.length} className="px-4 py-8 border border-gray-300 font-bold bg-gray-50 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-400"></div>
                                <div className="flex flex-col gap-1 relative z-10">
                                  <span className="text-gray-900 text-2xl font-black leading-none font-poppins">{dayRow.hari}</span>
                                  <span className="text-[11px] text-gray-500 font-bold tracking-widest mt-1 font-poppins">{dayRow.tarikh}</span>
                                </div>
                              </td>
                            )}
                            <td className="px-4 py-6 border border-gray-300 font-mono text-[13px] text-gray-700 bg-gray-50/50">
                              {slot.waktu}
                            </td>
                            <td className="px-4 py-6 border border-gray-300 font-black text-gray-900 uppercase tracking-wider text-[15px] font-poppins">
                              {slot.subjek}
                            </td>
                            <td className="px-4 py-6 border border-gray-300 font-bold text-gray-800 bg-gray-50/30 font-poppins">
                              {slot.durasi}
                            </td>
                            {idx === 0 && (
                              <>
                                <td rowSpan={dayRow.slots.length} className="px-4 py-6 border border-gray-300 font-bold text-center bg-white align-middle text-[12px] leading-relaxed">
                                  <div className="bg-gray-100 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-800 font-poppins">{slot.guruA}</div>
                                </td>
                                <td rowSpan={dayRow.slots.length} className="px-4 py-6 border border-gray-300 font-bold text-center bg-white align-middle text-[12px] leading-relaxed">
                                  <div className="bg-gray-100 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-800 font-poppins">{slot.guruB}</div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        <tr className="bg-gray-50 h-4">
                           <td colSpan={6} className="border-y border-gray-200"></td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-100 p-5 rounded-2xl border border-gray-300 flex items-start gap-4">
               <div className="text-2xl mt-1">⚠️</div>
               <div>
                  <p className="text-gray-700 font-bold text-sm uppercase mb-1 font-poppins">Nota Penting Pengurusan Peperiksaan:</p>
                  <ul className="text-[11px] text-gray-500 list-disc list-outside ml-4 space-y-1 font-poppins">
                    <li>Calon dikehendaki membawa slip peperiksaan dan kad pengenalan ke dalam dewan.</li>
                    <li>Sila berada di dewan peperiksaan sekurang-kurangnya 15 minit sebelum waktu bermula.</li>
                    <li>Guru bertugas dikehendaki mengambil fail soalan di bilik peperiksaan 20 minit sebelum waktu.</li>
                  </ul>
               </div>
            </div>
          </div>
        );

      case 'analisis':
        return (
          <div className="space-y-8 fade-in">
            <div className="flex justify-between items-center">
               <div>
                 <h3 className="text-xl font-bold text-white">Analisis: {dummyAnalysis.examName}</h3>
                 <p className="text-sm text-gray-400">Prestasi keseluruhan sekolah.</p>
               </div>
               {isAdmin && (
                 <button onClick={() => showToast("Sila pilih fail...")} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors shadow-lg">
                   ⬆️ Muat Naik Markah
                 </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-[#C9B458] shadow-lg">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Gred Purata (GPS)</p>
                <div className="text-4xl font-bold text-white mt-2">{dummyAnalysis.gpa}</div>
                <p className="text-xs text-green-400 mt-1">↑ 0.05 dari tahun lalu</p>
              </div>
              <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Peratus Lulus</p>
                <div className="text-4xl font-bold text-white mt-2">{dummyAnalysis.passPercentage}%</div>
                <p className="text-xs text-green-400 mt-1">Target: 90%</p>
              </div>
              <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Subjek Terbaik</p>
                <div className="text-xl font-bold text-white mt-2 leading-tight">{dummyAnalysis.bestSubject}</div>
                <p className="text-xs text-blue-300 mt-1">GPMP: 1.85</p>
              </div>
              <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-red-500 shadow-lg">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Subjek Kritikal</p>
                <div className="text-xl font-bold text-white mt-2 leading-tight">{dummyAnalysis.weakSubject}</div>
                <p className="text-xs text-red-300 mt-1">GPMP: 6.20</p>
              </div>
            </div>

            <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-xl">
               <h4 className="text-white font-bold mb-6 border-b border-gray-700 pb-2">Prestasi Mengikut Subjek Utama (Peratus Lulus)</h4>
               <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
                  {[
                    { subject: 'BM', val: 98, color: 'bg-green-500' },
                    { subject: 'BI', val: 85, color: 'bg-blue-500' },
                    { subject: 'SEJ', val: 92, color: 'bg-yellow-500' },
                    { subject: 'MAT', val: 78, color: 'bg-red-500' },
                    { subject: 'SAINS', val: 88, color: 'bg-purple-500' },
                    { subject: 'PAI', val: 100, color: 'bg-teal-500' },
                    { subject: 'BA', val: 95, color: 'bg-indigo-500' },
                  ].map((item) => (
                    <div key={item.subject} className="flex flex-col items-center w-full group">
                        <div className="text-xs text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{item.val}%</div>
                        <div className={`w-full md:w-16 rounded-t-lg transition-all duration-500 hover:opacity-80 ${item.color}`} style={{ height: `${item.val * 0.6}%` }}></div>
                        <div className="text-[10px] md:text-xs text-gray-400 mt-2 font-bold">{item.subject}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'laporan':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
             {[
               { title: "Slip Keputusan Pelajar", icon: "📄", desc: "Jana dan cetak slip keputusan individu pelajar." },
               { title: "Analisis Mengikut Kelas", icon: "📊", desc: "Laporan prestasi GPMP dan peratus lulus mengikut kelas." },
               { title: "Analisis Mengikut Mata Pelajaran", icon: "📚", desc: "Post-mortem panitia dan analisis item." },
               { title: "Senarai Pelajar Cemerlang", icon: "🏆", desc: "Senarai pelajar yang mendapat semua A atau Gred Cemerlang." },
             ].map((report, idx) => (
                <div key={idx} className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 hover:border-[#C9B458] transition-all flex items-start gap-4 group cursor-pointer" onClick={() => showToast("Menjana...")}>
                   <div className="bg-[#0B132B] p-3 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                      {report.icon}
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-lg group-hover:text-[#C9B458] transition-colors">{report.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{report.desc}</p>
                      <span className="text-[#C9B458] text-xs font-bold mt-3 block">Klik untuk jana →</span>
                   </div>
                </div>
             ))}
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in">
      <div className="border-b border-gray-400 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2">
           <span className="font-bold">KURIKULUM</span>
           <span className="opacity-50">/</span>
           <span className="uppercase font-bold opacity-80">PEPERIKSAAN</span>
        </div>
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase">Pengurusan Peperiksaan</h2>
        <p className="text-black mt-1 opacity-70 font-semibold">Portal rasmi pengurusan takwim, jadual, dan analisis peperiksaan SMAAM.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-400 scrollbar-thin">
        {[
          { key: 'info', label: 'Maklumat Peperiksaan', icon: 'ℹ️' },
          { key: 'jadual', label: 'Jadual Waktu', icon: '📅' },
          { key: 'analisis', label: 'Analisis & Prestasi', icon: '📈' },
          { key: 'laporan', label: 'Pelaporan', icon: '📑' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap font-poppins
              ${activeTab === tab.key 
                ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' 
                : 'text-[#1C2541] hover:text-black hover:bg-white/30'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
