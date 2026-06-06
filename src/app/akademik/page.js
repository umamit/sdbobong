import { loadWebConfig } from '../../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Akademik() {
  const config = await loadWebConfig();

  const akademik = config.stats?.page_contents?.akademik || {
    banner_title: "Informasi Akademik",
    banner_text: "Panduan kurikulum, kalender pendidikan berjalan, serta tata tertib kedisiplinan siswa.",
    kurikulum_badge: "Metode Pembelajaran",
    kurikulum_title: "Penerapan Kurikulum Merdeka",
    kurikulum_p1: "SD Negeri Bobong telah mengimplementasikan Kurikulum Merdeka secara bertahap untuk memberikan pengalaman belajar yang lebih fleksibel, berfokus pada materi esensial, dan mengembangkan minat bakat murid.",
    kurikulum_p2: "Salah satu pilar utama kurikulum ini adalah Projek Penguatan Profil Pelajar Pancasila (P5). Di SD Negeri Bobong, proyek P5 diintegrasikan dengan pemanfaatan kearifan lokal Pulau Taliabu, seperti pengenalan kerajinan tradisional Maluku Utara dan kepedulian terhadap kebersihan lingkungan bahari.",
    kurikulum_image: "/images/kurikulum_merdeka.svg",
    kurikulum_tags: ["💡 Fokus Karakter", "🌱 Belajar Kontekstual", "🎭 Kreativitas Lokal"],
    calendar: [
      { id: "juli", month: "Juli 2025", desc: "Hari Pertama Sekolah & Pengenalan Lingkungan Sekolah (MPLS)", dates: "14 - 16 Juli 2025" },
      { id: "agustus", month: "Agustus 2025", desc: "Peringatan HUT RI ke-80 & Lomba Kemerdekaan Antar Kelas", dates: "17 Agustus 2025" },
      { id: "september", month: "September 2025", desc: "Asesmen Nasional Berbasis Komputer (ANBK)", dates: "Pekan ke-3 September" },
      { id: "desember", month: "Desember 2025", desc: "Asesmen Sumatif Semester Ganjil & Pembagian Rapor", dates: "15 - 20 Desember 2025" },
      { id: "maret", month: "Maret 2026", desc: "Libur Khusus Awal Puasa Ramadan 1447 H", dates: "Menyesuaikan Keputusan Menteri" },
      { id: "juni", month: "Juni 2026", desc: "Ujian Akhir Semester Genap & Pembagian Rapor Kenaikan Kelas", dates: "08 - 20 Juni 2026" }
    ],
    tata_tertib: [
      "Kehadiran: Siswa wajib hadir di sekolah paling lambat pukul 07.15 WIT sebelum bel masuk berbunyi.",
      "Atribut: Siswa harus mengenakan seragam lengkap dengan badge nama, logo lokasi kabupaten, dan ikat pinggang hitam sekolah.",
      "Kebersihan: Siswa dilarang membuang sampah sembarangan and diwajibkan berpartisipasi aktif dalam regu piket kelas masing-masing.",
      "Perizinan: Apabila siswa berhalangan hadir karena sakit atau keperluan keluarga, orang tua wajib mengirimkan surat izin tertulis atau menghubungi guru kelas via WA."
    ],
    seragam: [
      { days: "Senin - Selasa", type: "Nasional Merah Putih", details: "Dasi, Topi Upacara, Sepatu Hitam Kaos Kaki Putih" },
      { days: "Rabu - Kamis", type: "Batik Khas Taliabu / Lokal", details: "Bawahan Merah, Sepatu Hitam Kaos Kaki Putih" },
      { days: "Jumat", type: "Busana Muslim Sekolah / Olahraga", details: "Pakaian Olahraga hanya dipakai saat jam praktek PJOK" },
      { days: "Sabtu", type: "Pramuka Lengkap", details: "Hasduk/Setangan Leher, Baret/Topi Pramuka, Sepatu Hitam Kaos Kaki Hitam" }
    ]
  };

  const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
  const currentMonth = months[new Date().getMonth()];

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
            <div style={{ order: 2, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <img src={akademik.kurikulum_image} alt="Aktivitas Kurikulum Merdeka" style={{ width: '100%', height: '300px', objectFit: 'cover' }} loading="lazy" decoding="async" />
            </div>
            <div style={{ order: 1 }}>
              <span className="welcome-badge">{akademik.kurikulum_badge}</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>{akademik.kurikulum_title}</h2>
              <p>{akademik.kurikulum_p1}</p>
              <p>{akademik.kurikulum_p2}</p>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                {akademik.kurikulum_tags && akademik.kurikulum_tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kalender Pendidikan */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Kalender Belajar</span>
            <h2>Kalender Pendidikan Berjalan</h2>
          </div>

          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto' }}>Berikut adalah perkiraan agenda penting sekolah sepanjang tahun ajaran berjalan. Baris bertanda khusus mendeteksi bulan yang sedang berjalan secara otomatis.</p>

          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Bulan</th>
                  <th>Agenda / Kegiatan Utama</th>
                  <th>Status / Tanggal Penting</th>
                </tr>
              </thead>
              <tbody>
                {akademik.calendar && akademik.calendar.map((row) => {
                  const isCurrent = row.id === currentMonth;
                  const rowStyle = isCurrent ? {
                    borderLeft: '4px solid var(--secondary)',
                    backgroundColor: 'var(--accent-bg)'
                  } : {};

                  return (
                    <tr key={row.id} className="calendar-row" style={rowStyle}>
                      <td>
                        <span className={`badge ${isCurrent ? 'badge-secondary' : 'badge-accent'} calendar-month-badge`}>
                          {row.month} {isCurrent && '(Bulan Ini)'}
                        </span>
                      </td>
                      <td>{row.desc}</td>
                      <td>{row.dates}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
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
            <div style={{ background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
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
