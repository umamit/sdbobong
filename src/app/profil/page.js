import { loadTeachers, loadAchievements, loadWebConfig } from '../../lib/database';
import InteractiveFacilityMap from '../../components/InteractiveFacilityMap';
import TeachersSectionClient from './TeachersSectionClient';
import Image from 'next/image';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Fresh load

export const metadata = {
  title: 'Profil, Visi Misi & Sejarah - SD Negeri Bobong',
  description: 'Pelajari sejarah berdirinya SD Negeri Bobong sejak tahun 1971, visi misi sekolah, profil dewan guru, serta fasilitas sarana prasarana penunjang belajar.',
};

export default async function Profil() {
  noStore(); // Prevent server and CDN caching of teacher data
  const [teachers, achievements, config] = await Promise.all([
    loadTeachers(),
    loadAchievements(),
    loadWebConfig()
  ]);

  const profil = config.stats?.page_contents?.profil || {
    banner_title: "Profil Sekolah",
    banner_text: "Mengenal lebih dekat sejarah, visi misi, dan jajaran pendidik SD Negeri Bobong.",
    sejarah_badge: "Sejarah Sekolah",
    sejarah_title: "Perjalanan SD Negeri Bobong",
    sejarah_p1: "SD Negeri Bobong didirikan secara resmi pada tanggal 04 Oktober 1971 berdasarkan Surat Keputusan (SK) Pendirian Nomor 420/04/10/1971. Sekolah ini merupakan institusi pendidikan dasar tertua di jantung ibukota Kabupaten Pulau Taliabu, Maluku Utara.",
    sejarah_p2: "Selama lebih dari lima dekade, sekolah ini telah mengabdi mendidik anak-anak di Taliabu Barat. Sejak pemekaran Kabupaten Pulau Taliabu pada tahun 2013, SD Negeri Bobong terus memperbarui kurikulum and sarana prasarana guna mempertahankan posisinya sebagai sekolah negeri rujukan di pusat kabupaten.",
    sejarah_image: "/images/profil_sekolah.svg",
    visi: "\"Terwujudnya peserta didik yang Cerdas dalam berpikir, Kokoh dalam Karakter akhlak mulia, serta luhur dalam Menjaga Nilai Budaya bangsa di era global.\"",
    misi: [
      "Melaksanakan pembelajaran aktif, kreatif, efektif, dan menyenangkan untuk mengoptimalkan kecerdasan siswa.",
      "Menanamkan keimanan, ketakwaan, serta nilai budi pekerti luhur dalam aktivitas harian sekolah.",
      "Mengintegrasikan muatan lokal kebudayaan Maluku Utara dalam pembelajaran seni dan keterampilan daerah.",
      "Membina kemandirian dan rasa peduli lingkungan hidup melalui program Sabtu Bersih dan penghijauan sekolah.",
      "Menjalin hubungan kemitraan yang harmonis dengan orang tua siswa dan masyarakat sekitar demi kesuksesan belajar anak."
    ],
    nama_resmi: "SD Negeri Bobong",
    npsn: "60200589",
    status_sekolah: "Negeri",
    sk_pendirian: "04 Oktober 1971 (SK: 420/04/10/1971)",
    akreditasi: "B (Baik)",
    kurikulum_operasional: "Kurikulum Merdeka",
    alamat_lengkap: "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791",
    kepemilikan_lahan: "Pemerintah Daerah Kabupaten Pulau Taliabu",
    ruang_belajar_desc: "9 Ruang Kelas belajar (6 Rombel Aktif) yang bersih, kondusif, dan nyaman untuk proses KBM.",
    ruang_guru_desc: "1 Ruang Guru dan Kepala Sekolah sebagai pusat administrasi, koordinasi, dan pelayanan pendidikan.",
    sanitasi_desc: "2 Ruang Toilet bersih dan nyaman yang terawat dengan baik untuk guru dan murid.",
    gudang_desc: "1 Ruang Gudang penyimpanan inventaris, peralatan belajar mengajar, serta perlengkapan sekolah.",
    olahraga_desc: "Halaman Olahraga & Upacara yang luas di bagian tengah sekolah untuk melatih ketangkasan fisik siswa.",
    literasi_desc: "Sekolah mengoptimalkan Pojok Baca Kelas dan koleksi literasi untuk meningkatkan minat baca murid harian."
  };

  const kepalaSekolah = teachers.find(t => (t.role || "").toLowerCase().includes("kepala sekolah")) || null;

  const tataUsaha = teachers.find(t =>
    (t.role || "").toLowerCase().includes("tata usaha") ||
    (t.role || "").toLowerCase().includes("koordinator tu")
  ) || null;

  const komite = teachers.find(t =>
    (t.role || "").toLowerCase().includes("komite")
  ) || null;

  const bendahara = teachers.find(t =>
    (t.role || "").toLowerCase().includes("bendahara")
  ) || null;

  const nonKomiteTeachers = teachers.filter(t =>
    !(t.role || "").toLowerCase().includes("komite")
  );

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{profil.banner_title}</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>{profil.banner_text}</p>
        </div>
      </section>

      {/* Sejarah & Identitas */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="reveal-on-scroll">
              <span className="welcome-badge">{profil.sejarah_badge}</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>{profil.sejarah_title}</h2>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>{profil.sejarah_p1}</p>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>{profil.sejarah_p2}</p>
            </div>
            <div className="reveal-on-scroll reveal-delay-200" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <Image 
                src={profil.sejarah_image} 
                alt="Gedung SD Negeri Bobong" 
                width={640}
                height={320}
                style={{ width: '100%', height: '320px', objectFit: 'cover' }} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Identitas Resmi Sekolah (Dapodik Bento Grid) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Data Pokok Pendidikan</span>
            <h2>Profil Administrasi &amp; Legalitas</h2>
          </div>
          <div className="dapodik-bento-grid reveal-on-scroll">
            {/* Card 1: Nama Resmi */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">🏫</div>
              <span className="dapodik-bento-label">Nama Resmi Sekolah</span>
              <span className="dapodik-bento-value">{profil.nama_resmi || "SD Negeri Bobong"}</span>
            </div>

            {/* Card 2: NPSN */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">🔑</div>
              <span className="dapodik-bento-label">NPSN</span>
              <span className="dapodik-bento-value" style={{ fontWeight: 'bold' }}>{profil.npsn || "60200589"}</span>
            </div>

            {/* Card 3: Status Sekolah */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">🏛️</div>
              <span className="dapodik-bento-label">Status Sekolah</span>
              <span className="dapodik-bento-value">{profil.status_sekolah || "Negeri"}</span>
            </div>

            {/* Card 4: SK Pendirian */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">📅</div>
              <span className="dapodik-bento-label">SK Pendirian</span>
              <span className="dapodik-bento-value">{profil.sk_pendirian || "04 Oktober 1971 (SK: 420/04/10/1971)"}</span>
            </div>

            {/* Card 5: Akreditasi */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">🛡️</div>
              <span className="dapodik-bento-label">Akreditasi</span>
              <span className="dapodik-bento-value">{profil.akreditasi || "B (Baik)"}</span>
            </div>

            {/* Card 6: Kurikulum */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">📖</div>
              <span className="dapodik-bento-label">Kurikulum</span>
              <span className="dapodik-bento-value">{profil.kurikulum_operasional || "Kurikulum Merdeka"}</span>
            </div>

            {/* Card 7: Alamat Lengkap (Spans 2 columns) */}
            <div className="dapodik-bento-card span-2">
              <div className="dapodik-bento-icon">📍</div>
              <span className="dapodik-bento-label">Alamat Lengkap</span>
              <span className="dapodik-bento-value">{profil.alamat_lengkap || "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791"}</span>
            </div>

            {/* Card 8: Status Lahan */}
            <div className="dapodik-bento-card">
              <div className="dapodik-bento-icon">🌳</div>
              <span className="dapodik-bento-label">Status Lahan</span>
              <span className="dapodik-bento-value">{profil.kepemilikan_lahan || "Pemerintah Daerah"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Fasilitas Sekolah Interaktif */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Sarana & Prasarana</span>
            <h2>Eksplorasi Denah & Fasilitas Sekolah</h2>
          </div>
          <div className="reveal-on-scroll">
            <InteractiveFacilityMap />
          </div>
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
            <div className="visimisi-box reveal-on-scroll reveal-delay-100">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                <h3>Visi Sekolah</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 500, lineHeight: 1.7, fontStyle: 'italic' }}>
                {profil.visi}
              </p>
            </div>
            <div className="visimisi-box reveal-on-scroll reveal-delay-300">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                <h3>Misi Sekolah</h3>
              </div>
              <ul className="misi-list">
                {profil.misi && profil.misi.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bagan Organisasi & PTK Grid with Detail Modals */}
      <TeachersSectionClient teachers={teachers} />
    </>
  );
}
