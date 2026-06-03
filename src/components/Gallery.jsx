'use client';

import { useState, useEffect } from 'react';

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    { src: '/images/gallery_1.svg', alt: 'Suasana Belajar di Ruang Kelas Baru' },
    { src: '/images/gallery_2.svg', alt: 'Upacara Bendera Hari Senin' },
    { src: '/images/gallery_3.svg', alt: 'Latihan Tari Tradisional Maluku Utara' },
    { src: '/images/gallery_4.svg', alt: 'Praktek Pembelajaran Olahraga di Lapangan' },
    { src: '/images/gallery_5.svg', alt: 'Kegiatan Membaca Buku di Perpustakaan' },
    { src: '/images/gallery_6.svg', alt: 'Pemberian Materi Kemah Pramuka' }
  ];

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(item)}
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '4px solid white',
              aspectRatio: '4/3',
              cursor: 'pointer'
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="gallery-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="lightbox active" 
          id="lightbox"
          onClick={(e) => {
            if (e.target.id === 'lightbox') setActiveImage(null);
          }}
        >
          <button 
            className="lightbox-close" 
            onClick={() => setActiveImage(null)}
            aria-label="Tutup Tampilan"
          >
            &times;
          </button>
          <img 
            className="lightbox-content" 
            src={activeImage.src} 
            alt={activeImage.alt} 
          />
        </div>
      )}
    </>
  );
}
