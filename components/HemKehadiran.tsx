
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

type Tab = 'rekod' | 'laporan' | 'analitik' | 'memo' | 'admin_sistem';

interface Student {
  id: number;
  name: string;
  kp: string;
  className: string;
  dynamicData?: Record<string, string>;
}

interface AttendanceStatus {
  studentId: number;
  status: 'Luar' | 'Asrama';
  notes?: string;
}

const CLASS_LIST = [
  "Semua",
  "1 Al-Hanafi", "1 Al-Syafie", "1 Al-Maliki",
  "2 Al-Hanafi", "2 Al-Syafie", "2 Al-Maliki",
  "3 Al-Hanafi", "3 Al-Syafie", "3 Al-Maliki",
  "4 Al-Hanafi", "4 Al-Syafie",
  "5 Al-Hanafi", "5 Al-Syafie"
];

// --- ICONS ---
const Icons = {
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Folder: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9B458" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  File: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Bold: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  Italic: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  Underline: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  ListOrdered: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
};

// Dummy students generator
const generateStudents = (className: string): Student[] => {
  return [];
};

// System Module Structure for Admin View
const SYSTEM_MODULES = [
  { name: 'Dashboard', sub: [] },
  { name: 'Profil Sekolah', sub: [] },
  { name: 'Program', sub: [] },
  { name: 'Pentadbiran', sub: ['Jawatankuasa', 'Takwim'] },
  { name: 'Kurikulum', sub: ['Jawatankuasa', 'Takwim', 'Guru Ganti', 'Peperiksaan'] },
  { name: 'Hal Ehwal Murid', sub: ['Jawatankuasa', 'Takwim', 'Guru Kelas', 'Enrolmen Murid'] },
  { name: 'Kokurikulum', sub: ['Jawatankuasa', 'Takwim'] },
  { name: 'Takwim', sub: ['Kalendar', 'Kalendar Akademik', 'Minggu Persekolahan', 'Cuti Perayaan', 'Cuti Umum Johor'] },
  { name: 'Jadual', sub: ['Jadual Persendirian', 'Jadual Kelas', 'Jadual Berucap', 'Jadual Pemantauan'] },
  { name: 'Admin Sistem', sub: ['Tetapan Akses', 'Log Sistem', 'Pengurusan Pangkalan Data'] }
];

