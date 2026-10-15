'use client';

import { useState } from 'react';
import PrestasiCard from './PrestasiCard';

export default function PrestasiClient({ initialAchievements }) {
  const [selectedLevel, setSelectedLevel] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const levels = ['Semua', 'Tingkat Kecamatan', 'Tingkat Kabupaten', 'Tingkat Provinsi', 'Tingkat Nasional'];

  const filtered = initialAchievements.filter((item) => {
    const matchesLevel = selectedLevel === 'Semua' || item.level?.toLowerCase().includes(selectedLevel.toLowerCase().replace('tingkat ', ''));
    const matchesQuery = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.year?.includes(searchQuery);
    return matchesLevel && matchesQuery;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', paddingBottom: '60px' }}>
      {/* Banner Header */}
      <section style={{ background: 'linear-gradient(135deg, #0A7E8D 0%, #12A5B8 100%)', color: '#ffffff', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Etalase Kebanggaan Sekolah
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            Hall of Fame Prestasi Siswa
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.95, margin: 0 }}>
            Rekam jejak perjuangan, bakat, dan kejuaraan gemilang yang diraih oleh peserta didik SD Negeri Bobong di berbagai kompetisi.
          </p>
        </div>
      </section>

      {/* Filter and Content Section */}
      <div style={{ maxWidth: '1140px', margin: '-30px auto 0 auto', padding: '0 20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Level Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: selectedLevel === lvl ? 700 : 600,
                  border: selectedLevel === lvl ? '1px solid #0A7E8D' : '1px solid #cbd5e1',
                  background: selectedLevel === lvl ? '#12A5B8' : '#f8fafc',
                  color: selectedLevel === lvl ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="Cari prestasi, cabang lomba, tahun..."
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

        {/* Prestasi Grid */}
        <div style={{ marginTop: '36px' }}>
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filtered.map((item) => (
                <PrestasiCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="card-custom" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Tidak ada prestasi yang cocok dengan kriteria filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
