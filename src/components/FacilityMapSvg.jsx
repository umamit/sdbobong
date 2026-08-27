'use client';

export default function FacilityMapSvg(props) {
  const {
    hoveredRoom,
    setHoveredRoom,
    handleRoomClick,
    selectedRoom,
    southFloor,
    setSouthFloor
  } = props;

  return (
    <svg 
      viewBox="0 0 850 540" 
      width="100%" 
      height="100%" 
      style={{ maxWidth: '800px', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.08))' }}
    >
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
          <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#06535D" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* RUMPUT BASE */}
      <rect x="0" y="0" width="850" height="540" rx="16" fill="#E3ECDA" />

      {/* PAGAR PEMBATAS */}
      <rect x="15" y="15" width="820" height="510" rx="14" fill="none" stroke="#BACAB3" strokeWidth="2.5" strokeDasharray="6,4" />

      {/* JALUR SELASAR PENGHUBUNG */}
      <rect x="155" y="55" width="20" height="390" fill="#CBD5E1" opacity="0.8" />
      <rect x="155" y="365" width="515" height="20" fill="#CBD5E1" opacity="0.8" />

      {/* ======================================================== */}
      {/* 1. LAPANGAN UTAMA (olahraga)                             */}
      {/* ======================================================== */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('olahraga')}
        onMouseEnter={() => setHoveredRoom('olahraga')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="300" y="180" width="370" height="170" rx="8"
          fill={hoveredRoom === 'olahraga' ? '#E9D3C0' : '#EFE3D3'}
          stroke={hoveredRoom === 'olahraga' ? '#B45309' : '#D6C5B3'}
          strokeWidth={hoveredRoom === 'olahraga' ? '2.5' : '1.5'}
          style={{ transition: 'all 0.2s ease' }}
          filter={hoveredRoom === 'olahraga' ? 'url(#shadow-premium)' : ''}
        />
        <rect x="330" y="210" width="310" height="110" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        <circle cx="485" cy="265" r="20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        
        {/* Tiang Bendera */}
        <g transform="translate(485, 265)">
          <circle cx="0" cy="0" r="3" fill="#334155" />
          <line x1="0" y1="0" x2="0" y2="-45" stroke="#334155" strokeWidth="2.5" />
          <path d="M0,-45 C6,-48 12,-42 18,-45 L18,-39 C12,-36 6,-42 0,-39 Z" fill="#EF4444" />
          <path d="M0,-39 C6,-42 12,-36 18,-39 L18,-33 C12,-30 6,-36 0,-33 Z" fill="#F9FAFB" stroke="#E2E8F0" strokeWidth="0.5" />
        </g>
        
        <text x="485" y="335" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill={hoveredRoom === 'olahraga' ? '#513725' : '#735745'} textAnchor="middle">
          LAPANGAN UTAMA
        </text>
      </g>

      {/* ======================================================== */}
      {/* 2. AREA GERBANG & PARKIR (SISI KANAN / TIMUR)             */}
      {/* ======================================================== */}
      {/* Gerbang (Sisi Kanan Atas) */}
      <g transform="translate(690, 45)">
        <rect x="0" y="0" width="120" height="40" rx="4" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="60" y="24" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#1E293B" textAnchor="middle">GERBANG</text>
      </g>
      {/* Area Parkir (Di bawah Gerbang) */}
      <g transform="translate(690, 100)">
        <rect x="0" y="0" width="120" height="70" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="20" y1="5" x2="20" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="50" y1="5" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="80" y1="5" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <text x="60" y="58" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#1E293B" textAnchor="middle">AREA PARKIR</text>
      </g>

      {/* ======================================================== */}
      {/* 3. GUGUSAN GEDUNG UTARA (TERPISAH)                       */}
      {/* ======================================================== */}
      {/* Gedung Kelas 2A & 5A (Tengah Utara) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2a_5a')}
          onMouseEnter={() => setHoveredRoom('kelas_2a_5a')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="390" y="55" width="130" height="90" rx="4" fill={hoveredRoom === 'kelas_2a_5a' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="390" y1="100" x2="520" y2="100" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="455" y="90" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">KELAS 2A & 5A</text>
          <text x="455" y="120" fontFamily="var(--font-body)" fontSize="8.5" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2a_5a' && <rect x="392" y="57" width="126" height="86" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Gedung Kelas 2B & 5B (Kanan Utara) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2b_5b')}
          onMouseEnter={() => setHoveredRoom('kelas_2b_5b')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="540" y="55" width="130" height="90" rx="4" fill={hoveredRoom === 'kelas_2b_5b' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="540" y1="100" x2="670" y2="100" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="605" y="90" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">KELAS 2B & 5B</text>
          <text x="605" y="120" fontFamily="var(--font-body)" fontSize="8.5" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2b_5b' && <rect x="542" y="57" width="126" height="86" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Gedung UKS / Gudang (Kiri Utara) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('uks_gudang')}
          onMouseEnter={() => setHoveredRoom('uks_gudang')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="300" y="55" width="75" height="90" rx="4" fill={hoveredRoom === 'uks_gudang' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="300" y1="100" x2="375" y2="100" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="337" y="90" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">UKS</text>
          <text x="337" y="115" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#FFFFFF" textAnchor="middle">& GUDANG</text>
          {hoveredRoom === 'uks_gudang' && <rect x="302" y="57" width="71" height="86" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* ======================================================== */}
      {/* 4. LAHAN RENCANA & GAZEBO (SISI KIRI / BARAT)             */}
      {/* ======================================================== */}
      {/* Lahan Rencana Barat (Bekas PAUD) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="35" y="55" width="245" height="230" rx="8"
          fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4"
          style={{ transition: '0.2s' }}
        />
        <text x="157" y="160" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#64748B" textAnchor="middle">
          LAHAN RENCANA
        </text>
        {hoveredRoom === 'lahan_rencana' && <rect x="37" y="57" width="241" height="226" fill="rgba(148,163,184,0.05)" rx="6" />}
      </g>

      {/* Gazebo di Lahan Rencana Barat */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('gazebo_lahan')}
          onMouseEnter={() => setHoveredRoom('gazebo_lahan')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <polygon points="125,230 157,205 190,230" fill={hoveredRoom === 'gazebo_lahan' ? '#34D399' : '#059669'} style={{ transition: '0.2s' }} />
          <polygon points="120,230 195,230 185,240 130,240" fill={hoveredRoom === 'gazebo_lahan' ? '#059669' : '#047857'} style={{ transition: '0.2s' }} />
          <line x1="135" y1="240" x2="135" y2="260" stroke="#78350F" strokeWidth="2.5" />
          <line x1="180" y1="240" x2="180" y2="260" stroke="#78350F" strokeWidth="2.5" />
          <polygon points="130,260 185,260 175,270 140,270" fill={hoveredRoom === 'gazebo_lahan' ? '#F59E0B' : '#D97706'} style={{ transition: '0.2s' }} />
          <text x="157" y="253" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">GAZEBO</text>
          {hoveredRoom === 'gazebo_lahan' && <rect x="117" y="202" width="81" height="71" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana Tengah (Antara Kelas 2A & 2B) */}
      <rect x="525" y="100" width="10" height="45" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,2" />

      {/* Lahan Rencana Kanan Bawah */}
      <rect x="690" y="180" width="120" height="170" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />

      {/* ======================================================== */}
      {/* 5. POJOK KIRI BAWAH (WC & LAHAN RENCANA KECIL)            */}
      {/* ======================================================== */}
      {/* WC Guru & Murid */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('wc_toilet')}
          onMouseEnter={() => setHoveredRoom('wc_toilet')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="180" y="445" width="85" height="40" rx="3" fill={hoveredRoom === 'wc_toilet' ? '#34D399' : '#10B981'} style={{ transition: '0.2s' }} />
          <line x1="222" y1="445" x2="222" y2="485" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
          <text x="201" y="468" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#FFFFFF" textAnchor="middle">WC GURU</text>
          <text x="243" y="468" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#FFFFFF" textAnchor="middle">WC SISWA</text>
          {hoveredRoom === 'wc_toilet' && <rect x="182" y="447" width="81" height="36" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana Kiri Bawah */}
      <rect x="35" y="425" width="100" height="60" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="85" y="460" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#64748B" textAnchor="middle">LAHAN RENCANA</text>

      {/* ======================================================== */}
      {/* 6. GEDUNG UTAMA (SELATAN - 2 LANTAI DENGAN TOGGLE)       */}
      {/* ======================================================== */}
      <g filter="url(#shadow-premium)">
        {/* VIEW LANTAI 1 */}
        {southFloor === 1 && (
          <g>
            {/* L1 - Ruang Guru/Kantor (Kiri) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_guru')}
              onMouseEnter={() => setHoveredRoom('l1_guru')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="280,395 390,395 390,435 280,435" fill={hoveredRoom === 'l1_guru' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="280,435 390,435 390,475 280,475" fill={hoveredRoom === 'l1_guru' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="390" y1="395" x2="390" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="335" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KANTOR GURU (L1)</text>
              {hoveredRoom === 'l1_guru' && <rect x="282" y="397" width="106" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1A & 4A (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1a_4a')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1a_4a')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="390,395 530,395 530,435 390,435" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="390,435 530,435 530,475 390,475" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="530" y1="395" x2="530" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="460" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KELAS 1A/4A (L1)</text>
              {hoveredRoom === 'l1_kelas_1a_4a' && <rect x="392" y="397" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1B & 4B (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1b_4b')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1b_4b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="530,395 670,395 670,435 530,435" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="530,435 670,435 670,475 530,475" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="600" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KELAS 1B/4B (L1)</text>
              {hoveredRoom === 'l1_kelas_1b_4b' && <rect x="532" y="397" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>
          </g>
        )}

        {/* VIEW LANTAI 2 */}
        {southFloor === 2 && (
          <g>
            {/* L2 - Kelas 6A (Kiri dekat tangga) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_6a')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_6a')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="280,395 390,395 390,435 280,435" fill={hoveredRoom === 'l2_kelas_6a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="280,435 390,435 390,475 280,475" fill={hoveredRoom === 'l2_kelas_6a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="390" y1="395" x2="390" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="335" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KELAS 6A (L2)</text>
              {hoveredRoom === 'l2_kelas_6a' && <rect x="282" y="397" width="106" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 6B & 3B (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_6b_3b')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_6b_3b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="390,395 530,395 530,435 390,435" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="390,435 530,435 530,475 390,475" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="530" y1="395" x2="530" y2="475" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="460" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KELAS 6B/3B (L2)</text>
              {hoveredRoom === 'l2_kelas_6b_3b' && <rect x="392" y="397" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 3C & 4C (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_3c_4c')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_3c_4c')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="530,395 670,395 670,435 530,435" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="530,435 670,435 670,475 530,475" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="600" y="440" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">KELAS 3C/4C (L2)</text>
              {hoveredRoom === 'l2_kelas_3c_4c' && <rect x="532" y="397" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>
          </g>
        )}

        {/* Tangga Kiri (l1 ke l2) */}
        <g transform="translate(180, 395)">
          <rect x="0" y="0" width="100" height="80" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <line x1="0" y1="10" x2="100" y2="10" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="30" x2="100" y2="30" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="#475569" strokeWidth="1.5" />
          <text x="50" y="45" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#1E293B" textAnchor="middle">TANGGA</text>
        </g>

        {/* Ridge Crest Line */}
        <line x1="180" y1="435" x2="670" y2="435" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
        
        {/* Toggle Tingkat Gedung Utama */}
        <rect x="390" y="458" width="80" height="15" rx="3" fill="#1E293B" opacity="0.9" />
        <text x="430" y="469" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#F8FAFC" textAnchor="middle">
          {southFloor === 1 ? "MENUJU L2 ➔" : "MENUJU L1 ➔"}
        </text>
        <rect 
          x="390" y="458" width="80" height="15" rx="3" 
          fill="#000000"
          fillOpacity="0"
          pointerEvents="all"
          style={{ cursor: 'pointer' }} 
          onClick={() => setSouthFloor(southFloor === 1 ? 2 : 1)} 
        />
      </g>

      {/* Kompas Mata Angin */}
      <g transform="translate(760, 460)" opacity="0.8">
        <circle cx="0" cy="0" r="24" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="0" y1="-22" x2="0" y2="22" stroke="#475569" strokeWidth="1" />
        <line x1="-22" y1="0" x2="22" y2="0" stroke="#475569" strokeWidth="1" />
        <polygon points="0,-20 3,-5 0,0" fill="#EF4444" />
        <polygon points="0,-20 -3,-5 0,0" fill="#F87171" />
        <text x="0" y="-26" fontFamily="var(--font-heading)" fontWeight="900" fontSize="10" fill="#EF4444" textAnchor="middle">U</text>
      </g>
    </svg>
  );
}
