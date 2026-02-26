import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { menuItems, committeeData, tasksData } from './PentadbiranJawatankuasaData';

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
const X = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const Printer = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

export const PentadbiranJawatankuasa: React.FC = () => {
  const [activeItem, setActiveItem] = useState(1);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeLabel = menuItems.find(item => item.id === activeItem)?.label || "";
  const activeMembers = committeeData[activeItem as keyof typeof committeeData] || [];
  const activeTasks = tasksData[activeItem as keyof typeof tasksData] || [];

  const handleDownloadPdf = async (mode: 'color' | 'bw') => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb',
        onclone: (clonedDoc) => {
          if (mode === 'bw') {
            const mainContent = clonedDoc.getElementById('pdf-content');
            if (mainContent) {
              mainContent.style.backgroundColor = '#ffffff';
              mainContent.style.color = '#000000';
            }

            const darkElements = clonedDoc.querySelectorAll('[data-print-style="dark"]');
            darkElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.background = 'white';
              htmlEl.style.backgroundImage = 'none';
              htmlEl.style.backgroundColor = 'white';
              htmlEl.style.color = 'black';
              htmlEl.style.border = '1px solid black';
              
              const children = el.querySelectorAll('*');
              children.forEach((child) => {
                (child as HTMLElement).style.color = 'black';
              });
            });

            const gradientHeaders = clonedDoc.querySelectorAll('[data-print-style="gradient"]');
            gradientHeaders.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.background = '#f3f4f6';
              htmlEl.style.backgroundImage = 'none';
              htmlEl.style.color = 'black';
              htmlEl.style.borderBottom = '1px solid black';
              
              const children = el.querySelectorAll('*');
              children.forEach((child) => {
                (child as HTMLElement).style.color = 'black';
              });
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;
      
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      const x = (pageWidth - imgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', x, 0, imgWidth, imgHeight);
      pdf.save(`Jawatankuasa_Pentadbiran_${activeLabel.replace(/\s+/g, '_')}_${mode}.pdf`);
      
      setIsPdfModalOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal menjana PDF. Sila cuba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-gray-900">
      {/* PDF Download Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" data-html2canvas-ignore="true">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Pilihan Muat Turun</h3>
              <button 
                onClick={() => setIsPdfModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Sila pilih mod warna untuk fail PDF anda.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDownloadPdf('color')}
                  disabled={isGenerating}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">Berwarna</span>
                </button>

                <button
                  onClick={() => handleDownloadPdf('bw')}
                  disabled={isGenerating}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <Printer className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">Hitam Putih</span>
                </button>
              </div>

              {isGenerating && (
                <div className="text-center text-sm text-indigo-600 animate-pulse mt-2">
                  Sedang menjana PDF...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Wrapper for PDF Capture */}
      <div ref={contentRef} id="pdf-content" className="min-h-screen bg-transparent">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">
                  <span>Pentadbiran</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Jawatankuasa</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Pengurusan Jawatankuasa Pentadbiran</h1>
                <p className="text-sm text-gray-500 mt-1">Senarai jawatankuasa dan ahli bagi unit Pentadbiran.</p>
              </div>
              <button 
                onClick={() => setIsPdfModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                data-html2canvas-ignore="true"
              >
                <Download className="w-4 h-4" />
                Muat Turun PDF
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-6">
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
            <div className="lg:col-span-5">
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
                        let positionStyle = "text-gray-600";

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
                </div>
              </div>
            </div>

            {/* Right Column: Tasks & Functions */}
            <div className="lg:col-span-4">
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
                          const isHeader = task.endsWith(':') || /^(\([A-Z0-9]+\))/.test(task);
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
