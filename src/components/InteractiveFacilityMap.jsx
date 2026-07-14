'use client';

import { useState } from 'react';

import { FACILITIES_DATA } from '../data/facilitiesData';
import FacilityMapSvg from './FacilityMapSvg';

export default function InteractiveFacilityMap() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [southFloor, setSouthFloor] = useState(1); // 1 = Lantai 1, 2 = Lantai 2 (Gedung Selatan memanjang adalah 2 lantai)

  const handleRoomClick = (roomKey) => {
    setSelectedRoom(FACILITIES_DATA[roomKey] ? { key: roomKey, ...FACILITIES_DATA[roomKey] } : null);
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Map Header Instructions and Floor Switcher for South 2-Story Building */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xs)'
      }}>
        <p style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          backgroundColor: 'var(--accent-bg)', 
          color: 'var(--primary)', 
          padding: '10px 24px', 
          borderRadius: 'var(--radius-full)', 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          margin: 0, 
          border: '1px solid var(--accent-light)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span>👉 Arahkan kursor atau ketuk bangunan pada denah satelit di bawah ini untuk melihat detail fasilitas!</span>
        </p>

        {/* Dynamic Floor Switcher (Khusus untuk Gedung Selatan Atap Merah yang memiliki 2 Lantai) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          marginTop: '8px',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏢 <span>Tingkat Gedung Utama (Selatan - Atap Merah 2 Lantai):</span>
          </span>
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #E2E8F0',
            gap: '4px'
          }}>
            <button
              onClick={() => setSouthFloor(1)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: southFloor === 1 ? 'var(--primary)' : 'transparent',
                color: southFloor === 1 ? 'white' : 'var(--text-muted)',
                boxShadow: southFloor === 1 ? '0 4px 10px rgba(11,60,93,0.15)' : 'none'
              }}
            >
              Lantai 1 (Kantor, Kepsek, & Perpus)
            </button>
            <button
              onClick={() => setSouthFloor(2)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: southFloor === 2 ? 'var(--primary)' : 'transparent',
                color: southFloor === 2 ? 'white' : 'var(--text-muted)',
                boxShadow: southFloor === 2 ? '0 4px 10px rgba(11,60,93,0.15)' : 'none'
              }}
            >
              Lantai 2 (Aula, Lab, & UKS)
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2 facility-grid" style={{ gap: 'var(--space-md)' }}>
        {/* Left Side: SVG Campus Site Map (Aligned with Google Maps Satellite View) */}
        <div style={{ 
          backgroundColor: '#E8ECE9', // Soft grassy green background border
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-md)', 
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '480px'
        }}>
          {/* Faint Technical Grid Background overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', background: 'radial-gradient(circle, #000 10%, transparent 10%)', backgroundSize: '20px 20px' }}></div>
          
          <FacilityMapSvg
            hoveredRoom={hoveredRoom}
            setHoveredRoom={setHoveredRoom}
            handleRoomClick={handleRoomClick}
            selectedRoom={selectedRoom}
            southFloor={southFloor}
            setSouthFloor={setSouthFloor}
          />
        </div>

        {/* Right Side: Informational Panel / Interactive Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-md)', 
            boxShadow: 'var(--shadow-md)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '260px'
          }}>
            {hoveredRoom ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', animation: 'fadeIn 0.2s ease-out' }}>
                <span style={{ fontSize: '2.5rem', alignSelf: 'flex-start' }}>{FACILITIES_DATA[hoveredRoom].icon}</span>
                <h3 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2px', fontWeight: 800 }}>
                  {FACILITIES_DATA[hoveredRoom].title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, textAlign: 'justify' }}>
                  {FACILITIES_DATA[hoveredRoom].desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                  {FACILITIES_DATA[hoveredRoom].stats.fasilitas.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', fontWeight: 600 }}>
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: 'var(--space-sm) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺️</div>
                <h4 style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Sentuh Denah Sekolah</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>
                  Arahkan tetikus atau ketuk bangunan pada denah interaktif di sebelah kiri untuk meninjau fasilitas SD Negeri Bobong secara langsung.
                </p>
              </div>
            )}
          </div>

          {/* Real-world School Map Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Layout Sekolah</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '2px', textAlign: 'center' }}>U-Shape (Campuran)</span>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gedung Utama</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)', marginTop: '2px', textAlign: 'center' }}>Struktur 2 Lantai</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED GLASSMORPHIC LIGHTBOX MODAL */}
      {selectedRoom && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 37, 59, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-sm)',
          animation: 'fadeIn 0.25s ease-out'
        }} onClick={closeModal}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '680px',
            overflow: 'hidden',
            border: '2px solid white',
            position: 'relative',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Image Header */}
            <div style={{ position: 'relative', height: '240px', width: '100%' }}>
              <img 
                src={selectedRoom.image} 
                alt={selectedRoom.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {/* Glass Header overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                padding: 'var(--space-md) var(--space-md) var(--space-xs) var(--space-md)',
                color: 'white'
              }}>
                <span style={{ fontSize: '2.5rem', marginRight: '8px', verticalAlign: 'middle' }}>{selectedRoom.icon}</span>
                <h2 style={{ display: 'inline-block', color: 'white', fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  {selectedRoom.title}
                </h2>
              </div>

              {/* Close Button */}
              <button 
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--primary-dark)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '4px', fontWeight: 800, fontSize: '0.95rem' }}>DESKRIPSI FASILITAS</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'justify' }}>
                  {selectedRoom.desc}
                </p>
              </div>

              {/* Grid Specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {Object.entries(selectedRoom.stats).filter(([key]) => key !== 'fasilitas').map(([key, val]) => (
                  <div key={key}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                      {key.replace('_', ' ')}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '2px' }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* List of Amenities */}
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontWeight: 800, fontSize: '0.95rem' }}>KELENGKAPAN & DETAIL FASILITAS</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRoom.stats.fasilitas.map((am, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        backgroundColor: '#F3F4F6', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        color: 'var(--text-main)', 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ color: 'var(--accent)' }}>✦</span> {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px var(--space-md)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#F9FAFB' }}>
              <button 
                className="btn btn-primary" 
                onClick={closeModal}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700 }}
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Injection Styles for Modal animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .facility-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .facility-grid {
            grid-template-columns: minmax(320px, 1.4fr) minmax(280px, 0.6fr);
          }
        }
      `}</style>
    </div>
  );
}
