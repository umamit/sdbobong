'use client';

import { useState } from 'react';
import Link from 'next/link';

// Detailed calendar events for TA 2026/2027
const ACADEMIC_EVENTS = [
  // Ganjil 2026
  { date: "2026-07-01", toDate: "2026-07-11", title: "Libur Akhir TA 2025/2026", type: "holiday", desc: "Libur panjang kenaikan kelas" },
  { date: "2026-07-13", title: "Awal Tahun Ajaran 2026/2027", type: "event", desc: "Hari pertama masuk sekolah" },
  { date: "2026-07-13", toDate: "2026-07-17", title: "Masa Pengenalan Lingkungan Sekolah (MPLS)", type: "mpls", desc: "Kegiatan orientasi siswa baru kelas I" },
  { date: "2026-08-17", title: "Hari Kemerdekaan Republik Indonesia", type: "holiday", desc: "Libur nasional" },
  { date: "2026-08-25", title: "Maulid Nabi Muhammad SAW", type: "holiday", desc: "Libur nasional" },
  { date: "2026-09-14", toDate: "2026-09-19", title: "Asesmen Tengah Semester (ATS) Ganjil", type: "exam", desc: "Evaluasi belajar tengah semester" },
  { date: "2026-10-26", toDate: "2026-10-29", title: "Asesmen Nasional (ANBK) Utama Fase C", type: "exam", desc: "Asesmen mutu sekolah kelas V" },
  { date: "2026-11-25", title: "Hari Guru Nasional / HUT PGRI", type: "event", desc: "Apresiasi guru & pentas seni kecil sekolah" },
  { date: "2026-12-07", toDate: "2026-12-12", title: "Asesmen Akhir Semester (AAS) Ganjil", type: "exam", desc: "Evaluasi belajar akhir semester 1" },
  { date: "2026-12-14", toDate: "2026-12-17", title: "Class Meeting & Pekan Kreativitas P5", type: "event", desc: "Lomba antar kelas dan pameran karya seni" },
  { date: "2026-12-18", toDate: "2026-12-19", title: "Pembagian Rapor Semester Ganjil", type: "report", desc: "Penyerahan laporan hasil belajar kepada orang tua" },
  { date: "2026-12-24", title: "Cuti Bersama Hari Raya Natal", type: "holiday", desc: "Cuti bersama nasional" },
  { date: "2026-12-25", title: "Hari Raya Natal", type: "holiday", desc: "Libur nasional" },
  { date: "2026-12-21", toDate: "2027-01-02", title: "Libur Semester Ganjil", type: "holiday", desc: "Libur akhir semester 1" },

  // Genap 2027
  { date: "2027-01-01", title: "Tahun Baru Masehi 2027", type: "holiday", desc: "Libur nasional" },
  { date: "2027-01-04", title: "Awal Semester Genap", type: "event", desc: "Mulai pembelajaran semester 2" },
  { date: "2027-01-05", title: "Isra Mikraj 1448 H", type: "holiday", desc: "Libur nasional" },
  { date: "2027-02-06", title: "Tahun Baru Imlek 2578 Kongzili", type: "holiday", desc: "Libur nasional" },
  { date: "2027-02-08", title: "Libur Khusus Awal Puasa Ramadan 1448 H", type: "holiday", desc: "Libur permulaan puasa" },
  { date: "2027-03-08", toDate: "2027-03-13", title: "Try Out Asesmen Sekolah Kelas VI", type: "exam", desc: "Persiapan ujian sekolah kelas VI" },
  { date: "2027-03-09", title: "Hari Raya Nyepi (Tahun Baru Saka 1949)", type: "holiday", desc: "Libur nasional" },
  { date: "2027-03-10", toDate: "2027-03-11", title: "Hari Raya Idulfitri 1448 H", type: "holiday", desc: "Libur nasional" },
  { date: "2027-03-26", title: "Wafat Yesus Kristus (Jumat Agung)", type: "holiday", desc: "Libur nasional" },
  { date: "2027-04-19", toDate: "2027-04-24", title: "Asesmen Tengah Semester (ATS) Genap", type: "exam", desc: "Evaluasi belajar tengah semester genap" },
  { date: "2027-05-01", title: "Hari Buruh Internasional", type: "holiday", desc: "Libur nasional" },
  { date: "2027-05-06", title: "Hari Kenaikan Yesus Kristus", type: "holiday", desc: "Libur nasional" },
  { date: "2027-05-10", toDate: "2027-05-15", title: "Ujian Sekolah Utama Kelas VI", type: "exam", desc: "Evaluasi akhir kelulusan kelas VI" },
  { date: "2027-05-17", title: "Hari Raya Iduladha 1448 H", type: "holiday", desc: "Libur nasional" },
  { date: "2027-05-20", title: "Hari Raya Waisak 2571 BE", type: "holiday", desc: "Libur nasional" },
  { date: "2027-06-01", title: "Hari Lahir Pancasila", type: "holiday", desc: "Libur nasional" },
  { date: "2027-06-06", title: "Tahun Baru Islam 1449 H", type: "holiday", desc: "Libur nasional" },
  { date: "2027-06-07", toDate: "2027-06-12", title: "Asesmen Akhir Tahun (AAT)", type: "exam", desc: "Ujian kenaikan kelas" },
  { date: "2027-06-14", toDate: "2027-06-17", title: "Class Meeting & Rapat Kelulusan", type: "event", desc: "Pengolahan nilai rapor dan rapat pleno guru" },
  { date: "2027-06-18", toDate: "2027-06-19", title: "Pembagian Rapor Semester Genap", type: "report", desc: "Penyerahan rapor akhir tahun pelajaran" },
  { date: "2027-06-21", toDate: "2027-07-10", title: "Libur Akhir Tahun Ajaran", type: "holiday", desc: "Libur akhir tahun ajaran 2026/2027" },
  { date: "2027-07-12", title: "Awal Tahun Ajaran 2027/2028", type: "event", desc: "Permulaan tahun ajaran baru" }
];

