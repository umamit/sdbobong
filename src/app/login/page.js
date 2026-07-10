'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../../../public/css/admin.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab state: 'guru' or 'admin'
  const [activeTab, setActiveTab] = useState('guru');
  
  // Form states
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab from URL query parameter ?tab=admin or ?tab=guru
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'admin') {
      setActiveTab('admin');
    } else if (tabParam === 'guru') {
      setActiveTab('guru');
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setPassword('');
    // Update URL query parameter silently without full reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'guru') {
        // Teacher authentication
        const response = await fetch('/api/auth/guru', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nip, password })
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || "NIP atau password salah!");
        }

        // Store teacher session (4 hours)
        const sessionExpiryTime = Date.now() + 4 * 60 * 60 * 1000;
        localStorage.setItem('teacher_session_expiry', String(sessionExpiryTime));
        localStorage.setItem('teacher_info', JSON.stringify(resData.teacher));

        // Redirect to teacher dashboard
        window.location.href = '/guru/dashboard';
      } else {
        // Admin authentication
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || "Email atau password salah!");
        }

        // Store admin session (1 hour)
        const sessionExpiryTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('admin_session_expiry', String(sessionExpiryTime));

        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-body">
      {/* Ambient Aurora Orbs */}
      <div className="login-orb-1"></div>
      <div className="login-orb-2"></div>
      <div className="login-orb-3"></div>

      {/* Grid Pattern Overlay */}
      <div className="login-grid-overlay"></div>

      <div className="login-card" style={{ maxWidth: '420px', width: '100%' }}>
        <img 
          src="/images/logo_sekolah.png" 
          alt="Logo SDN Bobong" 
          className="login-logo" 
        />
        
        <div className="login-header">
          <h2>Portal Login Internal</h2>
          <p>SD Negeri Bobong, Pulau Taliabu</p>
        </div>

        {/* Apple Segmented Control Tab buttons */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '9999px',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => handleTabChange('guru')}
            style={{
              flex: 1,
              border: 'none',
              background: activeTab === 'guru' ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--accent) 100%)' : 'transparent',
              color: activeTab === 'guru' ? 'white' : '#9CA3AF',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'guru' ? '0 2px 10px rgba(18, 165, 184, 0.25)' : 'none'
            }}
          >
            <span>👨‍🏫</span> Portal Guru
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            style={{
              flex: 1,
              border: 'none',
              background: activeTab === 'admin' ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--accent) 100%)' : 'transparent',
              color: activeTab === 'admin' ? 'white' : '#9CA3AF',
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'admin' ? '0 2px 10px rgba(18, 165, 184, 0.25)' : 'none'
            }}
          >
            <span>🔑</span> Administrator
          </button>
        </div>

        {errorMsg && (
          <div className="login-error-alert" role="alert" aria-live="polite">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === 'guru' ? (
            /* Teacher Login Inputs */
            <div className="login-form-group">
              <label htmlFor="nip">Nomor Induk Pegawai (NIP)</label>
              <input
                type="text"
                id="nip"
                className="login-form-control"
                placeholder="Masukkan NIP Anda"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                key="nip-input"
              />
            </div>
          ) : (
            /* Admin Login Inputs */
            <div className="login-form-group">
              <label htmlFor="email">Alamat Email</label>
              <input
                type="email"
                id="email"
                className="login-form-control"
                placeholder="Masukkan email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                key="email-input"
              />
            </div>
          )}
          
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="login-form-control"
                placeholder={activeTab === 'guru' ? "Masukkan password (default: NIP)" : "Masukkan password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn-submit"
            disabled={isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="login-btn-spin" style={{ width: '18px', height: '18px' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        <div className="login-links-container" style={{ justifyContent: 'center' }}>
          <a href="/" className="login-back-link" style={{ marginTop: 0 }}>
            ← Ke Website Utama
          </a>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedLogin() {
  return (
    <Suspense fallback={
      <div className="login-page-body">
        <div className="login-grid-overlay"></div>
        <div className="login-card" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="login-header">
            <h2>Memuat Halaman...</h2>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
