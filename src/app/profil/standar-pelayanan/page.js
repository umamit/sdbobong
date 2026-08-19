import Link from 'next/link';
import { loadWebConfig } from '../../../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Standar Pelayanan Publik - SD Negeri Bobong',
  description: 'Maklumat dan infografis standar pelayanan publik resmi SD Negeri Bobong, Kabupaten Pulau Taliabu.',
};

export default async function StandarPelayananPage() {
  const config = await loadWebConfig().catch(() => ({}));
  const profil = config?.stats?.page_contents?.profil || {};

  const spImage = profil.sp_image || '/images/standar_pelayanan.png';
  const spPdf = profil.sp_pdf || '/docs/standar_pelayanan.pdf';

  const spBiaya = profil.sp_biaya || 'Seluruh bentuk layanan administrasi (mutasi siswa, surat keterangan, legalisir ijazah) adalah Gratis (Rp 0,-).';
  const spWaktu = profil.sp_waktu || 'Senin s.d. Sabtu pukul 08.00 - 12.00 WIT (pada hari kerja sekolah).';
  const spAlur = profil.sp_alur || 'Ajukan dokumen persyaratan ke meja pelayanan tata usaha (operator) sekolah untuk langsung diproses.';
  const spKontak = profil.sp_kontak || 'Hubungi Humas / Operator sekolah jika Anda memiliki pertanyaan atau kendala seputar pelayanan publik sekolah.';

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: 'var(--space-xl) 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-md)' }}>
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-md)', fontSize: '0.85rem' }}>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
            <li><Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Beranda</Link></li>
            <li>/</li>
            <li><Link href="/profil" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Profil</Link></li>
            <li>/</li>
            <li aria-current="page" style={{ fontWeight: 600 }}>Standar Pelayanan</li>
          </ol>
        </nav>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
            Transparansi Pelayanan
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', lineHeight: 1.2 }}>
            Standar Pelayanan Publik
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
            Maklumat resmi alur, waktu, biaya, dan persyaratan layanan administrasi sekolah di SD Negeri Bobong, Kabupaten Pulau Taliabu.
          </p>
        </div>

        {/* Infographic Poster Card Wrapper */}
        <div style={{ 
          backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)'
        }}>
          {/* Canvas Image Container */}
          <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
            <img 
              src={spImage} 
              alt="Infografis Standar Pelayanan Publik SD Negeri Bobong" 
              loading="lazy" width="800" height="1130"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <a 
              href={spPdf} download target="_blank" rel="noreferrer" className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Unduh / Lihat Dokumen Pelayanan (PDF)
            </a>
          </div>
        </div>

        {/* Text Details for Accessibility and SEO */}
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: '0 0 15px 0', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Ringkasan Standar Layanan Sekolah
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-main)', lineHeight: 1.8, fontSize: '0.925rem' }}>
            <li style={{ marginBottom: '8px' }}><strong>Biaya Pelayanan:</strong> {spBiaya}</li>
            <li style={{ marginBottom: '8px' }}><strong>Waktu Pelayanan:</strong> {spWaktu}</li>
            <li style={{ marginBottom: '8px' }}><strong>Alur Pengajuan:</strong> {spAlur}</li>
            <li><strong>Kontak Pengaduan:</strong> {spKontak}</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
