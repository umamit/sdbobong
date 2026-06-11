'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuruLogin() {
  const router = useRouter();
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
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

      // Store session expiration time (4 hours from now)
      const sessionExpiryTime = Date.now() + 4 * 60 * 60 * 1000;
      localStorage.setItem('teacher_session_expiry', String(sessionExpiryTime));
      localStorage.setItem('teacher_info', JSON.stringify(resData.teacher));

      // Refresh and redirect to teacher dashboard
      router.push('/guru/dashboard');
      router.refresh();
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

      <div className="login-card">
        <img 
          src="/images/logo_sekolah.png" 
          alt="Logo SDN Bobong" 
          className="login-logo" 
        />
        <div className="login-header">
          <h2>Panel Guru SDN Bobong</h2>
          <p>Silakan login untuk menginput hasil belajar / nilai rapor siswa</p>
        </div>

        {errorMsg && (
          <div className="login-error-alert" role="alert" aria-live="polite">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>
          
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="login-form-control"
                placeholder="Masukkan password (default: NIP)"
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
                  /* Eye Slash Icon */
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  /* Eye Icon */
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
              <span>Masuk Ke Panel Guru</span>
            )}
          </button>
        </form>

        <div className="login-links-container">
          <a href="/" className="login-back-link" style={{ marginTop: 0 }}>
            ← Ke Website Utama
          </a>
          <a href="/admin/login" className="login-switch-link">
            Masuk sebagai Admin →
          </a>
        </div>
      </div>
    </div>
  );
}
