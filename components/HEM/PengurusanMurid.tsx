import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { apiService } from '@/services/api';
import { PrintPreviewModal } from '../PrintPreviewModal';

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

// ... (imports remain the same)

// --- MOCK DATA FOR CLASS TEACHERS ---
const DEFAULT_CLASS_TEACHER_MAPPING: Record<string, string> = {
  "1 Al-Hanafi": "Zulkeffle bin Muhammad",
  "1 Al-Syafie": "Noratikah binti Abd. Kadir",
  "1 Al-Maliki": "Shaharer bin Hj Husain",
  "2 Al-Hanafi": "Zulkifli bin Md Aspan",
  "2 Al-Syafie": "Saemah binti Supandi",
  "2 Al-Maliki": "Rosmawati binti Hussin",
  "3 Al-Hanafi": "Nooraind binti Ali",
  "3 Al-Syafie": "Zahrah Khairiah binti Saleh",
  "3 Al-Maliki": "Mazuin binti Mat",
  "4 Al-Hanafi": "Ahmad Fikruddin bin Ahmad Raza'i",
  "4 Al-Syafie": "Annur Ayuni binti Mohamed",
  "5 Al-Hanafi": "Muhammad Hafiz bin Jalil",
  "5 Al-Syafie": "Nik Noorizati binti Ab Kahar"
};

const CLASS_LIST = [
  "Semua",
  "1 Al-Hanafi", "1 Al-Syafie", "1 Al-Maliki",
  "2 Al-Hanafi", "2 Al-Syafie", "2 Al-Maliki",
  "3 Al-Hanafi", "3 Al-Syafie", "3 Al-Maliki",
  "4 Al-Hanafi", "4 Al-Syafie",
  "5 Al-Hanafi", "5 Al-Syafie"
];

// ... (rest of imports and interfaces)




