'use client';

import { useState } from 'react';

export default function NewsCard({ news }) {
  const images = news.images && news.images.length > 0 ? news.images : [news.image || '/images/news_hari_guru.svg'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(idx);
  };

  // Safe heuristic for content length check
  const plainText = news.content ? news.content.replace(/<[^>]*>/g, '') : '';
  const isLong = plainText.length > 300;

  return (
    <article className="news-card card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Slider Visual Container */}
      <div className="card-img-container">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {images.map((imgUrl, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === activeIndex ? 1 : 0,
                transform: `scale(${index === activeIndex ? 1 : 1.05})`,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: index === activeIndex ? 2 : 1,
              }}
            >
              <img
                src={imgUrl}
                alt={`${news.title} - ${index + 1}`}
                className="card-img-slider"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrow Controls for Multiple Photos */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="slider-arrow prev"
              aria-label="Previous image"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="slider-arrow next"
              aria-label="Next image"
              type="button"
            >
              ›
            </button>

            {/* Premium Dots Indicators */}
            <div className="slider-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>

            {/* Glassmorphic Photo Counter Badge */}
            <div className="slider-counter">
              📸 {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Card Content Body */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="card-meta">
            <span>📅 {news.date}</span>
            <span>•</span>
            <span>🏷️ {news.category}</span>
          </div>
          <h3 className="card-title" style={{ fontSize: '1.3rem' }}>{news.title}</h3>
          
          <div 
            style={{ 
              position: 'relative', 
              maxHeight: isLong && !isExpanded ? '150px' : 'none', 
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div
              className="card-text rich-text-content"
              dangerouslySetInnerHTML={{ __html: news.content }}
              style={{
                fontSize: '0.95rem',
                lineHeight: '1.65',
                color: 'var(--text-muted)',
                marginTop: 'var(--space-xs)'
              }}
            />
            {isLong && !isExpanded && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--bg-card, #ffffff))',
                pointerEvents: 'none'
              }} />
            )}
          </div>

          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                color: 'var(--primary, #3b82f6)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: '20px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                marginTop: '12px',
                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.05)';
              }}
            >
              {isExpanded ? (
                <>
                  Tutup Bacaan <span style={{ transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
                </>
              ) : (
                <>
                  Baca Selengkapnya <span style={{ transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
