'use client';

import { useState } from 'react';
import { formatTanggal } from '../../lib/format';

export default function DownloadClient({ initialDownloads }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Semua Kelas');

  const categories = ['Semua', 'PPDB', 'Akademik', 'Buku SIBI', 'Umum'];
  const kelasOptions = ['Semua Kelas', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

  // Filter downloads based on query, category, and class
  const filteredDownloads = initialDownloads.filter((doc) => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesKelas = selectedKelas === 'Semua Kelas' || doc.kelas === selectedKelas;
    return matchesSearch && matchesCategory && matchesKelas;
  });

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'PPDB':
        return 'badge-ppdb';
      case 'Akademik':
        return 'badge-akademik';
      case 'Buku SIBI':
        return 'badge-sibi';
      default:
        return 'badge-umum';
    }
  };

  // Helper to render high-res modern vector book covers for SIBI books
  const renderBookCover = (doc) => {
    const getSubjectTheme = (subject) => {
      switch (subject) {
        case 'Matematika':
          return { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', accent: '#818cf8', label: 'MATEMATIKA' };
        case 'IPAS':
          return { bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)', accent: '#34d399', label: 'IPAS SD' };
        case 'Bahasa Indonesia':
          return { bg: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)', accent: '#f472b6', label: 'BAHASA INDONESIA' };
        case 'Agama Islam':
          return { bg: 'linear-gradient(135deg, #713f12 0%, #a16207 50%, #ca8a04 100%)', accent: '#facc15', label: 'PAI & BUDI PEKERTI' };
        case 'Bahasa Inggris':
          return { bg: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0369a1 100%)', accent: '#38bdf8', label: 'BAHASA INGGRIS' };
        default:
          return { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', accent: '#94a3b8', label: 'BUKU SEKOAH' };
      }
    };

    const theme = getSubjectTheme(doc.subject);

    return (
      <div
        style={{
          width: '100%',
          height: '135px',
          borderRadius: '8px',
          background: theme.bg,
          color: '#ffffff',
          padding: '12px 14px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xs)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Top bar badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '99px', backdropFilter: 'blur(4px)', color: '#ffffff' }}>
            KURIKULUM MERDEKA
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: theme.accent, backgroundColor: 'rgba(0,0,0,0.35)', padding: '2px 8px', borderRadius: '4px' }}>
            {doc.kelas || 'SD'}
          </span>
        </div>

        {/* Bottom title & subject */}
        <div style={{ zIndex: 1 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: theme.accent, letterSpacing: '0.4px', marginBottom: '2px' }}>
            {theme.label}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.25, color: '#ffffff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {doc.title}
          </div>
        </div>
      </div>
    );
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

          {/* Category & Class Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat !== 'Buku SIBI' && cat !== 'Semua') {
                      setSelectedKelas('Semua Kelas');
                    }
                  }}
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

            {/* Class Sub-Filter (Active for Semua or Buku SIBI) */}
            {(selectedCategory === 'Semua' || selectedCategory === 'Buku SIBI') && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginRight: '4px' }}>Filter Kelas:</span>
                {kelasOptions.map((kls) => (
                  <button
                    key={kls}
                    onClick={() => setSelectedKelas(kls)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '99px',
                      border: selectedKelas === kls ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: selectedKelas === kls ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedKelas === kls ? '#e0f2fe' : 'white',
                      color: selectedKelas === kls ? '#0369a1' : '#475569'
                    }}
                  >
                    {kls}
                  </button>
                ))}
              </div>
            )}
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
                {/* Category & Class Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--space-xs)' }}>
                  <span 
                    className={`welcome-badge ${getCategoryBadgeClass(doc.category)}`}
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    {doc.category}
                  </span>
                  {doc.kelas && (
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                      {doc.kelas}
                    </span>
                  )}
                  {doc.subject && (
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 500 }}>
                      {doc.subject}
                    </span>
                  )}
                </div>

                {/* Cover Image Thumbnail (Vector Glassmorphism Cover) */}
                {doc.category === 'Buku SIBI' ? (
                  renderBookCover(doc)
                ) : doc.coverUrl ? (
                  <div style={{ width: '100%', height: '130px', borderRadius: '6px', overflow: 'hidden', marginBottom: 'var(--space-xs)', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={doc.coverUrl} alt={doc.title} style={{ height: '100%', width: 'auto', objectFit: 'contain' }} loading="lazy" />
                  </div>
                ) : null}

                {/* Document Title */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xs)', color: 'var(--primary-color)', lineHeight: 1.35 }}>
                  {doc.title}
                </h3>
                
                {/* File Meta */}
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
                  Diupload pada: {formatTanggal(doc.date)}
                </p>
              </div>

               {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                {doc.category === 'Buku SIBI' || (doc.fileUrl && doc.fileUrl.includes('kemendikdasmen.go.id')) ? (
                  <a
                    href={doc.fileUrl || 'https://buku.kemendikdasmen.go.id/katalog'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#0284c7',
                      borderColor: '#0284c7',
                      color: '#ffffff'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Buka &amp; Unduh di SIBI ↗
                  </a>
                ) : doc.fileUrl && doc.fileUrl.startsWith('/') && !doc.fileUrl.includes('.') ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
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
                    className="btn btn-accent"
                    style={{
                      display: 'flex',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
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
