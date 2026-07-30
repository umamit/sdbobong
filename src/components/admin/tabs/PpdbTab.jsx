'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function PpdbTab() {
  const {
    activeTab,
    availableTahunAjaran,
    config,
    filteredPPDB,
    handleDeleteAllPPDB,
    handlePPDBDelete,
    handleStatusChange,
    ppdbFilterJalur,
    ppdbFilterStatus,
    ppdbFilterTahun,
    ppdbPage,
    ppdbPerPage,
    ppdbSearch,
    records,
    sendWhatsAppNotification,
    setIsDetailModalOpen,
    setPpdbFilterJalur,
    setPpdbFilterStatus,
    setPpdbFilterTahun,
    setPpdbPage,
    setPpdbPerPage,
    setPpdbSearch,
    setSelectedRecord,
    totalPPDBPages,
    handleSaveWaGateway
  } = useAdminDashboard();

  const gateway = config?.stats?.wa_gateway || {};
  const [waEnabled, setWaEnabled] = useState(gateway.enabled || false);
  const [waProvider, setWaProvider] = useState(gateway.provider || 'fonnte');
  const [waToken, setWaToken] = useState(gateway.token || '');
  const [waUrl, setWaUrl] = useState(gateway.url || '');
  const [waVerifiedTemplate, setWaVerifiedTemplate] = useState(gateway.message_template_verified || '');
  const [waRejectedTemplate, setWaRejectedTemplate] = useState(gateway.message_template_rejected || '');

  useEffect(() => {
    const gw = config?.stats?.wa_gateway || {};
    setWaEnabled(gw.enabled || false);
    setWaProvider(gw.provider || 'fonnte');
    setWaToken(gw.token || '');
    setWaUrl(gw.url || '');
    setWaVerifiedTemplate(gw.message_template_verified || '');
    setWaRejectedTemplate(gw.message_template_rejected || '');
  }, [config]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await handleSaveWaGateway({
      enabled: waEnabled,
      provider: waProvider,
      token: waToken,
      url: waUrl,
      message_template_verified: waVerifiedTemplate,
      message_template_rejected: waRejectedTemplate
    });
  };

  // --- AI Anomaly Detection ---
  const [anomalyResult, setAnomalyResult] = useState(null);
  const [analyzingAnomaly, setAnalyzingAnomaly] = useState(false);

  const handleAnalyzeAnomalies = useCallback(async () => {
    if (!records || records.length === 0) return;
    setAnalyzingAnomaly(true);
    setAnomalyResult(null);
    try {
      const res = await fetch('/api/admin/ppdb-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      const data = await res.json();
      setAnomalyResult(data);
    } catch (e) {
      console.error('Anomaly detection error:', e);
      setAnomalyResult({ anomalies: [], total_checked: 0, total_flagged: 0, ai_summary: [] });
    } finally {
      setAnalyzingAnomaly(false);
    }
  }, [records]);

  return (
    <section id="tab-ppdb" className={`tab-pane ${activeTab === 'ppdb' ? 'active' : ''}`}>
            <div className="admin-table">
              {/* Print-Only Official School Header */}
              <div className="print-only" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '3px double #0f172a', paddingBottom: '1.5rem' }}>
                  <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" style={{ width: '70px', height: '75px', objectFit: 'contain' }} />
                  <div style={{ flexGrow: 1, textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
                    <h3 style={{ margin: '1px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SD NEGERI BOBONG</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', fontWeight: 500, lineHeight: '1.4' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: {config?.ppdb_contacts?.email_sekolah || 'admin@sdnegeribobong.sch.id'}</p>
                  </div>
                  <img src="/images/logo_sekolah.png" alt="Logo Sekolah" style={{ width: '70px', height: '75px', objectFit: 'contain' }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '1px' }}>LAPORAN DAFTAR LENGKAP FORMULIR MASUK SISWA (PPDB)</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569' }}>Tahun Ajaran: 2026/2027</p>
                </div>
              </div>

              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3>Daftar Lengkap Formulir Masuk</h3>
                  <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleAnalyzeAnomalies}
                      disabled={analyzingAnomaly || records.length === 0}
                      style={{
                        background: analyzingAnomaly ? 'rgba(239,68,68,0.5)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: analyzingAnomaly || records.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: records.length === 0 ? 0.5 : 1,
                        boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                      }}
                    >
                      {analyzingAnomaly ? 'Menganalisis...' : 'Analisis Anomali AI'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => window.print()} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      Cetak Laporan (PDF)
                    </button>
                    <a href="/api/ppdb?export=true" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Ekspor Data ke Excel/CSV
                    </a>
                  {records.length > 0 && (
                    <button 
                      onClick={handleDeleteAllPPDB} 
                      className="btn btn-danger" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Hapus Semua Data
                    </button>
                  )}
                </div>
              </div>

              {/* AI Anomaly Results Panel */}
              {anomalyResult && (
                <div style={{
                  background: anomalyResult.total_flagged > 0
                    ? 'rgba(239,68,68,0.04)'
                    : 'rgba(16,185,129,0.04)',
                  border: `1px solid ${anomalyResult.total_flagged > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: anomalyResult.total_flagged > 0 ? '#dc2626' : '#059669' }}>
                        {anomalyResult.total_flagged > 0 ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: anomalyResult.total_flagged > 0 ? '#dc2626' : '#059669' }}>
                        {anomalyResult.total_flagged > 0
                          ? `${anomalyResult.total_flagged} dari ${anomalyResult.total_checked} pendaftar terindikasi anomali`
                          : `Semua ${anomalyResult.total_checked} data pendaftar terlihat normal`}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnomalyResult(null)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}
                    >×</button>
                  </div>

                  {anomalyResult.ai_summary?.length > 0 && (
                    <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem', color: '#4f46e5', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                      <div><strong>Ringkasan AI:</strong> {anomalyResult.ai_summary[0]}</div>
                    </div>
                  )}

                  {anomalyResult.anomalies.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                      {anomalyResult.anomalies.map((a, i) => (
                        <div key={a.id || i} style={{
                          background: '#fff',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          padding: '10px 14px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{i + 1}. {a.nama_lengkap}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>NIK: {a.nik}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {a.issues.map((iss, j) => (
                              <div key={j} style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '0.75rem'
                              }}>
                                <strong style={{ color: '#dc2626' }}>{iss.label}</strong>
                                <span style={{ color: '#64748b', marginTop: '2px' }}>{iss.detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Filter Toolbar */}
              <div className="table-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Cari Calon Siswa</label>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, NIK, atau nomor HP..."
                    value={ppdbSearch}
                    onChange={(e) => { setPpdbSearch(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', bottom: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                </div>
                
                <div style={{ minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Jalur</label>
                  <select
                    value={ppdbFilterJalur}
                    onChange={(e) => { setPpdbFilterJalur(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value="Semua">Semua Jalur</option>
                    <option value="Zonasi">Zonasi</option>
                    <option value="Afirmasi">Afirmasi</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Perpindahan Tugas Orang Tua">Perpindahan Tugas Orang Tua</option>
                  </select>
                </div>

                <div style={{ minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Status</label>
                  <select
                    value={ppdbFilterStatus}
                    onChange={(e) => { setPpdbFilterStatus(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Diterima Sistem">Diterima Sistem</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div style={{ minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Tahun Ajaran</label>
                  <select
                    value={ppdbFilterTahun}
                    onChange={(e) => { setPpdbFilterTahun(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value="Semua">Semua Tahun</option>
                    {availableTahunAjaran.map(th => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>

                <div style={{ minWidth: '100px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Halaman</label>
                  <select
                    value={ppdbPerPage}
                    onChange={(e) => { setPpdbPerPage(Number(e.target.value)); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                      <th>Nama Siswa (NIK)</th>
                      <th>Tahun Ajaran</th>
                      <th>Orang Tua (HP)</th>
                      <th>Lahir / Kelamin</th>
                      <th>Jalur</th>
                      <th>Alamat Lengkap</th>
                      <th>Tanggal Daftar</th>
                      <th style={{ width: '140px' }}>Status</th>
                      <th className="no-print" style={{ width: '240px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPPDB.length > 0 ? (
                      filteredPPDB.map((r, idx) => {
                        const displayIndex = idx + 1;
                        const isRowOnCurrentPage = idx >= (ppdbPage - 1) * ppdbPerPage && idx < ppdbPage * ppdbPerPage;
                        return (
                          <tr key={r.id || idx} className={isRowOnCurrentPage ? '' : 'no-screen'}>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{displayIndex}</td>
                            <td>
                              <strong style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{r.nama_lengkap}</strong><br />
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>NIK: {r.nik_siswa || r.nik}</span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>{r.tahun_ajaran || '2026/2027'}</span>
                            </td>
                            <td>
                              <span>Ibu: {r.nama_ibu_kandung || r.nama_ibu}</span><br />
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                {r.nomor_hp_orangtua || r.no_hp}
                              </span>
                            </td>
                            <td>
                              <span>{r.tempat_lahir}, {r.tanggal_lahir}</span><br />
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.jenis_kelamin}</span>
                            </td>
                            <td>
                              <span className="badge" style={{ backgroundColor: '#E8F0FE', color: 'var(--primary)', fontWeight: 600, padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>
                                {r.jalur_ppdb}
                              </span>
                            </td>
                            <td style={{ maxWidth: '200px', wordWrap: 'break-word', fontSize: '0.8rem' }}>{r.alamat_domisili || r.alamat}</td>
                            <td style={{ fontSize: '0.75rem' }}>{r.waktu_daftar}</td>
                            <td>
                              <div className="no-print">
                                <select
                                  value={r.status}
                                  className={`status-badge-select ${r.status === 'Terverifikasi' ? 'verified' : r.status === 'Ditolak' ? 'rejected' : 'pending'}`}
                                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                >
                                  <option value="Diterima Sistem">Diterima Sistem</option>
                                  <option value="Terverifikasi">Terverifikasi</option>
                                  <option value="Ditolak">Ditolak</option>
                                </select>
                              </div>
                              <span className="print-only" style={{ fontWeight: 600, color: r.status === 'Terverifikasi' ? '#059669' : r.status === 'Ditolak' ? '#dc2626' : '#d97706' }}>
                                {r.status}
                              </span>
                            </td>
                            <td className="no-print" style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedRecord(r); setIsDetailModalOpen(true); }}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                                  title="Lihat Detail & Cetak Bukti"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                  Detail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendWhatsAppNotification(r)}
                                  className="btn"
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                                  }}
                                  title="Kirim Notifikasi Status PPDB lewat WhatsApp"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                  WA
                                </button>
                                <button onClick={() => handlePPDBDelete(r.id)} type="button" className="btn-action-delete" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0 }}>Hapus</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data pendaftar calon siswa baru yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Premium Pagination System */}
              {totalPPDBPages > 1 && (
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Menampilkan <strong>{Math.min(filteredPPDB.length, (ppdbPage - 1) * ppdbPerPage + 1)}-{Math.min(filteredPPDB.length, ppdbPage * ppdbPerPage)}</strong> dari total <strong>{filteredPPDB.length}</strong> pendaftar
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn-pagination"
                      disabled={ppdbPage === 1}
                      onClick={() => setPpdbPage(prev => Math.max(1, prev - 1))}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: ppdbPage === 1 ? '#f1f5f9' : '#ffffff', cursor: ppdbPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                    >
                      ◀️ Prev
                    </button>
                    {Array.from({ length: totalPPDBPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`btn-pagination ${ppdbPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setPpdbPage(i + 1)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: ppdbPage === i + 1 ? 'var(--primary)' : '#ffffff',
                          color: ppdbPage === i + 1 ? '#ffffff' : '#1e293b',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn-pagination"
                      disabled={ppdbPage === totalPPDBPages}
                      onClick={() => setPpdbPage(prev => Math.min(totalPPDBPages, prev + 1))}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: ppdbPage === totalPPDBPages ? '#f1f5f9' : '#ffffff', cursor: ppdbPage === totalPPDBPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                    >
                      Next ▶️
                    </button>
                  </div>
                </div>
              )}

              {/* ================= SETTINGS PANEL: WHATSAPP GATEWAY ================= */}
              <div className="no-print" style={{ marginTop: '2.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 1.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    Setelan WhatsApp Gateway (Notifikasi Otomatis PPDB)
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Mengirim pesan WhatsApp secara otomatis ke nomor HP orang tua ketika status pendaftaran calon siswa diubah.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="wa_enabled" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#334155' }}>Status Integrasi</label>
                      <select
                        id="wa_enabled"
                        value={waEnabled ? 'true' : 'false'}
                        onChange={(e) => setWaEnabled(e.target.value === 'true')}
                        className="form-control"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value="false">Nonaktif (Pesan Tidak Terkirim)</option>
                        <option value="true">Aktif (Kirim Otomatis)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="wa_provider" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#334155' }}>Penyedia Layanan (Provider)</label>
                      <select
                        id="wa_provider"
                        value={waProvider}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWaProvider(val);
                          if (val === 'fonnte') setWaUrl('https://api.fonnte.com/send');
                          else if (val === 'wablas') setWaUrl('https://api.wablas.com/api/send-message');
                        }}
                        className="form-control"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value="fonnte">Fonnte (Rekomendasi)</option>
                        <option value="wablas">Wablas</option>
                        <option value="custom">Generic Webhook / Lainnya</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="wa_url" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#334155' }}>Gateway API Endpoint URL</label>
                      <input
                        id="wa_url"
                        type="text"
                        value={waUrl}
                        onChange={(e) => setWaUrl(e.target.value)}
                        placeholder="Contoh: https://api.fonnte.com/send"
                        className="form-control"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        required={waEnabled}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="wa_token" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#334155' }}>API Token / Authorization Key</label>
                      <input
                        id="wa_token"
                        type="text"
                        value={waToken}
                        onChange={(e) => setWaToken(e.target.value)}
                        placeholder="Masukkan token otentikasi API gateway..."
                        className="form-control"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        required={waEnabled}
                      />
                    </div>

                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      Draf Template Pesan Notifikasi
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <strong>Petunjuk Tag Dinamis:</strong> Gunakan tag berikut di dalam draf pesan agar diganti otomatis oleh sistem saat dikirim: <br />
                      <code>[NAMA_SISWA]</code> : Nama lengkap calon siswa, &nbsp;
                      <code>[NAMA_ORANGTUA]</code> : Nama ibu/ayah orang tua, &nbsp;
                      <code>[JALUR]</code> : Jalur PPDB terpilih (misal: Zonasi)
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="wa_verified_template" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>
                          Pesan Saat Pendaftaran Diterima (Terverifikasi)
                        </label>
                        <textarea
                          id="wa_verified_template"
                          rows="4"
                          value={waVerifiedTemplate}
                          onChange={(e) => setWaVerifiedTemplate(e.target.value)}
                          placeholder="Tulis pesan keberhasilan pendaftaran..."
                          className="form-control"
                          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.85rem', lineHeight: '1.5' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="wa_rejected_template" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>
                          Pesan Saat Pendaftaran Ditolak
                        </label>
                        <textarea
                          id="wa_rejected_template"
                          rows="4"
                          value={waRejectedTemplate}
                          onChange={(e) => setWaRejectedTemplate(e.target.value)}
                          placeholder="Tulis pesan penolakan pendaftaran..."
                          className="form-control"
                          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.85rem', lineHeight: '1.5' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 2rem', fontWeight: 700, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      Simpan Setelan WhatsApp Gateway
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </section>
  );
}
