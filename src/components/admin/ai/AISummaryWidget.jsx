'use client';

import React, { useState, useEffect } from 'react';

export default function AISummaryWidget() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchSummary() {
      try {
        const res = await fetch('/api/admin/ai-summary', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (mounted && data?.summary?.length > 0) {
          setSummary(data.summary);
          setError(false);
        }
      } catch (e) {
        if (e.name !== 'AbortError' && mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => { mounted = false; controller.abort(); };
  }, []);

  if (loading) {
    return (
      <div className="ai-summary-widget shimmer" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
        <div style={{ height: '20px', width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '0.75rem' }} />
        <div style={{ height: '16px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
      </div>
    );
  }

  if (error || summary.length === 0) return null;

  return (
    <div className="ai-summary-widget" style={{
      padding: '1rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, rgba(11,60,93,0.06) 0%, rgba(50,157,156,0.06) 100%)',
      border: '1px solid rgba(11,60,93,0.12)',
      marginBottom: '1.25rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem 1.5rem',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ fontSize: '1.1rem' }}>🤖</span> AI Insight
      </span>
      {summary.map((item, i) => (
        <span key={i} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          fontWeight: 500
        }}>
          <span>{item.icon || '💡'}</span>
          <span>{item.text}</span>
        </span>
      ))}
    </div>
  );
}