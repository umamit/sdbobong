'use client';

export default function PrestasiCard({ item }) {
  const isFirst = item.rank === '1st' || item.rank?.toLowerCase().includes('1');
  const isSecond = item.rank === '2nd' || item.rank?.toLowerCase().includes('2');
  
  const ribbonBg = isFirst ? '#f59e0b' : isSecond ? '#94a3b8' : '#12a5b8';
  const badgeBg = isFirst ? '#fef3c7' : isSecond ? '#f1f5f9' : '#e0f2fe';
  const badgeColor = isFirst ? '#b45309' : isSecond ? '#475569' : '#0369a1';

  return (
    <div
      className="card prestasi-card"
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '24px 20px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden'
      }}
    >
      {/* Ribbon Rank */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '20px',
        background: ribbonBg,
        color: '#ffffff',
        fontSize: '0.75rem',
        fontWeight: 800,
        padding: '6px 12px 10px 12px',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        textTransform: 'uppercase'
      }}>
        {item.rank}
      </div>

      <div>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: badgeBg,
          color: badgeColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        </div>

        <span style={{
          display: 'inline-block',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#12a5b8',
          background: 'rgba(18, 165, 184, 0.1)',
          padding: '3px 10px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '8px'
        }}>
          {item.level}
        </span>

        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.4 }}>
          {item.title}
        </h3>

        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {item.desc}
        </p>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 500 }}>Tahun Capaian</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          {item.year}
        </span>
      </div>
    </div>
  );
}
