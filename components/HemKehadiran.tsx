import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type Tab = 'rekod' | 'laporan' | 'analitik';

interface Student {
  id: number;
  name: string;
  kp: string;
  className: string;
}

interface AttendanceStatus {
  studentId: number;
  status: 'Hadir' | 'Tidak Hadir' | 'Lewat';
  notes?: string;
}

const CLASS_LIST = [
  "1 Al-Hanafi", "1 Al-Syafie", "1 Al-Maliki",
  "2 Al-Hanafi", "2 Al-Syafie", "2 Al-Maliki",
  "3 Al-Hanafi", "3 Al-Syafie", "3 Al-Maliki",
  "4 Al-Hanafi", "4 Al-Syafie",
  "5 Al-Hanafi", "5 Al-Syafie"
];

// Dummy students generator
const generateStudents = (className: string): Student[] => {
  const count = 10; // For demo purpose
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Pelajar ${className.split(' ')[0]} - ${i + 1}`,
    kp: `100101-01-${(1000 + i).toString()}`,
    className: className
  }));
};

export const HemKehadiran: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('rekod');
  
  // State for Record
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>(generateStudents(CLASS_LIST[0]));
  const [attendance, setAttendance] = useState<AttendanceStatus[]>([]);

  // State for Reports
  const [reportFilterForm, setReportFilterForm] = useState('Semua');

  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- Handlers ---

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setStudents(generateStudents(cls));
    setAttendance([]); // Reset attendance for new class selection
  };

  const handleStatusChange = (studentId: number, status: 'Hadir' | 'Tidak Hadir' | 'Lewat') => {
    setAttendance(prev => {
      const existing = prev.find(p => p.studentId === studentId);
      if (existing) {
        return prev.map(p => p.studentId === studentId ? { ...p, status } : p);
      }
      return [...prev, { studentId, status }];
    });
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setAttendance(prev => {
      const existing = prev.find(p => p.studentId === studentId);
      if (existing) {
        return prev.map(p => p.studentId === studentId ? { ...p, notes: note } : p);
      }
      return [...prev, { studentId, status: 'Hadir', notes: note }]; // Default to present if noting first
    });
  };

  const saveAttendance = () => {
    // In real app, API call here
    showToast(`Kehadiran ${selectedClass} bertarikh ${selectedDate} berjaya disimpan.`);
  };

  const downloadReport = () => {
    showToast("Memuat turun laporan kehadiran (PDF)...");
  };

  // --- Render Tabs ---

  const renderRekodHarian = () => (
    <div className="space-y-6 fade-in">
      {/* Controls */}
      <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#C9B458] font-bold uppercase">Kelas</label>
            <select 
              value={selectedClass} 
              onChange={(e) => handleClassChange(e.target.value)}
              className="bg-[#0B132B] text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-[#C9B458]"
            >
              {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#C9B458] font-bold uppercase">Tarikh</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#0B132B] text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-[#C9B458] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
            />
          </div>
        </div>
        <div className="text-right">
           <p className="text-gray-400 text-xs">Jumlah Murid</p>
           <p className="text-2xl font-bold text-white">{students.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-bold uppercase tracking-wide">
                <th className="px-6 py-4 w-12 text-center">Bil</th>
                <th className="px-6 py-4 w-1/4">Nama Murid</th>
                <th className="px-6 py-4 w-1/4">No. KP</th>
                <th className="px-6 py-4 text-center">Status Kehadiran</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {students.map((student, idx) => {
                const status = attendance.find(a => a.studentId === student.id)?.status;
                const notes = attendance.find(a => a.studentId === student.id)?.notes || '';

                return (
                  <tr key={student.id} className="hover:bg-[#253252] transition-colors">
                    <td className="px-6 py-3 text-center text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-3 font-medium text-white">{student.name}</td>
                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">{student.kp}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleStatusChange(student.id, 'Hadir')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${status === 'Hadir' ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-[#0B132B] text-gray-400 border border-gray-600 hover:border-green-500'}`}
                        >
                          Hadir
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'Tidak Hadir')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${status === 'Tidak Hadir' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-[#0B132B] text-gray-400 border border-gray-600 hover:border-red-500'}`}
                        >
                          T.Hadir
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'Lewat')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${status === 'Lewat' ? 'bg-yellow-600 text-white shadow-lg scale-105' : 'bg-[#0B132B] text-gray-400 border border-gray-600 hover:border-yellow-500'}`}
                        >
                          Lewat
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="text" 
                        value={notes}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="..."
                        className="bg-transparent border-b border-gray-600 text-white w-full focus:border-[#C9B458] outline-none text-xs py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        {isAdmin && (
          <button 
            onClick={saveAttendance}
            className="bg-[#C9B458] text-[#0B132B] px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
          >
            <span>💾</span> Simpan Rekod
          </button>
        )}
      </div>
    </div>
  );

  const renderLaporan = () => (
    <div className="space-y-6 fade-in">
       <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 items-center w-full md:w-auto">
             <span className="text-gray-400 text-sm">Tapis Laporan:</span>
             <select 
                value={reportFilterForm}
                onChange={(e) => setReportFilterForm(e.target.value)}
                className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-[#C9B458]"
              >
                <option value="Semua">Semua Tingkatan</option>
                <option value="Tingkatan 1">Tingkatan 1</option>
                <option value="Tingkatan 2">Tingkatan 2</option>
                <option value="Tingkatan 3">Tingkatan 3</option>
                <option value="Tingkatan 4">Tingkatan 4</option>
                <option value="Tingkatan 5">Tingkatan 5</option>
              </select>
              <input type="month" className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-[#C9B458] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
          </div>
          <button 
            onClick={downloadReport}
            className="bg-[#3A506B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#4a6382] transition-colors flex items-center gap-2"
          >
            <span>📥</span> Muat Turun PDF
          </button>
       </div>

       {/* Mock Report Table */}
       <div className="bg-[#1C2541] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-[#0B132B] text-gray-400 text-xs uppercase font-bold">
                <tr>
                   <th className="p-4">Kelas</th>
                   <th className="p-4 text-center">Kehadiran Penuh</th>
                   <th className="p-4 text-center">Tidak Hadir (Sebab)</th>
                   <th className="p-4 text-center">Tidak Hadir (Tanpa Sebab)</th>
                   <th className="p-4 text-center">% Kehadiran</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-700 text-sm text-gray-200">
                {[
                  { cls: "1 Al-Hanafi", full: 28, exc: 1, skip: 0, pct: 96.5 },
                  { cls: "1 Al-Syafie", full: 30, exc: 0, skip: 1, pct: 96.7 },
                  { cls: "2 Al-Maliki", full: 25, exc: 2, skip: 0, pct: 92.5 },
                  { cls: "3 Al-Hanafi", full: 29, exc: 0, skip: 0, pct: 100 },
                  { cls: "4 Al-Syafie", full: 27, exc: 1, skip: 1, pct: 93.1 },
                  { cls: "5 Al-Hanafi", full: 32, exc: 0, skip: 0, pct: 100 },
                ].map((row, i) => (
                   <tr key={i} className="hover:bg-[#253252]">
                      <td className="p-4 font-bold text-white">{row.cls}</td>
                      <td className="p-4 text-center">{row.full}</td>
                      <td className="p-4 text-center text-yellow-500">{row.exc}</td>
                      <td className="p-4 text-center text-red-500 font-bold">{row.skip}</td>
                      <td className="p-4 text-center">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${row.pct >= 95 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {row.pct}%
                         </span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderAnalitik = () => (
    <div className="space-y-8 fade-in">
       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
             <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Peratus Kehadiran (Hari Ini)</p>
             <div className="text-4xl font-bold text-white mt-2">94.8%</div>
             <p className="text-xs text-green-400 mt-1">↑ 1.2% berbanding semalam</p>
          </div>
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-red-500 shadow-lg">
             <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Murid Ponteng Tegar</p>
             <div className="text-4xl font-bold text-white mt-2">3</div>
             <p className="text-xs text-red-400 mt-1">Perlu tindakan segera</p>
          </div>
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-[#C9B458] shadow-lg">
             <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Kelas Kehadiran Terbaik</p>
             <div className="text-xl font-bold text-white mt-2">5 Al-Hanafi</div>
             <p className="text-xs text-[#C9B458] mt-1">100% Kehadiran (3 Hari Berturut)</p>
          </div>
       </div>

       {/* Attendance Trend Chart (CSS Only) */}
       <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-xl">
          <h4 className="text-white font-bold mb-6 border-b border-gray-700 pb-2">Trend Kehadiran Mingguan (Keseluruhan)</h4>
          <div className="flex items-end justify-between h-64 gap-2 px-4">
             {[
               { day: 'Isnin', val: 92 },
               { day: 'Selasa', val: 95 },
               { day: 'Rabu', val: 94 },
               { day: 'Khamis', val: 96 },
               { day: 'Jumaat', val: 89 },
             ].map((item) => (
               <div key={item.day} className="flex flex-col items-center w-full group relative">
                   <div className="absolute -top-8 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                      {item.val}%
                   </div>
                   <div 
                     className="w-full md:w-16 rounded-t-lg bg-gradient-to-t from-[#3A506B] to-[#C9B458] transition-all duration-500 hover:opacity-80" 
                     style={{ height: `${item.val * 0.7}%` }} 
                   ></div>
                   <div className="text-xs text-gray-400 mt-3 font-bold uppercase">{item.day}</div>
               </div>
             ))}
          </div>
       </div>

       {/* Late Students List */}
       <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
             <span className="text-yellow-500">⚠️</span> Rekod Kelewatan Hari Ini
          </h4>
          <ul className="space-y-3">
             {[
               { name: "Ahmad Albab", class: "3 Al-Syafie", time: "7:45 AM" },
               { name: "Siti Zulaikha", class: "5 Al-Maliki", time: "7:50 AM" },
             ].map((s, i) => (
                <li key={i} className="flex justify-between items-center bg-[#0B132B] p-3 rounded border border-gray-700">
                   <div>
                      <p className="text-white font-medium text-sm">{s.name}</p>
                      <p className="text-gray-500 text-xs">{s.class}</p>
                   </div>
                   <span className="text-yellow-500 font-mono text-sm font-bold">{s.time}</span>
                </li>
             ))}
          </ul>
       </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      {/* Header */}
      <div className="border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
           <span>HEM</span>
           <span>/</span>
           <span className="uppercase">KEHADIRAN MURID</span>
        </div>
        <h2 className="text-3xl font-bold text-white font-montserrat">Kehadiran Murid</h2>
        <p className="text-gray-400 mt-1">Rekod Harian, Laporan, dan Analitik Kehadiran.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800">
        {[
          { key: 'rekod', label: 'Rekod Harian', icon: '📝' },
          { key: 'laporan', label: 'Laporan', icon: '📊' },
          { key: 'analitik', label: 'Analitik', icon: '📈' },
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

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'rekod' && renderRekodHarian()}
        {activeTab === 'laporan' && renderLaporan()}
        {activeTab === 'analitik' && renderAnalitik()}
      </div>
    </div>
  );
};
