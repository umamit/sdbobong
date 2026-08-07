import { loadWebConfig } from '../../../lib/database';
import { FramerReveal, FramerWordReveal } from '../../../components/FramerReveal';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Visi & Misi Sekolah - SD Negeri Bobong',
  description: 'Visi, misi, dan tujuan dasar pendidikan di SD Negeri Bobong dalam mencetak generasi berkarakter luhur.',
};

export default async function VisiMisi() {
  noStore();
  const config = await loadWebConfig().catch(err => { console.error("Error loadWebConfig in VisiMisi:", err); return {}; });
  const profil = config.stats?.page_contents?.profil || {};

  const visi = profil.visi || "\"Terwujudnya peserta didik yang Cerdas dalam berpikir, Kokoh dalam Karakter akhlak mulia, serta luhur dalam Menjaga Nilai Budaya bangsa di era global.\"";
  const misi = profil.misi || [
    "Melaksanakan pembelajaran aktif, kreatif, efektif, dan menyenangkan untuk mengoptimalkan kecerdasan siswa.",
    "Menanamkan keimanan, ketakwaan, serta nilai budi pekerti luhur dalam aktivitas harian sekolah.",
    "Mengintegrasikan muatan lokal kebudayaan Maluku Utara dalam pembelajaran seni dan keterampilan daerah.",
    "Membina kemandirian dan rasa peduli lingkungan hidup melalui program Sabtu Bersih dan penghijauan sekolah.",
    "Menjalin hubungan kemitraan yang harmonis dengan orang tua siswa dan masyarakat sekitar demi kesuksesan belajar anak."
  ];

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            <FramerWordReveal text="Visi & Misi" />
          </h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Komitmen arah tujuan pendidikan dan misi operasional SD Negeri Bobong.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Tujuan Kami</span>
            <h2>Visi & Misi Sekolah</h2>
          </div>
          <div className="visimisi-layout">
            <FramerReveal direction="left" className="visimisi-box">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <h3>Visi Sekolah</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 500, lineHeight: 1.7, fontStyle: 'italic' }}>
                {visi}
              </p>
            </FramerReveal>
            <FramerReveal direction="right" delay={0.15} className="visimisi-box">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <h3>Misi Sekolah</h3>
              </div>
              <ul className="misi-list">
                {misi.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </FramerReveal>
          </div>
        </div>
      </section>
    </>
  );
}
