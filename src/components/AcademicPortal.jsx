'use client';

import { useState, useEffect } from 'react';
import GradesClient from '../app/nilai/GradesClient';

const P5_PROJECTS = [
  {
    id: "p5-bahari",
    title: "🌱 Gaya Hidup Berkelanjutan: \"Bahari Lestari Pulau Taliabu\"",
    badge: "Gaya Hidup Berkelanjutan",
    desc: "Proyek berfokus pada edukasi pelestarian ekosistem pesisir Pulau Taliabu dari pencemaran sampah plastik, pemilahan sampah organik, serta pembuatan prakarya pot bunga daur ulang untuk mempercantik taman sekolah.",
    parentGuide: [
      "Biasakan anak membawa botol minum (tumbler) isi ulang dari rumah guna menekan sampah plastik sekali pakai.",
      "Ajak anak memilah sampah plastik dan kardus bekas di rumah menjadi bahan kerajinan tangan kreatif.",
      "Diskusikan pentingnya menjaga kebersihan laut saat berwisata bersama keluarga ke Pantai Wayo."
    ],
    skills: ["💡 Kepedulian Ekologis", "🛠️ Gotong Royong", "🎨 Kreativitas Daur Ulang"],
    color: "#0B3C5D",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "p5-budaya",
    title: "🎭 Kearifan Lokal: \"Anyaman Pandan & Seni Tari Taliabu\"",
    badge: "Kearifan Lokal",
    desc: "Mengenalkan murid sejak dini pada kekayaan seni tradisional Pulau Taliabu, mulai dari dasar-dasar menganyam serat daun pandan hingga gerakan Tari Lalyon (tari adat Maluku Utara) untuk festival sekolah.",
    parentGuide: [
      "Ajak anak mendengarkan musik atau lagu daerah Maluku Utara di rumah untuk membangun keakraban budaya.",
      "Ceritakan sejarah leluhur atau legenda menarik khas Pulau Taliabu sebelum anak tidur.",
      "Dukung anak tampil percaya diri dalam kegiatan pertunjukan pentas budaya sekolah."
    ],
    skills: ["🤝 Toleransi Kebhinekaan", "🎭 Apresiasi Seni", "📜 Literasi Budaya"],
    color: "#329D9C",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "p5-wirausaha",
    title: "💰 Kewirausahaan: \"Kantin Kreatif Olahan Sagu Taliabu\"",
    badge: "Kewirausahaan",
    desc: "Mengasah mental kemandirian dan kreativitas bisnis siswa melalui pembuatan olahan sagu lokal khas Taliabu yang higienis, serta mempraktikkan proses jual beli sederhana pada kegiatan Market Day sekolah.",
    parentGuide: [
      "Ajarkan konsep dasar berhemat dengan membiasakan anak menabung sebagian uang sakunya di celengan.",
      "Latih anak menghitung kembalian uang belanja sederhana saat berbelanja di warung dekat rumah.",
      "Bantu anak mengenali nilai-nilai kejujuran, disiplin, and kerja keras dalam dunia usaha kecil."
    ],
    skills: ["🚀 Kemandirian Financial", "🧮 Logika Berpikir", "🤝 Kolaborasi Tim"],
    color: "#F5A623",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
  }
];

