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
        </div>
      </section>
    </>
  );
}
