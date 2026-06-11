'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PPDBPortal({ pendaftarList, config, teachers = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const contacts = config?.ppdb_contacts || {
    nama_humas: "",
    wa_humas: "",
    jabatan_humas: "",
    nip_humas: "",
    nama_operator: "",
    wa_operator: "",
    jabatan_operator: "",
    nip_operator: ""
  };

  const normalizeName = (name) => {
    if (!name) return "";
    let normalized = name.toLowerCase();
    
    // Remove common academic titles/suffixes
    normalized = normalized.replace(/\b(s\.?pd\.?i?\.?|m\.?pd\.?i?\.?|s\.?kom\.?|m\.?kom\.?|s\.?ag\.?|m\.?ag\.?|s\.?e\.?|m\.?e\.?|s\.?h\.?|m\.?h\.?|s\.?t\.?|m\.?t\.?|s\.?si\.?|m\.?si\.?|drs\.?|dra\.?|gr\.?)\b/gi, "");
    
    // Remove honorific prefixes (can be multiple, e.g., "Ibu Hj.")
    const prefixRegex = /^(ibu|bapak|pak|bu|sdri|sdr|haji|hajah|hj\.?|h\.?|ustad|ustadz|ustadzah)\s+/i;
    while (prefixRegex.test(normalized)) {
      normalized = normalized.replace(prefixRegex, "");
    }
    
    return normalized
      .replace(/[^a-z0-9]/gi, "")
      .trim();
  };

  // Dynamically lookup the humas and operator teachers in the live teachers list
  const matchedHumas = teachers.find(t => t.name && normalizeName(t.name) === normalizeName(contacts.nama_humas));
  const matchedOperator = teachers.find(t => t.name && normalizeName(t.name) === normalizeName(contacts.nama_operator));

  // Prioritize live database NIP, set to empty if no matching teacher is found
  const nip_humas = matchedHumas ? matchedHumas.nip : "";
  const nip_operator = matchedOperator ? matchedOperator.nip : "";

  const hasHumas = !!(contacts.nama_humas?.trim() && contacts.wa_humas?.trim() && matchedHumas);
  const hasOperator = !!(contacts.nama_operator?.trim() && contacts.wa_operator?.trim() && matchedOperator);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const ppdbConfig = config?.stats?.page_contents?.ppdb || {};

  const banner_title = ppdbConfig.banner_title || "PPDB TA 2026/2027";
  const banner_text = ppdbConfig.banner_text || "Portal resmi Penerimaan Peserta Didik Baru SD Negeri Bobong secara daring dan transparan.";
  const syarat_usia = ppdbConfig.syarat_usia || "Calon peserta didik baru harus berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2026. Anak berusia 7 tahun akan diprioritaskan dalam penerimaan kuota utama sesuai instruksi Dinas Pendidikan Kabupaten Pulau Taliabu.";
  
  const syarat_berkas = ppdbConfig.syarat_berkas || [
    "Scan Akta Kelahiran asli (Format PDF, 150KB - 350KB) *",
    "Scan Kartu Keluarga (KK) terbaru asli (Format PDF, 150KB - 350KB) *",
    "Scan KTP Orang Tua (Ayah & Ibu dijadikan 1 file PDF, 150KB - 350KB) *",
    "Scan SPTJM (Surat Pertanggungjawaban Mutlak) asli (Format PDF, 150KB - 350KB) *",
    "Scan KIP / PKH asli (Format PDF, 150KB - 350KB) (Opsional jika memiliki)",
    "Scan Ijazah TK / PAUD asli (Format PDF, 150KB - 350KB) (Opsional jika memiliki)",
    "Pas foto berwarna ukuran 3x4 (Latar Merah) sebanyak 2 lembar (untuk keperluan fisik/tatap muka)."
  ];

  const alur_steps = ppdbConfig.alur_steps || [
    { num: "1", title: "Persiapan Dokumen", desc: "Orang tua menyiapkan scan berkas persyaratan asli dalam format PDF (disarankan 150KB - 350KB)." },
    { num: "2", title: "Pengisian Formulir", desc: "Klik tombol Daftar Daring di bawah untuk mengisi form dan langsung mengunggah file PDF berkas." },
    { num: "3", title: "Verifikasi Berkas", desc: "Panitia PPDB memeriksa kelengkapan isian formulir serta keabsahan berkas PDF yang diunggah." },
    { num: "4", title: "Pengumuman Kelulusan", desc: "Pengumuman siswa lolos seleksi dapat diakses di gerbang sekolah, website, atau via koordinasi WhatsApp." }
  ];

  const faqData = ppdbConfig.faq || [
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

  const jadwal = ppdbConfig.jadwal || [
    { activity: "Pendaftaran Online/Offline", dates: "01 Juni - 30 Juni 2026" },
    { activity: "Verifikasi Berkas & Wawancara", dates: "01 Juli - 03 Juli 2026 (08.00 - 12.00 WIT)" },
    { activity: "Pengumuman Hasil Seleksi", dates: "06 Juli 2026" },
    { activity: "Daftar Ulang Siswa Baru", dates: "07 Juli - 10 Juli 2026" }
  ];

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{banner_title}</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>{banner_text}</p>
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
              <p style={{ fontSize: '0.95rem', marginBottom: 0 }}>{syarat_usia}</p>
            </div>

            {/* Dokumen */}
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                Dokumen yang Harus Disiapkan
              </h3>
              <ul className="misi-list" style={{ fontSize: '0.95rem' }}>
                {syarat_berkas.map((berkas, idx) => (
                  <li key={idx}>{berkas}</li>
                ))}
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
              {alur_steps.map((step, idx) => (
                <div key={idx} className="ppdb-step-item">
                  <div className="ppdb-step-number">{step.num || (idx + 1)}</div>
                  <h4 className="ppdb-step-title">{step.title}</h4>
                  <p style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Jadwal Kegiatan */}
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary)' }}>Jadwal Penting PPDB</h3>

              <div className="table-responsive" style={{ boxShadow: 'none', border: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th>Kegiatan</th>
                      <th>Tanggal / Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwal.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.activity}</strong></td>
                        <td>{item.dates}</td>
                      </tr>
                    ))}
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
              <a 
                href={hasHumas ? `https://wa.me/${contacts.wa_humas.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SDN%20Bobong,%20saya%20kesulitan%20mendaftar%20online.%20Mohon%20bantuan...` : hasOperator ? `https://wa.me/${contacts.wa_operator.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SDN%20Bobong,%20saya%20kesulitan%20mendaftar%20online.%20Mohon%20bantuan...` : '#'} 
                target={hasHumas || hasOperator ? "_blank" : "_self"} 
                rel="noreferrer" 
                className="btn btn-accent btn-block" 
                style={{ 
                  maxWidth: '400px', 
                  backgroundColor: (hasHumas || hasOperator) ? '#25D366' : '#cbd5e1', 
                  color: (hasHumas || hasOperator) ? 'white' : '#64748b', 
                  textDecoration: 'none', 
                  display: 'inline-block',
                  cursor: (hasHumas || hasOperator) ? 'pointer' : 'not-allowed'
                }}
              >
                { (hasHumas || hasOperator) ? "💬 Tanya Panitia via WhatsApp" : "⚠️ Kontak WhatsApp Belum Diatur" }
              </a>
              {!(hasHumas || hasOperator) && (
                <p style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                  ⚠️ Kontak WhatsApp Panitia belum diatur oleh Admin.
                </p>
              )}
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
            {hasHumas ? (
              <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Informasi & Humas PPDB</h3>
                <p style={{ fontWeight: 700, marginBottom: nip_humas ? '2px' : 'var(--space-md)', color: 'var(--text-main)' }}>{contacts.nama_humas}</p>
                {nip_humas && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>NIP. {nip_humas}</p>
                )}
                <a href={`https://wa.me/${contacts.wa_humas.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(contacts.nama_humas)},%20saya%20ingin%20bertanya%20mengenai%20syarat%20PPDB%20SDN%20Bobong...`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%' }}>Tanya {contacts.nama_humas.split(',')[0]} (WA)</a>
              </div>
            ) : (
              <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '2px dashed #EF4444', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Informasi & Humas PPDB</h3>
                <p style={{ fontWeight: 700, color: '#EF4444', fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>
                  Tidak Ada
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', cursor: 'not-allowed' }} disabled>Tanya Humas (WA)</button>
              </div>
            )}

            {hasOperator ? (
              <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Dukungan Teknis & Dapodik</h3>
                <p style={{ fontWeight: 700, marginBottom: nip_operator ? '2px' : 'var(--space-md)', color: 'var(--text-main)' }}>{contacts.nama_operator}</p>
                {nip_operator && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>NIP. {nip_operator}</p>
                )}
                <a href={`https://wa.me/${contacts.wa_operator.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(contacts.nama_operator)},%20saya%20mengalami%20kendala%20teknis%20daring%20PPDB%20SDN%20Bobong...`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', color: 'white' }}>Tanya {contacts.nama_operator.split(',')[0]} (WA)</a>
              </div>
            ) : (
              <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '2px dashed #EF4444', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: 'var(--space-xs)' }}>Dukungan Teknis & Dapodik</h3>
                <p style={{ fontWeight: 700, color: '#EF4444', fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>
                  Tidak Ada
                </p>
                <button className="btn btn-primary" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', cursor: 'not-allowed' }} disabled>Tanya Operator (WA)</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
