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
        <div className="user-info">
          <div className="user-avatar">A</div>
          <span>Administrator</span>
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
