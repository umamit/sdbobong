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

      {/* Tujuan Pendidikan & Profil Pelajar Pancasila */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Arah Pendidikan</span>
            <h2>Tujuan Sekolah</h2>
          </div>
          
          <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
            <FramerReveal direction="up" className="visimisi-box">
              <div className="visimisi-header" style={{ color: '#0EA5E9' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Pembentukan Karakter</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Menanamkan budi pekerti, nilai moral, spiritual keagamaan, serta kedisiplinan tinggi dalam lingkungan sekolah.
              </p>
            </FramerReveal>

            <FramerReveal direction="up" delay={0.1} className="visimisi-box">
              <div className="visimisi-header" style={{ color: '#10B981' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Optimalisasi Potensi</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Mengembangkan bakat, minat, seni budaya, serta kemampuan berpikir kritis anak melalui sistem belajar aktif.
              </p>
            </FramerReveal>

            <FramerReveal direction="up" delay={0.2} className="visimisi-box">
              <div className="visimisi-header" style={{ color: '#F59E0B' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z"/>
                </svg>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Kesiapan Akademik</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Mencetak prestasi akademik yang unggul sebagai bekal siswa melanjutkan ke jenjang pendidikan menengah.
              </p>
            </FramerReveal>
          </div>

          <div className="section-header" style={{ marginTop: 'var(--space-xl)' }}>
            <span className="section-subtitle">Nilai Karakter</span>
            <h2>Profil Pelajar Pancasila</h2>
          </div>

          <div className="grid-3">
            {[
              {
                title: "Beriman & Bertakwa",
                desc: "Berakhlak mulia kepada Tuhan Yang Maha Esa dan sesama makhluk hidup.",
                color: "#6366F1",
                icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              },
              {
                title: "Berkebinekaan Global",
                desc: "Mempertahankan budaya luhur daerah dan tetap berpikir terbuka terhadap dunia.",
                color: "#3B82F6",
                icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"
              },
              {
                title: "Gotong Royong",
                desc: "Kemampuan melakukan kegiatan bersama-sama dengan sukarela secara kolaboratif.",
                color: "#10B981",
                icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 8 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.01 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              },
              {
                title: "Mandiri",
                desc: "Pendidikan kemandirian dan rasa bertanggung jawab atas proses serta hasil belajarnya.",
                color: "#F59E0B",
                icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              },
              {
                title: "Bernalar Kritis",
                desc: "Mampu memproses informasi baik kualitatif maupun kuantitatif secara kritis.",
                color: "#EC4899",
                icon: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
              },
              {
                title: "Kreatif",
                desc: "Menghasilkan gagasan, karya, serta tindakan yang orisinal dan bermakna.",
                color: "#8B5CF6",
                icon: "M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5 16 5.67 16 6.5 15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
              }
            ].map((item, idx) => (
              <FramerReveal key={idx} direction="up" delay={0.05 * idx} className="visimisi-box">
                <div className="visimisi-header" style={{ color: item.color }}>
                  <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d={item.icon}/>
                  </svg>
                  <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{item.title}</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </FramerReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
