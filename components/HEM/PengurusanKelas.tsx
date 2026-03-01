import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

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
  { id: 1, form: '1', class: '1 Al-Hanafi', teacher: 'Mohammad Firros Bin Rosool Gani' },
  { id: 2, form: '1', class: '1 Al-Maliki', teacher: 'Syahidatun Najihah binti Aziz' },
  { id: 3, form: '1', class: '1 Al-Syafie', teacher: 'Nurul Syafiqah binti Husin' },
  { id: 4, form: '2', class: '2 Al-Hanafi', teacher: 'Siti Nurul Liza binti Sidin' },
  { id: 5, form: '2', class: '2 Al-Maliki', teacher: "Ahmad Fikruddin bin Ahmad Raza'i" },
  { id: 6, form: '2', class: '2 Al-Syafie', teacher: 'Masyitah binti Razali' },
  { id: 7, form: '3', class: '3 Al-Hanafi', teacher: 'Nor Hidayah binti Mahadun' },
  { id: 8, form: '3', class: '3 Al-Maliki', teacher: 'Siti Aminah binti Mohamed' },
  { id: 9, form: '3', class: '3 Al-Syafie', teacher: 'Mohd Nur bin Ahmad' },
  { id: 10, form: '4', class: '4 Al-Hanafi', teacher: 'Nik Noorizati binti Ab Kahar' },
  { id: 11, form: '4', class: '4 Al-Syafie', teacher: 'Annur Ayuni binti Mohamed' },
  { id: 12, form: '5', class: '5 Al-Hanafi', teacher: 'Norashidah binti A Wahab' },
  { id: 13, form: '5', class: '5 Al-Syafie', teacher: 'Nurul Izzati binti Roslin' },
];

const INITIAL_COORDINATORS: Coordinator[] = [
  { id: 1, form: 'Tingkatan 1', name: 'Mohammad Firros Bin Rosool Gani' },
  { id: 2, form: 'Tingkatan 2', name: "Ahmad Fikruddin bin Ahmad Raza'i" },
  { id: 3, form: 'Tingkatan 3', name: 'Siti Aminah binti Mohamed' },
  { id: 4, form: 'Tingkatan 4', name: 'Nik Noorizati binti Ab Kahar' },
  { id: 5, form: 'Tingkatan 5', name: 'Norashidah binti A Wahab' },
];

const TEACHER_LIST = [
    "Zulkeffle bin Muhammad",
    "Shaharer bin Hj Husain",
    "Noratikah binti Abd. Kadir",
    "Zulkifli bin Md Aspan",
    "Norliyana binti Mhd. Amin",
    "Salman bin A Rahman",
    "Mohammad Firros Bin Rosool Gani",
    "Nor Azean binti Ismail",
    "Muhammad Hafiz bin Jalil",
    "Annur Ayuni binti Mohamed",
    "Saemah binti Supandi",
    "Ahmad Fikruddin bin Ahmad Raza'i",
    "Islahuddin bin Muchtar",
    "Mohd Nur bin Ahmad",
    "Mohd Nor bin Salikin",
    "Nurulashiqin binti Razali",
    "Noorlela binti Zainudin",
    "Nurul Syafiqah binti Husin",
    "Syahidatun Najihah binti Aziz",
    "Siti Nurul Liza binti Sidin",
    "Masyitah binti Razali",
    "Nor Hidayah binti Mahadun",
    "Siti Aminah binti Mohamed",
    "Nik Noorizati binti Ab Kahar",
    "Norashidah binti A Wahab",
    "Nurul Izzati binti Roslin",
    "Nuurul Amira binti Razak",
    "Mohamad Sukri bin Ali",
    "Muhammad Zaid bin Zamzuri",
    "Mazuin binti Mat",
    "Zarith Najiha binti Jamal",
    "Nooraind binti Ali",
    "Yati binti Ani"
];

