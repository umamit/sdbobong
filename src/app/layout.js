import '../../public/css/style.css';
import Header from '../components/Header';
import { loadWebConfig } from '../lib/database';

export const metadata = {
  title: 'SD Negeri Bobong - Cerdas, Berkarakter, dan Berbudaya',
  description: 'Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu. Menyediakan informasi profil sekolah, akademik, kesiswaan, PPDB online, dan berita terbaru.',
};

export default async function RootLayout({ children }) {
  // Load global configurations dynamically at render time (Server component)
  const config = loadWebConfig();
  const announcements = config.marquee_announcements || [];

  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Running Announcement Banner */}
        <div className="announcement-banner no-print">
          <div className="marquee-content">
            {announcements.map((ann, idx) => (
              <span key={idx}>{ann}</span>
            ))}
          </div>
        </div>

        {/* Header & Navigation */}
        <div className="no-print">
          <Header />
        </div>

        {/* Main Content Area */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="no-print">
          <div className="container footer-grid">
            <div className="footer-widget">
              <a href="/" className="logo-container" style={{ marginBottom: 'var(--space-xs)', textDecoration: 'none' }}>
                <img src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" className="school-logo" />
                <span className="logo-title" style={{ color: 'white' }}>SD NEGERI BOBONG</span>
              </a>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '1rem' }}>
                SD Negeri Bobong adalah sekolah dasar negeri unggulan di Ibukota Kabupaten Pulau Taliabu, Maluku Utara. Berdedikasi mencetak generasi cerdas, berkarakter mulia, dan berbudaya luhur.
              </p>
            </div>
            <div className="footer-widget">
              <h3>Navigasi Cepat</h3>
              <ul className="footer-links">
                <li><a href="/">Beranda</a></li>
                <li><a href="/profil">Profil Sekolah</a></li>
                <li><a href="/akademik">Informasi Akademik</a></li>
                <li><a href="/kesiswaan">Kesiswaan & Ekskul</a></li>
                <li><a href="/ppdb">Portal PPDB</a></li>
                <li><a href="/berita">Berita & Galeri</a></li>
              </ul>
            </div>
            <div className="footer-widget">
              <h3>Kontak Sekolah</h3>
              <div className="footer-contact-info">
                <a href="https://maps.google.com/?q=SD+Negeri+Bobong+Pulau+Taliabu" target="_blank" rel="noreferrer" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara, 97791</span>
                </a>
                <a href="https://sekolah.data.kemendikdasmen.go.id/profil-sekolah/20537440-2AF5-E011-B59C-D593D31F215F" target="_blank" rel="noreferrer" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  <span>NPSN: 60200589 (Sekolah Kita)</span>
                </a>
                <a href="mailto:anhreko@gmail.com" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>anhreko@gmail.com</span>
                </a>
                <a href="https://wa.me/6281234567890?text=Halo%20SD%20Negeri%20Bobong" target="_blank" rel="noreferrer" className="footer-contact-item">
                  <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                  <span>+62 812-3456-7890 (Humas WA)</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <p>&copy; 2026 SD Negeri Bobong. Hak Cipta Dilindungi Undang-Undang. | <a href="/admin/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem' }}>Login Admin</a></p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a href="https://wa.me/6281234567890?text=Halo%20Operator%20SDN%20Bobong,%20saya%20ingin%20bertanya%20informasi..." className="floating-wa-btn no-print" target="_blank" rel="noreferrer" aria-label="Hubungi Operator Sekolah di WhatsApp">
          <svg className="icon-svg" style={{ width: '30px', height: '30px' }} viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.4-4.21-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.15 0-.41.06-.63.3c-.22.24-.83.82-.83 2c0 1.19.86 2.33.98 2.49c.12.17 1.69 2.58 4.1 3.62c.58.25 1.03.4(1.38.51c.58.18 1.11.16 1.53.1c.47-.07 1.44-.59 1.65-1.17c.2-.58.2-1.07.14-1.17c-.06-.1-.22-.16-.47-.29c-.25-.12-1.47-.73-1.69-.81c-.22-.08-.39-.12-.55.12c-.17.25-.65.81-.8 1c-.15.16-.3.18-.55.06c-.25-.12-1.07-.4-2.03-1.25c-.75-.67-1.26-1.5-1.4-1.75c-.15-.25-.02-.39.11-.51c.11-.11.25-.29.37-.43c.12-.15.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.12-.55-1.33-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48z"/></svg>
        </a>
      </body>
    </html>
  );
}
