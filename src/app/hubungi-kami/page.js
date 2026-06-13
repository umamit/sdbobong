import { loadWebConfig } from '../../lib/database';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Hubungi Kami & Lokasi Peta Sekolah - SD Negeri Bobong',
  description: 'Hubungi sekolah resmi SD Negeri Bobong. Dapatkan peta navigasi alamat, alamat surat elektronik (email), dan kontak WhatsApp layanan operator humas.',
};

export default async function HubungiKamiPage() {
  const config = await loadWebConfig();
  const initialFaqs = config.faqs || [];

  return (
    <>
      {/* Page Header */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Hubungi Kami</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Hubungi tim administrasi dan humas kami atau temukan jawaban langsung melalui daftar FAQ di bawah ini.
          </p>
        </div>
      </section>

      {/* Main FAQ, Contact Form & Google Maps Section */}
      <ContactClient initialFaqs={initialFaqs} contacts={config.ppdb_contacts || {}} />
    </>
  );
}
