import styles from './Footer.module.css';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';
import { loadWebConfig } from '../lib/database';

export default async function Footer() {
  const config = await loadWebConfig();
  const contacts = config.ppdb_contacts || {};
  const schoolEmail = contacts.email_sekolah || "admin@sdnegeribobong.sch.id";

  const profil = config.stats?.page_contents?.profil || {};
  const schoolDesc = profil.footer_description || "SD Negeri Bobong adalah sekolah dasar negeri unggulan di Ibukota Kabupaten Pulau Taliabu, Maluku Utara. Berdedikasi mencetak generasi cerdas, berkarakter mulia, dan berbudaya luhur.";
  const schoolAddress = profil.alamat_lengkap || "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791";
  const schoolNpsn = profil.npsn || "60200589";

  return (
    <footer className={`no-print public-layout-footer ${styles.footer}`}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerWidget}>
          <Link href="/" className={styles.logoContainer}>
            <img src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" className={styles.schoolLogo} loading="lazy" decoding="async" />
            <span className={styles.logoTitle}>SD NEGERI BOBONG</span>
          </Link>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '1rem' }}>
            {schoolDesc}
          </p>
          <VisitorCounter />
        </div>
        
        <div className={styles.footerWidget}>
          <h3>Navigasi Cepat</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/profil">Profil Sekolah</Link></li>
            <li><Link href="/akademik">Informasi Akademik</Link></li>
            <li><Link href="/nilai">Portal Cek Rapor</Link></li>
            <li><Link href="/kesiswaan">Kesiswaan &amp; Ekskul</Link></li>
            <li><Link href="/ppdb">Portal Info PPDB</Link></li>
            <li><Link href="/ppdb-online">Formulir PPDB Online</Link></li>
            <li><Link href="/formulir-ppdb">Formulir PPDB Offline</Link></li>
            <li><Link href="/berita">Berita Sekolah</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerWidget}>
          <h3>Kontak Sekolah</h3>
          <div className={styles.footerContactInfo}>
            <a href="https://maps.google.com/?q=SD+Negeri+Bobong+Pulau+Taliabu" target="_blank" rel="noreferrer" className={styles.footerContactItem}>
              <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>{schoolAddress}</span>
            </a>
            <a href="https://sekolah.data.kemendikdasmen.go.id/profil-sekolah/20537440-2AF5-E011-B59C-D593D31F215F" target="_blank" rel="noreferrer" className={styles.footerContactItem}>
              <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              <span>NPSN: {schoolNpsn} (Sekolah Kita)</span>
            </a>
            <a href={`mailto:${schoolEmail}`} className={styles.footerContactItem}>
              <svg className="icon-svg" viewBox="0 0 24 24" style={{ color: 'var(--secondary)', flexShrink: 0 }}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>{schoolEmail}</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Institutional Affiliations */}
      <div className={`container ${styles.footerAffiliations}`}>
        <div className={styles.affiliationsDivider}></div>
        <div className={styles.affiliationsContent}>
          <span className={styles.affiliationsLabel}>Afiliasi Resmi:</span>
          <div className={styles.affiliationsLogos}>
            <a href="https://taliabukab.go.id" target="_blank" rel="noopener noreferrer" className={styles.affiliationItem} title="Pemerintah Kabupaten Pulau Taliabu">
              <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_pemda_taliabu.png" alt="Logo Pemda Taliabu" className={styles.affiliationLogo} loading="lazy" decoding="async" />
              <span className={styles.affiliationText}>Pemerintah Kabupaten Pulau Taliabu</span>
            </a>
            <div className={styles.affiliationItem} title="Dinas Pendidikan Kabupaten Pulau Taliabu">
              <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_dinas_pendidikan.png" alt="Logo Dinas Pendidikan" className={styles.affiliationLogo} loading="lazy" decoding="async" />
              <span className={styles.affiliationText}>Dinas Pendidikan Taliabu</span>
            </div>
            <div className={styles.affiliationItem} title="Kurikulum Merdeka - Merdeka Belajar">
              <img src="https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/news/logo_kurikulum_merdeka.png" alt="Logo Kurikulum Merdeka" className={styles.affiliationLogo} loading="lazy" decoding="async" />
              <span className={styles.affiliationText}>Kurikulum Merdeka</span>
            </div>
          </div>
        </div>
      </div>
 
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomFlex}`}>
          <div className={styles.developerNote}>
            Lead Developer
          </div>
          <p className={styles.copyrightNote}>
            &copy; 2026 SD Negeri Bobong. Hak Cipta Dilindungi Undang-Undang. | <Link href="/admin/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem' }}>Login Admin</Link> <span style={{ color: '#6B7280', margin: '0 0.5rem' }}>•</span> <Link href="/guru/login" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem' }}>Login Guru</Link> <span style={{ color: '#6B7280', margin: '0 0.5rem' }}>•</span> <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>v2.4.6</span>
          </p>





        </div>
      </div>
    </footer>
  );
}
