'use client';

import { useState } from 'react';

export default function DownloadClient({ initialDownloads }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'PPDB', 'Akademik', 'Umum'];

  // Filter downloads based on query and category
  const filteredDownloads = initialDownloads.filter((doc) => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'PPDB':
        return 'badge-ppdb';
      case 'Akademik':
        return 'badge-akademik';
      default:
        return 'badge-umum';
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)' }}>
      {/* Search & Filter Header */}
      <div 
        className="card-custom" 
        style={{ 
          padding: 'var(--space-md)', 
          marginBottom: 'var(--space-lg)', 
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-md)' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari nama dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
              className="search-input-field"
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-color)'
                }}
                className="filter-tab-btn"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Downloads Grid */}
      {filteredDownloads.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
          {filteredDownloads.map((doc) => (
            <div 
              key={doc.id} 
              className="card-custom" 
              style={{ 
                padding: 'var(--space-md)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'between',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                {/* Category Badge */}
                <span 
                  className={`welcome-badge ${getCategoryBadgeClass(doc.category)}`}
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: 'var(--space-xs)'
                  }}
                >
                  {doc.category}
                </span>

                {/* Document Title */}
                <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-color)' }}>
                  {doc.title}
                </h3>
                
                {/* File Meta */}
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
                  Diupload pada: {doc.date ? new Date(doc.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                {doc.fileUrl && doc.fileUrl.startsWith('/') && !doc.fileUrl.includes('.') ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      textAlign: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Buka &amp; Cetak Formulir
                  </a>
                ) : (
                  <a
                    href={doc.fileUrl}
                    download
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-color)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      textAlign: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Unduh Dokumen
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-custom" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: '#666' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-sm)', color: '#ccc' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
            <line x1="12" y1="11" x2="12" y2="17"></line>
          </svg>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Tidak ada dokumen ditemukan</p>
          <p style={{ fontSize: '0.9rem' }}>Coba cari dokumen lain atau bersihkan filter kategori Anda.</p>
        </div>
      )}
    </div>
  );
}
