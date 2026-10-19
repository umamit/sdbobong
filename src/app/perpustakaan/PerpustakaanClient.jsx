'use client';

import { useState } from 'react';
import BookCoverVector from './BookCoverVector';

export default function PerpustakaanClient({ sibiBooks }) {
  const [selectedKelas, setSelectedKelas] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');

  const kelasList = ['Semua Kelas', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

  const filtered = sibiBooks.filter(book => {
    const matchesKelas = selectedKelas === 'Semua Kelas' || book.kelas === selectedKelas;
    const matchesQuery = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKelas && matchesQuery;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', paddingBottom: '60px' }}>
      {/* Hero Banner */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <span className="hero-subtitle" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gerakan Literasi Sekolah &amp; SIBI
          </span>
          <h1 className="hero-title">Perpustakaan Digital SD Negeri Bobong</h1>
          <p className="hero-text" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Akses bebas buku teks pelajaran resmi Kurikulum Merdeka (SIBI Kemendikbudristek) dan katalog bacaan literasi siswa kelas 1 sampai kelas 6.
          </p>
        </div>
      </section>

      {/* Filter and Content Controls */}
      <div style={{ maxWidth: '1140px', margin: '-24px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Kelas Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {kelasList.map(k => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedKelas(k)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: selectedKelas === k ? 700 : 600,
                  border: selectedKelas === k ? '1px solid #0A7E8D' : '1px solid #cbd5e1',
                  background: selectedKelas === k ? '#12A5B8' : '#f8fafc',
                  color: selectedKelas === k ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="Cari buku, mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Books Grid */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Katalog Buku Pelajaran ({filtered.length} Judul)
            </h2>
            <a
              href="https://buku.kemendikdasmen.go.id/katalog"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.82rem', fontWeight: 700, color: '#12A5B8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Katalog Lengkap SIBI Pusat ↗
            </a>
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {filtered.map(book => (
                <div key={book.id} className="card card-custom" style={{ borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>
                  <div>
                    <BookCoverVector subject={book.subject} title={book.title} kelas={book.kelas} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: '14px 0 6px 0', lineHeight: 1.4 }}>
                      {book.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Mata Pelajaran: <strong>{book.subject || 'Umum'}</strong> • {book.kelas}
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <a
                      href={book.fileUrl || 'https://buku.kemendikdasmen.go.id/katalog'}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '8px 12px',
                        background: '#12A5B8',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>Buka &amp; Unduh di SIBI</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card card-custom" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Tidak ada buku yang cocok dengan pencarian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
