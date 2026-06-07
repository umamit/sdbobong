'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PremiumLoadingOverlay from '../../../components/PremiumLoadingOverlay';

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
      background: '#090d16',
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
      zIndex: 99999,
      overflow: 'hidden'
    }}>
      {/* Aurora Floating Light Orbs */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0) 70%)',
        top: '10%',
        left: '5%',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float-orb-1 20s infinite ease-in-out'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, rgba(236, 72, 153, 0) 70%)',
        bottom: '8%',
        right: '5%',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float-orb-2 25s infinite ease-in-out'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0) 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'float-orb-3 22s infinite ease-in-out'
      }}></div>

      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        zIndex: 2,
        pointerEvents: 'none'
      }}></div>

      <div className="login-card" style={{
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        width: '100%',
        maxWidth: '430px',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 0 1px rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <img src="/images/logo_sekolah.png" alt="Logo SDN Bobong" className="login-logo" style={{
          width: '76px',
          height: '76px',
          marginBottom: 'var(--space-sm)',
          filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.4))'
        }} />
        <div className="login-header">
          <h2 style={{ 
            fontFamily: 'var(--font-heading)', 
            color: '#ffffff', 
            fontSize: '1.45rem', 
            marginBottom: '0.4rem',
            letterSpacing: '-0.5px',
            fontWeight: 800
          }}>
            Panel Admin SDN Bobong
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
            Silakan login untuk mengelola isi website
          </p>
        </div>

        {errorMsg && (
          <div className="alert" style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes login-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float-orb-1 {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, -50px) scale(1.15); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes float-orb-2 {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-60px, 40px) scale(0.85); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes float-orb-3 {
            0% { transform: translate(-50%, -50%) translate(0, 0); }
            50% { transform: translate(-50%, -50%) translate(30px, 30px); }
            100% { transform: translate(-50%, -50%) translate(0, 0); }
          }
          .btn-login {
            width: 100%;
            padding: 0.95rem;
            background: linear-gradient(135deg, #4f46e5 0%, #d946ef 100%);
            color: white;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 0.5rem;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.35);
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
            background: linear-gradient(135deg, #6366f1 0%, #e879f9 100%);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5);
          }
          .btn-login:active:not(:disabled) {
            transform: translateY(1px) scale(0.97);
            box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
            transition: all 0.05s ease;
          }
          .btn-login:focus-visible {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5), 0 4px 12px rgba(79, 70, 229, 0.25);
          }
          .btn-login:disabled {
            background: rgba(255, 255, 255, 0.1) !important;
            color: rgba(255, 255, 255, 0.3) !important;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          .form-control {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
          }
          .form-control:hover {
            border-color: rgba(255, 255, 255, 0.2) !important;
            background: rgba(255, 255, 255, 0.06) !important;
          }
          .form-control:focus {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
            background: rgba(255, 255, 255, 0.08) !important;
            outline: none;
          }
          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.3) !important;
          }
          .back-link {
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            display: inline-block;
          }
          .back-link:hover {
            color: #a78bfa !important;
            transform: translateX(-4px);
            text-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
          }
        `}} />

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.45rem' }}>
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
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.45rem' }}>
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
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                boxSizing: 'border-box'
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
          marginTop: '1.75rem',
          fontSize: '0.85rem',
          color: '#818cf8',
          textDecoration: 'none',
          fontWeight: 500
        }}>
          ← Kembali ke Website Utama
        </a>
      </div>
      <PremiumLoadingOverlay active={isSubmitting} message="Memproses keamanan sesi..." />
    </div>
  );
}
