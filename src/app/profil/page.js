import { loadTeachers } from '../../lib/database';

export const revalidate = 0; // Fresh load

export default async function Profil() {
  const teachers = await loadTeachers();

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
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Profil Sekolah</h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Mengenal lebih dekat sejarah, visi misi, dan jajaran pendidik SD Negeri Bobong.</p>
        </div>
      </section>

      {/* Sejarah & Identitas */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="welcome-badge">Sejarah Sekolah</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>Perjalanan SD Negeri Bobong</h2>
              <p>SD Negeri Bobong didirikan secara resmi pada tanggal <strong>04 Oktober 1971</strong> berdasarkan Surat Keputusan (SK) Pendirian Nomor <strong>420/04/10/1971</strong>. Sekolah ini merupakan institusi pendidikan dasar tertua di jantung ibukota Kabupaten Pulau Taliabu, Maluku Utara.</p>
              <p>Selama lebih dari lima dekade, sekolah ini telah mengabdi mendidik anak-anak di Taliabu Barat. Sejak pemekaran Kabupaten Pulau Taliabu pada tahun 2013, SD Negeri Bobong terus memperbarui kurikulum dan sarana prasarana guna mempertahankan posisinya sebagai sekolah negeri rujukan di pusat kabupaten.</p>
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}>
              <img src="/images/profil_sekolah.svg" alt="Gedung SD Negeri Bobong" style={{ width: '100%', height: '320px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Identitas Resmi Sekolah (Dapodik) */}
      <section className="section-padding" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Data Pokok Pendidikan</span>
            <h2>Profil Administrasi & Legalitas</h2>
          </div>
          <div className="table-responsive">
            <table className="table-custom">
              <tbody>
                <tr>
                  <td><strong>Nama Resmi Sekolah</strong></td>
                  <td>SD Negeri Bobong</td>
                </tr>
                <tr>
                  <td><strong>NPSN</strong></td>
                  <td><strong>60200589</strong> (Terdaftar resmi di Dapodik Kemendikbudristek)</td>
                </tr>
                <tr>
                  <td><strong>Status Sekolah</strong></td>
                  <td>Negeri</td>
                </tr>
                <tr>
                  <td><strong>Tanggal & No. SK Pendirian</strong></td>
                  <td>04 Oktober 1971 (SK: 420/04/10/1971)</td>
                </tr>
                <tr>
                  <td><strong>Akreditasi</strong></td>
                  <td><span className="badge badge-accent" style={{ backgroundColor: '#FFF8E6', color: '#D48408' }}>B (Baik)</span></td>
                </tr>
                <tr>
                  <td><strong>Kurikulum Operasional</strong></td>
                  <td>Kurikulum Merdeka</td>
                </tr>
                <tr>
                  <td><strong>Alamat Lengkap</strong></td>
                  <td>Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791</td>
                </tr>
                <tr>
                  <td><strong>Status Kepemilikan Lahan</strong></td>
                  <td>Pemerintah Daerah Kabupaten Pulau Taliabu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sarana & Prasarana */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Fasilitas</span>
            <h2>Sarana & Prasarana Sekolah</h2>
          </div>
          <div className="grid-3">
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>🏫</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Ruang Belajar</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}><strong>9 Ruang Kelas</strong> belajar (6 Rombel Aktif) yang bersih, kondusif, dan nyaman untuk proses KBM.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>👥</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Ruang Guru</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}><strong>1 Ruang Guru</strong> dan Kepala Sekolah sebagai pusat administrasi, koordinasi, dan pelayanan pendidikan.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>🚻</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Fasilitas Sanitasi</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}><strong>2 Ruang Toilet</strong> bersih dan nyaman yang terawat dengan baik untuk guru dan murid.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>📦</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Ruang Gudang</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}><strong>1 Ruang Gudang</strong> penyimpanan inventaris, peralatan belajar mengajar, serta perlengkapan sekolah.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>🏃</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Fasilitas Olahraga</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}><strong>Halaman Olahraga & Upacara</strong> yang luas di bagian tengah sekolah untuk melatih ketangkasan fisik siswa.</p>
            </div>
            <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>📖</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary)' }}>Pojok Baca & Literasi</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--text-muted)' }}>Sekolah mengoptimalkan <strong>Pojok Baca Kelas</strong> dan koleksi literasi untuk meningkatkan minat baca murid harian.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Tujuan Kami</span>
            <h2>Visi & Misi Sekolah</h2>
          </div>
          <div className="visimisi-layout">
            <div className="visimisi-box">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                <h3>Visi Sekolah</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 500, lineHeight: 1.7, fontStyle: 'italic' }}>
                "Terwujudnya peserta didik yang Cerdas dalam berpikir, Kokoh dalam Karakter akhlak mulia, serta luhur dalam Menjaga Nilai Budaya bangsa di era global."
              </p>
            </div>
            <div className="visimisi-box">
              <div className="visimisi-header">
                <svg className="icon-svg" viewBox="0 0 24 24" width="28" height="28"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                <h3>Misi Sekolah</h3>
              </div>
              <ul className="misi-list">
                <li>Melaksanakan pembelajaran aktif, kreatif, efektif, dan menyenangkan untuk mengoptimalkan kecerdasan siswa.</li>
                <li>Menanamkan keimanan, ketakwaan, serta nilai budi pekerti luhur dalam aktivitas harian sekolah.</li>
                <li>Mengintegrasikan muatan lokal kebudayaan Maluku Utara dalam pembelajaran seni dan keterampilan daerah.</li>
                <li>Membina kemandirian dan rasa peduli lingkungan hidup melalui program Sabtu Bersih dan penghijauan sekolah.</li>
                <li>Menjalin hubungan kemitraan yang harmonis dengan orang tua siswa dan masyarakat sekitar demi kesuksesan belajar anak.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bagan Organisasi */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Manajemen</span>
            <h2>Struktur Organisasi</h2>
          </div>

          <div style={{ backgroundColor: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
            <div style={{ minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
              {/* Kepala Sekolah */}
              {kepalaSekolah ? (
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{kepalaSekolah.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{kepalaSekolah.role}</div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#e53e3e' }}>Tidak Ada</div>
                  <div style={{ fontSize: '0.8rem', color: '#c53030' }}>Kepala Sekolah</div>
                </div>
              )}

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)' }}></div>

              <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'center', width: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '18%', right: '18%', height: '2px', backgroundColor: 'var(--primary)', zIndex: 1 }}></div>

                {/* Left Box: Komite */}
                {komite ? (
                  <div style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{komite.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{komite.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Ketua Komite Sekolah</div>
                  </div>
                )}

                {/* Center Box: Tata Usaha */}
                {tataUsaha ? (
                  <div style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tataUsaha.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{tataUsaha.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Tata Usaha</div>
                  </div>
                )}

                {/* Right Box: Bendahara */}
                {bendahara ? (
                  <div style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{bendahara.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{bendahara.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Bendahara</div>
                  </div>
                )}
              </div>

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)', marginTop: '10px' }}></div>

              {/* Dewan Guru */}
              <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '400px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Dewan Guru & Pendidik</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>Jajaran Tenaga Pendidik Sekolah</div>
              </div>

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)' }}></div>

              {/* Grid of Teachers under Dewan Guru */}
              {teachers.filter(t => {
                const r = (t.role || "").toLowerCase();
                return !r.includes("kepala sekolah") &&
                       !r.includes("tata usaha") &&
                       !r.includes("koordinator tu") &&
                       !r.includes("komite") &&
                       !r.includes("bendahara");
              }).length > 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '15px', 
                  justifyContent: 'center', 
                  maxWidth: '850px', 
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed #cbd5e1',
                  boxSizing: 'border-box'
                }}>
                  {teachers.filter(t => {
                    const r = (t.role || "").toLowerCase();
                    return !r.includes("kepala sekolah") &&
                           !r.includes("tata usaha") &&
                           !r.includes("koordinator tu") &&
                           !r.includes("komite") &&
                           !r.includes("bendahara");
                  }).map((guru) => (
                    <div 
                      key={guru.id} 
                      style={{ 
                        backgroundColor: 'white', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '12px 10px', 
                        width: '180px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        textAlign: 'center', 
                        boxShadow: 'var(--shadow-sm)',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        marginBottom: '8px', 
                        border: '2px solid var(--primary-light)',
                        backgroundColor: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={guru.image || '/images/teacher_1.png'} 
                          alt={guru.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.2, minHeight: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {guru.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                        {guru.role}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#e53e3e' }}>Tidak Ada</div>
                  <div style={{ fontSize: '0.8rem', color: '#c53030' }}>Guru & Pendidik</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Data Pendidik & Staf */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Daftar Staf</span>
            <h2>Pendidik & Tenaga Kependidikan</h2>
          </div>

          <div className="teachers-grid">
            {nonKomiteTeachers.length > 0 ? (
              nonKomiteTeachers.map((teacher) => {
                const isPNS = teacher.status === 'PNS';
                const isPPPK = teacher.status === 'PPPK';
                const isKomite = teacher.status === 'Komite Sekolah';
                const statusStyle = isPNS 
                  ? { color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }
                  : isPPPK
                  ? { backgroundColor: '#E8FAF0', color: '#20BA5A', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }
                  : isKomite
                  ? { backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }
                  : { backgroundColor: '#FFF8E6', color: '#D48408', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 };

                return (
                  <div key={teacher.id} className="teacher-card">
                    <div className="teacher-img-container">
                      <img 
                        src={teacher.image} 
                        alt={`Foto ${teacher.name}`} 
                        className="teacher-img" 
                      />
                    </div>
                    <div className="teacher-info">
                      <div className="teacher-role">{teacher.role}</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{teacher.name}</h3>
                      {teacher.details && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 0 }}>{teacher.details}</p>
                      )}
                      <span className={`teacher-status ${isPNS ? 'badge-primary' : ''}`} style={statusStyle}>
                        {teacher.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Belum ada data pendidik dan staf.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
