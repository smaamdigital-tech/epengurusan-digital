import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SchoolProfile } from '../types';

// Minimalist Icon Components matching Sidebar style
const Icons = {
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Chart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Award: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  School: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21h18M3 7v14m18-14v14M3 7l9-4 9 4M9 21V11h6v10" />
    </svg>
  ),
  IdCard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="12" y2="16" />
    </svg>
  ),
  MapPin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Eye: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Rocket: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  PiagamIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
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
    // Updated Background: Softer Navy & Teal Gradient
    <div className="w-full relative fade-in bg-gradient-to-br from-[#1e293b] via-[#0f4c75] to-[#1b4332] min-h-screen text-white overflow-hidden">
      
      {/* --- Background Image Overlay (Transparent ~12%) --- */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url('https://i.postimg.cc/D0pqvnTy/SMAAM2024.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      ></div>

      {/* --- Ambient Background Glows (Slightly Brighter) --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2DD4BF] opacity-10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#006064] opacity-15 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16 pb-32">

        {/* --- ADMIN ACTION BUTTON --- */}
        {canEdit && (
          <button 
            onClick={handleOpenEdit}
            className="fixed bottom-10 right-10 z-50 bg-gradient-to-r from-[#2DD4BF] to-[#006064] text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)] hover:scale-105 transition-all flex items-center gap-2 border border-white/20 backdrop-blur-md text-sm uppercase tracking-wide group"
          >
            <Icons.Edit /> <span className="group-hover:tracking-widest transition-all">Edit Profil</span>
          </button>
        )}

        {/* --- HERO SECTION: FLUID HEADER --- */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-b border-white/20 pb-8">
           <div className="flex items-center gap-6">
              {/* Logo - Floating Effect with Glow */}
              <div className="relative group">
                 <div className="absolute inset-0 bg-[#2DD4BF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
                 <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl">
                    {schoolProfile.logoUrl ? (
                      <img src={schoolProfile.logoUrl} alt="Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                    ) : (
                      <div className="w-full h-full bg-[#004e64] rounded-full flex items-center justify-center text-white text-4xl font-bold border-2 border-[#2DD4BF]/50">S</div>
                    )}
                 </div>
              </div>
              
              <div className="text-center md:text-left">
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-xl text-shadow-lg">
                    PROFIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#C9B458]">SMAAM</span>
                 </h1>
                 <p className="text-[#2DD4BF] font-semibold tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-md">
                    {schoolProfile.schoolName}
                 </p>
              </div>
           </div>

           {/* Moto Strip - Integrated into Header */}
           <div className="hidden md:flex divide-x divide-white/20 text-right">
              {[
                 { label: 'Moto', value: schoolProfile.moto, color: 'text-white' },
                 { label: 'Status', value: schoolProfile.status, color: 'text-[#C9B458]' },
              ].map((item, i) => (
                 <div key={i} className="px-6 first:pl-0 last:pr-0">
                    <p className="text-[0.6rem] text-[#2DD4BF] uppercase tracking-widest mb-1 font-bold drop-shadow-sm">{item.label}</p>
                    <p className={`font-bold text-sm ${item.color} leading-tight drop-shadow-md`}>{item.value}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* --- CONTENT SECTION: FLUID GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* LEFT COLUMN: Leadership & Key Stats */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Pengetua Profile - Dynamic Card - CENTERED */}
              <div className="text-center relative flex flex-col items-center">
                 <div className="relative inline-block mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#2DD4BF] to-[#006064] opacity-40 rounded-3xl blur-xl group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="w-60 h-72 rounded-3xl overflow-hidden relative border-2 border-[#2DD4BF]/30 shadow-2xl bg-[#16223a]">
                       {schoolProfile.pengetuaImage ? (
                         <img src={schoolProfile.pengetuaImage} alt="Pengetua" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-[#2DD4BF] opacity-30"><Icons.User /></div>
                       )}
                       {/* Name Overlay */}
                       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0B132B]/90 to-transparent p-4 pt-16"></div>
                    </div>
                 </div>
                 
                 <div className="bg-[#1f2f4a]/80 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm w-full">
                    <span className="text-[#C9B458] font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-2 block">Kepimpinan Utama</span>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight font-['Arial'] tracking-wide">{schoolProfile.pengetuaName}</h2>
                    <p className="text-[#2DD4BF] text-sm font-medium italic mb-6">Pengetua</p>
                    
                    {/* Principal Quote / Message */}
                    <div className="pt-6 border-t border-white/10 relative text-left">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></div>
                       <div className="text-gray-200 text-xs leading-relaxed font-light whitespace-pre-line font-sans text-justify">
                          {schoolProfile.pengetuaQuote}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Detailed Info & Vision */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* Identity Section - Modern Grid - COMPACT VERSION */}
              <div>
                 <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3 font-mono drop-shadow-md">
                    <span className="w-2 h-8 bg-[#2DD4BF] rounded-sm shadow-[0_0_10px_#2DD4BF]"></span>
                    <span className="tracking-widest uppercase">Profil Institusi</span>
                 </h3>
                 <div className="bg-[#1f2f4a]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl shadow-black/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                       {[
                          { label: 'Kod Sekolah', value: schoolProfile.schoolCode, icon: <Icons.IdCard />, highlight: true },
                          { label: 'Telefon / Faks', value: schoolProfile.phone, icon: <Icons.Phone /> },
                          { label: 'Email Rasmi', value: schoolProfile.email, icon: <Icons.Mail />, isLower: true },
                          { label: 'Laman Rasmi', value: schoolProfile.location, icon: <Icons.Globe /> },
                          { label: 'Alamat Surat Menyurat', value: schoolProfile.address, icon: <Icons.MapPin />, fullWidth: true },
                       ].map((item, idx) => (
                          <div key={idx} className={`flex gap-3 ${item.fullWidth ? 'md:col-span-2' : ''} items-center group`}>
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg transition-colors
                                ${item.highlight ? 'bg-[#2DD4BF] text-[#0B132B] shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-[#152242] text-[#2DD4BF] group-hover:bg-[#2DD4BF] group-hover:text-[#0B132B]'}
                             `}>
                                {React.cloneElement(item.icon as React.ReactElement<any>, { width: 18, height: 18 })}
                             </div>
                             <div className="min-w-0">
                                <p className="text-[0.6rem] text-gray-400 font-bold uppercase tracking-widest mb-0.5 shadow-black/50 drop-shadow-sm">{item.label}</p>
                                {item.label === 'Laman Rasmi' ? (
                                    <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:text-white underline text-sm font-medium leading-tight break-all drop-shadow-md block">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className={`text-white text-sm font-medium leading-tight ${item.isLower ? 'lowercase' : ''} ${item.highlight ? 'text-[#2DD4BF] font-bold' : ''} drop-shadow-md`}>
                                        {item.value}
                                    </p>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* STATISTIK SEMASA */}
              <div className="mt-8">
                 <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-3 font-mono drop-shadow-md">
                    <span className="w-1.5 h-6 bg-[#C9B458] rounded-sm shadow-[0_0_10px_#C9B458]"></span>
                    <span className="tracking-widest uppercase">Statistik Semasa</span>
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Guru Card */}
                    <div className="bg-gradient-to-br from-[#263c59] to-[#131b36] p-6 rounded-2xl border border-white/10 hover:border-[#2DD4BF]/50 transition-all shadow-xl shadow-black/40 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                           <Icons.User />
                       </div>
                       <div className="flex justify-between items-end mb-4 relative z-10">
                          <div>
                              <span className="text-[0.7rem] text-[#2DD4BF] uppercase font-bold tracking-widest block mb-1 drop-shadow-sm">Tenaga Pengajar</span>
                              <span className="text-4xl font-black text-white drop-shadow-lg">{schoolProfile.stats.guruTotal}</span>
                          </div>
                       </div>
                       
                       <div className="space-y-3 relative z-10">
                           {/* Male Bar */}
                           <div className="space-y-1">
                               <div className="flex justify-between text-[0.6rem] font-bold uppercase text-gray-300">
                                   <span>Lelaki</span>
                                   <span>{schoolProfile.stats.guruLelaki}</span>
                               </div>
                               <div className="h-2 w-full bg-[#0B132B]/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                                   <div className="h-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" style={{ width: `${(schoolProfile.stats.guruLelaki / schoolProfile.stats.guruTotal) * 100}%` }}></div>
                               </div>
                           </div>
                           {/* Female Bar */}
                           <div className="space-y-1">
                               <div className="flex justify-between text-[0.6rem] font-bold uppercase text-gray-300">
                                   <span>Perempuan</span>
                                   <span>{schoolProfile.stats.guruPerempuan}</span>
                               </div>
                               <div className="h-2 w-full bg-[#0B132B]/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                                   <div className="h-full bg-[#C9B458] shadow-[0_0_10px_#C9B458]" style={{ width: `${(schoolProfile.stats.guruPerempuan / schoolProfile.stats.guruTotal) * 100}%` }}></div>
                               </div>
                           </div>
                       </div>
                    </div>

                    {/* Student Card */}
                    <div className="bg-gradient-to-br from-[#263c59] to-[#131b36] p-6 rounded-2xl border border-white/10 hover:border-[#2DD4BF]/50 transition-all shadow-xl shadow-black/40 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                           <Icons.School />
                       </div>
                       <div className="flex justify-between items-end mb-4 relative z-10">
                          <div>
                              <span className="text-[0.7rem] text-[#2DD4BF] uppercase font-bold tracking-widest block mb-1 drop-shadow-sm">Enrolmen Murid</span>
                              <span className="text-4xl font-black text-white drop-shadow-lg">{schoolProfile.stats.muridTotal}</span>
                          </div>
                       </div>
                       
                       <div className="space-y-3 relative z-10">
                           {/* Male Bar */}
                           <div className="space-y-1">
                               <div className="flex justify-between text-[0.6rem] font-bold uppercase text-gray-300">
                                   <span>Lelaki</span>
                                   <span>{schoolProfile.stats.muridLelaki}</span>
                               </div>
                               <div className="h-2 w-full bg-[#0B132B]/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                                   <div className="h-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" style={{ width: `${(schoolProfile.stats.muridLelaki / schoolProfile.stats.muridTotal) * 100}%` }}></div>
                               </div>
                           </div>
                           {/* Female Bar */}
                           <div className="space-y-1">
                               <div className="flex justify-between text-[0.6rem] font-bold uppercase text-gray-300">
                                   <span>Perempuan</span>
                                   <span>{schoolProfile.stats.muridPerempuan}</span>
                               </div>
                               <div className="h-2 w-full bg-[#0B132B]/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                                   <div className="h-full bg-[#C9B458] shadow-[0_0_10px_#C9B458]" style={{ width: `${(schoolProfile.stats.muridPerempuan / schoolProfile.stats.muridTotal) * 100}%` }}></div>
                               </div>
                           </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Vision & Mission */}
              <div className="relative py-4">
                 <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2DD4BF]/50 to-transparent hidden md:block shadow-[0_0_15px_#2DD4BF]"></div>
                 
                 <div className="space-y-12 md:pl-8">
                    {/* Mission */}
                    <div className="relative group bg-[#1f2f4a]/40 p-6 rounded-2xl border border-white/5 hover:bg-[#1f2f4a]/60 transition-colors shadow-lg hover:shadow-2xl">
                       <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#2DD4BF] rounded-full flex items-center justify-center text-[#0B132B] font-black shadow-lg z-10 border-2 border-[#131b36]">M</div>
                       <h3 className="text-[#2DD4BF] font-bold text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-3 pl-8">
                          <Icons.Rocket /> Misi Sekolah
                       </h3>
                       <p className="text-base text-gray-200 font-light leading-relaxed drop-shadow-md">
                          {schoolProfile.misi}
                       </p>
                    </div>

                    {/* Vision */}
                    <div className="relative group bg-[#1f2f4a]/40 p-6 rounded-2xl border border-white/5 hover:bg-[#1f2f4a]/60 transition-colors shadow-lg hover:shadow-2xl">
                       <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#C9B458] rounded-full flex items-center justify-center text-[#0B132B] font-black shadow-lg z-10 border-2 border-[#131b36]">V</div>
                       <h3 className="text-[#C9B458] font-bold text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-3 pl-8">
                          <Icons.Eye /> Visi Sekolah
                       </h3>
                       <p className="text-base text-gray-200 font-light leading-relaxed drop-shadow-md">
                          {schoolProfile.visi}
                       </p>
                    </div>

                    {/* Piagam Pelanggan */}
                    <div className="relative group bg-[#1f2f4a]/40 p-6 rounded-2xl border border-white/5 hover:bg-[#1f2f4a]/60 transition-colors shadow-lg hover:shadow-2xl">
                       <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#2DD4BF] rounded-full flex items-center justify-center text-[#0B132B] font-black shadow-lg z-10 border-2 border-[#131b36]">P</div>
                       <h3 className="text-[#2DD4BF] font-bold text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-3 pl-8">
                          <Icons.PiagamIcon /> Piagam Pelanggan
                       </h3>
                       <div className="text-base text-gray-200 font-light leading-relaxed whitespace-pre-wrap drop-shadow-md">
                          {schoolProfile.piagam}
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* Footer Branding */}
        <div className="pt-20 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-4 mb-2">
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></div>
              <div className="w-2.5 h-2.5 rotate-45 bg-[#C9B458] shadow-[0_0_10px_#C9B458]"></div>
              <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></div>
           </div>
           <span className="text-[0.7rem] text-white font-bold uppercase tracking-[0.4em] drop-shadow-lg">Guru Pemacu Reformasi Pendidikan</span>
        </div>

      </div>

      {/* --- EDIT MODAL (Functional & Styled) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B132B]/95 backdrop-blur-sm fade-in px-4 py-6 overflow-y-auto">
          <div className="bg-[#1C2541] w-full max-w-4xl p-8 rounded-3xl border border-[#2DD4BF]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8 my-auto overflow-y-auto max-h-full scrollbar-thin relative ring-1 ring-white/10">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
               <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#2DD4BF]"><Icons.Edit /></span> Editor Profil SMAAM
               </h2>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-xl transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              {/* Group 1: Leadership */}
              <div className="bg-[#0B132B]/50 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]"></span> Pengurusan Pengetua
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Nama Pengetua</label>
                       <input type="text" value={formData.pengetuaName} onChange={e => setFormData({...formData, pengetuaName: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-[#2DD4BF] outline-none transition-colors" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">URL Gambar Pengetua</label>
                       <input type="text" value={formData.pengetuaImage} onChange={e => setFormData({...formData, pengetuaImage: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-[#2DD4BF] outline-none transition-colors" placeholder="https://..." />
                    </div>
                 </div>
                 <div>
                    <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Kata-kata Alu-aluan / Ucapan</label>
                    <textarea value={formData.pengetuaQuote} onChange={e => setFormData({...formData, pengetuaQuote: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-3 text-sm text-white h-40 focus:border-[#2DD4BF] outline-none resize-none transition-colors" />
                 </div>
              </div>

              {/* Group 2: Identity */}
              <div className="bg-[#0B132B]/50 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]"></span> Identiti Institusi
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Nama Sekolah</label>
                       <input type="text" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Kod Sekolah</label>
                       <input type="text" value={formData.schoolCode} onChange={e => setFormData({...formData, schoolCode: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Laman Rasmi</label>
                       <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Alamat</label>
                       <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div>
                          <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Email</label>
                          <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                       </div>
                       <div>
                          <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Telefon</label>
                          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                       </div>
                    </div>
                 </div>
                 <div>
                    <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">URL Logo Sekolah</label>
                    <input type="text" value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" placeholder="URL imej logo" />
                 </div>
              </div>

              {/* Group 3: Stats */}
              <div className="bg-[#0B132B]/50 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                 <h3 className="text-[#2DD4BF] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]"></span> Statistik & Falsafah
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Lulus SPM (%)</label>
                       <input type="text" value={formData.stats.lulusSpm} onChange={e => setFormData({...formData, stats: {...formData.stats, lulusSpm: e.target.value}})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Status Gred</label>
                       <input type="text" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Guru (Jum)</label>
                       <input disabled type="number" value={formData.stats.guruTotal} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-gray-400 cursor-not-allowed" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Murid (Jum)</label>
                       <input disabled type="number" value={formData.stats.muridTotal} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-gray-400 cursor-not-allowed" />
                    </div>
                 </div>
                 
                 {/* Breakdown Inputs */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#1C2541]/50 p-4 rounded-xl border border-gray-700">
                    <div>
                       <label className="text-[0.65rem] text-[#2DD4BF] uppercase font-bold tracking-wide mb-1 block">Guru Lelaki</label>
                       <input 
                          type="number" 
                          value={formData.stats.guruLelaki} 
                          onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setFormData(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, guruLelaki: val, guruTotal: val + prev.stats.guruPerempuan }
                              }))
                          }}
                          className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" 
                       />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-[#006064] uppercase font-bold tracking-wide mb-1 block">Guru Perempuan</label>
                       <input 
                          type="number" 
                          value={formData.stats.guruPerempuan} 
                          onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setFormData(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, guruPerempuan: val, guruTotal: val + prev.stats.guruLelaki }
                              }))
                          }}
                          className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" 
                       />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-[#2DD4BF] uppercase font-bold tracking-wide mb-1 block">Murid Lelaki</label>
                       <input 
                          type="number" 
                          value={formData.stats.muridLelaki} 
                          onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setFormData(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, muridLelaki: val, muridTotal: val + prev.stats.muridPerempuan }
                              }))
                          }}
                          className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" 
                       />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-[#006064] uppercase font-bold tracking-wide mb-1 block">Murid Perempuan</label>
                       <input 
                          type="number" 
                          value={formData.stats.muridPerempuan} 
                          onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setFormData(prev => ({
                                  ...prev,
                                  stats: { ...prev.stats, muridPerempuan: val, muridTotal: val + prev.stats.muridLelaki }
                              }))
                          }}
                          className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Moto</label>
                       <input type="text" value={formData.moto} onChange={e => setFormData({...formData, moto: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Slogan</label>
                       <input type="text" value={formData.slogan} onChange={e => setFormData({...formData, slogan: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#2DD4BF] outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Visi</label>
                       <textarea value={formData.visi} onChange={e => setFormData({...formData, visi: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white h-20 focus:border-[#2DD4BF] outline-none resize-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Misi</label>
                       <textarea value={formData.misi} onChange={e => setFormData({...formData, misi: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white h-20 focus:border-[#2DD4BF] outline-none resize-none" />
                    </div>
                    <div>
                       <label className="text-[0.65rem] text-gray-400 uppercase font-bold tracking-wide mb-1 block">Piagam Pelanggan</label>
                       <textarea value={formData.piagam} onChange={e => setFormData({...formData, piagam: e.target.value})} className="w-full bg-[#1C2541] border border-gray-700 rounded p-2 text-sm text-white h-48 focus:border-[#2DD4BF] outline-none resize-none" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-gray-800 text-gray-400 rounded-xl font-bold hover:bg-gray-700 transition-all text-sm uppercase">Batal</button>
                 <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-[#2DD4BF] to-[#006064] text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all text-sm uppercase tracking-wide">SIMPAN DATA PROFIL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};