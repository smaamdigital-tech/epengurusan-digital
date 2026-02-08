
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement, Program } from '../types';

// Minimalist Corporate Icon Components
const Icons = {
  Teachers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Students: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a3 3 0 0 1 0 6" /><path d="M10 8h4l4 4-4 4h-4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" /><path d="M6 15h0" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};

export const Dashboard: React.FC = () => {
  const { 
    user, permissions, announcements, programs, siteConfig, updateSiteConfig, 
    addAnnouncement, updateAnnouncement, deleteAnnouncement, 
    addProgram, updateProgram, deleteProgram,
    checkPermission, showToast 
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempWelcome, setTempWelcome] = useState(siteConfig.welcomeMessage);
  
  // Announcement Modal State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState<Partial<Announcement>>({ title: '', date: '', summary: '' });
  
  // Program Modal State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programForm, setProgramForm] = useState<Partial<Program>>({ 
      title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' 
  });

  const canEditWelcome = user?.role === 'adminsistem'; 
  const canUpdatePengumuman = checkPermission('canUpdatePengumuman');
  const canUpdateProgram = checkPermission('canUpdateProgram');

  const saveEdit = () => {
    updateSiteConfig({ welcomeMessage: tempWelcome });
    setIsEditing(false);
  };

  const handleOpenAnnounceModal = (ann?: Announcement) => {
    setAnnounceForm(ann || { title: '', date: '', summary: '' });
    setShowAnnounceModal(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...announceForm, id: announceForm.id || Date.now(), views: announceForm.views || 0, likes: announceForm.likes || 0 } as Announcement;
    announceForm.id ? updateAnnouncement(payload) : addAnnouncement(payload);
    showToast(announceForm.id ? "Pengumuman dikemaskini." : "Pengumuman ditambah.");
    setShowAnnounceModal(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
      if(window.confirm("Padam pengumuman ini?")) { deleteAnnouncement(id); showToast("Pengumuman dipadam."); }
  };

  const handleOpenProgramModal = (prog?: Program) => {
      setProgramForm(prog || { title: '', date: '', category: 'Lain-lain', description: '', time: '', location: '', image1: '', image2: '' });
      setShowProgramModal(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...programForm, id: programForm.id || Date.now(), category: programForm.category || 'Lain-lain' } as Program;
    programForm.id ? updateProgram(payload) : addProgram(payload);
    showToast(programForm.id ? "Program dikemaskini." : "Program ditambah.");
    setShowProgramModal(false);
  };

  const handleDeleteProgram = (id: number) => {
      if(window.confirm("Padam program ini?")) { deleteProgram(id); showToast("Program dipadam."); }
  };

  const handleDateChange = (value: string, type: 'announce' | 'program') => {
      const parts = value.split('-');
      const formatted = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
      type === 'announce' ? setAnnounceForm({...announceForm, date: formatted}) : setProgramForm({...programForm, date: formatted});
  };

  const formatDateForInput = (dateStr?: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 fade-in pb-24 relative font-sans">
      
      {/* Sticky Section Header */}
      <div className="sticky top-0 z-20 bg-[#A9CCE3]/95 backdrop-blur-md pt-4 pb-4 border-b border-[#2DD4BF] flex flex-col md:flex-row justify-between items-end gap-2 -mx-4 md:-mx-8 px-4 md:px-8 mb-6 shadow-sm">
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={tempWelcome} 
                onChange={(e) => setTempWelcome(e.target.value)}
                className="bg-white border border-[#2DD4BF] text-[#0B132B] px-3 py-1.5 rounded font-bold shadow-inner w-full md:w-96"
              />
              <button onClick={saveEdit} className="text-white bg-[#006D77] px-4 py-1.5 rounded text-sm font-bold shadow-md">Simpan</button>
            </div>
          ) : (
            // Removed 'uppercase' class to support 'ePENGURUSAN'
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B132B] tracking-tight drop-shadow-sm leading-tight">
              {siteConfig.welcomeMessage}
              {canEditWelcome && (
                <button onClick={() => setIsEditing(true)} className="ml-3 text-sm text-[#006064] hover:text-[#0B132B] font-medium underline">
                  Edit
                </button>
              )}
            </h2>
          )}
          <p className="text-[#1C2541] font-semibold opacity-80 mt-1 text-sm tracking-wide">Papan Pemuka Maklumat Digital SMAAM 2026</p>
        </div>
        <div className="text-[#006064] text-xs md:text-sm font-black uppercase tracking-widest border-b-4 border-[#2DD4BF] pb-1">
          SESI PERSEKOLAHAN 2026
        </div>
      </div>

      {/* STATS BOXES - Harmonized Gradient Blue-Turquoise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jumlah Guru', value: '45', icon: <Icons.Teachers />, sub: 'Aktif: 42' },
          { label: 'Jumlah Murid', value: '850', icon: <Icons.Students />, sub: 'L: 420 | P: 430' },
          { label: 'Program Aktif', value: '12', icon: <Icons.Target />, sub: 'Bulan ini' },
          { label: 'Notis Baru', value: '8', icon: <Icons.Megaphone />, sub: 'Belum dibaca' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-xl shadow-xl border-l-4 border-[#2DD4BF] hover:translate-y-[-5px] transition-transform duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
               {stat.icon}
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[#2DD4BF] text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-4xl font-extrabold text-white group-hover:text-[#2DD4BF] transition-colors">{stat.value}</h3>
              </div>
              <div className="bg-[#0B132B]/50 p-3 rounded-xl border border-[#2DD4BF]/30 text-[#2DD4BF] shadow-inner group-hover:scale-110 group-hover:bg-[#2DD4BF] group-hover:text-[#0B132B] transition-all">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-300 mt-4 font-semibold uppercase tracking-wide">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PENGUMUMAN - Dark Navy Background with Turquoise Highlights */}
        {permissions.pengumuman && (
          <div className="lg:col-span-2 bg-[#0B132B] rounded-xl shadow-2xl overflow-hidden border border-[#2DD4BF]/30 flex flex-col">
            <div className="p-5 border-b border-[#2DD4BF]/30 flex justify-between items-center bg-[#003840]/30">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#2DD4BF]"><Icons.Megaphone /></span> Pengumuman Terkini
              </h3>
              {canUpdatePengumuman && (
                <button 
                  onClick={() => handleOpenAnnounceModal()}
                  className="text-xs bg-[#006064] text-white px-4 py-2 rounded-full font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] transition-colors uppercase tracking-wider flex items-center gap-2 shadow-lg border border-[#2DD4BF]/50"
                >
                  <Icons.Plus /> Tambah
                </button>
              )}
            </div>
            <div className="p-6 space-y-4 flex-1">
              {announcements.map((item) => (
                <div key={item.id} className="bg-[#162e4a] p-5 rounded-xl border border-[#2DD4BF]/10 hover:border-[#2DD4BF]/50 transition-all group shadow-lg relative">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                    <h4 className="font-bold text-white text-lg group-hover:text-[#2DD4BF] transition-colors leading-tight">{item.title}</h4>
                    <span className="text-xs bg-[#004e64] text-[#2DD4BF] border border-[#2DD4BF]/30 px-2 py-1 rounded font-bold self-start">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed">{item.summary}</p>
                  
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span className="flex items-center gap-1 hover:text-[#2DD4BF] cursor-pointer transition-colors">
                          👁️ {item.views} Paparan
                        </span>
                        <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">
                          ❤️ {item.likes} Suka
                        </span>
                      </div>
                      
                      {canUpdatePengumuman && (
                          <div className="flex gap-2">
                             <button onClick={() => handleOpenAnnounceModal(item)} className="text-blue-300 hover:text-white text-sm bg-[#0B132B] p-1.5 rounded border border-blue-900" title="Edit">✏️</button>
                             <button onClick={() => handleDeleteAnnouncement(item.id)} className="text-red-400 hover:text-white text-sm bg-[#0B132B] p-1.5 rounded border border-red-900" title="Hapus">🗑️</button>
                          </div>
                      )}
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-gray-500 text-center text-sm py-8 italic">Tiada pengumuman.</p>}
            </div>
          </div>
        )}

        {/* PROGRAM - Dark Navy with Turquoise Accents */}
        {permissions.program && (
          <div className="bg-[#0B132B] rounded-xl shadow-2xl overflow-hidden border border-[#2DD4BF]/30 flex flex-col">
             <div className="p-5 border-b border-[#2DD4BF]/30 flex justify-between items-center bg-[#003840]/30">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#2DD4BF]"><Icons.Target /></span> Takwim Program
              </h3>
              {canUpdateProgram && (
                <button 
                  onClick={() => handleOpenProgramModal()}
                  className="text-xs border border-[#2DD4BF] text-[#2DD4BF] p-2 rounded-lg hover:bg-[#2DD4BF] hover:text-[#0B132B] transition-colors font-bold"
                >
                  <Icons.Plus />
                </button>
              )}
            </div>
            <div className="p-6 space-y-6 flex-1">
              {programs.slice(0, 4).map((prog) => (
                <div key={prog.id} className="relative pl-6 border-l-2 border-[#2DD4BF]/20 hover:border-[#2DD4BF] transition-colors group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0B132B] border-2 border-[#2DD4BF] group-hover:scale-110 transition-transform"></div>
                  <span className="text-xs text-[#2DD4BF] font-bold mb-1 block uppercase tracking-wider">{prog.date}</span>
                  <div className="flex justify-between items-start">
                     <h4 className="text-sm font-bold text-white uppercase leading-tight">{prog.title}</h4>
                     {canUpdateProgram && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenProgramModal(prog)} className="text-xs text-blue-400 hover:text-white">✏️</button>
                            <button onClick={() => handleDeleteProgram(prog.id)} className="text-xs text-red-400 hover:text-white">🗑️</button>
                        </div>
                     )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic leading-normal">{prog.description}</p>
                  <span className="inline-block mt-3 text-[0.65rem] font-bold bg-[#003840] px-3 py-1 rounded-full text-[#2DD4BF] border border-[#2DD4BF]/30 uppercase tracking-wider">
                    {prog.category}
                  </span>
                </div>
              ))}
              {programs.length === 0 && <p className="text-gray-500 text-center text-sm py-8 italic">Tiada program.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Reusable Modal Structure with consistent typography and colors */}
      {(showAnnounceModal || showProgramModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-2xl border-2 border-[#2DD4BF] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 uppercase tracking-wide">
                     {showAnnounceModal 
                        ? (announceForm.id ? 'Kemaskini Pengumuman' : 'Tambah Pengumuman') 
                        : (programForm.id ? 'Kemaskini Program' : 'Tambah Program')
                     }
                 </h3>
                 
                 <form onSubmit={showAnnounceModal ? handleSaveAnnouncement : handleSaveProgram} className="space-y-5">
                     {showAnnounceModal ? (
                       <>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Tajuk</label>
                             <input required type="text" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#2DD4BF] outline-none transition-all text-sm" />
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Tarikh</label>
                             <input required type="date" value={formatDateForInput(announceForm.date)} onChange={e => handleDateChange(e.target.value, 'announce')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#2DD4BF] outline-none text-sm" />
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold tracking-wider">Kandungan Ringkas</label>
                             <textarea required value={announceForm.summary} onChange={e => setAnnounceForm({...announceForm, summary: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-3 text-white h-32 focus:border-[#2DD4BF] outline-none resize-none text-sm leading-relaxed" />
                         </div>
                       </>
                     ) : (
                       <>
                         {/* Program Fields */}
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Nama Program</label>
                             <input required type="text" value={programForm.title} onChange={e => setProgramForm({...programForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2DD4BF] outline-none text-sm" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Tarikh</label><input required type="date" value={formatDateForInput(programForm.date)} onChange={e => handleDateChange(e.target.value, 'program')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                             <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Masa</label><input type="text" value={programForm.time} onChange={e => setProgramForm({...programForm, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                         </div>
                         <div><label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Tempat</label><input type="text" value={programForm.location} onChange={e => setProgramForm({...programForm, location: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]" /></div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Kategori</label>
                             <select required value={programForm.category} onChange={e => setProgramForm({...programForm, category: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#2DD4BF]">
                                 <option value="Kurikulum">Kurikulum</option><option value="HEM">HEM</option><option value="Kokurikulum">Kokurikulum</option><option value="Sukan">Sukan</option><option value="Lain-lain">Lain-lain</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-xs text-[#2DD4BF] block mb-1 uppercase font-bold">Laporan</label>
                             <textarea required value={programForm.description} onChange={e => setProgramForm({...programForm, description: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white h-24 text-sm focus:border-[#2DD4BF] outline-none" />
                         </div>
                       </>
                     )}
                     
                     <div className="flex gap-3 pt-4">
                         <button type="button" onClick={() => { setShowAnnounceModal(false); setShowProgramModal(false); }} className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 font-bold transition-all text-sm uppercase tracking-wide">Batal</button>
                         <button type="submit" className="flex-1 py-3 bg-[#006064] text-white rounded-xl font-bold hover:bg-[#2DD4BF] hover:text-[#0B132B] shadow-lg transition-all text-sm uppercase tracking-wide">SIMPAN</button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};
