import { loadWebConfig } from '../../../lib/database';
import { FramerRevealContainer, FramerRevealItem, FramerWordReveal, FramerReveal } from '../../../components/FramerReveal';
import Image from 'next/image';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Sejarah Sekolah & Identitas Resmi - SD Negeri Bobong',
  description: 'Sejarah berdirinya SD Negeri Bobong sejak tahun 1971, beserta data pokok pendidikan (NPSN, akreditasi, status lahan, dan kurikulum).',
};

export default async function Sejarah() {
  noStore();
  const config = await loadWebConfig().catch(err => { console.error("Error loadWebConfig in Sejarah:", err); return {}; });
  const profil = config.stats?.page_contents?.profil || {};

  const namaResmi = profil.nama_resmi || "SD Negeri Bobong";
  const npsn = profil.npsn || "60200589";
  const statusSekolah = profil.status_sekolah || "Negeri";
  const skPendirian = profil.sk_pendirian || "04 Oktober 1971 (SK: 420/04/10/1971)";
  const akreditasi = profil.akreditasi || "B (Baik)";
  const kurikulum = profil.kurikulum_operasional || "Kurikulum Merdeka";
  const alamat = profil.alamat_lengkap || "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791";
  const lahan = profil.kepemilikan_lahan || "Pemerintah Daerah Kabupaten Pulau Taliabu";

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            <FramerWordReveal text="Sejarah Sekolah" />
          </h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Rekam jejak berdirinya SD Negeri Bobong dan informasi pokok identitas administrasi sekolah.
          </p>
        </div>
      </section>

      {/* Sejarah */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <FramerReveal direction="left">
              <span className="welcome-badge">{profil.sejarah_badge || "Sejarah Sekolah"}</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>{profil.sejarah_title || "Perjalanan SD Negeri Bobong"}</h2>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>
                {profil.sejarah_p1 || "SD Negeri Bobong didirikan secara resmi pada tanggal 04 Oktober 1971 berdasarkan Surat Keputusan (SK) Pendirian Nomor 420/04/10/1971. Sekolah ini merupakan institusi pendidikan dasar tertua di jantung ibukota Kabupaten Pulau Taliabu, Maluku Utara."}
              </p>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>
                {profil.sejarah_p2 || "Selama lebih dari lima dekade, sekolah ini telah mengabdi mendidik anak-anak di Taliabu Barat. Sejak pemekaran Kabupaten Pulau Taliabu pada tahun 2013, SD Negeri Bobong terus memperbarui kurikulum dan sarana prasarana guna mempertahankan posisinya sebagai sekolah negeri rujukan di pusat kabupaten."}
              </p>
            </FramerReveal>
            <FramerReveal direction="right" delay={0.15} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <Image 
                src={profil.sejarah_image || "/images/profil_sekolah.svg"} 
                alt="Gedung SD Negeri Bobong" 
                width={640}
                height={320}
                style={{ width: '100%', height: '320px', objectFit: 'cover' }} 
                loading="lazy" 
              />
            </FramerReveal>
          </div>
        </div>
      </section>

      {/* Identitas Resmi (Dapodik Bento Grid) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Data Pokok Pendidikan</span>
            <h2>Profil Administrasi &amp; Legalitas</h2>
          </div>
          <FramerRevealContainer className="dapodik-bento-grid">
            {/* Card 1: Nama Resmi */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/school.png" alt="Nama Resmi" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Nama Resmi Sekolah</span>
              <span className="dapodik-bento-value">{namaResmi}</span>
            </FramerRevealItem>

            {/* Card 2: NPSN */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/key.png" alt="NPSN" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">NPSN</span>
              <span className="dapodik-bento-value" style={{ fontWeight: 'bold' }}>{npsn}</span>
            </FramerRevealItem>

            {/* Card 3: Status Sekolah */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/government.png" alt="Status" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Status Sekolah</span>
              <span className="dapodik-bento-value">{statusSekolah}</span>
            </FramerRevealItem>

            {/* Card 4: SK Pendirian */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/calendar.png" alt="SK Pendirian" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">SK Pendirian</span>
              <span className="dapodik-bento-value">{skPendirian}</span>
            </FramerRevealItem>

            {/* Card 5: Akreditasi */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/shield.png" alt="Akreditasi" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Akreditasi</span>
              <span className="dapodik-bento-value">{akreditasi}</span>
            </FramerRevealItem>

            {/* Card 6: Kurikulum */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/books.png" alt="Kurikulum" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Kurikulum</span>
              <span className="dapodik-bento-value">{kurikulum}</span>
            </FramerRevealItem>

            {/* Card 7: Alamat Lengkap */}
            <FramerRevealItem className="dapodik-bento-card span-2">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/map.png" alt="Alamat" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Alamat Lengkap</span>
              <span className="dapodik-bento-value">{alamat}</span>
            </FramerRevealItem>

            {/* Card 8: Status Lahan */}
            <FramerRevealItem className="dapodik-bento-card">
              <div className="dapodik-bento-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/animated/land.png" alt="Lahan" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
              <span className="dapodik-bento-label">Status Lahan</span>
              <span className="dapodik-bento-value">{lahan}</span>
            </FramerRevealItem>
          </FramerRevealContainer>
        </div>
      </section>
    </>
  );
}
