import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useApp } from '@/context/AppContext';

interface OrgCardProps {
  name: string;
  role: string;
  title: string;
  colorClass: string;
  initials: string;
  bgColorClass: string;
  textColorClass: string;
  image?: string;
  isEditing?: boolean;
  onImageUpload?: (file: File) => void;
}

const OrgCard: React.FC<OrgCardProps> = ({ name, role, title, colorClass, initials, bgColorClass, textColorClass, image, isEditing, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-2 flex flex-col items-center justify-center w-32 md:w-40 border-t-4 ${colorClass} relative z-10 transition-transform hover:-translate-y-1 duration-300 min-h-[120px] group`}>
      {isEditing && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Ubah Foto</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      )}
      
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mb-2 shadow-inner shrink-0 border border-gray-200"
        />
      ) : (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${bgColorClass} ${textColorClass} shadow-inner shrink-0`}>
          {initials}
        </div>
      )}
      
      <h3 className="font-bold text-gray-800 text-center mb-0.5 text-[10px] md:text-xs leading-tight">{name}</h3>
      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center leading-tight">{role}</p>
      {title && <p className={`text-[8px] font-bold uppercase ${textColorClass} text-center leading-tight mt-0.5`}>{title}</p>}
    </div>
  );
};

interface OrgNode {
  name: string;
  role: string;
  title?: string;
  initials: string;
  image?: string;
}

interface OrgData {
  pengetua: OrgNode;
  kaunselor: OrgNode;
  pks: OrgNode[];
  gkmps: OrgNode[];
  gurusRow1: OrgNode[];
  gurusRow2: OrgNode[];
  gurusRow3: OrgNode[];
  stafRow1: OrgNode[];
  stafRow2: OrgNode[];
}

const initialData: OrgData = {
    pengetua: { name: "Zulkeffle bin Muhammad", role: "PENGETUA", initials: "P" },
    kaunselor: { name: "Muhammad Hafiz bin Jalil", role: "KAUNSELOR", initials: "K" },
    pks: [
      { name: "Noratikah binti Abd. Kadir", role: "GURU PENOLONG KANAN", title: "PENTADBIRAN", initials: "PKP" },
      { name: "Shaharer bin Hj Husain", role: "GURU PENOLONG KANAN", title: "HEM", initials: "HEM" },
      { name: "Zulkifli bin Md Aspan", role: "GURU PENOLONG KANAN", title: "KOKURIKULUM", initials: "KOKO" },
    ],
    gkmps: [
      { name: "Saemah binti Supandi", role: "GKMP", title: "AGAMA", initials: "GA" },
      { name: "Rosmawati@Rohayati binti Hussin", role: "GKMP", title: "BAHASA", initials: "GB" },
      { name: "Zahrah Khairiah Nasution binti Saleh", role: "GKMP", title: "SAINS & MATEMATIK", initials: "GSM" },
      { name: "Nooraind binti Ali", role: "GKMP", title: "KEMANUSIAAN", initials: "GK" },
      { name: "Mazuin binti Mat", role: "GKMP", title: "TEKNIK & VOKASIONAL", initials: "GTV" },
      { name: "Nor Azean binti Ismail", role: "GKMP", title: "DINI", initials: "GD" },
    ],
    gurusRow1: [
      { name: "Nuurul Amira binti Razak", role: "GURU PERPUSTAKAAN DAN MEDIA", initials: "NA" },
      { name: "Syahidatun Najihah binti Aziz", role: "PENYELARAS BESTARI / ICT", initials: "SN" },
      { name: "Noorlela binti Zainudin", role: "GURU DATA", initials: "NZ" },
      { name: "Salman bin A. Rahman", role: "GURU AL-QURAN / GURU DISIPLIN", initials: "SR" },
      { name: "Mohamad Sukri bin Ali", role: "GURU DINI", initials: "MS" },
      { name: "Mohd Nur bin Ahmad", role: "GURU DINI", initials: "MN" },
      { name: "Mohd Nor bin Salikin", role: "GURU DINI", initials: "MNS" },
      { name: "Ahmad Fikruddin bin Ahmad Raza'i", role: "G. AKADEMIK BIASA", initials: "AF" },
      { name: "Mohammad Firros bin Rosool Gani", role: "G. AKADEMIK BIASA", initials: "MF" },
      { name: "Mohamad Nasreen Hakim bin Che Mohamed", role: "G. AKADEMIK BIASA", initials: "MH" },
    ],
    gurusRow2: [
      { name: "Zarith Najiha binti Jamal", role: "GURU DINI", initials: "ZN" },
      { name: "Masyitah binti Razali", role: "GURU DINI", initials: "MR" },
      { name: "Siti Aminah binti Mohamed", role: "GURU DINI", initials: "SA" },
      { name: "Nor Hidayah binti Mahadun", role: "GURU DINI", initials: "NH" },
      { name: "Norliyana binti Mhd. Amin", role: "GURU DINI", initials: "NM" },
      { name: "Annur Ayuni binti Mohamed", role: "GURU DINI", initials: "AA" },
      { name: "Norashidah binti A Wahab", role: "G. AKADEMIK BIASA", initials: "NW" },
      { name: "Siti Nurul Liza binti Sidin", role: "G. AKADEMIK BIASA", initials: "SL" },
      { name: "Liyana binti Iskandar", role: "G. AKADEMIK BIASA", initials: "LI" },
      { name: "Nor Ain binti Mohamed Jori", role: "G. AKADEMIK BIASA", initials: "NAM" },
    ],
    gurusRow3: [
      { name: "Nurul Izzati binti Roslin", role: "G. AKADEMIK BIASA", initials: "NI" },
      { name: "Nurul Syafiqah binti Husin", role: "G. AKADEMIK BIASA", initials: "NS" },
      { name: "Nik Noorizati binti Ab Kahar", role: "G. AKADEMIK BIASA", initials: "NN" },
    ],
    stafRow1: [
      { name: "Islahuddin bin Muchtar", role: "PENYELIA ASRAMA", initials: "IM" },
      { name: "Sadan bin Md Seth", role: "PEMBANTU OPERASI", initials: "SM" },
      { name: "Yati binti Ani", role: "PEMBANTU TADBIR (KEWANGAN)", initials: "YA" },
      { name: "Nurulasyiqin binti Razali", role: "PEMBANTU OPERASI", initials: "NR" },
      { name: "Nur Farhana binti Hassan", role: "PEMBANTU MAKMAL", initials: "NF" },
    ],
    stafRow2: [
      { name: "Muhamad Zaid bin Zamzuri", role: "PENYELARAS TAHFIZ", initials: "MZ" },
      { name: "Ali bin Abd Rahman", role: "PEMBANTU TAHFIZ", initials: "AR" },
      { name: "Aina Izlin Syafika binti Abd Rahim", role: "KERANI JPS", initials: "AI" },
    ]
};

