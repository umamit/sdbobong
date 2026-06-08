'use client';

import { useState } from 'react';

export default function NewsCard({ news }) {
  const images = news.images && news.images.length > 0 ? news.images : [news.image || '/images/news_hari_guru.svg'];
  const [activeIndex, setActiveIndex] = useState(0);

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
            className="card-text rich-text-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.65',
              color: 'var(--text-muted)',
              marginTop: 'var(--space-xs)'
            }}
          />
        </div>
      </div>
    </article>
  );
}
