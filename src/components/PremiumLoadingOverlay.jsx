'use client';

export default function PremiumLoadingOverlay({ active, message = "Memproses...", subtext = "Mohon tunggu sebentar" }) {
  if (!active) return null;
  
  return (
    <div className={`premium-loading-overlay ${active ? 'active' : ''}`}>
      <div className="loading-visual-container">
        <div className="loading-orbit-outer"></div>
        <div className="loading-orbit-inner"></div>
        <div className="loading-logo-glow">
          <img src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }} />
          <span style={{ display: 'none' }}>SD</span>
        </div>
      </div>
      <div className="loading-card">
        <div className="loading-text">
          {message}<span className="loading-dots"></span>
        </div>
        {subtext && <div className="loading-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
