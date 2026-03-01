export interface HijriMonthData {
  id: number;
  hijriDayStart: number;
  hijriMonth1: string;
  hijriMonth2: string;
  hijriTransitionDay: number;
}

export const HIJRI_2026_DATA: HijriMonthData[] = [
  { id: 0, hijriDayStart: 11, hijriMonth1: "Rejab", hijriMonth2: "Sya'aban", hijriTransitionDay: 20 },
  { id: 1, hijriDayStart: 13, hijriMonth1: "Sya'aban", hijriMonth2: "Ramadan", hijriTransitionDay: 19 },
  { id: 2, hijriDayStart: 11, hijriMonth1: "Ramadan", hijriMonth2: "Syawal", hijriTransitionDay: 21 },
  { id: 3, hijriDayStart: 13, hijriMonth1: "Syawal", hijriMonth2: "Zulkaedah", hijriTransitionDay: 19 },
  { id: 4, hijriDayStart: 14, hijriMonth1: "Zulkaedah", hijriMonth2: "Zulhijjah", hijriTransitionDay: 18 },
  { id: 5, hijriDayStart: 15, hijriMonth1: "Zulhijjah", hijriMonth2: "Muharram", hijriTransitionDay: 17 },
  { id: 6, hijriDayStart: 15, hijriMonth1: "Muharram", hijriMonth2: "Safar", hijriTransitionDay: 16 },
  { id: 7, hijriDayStart: 17, hijriMonth1: "Safar", hijriMonth2: "Rabiulawal", hijriTransitionDay: 14 },
  { id: 8, hijriDayStart: 19, hijriMonth1: "Rabiulawal", hijriMonth2: "Rabiulakhir", hijriTransitionDay: 13 },
  { id: 9, hijriDayStart: 19, hijriMonth1: "Rabiulakhir", hijriMonth2: "Jamadilawal", hijriTransitionDay: 12 },
  { id: 10, hijriDayStart: 21, hijriMonth1: "Jamadilawal", hijriMonth2: "Jamadilakhir", hijriTransitionDay: 11 },
  { id: 11, hijriDayStart: 21, hijriMonth1: "Jamadilakhir", hijriMonth2: "Rejab", hijriTransitionDay: 11 },
];

export const getHijriDateString = (date: Date): string => {
  const year = date.getFullYear();
  // Only use this logic for 2026
  if (year === 2026) {
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const monthData = HIJRI_2026_DATA[monthIndex];
    
    let hijriDay = 0;
    let hijriMonthName = "";
    let hijriYear = "1447H"; 
    
    // Determine Hijri Year based on month
    // June (Month 5): Zulhijjah -> Muharram. Transition day 17.
    // So before June 17, it's 1447H. On/After June 17, it's 1448H.
    
    if (monthIndex > 5 || (monthIndex === 5 && day >= monthData.hijriTransitionDay)) {
        hijriYear = "1448H";
    }

    if (day < monthData.hijriTransitionDay) {
      hijriDay = monthData.hijriDayStart + (day - 1);
      hijriMonthName = monthData.hijriMonth1;
    } else {
      hijriDay = (day - monthData.hijriTransitionDay) + 1;
      hijriMonthName = monthData.hijriMonth2;
    }
    
    return `${hijriDay} ${hijriMonthName} ${hijriYear}`;
  }
  
  // Fallback for non-2026 dates
  try {
      // Pelarasan Kalendar Hijri -1 Hari (Standard adjustment)
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() - 1);

      const formatted = new Intl.DateTimeFormat('ms-MY-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kuala_Lumpur'
      }).format(adjustedDate);
      
      let finalDate = formatted;
      finalDate = finalDate.replace(/Syaaban/gi, "Sya'aban");

      if (finalDate.match(/H|Hijrah/i)) {
          return finalDate;
      }
      return finalDate + ' H';
  } catch {
      return "Kalendar Hijrah";
  }
};
