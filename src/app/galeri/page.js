import { loadWebConfig } from '../../lib/database';
import GalleryClient from './GalleryClient';
import { FramerWordReveal } from '../../components/FramerReveal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Galeri Foto & Video Kegiatan Sekolah - SD Negeri Bobong',
  description: 'Dokumentasi visual rangkaian kegiatan siswa, upacara bendera, perlombaan, proyek P5, dan momen prestasi di lingkungan SD Negeri Bobong.',
};

export default async function GaleriPage() {
  const config = await loadWebConfig();
  const initialGallery = config.gallery || [];

  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}><FramerWordReveal text="Galeri Sekolah" /></h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Dokumentasi foto dan video berbagai aktivitas akademis, kesiswaan, dan prestasi unggulan di SD Negeri Bobong.
          </p>
        </div>
      </section>

      {/* Main Interactive Gallery */}
      <GalleryClient initialGallery={initialGallery} />
    </>
  );
}
