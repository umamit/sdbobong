import { loadWebConfig } from '../../lib/database';
import AcademicPortal from '../../components/AcademicPortal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Informasi Akademik & Kurikulum Merdeka - SD Negeri Bobong',
  description: 'Informasi program pembelajaran Kurikulum Merdeka, jadwal kegiatan belajar mengajar (KBM), program Projek Penguatan Profil Pelajar Pancasila (P5), dan daftar ekstrakurikuler.',
};

export default async function Akademik() {
  const config = await loadWebConfig();

  const defaultJadwalKBM = [
    { id: "kbm-1", kelas: "Kelas I & II (Fase A)", hari: "Senin - Kamis: 07.15 - 11.45 WIT\nJumat: 07.15 - 10.30 WIT\nSabtu: 07.15 - 11.00 WIT", keterangan: "Jam Belajar Lebih Singkat, Istirahat Pukul 09.15 - 09.45 WIT" },
    { id: "kbm-2", kelas: "Kelas III & IV (Fase B)", hari: "Senin - Kamis: 07.15 - 12.15 WIT\nJumat: 07.15 - 11.00 WIT\nSabtu: 07.15 - 11.30 WIT", keterangan: "KBM Utama, Istirahat Pukul 09.30 - 10.00 WIT" },
    { id: "kbm-3", kelas: "Kelas V & VI (Fase C)", hari: "Senin - Kamis: 07.15 - 12.50 WIT\nJumat: 07.15 - 11.00 WIT\nSabtu: 07.15 - 11.30 WIT", keterangan: "Materi Esensial & Projek P5, Istirahat Pukul 09.30 - 10.00 WIT" }
  ];

  const akademikData = config.stats?.page_contents?.akademik || {};
  const akademik = {
    ...akademikData,
    banner_title: akademikData.banner_title || "Informasi Akademik",
    banner_text: akademikData.banner_text || "Panduan kurikulum, kalender pendidikan berjalan, serta tata tertib kedisiplinan siswa.",
    kurikulum_badge: akademikData.kurikulum_badge || "Metode Pembelajaran",
    kurikulum_title: akademikData.kurikulum_title || "Penerapan Kurikulum Merdeka",
    kurikulum_p1: akademikData.kurikulum_p1 || "SD Negeri Bobong telah mengimplementasikan Kurikulum Merdeka secara bertahap untuk memberikan pengalaman belajar yang lebih fleksibel, berfokus pada materi esensial, dan mengembangkan minat bakat murid.",
    kurikulum_p2: akademikData.kurikulum_p2 || "Salah satu pilar utama kurikulum ini adalah Projek Penguatan Profil Pelajar Pancasila (P5). Di SD Negeri Bobong, proyek P5 diintegrasikan dengan pemanfaatan kearifan lokal Pulau Taliabu, seperti pengenalan kerajinan tradisional Maluku Utara dan kepedulian terhadap kebersihan lingkungan bahari.",
    kurikulum_image: akademikData.kurikulum_image || "/images/kurikulum_merdeka.svg",
    kurikulum_tags: akademikData.kurikulum_tags || ["💡 Fokus Karakter", "🌱 Belajar Kontekstual", "🎭 Kreativitas Lokal"],
    calendar: akademikData.calendar || [
      { id: "juli", month: "Juli 2026", desc: "Hari Pertama Sekolah & Pengenalan Lingkungan Sekolah (MPLS)", dates: "13 - 17 Juli 2026" },
      { id: "agustus", month: "Agustus 2026", desc: "Peringatan HUT RI ke-81 & Upacara Bendera", dates: "17 Agustus 2026" },
      { id: "september", month: "September 2026", desc: "Asesmen Tengah Semester (ATS) Ganjil", dates: "Pekan ke-3 September 2026" },
      { id: "desember", month: "Desember 2026", desc: "Asesmen Akhir Semester Ganjil & Pembagian Rapor", dates: "07 - 19 Desember 2026" },
      { id: "maret", month: "Maret 2027", desc: "Try Out Asesmen Sekolah & Libur Ramadan 1448 H", dates: "08 - 13 Maret 2027" },
      { id: "juni", month: "Juni 2027", desc: "Asesmen Akhir Tahun & Pembagian Rapor Kenaikan Kelas", dates: "07 - 19 Juni 2027" }
    ],
    tata_tertib: akademikData.tata_tertib || [
      "Kehadiran: Siswa wajib hadir di sekolah paling lambat pukul 07.15 WIT sebelum bel masuk berbunyi.",
      "Atribut: Siswa harus mengenakan seragam lengkap dengan badge nama, logo lokasi kabupaten, dan ikat pinggang hitam sekolah.",
      "Kebersihan: Siswa dilarang membuang sampah sembarangan and diwajibkan berpartisipasi aktif dalam regu piket kelas masing-masing.",
      "Perizinan: Apabila siswa berhalangan hadir karena sakit atau keperluan keluarga, orang tua wajib mengirimkan surat izin tertulis atau menghubungi guru kelas via WA."
    ],
    seragam: akademikData.seragam || [
      { days: "Senin - Selasa", type: "Nasional Merah Putih", details: "Dasi, Topi Upacara, Sepatu Hitam Kaos Kaki Putih" },
      { days: "Rabu - Kamis", type: "Batik Khas Taliabu / Lokal", details: "Bawahan Merah, Sepatu Hitam Kaos Kaki Putih" },
      { days: "Jumat", type: "Busana Muslim Sekolah / Olahraga", details: "Pakaian Olahraga hanya dipakai saat jam praktek PJOK" },
      { days: "Sabtu", type: "Pramuka Lengkap", details: "Hasduk/Setangan Leher, Baret/Topi Pramuka, Sepatu Hitam Kaos Kaki Hitam" }
    ],
    jadwal_kbm: akademikData.jadwal_kbm || defaultJadwalKBM
  };

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{akademik.banner_title}</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>{akademik.banner_text}</p>
        </div>
      </section>

      {/* Kurikulum Merdeka */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="reveal-on-scroll reveal-delay-200" style={{ order: 2, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <img src={akademik.kurikulum_image} alt="Aktivitas Kurikulum Merdeka" width={600} height={300} style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', display: 'block' }} fetchPriority="high" decoding="async" />
            </div>
            <div className="reveal-on-scroll" style={{ order: 1 }}>
              <span className="welcome-badge">{akademik.kurikulum_badge}</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>{akademik.kurikulum_title}</h2>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>{akademik.kurikulum_p1}</p>
              <p className="text-justify" style={{ maxWidth: '75ch' }}>{akademik.kurikulum_p2}</p>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                {akademik.kurikulum_tags && akademik.kurikulum_tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kalender Pendidikan & Portal P5 */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Portal Kemitraan Orang Tua</span>
            <h2>Kalender Belajar, KBM, & Projek P5</h2>
          </div>

          <div className="reveal-on-scroll">
            <AcademicPortal 
              initialCalendar={akademik.calendar} 
              initialP5Projects={akademik.p5_projects || []} 
              initialJadwalKBM={akademik.jadwal_kbm || []}
            />
          </div>
        </div>
      </section>

      {/* Tata Tertib & Seragam */}
      <section className="section-padding" id="tata-tertib">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Aturan Sekolah</span>
            <h2>Tata Tertib & Seragam Siswa</h2>
          </div>

          <div className="grid-2">
            {/* Tata Tertib */}
            <div className="reveal-on-scroll reveal-delay-100" style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                Ketentuan Kedisiplinan
              </h3>
              <ul className="misi-list" style={{ fontSize: '0.95rem' }}>
                {akademik.tata_tertib && akademik.tata_tertib.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Panduan Seragam */}
            <div className="reveal-on-scroll reveal-delay-300" style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Jadwal Penggunaan Seragam
              </h3>

              <div className="table-responsive" style={{ boxShadow: 'none', borderRadius: 0, border: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th>Hari</th>
                      <th>Jenis Seragam</th>
                      <th>Kelengkapan Atribut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {akademik.seragam && akademik.seragam.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.days}</strong></td>
                        <td>{item.type}</td>
                        <td>{item.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
