import { loadNews } from '../../lib/database';
import Gallery from '../../components/Gallery';

export const revalidate = 0; // Fresh load

export default async function Berita() {
  const newsList = await loadNews();

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Berita & Galeri</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Kabar terkini dan dokumentasi visual aktivitas harian keluarga besar SD Negeri Bobong.</p>
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
                <article key={news.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={news.image} alt={news.title} className="card-img" style={{ height: '240px' }} />
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="card-meta">
                        <span>📅 {news.date}</span>
                        <span>•</span>
                        <span>🏷️ {news.category}</span>
                      </div>
                      <h3 className="card-title" style={{ fontSize: '1.3rem' }}>{news.title}</h3>
                      <p className="card-text">{news.content}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: 'var(--space-md)' }}>
                Belum ada berita kegiatan yang diunggah.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Galeri Foto Kegiatan */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Visual Sekolah</span>
            <h2>Galeri Foto Kegiatan Siswa</h2>
          </div>

          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto' }}>Silakan sentuh atau klik pada gambar untuk menampilkan tampilan penuh (Lightbox).</p>

          <Gallery />
        </div>
      </section>
    </>
  );
}
