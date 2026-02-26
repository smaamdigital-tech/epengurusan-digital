
import React from 'react';

export const TakwimCutiPerayaan: React.FC = () => {
    return (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
         <div className="p-6 bg-[#0B132B] border-b border-gray-700">
            <h3 className="text-xl font-bold text-white font-montserrat uppercase">CUTI PERAYAAN TAHUN 2026</h3>
            <p className="text-sm text-gray-400">Tambahan Cuti Perayaan yang diperuntukkan oleh KPM</p>
         </div>
         <div className="overflow-x-auto p-4">
             <table className="w-full text-center border-separate border-spacing-0 border border-gray-600 min-w-[900px] lg:min-w-full">
                 <thead>
                     <tr>
                         <th rowSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600 w-1/4">CUTI PERAYAAN</th>
                         <th colSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600">TAMBAHAN CUTI PERAYAAN YANG DIPERUNTUKKAN OLEH KEMENTERIAN PENDIDIKAN MALAYSIA (KPM)</th>
                         <th rowSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600 w-1/5">CATATAN</th>
                     </tr>
                     <tr><th className="bg-[#3A506B] text-white font-bold p-3 border border-gray-600 w-1/4">KUMPULAN A</th><th className="bg-[#3A506B] text-white font-bold p-3 border border-gray-600 w-1/4">KUMPULAN B</th></tr>
                 </thead>
                 <tbody className="text-sm text-gray-300">
                     <tr className="hover:bg-[#253252] transition-colors"><td rowSpan={3} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]"><div className="mb-2 uppercase text-[#C9B458]">Tahun Baru Cina</div><div className="text-xs font-normal">17.02.2026 (Selasa)<br/>dan<br/>18.02.2026 (Rabu)</div></td><td className="p-3 border border-gray-600">15.02.2026 (Ahad)</td><td className="p-3 border border-gray-600">16.02.2026 (Isnin)</td><td rowSpan={3} className="p-3 border border-gray-600 align-middle">Tiga (3) Hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td className="p-3 border border-gray-600">16.02.2026 (Isnin)</td><td className="p-3 border border-gray-600">19.02.2026 (Khamis)</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td className="p-3 border border-gray-600">19.02.2026 (Khamis)</td><td className="p-3 border border-gray-600">20.02.2026 (Jumaat)</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td rowSpan={2} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]"><div className="mb-2 uppercase text-[#C9B458]">Hari Raya Aidilfitri</div><div className="text-xs font-normal">21.03.2026 (Sabtu)<br/>dan<br/>22.03.2026 (Ahad)</div></td><td className="p-3 border border-gray-600">19.03.2026 (Khamis)</td><td className="p-3 border border-gray-600">19.03.2026 (Khamis)</td><td rowSpan={2} className="p-3 border border-gray-600 align-middle">Satu (1) Hari Cuti Tambahan KPM untuk Kumpulan A dan <br/>Dua (2) Hari Cuti Tambahan KPM untuk Kumpulan B</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td className="p-3 border border-gray-600 bg-gray-700"></td><td className="p-3 border border-gray-600">20.03.2026 (Jumaat)</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td rowSpan={2} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]"><div className="mb-2 uppercase text-[#C9B458]">Hari Deepavali</div><div className="text-xs font-normal">08.11.2026 (Ahad)<br/>(kecuali Negeri Sarawak)</div></td><td className="p-3 border border-gray-600 align-middle">09.11.2026 (Isnin)</td><td className="p-3 border border-gray-600">10.11.2026 (Selasa)<br/><span className="text-[10px] italic">Semua Negeri Kumpulan B kecuali Negeri Sarawak</span></td><td className="p-3 border border-gray-600 align-middle">Satu (1) Hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B</td></tr>
                     <tr className="hover:bg-[#253252] transition-colors"><td className="p-3 border border-gray-600 bg-gray-700"></td><td className="p-3 border border-gray-600">09.11.2026 (Isnin)<br/><span className="text-[10px] italic">Negeri Sarawak sahaja</span></td><td className="p-3 border border-gray-600 align-middle">Satu (1) Hari Cuti Peruntukan KPM</td></tr>
                 </tbody>
             </table>
         </div>
         <div className="p-6 bg-[#0B132B] border-t border-gray-700 text-sm space-y-4">
             <div><span className="text-[#C9B458] font-bold block mb-1">KUMPULAN A:</span><p className="text-gray-400">Sekolah-sekolah di negeri Kedah, Kelantan dan Terengganu.</p></div>
             <div><span className="text-[#C9B458] font-bold block mb-1">KUMPULAN B:</span><p className="text-gray-400">Sekolah-sekolah di negeri Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan & Wilayah Persekutuan Putrajaya.</p></div>
             <div><span className="text-[#C9B458] font-bold block mb-1">CATATAN:</span><ul className="list-disc list-outside ml-5 text-gray-400 space-y-1"><li><span className="text-white font-semibold">Perayaan Hari Raya Aidilfitri:</span> 21 & 22 Mac 2026 (Dalam Cuti Penggal 1, Tahun 2026)</li><li><span className="text-white font-semibold">Pesta Kaamatan:</span> 30 & 31 Mei 2026 (Dalam Cuti Pertengahan Tahun 2026) (Sabah dan Wilayah Persekutuan Labuan sahaja)</li><li><span className="text-white font-semibold">Perayaan Hari Gawai Dayak:</span> 01 & 02 Jun 2026 (Dalam Cuti Pertengahan Tahun 2026) (Sarawak sahaja)</li><li><span className="text-white font-semibold">Perayaan Deepavali:</span> 08 November 2026 (Dalam Penggal 2) (Kecuali Sarawak)</li><li><span className="text-white font-semibold">Perayaan Hari Krismas:</span> 25 Disember 2026 (Dalam Cuti Akhir Persekolahan 2026)</li></ul></div>
         </div>
      </div>
    );
};
