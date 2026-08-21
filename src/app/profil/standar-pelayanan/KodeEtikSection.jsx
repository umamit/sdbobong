const KODE_ETIK = [
  { label: 'INTEGRITAS', items: ['Jujur, transparan, dan dapat dipercaya', 'Tidak melakukan perbuatan tercela'] },
  { label: 'PROFESIONALITAS', items: ['Melaksanakan tugas dengan disiplin dan tepat waktu', 'Meningkatkan kompetensi sesuai jabatan'] },
  { label: 'AKUNTABILITAS', items: ['Bertindak sesuai aturan hukum', 'Bertanggung jawab atas setiap keputusan'] },
  { label: 'NETRALITAS', items: ['Tidak memihak kepentingan politik', 'Menjunjung tinggi keadilan'] },
  { label: 'PELAYANAN PUBLIK', items: ['Pelayanan cepat, tepat, ramah', 'Kepuasan masyarakat prioritas utama'] },
  { label: 'KEBERSAMAAN', items: ['Menjaga hubungan kerja sama baik', 'Loyal kepada Pancasila dan NKRI'] },
];

const ACCENT_COLORS = [
  'var(--primary)', 'var(--secondary)', 'var(--accent)',
  'var(--primary-dark)', 'var(--primary)', 'var(--accent)',
];

export default function KodeEtikSection() {
  return (
    <section style={{ marginTop: 'var(--space-xl)' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
          Kode Etik Pegawai
        </h2>
      </div>
      <p style={{ margin: '0 0 var(--space-md) 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Nilai dan norma perilaku yang wajib dipegang teguh oleh seluruh pegawai SD Negeri Bobong dalam menjalankan tugas dan tanggung jawabnya.
      </p>

      {/* Grid Kode Etik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {KODE_ETIK.map((item, idx) => (
          <div key={item.label} style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'var(--space-md)',
            borderLeft: `4px solid ${ACCENT_COLORS[idx]}`,
          }}>
            <span style={{
              display: 'inline-block', fontSize: '0.725rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: ACCENT_COLORS[idx], marginBottom: '8px',
            }}>
              {item.label}
            </span>
            <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {item.items.map((point) => (
                <li key={point} style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Penanggung Jawab */}
      <div style={{
        marginTop: 'var(--space-md)', backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)', padding: 'var(--space-md)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Penanggung Jawab</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>Husnita Usman, S.Pd., M.Pd.</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIP. 19961027 201903 2 006</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Pemerintah Kabupaten Pulau Taliabu</span>
          <span style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 600 }}>sdnegeribobong.sch.id</span>
        </div>
      </div>
    </section>
  );
}
