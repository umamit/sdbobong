import Link from 'next/link';
import Image from 'next/image';
import { loadNews, loadWebConfig, loadTeachers } from '../lib/database';
import NewsCard from '../components/NewsCard';
import StatsCounter from '../components/StatsCounter';
import { FramerRevealContainer, FramerRevealItem, FramerWordReveal, FramerReveal } from '../components/FramerReveal';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable compile-time cache to fetch fresh content

export default async function Home() {
  noStore(); // Force dynamic fetching and bypass any cached render
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
    hero_text: "\"Berakhlak Mulia, Cerdas, dan Berbudaya.\" Kami berkomitmen menyelenggarakan pendidikan dasar yang inklusif, adaptif, dan berlandaskan kearifan lokal di Kabupaten Pulau Taliabu.",
    welcome_badge: "Sambutan Kepala Sekolah",
    welcome_title: "Mendidik dengan Hati, Membentuk Generasi Berakhlak Mulia, Cerdas, dan Berbudaya",
    welcome_quote: "\"Pendidikan utama adalah menanamkan akhlak mulia dan ketakwaan, diiringi pengembangan kecerdasan berpikir serta pelestarian nilai budaya agar generasi siap bersaing di era global.\"",
    welcome_p1: "Assalamu'alaikum Warahmatullahi Wabarakatuh,\nSalam sejahtera untuk kita semua. Selamat datang di website resmi SD Negeri Bobong.",
    welcome_p2: "Sebagai sekolah dasar rujukan di ibukota Kabupaten Pulau Taliabu, kami berkomitmen mewujudkan layanan pendidikan yang berkualitas dengan mengutamakan pembentukan karakter siswa yang berakhlak mulia, cerdas dalam berpikir, serta luhur dalam menjaga nilai budaya bangsa. Kehadiran website ini diharapkan mampu mempererat kolaborasi antara sekolah, orang tua, dan masyarakat luas demi kemajuan belajar anak."
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
      {isVideoBg && (
        <link rel="preload" as="image" href="/images/hero_school.svg" fetchPriority="high" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      {/* Hero Section */}
      <section className="hero" id="hero">
        {isVideoBg ? (
          <>
            <video
              id="hero-video"
              key={config.stats.hero_background}
              src={config.stats.hero_background}
              autoPlay
              loop
              muted
              defaultMuted
              playsInline
              preload="auto"
              poster="/images/hero_school.svg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                zIndex: 1,
                transform: 'translate3d(0, 0, 0)', // Safari GPU rendering fix
              }}
            >
              <source src={config.stats.hero_background} type="video/mp4" />
              <source src={config.stats.hero_background} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            {/* Inline script to force video play and handle browser autoplay policy restrictions */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    var v = document.getElementById("hero-video");
                    if (v) {
                      v.muted = true;
                      v.defaultMuted = true;
                      
                      // Diagnostic console logging
                      v.addEventListener("play", function() { console.log("▶️ Video background starts playing successfully!"); });
                      v.addEventListener("pause", function() { console.log("⏸️ Video background paused."); });
                      v.addEventListener("waiting", function() { console.log("⏳ Video background is buffering/waiting..."); });
                      v.addEventListener("stalled", function() { console.warn("⚠️ Video background loading has stalled."); });
                      v.addEventListener("error", function(e) { console.error("❌ Video background load error:", v.error); });
                      
                      var attemptPlay = function() {
                        v.play().then(function() {
                          console.log("✅ Video background autoplay call succeeded!");
                        }).catch(function(err) {
                          console.log("⚠️ Autoplay blocked by browser policy, listening for user interactions...", err);
                          var playVideo = function() {
                            v.play().then(function() {
                              console.log("✅ Video background started on user interaction!");
                              document.removeEventListener("click", playVideo);
                              document.removeEventListener("touchstart", playVideo);
                            });
                          };
                          document.addEventListener("click", playVideo);
                          document.addEventListener("touchstart", playVideo);
                        });
                      };
                      
                      // Execute immediately and attach events to eliminate any delay
                      attemptPlay();
                      v.addEventListener("loadedmetadata", attemptPlay);
                      v.addEventListener("canplay", attemptPlay);
                    }
                  })();
                `
              }}
            />
            {/* Dark overlay specifically for the video to ensure high readability of text */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(11, 60, 93, 0.55) 0%, rgba(9, 34, 53, 0.65) 100%)',
                zIndex: 2,
              }}
            />
          </>
        ) : (
          config.stats?.hero_background ? (
            <>
              {/* LCP Optimized Hero Background Image */}
              <Image
                src={config.stats.hero_background}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(11, 60, 93, 0.85) 0%, rgba(9, 34, 53, 0.9) 100%)',
                  zIndex: 1,
                }}
              />
            </>
          ) : (
            /* LCP Optimized Fallback SVG Image */
            <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, zIndex: 1 }}>
              <Image
                src="/images/hero_school.svg"
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          )
        )}
        <div className="container hero-content">
          <span className="hero-subtitle">{beranda.hero_subtitle}</span>
          <h1 className="hero-title"><FramerWordReveal text={beranda.hero_title} /></h1>
          <p className="hero-text">{beranda.hero_text}</p>
          <div className="hero-actions" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <FramerReveal direction="left" delay={0.3}>
              <Link href="/buku-tamu" className="btn btn-secondary">
                <svg className="icon-svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                Isi Buku Tamu
              </Link>
            </FramerReveal>
            <FramerReveal direction="right" delay={0.45}>
              <Link href="/profil" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Pelajari Profil Kami</Link>
            </FramerReveal>
          </div>
        </div>
      </section>

      <section className="section-padding welcome-section">
        <div className="container welcome-layout">
          <FramerReveal direction="left" className="welcome-apple-card">
            {kepalaSekolah ? (
              <>
                <Image 
                  src={kepalaSekolah.image} 
                  alt={`Foto ${kepalaSekolah.name}`} 
                  className="welcome-img" 
                  width={300}
                  height={380}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  loading="lazy"
                />
                <div className="welcome-apple-badge">
                  Kepala Sekolah
                </div>
              </>
            ) : (
              <div style={{ backgroundColor: '#f8fafc', color: 'var(--text-muted)', border: '2px dashed var(--border-color)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Belum Ada Foto</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kepala Sekolah</div>
              </div>
            )}
          </FramerReveal>
          <FramerReveal direction="right" delay={0.15} className="welcome-info">
            <span className="welcome-badge">{beranda.welcome_badge}</span>
            <h2>{beranda.welcome_title}</h2>
            <div className="welcome-quote" style={{ maxWidth: '75ch' }}>
              <FramerWordReveal text={beranda.welcome_quote} delay={0.2} />
            </div>
            <p className="text-justify" style={{ maxWidth: '75ch' }}>{beranda.welcome_p1}</p>
            <p className="text-justify" style={{ maxWidth: '75ch' }}>{beranda.welcome_p2}</p>
            {kepalaSekolah ? (
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <h4 style={{ margin: 0, color: 'var(--primary-dark)', fontWeight: 700 }}>{kepalaSekolah.name}</h4>
                {kepalaSekolah.nip && /^\d+$/.test(kepalaSekolah.nip.toString().replace(/\s+/g, '')) && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>NIP. {kepalaSekolah.nip}</p>
                )}
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{kepalaSekolah.role}, SD Negeri Bobong</p>
              </div>
            ) : (
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <h4 style={{ margin: 0, color: '#e53e3e', fontWeight: 700 }}>Tidak Ada</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#c53030' }}>Kepala Sekolah, SD Negeri Bobong</p>
              </div>
            )}
            <Link href="/profil" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)' }}>Baca Selengkapnya Tentang Kami</Link>
          </FramerReveal>
        </div>
      </section>

      {/* PPDB Interactive Stepper Section — Positioned under Welcome Section for optimized visual hierarchy */}
      <section className="container" style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <FramerReveal direction="up" className="stepper-section">
          <div className="stepper-header">
            <h2>4 Langkah Mudah Pendaftaran Siswa Baru (PPDB)</h2>
            <p>Ikuti panduan urutan langkah berikut untuk mendaftarkan putra-putri Anda dengan mudah</p>
          </div>
          <FramerRevealContainer className="stepper-grid">
            {/* Step 1 */}
            <FramerRevealItem>
              <Link href="/ppdb" className="stepper-step" style={{ display: 'block', height: '100%' }}>
                <div className="stepper-step-number" style={{ backgroundColor: 'rgba(18, 165, 184, 0.08)', border: '2px solid rgba(18, 165, 184, 0.15)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/animated/information.png" alt="Informasi" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <h3 className="stepper-step-title">Pahami Syarat &amp; Alur</h3>
                <p className="stepper-step-desc">Baca persyaratan umur, berkas administrasi, dan sistem zonasi pada halaman PPDB.</p>
              </Link>
            </FramerRevealItem>

            {/* Step 2 */}
            <FramerRevealItem>
              <Link href="/buku-tamu" className="stepper-step" style={{ display: 'block', height: '100%' }}>
                <div className="stepper-step-number" style={{ backgroundColor: 'rgba(79, 70, 229, 0.08)', border: '2px solid rgba(79, 70, 229, 0.15)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/animated/form.png" alt="Isi Buku Tamu" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <h3 className="stepper-step-title">Isi Buku Tamu</h3>
                <p className="stepper-step-desc">Silakan isi buku tamu digital terlebih dahulu untuk mencatatkan kunjungan Anda.</p>
              </Link>
            </FramerRevealItem>

            {/* Step 3 */}
            <FramerRevealItem>
              <div className="stepper-step">
                <div className="stepper-step-number" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '2px solid rgba(245, 158, 11, 0.15)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/animated/download.png" alt="Daftar Ulang" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <h3 className="stepper-step-title">Pengumuman &amp; Daftar Ulang</h3>
                <p className="stepper-step-desc">Pantau pengumuman kelulusan PPDB dan lakukan lapor diri secara langsung ke sekolah.</p>
              </div>
            </FramerRevealItem>

            {/* Step 4 */}
            <FramerRevealItem>
              <a 
                href={`https://wa.me/${operatorPhone}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="stepper-step"
                style={{ display: 'block', height: '100%' }}
              >
                <div className="stepper-step-number" style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '2px solid rgba(34, 197, 94, 0.15)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/animated/chat.png" alt="Hubungi Operator" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <h3 className="stepper-step-title">Konfirmasi Operator</h3>
                <p className="stepper-step-desc">Hubungi WhatsApp panitia PPDB untuk verifikasi berkas dan bantuan pendaftaran.</p>
              </a>
            </FramerRevealItem>
          </FramerRevealContainer>
        </FramerReveal>
      </section>

      {/* Stats Counter — Animated Apple HIG */}
      <section className="section-padding stats-section">
        <div className="container">
          <FramerReveal direction="up" className="stats-header" style={{ textAlign: 'center', marginBottom: 'var(--space-md)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 className="stats-main-title" style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>Statistik &amp; Fasilitas Sekolah</h2>
            <p className="stats-main-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: '1.6' }}>SD Negeri Bobong berkomitmen untuk selalu menyajikan informasi transparan serta menyediakan fasilitas sarana prasarana yang mendukung proses belajar mengajar secara optimal.</p>
          </FramerReveal>

          {/* Animated Stats Counter Component */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <StatsCounter stats={stats} />
          </div>

          <div className="stats-category-title" style={{ color: 'var(--secondary-light)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-sm)', borderBottom: '2px dashed rgba(255, 255, 255, 0.2)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/images/animated/school.png" alt="Sekolah" width={24} height={24} style={{ display: 'inline-block', verticalAlign: 'middle', objectFit: 'contain' }} /> Sarana, Prasarana &amp; Sanitasi
          </div>
          <FramerRevealContainer className="stats-grid sarpras-grid">
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <div className="stat-number">{stats.rombel}</div>
              <div className="stat-label">Rombongan Belajar</div>
            </FramerRevealItem>
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <div className="stat-number">{stats.ruang_kelas}</div>
              <div className="stat-label">Ruang Kelas</div>
            </FramerRevealItem>
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v8M8 12h8" /></svg>
              </div>
              <div className="stat-number">{stats.uks}</div>
              <div className="stat-label">Unit Kesehatan (UKS)</div>
            </FramerRevealItem>
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
              </div>
              <div className="stat-number">{stats.gudang}</div>
              <div className="stat-label">Gudang Sekolah</div>
            </FramerRevealItem>
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M9 22V12h6v10M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M12 10a4 4 0 0 0-4 4v8h8v-8a4 4 0 0 0-4-4z" /></svg>
              </div>
              <div className="stat-number">{stats.toilet}</div>
              <div className="stat-label">Kamar Mandi / WC</div>
            </FramerRevealItem>
            <FramerRevealItem className="stat-item" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" /></svg>
              </div>
              <div className="stat-number">{stats.cuci_tangan}</div>
              <div className="stat-label">Area Cuci Tangan</div>
            </FramerRevealItem>
          </FramerRevealContainer>
        </div>
      </section>

      {/* Latest News Summary Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Kabar Terkini</span>
            <h2 className="section-title">Berita & Kegiatan Terbaru</h2>
          </div>

          <FramerRevealContainer className="grid-3">
            {newsList.length > 0 ? (
              newsList.map((news, index) => (
                <FramerRevealItem key={news.id}>
                  <NewsCard 
                    news={news} 
                    className=""
                    priority={index === 0}
                  />
                </FramerRevealItem>
              ))
            ) : (
              <p style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada berita kegiatan terbaru.</p>
            )}
          </FramerRevealContainer>

          <div className="text-center" style={{ marginTop: 'var(--space-md)' }}>
            <Link href="/berita" className="btn btn-outline">Lihat Semua Berita</Link>
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
