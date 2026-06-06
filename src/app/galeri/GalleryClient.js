'use client';

import { useState, useEffect } from 'react';

export default function GalleryClient({ initialGallery }) {
  const [activeItem, setActiveImage] = useState(null);
  const [selectedType, setSelectedType] = useState('Semua');

  const types = ['Semua', 'image', 'video'];

  // Filter gallery items by type
  const filteredGallery = initialGallery.filter((item) => {
    return selectedType === 'Semua' || item.type === selectedType;
  });

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeItem]);

  // Escape key support to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)' }}>
      {/* Type Selector Tabs */}
      <div 
        className="card-custom" 
        style={{ 
          padding: '12px var(--space-md)', 
          marginBottom: 'var(--space-lg)', 
          display: 'flex', 
          justifyContent: 'between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Saring Media:</span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
                backgroundColor: selectedType === type ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)',
                color: selectedType === type ? 'white' : 'var(--text-color)'
              }}
            >
              {type === 'image' ? 'Foto' : type === 'video' ? 'Video' : 'Semua'}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style Grid */}
      {filteredGallery.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--space-md)' 
          }}
        >
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '4px solid white',
                position: 'relative',
                cursor: 'pointer',
                aspectRatio: '4/3',
                background: '#000'
              }}
              className="gallery-grid-item"
            >
              {/* Media Thumbnail */}
              {item.type === 'video' ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={item.thumbnail || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }}
                    loading="lazy"
                  />
                  {/* Play Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '0', left: '0', right: '0', bottom: '0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'transform 0.2s ease'
                    }}
                    className="play-btn-circle"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-color)" stroke="var(--primary-color)" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  loading="lazy"
                  className="gallery-thumbnail-img"
                />
              )}

              {/* Title Slide up Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '0', left: '0', right: '0',
                  padding: '12px var(--space-md)',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  color: 'white',
                  transition: 'opacity 0.3s ease'
                }}
                className="gallery-title-overlay"
              >
                <p style={{ margin: '0', fontWeight: '600', fontSize: '0.9rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{item.title}</p>
                <p style={{ margin: '0', fontSize: '0.75rem', color: '#ddd' }}>
                  {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-custom" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Galeri media masih kosong</p>
          <p style={{ fontSize: '0.9rem' }}>Media kegiatan sekolah akan segera ditambahkan oleh admin.</p>
        </div>
      )}

      {/* Lightbox Overlay */}
      {activeItem && (
        <div
          className="lightbox active"
          id="gallery-lightbox"
          onClick={(e) => {
            if (e.target.id === 'gallery-lightbox') setActiveImage(null);
          }}
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-md)'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveImage(null)}
            style={{
              position: 'absolute',
              top: '20px', right: '20px',
              border: 'none', background: 'none',
              color: 'white', fontSize: '2.5rem',
              cursor: 'pointer', outline: 'none'
            }}
          >
            &times;
          </button>

          {/* Media Content */}
          <div style={{ maxWidth: '90%', maxHeight: '80%', display: 'flex', justifyContent: 'center' }}>
            {activeItem.type === 'video' ? (
              activeItem.url.includes('youtube.com') || activeItem.url.includes('youtu.be') ? (
                <iframe
                  width="720"
                  height="405"
                  src={activeItem.url.replace('watch?v=', 'embed/')}
                  title={activeItem.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 'var(--radius-md)', border: '1px solid #333', maxWidth: '100%', aspectRatio: '16/9' }}
                ></iframe>
              ) : (
                <video
                  src={activeItem.url}
                  controls
                  autoPlay
                  style={{ borderRadius: 'var(--radius-md)', maxWidth: '100%', maxHeight: '80vh', border: '1px solid #333' }}
                />
              )
            ) : (
              <img
                src={activeItem.url}
                alt={activeItem.title}
                style={{
                  maxHeight: '75vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              />
            )}
          </div>

          {/* Caption */}
          <div style={{ color: 'white', textAlign: 'center', marginTop: 'var(--space-sm)' }}>
            <h3 style={{ margin: '0', fontSize: '1.2rem' }}>{activeItem.title}</h3>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#ccc' }}>
              {activeItem.date ? new Date(activeItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