export const HemKehadiran: React.FC = () => {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('rekod');
  
  // State for Record
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceStatus[]>([]);
  
  // Editing State
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [tempRowData, setTempRowData] = useState<Student | null>(null);
  
  // Dynamic Columns State for Admin
  const [customColumns, setCustomColumns] = useState<string[]>([]);

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importDataRaw, setImportDataRaw] = useState('');

  // State for Reports
  const [reportFilterForm, setReportFilterForm] = useState('Semua');

  // State for Rich Text Editor (Memo)
  const [memoContent, setMemoContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  // Permission: Allow both 'admin' and 'adminsistem' to edit
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
  const isSystemAdmin = user?.role === 'adminsistem';

  // --- Initialization & Persistence ---

  useEffect(() => {
    const initCols = async () => {
        const savedCols = await apiService.read('smaam_hem_columns');
        if (savedCols) {
            setCustomColumns(savedCols);
        } else {
            const local = localStorage.getItem('smaam_hem_columns');
            if (local) try { setCustomColumns(JSON.parse(local)); } catch {}
        }
    }
    initCols();
  }, []);

  useEffect(() => {
    const initClassData = async () => {
        const studentsKey = `smaam_hem_students_${selectedClass}`;
        const attendanceKey = `smaam_hem_attendance_${selectedClass}`;

        const remoteStudents = await apiService.read(studentsKey);
        const remoteAttendance = await apiService.read(attendanceKey);

        if (remoteStudents) {
            setStudents(remoteStudents);
        } else {
            const localStudents = localStorage.getItem(studentsKey);
            if (localStudents) {
                try { setStudents(JSON.parse(localStudents)); } catch { setStudents(generateStudents(selectedClass)); }
            } else {
                setStudents(generateStudents(selectedClass));
            }
        }

        if (remoteAttendance) {
            setAttendance(remoteAttendance);
        } else {
            const localAttendance = localStorage.getItem(attendanceKey);
            if (localAttendance) {
                try { setAttendance(JSON.parse(localAttendance)); } catch { setAttendance([]); }
            } else {
                setAttendance([]);
            }
        }
    };
    initClassData();
  }, [selectedClass]);

  // --- Handlers ---

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setEditingRowId(null);
  };

  const handleStatusChange = (studentId: number, status: 'Luar' | 'Asrama') => {
    setAttendance(prev => {
      const existing = prev.find(p => p.studentId === studentId);
      if (existing) {
        return prev.map(p => p.studentId === studentId ? { ...p, status } : p);
      }
      return [...prev, { studentId, status }];
    });
  };

  // --- Row Editing Handlers ---
  const startEditing = (student: Student) => {
      setEditingRowId(student.id);
      setTempRowData({ ...student });
  };

  const cancelEditing = () => {
      setEditingRowId(null);
      setTempRowData(null);
  };

  const saveRow = () => {
      if (!tempRowData) return;
      setStudents(prev => prev.map(s => s.id === tempRowData.id ? tempRowData : s));
      setEditingRowId(null);
      setTempRowData(null);
      showToast("Data murid dikemaskini.");
  };

  const handleEditChange = (field: keyof Student, value: string) => {
      if (tempRowData) {
          setTempRowData({ ...tempRowData, [field]: value });
      }
  };

  const handleEditDynamicChange = (col: string, value: string) => {
      if (tempRowData) {
          setTempRowData({
              ...tempRowData,
              dynamicData: { ...(tempRowData.dynamicData || {}), [col]: value }
          });
      }
  };

  // --- Structural Editing Handlers (Admin) ---
  const handleAddStudent = () => {
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent: Student = {
        id: newId,
        name: "",
        kp: "",
        className: selectedClass,
        dynamicData: {}
    };
    setStudents([...students, newStudent]);
    // Automatically start editing new row
    setEditingRowId(newId);
    setTempRowData(newStudent);
  };

  const handleDeleteStudent = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Adakah anda pasti ingin memadam data murid ini? Tindakan ini tidak boleh dikembalikan.")) {
        setStudents(currentStudents => currentStudents.filter(s => s.id !== id));
        setAttendance(currentAttendance => currentAttendance.filter(a => a.studentId !== id));
        showToast("Data murid berjaya dipadam.");
    }
  };

  const handleAddColumn = () => {
    const colName = prompt("Masukkan nama kolum baru:");
    if (colName) {
        const normalizedName = colName.trim();
        if (!normalizedName) return;
        
        if (customColumns.some(c => c.toLowerCase() === normalizedName.toLowerCase())) {
            alert("Kolum ini sudah wujud.");
            return;
        }
        setCustomColumns([...customColumns, normalizedName]);
        showToast(`Kolum "${normalizedName}" ditambah. Sila simpan perubahan.`);
    }
  };

  const handleDeleteColumn = (e: React.MouseEvent, colName: string) => {
    e.stopPropagation(); 
    if (window.confirm(`Padam kolum "${colName}"? Data dalam kolum ini akan hilang dari paparan.`)) {
        const updatedCols = customColumns.filter(c => c !== colName);
        setCustomColumns(updatedCols);
        
        const updatedStudents = students.map(s => {
            if (s.dynamicData) {
                const newData = { ...s.dynamicData };
                delete newData[colName];
                return { ...s, dynamicData: newData };
            }
            return s;
        });
        setStudents(updatedStudents);
        showToast("Kolum dipadam. Sila Simpan Data.");
    }
  };

  const handleDeleteAll = () => {
    if (students.length === 0) {
        showToast("Tiada data untuk dipadam.");
        return;
    }
    if (window.confirm(`AMARAN: Anda pasti ingin memadamkan SEMUA (${students.length}) rekod murid dalam senarai '${selectedClass}'?`)) {
        if(window.confirm("Tindakan ini tidak boleh dikembalikan. Data akan hilang sepenuhnya. Teruskan?")) {
            setStudents([]);
            setAttendance([]);
            showToast(`Semua data murid dalam senarai ${selectedClass} berjaya dipadam.`);
        }
    }
  };

  // --- Rich Text Editor Handlers ---
  const execCmd = (command: string) => {
      document.execCommand(command, false, undefined);
      if (editorRef.current) {
          editorRef.current.focus();
      }
  };

  // --- Helper to handle file selection ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
          if (evt.target?.result) {
              setImportDataRaw(evt.target.result as string);
          }
      };
      reader.readAsText(file);
  };

  const handleProcessImport = (mode: 'replace' | 'append') => {
      if (!importDataRaw.trim()) {
          alert("Sila masukkan data CSV atau muat naik fail.");
          return;
      }

      const rows = importDataRaw.trim().split(/\r\n|\n/).filter(r => r.trim() !== '');
      if (rows.length < 2) {
          alert("Data tidak mencukupi. Pastikan baris pertama adalah Header (Nama, No. KP).");
          return;
      }

      const headers = rows[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama') || h.toLowerCase().includes('name'));
      const kpIndex = headers.findIndex(h => h.toLowerCase().includes('kp') || h.toLowerCase().includes('ic') || h.toLowerCase().includes('mykid'));
      const classIndex = headers.findIndex(h => h.toLowerCase().includes('kelas') || h.toLowerCase().includes('class') || h.toLowerCase().includes('tingkatan'));

      if (nameIndex === -1) {
          alert("Ralat Format: Header 'Nama' tidak dijumpai.");
          return;
      }

      const customColIndexes: Record<string, number> = {};
      customColumns.forEach(col => {
          const idx = headers.findIndex(h => h.toLowerCase() === col.toLowerCase());
          if (idx !== -1) customColIndexes[col] = idx;
      });

      const newStudents: Student[] = [];
      
      for (let i = 1; i < rows.length; i++) {
          const line = rows[i].trim();
          if (!line) continue;

          const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          
          const name = parts[nameIndex] || "Tanpa Nama";
          const kp = kpIndex !== -1 ? (parts[kpIndex] || "") : "";
          
          let studentClass = selectedClass;
          if (classIndex !== -1 && parts[classIndex]) {
              studentClass = parts[classIndex];
          }

          const dynamicData: Record<string, string> = {};
          
          Object.keys(customColIndexes).forEach(colName => {
              const idx = customColIndexes[colName];
              if (idx !== -1) {
                  dynamicData[colName] = parts[idx] || "";
              }
          });

          newStudents.push({
              id: Date.now() + Math.random() + i,
              name,
              kp,
              className: studentClass,
              dynamicData
          });
      }

      if (newStudents.length === 0) {
          alert("Tiada data murid yang sah dijumpai.");
          return;
      }

      if (mode === 'replace') {
          if(window.confirm(`AMARAN: Anda pasti ingin GANTI SEMUA data senarai '${selectedClass}'?`)) {
             setStudents(newStudents);
             setAttendance([]); 
             setIsImportModalOpen(false);
             setImportDataRaw('');
             setTimeout(() => alert("Berjaya! Semua data telah diganti."), 100);
          }
      } else {
          setStudents([...students, ...newStudents]);
          setIsImportModalOpen(false);
          setImportDataRaw('');
          setTimeout(() => alert(`Berjaya! ${newStudents.length} rekod ditambah.`), 100);
      }
  };

  const handleExportCSV = () => {
      const headers = ['Nama', 'No. KP', 'Kelas', ...customColumns, 'Status', 'Catatan'];
      const rows = students.map(s => {
          const status = attendance.find(a => a.studentId === s.id)?.status || '-';
          const note = attendance.find(a => a.studentId === s.id)?.notes || '';
          const dynamic = customColumns.map(c => s.dynamicData?.[c] || '');
          const rowData = [s.name, s.kp, s.className, ...dynamic, status, note].map(val => `"${val}"`);
          return rowData.join(',');
      });
      const csvContent = [headers.join(','), ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Enrolmen_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Data berjaya dieksport.");
  };

  const saveAttendance = () => {
    localStorage.setItem(`smaam_hem_students_${selectedClass}`, JSON.stringify(students));
    localStorage.setItem(`smaam_hem_attendance_${selectedClass}`, JSON.stringify(attendance));
    localStorage.setItem('smaam_hem_columns', JSON.stringify(customColumns));

    apiService.write(`smaam_hem_students_${selectedClass}`, students);
    apiService.write(`smaam_hem_attendance_${selectedClass}`, attendance);
    apiService.write('smaam_hem_columns', customColumns);

    showToast(`Data enrolmen & status ${selectedClass} berjaya disimpan.`);
  };

  const downloadReport = () => {
    showToast("Memuat turun laporan enrolmen (PDF)...");
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

      {/* Editing Toolbar for Admin */}
      <div className="flex gap-3 mb-2 flex-wrap justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            {isAdmin && (
                <>
                    <button 
                        onClick={handleAddStudent}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                    >
                        <span>+</span> Tambah Murid
                    </button>
                    {isSystemAdmin && (
                        <button 
                            onClick={handleAddColumn}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                        >
                            <span>+</span> Tambah Kolum
                        </button>
                    )}
                    <button 
                        onClick={handleDeleteAll}
                        className="bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors border border-red-500/50"
                        title="Kosongkan senarai kelas ini"
                    >
                        <span>🗑️</span> Hapus Semua
                    </button>
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                    >
                        <span>📁</span> Import CSV
                    </button>
                </>
            )}
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors border border-gray-500"
          >
              <span>📥</span> Eksport CSV
          </button>
      </div>

      {/* Table */}
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-bold uppercase tracking-wide">
                <th className="px-6 py-4 w-12 text-center">Bil</th>
                <th className="px-6 py-4 min-w-[200px]">Nama Murid</th>
                <th className="px-6 py-4 w-[150px]">No. KP</th>
                
                {/* Dynamic Columns Headers */}
                {customColumns.map(col => (
                    <th key={col} className="px-6 py-4 min-w-[120px]">
                        <div className="flex items-center justify-between gap-2">
                            {col}
                            {isAdmin && (
                                <button 
                                    type="button"
                                    onClick={(e) => handleDeleteColumn(e, col)} 
                                    className="text-red-400 hover:text-red-200 text-xs font-bold bg-[#0B132B] w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-900/50 transition-colors" 
                                    title="Padam Kolum"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </th>
                ))}

                <th className="px-6 py-4 text-center w-[180px]">Status Kediaman</th>
                <th className="px-6 py-4 min-w-[150px] text-center">Kelas</th>
                {isAdmin && <th className="px-6 py-4 text-center w-28">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {students.map((student, idx) => {
                const status = attendance.find(a => a.studentId === student.id)?.status;
                const isEditing = editingRowId === student.id;

                return (
                  <tr key={student.id} className={`transition-colors group ${isEditing ? 'bg-[#253252] border-l-4 border-[#C9B458]' : 'hover:bg-[#253252]'}`}>
                    <td className="px-6 py-3 text-center text-gray-400">{idx + 1}</td>
                    
                    {/* Name Cell */}
                    <td className="px-6 py-3 font-medium text-white">
                        {isEditing ? (
                            <input 
                                type="text"
                                value={tempRowData?.name || ''}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none"
                            />
                        ) : student.name}
                    </td>

                    {/* KP Cell */}
                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                        {isEditing ? (
                            <input 
                                type="text"
                                value={tempRowData?.kp || ''}
                                onChange={(e) => handleEditChange('kp', e.target.value)}
                                className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none font-mono"
                            />
                        ) : student.kp}
                    </td>

                    {/* Dynamic Data Cells */}
                    {customColumns.map(col => (
                        <td key={col} className="px-6 py-3 text-gray-300">
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={tempRowData?.dynamicData?.[col] || ''}
                                    onChange={(e) => handleEditDynamicChange(col, e.target.value)}
                                    className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none text-xs"
                                />
                            ) : (
                                <span>{student.dynamicData?.[col] || '-'}</span>
                            )}
                        </td>
                    ))}

                    {/* Status Cell */}
                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleStatusChange(student.id, 'Luar')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${status === 'Luar' ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-[#0B132B] text-gray-400 border border-gray-600 hover:border-green-500'}`}
                        >
                          Luar
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'Asrama')}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${status === 'Asrama' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-[#0B132B] text-gray-400 border border-gray-600 hover:border-blue-500'}`}
                        >
                          Asrama
                        </button>
                      </div>
                    </td>

                    {/* Class Cell */}
                    <td className="px-6 py-3 text-center">
                        {isEditing ? (
                             <select 
                                value={tempRowData?.className || ''}
                                onChange={(e) => handleEditChange('className', e.target.value)}
                                className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none"
                             >
                                 {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        ) : (
                            <span className="text-white font-semibold text-xs bg-[#3A506B] px-2 py-1 rounded border border-[#C9B458]/30">
                                {student.className}
                            </span>
                        )}
                    </td>

                    {/* Action Cell - Admin Only */}
                    {isAdmin && (
                        <td className="px-6 py-3 text-center">
                            <div className="flex justify-center gap-2">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={saveRow} 
                                            className="text-green-400 hover:text-green-300 transition-transform hover:scale-110" 
                                            title="Simpan"
                                        >
                                            <Icons.Save />
                                        </button>
                                        <button 
                                            onClick={cancelEditing} 
                                            className="text-gray-400 hover:text-gray-200 transition-transform hover:scale-110 text-xs font-bold px-2" 
                                            title="Batal"
                                        >
                                            ✕
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => startEditing(student)} 
                                            className="text-blue-400 hover:text-blue-300 transition-transform hover:scale-110" 
                                            title="Edit Baris"
                                        >
                                            <Icons.Edit />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeleteStudent(e, student.id)}
                                            className="text-red-500 hover:text-red-400 transition-transform hover:scale-110"
                                            title="Hapus Baris"
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {(isAdmin || isSystemAdmin) && (
          <button 
            onClick={saveAttendance}
            className="bg-[#C9B458] text-[#0B132B] px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
          >
            <span>💾</span> Simpan Data Keseluruhan
          </button>
        )}
      </div>
    </div>
  );

  const renderLaporan = () => (
    <div className="space-y-6 fade-in">
       {/* Mock UI for Laporan */}
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
       <div className="bg-[#1C2541] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-[#0B132B] text-gray-400 text-xs uppercase font-bold">
                <tr>
                   <th className="p-4">Kelas</th>
                   <th className="p-4 text-center">Jumlah Murid</th>
                   <th className="p-4 text-center">Murid Luar</th>
                   <th className="p-4 text-center">Murid Asrama</th>
                   <th className="p-4 text-center">% Asrama</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-700 text-sm text-gray-200">
                {[
                  { cls: "1 Al-Hanafi", total: 29, luar: 15, asrama: 14, pct: 48.2 },
                  { cls: "1 Al-Syafie", total: 31, luar: 10, asrama: 21, pct: 67.7 },
                ].map((row, i) => (
                   <tr key={i} className="hover:bg-[#253252]">
                      <td className="p-4 font-bold text-white">{row.cls}</td>
                      <td className="p-4 text-center">{row.total}</td>
                      <td className="p-4 text-center text-green-400">{row.luar}</td>
                      <td className="p-4 text-center text-blue-400 font-bold">{row.asrama}</td>
                      <td className="p-4 text-center">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${row.pct >= 50 ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
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
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
             <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Peratus Asrama (Keseluruhan)</p>
             <div className="text-4xl font-bold text-white mt-2">65.2%</div>
             <p className="text-xs text-blue-400 mt-1">↑ 2.5% berbanding tahun lalu</p>
          </div>
       </div>
    </div>
  );

  // --- RICH TEXT EDITOR TAB ---
  const renderMemo = () => (
      <div className="space-y-6 fade-in">
          <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Memo Pentadbir / Catatan Kelas</h3>
              
              {/* Toolbar */}
              <div className="flex gap-2 mb-2 bg-[#0B132B] p-2 rounded-t-lg border border-gray-600">
                  <button onClick={() => execCmd('bold')} className="p-2 text-gray-300 hover:text-[#C9B458] hover:bg-white/10 rounded" title="Bold"><Icons.Bold /></button>
                  <button onClick={() => execCmd('italic')} className="p-2 text-gray-300 hover:text-[#C9B458] hover:bg-white/10 rounded" title="Italic"><Icons.Italic /></button>
                  <button onClick={() => execCmd('underline')} className="p-2 text-gray-300 hover:text-[#C9B458] hover:bg-white/10 rounded" title="Underline"><Icons.Underline /></button>
                  <div className="w-px bg-gray-600 mx-2"></div>
                  <button onClick={() => execCmd('insertUnorderedList')} className="p-2 text-gray-300 hover:text-[#C9B458] hover:bg-white/10 rounded" title="Bullet List"><Icons.List /></button>
                  <button onClick={() => execCmd('insertOrderedList')} className="p-2 text-gray-300 hover:text-[#C9B458] hover:bg-white/10 rounded" title="Numbered List"><Icons.ListOrdered /></button>
              </div>

              {/* Editor Area */}
              <div 
                  ref={editorRef}
                  contentEditable 
                  className="w-full h-64 bg-white text-black p-4 rounded-b-lg border border-gray-600 focus:outline-none focus:border-[#C9B458] overflow-y-auto"
                  onInput={(e) => setMemoContent(e.currentTarget.innerHTML)}
                  suppressContentEditableWarning={true}
              >
                  {/* Content goes here */}
              </div>

              <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => {
                        localStorage.setItem(`smaam_memo_${selectedClass}`, memoContent);
                        showToast("Memo berjaya disimpan.");
                    }}
                    className="bg-[#C9B458] text-[#0B132B] px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
                  >
                      <Icons.Save /> Simpan Memo
                  </button>
              </div>
          </div>
      </div>
  );

  // --- ADMIN SYSTEM TREE VIEW TAB ---
  const renderAdminSistem = () => (
      <div className="space-y-6 fade-in">
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-red-600 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Senarai Modul Sistem</h3>
                      <p className="text-sm text-gray-400">Paparan struktur penuh modul dan submenu untuk tujuan pentadbiran.</p>
                  </div>
                  <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded text-xs font-bold border border-red-700">Admin Only</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SYSTEM_MODULES.map((mod, idx) => (
                      <div key={idx} className="bg-[#0B132B] rounded-lg border border-gray-700 p-4 hover:border-[#C9B458] transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <span className="p-2 bg-[#3A506B]/30 rounded-lg text-[#C9B458]"><Icons.Folder /></span>
                              <h4 className="text-white font-bold text-sm uppercase group-hover:text-[#C9B458] transition-colors">{mod.name}</h4>
                          </div>
                          
                          {mod.sub.length > 0 ? (
                              <div className="pl-4 border-l border-gray-700 ml-4 space-y-2">
                                  {mod.sub.map((sub, sIdx) => (
                                      <div key={sIdx} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs cursor-default">
                                          <span className="w-2 h-px bg-gray-600"></span>
                                          <Icons.File />
                                          <span>{sub}</span>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-[10px] text-gray-600 italic pl-10">Tiada submenu</p>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in bg-[#A9CCE3] min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-400 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2">
           <span className="font-bold">HEM</span>
           <span className="opacity-50">/</span>
           <span className="uppercase font-bold opacity-80">ENROLMEN MURID</span>
        </div>
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase">Enrolmen Murid</h2>
        <p className="text-black mt-1 opacity-70 font-semibold">Rekod Murid, Laporan, dan Analitik Enrolmen.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-400">
        {[
          { key: 'rekod', label: 'Murid', icon: '📝' },
          { key: 'laporan', label: 'Laporan', icon: '📊' },
          { key: 'analitik', label: 'Analitik', icon: '📈' },
          { key: 'memo', label: 'Memo', icon: '🗒️' }, // New Tab
          ...(isAdmin ? [{ key: 'admin_sistem', label: 'Admin Sistem', icon: '🛡️' }] : []) // Conditional Tab
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap
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

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'rekod' && renderRekodHarian()}
        {activeTab === 'laporan' && renderLaporan()}
        {activeTab === 'analitik' && renderAnalitik()}
        {activeTab === 'memo' && renderMemo()}
        {activeTab === 'admin_sistem' && renderAdminSistem()}
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
            <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Import Data Pukal</h3>
                
                <div className="text-sm text-gray-300 mb-4 space-y-2">
                    <p>Sila masukkan data dalam format <strong>CSV (Comma Separated Values)</strong>.</p>
                    <div className="bg-black/30 p-2 rounded border border-gray-600">
                        <p className="text-xs text-[#C9B458] font-bold mb-1">Baris Pertama MESTI Header:</p>
                        <code className="text-xs text-white block">Nama, No. KP{customColumns.length > 0 ? ', ' + customColumns.join(', ') : ''}</code>
                    </div>
                    <p className="text-[10px] text-yellow-500 italic">*Data hanya akan dipaparkan jika nama kolum sepadan dengan sistem.</p>
                </div>

                {/* File Upload Input */}
                <div className="mb-4">
                    <label className="block text-xs text-[#C9B458] font-bold mb-1">Muat Naik Fail CSV</label>
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="block w-full text-xs text-gray-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-[#3A506B] file:text-white
                        hover:file:bg-[#4a6382]"
                    />
                </div>

                <label className="block text-xs text-[#C9B458] font-bold mb-1">Atau Tampal Data CSV (Raw)</label>
                <textarea 
                    value={importDataRaw}
                    onChange={(e) => setImportDataRaw(e.target.value)}
                    className="w-full h-32 bg-[#0B132B] border border-gray-600 rounded-lg p-3 text-white text-xs font-mono focus:border-[#C9B458] outline-none mb-4"
                    placeholder={`Nama, No. KP, ${customColumns.length > 0 ? customColumns[0] : '...'}\nAli bin Abu, 010101-01-0001, Data1...`}
                />

                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => handleProcessImport('append')}
                        className="w-full bg-[#3A506B] hover:bg-[#4a6382] text-white py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                        ➕ Tambah Ke Data Sedia Ada (Append)
                    </button>
                    <button 
                        onClick={() => handleProcessImport('replace')}
                        className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition-colors border border-red-400"
                    >
                        ⚠️ Ganti Semua Data (Replace All)
                    </button>
                    <button 
                        onClick={() => setIsImportModalOpen(false)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg font-bold text-sm transition-colors mt-2"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
