'use client';

import { useState } from 'react';

export default function StandarPelayananTabs({ initialServices = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeService = (initialServices.length > 0 && initialServices[activeIdx]) ? initialServices[activeIdx] : {
    title: 'Standar Pelayanan Utama',
    image: '/images/standar_pelayanan.png',
    pdf: '/docs/standar_pelayanan.pdf',
    biaya: 'Seluruh bentuk layanan administrasi (mutasi siswa, surat keterangan, legalisir ijazah) adalah Gratis (Rp 0,-).',
    waktu: 'Senin s.d. Sabtu pukul 08.00 - 12.00 WIT (pada hari kerja sekolah).',
    alur: 'Ajukan dokumen persyaratan ke meja pelayanan tata usaha (operator) sekolah untuk langsung diproses.',
    kontak: 'Hubungi Humas / Operator sekolah jika Anda memiliki pertanyaan atau kendala seputar pelayanan publik sekolah.'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Tab Buttons */}
      {initialServices.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '4px', scrollbarWidth: 'thin' }}>
          {initialServices.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => setActiveIdx(idx)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                backgroundColor: activeIdx === idx ? 'var(--primary)' : 'white',
                color: activeIdx === idx ? 'white' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease',
                border: activeIdx === idx ? '1px solid var(--primary)' : '1px solid var(--border-color)'
              }}
            >
              {item.title || `Layanan ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Infographic Poster Card Wrapper */}
        <div style={{ 
          backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', fontWeight: 800, alignSelf: 'flex-start', margin: '5px 0' }}>
            {activeService.title}
          </h3>
          {/* Canvas Image Container */}
          <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
            <img 
              src={activeService.image || '/images/standar_pelayanan.png'} 
              alt={`Poster ${activeService.title}`} 
              loading="lazy" width="800" height="1130"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </div>

          {/* Action Buttons */}
          {activeService.pdf && (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <a 
                href={activeService.pdf} download target="_blank" rel="noreferrer" className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Unduh / Lihat Dokumen Pelayanan (PDF)
              </a>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: '0 0 15px 0', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Ringkasan Standar Layanan Sekolah
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-main)', lineHeight: 1.8, fontSize: '0.925rem' }}>
            <li style={{ marginBottom: '8px' }}><strong>Biaya Pelayanan:</strong> {activeService.biaya || 'Gratis (Rp 0,-)'}</li>
            <li style={{ marginBottom: '8px' }}><strong>Waktu Pelayanan:</strong> {activeService.waktu || '-'}</li>
            <li style={{ marginBottom: '8px' }}><strong>Alur Pengajuan:</strong> {activeService.alur || '-'}</li>
            <li><strong>Kontak Pengaduan:</strong> {activeService.kontak || '-'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
