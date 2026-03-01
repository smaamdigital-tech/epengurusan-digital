import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PrintPreviewModal } from '../PrintPreviewModal';

interface MonitoringItem {
  code: string;
  name: string;
}

interface MonitoringGroup {
  id: number;
  monitor: string;
  position: string;
  items: MonitoringItem[];
}

const INITIAL_MONITORING_LIST: MonitoringGroup[] = [
  {
    id: 1,
    monitor: 'ZULKEFFLE BIN MUHAMMAD',
    position: 'PENGETUA',
    items: [
        { code: '1.1', name: 'Noratikah binti Abd. Kadir' },
        { code: '1.2', name: 'Shaharer bin Hj Husain' },
        { code: '1.3', name: 'Zulkifli bin Md Aspan' },
    ]
  },
  {
    id: 2,
    monitor: 'NORATIKAH BINTI ABD. KADIR',
    position: 'GPK PENTADBIRAN',
    items: [
        { code: '2.1', name: 'Noorlela binti Zainudin' },
        { code: '2.2', name: 'Nor Azean binti Ismail' },
        { code: '2.3', name: 'Saemah binti Supandi' },
    ]
  },
  {
    id: 3,
    monitor: 'SHAHARER BIN HJ HUSAIN',
    position: 'GPK HAL EHWAL MURID',
    items: [
        { code: '3.1', name: 'Rosmawati @ Rohayati binti Hussin' },
        { code: '3.2', name: 'Salman bin A Rahman' },
        { code: '3.3', name: 'Muhammad Hafiz bin Jalil' },
    ]
  },
  {
    id: 4,
    monitor: 'ZULKIFLI BIN MD ASPAN',
    position: 'GPK KOKURIKULUM',
    items: [
        { code: '4.1', name: 'Mazuin binti Mat' },
        { code: '4.2', name: 'Mohd Nur bin Ahmad' },
        { code: '4.3', name: 'Nooraind binti Ali' },
        { code: '4.4', name: 'Zahrah Khairiah Nasution binti Saleh' },
    ]
  },
  {
    id: 5,
    monitor: 'SAEMAH BINTI SUPANDI',
    position: 'GKMP AGAMA',
    items: [
        { code: '5.1', name: 'Annur Ayuni binti Mohamed' },
        { code: '5.2', name: 'Masyitah binti Razali' },
        { code: '5.3', name: 'Mohamad Sukri bin Ali' },
        { code: '5.4', name: 'Nor Hidayah binti Mahadun' },
    ]
  },
  {
    id: 6,
    monitor: 'NOR AZEAN BINTI ISMAIL',
    position: 'GKMP DINI',
    items: [
        { code: '6.1', name: 'Norliyana binti Mhd. Amin' },
        { code: '6.2', name: 'Siti Aminah binti Mohamed' },
        { code: '6.3', name: 'Zarith Najiha binti Jamal' },
    ]
  },
  {
    id: 7,
    monitor: 'ROSMAWATI @ ROHAYATI BINTI HUSSIN',
    position: 'GKMP BAHASA',
    items: [
        { code: '7.1', name: 'Mohamad Nasreen Hakim bin Che Mohamed' },
        { code: '7.2', name: 'Nor Ain binti Mohamed Jori' },
        { code: '7.3', name: 'Siti Nurul Liza binti Sidin' },
    ]
  },
  {
    id: 8,
    monitor: 'ZAHRAH KHAIRIAH NASUTION BINTI SALEH',
    position: 'GKMP SAINS & MATEMATIK',
    items: [
        { code: '8.1', name: 'Liyana binti Iskandar' },
        { code: '8.2', name: 'Nik Noorizati binti Ab Kahar' },
        { code: '8.3', name: 'Norashidah binti A Wahab' },
    ]
  },
  {
    id: 9,
    monitor: 'NOORAIND BINTI ALI',
    position: 'GKMP KEMANUSIAAN',
    items: [
        { code: '9.1', name: 'Mohd Nor bin Salikin' },
        { code: '9.2', name: 'Nurul Izzati binti Roslin' },
        { code: '9.3', name: 'Syahidatun Najihah binti Aziz' },
    ]
  },
  {
    id: 10,
    monitor: 'MAZUIN BINTI MAT',
    position: 'GKMP TEKNIK & VOKASIONAL',
    items: [
        { code: '10.1', name: "Ahmad Fikruddin bin Ahmad Raza'i" },
        { code: '10.2', name: 'Nurul Syafiqah binti Husin' },
        { code: '10.3', name: 'Nuurul Amira binti Razak' },
        { code: '10.4', name: 'Mohammad Firros bin Rosool Gani' },
    ]
  },
];

