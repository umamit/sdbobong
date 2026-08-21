'use client';

import { useState } from 'react';
import { formatTanggalPendek } from '../../lib/format';

const CATEGORIES = ['Semua', 'Akademik', 'Pramuka', 'Upacara', 'Sarana', 'Umum'];

function getYoutubeThumb(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?#]+)/,
    /youtube\.com\/shorts\/([^?#]+)/,
    /youtube\.com\/embed\/([^?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
  }
  return null;
}

export default function GalleryCarousel({ items = [], onItemClick }) {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = activeCategory === 'Semua'
    ? items
    : items.filter(i => (i.category || 'Umum').toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Category Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const count = cat === 'Semua' ? items.length
            : items.filter(i => (i.category || 'Umum').toLowerCase() === cat.toLowerCase()).length;
          if (cat !== 'Semua' && count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                flexShrink: 0, transition: 'all 0.2s ease',
                backgroundColor: activeCategory === cat ? 'var(--primary)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--text-main)',
              }}
            >
              {cat}{cat !== 'Semua' ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroll Carousel */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'flex', gap: '12px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          paddingBottom: '8px', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {filtered.map(item => {
            const ytThumb = item.type === 'video' ? getYoutubeThumb(item.url) : null;
            const thumbSrc = ytThumb || item.thumbnail || item.url;
            const isVideo = item.type === 'video';

            return (
              <div
                key={item.id}
                onClick={() => onItemClick(item)}
                style={{
                  flexShrink: 0, width: '72vw', maxWidth: '260px',
                  scrollSnapAlign: 'start', cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden', backgroundColor: 'white',
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '150px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <img
                    src={thumbSrc}
                    alt={item.title}
                    width="260" height="150"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.onerror = null; e.target.src = '/images/standar_pelayanan.png'; }}
                  />
                  {isVideo && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.22)' }}>
                      <div style={{ width: '40px', height: '34px', borderRadius: '10px', background: 'rgba(239,68,68,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                      </div>
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0,0,0,0.48)', color: 'white', backdropFilter: 'blur(4px)' }}>
                    {item.category || 'Umum'}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {formatTanggalPendek(item.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: 'var(--space-lg) 0' }}>
          Tidak ada media dalam kategori ini.
        </p>
      )}
    </div>
  );
}
