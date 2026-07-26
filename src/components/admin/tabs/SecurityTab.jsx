'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function SecurityTab() {
  const {
    activeTab,
    activeThreats,
    auditLogs,
    autoPruneDays,
    blacklistIp,
    blacklistReason,
    blockDurationMin,
    config,
    filteredAuditLogs,
    handleAddBlacklist,
    handleExportCsv,
    handleRefreshAuditLogs,
    handleRemoveBlacklist,
    handleResolveThreat,
    handleSaveSecuritySettings,
    maxAttempts,
    securityFilter,
    securitySearch,
    setAutoPruneDays,
    setBlacklistIp,
    setBlacklistReason,
    setBlockDurationMin,
    setIsPurgeModalOpen,
    setMaxAttempts,
    setSecurityFilter,
    setSecuritySearch
  } = useAdminDashboard();

  const parseUserAgent = (ua) => {
    if (!ua) return "Perangkat Tidak Dikenal";
    let os = "Lainnya";
    let browser = "Lainnya";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("iPhone")) os = "iPhone";
    else if (ua.includes("iPad")) os = "iPad";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("Linux")) os = "Linux";

    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Opera")) browser = "Opera";
    return `${browser} (${os})`;
  };

  return (
    <section id="tab-security" className={`tab-pane ${activeTab === 'security' ? 'active' : ''}`}>
            {/* Health Summary Cards */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              
              <div className="card shadow-md" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: activeThreats.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: activeThreats.length > 0 ? '#ef4444' : '#22c55e'
                }}>
                  {activeThreats.length > 0 ? (
                    <div style={{ animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Keamanan</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {activeThreats.length > 0 ? `${activeThreats.length} Ancaman Aktif` : 'Sistem Aman'}
                  </p>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-10px',
                  color: 'currentColor',
                  opacity: 0.04,
                  pointerEvents: 'none'
                }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>

              <div className="card shadow-md" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jejak Audit Tercatat</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {auditLogs ? auditLogs.length : 0} Rekaman
                  </p>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-10px',
                  color: '#3b82f6',
                  opacity: 0.04,
                  pointerEvents: 'none'
                }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
              </div>

              <div className="card shadow-md" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (config?.suspicious_attempts || []).filter(a => a.attempts >= 5 && a.resolved !== true).length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                  color: (config?.suspicious_attempts || []).filter(a => a.attempts >= 5 && a.resolved !== true).length > 0 ? '#ef4444' : '#94a3b8'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IP Terblokir Sementara</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {(config?.suspicious_attempts || []).filter(a => a.attempts >= 5 && a.resolved !== true).length} IP Address
                  </p>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-10px',
                  color: 'currentColor',
                  opacity: 0.04,
                  pointerEvents: 'none'
                }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </div>
              </div>

            </div>

            {/* Security Settings & IP Blacklist Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              
              {/* Security Settings Card */}
              <div className="card shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Kebijakan Parameter Keamanan</h3>
                </div>
                
                <form onSubmit={handleSaveSecuritySettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Batas Toleransi Login Gagal:
                    </label>
                    <select
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      className="form-control"
                      style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', color: 'var(--text-primary)' }}
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(v => (
                        <option key={v} value={v}>{v} kali percobaan gagal</option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                      Jumlah maksimal percobaan login yang salah berturut-turut sebelum IP terblokir sementara.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Durasi Blokir IP Sementara (menit):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={blockDurationMin}
                      onChange={(e) => setBlockDurationMin(Number(e.target.value))}
                      className="form-control"
                      style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', color: 'var(--text-primary)' }}
                      required
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                      Rentang waktu pemblokiran IP sementara setelah melewati batas login gagal (1 - 1440 menit).
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Pembersihan Otomatis Jurnal Audit:
                    </label>
                    <select
                      value={autoPruneDays}
                      onChange={(e) => setAutoPruneDays(Number(e.target.value))}
                      className="form-control"
                      style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', color: 'var(--text-primary)' }}
                    >
                      <option value={0}>Nonaktif (Simpan Semua)</option>
                      <option value={30}>Hapus log lebih dari 30 Hari</option>
                      <option value={90}>Hapus log lebih dari 90 Hari</option>
                      <option value={180}>Hapus log lebih dari 180 Hari</option>
                      <option value={365}>Hapus log lebih dari 365 Hari</option>
                    </select>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                      Log audit yang usianya melebihi masa ini akan dibersihkan secara otomatis untuk menjaga performa.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn-action-view"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginTop: '0.5rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Simpan Kebijakan Keamanan
                  </button>
                </form>
              </div>

              {/* Manual IP Blacklist Card */}
              <div className="card shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Daftar Hitam IP Manual</h3>
                </div>

                <form onSubmit={handleAddBlacklist} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <input
                        type="text"
                        value={blacklistIp}
                        onChange={(e) => setBlacklistIp(e.target.value)}
                        placeholder="Alamat IP (e.g. 192.168.1.5)"
                        className="form-control"
                        style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', color: 'var(--text-primary)' }}
                        required
                      />
                    </div>
                    <div style={{ flex: 1.5, minWidth: '200px' }}>
                      <input
                        type="text"
                        value={blacklistReason}
                        onChange={(e) => setBlacklistReason(e.target.value)}
                        placeholder="Alasan blokir permanen..."
                        className="form-control"
                        style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-action-delete"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Blokir IP Manual
                  </button>
                </form>

                {/* Blacklisted IPs List */}
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.3)', padding: '0.5rem' }}>
                  {config?.manual_blacklist && config?.manual_blacklist?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {config?.manual_blacklist?.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f87171' }}>{item.ip}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Alasan: {item.reason || 'Tidak ada alasan'}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Waktu: {item.timestamp ? new Date(item.timestamp).toLocaleString('id-ID') : '-'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlacklist(item.ip)}
                            className="btn-action-view"
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.72rem',
                              margin: 0,
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                          >
                            Bebaskan
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Tidak ada IP terblokir manual.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Threat Management Panel */}
            {(config?.suspicious_attempts || []).filter(a => a.resolved !== true).length > 0 && (
              <div className="card" style={{
                background: 'rgba(30, 41, 59, 0.45)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>Daftar IP Terdeteksi Mencurigakan / Terblokir</h3>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Reset manual akan memulihkan akses masuk IP</span>
                </div>

                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '150px' }}>Alamat IP</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Kegagalan</th>
                        <th style={{ width: '180px' }}>Waktu Terakhir</th>
                        <th style={{ width: '180px' }}>Batas Blokir</th>
                        <th>Status Keamanan</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>Tindakan Pemulihan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(config?.suspicious_attempts || [])
                        .filter(a => a.resolved !== true)
                        .map((threat, index) => {
                          const isBlocked = threat.attempts >= 5 && (!threat.blockedUntil || new Date(threat.blockedUntil) > new Date());
                          return (
                            <tr key={index}>
                              <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{threat.ip}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: threat.attempts >= 5 ? '#ef4444' : '#fb923c' }}>
                                {threat.attempts} Sesi
                              </td>
                              <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {threat.lastAttempt ? new Date(threat.lastAttempt).toLocaleString('id-ID') : '-'}
                              </td>
                              <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {threat.blockedUntil ? new Date(threat.blockedUntil).toLocaleString('id-ID') : '-'}
                              </td>
                              <td>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  backgroundColor: isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 146, 60, 0.15)',
                                  color: isBlocked ? '#ef4444' : '#fb923c',
                                  border: isBlocked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(251, 146, 60, 0.3)'
                                }}>
                                  {isBlocked ? 'TERBLOKIR (5 Menit)' : 'SUSPECT (LOGIN GAGAL 3+)'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleResolveThreat(threat.ip)}
                                  className="btn-action-view"
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    fontSize: '0.75rem',
                                    margin: 0,
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    color: '#22c55e',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Bebaskan IP
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Interactive Log Table & Search */}
            <div className="card shadow-lg" style={{ background: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: 'var(--space-md)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Jurnal Jejak Admin (Audit Logs)</h3>
                  <button
                    type="button"
                    onClick={handleRefreshAuditLogs}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: '#60a5fa',
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.2rem',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s'
                    }}
                    title="Segarkan Log"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={securitySearch}
                    onChange={(e) => setSecuritySearch(e.target.value)}
                    placeholder="Cari kata kunci, IP, aksi, detail..."
                    className="form-control"
                    style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.45rem 1rem', fontSize: '0.85rem', width: '180px', borderRadius: '8px', color: 'var(--text-primary)' }}
                  />
                  
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="btn-action-view"
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s',
                      margin: 0
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Ekspor CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPurgeModalOpen(true)}
                    className="btn-action-delete"
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s',
                      margin: 0
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Kosongkan Jurnal
                  </button>
                </div>
              </div>

              {/* Sub-Filters Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                {[
                  { id: 'all', label: 'Semua Aktivitas' },
                  { id: 'auth', label: 'Sesi & Login' },
                  { id: 'config', label: 'Konfigurasi Sistem' },
                  { id: 'ppdb', label: 'Data PPDB' },
                  { id: 'content', label: 'Konten Website' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSecurityFilter(tab.id)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: securityFilter === tab.id ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                      background: securityFilter === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: securityFilter === tab.id ? '#60a5fa' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Jurnal Table */}
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '170px' }}>Tanggal &amp; Waktu</th>
                      <th style={{ width: '140px' }}>Pengguna</th>
                      <th style={{ width: '190px' }}>Jenis Aktivitas</th>
                      <th>Detail Jejak Log</th>
                      <th style={{ width: '220px' }}>Asal IP &amp; Perangkat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.length > 0 ? (
                      filteredAuditLogs.map((log) => {
                        // Determine beautiful badge color & text
                        let badgeStyle = { backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.25)' };
                        let actionLabel = log.action;

                        if (log.action === 'LOGIN') {
                          badgeStyle = { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' };
                          actionLabel = 'LOGIN SUKSES';
                        } else if (log.action === 'FAILED_LOGIN') {
                          badgeStyle = { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
                          actionLabel = 'LOGIN GAGAL';
                        } else if (log.action === 'SUSPICIOUS_LOGIN_ATTEMPT') {
                          badgeStyle = { backgroundColor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.3)' };
                          actionLabel = 'MENCURIGAKAN';
                        } else if (log.action === 'SECURITY_IP_BLOCKED') {
                          badgeStyle = { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
                          actionLabel = 'IP TERBLOKIR';
                        } else if (log.action === 'SECURITY_RESOLVE') {
                          badgeStyle = { backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' };
                          actionLabel = 'ANCAMAN SELESAI';
                        } else if (log.action === 'LOGOUT') {
                          badgeStyle = { backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#64748b', border: '1px solid rgba(100, 116, 139, 0.3)' };
                          actionLabel = 'LOGOUT ADMIN';
                        } else if (log.action?.startsWith('CREATE_') || log.action?.includes('PUBLISH')) {
                          badgeStyle = { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' };
                        } else if (log.action?.startsWith('DELETE_')) {
                          badgeStyle = { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)' };
                        } else if (log.action?.startsWith('UPDATE_')) {
                          badgeStyle = { backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' };
                        }

                        return (
                          <tr key={log.id}>
                            <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontWeight: 500 }}>
                              {log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-'}
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                              {log.username || 'Sistem'}
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                ...badgeStyle
                              }}>
                                {actionLabel}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: '1.4' }}>
                              {log.details || '-'}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                <span style={{ fontWeight: 600, color: '#93c5fd' }}>{log.ip || '127.0.0.1'}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'help' }} title={log.userAgent || ''}>
                                  {parseUserAgent(log.userAgent)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Tidak ada rekaman jejak audit yang cocok dengan penyaringan Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </section>
  );
}
