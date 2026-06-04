export const revalidate = 0;

export default function Kesiswaan() {
  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Kesiswaan & Ekstrakurikuler</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Wadah eksplorasi bakat, minat, serta apresiasi etalase prestasi siswa-siswi kami.</p>
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
            {/* Ekskul 1: Pramuka */}
            <div className="extra-card">
              <img src="/images/ekskul_pramuka.svg" alt="Aktivitas Pramuka SD Negeri Bobong" className="extra-img" />
              <div className="extra-body">
                <span className="badge badge-primary" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block' }}>Wajib</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Gerakan Pramuka (Gugus Depan)</h3>
                <p style={{ fontSize: '0.9rem' }}>Melatih kemandirian, kedisiplinan, kerja sama, dan kecintaan pada alam. Pramuka merupakan kegiatan ekstra wajib bagi siswa kelas 3 s/d 6.</p>
                <div className="extra-schedule">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
                  Sabtu, Pukul 14.00 - 16.00 WIT
                </div>
              </div>
            </div>

            {/* Ekskul 2: UKS */}
            <div className="extra-card">
              <img src="/images/ekskul_uks.svg" alt="Aktivitas UKS Dokter Kecil" className="extra-img" />
              <div className="extra-body">
                <span className="badge badge-accent" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block', color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>Pilihan</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Dokter Kecil & UKS</h3>
                <p style={{ fontSize: '0.9rem' }}>Membekali siswa dengan pemahaman kesehatan dasar, P3K, pola hidup bersih sehat (PHBS), serta pembantuan lingkungan sehat sekolah.</p>
                <div className="extra-schedule">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
                  Rabu, Pukul 15.00 - 16.30 WIT
                </div>
              </div>
            </div>

            {/* Ekskul 3: Olahraga */}
            <div className="extra-card">
              <img src="/images/ekskul_olahraga.svg" alt="Aktivitas Olahraga" className="extra-img" />
              <div className="extra-body">
                <span className="badge badge-accent" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block', color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>Pilihan</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Klub Olahraga (Sepak Bola & Bulu Tangkis)</h3>
                <p style={{ fontSize: '0.9rem' }}>Mengembangkan ketangkasan motorik siswa dan menyaring bibit unggul untuk kejuaraan O2SN tingkat kabupaten dan provinsi.</p>
                <div className="extra-schedule">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
                  Selasa, Pukul 15.30 - 17.00 WIT
                </div>
              </div>
            </div>

            {/* Ekskul 4: Seni Tari */}
            <div className="extra-card">
              <img src="/images/ekskul_senitari.svg" alt="Aktivitas Tari Tradisional" className="extra-img" />
              <div className="extra-body">
                <span className="badge badge-accent" style={{ marginBottom: 'var(--space-xs)', display: 'inline-block', color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>Pilihan</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Seni Tari Tradisional Maluku Utara</h3>
                <p style={{ fontSize: '0.9rem' }}>Melestarikan kebudayaan daerah melalui tari tradisional seperti Tari Lalayon dan Soya-Soya. Melatih keselarasan gerak dan estetika seni.</p>
                <div className="extra-schedule">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
                  Kamis, Pukul 15.00 - 17.00 WIT
                </div>
              </div>
            </div>
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
            {/* Prestasi 1 */}
            <div style={{ background: 'white', border: '2px solid var(--secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', textAlign: 'center', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: 'var(--secondary)', transform: 'rotate(45deg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 800, transform: 'rotate(-45deg)' }}>1st</span>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF8E6', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-xs) auto', boxShadow: 'var(--shadow-sm)' }}>
                🏆
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Juara 1 Lomba Pidato</h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tingkat Kabupaten</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Diraih oleh <strong>Fahri Taliabu</strong> dalam Lomba Pidato Bahasa Indonesia Hari Guru Nasional Kabupaten Pulau Taliabu Tahun 2025.</p>
            </div>

            {/* Prestasi 2 */}
            <div style={{ background: 'white', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', textAlign: 'center', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: 'var(--border-color)', transform: 'rotate(45deg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>
                <span style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, transform: 'rotate(-45deg)' }}>2nd</span>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F3F4F6', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '2rem', margin: '0 auto var(--space-xs) auto', boxShadow: 'var(--shadow-sm)' }}>
                🥈
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Juara 2 Kaligrafi</h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tingkat Kecamatan</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Diraih oleh <strong>Siti Aminah</strong> dalam Festival Lomba Seni Siswa Nasional (FLS2N) Tingkat Kecamatan Taliabu Barat Tahun 2025.</p>
            </div>

            {/* Prestasi 3 */}
            <div style={{ background: 'white', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', textAlign: 'center', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: 'var(--accent-light)', transform: 'rotate(45deg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 800, transform: 'rotate(-45deg)' }}>H1</span>
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-xs) auto', boxShadow: 'var(--shadow-sm)' }}>
                🏅
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Juara Harapan 1 Pramuka</h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tingkat Kabupaten</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Diraih oleh <strong>Regu Garuda Penggalang Putra</strong> dalam Lomba Tingkat Gugus Depan Pramuka se-Kabupaten Taliabu Tahun 2024.</p>
            </div>
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
            <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', borderColor: 'var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-xs)' }}>🎨</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-dark)' }}>Lukisan Poster Laut Taliabu</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Tema: Cinta Lingkungan Bahari</p>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}>Hasil gambar krayon siswa kelas 5 dalam rangka kampanye cinta laut pesisir Pulau Taliabu.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', borderColor: 'var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-xs)' }}>🪵</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-dark)' }}>Tempat Pensil Anyaman Bambu</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Proyek P5 - Kelas 4</p>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}>Pemanfaatan bambu anyaman tradisional khas Maluku Utara menjadi wadah alat tulis serbaguna.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center', borderColor: 'var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-xs)' }}>📝</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-dark)' }}>Kumpulan Puisi Siswa</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Tema: Terima Kasih Guruku</p>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}>Karya tulisan puisi tangan murid kelas 3 pada peringatan HUT Persatuan Guru Republik Indonesia.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
