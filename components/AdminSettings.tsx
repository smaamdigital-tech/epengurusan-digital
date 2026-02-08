
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RolePermission, UserCredential } from '../types';

export const AdminSettings: React.FC = () => {
  const { 
    user, userCredentials, updateUserCredentials, 
    rolePermissions, updateRolePermissions, 
    showToast, siteConfig, updateSiteConfig 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>('admin');

  if (user?.role !== 'adminsistem') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-600 text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-gray-600">Hanya Superadmin (adminsistem) dibenarkan masuk ke sini.</p>
      </div>
    );
  }

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'gkmp', label: 'GKMP' },
    { id: 'panitia', label: 'Panitia' },
    { id: 'guru', label: 'Guru' },
    { id: 'su_pentadbir', label: 'SU Pentadbir' },
    { id: 'su_hem', label: 'SU HEM' },
    { id: 'su_kuri', label: 'SU Kurikulum' },
    { id: 'su_koko', label: 'SU Kokurikulum' },
  ];

  const handleCredChange = (field: keyof UserCredential, val: string) => {
    const current = userCredentials[selectedRole];
    updateUserCredentials(selectedRole, { ...current, [field]: val });
  };

  const handlePermToggle = (field: keyof RolePermission) => {
    const current = rolePermissions[selectedRole];
    updateRolePermissions(selectedRole, { ...current, [field]: !current[field] });
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
            { id: 'canUpdateHEMKehadiran', label: 'Kehadiran Murid' },
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

  return (
    <div className="p-8 space-y-8 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-[#0B132B] font-montserrat flex items-center gap-3 uppercase">
          <span>🛡️</span> Tetapan Superadmin
        </h2>
        <p className="text-gray-700 font-medium mt-1">Urus kredential pengguna dan kawalan modul sistem mengikut peranan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Role Selector Sidebar */}
        <div className="lg:col-span-3 space-y-2">
            <h3 className="text-xs font-black text-[#0B132B] uppercase tracking-widest mb-4">Pilih Peranan Pengguna</h3>
            {roles.map(r => (
                <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all border
                        ${selectedRole === r.id 
                            ? 'bg-[#1C2541] text-[#C9B458] border-[#C9B458] shadow-lg translate-x-1' 
                            : 'bg-white/50 text-gray-600 border-gray-300 hover:bg-white'}`}
                >
                    {r.label}
                </button>
            ))}
        </div>

        {/* Configuration Area */}
        <div className="lg:col-span-9 space-y-6">
            
            {/* Credentials Card */}
            <div className="bg-[#1C2541] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                <div className="p-5 border-b border-gray-700 bg-[#0B132B]">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <span className="text-[#C9B458]">🔑</span> Kredential Akses: {roles.find(r => r.id === selectedRole)?.label}
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                    <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Nama Pengguna (Login)</label>
                        <input 
                            type="text"
                            value={userCredentials[selectedRole]?.username || ''}
                            onChange={(e) => handleCredChange('username', e.target.value)}
                            className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#C9B458] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Kata Laluan</label>
                        <input 
                            type="password"
                            value={userCredentials[selectedRole]?.password || ''}
                            onChange={(e) => handleCredChange('password', e.target.value)}
                            className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#C9B458] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Permissions Card - Grouped by Menu */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300">
                <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-[#0B132B] font-bold flex items-center gap-2">
                        <span className="text-[#3A506B]">✅</span> Kebenaran Kemaskini Modul
                    </h3>
                    <span className="text-[10px] font-black bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        PERANAN: {roles.find(r => r.id === selectedRole)?.label}
                    </span>
                </div>
                <div className="p-6 space-y-8">
                    {permissionGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-4">
                            <h4 className="text-xs font-black text-[#3A506B] uppercase tracking-widest border-l-4 border-[#C9B458] pl-3">
                                {group.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {group.perms.map((item) => (
                                    <label 
                                        key={item.id} 
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                            ${rolePermissions[selectedRole] && rolePermissions[selectedRole][item.id as keyof RolePermission] 
                                                ? 'bg-blue-50 border-[#1C2541] text-[#1C2541]' 
                                                : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 accent-[#1C2541]"
                                            checked={rolePermissions[selectedRole] ? rolePermissions[selectedRole][item.id as keyof RolePermission] : false}
                                            onChange={() => handlePermToggle(item.id as keyof RolePermission)}
                                        />
                                        <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                 <button 
                    onClick={() => {
                        updateSiteConfig({}); // Save state to local storage
                        showToast("Kebenaran peranan berjaya disimpan.");
                    }}
                    className="bg-[#C9B458] text-[#0B132B] px-8 py-3 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-transform"
                 >
                    SIMPAN SEMUA TETAPAN
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};
