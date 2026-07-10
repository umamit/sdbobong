import Link from 'next/link';
import Image from 'next/image';
import { loadNews, loadWebConfig, loadTeachers } from '../lib/database';
import NewsCard from '../components/NewsCard';
import StatsCounter from '../components/StatsCounter';
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
      {/* Hero Section */}
      <section className="hero" id="hero">
        {isVideoBg ? (
          <>
            <video
              key={config.stats.hero_background}
              src={config.stats.hero_background}
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

      {/* PPDB Interactive Stepper Section */}
      <section className="container">
        <div className="stepper-section reveal-on-scroll">
          <div className="stepper-header">
            <h2>4 Langkah Mudah Pendaftaran Siswa Baru (PPDB)</h2>
            <p>Ikuti panduan urutan langkah berikut untuk mendaftarkan putra-putri Anda dengan mudah</p>
          </div>
          <div className="stepper-grid">
            {/* Step 1 */}
            <Link href="/ppdb" className="stepper-step">
              <div className="stepper-step-number">1</div>
              <h3 className="stepper-step-title">Pelajari Info &amp; Syarat</h3>
              <p className="stepper-step-desc">Baca alur, jadwal, persyaratan dokumen, dan daya tampung kuota sekolah.</p>
            </Link>

            {/* Step 2 */}
            <Link href="/ppdb-online" className="stepper-step">
              <div className="stepper-step-number">2</div>
              <h3 className="stepper-step-title">Isi Formulir Online</h3>
              <p className="stepper-step-desc">Isi formulir pendaftaran daring secara lengkap, cepat, dan aman dari rumah.</p>
            </Link>

            {/* Step 3 */}
            <Link href="/formulir-ppdb" className="stepper-step">
              <div className="stepper-step-number">3</div>
              <h3 className="stepper-step-title">Unduh Berkas Cetak</h3>
              <p className="stepper-step-desc">Unduh format berkas fisik untuk pendaftaran offline atau bukti fisik cetak.</p>
            </Link>

            {/* Step 4 */}
            <a 
              href={`https://wa.me/${operatorPhone}?text=Halo%20Operator%20PPDB%20SDN%20Bobong,%20saya%20ingin%20konfirmasi/tanya%20tentang%20pendaftaran...`} 
              target="_blank" 
              rel="noreferrer" 
              className="stepper-step"
            >
              <div className="stepper-step-number">4</div>
              <h3 className="stepper-step-title">Konfirmasi Operator</h3>
              <p className="stepper-step-desc">Hubungi WhatsApp panitia PPDB untuk verifikasi berkas dan bantuan pendaftaran.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding welcome-section">
        <div className="container welcome-layout">
          <div className="welcome-img-container reveal-on-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '100%', minHeight: '320px', width: '100%' }}>
            {kepalaSekolah ? (
              <Image 
                src={kepalaSekolah.image} 
                alt={`Foto ${kepalaSekolah.name}`} 
                className="welcome-img" 
                width={400}
                height={500}
                style={{ objectFit: 'cover', width: '100%', height: '100%', minHeight: '320px' }}
                loading="lazy"
              />
            ) : (
              <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', width: '100%', height: '100%', minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '3rem' }}>👤</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Tidak Ada</div>
                <div style={{ fontSize: '0.9rem', color: '#c53030' }}>Foto Kepala Sekolah</div>
              </div>
            )}
          </div>
          <div className="welcome-info reveal-on-scroll reveal-delay-200">
            <span className="welcome-badge">{beranda.welcome_badge}</span>
            <h2>{beranda.welcome_title}</h2>
            <div className="welcome-quote" style={{ maxWidth: '75ch' }}>
              {beranda.welcome_quote}
            </div>
            <p className="text-justify" style={{ maxWidth: '75ch' }}>{beranda.welcome_p1}</p>
            <p className="text-justify" style={{ maxWidth: '75ch' }}>{beranda.welcome_p2}</p>
            {kepalaSekolah ? (
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <h4 style={{ margin: 0, color: 'var(--primary-dark)', fontWeight: 700 }}>{kepalaSekolah.name}</h4>
                {kepalaSekolah.nip && /^\d+$/.test(kepalaSekolah.nip.toString().replace(/\s+/g, '')) && (
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

      {/* Stats Counter — Animated Apple HIG */}
      <section className="section-padding stats-section">
        <div className="container">
          <div className="stats-header reveal-on-scroll" style={{ textAlign: 'center', marginBottom: 'var(--space-md)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 className="stats-main-title" style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>Statistik &amp; Fasilitas Sekolah</h2>
            <p className="stats-main-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: '1.6' }}>SD Negeri Bobong berkomitmen untuk selalu menyajikan informasi transparan serta menyediakan fasilitas sarana prasarana yang mendukung proses belajar mengajar secara optimal.</p>
          </div>

          {/* Animated Stats Counter Component */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <StatsCounter stats={stats} />
          </div>

          <div className="stats-category-title" style={{ color: 'var(--secondary-light)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-sm)', borderBottom: '2px dashed rgba(255, 255, 255, 0.2)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏫</span> Sarana, Prasarana &amp; Sanitasi
          </div>
          <div className="stats-grid sarpras-grid">
            <div className="stat-item reveal-on-scroll reveal-delay-100">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <div className="stat-number">{stats.rombel}</div>
              <div className="stat-label">Rombongan Belajar</div>
            </div>
            <div className="stat-item reveal-on-scroll reveal-delay-200">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <div className="stat-number">{stats.ruang_kelas}</div>
              <div className="stat-label">Ruang Kelas</div>
            </div>
            <div className="stat-item reveal-on-scroll reveal-delay-300">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v8M8 12h8" /></svg>
              </div>
              <div className="stat-number">{stats.uks}</div>
              <div className="stat-label">Unit Kesehatan (UKS)</div>
            </div>
            <div className="stat-item reveal-on-scroll reveal-delay-400">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
              </div>
              <div className="stat-number">{stats.gudang}</div>
              <div className="stat-label">Gudang Sekolah</div>
            </div>
            <div className="stat-item reveal-on-scroll reveal-delay-500">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M9 22V12h6v10M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M12 10a4 4 0 0 0-4 4v8h8v-8a4 4 0 0 0-4-4z" /></svg>
              </div>
              <div className="stat-number">{stats.toilet}</div>
              <div className="stat-label">Kamar Mandi / WC</div>
            </div>
            <div className="stat-item reveal-on-scroll reveal-delay-600">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" /></svg>
              </div>
              <div className="stat-number">{stats.cuci_tangan}</div>
              <div className="stat-label">Area Cuci Tangan</div>
            </div>
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
              newsList.map((news, index) => (
                <NewsCard 
                  key={news.id} 
                  news={news} 
                  className={`reveal-on-scroll reveal-delay-${(index + 1) * 100}`}
                />
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

// Utility function to strip HTML tags for a clean text preview
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
}
