import '../../public/css/style.css';
import Header from '../components/Header';
import { loadWebConfig } from '../lib/database';
import LayoutControl from '../components/LayoutControl';
import ChatWidget from '../components/ChatWidget';
import Script from 'next/script';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'SD Negeri Bobong - Cerdas, Berkarakter, dan Berbudaya',
  description: 'Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu. Menyediakan informasi profil sekolah, akademik, kesiswaan, PPDB online, dan berita terbaru.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.png',
  },
};

export default async function RootLayout({ children }) {
  // Load global configurations dynamically at render time (Server component)
  const config = await loadWebConfig();
  const announcements = config.marquee_announcements || [];
  const contacts = config.ppdb_contacts || {};
  const schoolEmail = contacts.email_sekolah || "sdn.bobong.taliabu@gmail.com";

  const profil = config.stats?.page_contents?.profil || {};
  const schoolDesc = profil.footer_description || "SD Negeri Bobong adalah sekolah dasar negeri unggulan di Ibukota Kabupaten Pulau Taliabu, Maluku Utara. Berdedikasi mencetak generasi cerdas, berkarakter mulia, dan berbudaya luhur.";
  const schoolAddress = profil.alamat_lengkap || "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791";
  const schoolNpsn = profil.npsn || "60200589";

  const operatorPhone = (contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";
  const floatingPhone = (contacts.wa_floating || contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";


  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.location.pathname.startsWith('/admin')) {
            document.documentElement.classList.add('is-admin');
          }

          // Anti-cloning protection script for public pages
          if (!window.location.pathname.startsWith('/admin')) {
            // 1. Prevent Right-Click
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            });

            // 2. Prevent keyboard shortcuts for inspection, view-source, saving, copy, pasting, and printing
            document.addEventListener('keydown', function(e) {
              // Disable Ctrl+S / Cmd+S (Save)
              if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
              }
              // Disable Ctrl+U / Cmd+U (View Source)
              if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
              }
              // Disable Ctrl+P / Cmd+P (Print)
              if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
              }
              // Disable F12
              if (e.key === 'F12') {
                e.preventDefault();
              }
              // Disable Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
              if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
              }
              // Disable Ctrl+Shift+C / Cmd+Opt+C (Inspect Element selection)
              if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
              }
              // Disable Ctrl+C / Cmd+C (Copy)
              if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
              }
            });

            // 3. Prevent dragging and dropping images (prevents saving images by dragging)
            document.addEventListener('dragstart', function(e) {
              if (e.target.nodeName === 'IMG') {
                e.preventDefault();
              }
            });
          }
        `}} />
      </head>
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YLP88SDQ53"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YLP88SDQ53');
          `}
        </Script>
        <LayoutControl />
        {/* Running Announcement Banner */}
        <div className="announcement-banner no-print public-layout-announcement">
          <div className="marquee-content">
            {announcements.map((ann, idx) => (
              <span key={idx}>{ann}</span>
            ))}
          </div>
        </div>

        {/* Header & Navigation */}
        <div className="no-print public-layout-header">
          <Header />
        </div>

        {/* Main Content Area */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="no-print public-layout-footer">
          <div className="container footer-grid">
            <div className="footer-widget">
              <a href="/" className="logo-container" style={{ marginBottom: 'var(--space-xs)', textDecoration: 'none' }}>
                <img src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" className="school-logo" loading="lazy" decoding="async" />
                <span className="logo-title" style={{ color: 'white' }}>SD NEGERI BOBONG</span>
              </a>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '1rem' }}>
                {schoolDesc}
              </p>
            </div>
            <div className="footer-widget">
              <h3>Navigasi Cepat</h3>
              <ul className="footer-links">
                <li><Link href="/">Beranda</Link></li>
                <li><Link href="/profil">Profil Sekolah</Link></li>
                <li><Link href="/akademik">Informasi Akademik</Link></li>
                <li><Link href="/kesiswaan">Kesiswaan &amp; Ekskul</Link></li>
                <li><Link href="/ppdb">Portal Info PPDB</Link></li>
                <li><Link href="/ppdb-online">Formulir PPDB Online</Link></li>
                <li><Link href="/formulir-ppdb">Formulir PPDB Offline</Link></li>
                <li><Link href="/berita">Berita Sekolah</Link></li>
              </ul>
            </div>
            <div className="footer-widget">
              <h3>Kontak Sekolah</h3>
              <div className="footer-contact-info">
                <a href="https://maps.google.com/?q=SD+Negeri+Bobong+Pulau+Taliabu" target="_blank" rel="noreferrer" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>{schoolAddress}</span>
                </a>
                <a href="https://sekolah.data.kemendikdasmen.go.id/profil-sekolah/20537440-2AF5-E011-B59C-D593D31F215F" target="_blank" rel="noreferrer" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  <span>NPSN: {schoolNpsn} (Sekolah Kita)</span>
                </a>
                <a href={`mailto:${schoolEmail}`} className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>{schoolEmail}</span>
                </a>

              </div>
            </div>
          </div>
          
          {/* Institutional Affiliations */}
          <div className="container footer-affiliations">
            <div className="affiliations-divider"></div>
            <div className="affiliations-content">
              <span className="affiliations-label">Afiliasi Resmi:</span>
              <div className="affiliations-logos">
                <a href="https://taliabukab.go.id" target="_blank" rel="noopener noreferrer" className="affiliation-item" title="Pemerintah Kabupaten Pulau Taliabu" style={{ textDecoration: 'none' }}>
                  <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_pemda_taliabu.png" alt="Logo Pemda Pulau Taliabu" className="affiliation-logo" loading="lazy" decoding="async" />
                  <span className="affiliation-text">Pemerintah Kabupaten Pulau Taliabu</span>
                </a>
                <div className="affiliation-item" title="Dinas Pendidikan Kabupaten Pulau Taliabu">
                  <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_dinas_pendidikan.png" alt="Logo Dinas Pendidikan" className="affiliation-logo" loading="lazy" decoding="async" />
                  <span className="affiliation-text">Dinas Pendidikan Pulau Taliabu</span>
                </div>
                <div className="affiliation-item" title="Kurikulum Merdeka - Merdeka Belajar">
                  <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_kurikulum_merdeka.png" alt="Logo Kurikulum Merdeka" className="affiliation-logo" loading="lazy" decoding="async" />
                  <span className="affiliation-text">Kurikulum Merdeka</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container footer-bottom-flex">
              <div className="developer-note">
                made with ❤️ Anhr
              </div>
              <p className="copyright-note">
                &copy; 2026 SD Negeri Bobong. Hak Cipta Dilindungi Undang-Undang. | <a href="/admin/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem' }}>Login Admin</a>
              </p>
            </div>
          </div>
        </footer>

        {/* aim AI Virtual Assistant Widget */}
        <ChatWidget />

        {/* Floating WhatsApp Button (Disembunyikan sesuai permintaan pengguna)
        <a href={`https://wa.me/${floatingPhone}?text=Halo%20SDN%20Bobong,%20saya%20ingin%20bertanya%20informasi...`} className="floating-wa-btn no-print public-layout-wa-btn" target="_blank" rel="noreferrer" aria-label="Hubungi Sekolah di WhatsApp">
          <svg className="icon-svg" style={{ width: '36px', height: '36px' }} viewBox="0 0 24 24">
            <path fill="#ffffff" d="M12.042 2C6.556 2 2.084 6.446 2.084 11.911c0 1.739.459 3.447 1.332 4.953L2.184 21.331l4.577-1.202a8.919 8.919 0 0 0 4.291 1.093h.004c5.486 0 9.957-4.446 9.957-9.911C21.013 6.446 16.541 2 12.042 2z"/>
            <path fill="#25D366" d="M17.79 15.398c-.187.524-1.083 1.002-1.514 1.066-.387.057-.876.082-1.413-.089-.325-.104-.743-.242-1.279-.473-2.25-.972-3.72-3.237-3.832-3.387-.112-.15-.916-1.218-.916-2.321s.579-1.646.785-1.871a.826.826 0 0 1 .599-.28c.063 0 .125.002.188.005.138.006.323-.052.504.383.187.449.636 1.553.692 1.666.056.112.075.244.019.393s-.112.243-.224.374c-.112.131-.235.293-.336.393-.113.112-.224.237-.099.458.131.225.631.959 1.304 1.554.757.664 1.523 1.012 1.804 1.113.224.112.486.044.711-.056.131-.058.544-.654.711-.879.15-.224.299-.187.504-.112s1.307.617 1.533.73c.225.112.374.168.43.263.056.094.056.543-.131 1.067z"/>
          </svg>
        </a>
        */}
      </body>
    </html>
  );
}
