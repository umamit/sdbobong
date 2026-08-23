'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalendarGrid from './CalendarGrid';
import RpeTable from './RpeTable';
import { getParsedEvents, getRpeData } from './CalendarHelpers';

export default function CalendarClient({ initialCalendar = [], kepalaSekolah, nipKepalaSekolah }) {
  const [semester, setSemester] = useState('ganjil');

  const parsedEvents = getParsedEvents(initialCalendar);
  const getEventForDate = (dateStr) => parsedEvents.find(e => e.dateStr === dateStr) || null;

  const activeRpe = getRpeData(semester, initialCalendar, parsedEvents);
  const totalJm = activeRpe.reduce((sum, item) => sum + item.jm, 0);
  const totalMte = activeRpe.reduce((sum, item) => sum + item.mte, 0);
  const totalMe = activeRpe.reduce((sum, item) => sum + item.me, 0);

  const monthsConfig = semester === 'ganjil' ? [
    { year: 2026, monthIndex: 6, label: "Juli 2026" }, { year: 2026, monthIndex: 7, label: "Agustus 2026" },
    { year: 2026, monthIndex: 8, label: "September 2026" }, { year: 2026, monthIndex: 9, label: "Oktober 2026" },
    { year: 2026, monthIndex: 10, label: "November 2026" }, { year: 2026, monthIndex: 11, label: "Desember 2026" }
  ] : [
    { year: 2027, monthIndex: 0, label: "Januari 2027" }, { year: 2027, monthIndex: 1, label: "Februari 2027" },
    { year: 2027, monthIndex: 2, label: "Maret 2027" }, { year: 2027, monthIndex: 3, label: "April 2027" },
    { year: 2027, monthIndex: 4, label: "Mei 2027" }, { year: 2027, monthIndex: 5, label: "Juni 2027" }
  ];

  return (
    <>
      <section className="hero no-print" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Kalender Pendidikan</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Tahun Ajaran 2026/2027 — Rincian KBM dan Analisis Pekan Efektif SDN Bobong.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              <Link href="/" style={{ color: 'var(--primary)' }}>Beranda</Link><span style={{ margin: '0 8px' }}>/</span>
              <Link href="/akademik" style={{ color: 'var(--primary)' }}>Akademik</Link><span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--text-muted)' }}>Kalender Pendidikan</span>
            </div>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Cetak (A4)
            </button>
          </div>

          <div className="print-only" style={{ display: 'none', marginBottom: '20px', borderBottom: '3px double #000', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src="/images/logo_sekolah.png" alt="Logo" style={{ width: '70px', height: '70px' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800 }}>PEMERINTAH KABUPATEN PULAU TALIABU</h3>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>DINAS PENDIDIKAN</h2>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 900 }}>SD NEGERI BOBONG</h1>
                <p style={{ margin: 0, fontSize: '11px' }}>Alamat: Desa Wayo, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara</p>
              </div>
            </div>
          </div>

          <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>KALENDER PENDIDIKAN & RINCIAN PEKAN EFEKTIF (RPE)</h2>
            <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>TAHUN AJARAN 2026/2027</h3>
          </div>

          <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(18, 165, 184, 0.08)', padding: '4px', borderRadius: '9999px', gap: '4px' }}>
              <button onClick={() => setSemester('ganjil')} style={{ padding: '0.5rem 1.5rem', borderRadius: '9999px', border: 'none', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', backgroundColor: semester === 'ganjil' ? 'var(--primary)' : 'transparent', color: semester === 'ganjil' ? '#ffffff' : 'var(--primary-dark)', transition: 'all 0.3s ease' }}>Ganjil (2026)</button>
              <button onClick={() => setSemester('genap')} style={{ padding: '0.5rem 1.5rem', borderRadius: '9999px', border: 'none', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', backgroundColor: semester === 'genap' ? 'var(--primary)' : 'transparent', color: semester === 'genap' ? '#ffffff' : 'var(--primary-dark)', transition: 'all 0.3s ease' }}>Genap (2027)</button>
            </div>
          </div>

          <div className="legend-container">
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}></span><span>Libur Rutin</span></div>
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}></span><span>Libur Nasional</span></div>
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}></span><span>MPLS</span></div>
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}></span><span>Asesmen/Ujian</span></div>
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#fef9c3', border: '1px solid #fef08a' }}></span><span>Class Meeting</span></div>
            <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff' }}></span><span>Rapor</span></div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <CalendarGrid monthsConfig={monthsConfig} getEventForDate={getEventForDate} />
          </div>

          <RpeTable activeRpe={activeRpe} semester={semester} totalJm={totalJm} totalMte={totalMte} totalMe={totalMe} />

          <div className="print-only" style={{ display: 'none', marginTop: '40px', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center', width: '250px' }}>
              <p style={{ margin: '0 0 2px 0' }}>Bobong, 13 Juli 2026</p>
              <p style={{ margin: '0 0 50px 0', fontWeight: 600 }}>Plt. Kepala Sekolah, SD Negeri Bobong</p>
              <p style={{ margin: '0 0 2px 0', fontWeight: 700, textDecoration: 'underline' }}>{kepalaSekolah}</p>
              <p style={{ margin: 0, color: '#475569', fontSize: '10px' }}>NIP. {nipKepalaSekolah}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
