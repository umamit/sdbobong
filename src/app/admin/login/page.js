'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
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
        body: JSON.stringify({ username, password })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Username atau password salah!");
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

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: 'var(--space-sm)' }}>
            <label htmlFor="username" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
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
            style={{
              width: '100%',
              padding: '0.8rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: 'var(--space-xs)',
              transition: 'var(--transition-fast)'
            }}
          >
            {isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <Link href="/" className="back-link" style={{
          display: 'inline-block',
          marginTop: 'var(--space-md)',
          fontSize: '0.85rem',
          color: 'var(--primary)',
          textDecoration: 'none'
        }}>
          ← Kembali ke Website Utama
        </Link>
      </div>
    </div>
  );
}
