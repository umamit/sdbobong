import Link from 'next/link';
import { loadNews, loadWebConfig } from '../lib/database';

export const revalidate = 0; // Disable compile-time cache to fetch fresh content

export default async function Home() {
  const allNews = await loadNews();
  const newsList = allNews.slice(0, 3);
  const config = loadWebConfig();
  const stats = config.stats || {
    siswa_aktif: 205,
    guru_staf: 14,
    ruang_kelas: 9,
    akreditasi: "B"
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-overlay" style={{ backgroundImage: "url('/images/hero_school.svg')" }}></div>
        <div className="container hero-content">
          <span className="hero-subtitle">Membangun Masa Depan di Jantung Taliabu</span>
          <h1 className="hero-title">Selamat Datang di Website Resmi SD Negeri Bobong</h1>
          <p className="hero-text">"Cerdas, Berkarakter, dan Berbudaya." Kami berkomitmen menyelenggarakan pendidikan dasar yang inklusif, adaptif, dan berlandaskan kearifan lokal di Kabupaten Pulau Taliabu.</p>
          <div className="hero-actions">
            <Link href="/ppdb" className="btn btn-secondary">
              <svg className="icon-svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Daftar PPDB Online
            </Link>
            <Link href="/profil" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Pelajari Profil Kami</Link>
          </div>
        </div>
      </section>

      {/* Quick Links (Thumb-Friendly for Mobile) */}
      <section className="container" style={{ position: 'relative', zIndex: 20 }}>
        <div className="quick-links-section">
          <div className="quick-links-grid">
            {/* Link 1: PPDB */}
            <Link href="/ppdb" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-link-card">
                <div className="quick-link-icon">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="quick-link-info">
                  <h3>Daftar PPDB</h3>
                  <p>Penerimaan Murid Baru</p>
                </div>
              </div>
            </Link>
            {/* Link 2: Download Schedule */}
            <Link href="/akademik#tata-tertib" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-link-card">
                <div className="quick-link-icon">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div className="quick-link-info">
                  <h3>Unduh Jadwal & Tata Tertib</h3>
                  <p>Kalender dan Aturan Sekolah</p>
                </div>
              </div>
            </Link>
            {/* Link 3: Contact WA Operator */}
            <a href="https://wa.me/6281234567890?text=Halo%20Operator%20SDN%20Bobong,%20saya%20ingin%20bertanya..." target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-link-card">
                <div className="quick-link-icon" style={{ backgroundColor: '#E8FAF0', color: '#25D366' }}>
                  <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <div className="quick-link-info">
                  <h3>Hubungi Operator via WA</h3>
                  <p>Layanan Cepat Tanggap Wali Murid</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="section-padding welcome-section">
        <div className="container welcome-layout">
          <div className="welcome-img-container">
            <img src="/images/principal.svg" alt="Kepala Sekolah SD Negeri Bobong" className="welcome-img" />
          </div>
          <div className="welcome-info">
            <span className="welcome-badge">Sambutan Kepala Sekolah</span>
            <h2>Mendidik dengan Hati dan Budaya Taliabu</h2>
            <div className="welcome-quote">
              "Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan lentera karakter anak agar siap bersaing tanpa melupakan akar budaya leluhurnya."
            </div>
            <p>Assalamualaikum Wr. Wb., Salam Sejahtera untuk kita semua. Selamat datang di website resmi SD Negeri Bobong.</p>
            <p>Sebagai sekolah yang berada di pusat ibukota Kabupaten Pulau Taliabu, kami berkomitmen untuk terus berinovasi dalam mengimplementasikan kurikulum nasional yang relevan dengan perkembangan zaman. Kehadiran website ini diharapkan mampu menjembatani kebutuhan informasi orang tua, guru, dinas terkait, serta masyarakat luas dengan cepat dan efisien.</p>
            <Link href="/profil" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)' }}>Baca Selengkapnya Tentang Kami</Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="section-padding stats-section">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.siswa_aktif}</div>
            <div className="stat-label">Siswa Aktif</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.guru_staf}</div>
            <div className="stat-label">Guru & Staf</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.ruang_kelas}</div>
            <div className="stat-label">Ruang Kelas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.akreditasi}</div>
            <div className="stat-label">Akreditasi Sekolah</div>
          </div>
        </div>
      </section>

      {/* Latest News Summary Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Kabar Terkini</span>
            <h2 className="section-title">Berita & Kegiatan Terbaru</h2>
          </div>

          <div className="grid-3">
            {newsList.length > 0 ? (
              newsList.map((news) => (
                <article key={news.id} className="card">
                  <img src={news.image} alt={news.title} className="card-img" />
                  <div className="card-body">
                    <div className="card-meta">
                      <span>📅 {news.date}</span>
                      <span>•</span>
                      <span>🏷️ {news.category}</span>
                    </div>
                    <h3 className="card-title"><Link href="/berita">{news.title}</Link></h3>
                    <p className="card-text">{news.content.substring(0, 100)}...</p>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada berita kegiatan terbaru.</p>
            )}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-md)' }}>
            <Link href="/berita" className="btn btn-outline">Lihat Semua Berita</Link>
          </div>
        </div>
      </section>
    </>
  );
}
