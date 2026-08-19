'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

export default function StandarPelayananTabs({ initialServices = [], maklumatImage = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

      {/* Maklumat Pelayanan Card */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-md) var(--space-lg)', borderLeft: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <h2 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>Maklumat Pelayanan</h2>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
          &ldquo;Dengan ini kami menyatakan akan memberikan pelayanan yang cepat, tepat dan profesional sesuai Standar Operasional Prosedur yang telah ditetapkan serta akan melakukan pembaruan pelayanan terus menerus. Apabila lalai, kami siap menerima sanksi dan atau memberikan kompensasi sesuai dengan ketentuan yang berlaku.&rdquo;
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '2px' }}>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Penanggung Jawab: Husnita Usman, S.Pd., M.Pd. (Kepala Sekolah)</span>
          {maklumatImage && (
            <button onClick={() => setIsOpen(true)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '20px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Lihat Dokumen Resmi Berstempel
            </button>
          )}
        </div>
      </div>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
        {displayServices.map((item, idx) => (
          <button key={item.id || idx} onClick={() => setActiveIdx(idx)} className={`sp-tab-btn ${activeIdx === idx ? 'active' : ''}`}>
            {item.title || `Layanan ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* 2-Column Layout */}
      <div className="sp-layout-grid">
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.01rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>Poster Alur Pelayanan</h3>
          <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc', maxHeight: '750px', overflowY: 'auto' }}>
            <img src={activeService.image || '/images/standar_pelayanan.png'} alt={`Poster ${activeService.title}`} loading="lazy" width="800" height="1130" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', margin: '0 0 var(--space-md) 0', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Rincian Layanan &amp; Alur</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}><span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Biaya Layanan</span><span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeService.biaya || 'Gratis (Rp 0,-)'}</span></div>
                <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '12px' }}><span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Waktu Pelaksanaan</span><span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{activeService.waktu || '-'}</span></div>
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px' }}><span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Alur Layanan Singkat</span><span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{activeService.alur || '-'}</span></div>
                <div style={{ borderLeft: '3px solid var(--primary-dark)', paddingLeft: '12px' }}><span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Penanggung Jawab / Kontak</span><span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{activeService.kontak || '-'}</span></div>
              </div>
            </div>
            {activeService.pdf && (
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <a href={activeService.pdf} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.7rem 1.4rem', fontSize: '0.875rem', fontWeight: 700, width: '100%' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Unduh Dokumen Syarat Lengkap (PDF)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Maklumat Image */}
      {isOpen && mounted && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }} onClick={() => setIsOpen(false)}>
          <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '10px', maxWidth: '92%', maxHeight: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '-14px', right: '-14px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', zIndex: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <img src={maklumatImage} alt="Maklumat Pelayanan SD Negeri Bobong" style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', display: 'block' }} />
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Klik di luar gambar untuk menutup overlay</div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
