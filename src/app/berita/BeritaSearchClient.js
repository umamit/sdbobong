'use client';

import React, { useState, useMemo } from 'react';
import NewsCard from '../../components/NewsCard';

export default function BeritaSearchClient({ newsList = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Categories list based on actual categories used in SDN Bobong
  const categories = ['Semua', 'Pengumuman', 'Kegiatan', 'Artikel'];

  // Filtered news list memoized for performance
  const filteredNews = useMemo(() => {
    return newsList.filter(news => {
      const matchesSearch = 
        (news.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (news.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'Semua' || 
        (news.category || '').toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [newsList, searchQuery, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Search and Category Filter Section */}
      <div 
        style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: 'var(--space-md)', 
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)'
        }}
      >
        {/* Search Input Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <span 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)' 
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berita, pengumuman, atau artikel kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              fontSize: '0.95rem',
              color: 'var(--text-color)',
              outline: 'none',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--text-muted)',
                padding: '4px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
            Kategori:
          </span>
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1px solid var(--primary-dark)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--primary)' : 'white',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = 'var(--text-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Grid Results */}
      {filteredNews.length > 0 ? (
        <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'white', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)', 
            color: 'var(--text-muted)', 
            marginBottom: 'var(--space-lg)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📭</span>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>Tidak Menemukan Berita</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Tidak ada berita yang cocok dengan kata kunci atau filter kategori yang Anda pilih. Silakan coba kata kunci lain.
          </p>
        </div>
      )}
    </div>
  );
}
