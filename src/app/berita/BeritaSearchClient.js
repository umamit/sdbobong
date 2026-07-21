'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '../../components/NewsCard';

const ITEMS_PER_PAGE = 6;

export default function BeritaSearchClient({ newsList = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['Semua', 'Pengumuman', 'Kegiatan', 'Artikel'];

  // Extract unique years from news list
  const years = useMemo(() => {
    const yearSet = new Set(
      newsList
        .map(n => n.date ? new Date(n.date).getFullYear() : null)
        .filter(Boolean)
    );
    return ['Semua', ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [newsList]);

  // Filter + sort, reset page on filter change
  const filteredNews = useMemo(() => {
    const result = newsList.filter(news => {
      const matchesSearch =
        (news.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (news.content || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Semua' ||
        (news.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const newsYear = news.date ? new Date(news.date).getFullYear().toString() : null;
      const matchesYear =
        selectedYear === 'Semua' || newsYear === selectedYear.toString();

      return matchesSearch && matchesCategory && matchesYear;
    });

    return result.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [newsList, searchQuery, selectedCategory, selectedYear, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Pill button style helper
  const pillStyle = (isActive) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: isActive ? '1px solid var(--primary-dark)' : '1px solid var(--border-color)',
    backgroundColor: isActive ? 'var(--primary)' : 'white',
    color: isActive ? 'white' : 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Filter Panel */}
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
          marginBottom: 'var(--space-md)',
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span
              style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '1.1rem', color: 'var(--text-muted)',
              }}
            >🔍</span>
            <input
              type="text"
              placeholder="Cari berita, pengumuman, atau artikel..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px',
                border: '2px solid var(--border-color)', fontSize: '0.95rem',
                color: 'var(--text-color)', outline: 'none',
                transition: 'border-color 0.25s, box-shadow 0.25s', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1rem', color: 'var(--text-muted)', padding: '4px',
                }}
              >✕</button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => handleFilterChange(setSortOrder)(e.target.value)}
            style={{
              padding: '12px 14px', borderRadius: '12px', border: '2px solid var(--border-color)',
              fontSize: '0.9rem', color: 'var(--text-color)', background: 'white',
              cursor: 'pointer', outline: 'none', fontWeight: 600,
            }}
          >
            <option value="newest">⬇ Terbaru</option>
            <option value="oldest">⬆ Terlama</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilterChange(setSelectedCategory)(cat)}
              style={pillStyle(selectedCategory === cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Year Pills */}
        {years.length > 2 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
              Tahun:
            </span>
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleFilterChange(setSelectedYear)(year)}
                style={pillStyle(selectedYear === year)}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Menampilkan <strong>{filteredNews.length}</strong> dari <strong>{newsList.length}</strong> berita
          {selectedCategory !== 'Semua' && ` · Kategori: ${selectedCategory}`}
          {selectedYear !== 'Semua' && ` · Tahun: ${selectedYear}`}
        </p>
      </div>

      {/* News Grid with Framer Motion AnimatePresence */}
      {paginatedNews.length > 0 ? (
        <motion.div
          className="grid-2"
          style={{ marginBottom: 'var(--space-lg)' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {paginatedNews.map((news) => (
              <motion.div
                key={news.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <NewsCard news={news} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div
          style={{
            textAlign: 'center', padding: '4rem 2rem', background: 'white',
            borderRadius: '16px', border: '1px solid var(--border-color)',
            color: 'var(--text-muted)', marginBottom: 'var(--space-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📭</span>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>
            Tidak Menemukan Berita
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Tidak ada berita yang cocok dengan filter yang dipilih. Silakan coba kata kunci atau filter lain.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-lg)',
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-color)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: '0.9rem',
            }}
          >
            ← Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: page === currentPage ? '1px solid var(--primary-dark)' : '1px solid var(--border-color)',
                background: page === currentPage ? 'var(--primary)' : 'white',
                color: page === currentPage ? 'white' : 'var(--text-color)',
                cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-color)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: '0.9rem',
            }}
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  );
}
