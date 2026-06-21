import '../../public/css/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadWebConfig } from '../lib/database';
import LayoutControl from '../components/LayoutControl';
import AnnouncementBanner from '../components/AnnouncementBanner';
import ChatWidget from '../components/ChatWidget';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import WebVitals from '../components/WebVitals';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import Link from 'next/link';
import { headers } from 'next/headers';


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
  const marqueeSpeed = config.marquee_speed || 40;
  const contacts = config.ppdb_contacts || {};

  const profil = config.stats?.page_contents?.profil || {};
  const schoolNpsn = profil.npsn || "60200589";

  const operatorPhone = (contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";
  const floatingPhone = (contacts.wa_floating || contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const isPrintableForm = pathname === '/formulir-ppdb';
  const isMaintenanceActive = config.stats?.maintenance_mode === true && !pathname.startsWith('/admin') && !pathname.startsWith('/api');


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
          <script dangerouslySetInnerHTML={{ __html: `
            document.cookie = "maintenance_mode=true; path=/; max-age=31536000; SameSite=Lax";
          `}} />
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



  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/guru') || pathname.startsWith('/ppdb-online/sukses');
  const robotsContent = isAdminPath ? "noindex, nofollow" : "index, follow";

  return (
    <html lang="id" className={isPrintableForm ? "is-admin" : undefined} data-theme={isPrintableForm ? "light" : undefined}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SD Negeri Bobong - Cerdas, Berkarakter, Mulia" />
        <meta property="og:description" content="Website Resmi SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara. Media informasi PPDB online, pengumuman, berita kegiatan, dan portal akademik." />
        <meta property="og:image" content="https://www.sdnegeribobong.sch.id/images/logo_sekolah.png" />
        <meta property="og:url" content="https://www.sdnegeribobong.sch.id" />
        <meta property="og:site_name" content="SD Negeri Bobong" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SD Negeri Bobong - Cerdas, Berkarakter, Mulia" />
        <meta name="twitter:description" content="Website Resmi SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara." />
        <meta name="twitter:image" content="https://www.sdnegeribobong.sch.id/images/logo_sekolah.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `
          // Zero-flicker theme initialization
          try {
            const isPrintable = window.location.pathname === '/formulir-ppdb';
            const savedTheme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const initialTheme = isPrintable ? 'light' : (savedTheme || systemTheme);
            document.documentElement.setAttribute('data-theme', initialTheme);
          } catch (e) {
            console.error('Failed to load theme preference', e);
          }

          if (window.location.pathname.startsWith('/admin')) {
            document.documentElement.classList.add('is-admin');
          }

          // Anti-cloning protection script for public pages (exempting admin and printable pages)
          const bypassPaths = ['/formulir-ppdb', '/ppdb-online/sukses', '/nilai'];
          if (${config.stats?.allow_copy === true ? 'false' : 'true'} && !window.location.pathname.startsWith('/admin') && !bypassPaths.includes(window.location.pathname)) {
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
        {config.stats?.allow_copy === true && (
          <style dangerouslySetInnerHTML={{ __html: `
            html:not(.is-admin) {
              -webkit-user-select: text !important;
              -moz-user-select: text !important;
              -ms-user-select: text !important;
              user-select: text !important;
            }
          `}} />
        )}
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          document.cookie = "maintenance_mode=${(config.stats?.maintenance_mode === true) ? 'true' : 'false'}; path=/; max-age=31536000; SameSite=Lax";

          // WebMCP Tools Registration, Shim and Polling with AbortController
          (function() {
            const controller = new AbortController();
            const signal = controller.signal;

            const tools = [
              {
                name: "search_school_info",
                description: "Mencari informasi profil sekolah, akademik, kesiswaan, tata tertib, dan PPDB di SD Negeri Bobong.",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "Kata kunci pencarian (misal: 'visi misi', 'ekstrakurikuler', 'jadwal belajar')"
                    }
                  },
                  required: ["query"]
                },
                execute: async function(params) {
                  try {
                    const res = await fetch('/api/chat?message=' + encodeURIComponent("Cari informasi: " + params.query));
                    const data = await res.json();
                    return {
                      content: [{ type: "text", text: data.reply || JSON.stringify(data) }]
                    };
                  } catch (err) {
                    return {
                      content: [{ type: "text", text: "Gagal mencari: " + err.message }]
                    };
                  }
                }
              },
              {
                name: "register_ppdb_student",
                description: "Mendaftarkan calon siswa baru secara online melalui PPDB Online SD Negeri Bobong.",
                inputSchema: {
                  type: "object",
                  properties: {
                    nama_lengkap: { type: "string", description: "Nama lengkap calon siswa" },
                    nik: { type: "string", description: "Nomor Induk Kependudukan (NIK) calon siswa (16 digit)" },
                    tempat_lahir: { type: "string", description: "Tempat lahir calon siswa" },
                    tanggal_lahir: { type: "string", description: "Tanggal lahir calon siswa (YYYY-MM-DD)" },
                    jenis_kelamin: { type: "string", enum: ["Laki-laki", "Perempuan"], description: "Jenis kelamin" },
                    alamat: { type: "string", description: "Alamat tempat tinggal lengkap" },
                    nama_ibu: { type: "string", description: "Nama lengkap ibu kandung" },
                    no_hp_orang_tua: { type: "string", description: "Nomor HP/WhatsApp orang tua yang aktif" }
                  },
                  required: ["nama_lengkap", "nik", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "alamat", "nama_ibu", "no_hp_orang_tua"]
                },
                execute: async function(params) {
                  try {
                    const res = await fetch('/api/ppdb', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(params)
                    });
                    const data = await res.json();
                    return {
                      content: [{ type: "text", text: data.message || JSON.stringify(data) }]
                    };
                  } catch (err) {
                    return {
                      content: [{ type: "text", text: "Gagal pendaftaran: " + err.message }]
                    };
                  }
                }
              }
            ];

            // Setup Shim if not present, to capture registration if scanner checks later
            function setupShim() {
              if (typeof navigator !== 'undefined' && !navigator.modelContext) {
                navigator.modelContext = {
                  _tools: [],
                  registerTool: function(t, options) { this._tools.push({ tool: t, options: options }); },
                  provideContext: function(c, options) { if(c && c.tools) { c.tools.forEach(t => this._tools.push({ tool: t, options: options })); } }
                };
              }
              if (typeof document !== 'undefined' && !document.modelContext) {
                document.modelContext = {
                  _tools: [],
                  registerTool: function(t, options) { this._tools.push({ tool: t, options: options }); },
                  provideContext: function(c, options) { if(c && c.tools) { c.tools.forEach(t => this._tools.push({ tool: t, options: options })); } }
                };
              }
            }

            setupShim();

            // Track registered contexts to avoid infinite duplicate registration
            const registeredContexts = new Set();

            function doRegister() {
              const contexts = [];
              if (typeof navigator !== 'undefined' && navigator.modelContext) contexts.push(navigator.modelContext);
              if (typeof document !== 'undefined' && document.modelContext) contexts.push(document.modelContext);
              if (typeof window !== 'undefined' && window.modelContext) contexts.push(window.modelContext);

              let newlyRegistered = false;
              contexts.forEach(function(ctx) {
                if (registeredContexts.has(ctx)) return;

                if (typeof ctx.registerTool === 'function') {
                  tools.forEach(function(tool) {
                    try {
                      ctx.registerTool(tool, { signal: signal });
                    } catch (e) {}
                  });
                  registeredContexts.add(ctx);
                  newlyRegistered = true;
                }
                if (typeof ctx.provideContext === 'function') {
                  try {
                    ctx.provideContext({ tools: tools }, { signal: signal });
                  } catch (e) {}
                  registeredContexts.add(ctx);
                  newlyRegistered = true;
                }
              });
              return newlyRegistered;
            }

            doRegister();

            // Poll to catch any late injected/overridden contexts
            let attempts = 0;
            const interval = setInterval(function() {
              attempts++;
              doRegister();
              if (attempts > 300) clearInterval(interval);
            }, 10);

            window.addEventListener('DOMContentLoaded', doRegister);
            window.addEventListener('load', doRegister);

            // Clean up on page unload
            window.addEventListener('unload', function() {
              controller.abort();
            });
          })();
        `}} />
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
        {!isPrintableForm && (
          <AnnouncementBanner initialAnnouncements={announcements} initialSpeed={marqueeSpeed} />
        )}

        {/* Header & Navigation */}
        {!isPrintableForm && (
          <div className="no-print public-layout-header">
            <Header />
          </div>
        )}

        {/* Main Content Area */}
        <main>{children}</main>

        {/* Footer */}
        {!isPrintableForm && (
          <Footer />
        )}

        {!isPrintableForm && (
          <ChatWidget />
        )}
        <PWAInstallPrompt />
        <Analytics />
        <SpeedInsights />
        <WebVitals />
      </body>
    </html>
  );
}
