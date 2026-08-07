import { loadTeachers } from '../../../lib/database';
import TeachersSectionClient from '../TeachersSectionClient';
import { FramerWordReveal } from '../../../components/FramerReveal';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Struktur Organisasi & Pendidik & Tenaga Kependidikan - SD Negeri Bobong',
  description: 'Bagan organisasi kepengurusan komite, tata usaha, bendahara, serta daftar lengkap Pendidik dan Tenaga Kependidikan (PTK) SD Negeri Bobong.',
};

export default async function StrukturOrganisasi() {
  noStore();
  const teachers = await loadTeachers().catch(err => { console.error("Error loadTeachers in StrukturOrganisasi:", err); return []; });

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            <FramerWordReveal text="Struktur & PTK" />
          </h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Bagan organisasi manajemen sekolah serta daftar Pendidik dan Tenaga Kependidikan (PTK) SD Negeri Bobong.
          </p>
        </div>
      </section>

      {/* Teachers Section (Bagan React Flow + Grid Staf) */}
      <TeachersSectionClient teachers={teachers} mode="all" />
    </>
  );
}
