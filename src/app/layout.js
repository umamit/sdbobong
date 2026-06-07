import '../../public/css/style.css';
import Header from '../components/Header';
import { loadWebConfig } from '../lib/database';
import LayoutControl from '../components/LayoutControl';
import ChatWidget from '../components/ChatWidget';
import Script from 'next/script';
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { verifyAdminToken } from '../lib/auth';
import pack from '../../package.json';

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

  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if admin is logged in to bypass maintenance screen
  const cookieStore = cookies();
  const adminToken = cookieStore.get('admin_session_token')?.value;
  const isAuthorizedAdmin = await verifyAdminToken(adminToken);
  
  const isMaintenanceModeOn = config.stats?.maintenance_mode === true;
  const isMaintenanceActive = isMaintenanceModeOn && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !isAuthorizedAdmin;

  if (isMaintenanceActive) {
    return (
      <html lang="id">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="icon" href="/favicon.ico" />
          <title>Pemeliharaan Sistem - SD Negeri Bobong</title>
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --primary-glow: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%);
              --secondary-glow: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(0,0,0,0) 70%);
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              background-color: #0b0f19;
              color: #f3f4f6;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow-x: hidden;
              position: relative;
            }
            /* Aurora animated backgrounds */
            .aurora-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              overflow: hidden;
              pointer-events: none;
            }
            .glow-1 {
              position: absolute;
              width: 600px;
              height: 600px;
              background: var(--primary-glow);
              top: -10%;
              left: -10%;
              border-radius: 50%;
              animation: float-slow 20s infinite alternate;
            }
            .glow-2 {
              position: absolute;
              width: 600px;
              height: 600px;
              background: var(--secondary-glow);
              bottom: -10%;
              right: -10%;
              border-radius: 50%;
              animation: float-slow 25s infinite alternate-reverse;
            }
            @keyframes float-slow {
              0% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(50px, 30px) scale(1.1); }
              100% { transform: translate(-20px, -50px) scale(0.9); }
            }
            /* Grid Pattern Overlay */
            .grid-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
              background-size: 24px 24px;
              z-index: 2;
              pointer-events: none;
            }
            /* Maintenance Card */
            .maintenance-card {
              position: relative;
              z-index: 10;
              width: 90%;
              max-width: 580px;
              padding: 3rem 2.5rem;
              background: rgba(15, 23, 42, 0.65);
              backdrop-filter: blur(24px) saturate(180%);
              -webkit-backdrop-filter: blur(24px) saturate(180%);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 
                          0 0 40px rgba(99, 102, 241, 0.05),
                          inset 0 0 1px rgba(255, 255, 255, 0.1);
              text-align: center;
              animation: scale-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes scale-up {
              0% { opacity: 0; transform: scale(0.95) translateY(10px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .logo-sec {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 12px;
              margin-bottom: 2rem;
            }
            .logo-img {
              width: 48px;
              height: 48px;
              object-fit: contain;
              filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
            }
            .logo-text {
              font-size: 1.1rem;
              font-weight: 800;
              letter-spacing: 2px;
              background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .icon-wrapper {
              position: relative;
              display: inline-block;
              margin-bottom: 1.5rem;
            }
            .gear-icon {
              width: 80px;
              height: 80px;
              color: #f59e0b;
              filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4));
              animation: spin-slow 12s infinite linear;
            }
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .pulse-ring {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 90px;
              height: 90px;
              border: 1px solid rgba(245, 158, 11, 0.3);
              border-radius: 50%;
              animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            }
            @keyframes pulse-ring {
              0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
              80%, 100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
            }
            h1 {
              font-size: 2rem;
              margin: 0 0 0.75rem 0;
              font-weight: 800;
              letter-spacing: -0.5px;
              background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            p.description {
              font-size: 1rem;
              line-height: 1.6;
              color: #94a3b8;
              margin: 0 0 2rem 0;
            }
            .btn-group {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 2rem;
            }
            @media (min-width: 480px) {
              .btn-group {
                flex-direction: row;
                justify-content: center;
              }
            }
            .btn {
              padding: 0.85rem 1.75rem;
              border-radius: 12px;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              text-decoration: none;
            }
            .btn-primary {
              background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
              color: white;
              border: none;
              box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
            }
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 24px rgba(79, 70, 229, 0.45);
              background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
            }
            .btn-primary:active {
              transform: translateY(0);
            }
            .btn-secondary {
              background: rgba(255, 255, 255, 0.05);
              color: #e2e8f0;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .btn-secondary:hover {
              transform: translateY(-2px);
              background: rgba(255, 255, 255, 0.08);
              border-color: rgba(255, 255, 255, 0.2);
              color: white;
            }
            .btn-secondary:active {
              transform: translateY(0);
            }
            .wa-btn {
              background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
              color: white;
              border: none;
              box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
            }
            .wa-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);
              background: linear-gradient(135deg, #4ade80 0%, #166534 100%);
            }
            .info-footer {
              padding-top: 1.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.06);
              font-size: 0.85rem;
              color: #64748b;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
            }
            .info-footer a {
              color: #4f46e5;
              text-decoration: none;
              transition: color 0.2s;
            }
            .info-footer a:hover {
              color: #6366f1;
              text-decoration: underline;
            }
            .school-logo-tiny {
              width: 16px;
              height: 16px;
              vertical-align: middle;
            }
          `}} />
        </head>
        <body>
          <div className="aurora-bg">
            <div className="glow-1"></div>
            <div className="glow-2"></div>
          </div>
          <div className="grid-overlay"></div>
          
          <div className="maintenance-card">
            <div className="logo-sec">
              <img src="/images/logo_sekolah.png" alt="Logo" className="logo-img" />
              <span className="logo-text">SD NEGERI BOBONG</span>
            </div>
            
            <div className="icon-wrapper">
              <div className="pulse-ring"></div>
              <svg className="gear-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h1>Situs Sedang Pemeliharaan</h1>
            <p className="description">
              Kami sedang melakukan pemeliharaan sistem terencana untuk meningkatkan performa dan layanan website. Silakan coba beberapa saat lagi.
            </p>
            
            <div className="btn-group">
              <button className="btn btn-secondary" onClick="window.location.reload()">
                <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Coba Lagi
              </button>
              
              <a href={`https://wa.me/${operatorPhone}?text=Halo%20SDN%20Bobong%20Operator,%20saya%20mengalami%20kendala%20saat%20mengakses%20website...`} target="_blank" rel="noopener noreferrer" className="btn wa-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.955C16.612 1.968 14.14 1.488 12.01 1.488c-5.439 0-9.862 4.41-9.866 9.833-.001 1.772.474 3.504 1.378 5.044l-.999 3.649 3.75-.98c1.516.822 3.011 1.258 4.774 1.258zm12.355-6.69c-.213-.107-1.262-.622-1.457-.7-.196-.077-.339-.115-.482.1s-.554.7-.68.855c-.125.154-.251.173-.464.066-.213-.107-.902-.332-1.717-1.06-.635-.675-1.064-1.51-1.189-1.725-.125-.215-.013-.331.093-.437.096-.095.213-.247.319-.371.107-.124.143-.213.214-.355.071-.142.036-.266-.018-.372s-.482-1.161-.661-1.59c-.174-.421-.344-.364-.482-.366-.125-.002-.268-.002-.411-.002s-.375.053-.571.253c-.196.2-.75.733-.75 1.787 0 1.054.768 2.071.875 2.214.107.142 1.511 2.307 3.661 3.235.512.221.911.353 1.222.452.514.163.982.14 1.352.085.412-.061 1.262-.515 1.439-1.011.178-.496.178-.921.125-1.011-.053-.089-.196-.142-.411-.249z"/>
                </svg>
                Hubungi Operator
              </a>
            </div>
            
            <div className="info-footer">
              <div>
                <img src="/images/logo_sekolah.png" className="school-logo-tiny" alt="Tiny logo" /> NPSN: {schoolNpsn} • SD Negeri Bobong
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>
                Kembali ke <a href="/admin/login">Dashboard Admin</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }



  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
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
        {isMaintenanceModeOn && isAuthorizedAdmin && (
          <div style={{
            background: 'linear-gradient(90deg, #d97706 0%, #b45309 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'sticky',
            top: 0,
            zIndex: 99999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            letterSpacing: '0.025em'
          }}>
            <span>🛠️ <strong>Mode Pemeliharaan Aktif:</strong> Anda sedang dalam mode Preview Administrator.</span>
            <a href="/admin/dashboard" style={{
              color: '#fef3c7',
              textDecoration: 'underline',
              marginLeft: '8px',
              transition: 'color 0.2s',
              fontWeight: '800'
            }}>
              Kembali ke Dashboard Admin →
            </a>
          </div>
        )}
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
                Lead Developer
              </div>
              <p className="copyright-note">
                &copy; 2026 SD Negeri Bobong. Hak Cipta Dilindungi Undang-Undang. | <a href="/admin/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem' }}>Login Admin</a> <span style={{ color: '#6B7280', margin: '0 0.5rem' }}>•</span> <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>v{pack.version}</span>
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