export const Organisasi: React.FC = () => {
  const { user } = useApp();
  const [data, setData] = useState<OrgData>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('organisasiData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved organization data", e);
      }
    }
  }, []);

  const saveData = (newData: OrgData) => {
    setData(newData);
    localStorage.setItem('organisasiData', JSON.stringify(newData));
  };

  const handleImageUpload = (category: keyof OrgData, index: number | null, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newData = { ...data };

      if (index !== null && Array.isArray(newData[category])) {
        // Handle array items (pks, gkmps, gurus, staf)
        (newData[category] as OrgNode[])[index] = {
          ...(newData[category] as OrgNode[])[index],
          image: base64String
        };
      } else if (index === null && !Array.isArray(newData[category])) {
        // Handle single objects (pengetua, kaunselor)
        (newData[category] as OrgNode) = {
          ...(newData[category] as OrgNode),
          image: base64String
        };
      }

      saveData(newData);
    };
    reader.readAsDataURL(file);
  };

  const getGenderColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes(' binti ') || lower.includes(' bt ') || lower.includes(' puan ') || lower.includes(' cik ')) {
        return { border: "border-pink-500", bg: "bg-pink-50", text: "text-pink-600" };
    }
    return { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600" };
  };

  // Helper to render a group of cards with proper connecting lines
  const renderGroup = (items: OrgNode[], colorConfig: { border: string, bg: string, text: string } | null, marginTop: string = "mt-8", gapClass: string = "gap-2", desktopGapMode: boolean = false, category: keyof OrgData) => {
    return (
      <div className={`flex flex-col items-center w-full ${marginTop} relative`}>
        {/* Connector from parent */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-400"></div>
        
        {/* Horizontal bar spanning the group */}
        <div className={`relative flex justify-center ${gapClass} flex-wrap max-w-full`}>
             
             {/* Full width line for desktop gap mode */}
             {desktopGapMode && (
                <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-400 w-[calc(100%-10rem)]"></div>
             )}

             {/* Container for the row */}
             <div className={`flex justify-center ${gapClass} flex-wrap`}>
                {items.map((item, index) => {
                    const colors = colorConfig || getGenderColor(item.name);
                    return (
                        <div key={index} className="flex flex-col items-center relative pt-6">
                            {/* Top Connector Logic */}
                            <div className="absolute top-0 w-full h-6 pointer-events-none">
                                {/* Vertical line down to card */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-400"></div>
                                
                                {/* Horizontal connectors */}
                                {items.length > 1 && (
                                    <div className={desktopGapMode ? "md:hidden" : ""}>
                                        {index === 0 && <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-gray-400"></div>}
                                        {index === items.length - 1 && <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-gray-400"></div>}
                                        {index > 0 && index < items.length - 1 && <div className="absolute top-0 w-full h-0.5 bg-gray-400"></div>}
                                    </div>
                                )}
                            </div>

                            <OrgCard 
                                name={item.name}
                                role={item.role}
                                title={item.title || ""}
                                colorClass={colors.border}
                                bgColorClass={colors.bg}
                                textColorClass={colors.text}
                                initials={item.initials}
                                image={item.image}
                                isEditing={isEditing}
                                onImageUpload={(file) => handleImageUpload(category, index, file)}
                            />
                        </div>
                    );
                })}
             </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 fade-in w-full h-full flex flex-col bg-gray-300 relative overflow-hidden shadow-2xl">
      
      {/* Background Pattern: School Image Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 grayscale bg-cover bg-center"
        style={{ backgroundImage: 'url(https://i.postimg.cc/D0pqvnTy/SMAAM2024.png)' }}
      ></div>

      <div className="border-b border-gray-300 pb-4 mb-6 relative z-10 text-center">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase tracking-wide drop-shadow-sm">
          Carta Organisasi
        </h2>
        <p className="text-black font-medium mt-1 opacity-90 tracking-wider">
          Pengurusan dan Kakitangan<br />SMA Al-Khairiah Al-Islamiah Mersing
        </p>
        
        {user?.role === 'adminsistem' && (
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`absolute top-0 right-0 px-3 py-1 rounded text-xs font-bold shadow-lg transition-colors border border-gray-300 ${isEditing ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                {isEditing ? 'Tutup Edit' : 'Edit Organisasi'}
            </button>
        )}
      </div>
      
      <div className="p-4 md:p-8 w-full flex flex-col items-center overflow-x-auto relative z-10 custom-scrollbar">
        
        {/* Level 1: Pengetua */}
        <div className="flex flex-col items-center mb-0 relative z-20">
            <OrgCard 
                name={data.pengetua.name}
                role={data.pengetua.role}
                title=""
                colorClass="border-teal-500" 
                bgColorClass="bg-teal-50"
                textColorClass="text-teal-600"
                initials={data.pengetua.initials}
                image={data.pengetua.image}
                isEditing={isEditing}
                onImageUpload={(file) => handleImageUpload('pengetua', null, file)}
            />
            {/* Vertical Line Down from Parent */}
            <div className="h-8 w-0.5 bg-gray-400 relative"></div>
        </div>

        {/* Level 2: PKs */}
        {renderGroup(data.pks, { border: "border-orange-500", bg: "bg-orange-50", text: "text-orange-600" }, "mt-0", "gap-4 md:gap-16", true, 'pks')}

        {/* Level 3: GKMPs & Kaunselor */}
        <div className="w-full relative mt-12">
            {/* Center Spine Connector for Desktop (PKs to GKMPs) */}
            <div className="hidden lg:block absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-36 bg-gray-400"></div>

            {/* Kaunselor - Desktop Position: Left of Saemah, connected to Noratikah */}
            <div className="hidden lg:flex flex-col items-center absolute top-0 z-10" style={{ left: 'calc(50% - 550px)' }}>
                 {/* Connector to Center Spine */}
                 <div className="absolute top-1/2 left-1/2 w-[470px] border-t-2 border-dotted border-gray-400 pointer-events-none -z-10"></div>
                 
                 <OrgCard 
                    name={data.kaunselor.name}
                    role={data.kaunselor.role}
                    title=""
                    colorClass="border-gray-500" 
                    bgColorClass="bg-gray-50"
                    textColorClass="text-gray-600"
                    initials={data.kaunselor.initials}
                    image={data.kaunselor.image}
                    isEditing={isEditing}
                    onImageUpload={(file) => handleImageUpload('kaunselor', null, file)}
                />
            </div>

            {/* Kaunselor - Mobile/Tablet: Centered above or separate */}
            <div className="lg:hidden flex justify-center mb-8">
                <OrgCard 
                    name={data.kaunselor.name}
                    role={data.kaunselor.role}
                    title=""
                    colorClass="border-gray-500" 
                    bgColorClass="bg-gray-50"
                    textColorClass="text-gray-600"
                    initials={data.kaunselor.initials}
                    image={data.kaunselor.image}
                    isEditing={isEditing}
                    onImageUpload={(file) => handleImageUpload('kaunselor', null, file)}
                />
            </div>

            {renderGroup(data.gkmps, { border: "border-cyan-500", bg: "bg-cyan-50", text: "text-cyan-600" }, "mt-0 lg:mt-32", "gap-2", false, 'gkmps')}
        </div>

        {/* Level 4: Guru Row 1 (Gender Colors) */}
        {renderGroup(data.gurusRow1, null, "mt-8", "gap-2", false, 'gurusRow1')}

        {/* Level 4: Guru Row 2 (Gender Colors) */}
        {renderGroup(data.gurusRow2, null, "mt-8", "gap-2", false, 'gurusRow2')}

        {/* Level 4: Guru Row 3 (Gender Colors) */}
        {renderGroup(data.gurusRow3, null, "mt-8", "gap-2", false, 'gurusRow3')}

        {/* Level 5: Staf Row 1 */}
        {renderGroup(data.stafRow1, { border: "border-green-500", bg: "bg-green-50", text: "text-green-600" }, "mt-8", "gap-2", false, 'stafRow1')}

        {/* Level 5: Staf Row 2 */}
        {renderGroup(data.stafRow2, { border: "border-green-500", bg: "bg-green-50", text: "text-green-600" }, "mt-8", "gap-2", false, 'stafRow2')}

      </div>
    </div>
  );
};
