'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PPDBPortal({ pendaftarList }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqData = [
    {
      q: "Bagaimana jika anak belum berusia 6 tahun pada 1 Juli 2026?",
      a: "Calon siswa yang berusia kurang dari 6 tahun (minimal 5 tahun 6 bulan) dapat dipertimbangkan jika memiliki potensi kecerdasan istimewa atau kesiapan psikologis, yang dibuktikan dengan rekomendasi psikolog profesional atau surat keterangan dari dewan guru sekolah asal."
    },
    {
      q: "Apakah ada pungutan biaya pendaftaran PPDB di SD Negeri Bobong?",
      a: "Tidak ada. Seluruh proses pendaftaran, seleksi, hingga daftar ulang siswa di SD Negeri Bobong tidak dipungut biaya apapun (Gratis) sesuai dengan kebijakan BOS Nasional."
    },
    {
      q: "Bagaimana jika kami tidak bisa mengisi formulir pendaftaran online?",
      a: "Orang tua murid tidak perlu khawatir. Anda cukup membawa semua dokumen fotokopi yang diperlukan (Akta Lahir, KK, KTP) ke sekolah. Operator dan Panitia PPDB SD Negeri Bobong akan membantu memasukkan data anak Anda ke sistem pendaftaran digital sekolah."
    },
    {
      q: "Kapan pengumuman hasil seleksi diumumkan?",
      a: "Hasil seleksi PPDB SD Negeri Bobong akan diumumkan secara resmi pada tanggal 06 Juli 2026. Pengumuman akan ditempel di gerbang sekolah, dikirim ke grup koordinasi wali murid baru, serta diinfokan di halaman berita website ini."
    }
  ];

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>PPDB TA 2026/2027</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Portal resmi Penerimaan Peserta Didik Baru SD Negeri Bobong secara daring dan transparan.</p>
        </div>
      </section>

      {/* Syarat & Berkas */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Persyaratan</span>
            <h2>Syarat Pendaftaran PPDB</h2>
          </div>

          <div className="grid-2">
            {/* Usia */}
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--secondary)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>👶</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Batas Usia Anak</h3>
              <p style={{ fontSize: '0.95rem', marginBottom: 0 }}>Calon peserta didik baru harus berusia <strong>minimal 6 (enam) tahun</strong> pada tanggal <strong>1 Juli 2026</strong>. Anak berusia 7 tahun akan diprioritaskan dalam penerimaan kuota utama sesuai instruksi Dinas Pendidikan Kabupaten Pulau Taliabu.</p>
            </div>

            {/* Dokumen */}
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                Dokumen yang Harus Disiapkan
              </h3>
              <ul className="misi-list" style={{ fontSize: '0.95rem' }}>
                <li>Scan/Fotokopi <strong>Akta Kelahiran</strong> calon siswa.</li>
                <li>Scan/Fotokopi <strong>Kartu Keluarga (KK)</strong> terbaru.</li>
                <li>Scan/Fotokopi <strong>KTP Orang Tua</strong> (Ayah dan Ibu / Wali).</li>
                <li>Pas foto berwarna ukuran <strong>3x4 (Latar Merah)</strong> sebanyak 2 lembar (jika tatap muka).</li>
                <li>Mengisi formulir pendaftaran resmi.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Langkah-Langkah</span>
            <h2>Alur & Jadwal Pendaftaran</h2>
          </div>

          <div className="grid-2" style={{ alignItems: 'flex-start' }}>
            {/* Steps Infographic */}
            <div className="ppdb-steps">
              <div className="ppdb-step-item">
                <div className="ppdb-step-number">1</div>
                <h4 className="ppdb-step-title">Persiapan Dokumen</h4>
                <p style={{ fontSize: '0.9rem' }}>Orang tua menyiapkan scan/fotokopi berkas persyaratan (Akta Lahir, KK, KTP).</p>
              </div>
              <div className="ppdb-step-item">
                <div className="ppdb-step-number">2</div>
                <h4 className="ppdb-step-title">Pengisian Formulir</h4>
                <p style={{ fontSize: '0.9rem' }}>Klik tombol <strong>Daftar Daring</strong> di bawah, atau datang langsung ke sekolah untuk dibantu operator.</p>
              </div>
              <div className="ppdb-step-item">
                <div className="ppdb-step-number">3</div>
                <h4 className="ppdb-step-title">Verifikasi Berkas</h4>
                <p style={{ fontSize: '0.9rem' }}>Panitia PPDB SD Negeri Bobong memeriksa berkas fisik atau unggahan berkas digital.</p>
              </div>
              <div className="ppdb-step-item">
                <div className="ppdb-step-number">4</div>
                <h4 className="ppdb-step-title">Pengumuman Kelulusan</h4>
                <p style={{ fontSize: '0.9rem' }}>Pengumuman siswa yang lolos seleksi dapat diakses di papan sekolah atau via grup WhatsApp.</p>
              </div>
            </div>

            {/* Jadwal Kegiatan */}
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary)' }}>Jadwal Penting PPDB 2026</h3>

              <div className="table-responsive" style={{ boxShadow: 'none', border: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th>Kegiatan</th>
                      <th>Tanggal / Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Pendaftaran Online/Offline</strong></td>
                      <td>01 Juni - 30 Juni 2026</td>
                    </tr>
                    <tr>
                      <td><strong>Verifikasi Berkas & Wawancara</strong></td>
                      <td>01 Juli - 03 Juli 2026 (08.00 - 12.00 WIT)</td>
                    </tr>
                    <tr>
                      <td><strong>Pengumuman Hasil Seleksi</strong></td>
                      <td>06 Juli 2026</td>
                    </tr>
                    <tr>
                      <td><strong>Daftar Ulang Siswa Baru</strong></td>
                      <td>07 Juli - 10 Juli 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Update Calon Siswa Terdaftar */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Live Update</span>
            <h2>Data Calon Siswa Terdaftar</h2>
          </div>

          <p className="text-center" style={{ marginBottom: 'var(--space-md)', color: 'var(--text-muted)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Berikut adalah daftar calon siswa baru yang berkasnya telah masuk ke database pendaftaran online SD Negeri Bobong. Nama dan alamat telah disamarkan demi menjaga privasi calon peserta didik.
          </p>

          <div className="table-responsive" style={{ maxWidth: '900px', margin: '0 auto var(--space-md) auto' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>No</th>
                  <th>Nama Siswa</th>
                  <th>Jalur PPDB</th>
                  <th>Wilayah / Desa</th>
                  <th style={{ textAlign: 'center' }}>Waktu Daftar</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendaftarList.length > 0 ? (
                  pendaftarList.map((pendaftar, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ color: 'var(--primary-dark)', fontWeight: 500 }}>{pendaftar.nama_lengkap}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#E8F0FE', color: 'var(--primary)', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                          {pendaftar.jalur_ppdb}
                        </span>
                      </td>
                      <td>{pendaftar.alamat_domisili}</td>
                      <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>{pendaftar.waktu_daftar}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge" style={{ backgroundColor: '#E8FAF0', color: '#10B981', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', border: '1px solid #A7F3D0' }}>
                          {pendaftar.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Belum ada calon siswa yang terdaftar secara daring.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-center" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Data diperbarui secara otomatis setiap kali ada pendaftar baru. Total pendaftar saat ini: <strong>{pendaftarList.length} siswa</strong>.
          </p>
        </div>
      </section>

      {/* Formulir Pendaftaran Online */}
      <section className="section-padding text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--accent)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: 'var(--space-xs)' }}>Siap Bergabung dengan SD Negeri Bobong?</h2>
            <p style={{ marginBottom: 'var(--space-md)' }}>Pilih salah satu metode pendaftaran yang paling mudah bagi Anda di bawah ini:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/ppdb-online" className="btn btn-secondary btn-block" style={{ maxWidth: '400px', fontSize: '1.05rem', textDecoration: 'none', display: 'inline-block' }}>
                📝 Isi Formulir PPDB Online
              </Link>
              <Link href="/formulir-ppdb" target="_blank" className="btn btn-outline btn-block" style={{ maxWidth: '400px', textDecoration: 'none', display: 'inline-block' }}>
                📥 Cetak / Unduh Formulir Offline
              </Link>
              <a href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20SDN%20Bobong,%20saya%20kesulitan%20mendaftar%20online.%20Mohon%20bantuan..." target="_blank" rel="noreferrer" className="btn btn-accent btn-block" style={{ maxWidth: '400px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', display: 'inline-block' }}>
                💬 Tanya Panitia via WhatsApp
              </a>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)', lineHeight: 1.4 }}>
              *Jika mendaftar secara tatap muka (langsung), harap membawa dokumen asli dan fotokopi ke ruang Panitia PPDB SD Negeri Bobong (Samping Kantor Tata Usaha) pada jam kerja.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <span className="section-subtitle">Pertanyaan Populer</span>
            <h2>Tanya Jawab Seputar PPDB</h2>
          </div>

          <div className="accordion">
            {faqData.map((item, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <div key={idx} className={`accordion-item ${isOpen ? 'active' : ''}`}>
                  <div 
                    className="accordion-header" 
                    onClick={() => toggleAccordion(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.q}
                    <span className="accordion-icon">{isOpen ? '▲' : '▼'}</span>
                  </div>
                  <div 
                    className="accordion-content"
                    style={{ 
                      maxHeight: isOpen ? '200px' : '0px', 
                      overflow: 'hidden', 
                      transition: 'max-height 0.3s ease-out' 
                    }}
                  >
                    <p style={{ padding: '1rem 0' }}>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kontak Panitia PPDB */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <span className="section-subtitle">Hubungi Kami</span>
            <h2>Kontak Resmi Panitia PPDB</h2>
          </div>
          <p className="text-center" style={{ marginBottom: 'var(--space-md)', color: 'var(--text-muted)' }}>Apabila Bapak/Ibu wali murid mengalami kendala saat mengisi formulir online, silakan hubungi panitia PPDB berikut:</p>
          <div className="grid-2">
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Informasi & Humas PPDB</h3>
              <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Ibu Husnita Usman, M.Pd.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Pendidik Bidang Studi / Humas Sekolah</p>
              <a href="https://wa.me/6281234567890?text=Halo%20Ibu%20Husnita,%20saya%20ingin%20bertanya%20mengenai%20syarat%20PPDB%20SDN%20Bobong..." target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%' }}>Tanya Ibu Husnita (WA)</a>
            </div>
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Dukungan Teknis & Dapodik</h3>
              <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Bapak Kasmudin</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Operator Sekolah SD Negeri Bobong</p>
              <a href="https://wa.me/6281234567890?text=Halo%20Bapak%20Kasmudin,%20saya%20mengalami%20kendala%20teknis%20daring%20PPDB%20SDN%20Bobong..." target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', color: 'white' }}>Tanya Pak Kasmudin (WA)</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
