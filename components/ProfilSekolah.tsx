
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolProfile } from '../types';

// Minimalist Icon Components matching Sidebar style
const Icons = {
  User: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Chart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Award: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  School: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7v14m18-14v14M3 7l9-4 9 4M9 21V11h6v10" />
    </svg>
  ),
  IdCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="12" y2="16" />
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Eye: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Rocket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
};

export const ProfilSekolah: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, user, showToast, checkPermission } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<SchoolProfile>(schoolProfile);

  const canEdit = checkPermission('canUpdateProfil');

  const handleOpenEdit = () => {
    setFormData(schoolProfile);
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setIsEditModalOpen(false);
    showToast("Profil SMAAM berjaya dikemaskini.");
  };

  return (
    <div className="p-4 md:p-10 pb-24 fade-in w-full max-w-7xl mx-auto space-y-10 relative">
      
      {/* --- ADMIN ACTION BUTTON --- */}
      {canEdit && (
        <button 
          onClick={handleOpenEdit}
          className="fixed bottom-24 right-10 z-40 bg-[#2DD4BF] text-[#0B132B] px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 border-2 border-[#1C2541] text-sm uppercase tracking-wide"
        >
          <Icons.Edit /> EDIT PROFIL
        </button>
      )}

      {/* --- HERO HEADER SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] to-[#004e64] p-8 md:p-12 shadow-2xl border-l-4 border-[#2DD4BF]">
        
        {/* Background Image Overlay */}
        <div 
           className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-20 pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: 'url(https://i.postimg.cc/D0pqvnTy/SMAAM2024.png)' }}
        ></div>

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#2DD4BF] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#004e64] opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           {/* Logo Container */}
           <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0">
              {schoolProfile.logoUrl ? (
                <img src={schoolProfile.logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
              ) : (
                <div className="text-white text-5xl font-black">{schoolProfile.schoolName.charAt(0)}</div>
              )}
           </div>
           
           <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg leading-tight uppercase">
                 PROFIL <span className="text-[#2DD4BF]">SMAAM</span>
              </h1>
              <p className="text-gray-100 font-medium tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-md">
                 {schoolProfile.schoolName}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT PANEL: LEADERSHIP --- */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] rounded-2xl shadow-2xl border-l-4 border-[#2DD4BF] overflow-hidden group">
              <div className="h-24 bg-black/20 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2DD4BF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <span className="text-xs font-bold text-[#2DD4BF] tracking-[0.3em] uppercase opacity-80">KEPIMPINAN</span>
              </div>
              
              <div className="px-8 pb-8 -mt-12 relative z-10 flex flex-col items-center">
                 <div className="w-32 h-32 rounded-2xl border-4 border-[#2DD4BF] bg-[#0B132B] shadow-2xl mb-6 overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {schoolProfile.pengetuaImage ? (
                      <img src={schoolProfile.pengetuaImage} alt="Pengetua" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#2DD4BF]">
                        <Icons.User />
                      </div>
                    )}
                 </div>
                 
                 <div className="text-center">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                       {schoolProfile.pengetuaName}
                    </h2>
                    <p className="text-[#2DD4BF] font-bold text-[0.65rem] uppercase tracking-widest mb-6 px-4 py-1.5 bg-[#0B132B] rounded-full inline-block border border-[#2DD4BF]/30">
                       Pengetua Cemerlang
                    </p>
                 </div>

                 <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-6"></div>

                 <div className="relative w-full">
                    <span className="absolute -top-3 -left-1 text-4xl text-[#2DD4BF] opacity-20 font-serif leading-none">"</span>
                    <blockquote className="text-gray-100 italic text-sm leading-relaxed font-light text-center px-4">
                       {schoolProfile.pengetuaQuote}
                    </blockquote>
                    <span className="absolute -bottom-5 -right-1 text-4xl text-[#2DD4BF] opacity-20 font-serif leading-none">"</span>
                 </div>
                 
                 <div className="mt-10 flex flex-col items-center">
                    <div className="w-24 h-1 bg-[#2DD4BF]/30 rounded-full mb-2"></div>
                    <span className="text-[0.6rem] text-gray-400 uppercase font-bold tracking-widest italic">Signature Authenticated</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-5 rounded-2xl border-l-4 border-[#2DD4BF] shadow-xl group text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5 text-white"><Icons.Chart /></div>
                 <div className="text-[#2DD4BF] mb-2 group-hover:scale-110 transition-transform flex justify-center bg-[#0B132B]/50 p-3 rounded-full w-fit mx-auto border border-[#2DD4BF]/30">
                   <Icons.Chart />
                 </div>
                 <span className="text-2xl font-black text-white block leading-none">{schoolProfile.stats.lulusSpm}</span>
                 <span className="text-[0.6rem] text-[#2DD4BF] uppercase font-bold tracking-wider mt-1 block">Kadar Lulus SPM</span>
              </div>
              <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-5 rounded-2xl border-l-4 border-[#2DD4BF] shadow-xl group text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5 text-white"><Icons.Award /></div>
                 <div className="text-[#2DD4BF] mb-2 group-hover:scale-110 transition-transform flex justify-center bg-[#0B132B]/50 p-3 rounded-full w-fit mx-auto border border-[#2DD4BF]/30">
                   <Icons.Award />
                 </div>
                 <span className="text-2xl font-black text-white block leading-none">{schoolProfile.stats.gred}</span>
                 <span className="text-[0.6rem] text-[#2DD4BF] uppercase font-bold tracking-wider mt-1 block">Gred Sekolah</span>
              </div>
           </div>
        </div>

        {/* --- RIGHT PANEL: DETAILED INFO --- */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] rounded-2xl shadow-2xl border-l-4 border-[#2DD4BF] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                    <path d="M3 21h18M3 7v14m18-14v14M3 7l9-4 9 4M9 21V11h6v10" />
                 </svg>
              </div>

              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-8 bg-[#2DD4BF] rounded-full"></div>
                 <h2 className="text-xl font-bold text-white uppercase tracking-wider">Identiti Sekolah</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 {[
                    { label: 'Nama Rasmi', value: schoolProfile.schoolName, icon: <Icons.School /> },
                    { label: 'Kod Institusi', value: schoolProfile.schoolCode, icon: <Icons.IdCard /> },
                    { label: 'Alamat Surat Menyurat', value: schoolProfile.address, icon: <Icons.MapPin /> },
                    { label: 'Platform Digital', value: schoolProfile.email, icon: <Icons.Mail /> },
                    { label: 'Hubungan Rasmi', value: schoolProfile.phone, icon: <Icons.Phone /> },
                    { label: 'Lokasi Strategik', value: schoolProfile.location, icon: <Icons.Globe /> },
                 ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                       <div className="w-10 h-10 shrink-0 rounded-xl bg-black/20 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF] group-hover:border-[#2DD4BF] transition-colors">
                          {item.icon}
                       </div>
                       <div>
                          <p className="text-[0.6rem] text-[#2DD4BF] font-bold uppercase tracking-widest mb-1 opacity-80">{item.label}</p>
                          <p className="text-white text-sm font-semibold uppercase leading-snug">{item.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-8 rounded-2xl border-l-4 border-[#2DD4BF] shadow-xl group hover:border-[#2DD4BF] transition-all duration-500 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5 text-white"><Icons.Eye /></div>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#2DD4BF] font-bold tracking-widest uppercase text-sm">VISI</h3>
                    <div className="text-[#2DD4BF] group-hover:scale-125 transition-transform">
                      <Icons.Eye />
                    </div>
                 </div>
                 <p className="text-white text-lg font-bold leading-relaxed">{schoolProfile.visi}</p>
              </div>

              <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-8 rounded-2xl border-l-4 border-[#2DD4BF] shadow-xl group hover:border-[#2DD4BF] transition-all duration-500 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5 text-white"><Icons.Rocket /></div>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#2DD4BF] font-bold tracking-widest uppercase text-sm">MISI</h3>
                    <div className="text-[#2DD4BF] group-hover:scale-125 transition-transform">
                      <Icons.Rocket />
                    </div>
                 </div>
                 <p className="text-gray-100 text-sm font-medium leading-relaxed">{schoolProfile.misi}</p>
              </div>
           </div>

           <div className="bg-gradient-to-br from-[#0B132B] to-[#004e64] rounded-2xl p-8 border-l-4 border-[#2DD4BF] shadow-2xl relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <p className="text-xs text-[#2DD4BF] font-bold uppercase tracking-widest">Kekuatan Staf</p>
                       <span className="text-3xl font-black text-white">{schoolProfile.stats.guruTotal} <span className="text-xs font-bold text-gray-400 align-middle">GURU</span></span>
                    </div>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                       <div className="bg-[#2DD4BF] h-full" style={{ width: `${(schoolProfile.stats.guruTotal / 50) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[0.65rem] text-gray-300 font-bold uppercase tracking-wide">
                       <span>Lelaki: {schoolProfile.stats.guruLelaki}</span>
                       <span>Perempuan: {schoolProfile.stats.guruPerempuan}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <p className="text-xs text-[#2DD4BF] font-bold uppercase tracking-widest">Enrolmen Murid</p>
                       <span className="text-3xl font-black text-white">{schoolProfile.stats.muridTotal} <span className="text-xs font-bold text-gray-400 align-middle">MURID</span></span>
                    </div>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                       <div className="bg-[#006064] h-full" style={{ width: `${(schoolProfile.stats.muridTotal / 1000) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[0.65rem] text-gray-300 font-bold uppercase tracking-wide">
                       <span>Lelaki: {schoolProfile.stats.muridLelaki}</span>
                       <span>Perempuan: {schoolProfile.stats.muridPerempuan}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                 { label: 'Moto', value: schoolProfile.moto },
                 { label: 'Slogan', value: schoolProfile.slogan },
                 { label: 'Status', value: schoolProfile.status },
              ].map((tile, i) => (
                 <div key={i} className="bg-gradient-to-br from-[#0B132B] to-[#004e64] p-6 rounded-2xl border-l-4 border-[#2DD4BF] shadow-lg text-center flex flex-col justify-center h-full hover:-translate-y-1 transition-transform">
                    <p className="text-[0.6rem] text-[#2DD4BF] font-black uppercase tracking-[0.2em] mb-2">{tile.label}</p>
                    <p className="font-black uppercase tracking-tight text-sm leading-tight text-white">{tile.value}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md fade-in px-4 py-6 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-4xl p-8 rounded-3xl border-2 border-[#2DD4BF] shadow-2xl space-y-8 my-auto overflow-y-auto max-h-full scrollbar-thin">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
               <h2 className="text-xl font-black text-white uppercase tracking-wider">Editor Profil SMAAM</h2>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-xl">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              {/* Group 1: Leadership */}
              <div className="bg-[#0B132B] p-6 rounded-2xl border border-gray-700 space-y-4">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em]">Pengurusan Pengetua</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Nama Pengetua</label>
                       <input type="text" value={formData.pengetuaName} onChange={e => setFormData({...formData, pengetuaName: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">URL Gambar Pengetua</label>
                       <input type="text" value={formData.pengetuaImage} onChange={e => setFormData({...formData, pengetuaImage: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-[#2DD4BF] outline-none" placeholder="https://..." />
                    </div>
                 </div>
                 <div>
                    <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Kata-kata Alu-aluan / Piagam</label>
                    <textarea value={formData.pengetuaQuote} onChange={e => setFormData({...formData, pengetuaQuote: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white h-24 focus:border-[#2DD4BF] outline-none resize-none" />
                 </div>
              </div>

              {/* Group 2: Identity */}
              <div className="bg-[#0B132B] p-6 rounded-2xl border border-gray-700 space-y-4">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em]">Identiti Institusi</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Nama Sekolah</label>
                       <input type="text" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Kod Sekolah</label>
                       <input type="text" value={formData.schoolCode} onChange={e => setFormData({...formData, schoolCode: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Lokasi</label>
                       <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Alamat</label>
                       <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div>
                          <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Email</label>
                          <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                       </div>
                       <div>
                          <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Telefon</label>
                          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" />
                       </div>
                    </div>
                 </div>
                 <div>
                    <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">URL Logo Sekolah</label>
                    <input type="text" value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF]" placeholder="URL imej logo" />
                 </div>
              </div>

              {/* Group 3: Stats */}
              <div className="bg-[#0B132B] p-6 rounded-2xl border border-gray-700 space-y-4">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em]">Statistik & Falsafah</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Lulus SPM (%)</label>
                       <input type="text" value={formData.stats.lulusSpm} onChange={e => setFormData({...formData, stats: {...formData.stats, lulusSpm: e.target.value}})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Guru (Jum)</label>
                       <input type="number" value={formData.stats.guruTotal} onChange={e => setFormData({...formData, stats: {...formData.stats, guruTotal: parseInt(e.target.value)}})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Murid (Jum)</label>
                       <input type="number" value={formData.stats.muridTotal} onChange={e => setFormData({...formData, stats: {...formData.stats, muridTotal: parseInt(e.target.value)}})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-500 uppercase font-black tracking-wide mb-1 block">Status Gred</label>
                       <input type="text" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-gray-700 text-gray-300 rounded-xl font-bold hover:bg-gray-600 transition-all text-sm uppercase">Batal</button>
                 <button type="submit" className="flex-1 py-4 bg-[#2DD4BF] text-[#0B132B] rounded-xl font-black hover:bg-[#20b2aa] shadow-xl shadow-teal-900/20 transition-all text-sm uppercase">SIMPAN DATA PROFIL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="pt-10 border-t border-gray-800 flex flex-col items-center gap-4">
         <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gray-800"></div>
            <span className="text-[0.6rem] text-gray-600 font-bold uppercase tracking-[0.5em]">Teras Kecemerlangan</span>
            <div className="h-px w-12 bg-gray-800"></div>
         </div>
         <p className="text-[0.65rem] text-gray-500 italic max-w-xl text-center">
            Sistem Pengurusan Digital SMAAM dibangunkan untuk memperkasa tadbir urus sekolah kearah pendigitalan pendidikan yang mampan dan dinamik.
         </p>
      </div>
    </div>
  );
};
