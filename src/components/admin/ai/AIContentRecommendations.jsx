'use client';

import { useState, useEffect } from 'react';

export default function AIContentRecommendations() {
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
      padding: '1rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(11,60,93,0.06) 100%)',
      border: '1px solid rgba(245,166,35,0.15)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
          Rekomendasi Konten AI
        </h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {recommendations.map((rec, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', marginTop: '2px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{rec.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{rec.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}