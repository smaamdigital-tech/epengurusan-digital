import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

type Tab = 'rekod' | 'laporan' | 'analitik' | 'memo' | 'admin_sistem';

// Updated Interface to match Google Sheet Columns + ID
interface Student {
  id: number;
  name: string;       // Kolum: Nama Murid
  kp: string;         // Kolum: No. KP
  className: string;  // Kolum: Kelas
  status: 'Luar' | 'Asrama'; // Kolum: Status Kediaman
  dynamicData?: Record<string, string>;
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
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  CloudCheck: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 21.4 8H20A5.5 5.5 0 0 0 10.7 7.7 7.5 7.5 0 0 0 2 15"/><polyline points="9 11 12 14 22 4"/></svg>,
  Sync: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"/><path d="M22 12.5a10 10 0 0 1-18.8 4.3L2.5 16"/>
    </svg>
  )
};

// System Module Structure for Admin View
const SYSTEM_MODULES = [
  { name: 'Dashboard', sub: [] },
  { name: 'Profil Sekolah', sub: [] },
  { name: 'Program', sub: [] },
  { name: 'Pentadbiran', sub: ['Jawatankuasa', 'Takwim'] },
  { name: 'Kurikulum', sub: ['Jawatankuasa', 'Takwim', 'Guru Ganti', 'Peperiksaan'] },
  { name: 'Hal Ehwal Murid', sub: ['Jawatankuasa', 'Takwim', 'Pengurusan Kelas', 'Pengurusan Murid'] },
  { name: 'Kokurikulum', sub: ['Jawatankuasa', 'Takwim'] },
  { name: 'Takwim', sub: ['Kalendar', 'Kalendar Akademik', 'Minggu Persekolahan', 'Cuti Perayaan', 'Cuti Umum Johor'] },
  { name: 'Jadual', sub: ['Jadual Persendirian', 'Jadual Kelas', 'Jadual Berucap', 'Jadual Pemantauan'] },
  { name: 'Admin Sistem', sub: ['Tetapan Akses', 'Log Sistem', 'Pengurusan Pangkalan Data'] }
];

