import { loadMessages } from '../../lib/database';
import BukuTamuClient from './BukuTamuClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Buku Tamu Pengunjung & Kotak Saran - SD Negeri Bobong',
  description: 'Halaman pengisian buku tamu kunjungan resmi atau pengiriman kotak saran masukan privat demi kemajuan pelayanan pendidikan SD Negeri Bobong.',
};

export default async function BukuTamuPage() {
  const allMessages = await loadMessages();
  // Filter only approved guestbook messages for public display
  const approvedMessages = allMessages.filter(m => m.type === 'guestbook' && m.status === 'approved');

  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Buku Tamu & Saran</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Ruang komunikasi terbuka bagi alumni, wali murid, dan masyarakat untuk berbagi pesan positif serta aspirasi untuk peningkatan mutu sekolah.
          </p>
        </div>
      </section>

      {/* Forms & Feed */}
      <BukuTamuClient initialApprovedMessages={approvedMessages} />
    </>
  );
}
