'use client';

export default function P5Tab({ initialP5Projects }) {
  return (
    <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
      <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
        **Projek Penguatan Profil Pelajar Pancasila (P5)** merupakan wadah pengenalan karakter berbasis kearifan lokal. Berikut panduan praktis bagi Ayah & Bunda untuk mendukung karakter anak di rumah!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {initialP5Projects && initialP5Projects.length > 0 ? (
          initialP5Projects.map((proj) => {
            const skillsArray = Array.isArray(proj.skills) 
              ? proj.skills 
              : (typeof proj.skills === 'string' ? proj.skills.split(',').map(s => s.trim()) : []);
            const parentGuideArray = Array.isArray(proj.parentGuide) 
              ? proj.parentGuide 
              : (typeof proj.parentGuide === 'string' ? proj.parentGuide.split('\n').map(p => p.trim()) : []);

            return (
              <div 
                key={proj.id}
                className="p5-grid-card"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Image panel */}
                <div style={{ position: 'relative', minHeight: '180px' }}>
                  <img 
                    src={proj.image} 
                    alt={proj.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: proj.color || '#1e40af',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {proj.badge}
                  </span>
                </div>

                {/* Content Panel */}
                <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.25rem', margin: 0 }}>
                    {proj.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, textAlign: 'justify' }}>
                    {proj.desc}
                  </p>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '2px 0' }}>
                    {skillsArray.filter(s => s && s.trim()).map((skill, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F3F4F6', color: '#4b5563' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Parent Guide Accordion/Box */}
                  <div style={{ 
                    backgroundColor: 'var(--accent-bg)', 
                    border: '1px solid var(--border-color)', 
                    padding: '12px var(--space-md)', 
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px'
                  }}>
                    <h4 style={{ color: 'var(--primary-dark)', fontSize: '0.9rem', margin: '0 0 6px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Tips Dukungan Orang Tua di Rumah:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {parentGuideArray.filter(t => t && t.trim()).map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-xl) var(--space-md)',
            backgroundColor: 'white',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px', color: '#94a3b8' }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: '0 0 5px 0' }}>Belum Ada Projek P5</h3>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Projek Penguatan Profil Pelajar Pancasila belum ditambahkan. Admin dapat mempublikasikannya melalui Dashboard Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
