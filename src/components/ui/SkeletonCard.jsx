import React from 'react';

/**
 * Apple HIG — Skeleton Card Loading Component
 * Kartu placeholder beranimasi shimmer khas Apple App Store untuk loading state.
 * 
 * @param {string} [variant="card"] - "card" | "list" | "text" | "bento"
 * @param {number} [count=1] - Jumlah skeleton yang ditampilkan
 */
export default function SkeletonCard({ variant = "card", count = 1 }) {
  const items = Array.from({ length: count });

  if (variant === "bento") {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 18px)',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div className="apple-skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            <div className="apple-skeleton" style={{ width: '70%', height: '20px', borderRadius: '6px' }} />
            <div className="apple-skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
            <div className="apple-skeleton" style={{ width: '50%', height: '14px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 14px)',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div className="apple-skeleton" style={{ width: '56px', height: '56px', borderRadius: '10px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="apple-skeleton" style={{ width: '60%', height: '16px', borderRadius: '4px' }} />
              <div className="apple-skeleton" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
      {items.map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: 'var(--radius-lg, 14px)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.04))',
          }}
        >
          {/* Aspect ratio image header */}
          <div className="apple-skeleton" style={{ width: '100%', aspectRatio: '16/9' }} />
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="apple-skeleton" style={{ width: '35%', height: '12px', borderRadius: '4px' }} />
            <div className="apple-skeleton" style={{ width: '85%', height: '18px', borderRadius: '4px' }} />
            <div className="apple-skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
            <div className="apple-skeleton" style={{ width: '65%', height: '14px', borderRadius: '4px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
