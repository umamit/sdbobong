'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function OverviewTab() {
  const {
    B,
    activeTab,
    chartTooltip,
    confirmPassword,
    currentPassword,
    dbStatus,
    handleBackupExport,
    handleBackupRestore,
    handleChangePassword,
    handleDbToggle,
    handleMouseLeave,
    handleMouseMove,
    isChangingPassword,
    newPassword,
    records,
    setActiveTab,
    setConfirmPassword,
    setCurrentPassword,
    setNewPassword,
    storageInfo
  } = useAdminDashboard();

  return (
    <section id="tab-overview" className={`tab-pane ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-overview-grid">
              <div className="overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Total Pendaftar PPDB</span>
                    <span className="overview-card-value">{records.length}</span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card accent">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Pendaftar Terverifikasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.status === 'Terverifikasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card warning">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Zonasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Zonasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-6-1.25L3.61 18A.75.75 0 0 1 2.625 17.3V6.75a.75.75 0 0 1 .367-.65L9 2.75m0 12.75 6-3.75m0 3.75 6.39 3.05a.75.75 0 0 0 .993-.7V6.75a.75.75 0 0 0-.367-.65L15 2.75m0 9.5-6-3.75" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card purple">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Afirmasi / Prestasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Afirmasi' || r.jalur_ppdb === 'Prestasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.75a1.125 1.125 0 0 1-1.125-1.125V11.25M9 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.75A1.125 1.125 0 0 1 12 13.125V11.25m-1.5-6h3a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card rose">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Perpindahan</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Perpindahan Tugas Orang Tua' || r.jalur_ppdb === 'Perpindahan' || r.jalur_ppdb?.toLowerCase().includes('pindah')).length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 0 1-.75-.75v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H18.75m-.001-3.75a2.25 2.25 0 0 0-2.25-2.25h-3a2.25 2.25 0 0 0-2.25 2.25m6.75 2.25v-3.75a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0-.75.75v3.75m0 0h10.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card cyan">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Storage Terpakai</span>
                    <span className="overview-card-value">{storageInfo.totalFormatted || '0 B'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {storageInfo.isSupabaseActive ? 'Supabase Storage Aktif' : 'Penyimpanan Lokal Aktif'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Supabase: {storageInfo.supabaseFormatted || '0 B'} | Lokal: {storageInfo.localFormatted || '0 B'}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

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
 
            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
              <div className="settings-card">
                <h3>Selamat Datang di Panel Admin</h3>
                <p>Melalui panel kontrol ini, Anda memiliki akses penuh untuk mengelola pendaftaran PPDB daring, menambahkan berita kegiatan sekolah, memperbarui pengumuman berjalan, dan memantau statistik siswa yang ditampilkan di website SDN Bobong secara langsung.</p>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} onClick={() => setActiveTab('ppdb')}>Lihat Data PPDB</button>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }} onClick={() => setActiveTab('content')}>Edit Pengumuman</button>
                </div>
              </div>
              <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderColor: '#e2e8f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💻</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 800 }}>Status Server & Database</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Koneksi database sinkronisasi saat ini:</p>
                <span className="badge" style={{
                  backgroundColor: dbStatus === 'active' ? '#d1fae5' : dbStatus === 'disabled' ? '#fee2e2' : '#fef3c7',
                  color: dbStatus === 'active' ? '#065f46' : dbStatus === 'disabled' ? '#991b1b' : '#b45309',
                  border: dbStatus === 'active' ? '1px solid #a7f3d0' : dbStatus === 'disabled' ? '1px solid #fca5a5' : '1px solid #fcd34d',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span className={`pulse-dot ${dbStatus === 'active' ? 'green' : dbStatus === 'disabled' ? 'red' : 'amber'}`}></span>
                  {dbStatus === 'active' 
                    ? 'SUPABASE CLOUD ACTIVE' 
                    : dbStatus === 'forced_local'
                      ? 'LOCAL CACHE FORCE ACTIVE' 
                      : dbStatus === 'disabled'
                        ? 'LOCAL CACHE ACTIVE (NO CREDENTIALS)'
                        : 'LOCAL CACHE ACTIVE (AUTO FALLBACK)'
                  }
                </span>
                
                {/* Interactive Toggle Switch */}
                <div className="db-toggle-container">
                  <div style={{ textAlign: 'left' }}>
                    <div className="db-toggle-label">Gunakan Database Cloud</div>
                    <div className="db-toggle-desc">Hubungkan ke Supabase Cloud secara real-time</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      disabled={dbStatus === 'disabled'} 
                      checked={dbStatus === 'active' || (dbStatus !== 'forced_local' && dbStatus !== 'disabled')} 
                      onChange={(e) => handleDbToggle(!e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
              {/* CHANGE PASSWORD FORM CARD */}
              <div className="settings-card">
                <h3>🔐 Ganti Password Admin</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Perbarui kata sandi untuk akun administrator Anda secara aman. Sesi Anda akan tetap aktif setelah perubahan selesai.
                </p>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Password Saat Ini</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan password saat ini..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Password Baru (Min 6 Karakter)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1rem', marginTop: '0.5rem', alignSelf: 'flex-start' }}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Memproses...' : '🔐 Perbarui Password'}
                  </button>
                </form>
              </div>

              {/* BACKUP & RESTORE CONFIG CARD */}
              <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3>💾 Cadangan & Pemulihan Konfigurasi</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Ekspor seluruh pengaturan konten teks, gambar, pengumuman berjalan, dan statistik sekolah ke berkas JSON cadangan lokal. Anda dapat memulihkannya kapan saja untuk mengembalikan data ke kondisi yang dicadangkan.
                  </p>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#1e3a8a', marginBottom: '1.25rem', fontWeight: 500 }}>
                    💡 <strong>Tips:</strong> Disarankan melakukan pencadangan (export) sebelum Anda melakukan perubahan teks berskala besar di halaman website!
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>1. Simpan Cadangan Berkas</h4>
                    <button 
                      type="button" 
                      onClick={handleBackupExport}
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem 1.2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      📥 Ekspor Cadangan (.json)
                    </button>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>2. Pulihkan Dari Cadangan</h4>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleBackupRestore}
                        style={{ display: 'none' }}
                        id="backup-restore-input"
                      />
                      <button 
                        type="button"
                        onClick={() => document.getElementById('backup-restore-input').click()}
                        className="btn btn-danger"
                        style={{ padding: '0.6rem 1.2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#ef4444' }}
                      >
                        📤 Unggah & Pulihkan Cadangan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  );
}
