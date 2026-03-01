import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface JohorHolidayRow {
  id: number;
  date: string;
  day: string;
  name: string;
}

const initialJohorHolidays: JohorHolidayRow[] = [
  { id: 1, date: '1 Feb', day: 'Ahad', name: 'Hari Thaipusam' },
  { id: 2, date: '2 Feb', day: 'Isnin', name: 'Cuti Hari Thaipusam' },
  { id: 3, date: '17 Feb', day: 'Selasa', name: 'Tahun Baru Cina' },
  { id: 4, date: '18 Feb', day: 'Rabu', name: 'Tahun Baru Cina Hari Kedua' },
  { id: 5, date: '19 Feb', day: 'Khamis', name: 'Awal Ramadan' },
  { id: 6, date: '21 Mac', day: 'Sabtu', name: 'Hari Raya Aidilfitri' },
  { id: 7, date: '22 Mac', day: 'Ahad', name: 'Hari Raya Aidilfitri Hari Kedua' },
  { id: 8, date: '23 Mac', day: 'Isnin', name: 'Hari Keputeraan Sultan Johor' },
  { id: 9, date: '23 Mac', day: 'Isnin', name: 'Cuti Hari Raya Aidilfitri' },
  { id: 10, date: '1 Mei', day: 'Jumaat', name: 'Hari Pekerja' },
  { id: 11, date: '27 Mei', day: 'Rabu', name: 'Hari Raya Haji' },
  { id: 12, day: 'Ahad', date: '31 Mei', name: 'Hari Wesak' },
  { id: 13, date: '1 Jun', day: 'Isnin', name: 'Hari Keputeraan YDP Agong' },
  { id: 14, date: '1 Jun', day: 'Isnin', name: 'Cuti Hari Wesak' },
  { id: 15, date: '17 Jun', day: 'Rabu', name: 'Awal Muharram' },
  { id: 16, date: '21 Jul', day: 'Selasa', name: 'Hari Hol Almarhum Sultan Iskandar' },
  { id: 17, date: '25 Ogos', day: 'Selasa', name: 'Maulidur Rasul' },
  { id: 18, date: '31 Ogos', day: 'Isnin', name: 'Hari Kebangsaan' },
  { id: 19, date: '16 Sep', day: 'Rabu', name: 'Hari Malaysia' },
  { id: 20, date: '8 Nov', day: 'Ahad', name: 'Hari Deepavali' },
  { id: 21, date: '9 Nov', day: 'Isnin', name: 'Cuti Hari Deepavali' },
  { id: 22, date: '25 Dis', day: 'Jumaat', name: 'Hari Krismas' },
];

const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
};

