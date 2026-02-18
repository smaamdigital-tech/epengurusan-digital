import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface ClassTeacher {
  id: number;
  form: string;
  class: string;
  teacher: string;
}

interface Coordinator {
  id: number;
  form: string;
  name: string;
}

const INITIAL_CLASS_TEACHERS: ClassTeacher[] = [
  { id: 1, form: '1', class: '1 Al-Hanafi', teacher: 'MOHAMMAD FIRROS BIN ROSOOL GANI' },
  { id: 2, form: '1', class: '1 Al-Maliki', teacher: 'SYAHIDATUN NAJIHAH BINTI AZIZ' },
  { id: 3, form: '1', class: '1 Al-Syafie', teacher: 'NURUL SYAFIQAH BINTI HUSIN' },
  { id: 4, form: '2', class: '2 Al-Hanafi', teacher: 'SITI NURUL LIZA BINTI SIDIN' },
  { id: 5, form: '2', class: '2 Al-Maliki', teacher: "AHMAD FIKRUDDIN BIN AHMAD RAZA'I" },
  { id: 6, form: '2', class: '2 Al-Syafie', teacher: 'MASYITAH BINTI RAZALI' },
  { id: 7, form: '3', class: '3 Al-Hanafi', teacher: 'NOR HIDAYAH BINTI MAHADUN' },
  { id: 8, form: '3', class: '3 Al-Maliki', teacher: 'SITI AMINAH BINTI MOHAMED' },
  { id: 9, form: '3', class: '3 Al-Syafie', teacher: 'MOHD NUR BIN AHMAD' },
  { id: 10, form: '4', class: '4 Al-Hanafi', teacher: 'NIK NOORIZATI BINTI AB KAHAR' },
  { id: 11, form: '4', class: '4 Al-Syafie', teacher: 'ANNUR AYUNI BINTI MOHAMED' },
  { id: 12, form: '5', class: '5 Al-Hanafi', teacher: 'NORASHIDAH BINTI A WAHAB' },
  { id: 13, form: '5', class: '5 Al-Syafie', teacher: 'NURUL IZZATI BINTI ROSLIN' },
];

const INITIAL_COORDINATORS: Coordinator[] = [
  { id: 1, form: 'Tingkatan 1', name: 'MOHAMMAD FIRROS BIN ROSOOL GANI' },
  { id: 2, form: 'Tingkatan 2', name: "AHMAD FIKRUDDIN BIN AHMAD RAZA'I" },
  { id: 3, form: 'Tingkatan 3', name: 'SITI AMINAH BINTI MOHAMED' },
  { id: 4, form: 'Tingkatan 4', name: 'NIK NOORIZATI BINTI AB KAHAR' },
  { id: 5, form: 'Tingkatan 5', name: 'NORASHIDAH BINTI A WAHAB' },
];

const TEACHER_LIST = [
    "UZ ZULKEFFLE", "UZH ATIKAH", "UZ SHAHARER", "C. ZULKIFLI", 
    "C. ROS", "C. ZAHRAH", "C. MAZUIN", "C. AIND", 
    "UZH SAEMAH", "UZH AZEAN", "C. FIKRUDIN", "C. FIRROS", 
    "C. LIYANA", "T. HAKIM", "T. IZATI", "C. SHIDAH", 
    "T. AIN", "C. IZZATI", "C. SYAFIQAH", "C. LIZA", 
    "C. HAFIZ", "C. AMIRA", "UZH LELA", "UZH AYUNI", 
    "UZ SALMAN", "UZ MNUR", "UZH HIDAYAH", "UZH MASYITAH", 
    "UZ SUKRI", "UZ MNOR", "UZH LIYANA", "UZH AMINAH", 
    "UZH NAJIHAH", "UZH ZARITH"
];

