'use client';

import { useState } from 'react';

const DEFAULT_SERVICES = [
  {
    id: 'sp-default-kbm', title: 'Standar Pelayanan KBM', image: '/images/standar_pelayanan.png', pdf: '/docs/standar_pelayanan.pdf',
    biaya: 'Gratis (Rp 0,-) - Bebas Biaya Pendidikan Terjamin APBD/Pusat.',
    waktu: 'Dilaksanakan setiap hari kerja sekolah sepanjang tahun ajaran aktif.',
    alur: 'Siswa masuk kelas sesuai jadwal KBM masing-masing yang telah ditentukan oleh sekolah.',
    kontak: 'Wali Kelas / Guru Bidang Studi / Humas Sekolah.'
  },
  {
    id: 'sp-default-rapor', title: 'Pengambilan Rapor', image: '/images/standar_pelayanan.png', pdf: '/docs/standar_pelayanan.pdf',
    biaya: 'Gratis (Rp 0,-) - Dilarang keras melakukan pungutan dalam bentuk apa pun.',
    waktu: 'Setiap akhir semester ganjil/genap sesuai Kalender Pendidikan.',
    alur: 'Orang tua / Wali murid mengambil dokumen rapor langsung di kelas masing-masing.',
    kontak: 'Wali Kelas masing-masing.'
  },
  {
    id: 'sp-default-mutasi', title: 'Mutasi Siswa', image: '/images/standar_pelayanan.png', pdf: '/docs/standar_pelayanan.pdf',
    biaya: 'Gratis (Rp 0,-) - Tanpa biaya administrasi.',
    waktu: '3 - 5 Hari Kerja (proses verifikasi data Dapodik).',
    alur: 'Ajukan surat permohonan mutasi orang tua ke tata usaha, tunggu verifikasi berkas, penerbitan surat mutasi.',
    kontak: 'Tata Usaha / Operator Dapodik Sekolah.'
  }
];

export default function StandarPelayananTabs({ initialServices = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const displayServices = initialServices.length > 0 ? initialServices : DEFAULT_SERVICES;
  const activeService = displayServices[activeIdx] || displayServices[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <style>{`
        .sp-layout-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-lg); }
        @media (min-width: 768px) { .sp-layout-grid { grid-template-columns: 4.5fr 5.5fr; } }
        .sp-tab-btn {
          padding: 0.6rem 1.2rem; border-radius: 20px; border: 1px solid var(--border-color);
          font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap;
          background-color: white; color: var(--text-main); box-shadow: var(--shadow-sm); transition: all 0.2s ease;
        }
        .sp-tab-btn.active { background-color: var(--primary); color: white; border-color: var(--primary); }
      `}</style>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '4px', scrollbarWidth: 'thin' }}>
        {displayServices.map((item, idx) => (
          <button key={item.id || idx} onClick={() => setActiveIdx(idx)} className={`sp-tab-btn ${activeIdx === idx ? 'active' : ''}`}>
            {item.title || `Layanan ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* 2-Column Layout */}
      <div className="sp-layout-grid">
        {/* Left Column: Image */}
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>Poster Alur Pelayanan</h3>
          <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc', maxHeight: '580px', overflowY: 'auto' }}>
            <img src={activeService.image || '/images/standar_pelayanan.png'} alt={`Poster ${activeService.title}`} loading="lazy" width="800" height="1130" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Right Column: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0 0 var(--space-md) 0', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Rincian Layanan &amp; Alur</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Biaya Layanan</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeService.biaya || 'Gratis (Rp 0,-)'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Waktu Pelaksanaan</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeService.waktu || '-'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Alur Layanan Singkat</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>{activeService.alur || '-'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--primary-dark)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Penanggung Jawab / Kontak</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>{activeService.kontak || '-'}</span>
                </div>
              </div>
            </div>
            {activeService.pdf && (
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <a href={activeService.pdf} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, width: '100%' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Unduh Dokumen Syarat Lengkap (PDF)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