// --- ICONS ---
const LocalIcons = {
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

export const PengurusanMurid: React.FC = () => {
  const { user, showToast, checkPermission } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('rekod');
  const [isLaporanUnlocked, setIsLaporanUnlocked] = useState(false);
  const [laporanPasswordInput, setLaporanPasswordInput] = useState('');
  
  // State for Record
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Class Teacher Mapping State
  const [classTeachers, setClassTeachers] = useState<Record<string, string>>(() => {
      const saved = localStorage.getItem('smaam_imported_class_teachers');
      return saved ? JSON.parse(saved) : DEFAULT_CLASS_TEACHER_MAPPING;
  });

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importDataRaw, setImportDataRaw] = useState('');
  const [selectedImportMode, setSelectedImportMode] = useState<'replace_all' | 'replace_class' | 'append' | null>(null);

  // State for Reports
  const [reportFilterForm, setReportFilterForm] = useState('Semua');
  const [showReportPreview, setShowReportPreview] = useState(false);

  // State for Rich Text Editor (Memo)
  const [memoContent, setMemoContent] = useState('');

  // Permission - Updated to ensure System Admin has full rights
  const canEdit = checkPermission('canUpdateHEMEnrolmen') || user?.role === 'adminsistem';
  const isSystemAdmin = user?.role === 'adminsistem';

  // Specific Sheet Name for HEM Student Data
  const SHEET_NAME_DATA_MURID = 'DATA_MURID';

  // --- Helper: Aggressive Sanitization (Fixes Ghost Data & Filtering) ---
  const sanitizeStudentData = (data: Student[]): { data: Student[], wasFixed: boolean } => {
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
    
    // FORCE CLEAR ONCE (User Request)
    const hasCleared = localStorage.getItem('smaam_force_clear_v2');
    if (!hasCleared) {
        console.log("Executing Force Clear...");
        localStorage.setItem('smaam_force_clear_v2', 'true');
        setAllStudents([]);
        localStorage.setItem(masterKey, '[]');
        await apiService.write(masterKey, []);
        setIsLoading(false);
        return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Summary Statistics
  const summaryStats = React.useMemo(() => {
      const total = allStudents.length;
      const asrama = allStudents.filter(s => s.status === 'Asrama').length;
      const luar = allStudents.filter(s => s.status === 'Luar').length;
      return { total, asrama, luar };
  }, [allStudents]);

  useEffect(() => {
      let filtered = allStudents;

      // Class Filter
      if (selectedClass !== "Semua") {
          const target = selectedClass.trim();
          filtered = filtered.filter(s => {
              const sClass = s.className ? s.className.trim() : "";
              return sClass === target;
          });
      }

      // Search Filter
      if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(s => 
              s.name.toLowerCase().includes(query) || 
              (s.kp && s.kp.includes(query)) ||
              (s.className && s.className.toLowerCase().includes(query))
          );
      }

      setFilteredStudents(filtered);
      
      // Adjust current page if it exceeds total pages
      const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
      }
  }, [selectedClass, allStudents, searchQuery, itemsPerPage, currentPage]);

  // Reset page ONLY when filters change (not data)
  useEffect(() => {
      setCurrentPage(1);
  }, [selectedClass, searchQuery]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

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
        // Use loose equality (!=) to handle potential string/number ID mismatches
        // eslint-disable-next-line eqeqeq
        const updated = allStudents.filter(s => s.id != id);
        await updateMasterData(updated);
        showToast("Data murid berjaya dipadam.");
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

  const handleProcessImport = async (mode: 'replace_all' | 'replace_class' | 'append') => {
      if (!importDataRaw.trim()) {
          alert("Sila masukkan data CSV atau muat naik fail.");
          return;
      }

      // Robust CSV Parsing (handles quoted fields with commas)
      const parseCSV = (text: string) => {
          const lines = text.trim().split(/\r\n|\n/);
          const result = [];
          
          for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              
              const row = [];
              let current = '';
              let inQuote = false;
              
              for (let j = 0; j < line.length; j++) {
                  const char = line[j];
                  if (char === '"') {
                      inQuote = !inQuote;
                  } else if (char === ',' && !inQuote) {
                      row.push(current.trim().replace(/^"|"$/g, ''));
                      current = '';
                  } else {
                      current += char;
                  }
              }
              row.push(current.trim().replace(/^"|"$/g, ''));
              result.push(row);
          }
          return result;
      };

      const rows = parseCSV(importDataRaw);
      if (rows.length < 2) {
          alert("Data tidak mencukupi. Pastikan baris pertama adalah Header.");
          return;
      }

      const headers = rows[0].map(h => h.replace(/^\uFEFF/, '').trim());
      
      const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama'));
      const kpIndex = headers.findIndex(h => h.toLowerCase().includes('kp') || h.toLowerCase().includes('ic'));
      const classIndex = headers.findIndex(h => h.toLowerCase().includes('kelas') || h.toLowerCase().includes('tingkatan'));
      const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status') || h.toLowerCase().includes('kediaman'));
      const teacherIndex = headers.findIndex(h => h.toLowerCase().includes('guru') && h.toLowerCase().includes('kelas'));

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
      const newTeacherMapping: Record<string, string> = { ...classTeachers };
      
      for (let i = 1; i < rows.length; i++) {
          const parts = rows[i];
          if (parts.length < nameIndex + 1) continue;
          
          const name = parts[nameIndex] || "Tanpa Nama";
          const kp = kpIndex !== -1 ? (parts[kpIndex] || "") : "";
          
          let studentClass = selectedClass === 'Semua' ? CLASS_LIST[1] : selectedClass;
          if (classIndex !== -1 && parts[classIndex]) {
              const rawClass = parts[classIndex];
              const match = CLASS_LIST.find(c => c.toLowerCase() === rawClass.toLowerCase().trim());
              if (match) studentClass = match;
              else studentClass = rawClass.trim();
          }

          if (teacherIndex !== -1 && parts[teacherIndex]) {
              const teacher = parts[teacherIndex];
              if (teacher && studentClass) {
                  newTeacherMapping[studentClass] = teacher;
              }
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

      if (newStudents.length === 0) {
          alert("Tiada data murid ditemui dalam fail.");
          return;
      }

      const { data: sanitizedNewStudents } = sanitizeStudentData(newStudents);

      // Update Teachers
      if (teacherIndex !== -1) {
          setClassTeachers(newTeacherMapping);
          localStorage.setItem('smaam_imported_class_teachers', JSON.stringify(newTeacherMapping));
          apiService.write('smaam_imported_class_teachers', newTeacherMapping);
      }

      if (mode === 'replace_all') {
          // REMOVED setTimeout to avoid async issues
          if(window.confirm(`AMARAN KERAS: Anda memilih untuk GANTI SEMUA DATA.\n\nTindakan ini akan MEMADAM KESELURUHAN pangkalan data murid sedia ada dan menggantikannya dengan data baru (${sanitizedNewStudents.length} rekod).\n\nAdakah anda pasti?`)) {
             try {
                 await updateMasterData(sanitizedNewStudents);
                 setIsImportModalOpen(false);
                 setImportDataRaw('');
                 showToast("Pangkalan data telah diganti sepenuhnya.");
                 alert("Berjaya! Data telah diganti."); // Explicit success alert
             } catch (e) {
                 console.error(e);
                 alert("Ralat semasa menyimpan data: " + e);
             }
          }
      } else if (mode === 'replace_class') {
          if(window.confirm(`Ganti data bagi kelas-kelas yang terdapat dalam fail CSV sahaja?\n\nData kelas lain tidak akan disentuh.`)) {
             const newClasses = new Set(sanitizedNewStudents.map(s => s.className));
             const others = allStudents.filter(s => !newClasses.has(s.className));
             await updateMasterData([...others, ...sanitizedNewStudents]);
             setIsImportModalOpen(false);
             setImportDataRaw('');
             showToast("Data kelas berkaitan telah diganti.");
          }
      } else {
          // APPEND MODE: Prevent Duplicates based on KP or Name+Class
          const existingKPs = new Set(allStudents.filter(s => s.kp).map(s => s.kp.replace(/[^0-9]/g, '')));
          const existingNames = new Set(allStudents.map(s => `${s.name.toLowerCase()}|${s.className}`));

          const uniqueNewStudents = sanitizedNewStudents.filter(s => {
              const sKP = s.kp ? s.kp.replace(/[^0-9]/g, '') : '';
              if (sKP && existingKPs.has(sKP)) return false;
              
              const sKey = `${s.name.toLowerCase()}|${s.className}`;
              if (existingNames.has(sKey)) return false;
              
              return true;
          });

          if (uniqueNewStudents.length === 0) {
              alert("Tiada data baru ditambah. Semua data dalam fail nampaknya sudah wujud (Duplikasi).");
              return;
          }

          await updateMasterData([...allStudents, ...uniqueNewStudents]);
          setIsImportModalOpen(false);
          setImportDataRaw('');
          showToast(`${uniqueNewStudents.length} rekod baru ditambah.`);
      }
  };

  const handleExportExcel = () => {
      let tableContent = '<table border="1"><thead><tr>';
      const headers = ['Bil', 'Nama Murid', ...(isSystemAdmin ? ['No. KP'] : []), 'Status Kediaman', 'Kelas', ...customColumns];
      headers.forEach(h => {
          tableContent += `<th style="background-color: #f0f0f0; font-weight: bold;">${h}</th>`;
      });
      tableContent += '</tr></thead><tbody>';

      filteredStudents.forEach((s, index) => {
          const dynamic = customColumns.map(c => s.dynamicData?.[c] || '');
          tableContent += '<tr>';
          tableContent += `<td>${index + 1}</td>`;
          tableContent += `<td>${s.name}</td>`;
          if (isSystemAdmin) {
              tableContent += `<td style="mso-number-format:'@'">${s.kp}</td>`;
          }
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

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState('');

  const handleResetData = () => {
      setIsDeleteModalOpen(true);
      setDeleteConfirmationCode('');
  };

  const confirmDeleteAll = async () => {
      if (deleteConfirmationCode.trim().toUpperCase() === 'PADAM') {
          try {
              isWriteLocked.current = true;
              setAllStudents([]);
              setFilteredStudents([]);
              localStorage.setItem(SHEET_NAME_DATA_MURID, '[]');
              await apiService.write(SHEET_NAME_DATA_MURID, []);
              
              setIsDeleteModalOpen(false);
              showToast("Semua data murid telah dikosongkan.");
              // Force reload to ensure clean state
              setTimeout(() => window.location.reload(), 1000);
          } catch (e) {
              console.error(e);
              alert("Ralat: " + e);
          } finally {
              setTimeout(() => { isWriteLocked.current = false; }, 2000);
          }
      } else {
          alert("Kod pengesahan salah. Sila taip 'PADAM'.");
      }
  };

  const renderRekodHarian = () => (
    <div className="space-y-6 fade-in">
      {/* HEADER BANNER */}
      <div className="bg-blue-100 border border-blue-300 text-blue-900 px-6 py-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-wide">Senarai Murid SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH</h2>
      </div>

      {/* SUMMARY CARDS (Added as per request) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><LocalIcons.File /></div>
              <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Jumlah Keseluruhan</h4>
              <p className="text-4xl font-black text-white mt-2">{summaryStats.total}</p>
          </div>
          <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><LocalIcons.Folder /></div>
              <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Murid Asrama</h4>
              <p className="text-4xl font-black text-[#C9B458] mt-2">{summaryStats.asrama}</p>
          </div>
          <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><LocalIcons.CloudCheck /></div>
              <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Murid Luar</h4>
              <p className="text-4xl font-black text-blue-400 mt-2">{summaryStats.luar}</p>
          </div>
      </div>

      {/* CONTROLS: Pagination Size & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Papar</span>
              <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                  className="bg-[#0B132B] text-white border border-gray-600 rounded px-2 py-1 outline-none focus:border-[#C9B458] text-sm"
              >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
              </select>
              <span className="text-gray-400 text-sm">rekod</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-gray-400 text-sm">Carian:</span>
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0B132B] text-white border border-gray-600 rounded px-3 py-1.5 outline-none focus:border-[#C9B458] text-sm w-full md:w-64"
                  placeholder="Nama / KP / Kelas..."
              />
          </div>
      </div>

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
           {isSaving && <span className="text-yellow-400 text-xs font-bold animate-pulse flex items-center gap-1"><LocalIcons.Sync /> Menyimpan...</span>}
           {isSyncing && !isSaving && <span className="text-blue-300 text-xs font-bold animate-pulse flex items-center gap-1"><LocalIcons.Sync /> Menyegerak...</span>}
           
           <button onClick={manualSync} className="text-blue-300 hover:text-white transition-colors" title="Paksa Segerak Data"><LocalIcons.Refresh /></button>
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
                    {isSystemAdmin && (<button onClick={handleResetData} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"><span>🗑️</span> Padam Semua Data</button>)}
                    <button onClick={() => { setIsImportModalOpen(true); setSelectedImportMode(null); }} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"><span>📁</span> Import CSV</button>
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
                {isSystemAdmin && <th className="px-6 py-4 w-[150px]">No. KP</th>}
                <th className="px-6 py-4 text-center w-[180px]">Status Kediaman</th>
                <th className="px-6 py-4 min-w-[150px] text-center">Kelas</th>
                {customColumns.filter(c => c.toLowerCase() !== 'guru kelas').map(col => (<th key={col} className="px-6 py-4 min-w-[120px]"><div className="flex items-center justify-between gap-2">{col}{isSystemAdmin && (<button type="button" onClick={(e) => handleDeleteColumn(e, col)} className="text-red-400 hover:text-red-200 text-xs font-bold bg-[#0B132B] w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-900/50 transition-colors" title="Padam Kolum">×</button>)}</div></th>))}
                {canEdit && <th className="px-6 py-4 text-center w-28">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {currentStudents.length === 0 && (<tr><td colSpan={(isSystemAdmin ? 4 : 3) + customColumns.length + (canEdit ? 1 : 0)} className="px-6 py-8 text-center text-gray-500 italic">Tiada rekod ditemui.</td></tr>)}
              {currentStudents.map((student, idx) => {
                const isEditing = editingRowId === student.id;
                // Calculate global index for "Bil"
                const globalIdx = indexOfFirstItem + idx + 1;
                
                return (
                  <tr key={student.id} className={`transition-colors group ${isEditing ? 'bg-[#253252] border-l-4 border-[#C9B458]' : 'hover:bg-[#253252]'}`}>
                    <td className="px-6 py-3 text-center text-gray-400">{globalIdx}</td>
                    <td className="px-6 py-3 font-medium text-white">{isEditing ? (<input type="text" value={tempRowData?.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none"/>) : student.name}</td>
                    {isSystemAdmin && (
                      <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                        {isEditing ? (
                          <input type="text" value={tempRowData?.kp || ''} onChange={(e) => handleEditChange('kp', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none font-mono"/>
                        ) : student.kp}
                      </td>
                    )}
                    <td className="px-6 py-3"><div className="flex justify-center gap-2"><button disabled={!canEdit} onClick={() => handleStatusChange(student.id, 'Luar')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${student.status === 'Luar' ? 'bg-green-600 text-white shadow-lg' : 'bg-[#0B132B] text-gray-400 border border-gray-600'} ${canEdit ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>Luar</button><button disabled={!canEdit} onClick={() => handleStatusChange(student.id, 'Asrama')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${student.status === 'Asrama' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#0B132B] text-gray-400 border border-gray-600'} ${canEdit ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>Asrama</button></div></td>
                    <td className="px-6 py-3 text-center">{isEditing ? (<select value={tempRowData?.className || ''} onChange={(e) => handleEditChange('className', e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none">{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select>) : (<span className="text-white font-semibold text-xs bg-[#3A506B] px-2 py-1 rounded border border-[#C9B458]/30">{student.className}</span>)}</td>
                    {customColumns.filter(c => c.toLowerCase() !== 'guru kelas').map(col => (<td key={col} className="px-6 py-3 text-gray-300">{isEditing ? (<input type="text" value={tempRowData?.dynamicData?.[col] || ''} onChange={(e) => handleEditDynamicChange(col, e.target.value)} className="bg-[#0B132B] border border-gray-600 rounded px-2 py-1 text-white w-full focus:border-[#C9B458] outline-none text-xs"/>) : (<span>{student.dynamicData?.[col] || '-'}</span>)}</td>))}
                    {canEdit && (<td className="px-6 py-3 text-center"><div className="flex justify-center gap-2">{isEditing ? (<><button onClick={saveRow} className="text-green-400 hover:text-green-300 transition-transform hover:scale-110" title="Simpan"><LocalIcons.Save /></button><button onClick={cancelEditing} className="text-gray-400 hover:text-gray-200 transition-transform hover:scale-110 text-xs font-bold px-2" title="Batal">✕</button></>) : (<><button onClick={() => startEditing(student)} className="text-blue-400 hover:text-blue-300 transition-transform hover:scale-110" title="Edit Baris"><LocalIcons.Edit /></button><button onClick={(e) => handleDeleteStudent(e, student.id)} className="text-red-500 hover:text-red-400 transition-transform hover:scale-110" title="Hapus Baris"><LocalIcons.Trash /></button></>)}</div></td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-[#253252] p-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-xs text-gray-400">
                Menunjukkan {indexOfFirstItem + 1} hingga {Math.min(indexOfLastItem, filteredStudents.length)} daripada {filteredStudents.length} rekod
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#0B132B] border border-gray-600 rounded text-white text-xs disabled:opacity-50 hover:border-[#C9B458] transition-colors"
                >
                    Sebelumnya
                </button>
                <span className="text-white text-xs flex items-center px-2">
                    Halaman {currentPage} dari {totalPages || 1}
                </span>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 bg-[#0B132B] border border-gray-600 rounded text-white text-xs disabled:opacity-50 hover:border-[#C9B458] transition-colors"
                >
                    Seterusnya
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const handleDownloadPDF = () => {
      const element = document.getElementById('pdf-content');
      if (!element) {
          showToast("Ralat: Laporan tidak dijumpai.");
          return;
      }
      
      showToast("Sedang menjana PDF...");
      
      const opt = {
          margin: 10,
          filename: `Laporan_Enrolmen_${reportFilterForm.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const generate = () => {
          (window as any).html2pdf().set(opt).from(element).save().then(() => {
              showToast("PDF berjaya dimuat turun.");
          }).catch((err: any) => {
              console.error("PDF Error:", err);
              showToast("Gagal menjana PDF.");
          });
      };

      if (typeof (window as any).html2pdf === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = generate;
          document.head.appendChild(script);
      } else {
          generate();
      }
  };

  const handlePrint = () => {
      window.print();
  };

  const renderLaporan = () => {
    if (!isLaporanUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#1C2541] rounded-xl border border-gray-700 shadow-lg p-8 fade-in">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-white mb-2">Akses Laporan Disekat</h3>
          <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
            Sila masukkan kata laluan (kod sekolah) untuk mengakses bahagian laporan.
          </p>
          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="password"
              placeholder="Kata Laluan"
              value={laporanPasswordInput}
              onChange={(e) => setLaporanPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (laporanPasswordInput === 'jft4001') {
                    setIsLaporanUnlocked(true);
                    setLaporanPasswordInput('');
                  } else {
                    showToast('Kata laluan salah.');
                  }
                }
              }}
              className="flex-1 bg-[#0B132B] text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-[#C9B458]"
            />
            <button
              onClick={() => {
                if (laporanPasswordInput === 'jft4001') {
                  setIsLaporanUnlocked(true);
                  setLaporanPasswordInput('');
                } else {
                  showToast('Kata laluan salah.');
                }
              }}
              className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Buka
            </button>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-6 fade-in">
        <div className="bg-[#1C2541] p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Laporan Enrolmen</h3>
            <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#C9B458] font-bold uppercase">Tapis Kelas</label>
                    <select value={reportFilterForm} onChange={(e) => setReportFilterForm(e.target.value)} className="bg-[#0B132B] text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-[#C9B458]">{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <button onClick={() => setShowReportPreview(true)} className="bg-[#3A506B] hover:bg-[#4a6382] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors">Pratonton Laporan</button>
            </div>
        </div>

        <PrintPreviewModal
            isOpen={showReportPreview}
            onClose={() => setShowReportPreview(false)}
            onDownload={handleDownloadPDF}
            onPrint={handlePrint}
            title="Pratonton Laporan Enrolmen"
            orientation="portrait"
        >
            <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #000000' }}>
                <h1 className="text-2xl font-bold uppercase" style={{ color: '#000000' }}>Sekolah Menengah Agama Al-Khairiah Al-Islamiah</h1>
                <p className="text-sm" style={{ color: '#000000' }}>Laporan Enrolmen Murid - {reportFilterForm}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>Dicetak pada: {new Date().toLocaleDateString()}</p>
            </div>

            <table className="w-full border-collapse text-sm" style={{ borderColor: '#000000' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e5e7eb' }}>
                        <th className="px-2 py-1 text-center w-10" style={{ border: '1px solid #000000', color: '#000000' }}>Bil</th>
                        <th className="px-2 py-1 text-left" style={{ border: '1px solid #000000', color: '#000000' }}>Nama Murid</th>
                        <th className="px-2 py-1 text-center w-32" style={{ border: '1px solid #000000', color: '#000000' }}>No. KP</th>
                        <th className="px-2 py-1 text-center w-24" style={{ border: '1px solid #000000', color: '#000000' }}>Kelas</th>
                        <th className="px-2 py-1 text-center w-24" style={{ border: '1px solid #000000', color: '#000000' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {allStudents
                        .filter(s => reportFilterForm === 'Semua' || s.className === reportFilterForm)
                        .map((s, idx) => (
                        <tr key={s.id}>
                            <td className="px-2 py-1 text-center" style={{ border: '1px solid #000000', color: '#000000' }}>{idx + 1}</td>
                            <td className="px-2 py-1" style={{ border: '1px solid #000000', color: '#000000' }}>{s.name}</td>
                            <td className="px-2 py-1 text-center" style={{ border: '1px solid #000000', color: '#000000' }}>{s.kp}</td>
                            <td className="px-2 py-1 text-center" style={{ border: '1px solid #000000', color: '#000000' }}>{s.className}</td>
                            <td className="px-2 py-1 text-center" style={{ border: '1px solid #000000', color: '#000000' }}>{s.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PrintPreviewModal>
    </div>
  );
  };

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
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2"><h3 className="text-xl font-bold text-white">Memo / Catatan Harian</h3><button onClick={() => { localStorage.setItem('smaam_hem_memo', memoContent); showToast("Memo disimpan."); }} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"><LocalIcons.Save /> Simpan</button></div>
            <textarea value={memoContent} onChange={(e) => setMemoContent(e.target.value)} className="w-full bg-[#0B132B] border border-gray-600 rounded-lg p-4 text-white font-mono text-sm leading-relaxed focus:border-[#C9B458] outline-none resize-none flex-1 min-h-[400px]" placeholder="Tulis catatan penting berkaitan enrolmen di sini..." />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
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
          { key: 'memo', label: 'Memo', icon: '🗒️' }
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as Tab)} className={`px-6 py-3 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-[#1C2541] text-[#C9B458] border-t-2 border-[#C9B458]' : 'text-[#1C2541] hover:text-black hover:bg-white/30'}`}><span>{tab.icon}</span>{tab.label}</button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'rekod' && renderRekodHarian()}
        {activeTab === 'laporan' && renderLaporan()}
        {activeTab === 'analitik' && renderAnalitik()}
        {activeTab === 'memo' && renderMemo()}
      </div>

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
            <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Import Data Pukal</h3>
                <div className="text-sm text-gray-300 mb-4 space-y-2"><p>Sila masukkan data dalam format <strong>CSV (Comma Separated Values)</strong>.</p><div className="bg-black/30 p-2 rounded border border-gray-600"><p className="text-xs text-[#C9B458] font-bold mb-1">Baris Pertama MESTI Header:</p><code className="text-xs text-white block">Bil, Nama Murid, No. KP, Status Kediaman, Kelas, Guru Kelas{customColumns.length > 0 ? ', ' + customColumns.join(', ') : ''}</code></div><p className="text-[10px] text-yellow-500 italic">*Data akan diimport ke dalam pangkalan data utama.</p></div>
                <div className="mb-4"><label className="block text-xs text-[#C9B458] font-bold mb-1">Muat Naik Fail CSV</label><input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3A506B] file:text-white hover:file:bg-[#4a6382]"/></div>
                <label className="block text-xs text-[#C9B458] font-bold mb-1">Atau Tampal Data CSV (Raw)</label><textarea value={importDataRaw} onChange={(e) => setImportDataRaw(e.target.value)} className="w-full h-32 bg-[#0B132B] border border-gray-600 rounded-lg p-3 text-white text-xs font-mono focus:border-[#C9B458] outline-none mb-4" placeholder={`Bil, Nama Murid, No. KP, Status Kediaman, Kelas, Guru Kelas\n1, Ali bin Abu, 010101-01-0001, Luar, 1 Al-Hanafi, Cikgu Ahmad`}/>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setSelectedImportMode('append')} 
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all border ${selectedImportMode === 'append' ? 'bg-[#3A506B] text-white border-[#C9B458] ring-2 ring-[#C9B458] scale-[1.02]' : 'bg-[#3A506B]/50 text-gray-300 border-transparent hover:bg-[#3A506B]'}`}
                    >
                        ➕ Tambah Ke Data Sedia Ada (Append)
                    </button>
                    <button 
                        onClick={() => setSelectedImportMode('replace_class')} 
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all border ${selectedImportMode === 'replace_class' ? 'bg-orange-600 text-white border-white ring-2 ring-white scale-[1.02]' : 'bg-orange-600/50 text-gray-300 border-transparent hover:bg-orange-600'}`}
                    >
                        🔄 Ganti Ikut Kelas (Smart Replace)
                    </button>
                    <button 
                        onClick={() => setSelectedImportMode('replace_all')} 
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all border ${selectedImportMode === 'replace_all' ? 'bg-red-600 text-white border-white ring-2 ring-white scale-[1.02]' : 'bg-red-600/50 text-gray-300 border-transparent hover:bg-red-600'}`}
                    >
                        ⚠️ Ganti SEMUA Data (Hard Replace)
                    </button>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                        <button onClick={() => setIsImportModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg font-bold text-sm transition-colors">Batal</button>
                        <button 
                            onClick={() => selectedImportMode && handleProcessImport(selectedImportMode)} 
                            disabled={!selectedImportMode}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${selectedImportMode ? 'bg-[#C9B458] text-[#0B132B] hover:bg-yellow-400 shadow-lg' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                        >
                            <LocalIcons.Save /> Simpan & Proses
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
            <div className="bg-[#1C2541] w-full max-w-md p-6 rounded-xl border border-red-600 shadow-2xl">
                <h3 className="text-xl font-bold text-red-500 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                    <LocalIcons.Trash /> AMARAN: PADAM SEMUA DATA
                </h3>
                <div className="text-sm text-gray-300 mb-6 space-y-4">
                    <p className="bg-red-900/30 p-3 rounded border border-red-800 text-red-200">
                        Tindakan ini akan memadamkan <strong>SEMUA ({allStudents.length})</strong> rekod murid dari pangkalan data.
                        <br/><br/>
                        <strong>Tindakan ini TIDAK BOLEH dipulihkan.</strong>
                    </p>
                    <div>
                        <label className="block text-xs text-[#C9B458] font-bold mb-1">Taip 'PADAM' untuk sahkan:</label>
                        <input 
                            type="text" 
                            value={deleteConfirmationCode}
                            onChange={(e) => setDeleteConfirmationCode(e.target.value)}
                            className="w-full bg-[#0B132B] border border-gray-600 rounded-lg p-3 text-white text-sm font-mono focus:border-red-500 outline-none uppercase placeholder-gray-600"
                            placeholder="PADAM"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-bold text-sm transition-colors">Batal</button>
                    <button 
                        onClick={confirmDeleteAll}
                        disabled={deleteConfirmationCode.trim().toUpperCase() !== 'PADAM'}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${deleteConfirmationCode.trim().toUpperCase() === 'PADAM' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
                    >
                        <LocalIcons.Trash /> Padam Sekarang
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};