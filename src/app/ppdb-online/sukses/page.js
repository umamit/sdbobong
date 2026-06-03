'use client';

import Link from 'next/link';

export default function PPDBSukses() {
  return (
    <>
      <main className="container section-padding">
        <div className="success-container" style={{
          maxWidth: '600px',
          margin: 'var(--space-xl) auto',
          background: '#ffffff',
          padding: 'var(--space-lg) var(--space-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          borderTop: '5px solid #22C55E'
        }}>
          <div className="success-icon-wrapper">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2 className="success-title" style={{ color: '#22C55E', fontSize: '1.6rem', marginBottom: 'var(--space-xs)' }}>
            Pendaftaran Berhasil!
          </h2>
          <p className="success-message" style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: 'var(--space-md)' }}>
            Data Anda sudah tersimpan di sistem PPDB SDN Bobong. Silakan tunggu konfirmasi panitia melalui WhatsApp.
          </p>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/ppdb" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Kembali ke Portal PPDB
            </Link>
            <Link href="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .success-icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto var(--space-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: heartbeat 2s ease-in-out 1.2s infinite;
        }
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 4;
          stroke: #22C55E;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #22C55E;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 4;
          stroke-miterlimit: 10;
          stroke: #22C55E;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #ffffff;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 40px #22C55E;
          }
        }
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.08);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.08);
          }
          70% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
