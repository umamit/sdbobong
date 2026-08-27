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

      {/* GERBANG UTARA (Sisi Atas Tengah) */}
      <g transform="translate(415, 15)">
        <rect x="0" y="0" width="70" height="15" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
        <text x="35" y="11" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#1E293B" textAnchor="middle">GERBANG</text>
      </g>

      {/* ======================================================== */}
      {/* GUGUSAN GEDUNG UTARA (KIRI KE KANAN SISI ATAS)            */}
      {/* ======================================================== */}
      
      {/* Gedung Kelas 2A & 5A (Barat Laut / Kiri Atas - Vertikal) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2a_5a')}
          onMouseEnter={() => setHoveredRoom('kelas_2a_5a')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="40" y="45" width="110" height="135" rx="4" fill={hoveredRoom === 'kelas_2a_5a' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="40" y1="112" x2="150" y2="112" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="95" y="100" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10.5" fill="#FFFFFF" textAnchor="middle">KELAS 2A & 5A</text>
          <text x="95" y="135" fontFamily="var(--font-body)" fontSize="8" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2a_5a' && <rect x="42" y="47" width="106" height="131" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
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
          <rect x="40" y="190" width="110" height="40" rx="4" fill={hoveredRoom === 'uks_gudang' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <text x="95" y="214" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">UKS/GUDANG</text>
          {hoveredRoom === 'uks_gudang' && <rect x="42" y="192" width="106" height="36" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Gedung Kelas 2B & 5B (Utara Tengah-Kiri) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('kelas_2b_5b')}
          onMouseEnter={() => setHoveredRoom('kelas_2b_5b')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <rect x="175" y="45" width="115" height="110" rx="4" fill={hoveredRoom === 'kelas_2b_5b' ? '#60A5FA' : '#3B82F6'} style={{ transition: '0.2s' }} />
          <line x1="175" y1="100" x2="290" y2="100" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <text x="232" y="90" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10.5" fill="#FFFFFF" textAnchor="middle">KELAS 2B & 5B</text>
          <text x="232" y="120" fontFamily="var(--font-body)" fontSize="8" fill="#E2E8F0" textAnchor="middle">(Shift Pagi/Siang)</text>
          {hoveredRoom === 'kelas_2b_5b' && <rect x="177" y="47" width="111" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* AREA PARKIR (Utara Tengah-Kanan) */}
      <g transform="translate(310, 45)" filter="url(#shadow-premium)">
        <rect x="0" y="0" width="135" height="80" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="25" y1="5" x2="25" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="60" y1="5" x2="60" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="95" y1="5" x2="95" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2,2" />
        <text x="67" y="68" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#1E293B" textAnchor="middle">AREA PARKIR</text>
      </g>

      {/* ======================================================== */}
      {/* TENGAH & KIRI PETA (LAPANGAN & LAHAN RENCANA)             */}
      {/* ======================================================== */}
      
      {/* Lahan Rencana Tengah (Di bawah Kelas 2B & 5B) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect x="175" y="165" width="115" height="120" rx="6" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="232" y="230" fontFamily="var(--font-heading)" fontWeight="800" fontSize="10" fill="#64748B" textAnchor="middle">LAHAN RENCANA</text>
      </g>

      {/* LAPANGAN (Tengah-Tengah) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('olahraga')}
        onMouseEnter={() => setHoveredRoom('olahraga')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="310" y="135" width="200" height="180" rx="8"
          fill={hoveredRoom === 'olahraga' ? '#E9D3C0' : '#EFE3D3'}
          stroke={hoveredRoom === 'olahraga' ? '#B45309' : '#D6C5B3'}
          strokeWidth={hoveredRoom === 'olahraga' ? '2.5' : '1.5'}
          style={{ transition: 'all 0.2s ease' }}
          filter={hoveredRoom === 'olahraga' ? 'url(#shadow-premium)' : ''}
        />
        <rect x="325" y="150" width="170" height="150" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        <circle cx="410" cy="225" r="20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
        <g transform="translate(410, 225)">
          <circle cx="0" cy="0" r="3" fill="#334155" />
          <line x1="0" y1="0" x2="0" y2="-45" stroke="#334155" strokeWidth="2.5" />
          <path d="M0,-45 C6,-48 12,-42 18,-45 L18,-39 C12,-36 6,-42 0,-39 Z" fill="#EF4444" />
          <path d="M0,-39 C6,-42 12,-36 18,-39 L18,-33 C12,-30 6,-36 0,-33 Z" fill="#F9FAFB" stroke="#E2E8F0" strokeWidth="0.5" />
        </g>
        <text x="410" y="295" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill={hoveredRoom === 'olahraga' ? '#513725' : '#735745'} textAnchor="middle">
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
        <rect x="530" y="45" width="280" height="375" rx="8" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
        <text x="670" y="270" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#64748B" textAnchor="middle">LAHAN RENCANA</text>
      </g>

      {/* Gazebo 2 di Lahan Rencana Timur (Atas) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('gazebo_timur')}
          onMouseEnter={() => setHoveredRoom('gazebo_timur')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <polygon points="695,120 720,98 745,120" fill={hoveredRoom === 'gazebo_timur' ? '#34D399' : '#059669'} style={{ transition: '0.2s' }} />
          <polygon points="691,120 749,120 741,128 699,128" fill={hoveredRoom === 'gazebo_timur' ? '#059669' : '#047857'} style={{ transition: '0.2s' }} />
          <line x1="707" y1="128" x2="707" y2="146" stroke="#78350F" strokeWidth="2" />
          <line x1="733" y1="128" x2="733" y2="146" stroke="#78350F" strokeWidth="2" />
          <polygon points="699,146 741,146 733,154 707,154" fill={hoveredRoom === 'gazebo_timur' ? '#F59E0B' : '#D97706'} style={{ transition: '0.2s' }} />
          <text x="720" y="140" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7" fill="#FFFFFF" textAnchor="middle">GAZEBO 2</text>
          {hoveredRoom === 'gazebo_timur' && <rect x="688" y="95" width="64" height="62" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="3" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Gazebo 1 di Lahan Rencana Timur (Bawah) */}
      <g filter="url(#shadow-premium)">
        <g 
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoomClick('gazebo_lahan')}
          onMouseEnter={() => setHoveredRoom('gazebo_lahan')}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <polygon points="695,200 720,178 745,200" fill={hoveredRoom === 'gazebo_lahan' ? '#34D399' : '#059669'} style={{ transition: '0.2s' }} />
          <polygon points="691,200 749,200 741,208 699,208" fill={hoveredRoom === 'gazebo_lahan' ? '#059669' : '#047857'} style={{ transition: '0.2s' }} />
          <line x1="707" y1="208" x2="707" y2="226" stroke="#78350F" strokeWidth="2" />
          <line x1="733" y1="208" x2="733" y2="226" stroke="#78350F" strokeWidth="2" />
          <polygon points="699,226 741,226 733,234 707,234" fill={hoveredRoom === 'gazebo_lahan' ? '#F59E0B' : '#D97706'} style={{ transition: '0.2s' }} />
          <text x="720" y="220" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7" fill="#FFFFFF" textAnchor="middle">GAZEBO 1</text>
          {hoveredRoom === 'gazebo_lahan' && <rect x="688" y="175" width="64" height="62" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="3" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana PAUD (Barat Daya / Kiri Bawah) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect 
          x="40" y="245" width="250" height="260" rx="8"
          fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4"
          style={{ transition: '0.2s' }}
        />
        <text x="165" y="360" fontFamily="var(--font-heading)" fontWeight="800" fontSize="12" fill="#64748B" textAnchor="middle">
          LAHAN RENCANA
        </text>
        {hoveredRoom === 'lahan_rencana' && <rect x="42" y="247" width="246" height="256" fill="rgba(148,163,184,0.05)" rx="6" />}
      </g>

      {/* ======================================================== */}
      {/* GEDUNG UTAMA (BAWAH / SELATAN - 2 LANTAI DENGAN TOGGLE)   */}
      {/* ======================================================== */}
      
      {/* SELASAR GEDUNG UTAMA */}
      <rect x="310" y="325" width="500" height="15" fill="#CBD5E1" opacity="0.8" />
      <text x="560" y="336" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#475569" textAnchor="middle">SELASAR</text>

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
              <polygon points="350,340 470,340 470,380 350,380" fill={hoveredRoom === 'l1_guru' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="350,380 470,380 470,420 350,420" fill={hoveredRoom === 'l1_guru' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="470" y1="340" x2="470" y2="420" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="410" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KANTOR GURU (L1)</text>
              {hoveredRoom === 'l1_guru' && <rect x="352" y="342" width="116" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1A & 4A (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1a_4a')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1a_4a')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="470,340 625,340 625,380 470,380" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="470,380 625,380 625,420 470,420" fill={hoveredRoom === 'l1_kelas_1a_4a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="625" y1="340" x2="625" y2="420" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="547" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 1A/4A (L1)</text>
              {hoveredRoom === 'l1_kelas_1a_4a' && <rect x="472" y="342" width="151" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L1 - Kelas 1B & 4B (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l1_kelas_1b_4b')}
              onMouseEnter={() => setHoveredRoom('l1_kelas_1b_4b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="625,340 780,340 780,380 625,380" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="625,380 780,380 780,420 625,420" fill={hoveredRoom === 'l1_kelas_1b_4b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="702" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 1B/4B (L1)</text>
              {hoveredRoom === 'l1_kelas_1b_4b' && <rect x="627" y="342" width="151" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>
          </g>
        )}

        {/* VIEW LANTAI 2 */}
        {southFloor === 2 && (
          <g>
            {/* L2 - Kelas 6A (Kiri) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_6a')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_6a')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="350,340 470,340 470,380 350,380" fill={hoveredRoom === 'l2_kelas_6a' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="350,380 470,380 470,420 350,420" fill={hoveredRoom === 'l2_kelas_6a' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="470" y1="340" x2="470" y2="420" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="410" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 6A (L2)</text>
              {hoveredRoom === 'l2_kelas_6a' && <rect x="352" y="342" width="116" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 6B & 3B (Tengah) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_6b_3b')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_6b_3b')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="470,340 625,340 625,380 470,380" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="470,380 625,380 625,420 470,420" fill={hoveredRoom === 'l2_kelas_6b_3b' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <line x1="625" y1="340" x2="625" y2="420" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" />
              <text x="547" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 6B/3B (L2)</text>
              {hoveredRoom === 'l2_kelas_6b_3b' && <rect x="472" y="342" width="151" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>

            {/* L2 - Kelas 3C & 4C (Kanan) */}
            <g 
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoomClick('l2_kelas_3c_4c')}
              onMouseEnter={() => setHoveredRoom('l2_kelas_3c_4c')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <polygon points="625,340 780,340 780,380 625,380" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#EF4444' : '#C53030'} style={{ transition: '0.2s' }} />
              <polygon points="625,380 780,380 780,420 625,420" fill={hoveredRoom === 'l2_kelas_3c_4c' ? '#C53030' : '#9B2C2C'} style={{ transition: '0.2s' }} />
              <text x="702" y="385" fontFamily="var(--font-heading)" fontWeight="800" fontSize="9.5" fill="#FFFFFF" textAnchor="middle">KELAS 3C/4C (L2)</text>
              {hoveredRoom === 'l2_kelas_3c_4c' && <rect x="627" y="342" width="151" height="76" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="2" filter="url(#glow-red)" />}
            </g>
          </g>
        )}

        {/* Tangga Akses Kiri (Sisi Kiri Gedung Utama) */}
        <g transform="translate(310, 340)">
          <rect x="0" y="0" width="40" height="80" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <line x1="5" y1="0" x2="5" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="0" x2="10" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="15" y1="0" x2="15" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="30" y1="0" x2="30" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="35" y1="0" x2="35" y2="80" stroke="#475569" strokeWidth="1" />
          <text x="20" y="45" fontFamily="var(--font-heading)" fontWeight="900" fontSize="9" fill="#1E293B" textAnchor="middle" transform="rotate(-90 20 45)">TANGGA</text>
        </g>

        {/* Ridge Crest Line */}
        <line x1="310" y1="380" x2="780" y2="380" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
        
        {/* Toggle Tingkat Gedung Utama */}
        <rect x="520" y="430" width="80" height="15" rx="3" fill="#1E293B" opacity="0.9" />
        <text x="560" y="441" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#F8FAFC" textAnchor="middle">
          {southFloor === 1 ? "MENUJU L2 ➔" : "MENUJU L1 ➔"}
        </text>
        <rect 
          x="520" y="430" width="80" height="15" rx="3" 
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
          <rect x="310" y="430" width="90" height="40" rx="3" fill={hoveredRoom === 'wc_toilet' ? '#34D399' : '#10B981'} style={{ transition: '0.2s' }} />
          <line x1="355" y1="430" x2="355" y2="470" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
          <text x="332" y="453" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#FFFFFF" textAnchor="middle">WC GURU</text>
          <text x="377" y="453" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#FFFFFF" textAnchor="middle">WC GURU</text>
          {hoveredRoom === 'wc_toilet' && <rect x="312" y="432" width="86" height="36" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="2" filter="url(#glow-blue)" />}
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
          <rect x="520" y="465" width="65" height="25" rx="3" fill={hoveredRoom === 'wc_toilet' ? '#34D399' : '#10B981'} style={{ transition: '0.2s' }} />
          <text x="552" y="480" fontFamily="var(--font-heading)" fontWeight="800" fontSize="8" fill="#FFFFFF" textAnchor="middle">WC SISWA</text>
          {hoveredRoom === 'wc_toilet' && <rect x="522" y="467" width="61" height="21" fill="none" stroke="#FFFFFF" strokeWidth="1.5" rx="1" filter="url(#glow-blue)" />}
        </g>
      </g>

      {/* Lahan Rencana Kecil Kanan Bawah (Paling Kanan Sisi Bawah) */}
      <g 
        style={{ cursor: 'pointer' }}
        onClick={() => handleRoomClick('lahan_rencana')}
        onMouseEnter={() => setHoveredRoom('lahan_rencana')}
        onMouseLeave={() => setHoveredRoom(null)}
      >
        <rect x="800" y="425" width="25" height="75" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="812" y="462" fontFamily="var(--font-heading)" fontWeight="800" fontSize="7.5" fill="#64748B" textAnchor="middle" transform="rotate(-90 812 462)">LAHAN RENCANA</text>
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
