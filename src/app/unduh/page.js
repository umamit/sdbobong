import { loadWebConfig } from '../../lib/database';
import DownloadClient from './DownloadClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pusat Unduhan Berkas & Dokumen - SD Negeri Bobong',
  description: 'Akses katalog berkas resmi sekolah: brosur informasi, formulir pendaftaran PPDB offline, tata tertib siswa, dan dokumen administrasi lainnya.',
};

export default async function UnduhPage() {
  const config = await loadWebConfig();
  const initialDownloads = config.downloads || [];

  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Pusat Unduhan</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Daftar berkas resmi, dokumen kesiswaan, kalender pendidikan, dan formulir PPDB SD Negeri Bobong.
          </p>
        </div>
      </section>

      {/* Main Filter and Cards Component */}
      <DownloadClient initialDownloads={initialDownloads} />
    </>
  );
}
