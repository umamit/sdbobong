'use client';

import React, { useState } from 'react';

const FACILITIES_DATA = {
  // GEDUNG BARAT (PAVILIUN KIRI - ATAP BIRU)
  l1_kelas_1: {
    title: "Ruang Kelas 1",
    desc: "Ruang kelas belajar bagi siswa Kelas 1, terletak di Gedung Barat Paviliun Bawah. Dirancang dengan sirkulasi udara optimal, tinggi meja kursi ramah anak, serta pojok literasi dasar bergambar guna merangsang kecintaan belajar sejak dini.",
    stats: {
      kapasitas: "28 Siswa",
      lokasi: "Gedung Barat, Paviliun Bawah (Lantai Dasar)",
      kondisi: "Sangat Layak (Bersih & Terawat)",
      fasilitas: ["Meja & Kursi Ergonomis Ukuran Anak", "Papan Tulis Whiteboard Magnetik", "Pojok Baca Buku Bergambar", "Alat Peraga Edukatif Dasar (APE)", "Kipas Angin Dinding"]
    },
    icon: "🎒",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  l1_kelas_2: {
    title: "Ruang Kelas 2",
    desc: "Ruang kelas belajar khusus siswa Kelas 2, terletak di Gedung Barat Paviliun Bawah. Dilengkapi dengan pajangan apresiasi karya kreatif murid pada dinding kelas untuk mendorong rasa percaya diri dan antusiasme belajar harian.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Gedung Barat, Paviliun Bawah (Lantai Dasar)",
      kondisi: "Sangat Baik",
      fasilitas: ["Papan Tulis Whiteboard", "Pojok Literasi Tematik", "Mading Karya Seni Murid", "Almari Penyimpanan Buku Paket", "Sirkulasi Udara Alami"]
    },
    icon: "🏫",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_3: {
    title: "Ruang Kelas 3",
    desc: "Ruang kelas belajar siswa Kelas 3 yang terletak di Gedung Barat Paviliun Tengah. Memberikan suasana belajar yang sejuk dan rindang dengan pemandangan hijau langsung mengarah ke lapangan utama.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Gedung Barat, Paviliun Tengah (Lantai Dasar)",
      kondisi: "Sangat Kondusif",
      fasilitas: ["Papan Tulis Whiteboard", "Peta Nusantara & Dunia Dinding", "Rak Penyimpanan Tas Murid", "Meja Belajar Solid Wood", "Kipas Angin Angin Silang"]
    },
    icon: "📖",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_4: {
    title: "Ruang Kelas 4",
    desc: "Ruang kelas belajar bagi siswa Kelas 4, terletak di Gedung Barat Paviliun Tengah. Dirancang untuk mendukung pembelajaran interaktif kelompok kecil melalui tata letak meja diskusi melingkar yang dinamis.",
    stats: {
      kapasitas: "32 Siswa",
      lokasi: "Gedung Barat, Paviliun Tengah (Lantai Dasar)",
      kondisi: "Sangat Baik (Terang & Bersih)",
      fasilitas: ["Whiteboard", "Pojok Baca Buku Pelajaran", "Media Peraga Matematika & IPA", "Mading Kelas Aktif", "Kipas Angin Dinding"]
    },
    icon: "📐",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_5: {
    title: "Ruang Kelas 5",
    desc: "Ruang belajar siswa Kelas 5 di Gedung Barat Paviliun Atas. Ruangan ini memiliki sirkulasi cahaya matahari pagi yang melimpah, mendukung semangat fokus belajar siswa tingkat lanjut.",
    stats: {
      kapasitas: "32 Siswa",
      lokasi: "Gedung Barat, Paviliun Atas (Lantai Dasar)",
      kondisi: "Sangat Baik & Teduh",
      fasilitas: ["Papan Tulis Magnetik", "Almari Buku Referensi Murid", "Satu Set Alat Musik Suling & Pianika", "Display Portofolio Karya Seni", "Ventilasi Silang Optimal"]
    },
    icon: "🎨",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop"
  },
  l2_kelas_6: {
    title: "Ruang Kelas 6",
    desc: "Ruang kelas siswa Kelas 6 sebagai sarana persiapan pematangan mental menuju jenjang SMP, terletak di Gedung Barat Paviliun Atas. Suasana diatur lebih tenang dan terfokus, lengkap dengan grafik target kelulusan serta bank soal latihan.",
    stats: {
      kapasitas: "30 Siswa",
      lokasi: "Gedung Barat, Paviliun Atas (Lantai Dasar)",
      kondisi: "Kondusif & Tenang",
      fasilitas: ["Papan Tulis Whiteboard Besar", "Papan Target Nilai & Kelulusan", "Alat Peraga Bangun Ruang Matematika", "Mading Informasi Pendaftaran SMP", "Loker Arsip Soal Latihan"]
    },
    icon: "🎓",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop"
  },

  // GEDUNG SELATAN (UTAMA / BAWAH - ATAP MERAH - 2 LANTAI)
  l1_kantor: {
    title: "Kantor Guru",
    desc: "Ruang kerja dewan guru SDN Bobong yang terletak di Gedung Selatan Utama (Lantai 1 - Sisi Kiri). Berfungsi sebagai tempat bimbingan akademik, koordinasi harian guru, dan persiapan mengajar.",
    stats: {
      kapasitas: "12 Guru & Staff",
      lokasi: "Gedung Selatan Utama, Lantai 1 (Sayap Kiri)",
      kondisi: "Sangat Layak & Ber-AC",
      fasilitas: ["Meja Kerja Guru & Kursi Kerja", "Printer & Scanner Bersama", "Air Conditioner (AC)", "Papan Pengumuman Kurikulum", "Wifi Sekolah"]
    },
    icon: "💻",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
  },
  l1_kepsek: {
    title: "Ruang Kepala Sekolah",
    desc: "Ruang Kepala Sekolah yang terletak di Gedung Selatan Utama (Lantai 1 - Sisi Tengah). Berfungsi sebagai ruang kerja dinas kepala sekolah, koordinasi manajerial, pelayanan administrasi sekolah, serta ruang pertemuan tamu dinas.",
    stats: {
      kapasitas: "1 Kepala Sekolah & Staf Khusus",
      lokasi: "Gedung Selatan Utama, Lantai 1 (Bagian Tengah)",
      kondisi: "Sangat Baik & Ber-AC",
      fasilitas: ["Meja Kerja & Kursi Pimpinan", "Satu Set Sofa Tamu VIP", "Lemari Arsip Sertifikasi & Prestasi", "Komputer Kerja Kepala Sekolah", "Pendingin Ruangan (AC)"]
    },
    icon: "👑",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"
  },
  l1_perpus: {
    title: "Perpustakaan & Pojok Literasi",
    desc: "Tempat eksplorasi imajinasi anak di Gedung Selatan Utama (Lantai 1 - Sisi Kanan). Berisi koleksi buku pelajaran lengkap, ensiklopedia edukatif, buku dongeng moral, serta majalah anak yang ramah dibaca di area lesehan berkarpet empuk.",
    stats: {
      koleksi: "600+ Buku Bacaan & Referensi",
      lokasi: "Gedung Selatan Utama, Lantai 1 (Sayap Kanan)",
      kondisi: "Tenang, Bersih & Nyaman",
      fasilitas: ["Rak Buku Klasifikasi Kayu", "Meja Baca Kelompok", "Karpet Puzzle Lesehan", "Pendingin Udara", "Katalog Pencarian Buku Manual"]
    },
    icon: "📚",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
  },
  l2_toilet: {
    title: "Toilet Sekolah (Lantai 2)",
    desc: "Fasilitas toilet bersih untuk siswa dan guru yang terletak di Lantai 2 Gedung Selatan (Sayap Kiri). Dilengkapi dengan sanitasi modern, air bersih mengalir dari sumur bor jetpump, dan dirawat secara higienis setiap hari demi kenyamanan bersama.",
    stats: {
      sumber_air: "Sumur Bor Bersih Jetpump",
      lokasi: "Gedung Selatan Utama, Lantai 2 (Sayap Kiri)",
      kondisi: "Sangat Bersih & Higienis",
      fasilitas: ["Wastafel Keramik", "Cermin Dinding", "Sabun Cuci Tangan", "Ventilasi Udara Baik", "Penerangan Terang"]
    },
    icon: "🚻",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  },
  l2_lab: {
    title: "Laboratorium Komputer",
    desc: "Ruang praktek teknologi dan asesmen yang terletak di Gedung Selatan Utama (Lantai 2 - Sisi Tengah). Dilengkapi dengan perangkat komputer Chromebook modern yang terhubung internet nirkabel berkecepatan tinggi guna melatih keterampilan literasi digital siswa.",
    stats: {
      kapasitas: "25 Chromebook",
      lokasi: "Gedung Selatan Utama, Lantai 2 (Bagian Tengah)",
      kondisi: "Modern, Sejuk & Terawat",
      fasilitas: ["Meja Komputer Bersekat", "Akses Internet Wifi Berkecepatan Tinggi", "Proyektor LCD Presentasi", "Papan Tulis Instruksi Guru", "Kipas Angin Dinding (2 Unit)"]
    },
    icon: "💻",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop"
  },
  l2_uks: {
    title: "Klinik UKS (Unit Kesehatan Sekolah)",
    desc: "Ruang pelayanan kesehatan awal bagi siswa yang sakit di sekolah, terletak di Gedung Selatan Utama (Lantai 2 - Sisi Kanan). Menyediakan ranjang istirahat yang bersih, obat-obatan P3K lengkap, dan peralatan medis dasar di bawah pengawasan guru pembina.",
    stats: {
      kapasitas: "2 Ranjang Istirahat UKS",
      lokasi: "Gedung Selatan Utama, Lantai 2 (Sayap Kanan)",
      kondisi: "Steril, Bersih, dan Tenang",
      fasilitas: ["Ranjang Pasien (2 Set)", "Timbangan & Pengukur Tinggi Badan", "Kotak Obat P3K & Obat Esensial", "Termometer & Tensi Digital", "Wastafel Cuci Tangan"]
    },
    icon: "🩹",
    color: "#C53030",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop"
  },

  // GEDUNG TIMUR (PAVILIUN KANAN - GAZEBO OUTDOOR)
  gazebo_utara: {
    title: "Gazebo Belajar Utara",
    desc: "Gazebo/saung terbuka ramah anak di sisi timur halaman bagian utara. Berfungsi sebagai area literasi luar ruangan, tempat berdiskusi santai bagi siswa, atau sekadar berteduh menikmati suasana sejuk sekolah.",
    stats: {
      kapasitas: "8-10 Murid",
      lokasi: "Halaman Timur (Sisi Utara)",
      kondisi: "Nyaman, Rindang & Teduh",
      fasilitas: ["Meja Kayu Bundar", "Tempat Duduk Melingkar", "Atap Rumbia Estetis", "Pojok Tempat Sampah Pilah"]
    },
    icon: "🏡",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
  },
  gazebo_selatan: {
    title: "Gazebo Belajar Selatan",
    desc: "Gazebo/saung kayu estetis di sisi timur halaman bagian selatan, dekat dengan area perpustakaan. Menyediakan lingkungan belajar outdoor yang damai, sangat ideal untuk membaca buku atau kegiatan kelompok kreatif.",
    stats: {
      kapasitas: "8-10 Murid",
      lokasi: "Halaman Timur (Sisi Selatan)",
      kondisi: "Sangat Asri & Nyaman",
      fasilitas: ["Meja Belajar Kayu", "Bangku Sandar Panjang", "Atap Teduh Anti-Panas", "Dekat Taman Hijau"]
    },
    icon: "🏡",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
  },

  // OUTDOOR / LAPANGAN UTAMA
  olahraga: {
    title: "Lapangan Utama & Area Pramuka",
    desc: "Halaman terbuka yang luas di bagian tengah kompleks sekolah, dikelilingi oleh bangunan kelas (sebagaimana terlihat nyata dari satelit Google Maps). Berfungsi sebagai pusat upacara bendera, lapangan futsal/voli, area kemah pramuka, serta tempat bermain bebas siswa yang gembira.",
    stats: {
      ukuran: "28 x 22 Meter",
      lokasi: "Area Courtyard Tengah Kompleks Sekolah",
      kondisi: "Lapang, Bersih & Alami",
      fasilitas: ["Tiang Bendera Utama", "Gapura Bambu Pramuka (Pionering)", "Gawang Futsal Mini", "Net Bola Voli & Bulutangkis", "Taman Pojok Hijau Sekolah"]
    },
    icon: "⛺",
    color: "#EAD8B1",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
  }
};

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

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 0.6fr)', gap: 'var(--space-md)' }}>
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
          
          <svg 
            viewBox="0 0 850 540" 
            width="100%" 
            height="100%" 
            style={{ maxWidth: '800px', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.08))' }}
          >
            {/* SVG Definitions */}
            <defs>
              <filter id="glow-blue" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
              <filter id="glow-red" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
              <filter id="shadow-premium" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#07253B" floodOpacity="0.15"/>
              </filter>
            </defs>

            {/* AREA RUMPUT PERIMETER (Landscape base) */}
            <rect x="0" y="0" width="850" height="540" rx="16" fill="#E3ECDA" />

            {/* AREA PAGAR PEMBATAS SEKOLAH */}
            <rect x="15" y="15" width="820" height="510" rx="14" fill="none" stroke="#BACAB3" strokeWidth="2.5" strokeDasharray="6,4" />

            {/* JALUR SETAPAK / PEDESTRIAN PAVING BLOCK */}
            {/* Jalur barat */}
            <rect x="155" y="55" width="20" height="390" fill="#CBD5E1" opacity="0.8" />
            {/* Jalur selatan */}
            <rect x="155" y="365" width="515" height="20" fill="#CBD5E1" opacity="0.8" />
            {/* Jalur timur */}
            <rect x="670" y="245" width="55" height="20" fill="#CBD5E1" opacity="0.8" />

            {/* ======================================================== */}
            {/* INTERACTIVE COMPONENT: LAPANGAN TENGAH (olahraga)        */}
            {/* ======================================================== */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('olahraga')}
              onMouseEnter={() => setHoveredRoom('olahraga')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              {/* Lapangan Sandy-Clay base */}
              <rect 
                x="175" y="125" width="490" height="240" rx="8"
                fill={hoveredRoom === 'olahraga' ? '#E9D3C0' : '#EFE3D3'}
                stroke={hoveredRoom === 'olahraga' ? '#B45309' : '#D6C5B3'}
                strokeWidth={hoveredRoom === 'olahraga' ? '2.5' : '1.5'}
                style={{ transition: 'all 0.2s ease' }}
                filter={hoveredRoom === 'olahraga' ? 'url(#shadow-premium)' : ''}
              />
              {/* Garis-garis Lapangan Olahraga */}
              <rect x="230" y="175" width="380" height="140" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
              <line x1="420" y1="175" x2="420" y2="315" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
              <circle cx="420" cy="245" r="30" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />

              {/* Tiang Bendera Bendera Waving */}
              <g transform="translate(420, 245)">
                <circle cx="0" cy="0" r="10" fill="#4A5568" opacity="0.2" />
                <circle cx="0" cy="0" r="4" fill="#334155" />
                <line x1="0" y1="0" x2="0" y2="-60" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                {/* Waving Merah Putih Flag */}
                <path d="M0,-60 C8,-64 16,-56 24,-60 L24,-52 C16,-48 8,-56 0,-52 Z" fill="#EF4444" />
                <path d="M0,-52 C8,-56 16,-48 24,-52 L24,-44 C16,-40 8,-48 0,-44 Z" fill="#F9FAFB" stroke="#E2E8F0" strokeWidth="0.5" />
              </g>

              {/* Gapura Pramuka (Pionering Bamboo) */}
              <g transform="translate(250, 310)">
                <line x1="-15" y1="40" x2="15" y2="-10" stroke="#854D0E" strokeWidth="3" />
                <line x1="15" y1="40" x2="-15" y2="-10" stroke="#854D0E" strokeWidth="3" />
                <line x1="-20" y1="15" x2="20" y2="15" stroke="#854D0E" strokeWidth="2.5" />
                <polygon points="15,-10 25,-12 15,-5" fill="#7C3AED" /> {/* WOSM Flag */}
              </g>

              {/* Lapangan Labels */}
              <text x="420" y="335" fontFamily="var(--font-heading)" fontWeight="800" fontSize="13" fill={hoveredRoom === 'olahraga' ? '#513725' : '#735745'} textAnchor="middle" style={{ transition: 'all 0.2s' }}>
                ⛺ LAPANGAN UTAMA & KEMAH PRAMUKA
              </text>
              <text x="420" y="350" fontFamily="var(--font-body)" fontSize="10" fill={hoveredRoom === 'olahraga' ? '#78350F' : '#A18276'} textAnchor="middle">
                (Area Tanah Liat / Pasir Terbuka)
              </text>
            </g>

            {/* DEKORASI: AREA PARKIR UTAMA (Paving Stone Yard) */}
            <g transform="translate(280, 45)" filter="url(#shadow-premium)">
              {/* Ground base of parking area */}
              <rect x="0" y="0" width="120" height="55" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Parking slot white divider lines */}
              <line x1="20" y1="3" x2="20" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              <line x1="40" y1="3" x2="40" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              <line x1="60" y1="3" x2="60" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              <line x1="80" y1="3" x2="80" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              <line x1="100" y1="3" x2="100" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              
              {/* Blue Parking "P" Icon Circle */}
              <circle cx="20" cy="42" r="7" fill="#2563EB" />
              <text x="20" y="45" fontFamily="var(--font-heading)" fontWeight="900" fontSize="8" fill="#FFFFFF" textAnchor="middle">P</text>
              
              {/* Texts */}
              <text x="70" y="41" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#1E293B" textAnchor="middle">🏎️ PARKIRAN</text>
              <text x="70" y="50" fontFamily="var(--font-body)" fontSize="7.5" fill="#475569" textAnchor="middle">Pendidik & Tamu</text>
            </g>

            {/* ======================================================== */}
            {/* AREA GEDUNG BARAT: 3 BANGUNAN ATAP BIRU                  */}
            {/* ======================================================== */}
            
            {/* --- GEDUNG BARAT ATAS (Kelas 6 & Kelas 5) --- */}
            <g filter="url(#shadow-premium)">
              {/* 1. Kelas 6 (l2_kelas_6) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l2_kelas_6')}
                onMouseEnter={() => setHoveredRoom('l2_kelas_6')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,55 95,55 95,110 40,110" 
                  fill={hoveredRoom === 'l2_kelas_6' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,55 150,55 150,110 95,110" 
                  fill={hoveredRoom === 'l2_kelas_6' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="55" x2="95" y2="110" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="85" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">🎓 KELAS 6</text>
                {hoveredRoom === 'l2_kelas_6' && <rect x="42" y="57" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>

              {/* 2. Kelas 5 (l2_kelas_5) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l2_kelas_5')}
                onMouseEnter={() => setHoveredRoom('l2_kelas_5')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,110 95,110 95,165 40,165" 
                  fill={hoveredRoom === 'l2_kelas_5' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,110 150,110 150,165 95,165" 
                  fill={hoveredRoom === 'l2_kelas_5' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="110" x2="95" y2="165" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="140" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">🎨 KELAS 5</text>
                {hoveredRoom === 'l2_kelas_5' && <rect x="42" y="112" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* --- GEDUNG BARAT TENGAH (Kelas 4 & Kelas 3) --- */}
            <g filter="url(#shadow-premium)">
              {/* 3. Kelas 4 (l2_kelas_4) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l2_kelas_4')}
                onMouseEnter={() => setHoveredRoom('l2_kelas_4')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,195 95,195 95,250 40,250" 
                  fill={hoveredRoom === 'l2_kelas_4' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,195 150,195 150,250 95,250" 
                  fill={hoveredRoom === 'l2_kelas_4' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="195" x2="95" y2="250" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="225" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">📐 KELAS 4</text>
                {hoveredRoom === 'l2_kelas_4' && <rect x="42" y="197" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>

              {/* 4. Kelas 3 (l2_kelas_3) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l2_kelas_3')}
                onMouseEnter={() => setHoveredRoom('l2_kelas_3')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,250 95,250 95,305 40,305" 
                  fill={hoveredRoom === 'l2_kelas_3' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,250 150,250 150,305 95,305" 
                  fill={hoveredRoom === 'l2_kelas_3' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="250" x2="95" y2="305" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="280" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">📖 KELAS 3</text>
                {hoveredRoom === 'l2_kelas_3' && <rect x="42" y="252" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* --- GEDUNG BARAT BAWAH (Kelas 2 & Kelas 1) --- */}
            <g filter="url(#shadow-premium)">
              {/* 5. Kelas 2 (l1_kelas_2) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l1_kelas_2')}
                onMouseEnter={() => setHoveredRoom('l1_kelas_2')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,335 95,335 95,390 40,390" 
                  fill={hoveredRoom === 'l1_kelas_2' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,335 150,335 150,390 95,390" 
                  fill={hoveredRoom === 'l1_kelas_2' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="335" x2="95" y2="390" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="365" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">🏫 KELAS 2</text>
                {hoveredRoom === 'l1_kelas_2' && <rect x="42" y="337" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>

              {/* 6. Kelas 1 (l1_kelas_1) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('l1_kelas_1')}
                onMouseEnter={() => setHoveredRoom('l1_kelas_1')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <polygon 
                  points="40,390 95,390 95,445 40,445" 
                  fill={hoveredRoom === 'l1_kelas_1' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="95,390 150,390 150,445 95,445" 
                  fill={hoveredRoom === 'l1_kelas_1' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <line x1="95" y1="390" x2="95" y2="445" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                <text x="95" y="420" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">🎒 KELAS 1</text>
                {hoveredRoom === 'l1_kelas_1' && <rect x="42" y="392" width="106" height="51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* ======================================================== */}
            {/* AREA GEDUNG SELATAN (UTAMA): 2 LANTAI DENGAN TOGGLE      */}
            {/* ======================================================== */}
            <g filter="url(#shadow-premium)">
              
              {/* --- VIEW GEDUNG SELATAN: LANTAI 1 --- */}
              {southFloor === 1 && (
                <g>
                  {/* 7. Kantor Guru (l1_kantor) - Lantai 1 Kiri */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l1_kantor')}
                    onMouseEnter={() => setHoveredRoom('l1_kantor')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="180,395 340,395 340,435 180,435" 
                      fill={hoveredRoom === 'l1_kantor' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="180,435 340,435 340,475 180,475" 
                      fill={hoveredRoom === 'l1_kantor' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Interior wall line */}
                    <line x1="340" y1="395" x2="340" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
                    
                    <text x="260" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">💻 GURU (L1)</text>
                    {hoveredRoom === 'l1_kantor' && <rect x="182" y="397" width="156" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>

                  {/* 8. Ruang Kepala Sekolah (l1_kepsek) - Lantai 1 Tengah */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l1_kepsek')}
                    onMouseEnter={() => setHoveredRoom('l1_kepsek')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="340,395 470,395 470,435 340,435" 
                      fill={hoveredRoom === 'l1_kepsek' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="340,435 470,435 470,475 340,475" 
                      fill={hoveredRoom === 'l1_kepsek' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Interior wall line */}
                    <line x1="470" y1="395" x2="470" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
                    
                    <text x="405" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">👑 KEPSEK (L1)</text>
                    {hoveredRoom === 'l1_kepsek' && <rect x="342" y="397" width="126" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>

                  {/* 9. Perpustakaan (l1_perpus) - Lantai 1 Kanan */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l1_perpus')}
                    onMouseEnter={() => setHoveredRoom('l1_perpus')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="470,395 670,395 670,435 470,435" 
                      fill={hoveredRoom === 'l1_perpus' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="470,435 670,435 670,475 470,475" 
                      fill={hoveredRoom === 'l1_perpus' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    
                    <text x="570" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">📚 PERPUS (L1)</text>
                    {hoveredRoom === 'l1_perpus' && <rect x="472" y="397" width="196" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>
                </g>
              )}

              {/* --- VIEW GEDUNG SELATAN: LANTAI 2 --- */}
              {southFloor === 2 && (
                <g>
                  {/* 10. Toilet Sekolah (l2_toilet) - Lantai 2 Kiri */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l2_toilet')}
                    onMouseEnter={() => setHoveredRoom('l2_toilet')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="180,395 340,395 340,435 180,435" 
                      fill={hoveredRoom === 'l2_toilet' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="180,435 340,435 340,475 180,475" 
                      fill={hoveredRoom === 'l2_toilet' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Interior wall line */}
                    <line x1="340" y1="395" x2="340" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
                    
                    <text x="260" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🚻 TOILET (L2)</text>
                    {hoveredRoom === 'l2_toilet' && <rect x="182" y="397" width="156" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>

                  {/* 11. Laboratorium Komputer (l2_lab) - Lantai 2 Tengah */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l2_lab')}
                    onMouseEnter={() => setHoveredRoom('l2_lab')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="340,395 470,395 470,435 340,435" 
                      fill={hoveredRoom === 'l2_lab' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="340,435 470,435 470,475 340,475" 
                      fill={hoveredRoom === 'l2_lab' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Interior wall line */}
                    <line x1="470" y1="395" x2="470" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
                    
                    <text x="405" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">💻 LAB (L2)</text>
                    {hoveredRoom === 'l2_lab' && <rect x="342" y="397" width="126" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>

                  {/* 12. Ruang UKS (l2_uks) - Lantai 2 Kanan */}
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRoomClick('l2_uks')}
                    onMouseEnter={() => setHoveredRoom('l2_uks')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    {/* Roof Top Slope */}
                    <polygon 
                      points="470,395 670,395 670,435 470,435" 
                      fill={hoveredRoom === 'l2_uks' ? '#EF4444' : '#C53030'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Roof Bottom Slope */}
                    <polygon 
                      points="470,435 670,435 670,475 470,475" 
                      fill={hoveredRoom === 'l2_uks' ? '#C53030' : '#9B2C2C'} 
                      style={{ transition: 'all 0.2s' }}
                    />
                    
                    <text x="570" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🩹 UKS (L2)</text>
                    {hoveredRoom === 'l2_uks' && <rect x="472" y="397" width="196" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
                  </g>
                </g>
              )}

              {/* Garis Punggungan Atap Utama Panjang Merah Bata */}
              <line x1="180" y1="435" x2="670" y2="435" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
              
              {/* Penanda Lantai / Tag Teks Mini */}
              <rect x="390" y="458" width="80" height="15" rx="3" fill="#1E293B" opacity="0.9" />
              <text x="430" y="469" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#F8FAFC" textAnchor="middle">
                {southFloor === 1 ? "MENUJU L2 ➔" : "MENUJU L1 ➔"}
              </text>
              <rect 
                x="390" y="458" width="80" height="15" rx="3" 
                fill="transparent" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setSouthFloor(southFloor === 1 ? 2 : 1)} 
              />
            </g>

            {/* ======================================================== */}
            {/* AREA GEDUNG TIMUR (KANAN): 2 GAZEBO OUTDOOR               */}
            {/* ======================================================== */}
            <g filter="url(#shadow-premium)">
              {/* Gazebo Utara (gazebo_utara) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('gazebo_utara')}
                onMouseEnter={() => setHoveredRoom('gazebo_utara')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Roof Top Slope */}
                <polygon 
                  points="730,225 765,200 800,225" 
                  fill={hoveredRoom === 'gazebo_utara' ? '#34D399' : '#059669'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Roof Bottom Trim */}
                <polygon 
                  points="725,225 805,225 795,235 735,235" 
                  fill={hoveredRoom === 'gazebo_utara' ? '#059669' : '#047857'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Pillars */}
                <line x1="742" y1="235" x2="742" y2="255" stroke="#78350F" strokeWidth="2.5" />
                <line x1="788" y1="235" x2="788" y2="255" stroke="#78350F" strokeWidth="2.5" />
                <line x1="765" y1="235" x2="765" y2="255" stroke="#9A3412" strokeWidth="1.5" opacity="0.7" />
                
                {/* Platform / Floor */}
                <polygon 
                  points="735,255 795,255 785,265 745,265" 
                  fill={hoveredRoom === 'gazebo_utara' ? '#F59E0B' : '#D97706'} 
                  style={{ transition: 'all 0.2s' }}
                />
                
                <text x="765" y="247" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">🏡 GAZEBO U</text>
                {hoveredRoom === 'gazebo_utara' && <rect x="722" y="197" width="86" height="71" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
              </g>

              {/* Gazebo Selatan (gazebo_selatan) */}
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('gazebo_selatan')}
                onMouseEnter={() => setHoveredRoom('gazebo_selatan')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Roof Top Slope */}
                <polygon 
                  points="730,315 765,290 800,315" 
                  fill={hoveredRoom === 'gazebo_selatan' ? '#34D399' : '#059669'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Roof Bottom Trim */}
                <polygon 
                  points="725,315 805,315 795,325 735,325" 
                  fill={hoveredRoom === 'gazebo_selatan' ? '#059669' : '#047857'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Pillars */}
                <line x1="742" y1="325" x2="742" y2="345" stroke="#78350F" strokeWidth="2.5" />
                <line x1="788" y1="325" x2="788" y2="345" stroke="#78350F" strokeWidth="2.5" />
                <line x1="765" y1="325" x2="765" y2="345" stroke="#9A3412" strokeWidth="1.5" opacity="0.7" />
                
                {/* Platform / Floor */}
                <polygon 
                  points="735,345 795,345 785,355 745,355" 
                  fill={hoveredRoom === 'gazebo_selatan' ? '#F59E0B' : '#D97706'} 
                  style={{ transition: 'all 0.2s' }}
                />
                
                <text x="765" y="337" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">🏡 GAZEBO S</text>
                {hoveredRoom === 'gazebo_selatan' && <rect x="722" y="287" width="86" height="71" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* ======================================================== */}
            {/* AKSESORIS DEKORASI PETA TAMBAHAN (Premium Feel)           */}
            {/* ======================================================== */}
            
            {/* DEKORASI: GERBANG UTAMA SDN BOBONG (Dipindahkan ke samping parkiran) */}
            <g transform="translate(410, 20)" filter="url(#shadow-premium)">
              <rect x="0" y="0" width="120" height="55" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
              
              {/* Pillar Left */}
              <rect x="10" y="5" width="12" height="45" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1" />
              {/* Pillar Right */}
              <rect x="98" y="5" width="12" height="45" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1" />
              
              {/* Gate crossbar / fence */}
              <line x1="22" y1="20" x2="98" y2="20" stroke="#D97706" strokeWidth="3" />
              <line x1="22" y1="35" x2="98" y2="35" stroke="#334155" strokeWidth="2" strokeDasharray="4,2" />
              
              {/* Label */}
              <text x="60" y="24" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#0F172A" textAnchor="middle">🚪 GERBANG SDN BOBONG</text>
              <text x="60" y="40" fontFamily="var(--font-body)" fontWeight="600" fontSize="7.5" fill="#475569" textAnchor="middle">(Akses Masuk Utama)</text>
            </g>

            {/* KOMPAS ARAH MATA ANGIN (Wind Compass Rose) */}
            <g transform="translate(760, 95)" opacity="0.8">
              <circle cx="0" cy="0" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="0" y1="-26" x2="0" y2="26" stroke="#475569" strokeWidth="1" />
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#475569" strokeWidth="1" />
              {/* Star arrows */}
              <polygon points="0,-24 4,-6 0,0" fill="#EF4444" />
              <polygon points="0,-24 -4,-6 0,0" fill="#F87171" />
              <polygon points="0,24 4,6 0,0" fill="#475569" />
              <polygon points="0,24 -4,6 0,0" fill="#64748B" />
              <polygon points="24,0 6,4 0,0" fill="#475569" />
              <polygon points="24,0 6,-4 0,0" fill="#64748B" />
              <polygon points="-24,0 -6,4 0,0" fill="#475569" />
              <polygon points="-24,0 -6,-4 0,0" fill="#64748B" />
              {/* Compass texts */}
              <text x="0" y="-30" fontFamily="var(--font-heading)" fontWeight="900" fontSize="11" fill="#EF4444" textAnchor="middle">U</text>
              <text x="0" y="38" fontFamily="var(--font-heading)" fontWeight="700" fontSize="9" fill="#475569" textAnchor="middle">S</text>
              <text x="34" y="3" fontFamily="var(--font-heading)" fontWeight="700" fontSize="9" fill="#475569" textAnchor="middle">T</text>
              <text x="-36" y="3" fontFamily="var(--font-heading)" fontWeight="700" fontSize="9" fill="#475569" textAnchor="middle">B</text>
            </g>

            {/* DETAIL TAMAN & POHON HIJAU (Vegetation Clusters) */}
            {/* Top Right Tree */}
            <g transform="translate(680, 70)">
              <circle cx="0" cy="0" r="14" fill="#15803D" opacity="0.9" />
              <circle cx="10" cy="-5" r="12" fill="#166534" opacity="0.9" />
              <circle cx="-10" cy="-4" r="11" fill="#22C55E" opacity="0.8" />
            </g>
            {/* Top Left Tree */}
            <g transform="translate(200, 70)">
              <circle cx="0" cy="0" r="14" fill="#15803D" opacity="0.9" />
              <circle cx="10" cy="-5" r="12" fill="#166534" opacity="0.9" />
              <circle cx="-10" cy="-4" r="11" fill="#22C55E" opacity="0.8" />
            </g>
            {/* Bottom Right Tree */}
            <g transform="translate(710, 380)">
              <circle cx="0" cy="0" r="15" fill="#15803D" opacity="0.9" />
              <circle cx="12" cy="-6" r="12" fill="#166534" opacity="0.9" />
              <circle cx="-12" cy="-4" r="12" fill="#22C55E" opacity="0.8" />
            </g>
          </svg>
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
      `}</style>
    </div>
  );
}
