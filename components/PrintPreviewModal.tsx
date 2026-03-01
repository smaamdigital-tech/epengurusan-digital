import React, { ReactNode, useEffect } from 'react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  title: string;
  orientation?: 'portrait' | 'landscape';
  children: ReactNode;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  onPrint,
  title,
  orientation = 'portrait',
  children
}) => {
  useEffect(() => {
    if (isOpen && typeof (window as any).html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      document.head.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const element = document.getElementById('pdf-content');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `${title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: orientation }
      };

      if (typeof (window as any).html2pdf !== 'undefined') {
        (window as any).html2pdf().set(opt).from(element).save();
      } else {
        alert('Sistem sedang memuat turun komponen PDF. Sila cuba sebentar lagi.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:p-0 print:bg-transparent print:static print:block print:z-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-preview-modal, #print-preview-modal * {
            visibility: visible;
          }
          #print-preview-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 ${orientation};
            margin: 10mm;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
        
        /* Preview styling */
        .preview-container {
          width: ${orientation === 'landscape' ? '297mm' : '210mm'};
          min-height: ${orientation === 'landscape' ? '210mm' : '297mm'};
          background: white;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          padding: 10mm;
        }
        
        /* Ensure tables don't break awkwardly in preview */
        .preview-container table {
          width: 100%;
          border-collapse: collapse;
        }
        .preview-container tr {
          page-break-inside: avoid;
        }
      `}</style>

      <div id="print-preview-modal" className="bg-white rounded-lg shadow-2xl w-full max-h-[95vh] flex flex-col max-w-7xl print:shadow-none print:max-h-none print:w-full print:max-w-none">
        
        {/* Header - Hidden when printing */}
        <div className="no-print flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Pratonton Cetakan: {title}
          </h2>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Tutup
            </button>
            <button onClick={handleDownload} className="px-5 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Muat Turun PDF
            </button>
            <button onClick={handlePrint} className="px-5 py-2 bg-[#C9B458] text-[#0B132B] hover:bg-yellow-500 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Cetak
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-200 print:p-0 print:bg-white print:overflow-visible">
          <div className="preview-container print:shadow-none print:m-0 print:p-0" id="pdf-content">
            {children}
          </div>
        </div>
        
      </div>
    </div>
  );
};
