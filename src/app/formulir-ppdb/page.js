'use client';

import Link from 'next/link';

export default function FormulirPPDBPrint() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Top Action Bar (Hidden on print) */}
      <div className="no-print-bar no-print" style={{
        backgroundColor: 'var(--primary-dark)',
        color: 'white',
        padding: 'var(--space-xs) var(--space-md)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto var(--space-sm) auto',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem' }}>📄 Formulir Pendaftaran PPDB Offline</span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            🖨️ Cetak / Print Sekarang
          </button>
          <Link href="/ppdb" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            Kembali
          </Link>
        </div>
      </div>

      {/* Main Printable Form Page */}
      <div className="form-page" style={{
        background: '#ffffff',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1.25rem 2rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* School Header (KOP Surat) */}
        <div className="form-header" style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '3px double var(--primary)',
          paddingBottom: '0.4rem',
          marginBottom: '0.4rem',
          gap: 'var(--space-sm)'
        }}>
          <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" className="form-logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} decoding="async" />
          <div className="form-title-container" style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.1rem', textTransform: 'uppercase', fontWeight: 800, lineHeight: 1.1 }}>Pemerintah Kabupaten Pulau Taliabu</h1>
            <h2 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.1rem', textTransform: 'uppercase', fontWeight: 700, lineHeight: 1.1 }}>Dinas Pendidikan dan Kebudayaan</h2>
            <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.15rem' }}>SD Negeri Bobong</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 0 }}>NPSN: 60200589 | Akreditasi: B (Baik)</p>
            <p style={{ fontSize: '0.7rem', marginTop: '0.1rem', color: 'var(--text-muted)', marginBottom: 0 }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
          </div>
          <img src="/images/logo_sekolah.png" alt="Logo Sekolah" className="form-logo" style={{ width: '75px', height: '75px', objectFit: 'contain', marginTop: '-8px', marginBottom: '-8px' }} decoding="async" />
        </div>
 
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', textDecoration: 'underline', margin: '0 0 2px 0' }}>FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>Tahun Ajaran 2026/2027</p>
        </div>
 
        {/* Section 1: Data Calon Siswa */}
        <div className="form-section-title">A. Data Calon Peserta Didik</div>
        <div className="form-grid">
          <div className="form-label">1. Nama Lengkap</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">2. Nama Panggilan</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">3. NIK (Sesuai KK)</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">4. Jenis Kelamin</div>
          <div className="checkbox-container">
            <div className="checkbox-item"><span className="checkbox-box"></span> Laki-laki</div>
            <div className="checkbox-item"><span className="checkbox-box"></span> Perempuan</div>
          </div>
          
          <div className="form-label">5. Tempat / Tgl Lahir</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">6. Agama</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">7. Jumlah Bersaudara</div>
          <div className="form-value-line">Anak ke : ......... dari ......... bersaudara</div>
          
          <div className="form-label">8. Alamat Tempat Tinggal</div>
          <div className="form-value-line"></div>
 
          <div className="form-label">9. Jalur Pendaftaran</div>
          <div className="checkbox-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginTop: '0.15rem' }}>
            <div className="checkbox-item"><span className="checkbox-box"></span> Zonasi (Domisili Terdekat)</div>
            <div className="checkbox-item"><span className="checkbox-box"></span> Afirmasi (Keluarga Ekonomi Kurang Mampu)</div>
            <div className="checkbox-item"><span className="checkbox-box"></span> Perpindahan Tugas Orang Tua / Wali</div>
            <div className="checkbox-item"><span className="checkbox-box"></span> Prestasi (Akademik / Non-Akademik)</div>
          </div>
        </div>
 
        {/* Section 2: Data Orang Tua / Wali */}
        <div className="form-section-title">B. Data Orang Tua / Wali</div>
        <div className="form-grid">
          <div className="form-label">1. Nama Lengkap Ayah</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">2. Pekerjaan Ayah</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">3. No. Telepon/WA Ayah</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">4. Nama Lengkap Ibu</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">5. Pekerjaan Ibu</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">6. No. Telepon/WA Ibu</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">7. Nama Wali (Jika Ada)</div>
          <div className="form-value-line"></div>
          
          <div className="form-label">8. Pekerjaan Wali</div>
          <div className="form-value-line"></div>
        </div>
 
        {/* Section 3: Checklist Kelengkapan Berkas */}
        <div className="form-section-title">C. Persyaratan Berkas Lampiran (Diisi Panitia)</div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Akta Kelahiran Calon Siswa (2 Lembar)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Kartu Keluarga / KK (2 Lembar)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Ijazah TK / PAUD (Opsional jika memiliki)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Pas Foto Calon Siswa Ukuran 3x4 Latar Belakang Merah (2 Lembar)</div>
        </div>
 
        {/* Section 4: Pernyataan & Tanda Tangan */}
        <div className="sig-container">
          <div className="sig-box">
            <div>Mengetahui,</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '2px' }}>.............................................</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panitia PPDB SDN Bobong</div>
          </div>
          <div className="sig-box">
            <div>Bobong, .................................... 2026</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '2px' }}>.............................................</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orang Tua / Wali Calon Siswa</div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          html, body {
            background-color: #f3f4f6 !important;
          }
          .form-page {
            width: 800px !important;
            min-width: 800px !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            margin: 0 auto;
            padding: 1.25rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            border: 1px solid #cbd5e1;
          }
        }
        
        /* Force dark text color on screen regardless of theme mode */
        .form-page,
        .form-page h1, 
        .form-page h2, 
        .form-page p, 
        .form-page div, 
        .form-page span,
        .form-label,
        .checkbox-item {
          color: #0f172a !important;
        }

        .form-section-title {
          background-color: #f1f5f9 !important;
          color: #1e3a8a !important;
          padding: 0.3rem 8px;
          font-weight: 700;
          font-size: 0.8rem;
          border-left: 4px solid #1e40af;
          margin: 0.5rem 0 0.25rem 0;
          text-transform: uppercase;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 180px 1fr;
          row-gap: 2px;
          column-gap: 12px;
          margin-bottom: 0.25rem;
          font-size: 0.8rem;
        }
        
        .form-label {
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        
        .form-value-line {
          border-bottom: 1px dashed #94a3b8 !important;
          height: 1.45rem;
          display: flex;
          align-items: flex-end;
          padding-bottom: 1px;
        }
        
        .checkbox-container {
          display: flex;
          gap: 16px;
          margin-top: 0.25rem;
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
        }
        
        .checkbox-box {
          width: 14px;
          height: 14px;
          border: 1px solid #94a3b8 !important;
          border-radius: 2px;
          display: inline-block;
        }
        
        .sig-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.8rem;
        }
        
        .sig-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 75px;
        }

        /* Print Override rules */
        @media print {
          @page {
            size: A4;
            margin: 10mm 15mm;
          }
          
          body, html, main, .form-page {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          
          .form-page {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            min-width: unset !important;
            max-width: 100% !important;
          }

          .form-page h1, 
          .form-page h2, 
          .form-page p, 
          .form-page div, 
          .form-page span,
          .form-label,
          .checkbox-item {
            color: #000000 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          .form-value-line {
            border-bottom: 1px dashed #000000 !important;
          }

          .checkbox-box {
            border: 1px solid #000000 !important;
          }

          .form-section-title {
            background-color: #f3f4f6 !important;
            border-left: 4px solid #000000 !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }
        }
      `}} />
    </>
  );
}
