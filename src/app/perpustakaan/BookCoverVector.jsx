'use client';

export default function BookCoverVector({ subject, title, kelas }) {
  const getTheme = (subj) => {
    switch (subj) {
      case 'Matematika':
        return { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', badge: '#818cf8', label: 'MATEMATIKA' };
      case 'IPAS':
        return { bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)', badge: '#34d399', label: 'IPAS SD' };
      case 'Bahasa Indonesia':
        return { bg: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)', badge: '#f472b6', label: 'B. INDONESIA' };
      case 'Agama Islam':
        return { bg: 'linear-gradient(135deg, #713f12 0%, #a16207 50%, #ca8a04 100%)', badge: '#facc15', label: 'PAI & BUDI PEKERTI' };
      case 'Bahasa Inggris':
        return { bg: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0369a1 100%)', badge: '#38bdf8', label: 'B. INGGRIS' };
      default:
        return { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', badge: '#94a3b8', label: 'LITERASI SISWA' };
    }
  };

  const theme = getTheme(subject);

  return (
    <div style={{
      width: '100%',
      aspectRatio: '3/4',
      background: theme.bg,
      borderRadius: '10px',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 20px -4px rgba(0,0,0,0.25)',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
          KURIKULUM MERDEKA
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: theme.badge }}>
          {kelas || 'SD'}
        </span>
      </div>

      <div style={{ my: 'auto', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.badge, letterSpacing: '0.05em', marginBottom: '4px' }}>
          {theme.label}
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
        <span style={{ fontSize: '0.62rem', color: '#e2e8f0', fontWeight: 600 }}>KEMENDIKBUD</span>
        <span style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>BUKU RESMI</span>
      </div>
    </div>
  );
}
