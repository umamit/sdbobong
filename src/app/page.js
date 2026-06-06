import Link from 'next/link';
import { loadNews, loadWebConfig, loadTeachers } from '../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable compile-time cache to fetch fresh content

export default async function Home() {
  const allNews = await loadNews();
  const newsList = allNews.slice(0, 3);
  const config = await loadWebConfig();
  const stats = config.stats || {
    siswa_aktif: 205,
    guru_staf: 14,
    ruang_kelas: 9,
    akreditasi: "B"
  };
  const contacts = config.ppdb_contacts || {};
  const operatorPhone = (contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";

  const teachers = await loadTeachers();
  const kepalaSekolah = teachers.find(t => (t.role || "").toLowerCase().includes("kepala sekolah")) || null;

  const beranda = config.stats?.page_contents?.beranda || {
    hero_subtitle: "Membangun Masa Depan di Jantung Taliabu",
    hero_title: "Selamat Datang di Website Resmi SD Negeri Bobong",
    hero_text: "\"Cerdas, Berkarakter, dan Berbudaya.\" Kami berkomitmen menyelenggarakan pendidikan dasar yang inklusif, adaptif, dan berlandaskan kearifan lokal di Kabupaten Pulau Taliabu.",
    welcome_badge: "Sambutan Kepala Sekolah",
    welcome_title: "Mendidik dengan Hati dan Budaya Taliabu",
    welcome_quote: "\"Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan lentera karakter anak agar siap bersaing tanpa melupakan akar budaya leluhurnya.\"",
    welcome_p1: "Assalamualaikum Wr. Wb., Salam Sejahtera untuk kita semua. Selamat datang di website resmi SD Negeri Bobong.",
    welcome_p2: "Sebagai sekolah yang berada di pusat ibukota Kabupaten Pulau Taliabu, kami berkomitmen untuk terus berinovasi dalam mengimplementasikan kurikulum nasional yang relevan dengan perkembangan zaman. Kehadiran website ini diharapkan mampu menjembatani kebutuhan informasi orang tua, guru, dinas terkait, serta masyarakat luas dengan cepat dan efisien."
  };

  const isVideoBg = config.stats?.hero_background && (
    /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(config.stats.hero_background)
  );

  const schoolSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "School",
        "@id": "https://www.sdnegeribobong.sch.id/#school",
        "name": "SD Negeri Bobong",
        "url": "https://www.sdnegeribobong.sch.id",
        "sameAs": [
          "https://sdnegeribobong.sch.id"
        ],
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.sdnegeribobong.sch.id/favicon.png",
          "width": "192",
          "height": "192"
        },
        "image": "https://www.sdnegeribobong.sch.id/favicon.png",
        "description": "Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu. Menyediakan informasi profil sekolah, akademik, kesiswaan, PPDB online, dan berita terbaru.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bobong, Pulau Taliabu",
          "addressRegion": "Maluku Utara",
          "addressCountry": "ID"
        },
        "telephone": `+${operatorPhone}`
      },
      {
        "@type": "WebSite",
        "@id": "https://www.sdnegeribobong.sch.id/#website",
        "url": "https://www.sdnegeribobong.sch.id",
        "name": "SD Negeri Bobong",
        "alternateName": "SDN Bobong",
        "publisher": {
          "@id": "https://www.sdnegeribobong.sch.id/#school"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.sdnegeribobong.sch.id/berita?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      {/* Hero Section */}
      <section 
        className="hero" 
        id="hero"
        style={config.stats?.hero_background && !isVideoBg ? {
          backgroundImage: `linear-gradient(135deg, rgba(11, 60, 93, 0.85) 0%, rgba(9, 34, 53, 0.9) 100%), url('${config.stats.hero_background}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {isVideoBg ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
              }}
            >
              <source src={config.stats.hero_background} type="video/mp4" />
              <source src={config.stats.hero_background} type="video/webm" />
              <source src={config.stats.hero_background} type="video/ogg" />
              <source src={config.stats.hero_background} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
            {/* Dark overlay specifically for the video to ensure high readability of text */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(11, 60, 93, 0.82) 0%, rgba(9, 34, 53, 0.87) 100%)',
                zIndex: 1,
              }}
            />
          </>
        ) : (
          !config.stats?.hero_background && (
            <div className="hero-overlay" style={{ backgroundImage: "url('/images/hero_school.svg')" }}></div>
          )
        )}
        <div className="container hero-content">
          <span className="hero-subtitle">{beranda.hero_subtitle}</span>
          <h1 className="hero-title">{beranda.hero_title}</h1>
          <p className="hero-text">{beranda.hero_text}</p>
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
            <a href={`https://wa.me/${operatorPhone}?text=Halo%20Operator%20SDN%20Bobong,%20saya%20ingin%20bertanya...`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <div className="welcome-img-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '100%', minHeight: '320px', width: '100%' }}>
            {kepalaSekolah ? (
              <img 
                src={kepalaSekolah.image} 
                alt={`Foto ${kepalaSekolah.name}`} 
                className="welcome-img" 
                style={{ objectFit: 'cover', width: '100%', height: '100%', minHeight: '320px' }}
              />
            ) : (
              <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', width: '100%', height: '100%', minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '3rem' }}>👤</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Tidak Ada</div>
                <div style={{ fontSize: '0.9rem', color: '#c53030' }}>Foto Kepala Sekolah</div>
              </div>
            )}
          </div>
          <div className="welcome-info">
            <span className="welcome-badge">{beranda.welcome_badge}</span>
            <h2>{beranda.welcome_title}</h2>
            <div className="welcome-quote">
              {beranda.welcome_quote}
            </div>
            <p>{beranda.welcome_p1}</p>
            <p>{beranda.welcome_p2}</p>
            {kepalaSekolah ? (
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <h4 style={{ margin: 0, color: 'var(--primary-dark)', fontWeight: 700 }}>{kepalaSekolah.name}</h4>
                {kepalaSekolah.nip && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>NIP. {kepalaSekolah.nip}</p>
                )}
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{kepalaSekolah.role} SD Negeri Bobong</p>
              </div>
            ) : (
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <h4 style={{ margin: 0, color: '#e53e3e', fontWeight: 700 }}>Tidak Ada</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#c53030' }}>Kepala Sekolah SD Negeri Bobong</p>
              </div>
            )}
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
