import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Permissions, SiteConfig, PermissionKey } from '../types';

export const AdminSettings: React.FC = () => {
  const { user, permissions, updatePermissions, showToast, siteConfig, updateSiteConfig, saveToCloud, loadFromCloud, isSyncing } = useApp();
  const [localPermissions, setLocalPermissions] = useState<Permissions>(permissions);
  const [localConfig, setLocalConfig] = useState<SiteConfig>(siteConfig);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    setLocalPermissions(permissions);
    setLocalConfig(siteConfig);
  }, [permissions, siteConfig]);

  if (user?.role !== 'adminsistem') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-500 text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-gray-400">Hanya Admin Sistem dibenarkan mengubah tetapan ini.</p>
      </div>
    );
  }

  const handlePermissionChange = (module: PermissionKey, action: 'view' | 'edit' | 'delete' | 'save' | 'download') => {
    setLocalPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  const saveSettings = () => {
    updatePermissions(localPermissions);
    updateSiteConfig(localConfig);
    showToast("Tetapan sistem berjaya disimpan secara lokal!");
  };

  const modulesList: { key: PermissionKey, label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'pengguna', label: 'Pengurusan Pengguna' },
    { key: 'jawatankuasa', label: 'Pengurusan Jawatankuasa' },
    { key: 'tugasFungsi', label: 'Tugas & Fungsi' },
    { key: 'program', label: 'Pengurusan Program' },
    { key: 'dokumentasi', label: 'Dokumentasi / Muat Turun PDF' },
    { key: 'laporan', label: 'Laporan' },
    { key: 'tetapan', label: 'Tetapan Sistem' },
  ];

  return (
    <div className="p-8 space-y-8 fade-in pb-20">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white font-montserrat flex items-center gap-3">
          <span>⚙️</span> Tetapan Admin
        </h2>
        <p className="text-gray-400 mt-1">Konfigurasi kebenaran modul dan pangkalan data.</p>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-[#1C2541] rounded-xl border-t-4 border-[#C9B458] shadow-lg overflow-hidden">
         <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
            <h3 className="text-xl font-bold text-white">Admin System Permission</h3>
            <p className="text-xs text-gray-400 mt-1">
              Tentukan halaman yang boleh diakses dan tindakan yang dibenarkan untuk peranan <strong>Administrator</strong>.
              <br/><em>(Nota: Peranan <strong>System Admin</strong> mempunyai akses penuh secara automatik).</em>
            </p>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#253252] text-[#C9B458] text-sm uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 border-b border-gray-700">Halaman / Modul</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-center">Boleh Lihat</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-center">Boleh Edit</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-center">Boleh Hapus</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-center">Boleh Simpan</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-center">Muat Turun PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {modulesList.map((mod) => (
                  <tr key={mod.key} className="hover:bg-[#253252]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{mod.label}</td>
                    
                    {/* View */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={localPermissions[mod.key].view}
                        onChange={() => handlePermissionChange(mod.key, 'view')}
                        className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                      />
                    </td>
                    
                    {/* Edit */}
                    <td className="px-6 py-4 text-center">
                       <input
                        type="checkbox"
                        checked={localPermissions[mod.key].edit}
                        onChange={() => handlePermissionChange(mod.key, 'edit')}
                        className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
                      />
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-4 text-center">
                       <input
                        type="checkbox"
                        checked={localPermissions[mod.key].delete}
                        onChange={() => handlePermissionChange(mod.key, 'delete')}
                        className="w-5 h-5 accent-red-500 rounded cursor-pointer"
                      />
                    </td>

                    {/* Save */}
                    <td className="px-6 py-4 text-center">
                       <input
                        type="checkbox"
                        checked={localPermissions[mod.key].save}
                        onChange={() => handlePermissionChange(mod.key, 'save')}
                        className="w-5 h-5 accent-green-500 rounded cursor-pointer"
                      />
                    </td>

                    {/* Download */}
                    <td className="px-6 py-4 text-center">
                       <input
                        type="checkbox"
                        checked={localPermissions[mod.key].download}
                        onChange={() => handlePermissionChange(mod.key, 'download')}
                        className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Info */}
        <div className="bg-[#1C2541] p-6 rounded-xl border-t-4 border-[#3A506B] shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">Maklumat Sistem</h3>
            <div className="space-y-4">
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Tajuk Sistem</label>
                <input 
                    type="text" 
                    value={localConfig.systemTitle}
                    onChange={(e) => setLocalConfig({...localConfig, systemTitle: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Nama Sekolah</label>
                <input 
                    type="text" 
                    value={localConfig.schoolName}
                    onChange={(e) => setLocalConfig({...localConfig, schoolName: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Mesej Alu-aluan</label>
                <input 
                    type="text" 
                    value={localConfig.welcomeMessage}
                    onChange={(e) => setLocalConfig({...localConfig, welcomeMessage: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
            </div>
        </div>

        {/* Google Integration */}
        <div className="bg-[#1C2541] p-6 rounded-xl border-t-4 border-green-600 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-green-500">☁️</span> Integrasi Google Sheet
                </h3>
                <button 
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                >
                    {showGuide ? 'Tutup Panduan' : 'Panduan Elak Warning'}
                </button>
            </div>

            {showGuide && (
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg text-xs text-gray-300">
                    <p className="font-bold text-[#C9B458] mb-2 text-sm">⚠️ CARA ELAK "THIS APP IS FROM ANOTHER DEVELOPER":</p>
                    <p className="mb-2">Apabila anda `Deploy` Google Apps Script, pastikan tetapan ini dipilih:</p>
                    <ol className="list-decimal ml-4 space-y-2">
                        <li>Klik <b>Deploy</b> &gt; <b>New Deployment</b>.</li>
                        <li>Pilih type <b>Web app</b>.</li>
                        <li><b>Description:</b> (Boleh letak apa sahaja).</li>
                        <li><b>Execute as:</b> Pilih <u className="text-white font-bold">Me</u> (Akaun anda).</li>
                        <li><b>Who has access:</b> Pilih <u className="text-white font-bold">Anyone</u> (Sesiapa sahaja).</li>
                        <li>Klik Deploy dan salin URL baharu.</li>
                    </ol>
                    <p className="mt-2 text-gray-400 italic">Tetapan ini membolehkan sistem ini mengakses skrip tanpa pelawat perlu login Google.</p>
                </div>
            )}

            <p className="text-xs text-gray-400 mb-4">
                Masukkan URL 'Web app' yang telah di-deploy dengan tetapan di atas.
            </p>
            <div className="mb-4">
                <label className="block text-sm text-[#C9B458] mb-1">URL Google Apps Script</label>
                <input 
                    type="text" 
                    value={localConfig.googleScriptUrl || ''}
                    onChange={(e) => setLocalConfig({...localConfig, googleScriptUrl: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white text-xs font-mono focus:border-green-500 outline-none placeholder-gray-600"
                    placeholder="https://script.google.com/macros/s/...../exec"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={saveToCloud}
                    disabled={isSyncing || !localConfig.googleScriptUrl}
                    className={`py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2
                        ${isSyncing || !localConfig.googleScriptUrl ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white'}
                    `}
                >
                    {isSyncing ? 'Sedang Proses...' : '📤 Simpan ke Cloud'}
                </button>
                <button 
                    onClick={loadFromCloud}
                    disabled={isSyncing || !localConfig.googleScriptUrl}
                    className={`py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2
                        ${isSyncing || !localConfig.googleScriptUrl ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600 text-white'}
                    `}
                >
                    {isSyncing ? 'Sedang Proses...' : '📥 Muat Turun Data'}
                </button>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-700 mt-8">
        <button
          onClick={saveSettings}
          className="bg-[#C9B458] text-[#0B132B] px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 shadow-lg transform hover:-translate-y-1 transition-all"
        >
          Simpan Tetapan Lokal
        </button>
      </div>
    </div>
  );
};