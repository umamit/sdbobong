import GraduationClient from './GraduationClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Portal Kelulusan Mandiri - SD Negeri Bobong',
  description: 'Pengumuman kelulusan siswa kelas VI secara online mandiri di SD Negeri Bobong Tahun Ajaran 2025/2026.',
};

export default function GraduationPage() {
  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Portal Kelulusan Siswa</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Halaman resmi pengumuman hasil kelulusan siswa-siswi Kelas VI SD Negeri Bobong Tahun Pelajaran 2025/2026.
          </p>
        </div>
      </section>

      {/* Lookup Portal & Certificate Panel */}
      <GraduationClient />
    </>
  );
}