// RPE Data
const RPE_GANJIL = [
  { id: 1, bulan: "Juli 2026", jm: 4, mte: 2, me: 2, ket: "Libur Semester Genap TA 2025/2026 & Pekan MPLS Kelas I" },
  { id: 2, bulan: "Agustus 2026", jm: 4, mte: 0, me: 4, ket: "Pembelajaran Efektif & Upacara Peringatan HUT RI ke-81" },
  { id: 3, bulan: "September 2026", jm: 5, mte: 1, me: 4, ket: "Pelaksanaan Asesmen Tengah Semester (ATS) Ganjil" },
  { id: 4, bulan: "Oktober 2026", jm: 4, mte: 0, me: 4, ket: "Pembelajaran Efektif & Pelaksanaan Simulasi ANBK" },
  { id: 5, bulan: "November 2026", jm: 4, mte: 1, me: 3, ket: "Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK)" },
  { id: 6, bulan: "Desember 2026", jm: 5, mte: 3, me: 2, ket: "Asesmen Akhir Semester, Pengolahan Rapor, & Libur Semester 1" }
];

const RPE_GENAP = [
  { id: 1, bulan: "Januari 2027", jm: 4, mte: 1, me: 3, ket: "Libur Tahun Baru & Awal Semester Genap" },
  { id: 2, bulan: "Februari 2027", jm: 4, mte: 0, me: 4, ket: "Pembelajaran Efektif & Persiapan Kegiatan Lomba Sekolah" },
  { id: 3, bulan: "Maret 2027", jm: 5, mte: 2, me: 3, ket: "Libur Awal Puasa Ramadan 1448 H & Try Out Asesmen Sekolah" },
  { id: 4, bulan: "April 2027", jm: 4, mte: 2, me: 2, ket: "Libur Idul Fitri 1448 H & Asesmen Tengah Semester (ATS) Genap" },
  { id: 5, bulan: "Mei 2027", jm: 4, mte: 1, me: 3, ket: "Ujian Sekolah Utama Kelas VI & Libur Hari Raya Keagamaan" },
  { id: 6, bulan: "Juni 2027", jm: 5, mte: 3, me: 2, ket: "Asesmen Akhir Tahun, Rapat Kenaikan Kelas, & Libur Akhir TA" }
];

// Helper to check if a day is weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday is 0, Saturday is 6
};

