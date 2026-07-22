'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to extract YouTube Video ID from any format
function getYoutubeId(url) {
  if (!url) return null;
  
  let cleanUrl = url.trim();
  
  // 1. If it's a full iframe tag, extract the src attribute
  if (cleanUrl.includes('<iframe')) {
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
  }
  
  let videoId = null;
  
  // Standard watch URL: youtube.com/watch?v=ID or m.youtube.com/watch?v=ID
  if (cleanUrl.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(cleanUrl);
      videoId = urlObj.searchParams.get('v');
    } catch (e) {
      const match = cleanUrl.match(/[?&]v=([^&#]+)/);
      if (match) videoId = match[1];
    }
  } 
  // Short URL: youtu.be/ID
  else if (cleanUrl.includes('youtu.be/')) {
    const parts = cleanUrl.split('youtu.be/');
    if (parts.length > 1) {
      videoId = parts[1].split(/[?#]/)[0];
    }
  } 
  // Shorts URL: youtube.com/shorts/ID
  else if (cleanUrl.includes('youtube.com/shorts/')) {
    const parts = cleanUrl.split('youtube.com/shorts/');
    if (parts.length > 1) {
      videoId = parts[1].split(/[?#]/)[0];
    }
  }
  // Embed URL: youtube.com/embed/ID
  else if (cleanUrl.includes('youtube.com/embed/')) {
    const parts = cleanUrl.split('youtube.com/embed/');
    if (parts.length > 1) {
      videoId = parts[1].split(/[?#]/)[0];
    }
  }
  
  return videoId;
}

function isFacebookUrl(url) {
  if (!url) return false;
  const cleanUrl = url.trim().toLowerCase();
  return cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch') || cleanUrl.includes('fb.com');
}

function isGoogleDriveUrl(url) {
  if (!url) return false;
  const cleanUrl = url.trim().toLowerCase();
  return cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com');
}

function getGoogleDriveFileId(url) {
  if (!url) return null;
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

function getCleanGoogleDriveUrl(url, type) {
  const fileId = getGoogleDriveFileId(url);
  if (!fileId) return url;
  if (type === 'video') {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

export default function GalleryClient({ initialGallery }) {
  const [activeItem, setActiveImage] = useState(null);
  const [selectedType, setSelectedType] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(12);

  const types = ['Semua', 'image', 'video'];
  const categories = ['Semua', 'Akademik', 'Pramuka', 'Upacara', 'Sarana', 'Umum'];

  // Helper for Category Badges translucent styles
  const getCategoryBadgeStyles = (category) => {
    const cat = (category || 'umum').toLowerCase();
    switch (cat) {
      case 'akademik':
        return { background: 'rgba(37, 99, 235, 0.85)', color: '#ffffff' };
      case 'pramuka':
        return { background: 'rgba(217, 119, 6, 0.85)', color: '#ffffff' };
      case 'upacara':
        return { background: 'rgba(126, 34, 206, 0.85)', color: '#ffffff' };
      case 'sarana':
        return { background: 'rgba(4, 120, 87, 0.85)', color: '#ffffff' };
      default:
        return { background: 'rgba(71, 85, 105, 0.85)', color: '#ffffff' };
    }
  };

  // Filter gallery items by Type, Category, and Search Query
  const filteredGallery = (initialGallery || []).filter((item) => {
    const matchesType = selectedType === 'Semua' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'Semua' || (item.category || 'umum').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  // Paginated/limited gallery items
  const displayedItems = filteredGallery.slice(0, displayLimit);

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

  // Keyboard support for Lightbox
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredGallery.findIndex(item => item.id === activeItem.id);
        if (idx !== -1) {
          const prevIdx = (idx - 1 + filteredGallery.length) % filteredGallery.length;
          setActiveImage(filteredGallery[prevIdx]);
        }
      } else if (e.key === 'ArrowRight') {
        const idx = filteredGallery.findIndex(item => item.id === activeItem.id);
        if (idx !== -1) {
          const nextIdx = (idx + 1) % filteredGallery.length;
          setActiveImage(filteredGallery[nextIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, filteredGallery]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const idx = filteredGallery.findIndex(item => item.id === activeItem?.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + filteredGallery.length) % filteredGallery.length;
      setActiveImage(filteredGallery[prevIdx]);
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const idx = filteredGallery.findIndex(item => item.id === activeItem?.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % filteredGallery.length;
      setActiveImage(filteredGallery[nextIdx]);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)' }}>
      {/* Premium Glassmorphic Control Center */}
      <div 
        className="card-custom animate-fadeIn" 
        style={{ 
          padding: 'var(--space-md) var(--space-lg)', 
          marginBottom: 'var(--space-lg)', 
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(229, 231, 235, 0.5)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Search input bar */}
        <div style={{ display: 'flex', position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="🔍 Cari dokumentasi kegiatan berdasarkan judul..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(12); // Reset limit on search
            }}
            style={{
              width: '100%',
              padding: '12px 16px 12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(203, 213, 225, 0.6)',
              background: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
            }}
            className="gallery-search-input"
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(226, 232, 240, 0.8)', paddingTop: '1rem' }}>
          {/* Category Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDisplayLimit(12); // Reset limit on filter change
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: selectedCategory === cat ? 'var(--primary-color)' : 'rgba(15, 23, 42, 0.05)',
                    color: selectedCategory === cat ? 'white' : 'var(--text-color)',
                    boxShadow: selectedCategory === cat ? '0 4px 10px rgba(11, 60, 93, 0.25)' : 'none'
                  }}
                >
                  {cat === 'Semua' ? '📁 Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Format:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setDisplayLimit(12); // Reset limit on filter change
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: selectedType === type ? 'var(--primary-color)' : 'rgba(15, 23, 42, 0.05)',
                    color: selectedType === type ? 'white' : 'var(--text-color)',
                    boxShadow: selectedType === type ? '0 4px 10px rgba(11, 60, 93, 0.25)' : 'none'
                  }}
                >
                  {type === 'image' ? '📸 Foto' : type === 'video' ? '🎥 Video' : '🌟 Semua'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Masonry-style Pinterest Grid */}
      {displayedItems.length > 0 ? (
        <motion.div 
          className="gallery-masonry-grid" 
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.02 }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item) => {
              const ytId = item.type === 'video' ? getYoutubeId(item.url) : null;
              const isFb = isFacebookUrl(item.url);
              const isDrive = isGoogleDriveUrl(item.url);
              const thumbUrl = ytId 
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` 
                : isDrive && item.type === 'image'
                  ? getCleanGoogleDriveUrl(item.url, 'image')
                  : (item.thumbnail || item.url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800");

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActiveImage(item)}
                  className="gallery-masonry-item"
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.88 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                {/* Category Badge overlay */}
                <div 
                  className="gallery-category-badge"
                  style={getCategoryBadgeStyles(item.category)}
                >
                  📁 {item.category || 'umum'}
                </div>

                {/* Media Thumbnail */}
                {item.type === 'video' ? (
                  isFb ? (
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: 'linear-gradient(135deg, #1877F2 0%, #0d52b9 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      padding: '20px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        f
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>🎥 LIHAT VIDEO FACEBOOK</span>
                    </div>
                  ) : isDrive ? (
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: 'linear-gradient(135deg, #0F9D58 0%, #0B6623 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      padding: '20px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        ▲
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>🎥 VIDEO GOOGLE DRIVE</span>
                    </div>
                  ) : (
                    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        width="320"
                        height="180"
                        style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block', opacity: '0.8', transition: 'all 0.5s ease' }}
                        loading="lazy"
                        className="gallery-thumbnail-img"
                      />
                      {/* Play Overlay Button */}
                      <div style={{
                        position: 'absolute',
                        top: '0', left: '0', right: '0', bottom: '0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.25)'
                      }}>
                        <div style={{
                          width: '46px', height: '40px', borderRadius: '12px',
                          background: 'rgba(239, 68, 68, 0.9)', display: 'flex', // Premium YouTube brand red
                          alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        className="play-btn-circle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                ) : isFb ? (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #1877F2 0%, #0d52b9 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '20px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      f
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>🖼️ POSTINGAN FACEBOOK</span>
                  </div>
                ) : (
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={isDrive ? getCleanGoogleDriveUrl(item.url, 'image') : item.url}
                      alt={item.title}
                      width="400"
                      height="300"
                      loading="lazy"
                      className="gallery-thumbnail-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                )}

                {/* Title Overlay Info card */}
                <div 
                  style={{
                    padding: '12px 14px',
                    background: '#ffffff',
                    borderTop: '1px solid rgba(226, 232, 240, 0.6)'
                  }}
                >
                  <p style={{ margin: '0', fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary-color)', lineHeight: '1.4' }}>{item.title}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>
                    {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="card-custom animate-fadeIn" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: '#64748b', background: '#ffffff', border: '1px solid rgba(229, 231, 235, 0.5)' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>Tidak ada media ditemukan 🔍</p>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Coba ubah filter kategori, tipe format, atau kata kunci pencarian Anda.</p>
        </div>
      )}

      {/* Muat Lebih Banyak / Load More Button */}
      {filteredGallery.length > displayLimit && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-xl)' }} className="animate-fadeIn">
          <button
            onClick={() => setDisplayLimit(prev => prev + 12)}
            style={{
              padding: '12px 36px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary-color), #092842)',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(11, 60, 93, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.02em'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Muat Lebih Banyak ✨
          </button>
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="lightbox active glassmorphic-lightbox"
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target.id === 'gallery-lightbox') setActiveImage(null);
            }}
            style={{
              position: 'fixed',
              top: 0, left: 0, width: '100%', height: '100%',
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
              cursor: 'pointer', outline: 'none',
              zIndex: 10003
            }}
          >
            &times;
          </button>

          {/* Navigation Slider Buttons */}
          {filteredGallery.length > 1 && (
            <>
              <button className="lightbox-nav-btn prev" onClick={handlePrev} aria-label="Previous">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button className="lightbox-nav-btn next" onClick={handleNext} aria-label="Next">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Media Content - Fullscreen Video Container */}
          <div style={{ width: '95%', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeItem.type === 'video' ? (
              getYoutubeId(activeItem.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeItem.url)}?autoplay=0&rel=0`}
                  title={activeItem.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-md)' }}
                ></iframe>
              ) : isFacebookUrl(activeItem.url) ? (
                <iframe
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeItem.url)}&show_text=true&width=500`}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{ borderRadius: 'var(--radius-md)', border: 'none', width: '100%', height: '100%', backgroundColor: 'white' }}
                ></iframe>
              ) : isGoogleDriveUrl(activeItem.url) ? (
                <iframe
                  src={getCleanGoogleDriveUrl(activeItem.url, 'video')}
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                  style={{ borderRadius: 'var(--radius-md)', border: 'none', width: '100%', height: '100%' }}
                ></iframe>
              ) : (
                <video
                  src={activeItem.url}
                  controls
                  autoPlay
                  style={{ borderRadius: 'var(--radius-md)', maxWidth: '100%', maxHeight: '80vh', border: '1px solid #333' }}
                />
              )
            ) : isFacebookUrl(activeItem.url) ? (
              <iframe
                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(activeItem.url)}&show_text=true&width=500`}
                width="500"
                height="500"
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                style={{ borderRadius: 'var(--radius-md)', border: 'none', maxWidth: '100%', maxHeight: '80vh', backgroundColor: 'white', aspectRatio: '500/500' }}
              ></iframe>
            ) : (
              <img
                src={isGoogleDriveUrl(activeItem.url) ? getCleanGoogleDriveUrl(activeItem.url, 'image') : activeItem.url}
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

          {/* Caption Card - Overlay */}
          <div className="lightbox-caption-card" style={{ color: 'white', textAlign: 'center', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)', width: '90%', maxWidth: '600px' }}>
            <span style={{
              display: 'inline-block',
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              letterSpacing: '0.04em'
            }}>
              📁 {activeItem.category || 'umum'}
            </span>
            <h3 style={{ margin: '0', fontSize: '1.1rem', fontWeight: 700 }}>{activeItem.title}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {activeItem.date ? new Date(activeItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