const Icons = {
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

export const PengurusanKelas: React.FC = () => {
  const { checkPermission, showToast } = useApp();
  const canEdit = checkPermission('canUpdateJadualGuruKelas');

  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>(() => {
    const savedCT = localStorage.getItem('smaam_class_teachers');
    try {
        const parsed = savedCT ? JSON.parse(savedCT) : null;
        return Array.isArray(parsed) ? parsed : INITIAL_CLASS_TEACHERS;
    } catch {
        return INITIAL_CLASS_TEACHERS;
    }
  });
  const [coordinators, setCoordinators] = useState<Coordinator[]>(() => {
    const savedCoord = localStorage.getItem('smaam_coordinators');
    return savedCoord ? JSON.parse(savedCoord) : INITIAL_COORDINATORS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'classTeacher' | 'coordinator' | null>(null);
  const [editingItem, setEditingItem] = useState<ClassTeacher | Coordinator | null>(null);
  const [formData, setFormData] = useState<Partial<ClassTeacher & Coordinator>>({});

  // Student counts state
  const [studentCounts] = useState<Record<string, { L: number, P: number }>>(() => {
    const savedData = localStorage.getItem('DATA_MURID');
    if (savedData) {
        try {
            const students = JSON.parse(savedData);
            if (Array.isArray(students)) {
                const counts: Record<string, { L: number, P: number }> = {};
                students.forEach(s => {
                    const className = s.className;
                    if (!counts[className]) counts[className] = { L: 0, P: 0 };
                    const name = s.name.toLowerCase();
                    const isFemale = name.includes(' binti ') || name.includes(' bt ') || name.includes(' puan ') || name.includes(' cik ');
                    if (isFemale) counts[className].P++;
                    else counts[className].L++;
                });
                return counts;
            }
        } catch {
            console.error("Error parsing student data");
        }
    }
    return {};
  });

  const saveToStorage = () => {
    localStorage.setItem('smaam_class_teachers', JSON.stringify(classTeachers));
    localStorage.setItem('smaam_coordinators', JSON.stringify(coordinators));
  };

  const getFormColor = (form: string) => {
      switch(form) {
          case '1': return 'bg-blue-300 text-blue-900';
          case '2': return 'bg-green-300 text-green-900';
          case '3': return 'bg-purple-300 text-purple-900';
          case '4': return 'bg-orange-300 text-orange-900';
          case '5': return 'bg-red-300 text-red-900';
          default: return 'bg-gray-300 text-gray-900';
      }
  };

  const openEditModal = (mType: 'classTeacher' | 'coordinator', item: ClassTeacher | Coordinator | null) => {
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
        const payload: ClassTeacher = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form || '1',
            class: formData.class || '',
            teacher: formData.teacher || ''
        };
        if (editingItem) {
            setClassTeachers(classTeachers.map(ct => ct.id === payload.id ? payload : ct));
        } else {
            setClassTeachers([...classTeachers, payload]);
        }
        showToast("Data Guru Kelas disimpan.");
    } else if (modalType === 'coordinator') {
        const payload: Coordinator = {
            id: editingItem ? editingItem.id : Date.now(),
            form: formData.form || '',
            name: formData.name || ''
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

  const getFormLabel = (form: string) => {
      const labels: Record<string, string> = {
          '1': 'TINGKATAN SATU',
          '2': 'TINGKATAN DUA',
          '3': 'TINGKATAN TIGA',
          '4': 'TINGKATAN EMPAT',
          '5': 'TINGKATAN LIMA'
      };
      return labels[form] || `TINGKATAN ${form}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in pb-20 font-inter">
      <div className="border-b border-gray-400 pb-4">
        <div className="flex items-center gap-2 text-sm text-[#0B132B] font-mono mb-2">
          <span className="font-bold">HEM</span>
          <span className="opacity-50">/</span>
          <span className="uppercase font-bold opacity-80">PENGURUSAN KELAS</span>
        </div>
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          PENGURUSAN KELAS
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">Senarai Guru Kelas dan Penyelaras Tingkatan.</p>
      </div>

      <div className="flex justify-end gap-2">
          {canEdit && (
              <>
                <button onClick={() => openEditModal('coordinator', null)} className="bg-[#3A506B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#4a6382] shadow-md transition-all">+ Tambah Penyelaras</button>
                <button onClick={() => openEditModal('classTeacher', null)} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 shadow-md transition-all">+ Tambah Guru Kelas</button>
              </>
          )}
      </div>

      <div className="space-y-10">
        {[1, 2, 3, 4, 5].map(formLevel => {
            const formStr = formLevel.toString();
            const formClasses = classTeachers.filter(t => t.form === formStr);
            const coordinator = coordinators.find(c => c.form.includes(formStr));
            
            if (formClasses.length === 0) return null;

            let totalL = 0;
            let totalP = 0;

            return (
                <div key={formLevel} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className={`${getFormColor(formStr)} p-6`}>
                        <h3 className="text-2xl font-bold tracking-tight">{getFormLabel(formStr)}</h3>
                        <p className="text-sm opacity-90 mt-1 font-medium">
                            Penyelaras Tingkatan: {coordinator ? coordinator.name : 'Belum Dilantik'}
                            {canEdit && coordinator && (
                                <button onClick={() => openEditModal('coordinator', coordinator)} className="ml-2 text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors">Edit</button>
                            )}
                        </p>
                    </div>

                    {/* Classes Table Section */}
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                                    <th className="px-6 py-4 border-b border-gray-200">Nama Kelas</th>
                                    <th className="px-6 py-4 border-b border-gray-200">Nama Guru Kelas</th>
                                    <th className="px-6 py-4 border-b border-gray-200 text-center w-24">Lelaki</th>
                                    <th className="px-6 py-4 border-b border-gray-200 text-center w-24">Perempuan</th>
                                    <th className="px-6 py-4 border-b border-gray-200 text-center w-24">Jumlah</th>
                                    {canEdit && <th className="px-6 py-4 border-b border-gray-200 text-center w-24">Tindakan</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {formClasses.map((ct) => {
                                    const counts = studentCounts[ct.class] || { L: 0, P: 0 };
                                    const total = counts.L + counts.P;
                                    totalL += counts.L;
                                    totalP += counts.P;

                                    return (
                                        <tr key={ct.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{ct.class}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {ct.teacher}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{counts.L}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-bold">{counts.P}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">{total}</span>
                                            </td>
                                            {canEdit && (
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal('classTeacher', ct)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                                            <Icons.Edit />
                                                        </button>
                                                        <button onClick={() => handleDelete('classTeacher', ct.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Padam">
                                                            <Icons.Trash />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Summary Section */}
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Rumusan {getFormLabel(formStr)}</span>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Lelaki:</span>
                                <span className="text-sm font-black text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full">{totalL}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Perempuan:</span>
                                <span className="text-sm font-black text-pink-700 bg-pink-100 px-3 py-0.5 rounded-full">{totalP}</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Keseluruhan:</span>
                                <span className="text-sm font-black text-gray-900 bg-gray-200 px-3 py-0.5 rounded-full">{totalL + totalP}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
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