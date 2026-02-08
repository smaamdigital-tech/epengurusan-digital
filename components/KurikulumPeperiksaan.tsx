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

interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  subject: string;
  form: string;
  duration: string;
}

interface AnalysisData {
  examName: string;
  gpa: number;
  passPercentage: number;
  bestSubject: string;
  weakSubject: string;
}

const dummyExams: Exam[] = [
  { id: 1, name: 'Ujian Pentaksiran 1', code: 'UP1', dateStart: '10-03-2026', dateEnd: '14-03-2026', status: 'Akan Datang' },
  { id: 2, name: 'Peperiksaan Pertengahan Tahun', code: 'PPT', dateStart: '15-06-2026', dateEnd: '26-06-2026', status: 'Akan Datang' },
  { id: 3, name: 'Percubaan SPM', code: 'TRIAL', dateStart: '01-11-2026', dateEnd: '20-11-2026', status: 'Akan Datang' },
  { id: 4, name: 'Peperiksaan Akhir Tahun', code: 'PAT', dateStart: '15-01-2027', dateEnd: '05-02-2027', status: 'Akan Datang' },
];

const dummySchedule: ScheduleItem[] = [
  { id: 1, date: '10-03-2026', time: '08:00 - 10:00', subject: 'Bahasa Melayu K1', form: 'Tingkatan 5', duration: '2 Jam' },
  { id: 2, date: '10-03-2026', time: '10:30 - 12:30', subject: 'Sejarah', form: 'Tingkatan 5', duration: '2 Jam' },
  { id: 3, date: '11-03-2026', time: '08:00 - 09:30', subject: 'Bahasa Inggeris', form: 'Tingkatan 1', duration: '1.5 Jam' },
  { id: 4, date: '11-03-2026', time: '08:00 - 10:30', subject: 'Matematik', form: 'Tingkatan 3', duration: '2.5 Jam' },
  { id: 5, date: '12-03-2026', time: '08:00 - 10:00', subject: 'Sains', form: 'Tingkatan 4', duration: '2 Jam' },
];

const dummyAnalysis: AnalysisData = {
  examName: 'Peperiksaan Akhir Tahun 2025',
  gpa: 4.12,
  passPercentage: 88.5,
  bestSubject: 'Pendidikan Islam',
  weakSubject: 'Matematik Tambahan',
};