const MPLS_RUNDOWN = [
  {
    day: "Hari Ke-1",
    theme: "Kenalan Yuk! (Gali Potensi, Raih Prestasi)",
    color: "#0284c7",
    activities: [
      { time: "07.30 – 07.50 WIT", text: "Do’a pagi dan Salam sapa murid baru" },
      { time: "07.50 – 08.00 WIT", text: "Menyanyikan lagu indonesia raya dan yel-yel sekolah" },
      { time: "08.00 – 08.30 WIT", text: "Ice Breaking permainan perkenalan nama" },
      { time: "08.30 – 09.00 WIT", text: "Istirahat & Snack Time (Makan sehat dan bergizi)" },
      { time: "09.00 – 09.40 WIT", text: "Tur & jelajah keliling sekolahku" },
      { time: "09.40 – 09.50 WIT", text: "Jeda ceria (Instruksi Kecil menanyakan cita-cita & foto wajah anak anak)" },
      { time: "09.50 – 10.00 WIT", text: "Refleksi serta berdo’a sebelum pulang" }
    ]
  },
  {
    day: "Hari Ke-2",
    theme: "Aku anak hebat! (Membangun Karakter & Mental Juara)",
    color: "#16a34a",
    activities: [
      { time: "07.30 – 07.50 WIT", text: "Do’a pagi dan pertemuan pagi ceria" },
      { time: "07.50 – 08.00 WIT", text: "Menyanyikan lagu indonesia raya dan yel-yel sekolah" },
      { time: "08.00 – 08.30 WIT", text: "Ice Breaking Permainan tebak gambar G7KAIH" },
      { time: "08.30 – 09.00 WIT", text: "Istirahat & Snack Time (Makan sehat dan bergizi)" },
      { time: "09.00 – 09.30 WIT", text: "Bermain Peran: Tata tertib sekolah" },
      { time: "09.30 – 09.50 WIT", text: "Materi karakter: Budaya 6S (Senyum, salam, sapa, salim, sopan, dan santun)" },
      { time: "09.50 – 10.00 WIT", text: "Refleksi serta berdo’a sebelum pulang" }
    ]
  },
  {
    day: "Hari Ke-3",
    theme: "Sekolahku Rumahku! (Akrab Dan Nyaman Bersama)",
    color: "#ea580c",
    activities: [
      { time: "07.30 – 07.50 WIT", text: "Do’a pagi dan pertemuan pagi ceria" },
      { time: "07.50 – 08.00 WIT", text: "Menyanyikan lagu indonesia raya dan yel-yel sekolah" },
      { time: "08.00 – 08.30 WIT", text: "Permainan Edukatif: Tebak alat tulis" },
      { time: "08.30 – 09.00 WIT", text: "Istirahat & Snack Time (Makan sehat dan bergizi)" },
      { time: "09.00 – 09.30 WIT", text: "Simulasi kegiatan belajar (duduk rapi, meletakkan alat tulis rapi, angkat tangan, dan berani tampil ke depan)" },
      { time: "09.30 – 09.40 WIT", text: "Materi edukasi: Sopan dan santun bermedia sosial" },
      { time: "09.40 – 09.50 WIT", text: "Game edukatif: Garis Pilihanku!" },
      { time: "09.50 – 10.00 WIT", text: "Menyanyi, tepuk semangat, dan refleksi serta berdo’a sebelum pulang" }
    ]
  },
  {
    day: "Hari Ke-4",
    theme: "Eksplorasi Bakatku (Unjuk Gigi dan Ekspresi Diri)",
    color: "#eab308",
    activities: [
      { time: "07.30 – 07.50 WIT", text: "Do’a pagi dan pertemuan pagi ceria" },
      { time: "07.50 – 08.00 WIT", text: "Menyanyikan lagu indonesia raya dan yel-yel sekolah" },
      { time: "08.00 – 08.30 WIT", text: "Permainan disiplin: Susun isi tas Sekolah" },
      { time: "08.30 – 09.00 WIT", text: "Istirahat & Snack Time (Makan sehat dan bergizi)" },
      { time: "09.00 – 09.30 WIT", text: "Permainan: Detektif toilet dan UKS" },
      { time: "09.30 – 09.50 WIT", text: "Operasi Semut (Kerja bakti kilat merapikan kelas baru)" },
      { time: "09.50 – 10.00 WIT", text: "Tepuk semangat, berdo’a pulang, dan pembagian bintang semangat" }
    ]
  },
  {
    day: "Hari Ke-5",
    theme: "Aku Siap Sekolah! (Bersama Menggapai Masa Depan)",
    color: "#8b5cf6",
    activities: [
      { time: "07.30 – 07.45 WIT", text: "Jalan pagi singkat dan berdo’a pagi" },
      { time: "07.45 – 08.00 WIT", text: "Pertemuan pagi ceria dan Menyanyikan lagu indonesia raya & yel-yel sekolah" },
      { time: "08.00 – 08.30 WIT", text: "Materi karakter: Anti-Bullying & Menghargai Teman" },
      { time: "08.30 – 09.00 WIT", text: "Istirahat & Snack Time (Makan sehat dan bergizi)" },
      { time: "09.00 – 09.30 WIT", text: "Ayo sigap bencana lewat lagu!" },
      { time: "09.30 – 09.45 WIT", text: "Sambutan penutupan MPLS" },
      { time: "09.45 – 10.00 WIT", text: "Operasi Semut (Kerja bakti kilat merapikan kelas baru)" },
      { time: "10.00 – 10.15 WIT", text: "Refleksi, Tepuk semangat, serta berdo’a sebelum pulang." }
    ]
  }
];

