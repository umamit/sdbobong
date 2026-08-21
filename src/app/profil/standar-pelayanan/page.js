import Link from 'next/link';
import { loadWebConfig } from '../../../lib/database';
import StandarPelayananTabs from './StandarPelayananTabs';
import KodeEtikSection from './KodeEtikSection';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Standar Pelayanan Publik - SD Negeri Bobong',
  description: 'Maklumat dan infografis standar pelayanan publik resmi SD Negeri Bobong, Kabupaten Pulau Taliabu.',
};

export default async function StandarPelayananPage() {
  const config = await loadWebConfig().catch(() => ({}));
  const services = config?.stats?.page_contents?.profil?.standar_pelayanan_list || [];
  const maklumatImage = config?.stats?.page_contents?.profil?.maklumat_image || '';

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: 'var(--space-xl) 0' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 var(--space-md)' }}>
        
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

        {/* Interactive Tabbed Content (Client Component) */}
        <StandarPelayananTabs initialServices={services} maklumatImage={maklumatImage} />

        {/* Kode Etik Pegawai */}
        <KodeEtikSection />

      </div>
    </div>
  );
}
