import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const TEACHER_LIST = [
    "ZULKEFFLE BIN MUHAMMAD", "NORATIKAH ABD. KADIR", "SHAHARER BIN HJ HUSAIN", "ZULKIFLI BIN MD ASPAN",
    "ROSMAWATI @ ROHAYATI BINTI HUSSIN", "ZAHRAH KHAIRIAH NASUTION BINTI SALEH", "MAZUIN BINTI MAT",
    "NOORAIND BINTI ALI", "SAEMAH BINTI SUPANDI", "NOR AZEAN BINTI ISMAIL", "AHMAD FIKRUDDIN BIN AHMAD RAZA'I",
    "MOHAMMAD FIRROS BIN ROSOOL GANI", "LIYANA BINTI ISKANDAR", "MOHAMAD NASREEN HAKIM BIN CHE MOHAMED",
    "NIK NOORIZATI BINTI AB KAHAR", "NORASHIDAH BINTI A WAHAB", "NOR AIN BINTI MOHAMED JORI",
    "NURUL IZZATI BINTI ROSLIN", "NURUL SYAFIQAH BINTI HUSIN", "SITI NURUL LIZA BINTI SIDIN",
    "MUHAMMAD HAFIZ BIN JALIL", "NUURUL AMIRA BINTI RAZAK", "NOORLELA BINTI ZAINUDIN",
    "ANNUR AYUNI BINTI MOHAMED", "SALMAN BIN A RAHMAN", "MOHD NUR BIN AHMAD", "NOR HIDAYAH BINTI MAHADUN",
    "MASYITAH BINTI RAZALI", "MOHAMAD SUKRI BIN ALI", "MOHD NOR BIN SALIKIN", "NORLIYANA BINTI MHD. AMIN",
    "SITI AMINAH BINTI MOHAMED", "SYAHIDATUN NAJIHAH BINTI AZIZ", "ZARITH NAJIHA BINTI JAMAL"
];

const getGroupColor = (groupName: string) => {
    const match = groupName.match(/\d+/);
    const num = match ? match[0] : '0';
    switch (num) {
        case '1': return 'bg-pink-600 border-pink-400 text-white shadow-pink-900/30';
        case '2': return 'bg-blue-600 border-blue-400 text-white shadow-blue-900/30';
        case '3': return 'bg-green-600 border-green-400 text-white shadow-green-900/30';
        case '4': return 'bg-yellow-600 border-yellow-400 text-white shadow-yellow-900/30';
        case '5': return 'bg-purple-600 border-purple-400 text-white shadow-purple-900/30';
        case '6': return 'bg-orange-600 border-orange-400 text-white shadow-orange-900/30';
        default: return 'bg-gray-600 border-gray-400 text-white';
    }
};

// Helper for Civic Colors
const getCivicColor = (civic: string) => {
    if (!civic) return '';
    const val = civic.toUpperCase();
    if (val.includes('KASIH')) return 'text-rose-400 border-rose-400/50 shadow-[0_0_5px_rgba(251,113,133,0.3)]';
    if (val.includes('HORMAT')) return 'text-sky-400 border-sky-400/50 shadow-[0_0_5px_rgba(56,189,248,0.3)]';
    if (val.includes('BERTANGGUNG')) return 'text-emerald-400 border-emerald-400/50 shadow-[0_0_5px_rgba(52,211,153,0.3)]';
    if (val.includes('KEGEMBIRAAN')) return 'text-amber-400 border-amber-400/50 shadow-[0_0_5px_rgba(251,191,36,0.3)]';
    return 'text-[#C9B458] border-[#C9B458]/30';
};

// Helper for Sumur Colors
const getSumurColor = (sumur: string) => {
    if (!sumur) return '';
    const val = sumur.toUpperCase();
    if (val.includes('MUTADAYYIN')) return 'text-violet-400 border-violet-400/50 shadow-[0_0_5px_rgba(167,139,250,0.3)]';
    if (val.includes('BUDI')) return 'text-teal-400 border-teal-400/50 shadow-[0_0_5px_rgba(45,212,191,0.3)]';
    if (val.includes('JATI')) return 'text-indigo-400 border-indigo-400/50 shadow-[0_0_5px_rgba(129,140,248,0.3)]';
    if (val.includes('PENAMPILAN')) return 'text-fuchsia-400 border-fuchsia-400/50 shadow-[0_0_5px_rgba(232,121,249,0.3)]';
    return 'text-gray-400 border-gray-400/30';
};

