import React from 'react';

export const ProfilSekolah: React.FC = () => {
  return (
    <div className="p-4 md:p-8 pb-20 fade-in w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL - PRINCIPAL & SPEECH */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-[#1C2541] rounded-xl shadow-2xl border border-gray-700 overflow-hidden relative p-8 text-center group">
              {/* Decorative Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                 <span className="text-[200px] font-bold text-white">SMAAM</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-40 h-40 rounded-full border-4 border-[#C9B458] shadow-[0_0_20px_rgba(201,180,88,0.3)] mb-6 overflow-hidden bg-[#0B132B] flex items-center justify-center relative">
                    <img 
                      src="https://i.postimg.cc/sx9LSzZv/us-zul.png" 
                      alt="Zulkeffle bin Muhammad" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                 </div>
                 
                 <h2 className="text-xl font-bold text-[#C9B458] font-montserrat uppercase tracking-wide mb-1">
                    Zulkeffle bin Muhammad
                 </h2>
                 <p className="text-white font-medium text-sm mb-6 bg-[#0B132B] px-4 py-1 rounded-full border border-gray-700">
                    Pengetua SMAAM
                 </p>

                 <div className="w-full border-t border-gray-700 my-4"></div>

                 <h3 className="text-[#C9B458] font-bold text-sm tracking-[0.2em] mb-4 uppercase">
                    "Ucapan Pentadbir"
                 </h3>

                 <blockquote className="text-gray-300 italic text-sm leading-relaxed font-light">
                    "Selamat datang ke SMA Al-Khairiah Al-Islamiah Mersing. Bersama-sama kita membentuk generasi ulul albab yang cemerlang di dunia dan akhirat."
                 </blockquote>
              </div>
           </div>
        </div>

        {/* RIGHT PANEL - SCHOOL INFO */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="bg-[#1C2541] rounded-xl shadow-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-[#C9B458] font-montserrat mb-6 border-b-2 border-[#C9B458] pb-2 inline-block">
                 MAKLUMAT ASAS SEKOLAH
              </h2>

              {/* DATA UTAMA */}
              <div className="mb-8">
                 <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                    Data Utama
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                    <div className="md:col-span-3 text-gray-400 font-semibold">Nama Sekolah:</div>
                    <div className="md:col-span-9 text-white font-medium uppercase">SMA AL-KHAIRIAH AL-ISLAMIAH MERSING</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Kod Sekolah:</div>
                    <div className="md:col-span-9 text-white font-medium">JFT4001</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Alamat:</div>
                    <div className="md:col-span-9 text-white font-medium">49/3, Jalan Awang Daik, 86800 Mersing, Johor</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Emel:</div>
                    <div className="md:col-span-9 text-white font-medium">smaam_mersing@yahoo.com.my</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">No. Telefon:</div>
                    <div className="md:col-span-9 text-white font-medium flex justify-between">
                       <span>07-7996272</span>
                       <span className="text-[#C9B458] text-xs border border-[#C9B458] px-2 py-0.5 rounded">Gred / Status: A | Luar Bandar</span>
                    </div>
                 </div>
              </div>

              {/* STATISTIK */}
              <div className="mb-8 bg-[#0B132B] rounded-lg p-4 border border-gray-700">
                 <h3 className="text-[#C9B458] font-bold text-sm mb-3 uppercase tracking-wider">
                    Statistik Semasa
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                       <span className="text-gray-300">Jumlah Guru:</span>
                       <div className="text-right">
                          <span className="text-xl font-bold text-white block">34 orang</span>
                          <span className="text-[10px] text-gray-500">(L: 11 | P: 23)</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                       <span className="text-gray-300">Jumlah Murid:</span>
                       <div className="text-right">
                          <span className="text-xl font-bold text-white block">313 orang</span>
                          <span className="text-[10px] text-gray-500">(L: 134 | P: 179)</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* MISI, VISI, MOTO */}
              <div className="mb-8 space-y-5">
                 <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                    Misi, Visi, Moto, Slogan & Piagam
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                    <div className="md:col-span-3 text-gray-400 font-semibold">Misi:</div>
                    <div className="md:col-span-9 text-white">Melestarikan Sistem Pendidikan Yang Berkualiti Untuk Membangunkan Potensi Individu Bagi Memenuhi Aspirasi Negara</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Visi:</div>
                    <div className="md:col-span-9 text-white">Sekolah Menengah Agama Al-Khairiah Al- Islamiah Mersing Ke Arah Pendidikan Berkualiti Insan Terdidik Negara Sejahtera</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Moto:</div>
                    <div className="md:col-span-9 text-[#C9B458] font-bold tracking-widest uppercase">Al-Quran Panduan Hidup</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Slogan:</div>
                    <div className="md:col-span-9 text-white italic">SMAAM Hebat</div>

                    <div className="md:col-span-3 text-gray-400 font-semibold">Piagam Pelanggan:</div>
                    <div className="md:col-span-9 text-white text-justify">
                        <p className="mb-3">Kami; Pentadbir, Guru Dan Kakitangan SMA Al-Khairiah Al-Islamiah Mersing Dengan Penuh Tekad Dan Iltizam Berikrar Memberikan Perkhidmatan Terbaik Kepada Semua Pelanggan Dengan:</p>
                        <ul className="list-disc ml-5 space-y-2 text-gray-300">
                            <li>Prihatin Dalam Semua Perkara Serta Berusaha Mengatasi Sebarang Masalah Yang Mereka Hadapi Dengan Penuh Kasih Sayang</li>
                            <li>Berkesan Dalam Mendidik Untuk Mencapai Kecemerlangan Akademik, Sahsiah Dan Kokurikulum</li>
                            <li>Penuh Ikhlas Dan Bertenaga Untuk Merealisasikan Visi Dan Misi Sekolah</li>
                            <li>Amanah Dan Ikhlas Dalam Mentarbiah Supaya Mendapat Keredhaan Daripada Allah SWT</li>
                            <li>Segera Bertindak Melaksanakan Tugas, Proaktif, Kreatif Dan Inovatif</li>
                        </ul>
                    </div>
                 </div>
              </div>

              {/* PENTADBIRAN */}
              <div>
                 <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                    Pentadbiran
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                    <div className="md:col-span-3 text-gray-400 font-semibold">Nama Pengetua:</div>
                    <div className="md:col-span-9 text-white font-medium">Zulkeffle bin Muhammad</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">Jawatan:</div>
                    <div className="md:col-span-9 text-white font-medium">Pengetua SMAAM</div>
                    
                    <div className="md:col-span-3 text-gray-400 font-semibold">No. HP:</div>
                    <div className="md:col-span-9 text-white font-medium">019-7711615</div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};