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
        <span style={{ fontSize: '1.1rem' }}>💡</span>
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
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{rec.icon || '📌'}</span>
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