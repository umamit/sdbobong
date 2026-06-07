'use client';

import React, { useState } from 'react';

const FACILITIES_DATA = {
  // FLOOR 1 (LANTAI 1)
  l1_kelas_1: {
    title: "Ruang Kelas 1 (Lantai 1)",
    desc: "Ruang kelas belajar bagi siswa Kelas 1, dirancang dengan sirkulasi udara optimal, tinggi meja kursi ramah anak, serta pojok literasi dasar bergambar guna merangsang kecintaan belajar sejak dini.",
    stats: {
      kapasitas: "28 Siswa",
      lokasi: "Lantai 1, Sayap Kiri Luar",
      kondisi: "Sangat Layak (Bersih & Terawat)",
      fasilitas: ["Meja & Kursi Ergonomis Ukuran Anak", "Papan Tulis Whiteboard Magnetik", "Pojok Baca Buku Bergambar", "Alat Peraga Edukatif Dasar (APE)", "Kipas Angin Dinding"]
    },
    icon: "🎒",
    color: "#0B3C5D",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  l1_kelas_2: {
    title: "Ruang Kelas 2 (Lantai 1)",
    desc: "Ruang kelas belajar khusus siswa Kelas 2, dilengkapi dengan pajangan apresiasi karya kreatif murid pada dinding kelas untuk mendorong rasa percaya diri dan antusiasme belajar harian.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Lantai 1, Sayap Kiri Dalam",
      kondisi: "Sangat Baik",
      fasilitas: ["Papan Tulis Whiteboard", "Pojok Literasi Tematik", "Mading Karya Seni Murid", "Almari Penyimpanan Buku Paket", "Sirkulasi Udara Alami"]
    },
    icon: "🏫",
    color: "#1E6F9F",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
  },
  l1_kantor: {
    title: "Pusat Kantor Guru & Kepala Sekolah",
    desc: "Pusat administrasi sekolah, tempat pelayanan dewan guru, dan ruang Kepala Sekolah yang menyatu di lantai bawah (persis di area pintu masuk tengah utama seperti yang tampak pada foto). Berfungsi melayani koordinasi pembelajaran serta menyambut wali murid dan tamu dinas secara prima.",
    stats: {
      kapasitas: "14 Guru & Staf Kependidikan",
      lokasi: "Lantai 1, Bagian Tengah Utama",
      kondisi: "Sangat Layak & Berpendingin Ruangan",
      fasilitas: ["Meja Kerja Guru & Kursi Putar", "Ruang Tamu Kepala Sekolah", "Komputer Administrasi Utama (Dapodik)", "Printer & Scanner Multi-Fungsi", "Sistem Arsip Inventarisasi BOS", "Air Conditioner (AC) & Wifi Mandiri"]
    },
    icon: "💻",
    color: "#329D9C",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
  },
  l1_perpus: {
    title: "Ruang Perpustakaan & Pojok Literasi",
    desc: "Tempat eksplorasi imajinasi anak dengan koleksi buku pelajaran lengkap, ensiklopedia edukatif, buku dongeng moral, serta majalah anak yang ramah dibaca di area lesehan berkarpet empuk.",
    stats: {
      koleksi: "600+ Buku Bacaan & Referensi",
      lokasi: "Lantai 1, Sayap Kanan Dalam",
      kondisi: "Tenang, Bersih & Nyaman",
      fasilitas: ["Rak Buku Klasifikasi Kayu", "Meja Baca Kelompok", "Karpet Puzzle Lesehan", "Pendingin Udara", "Katalog Pencarian Buku Manual"]
    },
    icon: "📚",
    color: "#4F46E5",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
  },
  l1_toilet: {
    title: "Fasilitas Toilet & Sanitasi Bersih",
    desc: "Kompleks sanitasi air bersih yang dirawat dan dibersihkan secara terjadwal setiap hari. Terbagi menjadi bilik terpisah demi menjamin kebersihan, kehigienisan, serta kenyamanan siswa maupun tenaga pengajar.",
    stats: {
      sumber_air: "Sumur Bor Bersih Jetpump",
      lokasi: "Lantai 1, Sayap Kanan Luar",
      kondisi: "Sangat Higienis",
      fasilitas: ["Wastafel Keramik Putih", "Cermin Dinding", "Sabun Cuci Tangan Cair", "Ember & Gayung Higienis", "Sirkulasi Udara & Pengharum Otomatis"]
    },
    icon: "🧼",
    color: "#E53E3E",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  },

  // FLOOR 2 (LANTAI 2)
  l2_kelas_3: {
    title: "Ruang Kelas 3 (Lantai 2)",
    desc: "Ruang kelas belajar siswa Kelas 3 yang terletak di lantai atas sisi kiri. Memberikan suasana belajar yang sejuk karena mendapat terpaan angin sepoi-sepoi dan pemandangan hijau langsung ke luar halaman.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Lantai 2, Sayap Kiri Luar",
      kondisi: "Sangat Kondusif",
      fasilitas: ["Balkon Pengaman Tinggi", "Papan Tulis Whiteboard", "Peta Nusantara & Dunia Dinding", "Rak Penyimpanan Tas Murid", "Meja Belajar Solid Wood"]
    },
    icon: "📖",
    color: "#0F766E",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_4: {
    title: "Ruang Kelas 4 (Lantai 2)",
    desc: "Ruang kelas belajar bagi siswa Kelas 4, dirancang untuk mendukung pembelajaran interaktif kelompok kecil melalui tata letak meja diskusi melingkar yang dinamis.",
    stats: {
      kapasitas: "32 Siswa",
      lokasi: "Lantai 2, Sayap Kiri Dalam",
      kondisi: "Sangat Baik (Terang & Bersih)",
      fasilitas: ["Whiteboard", "Pojok Baca Buku Pelajaran", "Media Peraga Matematika & IPA", "Mading Kelas Aktif", "Kipas Angin Dinding"]
    },
    icon: "📐",
    color: "#0369A1",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_5: {
    title: "Ruang Kelas 5 (Lantai 2)",
    desc: "Ruang belajar siswa Kelas 5 di bagian tengah lantai atas. Ruangan ini memiliki sirkulasi cahaya matahari pagi yang melimpah, mendukung semangat fokus belajar siswa tingkat lanjut.",
    stats: {
      kapasitas: "32 Siswa",
      lokasi: "Lantai 2, Bagian Tengah Utama",
      kondisi: "Sangat Baik & Teduh",
      fasilitas: ["Papan Tulis Magnetik", "Almari Buku Referensi Murid", "Satu Set Alat Musik Suling & Pianika", "Display Portofolio Karya Seni", "Ventilasi Silang Optimal"]
    },
    icon: "🎨",
    color: "#7C3AED",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_6: {
    title: "Ruang Kelas 6 (Lantai 2)",
    desc: "Ruang kelas siswa Kelas 6 sebagai sarana persiapan pematangan mental menuju jenjang SMP. Suasana diatur lebih tenang dan terfokus, lengkap dengan grafik target kelulusan serta bank soal latihan.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Lantai 2, Sayap Kanan Dalam",
      kondisi: "Kondusif & Tenang",
      fasilitas: ["Papan Tulis Whiteboard Besar", "Papan Target Nilai & Kelulusan", "Alat Peraga Bangun Ruang Matematika", "Mading Informasi Pendaftaran SMP", "Loker Arsip Soal Latihan"]
    },
    icon: "🎓",
    color: "#4338CA",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop"
  },
  l2_lab_uks: {
    title: "Laboratorium Komputer & Klinik UKS",
    desc: "Ruang terpadu di lantai atas yang difungsikan sebagai lab komputer mini dengan perangkat Chromebook edukatif, sekaligus sebagai area Unit Kesehatan Sekolah (UKS) bersih yang tenang untuk penanganan awal medis siswa sakit.",
    stats: {
      kapasitas: "20 Chromebook & 2 Ranjang UKS",
      lokasi: "Lantai 2, Sayap Kanan Luar",
      kondisi: "Steril, Bersih, Dingin (Ber-AC)",
      fasilitas: ["Laptop Chromebook Sekolah", "Akses Wifi Berkecepatan Tinggi", "Kotak Obat P3K Lengkap", "Timbangan Badan & Pengukur Tinggi", "Ranjang Pasien Kasur Empuk & Bantal", "Termometer & Pengukur Tekanan Darah"]
    },
    icon: "🩹",
    color: "#BE123C",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop"
  },

  // OUTDOOR / LAPANGAN UTAMA
  olahraga: {
    title: "Lapangan Utama & Area Pramuka",
    desc: "Halaman tanah luas terbuka di depan gedung utama sekolah (sebagaimana terlihat nyata pada foto). Berfungsi sebagai pusat upacara bendera hari Senin, tempat berolahraga jasmani, area kemah pramuka dengan tiang bendera bambu, serta tempat bermain bebas siswa yang menyenangkan di waktu istirahat.",
    stats: {
      ukuran: "28 x 22 Meter",
      lokasi: "Area Terbuka Depan Gedung Sekolah",
      kondisi: "Lapang & Alami",
      fasilitas: ["Tiang Bendera Utama", "Gapura Bambu Pramuka (Pionering)", "Gawang Futsal Mini", "Net Bola Voli & Bulutangkis", "Taman Pojok Hijau Sekolah"]
    },
    icon: "⛺",
    color: "#D97706",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
  }
};

export default function InteractiveFacilityMap() {
  const [activeFloor, setActiveFloor] = useState(1); // 1 = Lantai 1, 2 = Lantai 2
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
      {/* Map Header Instructions and Floor Selector */}
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
          padding: '8px 20px', 
          borderRadius: 'var(--radius-full)', 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          margin: 0, 
          border: '1px solid var(--accent-light)' 
        }}>
          <span>👉 Klik ruangan pada denah gedung 2 lantai di bawah ini untuk melihat detail fasilitas sekolah!</span>
        </p>

        {/* Tab Selector Lantai 1 / Lantai 2 (Sleek Glassmorphic Design) */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          padding: '6px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '6px',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveFloor(1)}
            style={{
              padding: '8px 24px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeFloor === 1 ? 'var(--primary)' : 'transparent',
              color: activeFloor === 1 ? 'white' : 'var(--text-muted)',
              boxShadow: activeFloor === 1 ? '0 4px 10px rgba(11,60,93,0.2)' : 'none',
            }}
          >
            🏢 Lantai 1 (Bawah)
          </button>
          <button
            onClick={() => setActiveFloor(2)}
            style={{
              padding: '8px 24px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeFloor === 2 ? 'var(--primary)' : 'transparent',
              color: activeFloor === 2 ? 'white' : 'var(--text-muted)',
              boxShadow: activeFloor === 2 ? '0 4px 10px rgba(11,60,93,0.2)' : 'none',
            }}
          >
            🏢 Lantai 2 (Atas)
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 0.7fr)', gap: 'var(--space-md)' }}>
        {/* Left Side: SVG Floor Map representing the 2-story building */}
        <div style={{ 
          backgroundColor: '#FAFBFD', 
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
          minHeight: '420px'
        }}>
          {/* Ambient Grid Background */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none', background: 'radial-gradient(circle, #000 10%, transparent 10%)', backgroundSize: '16px 16px' }}></div>
          
          <svg 
            viewBox="0 0 850 480" 
            width="100%" 
            height="100%" 
            style={{ maxWidth: '800px', filter: 'drop-shadow(0px 8px 16px rgba(11,60,93,0.1))' }}
          >
            {/* SVG Filter Effects */}
            <defs>
              <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#0B3C5D" floodOpacity="0.2"/>
              </filter>
            </defs>

            {/* DEKORASI ATAP MERAH (Hanya muncul jika di Lantai 2 untuk menyimulasikan atap pada foto) */}
            {activeFloor === 2 && (
              <polygon 
                points="30,40 50,20 800,20 820,40" 
                fill="#C53030" 
                stroke="#9B2C2C" 
                strokeWidth="2" 
                filter="url(#shadow)"
              />
            )}

            {/* STRUKTUR UTAMA DINDING GEDUNG (Warna Kuning Gading seperti foto nyata) */}
            <rect 
              x="40" y="50" width="770" height="200" rx="6"
              fill="#FEFCBF" 
              stroke="#E9D8FD" 
              strokeWidth="1.5"
              opacity="0.3"
            />

            {/* SEPARATOR LANTAI / BALKON */}
            {/* Lantai 1: Selasar Depan */}
            {activeFloor === 1 && (
              <rect 
                x="40" y="220" width="770" height="30" 
                fill="#EDF2F7" 
                stroke="#CBD5E0" 
                strokeWidth="1.5"
              />
            )}
            
            {/* Lantai 2: Balkon Hijau (Meniru pagar beton hijau muda di foto) */}
            {activeFloor === 2 && (
              <g>
                <rect 
                  x="40" y="220" width="770" height="30" 
                  fill="#C6F6D5" 
                  stroke="#9AE6B4" 
                  strokeWidth="1.5"
                />
                {/* Garis-garis dekoratif pagar beton hijau */}
                <line x1="100" y1="225" x2="100" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="200" y1="225" x2="200" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="300" y1="225" x2="300" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="400" y1="225" x2="400" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="500" y1="225" x2="500" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="600" y1="225" x2="600" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="700" y1="225" x2="700" y2="245" stroke="#48BB78" strokeWidth="2" strokeDasharray="2,2" />
              </g>
            )}

            {/* TIANG BETON PENYANGGA (Kuning Gading seperti di foto) */}
            <rect x="42" y="50" width="12" height="200" fill="#ECC94B" />
            <rect x="195" y="50" width="12" height="200" fill="#ECC94B" />
            <rect x="345" y="50" width="12" height="200" fill="#ECC94B" />
            <rect x="500" y="50" width="12" height="200" fill="#ECC94B" />
            <rect x="650" y="50" width="12" height="200" fill="#ECC94B" />
            <rect x="796" y="50" width="12" height="200" fill="#ECC94B" />

            {/* ==================== RENDERING LANTAI 1 ==================== */}
            {activeFloor === 1 && (
              <g>
                {/* 1. L1 - Ruang Kelas 1 (Sisi Kiri Luar) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l1_kelas_1')}
                  onMouseEnter={() => setHoveredRoom('l1_kelas_1')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="56" y="60" width="137" height="158" rx="8"
                    fill={hoveredRoom === 'l1_kelas_1' ? '#1E6F9F' : '#E8F3FC'}
                    stroke="#0B3C5D"
                    strokeWidth={hoveredRoom === 'l1_kelas_1' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l1_kelas_1' ? 'url(#glow)' : ''}
                  />
                  <text x="124" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l1_kelas_1' ? '#ffffff' : '#0B3C5D'} textAnchor="middle">🎒 KELAS 1</text>
                  <text x="124" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l1_kelas_1' ? '#93C5FD' : '#64748B'} textAnchor="middle">(Lantai 1)</text>
                  {/* Jendela & Pintu Simbol */}
                  <rect x="80" y="195" width="22" height="24" fill="#3B82F6" opacity="0.4" />
                  <rect x="130" y="190" width="18" height="28" fill="#78350F" />
                </g>

                {/* 2. L1 - Ruang Kelas 2 (Sisi Kiri Dalam) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l1_kelas_2')}
                  onMouseEnter={() => setHoveredRoom('l1_kelas_2')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="209" y="60" width="134" height="158" rx="8"
                    fill={hoveredRoom === 'l1_kelas_2' ? '#1E6F9F' : '#E8F3FC'}
                    stroke="#0B3C5D"
                    strokeWidth={hoveredRoom === 'l1_kelas_2' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l1_kelas_2' ? 'url(#glow)' : ''}
                  />
                  <text x="276" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l1_kelas_2' ? '#ffffff' : '#0B3C5D'} textAnchor="middle">🏫 KELAS 2</text>
                  <text x="276" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l1_kelas_2' ? '#93C5FD' : '#64748B'} textAnchor="middle">(Lantai 1)</text>
                  {/* Jendela & Pintu Simbol */}
                  <rect x="235" y="195" width="22" height="24" fill="#3B82F6" opacity="0.4" />
                  <rect x="285" y="190" width="18" height="28" fill="#78350F" />
                </g>

                {/* 3. L1 - Pusat Kantor Guru & Kepsek (Tengah - Sesuai area bendera di foto) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l1_kantor')}
                  onMouseEnter={() => setHoveredRoom('l1_kantor')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="359" y="60" width="139" height="158" rx="8"
                    fill={hoveredRoom === 'l1_kantor' ? '#329D9C' : '#E8F6F6'}
                    stroke="#2C7A7B"
                    strokeWidth={hoveredRoom === 'l1_kantor' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l1_kantor' ? 'url(#glow)' : ''}
                  />
                  <text x="428" y="125" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l1_kantor' ? '#ffffff' : '#2D3748'} textAnchor="middle">💻 RUANG GURU</text>
                  <text x="428" y="142" fontFamily="var(--font-heading)" fontWeight="700" fontSize="11" fill={hoveredRoom === 'l1_kantor' ? '#e2f3f3' : '#1A202C'} textAnchor="middle">& KEPALA SEKOLAH</text>
                  <text x="428" y="160" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l1_kantor' ? '#EBF8FF' : '#4A5568'} textAnchor="middle">(Lantai 1 - Utama)</text>
                  {/* Pintu Utama Mewah di Tengah */}
                  <rect x="415" y="186" width="26" height="32" fill="#4A5568" rx="2" />
                  <rect x="420" y="192" width="6" height="10" fill="#ECC94B" />
                  <rect x="428" y="192" width="6" height="10" fill="#ECC94B" />
                </g>

                {/* 4. L1 - Ruang Perpustakaan & Pojok Literasi */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l1_perpus')}
                  onMouseEnter={() => setHoveredRoom('l1_perpus')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="514" y="60" width="134" height="158" rx="8"
                    fill={hoveredRoom === 'l1_perpus' ? '#6366F1' : '#EEF2FF'}
                    stroke="#4F46E5"
                    strokeWidth={hoveredRoom === 'l1_perpus' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l1_perpus' ? 'url(#glow)' : ''}
                  />
                  <text x="581" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l1_perpus' ? '#ffffff' : '#3730A3'} textAnchor="middle">📚 PERPUSTAKAAN</text>
                  <text x="581" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l1_perpus' ? '#C7D2FE' : '#4338CA'} textAnchor="middle">(Pojok Baca L1)</text>
                  {/* Jendela & Pintu Simbol */}
                  <rect x="540" y="195" width="22" height="24" fill="#3B82F6" opacity="0.4" />
                  <rect x="590" y="190" width="18" height="28" fill="#78350F" />
                </g>

                {/* 5. L1 - Toilet & Sanitasi Bersih (Kanan Luar) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l1_toilet')}
                  onMouseEnter={() => setHoveredRoom('l1_toilet')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="664" y="60" width="130" height="158" rx="8"
                    fill={hoveredRoom === 'l1_toilet' ? '#EF4444' : '#FEE2E2'}
                    stroke="#B91C1C"
                    strokeWidth={hoveredRoom === 'l1_toilet' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l1_toilet' ? 'url(#glow)' : ''}
                  />
                  <text x="729" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l1_toilet' ? '#ffffff' : '#991B1B'} textAnchor="middle">🧼 TOILET</text>
                  <text x="729" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l1_toilet' ? '#FCA5A5' : '#7F1D1D'} textAnchor="middle">(Guru & Murid)</text>
                  {/* Jendela & Pintu Simbol */}
                  <rect x="690" y="195" width="22" height="24" fill="#3B82F6" opacity="0.4" />
                  <rect x="740" y="190" width="18" height="28" fill="#78350F" />
                </g>
              </g>
            )}

            {/* ==================== RENDERING LANTAI 2 ==================== */}
            {activeFloor === 2 && (
              <g>
                {/* 1. L2 - Ruang Kelas 3 (Kiri Luar) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l2_kelas_3')}
                  onMouseEnter={() => setHoveredRoom('l2_kelas_3')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="56" y="60" width="137" height="158" rx="8"
                    fill={hoveredRoom === 'l2_kelas_3' ? '#0F766E' : '#E6FFFA'}
                    stroke="#0D9488"
                    strokeWidth={hoveredRoom === 'l2_kelas_3' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l2_kelas_3' ? 'url(#glow)' : ''}
                  />
                  <text x="124" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l2_kelas_3' ? '#ffffff' : '#0D9488'} textAnchor="middle">📖 KELAS 3</text>
                  <text x="124" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l2_kelas_3' ? '#99F6E4' : '#0F766E'} textAnchor="middle">(Lantai 2 - Atas)</text>
                  {/* Simbol Jendela Kaca Atas */}
                  <rect x="85" y="70" width="25" height="18" fill="#E2F1FF" stroke="#0D9488" strokeWidth="1" />
                  <rect x="135" y="70" width="25" height="18" fill="#E2F1FF" stroke="#0D9488" strokeWidth="1" />
                </g>

                {/* 2. L2 - Ruang Kelas 4 (Kiri Dalam) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l2_kelas_4')}
                  onMouseEnter={() => setHoveredRoom('l2_kelas_4')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="209" y="60" width="134" height="158" rx="8"
                    fill={hoveredRoom === 'l2_kelas_4' ? '#0369A1' : '#F0F9FF'}
                    stroke="#0284C7"
                    strokeWidth={hoveredRoom === 'l2_kelas_4' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l2_kelas_4' ? 'url(#glow)' : ''}
                  />
                  <text x="276" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l2_kelas_4' ? '#ffffff' : '#0284C7'} textAnchor="middle">📐 KELAS 4</text>
                  <text x="276" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l2_kelas_4' ? '#BAE6FD' : '#0369A1'} textAnchor="middle">(Lantai 2 - Atas)</text>
                  {/* Simbol Jendela Kaca Atas */}
                  <rect x="235" y="70" width="25" height="18" fill="#E2F1FF" stroke="#0284C7" strokeWidth="1" />
                  <rect x="285" y="70" width="25" height="18" fill="#E2F1FF" stroke="#0284C7" strokeWidth="1" />
                </g>

                {/* 3. L2 - Ruang Kelas 5 (Tengah) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l2_kelas_5')}
                  onMouseEnter={() => setHoveredRoom('l2_kelas_5')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="359" y="60" width="139" height="158" rx="8"
                    fill={hoveredRoom === 'l2_kelas_5' ? '#7C3AED' : '#F5F3FF'}
                    stroke="#6D28D9"
                    strokeWidth={hoveredRoom === 'l2_kelas_5' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l2_kelas_5' ? 'url(#glow)' : ''}
                  />
                  <text x="428" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l2_kelas_5' ? '#ffffff' : '#6D28D9'} textAnchor="middle">🎨 KELAS 5</text>
                  <text x="428" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l2_kelas_5' ? '#DDD6FE' : '#7C3AED'} textAnchor="middle">(Lantai 2 - Atas)</text>
                  {/* Simbol Jendela Kaca Atas */}
                  <rect x="385" y="70" width="25" height="18" fill="#E2F1FF" stroke="#6D28D9" strokeWidth="1" />
                  <rect x="445" y="70" width="25" height="18" fill="#E2F1FF" stroke="#6D28D9" strokeWidth="1" />
                </g>

                {/* 4. L2 - Ruang Kelas 6 (Kanan Dalam) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l2_kelas_6')}
                  onMouseEnter={() => setHoveredRoom('l2_kelas_6')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="514" y="60" width="134" height="158" rx="8"
                    fill={hoveredRoom === 'l2_kelas_6' ? '#4338CA' : '#EEF2FF'}
                    stroke="#3730A3"
                    strokeWidth={hoveredRoom === 'l2_kelas_6' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l2_kelas_6' ? 'url(#glow)' : ''}
                  />
                  <text x="581" y="130" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l2_kelas_6' ? '#ffffff' : '#3730A3'} textAnchor="middle">🎓 KELAS 6</text>
                  <text x="581" y="150" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l2_kelas_6' ? '#C7D2FE' : '#4338CA'} textAnchor="middle">(Lantai 2 - Atas)</text>
                  {/* Simbol Jendela Kaca Atas */}
                  <rect x="540" y="70" width="25" height="18" fill="#E2F1FF" stroke="#3730A3" strokeWidth="1" />
                  <rect x="590" y="70" width="25" height="18" fill="#E2F1FF" stroke="#3730A3" strokeWidth="1" />
                </g>

                {/* 5. L2 - Lab Komputer & UKS (Kanan Luar) */}
                <g 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomClick('l2_lab_uks')}
                  onMouseEnter={() => setHoveredRoom('l2_lab_uks')}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <rect 
                    x="664" y="60" width="130" height="158" rx="8"
                    fill={hoveredRoom === 'l2_lab_uks' ? '#BE123C' : '#FFF1F2'}
                    stroke="#9F1239"
                    strokeWidth={hoveredRoom === 'l2_lab_uks' ? '3.5' : '1.5'}
                    style={{ transition: 'all 0.25s ease' }}
                    filter={hoveredRoom === 'l2_lab_uks' ? 'url(#glow)' : ''}
                  />
                  <text x="729" y="120" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'l2_lab_uks' ? '#ffffff' : '#9F1239'} textAnchor="middle">🩹 LAB MULTIMEDIA</text>
                  <text x="729" y="136" fontFamily="var(--font-heading)" fontWeight="700" fontSize="11" fill={hoveredRoom === 'l2_lab_uks' ? '#FECDD3' : '#E11D48'} textAnchor="middle">& RUANG UKS</text>
                  <text x="729" y="155" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'l2_lab_uks' ? '#FFE4E6' : '#BE123C'} textAnchor="middle">(Lantai 2 - Atas)</text>
                  {/* Simbol Jendela Kaca Atas */}
                  <rect x="690" y="70" width="25" height="18" fill="#E2F1FF" stroke="#9F1239" strokeWidth="1" />
                  <rect x="740" y="70" width="25" height="18" fill="#E2F1FF" stroke="#9F1239" strokeWidth="1" />
                </g>
              </g>
            )}

            {/* ==================== OUTDOOR / LAPANGAN UPACARA & PRAMUKA ==================== */}
            {/* Area Lapangan di bagian bawah (Paving & Tanah liat subur seperti di foto) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('olahraga')}
              onMouseEnter={() => setHoveredRoom('olahraga')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect 
                x="160" y="290" width="530" height="110" rx="10"
                fill={hoveredRoom === 'olahraga' ? '#F59E0B' : '#FEF3C7'}
                stroke="#D97706"
                strokeWidth={hoveredRoom === 'olahraga' ? '3.5' : '1.5'}
                strokeDasharray="6,4"
                style={{ transition: 'all 0.25s ease' }}
                filter={hoveredRoom === 'olahraga' ? 'url(#glow)' : ''}
              />
              
              {/* Tiang Bendera SVG Tengah Lapangan */}
              <circle cx="425" cy="345" r="10" fill="#64748B" opacity="0.3" />
              <circle cx="425" cy="345" r="4" fill="#475569" />
              <line x1="425" y1="345" x2="425" y2="310" stroke="#475569" strokeWidth="2.5" />
              <polygon points="425,310 445,316 425,322" fill="#EF4444" />
              
              {/* Bambu Gapura Pramuka Simbol (Sesuai dengan gerbang kayu bambu di foto!) */}
              <line x1="280" y1="385" x2="310" y2="310" stroke="#15803D" strokeWidth="3.5" />
              <line x1="340" y1="385" x2="310" y2="310" stroke="#15803D" strokeWidth="3.5" />
              <line x1="270" y1="335" x2="350" y2="335" stroke="#15803D" strokeWidth="3" />
              <polygon points="310,310 322,315 310,320" fill="#9333EA" /> {/* Bendera Pramuka Ungu */}

              <text x="425" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#B45309" textAnchor="middle">⛺ LAPANGAN UPACARA & KEMAH PRAMUKA</text>
              <text x="425" y="394" fontFamily="var(--font-body)" fontSize="9" fill="#D97706" textAnchor="middle">(Area Outdoor Terbuka Depan Gedung)</text>
            </g>

            {/* Gerbang Masuk Utama SDN Bobong */}
            <line x1="425" y1="425" x2="425" y2="450" stroke="#0B3C5D" strokeWidth="5" strokeLinecap="round" />
            <text 
              x="425" y="465" 
              fontFamily="var(--font-heading)" 
              fontWeight="800" 
              fontSize="11" 
              fill="#0B3C5D" 
              textAnchor="middle"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              🚪 GERBANG MASUK SEKOLAH (WAYO)
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
            minHeight: '240px'
          }}>
            {hoveredRoom ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <span style={{ fontSize: '2.5rem', alignSelf: 'flex-start' }}>{FACILITIES_DATA[hoveredRoom].icon}</span>
                <h3 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2px', fontWeight: 800 }}>
                  {FACILITIES_DATA[hoveredRoom].title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, textAlign: 'justify' }}>
                  {FACILITIES_DATA[hoveredRoom].desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                  {FACILITIES_DATA[hoveredRoom].stats.fasilitas.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', fontWeight: 600 }}>
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: 'var(--space-sm) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🗺️</div>
                <h4 style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Arahkan Kursor Ke Denah</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.4' }}>
                  Gerakkan tetikus atau tekan ruangan pada denah gedung sekolah 2 lantai di sebelah kiri untuk melihat rangkuman fasilitas.
                </p>
              </div>
            )}
          </div>

          {/* Quick Statistics Mini Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tinggi Gedung</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>2 Lantai</span>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kondisi Fisik</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>Kokoh & Layak</span>
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
      `}</style>
    </div>
  );
}
