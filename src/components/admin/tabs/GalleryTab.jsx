'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function GalleryTab() {
  const {
    activeTab,
    config,
    gallerySearch,
    handleDeleteGalleryItem,
    setEditingGalleryItem,
    setGalleryCategory,
    setGalleryDate,
    setGalleryFile,
    setGalleryModalOpen,
    setGalleryPreview,
    setGallerySearch,
    setGallerySourceType,
    setGalleryTitle,
    setGalleryType,
    setGalleryUrl
  } = useAdminDashboard();

  const filteredGallery = (config?.gallery || []).filter(item => {
    const query = (gallerySearch || '').toLowerCase();
    return (item.title || '').toLowerCase().includes(query) ||
           (item.category || '').toLowerCase().includes(query) ||
           (item.type || '').toLowerCase().includes(query);
  });

  return (
    <section id="tab-gallery" className={`tab-pane ${activeTab === 'gallery' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Aset Galeri Multimedia Sekolah</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kelola koleksi foto dan video kegiatan, sarana prasarana, serta dokumentasi SDN Bobong.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingGalleryItem(null);
                    setGalleryTitle('');
                    setGalleryType('image');
                    setGalleryCategory('umum');
                    setGalleryUrl('');
                    setGalleryDate(new Date().toISOString().split('T')[0]);
                    setGallerySourceType('url');
                    setGalleryFile(null);
                    setGalleryPreview('');
                    setGalleryModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Tambah Media Baru
                </button>
              </div>

              {/* Gallery Search Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari dokumentasi media berdasarkan judul atau jenis..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
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
                      <th style={{ width: '100px', textAlign: 'center' }}>Pratinjau</th>
                      <th>Judul Dokumentasi / Kegiatan</th>
                      <th style={{ width: '130px', textAlign: 'center' }}>Kategori</th>
                      <th style={{ width: '130px', textAlign: 'center' }}>Tipe</th>
                      <th style={{ width: '220px' }}>Tautan Media</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Tanggal Kegiatan</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGallery.length > 0 ? (
                      filteredGallery.map((gal, idx) => (
                        <tr key={gal.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ textAlign: 'center' }}>
                            {gal.type === 'video' ? (
                              <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                              </div>
                            ) : (
                              <img 
                                src={gal.url || '/images/default-meta.jpg'} 
                                alt={gal.title} 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', margin: '0 auto', display: 'block' }} 
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-meta.jpg'; }}
                              />
                            )}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{gal.title || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: (gal.category || 'umum').toLowerCase() === 'akademik' ? '#eff6ff' : (gal.category || 'umum').toLowerCase() === 'pramuka' ? '#fff7ed' : (gal.category || 'umum').toLowerCase() === 'upacara' ? '#faf5ff' : (gal.category || 'umum').toLowerCase() === 'sarana' ? '#ecfdf5' : '#f8fafc',
                              color: (gal.category || 'umum').toLowerCase() === 'akademik' ? '#1d4ed8' : (gal.category || 'umum').toLowerCase() === 'pramuka' ? '#c2410c' : (gal.category || 'umum').toLowerCase() === 'upacara' ? '#7e22ce' : (gal.category || 'umum').toLowerCase() === 'sarana' ? '#047857' : '#475569',
                              border: (gal.category || 'umum').toLowerCase() === 'akademik' ? '1px solid #bfdbfe' : (gal.category || 'umum').toLowerCase() === 'pramuka' ? '1px solid #ffedd5' : (gal.category || 'umum').toLowerCase() === 'upacara' ? '1px solid #e9d5ff' : (gal.category || 'umum').toLowerCase() === 'sarana' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                            }}>
                              {gal.category || 'umum'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: gal.type === 'video' ? '#fff7ed' : '#eff6ff',
                              color: gal.type === 'video' ? '#c2410c' : '#2563eb',
                              border: gal.type === 'video' ? '1px solid #ffedd5' : '1px solid #bfdbfe'
                            }}>
                              {gal.type === 'video' ? 'VIDEO' : 'FOTO'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <a href={gal.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'underline', wordBreak: 'break-all' }}>
                              {gal.url ? (gal.url.length > 30 ? gal.url.substring(0, 30) + '...' : gal.url) : '-'}
                            </a>
                          </td>
                          <td style={{ textAlign: 'center', color: '#64748b' }}>{gal.date || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingGalleryItem(gal);
                                  setGalleryTitle(gal.title || '');
                                  setGalleryType(gal.type || 'image');
                                  setGalleryCategory(gal.category || 'umum');
                                  setGalleryUrl(gal.url || '');
                                  setGalleryDate(gal.date || '');
                                  const isUploaded = gal.url && (gal.url.startsWith('/') || gal.url.includes('/images/uploads'));
                                  setGallerySourceType(isUploaded ? 'upload' : 'url');
                                  setGalleryFile(null);
                                  setGalleryPreview(isUploaded ? gal.url : '');
                                  setGalleryModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryItem(gal.id)}
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
                        <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada dokumentasi media yang cocok dengan pencarian Anda.
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
