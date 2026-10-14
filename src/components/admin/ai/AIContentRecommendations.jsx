'use client';

import { useState, useEffect } from 'react';

export default function AIContentRecommendations({ onSelectRecommendation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchRecommendations() {
      try {
        const res = await fetch('/api/admin/ai-recommendations', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (mounted && data?.recommendations?.length > 0) {
          setRecommendations(data.recommendations);
          setError(false);
        }
      } catch (e) {
        if (e.name !== 'AbortError' && mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRecommendations();
    return () => { mounted = false; controller.abort(); };
  }, []);

  if (loading) {
    return (
      <div className="ai-recommendations-card" style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <div className="shimmer" style={{ height: '20px', width: '50%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '0.75rem' }} />
        <div className="shimmer" style={{ height: '14px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.5rem' }} />
        <div className="shimmer" style={{ height: '14px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
      </div>
    );
  }

  if (error || recommendations.length === 0) return null;

  return (
    <div className="ai-recommendations-card" style={{
      padding: '1.1rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, rgba(18, 165, 184, 0.08) 0%, rgba(14, 116, 144, 0.04) 100%)',
      border: '1px solid rgba(18, 165, 184, 0.25)',
      marginBottom: '1.25rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
            Rekomendasi Topik Berita AI
          </h4>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Klik rekomendasi untuk langsung membuat draf
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {recommendations.map((rec, i) => (
          <div
            key={i}
            onClick={() => onSelectRecommendation && onSelectRecommendation(`${rec.title}. ${rec.description}`)}
            role={onSelectRecommendation ? 'button' : undefined}
            tabIndex={onSelectRecommendation ? 0 : undefined}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              cursor: onSelectRecommendation ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => {
              if (onSelectRecommendation) {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(18, 165, 184, 0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (onSelectRecommendation) {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', marginTop: '2px', color: 'var(--primary)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>{rec.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>{rec.description}</div>
              </div>
            </div>
            {onSelectRecommendation && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', background: 'rgba(18, 165, 184, 0.08)', whiteSpace: 'nowrap', marginTop: '2px' }}>
                Pakai Topik Ini
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}