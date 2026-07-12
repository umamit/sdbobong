'use client';

/** Kartu agenda kalender yang bisa diklik — menampilkan CTA agar pengguna smartphone tahu ada detail di dalamnya */
export default function CalendarEventCard({ row, isCurrent, countdown, onClick }) {
  const hasCountdown = countdown && !countdown.includes('Sedang');

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        border: isCurrent ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        boxShadow: isCurrent ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isCurrent ? 'var(--shadow-lg)' : 'var(--shadow-sm)';
      }}
    >
      {/* Badge bulan ini */}
      {isCurrent && (
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)',
          fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px',
          borderRadius: 'var(--radius-full)', textTransform: 'uppercase'
        }}>
          Bulan Ini
        </span>
      )}

      {/* Accent bar kiri */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        backgroundColor: isCurrent ? 'var(--secondary)' : 'var(--primary)',
        borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
      }} />

      {/* Judul bulan */}
      <span style={{
        fontFamily: 'var(--font-heading)', fontWeight: 800,
        fontSize: '1.2rem', color: 'var(--primary-dark)', paddingLeft: '4px'
      }}>
        {row.month}
      </span>

      {/* Deskripsi kegiatan */}
      <p style={{
        fontSize: '0.9rem', color: 'var(--text-main)', margin: 0,
        fontWeight: 500, lineHeight: 1.5, minHeight: '44px', paddingLeft: '4px'
      }}>
        {row.desc}
      </p>

      {/* Tanggal + hitung mundur */}
      <div style={{
        borderTop: '1px solid var(--border-color)', paddingTop: '8px',
        marginTop: 'auto', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '0.8rem'
      }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>📅 {row.dates}</span>
        {hasCountdown && (
          <span style={{
            color: 'var(--accent)', fontWeight: 700,
            backgroundColor: 'var(--accent-bg)', padding: '2px 6px', borderRadius: '4px'
          }}>
            ⏳ {countdown.split(' ')[0]} Hari Lagi
          </span>
        )}
      </div>

      {/* CTA chip — petunjuk bisa diklik */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        backgroundColor: 'var(--primary)', color: 'white',
        borderRadius: 'var(--radius-full)', padding: '7px 14px',
        fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.02em',
        marginTop: '4px', transition: 'background-color 0.2s'
      }}>
        Lihat Rundown &amp; Panduan
        <span style={{ fontSize: '1rem' }}>→</span>
      </div>
    </div>
  );
}
