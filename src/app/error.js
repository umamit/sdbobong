'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('Captured by layout error boundary:', error);
  }, [error]);

  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sistem Terganggu - SD Negeri Bobong</title>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --error-glow: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0,0,0,0) 75%);
            --secondary-glow: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 75%);
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            position: relative;
          }
          /* Aurora animated backgrounds */
          .aurora-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
          }
          .glow-1 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: var(--error-glow);
            top: -10%;
            left: -10%;
            border-radius: 50%;
            animation: float-slow 22s infinite alternate;
          }
          .glow-2 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: var(--secondary-glow);
            bottom: -10%;
            right: -10%;
            border-radius: 50%;
            animation: float-slow 28s infinite alternate-reverse;
          }
          @keyframes float-slow {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, 40px) scale(1.05); }
            100% { transform: translate(-30px, -40px) scale(0.95); }
          }
          /* Grid Pattern Overlay */
          .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 24px 24px;
            z-index: 2;
            pointer-events: none;
          }
          /* Card Container */
          .error-card {
            position: relative;
            z-index: 10;
            width: 90%;
            max-width: 580px;
            padding: 3rem 2.5rem;
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(239, 68, 68, 0.15);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 
                        0 0 40px rgba(239, 68, 68, 0.05),
                        inset 0 0 1px rgba(255, 255, 255, 0.1);
            text-align: center;
            animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes scale-up {
            0% { opacity: 0; transform: scale(0.96) translateY(8px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .logo-sec {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-bottom: 2rem;
          }
          .logo-img {
            width: 44px;
            height: 44px;
            object-fit: contain;
          }
          .logo-text {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 2px;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .icon-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 1.5rem;
          }
          .warning-icon {
            width: 72px;
            height: 72px;
            color: #ef4444;
            filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.4));
            animation: pulse-slow 2s infinite alternate;
          }
          @keyframes pulse-slow {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.3)); }
            100% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.5)); }
          }
          h1 {
            font-size: 1.8rem;
            margin: 0 0 0.75rem 0;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 30%, #fca5a5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p.description {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 2rem 0;
          }
          .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 1.5rem;
          }
          @media (min-width: 480px) {
            .btn-group {
              flex-direction: row;
              justify-content: center;
            }
          }
          .btn {
            padding: 0.8rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
          }
          .btn-primary {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
            background: linear-gradient(135deg, #f87171 0%, #991b1b 100%);
          }
          .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .btn-secondary:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
          }
          .details-accordion {
            text-align: left;
            margin-top: 1.5rem;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            overflow: hidden;
          }
          .details-summary {
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
            color: #64748b;
            cursor: pointer;
            user-select: none;
            transition: background 0.2s, color 0.2s;
            font-weight: 600;
          }
          .details-summary:hover {
            background: rgba(255, 255, 255, 0.02);
            color: #94a3b8;
          }
          .details-content {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.75rem;
            color: #f87171;
            overflow-x: auto;
            max-height: 150px;
            white-space: pre-wrap;
          }
          .info-footer {
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 2rem;
          }
          .info-footer a {
            color: #ef4444;
            text-decoration: none;
          }
          .info-footer a:hover {
            text-decoration: underline;
          }
        `}} />
      </head>
      <body>
        <div className="aurora-bg">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
        </div>
        <div className="grid-overlay"></div>

        <div className="error-card">
          <div className="logo-sec">
            <img src="/images/logo_sekolah.png" alt="Logo" width="60" height="60" className="logo-img" />
            <span className="logo-text">SD NEGERI BOBONG</span>
          </div>

          <div className="icon-wrapper">
            <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1>Koneksi Sistem Terganggu</h1>
          <p className="description">
            Sistem mendeteksi adanya kendala teknis atau kegagalan koneksi data saat memuat halaman ini. Jangan khawatir, silakan klik tombol di bawah untuk memuat ulang halaman secara aman.
          </p>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => reset()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle' }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Coba Lagi
            </button>
            <a href="/" className="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Beranda
            </a>
          </div>

          {error && (
            <details className="details-accordion">
              <summary className="details-summary">Detail Kesalahan (Teknis)</summary>
              <div className="details-content">
                {error.message || String(error)}
                {error.stack && `\n\nStack Trace:\n${error.stack}`}
              </div>
            </details>
          )}

          <div className="info-footer">
            Kembali ke <a href="/admin/login">Dashboard Admin</a>
          </div>
        </div>
      </body>
    </html>
  );
}
