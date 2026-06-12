import Link from 'next/link';
import { loadNews, loadWebConfig, loadTeachers } from '../lib/database';
import NewsCard from '../components/NewsCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable compile-time cache to fetch fresh content

export default async function Home() {
  const [allNews, config, teachers] = await Promise.all([
    loadNews(),
    loadWebConfig(),
    loadTeachers()
  ]);
  const newsList = allNews.slice(0, 3);
  const defaultStats = {
    siswa_aktif: 205,
    guru_staf: 14,
    ruang_kelas: 9,
    akreditasi: "B",
    rombel: 6,
    uks: 1,
    gudang: 1,
    toilet: 2,
    cuci_tangan: 4
  };
  const stats = {
    ...defaultStats,
    ...(config.stats || {})
  };
  const contacts = config.ppdb_contacts || {};
  const operatorPhone = (contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";

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
      {config.stats?.hero_background && !isVideoBg && (
        <link rel="preload" as="image" href={config.stats.hero_background} fetchPriority="high" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      
      {/* Creative Hero Section */}
      <section className="creative-hero" id="hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        {isVideoBg ? (
          <div className="hero-video-wrap">
            <video autoPlay loop muted playsInline className="hero-video-bg">
              <source src={config.stats.hero_background} type="video/mp4" />
              <source src={config.stats.hero_background} type="video/webm" />
              <source src={config.stats.hero_background} type="video/ogg" />
              <source src={config.stats.hero_background} type="video/quicktime" />
            </video>
            <div className="hero-video-overlay" />
          </div>
        ) : (
          config.stats?.hero_background ? (
            <div 
              className="hero-image-wrap"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(9, 13, 22, 0.9) 0%, rgba(15, 23, 42, 0.93) 100%), url('${config.stats.hero_background}')`
              }}
            />
          ) : (
            <div className="hero-image-wrap default-bg" />
          )
        )}

        <div className="container hero-grid">
          <div className="hero-text-side">
            <div className="hero-tag">// {beranda.hero_subtitle}</div>
            <h1 className="hero-title-creative">
              {beranda.hero_title.split(" ").slice(0, 3).join(" ")} <br/>
              <span className="gradient-text">{beranda.hero_title.split(" ").slice(3).join(" ")}</span>
            </h1>
            <p className="hero-desc-creative">{beranda.hero_text}</p>
            <div className="hero-actions-creative">
              <Link href="/ppdb" className="creative-btn btn-primary-glow">
                <span>Daftar PPDB Online</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <Link href="/profil" className="creative-btn btn-secondary-outline">Pelajari Profil</Link>
            </div>
          </div>

          <div className="hero-visual-side">
            <div className="telemetry-card">
              <div className="card-mesh"></div>
              <div className="telemetry-header">
                <div className="status-indicator">
                  <span className="pulse-dot"></span>
                  <span>MCP AGENT READY (v2.4.0)</span>
                </div>
                <div className="telemetry-time">
                  // PORTAL_ONLINE
                </div>
              </div>
              
              <div className="telemetry-body">
                <div className="telemetry-title">SDN_BOBONG_SYS</div>
                <div className="telemetry-stats-mini">
                  <div className="mini-stat">
                    <span className="mini-label">AKREDITASI</span>
                    <span className="mini-val text-gradient-indigo">{stats.akreditasi}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-label">SISWA</span>
                    <span className="mini-val text-gradient-amber">{stats.siswa_aktif}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-label">GURU</span>
                    <span className="mini-val text-gradient-teal">{stats.guru_staf}</span>
                  </div>
                </div>

                <div className="telemetry-console">
                  <div className="console-line">&gt; Initializing browser MCP agent shim... done.</div>
                  <div className="console-line">&gt; Exposing tools: search_school_info, register_ppdb_student...</div>
                  <div className="console-line">&gt; Status: Standing by for agent connection.</div>
                </div>
              </div>

              <div className="telemetry-footer">
                <div className="footer-coordinates">LOC // 2°24'0"S 124°24'0"E</div>
                <div className="footer-org">NPSN {stats.npsn || '60200589'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Quick Links */}
      <section className="bento-section">
        <div className="container">
          <div className="bento-grid">
            {/* Card 1: Portal PPDB (Large Card - spans 2 columns) */}
            <Link href="/ppdb" className="bento-card bento-large group">
              <div className="bento-card-glow"></div>
              <div className="bento-card-content">
                <div className="bento-badge">// 01 / INFORMATION</div>
                <h3 className="bento-title">Portal Informasi PPDB</h3>
                <p className="bento-text">Temukan persyaratan, alur, jadwal pendaftaran, serta panduan pendaftaran PPDB untuk calon siswa baru secara lengkap di sini.</p>
                <div className="bento-action">
                  <span>Lihat Alur PPDB</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div className="bento-icon-large">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
            </Link>

            {/* Card 2: PPDB Online */}
            <Link href="/ppdb-online" className="bento-card bento-normal bento-indigo group">
              <div className="bento-card-glow"></div>
              <div className="bento-card-content">
                <div className="bento-badge">// 02 / FORMULIR DARING</div>
                <h3 className="bento-title">Formulir PPDB Online</h3>
                <p className="bento-text">Isi formulir pendaftaran secara daring langsung dari ponsel atau komputer Anda.</p>
                <div className="bento-action">
                  <span>Daftar Sekarang</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </Link>

            {/* Card 3: PPDB Offline */}
            <Link href="/formulir-ppdb" className="bento-card bento-normal bento-amber group">
              <div className="bento-card-glow"></div>
              <div className="bento-card-content">
                <div className="bento-badge">// 03 / BERKAS FISIK</div>
                <h3 className="bento-title">Formulir PPDB Offline</h3>
                <p className="bento-text">Unduh dan cetak formulir pendaftaran fisik untuk diserahkan ke panitia sekolah.</p>
                <div className="bento-action">
                  <span>Unduh Dokumen</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </Link>

            {/* Card 4: WhatsApp Operator */}
            <a href={`https://wa.me/${operatorPhone}?text=Halo%20Operator%20SDN%20Bobong,%20saya%20ingin%20bertanya%20tentang%20pendaftaran...`} target="_blank" rel="noreferrer" className="bento-card bento-normal bento-emerald group">
              <div className="bento-card-glow"></div>
              <div className="bento-card-content">
                <div className="bento-badge">// 04 / CHAT LIVE</div>
                <h3 className="bento-title">Hubungi Operator WA</h3>
                <p className="bento-text">Layanan konsultasi cepat tanggap dari sekretariat panitia PPDB sekolah.</p>
                <div className="bento-action">
                  <span>Chat WhatsApp</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Asymmetrical Welcome Section */}
      <section className="creative-welcome-section section-padding">
        <div className="container welcome-grid">
          <div className="welcome-collage-side reveal-on-scroll">
            <div className="collage-bg-block"></div>
            <div className="collage-photo-frame">
              {kepalaSekolah ? (
                <img 
                  src={kepalaSekolah.image} 
                  alt={`Foto ${kepalaSekolah.name}`} 
                  className="welcome-collage-img" 
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="welcome-collage-placeholder">
                  <span className="placeholder-avatar">👤</span>
                  <div className="placeholder-title">Tidak Ada Foto</div>
                  <div className="placeholder-desc">Kepala Sekolah</div>
                </div>
              )}
            </div>
            {kepalaSekolah && (
              <div className="collage-label-tag">
                <div className="label-name">{kepalaSekolah.name}</div>
                <div className="label-title">KEPALA SEKOLAH</div>
              </div>
            )}
          </div>

          <div className="welcome-info-side reveal-on-scroll reveal-delay-200">
            <div className="welcome-tag-badge">// {beranda.welcome_badge}</div>
            <h2 className="welcome-title-creative">{beranda.welcome_title}</h2>
            <div className="welcome-accent-line"></div>
            
            <div className="welcome-quote-creative">
              <span className="quote-mark">“</span>
              {beranda.welcome_quote.replace(/[“”"']/g, '')}
              <span className="quote-mark">”</span>
            </div>

            <p className="welcome-text-p">{beranda.welcome_p1}</p>
            <p className="welcome-text-p">{beranda.welcome_p2}</p>
            
            {kepalaSekolah && (
              <div className="welcome-signature">
                {kepalaSekolah.nip && /^\d+$/.test(kepalaSekolah.nip.toString().replace(/\s+/g, '')) && (
                  <div className="sig-nip">NIP. {kepalaSekolah.nip}</div>
                )}
                <div className="sig-role">Kepala Sekolah SD Negeri Bobong</div>
              </div>
            )}

            <Link href="/profil" className="creative-btn btn-primary-glow" style={{ marginTop: '2rem' }}>
              <span>Pelajari Profil Sekolah</span>
              <svg className="btn-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard-Style Stats Counter */}
      <section className="creative-stats-section section-padding">
        <div className="container">
          <div className="stats-dashboard-header reveal-on-scroll">
            <div className="stats-tag">// DASHBOARD FASILITAS & KEANGGOTAAN</div>
            <h2 className="stats-dashboard-title">Statistik &amp; Infrastruktur</h2>
            <p className="stats-dashboard-desc">SD Negeri Bobong berkomitmen untuk selalu menyajikan informasi transparan serta menyediakan sarana prasarana yang mendukung proses belajar mengajar secara optimal.</p>
          </div>

          <div className="stats-category-label">// 01 / AKADEMIK & KEANGGOTAAN</div>
          <div className="telemetry-grid-large">
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-100">
              <div className="card-glow-indigo"></div>
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div className="stat-card-num text-gradient-indigo">{stats.siswa_aktif}</div>
              <div className="stat-card-label">Siswa Aktif</div>
            </div>
            
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-200">
              <div className="card-glow-amber"></div>
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              </div>
              <div className="stat-card-num text-gradient-amber">{stats.guru_staf}</div>
              <div className="stat-card-label">Guru &amp; Staf</div>
            </div>

            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-300">
              <div className="card-glow-teal"></div>
              <div className="stat-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
              </div>
              <div className="stat-card-num text-gradient-teal">{stats.akreditasi}</div>
              <div className="stat-card-label">Akreditasi Sekolah</div>
            </div>
          </div>

          <div className="stats-category-label" style={{ marginTop: '4rem' }}>// 02 / INFRASTRUKTUR & SANITASI</div>
          <div className="telemetry-grid-large">
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-100">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.rombel}</div>
              <div className="stat-card-label">Rombongan Belajar</div>
            </div>
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-200">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.ruang_kelas}</div>
              <div className="stat-card-label">Ruang Kelas</div>
            </div>
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-300">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.uks}</div>
              <div className="stat-card-label">Unit Kesehatan (UKS)</div>
            </div>
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-400">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.gudang}</div>
              <div className="stat-card-label">Gudang Sekolah</div>
            </div>
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-500">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.toilet}</div>
              <div className="stat-card-label">Kamar Mandi / WC</div>
            </div>
            <div className="telemetry-stat-card reveal-on-scroll reveal-delay-600">
              <div className="card-glow-blue"></div>
              <div className="stat-card-num-small">{stats.cuci_tangan}</div>
              <div className="stat-card-label">Area Cuci Tangan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetrical Latest News Section */}
      <section className="creative-news-section section-padding">
        <div className="container">
          <div className="news-header-asym reveal-on-scroll">
            <div>
              <div className="news-tag">// PENGUMUMAN & KEGIATAN</div>
              <h2 className="news-title-asym">Kabar Terkini Sekolah</h2>
            </div>
            <Link href="/berita" className="creative-btn btn-secondary-outline">Lihat Semua Berita</Link>
          </div>

          <div className="news-asym-grid">
            {newsList.length > 0 ? (
              newsList.map((news, index) => (
                <div key={news.id} className={`news-wrapper reveal-on-scroll reveal-delay-${(index + 1) * 100}`}>
                  <NewsCard news={news} />
                </div>
              ))
            ) : (
              <p style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada berita kegiatan terbaru.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// Utility function to strip HTML tags for a clean text preview
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
}
