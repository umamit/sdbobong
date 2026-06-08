import { loadNews, loadWebConfig } from '../../lib/database';
import Link from 'next/link';
import NewsCard from '../../components/NewsCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Fresh load

export default async function Berita() {
  const newsList = await loadNews();

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Berita Sekolah</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Kabar terkini dan dokumentasi aktivitas harian keluarga besar SD Negeri Bobong.</p>
        </div>
      </section>

      {/* Kabar Sekolah */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Warta Taliabu</span>
            <h2>Kabar & Artikel Sekolah</h2>
          </div>

          <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
            {newsList.length > 0 ? (
              newsList.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))
            ) : (
              <p style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: 'var(--space-md)' }}>
                Belum ada berita kegiatan yang diunggah.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Scoped CSS styling for rich text rendering */}
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-text-content p {
          margin-bottom: 0.85rem;
          line-height: 1.65;
        }
        .rich-text-content p:last-child {
          margin-bottom: 0;
        }
        .rich-text-content ul, .rich-text-content ol {
          padding-left: 20px;
          margin-bottom: 0.85rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
        }
        .rich-text-content ol {
          list-style-type: decimal;
        }
        .rich-text-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-dark, #0b3c5d);
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .rich-text-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary-dark, #0b3c5d);
          margin-top: 0.85rem;
          margin-bottom: 0.4rem;
        }
        .rich-text-content a {
          color: var(--primary, #3b82f6);
          text-decoration: underline;
        }
        .rich-text-content a:hover {
          color: var(--primary-dark, #0b3c5d);
        }

        /* Multi-Image Slider Premium Styles */
        .card-img-container {
          position: relative;
          background-color: #1e1e24;
          height: 240px;
          overflow: hidden;
          border-top-left-radius: var(--radius-md);
          border-top-right-radius: var(--radius-md);
        }
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          font-size: 22px;
          font-weight: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          padding: 0;
          padding-bottom: 4px;
        }
        .slider-arrow:hover {
          background: rgba(15, 23, 42, 0.75);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .slider-arrow.prev {
          left: 12px;
        }
        .slider-arrow.next {
          right: 12px;
        }
        .slider-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
          padding: 5px 10px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .slider-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slider-dot.active {
          width: 16px;
          border-radius: 3px;
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        }
        .slider-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .card-img-slider {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .news-card:hover .card-img-slider {
          transform: scale(1.04);
        }
      `}} />

      {/* CTA ke Galeri */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div 
            className="card"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--space-lg) var(--space-md)', 
              color: 'white', 
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden',
              border: 'none'
            }}
          >
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
              <span className="welcome-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Dokumentasi Visual</span>
              <h2 style={{ color: 'white', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-xs)', fontSize: '2rem' }}>Eksplorasi Galeri Sekolah Kami</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: 'var(--space-md)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Lihat lebih banyak foto dan video kegiatan belajar mengajar, sarana prasarana, upacara, pramuka, dan keseruan aktivitas siswa-siswi SD Negeri Bobong di halaman galeri interaktif.
              </p>
              <Link href="/galeri" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', transition: 'var(--transition-normal)' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Buka Galeri Foto & Video →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

