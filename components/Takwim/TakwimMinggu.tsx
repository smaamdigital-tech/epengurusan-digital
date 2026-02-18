import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface SchoolWeekRow {
  id: number;
  week: string;
  date: string;
  notes: string;
  totalDays: string;
  totalWeeks: string;
  rowSpan?: number;
  isHoliday?: boolean;
}

const initialSchoolWeeks: SchoolWeekRow[] = [
  // Block 1 (Weeks 1-10)
  { id: 1, week: '1', date: '12 – 16 Jan 2026', notes: '', totalDays: '43', totalWeeks: '10', rowSpan: 10 },
  { id: 2, week: '2', date: '19 – 23 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 3, week: '3', date: '26 – 30 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 4, week: '4', date: '2 – 6 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 5, week: '5', date: '9 – 13 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 6, week: '6', date: '16 – 20 Feb 2026', notes: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', totalDays: '', totalWeeks: '' },
  { id: 7, week: '7', date: '23 – 27 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 8, week: '8', date: '2 – 6 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 9, week: '9', date: '9 – 13 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 10, week: '10', date: '16 – 20 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 1
  { id: 101, week: '', date: '21 – 29 Mac 2026', notes: 'CUTI PENGGAL 1, TAHUN 2026', totalDays: '9', totalWeeks: '1', isHoliday: true },

  // Block 2 (Weeks 11-18)
  { id: 11, week: '11', date: '30 Mac – 3 Apr 2026', notes: '', totalDays: '39', totalWeeks: '8', rowSpan: 8 },
  { id: 12, week: '12', date: '6 – 10 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 13, week: '13', date: '13 – 17 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 14, week: '14', date: '20 – 24 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 15, week: '15', date: '27 Apr – 1 Mei 2026', notes: '1 Mei (Hari Pekerja)', totalDays: '', totalWeeks: '' },
  { id: 16, week: '16', date: '4 – 8 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 17, week: '17', date: '11 – 15 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 18, week: '18', date: '18 – 22 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 2
  { id: 102, week: '', date: '23.05.2026 – 07.06.2026', notes: 'CUTI PERTENGAHAN TAHUN 2026', totalDays: '16', totalWeeks: '2', isHoliday: true },

  // Block 3 (Weeks 19-30)
  { id: 19, week: '19', date: '8 – 12 Jun 2026', notes: '', totalDays: '58', totalWeeks: '12', rowSpan: 12 },
  { id: 20, week: '20', date: '15 – 19 Jun 2026', notes: '17 Jun (Awal Muharram)', totalDays: '', totalWeeks: '' },
  { id: 21, week: '21', date: '22 – 26 Jun 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 22, week: '22', date: '29 Jun – 3 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 23, week: '23', date: '6 – 10 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 24, week: '24', date: '13 – 17 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 25, week: '25', date: '20 – 24 Jul 2026', notes: '21 Jul (Hari Hol — Johor)', totalDays: '', totalWeeks: '' },
  { id: 26, week: '26', date: '27 – 31 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 27, week: '27', date: '3 – 7 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 28, week: '28', date: '10 – 14 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 29, week: '29', date: '17 – 21 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 30, week: '30', date: '24 – 28 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 3
  { id: 103, week: '', date: '29.08.2026 – 06.09.2026', notes: 'CUTI PENGGAL 2, TAHUN 2026', totalDays: '9', totalWeeks: '1', isHoliday: true },

  // Block 4 (Weeks 31-43)
  { id: 31, week: '31', date: '7 – 11 Sep 2026', notes: '-', totalDays: '62', totalWeeks: '13', rowSpan: 13 },
  { id: 32, week: '32', date: '14 – 18 Sep 2026', notes: '16 Sept (Hari Malaysia)', totalDays: '', totalWeeks: '' },
  { id: 33, week: '33', date: '21 – 25 Sep 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 34, week: '34', date: '28 Sep – 2 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 35, week: '35', date: '5 – 9 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 36, week: '36', date: '12 – 16 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 37, week: '37', date: '19 – 23 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 38, week: '38', date: '26 – 30 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 39, week: '39', date: '2 – 6 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 40, week: '40', date: '9 – 13 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 41, week: '41', date: '16 – 20 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 42, week: '42', date: '23 – 27 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 43, week: '43', date: '30 Nov – 4 Dis 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Final Holiday
  { id: 104, week: '', date: '05.12.2026 – 31.12.2026', notes: 'CUTI AKHIR PERSEKOLAHAN TAHUN 2026', totalDays: '27', totalWeeks: '4', isHoliday: true },
];

const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
};

export const TakwimMinggu: React.FC = () => {
    const { user, showToast } = useApp();
    const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
    const isSuperAdmin = user?.role === 'adminsistem';
    
    // --- LAZY INITIALIZATION ---
    const [schoolWeeks, setSchoolWeeks] = useState<SchoolWeekRow[]>(() => {
        try {
            const saved = localStorage.getItem('smaam_takwim_minggu');
            return saved ? JSON.parse(saved) : initialSchoolWeeks;
        } catch (e) {
            return initialSchoolWeeks;
        }
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<any>(null);

    const saveToStorage = (data: SchoolWeekRow[]) => {
        localStorage.setItem('smaam_takwim_minggu', JSON.stringify(data));
        setSchoolWeeks(data);
    };

    const handleOpenEdit = (row: any) => {
        if (isSystemData(row?.id) && !isSuperAdmin) return;
        setEditingRow(row || {});
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRow.id && isSystemData(editingRow.id) && !isSuperAdmin) {
            showToast("Akses Ditolak.");
            setIsEditModalOpen(false);
            return;
        }
        const updated = schoolWeeks.map(row => row.id === editingRow.id ? editingRow : row);
        saveToStorage(updated);
        showToast("Data Minggu Persekolahan dikemaskini.");
        setIsEditModalOpen(false);
    };

    const handleReset = () => {
        if(confirm("Kembalikan kepada data asal?")) {
            saveToStorage(initialSchoolWeeks);
            showToast("Data ditetapkan semula.");
        }
    }

    return (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="flex justify-end p-2 bg-[#0B132B]">
            {isSuperAdmin && (
                <button onClick={handleReset} className="text-[10px] text-red-400 hover:text-white px-2 py-1 border border-red-900 rounded">Reset Data</button>
            )}
        </div>
        
        {/* PADDING ADJUSTMENT: 1cm (approx 2.5rem or p-10) applied to container */}
        <div className="p-8 md:p-10 flex justify-center bg-[#1C2541]">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-center border-collapse border border-gray-600 text-xs md:text-sm">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] font-bold uppercase">
                            <th className="border border-gray-600 px-4 py-3 w-20">MINGGU</th>
                            <th className="border border-gray-600 px-4 py-3 w-48">TARIKH</th>
                            <th className="border border-gray-600 px-4 py-3">CATATAN</th>
                            <th className="border border-gray-600 px-4 py-3 w-24">BIL HARI</th>
                            <th className="border border-gray-600 px-4 py-3 w-28">BIL MINGGU</th>
                            {isAdmin && <th className="border border-gray-600 px-2 py-3 w-16">AKSI</th>}
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {schoolWeeks.map((row) => (
                            <tr key={row.id} className={`${row.isHoliday ? 'bg-[#0B132B]' : 'hover:bg-[#253252]'} transition-colors`}>
                                {/* MINGGU */}
                                <td className={`border border-gray-600 p-2 font-bold ${row.isHoliday ? 'bg-yellow-600 text-black border-yellow-700' : 'text-[#C9B458]'}`}>
                                    {row.isHoliday ? '' : row.week}
                                </td>
                                
                                {/* TARIKH */}
                                <td className={`border border-gray-600 p-2 font-mono whitespace-nowrap ${row.isHoliday ? 'bg-yellow-600 text-black font-bold border-yellow-700' : ''}`}>
                                    {row.date}
                                </td>
                                
                                {/* CATATAN - CENTER ALIGNMENT */}
                                <td className={`border border-gray-600 p-2 text-center whitespace-pre-wrap ${row.isHoliday ? 'bg-yellow-600 text-black font-bold uppercase border-yellow-700' : ''}`}>
                                    {row.notes}
                                </td>
                                
                                {/* BIL HARI (RowSpan) */}
                                {(row.rowSpan || (row.totalDays && !row.rowSpan)) && (
                                     <td rowSpan={row.rowSpan || 1} className={`border border-gray-600 p-2 font-bold align-middle ${row.isHoliday ? 'bg-yellow-600 text-black border-yellow-700' : 'bg-[#253252] text-white text-lg'}`}>
                                        {row.totalDays}
                                     </td>
                                )}

                                {/* BIL MINGGU (RowSpan) */}
                                {(row.rowSpan || (row.totalWeeks && !row.rowSpan)) && (
                                     <td rowSpan={row.rowSpan || 1} className={`border border-gray-600 p-2 font-bold align-middle ${row.isHoliday ? 'bg-yellow-600 text-black border-yellow-700' : 'bg-[#253252] text-[#C9B458] text-lg'}`}>
                                        {row.totalWeeks}
                                     </td>
                                )}

                                {/* AKSI */}
                                {isAdmin && (
                                    <td className={`border border-gray-600 p-2 ${row.isHoliday ? 'bg-yellow-600 border-yellow-700' : ''}`}>
                                        <button onClick={() => handleOpenEdit(row)} className={`text-xs ${row.isHoliday ? 'text-black hover:text-white' : 'text-gray-400 hover:text-white'}`}>✏️</button>
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
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">Kemaskini Minggu Persekolahan</h3>
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Minggu</label><input type="text" value={editingRow.week || ''} onChange={e => setEditingRow({...editingRow, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                            <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label><input type="text" value={editingRow.date || ''} onChange={e => setEditingRow({...editingRow, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                        </div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Catatan</label><textarea value={editingRow.notes || ''} onChange={e => setEditingRow({...editingRow, notes: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm h-24" /></div>
                        {(editingRow.totalDays || editingRow.totalWeeks) && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Bil Hari</label><input type="text" value={editingRow.totalDays || ''} onChange={e => setEditingRow({...editingRow, totalDays: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Bil Minggu</label><input type="text" value={editingRow.totalWeeks || ''} onChange={e => setEditingRow({...editingRow, totalWeeks: e.target.value})} className="w-full bg-[#0B132B] border border-gray-600 rounded p-2 text-white text-sm" /></div>
                            </div>
                        )}
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
}