export const JadualPemantauan: React.FC = () => {
  const { checkPermission, showToast, user } = useApp();
  const canEdit = checkPermission('canUpdateJadualPemantauan');
  const isSuperAdmin = user?.role === 'adminsistem';
  
  // --- LAZY INITIALIZATION ---
  const [monitoringList, setMonitoringList] = useState<MonitoringGroup[]>(() => {
      try {
          const saved = localStorage.getItem('smaam_monitoring_list');
          return saved ? JSON.parse(saved) : INITIAL_MONITORING_LIST;
      } catch (e) {
          return INITIAL_MONITORING_LIST;
      }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleDownloadPDF = () => {
      setShowPreview(true);
  };

  const generatePDF = (element: HTMLElement) => {
      const opt = {
          margin: 5,
          filename: `Jadual_Pemantauan.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      
      const win = window as unknown as { html2pdf: () => { set: (o: unknown) => { from: (e: HTMLElement) => { save: () => { then: (cb: () => void) => void } } } } };
      if (win.html2pdf) {
          win.html2pdf().set(opt).from(element).save().then(() => {
              showToast("PDF berjaya dimuat turun.");
          });
      }
  };

  const executeDownload = () => {
      const element = document.getElementById('pdf-content');
      if (!element) return;

      showToast("Sedang menjana PDF...");

      if (typeof (window as unknown as { html2pdf: unknown }).html2pdf === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = () => generatePDF(element);
          document.body.appendChild(script);
      } else {
          generatePDF(element);
      }
  };

  const handlePrint = () => {
      window.print();
  };

  const saveToStorage = (updatedList?: MonitoringGroup[]) => {
    localStorage.setItem('smaam_monitoring_list', JSON.stringify(updatedList || monitoringList));
  };

  const isSystemData = (id: any) => {
    if (typeof id === 'number') {
        return id < 1000000000;
    }
    return false;
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    if (item) {
        setFormData({ 
            monitor: item.monitor,
            position: item.position,
            itemsStr: item.items.map((i: any) => `${i.code}|${i.name}`).join('\n') 
        });
    } else {
        setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const items = formData.itemsStr ? formData.itemsStr.split('\n').map((line: string) => {
        const [code, name] = line.split('|');
        return { code: code?.trim(), name: name?.trim() };
    }).filter((i: any) => i.code && i.name) : [];

    const payload = {
        id: editingItem ? editingItem.id : Date.now(),
        monitor: formData.monitor,
        position: formData.position || 'PEMANTAU',
        items: items
    };
    
    let updatedList;
    if (editingItem) {
        updatedList = monitoringList.map(m => m.id === payload.id ? payload : m);
    } else {
        updatedList = [...monitoringList, payload];
    }
    setMonitoringList(updatedList);
    saveToStorage(updatedList);
    showToast("Data Pemantauan disimpan.");
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
      if (confirm("Padam kumpulan pemantauan ini?")) {
          const updatedList = monitoringList.filter(m => m.id !== id);
          setMonitoringList(updatedList);
          saveToStorage(updatedList);
          showToast("Kumpulan dipadam.");
      }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-black font-montserrat uppercase flex items-center md:justify-start justify-center gap-3">
              Jadual Pemantauan
            </h2>
            <p className="text-black font-medium mt-1 opacity-80">Jadual pencerapan guru dan pemantauan.</p>
        </div>
        <button onClick={handleDownloadPDF} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 shadow-lg inline-flex items-center gap-2 transition-transform hover:scale-105">
            📥 Muat Turun PDF
        </button>
      </div>

      <div className="space-y-6 fade-in">
        {canEdit && (
            <div className="flex justify-end">
                <button 
                    onClick={() => openEditModal(null)}
                    className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 shadow-lg flex items-center gap-2"
                >
                    <span>+</span> Tambah Kumpulan
                </button>
            </div>
        )}

        {/* Changed grid layout for wider cards: grid-cols-1 xl:grid-cols-2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {monitoringList.map((group) => (
                <div key={group.id} className="bg-[#0B132B] rounded-xl border border-[#1e293b] shadow-lg overflow-hidden flex flex-col hover:border-[#C9B458] transition-all duration-300 group h-full">
                    <div className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white text-base md:text-lg uppercase leading-tight tracking-wide">{group.monitor}</h4>
                                <p className="text-xs text-[#C9B458] font-bold tracking-widest uppercase mt-1.5">{group.position}</p>
                            </div>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openEditModal(group)} 
                                        className={`${isSystemData(group.id) && !isSuperAdmin ? 'text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {isSystemData(group.id) && !isSuperAdmin ? '🔒' : '✏️'}
                                    </button>
                                    {(!isSystemData(group.id) || isSuperAdmin) && (
                                        <button onClick={() => handleDelete(group.id)} className="text-gray-500 hover:text-red-500">
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-[#C9B458]/50 to-transparent mx-5"></div>

                    <div className="p-6 flex-1 bg-white/5">
                        {/* New 2-column Grid Layout for Items with Larger Text */}
                        {group.items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {group.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors border-b border-gray-700/50 sm:border-0">
                                        <span className="font-mono text-[#C9B458] font-bold text-sm w-10 shrink-0 pt-0.5">{item.code}</span>
                                        <span className="font-medium text-gray-200 text-sm leading-snug">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500 italic text-sm">Tiada senarai guru.</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto pt-20">
          <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 capitalize">{editingItem ? 'Kemaskini' : 'Tambah'} Kumpulan</h3>
            <form onSubmit={handleSave} className="space-y-4">
                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Nama Pemantau</label><input type="text" value={formData.monitor} onChange={e => setFormData({...formData, monitor: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" /></div>
                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Jawatan</label><input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-sm" placeholder="Contoh: PENGETUA" /></div>
                <div><label className="text-[10px] text-[#C9B458] font-bold uppercase">Senarai Guru (Format: Kod|Nama)</label><textarea value={formData.itemsStr} onChange={e => setFormData({...formData, itemsStr: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white text-xs h-32 font-mono" placeholder="1.1|Cikgu A&#10;1.2|Cikgu B" /></div>
                
                <div className="flex gap-2 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                   <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onDownload={executeDownload}
        onPrint={handlePrint}
        title="Pratonton Jadual Pencerapan & Pemantauan"
        orientation="landscape"
      >
        <div className="flex items-center gap-4 border-b-2 border-black pb-6 mb-8">
            <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" className="h-24 w-auto object-contain" alt="Logo Sekolah" crossOrigin="anonymous" />
            <div className="flex-1 text-center text-black">
                <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
                <h2 className="text-xl font-bold uppercase text-black">JADUAL PENCERAPAN & PEMANTAUAN</h2>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
            {monitoringList.map((group) => (
                <div key={group.id} className="border border-black p-4 rounded break-inside-avoid">
                    <div className="border-b border-black pb-2 mb-3">
                        <h4 className="font-bold uppercase text-sm">{group.monitor}</h4>
                        <p className="text-xs italic">{group.position}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {group.items.map((item, idx) => (
                            <div key={idx} className="flex text-[10px] items-start">
                                <span className="font-bold w-8">{item.code}</span>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-12 pt-8 border-t border-black flex justify-between text-xs font-bold uppercase">
            <div className="text-center w-1/3">
                <p className="mb-16">Disediakan Oleh:</p>
                <div className="border-t border-black w-2/3 mx-auto"></div>
                <p className="mt-2">Penyelaras Jadual</p>
            </div>
            <div className="text-center w-1/3">
                <p className="mb-16">Disahkan Oleh:</p>
                <div className="border-t border-black w-2/3 mx-auto"></div>
                <p className="mt-2">Pengetua</p>
            </div>
        </div>
        <div className="mt-8 text-center text-[10px] italic text-gray-500">
            Dicetak pada {new Date().toLocaleDateString('ms-MY')} melalui Sistem Pengurusan Digital SMAAM
        </div>
      </PrintPreviewModal>
    </div>
  );
};