export const JadualBerucap: React.FC = () => {
  const { checkPermission, showToast, speechSchedule, updateSpeechSchedule, teacherGroups, updateTeacherGroups } = useApp();
  const canEdit = checkPermission('canUpdateJadualBerucap');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'speech' | 'addGroup' | 'editGroup' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // --- LAZY INITIALIZATION FOR TITLES ---
  const [sectionTitles, setSectionTitles] = useState(() => {
      try {
          const saved = localStorage.getItem('smaam_berucap_titles');
          return saved ? JSON.parse(saved) : {
            table: 'Jadual Bertugas & Berucap',
            list: 'Senarai Kumpulan',
          };
      } catch (e) {
          return {
            table: 'Jadual Bertugas & Berucap',
            list: 'Senarai Kumpulan',
          };
      }
  });

  const handleEditTitle = (key: keyof typeof sectionTitles) => {
    const newVal = prompt("Ubah Tajuk:", sectionTitles[key]);
    if (newVal && newVal.trim() !== "") {
      const updated = { ...sectionTitles, [key]: newVal };
      setSectionTitles(updated);
      localStorage.setItem('smaam_berucap_titles', JSON.stringify(updated));
      showToast("Tajuk dikemaskini.");
    }
  };

  const EditableHeader = ({ tKey, className }: { tKey: keyof typeof sectionTitles, className: string }) => (
    <div className="flex items-center gap-2 group justify-center">
      <h3 className={className}>{sectionTitles[tKey]}</h3>
      {canEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleEditTitle(tKey); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-[#C9B458] text-xs"
        >
          ✏️
        </button>
      )}
    </div>
  );

  const openEditModal = (mType: any, item: any) => {
    setModalType(mType);
    setEditingItem(item);
    if (item) {
        if (mType === 'editGroup') {
            setFormData({ name: item.name, membersStr: item.members.join('\n') });
        } else {
            setFormData({ ...item });
        }
    } else {
        setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'speech') {
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            week: formData.week,
            date: formData.date,
            group: formData.group,
            speaker: formData.speaker,
            topic: formData.topic || '',
            civic: formData.civic || '',
            sumur: formData.sumur || ''
        };
        const newSchedule = editingItem ? speechSchedule.map(s => s.id === payload.id ? payload : s) : [...speechSchedule, payload];
        updateSpeechSchedule(newSchedule);
        showToast("Jadual Berucap disimpan.");
    } else if (modalType === 'addGroup' || modalType === 'editGroup') {
        const members = formData.membersStr ? formData.membersStr.split('\n').filter((m: string) => m.trim() !== '') : [];
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            name: formData.name, 
            members: members
        };
        const newGroups = editingItem ? teacherGroups.map(g => g.id === payload.id ? payload : g) : [...teacherGroups, payload];
        updateTeacherGroups(newGroups);
        showToast("Kumpulan disimpan.");
    }
    setIsModalOpen(false);
  };

  const handleDeleteSpeech = (id: number) => {
      if(confirm("Padam slot ini?")) {
          updateSpeechSchedule(speechSchedule.filter(s => s.id !== id));
          showToast("Slot dipadam.");
      }
  };

  const handleDeleteGroup = (id: number) => {
      if(confirm("Padam kumpulan ini?")) {
          updateTeacherGroups(teacherGroups.filter(g => g.id !== id));
          showToast("Kumpulan dipadam.");
      }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center gap-3">
          Jadual Guru Berucap
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">Jadual Guru Berucap dan Kumpulan Bertugas Mingguan.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT: JADUAL (Table) */}
        <div className="xl:col-span-8 bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-600">
            <div className="p-4 border-b border-gray-600 bg-[#0B132B] relative flex justify-between items-center min-h-[60px]">
                <div className="flex-1 text-center">
                    <EditableHeader tKey="table" className="text-xl font-bold text-white" />
                </div>
                {canEdit && (
                    <button onClick={() => openEditModal('speech', null)} className="absolute right-4 bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded text-xs font-bold hover:bg-yellow-400">+ Tambah</button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-900 text-[#C9B458] text-xs font-extrabold uppercase tracking-wide border-b border-gray-700 font-inter">
                            <th className="px-2 py-3 text-center w-12 border-r border-gray-700">Minggu</th>
                            <th className="px-2 py-3 w-24 text-center border-r border-gray-700">Tarikh</th>
                            <th className="px-2 py-3 w-24 text-center border-r border-gray-700">KUMPULAN BERTUGAS</th>
                            <th className="px-2 py-3 text-center border-r border-gray-700">Guru Berucap</th>
                            <th className="px-2 py-3 text-center border-r border-gray-700">Tajuk / Tema</th>
                            {canEdit && <th className="px-2 py-3 text-center w-16">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-xs font-inter leading-relaxed">
                        {speechSchedule.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-700 transition-colors group">
                                <td className="px-2 py-3 text-center font-bold text-gray-200 bg-gray-800/40 border-r border-gray-700">{item.week}</td>
                                <td className="px-2 py-3 text-gray-300 font-mono text-center whitespace-nowrap bg-gray-800/40 border-r border-gray-700">{item.date}</td>
                                <td className="px-2 py-3 text-center bg-gray-800/40 border-r border-gray-700">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border shadow-sm ${getGroupColor(item.group)}`}>
                                        {item.group.replace('KUMPULAN ', 'K')}
                                    </span>
                                </td>
                                <td className="px-2 py-3 text-center font-semibold text-white whitespace-nowrap bg-gray-800/40 border-r border-gray-700">{item.speaker}</td>
                                <td className="px-2 py-3 text-center text-gray-300 bg-gray-800/40 border-r border-gray-700">
                                    <div className="flex flex-col gap-1.5 items-center">
                                        <span className="text-white font-medium">{item.topic || '-'}</span>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {item.civic && (
                                                <span className={`text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full w-fit font-bold backdrop-blur-sm ${getCivicColor(item.civic)}`}>
                                                    {item.civic}
                                                </span>
                                            )}
                                            {item.sumur && (
                                                <span className={`text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full w-fit font-bold backdrop-blur-sm ${getSumurColor(item.sumur)}`}>
                                                    {item.sumur}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {canEdit && (
                                    <td className="px-2 py-3 text-center bg-gray-800/40">
                                        <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal('speech', item)} className="text-blue-400 hover:text-white" title="Edit">✏️</button>
                                            <button onClick={() => handleDeleteSpeech(item.id)} className="text-red-400 hover:text-white" title="Hapus">🗑️</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* RIGHT: KUMPULAN BERTUGAS (List) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-[#0B132B] p-4 rounded-xl border-l-4 border-[#C9B458] shadow-lg flex justify-between items-center">
                <div>
                    <EditableHeader tKey="list" className="text-lg font-bold text-white uppercase tracking-wide text-left" />
                    <p className="text-xs text-gray-400">Anggota kumpulan bertugas mingguan.</p>
                </div>
                {canEdit && (
                    <button onClick={() => openEditModal('addGroup', null)} className="bg-[#C9B458] text-[#0B132B] px-2 py-1 rounded text-[10px] font-bold hover:bg-yellow-400">+</button>
                )}
            </div>
            
            <div className="space-y-4">
                {teacherGroups.map((group) => (
                    <div key={group.id} className={`bg-[#1C2541] rounded-xl border shadow-md hover:border-white transition-all group overflow-hidden ${getGroupColor(group.name).replace('text-white', '').replace('bg-', 'border-').split(' ')[1]}`}>
                        <div className={`px-4 py-2 border-b border-gray-700 flex justify-between items-center ${getGroupColor(group.name).split(' ')[0]} bg-opacity-20`}>
                            <h4 className={`font-bold text-sm ${getGroupColor(group.name).split(' ')[2]}`}>{group.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#0B132B] text-gray-400 px-2 py-0.5 rounded-full">{group.members.length} Ahli</span>
                                {canEdit && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal('editGroup', group)} className="text-xs text-blue-300 hover:text-white">✏️</button>
                                        <button onClick={() => handleDeleteGroup(group.id)} className="text-xs text-red-300 hover:text-white">🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul className="p-4 space-y-2">
                            {group.members.map((member, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                                    <span className={`w-1.5 h-1.5 rounded-full ${getGroupColor(group.name).split(' ')[0]}`}></span>
                                    {member}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">{editingItem ? 'Kemaskini' : 'Tambah'} {modalType === 'speech' ? 'Jadual' : 'Kumpulan'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
               {modalType === 'speech' && (
                 <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Minggu</label><input type="text" value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tarikh</label><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Kumpulan</label><select value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Kumpulan</option>{teacherGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Guru Berucap</label><select value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm"><option value="">Pilih Guru</option>{TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Tajuk</label><input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Sivik</label><input type="text" value={formData.civic} onChange={e => setFormData({...formData, civic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                        <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Sumur</label><input type="text" value={formData.sumur} onChange={e => setFormData({...formData, sumur: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                    </div>
                 </div>
               )}
               {(modalType === 'editGroup' || modalType === 'addGroup') && (
                   <>
                      {modalType === 'addGroup' && (
                          <div>
                              <label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Kumpulan</label>
                              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" />
                          </div>
                      )}
                      <div>
                          <label className="text-[10px] text-[#C9B458] font-bold uppercase">Senarai Nama (Satu nama per baris)</label>
                          <textarea 
                             value={formData.membersStr} 
                             onChange={e => setFormData({...formData, membersStr: e.target.value})} 
                             className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm h-48"
                          />
                      </div>
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