'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function Header() {
  const { getPageTitle, toast, activeThreats, setActiveTab } = useAdminDashboard();

  return (
    <>
      <header className="top-navbar">
        <div className="top-title">
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
        <div className="suspicious-threat-banner">
          <div className="threat-banner-content">
            <span className="threat-icon">⚠️</span>
            <div>
              <h4>Peringatan Keamanan Sistem</h4>
              <p>Terdeteksi {activeThreats.length} alamat IP mencurigakan dengan kegagalan login beruntun yang berpotensi membahayakan sistem!</p>
            </div>
          </div>
          <button className="btn-threat-resolve" onClick={() => setActiveTab('security')}>
            Periksa & Selesaikan Ancaman
          </button>
        </div>
      )}
    </>
  );
}
