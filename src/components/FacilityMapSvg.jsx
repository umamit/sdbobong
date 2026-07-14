'use client';



export default function FacilityMapSvg(props) {
  const {
    hoveredRoom,
    setHoveredRoom,
    handleRoomClick,
    selectedRoom,
    southFloor
  } = props;

  return (
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
            
            {/* --- GEDUNG BARAT LAUT: BLOK KIRI (Kelas 3 & 6) --- */}
            <g filter="url(#shadow-premium)">
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('kelas_3_6')}
                onMouseEnter={() => setHoveredRoom('kelas_3_6')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Left Slope */}
                <polygon 
                  points="40,55 95,55 95,165 40,165" 
                  fill={hoveredRoom === 'kelas_3_6' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Right Slope */}
                <polygon 
                  points="95,55 150,55 150,165 95,165" 
                  fill={hoveredRoom === 'kelas_3_6' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Ridge Crest Line */}
                <line x1="95" y1="55" x2="95" y2="165" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                {/* Text Labels */}
                <text x="95" y="105" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🏫 KELAS 3 & 6</text>
                <text x="95" y="122" fontFamily="var(--font-body)" fontWeight="600" fontSize="7.5" fill="#E2E8F0" textAnchor="middle">(Pagi / Siang)</text>
                
                {/* Glow Rect on hover */}
                {hoveredRoom === 'kelas_3_6' && <rect x="42" y="57" width="106" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* --- GEDUNG BARAT LAUT: BLOK KIRI TENGAH (Kelas 2 & 5) --- */}
            <g filter="url(#shadow-premium)">
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('kelas_2_5')}
                onMouseEnter={() => setHoveredRoom('kelas_2_5')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Left Slope */}
                <polygon 
                  points="40,195 95,195 95,305 40,305" 
                  fill={hoveredRoom === 'kelas_2_5' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Right Slope */}
                <polygon 
                  points="95,195 150,195 150,305 95,305" 
                  fill={hoveredRoom === 'kelas_2_5' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Ridge Crest Line */}
                <line x1="95" y1="195" x2="95" y2="305" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                {/* Text Labels */}
                <text x="95" y="245" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🏫 KELAS 2 & 5</text>
                <text x="95" y="262" fontFamily="var(--font-body)" fontWeight="600" fontSize="7.5" fill="#E2E8F0" textAnchor="middle">(Pagi / Siang)</text>
                
                {/* Glow Rect on hover */}
                {hoveredRoom === 'kelas_2_5' && <rect x="42" y="197" width="106" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* --- GEDUNG BARAT LAUT: BLOK KANAN (Kelas 1 & 4) --- */}
            <g filter="url(#shadow-premium)">
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('kelas_1_4')}
                onMouseEnter={() => setHoveredRoom('kelas_1_4')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Left Slope */}
                <polygon 
                  points="175,55 230,55 230,165 175,165" 
                  fill={hoveredRoom === 'kelas_1_4' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Right Slope */}
                <polygon 
                  points="230,55 285,55 285,165 230,165" 
                  fill={hoveredRoom === 'kelas_1_4' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Ridge Crest Line */}
                <line x1="230" y1="55" x2="230" y2="165" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                {/* Text Labels */}
                <text x="230" y="105" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🏫 KELAS 1 & 4</text>
                <text x="230" y="122" fontFamily="var(--font-body)" fontWeight="600" fontSize="7.5" fill="#E2E8F0" textAnchor="middle">(Pagi / Siang)</text>
                
                {/* Glow Rect on hover */}
                {hoveredRoom === 'kelas_1_4' && <rect x="177" y="57" width="106" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
              </g>
            </g>

            {/* --- GEDUNG BARAT DAYA: GEDUNG TK (Taman Kanak-Kanak) --- */}
            <g filter="url(#shadow-premium)">
              <g 
                style={{ cursor: 'pointer' }}
                onClick={() => handleRoomClick('bangunan_tk')}
                onMouseEnter={() => setHoveredRoom('bangunan_tk')}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* L-Shaped Building Left Vertical Section */}
                <polygon 
                  points="40,335 67.5,335 67.5,445 40,445" 
                  fill={hoveredRoom === 'bangunan_tk' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="67.5,335 95,335 95,445 67.5,445" 
                  fill={hoveredRoom === 'bangunan_tk' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                
                {/* L-Shaped Building Right Horizontal Section */}
                <polygon 
                  points="95,390 122.5,390 122.5,445 95,445" 
                  fill={hoveredRoom === 'bangunan_tk' ? '#60A5FA' : '#3B82F6'} 
                  style={{ transition: 'all 0.2s' }}
                />
                <polygon 
                  points="122.5,390 150,390 150,445 122.5,445" 
                  fill={hoveredRoom === 'bangunan_tk' ? '#3B82F6' : '#1D4ED8'} 
                  style={{ transition: 'all 0.2s' }}
                />
                
                {/* Ridges / Roof Lines */}
                <line x1="67.5" y1="335" x2="67.5" y2="445" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                <line x1="95" y1="417.5" x2="150" y2="417.5" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
                
                {/* Labels */}
                <text x="95" y="375" fontFamily="var(--font-heading)" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">🧸 GEDUNG TK</text>
                <text x="95" y="392" fontFamily="var(--font-body)" fontWeight="600" fontSize="7.5" fill="#E2E8F0" textAnchor="middle">(Taman Kanak-Kanak)</text>
                
                {/* Glow Rect overlay on hover */}
                {hoveredRoom === 'bangunan_tk' && <rect x="42" y="337" width="106" height="106" fill="none" stroke="#FFFFFF" strokeWidth="2.5" rx="4" filter="url(#glow-blue)" />}
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
                fill="#000000"
                fillOpacity="0"
                pointerEvents="all"
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
  );
}
