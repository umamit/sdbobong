'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function Header({ onToggleSidebar }) {
  const { getPageTitle, toast, activeThreats, setActiveTab } = useAdminDashboard();

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
        <div className={`alert-toast alert-toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}

      {/* Suspicious login threat banner */}
      {activeThreats.length > 0 && (
        <div className="security-threat-banner">
          <div className="threat-banner-content">
            <div className="threat-icon-wrapper">
              <span className="threat-icon">⚠️</span>
            </div>
            <div className="threat-text">
              <h4 className="threat-title">Peringatan Keamanan Sistem</h4>
              <p className="threat-desc">Terdeteksi {activeThreats.length} alamat IP mencurigakan dengan kegagalan login beruntun yang berpotensi membahayakan sistem!</p>
            </div>
          </div>
          <button className="btn-threat-action" onClick={() => setActiveTab('security')}>
            Periksa & Selesaikan Ancaman
          </button>
        </div>
      )}
    </>
  );
}
