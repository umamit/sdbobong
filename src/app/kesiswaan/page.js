import { loadWebConfig } from '../../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Kesiswaan() {
  const config = await loadWebConfig();

  const kesiswaan = config.stats?.page_contents?.kesiswaan || {
    banner_title: "Kesiswaan & Ekstrakurikuler",
    banner_text: "Wadah eksplorasi bakat, minat, serta apresiasi etalase prestasi siswa-siswi kami.",
    ekstrakurikuler: [
      { id: "ekskul_1", nama: "Gerakan Pramuka (Gugus Depan)", deskripsi: "Melatih kemandirian, kedisiplinan, kerja sama, dan kecintaan pada alam. Pramuka merupakan kegiatan ekstra wajib bagi siswa kelas 3 s/d 6.", jadwal: "Sabtu, Pukul 14.00 - 16.00 WIT", image: "/images/ekskul_pramuka.svg", is_wajib: true },
      { id: "ekskul_2", nama: "Dokter Kecil & UKS", deskripsi: "Membekali siswa dengan pemahaman kesehatan dasar, P3K, pola hidup bersih sehat (PHBS), serta pembantuan lingkungan sehat sekolah.", jadwal: "Rabu, Pukul 15.00 - 16.30 WIT", image: "/images/ekskul_uks.svg", is_wajib: false },
      { id: "ekskul_3", nama: "Klub Olahraga (Sepak Bola & Bulu Tangkis)", deskripsi: "Mengembangkan ketangkasan motorik siswa dan menyaring bibit unggul untuk kejuaraan O2SN tingkat kabupaten dan provinsi.", jadwal: "Selasa, Pukul 15.30 - 17.00 WIT", image: "/images/ekskul_olahraga.svg", is_wajib: false },
      { id: "ekskul_4", nama: "Seni Tari Tradisional Maluku Utara", deskripsi: "Melestarikan kebudayaan daerah melalui tari tradisional seperti Tari Lalayon dan Soya-Soya. Melatih keselarasan gerak dan estetika seni.", jadwal: "Kamis, Pukul 15.00 - 17.00 WIT", image: "/images/ekskul_senitari.svg", is_wajib: false }
    ],
    prestasi: [
      { rank: "1st", title: "Juara 1 Lomba Pidato", level: "Tingkat Kabupaten", desc: "Diraih oleh Fahri Taliabu dalam Lomba Pidato Bahasa Indonesia Hari Guru Nasional Kabupaten Pulau Taliabu Tahun 2025.", icon: "🏆" },
      { rank: "2nd", title: "Juara 2 Kaligrafi", level: "Tingkat Kecamatan", desc: "Diraih oleh Siti Aminah dalam Festival Lomba Seni Siswa Nasional (FLS2N) Tingkat Kecamatan Taliabu Barat Tahun 2025.", icon: "🥈" },
      { rank: "H1", title: "Juara Harapan 1 Pramuka", level: "Tingkat Kabupaten", desc: "Diraih oleh Regu Garuda Penggalang Putra dalam Lomba Tingkat Gugus Depan Pramuka se-Kabupaten Taliabu Tahun 2024.", icon: "🏅" }
    ],
    karya: [
      { icon: "🎨", title: "Lukisan Poster Laut Taliabu", category: "Tema: Cinta Lingkungan Bahari", desc: "Hasil gambar krayon siswa kelas 5 dalam rangka kampanye cinta laut pesisir Pulau Taliabu." },
      { icon: "🪵", title: "Tempat Pensil Anyaman Bambu", category: "Proyek P5 - Kelas 4", desc: "Pemanfaatan bambu anyaman tradisional khas Maluku Utara menjadi wadah alat tulis serbaguna." },
      { icon: "📝", title: "Kumpulan Puisi Siswa", category: "Tema: Terima Kasih Guruku", desc: "Karya tulisan puisi tangan murid kelas 3 pada peringatan HUT Persatuan Guru Republik Indonesia." }
    ]
  };

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{kesiswaan.banner_title}</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>{kesiswaan.banner_text}</p>
        </div>
      </section>

      {/* Ekstrakurikuler */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Pengembangan Diri</span>
            <h2>Program Ekstrakurikuler</h2>
          </div>

          <div className="extra-grid">
            {kesiswaan.ekstrakurikuler && kesiswaan.ekstrakurikuler.map((ekskul, idx) => (
              <div key={ekskul.id || idx} className="extra-card">
                <img src={ekskul.image} alt={`Aktivitas ${ekskul.nama} SD Negeri Bobong`} className="extra-img" style={{ objectFit: 'cover' }} loading="lazy" decoding="async" />
                <div className="extra-body">
                  {ekskul.is_wajib ? (
                    <span className="badge badge-primary" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block' }}>Wajib</span>
                  ) : (
                    <span className="badge badge-accent" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block', color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>Pilihan</span>
                  )}
                  <h3 style={{ marginBottom: '0.5rem' }}>{ekskul.nama}</h3>
                  <p style={{ fontSize: '0.9rem' }}>{ekskul.deskripsi}</p>
                  <div className="extra-schedule">
                    <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
                    {ekskul.jadwal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prestasi Siswa */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Etalase Juara</span>
            <h2>Prestasi Siswa SD Negeri Bobong</h2>
          </div>

          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto' }}>Kebanggaan sekolah atas dedikasi dan kerja keras para murid yang berhasil mengukir prestasi gemilang.</p>

          <div className="grid-3">
            {kesiswaan.prestasi && kesiswaan.prestasi.map((pres, idx) => {
              const isFirst = pres.rank === '1st';
              const isSecond = pres.rank === '2nd';
              const isH1 = pres.rank === 'H1' || (!isFirst && !isSecond);
              
              const badgeBg = isFirst ? '#FFF8E6' : isSecond ? '#F3F4F6' : 'var(--accent-bg)';
              const badgeColor = isFirst ? 'var(--secondary-dark)' : isSecond ? 'var(--text-muted)' : 'var(--accent)';
              const borderCol = isFirst ? 'var(--secondary)' : 'var(--border-color)';
              
              return (
                <div key={idx} style={{ background: 'white', border: `2px solid ${borderCol}`, borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', textAlign: 'center', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: borderCol === 'var(--border-color)' ? '#f1f5f9' : borderCol, transform: 'rotate(45deg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>
                    <span style={{ color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 800, transform: 'rotate(-45deg)' }}>{pres.rank}</span>
                  </div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: badgeBg, color: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-xs) auto', boxShadow: 'var(--shadow-sm)' }}>
                    {pres.icon || '🏆'}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{pres.title}</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{pres.level}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{pres.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pojok Karya Siswa */}
      <section className="section-padding" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Kreativitas</span>
            <h2>Pojok Karya Siswa</h2>
          </div>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto' }}>Apresiasi terhadap hasil karya seni, kerajinan tangan, dan proyek pembelajaran (P5) siswa-siswi SD Negeri Bobong.</p>
          <div className="grid-3">
            {kesiswaan.karya && kesiswaan.karya.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', borderColor: 'var(--border-color)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-xs)' }}>{item.icon || '🎨'}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-dark)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>{item.category}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
