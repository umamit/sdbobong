'use client';

export default function KbmTab({ initialJadwalKBM }) {
  return (
    <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
      <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        Rincian waktu belajar harian untuk masing-masing fase kelas di SD Negeri Bobong berjalan efektif.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: 'var(--space-md)' 
      }}>
        {(initialJadwalKBM && initialJadwalKBM.length > 0 ? initialJadwalKBM : []).map((kbm, idx) => (
          <div 
            key={kbm.id || idx}
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
                {kbm.kelas}
              </h3>
            </div>

            <div style={{ 
              backgroundColor: 'var(--bg-main)', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.875rem', 
              color: 'var(--text-color)', 
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              border: '1px solid var(--border-color)',
              fontWeight: 500
            }}>
              {kbm.hari}
            </div>

            {kbm.keterangan && (
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>{kbm.keterangan}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
