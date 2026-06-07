'use client';

import React, { useState } from 'react';

const FACILITIES_DATA = {
  kelas: {
    title: "Ruang Kelas Belajar",
    desc: "9 Ruang Kelas belajar (6 Rombel Aktif) yang bersih, kondusif, dan nyaman untuk proses kegiatan belajar mengajar harian siswa.",
    stats: {
      kapasitas: "30 Siswa / Kelas",
      kondisi: "Sangat Baik (Sirkulasi Udara & Pencahayaan Optimal)",
      fasilitas: ["Papan Tulis Whiteboard", "Pojok Baca Kelas", "Kipas Angin", "Alat Peraga Edukatif (APE)", "Meja Kursi Ergonomis"]
    },
    icon: "🏫",
    color: "#0B3C5D",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  kantor: {
    title: "Ruang Guru & Kepala Sekolah",
    desc: "Pusat pelayanan administrasi sekolah, tempat koordinasi penjaminan mutu pendidikan, rapat dewan guru, dan penerimaan tamu wali murid.",
    stats: {
      kondisi: "Dilengkapi AC & Wifi Mandiri",
      staf: "14 Guru & Tenaga Kependidikan",
      fasilitas: ["Ruang Kerja Kepala Sekolah", "Lounge Guru", "Komputer Administrasi", "Arsip Legalitas", "Dispenser & Pantry Mini"]
    },
    icon: "💻",
    color: "#329D9C",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
  },
  sanitasi: {
    title: "Toilet & Sarana Sanitasi",
    desc: "2 Kompleks Ruang Toilet bersih dan higienis yang terpisah secara layak antara toilet guru dan toilet murid (putra & putri).",
    stats: {
      sumber_air: "Sumur Bor Bersih & Jetpump",
      frekuensi_bersih: "2 Kali Sehari (Oleh Tim Kebersihan)",
      fasilitas: ["Wastafel Cuci Tangan", "Sabun Cair & Sanitizer", "Cermin Dinding", "Ember & Gayung Higienis"]
    },
    icon: "🧼",
    color: "#E53E3E",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  },
  olahraga: {
    title: "Lapangan Tengah & Area Upacara",
    desc: "Halaman terbuka yang luas di bagian tengah sekolah. Berfungsi sebagai pusat upacara bendera hari Senin, tempat olahraga, dan area bermain bebas siswa.",
    stats: {
      ukuran: "24 x 18 Meter (Paving Block & Beton)",
      fungsi: "Serbaguna (Upacara, Futsal, Atletik, Senam)",
      fasilitas: ["Tiang Bendera Utama", "Gawang Futsal Portable", "Net Bulutangkis", "Taman Hijau Pojok", "Tempat Duduk Penonton Teduh"]
    },
    icon: "⚽",
    color: "#F5A623",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
  },
  literasi: {
    title: "Pojok Baca & Taman Literasi",
    desc: "Pusat eksplorasi imajinasi anak dengan mengoptimalkan pojok baca kelas serta koleksi buku cerita bergambar guna menumbuhkan kecintaan membaca sejak dini.",
    stats: {
      koleksi: "250+ Buku Anak & Edukasi",
      program: "15 Menit Membaca Sebelum KBM",
      fasilitas: ["Karpet Puzzle Nyaman", "Rak Buku Mini Kayu", "Meja Gambar", "Buku Cerita Bergambar", "Ensiklopedia Anak Ringkas"]
    },
    icon: "📚",
    color: "#4F46E5",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
  },
  gudang: {
    title: "Gudang & Inventaris",
    desc: "Ruang penyimpanan tertutup yang aman untuk menyimpan barang-barang inventaris sekolah, alat peraga olahraga, tenda pramuka, and perlengkapan upacara.",
    stats: {
      kondisi: "Kering & Terkunci Rapat",
      sistem: "Buku Inventarisasi Barang BOS",
      fasilitas: ["Rak Besi Susun", "Kotak Penyimpanan Tertutup", "Lemari Alat Olahraga", "Kunci Ganda Pengaman"]
    },
    icon: "📦",
    color: "#475569",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
  }
};

export default function InteractiveFacilityMap() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const handleRoomClick = (roomKey) => {
    setSelectedRoom(FACILITIES_DATA[roomKey] ? { key: roomKey, ...FACILITIES_DATA[roomKey] } : null);
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Map Header Instructions */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-bg)', color: 'var(--primary)', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 600, margin: 0, border: '1px solid var(--accent-light)' }}>
          <span>👉 Klik area warna-warni pada peta interaktif sekolah untuk memulai Tur Fasilitas!</span>
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 0.8fr)', gap: 'var(--space-md)' }}>
        {/* Left Side: SVG Floor Map */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-md)', 
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '380px'
        }}>
          {/* Ambient Grid Background */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'radial-gradient(circle, #000 10%, transparent 10%)', backgroundSize: '16px 16px' }}></div>
          
          <svg 
            viewBox="0 0 800 500" 
            width="100%" 
            height="100%" 
            style={{ maxWidth: '750px', filter: 'drop-shadow(0px 10px 15px rgba(11,60,93,0.12))' }}
          >
            {/* Legend/Glow effects */}
            <defs>
              <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="2" dy="6" stdDeviation="5" floodColor="#0B3C5D" floodOpacity="0.25"/>
              </filter>
            </defs>

            {/* AREA 1: Lapangan Tengah (Courtyard) - Sports Field / Upacara */}
            <rect 
              x="260" y="160" width="280" height="180" rx="12"
              fill={hoveredRoom === 'olahraga' ? '#FFD066' : '#FFDDA6'}
              stroke="#F5A623"
              strokeWidth={hoveredRoom === 'olahraga' ? '4' : '2'}
              strokeDasharray="6,4"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onClick={() => handleRoomClick('olahraga')}
              onMouseEnter={() => setHoveredRoom('olahraga')}
              onMouseLeave={() => setHoveredRoom(null)}
              filter={hoveredRoom === 'olahraga' ? 'url(#glow)' : ''}
            />
            {/* Tiang Bendera SVG (in the center of courtyard) */}
            <circle cx="400" cy="250" r="14" fill="#64748b" opacity="0.3" />
            <circle cx="400" cy="250" r="6" fill="#475569" />
            <line x1="400" y1="250" x2="400" y2="210" stroke="#475569" strokeWidth="3" />
            <polygon points="400,210 422,217 400,224" fill="#EF4444" />
            
            <text 
              x="400" y="295" 
              fontFamily="var(--font-heading)" 
              fontWeight="700" 
              fontSize="13" 
              fill="#D48408" 
              textAnchor="middle" 
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              ⚽ LAPANGAN SEBAGUNA
            </text>

            {/* AREA 2: Sayap Kiri - Ruang Kelas (Grup 1) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('kelas')}
              onMouseEnter={() => setHoveredRoom('kelas')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="50" y="80" width="160" height="150" rx="10"
                fill={hoveredRoom === 'kelas' ? '#1E6F9F' : '#E8F3FC'}
                stroke="#0B3C5D"
                strokeWidth={hoveredRoom === 'kelas' ? '4' : '2'}
                style={{ transition: 'all 0.3s ease' }}
                filter={hoveredRoom === 'kelas' ? 'url(#glow)' : 'url(#shadow)'}
              />
              <text 
                x="130" y="160" 
                fontFamily="var(--font-heading)" 
                fontWeight="700" 
                fontSize="14" 
                fill={hoveredRoom === 'kelas' ? '#ffffff' : '#0B3C5D'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                🏫 RUANG KELAS
              </text>
              <text 
                x="130" y="180" 
                fontFamily="var(--font-body)" 
                fontSize="11" 
                fill={hoveredRoom === 'kelas' ? '#cbd5e1' : '#64748b'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                (6 Rombel Aktif)
              </text>
            </g>

            {/* AREA 3: Sayap Kiri Depan - Toilet / Sanitasi */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('sanitasi')}
              onMouseEnter={() => setHoveredRoom('sanitasi')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="50" y="270" width="160" height="150" rx="10"
                fill={hoveredRoom === 'sanitasi' ? '#F87171' : '#FEE2E2'}
                stroke="#E53E3E"
                strokeWidth={hoveredRoom === 'sanitasi' ? '4' : '2'}
                style={{ transition: 'all 0.3s ease' }}
                filter={hoveredRoom === 'sanitasi' ? 'url(#glow)' : 'url(#shadow)'}
              />
              <text 
                x="130" y="350" 
                fontFamily="var(--font-heading)" 
                fontWeight="700" 
                fontSize="14" 
                fill={hoveredRoom === 'sanitasi' ? '#ffffff' : '#B91C1C'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                🧼 TOILET & SANITASI
              </text>
              <text 
                x="130" y="370" 
                fontFamily="var(--font-body)" 
                fontSize="11" 
                fill={hoveredRoom === 'sanitasi' ? '#fecaca' : '#7f1d1d'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                (Toilet Guru & Siswa)
              </text>
            </g>

            {/* AREA 4: Sayap Kanan Belakang - Ruang Kantor (Guru & Kepsek) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('kantor')}
              onMouseEnter={() => setHoveredRoom('kantor')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="590" y="80" width="160" height="110" rx="10"
                fill={hoveredRoom === 'kantor' ? '#48C0BF' : '#E8F6F6'}
                stroke="#329D9C"
                strokeWidth={hoveredRoom === 'kantor' ? '4' : '2'}
                style={{ transition: 'all 0.3s ease' }}
                filter={hoveredRoom === 'kantor' ? 'url(#glow)' : 'url(#shadow)'}
              />
              <text 
                x="670" y="135" 
                fontFamily="var(--font-heading)" 
                fontWeight="700" 
                fontSize="14" 
                fill={hoveredRoom === 'kantor' ? '#ffffff' : '#2D3748'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                💻 RUANG KANTOR
              </text>
              <text 
                x="670" y="155" 
                fontFamily="var(--font-body)" 
                fontSize="11" 
                fill={hoveredRoom === 'kantor' ? '#e2f3f3' : '#4a5568'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                (Guru & Kepsek)
              </text>
            </g>

            {/* AREA 5: Sayap Kanan Tengah - Pojok Baca / Perpustakaan */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('literasi')}
              onMouseEnter={() => setHoveredRoom('literasi')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="590" y="210" width="160" height="110" rx="10"
                fill={hoveredRoom === 'literasi' ? '#6366F1' : '#EEF2FF'}
                stroke="#4F46E5"
                strokeWidth={hoveredRoom === 'literasi' ? '4' : '2'}
                style={{ transition: 'all 0.3s ease' }}
                filter={hoveredRoom === 'literasi' ? 'url(#glow)' : 'url(#shadow)'}
              />
              <text 
                x="670" y="265" 
                fontFamily="var(--font-heading)" 
                fontWeight="700" 
                fontSize="14" 
                fill={hoveredRoom === 'literasi' ? '#ffffff' : '#3730A3'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                📚 TAMAN LITERASI
              </text>
              <text 
                x="670" y="285" 
                fontFamily="var(--font-body)" 
                fontSize="11" 
                fill={hoveredRoom === 'literasi' ? '#e0e7ff' : '#4338ca'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                (Pojok Baca Murid)
              </text>
            </g>

            {/* AREA 6: Sayap Kanan Depan - Gudang Inventaris */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('gudang')}
              onMouseEnter={() => setHoveredRoom('gudang')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="590" y="340" width="160" height="80" rx="10"
                fill={hoveredRoom === 'gudang' ? '#64748B' : '#F1F5F9'}
                stroke="#475569"
                strokeWidth={hoveredRoom === 'gudang' ? '4' : '2'}
                style={{ transition: 'all 0.3s ease' }}
                filter={hoveredRoom === 'gudang' ? 'url(#glow)' : 'url(#shadow)'}
              />
              <text 
                x="670" y="380" 
                fontFamily="var(--font-heading)" 
                fontWeight="700" 
                fontSize="13" 
                fill={hoveredRoom === 'gudang' ? '#ffffff' : '#334155'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                📦 GUDANG SEKOLAH
              </text>
              <text 
                x="670" y="398" 
                fontFamily="var(--font-body)" 
                fontSize="10" 
                fill={hoveredRoom === 'gudang' ? '#f1f5f9' : '#475569'} 
                textAnchor="middle"
                style={{ transition: 'all 0.3s ease' }}
              >
                (Inventaris BOS)
              </text>
            </g>

            {/* Gate / Pintu Masuk Sekolah */}
            <line x1="400" y1="450" x2="400" y2="480" stroke="#0B3C5D" strokeWidth="6" strokeLinecap="round" />
            <text 
              x="400" y="495" 
              fontFamily="var(--font-heading)" 
              fontWeight="800" 
              fontSize="12" 
              fill="#0B3C5D" 
              textAnchor="middle"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              🚪 GERBANG MASUK UTAMA (WAYO)
            </text>
          </svg>
        </div>

        {/* Right Side: Informational Widget / Panel */}
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
            minHeight: '200px'
          }}>
            {hoveredRoom ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <span style={{ fontSize: '3rem', alignSelf: 'flex-start' }}>{FACILITIES_DATA[hoveredRoom].icon}</span>
                <h3 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '2px' }}>
                  {FACILITIES_DATA[hoveredRoom].title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, textAlign: 'justify' }}>
                  {FACILITIES_DATA[hoveredRoom].desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {FACILITIES_DATA[hoveredRoom].stats.fasilitas.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="badge badge-accent" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: 'var(--space-sm) 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🗺️</div>
                <h4 style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Arahkan Kursor Peta</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                  Arahkan tetikus Anda ke area bangunan sekolah untuk melihat gambaran cepat fasilitas SDN Bobong.
                </p>
              </div>
            )}
          </div>

          {/* Quick Statistics Mini Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Luas Bangunan</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>± 1.200 m²</span>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Kondisi Fisik</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>Sangat Layak</span>
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                padding: 'var(--space-md) var(--space-md) var(--space-xs) var(--space-md)',
                color: 'white'
              }}>
                <span style={{ fontSize: '2.5rem', marginRight: '8px', verticalAlign: 'middle' }}>{selectedRoom.icon}</span>
                <h2 style={{ display: 'inline-block', color: 'white', fontSize: '1.75rem', margin: 0, fontFamily: 'var(--font-heading)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.85)'}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '4px', fontWeight: 700 }}>Deskripsi Fasilitas</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'justify' }}>
                  {selectedRoom.desc}
                </p>
              </div>

              {/* Grid Specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {Object.entries(selectedRoom.stats).filter(([key]) => key !== 'fasilitas').map(([key, val]) => (
                  <div key={key}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {key.replace('_', ' ')}
                    </span>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* List of Amenities */}
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>Kelengkapan & Alat Pendukung</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRoom.stats.fasilitas.map((am, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        backgroundColor: '#F3F4F6', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '6px 12px', 
                        fontSize: '0.85rem', 
                        color: 'var(--text-main)', 
                        fontWeight: 500,
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
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
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
      `}</style>
    </div>
  );
}