export const TakwimCutiJohor: React.FC = () => {
    const { user, showToast } = useApp();
    const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
    const isSuperAdmin = user?.role === 'adminsistem';
    
    // --- LAZY INITIALIZATION (PRESERVE DATA) ---
    const [johorHolidayList, setJohorHolidayList] = useState<JohorHolidayRow[]>(() => {
        try {
            const saved = localStorage.getItem('smaam_takwim_cuti_johor');
            return saved ? JSON.parse(saved) : initialJohorHolidays;
        } catch (e) {
            return initialJohorHolidays;
        }
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<any>(null);

    // --- INSTANT SAVE ---
    const saveToStorage = (data: JohorHolidayRow[]) => {
        localStorage.setItem('smaam_takwim_cuti_johor', JSON.stringify(data));
        setJohorHolidayList(data);
    };

    const handleOpenEdit = (item: any) => {
        if (isSystemData(item.id) && !isSuperAdmin) return;
        setEditingRow(item || {});
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRow.id) {
             if (isSystemData(editingRow.id) && !isSuperAdmin) {
                showToast("Akses Ditolak.");
                setIsEditModalOpen(false);
                return;
             }
             const updated = johorHolidayList.map(row => row.id === editingRow.id ? editingRow : row);
             saveToStorage(updated);
             showToast("Data Cuti Umum dikemaskini.");
        } else {
             const newId = Date.now(); 
             const updated = [...johorHolidayList, { ...editingRow, id: newId }];
             saveToStorage(updated);
             showToast("Cuti Umum ditambah.");
        }
        setIsEditModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (isSystemData(id) && !isSuperAdmin) {
            showToast("Akses Ditolak: Data sistem.");
            return;
        }
        if (confirm("Adakah anda pasti ingin memadam data ini?")) {
            const updated = johorHolidayList.filter(item => item.id !== id);
            saveToStorage(updated);
            showToast("Cuti berjaya dipadam.");
        }
    };

    const handleReset = () => {
        if(confirm("Kembalikan kepada data asal?")) {
            saveToStorage(initialJohorHolidays);
            showToast("Data ditetapkan semula.");
        }
    }

    return (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-6 bg-[#0B132B] border-b border-gray-700 relative flex items-center justify-center">
            <h3 className="text-xl font-bold text-white font-montserrat uppercase tracking-wider text-center">CUTI UMUM NEGERI JOHOR 2026</h3>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                {isSuperAdmin && (
                    <button onClick={handleReset} className="text-[10px] text-red-400 hover:text-white px-2 py-1 border border-red-900 rounded">Reset</button>
                )}
                {isAdmin && (<button onClick={() => handleOpenEdit({})} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah</button>)}
            </div>
        </div>
        
        {/* CENTERED TABLE CONTAINER WITH 1CM MARGIN PADDING */}
        <div className="p-10 flex justify-center bg-[#1C2541]">
            <div className="overflow-x-auto rounded-lg shadow-2xl border border-gray-600 w-full">
                <table className="w-full min-w-[800px] lg:min-w-full text-center border-separate border-spacing-0 text-sm bg-[#1C2541]">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] font-bold uppercase tracking-wider">
                            <th className="border border-gray-600 px-6 py-4 whitespace-nowrap w-20 bg-[#C9B458]">BIL</th>
                            <th className="border border-gray-600 px-6 py-4 whitespace-nowrap w-40 bg-[#C9B458]">TARIKH</th>
                            <th className="border border-gray-600 px-6 py-4 whitespace-nowrap w-40">HARI</th>
                            <th className="border border-gray-600 px-6 py-4">HARI KELEPASAN AM / CATATAN</th>
                            {isAdmin && <th className="border border-gray-600 px-6 py-4 whitespace-nowrap w-32">AKSI</th>}
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {johorHolidayList.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-[#253252] transition-colors border-b border-gray-700 last:border-0">
                                <td className="border-r border-gray-600 py-4 px-6 font-medium bg-[#1C2541]">{idx + 1}</td>
                                <td className="border-r border-gray-600 py-4 px-6 font-bold text-white whitespace-nowrap bg-[#1C2541]">{item.date}</td>
                                <td className="border-r border-gray-600 py-4 px-6 text-[#C9B458] font-bold whitespace-nowrap">{item.day}</td>
                                <td className="border-r border-gray-600 py-4 px-6 text-center font-medium text-white break-words">{item.name}</td>
                                {isAdmin && (
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleOpenEdit(item)} 
                                                className={`${isSystemData(item.id) && !isSuperAdmin ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-white transition-transform hover:scale-110'}`}
                                            >
                                                {isSystemData(item.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                            </button>
                                            {(!isSystemData(item.id) || isSuperAdmin) && (
                                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 transition-transform hover:scale-110">
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
                <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">Kemaskini Cuti Umum</h3>
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh (cth: 1 Feb)</label><input type="text" value={editingRow.date || ''} onChange={e => setEditingRow({...editingRow, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Hari (cth: Ahad)</label><input type="text" value={editingRow.day || ''} onChange={e => setEditingRow({...editingRow, day: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Cuti (Catatan)</label><input type="text" value={editingRow.name || ''} onChange={e => setEditingRow({...editingRow, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                        <div className="flex gap-2 pt-4">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                            <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
    );
};