'use client';

import { useState, useEffect } from 'react';
import GradesClient from '../app/nilai/GradesClient';
import CalendarTab from './academic/CalendarTab';
import P5Tab from './academic/P5Tab';
import KbmTab from './academic/KbmTab';
import AcademicEventModal from './academic/AcademicEventModal';
import { MPLS_RUNDOWN } from '../data/mplsRundown';

export default function AcademicPortal({ initialCalendar = [], initialP5Projects = [], initialJadwalKBM = [] }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeMplsDay, setActiveMplsDay] = useState(0);
  const [countdowns, setCountdowns] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const MONTH_MAP = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };

    const datesMap = {};
    initialCalendar.forEach(evt => {
      if (!evt.id) return;
      const datesStr = (evt.dates || '').toLowerCase();
      const monthStr = (evt.month || '').toLowerCase();
      const yearMatch = (datesStr + ' ' + monthStr).match(/\b(20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : null;
      let monthNum = null;
      for (const [name, num] of Object.entries(MONTH_MAP)) {
        if (datesStr.includes(name) || monthStr.includes(name)) { monthNum = num; break; }
      }
      const dayMatch = datesStr.match(/\b(\d{1,2})\b/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      if (year && monthNum) {
        datesMap[evt.id] = `${year}-${monthNum}-${day}`;
      }
    });

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const updated = {};

      Object.entries(datesMap).forEach(([id, dateStr]) => {
        const target = new Date(dateStr + 'T07:15:00').getTime();
        const diff = target - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          updated[id] = `${days} Hari ${hours} Jam`;
        } else {
          updated[id] = 'Sedang/Sudah Terlaksana';
        }
      });
      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCalendar]);

  const getParentTips = (id) => {
    const tips = {
      juli: [
        "Temani anak merapikan peralatan tulis dan tas baru di malam sebelum hari pertama sekolah.",
        "Ajarkan anak untuk berani memperkenalkan diri and tersenyum ramah pada guru kelas barunya.",
        "Pastikan anak sarapan pagi sehat and tidur cukup di bawah pukul 21.00 malam selama pekan MPLS."
      ],
      agustus: [
        "Bantu anak mempersiapkan pakaian olahraga bersih atau kaos bernuansa merah-putih untuk perlombaan.",
        "Saksikan bersama anak perlombaan antar kelas di sekolah untuk memberikan dukungan moral langsung.",
        "Ajak anak menghias gapura atau halaman rumah dengan bendera merah putih kecil."
      ],
      september: [
        "Pastikan anak tidak begadang dan memiliki waktu istirahat yang sangat cukup sebelum hari ANBK.",
        "Latih anak menggunakan komputer/laptop sederhana di rumah jika tersedia (fokus navigasi mouse).",
        "Hindari memberikan beban belajar berlebih di malam hari agar anak tidak mengalami jenuh/stres mental."
      ],
      desember: [
        "Buat jadwal belajar bersama yang nyaman, diselingi istirahat 10 menit setiap belajar 25 menit.",
        "Pastikan anak makan buah dan minum air putih hangat yang cukup agar stamina fisik terjaga prima.",
        "Fokuslah memberikan pujian pada usaha keras anak mempelajari materi, bukan hanya pada hasil nilai angka rapornya."
      ],
      maret: [
        "Dampingi anak memahami esensi ibadah puasa Ramadan sejak dini melalui cerita kisah teladan.",
        "Manfaatkan waktu libur awal puasa untuk sahur bersama, shalat berjamaah, dan tadarus keluarga.",
        "Diskusikan nilai kepedulian sosial dengan mengajak anak berbagi takjil ringan kepada tetangga."
      ],
      juni: [
        "Ajak anak meninjau kembali catatan materi setahun terakhir secara santai dan ceria.",
        "Siapkan rencana liburan keluarga yang edukatif dan menyehatkan setelah pembagian rapor usai.",
        "Sediakan waktu luang untuk berdialog dengan guru kelas saat pengambilan rapor mengenai tumbuh kembang anak."
      ]
    };
    return tips[id] || ["Dampingi belajar anak setiap hari, pastikan tidur cukup dan sarapan sehat sebelum berangkat sekolah."];
  };

  const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
  const currentMonth = months[new Date().getMonth()];

  const tabButtons = [
    { id: 'calendar', label: 'Agenda Akademik', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg> },
    { id: 'p5', label: 'Portal Proyek P5', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 14a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6m0 16a6 6 0 0 0 6-6V9a6 6 0 0 0-6-6" /></svg> },
    { id: 'kbm', label: 'Jadwal KBM Harian', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.5a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.5v16.5" /></svg> },
    { id: 'grades', label: 'Rapor Siswa', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 18.375v-5.25ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> }
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '6px', borderRadius: 'var(--radius-full)', maxWidth: '720px', margin: '0 auto', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-inset)', flexWrap: 'wrap', gap: '4px' }}>
        {tabButtons.map(btn => (
          <button key={btn.id} onClick={() => setActiveTab(btn.id)} style={{ flex: '1 1 140px', padding: '10px 16px', borderRadius: 'var(--radius-full)', border: 'none', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.25s ease', backgroundColor: activeTab === btn.id ? 'var(--primary)' : 'transparent', color: activeTab === btn.id ? 'white' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {activeTab === 'calendar' && <CalendarTab initialCalendar={initialCalendar} currentMonth={currentMonth} countdowns={countdowns} onEventClick={setSelectedEvent} />}
      {activeTab === 'p5' && <P5Tab initialP5Projects={initialP5Projects} />}
      {activeTab === 'kbm' && <KbmTab initialJadwalKBM={initialJadwalKBM} />}
      {activeTab === 'grades' && (
        <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>Masukkan NISN dan Tanggal Lahir siswa untuk mengakses data rapor hasil belajar digital Kurikulum Merdeka secara aman.</p>
          <GradesClient />
        </div>
      )}

      <AcademicEventModal selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} mounted={mounted} countdowns={countdowns} activeMplsDay={activeMplsDay} setActiveMplsDay={setActiveMplsDay} MPLS_RUNDOWN={MPLS_RUNDOWN} getParentTips={getParentTips} />

      <style jsx>{`
        @keyframes tabFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .p5-grid-card { display: grid; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .p5-grid-card { grid-template-columns: minmax(200px, 1fr) 2fr; } }
      `}</style>
    </div>
  );
}