export const PengurusanMurid: React.FC = () => {
  const { user, showToast, checkPermission } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('rekod');
  
  // State for Record
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // MAIN DATA STATE: One Source of Truth
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  
  // CRITICAL: Ref to lock background sync during critical write operations
  const isWriteLocked = useRef(false);
  
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

  // Permission - Updated to ensure System Admin has full rights
  const canEdit = checkPermission('canUpdateHEMEnrolmen') || user?.role === 'adminsistem';
  const isSystemAdmin = user?.role === 'adminsistem';
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // Specific Sheet Name for HEM Student Data
  const SHEET_NAME_DATA_MURID = 'DATA_MURID';

  // --- Helper: Aggressive Sanitization (Fixes Ghost Data & Filtering) ---
  const sanitizeStudentData = (data: any[]): { data: Student[], wasFixed: boolean } => {
      if (!Array.isArray(data)) return { data: [], wasFixed: false };
      
      const seenIds = new Set<number>();
      let wasFixed = false;
      
      const cleanData = data
        .filter(s => s && (s.name || s.kp)) // Remove empty rows
        .map((s, index) => {
          let needsFix = false;
          
          // 1. REGENERATE ID: 
          // Detect simple integer IDs (like 255) or duplicates and replace with Timestamp
          let cleanId = s.id;
          if (!cleanId || seenIds.has(cleanId) || (typeof cleanId === 'number' && cleanId < 1000000)) {
              // Generate a guaranteed unique numeric ID
              cleanId = Date.now() + Math.floor(Math.random() * 100000) + index;
              needsFix = true;
          }
          seenIds.add(cleanId);

          // 2. NORMALIZE CLASS NAME
          let cleanClass = s.className ? String(s.className).trim().replace(/\s+/g, ' ') : "Tiada Kelas";
          const matchedClass = CLASS_LIST.find(c => c.toLowerCase() === cleanClass.toLowerCase());
          
          if (matchedClass && matchedClass !== "Semua") {
              if (cleanClass !== matchedClass) {
                  cleanClass = matchedClass;
                  needsFix = true;
              }
          }

          if (needsFix) wasFixed = true;

          return {
              ...s,
              id: cleanId, 
              className: cleanClass,
              name: s.name ? String(s.name).trim() : "Tanpa Nama",
              kp: s.kp ? String(s.kp).trim() : "",
              status: s.status ? String(s.status).trim() : "Luar"
          };
      });

      return { data: cleanData, wasFixed };
  };

  // --- Initialization & Persistence ---

  const loadData = async (forceRemote = false) => {
    if (isWriteLocked.current) {
        return;
    }

    const masterKey = SHEET_NAME_DATA_MURID;
    const colsKey = 'smaam_hem_columns';
    
    if (!forceRemote) {
        try {
            const localDataStr = localStorage.getItem(masterKey);
            const localColsStr = localStorage.getItem(colsKey);
            
            if (localDataStr) {
                const localData = JSON.parse(localDataStr);
                if (Array.isArray(localData)) {
                    const { data: cleanData, wasFixed } = sanitizeStudentData(localData);
                    setAllStudents(cleanData);
                    
                    if (wasFixed) {
                        localStorage.setItem(masterKey, JSON.stringify(cleanData));
                    }
                    setIsLoading(false);
                }
            }
            if (localColsStr) setCustomColumns(JSON.parse(localColsStr));
        } catch (e) {
            console.error("Local load error", e);
        }
    }

    setIsSyncing(true);
    try {
        const [remoteData, remoteCols] = await Promise.all([
            apiService.read(masterKey),
            apiService.read(colsKey)
        ]);

        if (isWriteLocked.current) {
             setIsSyncing(false);
             return;
        }

        if (remoteData && Array.isArray(remoteData)) {
            const { data: cleanRemoteData, wasFixed } = sanitizeStudentData(remoteData);
            setAllStudents(cleanRemoteData); 
            localStorage.setItem(masterKey, JSON.stringify(cleanRemoteData));
            
            if (wasFixed) {
                await apiService.write(masterKey, cleanRemoteData);
            }
        } 

        if (remoteCols) {
            setCustomColumns(remoteCols);
            localStorage.setItem(colsKey, JSON.stringify(remoteCols));
        }

    } catch (e) {
        console.error("Background sync failed", e);
    } finally {
        setIsLoading(false);
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
        if (!isSaving && !editingRowId && !isWriteLocked.current) { 
            loadData();
        }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (selectedClass === "Semua") {
          setFilteredStudents(allStudents);
      } else {
          const target = selectedClass.trim();
          const filtered = allStudents.filter(s => {
              const sClass = s.className ? s.className.trim() : "";
              return sClass === target;
          });
          setFilteredStudents(filtered);
      }
  }, [selectedClass, allStudents]);

  useEffect(() => {
      const savedMemo = localStorage.getItem('smaam_hem_memo');
      if (savedMemo) setMemoContent(savedMemo);
  }, []);

  // --- Handlers ---

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setEditingRowId(null);
  };

  const updateMasterData = async (newStudents: Student[]) => {
      isWriteLocked.current = true;
      setIsSaving(true);

      setAllStudents(newStudents);
      localStorage.setItem(SHEET_NAME_DATA_MURID, JSON.stringify(newStudents));
      
      try {
          await apiService.write(SHEET_NAME_DATA_MURID, newStudents);
      } catch (e) {
          console.error("Failed to sync to cloud", e);
          showToast("Ralat: Data disimpan di peranti sahaja (Offline).");
      } finally {
          setIsSaving(false);
          setTimeout(() => {
              isWriteLocked.current = false;
          }, 5000); 
      }
  };

  const handleStatusChange = async (studentId: number, status: 'Luar' | 'Asrama') => {
    if (!canEdit) return; 
    const updated = allStudents.map(s => s.id === studentId ? { ...s, status } : s);
    await updateMasterData(updated);
    showToast("Status murid dikemaskini.");
  };

  const startEditing = (student: Student) => {
      setEditingRowId(student.id);
      setTempRowData({ ...student });
  };

  const cancelEditing = () => {
      setEditingRowId(null);
      setTempRowData(null);
  };

  const saveRow = async () => {
      if (!tempRowData) return;
      const updated = allStudents.map(s => s.id === tempRowData.id ? tempRowData : s);
      await updateMasterData(updated);
      setEditingRowId(null);
      setTempRowData(null);
      showToast("Data murid berjaya disimpan.");
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

  const handleAddStudent = async () => {
    const newId = Date.now() + Math.floor(Math.random() * 1000); 
    const defaultClass = selectedClass === 'Semua' ? CLASS_LIST[1] : selectedClass;
    
    const newStudent: Student = {
        id: newId,
        name: "",
        kp: "",
        className: defaultClass,
        status: 'Luar', // Default status
        dynamicData: {}
    };
    
    const updated = [newStudent, ...allStudents]; 
    await updateMasterData(updated);
    setEditingRowId(newId);
    setTempRowData(newStudent);
  };

  const handleDeleteStudent = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Adakah anda pasti ingin memadam data murid ini? Data akan dihapuskan serta-merta.")) {
        const updated = allStudents.filter(s => s.id !== id);
        await updateMasterData(updated);
        showToast("Data murid berjaya dipadam.");
    }
  };

  const handleAddColumn = async () => {
    const colName = prompt("Masukkan nama kolum baru (Cth: No. Tel Bapa):");
    if (colName) {
        const normalizedName = colName.trim();
        if (!normalizedName) return;
        
        if (customColumns.some(c => c.toLowerCase() === normalizedName.toLowerCase())) {
            alert("Kolum ini sudah wujud.");
            return;
        }
        const newCols = [...customColumns, normalizedName];
        setCustomColumns(newCols);
        
        isWriteLocked.current = true;
        setIsSaving(true);
        localStorage.setItem('smaam_hem_columns', JSON.stringify(newCols));
        await apiService.write('smaam_hem_columns', newCols);
        setIsSaving(false);
        setTimeout(() => isWriteLocked.current = false, 2000);
        
        showToast(`Kolum "${normalizedName}" ditambah.`);
    }
  };

  const handleDeleteColumn = async (e: React.MouseEvent, colName: string) => {
    e.stopPropagation(); 
    if (window.confirm(`Padam kolum "${colName}"? Data dalam kolum ini akan hilang.`)) {
        const updatedCols = customColumns.filter(c => c !== colName);
        setCustomColumns(updatedCols);
        
        isWriteLocked.current = true;
        setIsSaving(true);
        
        localStorage.setItem('smaam_hem_columns', JSON.stringify(updatedCols));
        await apiService.write('smaam_hem_columns', updatedCols);
        
        const updatedStudents = allStudents.map(s => {
            if (s.dynamicData) {
                const newData = { ...s.dynamicData };
                delete newData[colName];
                return { ...s, dynamicData: newData };
            }
            return s;
        });
        
        localStorage.setItem(SHEET_NAME_DATA_MURID, JSON.stringify(updatedStudents));
        await apiService.write(SHEET_NAME_DATA_MURID, updatedStudents);
        
        setAllStudents(updatedStudents);
        setIsSaving(false);
        setTimeout(() => isWriteLocked.current = false, 2000);

        showToast("Kolum dipadam.");
    }
  };

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

  const handleProcessImport = async (mode: 'replace' | 'append') => {
      if (!importDataRaw.trim()) {
          alert("Sila masukkan data CSV atau muat naik fail.");
          return;
      }

      const rows = importDataRaw.trim().split(/\r\n|\n/).filter(r => r.trim() !== '');
      if (rows.length < 2) {
          alert("Data tidak mencukupi. Pastikan baris pertama adalah Header.");
          return;
      }

      const headers = rows[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama'));
      const kpIndex = headers.findIndex(h => h.toLowerCase().includes('kp') || h.toLowerCase().includes('ic'));
      const classIndex = headers.findIndex(h => h.toLowerCase().includes('kelas') || h.toLowerCase().includes('tingkatan'));
      const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status') || h.toLowerCase().includes('kediaman'));

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
          
          let studentClass = selectedClass === 'Semua' ? CLASS_LIST[1] : selectedClass;
          if (classIndex !== -1 && parts[classIndex]) {
              let rawClass = parts[classIndex];
              const match = CLASS_LIST.find(c => c.toLowerCase() === rawClass.toLowerCase().trim());
              if (match) studentClass = match;
              else studentClass = rawClass.trim();
          }

          let status: 'Luar' | 'Asrama' = 'Luar';
          if (statusIndex !== -1 && parts[statusIndex]) {
              const s = parts[statusIndex].toLowerCase();
              if (s.includes('asrama')) status = 'Asrama';
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
              status,
              dynamicData
          });
      }

      const { data: sanitizedNewStudents } = sanitizeStudentData(newStudents);

      if (mode === 'replace') {
          if(window.confirm(`AMARAN: Ganti SEMUA data?`)) {
             if (selectedClass === 'Semua') {
                 await updateMasterData(sanitizedNewStudents);
             } else {
                 const others = allStudents.filter(s => s.className !== selectedClass);
                 await updateMasterData([...others, ...sanitizedNewStudents]);
             }
             setIsImportModalOpen(false);
             setImportDataRaw('');
             showToast("Data telah diganti.");
          }
      } else {
          await updateMasterData([...allStudents, ...sanitizedNewStudents]);
          setIsImportModalOpen(false);
          setImportDataRaw('');
          showToast(`${sanitizedNewStudents.length} rekod ditambah.`);
      }
  };

  const handleExportExcel = () => {
      let tableContent = '<table border="1"><thead><tr>';
      const headers = ['Bil', 'Nama Murid', 'No. KP', 'Status Kediaman', 'Kelas', ...customColumns];
      headers.forEach(h => {
          tableContent += `<th style="background-color: #f0f0f0; font-weight: bold;">${h}</th>`;
      });
      tableContent += '</tr></thead><tbody>';

      filteredStudents.forEach((s, index) => {
          const dynamic = customColumns.map(c => s.dynamicData?.[c] || '');
          tableContent += '<tr>';
          tableContent += `<td>${index + 1}</td>`;
          tableContent += `<td>${s.name}</td>`;
          tableContent += `<td style="mso-number-format:'@'">${s.kp}</td>`;
          tableContent += `<td>${s.status}</td>`;
          tableContent += `<td>${s.className}</td>`;
          dynamic.forEach(val => {
              tableContent += `<td>${val}</td>`;
          });
          tableContent += '</tr>';
      });
      tableContent += '</tbody></table>';

      const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Enrolmen_${selectedClass.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Data dieksport ke Excel.");
  };

  const manualSync = async () => {
      showToast("Menyemak data dari awan...");
      await loadData(true);
  }

  const renderRekodHarian = () => (
    <div className="space-y-6 fade-in">
      <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between shadow-lg">
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
        <div className="text-right flex items-center gap-4">
           {isSaving && <span className="text-yellow-400 text-xs font-bold animate-pulse flex items-center gap-1"><Icons.Sync /> Menyimpan...</span>}
           {isSyncing && !isSaving && <span className="text-blue-300 text-xs font-bold animate-pulse flex items-center gap-1"><Icons.Sync /> Menyegerak...</span>}
           {!isSyncing && !isSaving && <span className="text-green-400 text-xs font-bold flex items-center gap-1"><Icons.CloudCheck /> Terkini</span>}
           
           <button onClick={manualSync} className="text-blue-300 hover:text-white transition-colors" title="Paksa Segerak Data"><Icons.Refresh /></button>
           <div className="border-l border-gray-600 pl-4">
               <p className="text-gray-400 text-xs">Jumlah Murid ({selectedClass})</p>
               <p className="text-2xl font-bold text-white">{filteredStudents.length}</p>
           </div>
        </div>
      </div>

      <div className="flex gap-3 mb-2 flex-wrap justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            {canEdit && (
                <>
                    <button onClick={handleAddStudent} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"><span>+</span> Tambah Murid</button>
                    {isSystemAdmin && (<button onClick={handleAddColumn} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"><span>+</span> Tambah Kolum</button>)}
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"><span>📁</span> Import CSV</button>
                </>
            )}
          </div>
          <button onClick={handleExportExcel} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors border border-green-500"><span>📊</span> Eksport Excel</button>
      </div>

      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          {isLoading ? (
              <div className="p-12 text-center text-white flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#C9B458] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Memuatkan data tempatan...</p>
              </div>
          ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#253252] text-[#C9B458] text-[13px] font-bold uppercase tracking-wide">
                <th className="px-6 py-4 w-12 text-center">Bil</th>
                <th className="px-6 py-4 min-w-[200px]">Nama Murid</th>
                <th className="px-6 py-4 w-[150px]">No. KP</th>
                <th className="px-6 py-4 text-center w-[180px]">Status Kediaman</th>
                <th className="px-6 py-4 min-w-[150px] text-center">Kelas</th>
                {customColumns.map(col => (<th key={col} className="px-6 py-4 min-w-[120px]"><div className="flex items-center justify-between gap-2">{col}{isSystemAdmin && (<button type="button" onClick={(e) => handleDeleteColumn(e, col)} className="text-red-400 hover:text-red-200 text-xs font-bold bg-[#0B132B] w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-900/50 transition-colors" title="Padam Kolum">×</button>)}</div></th>))}
                {canEdit && <th className="px-6 py-4 text-center w-28">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {filteredStudents.length === 0 && (<tr><td colSpan={5 + customColumns.length + (canEdit ? 1 : 0)} className="px-6 py-8 text-center text-gray-500 italic">Tiada rekod ditemui.</td></tr>)}
              {filteredStudents.map((student, idx) => {
                const isEditing = editingRowId === student.id;
                return (
                  <tr key={student.id} className={`transition-colors group ${isEditing ? 'bg-[#253252] border-l-4 border-[#C9B458]' : 'hover:bg-[#253252]'}`}>
                    <td className="px-6 py-3 text-center text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-3 font-medium text-white">{isEditing ? (<input type="text" value={tempRowData?.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none"/>) : student.name}</td>
                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">{isEditing ? (<input type="text" value={tempRowData?.kp || ''} onChange={(e) => handleEditChange('kp', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none font-mono"/>) : student.kp}</td>
                    <td className="px-6 py-3"><div className="flex justify-center gap-2"><button disabled={!canEdit} onClick={() => handleStatusChange(student.id, 'Luar')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${student.status === 'Luar' ? 'bg-green-600 text-white shadow-lg' : 'bg-[#0B132B] text-gray-400 border border-gray-600'} ${canEdit ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>Luar</button><button disabled={!canEdit} onClick={() => handleStatusChange(student.id, 'Asrama')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${student.status === 'Asrama' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#0B132B] text-gray-400 border border-gray-600'} ${canEdit ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>Asrama</button></div></td>
                    <td className="px-6 py-3 text-center">{isEditing ? (<select value={tempRowData?.className || ''} onChange={(e) => handleEditChange('className', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none">{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select>) : (<span className="text-white font-semibold text-xs bg-[#3A506B] px-2 py-1 rounded border border-[#C9B458]/30">{student.className}</span>)}</td>
                    {customColumns.map(col => (<td key={col} className="px-6 py-3 text-gray-300">{isEditing ? (<input type="text" value={tempRowData?.dynamicData?.[col] || ''} onChange={(e) => handleEditDynamicChange(col, e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none text-xs"/>) : (<span>{student.dynamicData?.[col] || '-'}</span>)}</td>))}
                    {canEdit && (<td className="px-6 py-3 text-center"><div className="flex justify-center gap-2">{isEditing ? (<><button onClick={saveRow} className="text-green-400 hover:text-green-300 transition-transform hover:scale-110" title="Simpan"><Icons.Save /></button><button onClick={cancelEditing} className="text-gray-400 hover:text-gray-200 transition-transform hover:scale-110 text-xs font-bold px-2" title="Batal">✕</button></>) : (<><button onClick={() => startEditing(student)} className="text-blue-400 hover:text-blue-300 transition-transform hover:scale-110" title="Edit Baris"><Icons.Edit /></button><button onClick={(e) => handleDeleteStudent(e, student.id)} className="text-red-500 hover:text-red-400 transition-transform hover:scale-110" title="Hapus Baris"><Icons.Trash /></button></>)}</div></td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );

  const renderLaporan = () => (
    <div className="space-y-6 fade-in">
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Laporan Enrolmen</h3>
            <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#C9B458] font-bold uppercase">Tapis Kelas</label>
                    <select value={reportFilterForm} onChange={(e) => setReportFilterForm(e.target.value)} className="bg-[#0B132B] text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-[#C9B458]">{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <button onClick={() => showToast("Laporan PDF sedang dijana...")} className="bg-[#3A506B] hover:bg-[#4a6382] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors"><Icons.Download /> Muat Turun PDF</button>
            </div>
        </div>
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-center min-h-[300px]"><p className="text-gray-500 italic">Pratonton laporan akan dipaparkan di sini.</p></div>
    </div>
  );

  const renderAnalitik = () => {
      const total = allStudents.length;
      const asrama = allStudents.filter(s => s.status === 'Asrama').length;
      const luar = allStudents.filter(s => s.status === 'Luar').length;
      const classBreakdown = CLASS_LIST.filter(c => c !== "Semua").map(c => {
          const studentsInClass = allStudents.filter(s => s.className === c);
          const count = studentsInClass.length;
          const male = studentsInClass.filter(s => {
              const kpStr = (s.kp || '').replace(/[^0-9]/g, '');
              if (!kpStr) return false;
              const lastDigit = parseInt(kpStr.slice(-1));
              return !isNaN(lastDigit) && lastDigit % 2 !== 0;
          }).length;
          const female = count - male;
          return { name: c, count, male, female };
      }).filter(c => c.count > 0);

      return (
        <div className="space-y-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center"><h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Jumlah Keseluruhan</h4><p className="text-4xl font-black text-white mt-2">{total}</p></div>
                <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center"><h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Murid Asrama</h4><p className="text-4xl font-black text-[#C9B458] mt-2">{asrama}</p></div>
                <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center"><h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Murid Luar</h4><p className="text-4xl font-black text-blue-400 mt-2">{luar}</p></div>
            </div>
            <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Pecahan Mengikut Kelas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {classBreakdown.length > 0 ? classBreakdown.map((item) => (
                        <div key={item.name} className="bg-[#0B132B] p-4 rounded-lg border border-gray-700 flex flex-col justify-between"><div><p className="text-xs text-[#C9B458] font-bold uppercase mb-1">{item.name}</p><div className="flex justify-between items-end"><p className="text-xl font-bold text-white">{item.count}</p><div className="text-[10px] font-mono text-gray-400 font-bold bg-black/20 px-2 py-1 rounded">L: {item.male} | P: {item.female}</div></div></div></div>
                    )) : (<p className="text-gray-500 italic col-span-full text-center">Tiada data murid untuk dianalisis.</p>)}
                </div>
            </div>
        </div>
      );
  };

  const renderMemo = () => (
    <div className="space-y-6 fade-in h-full flex flex-col">
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2"><h3 className="text-xl font-bold text-white">Memo / Catatan Harian</h3><button onClick={() => { localStorage.setItem('smaam_hem_memo', memoContent); showToast("Memo disimpan."); }} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"><Icons.Save /> Simpan</button></div>
            <textarea value={memoContent} onChange={(e) => setMemoContent(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg p-4 text-white font-mono text-sm leading-relaxed focus:border-[#C9B458] outline-none resize-none flex-1 min-h-[400px]" placeholder="Tulis catatan penting berkaitan enrolmen di sini..." />
        </div>
    </div>
  );

  const renderAdminSistem = () => (
      <div className="space-y-6 fade-in">
          <div className="bg-[#1C2541] p-6 rounded-xl border-l-4 border-red-600 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4"><div><h3 className="text-2xl font-bold text-white uppercase tracking-wider">Senarai Modul Sistem</h3><p className="text-sm text-gray-400">Paparan struktur penuh modul dan submenu untuk tujuan pentadbiran.</p></div><span className="bg-red-900/50 text-red-200 px-3 py-1 rounded text-xs font-bold border border-red-700">Admin Only</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SYSTEM_MODULES.map((mod, idx) => (
                      <div key={idx} className="bg-[#0B132B] rounded-lg border border-gray-700 p-4 hover:border-[#C9B458] transition-all group">
                          <div className="flex items-center gap-3 mb-3"><span className="p-2 bg-[#3A506B]/30 rounded-lg text-[#C9B458]"><Icons.Folder /></span><h4 className="text-white font-bold text-sm uppercase group-hover:text-[#C9B458] transition-colors">{mod.name}</h4></div>
                          {mod.sub.length > 0 ? (<div className="pl-4 border-l border-gray-700 ml-4 space-y-2">{mod.sub.map((sub, sIdx) => (<div key={sIdx} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs cursor-default"><span className="w-2 h-px bg-gray-600"></span><Icons.File /><span>{sub}</span></div>))}</div>) : (<p className="text-[10px] text-gray-600 italic pl-10">Tiada submenu</p>)}
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in bg-[#A9CCE3] min-h-screen">
      <div className="border-b border-gray-400 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2"><span className="font-bold">HEM</span><span className="opacity-50">/</span><span className="uppercase font-bold opacity-80">PENGURUSAN MURID</span></div>
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase">Pengurusan Murid</h2>
        <p className="text-black mt-1 opacity-70 font-semibold">Rekod Murid, Laporan, dan Analitik Enrolmen.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-400">
        {[
          { key: 'rekod', label: 'Murid', icon: '📝' },
          { key: 'laporan', label: 'Laporan', icon: '📊' },
          { key: 'analitik', label: 'Analitik', icon: '📈' },
          { key: 'memo', label: 'Memo', icon: '🗒️' }, 
          ...(isAdmin ? [{ key: 'admin_sistem', label: 'Admin Sistem', icon: '🛡️' }] : [])
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as Tab)} className={`px-6 py-3 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' : 'text-[#1C2541] hover:text-black hover:bg-white/30'}`}><span>{tab.icon}</span>{tab.label}</button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'rekod' && renderRekodHarian()}
        {activeTab === 'laporan' && renderLaporan()}
        {activeTab === 'analitik' && renderAnalitik()}
        {activeTab === 'memo' && renderMemo()}
        {activeTab === 'admin_sistem' && renderAdminSistem()}
      </div>

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
            <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Import Data Pukal</h3>
                <div className="text-sm text-gray-300 mb-4 space-y-2"><p>Sila masukkan data dalam format <strong>CSV (Comma Separated Values)</strong>.</p><div className="bg-black/30 p-2 rounded border border-gray-600"><p className="text-xs text-[#C9B458] font-bold mb-1">Baris Pertama MESTI Header:</p><code className="text-xs text-white block">Bil, Nama Murid, No. KP, Status Kediaman, Kelas{customColumns.length > 0 ? ', ' + customColumns.join(', ') : ''}</code></div><p className="text-[10px] text-yellow-500 italic">*Data akan diimport ke dalam pangkalan data utama.</p></div>
                <div className="mb-4"><label className="block text-xs text-[#C9B458] font-bold mb-1">Muat Naik Fail CSV</label><input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3A506B] file:text-white hover:file:bg-[#4a6382]"/></div>
                <label className="block text-xs text-[#C9B458] font-bold mb-1">Atau Tampal Data CSV (Raw)</label><textarea value={importDataRaw} onChange={(e) => setImportDataRaw(e.target.value)} className="w-full h-32 bg-[#0B132B] border border-gray-600 rounded-lg p-3 text-white text-xs font-mono focus:border-[#C9B458] outline-none mb-4" placeholder={`Bil, Nama Murid, No. KP, Status Kediaman, Kelas\n1, Ali bin Abu, 010101-01-0001, Luar, 1 Al-Hanafi`}/>
                <div className="flex flex-col gap-2"><button onClick={() => handleProcessImport('append')} className="w-full bg-[#3A506B] hover:bg-[#4a6382] text-white py-2 rounded-lg font-bold text-sm transition-colors">➕ Tambah Ke Data Sedia Ada (Append)</button><button onClick={() => handleProcessImport('replace')} className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition-colors border border-red-400">⚠️ Ganti Semua Data (Replace All)</button><button onClick={() => setIsImportModalOpen(false)} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg font-bold text-sm transition-colors mt-2">Batal</button></div>
            </div>
        </div>
      )}
    </div>
  );
};