export const KurikulumPeperiksaan: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [filterForm, setFilterForm] = useState('Semua');
  const [exams, setExams] = useState(dummyExams);

  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- Handlers ---
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
    showToast("Peperiksaan baharu ditambah (Dummy).");
  };

  const handleDownloadSchedule = () => {
    showToast("Memuat turun Jadual Peperiksaan (PDF)...");
  };

  const handleUploadMarks = () => {
    showToast("Sila pilih fail CSV/Excel untuk dimuat naik.");
  };

  const handleGenerateSlip = () => {
    showToast("Menjana Slip Keputusan Pelajar...");
  };

  // --- Render Tabs ---
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
              <div 
                onClick={handleAddExam}
                className="bg-[#1C2541]/50 border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9B458] hover:bg-[#1C2541] transition-all min-h-[200px]"
              >
                <div className="text-4xl text-gray-500 mb-2">+</div>
                <p className="text-gray-400 font-semibold">Tambah Peperiksaan</p>
              </div>
            )}
          </div>
        );

      case 'jadual':
        const filteredSchedule = filterForm === 'Semua' 
          ? dummySchedule 
          : dummySchedule.filter(item => item.form === filterForm);

        return (
          <div className="space-y-6 fade-in">
            {/* Filter & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1C2541] p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">Tapis Tingkatan:</span>
                <select 
                  value={filterForm}
                  onChange={(e) => setFilterForm(e.target.value)}
                  className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-[#C9B458]"
                >
                  <option value="Semua">Semua</option>
                  <option value="Tingkatan 1">Tingkatan 1</option>
                  <option value="Tingkatan 2">Tingkatan 2</option>
                  <option value="Tingkatan 3">Tingkatan 3</option>
                  <option value="Tingkatan 4">Tingkatan 4</option>
                  <option value="Tingkatan 5">Tingkatan 5</option>
                </select>
              </div>
              <button 
                onClick={handleDownloadSchedule}
                className="bg-[#3A506B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#4a6382] transition-colors flex items-center gap-2"
              >
                <span>📥</span> Muat Turun Jadual PDF
              </button>
            </div>

            {/* Table */}
            <div className="bg-[#1C2541] rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4 border-b border-gray-700">Tarikh</th>
                      <th className="px-6 py-4 border-b border-gray-700">Masa</th>
                      <th className="px-6 py-4 border-b border-gray-700">Subjek</th>
                      <th className="px-6 py-4 border-b border-gray-700">Tingkatan</th>
                      <th className="px-6 py-4 border-b border-gray-700 text-center">Tempoh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-[14px]">
                    {filteredSchedule.map((item) => (
                      <tr key={item.id} className="hover:bg-[#253252] transition-colors">
                        <td className="px-6 py-4 text-white font-mono">{item.date}</td>
                        <td className="px-6 py-4 text-gray-300">{item.time}</td>
                        <td className="px-6 py-4 font-bold text-white">{item.subject}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#0B132B] border border-gray-600 px-2 py-1 rounded text-xs text-gray-300">
                            {item.form}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-[#C9B458] font-semibold">{item.duration}</td>
                      </tr>
                    ))}
                    {filteredSchedule.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                          Tiada jadual untuk paparan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analisis':
        return (
          <div className="space-y-8 fade-in">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
               <div>
                 <h3 className="text-xl font-bold text-white">Analisis: {dummyAnalysis.examName}</h3>
                 <p className="text-sm text-gray-400">Prestasi keseluruhan sekolah.</p>
               </div>
               {isAdmin && (
                 <button 
                   onClick={handleUploadMarks}
                   className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors shadow-lg"
                 >
                   ⬆️ Muat Naik Markah
                 </button>
               )}
            </div>

            {/* KPI Cards */}
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

            {/* Simple CSS Bar Chart for Subject Performance */}
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
                        <div 
                          className={`w-full md:w-16 rounded-t-lg transition-all duration-500 hover:opacity-80 ${item.color}`} 
                          style={{ height: `${item.val * 0.6}%` }} // Scale factor for visual fit
                        ></div>
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
             {/* Report Cards */}
             {[
               { title: "Slip Keputusan Pelajar", icon: "📄", desc: "Jana dan cetak slip keputusan individu pelajar." },
               { title: "Analisis Mengikut Kelas", icon: "📊", desc: "Laporan prestasi GPMP dan peratus lulus mengikut kelas." },
               { title: "Analisis Mengikut Mata Pelajaran", icon: "📚", desc: "Post-mortem panitia dan analisis item." },
               { title: "Senarai Pelajar Cemerlang", icon: "🏆", desc: "Senarai pelajar yang mendapat semua A atau Gred Cemerlang." },
             ].map((report, idx) => (
                <div key={idx} className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 hover:border-[#C9B458] transition-all flex items-start gap-4 group cursor-pointer" onClick={handleGenerateSlip}>
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
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      {/* Breadcrumb & Title */}
      <div className="border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
           <span>KURIKULUM</span>
           <span>/</span>
           <span className="uppercase">PEPERIKSAAN</span>
        </div>
        <h2 className="text-3xl font-bold text-white font-montserrat">Peperiksaan Sekolah</h2>
        <p className="text-gray-400 mt-1">Pengurusan Jadual, Analisis, dan Pelaporan Peperiksaan.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800">
        {[
          { key: 'info', label: 'Maklumat Peperiksaan', icon: 'ℹ️' },
          { key: 'jadual', label: 'Jadual Waktu', icon: '📅' },
          { key: 'analisis', label: 'Analisis & Prestasi', icon: '📈' },
          { key: 'laporan', label: 'Pelaporan', icon: '📑' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap
              ${activeTab === tab.key 
                ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' 
                : 'text-gray-400 hover:text-white hover:bg-[#1C2541]/50'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};
