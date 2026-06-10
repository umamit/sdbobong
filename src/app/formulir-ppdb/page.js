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
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* School Header (KOP Surat) */}
        <div className="form-header" style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '3px double var(--primary)',
          paddingBottom: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
          gap: 'var(--space-sm)'
        }}>
          <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" className="form-logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} decoding="async" />
          <div className="form-title-container" style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.15rem', textTransform: 'uppercase', fontWeight: 800, lineHeight: 1.2 }}>Pemerintah Kabupaten Pulau Taliabu</h1>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.15rem', textTransform: 'uppercase', fontWeight: 700, lineHeight: 1.2 }}>Dinas Pendidikan dan Kebudayaan</h2>
            <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.25rem' }}>SD Negeri Bobong</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 0 }}>NPSN: 60200589 | Akreditasi: B (Baik)</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.15rem', color: 'var(--text-muted)', marginBottom: 0 }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
          </div>
          <img src="/images/logo_sekolah.png" alt="Logo Sekolah" className="form-logo" style={{ width: '105px', height: '105px', objectFit: 'contain', marginTop: '-12.5px', marginBottom: '-12.5px' }} decoding="async" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textDecoration: 'underline' }}>FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Tahun Ajaran 2026/2027</p>
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
          <div className="checkbox-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginTop: '0.25rem' }}>
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
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Akta Kelahiran Calon Siswa (2 Lembar)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Kartu Keluarga / KK (2 Lembar)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi KTP Orang Tua / Wali (Ayah & Ibu)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Surat Pertanggungjawaban Mutlak (SPTJM) bermeterai asli</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Fotokopi Kartu KIP / PKH (Bagi penerima bantuan / jalur Afirmasi)</div>
          <div className="checkbox-item"><span className="checkbox-box"></span> Pas Foto Calon Siswa Ukuran 3x4 Latar Belakang Merah (2 Lembar)</div>
        </div>

        {/* Section 4: Pernyataan & Tanda Tangan */}
        <div className="sig-container">
          <div className="sig-box">
            <div>Mengetahui,</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '2px' }}>.............................................</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Panitia PPDB SDN Bobong</div>
          </div>
          <div className="sig-box">
            <div>Bobong, .................................... 2026</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '2px' }}>.............................................</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Orang Tua / Wali Calon Siswa</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html, body {
          background-color: #f3f4f6 !important;
          padding: var(--space-md);
        }
        .form-section-title {
          background-color: var(--bg-main);
          color: var(--primary-dark);
          padding: 0.5rem var(--space-xs);
          font-weight: 700;
          font-size: 0.95rem;
          border-left: 4px solid var(--primary);
          margin: var(--space-md) 0 var(--space-xs) 0;
          text-transform: uppercase;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          row-gap: var(--space-xs);
          column-gap: var(--space-sm);
          margin-bottom: var(--space-sm);
          font-size: 0.9rem;
        }
        .form-label {
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
        }
        .form-value-line {
          border-bottom: 1px dashed var(--text-light);
          height: 2rem;
          display: flex;
          align-items: flex-end;
          padding-bottom: 2px;
        }
        .checkbox-container {
          display: flex;
          gap: var(--space-md);
          margin-top: 0.5rem;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .checkbox-box {
          width: 18px;
          height: 18px;
          border: 1px solid var(--text-light);
          border-radius: 3px;
          display: inline-block;
        }
        .sig-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: var(--space-lg);
          text-align: center;
          font-size: 0.9rem;
        }
        .sig-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 120px;
        }
        
        /* Print Rules */
        @media print {
          body {
            background-color: #ffffff !important;
            padding: 0 !important;
            color: #000000 !important;
          }
          .form-page {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          .form-section-title {
            background-color: #f3f4f6 !important;
            border-left: 4px solid #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
