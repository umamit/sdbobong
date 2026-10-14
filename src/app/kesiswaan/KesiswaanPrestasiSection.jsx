'use client';

import Link from 'next/link';
import { FramerRevealContainer, FramerRevealItem } from '../../components/FramerReveal';

export default function KesiswaanPrestasiSection({ prestasi }) {
  if (!prestasi || prestasi.length === 0) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Etalase Juara</span>
          <h2>Prestasi Siswa SD Negeri Bobong</h2>
        </div>

        <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto' }}>
          Kebanggaan sekolah atas dedikasi dan kerja keras para murid yang berhasil mengukir prestasi gemilang.
        </p>

        <FramerRevealContainer className="grid-3">
          {prestasi.map((pres, idx) => {
            const isFirst = pres.rank === '1st', isSecond = pres.rank === '2nd';
            const badgeBg = isFirst ? '#FFF8E6' : isSecond ? '#F3F4F6' : 'var(--accent-bg)';
            const badgeColor = isFirst ? 'var(--secondary-dark)' : isSecond ? 'var(--text-muted)' : 'var(--accent)';
            const ribbonBg = isFirst ? 'var(--secondary)' : isSecond ? '#94a3b8' : 'var(--accent)';
            return (
              <FramerRevealItem key={idx}>
                <div className="prestasi-card" style={{ border: '1px solid var(--border-color)', height: '100%' }}>
                  <div className="prestasi-ribbon" style={{ backgroundColor: ribbonBg }}>
                    <span>{pres.rank}</span>
                  </div>
                  <div className="prestasi-medal-bg" style={{ background: badgeBg, color: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/images/animated/trophy.png" alt="Prestasi" width={32} height={32} style={{ objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: 'var(--primary-dark)' }}>{pres.title}</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>{pres.level}</p>
                  <p className="text-justify" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 0 }}>{pres.desc}</p>
                </div>
              </FramerRevealItem>
            );
          })}
        </FramerRevealContainer>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
          <Link
            href="/prestasi"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              background: '#ffffff'
            }}
          >
            <span>Buka Seluruh Arsip Juara di Hall of Fame Prestasi</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
