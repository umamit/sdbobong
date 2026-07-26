'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';
import BerandaSubTab from './pages/BerandaSubTab';
import ProfilSubTab from './pages/ProfilSubTab';
import AkademikSubTab from './pages/AkademikSubTab';
import KesiswaanSubTab from './pages/KesiswaanSubTab';
import PpdbSubTab from './pages/PpdbSubTab';

export default function PagesTab() {
  const adminDashboardProps = useAdminDashboard();
  const {
    activePageSubTab,
    activeTab,
    submitPageContents
  } = adminDashboardProps;

  return (
    <section id="tab-pages" className={`tab-pane ${activeTab === 'pages' ? 'active' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        
        {/* Premium Sub-Tab Pill Navigation */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: 'var(--space-xs)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          marginBottom: 'var(--space-xs)'
        }}>
          {[
            { id: 'beranda', label: 'Beranda' },
            { id: 'profil', label: 'Profil Sekolah' },
            { id: 'akademik', label: 'Akademik' },
            { id: 'kesiswaan', label: 'Kesiswaan & Ekskul' },
            { id: 'ppdb', label: 'PPDB Portal' }
          ].map(subTab => (
            <button
              key={subTab.id}
              type="button"
              onClick={() => adminDashboardProps.setActivePageSubTab(subTab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: activePageSubTab === subTab.id ? 700 : 500,
                backgroundColor: activePageSubTab === subTab.id ? 'var(--primary)' : 'transparent',
                color: activePageSubTab === subTab.id ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderBottom: activePageSubTab === subTab.id ? '3px solid var(--primary-dark)' : '3px solid transparent',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {/* Sub-tab description header */}
        <div style={{ padding: '0 0.5rem', marginBottom: 'var(--space-xs)' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mengedit konten dinamis (teks dan gambar) untuk halaman <strong>{activePageSubTab.toUpperCase()}</strong>. Tekan tombol Simpan di bagian bawah setelah melakukan perubahan.
          </p>
        </div>

        {activePageSubTab === 'beranda' && <BerandaSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'profil' && <ProfilSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'akademik' && <AkademikSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'kesiswaan' && <KesiswaanSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'ppdb' && <PpdbSubTab {...adminDashboardProps} />}

        {/* Premium Sticky Save Footer Panel */}
        <div style={{
          marginTop: 'var(--space-lg)',
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          zIndex: 100,
          alignItems: 'center',
          gap: '15px',
          animation: 'slideUp 0.3s ease'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Klik simpan untuk menerapkan semua perubahan di tab <strong>{activePageSubTab.toUpperCase()}</strong> ini ke database.</span>
          </span>
          <button
            type="button"
            onClick={() => submitPageContents(activePageSubTab)}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px 0 rgba(30, 64, 175, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Konten Halaman ({activePageSubTab.toUpperCase()})
          </button>
        </div>

      </div>
    </section>
  );
}
