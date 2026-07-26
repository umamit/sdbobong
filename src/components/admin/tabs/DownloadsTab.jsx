'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function DownloadsTab() {
  const {
    activeTab,
    downloadSearch,
    filteredDownloads,
    handleDeleteDownload,
    setDownloadCategory,
    setDownloadFileUrl,
    setDownloadModalOpen,
    setDownloadSearch,
    setDownloadTitle,
    setEditingDownload
  } = useAdminDashboard();

  return (
    <section id="tab-downloads" className={`tab-pane ${activeTab === 'downloads' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Pusat Unduhan Berkas & Dokumen</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kelola berkas kurikulum, brosur pendaftaran, formulir, dan dokumen resmi sekolah.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDownload(null);
                    setDownloadTitle('');
                    setDownloadCategory('Kurikulum');
                    setDownloadFileUrl('');
                    setDownloadModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Tambah Berkas Baru
                </button>
              </div>

              {/* Downloads Search Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari berkas berdasarkan judul atau kategori..."
                  value={downloadSearch}
                  onChange={(e) => setDownloadSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', left: '2rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th>Nama Dokumen / Berkas</th>
                      <th style={{ width: '180px' }}>Kategori</th>
                      <th style={{ width: '250px' }}>Tautan Berkas</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Tanggal Upload</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDownloads.length > 0 ? (
                      filteredDownloads.map((dl, idx) => (
                        <tr key={dl.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{dl.title || '-'}</td>
                          <td>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: dl.category === 'Kurikulum' ? '#eff6ff' : dl.category === 'Pendaftaran' ? '#f0fdf4' : '#f8fafc',
                              color: dl.category === 'Kurikulum' ? '#2563eb' : dl.category === 'Pendaftaran' ? '#16a34a' : '#475569',
                              border: dl.category === 'Kurikulum' ? '1px solid #bfdbfe' : dl.category === 'Pendaftaran' ? '1px solid #bbf7d0' : '1px solid #cbd5e1'
                            }}>
                              {dl.category || 'Umum'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <a href={dl.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'underline', wordBreak: 'break-all' }}>
                              {dl.fileUrl || '-'}
                            </a>
                          </td>
                          <td style={{ textAlign: 'center', color: '#64748b' }}>{dl.date || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDownload(dl);
                                  setDownloadTitle(dl.title || '');
                                  setDownloadCategory(dl.category || 'Kurikulum');
                                  setDownloadFileUrl(dl.fileUrl || '');
                                  setDownloadModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDownload(dl.id)}
                                className="btn-action-delete"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada berkas unduhan yang cocok dengan pencarian Anda.
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
