import React, { useState, useRef } from 'react';
import { menuItems, committeeData, tasksData } from './KurikulumJawatankuasaData';

// Icons components (Lucide style)
const Download = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const Users = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const FileText = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const ChevronRight = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);


interface Html2Pdf {
    set: (opt: unknown) => Html2Pdf;
    from: (element: HTMLElement | null) => Html2Pdf;
    save: () => Promise<void>;
}

export const KurikulumJawatankuasa: React.FC = () => {
  const [activeItem, setActiveItem] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeLabel = menuItems.find(item => item.id === activeItem)?.label || "";
  const activeMembers = committeeData[activeItem as keyof typeof committeeData] || [];
  const activeTasks = tasksData[activeItem as keyof typeof tasksData] || [];

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    setIsGenerating(true);

    const generate = () => {
        // Inject style to expand scrollable areas for PDF
        const style = document.createElement('style');
        style.innerHTML = `
            #pdf-content .overflow-y-auto {
                overflow: visible !important;
                height: auto !important;
            }
            #pdf-content .h-full {
                height: auto !important;
            }
            #pdf-content .min-h-screen {
                min-height: 0 !important;
            }
        `;
        document.head.appendChild(style);

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Jawatankuasa_Kurikulum_${activeLabel.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        const html2pdf = (window as unknown as { html2pdf: () => Html2Pdf }).html2pdf;
        html2pdf().set(opt).from(element).save().then(() => {
            setIsGenerating(false);
            document.head.removeChild(style);
        }).catch((err: Error) => {
            console.error(err);
            setIsGenerating(false);
            document.head.removeChild(style);
            alert("Ralat menjana PDF.");
        });
    };

    if (typeof (window as unknown as { html2pdf: unknown }).html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = generate;
        document.body.appendChild(script);
    } else {
        generate();
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-gray-900">
      {/* Content Wrapper for PDF Capture */}
      <div ref={contentRef} id="pdf-content" className="min-h-screen bg-transparent">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left w-full">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold tracking-wider text-black uppercase mb-1">
                  <span>Kurikulum</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Jawatankuasa</span>
                </div>
                <h1 className="text-2xl font-bold text-black text-center md:text-left">Pengurusan Jawatankuasa Kurikulum</h1>
                <p className="text-sm text-black mt-1 text-center md:text-left">Senarai jawatankuasa dan ahli bagi unit Kurikulum.</p>
              </div>
              <button 
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                data-html2canvas-ignore="true"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Menjana...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Muat Turun PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Sidebar Navigation */}
            <div className={`lg:col-span-3 space-y-6 ${activeItem === 11 ? 'lg:row-span-2' : ''}`}>
              {/* Stats Card */}
              <div 
                className="bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-950 rounded-xl shadow-sm border border-blue-700 p-6 text-center text-white"
                data-print-style="dark"
              >
                <div className="text-4xl font-bold text-white mb-1">{menuItems.length}</div>
                <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Senarai Jawatankuasa</div>
              </div>

              {/* Navigation List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id)}
                      className={`text-left px-5 py-3.5 text-sm font-medium transition-all border-l-4 ${
                        activeItem === item.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.id}. {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Organization Chart/Table */}
            <div className={activeItem === 11 ? "lg:col-span-9" : "lg:col-span-5"}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div 
                  className="px-6 py-5 border-b border-blue-800 bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 rounded-t-xl shadow-inner"
                  data-print-style="dark"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Organisasi</span>
                    <h2 className="text-lg font-bold text-yellow-400 uppercase">Jawatankuasa {activeLabel}</h2>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {activeItem === 11 ? (
                    <div className="p-4 overflow-x-auto bg-white">
                      {/* Custom Chart for ID 11 */}
                      <div className="min-w-[900px] flex flex-col items-center gap-4 py-8">
                        {/* Level 1 */}
                        <div className="border-2 border-gray-800 p-3 bg-white shadow-md rounded text-center w-64 z-10">
                          <div className="font-bold text-sm uppercase">Pengetua</div>
                          <div className="text-xs">Zulkeffle bin Muhammad</div>
                        </div>
                        <div className="h-8 w-px bg-gray-800 -my-2"></div>

                        {/* Level 2 */}
                        <div className="border-2 border-gray-800 p-3 bg-white shadow-md rounded text-center w-64 z-10">
                          <div className="font-bold text-sm uppercase">PK Pentadbiran</div>
                          <div className="text-xs">Noratikah binti Abd. Kadir</div>
                        </div>
                        <div className="h-8 w-px bg-gray-800 -my-2"></div>

                        {/* Level 3 Container */}
                        <div className="grid grid-cols-4 gap-4 w-full relative pt-4">
                          {/* Horizontal Connector */}
                          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-gray-800"></div>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-px bg-gray-800 -mt-4"></div>

                          {/* Col 1: PK HEM */}
                          <div className="flex flex-col items-center gap-4 relative">
                            <div className="h-4 w-px bg-gray-800 absolute top-[-1rem]"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">PK HEM</div>
                              <div className="text-[10px]">Shaharer bin Hj Husain</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Penyelaras PPSI</div>
                              <div className="text-[10px]">***</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Kaunselor Kerjaya Murid</div>
                              <div className="text-[10px]">Muhammad Hafiz bin Jalil</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Ketua Guru Disiplin</div>
                              <div className="text-[10px]">Salman bin A Rahman</div>
                            </div>
                          </div>

                          {/* Col 2: PK Koku */}
                          <div className="flex flex-col items-center gap-4 relative">
                            <div className="h-4 w-px bg-gray-800 absolute top-[-1rem]"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">PK Kokurikulum</div>
                              <div className="text-[10px]">Zulkifli bin Md Aspan</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Setiausaha Kokurikulum</div>
                              <div className="text-[10px]">Nurul Syafiqah Husin</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="text-[10px]">Guru Penasihat Badan Beruniform, Kelab & Persatuan, Sukan & Permainan</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">SEGAK</div>
                            </div>
                          </div>

                          {/* Col 3: Penyelaras Pentaksiran */}
                          <div className="flex flex-col items-center gap-4 relative">
                            <div className="h-4 w-px bg-gray-800 absolute top-[-1rem]"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Penyelaras Pentaksiran & Peperiksaan Dalaman</div>
                              <div className="text-[10px]">Annur Ayuni binti Mohamed</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="grid grid-cols-2 gap-2 w-full">
                              <div className="flex flex-col items-center gap-2">
                                <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full h-full flex flex-col justify-center">
                                  <div className="font-bold text-[10px] uppercase">Setiausaha PBD Menengah Atas</div>
                                  <div className="text-[9px]">Nurul Izzati Roslin</div>
                                </div>
                                <div className="h-2 w-px bg-gray-600"></div>
                                <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full">
                                  <div className="font-bold text-[10px] uppercase">SU SPM</div>
                                  <div className="text-[9px]">Nor Ain binti Mohamed Jori</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full h-full flex flex-col justify-center">
                                  <div className="font-bold text-[10px] uppercase">Setiausaha PBD Menengah Rendah</div>
                                  <div className="text-[9px]">***</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Col 4: Penyelaras PBS/PBD */}
                          <div className="flex flex-col items-center gap-4 relative">
                            <div className="h-4 w-px bg-gray-800 absolute top-[-1rem]"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full">
                              <div className="font-bold text-xs uppercase">Penyelaras PBS/PBD</div>
                              <div className="text-[10px]">Siti Nurul Liza binti Bidin</div>
                            </div>
                            <div className="h-4 w-px bg-gray-600 -my-2"></div>
                            <div className="border border-gray-600 p-2 bg-white shadow-sm rounded text-center w-full text-[9px]">
                              Keputusan Mesyuarat Penyelarasan BPK-KSPA Bil. 3/2015 pada 23-25 Ogos 2015 dan Mesyuarat BPK-JPN pada 3 Sept. 2015 memutuskan : Semua JPN perlu menubuhkan Jawatankuasa Kerja Pentaksiran Bilik Darjah (PBD) di semua peringkat.
                            </div>
                          </div>
                        </div>

                        {/* Level 4: GKMPs */}
                        <div className="w-full h-px bg-gray-800 my-4 relative">
                           <div className="absolute left-1/2 -translate-x-1/2 top-0 h-4 w-px bg-gray-800 -mt-4"></div>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-2 w-full relative">
                          <div className="absolute top-0 left-[8.33%] right-[8.33%] h-px bg-gray-800 -mt-4"></div>
                          
                          {[
                            {role: "GKMP AGAMA", name: "Saemah Supandi"},
                            {role: "GKMP DINI", name: "Nor Azean Ismail"},
                            {role: "GKMP BAHASA", name: "Rosmawati Hussin"},
                            {role: "GKMP SAINS & MATE", name: "Zahrah Khairiah"},
                            {role: "GKMP KEMANUSIAAN", name: "Nooraind binti Ali"},
                            {role: "GKMP TVET", name: "Mazuin Mat"}
                          ].map((gkmp, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 relative">
                              <div className="h-4 w-px bg-gray-800 absolute top-[-1rem] -mt-4"></div>
                              <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full h-16 flex flex-col justify-center">
                                <div className="font-bold text-[10px] uppercase">{gkmp.role}</div>
                                <div className="text-[9px]">{gkmp.name}</div>
                              </div>
                              <div className="h-2 w-px bg-gray-600"></div>
                              <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full h-12 flex flex-col justify-center">
                                <div className="font-bold text-[9px] uppercase">KETUA PANITIA (KPMP)</div>
                                <div className="text-[9px]">***</div>
                              </div>
                              <div className="h-2 w-px bg-gray-600"></div>
                              <div className="border border-gray-600 p-1 bg-white shadow-sm rounded text-center w-full h-12 flex flex-col justify-center">
                                <div className="font-bold text-[9px] uppercase">PENTAKSIR MATA PELAJARAN (PMP)</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="text-xs italic mt-8 w-full text-left text-gray-500">
                          *** Jawatan Pelantikan Pengetua – pemilihan adalah berdasarkan kriteria dan komitmen personel yang dilantik
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Table Header */}
                      <div 
                        className="grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-[#7E57C2] via-[#42A5F5] to-[#26C6DA] border-b border-gray-100 text-xs font-semibold text-white uppercase tracking-wider"
                        data-print-style="gradient"
                      >
                        <div className="col-span-3">Peranan</div>
                        <div className="col-span-4">Jawatan</div>
                        <div className="col-span-5">Nama Guru</div>
                      </div>

                      {/* Table Content */}
                      {activeMembers.length > 0 ? (
                        <div className="overflow-y-auto">
                          {activeMembers.map((member, index) => {
                            const positionStyle = "text-gray-600";

                            return (
                              <div 
                                key={index} 
                                className={`grid grid-cols-12 gap-4 px-6 py-4 text-sm border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                }`}
                              >
                                <div className="col-span-3 font-medium text-indigo-900">{member.role}</div>
                                <div className={`col-span-4 ${positionStyle}`}>{member.position}</div>
                                <div className="col-span-5 font-medium text-gray-900">{member.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Tiada ahli direkodkan</h3>
                          <p className="text-xs text-gray-500 max-w-xs">
                            Belum ada ahli jawatankuasa yang dilantik untuk unit ini.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Tasks & Functions */}
            <div className={activeItem === 11 ? "lg:col-span-9" : "lg:col-span-4"}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div 
                  className="px-6 py-5 border-b border-blue-800 bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 rounded-t-xl shadow-inner"
                  data-print-style="dark"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Tugas & Fungsi</span>
                    <h2 className="text-sm font-bold text-yellow-400 uppercase">Jawatankuasa {activeLabel}</h2>
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-6">
                  {activeTasks.length > 0 ? (
                    <ul className="space-y-4">
                      {(() => {
                        let counter = 0;
                        return activeTasks.map((task, index) => {
                          const isHeader = task.endsWith(':');
                          if (isHeader) {
                            counter = 0;
                            return (
                               <li key={index} className="block pt-2">
                                 <span className="w-full font-bold text-indigo-800 uppercase border-b border-indigo-100 pb-1 mt-2 block">
                                   {task}
                                 </span>
                               </li>
                            );
                          }
                          
                          counter++;
                          return (
                            <li key={index} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                                {counter}
                              </span>
                              <span>{task}</span>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px]">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Tiada maklumat fungsi ditetapkan.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
