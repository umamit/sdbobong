import GradesClient from './GradesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Portal Cek Rapor Digital - SD Negeri Bobong',
  description: 'Akses hasil belajar dan rapor digital siswa SD Negeri Bobong secara mandiri menggunakan NISN dan Tanggal Lahir.',
};

export default function GradesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Portal Rapor Digital</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Halaman resmi untuk memeriksa hasil belajar dan rapor akademik siswa SD Negeri Bobong secara aman dan mandiri.
          </p>
        </div>
      </section>

      {/* Grades Lookup Panel & Rapor Card */}
      <GradesClient />
    </>
  );
}
