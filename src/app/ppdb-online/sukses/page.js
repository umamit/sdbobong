'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PPDBSukses() {
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('ppdb_receipt');
      if (data) {
        setReceipt(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load receipt from sessionStorage', e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <main className="container section-padding receipt-wrapper-main" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="success-card-container" style={{
          width: '100%',
          maxWidth: '650px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Header Message */}
          <div className="no-print" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div className="success-icon-wrapper" style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'block',
                strokeWidth: 4,
                stroke: '#10b981',
                strokeMiterlimit: 10,
                boxShadow: 'inset 0px 0px 0px #10b981',
                animation: 'fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both'
              }}>
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" style={{
                  strokeDasharray: 166,
                  strokeDashoffset: 166,
                  strokeWidth: 4,
                  strokeMiterlimit: 10,
                  stroke: '#10b981',
                  fill: 'none',
                  animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
                }} />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" style={{
                  transformOrigin: '50% 50%',
                  strokeDasharray: 48,
                  strokeDashoffset: 48,
                  stroke: '#ffffff',
                  animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards'
                }} />
              </svg>
            </div>
            <h2 style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Pendaftaran Berhasil Diterima!
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, maxWidth: '480px', margin: '0 auto' }}>
              Data pendaftaran online calon siswa telah tersimpan di server SDN Bobong. Silakan simpan atau cetak bukti pendaftaran di bawah ini.
            </p>
          </div>

          {/* Printable Receipt Card */}
          <div className="receipt-print-area" style={{
            padding: '2rem 1.5rem',
            background: '#ffffff',
            position: 'relative'
          }}>
            {/* Watermark / Decorative border for print */}
            <div className="receipt-border-decor" style={{
              border: '2px double #cbd5e1',
              borderRadius: '12px',
              padding: '1.5rem 1.25rem',
              position: 'relative',
              backgroundColor: '#fff'
            }}>
              {/* Receipt Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                borderBottom: '2px solid #0f172a',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}>
                <img 
                  src="/images/logo.png" 
                  alt="Logo SDN Bobong" 
                  onError={(e) => { e.target.src = "https://kemdikbud.go.id/main/files/large/85149bd183f3e1a"; }}
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                />
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                    SD Negeri Bobong
                  </h1>
                  <p style={{ fontSize: '0.7rem', color: '#475569', margin: '2px 0 0 0', fontWeight: 500 }}>
                    Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara
                  </p>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, margin: '6px 0 0 0', color: '#0b3c5d', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Bukti Pendaftaran PPDB Daring (Online)
                  </h4>
                </div>
              </div>

              {/* Receipt Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>No. Pendaftaran</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>
                    {receipt?.id || 'PPDB-' + Math.floor(Date.now() / 1000)}
                  </span>
                </div>
                
                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Tahun Ajaran</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                    {receipt?.tahun_ajaran || '2026/2027'}
                  </span>
                </div>

                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Nama Lengkap Siswa</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {receipt?.nama_lengkap || '-'}
                  </span>
                </div>

                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>NIK Siswa</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>
                    {receipt?.nik || receipt?.nik_siswa || '-'}
                  </span>
                </div>

                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Jalur Pendaftaran</span>
                  <span style={{ fontSize: '0.8rem', color: '#0b3c5d', fontWeight: 700 }}>
                    {receipt?.jalur_ppdb || 'Zonasi'}
                  </span>
                </div>

                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Waktu Pendaftaran</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    {receipt?.waktu_daftar || new Date().toISOString().replace('T', ' ').split('.')[0]} WIT
                  </span>
                </div>

                <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Status Awal</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#16a34a', 
                    fontWeight: 700, 
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '4px',
                    padding: '2px 8px'
                  }}>
                    {receipt?.status || 'Diterima Sistem'}
                  </span>
                </div>
              </div>

              {/* Informative Footer */}
              <div style={{ marginTop: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', textAlign: 'left' }}>
                <h6 style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>⚠️ Langkah Selanjutnya:</h6>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569', lineHeight: 1.4 }}>
                  Simpan lembar bukti pendaftaran online ini. Panitia PPDB SDN Bobong akan melakukan proses pemeriksaan kelengkapan berkas fisik pada jadwal yang ditentukan. Silakan tunggu konfirmasi melalui WhatsApp atau kunjungi portal pengumuman secara berkala.
                </p>
              </div>

              {/* Barcode/Verification Stamp Mockup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <div>
                  <div style={{ width: '100px', height: '24px', background: 'repeating-linear-gradient(90deg, #334155, #334155 2px, #fff 2px, #fff 6px)' }} />
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', display: 'block', marginTop: '4px', fontFamily: 'monospace' }}>VERIFIED_BY_SYSTEM</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Panitia PPDB</span>
                  <span style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginTop: '16px' }}>SDN BOBONG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (No Print) */}
          <div className="no-print" style={{
            padding: '1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handlePrint}
              className="btn btn-primary" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                backgroundColor: '#0b3c5d',
                color: '#fff',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(11, 60, 93, 0.2)'
              }}
            >
              🖨️ Cetak / Simpan PDF
            </button>
            <Link 
              href="/ppdb" 
              className="btn" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fff',
                color: '#334155',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Kembali ke Portal PPDB
            </Link>
            <Link 
              href="/" 
              className="btn" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fff',
                color: '#334155',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Print Styles */
        @media print {
          /* Hide everything except the receipt card */
          header, 
          footer,
          .announcement-banner,
          .no-print,
          .public-layout-header,
          .public-layout-footer,
          .public-layout-announcement,
          .public-layout-wa-btn {
            display: none !important;
          }

          /* Reset margins and backgrounds for print */
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .receipt-wrapper-main {
            padding: 0 !important;
            min-height: auto !important;
            display: block !important;
          }

          .success-card-container {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .receipt-print-area {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }

          .receipt-border-decor {
            border: 2px solid #000000 !important;
            padding: 20px !important;
            border-radius: 8px !important;
          }
          
          .receipt-row {
            border-bottom: 1px dashed #000000 !important;
          }
        }

        /* Checkmark animations */
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 40px #10b981;
          }
        }
      `}</style>
    </>
  );
}
