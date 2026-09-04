import '../../public/css/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadWebConfig } from '../lib/database';
import LayoutControl from '../components/LayoutControl';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AnnouncementModal from '../components/AnnouncementModal';
import ChatWidget from '../components/chat/ChatWidget';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import MobileBottomTabBar from '../components/MobileBottomTabBar';
import WebVitals from '../components/WebVitals';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { headers } from 'next/headers';
import MaintenanceView from '../components/MaintenanceView';
import WebMcpShim from '../components/WebMcpShim';

import { siteMetadata } from '../data/metadata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = siteMetadata;

export default async function RootLayout({ children }) {
  let config = {};
  try {
    config = (await loadWebConfig().catch(err => { console.error("Error loading config in RootLayout:", err); return {}; })) || {};
  } catch (err) {
    console.error("Critical error in RootLayout config load:", err);
  }
  const announcements = config.marquee_announcements || [];
  const marqueeSpeed = config.marquee_speed || 40;
  const contacts = config.ppdb_contacts || {};
  const schoolNpsn = config.stats?.page_contents?.profil?.npsn || "60200589";
  const operatorPhone = (contacts.wa_operator || "").replace(/[^0-9]/g, '') || "6281234567890";

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const bypassPaths = ['/formulir-ppdb', '/ppdb/cetak', '/ppdb-online/sukses', '/ppdb/daftar/sukses', '/nilai', '/akademik/nilai', '/akademik/kalender', '/kalender'];
  const isBypassPath = bypassPaths.includes(pathname);
  const isPrintableForm = pathname === '/formulir-ppdb' || pathname === '/ppdb/cetak';
  const isMaintenanceActive = config.stats?.maintenance_mode === true && !pathname.startsWith('/admin') && !pathname.startsWith('/guru') && !pathname.startsWith('/login') && !pathname.startsWith('/api');
  const isDashboardOrAuth = pathname.startsWith('/admin') || pathname.startsWith('/guru') || pathname.startsWith('/login');

  if (isMaintenanceActive) {
    return <MaintenanceView schoolNpsn={schoolNpsn} operatorPhone={operatorPhone} />;
  }

  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/guru') || pathname.startsWith('/ppdb-online/sukses');
  const robotsContent = isAdminPath ? "noindex, nofollow" : "index, follow";
  const htmlClassNames = isBypassPath ? "allow-select" : "";

  return (
    <html lang="id" className={htmlClassNames || undefined} data-theme={isPrintableForm ? "light" : undefined} suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        
        {/* Google Official Site Name Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SD Negeri Bobong",
              "alternateName": ["SDN Bobong", "SD Negeri Bobong Taliabu", "SDN Bobong Taliabu"],
              "url": "https://www.sdnegeribobong.sch.id"
            })
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `
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
        `}} />
        {config.stats?.allow_copy === true && (
          <style dangerouslySetInnerHTML={{ __html: `
            html:not(.is-admin):not(.allow-select) {
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
        `}} />
        <WebMcpShim allowCopy={config.stats?.allow_copy === true} />
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YLP88SDQ53" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YLP88SDQ53');
          `}
        </Script>
        <LayoutControl />
        {!isPrintableForm && !isDashboardOrAuth && (
          <AnnouncementBanner initialAnnouncements={announcements} initialSpeed={marqueeSpeed} />
        )}
        {!isPrintableForm && !isDashboardOrAuth && (
          <div className="no-print public-layout-header">
            <Header />
          </div>
        )}
        <main>{children}</main>
        {!isPrintableForm && !isDashboardOrAuth && <Footer />}
        {!isPrintableForm && !isDashboardOrAuth && <ChatWidget greetingEnabled={config.stats?.ai_greeting_enabled !== false} />}
        {!isPrintableForm && !isDashboardOrAuth && <AnnouncementModal />}
        {!isPrintableForm && !isDashboardOrAuth && <MobileBottomTabBar />}
        <PWAInstallPrompt />
        <Analytics />
        <SpeedInsights />
        <WebVitals />
        <div id="google_translate_element" style={{ display: 'none' }} />
      </body>
    </html>
  );
}
