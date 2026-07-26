'use client';

import { useState, useEffect, useCallback } from 'react';

// Definisi 5 reaksi dengan SVG icon dan label (Rule 14 — tanpa emoji Unicode)
const REACTIONS = [
  {
    type: 'suka',
    label: 'Suka',
    color: '#ef4444',
    bgActive: 'rgba(239, 68, 68, 0.12)',
    borderActive: 'rgba(239, 68, 68, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    type: 'keren',
    label: 'Keren',
    color: '#f59e0b',
    bgActive: 'rgba(245, 158, 11, 0.12)',
    borderActive: 'rgba(245, 158, 11, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    type: 'haru',
    label: 'Haru',
    color: '#8b5cf6',
    bgActive: 'rgba(139, 92, 246, 0.12)',
    borderActive: 'rgba(139, 92, 246, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
        <path d="M9 9.5c0-.5-.5-1-1-1" />
        <path d="M15 9.5c0-.5.5-1 1-1" />
      </svg>
    ),
  },
  {
    type: 'semangat',
    label: 'Semangat',
    color: '#10b981',
    bgActive: 'rgba(16, 185, 129, 0.12)',
    borderActive: 'rgba(16, 185, 129, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    type: 'informatif',
    label: 'Informatif',
    color: '#3b82f6',
    bgActive: 'rgba(59, 130, 246, 0.12)',
    borderActive: 'rgba(59, 130, 246, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

export default function NewsReactions({ newsId }) {
  const storageKey = `reaction_${newsId}`;
  const [counts, setCounts] = useState({});
  const [picked, setPicked] = useState(null); // type string yang sudah dipilih user
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data reaksi dari API
  const fetchReactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/reactions?news_id=${newsId}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      (data.reactions || []).forEach((r) => { map[r.type] = r.count; });
      setCounts(map);
    } catch {
      // silent fail — reaksi bukan fitur kritis
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchReactions();
    // Cek reaksi yang sudah pernah dipilih dari localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPicked(saved);
    } catch { /* private browsing */ }
  }, [fetchReactions, storageKey]);

  const handleReact = async (type) => {
    if (submitting || picked) return; // sudah bereaksi atau sedang submit

    setSubmitting(true);
    // Optimistic update
    setPicked(type);
    setCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));

    try {
      localStorage.setItem(storageKey, type);
    } catch { /* private browsing */ }

    try {
      await fetch('/api/news/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news_id: newsId, type }),
      });
    } catch {
      // rollback optimistic update jika gagal
      setPicked(null);
      setCounts((prev) => ({ ...prev, [type]: Math.max(0, (prev[type] || 1) - 1) }));
      try { localStorage.removeItem(storageKey); } catch { /* */ }
    } finally {
      setSubmitting(false);
    }
  };

  const totalReactions = Object.values(counts).reduce((s, v) => s + v, 0);

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Label baris */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          {picked
            ? `Terima kasih atas reaksi Anda!`
            : 'Apa pendapat Anda tentang berita ini?'}
        </span>
        {totalReactions > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {totalReactions} reaksi
          </span>
        )}
      </div>

      {/* Tombol reaksi */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {REACTIONS.map((r) => {
          const isActive = picked === r.type;
          const count = counts[r.type] || 0;
          return (
            <button
              key={r.type}
              type="button"
              disabled={!!picked || submitting || loading}
              onClick={() => handleReact(r.type)}
              title={r.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '20px',
                border: isActive
                  ? `1.5px solid ${r.borderActive}`
                  : '1.5px solid var(--border-color)',
                background: isActive ? r.bgActive : 'transparent',
                color: isActive ? r.color : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                cursor: picked ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!picked && !loading) {
                  e.currentTarget.style.background = r.bgActive;
                  e.currentTarget.style.borderColor = r.borderActive;
                  e.currentTarget.style.color = r.color;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <span style={{ color: isActive ? r.color : 'var(--text-muted)', display: 'flex' }}>
                {r.icon}
              </span>
              <span>{r.label}</span>
              {count > 0 && (
                <span
                  style={{
                    background: isActive ? r.color : 'var(--border-color)',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
