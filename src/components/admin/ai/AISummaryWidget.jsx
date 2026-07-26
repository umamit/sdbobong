'use client';

import { useState, useEffect } from 'react';

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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
        AI Insight
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
          <span>{item.text}</span>
        </span>
      ))}
    </div>
  );
}