import { loadWebConfig } from '../../lib/database';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Galeri Kegiatan & Dokumentasi - SD Negeri Bobong',
  description: 'Dokumentasi foto dan video kegiatan belajar mengajar, upacara, pramuka, pentas seni, dan fasilitas pendidikan di SD Negeri Bobong.',
};

export default async function GaleriPage() {
  const config = await loadWebConfig();
  const initialGallery = config.gallery || [];

  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Galeri Sekolah</h1>
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
