'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function OverviewCharts() {
  const {
    records = [],
    chartTooltip,
    handleMouseMove,
    handleMouseLeave
  } = useAdminDashboard();

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const getTrendData = () => {
    if (!records || records.length === 0) {
      // Return last 7 days with 0 counts
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data.push({ date: dateStr, count: 0 });
      }
      return data;
    }

    // Count by date
    const counts = {};
    records.forEach(r => {
      if (r.waktu_daftar) {
        const date = r.waktu_daftar.substring(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          counts[date] = (counts[date] || 0) + 1;
        }
      }
    });

    const dates = Object.keys(counts).sort();
    if (dates.length === 0) {
      // Fallback if no valid dates
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data.push({ date: dateStr, count: 0 });
      }
      return data;
    }

    // To make a continuous trend, let's find the min and max date
    const minDate = new Date(dates[0]);
    const maxDate = new Date(dates[dates.length - 1]);
    
    // If min and max date are the same, let's pad 3 days before and after
    if (minDate.getTime() === maxDate.getTime()) {
      minDate.setDate(minDate.getDate() - 3);
      maxDate.setDate(maxDate.getDate() + 3);
    }

    // Fill in all dates between minDate and maxDate
    const trend = [];
    let current = new Date(minDate);
    while (current <= maxDate) {
      const dateStr = current.toISOString().split('T')[0];
      trend.push({
        date: dateStr,
        count: counts[dateStr] || 0
      });
      current.setDate(current.getDate() + 1);
    }

    if (trend.length > 30) {
      return trend.slice(trend.length - 30);
    }

    while (trend.length < 7) {
      const firstDate = new Date(trend[0].date);
      firstDate.setDate(firstDate.getDate() - 1);
      const dateStr = firstDate.toISOString().split('T')[0];
      trend.unshift({
        date: dateStr,
        count: counts[dateStr] || 0
      });
    }

    return trend;
  };

  return (
    <>
      {/* DYNAMIC SVG ANALYTICS CHARTS */}
      {(() => {
              const maleCount = records.filter(r => {
                const jk = r.jenis_kelamin || '';
                return jk.toLowerCase().startsWith('l') || jk === 'Laki-laki';
              }).length;
              const femaleCount = records.filter(r => {
                const jk = r.jenis_kelamin || '';
                return jk.toLowerCase().startsWith('p') || jk === 'Perempuan';
              }).length;
              const totalGender = maleCount + femaleCount;
              const malePercent = totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 50;
              const femalePercent = totalGender > 0 ? Math.round((femaleCount / totalGender) * 100) : 50;

              // Radius 40 => Circumference = 2 * PI * 40 = 251.32
              const maleDash = (malePercent / 100) * 251.32;
              const femaleDash = (femalePercent / 100) * 251.32;

              // Jalur PPDB stats
              const totalPPDB = records.length;
              const zonasi = records.filter(r => r.jalur_ppdb === 'Zonasi').length;
              const afirmasi = records.filter(r => r.jalur_ppdb === 'Afirmasi').length;
              const prestasi = records.filter(r => r.jalur_ppdb === 'Prestasi').length;
              const perpindahan = records.filter(r => r.jalur_ppdb === 'Perpindahan' || r.jalur_ppdb?.toLowerCase().includes('pindah')).length;

              const zonasiPct = totalPPDB > 0 ? Math.round((zonasi / totalPPDB) * 100) : 0;
              const afirmasiPct = totalPPDB > 0 ? Math.round((afirmasi / totalPPDB) * 100) : 0;
              const prestasiPct = totalPPDB > 0 ? Math.round((prestasi / totalPPDB) * 100) : 0;
              const perpindahanPct = totalPPDB > 0 ? Math.round((perpindahan / totalPPDB) * 100) : 0;

              return (
                <div className="analytics-card" style={{ marginTop: '1.5rem', position: 'relative' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}>📊 Analisis Data PPDB Real-time</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visualisasi statistik pendaftar siswa baru berdasarkan gender dan jalur masuk.</p>
                  </div>

                  <div className="analytics-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>
                    {/* Donut Chart */}
                    <div className="donut-container" style={{ flex: '0 0 220px', borderRight: '1px solid #f1f5f9', paddingRight: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>Sebaran Jenis Kelamin</h4>
                      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                        <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="donutMaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="donutFemaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                          {totalGender > 0 ? (
                            <>
                              <circle 
                                cx="50" cy="50" r="40" fill="transparent" 
                                stroke="url(#donutMaleGrad)" strokeWidth="12" 
                                strokeDasharray={`${maleDash} 251.32`}
                                className="svg-chart-donut-segment"
                                onMouseMove={(e) => handleMouseMove(e, 'Laki-laki', `${maleCount} Siswa (${malePercent}%)`)}
                                onMouseLeave={handleMouseLeave}
                                style={{ strokeLinecap: 'round' }}
                              />
                              <circle 
                                cx="50" cy="50" r="40" fill="transparent" 
                                stroke="url(#donutFemaleGrad)" strokeWidth="12" 
                                strokeDasharray={`${femaleDash} 251.32`} 
                                strokeDashoffset={-maleDash} 
                                className="svg-chart-donut-segment"
                                onMouseMove={(e) => handleMouseMove(e, 'Perempuan', `${femaleCount} Siswa (${femalePercent}%)`)}
                                onMouseLeave={handleMouseLeave}
                                style={{ strokeLinecap: 'round' }}
                              />
                            </>
                          ) : (
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#cbd5e1" strokeWidth="12" />
                          )}
                        </svg>
                        <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'block', lineHeight: 1 }}>{totalGender}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Siswa</span>
                        </div>
                      </div>

                      <div className="donut-legends" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="legend-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="legend-color-dot" style={{ backgroundColor: '#6366f1', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                            Laki-laki
                          </span>
                          <span style={{ fontWeight: 700, color: '#475569' }}>{maleCount} ({malePercent}%)</span>
                        </div>
                        <div className="legend-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="legend-color-dot" style={{ backgroundColor: '#8b5cf6', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                            Perempuan
                          </span>
                          <span style={{ fontWeight: 700, color: '#475569' }}>{femaleCount} ({femalePercent}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bar-chart-container" style={{ flex: 1, minWidth: '280px' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>Distribusi Jalur Pendaftaran</h4>
                      
                      <div style={{ height: '170px', width: '100%' }}>
                        <svg width="100%" height="100%" viewBox="0 0 400 160" className="svg-chart-container" style={{ overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="barZonasiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                            <linearGradient id="barAfirmasiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="barPrestasiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#6d28d9" />
                            </linearGradient>
                            <linearGradient id="barPerpindahanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="100%" stopColor="#0891b2" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="90" y1="10" x2="90" y2="135" stroke="#cbd5e1" strokeWidth="1" />
                          <line x1="162.5" y1="10" x2="162.5" y2="135" className="svg-chart-grid-line" />
                          <line x1="235" y1="10" x2="235" y2="135" className="svg-chart-grid-line" />
                          <line x1="307.5" y1="10" x2="307.5" y2="135" className="svg-chart-grid-line" />
                          <line x1="380" y1="10" x2="380" y2="135" className="svg-chart-grid-line" />

                          {/* X-axis labels */}
                          <text x="90" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">0%</text>
                          <text x="162.5" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">25%</text>
                          <text x="235" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">50%</text>
                          <text x="307.5" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">75%</text>
                          <text x="380" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">100%</text>

                          {/* Y-axis Labels & Bars */}
                          {/* 1. Zonasi */}
                          <text x="80" y="27" fill="#475569" fontSize="10" fontWeight="600" textAnchor="end">🛣️ Zonasi</text>
                          <rect 
                            x="90" y="15" 
                            width={totalPPDB > 0 ? (zonasiPct / 100) * 290 : 0} 
                            height="18" 
                            rx="4" ry="4"
                            fill="url(#barZonasiGrad)"
                            className="svg-chart-bar"
                            onMouseMove={(e) => handleMouseMove(e, 'Jalur Zonasi', `${zonasi} Pendaftar (${zonasiPct}%)`)}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text 
                            x={totalPPDB > 0 ? 90 + ((zonasiPct / 100) * 290) + 8 : 98} 
                            y="27" fill="#334155" fontSize="10" fontWeight="700"
                          >
                            {zonasi}
                          </text>

                          {/* 2. Afirmasi */}
                          <text x="80" y="57" fill="#475569" fontSize="10" fontWeight="600" textAnchor="end">❤️ Afirmasi</text>
                          <rect 
                            x="90" y="45" 
                            width={totalPPDB > 0 ? (afirmasiPct / 100) * 290 : 0} 
                            height="18" 
                            rx="4" ry="4"
                            fill="url(#barAfirmasiGrad)"
                            className="svg-chart-bar"
                            onMouseMove={(e) => handleMouseMove(e, 'Jalur Afirmasi', `${afirmasi} Pendaftar (${afirmasiPct}%)`)}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text 
                            x={totalPPDB > 0 ? 90 + ((afirmasiPct / 100) * 290) + 8 : 98} 
                            y="57" fill="#334155" fontSize="10" fontWeight="700"
                          >
                            {afirmasi}
                          </text>

                          {/* 3. Prestasi */}
                          <text x="80" y="87" fill="#475569" fontSize="10" fontWeight="600" textAnchor="end">🏆 Prestasi</text>
                          <rect 
                            x="90" y="75" 
                            width={totalPPDB > 0 ? (prestasiPct / 100) * 290 : 0} 
                            height="18" 
                            rx="4" ry="4"
                            fill="url(#barPrestasiGrad)"
                            className="svg-chart-bar"
                            onMouseMove={(e) => handleMouseMove(e, 'Jalur Prestasi', `${prestasi} Pendaftar (${prestasiPct}%)`)}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text 
                            x={totalPPDB > 0 ? 90 + ((prestasiPct / 100) * 290) + 8 : 98} 
                            y="87" fill="#334155" fontSize="10" fontWeight="700"
                          >
                            {prestasi}
                          </text>

                          {/* 4. Perpindahan */}
                          <text x="80" y="117" fill="#475569" fontSize="10" fontWeight="600" textAnchor="end">💼 Pindahan</text>
                          <rect 
                            x="90" y="105" 
                            width={totalPPDB > 0 ? (perpindahanPct / 100) * 290 : 0} 
                            height="18" 
                            rx="4" ry="4"
                            fill="url(#barPerpindahanGrad)"
                            className="svg-chart-bar"
                            onMouseMove={(e) => handleMouseMove(e, 'Jalur Perpindahan', `${perpindahan} Pendaftar (${perpindahanPct}%)`)}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text 
                            x={totalPPDB > 0 ? 90 + ((perpindahanPct / 100) * 290) + 8 : 98} 
                            y="117" fill="#334155" fontSize="10" fontWeight="700"
                          >
                            {perpindahan}
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Floating Tooltip Card */}
                  {chartTooltip.show && (
                    <div 
                      className="svg-chart-tooltip" 
                      style={{ 
                        left: chartTooltip.x, 
                        top: chartTooltip.y,
                        transform: 'translate(-50%, -100%) translateY(-10px)'
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '2px', color: '#a5b4fc' }}>{chartTooltip.title}</div>
                      <div>{chartTooltip.value}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            {(() => {
              const trendData = getTrendData();
              
              // SVG dimensions
              const svgWidth = 600;
              const svgHeight = 220;
              const paddingLeft = 45;
              const paddingRight = 25;
              const paddingTop = 25;
              const paddingBottom = 35;
              
              const chartWidth = svgWidth - paddingLeft - paddingRight;
              const chartHeight = svgHeight - paddingTop - paddingBottom;
              
              const maxCount = Math.max(...trendData.map(d => d.count), 1);
              const yMax = Math.max(5, Math.ceil(maxCount * 1.25));
              
              // Coordinates calculation helper
              const points = trendData.map((d, i) => {
                const x = paddingLeft + (i / (trendData.length - 1)) * chartWidth;
                const y = paddingTop + chartHeight - (d.count / yMax) * chartHeight;
                return { x, y, date: d.date, count: d.count };
              });
              
              // Create SVG path for the line
              let linePath = '';
              let areaPath = '';
              
              if (points.length > 0) {
                linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
              }

              // Format Indonesian Date Label helper
              const formatDateLabel = (dateStr) => {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                if (parts.length < 3) return dateStr;
                const [y, m, d] = parts;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
                return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]}`;
              };

              // Generate Y-axis gridline values (5 horizontal lines)
              const yTicks = [];
              for (let i = 0; i <= 4; i++) {
                yTicks.push(Math.round((yMax / 4) * i));
              }
              
              return (
                <div className="analytics-card" style={{ marginTop: '1.5rem', position: 'relative' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}>📈 Tren Harian Pendaftaran PPDB</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Grafik garis yang menunjukkan total pendaftaran siswa baru per hari.
                    </p>
                  </div>

                  <div style={{ height: '230px', width: '100%', position: 'relative' }}>
                    <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                        </linearGradient>
                        <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                      
                      {/* Horizontal Gridlines & Y-axis labels */}
                      {yTicks.map((tick, i) => {
                        const y = paddingTop + chartHeight - (tick / yMax) * chartHeight;
                        return (
                          <g key={i}>
                            <line 
                              x1={paddingLeft} 
                              y1={y} 
                              x2={paddingLeft + chartWidth} 
                              y2={y} 
                              stroke="#e2e8f0" 
                              strokeWidth="1" 
                              strokeDasharray={tick === 0 ? '0' : '4,4'} 
                            />
                            <text 
                              x={paddingLeft - 10} 
                              y={y + 4} 
                              fill="#94a3b8" 
                              fontSize="9" 
                              fontWeight="600"
                              textAnchor="end"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* X-axis labels */}
                      {points.map((p, i) => {
                        const step = Math.ceil(points.length / 8);
                        const shouldShowLabel = i % step === 0 || i === points.length - 1;
                        
                        if (!shouldShowLabel) return null;
                        
                        return (
                          <text 
                            key={i}
                            x={p.x} 
                            y={paddingTop + chartHeight + 18} 
                            fill="#94a3b8" 
                            fontSize="9" 
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            {formatDateLabel(p.date)}
                          </text>
                        );
                      })}
                      
                      {/* Vertical line indicator on hover */}
                      {hoveredIndex !== null && points[hoveredIndex] && (
                        <line 
                          x1={points[hoveredIndex].x} 
                          y1={paddingTop} 
                          x2={points[hoveredIndex].x} 
                          y2={paddingTop + chartHeight} 
                          stroke="#818cf8" 
                          strokeWidth="1.5" 
                          strokeDasharray="3,3" 
                        />
                      )}

                      {/* Gradient Area under the line */}
                      {areaPath && (
                        <path d={areaPath} fill="url(#trendAreaGrad)" />
                      )}
                      
                      {/* The Trend Line */}
                      {linePath && (
                        <path 
                          d={linePath} 
                          fill="none" 
                          stroke="url(#trendLineGrad)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      )}
                      
                      {/* Interactive dots and hover hitboxes */}
                      {points.map((p, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                          <g key={i}>
                            {/* Highlighted dot on hover */}
                            {isHovered ? (
                              <>
                                <circle cx={p.x} cy={p.y} r="8" fill="#6366f1" fillOpacity="0.2" />
                                <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2.5" />
                              </>
                            ) : (
                              <circle cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                            )}
                            
                            {/* Transparent larger hit area for hover */}
                            <circle 
                              cx={p.x} 
                              cy={p.y} 
                              r="15" 
                              fill="transparent" 
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setHoveredIndex(i)}
                              onMouseMove={(e) => {
                                setHoveredIndex(i);
                                handleMouseMove(
                                  e, 
                                  `📅 ${formatDateLabel(p.date)}`, 
                                  `📝 ${p.count} Pendaftar Baru`
                                );
                              }}
                              onMouseLeave={() => {
                                setHoveredIndex(null);
                                handleMouseLeave();
                              }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Fallback Empty State centered overlay */}
                    {records.length === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        padding: '1.25rem 2rem',
                        borderRadius: '16px',
                        border: '1px dashed #cbd5e1',
                        pointerEvents: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '2rem' }}>📊</span>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>Belum Ada Pendaftaran PPDB</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '250px' }}>
                          Grafik tren harian pendaftaran akan terisi otomatis setelah berkas pendaftaran pertama masuk ke sistem.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
    </>
  );
}
