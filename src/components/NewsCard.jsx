'use client';

import { useState, useEffect } from 'react';

export default function NewsCard({ news, className = '' }) {
  const images = news.images && news.images.length > 0 ? news.images : [news.image || '/images/news_hari_guru.svg'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === `#news-${news.id}`) {
        setIsExpanded(true);
        setTimeout(() => {
          const el = document.getElementById(`news-${news.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.borderColor = 'var(--primary)';
            el.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.25)';
            setTimeout(() => {
              el.style.borderColor = '';
              el.style.boxShadow = '';
            }, 3000);
          }
        }, 400);
      }
    }
  }, [news.id]);

  // Drag and touch swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const minSwipeDistance = 50;

  const handlePrev = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(idx);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    if (images.length <= 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (images.length <= 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (images.length <= 1 || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e) => {
    if (images.length <= 1) return;
    setTouchStart(e.clientX);
    setTouchEnd(null);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        handleNext(e);
      } else if (isRightSwipe) {
        handlePrev(e);
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Trackpad horizontal swipe detection for MacBook
  const handleWheel = (e) => {
    if (images.length <= 1) return;
    
    // Check if the scroll is primarily horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const now = Date.now();
      // 800ms cooldown to make horizontal trackpad navigation extremely comfortable
      if (now - lastWheelTime > 800) {
        if (Math.abs(e.deltaX) > 15) {
          setLastWheelTime(now);
          if (e.deltaX > 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }
    }
  };

  // Safe heuristic for content length check
  const plainText = news.content ? news.content.replace(/<[^>]*>/g, '') : '';
  const isLong = plainText.length > 300;

  return (
    <article id={`news-${news.id}`} className={`news-card card ${className}`} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Slider Visual Container */}
      <div 
        className="card-img-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onDragStart={(e) => e.preventDefault()}
        style={{ 
          position: 'relative', 
          cursor: images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none'
        }}
      >
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
              style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}

        {/* Navigation Arrow Controls for Multiple Photos */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="slider-arrow prev"
              aria-label="Previous image"
              type="button"
              style={{ zIndex: 12 }}
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="slider-arrow next"
              aria-label="Next image"
              type="button"
              style={{ zIndex: 12 }}
            >
              ›
            </button>

            {/* Premium Dots Indicators */}
            <div className="slider-dots" style={{ zIndex: 12 }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                  style={{ zIndex: 12 }}
                />
              ))}
            </div>

            {/* Glassmorphic Photo Counter Badge */}
            <div className="slider-counter" style={{ zIndex: 12 }}>
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

        {/* Share buttons row */}
        <div style={{ 
          borderTop: '1px solid #f1f5f9', 
          paddingTop: '12px', 
          marginTop: '16px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>📢 Bagikan:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Baca berita terbaru dari SD Negeri Bobong: *"${news.title}"*\n\nSelengkapnya di: ${
                  typeof window !== 'undefined' ? `${window.location.origin}/berita#news-${news.id}` : `https://sdnegeribobong.sch.id/berita#news-${news.id}`
                }`
              )}`}
              target="_blank" 
              rel="noopener noreferrer"
              title="Bagikan ke WhatsApp"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
                e.currentTarget.style.color = '#25D366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.98c-.203-.1-.198-.189-.197-.287.002-.1-.06-.184-.18-.32C10.61 8.24 9.382 7.5 8.285 7.37c-.775-.093-1.122.223-1.354.496-.345.405-.73 1.157-.73 1.157s-.32.612-.904.385c-.584-.227-1.543-.767-2.127-1.285-.584-.518-.876-.902-.876-.902s-.167-.283.056-.497c.222-.214.494-.57.494-.57s.145-.23.073-.42c-.073-.19-.51-1.298-.69-1.74-.18-.44-.37-.363-.51-.363h-.44c-.15 0-.39.056-.6.286-.21.23-.8 7.8 0 8 .8.2 1.488-.13 1.83-.547.34-.417 1.343-2.095 1.343-2.095s.31-.416.79-.148c.48.268.96.48.96.48s.55.334.8.148c.25-.187.35-.453.35-.453s.198-.564.088-.853"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                typeof window !== 'undefined' ? `${window.location.origin}/berita#news-${news.id}` : `https://sdnegeribobong.sch.id/berita#news-${news.id}`
              )}`}
              target="_blank" 
              rel="noopener noreferrer"
              title="Bagikan ke Facebook"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(24, 119, 242, 0.1)',
                color: '#1877F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1877F2';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.1)';
                e.currentTarget.style.color = '#1877F2';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>

            {/* Copy Link */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/berita#news-${news.id}` : `https://sdnegeribobong.sch.id/berita#news-${news.id}`;
                navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              type="button"
              title="Salin Tautan Berita"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: copied ? '#10b981' : 'rgba(100, 116, 139, 0.1)',
                color: copied ? '#ffffff' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = '#64748B';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.1)';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-5.446z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
