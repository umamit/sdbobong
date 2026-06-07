'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
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

      // Refresh and redirect to dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-body" style={{
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, #061e30 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)',
      margin: 0,
      fontFamily: 'var(--font-body)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999
    }}>
      <div className="login-card" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '420px',
        padding: 'var(--space-lg) var(--space-md)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <img src="/images/logo_sekolah.png" alt="Logo SDN Bobong" className="login-logo" style={{
          width: '70px',
          height: '70px',
          marginBottom: 'var(--space-xs)'
        }} />
        <div className="login-header">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
            Panel Admin SDN Bobong
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            Silakan login untuk mengelola isi website
          </p>
        </div>

        {errorMsg && (
          <div className="alert" style={{
            backgroundColor: '#FDF2F2',
            color: '#9B1C1C',
            border: '1px solid #FBD5D5',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: 'var(--space-sm)',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes login-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .btn-login {
            width: 100%;
            padding: 0.95rem;
            background: linear-gradient(135deg, var(--primary) 0%, #3730a3 100%);
            color: white;
            font-weight: 700;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 1rem;
            margin-top: var(--space-xs);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            position: relative;
            overflow: hidden;
          }
          .btn-login::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
            pointer-events: none;
          }
          .btn-login:hover:not(:disabled)::before {
            left: 100%;
            transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .btn-login:hover:not(:disabled) {
            transform: translateY(-3px) scale(1.02);
            background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
          }
          .btn-login:active:not(:disabled) {
            transform: translateY(1px) scale(0.96);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
            transition: all 0.05s ease; /* Ultra fast transition on click for highly responsive click feedback */
          }
          .btn-login:focus-visible {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5), 0 4px 12px rgba(79, 70, 229, 0.25);
          }
          .btn-login:disabled {
            background: #cbd5e1 !important;
            color: #94a3b8 !important;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          .form-control {
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .form-control:hover {
            border-color: #94a3b8 !important;
          }
          .form-control:focus {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
            outline: none;
          }
          .back-link {
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            display: inline-block;
          }
          .back-link:hover {
            color: #6366f1 !important;
            transform: translateX(-4px);
          }
        `}} />

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: 'var(--space-sm)' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Masukkan email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.75rem var(--space-xs)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          
          <div className="form-group" style={{ textAlign: 'left', marginBottom: 'var(--space-sm)' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.75rem var(--space-xs)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', animation: 'login-spin 1s linear infinite' }}>
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

        <a href="/" className="back-link" style={{
          display: 'inline-block',
          marginTop: 'var(--space-md)',
          fontSize: '0.85rem',
          color: 'var(--primary)',
          textDecoration: 'none'
        }}>
          ← Kembali ke Website Utama
        </a>
      </div>
    </div>
  );
}
