import InteractiveFacilityMap from '../../../components/InteractiveFacilityMap';
import { FramerReveal, FramerWordReveal } from '../../../components/FramerReveal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Fasilitas & Denah Sekolah - SD Negeri Bobong',
  description: 'Eksplorasi denah kelas, sarana sanitasi, gudang, pojok baca, dan sarana prasarana penunjang KBM di SD Negeri Bobong.',
};

export default function Fasilitas() {
  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            <FramerWordReveal text="Fasilitas & Denah" />
          </h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Eksplorasi peta interaktif sarana prasarana sekolah dan tata ruang SD Negeri Bobong.
          </p>
        </div>
      </section>

      {/* Peta Fasilitas Sekolah Interaktif */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Sarana & Prasarana</span>
            <h2>Eksplorasi Denah & Fasilitas Sekolah</h2>
          </div>
          <FramerReveal direction="up">
            <InteractiveFacilityMap />
          </FramerReveal>

          {/* Lampiran Dokumen Denah Resmi Sekolah */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <FramerReveal direction="up">
              <div style={{
                background: 'rgba(18, 165, 184, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(18, 165, 184, 0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary)', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>
                      Dokumen Cetak Biru Denah Resmi
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Dokumen resmi tata ruang dan ukuran batas wilayah SD Negeri Bobong ditandatangani Kepala Sekolah.
                    </p>
                  </div>
                  <a 
                    href="/images/denah_bobong.png" 
                    download="Denah_SD_Negeri_Bobong.png"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 10px rgba(18, 165, 184, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Unduh Gambar Denah</span>
                  </a>
                </div>
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  maxHeight: '520px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src="/images/denah_bobong.png" 
                    alt="Denah Cetak Biru SD Negeri Bobong" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '520px',
                      objectFit: 'contain',
                      padding: '10px'
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
            </FramerReveal>
          </div>
        </div>
      </section>
    </>
  );
}