export const PengurusanKelas: React.FC = () => {
  const { checkPermission, showToast, user } = useApp();
  const canEdit = checkPermission('canUpdateJadualGuruKelas');
  const isSuperAdmin = user?.role === 'adminsistem';

  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>(INITIAL_CLASS_TEACHERS);
  const [coordinators, setCoordinators] = useState<Coordinator[]>(INITIAL_COORDINATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'classTeacher' | 'coordinator' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const savedCT = localStorage.getItem('smaam_class_teachers');
    const savedCoord = localStorage.getItem('smaam_coordinators');
    if (savedCT) setClassTeachers(JSON.parse(savedCT));
    if (savedCoord) setCoordinators(JSON.parse(savedCoord));
  }, []);

  const saveToStorage = () => {
    localStorage.setItem('smaam_class_teachers', JSON.stringify(classTeachers));
    localStorage.setItem('smaam_coordinators', JSON.stringify(coordinators));
  };

  const isSystemData = (id: any) => {
    return typeof id === 'number' && id < 1000000000;
  };

  const openEditModal = (mType: 'classTeacher' | 'coordinator', item: any) => {
    setModalType(mType);
    setEditingItem(item);
    if (item) {
        setFormData({ ...item });
    } else {
        setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'classTeacher') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form,
            class: formData.class || formData.className,
            teacher: formData.teacher || formData.teacherName
        };
        if (editingItem) {
            setClassTeachers(classTeachers.map(ct => ct.id === payload.id ? payload : ct));
        } else {
            setClassTeachers([...classTeachers, payload]);
        }
        showToast("Data Guru Kelas disimpan.");
    } else if (modalType === 'coordinator') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form,
            name: formData.name
        };
        if (editingItem) {
            setCoordinators(coordinators.map(c => c.id === payload.id ? payload : c));
        } else {
            setCoordinators([...coordinators, payload]);
        }
        showToast("Data Penyelaras disimpan.");
    }
    saveToStorage();
    setIsModalOpen(false);
  };

  const handleDelete = (type: 'classTeacher' | 'coordinator', id: number) => {
      if (confirm("Padam data ini?")) {
          if (type === 'classTeacher') {
              setClassTeachers(classTeachers.filter(ct => ct.id !== id));
          } else {
              setCoordinators(coordinators.filter(c => c.id !== id));
          }
          saveToStorage();
          showToast("Data dipadam.");
      }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          🎓 Pengurusan Kelas
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">Senarai Guru Kelas dan Penyelaras Tingkatan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SENARAI GURU KELAS */}
        <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 h-full">
                <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Senarai Guru Kelas</h3>
                {canEdit && (
                    <button onClick={() => openEditModal('classTeacher', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah Kelas</button>
                )}
                </div>
                <div className="p-6 space-y-6">
                {[1, 2, 3, 4, 5].map(formLevel => (
                    <div key={formLevel} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                            <span className="bg-[#3A506B] text-white text-xs font-bold px-2 py-1 rounded">Tingkatan {formLevel}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {classTeachers.filter(t => t.form === formLevel.toString()).map((ct, idx) => (
                            <div key={ct.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0B132B]/50 p-3 rounded border border-gray-700/50 hover:bg-[#253252] hover:border-[#C9B458]/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/50 flex items-center justify-center font-bold text-xs shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <span className="font-mono text-white font-bold text-sm">{ct.class}</span>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="text-gray-300 text-sm font-medium">{ct.teacher}</span>
                                    {canEdit && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openEditModal('classTeacher', ct)}
                                                className={`${isSystemData(ct.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:text-white'}`}
                                            >
                                                {isSystemData(ct.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                            </button>
                                            {(!isSystemData(ct.id) || isSuperAdmin) && (
                                                <button 
                                                    onClick={() => handleDelete('classTeacher', ct.id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: PENYELARAS TINGKATAN */}
        <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-[#1C2541] rounded-xl border-l-4 border-[#C9B458] p-6 shadow-lg sticky top-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h3 className="text-lg font-bold text-white tracking-wide">Penyelaras Tingkatan</h3>
                    {canEdit && (
                        <button onClick={() => openEditModal('coordinator', null)} className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded text-[10px] font-bold hover:bg-yellow-400">+ Tambah</button>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                {coordinators.map((coord) => (
                    <div key={coord.id} className="flex items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-lg border border-gray-700 group hover:border-[#C9B458] transition-colors shadow-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-[#3A506B] flex items-center justify-center font-bold text-[#C9B458] shrink-0 text-sm border border-[#C9B458]/30">
                                {coord.form.replace(/[^0-9]/g, '') || 'T'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-[#2DD4BF] uppercase tracking-widest font-bold truncate">{coord.form}</p>
                                <p className="font-semibold text-white text-xs truncate">{coord.name}</p>
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal('coordinator', coord)} 
                                    className={`${isSystemData(coord.id) && !isSuperAdmin ? 'text-gray-600' : 'text-gray-500 hover:text-[#C9B458]'}`}
                                >
                                    {isSystemData(coord.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                </button>
                                {(!isSystemData(coord.id) || isSuperAdmin) && (
                                    <button onClick={() => handleDelete('coordinator', coord.id)} className="text-red-500 hover:text-red-400">🗑️</button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">{editingItem ? 'Kemaskini' : 'Tambah'} {modalType === 'classTeacher' ? 'Guru Kelas' : 'Penyelaras'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
                {modalType === 'classTeacher' && (
                    <>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tingkatan</label><select value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Kelas</label><input type="text" value={formData.class || formData.className} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Cth: 4 Al-Maliki" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Kelas</label><select value={formData.teacher || formData.teacherName} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    </>
                )}
                {modalType === 'coordinator' && (
                    <>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tajuk / Penyelaras</label><input type="text" value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Contoh: Tingkatan 1" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Guru</label><select value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    </>
                )}
                <div className="flex gap-2 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                   <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};