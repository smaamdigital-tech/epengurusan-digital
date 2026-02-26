import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RolePermission, UserCredential } from '../types';

// Icons
const Icons = {
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Key: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

export const AdminSettings: React.FC = () => {
  const { 
    user, userCredentials, updateUserCredentials, 
    rolePermissions, updateRolePermissions, 
    showToast 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (user?.role !== 'adminsistem') {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
           <Icons.Shield />
        </div>
        <h2 className="text-red-600 text-2xl font-bold mb-2">Akses Ditolak</h2>
        <p className="text-gray-600">Hanya Superadmin (adminsistem) dibenarkan masuk ke sini.</p>
      </div>
    );
  }

  const roles = [
    { id: 'admin', label: 'Admin', group: 'Pentadbiran' },
    { id: 'pengetua', label: 'Pengetua', group: 'Pentadbiran' },
    { id: 'gpk_pentadbiran', label: 'GPK Pentadbiran', group: 'Pentadbiran' },
    { id: 'gpk_hem', label: 'GPK HEM', group: 'Pentadbiran' },
    { id: 'gpk_koko', label: 'GPK Kokurikulum', group: 'Pentadbiran' },
    { id: 'gkmp', label: 'GKMP', group: 'Guru Kanan' },
    { id: 'panitia', label: 'Ketua Panitia', group: 'Guru Kanan' },
    { id: 'guru', label: 'Guru', group: 'Guru' },
    { id: 'su_pentadbir', label: 'SU Pentadbiran', group: 'Setiausaha' },
    { id: 'su_hem', label: 'SU HEM', group: 'Setiausaha' },
    { id: 'su_kuri', label: 'SU Kurikulum', group: 'Setiausaha' },
    { id: 'su_koko', label: 'SU Kokurikulum', group: 'Setiausaha' },
  ];

  const handleCredChange = (field: keyof UserCredential, val: string) => {
    const current = userCredentials[selectedRole];
    updateUserCredentials(selectedRole, { ...current, [field]: val });
    showFeedback("Kredential disimpan");
  };

  const handlePermToggle = (field: keyof RolePermission) => {
    const current = rolePermissions[selectedRole];
    updateRolePermissions(selectedRole, { ...current, [field]: !current[field] });
    showFeedback("Kebenaran dikemaskini");
  };

  const showFeedback = (msg: string) => {
      setSaveStatus(msg);
      setTimeout(() => setSaveStatus(null), 2000);
  };

  // Grouped Permissions Schema
  const permissionGroups = [
    {
        title: "Asas & Dashboard",
        perms: [
            { id: 'canUpdateProfil', label: 'Profil Sekolah' },
            { id: 'canUpdateProgram', label: 'Program Sekolah' },
            { id: 'canUpdatePengumuman', label: 'Pengumuman' },
        ]
    },
    {
        title: "Unit Pentadbiran",
        perms: [
            { id: 'canUpdatePentadbiranJK', label: 'Jawatankuasa Pentadbiran' },
            { id: 'canUpdatePentadbiranTakwim', label: 'Takwim Pentadbiran' },
        ]
    },
    {
        title: "Unit Kurikulum",
        perms: [
            { id: 'canUpdateKurikulumJK', label: 'Jawatankuasa Kurikulum' },
            { id: 'canUpdateKurikulumTakwim', label: 'Takwim Kurikulum' },
            { id: 'canUpdateKurikulumPeperiksaan', label: 'Peperiksaan' },
        ]
    },
    {
        title: "Unit Hal Ehwal Murid",
        perms: [
            { id: 'canUpdateHEMJK', label: 'Jawatankuasa HEM' },
            { id: 'canUpdateHEMTakwim', label: 'Takwim HEM' },
            { id: 'canUpdateHEMEnrolmen', label: 'Enrolmen Murid' },
        ]
    },
    {
        title: "Unit Kokurikulum",
        perms: [
            { id: 'canUpdateKokoJK', label: 'Jawatankuasa Kokurikulum' },
            { id: 'canUpdateKokoTakwim', label: 'Takwim Kokurikulum' },
        ]
    },
    {
        title: "Modul Jadual (Submenu)",
        perms: [
            { id: 'canUpdateJadualGanti', label: 'Jadual Guru Ganti' },
            { id: 'canUpdateJadualGuruKelas', label: 'Jadual Guru Kelas' },
            { id: 'canUpdateJadualPersendirian', label: 'Jadual Persendirian' },
            { id: 'canUpdateJadualKelas', label: 'Jadual Waktu Kelas' },
            { id: 'canUpdateJadualBerucap', label: 'Jadual Guru Berucap' },
            { id: 'canUpdateJadualPemantauan', label: 'Jadual Pemantauan' },
            { id: 'canUpdateJadualGlobal', label: 'Akses Penuh Semua Jadual' },
        ]
    },
    {
        title: "Modul Global",
        perms: [
            { id: 'canUpdateTakwimGlobal', label: 'Semua Takwim (Kalendar/Akademik/Johor)' },
        ]
    }
  ];

  const activeRoleLabel = roles.find(r => r.id === selectedRole)?.label;

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-24 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-300 pb-4">
        <div>
            <h2 className="text-3xl font-bold text-[#0B132B] font-montserrat flex items-center gap-3 uppercase tracking-tight">
            <span className="text-[#C9B458]"><Icons.Shield /></span> Tetapan Superadmin
            </h2>
            <p className="text-gray-600 font-medium mt-1 text-sm">Urus akaun pengguna dan kawalan akses modul.</p>
        </div>
        {saveStatus && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse shadow-sm border border-green-200">
                <Icons.Check /> {saveStatus}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR: ROLE SELECTOR */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-[#0B132B] p-4 border-b border-gray-700">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Senarai Peranan</h3>
                </div>
                <div className="p-2 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {roles.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setSelectedRole(r.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg font-bold text-xs transition-all flex justify-between items-center group
                                ${selectedRole === r.id 
                                    ? 'bg-[#1C2541] text-[#C9B458] shadow-md transform scale-[1.02]' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0B132B]'}`}
                        >
                            <span>{r.label}</span>
                            {selectedRole === r.id && <span className="w-2 h-2 rounded-full bg-[#C9B458]"></span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-9 space-y-6">
            
            {/* CARD 1: CREDENTIALS */}
            <div className="bg-[#1C2541] rounded-2xl shadow-xl overflow-hidden border border-[#0B132B]">
                <div className="p-5 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span className="text-[#C9B458]"><Icons.Key /></span> Akses Log Masuk: <span className="text-[#C9B458]">{activeRoleLabel}</span>
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Nama Pengguna (Username)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Icons.User />
                            </div>
                            <input 
                                type="text"
                                value={userCredentials[selectedRole]?.username || ''}
                                onChange={(e) => handleCredChange('username', e.target.value)}
                                className="w-full bg-[#0B132B] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all font-mono"
                                placeholder="Masukkan username..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Kata Laluan</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Icons.Key />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={userCredentials[selectedRole]?.password || ''}
                                onChange={(e) => handleCredChange('password', e.target.value)}
                                className="w-full bg-[#0B132B] border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white text-sm focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all font-mono"
                                placeholder="•••••••"
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#C9B458] transition-colors"
                                type="button"
                            >
                                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 2: PERMISSIONS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-[#0B132B] font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span className="text-blue-600"><Icons.Shield /></span> Kebenaran Modul (Permissions)
                    </h3>
                    <span className="text-[10px] font-black bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded-full uppercase tracking-tight shadow-sm">
                        {activeRoleLabel}
                    </span>
                </div>
                
                <div className="p-6 space-y-8">
                    {permissionGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-1 bg-[#C9B458] rounded-full"></div>
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                    {group.title}
                                </h4>
                                <div className="h-px bg-gray-200 flex-1 ml-2"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.perms.map((item) => {
                                    const isChecked = rolePermissions[selectedRole] ? rolePermissions[selectedRole][item.id as keyof RolePermission] : false;
                                    
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handlePermToggle(item.id as keyof RolePermission)}
                                            className={`relative flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                                                ${isChecked
                                                    ? 'bg-[#1C2541] border-[#1C2541] shadow-lg' 
                                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <span className={`text-[11px] font-bold leading-tight transition-colors ${isChecked ? 'text-white' : 'text-gray-600'}`}>
                                                {item.label}
                                            </span>
                                            
                                            {/* Modern Toggle Switch UI */}
                                            <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${isChecked ? 'bg-[#C9B458]' : 'bg-gray-300'}`}>
                                                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${isChecked ? 'translate-x-5' : ''}`}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                 <p className="text-xs text-gray-400 italic">
                    * Perubahan perlu disimpan untuk mengemaskini sistem.
                 </p>
                 <button 
                    onClick={() => showFeedback("Semua tetapan telah berjaya disimpan.")}
                    className="bg-[#C9B458] text-[#0B132B] px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                 >
                    <Icons.Check /> Simpan Tetapan
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};