// Helper to get formatted dates range
const getDatesRange = (startDateStr, endDateStr) => {
  const dates = [];
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : start;
  let curr = new Date(start);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

// Get dates with events details
const getEventForDate = (dateStr) => {
  for (const ev of ACADEMIC_EVENTS) {
    const activeDates = getDatesRange(ev.date, ev.toDate);
    if (activeDates.includes(dateStr)) {
      return ev;
    }
  }
  return null;
};

export default function KalenderPendidikan() {
  const [semester, setSemester] = useState('ganjil'); // 'ganjil' | 'genap'

  const activeRpe = semester === 'ganjil' ? RPE_GANJIL : RPE_GENAP;
  const totalJm = activeRpe.reduce((sum, item) => sum + item.jm, 0);
  const totalMte = activeRpe.reduce((sum, item) => sum + item.mte, 0);
  const totalMe = activeRpe.reduce((sum, item) => sum + item.me, 0);

  // Month rendering config based on semester
  const monthsConfig = semester === 'ganjil' ? [
    { year: 2026, monthIndex: 6, label: "Juli 2026" },
    { year: 2026, monthIndex: 7, label: "Agustus 2026" },
    { year: 2026, monthIndex: 8, label: "September 2026" },
    { year: 2026, monthIndex: 9, label: "Oktober 2026" },
    { year: 2026, monthIndex: 10, label: "November 2026" },
    { year: 2026, monthIndex: 11, label: "Desember 2026" }
  ] : [
    { year: 2027, monthIndex: 0, label: "Januari 2027" },
    { year: 2027, monthIndex: 1, label: "Februari 2027" },
    { year: 2027, monthIndex: 2, label: "Maret 2027" },
    { year: 2027, monthIndex: 3, label: "April 2027" },
    { year: 2027, monthIndex: 4, label: "Mei 2027" },
    { year: 2027, monthIndex: 5, label: "Juni 2027" }
  ];

  // Render a monthly grid
  const renderMonthGrid = (year, monthIndex, monthName) => {
    const daysInWeek = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalCells = [...blanks, ...days];
    
    const rows = [];
    let cells = [];
    
    totalCells.forEach((cell, index) => {
      if (index % 7 === 0 && index !== 0) {
        rows.push(cells);
        cells = [];
      }
      cells.push(cell);
    });
    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(null);
      }
      rows.push(cells);
    }

    return (
      <div key={`${year}-${monthIndex}`} className="month-card glass-card">
        <h4 className="month-title">{monthName}</h4>
        <div className="calendar-grid">
          {daysInWeek.map((d, idx) => (
            <div key={d} className={`grid-header-cell ${idx === 0 ? 'sunday-label' : ''}`}>{d}</div>
          ))}
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="calendar-row">
              {row.map((day, cIdx) => {
                if (day === null) {
                  return <div key={cIdx} className="grid-cell empty"></div>;
                }
                
                const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const event = getEventForDate(dateStr);
                const isSun = cIdx === 0;
                
                let cellClass = "";
                if (event) {
                  cellClass = `has-event event-${event.type}`;
                } else if (isSun) {
                  cellClass = "sunday";
                }

                return (
                  <div 
                    key={cIdx} 
                    className={`grid-cell ${cellClass}`}
                    title={event ? `${event.title} - ${event.desc}` : undefined}
                  >
                    <span className="day-number">{day}</span>
                    {event && <span className="event-dot"></span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        .month-card {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 250px;
        }
        .month-title {
          font-weight: 700;
          color: var(--primary-dark);
          text-align: center;
          font-size: 1.05rem;
          margin: 0;
          padding-bottom: 0.5rem;
          border-bottom: 1.5px solid #f1f5f9;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .grid-header-cell {
          text-align: center;
          font-weight: 700;
          font-size: 0.75rem;
          color: #64748b;
          padding: 4px 0;
        }
        .grid-header-cell.sunday-label {
          color: #ef4444;
        }
        .calendar-row {
          display: contents;
        }
        .grid-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          border-radius: 6px;
          position: relative;
          color: #334155;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .grid-cell.empty {
          background: transparent;
        }
        .grid-cell.sunday {
          color: #ef4444;
          font-weight: 700;
          background: #fef2f2;
        }
        .grid-cell.sunday:hover {
          background: #fee2e2;
        }
        .grid-cell:not(.empty):not(.sunday) {
          background: #f8fafc;
        }
        .grid-cell:not(.empty):hover {
          background: #e2e8f0;
          cursor: pointer;
        }
        
        /* Event types styling */
        .grid-cell.event-holiday {
          background: #fee2e2 !important;
          color: #b91c1c !important;
          font-weight: 700;
        }
        .grid-cell.event-exam {
          background: #e0f2fe !important;
          color: #0369a1 !important;
          font-weight: 700;
        }
        .grid-cell.event-mpls {
          background: #dcfce7 !important;
          color: #15803d !important;
          font-weight: 700;
        }
        .grid-cell.event-event {
          background: #fef9c3 !important;
          color: #a16207 !important;
          font-weight: 700;
        }
        .grid-cell.event-report {
          background: #f3e8ff !important;
          color: #6b21a8 !important;
          font-weight: 700;
        }
        
        .event-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: currentColor;
          position: absolute;
          bottom: 3px;
        }
        .legend-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 1rem;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }
        .legend-color {
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }
        
        /* Print optimization styles */
        @media print {
          header, footer, .no-print, .public-layout-header, iframe, #chat-widget-container, .pwa-install-prompt {
            display: none !important;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11px;
            line-height: 1.2;
            user-select: text !important;
          }
          .container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .section-padding {
            padding: 0 !important;
            margin-top: 10mm;
          }
          @page {
            size: A4;
            margin: 8mm 12mm;
          }
          .month-grid-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .month-card {
            border: 1px solid #94a3b8 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .legend-container {
            border: 1px solid #94a3b8 !important;
            background: #ffffff !important;
            margin-bottom: 1rem !important;
          }
          .rpe-card {
            border: 1px solid #94a3b8 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border: 1px solid #475569 !important;
            padding: 4px 6px !important;
          }
          .badge {
            border: 1px solid #000 !important;
            background: none !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Page Banner */}
      <section className="hero no-print" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Kalender Pendidikan</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Tahun Ajaran 2026/2027 — Rincian Kegiatan Belajar Mengajar (KBM) dan Analisis Pekan Efektif SDN Bobong.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section-padding">
        <div className="container">
          
          {/* Breadcrumbs & Action bar */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              <Link href="/" style={{ color: 'var(--primary)' }}>Beranda</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--primary)' }}>Akademik</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--text-muted)' }}>Kalender Pendidikan</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🖨️ Cetak Dokumen (A4)
              </button>
            </div>
          </div>

          {/* Official Kop Surat (Only Visible when printing) */}
          <div className="print-only" style={{ display: 'none', marginBottom: '20px', borderBottom: '3px double #000', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src="/images/logo_sekolah.png" alt="Logo" style={{ width: '70px', height: '70px' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800 }}>PEMERINTAH KABUPATEN PULAU TALIABU</h3>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>DINAS PENDIDIKAN</h2>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 900 }}>SD NEGERI BOBONG</h1>
                <p style={{ margin: 0, fontSize: '11px', color: '#334155' }}>Alamat: Desa Wayo, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara</p>
              </div>
            </div>
          </div>

          {/* Document Title (For printing) */}
          <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>
              KALENDER PENDIDIKAN & RINCIAN PEKAN EFEKTIF (RPE)
            </h2>
            <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>TAHUN AJARAN 2026/2027</h3>
          </div>

          {/* Tab Switcher */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(18, 165, 184, 0.08)', padding: '4px', borderRadius: '9999px', gap: '4px' }}>
              <button 
                onClick={() => setSemester('ganjil')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: semester === 'ganjil' ? 'var(--primary)' : 'transparent',
                  color: semester === 'ganjil' ? '#ffffff' : 'var(--primary-dark)',
                  transition: 'all 0.3s ease'
                }}
              >
                🍂 Semester Ganjil (2026)
              </button>
              <button 
                onClick={() => setSemester('genap')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: semester === 'genap' ? 'var(--primary)' : 'transparent',
                  color: semester === 'genap' ? '#ffffff' : 'var(--primary-dark)',
                  transition: 'all 0.3s ease'
                }}
              >
                🌱 Semester Genap (2027)
              </button>
            </div>
          </div>

          {/* COLOR LEGEND */}
          <div className="legend-container">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}></span>
              <span>Hari Minggu / Libur Rutin</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}></span>
              <span>Libur Nasional / Keagamaan</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}></span>
              <span>MPLS (Orientasi Murid Baru)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}></span>
              <span>Ujian / Asesmen Sumatif</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#fef9c3', border: '1px solid #fef08a' }}></span>
              <span>Kegiatan Khusus / Class Meeting</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff' }}></span>
              <span>Pembagian Rapor</span>
            </div>
          </div>

          {/* MAIN CALENDAR GRID */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 className="no-print" style={{ color: 'var(--primary-dark)', borderLeft: '4px solid var(--primary)', paddingLeft: '10px', marginBottom: '1.5rem' }}>
              Peta Kalender Akademik ({semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'})
            </h3>
            <div className="month-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {monthsConfig.map(m => renderMonthGrid(m.year, m.monthIndex, m.label))}
            </div>
          </div>

          {/* RINCIAN PEKAN EFEKTIF (RPE) TABLE */}
          <div className="rpe-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Analisis Rincian Pekan Efektif (RPE)</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Rekapitulasi perhitungan alokasi waktu efektif belajar mengajar untuk {semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'}.
                </p>
              </div>
              <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', fontWeight: 700 }}>
                {semester === 'ganjil' ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)'}
              </span>
            </div>

            <div className="table-responsive" style={{ border: 'none', boxShadow: 'none', borderRadius: 0, marginBottom: '1.5rem' }}>
              <table className="table-custom" style={{ width: '100%', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                    <th>Nama Bulan</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Jumlah Minggu</th>
                    <th style={{ width: '180px', textAlign: 'center' }}>Minggu Tidak Efektif</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Minggu Efektif</th>
                    <th>Keterangan Kegiatan Penting</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRpe.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{index + 1}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{item.bulan}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.jm} Minggu</td>
                      <td style={{ textAlign: 'center', color: item.mte > 0 ? '#b91c1c' : '#64748b', fontWeight: 600 }}>
                        {item.mte} Minggu
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--success-color)', fontWeight: 700 }}>
                        {item.me} Minggu
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>{item.ket}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                    <td colSpan={2} style={{ textAlign: 'right', color: 'var(--primary-dark)' }}>Total Kumulatif:</td>
                    <td style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>{totalJm} Minggu</td>
                    <td style={{ textAlign: 'center', color: '#b91c1c' }}>{totalMte} Minggu</td>
                    <td style={{ textAlign: 'center', color: 'var(--success-color)' }}>{totalMe} Minggu</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                      Total Hari Belajar Efektif = {totalMe} Pekan Belajar Terstruktur
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations Callout Card */}
            <div style={{ backgroundColor: '#f0fdfa', borderRadius: '12px', border: '1px solid #ccfbf1', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h5 style={{ margin: 0, color: '#0f766e', fontWeight: 700, fontSize: '0.95rem' }}>📌 Kesimpulan Alokasi Waktu Efektif:</h5>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#115e59', lineHeight: 1.5 }}>
                Berdasarkan perhitungan di atas, terdapat total <strong>{totalMe} Pekan Efektif</strong> pada {semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'}. 
                Dengan asumsi 1 pekan memuat 30 Jam Pelajaran (JP) terstruktur untuk siswa tingkat dasar, maka alokasi waktu pembelajaran tatap muka yang tersedia adalah 
                sekitar <strong>{totalMe * 30} JP</strong> untuk menyelesaikan seluruh capaian pembelajaran (CP) Kurikulum Merdeka.
              </p>
            </div>
          </div>

          {/* SIGNATURE FOR PRINT PREVIEW */}
          <div className="print-only" style={{ display: 'none', marginTop: '40px', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center', width: '250px' }}>
              <p style={{ margin: '0 0 2px 0' }}>Bobong, 13 Juli 2026</p>
              <p style={{ margin: '0 0 50px 0', fontWeight: 600 }}>Plt. Kepala Sekolah SDN Bobong</p>
              <p style={{ margin: '0 0 2px 0', fontWeight: 700, textDecoration: 'underline' }}>HUSNITA USMAN, S.Pd., M.Pd</p>
              <p style={{ margin: 0, color: '#475569', fontSize: '10px' }}>NIP. 19961027 201903 2 006</p>
            </div>
          </div>

        </div>
      </section>

      {/* Global printer utilities style helper */}
      <style jsx>{`
        @media print {
          .print-only {
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
