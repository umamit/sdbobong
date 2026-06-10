'use client';

import React from 'react';
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
    totalPPDBPages
  } = useAdminDashboard();

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
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: {config?.ppdb_contacts?.email_sekolah || 'sdn.bobong.taliabu@gmail.com'}</p>
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
                <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => window.print()} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                  >
                    🖨️ Cetak Laporan (PDF)
                  </button>
                  <a href="/api/ppdb?export=true" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    📥 Ekspor Data ke Excel/CSV
                  </a>
                  {records.length > 0 && (
                    <button 
                      onClick={handleDeleteAllPPDB} 
                      className="btn btn-danger" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🗑️ Hapus Semua Data
                    </button>
                  )}
                </div>
              </div>

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
                  <span style={{ position: 'absolute', left: '1rem', bottom: '0.7rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
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
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>📞 {r.nomor_hp_orangtua || r.no_hp}</span>
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
                                  style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                                  title="Lihat Detail & Cetak Bukti"
                                >
                                  👁️ Detail
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
                                  💬 WA
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
            </div>
          </section>
  );
}
