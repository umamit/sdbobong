import Link from 'next/link';

export const metadata = {
  title: '404 — Halaman Tidak Ditemukan | SD Negeri Bobong',
  description: 'Halaman yang Anda cari tidak tersedia. Kembali ke beranda SD Negeri Bobong.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <style>{`
        .nf-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f3f9fa 0%, #e8f6f8 50%, #fff8e7 100%);
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
        }

        @keyframes nf-float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }

        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nf-illustration {
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, #12A5B8, #0A7E8D);
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 20px 60px rgba(18, 165, 184, 0.25);
          animation: nf-float 4s ease-in-out infinite;
          position: relative;
        }

        .nf-illustration::after {
          content: '🔍';
          font-size: 5rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .nf-badge {
          display: inline-block;
          background: rgba(18, 165, 184, 0.1);
          color: #0A7E8D;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          border: 1px solid rgba(18, 165, 184, 0.2);
          margin-bottom: 1rem;
          animation: nf-fade-up 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-code {
          font-size: clamp(5rem, 15vw, 9rem);
          font-weight: 900;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #12A5B8 0%, #E5A900 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.5rem;
          animation: nf-fade-up 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-title {
          font-size: clamp(1.3rem, 3vw, 1.75rem);
          font-weight: 700;
          color: #122438;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          animation: nf-fade-up 0.5s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-desc {
          font-size: 0.95rem;
          color: #4A5B6D;
          line-height: 1.65;
          max-width: 420px;
          margin: 0 auto 2rem;
          animation: nf-fade-up 0.5s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: nf-fade-up 0.5s 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #12A5B8;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 14px rgba(18, 165, 184, 0.3);
        }
        .nf-btn-primary:hover {
          background: #0A7E8D;
          transform: scale(1.04) translateY(-1px);
          box-shadow: 0 8px 20px rgba(18, 165, 184, 0.4);
        }
        .nf-btn-primary:active { transform: scale(0.97); }

        .nf-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #12A5B8;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          border: 1.5px solid rgba(18, 165, 184, 0.35);
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .nf-btn-outline:hover {
          background: rgba(18, 165, 184, 0.06);
          border-color: #12A5B8;
          transform: scale(1.03);
        }
        .nf-btn-outline:active { transform: scale(0.97); }

        .nf-divider {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #12A5B8, #E5A900);
          border-radius: 9999px;
          margin: 2rem auto;
          animation: nf-fade-up 0.5s 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-school-name {
          font-size: 0.82rem;
          color: #7E8F9F;
          animation: nf-fade-up 0.5s 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .nf-school-name strong {
          color: #12A5B8;
        }
      `}</style>

      <div className="nf-root">
        <div className="nf-illustration" aria-hidden="true" />
        <div className="nf-badge">SD Negeri Bobong</div>
        <div className="nf-code" aria-label="Error 404">404</div>
        <h1 className="nf-title">Halaman Tidak Ditemukan</h1>
        <p className="nf-desc">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Silakan kembali ke beranda atau coba halaman lain.
        </p>
        <div className="nf-actions">
          <Link href="/" className="nf-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Kembali ke Beranda
          </Link>
          <Link href="/profil" className="nf-btn-outline">
            Profil Sekolah
          </Link>
        </div>
        <div className="nf-divider" aria-hidden="true" />
        <p className="nf-school-name">
          <strong>SD Negeri Bobong</strong> — Kabupaten Pulau Taliabu, Maluku Utara
        </p>
      </div>
    </>
  );
}