export default function AcademicPortal({ initialCalendar = [], initialP5Projects = [], initialJadwalKBM = [] }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedEvent, setSelectedRoom] = useState(null);
  const [activeMplsDay, setActiveMplsDay] = useState(0);
  const [countdowns, setCountdowns] = useState({});

  // Build countdown from initialCalendar: extract first date from `dates` field or derive from `month`
  useEffect(() => {
    const MONTH_MAP = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };

    // Build a map of { eventId: ISO date string } from initialCalendar
    const datesMap = {};
    initialCalendar.forEach(evt => {
      if (!evt.id) return;
      // Try to extract "DD" from dates field like "13 - 17 Juli 2026" or "13 Juli 2026"
      const datesStr = (evt.dates || '').toLowerCase();
      const monthStr = (evt.month || '').toLowerCase();
      // Extract year from dates or month field
      const yearMatch = (datesStr + ' ' + monthStr).match(/\b(20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : null;
      // Extract month number from dates or month field
      let monthNum = null;
      for (const [name, num] of Object.entries(MONTH_MAP)) {
        if (datesStr.includes(name) || monthStr.includes(name)) { monthNum = num; break; }
      }
      // Extract first day number from dates field
      const dayMatch = datesStr.match(/\b(\d{1,2})\b/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      if (year && monthNum) {
        datesMap[evt.id] = `${year}-${monthNum}-${day}`;
      }
    });

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const updated = {};

      Object.entries(datesMap).forEach(([id, dateStr]) => {
        const target = new Date(dateStr + 'T07:15:00').getTime();
        const diff = target - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          updated[id] = `${days} Hari ${hours} Jam`;
        } else {
          updated[id] = 'Sedang/Sudah Terlaksana';
        }
      });

      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCalendar]);

  const handleEventClick = (row) => {
    setSelectedRoom(row);
    setActiveMplsDay(0);
  };

  const getParentTips = (id) => {
    const tips = {
      juli: [
        "Temani anak merapikan peralatan tulis dan tas baru di malam sebelum hari pertama sekolah.",
        "Ajarkan anak untuk berani memperkenalkan diri and tersenyum ramah pada guru kelas barunya.",
        "Pastikan anak sarapan pagi sehat and tidur cukup di bawah pukul 21.00 malam selama pekan MPLS."
      ],
      agustus: [
        "Bantu anak mempersiapkan pakaian olahraga bersih atau kaos bernuansa merah-putih untuk perlombaan.",
        "Saksikan bersama anak perlombaan antar kelas di sekolah untuk memberikan dukungan moral langsung.",
        "Ajak anak menghias gapura atau halaman rumah dengan bendera merah putih kecil."
      ],
      september: [
        "Pastikan anak tidak begadang dan memiliki waktu istirahat yang sangat cukup sebelum hari ANBK.",
        "Latih anak menggunakan komputer/laptop sederhana di rumah jika tersedia (fokus navigasi mouse).",
        "Hindari memberikan beban belajar berlebih di malam hari agar anak tidak mengalami jenuh/stres mental."
      ],
      desember: [
        "Buat jadwal belajar bersama yang nyaman, diselingi istirahat 10 menit setiap belajar 25 menit.",
        "Pastikan anak makan buah dan minum air putih hangat yang cukup agar stamina fisik terjaga prima.",
        "Fokuslah memberikan pujian pada usaha keras anak mempelajari materi, bukan hanya pada hasil nilai angka rapornya."
      ],
      maret: [
        "Dampingi anak memahami esensi ibadah puasa Ramadan sejak dini melalui cerita kisah teladan.",
        "Manfaatkan waktu libur awal puasa untuk sahur bersama, shalat berjamaah, dan tadarus keluarga.",
        "Diskusikan nilai kepedulian sosial dengan mengajak anak berbagi takjil ringan kepada tetangga."
      ],
      juni: [
        "Ajak anak meninjau kembali catatan materi setahun terakhir secara santai dan ceria.",
        "Siapkan rencana liburan keluarga yang edukatif dan menyehatkan setelah pembagian rapor usai.",
        "Sediakan waktu luang untuk berdialog dengan guru kelas saat pengambilan rapor mengenai tumbuh kembang anak."
      ]
    };
    return tips[id] || ["Dampingi belajar anak setiap hari, pastikan tidur cukup dan sarapan sehat sebelum berangkat sekolah."];
  };

  const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
  const currentMonth = months[new Date().getMonth()];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Tab Switcher Dashboard */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        backgroundColor: 'var(--bg-main)', 
        padding: '6px', 
        borderRadius: 'var(--radius-full)', 
        maxWidth: '720px', 
        margin: '0 auto',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-inset)',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        <button 
          onClick={() => setActiveTab('calendar')}
          style={{
            flex: '1 1 140px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            backgroundColor: activeTab === 'calendar' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'calendar' ? 'white' : 'var(--text-muted)'
          }}
        >
          📅 Kalender Akademik
        </button>
        <button 
          onClick={() => setActiveTab('p5')}
          style={{
            flex: '1 1 140px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            backgroundColor: activeTab === 'p5' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'p5' ? 'white' : 'var(--text-muted)'
          }}
        >
          🌱 Portal Proyek P5
        </button>
        <button 
          onClick={() => setActiveTab('kbm')}
          style={{
            flex: '1 1 140px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            backgroundColor: activeTab === 'kbm' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'kbm' ? 'white' : 'var(--text-muted)'
          }}
        >
          📖 Jadwal KBM Harian
        </button>
        <button 
          onClick={() => setActiveTab('grades')}
          style={{
            flex: '1 1 140px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            backgroundColor: activeTab === 'grades' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'grades' ? 'white' : 'var(--text-muted)'
          }}
        >
          📊 Rapor Siswa
        </button>
      </div>

      {/* TAB CONTENT 1: ACADEMIC CALENDAR */}
      {activeTab === 'calendar' && (
        <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
            Akses agenda resmi sekolah dengan mudah. Klik salah satu kegiatan di bawah untuk melihat **Countdown Waktu Mundur** dan **Panduan Edukatif Khusus Orang Tua**!
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--space-sm)' 
          }}>
            {initialCalendar && initialCalendar.map((row) => {
              const isCurrent = row.id === currentMonth;
              const hasCountdown = countdowns[row.id] && !countdowns[row.id].includes("Sedang");

              return (
                <div 
                  key={row.id}
                  onClick={() => handleEventClick(row)}
                  style={{
                    backgroundColor: 'white',
                    border: isCurrent ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    boxShadow: isCurrent ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isCurrent ? 'var(--shadow-lg)' : 'var(--shadow-sm)';
                  }}
                >
                  {isCurrent && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--primary-dark)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase'
                    }}>
                      Bulan Ini
                    </span>
                  )}

                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontWeight: 800, 
                    fontSize: '1.2rem', 
                    color: 'var(--primary-dark)' 
                  }}>
                    {row.month}
                  </span>

                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-main)', 
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    minHeight: '44px'
                  }}>
                    {row.desc}
                  </p>

                  <div style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '8px',
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>📅 {row.dates}</span>
                    {hasCountdown && (
                      <span style={{ color: 'var(--accent)', fontWeight: 700, backgroundColor: 'var(--accent-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                        ⏳ {countdowns[row.id].split(' ')[0]} Hari Lagi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: JADWAL KBM HARIAN */}
      {activeTab === 'kbm' && (
        <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Rincian waktu belajar harian untuk masing-masing fase kelas di SD Negeri Bobong berjalan efektif.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--space-md)' 
          }}>
            {(initialJadwalKBM && initialJadwalKBM.length > 0 ? initialJadwalKBM : []).map((kbm, idx) => (
              <div 
                key={kbm.id || idx}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-md)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'transform 0.25s, box-shadow 0.25s'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🏫</span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
                    {kbm.kelas}
                  </h3>
                </div>

                <div style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.875rem', 
                  color: 'var(--text-color)', 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  border: '1px solid var(--border-color)',
                  fontWeight: 500
                }}>
                  {kbm.hari}
                </div>

                {kbm.keterangan && (
                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    📌 {kbm.keterangan}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: P5 SHOWCASE PORTAL */}
      {activeTab === 'p5' && (
        <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
            **Projek Penguatan Profil Pelajar Pancasila (P5)** merupakan wadah pengenalan karakter berbasis kearifan lokal. Berikut panduan praktis bagi Ayah & Bunda untuk mendukung karakter anak di rumah!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {(initialP5Projects && initialP5Projects.length > 0 ? initialP5Projects : P5_PROJECTS).map((proj) => {
              const skillsArray = Array.isArray(proj.skills) 
                ? proj.skills 
                : (typeof proj.skills === 'string' ? proj.skills.split(',').map(s => s.trim()) : []);
              const parentGuideArray = Array.isArray(proj.parentGuide) 
                ? proj.parentGuide 
                : (typeof proj.parentGuide === 'string' ? proj.parentGuide.split('\n').map(p => p.trim()) : []);

              return (
                <div 
                  key={proj.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 1fr) 2fr',
                  }}
                >
                  {/* Image panel */}
                  <div style={{ position: 'relative', minHeight: '180px' }}>
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: proj.color || '#1e40af',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {proj.badge}
                    </span>
                  </div>

                  {/* Content Panel */}
                  <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.25rem', margin: 0 }}>
                      {proj.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, textAlign: 'justify' }}>
                      {proj.desc}
                    </p>

                    {/* Skills tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '2px 0' }}>
                      {skillsArray.filter(s => s && s.trim()).map((skill, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F3F4F6', color: '#4b5563' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Parent Guide Accordion/Box */}
                    <div style={{ 
                      backgroundColor: 'var(--accent-bg)', 
                      borderLeft: `4px solid ${proj.color || '#1e40af'}`, 
                      padding: '12px var(--space-md)', 
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                      marginTop: '4px'
                    }}>
                      <h4 style={{ color: proj.color || '#1e40af', fontSize: '0.9rem', margin: '0 0 6px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👪 Tips Dukungan Orang Tua di Rumah:
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {parentGuideArray.filter(t => t && t.trim()).map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: STUDENT GRADES CHECKER */}
      {activeTab === 'grades' && (
        <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
            Masukkan NISN dan Tanggal Lahir siswa untuk mengakses data rapor hasil belajar digital Kurikulum Merdeka secara aman.
          </p>
          <GradesClient />
        </div>
      )}

      {/* EVENT MODAL POPUP */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 37, 59, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '16px var(--space-sm)',
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setSelectedRoom(null)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '2px solid white',
            position: 'relative',
            animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            margin: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              padding: 'var(--space-md)',
              color: 'white',
              position: 'relative'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Agenda Akademik {selectedEvent.month}
              </span>
              <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
                {selectedEvent.desc}
              </h3>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedRoom(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: '1 1 auto' }}>
              
              {/* Target Date and countdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Tanggal Pelaksanaan</span>
                  <div style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '2px' }}>
                    📅 {selectedEvent.dates}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Hitung Mundur Acara</span>
                  <div style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 800, marginTop: '2px' }}>
                    ⌛ {countdowns[selectedEvent.id] || "Mempersiapkan..."}
                  </div>
                </div>
              </div>

              {/* Detailed MPLS Rundown Timeline */}
              {(selectedEvent.id === 'juli' || 
                (selectedEvent.desc && selectedEvent.desc.toLowerCase().includes('mpls')) ||
                (selectedEvent.title && selectedEvent.title.toLowerCase().includes('mpls'))) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff' }}>
                  <h4 style={{ color: 'var(--primary-dark)', fontSize: '0.95rem', margin: '0 0 4px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📋 Rundown Harian MPLS:
                  </h4>
                  
                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid var(--border-color)', scrollbarWidth: 'thin' }}>
                    {MPLS_RUNDOWN.map((dayData, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMplsDay(idx)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: activeMplsDay === idx ? dayData.color : '#f1f5f9',
                          color: activeMplsDay === idx ? '#ffffff' : '#475569',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {dayData.day}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '6px', borderLeft: `3px solid ${MPLS_RUNDOWN[activeMplsDay].color}` }}>
                      🎯 Tema: {MPLS_RUNDOWN[activeMplsDay].theme}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                      {MPLS_RUNDOWN[activeMplsDay].activities.map((act, actIdx) => (
                        <div key={actIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.725rem',
                            whiteSpace: 'nowrap',
                            border: '1px solid #e2e8f0'
                          }}>
                            {act.time}
                          </span>
                          <span style={{ color: '#334155', fontWeight: 500, lineHeight: 1.4, paddingTop: '1px' }}>
                            {act.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Parents Prep Guide */}
              <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid var(--secondary)', padding: '15px', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                <h4 style={{ color: 'var(--secondary-dark)', fontSize: '0.95rem', margin: '0 0 8px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  💡 Panduan Persiapan Orang Tua di Rumah:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.6 }}>
                  {getParentTips(selectedEvent.id).map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '12px var(--space-md)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#F9FAFB', flexShrink: 0 }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setSelectedRoom(null)}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Mengerti
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
