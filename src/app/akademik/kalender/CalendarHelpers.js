export const MONTH_MAP = {
  'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12',
  'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'mei': '05', 'juni': '06'
};

export const getParsedEvents = (initialCalendar) => {
  const list = [];
  (initialCalendar || []).forEach(evt => {
    const datesStr = (evt.dates || '').toLowerCase();
    const monthStr = (evt.month || '').toLowerCase();
    const yearMatch = (datesStr + ' ' + monthStr).match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : '2026';
    
    let monthNum = null;
    for (const [name, num] of Object.entries(MONTH_MAP)) {
      if (datesStr.includes(name) || monthStr.includes(name)) { monthNum = num; break; }
    }
    if (!monthNum) return;

    const rangeMatch = datesStr.match(/\b(\d{1,2})\b\s*-\s*\b(\d{1,2})\b/);
    const singleMatch = datesStr.match(/\b(\d{1,2})\b/);

    let type = 'event';
    const desc = (evt.desc || '').toLowerCase();
    if (desc.includes('libur') || desc.includes('cuti') || desc.includes('raya')) type = 'holiday';
    else if (desc.includes('asesmen') || desc.includes('ujian') || desc.includes('aat') || desc.includes('ats')) type = 'exam';
    else if (desc.includes('mpls') || desc.includes('orientasi')) type = 'mpls';
    else if (desc.includes('rapor') || desc.includes('kenaikan')) type = 'report';

    const pushDates = (start, end) => {
      for (let d = start; d <= end; d++) {
        list.push({
          dateStr: `${year}-${monthNum}-${String(d).padStart(2, '0')}`,
          title: evt.desc || 'Kegiatan Sekolah',
          type,
          desc: evt.desc || ''
        });
      }
    };

    if (rangeMatch) pushDates(parseInt(rangeMatch[1]), parseInt(rangeMatch[2]));
    else if (singleMatch) pushDates(parseInt(singleMatch[1]), parseInt(singleMatch[1]));
  });
  return list;
};

export const getRpeData = (sem, initialCalendar, parsedEvents) => {
  const list = sem === 'ganjil' 
    ? [
        { bulan: "Juli 2026", jm: 4, fallbackMte: 2, defaultKet: "Masa MPLS Kelas I" },
        { bulan: "Agustus 2026", jm: 4, fallbackMte: 0, defaultKet: "Pembelajaran Efektif & HUT RI" },
        { bulan: "September 2026", jm: 5, fallbackMte: 1, defaultKet: "Asesmen Tengah Semester (ATS)" },
        { bulan: "Oktober 2026", jm: 4, fallbackMte: 0, defaultKet: "Simulasi ANBK" },
        { bulan: "November 2026", jm: 4, fallbackMte: 1, defaultKet: "Pelaksanaan ANBK" },
        { bulan: "Desember 2026", jm: 5, fallbackMte: 3, defaultKet: "Asesmen Akhir Semester & Libur Semester 1" }
      ]
    : [
        { bulan: "Januari 2027", jm: 4, fallbackMte: 1, defaultKet: "Awal Semester Genap" },
        { bulan: "Februari 2027", jm: 4, fallbackMte: 0, defaultKet: "Pembelajaran Efektif" },
        { bulan: "Maret 2027", jm: 5, fallbackMte: 2, defaultKet: "Libur Ramadan & Try Out Sekolah" },
        { bulan: "April 2027", jm: 4, fallbackMte: 2, defaultKet: "Libur Idul Fitri & ATS Genap" },
        { bulan: "Mei 2027", jm: 4, fallbackMte: 1, defaultKet: "Ujian Sekolah Utama Kelas VI" },
        { bulan: "Juni 2027", jm: 5, fallbackMte: 3, defaultKet: "Asesmen Akhir Tahun & Libur TA" }
      ];

  return list.map((item, idx) => {
    const matchMonth = item.bulan.toLowerCase().split(' ')[0];
    const monthNum = MONTH_MAP[matchMonth];
    const year = item.bulan.split(' ')[1];
    
    const holidaysCount = parsedEvents.filter(e => {
      if (e.type !== 'holiday') return false;
      const [y, m, d] = e.dateStr.split('-');
      if (y !== year || m !== monthNum) return false;
      const dayOfWeek = new Date(y, parseInt(m) - 1, parseInt(d)).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6;
    }).length;

    const calculatedMte = holidaysCount > 0 ? Math.min(item.jm, Math.ceil(holidaysCount / 5)) : item.fallbackMte;
    const me = Math.max(0, item.jm - calculatedMte);
    const matchedAgenda = initialCalendar.find(e => (e.month || '').toLowerCase().includes(matchMonth));
    const ket = matchedAgenda ? matchedAgenda.desc : item.defaultKet;

    return { id: idx + 1, bulan: item.bulan, jm: item.jm, mte: calculatedMte, me, ket };
  });
};
