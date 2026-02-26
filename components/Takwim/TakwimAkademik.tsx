
import React from 'react';

export const TakwimAkademik: React.FC = () => {
     return (
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in text-white">
             {/* HEADER TITLE */}
             <div className="p-6 bg-[#0B132B] border-b border-gray-700 text-center">
                <h3 className="text-xl font-bold text-[#C9B458] font-montserrat uppercase tracking-wider">KALENDAR AKADEMIK SESI 2026</h3>
                <p className="text-sm text-gray-400 mt-2 font-semibold">KUMPULAN B</p>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
                  Sekolah-sekolah di negeri: Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan & Wilayah Persekutuan Putrajaya
                </p>
             </div>

             <div className="overflow-x-auto p-4 md:p-8 bg-white/5">
                 <table className="w-full min-w-[800px] lg:min-w-full text-center border-separate border-spacing-0 border border-gray-800 bg-[#1C2541] text-sm shadow-2xl">
                     <thead>
                         <tr className="bg-[#C9B458] text-[#0B132B] font-extrabold text-base uppercase tracking-tight">
                             <th className="p-3 border border-gray-800 w-24 bg-[#C9B458]">PENGGAL</th>
                             <th className="p-3 border border-gray-800">MULA<br/>PERSEKOLAHAN</th>
                             <th className="p-3 border border-gray-800">AKHIR<br/>PERSEKOLAHAN</th>
                             <th className="p-3 border border-gray-800 w-24">JUMLAH<br/>HARI</th>
                             <th className="p-3 border border-gray-800 w-24">JUMLAH<br/>MINGGU</th>
                         </tr>
                     </thead>
                     <tbody className="text-gray-300">
                         {/* PENGGAL 1 - BLOCK 1 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B] sticky left-0 z-10">1</td>
                             <td className="border border-gray-700 p-2">12.01.2026</td>
                             <td className="border border-gray-700 p-2">31.01.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">10</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.02.2026</td>
                             <td className="border border-gray-700 p-2">28.02.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.03.2026</td>
                             <td className="border border-gray-700 p-2">20.03.2026</td>
                             <td className="border border-gray-700 p-2">13</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">43</td>
                         </tr>

                         {/* CUTI PENGGAL 1 */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td className="sticky left-0 z-10 bg-[#C9B458] border border-gray-800"></td>
                             <td colSpan={4} className="border border-gray-800 p-2 uppercase">CUTI PENGGAL 1, TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B] sticky left-0 z-10"></td>
                             <td className="border border-gray-700 p-2">21.03.2026</td>
                             <td className="border border-gray-700 p-2">29.03.2026</td>
                             <td className="border border-gray-700 p-2">9</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">1</td>
                         </tr>

                         {/* PENGGAL 1 - BLOCK 2 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B] sticky left-0 z-10">1</td>
                             <td className="border border-gray-700 p-2">30.03.2026</td>
                             <td className="border border-gray-700 p-2">31.03.2026</td>
                             <td className="border border-gray-700 p-2">2</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">8</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.04.2026</td>
                             <td className="border border-gray-700 p-2">30.04.2026</td>
                             <td className="border border-gray-700 p-2">22</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.05.2026</td>
                             <td className="border border-gray-700 p-2">22.05.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">39</td>
                         </tr>

                         {/* CUTI PERTENGAHAN TAHUN */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td className="sticky left-0 z-10 bg-[#C9B458] border border-gray-800"></td>
                             <td colSpan={4} className="border border-gray-800 p-2 uppercase">CUTI PERTENGAHAN TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B] sticky left-0 z-10"></td>
                             <td className="border border-gray-700 p-2">23.05.2026</td>
                             <td className="border border-gray-700 p-2">07.06.2026</td>
                             <td className="border border-gray-700 p-2">16</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">2</td>
                         </tr>

                         {/* PENGGAL 2 - BLOCK 1 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">2</td>
                             <td className="border border-gray-700 p-2">08.06.2026</td>
                             <td className="border border-gray-700 p-2">30.06.2026</td>
                             <td className="border border-gray-700 p-2">16</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">12</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.07.2026</td>
                             <td className="border border-gray-700 p-2">31.07.2026</td>
                             <td className="border border-gray-700 p-2">23</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.08.2026</td>
                             <td className="border border-gray-700 p-2">28.08.2026</td>
                             <td className="border border-gray-700 p-2">19</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">58</td>
                         </tr>

                         {/* CUTI PENGGAL 2 */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td className="sticky left-0 z-10 bg-[#C9B458] border border-gray-800"></td>
                             <td colSpan={4} className="border border-gray-800 p-2 uppercase">CUTI PENGGAL 2, TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B] sticky left-0 z-10"></td>
                             <td className="border border-gray-700 p-2">29.08.2026</td>
                             <td className="border border-gray-700 p-2">06.09.2026</td>
                             <td className="border border-gray-700 p-2">9</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">1</td>
                         </tr>

                         {/* PENGGAL 2 - BLOCK 2 */}
                         <tr>
                             <td rowSpan={5} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">2</td>
                             <td className="border border-gray-700 p-2">07.09.2026</td>
                             <td className="border border-gray-700 p-2">30.09.2026</td>
                             <td className="border border-gray-700 p-2">17</td>
                             <td rowSpan={5} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">13</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.10.2026</td>
                             <td className="border border-gray-700 p-2">31.10.2026</td>
                             <td className="border border-gray-700 p-2">22</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.11.2026</td>
                             <td className="border border-gray-700 p-2">30.11.2026</td>
                             <td className="border border-gray-700 p-2">19</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.12.2026</td>
                             <td className="border border-gray-700 p-2">04.12.2026</td>
                             <td className="border border-gray-700 p-2">4</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">62</td>
                         </tr>

                         {/* CUTI AKHIR PERSEKOLAHAN */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td className="sticky left-0 z-10 bg-[#C9B458] border border-gray-800"></td>
                             <td colSpan={4} className="border border-gray-800 p-2 uppercase">CUTI AKHIR PERSEKOLAHAN TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B] sticky left-0 z-10"></td>
                             <td className="border border-gray-700 p-2">05.12.2026</td>
                             <td className="border border-gray-700 p-2">31.12.2026</td>
                             <td className="border border-gray-700 p-2">27</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">4</td>
                         </tr>

                     </tbody>
                 </table>
             </div>
        </div>
     );
  };
