
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
  const { user, permissions, announcements, programs, siteConfig, updateSiteConfig, addAnnouncement, addProgram } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempWelcome, setTempWelcome] = useState(siteConfig.welcomeMessage);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  const [announceForm, setAnnounceForm] = useState({ title: '', date: '', summary: '' });
  const [programForm, setProgramForm] = useState({ 
      title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' 
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  const saveEdit = () => {
    updateSiteConfig({ welcomeMessage: tempWelcome });
    setIsEditing(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      id: Date.now(),
      title: announceForm.title,
      date: announceForm.date,
      summary: announceForm.summary,
      views: 0,
      likes: 0
    });
    setShowAnnounceModal(false);
    setAnnounceForm({ title: '', date: '', summary: '' });
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    addProgram({
      id: Date.now(),
      title: programForm.title,
      date: programForm.date,
      time: programForm.time,
      location: programForm.location,
      category: programForm.category,
      description: programForm.description,
      image1: programForm.image1,
      image2: programForm.image2
    });
    setShowProgramModal(false);
    setProgramForm({ title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' });
  };

  const handleDateChange = (value: string, type: 'announce' | 'program') => {
      const parts = value.split('-');
      const formatted = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
      if (type === 'announce') setAnnounceForm({...announceForm, date: formatted});
      else setProgramForm({...programForm, date: formatted});
  };

  return (
    <div className="p-8 space-y-8 fade-in pb-20 relative">
      <div className="flex justify-between items-end border-b border-gray-400 pb-4">
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={tempWelcome} 
                onChange={(e) => setTempWelcome(e.target.value)}
                className="bg-white border border-[#3A506B] text-black px-2 py-1 rounded font-bold"
              />
              <button onClick={saveEdit} className="text-blue-700 text-sm font-bold">Simpan</button>
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-black font-montserrat uppercase tracking-tight">
              {siteConfig.welcomeMessage}
              {user?.role === 'adminsistem' && (
                <button onClick={() => setIsEditing(true)} className="ml-3 text-xs text-gray-600 hover:text-black">
                  (Edit)
                </button>
              )}
            </h2>
          )}
          <p className="text-black font-semibold opacity-70 mt-1">Papan Pemuka Maklumat Digital SMAAM 2026</p>
        </div>
        <div className="text-black text-sm font-black uppercase tracking-widest border-b-2 border-[#C9B458]">
          SESI PERSEKOLAHAN 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jumlah Guru', value: '45', icon: <Icons.Teachers />, sub: 'Aktif: 42' },
          { label: 'Jumlah Murid', value: '850', icon: <Icons.Students />, sub: 'L: 420 | P: 430' },
          { label: 'Program Aktif', value: '12', icon: <Icons.Target />, sub: 'Bulan ini' },
          { label: 'Notis Baru', value: '8', icon: <Icons.Megaphone />, sub: 'Belum dibaca' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#1C2541] p-6 rounded-xl shadow-xl border-l-4 border-[#C9B458] hover:translate-y-[-5px] transition-transform duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white group-hover:text-[#C9B458] transition-colors">{stat.value}</h3>
              </div>
              <div className="bg-[#0B132B] p-3 rounded-xl border border-gray-700 text-[#C9B458] shadow-inner group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-tighter">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {permissions.pengumuman && (
          <div className="lg:col-span-2 bg-[#1C2541] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#0B132B]/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#C9B458]"><Icons.Megaphone /></span> Pengumuman Terkini
              </h3>
              {isAdmin && (
                <button 
                  onClick={() => setShowAnnounceModal(true)}
                  className="text-xs bg-[#C9B458] text-[#0B132B] px-4 py-1.5 rounded-full font-black hover:bg-yellow-400 transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                  <Icons.Plus /> Tambah
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="bg-[#0B132B] p-5 rounded-xl border border-gray-700 hover:border-[#C9B458] transition-all group shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-lg group-hover:text-[#C9B458] transition-colors">{item.title}</h4>
                    <span className="text-[10px] bg-[#3A506B] text-white px-2 py-1 rounded font-black">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-1 hover:text-[#C9B458] cursor-pointer transition-colors">
                      👁️ {item.views} Paparan
                    </span>
                    <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">
                      ❤️ {item.likes} Suka
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {permissions.program && (
          <div className="bg-[#1C2541] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
             <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#0B132B]/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-3 uppercase tracking-wide">
                <span className="text-[#C9B458]"><Icons.Target /></span> Takwim Program
              </h3>
              {isAdmin && (
                <button 
                  onClick={() => setShowProgramModal(true)}
                  className="text-xs border border-[#C9B458] text-[#C9B458] p-1.5 rounded-lg hover:bg-[#C9B458] hover:text-[#0B132B] transition-colors font-black"
                >
                  <Icons.Plus />
                </button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {programs.slice(0, 4).map((prog, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-[#3A506B] hover:border-[#C9B458] transition-colors group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1C2541] border-2 border-[#C9B458] group-hover:scale-110 transition-transform"></div>
                  <span className="text-[10px] text-[#C9B458] font-black mb-1 block uppercase tracking-widest">{prog.date}</span>
                  <h4 className="text-sm font-bold text-white uppercase leading-tight">{prog.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 italic">{prog.description}</p>
                  <span className="inline-block mt-3 text-[9px] font-black bg-[#0B132B] px-3 py-1 rounded-full text-[#C9B458] border border-gray-800 uppercase tracking-tighter">
                    {prog.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAnnounceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-2xl border border-[#C9B458] shadow-2xl">
                 <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-2 uppercase tracking-wide">Tambah Pengumuman</h3>
                 <form onSubmit={handleAddAnnouncement} className="space-y-4">
                     <div>
                         <label className="text-[10px] text-[#C9B458] block mb-1 uppercase font-black tracking-widest">Tajuk Pengumuman</label>
                         <input required type="text" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#C9B458] outline-none transition-all" />
                     </div>
                     <div>
                         <label className="text-[10px] text-[#C9B458] block mb-1 uppercase font-black tracking-widest">Tarikh</label>
                         <input required type="date" onChange={e => handleDateChange(e.target.value, 'announce')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#C9B458] outline-none" />
                     </div>
                     <div>
                         <label className="text-[10px] text-[#C9B458] block mb-1 uppercase font-black tracking-widest">Kandungan Ringkas</label>
                         <textarea required value={announceForm.summary} onChange={e => setAnnounceForm({...announceForm, summary: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white h-24 focus:border-[#C9B458] outline-none resize-none" />
                     </div>
                     <div className="flex gap-3 pt-4">
                         <button type="button" onClick={() => setShowAnnounceModal(false)} className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 font-bold transition-all">Batal</button>
                         <button type="submit" className="flex-1 py-3 bg-[#C9B458] text-[#0B132B] rounded-xl font-black hover:bg-yellow-400 shadow-lg shadow-yellow-900/20 transition-all">SIMPAN</button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};
