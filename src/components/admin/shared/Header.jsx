'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function Header({ onToggleSidebar }) {
  const { getPageTitle, toast } = useAdminDashboard();

  return (
    <>
      <header className="top-navbar">
        <div className="top-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="mobile-menu-toggle" 
            onClick={onToggleSidebar}
            aria-label="Toggle Menu"
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem',
              color: '#0f172a',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 id="page-title">{getPageTitle()}</h1>
        </div>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="https://presensi.sdnegeribobong.sch.id"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-presensi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              color: '#0284c7',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            title="Buka Portal Presensi Digital di Tab Baru"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 11"/></svg>
            <span>Presensi ↗</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-public"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              color: '#4f46e5',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            title="Buka Website Publik SD Negeri Bobong di Tab Baru"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Lihat Website</span>
          </a>
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', fontWeight: 700 }}>A</div>
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Administrator</span>
        </div>
      </header>

      {/* Toast notifications */}
      {toast && (
        <div className={`alert-toast alert-toast-${toast.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
