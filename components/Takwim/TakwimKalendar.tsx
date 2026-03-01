import React, { useState } from 'react';

import { useApp } from '@/context/AppContext';
import { PrintPreviewModal } from '@/components/PrintPreviewModal';
import { calendar2026Data, getHijriLabel } from '@/utils/calendarData';

export const TakwimKalendar: React.FC = () => {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getFullYear() === 2026 ? new Date().getMonth() : 0);
    const month = calendar2026Data[currentMonthIndex];
    const prevMonth = () => setCurrentMonthIndex(prev => prev > 0 ? prev - 1 : 11);
    const nextMonth = () => setCurrentMonthIndex(prev => prev < 11 ? prev + 1 : 0);
    const dayHeaders = [
       { short: 'SUN', long: 'AHAD', bg: 'bg-[#fff59d]', text: 'text-red-600' }, { short: 'MON', long: 'ISNIN', bg: 'bg-[#c5e1a5]', text: 'text-[#1a237e]' }, { short: 'TUE', long: 'SELASA', bg: 'bg-[#90caf9]', text: 'text-[#1a237e]' }, { short: 'WED', long: 'RABU', bg: 'bg-[#ce93d8]', text: 'text-[#1a237e]' }, { short: 'THU', long: 'KHAMIS', bg: 'bg-[#f48fb1]', text: 'text-[#1a237e]' }, { short: 'FRI', long: 'JUMAAT', bg: 'bg-[#ffe082]', text: 'text-[#1a237e]' }, { short: 'SAT', long: 'SABTU', bg: 'bg-[#9fa8da]', text: 'text-[#1a237e]' },
    ];
    const blanks = Array.from({ length: month.startDay }, (_, i) => i);
    const days = Array.from({ length: month.daysInMonth }, (_, i) => i + 1);
    
    const [showPreview, setShowPreview] = useState(false);
    const { showToast } = useApp();

    const handleDownloadPDF = () => {
        setShowPreview(true);
    };

    const generatePDF = (element: HTMLElement) => {
        const opt = {
            margin: 5,
            filename: `Kalendar_${month.name.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        
        (window as any).html2pdf().set(opt).from(element).save().then(() => {
            showToast("PDF berjaya dimuat turun.");
        });
    };

    const executeDownload = () => {
        const element = document.getElementById('pdf-content');
        if (!element) return;

        showToast("Sedang menjana PDF...");

        if (typeof (window as any).html2pdf === 'undefined') {
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

    return (
       <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300 fade-in text-[#1a237e] max-w-7xl mx-auto font-inter">
          <style>{`
            .font-playfair { font-family: 'Playfair Display', serif !important; }
            .font-inter { font-family: 'Inter', sans-serif !important; }
            .fade-in { animation: fadeIn 0.5s ease-in-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @media print {
                body * { visibility: hidden; }
                #print-preview-modal, #print-preview-modal * { visibility: visible; }
                #print-preview-modal { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; box-shadow: none; }
                .no-print { display: none !important; }
                @page { size: A4 landscape; margin: 10mm; }
                .page-break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
                table { page-break-inside: auto; width: 100%; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            }
          `}</style>
          <div className="bg-[#0B132B] p-2 flex justify-between items-center text-white no-print">
             <div className="flex items-center gap-2">
                 <button onClick={prevMonth} className="px-2 md:px-4 py-2 hover:bg-[#3A506B] rounded text-xs md:text-sm font-inter">❮ Lepas</button>
                 <button onClick={handleDownloadPDF} className="bg-[#C9B458] text-[#0B132B] px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-400 shadow flex items-center gap-1 transition-transform hover:scale-105">
                    📥 PDF
                 </button>
             </div>
             <span className="font-bold tracking-widest text-xs md:text-base uppercase font-inter">KALENDAR 2026</span>
             <button onClick={nextMonth} className="px-2 md:px-4 py-2 hover:bg-[#3A506B] rounded text-xs md:text-sm font-inter">Depan ❯</button>
          </div>
          <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/4 p-4 md:p-6 border-r border-gray-300 bg-white">
                  <div className="border-2 border-black rounded-xl p-4 h-full relative">
                      <h3 className="text-lg md:text-xl font-bold text-black font-playfair text-center mb-4 uppercase tracking-widest border-b-2 border-black pb-2 mx-auto w-3/4">CATATAN</h3>
                      <div className="text-xs md:text-sm font-inter">{month.catatan}</div>
                      <div className="mt-8 text-[9px] md:text-[10px] text-gray-500 leading-tight font-inter">
                         <p className="font-bold mb-1">Rujukan:</p>
                         <ul className="list-disc list-outside ml-3 space-y-1">{month.rujukan.map((ref, idx) => (<li key={idx}>{ref}</li>))}</ul>
                      </div>
                  </div>
              </div>
              <div className="w-full lg:w-3/4 flex flex-col">
                  <div className="flex text-white text-center h-14 md:h-20">
                      <div className={`${month.headerColor1} w-1/4 flex items-center justify-center text-3xl md:text-6xl font-playfair font-bold`}>{currentMonthIndex + 1}</div>
                      <div className={`${month.headerColor1} w-1/2 flex items-center justify-center text-xl md:text-4xl font-playfair font-bold uppercase tracking-widest`}>{month.name.split(' ')[0]} <span className="text-sm md:text-3xl ml-1 md:ml-2">{month.name.split(' ')[1]}</span></div>
                      <div className={`${month.headerColor2} w-1/4 flex flex-col items-center justify-center font-bold px-1 md:px-2`}>
                         <span className="text-[10px] md:text-lg leading-tight uppercase font-inter">{month.islamicMonth.split(' 1')[0]}</span>
                         <span className="text-sm md:text-2xl font-inter">{month.islamicMonth.split(' ').pop()}</span>
                      </div>
                  </div>
                  <div className="flex-1 p-2 md:p-4 overflow-x-auto">
                      <div className="grid grid-cols-7 gap-1 md:gap-3 min-w-[320px]">
                          {dayHeaders.map((h, i) => (
                             <div key={i} className={`${h.bg} border-2 border-gray-400 rounded-lg md:rounded-2xl p-1 md:p-2 flex flex-col items-center justify-center h-12 md:h-16 shadow-sm`}>
                                 <span className={`text-lg md:text-3xl font-bold font-playfair ${h.text}`}>{h.short}</span>
                                 <span className={`text-[8px] md:text-[10px] font-bold tracking-widest font-inter ${h.text}`}>{h.long}</span>
                             </div>
                          ))}
                          {blanks.map(b => (<div key={`blank-${b}`} className="min-h-[50px] md:min-h-[85px]"></div>))}
                          {days.map(d => {
                             const event = month.events.find(e => e.day === d);
                             return (
                                <div key={d} className="relative border border-gray-300 md:border-2 md:border-gray-400 rounded-lg md:rounded-2xl min-h-[50px] md:min-h-[85px] bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="absolute top-0.5 right-0.5 text-[8px] md:text-[11px] font-bold text-gray-500 leading-none tracking-tighter font-inter" style={{ fontFamily: '"Arial Narrow", sans-serif' }}>{getHijriLabel(month, d)}</div>
                                    <div className="w-full flex justify-center items-center pt-3 md:pt-4 flex-1">
                                        <span className={`text-2xl md:text-5xl font-playfair font-bold z-10 ${event?.isHoliday ? 'text-red-600' : 'text-[#1a237e]'}`}>{d}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end items-center pb-0.5">
                                       {event?.isSchoolHoliday && <div className="w-full bg-yellow-300 text-[6px] md:text-[10px] font-bold text-center py-0.5 uppercase text-black mx-1 rounded font-inter">Cuti</div>}
                                       {event?.label && !event.isSchoolHoliday && (
                                           <div className={`w-full text-[6px] md:text-[9px] font-bold text-center leading-tight px-0.5 py-0.5 md:py-1 mx-1 rounded flex flex-col items-center justify-center h-full font-inter ${event.color ? event.color : 'text-black'}`}>
                                               {event.icon && <span className="text-xs md:text-lg mb-0.5">{event.icon}</span>}
                                               <span className="line-clamp-2">{event.label}</span>
                                           </div>
                                       )}
                                    </div>
                                </div>
                             )
                          })}
                      </div>
                  </div>
              </div>
          </div>

      {/* PRINT PREVIEW MODAL */}
      {showPreview && (
        <div id="print-preview-modal" className="fixed inset-0 z-[100] bg-gray-900/95 flex justify-center items-start overflow-y-auto pt-10 pb-20 print:p-0 print:bg-transparent print:static print:block print:z-auto">
            <div className="bg-white text-black w-full max-w-[297mm] min-h-[210mm] shadow-2xl relative mx-auto my-auto print:shadow-none print:w-full print:max-w-none landscape-mode">
                <div className="no-print sticky top-0 left-0 right-0 bg-[#3A506B] text-white p-4 flex justify-between items-center shadow-md z-50 mb-8 rounded-t-lg">
                    <h3 className="font-bold text-lg flex items-center gap-2">🖨️ Pratonton Cetakan</h3>
                    <div className="flex gap-3">
                        <button onClick={() => setShowPreview(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">Tutup</button>
                        <button onClick={executeDownload} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors">Muat Turun PDF</button>
                        <button onClick={handlePrint} className="bg-[#C9B458] hover:bg-yellow-500 text-[#0B132B] px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors">Cetak</button>
                    </div>
                </div>
                
                <div id="pdf-content" className="p-8 font-inter text-black h-full flex flex-col print:shadow-none print:m-0 print:p-0">
                    <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-4">
                        <img src="https://i.postimg.cc/7P9SQBg6/smaam_background_BARU.png" className="h-20 w-auto object-contain" alt="Logo Sekolah" crossOrigin="anonymous" />
                        <div className="flex-1 text-center text-black">
                            <h1 className="text-xl font-extrabold uppercase tracking-wide mb-1">SEKOLAH MENENGAH AGAMA AL-KHAIRIAH AL-ISLAMIAH MERSING</h1>
                            <h2 className="text-lg font-bold uppercase text-black">TAKWIM PERSEKOLAHAN TAHUN 2026</h2>
                        </div>
                    </div>

                    <div className="flex flex-row h-full gap-4">
                        {/* SIDEBAR NOTES */}
                        <div className="w-1/4 border-r border-gray-400 pr-4">
                            <div className="border-2 border-black rounded-lg p-3 h-full relative">
                                <h3 className="text-lg font-bold text-black font-playfair text-center mb-4 uppercase tracking-widest border-b-2 border-black pb-2 mx-auto w-3/4">CATATAN</h3>
                                <div className="text-xs font-inter">{month.catatan}</div>
                                <div className="mt-8 text-[8px] text-gray-500 leading-tight font-inter absolute bottom-2 left-2 right-2">
                                    <p className="font-bold mb-1">Rujukan:</p>
                                    <ul className="list-disc list-outside ml-3 space-y-1">{month.rujukan.map((ref, idx) => (<li key={idx}>{ref}</li>))}</ul>
                                </div>
                            </div>
                        </div>

                        {/* CALENDAR GRID */}
                        <div className="w-3/4 flex flex-col">
                            <div className="flex text-black text-center h-16 mb-2 border border-black rounded-lg overflow-hidden">
                                <div className={`${month.headerColor1} w-1/4 flex items-center justify-center text-4xl text-white font-playfair font-bold`}>{currentMonthIndex + 1}</div>
                                <div className={`${month.headerColor1} w-1/2 flex items-center justify-center text-2xl text-white font-playfair font-bold uppercase tracking-widest`}>{month.name}</div>
                                <div className={`${month.headerColor2} w-1/4 flex flex-col items-center justify-center font-bold px-2 text-white`}>
                                    <span className="text-xs leading-tight uppercase font-inter">{month.islamicMonth.split(' 1')[0]}</span>
                                    <span className="text-lg font-inter">{month.islamicMonth.split(' ').pop()}</span>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <div className="grid grid-cols-7 gap-1">
                                    {dayHeaders.map((h, i) => (
                                        <div key={i} className={`${h.bg} border border-black rounded p-1 flex flex-col items-center justify-center h-10 shadow-sm`}>
                                            <span className={`text-lg font-bold font-playfair ${h.text}`}>{h.short}</span>
                                        </div>
                                    ))}
                                    {blanks.map(b => (<div key={`blank-${b}`} className="min-h-[80px]"></div>))}
                                    {days.map(d => {
                                        const event = month.events.find(e => e.day === d);
                                        return (
                                            <div key={d} className="relative border border-black rounded min-h-[80px] bg-white flex flex-col overflow-hidden">
                                                <div className="absolute top-0.5 right-0.5 text-[8px] font-bold text-gray-500 leading-none tracking-tighter font-inter">{getHijriLabel(month, d)}</div>
                                                <div className="w-full flex justify-center items-center pt-2 flex-1">
                                                    <span className={`text-3xl font-playfair font-bold z-10 ${event?.isHoliday ? 'text-red-600' : 'text-[#1a237e]'}`}>{d}</span>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-end items-center pb-0.5">
                                                    {event?.isSchoolHoliday && <div className="w-full bg-yellow-300 text-[8px] font-bold text-center py-0.5 uppercase text-black mx-1 rounded font-inter">Cuti</div>}
                                                    {event?.label && !event.isSchoolHoliday && (
                                                        <div className={`w-full text-[7px] font-bold text-center leading-tight px-0.5 py-0.5 mx-1 rounded flex flex-col items-center justify-center h-full font-inter ${event.color ? event.color : 'text-black'}`}>
                                                            {event.icon && <span className="text-xs mb-0.5">{event.icon}</span>}
                                                            <span className="line-clamp-2">{event.label}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 text-center text-[8px] italic text-gray-500">
                        Dicetak pada {new Date().toLocaleDateString('ms-MY')} melalui Sistem Pengurusan Digital SMAAM
                    </div>
                </div>
            </div>
        </div>
      )}
       </div>
    );
};
