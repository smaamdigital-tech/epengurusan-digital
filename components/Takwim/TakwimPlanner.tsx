import React from 'react';
import { TakwimKalendar } from './TakwimKalendar';
import { TakwimAkademik } from './TakwimAkademik';
import { TakwimMinggu } from './TakwimMinggu';
import { TakwimCutiPerayaan } from './TakwimCutiPerayaan';
import { TakwimCutiJohor } from './TakwimCutiJohor';

interface TakwimPlannerProps {
  type: string;
}

export const TakwimPlanner: React.FC<TakwimPlannerProps> = ({ type }) => {
  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20">
      <div className="border-b border-gray-400 pb-4">
        <h2 className="text-3xl font-bold text-black font-montserrat uppercase">
          {type}
        </h2>
        <p className="text-black font-medium mt-1 opacity-80">{type === 'Kalendar' ? 'Kalendar Tahunan 2026' : type === 'Kalendar Akademik' ? 'Kalendar Akademik Sesi 2026' : type === 'Minggu Persekolahan' ? 'Jadual Minggu Persekolahan' : type === 'Cuti Perayaan' ? 'Senarai Cuti Perayaan KPM' : type === 'Cuti Umum Johor' ? 'Senarai Cuti Umum Negeri Johor' : ''}</p>
      </div>

      {type === 'Kalendar' && <TakwimKalendar />}
      {type === 'Kalendar Akademik' && <TakwimAkademik />}
      {type === 'Minggu Persekolahan' && <TakwimMinggu />}
      {type === 'Cuti Perayaan' && <TakwimCutiPerayaan />}
      {type === 'Cuti Umum Johor' && <TakwimCutiJohor />}
    </div>
  );
};