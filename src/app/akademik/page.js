'use client';

import { useEffect, useState } from 'react';

export default function Akademik() {
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    setCurrentMonth(months[new Date().getMonth()]);
  }, []);

  const calendarData = [
    { id: 'juli', month: 'Juli 2025', desc: 'Hari Pertama Sekolah & Pengenalan Lingkungan Sekolah (MPLS)', dates: '14 - 16 Juli 2025' },
    { id: 'agustus', month: 'Agustus 2025', desc: 'Peringatan HUT RI ke-80 & Lomba Kemerdekaan Antar Kelas', dates: '17 Agustus 2025' },
    { id: 'september', month: 'September 2025', desc: 'Asesmen Nasional Berbasis Komputer (ANBK)', dates: 'Pekan ke-3 September' },
    { id: 'desember', month: 'Desember 2025', desc: 'Asesmen Sumatif Semester Ganjil & Pembagian Rapor', dates: '15 - 20 Desember 2025' },
    { id: 'maret', month: 'Maret 2026', desc: 'Libur Khusus Awal Puasa Ramadan 1447 H', dates: 'Menyesuaikan Keputusan Menteri' },
    { id: 'juni', month: 'Juni 2026', desc: 'Ujian Akhir Semester Genap & Pembagian Rapor Kenaikan Kelas', dates: '08 - 20 Juni 2026' }
  ];

  return (
    <>
      {/* Page Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Informasi Akademik</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Panduan kurikulum, kalender pendidikan berjalan, serta tata tertib kedisiplinan siswa.</p>
        </div>
      </section>

      {/* Kurikulum Merdeka */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div style={{ order: 2, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <img src="/images/kurikulum_merdeka.svg" alt="Aktivitas Kurikulum Merdeka" style={{ width: '100%', height: '300px' }} />
            </div>
            <div style={{ order: 1 }}>
              <span className="welcome-badge">Metode Pembelajaran</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>Penerapan Kurikulum Merdeka</h2>
              <p>SD Negeri Bobong telah mengimplementasikan <strong>Kurikulum Merdeka</strong> secara bertahap untuk memberikan pengalaman belajar yang lebih fleksibel, berfokus pada materi esensial, dan mengembangkan minat bakat murid.</p>
              <p>Salah satu pilar utama kurikulum ini adalah <strong>Projek Penguatan Profil Pelajar Pancasila (P5)</strong>. Di SD Negeri Bobong, proyek P5 diintegrasikan dengan pemanfaatan kearifan lokal Pulau Taliabu, seperti pengenalan kerajinan tradisional Maluku Utara dan kepedulian terhadap kebersihan lingkungan bahari.</p>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>💡 Fokus Karakter</span>
                <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>🌱 Belajar Kontekstual</span>
                <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>🎭 Kreativitas Lokal</span>
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
            <h2>Kalender Pendidikan TA 2025/2026</h2>
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
                {calendarData.map((row) => {
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
                <li><strong>Kehadiran:</strong> Siswa wajib hadir di sekolah paling lambat pukul <strong>07.15 WIT</strong> sebelum bel masuk berbunyi.</li>
                <li><strong>Atribut:</strong> Siswa harus mengenakan seragam lengkap dengan badge nama, logo lokasi kabupaten, dan ikat pinggang hitam sekolah.</li>
                <li><strong>Kebersihan:</strong> Siswa dilarang membuang sampah sembarangan dan diwajibkan berpartisipasi aktif dalam regu piket kelas masing-masing.</li>
                <li><strong>Perizinan:</strong> Apabila siswa berhalangan hadir karena sakit atau keperluan keluarga, orang tua wajib mengirimkan surat izin tertulis atau menghubungi guru kelas via WA.</li>
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
                    <tr>
                      <td><strong>Senin - Selasa</strong></td>
                      <td>Nasional Merah Putih</td>
                      <td>Dasi, Topi Upacara, Sepatu Hitam Kaos Kaki Putih</td>
                    </tr>
                    <tr>
                      <td><strong>Rabu - Kamis</strong></td>
                      <td>Batik Khas Taliabu / Lokal</td>
                      <td>Bawahan Merah, Sepatu Hitam Kaos Kaki Putih</td>
                    </tr>
                    <tr>
                      <td><strong>Jumat</strong></td>
                      <td>Busana Muslim Sekolah / Olahraga</td>
                      <td>Pakaian Olahraga hanya dipakai saat jam praktek PJOK</td>
                    </tr>
                    <tr>
                      <td><strong>Sabtu</strong></td>
                      <td>Pramuka Lengkap</td>
                      <td>Hasduk/Setangan Leher, Baret/Topi Pramuka, Sepatu Hitam Kaos Kaki Hitam</td>
                    </tr>
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
