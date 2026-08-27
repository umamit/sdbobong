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

      {/* GERBANG UTARA (Sisi Atas Tengah-Kanan) */}
      <g transform="translate(480, 15)">
        <rect x="0" y="0" width="100" height="20" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="50" y="13" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#1E293B" textAnchor="middle">🚪 GERBANG</text>
      </g>

      {/* AREA PARKIR (Utara Tengah - Kanan Gerbang) */}
      <g transform="translate(380, 45)" filter="url(#shadow-premium)">
        <rect x="0" y="0" width="160" height="65" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="30" y1="5" x2="30" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="70" y1="5" x2="70" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="110" y1="5" x2="110" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <text x="80" y="55" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#1E293B" textAnchor="middle">AREA PARKIR</text>
      </g>

      {/* ======================================================== */}
      {/* SISI KIRI (BARAT LAUT & BARAT TENGAH)                     */}
      {/* ======================================================== */}
      
      {/* Gedung Kelas 2A & 5A (Barat Laut / Kiri Atas) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2a_5a')}
          onMouseEnter={() => setHoveredRoom('kelas_2a_5a')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="40" y="45" width="125" height="110" rx="4" fill={hoveredRoom === 'kelas_2a_5a' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="40" y1="100" x2="165" y2="100" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="102" y="90" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">KELAS 2A & 5A</text>
          <text x="102" y="125" fontFamily="var(--font-body)" fontSize="8.5" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2a_5a' && <rect x="42" y="47" width="121" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* UKS / Gudang (Di bawah Kelas 2A & 5A) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('uks_gudang')}
          onMouseEnter={() => setHoveredRoom('uks_gudang')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="40" y="165" width="125" height="50" rx="4" fill={hoveredRoom === 'uks_gudang' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <text x="102" y="195" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#FFFFFF" textAnchor="middle">UKS / GUDANG</text>
          {hoveredRoom === 'uks_gudang' && <rect x="42" y="167" width="121" height="46" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana PAUD (Kiri Bawah / Barat Daya) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="40" y="235" width="245" height="235" rx="8"
          fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4"
          style={{ transition: '0.2s' }}
        />
        <text x="162" y="340" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#64748B" textAnchor="middle">
          LAHAN RENCANA
        </text>
        {hoveredRoom === 'lahan_rencana' && <rect x="42" y="237" width="241" height="231" fill="rgba(148,163,184,0.05)" rx="6" />}
      </g>

      {/* Gazebo di atas Lahan Rencana Barat */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('gazebo_lahan')}
          onMouseEnter={() => setHoveredRoom('gazebo_lahan')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <polygon points="130,370 162,345 195,370" fill={hoveredRoom === 'gazebo_lahan' ? '#34D399' : '#059669'} style={{ transition: '0.2s' }} />
          <polygon points="125,370 200,370 190,380 135,380" fill={hoveredRoom === 'gazebo_lahan' ? '#059669' : '#047857'} style={{ transition: '0.2s' }} />
          <line x1="140" y1="380" x2="140" y2="400" stroke="#78350F" strokeWidth="2.5" />
          <line x1="185" y1="380" x2="185" y2="400" stroke="#78350F" strokeWidth="2.5" />
          <polygon points="135,400 190,400 180,410 145,410" fill={hoveredRoom === 'gazebo_lahan' ? '#F59E0B' : '#D97706'} style={{ transition: '0.2s' }} />
          <text x="162" y="393" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">GAZEBO</text>
          {hoveredRoom === 'gazebo_lahan' && <rect x="122" y="342" width="81" height="71" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* ======================================================== */}
      {/* SISI TENGAH & TIMUR (UTARA - TENGAH - KANAN)              */}
      {/* ======================================================== */}
      
      {/* Gedung Kelas 2B & 5B (Utara Tengah-Kanan) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2b_5b')}
          onMouseEnter={() => setHoveredRoom('kelas_2b_5b')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="200" y="45" width="130" height="90" rx="4" fill={hoveredRoom === 'kelas_2b_5b' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="200" y1="90" x2="330" y2="90" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="265" y="80" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">KELAS 2B & 5B</text>
          <text x="265" y="110" fontFamily="var(--font-body)" fontSize="8.5" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2b_5b' && <rect x="202" y="47" width="126" height="86" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana Tengah (Di bawah Kelas 2B & 5B) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect x="185" y="150" width="160" height="110" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="265" y="210" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#64748B" textAnchor="middle">LAHAN RENCANA</text>
      </g>

      {/* LAPANGAN UTAMA (Tengah) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('olahraga')}
        onMouseEnter={() => setHoveredRoom('olahraga')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="360" y="125" width="235" height="175" rx="8"
          fill={hoveredRoom === 'olahraga' ? '#E9D3C0' : '#EFE3D3'}
          stroke={hoveredRoom === 'olahraga' ? '#B45309' : '#D6C5B3'}
          strokeWidth={hoveredRoom === 'olahraga' ? '2.5' : '1.5'}
          style={{ transition: 'all 0.2s ease' }}
          filter={hoveredRoom === 'olahraga' ? 'url(#shadow-premium)' : ''}
        />
        <rect x="380" y="145" width="195" height="135" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        <circle cx="477" cy="212" r="20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        <g transform="translate(477, 212)">
          <circle cx="0" cy="0" r="3" fill="#334155" />
          <line x1="0" y1="0" x2="0" y2="-45" stroke="#334155" strokeWidth="2.5" />
          <path d="M0,-45 C6,-48 12,-42 18,-45 L18,-39 C12,-36 6,-42 0,-39 Z" fill="#EF4444" />
          <path d="M0,-39 C6,-42 12,-36 18,-39 L18,-33 C12,-30 6,-36 0,-33 Z" fill="#F9FAFB" stroke="#E2E8F0" strokeWidth="0.5" />
        </g>
        <text x="477" y="290" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill={hoveredRoom === 'olahraga' ? '#513725' : '#735745'} textAnchor="middle">
          LAPANGAN
        </text>
      </g>

      {/* Lahan Rencana Besar Kanan (Timur) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect x="615" y="45" width="195" height="365" rx="8" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
        <text x="712" y="235" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#64748B" textAnchor="middle">LAHAN RENCANA</text>
      </g>

      {/* ======================================================== */}
      {/* SISI BAWAH (SELATAN - GEDUNG UTAMA & TOILET)               */}
      {/* ======================================================== */}
      
      {/* SELASAR GEDUNG UTAMA */}
      <rect x="350" y="315" width="460" height="20" fill="#CBD5E1" opacity="0.8" />
      <text x="580" y="329" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9" fill="#475569" textAnchor="middle">SELASAR</text>

      {/* GEDUNG UTAMA (SELATAN - 2 LANTAI DENGAN TOGGLE) */}
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
              <polygon points="350,335 460,335 460,375 350,375" fill={hoveredRoom === 'l1_guru' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="350,375 460,375 460,415 350,415" fill={hoveredRoom === 'l1_guru' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="460" y1="335" x2="460" y2="415" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="405" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KANTOR GURU (L1)</text>
              {hoveredRoom === 'l1_guru' && <rect x="352" y="337" width="106" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1A & 4A (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1a_4a')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1a_4a')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="460,335 600,335 600,375 460,375" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="460,375 600,375 600,415 460,415" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="600" y1="335" x2="600" y2="415" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="530" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 1A/4A (L1)</text>
              {hoveredRoom === 'l1_kelas_1a_4a' && <rect x="462" y="337" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1B & 4B (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1b_4b')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1b_4b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="600,335 740,335 740,375 600,375" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="600,375 740,375 740,415 600,415" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="670" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 1B/4B (L1)</text>
              {hoveredRoom === 'l1_kelas_1b_4b' && <rect x="602" y="337" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
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
              <polygon points="350,335 460,335 460,375 350,375" fill={hoveredRoom === 'l2_kelas_6a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="350,375 460,375 460,415 350,415" fill={hoveredRoom === 'l2_kelas_6a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="460" y1="335" x2="460" y2="415" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="405" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 6A (L2)</text>
              {hoveredRoom === 'l2_kelas_6a' && <rect x="352" y="337" width="106" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 6B & 3B (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_6b_3b')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_6b_3b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="460,335 600,335 600,375 460,375" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="460,375 600,375 600,415 460,415" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="600" y1="335" x2="600" y2="415" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="530" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 6B/3B (L2)</text>
              {hoveredRoom === 'l2_kelas_6b_3b' && <rect x="462" y="337" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 3C & 4C (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_3c_4c')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_3c_4c')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="600,335 740,335 740,375 600,375" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="600,375 740,375 740,415 600,415" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="670" y="380" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 3C/4C (L2)</text>
              {hoveredRoom === 'l2_kelas_3c_4c' && <rect x="602" y="337" width="136" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>
          </g>
        )}

        {/* Tangga Akses Kiri (Sisi Kiri Gedung Utama) */}
        <g transform="translate(350, 335)">
          <rect x="0" y="0" width="30" height="80" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <line x1="5" y1="0" x2="5" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="0" x2="10" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="15" y1="0" x2="15" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="80" stroke="#475569" strokeWidth="1" />
          <text x="15" y="45" fontFamily="var(--font-heading)" fontWeight="900" fontSize="8" fill="#1E293B" textAnchor="middle" transform="rotate(-90 15 45)">TANGGA</text>
        </g>

        {/* Ridge Crest Line */}
        <line x1="350" y1="375" x2="740" y2="375" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
        
        {/* Toggle Tingkat Gedung Utama */}
        <rect x="510" y="425" width="80" height="15" rx="3" fill="#1E293B" opacity="0.9" />
        <text x="550" y="436" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#F8FAFC" textAnchor="middle">
          {southFloor === 1 ? "MENUJU L2 ➔" : "MENUJU L1 ➔"}
        </text>
        <rect 
          x="510" y="425" width="80" height="15" rx="3" 
          fill="#000000"
          fillOpacity="0"
          pointerEvents="all"
          style={{ cursor: 'pointer' }} 
          onClick={() => setSouthFloor(southFloor === 1 ? 2 : 1)} 
        />
      </g>

      {/* WC Guru (Di bawah Tangga Gedung Utama) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('wc_toilet')}
          onMouseEnter={() => setHoveredRoom('wc_toilet')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="350" y="430" width="75" height="40" rx="3" fill={hoveredRoom === 'wc_toilet' ? '#34D399' : '#10B981'} style={{ transition: '0.2s' }} />
          <line x1="387" y1="430" x2="387" y2="470" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
          <text x="368" y="453" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#FFFFFF" textAnchor="middle">WC GURU</text>
          <text x="406" y="453" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#FFFFFF" textAnchor="middle">WC GURU</text>
          {hoveredRoom === 'wc_toilet' && <rect x="352" y="432" width="71" height="36" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* WC Murid (Kanan Bawah Toilet) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('wc_toilet')}
          onMouseEnter={() => setHoveredRoom('wc_toilet')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="520" y="460" width="60" height="25" rx="3" fill={hoveredRoom === 'wc_toilet' ? '#34D399' : '#10B981'} style={{ transition: '0.2s' }} />
          <text x="550" y="475" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">WC SISWA</text>
          {hoveredRoom === 'wc_toilet' && <rect x="522" y="462" width="56" height="21" fill="none" stroke="#FFFFFF" strokeWidth="1.5" rx="1" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana Kecil Kanan Bawah */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect x="765" y="425" width="45" height="75" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="787" y="465" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#64748B" textAnchor="middle" transform="rotate(-90 787 465)">LAHAN RENCANA</text>
      </g>

      {/* Kompas Mata Angin */}
      <g transform="translate(800, 30)" opacity="0.8">
        <circle cx="0" cy="0" r="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
        <line x1="0" y1="-16" x2="0" y2="16" stroke="#475569" strokeWidth="0.8" />
        <line x1="-16" y1="0" x2="16" y2="0" stroke="#475569" strokeWidth="0.8" />
        <polygon points="0,-15 2,-4 0,0" fill="#EF4444" />
        <polygon points="0,-15 -2,-4 0,0" fill="#F87171" />
        <text x="0" y="-20" fontFamily="var(--font-heading)" fontWeight="900" fontSize="8" fill="#EF4444" textAnchor="middle">U</text>
      </g>
    </svg>
  );
}
