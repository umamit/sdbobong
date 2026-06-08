'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function NewsTab() {
  const {
    activeTab,
    editingNews,
    handleNewsAdd,
    handleNewsCancelEdit,
    handleNewsDelete,
    handleNewsEditClick,
    handleNewsPhotosChange,
    handleNewsUpdate,
    handleRemoveNewsPhoto,
    newsEditorKey,
    newsList,
    newsPhotoPreviews
  } = useAdminDashboard();

  return (
    <section id="tab-news" className={`tab-pane ${activeTab === 'news' ? 'active' : ''}`}>
            <div className="news-cms-grid news-stacked-layout">
              {/* Form News */}
              <div id="news_form_section" className="settings-card">
                <h3>{editingNews ? 'Edit Berita / Kegiatan Sekolah' : 'Tambah Berita / Kegiatan Baru'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  Isi formulir untuk {editingNews ? 'memperbarui' : 'menerbitkan'} artikel berita terbaru mengenai aktivitas sekolah di halaman utama.
                </p>

                <form onSubmit={editingNews ? handleNewsUpdate : handleNewsAdd} key={editingNews ? `edit-${editingNews.id}-${newsEditorKey}` : 'new'} encType="multipart/form-data">
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_title" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Judul Berita *</label>
                    <input
                      type="text"
                      id="news_title"
                      name="title"
                      className="form-control"
                      placeholder="Contoh: Pembagian Rapor Semester Genap"
                      defaultValue={editingNews ? editingNews.title : ''}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="news_date" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tanggal Publikasi *</label>
                      <input
                        type="text"
                        id="news_date"
                        name="date"
                        className="form-control"
                        placeholder="Contoh: 20 Jun 2026"
                        defaultValue={editingNews ? editingNews.date : ''}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="news_category" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Kategori *</label>
                      <input
                        type="text"
                        id="news_category"
                        name="category"
                        className="form-control"
                        placeholder="Contoh: Kegiatan, Prestasi"
                        defaultValue={editingNews ? editingNews.category : ''}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_image" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Pilih Ilustrasi Bawaan *</label>
                    <select id="news_image" name="image" className="form-control" defaultValue={editingNews ? editingNews.image : '/images/news_hari_guru.svg'} style={{ width: '100%' }} required>
                      <option value="/images/news_hari_guru.svg">Hari Guru Nasional (Merah/Gold)</option>
                      <option value="/images/news_imunisasi.svg">Program Imunisasi / BIAS (Biru Medis)</option>
                      <option value="/images/news_kerja_bakti.svg">Sabtu Bersih / Lingkungan (Hijau Alam)</option>
                      <option value="/images/news_rapat_komite.svg">Musyawarah / Komite (Biru/Orange)</option>
                    </select>
                    <div style={{ marginTop: '10px' }}>
                      <label htmlFor="news_photo" style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.9rem' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1.5MB per berkas):</label>
                      <input
                        type="file"
                        id="news_photo"
                        name="photos"
                        multiple
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleNewsPhotosChange}
                        style={{ width: '100%' }}
                      />
                      {editingNews ? (
                        <p style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '6px', marginBottom: '10px', fontWeight: 500 }}>
                          ℹ️ <strong>Foto Saat Ini:</strong> Berita ini sudah memiliki {editingNews.images ? editingNews.images.length : 1} foto. Mengunggah foto baru di atas akan menggantikan galeri foto saat ini. Kosongkan jika ingin mempertahankan foto saat ini.
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: '10px' }}>
                          💡 <strong>Multi-Upload:</strong> Anda dapat memilih beberapa foto sekaligus untuk membuat galeri dokumentasi dalam satu postingan berita!
                        </p>
                      )}

                      {/* Glassmorphic Multi Photo Preview Area */}
                      {newsPhotoPreviews.length > 0 && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                        }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📸 Foto terpilih ({newsPhotoPreviews.length}):
                          </p>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', 
                            gap: '8px' 
                          }}>
                            {newsPhotoPreviews.map((previewUrl, index) => (
                              <div key={index} style={{ 
                                position: 'relative', 
                                aspectRatio: '1/1', 
                                borderRadius: '6px', 
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}>
                                <img 
                                  src={previewUrl} 
                                  alt={`Preview ${index}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewsPhoto(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                    transition: 'background 0.2s, transform 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = '#ef4444';
                                    e.target.style.transform = 'scale(1.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                                    e.target.style.transform = 'none';
                                  }}
                                  title="Hapus foto ini"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_content" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Isi Lengkap Artikel Berita *</label>
                    <RichTextEditor key={newsEditorKey} defaultValue={editingNews ? editingNews.content : ''} placeholder="Tuliskan isi berita lengkap di sini... Anda bisa menebalkan teks, membuat daftar list, meratakan teks, serta menyisipkan tautan web." />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                    {editingNews && (
                      <button type="button" onClick={handleNewsCancelEdit} className="btn" style={{ flex: 1, padding: '0.65rem', backgroundColor: '#64748b', color: '#ffffff', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>✕ Batal Edit</button>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ flex: editingNews ? 2 : 1, padding: '0.65rem' }}>
                      {editingNews ? '💾 Simpan Perubahan' : '📢 Terbitkan Berita'}
                    </button>
                  </div>
                </form>
              </div>

              {/* List News */}
              <div className="settings-card">
                <h3>Daftar Berita Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar warta yang saat ini sedang aktif di halaman Berita Sekolah. Anda dapat menghapusnya jika artikel sudah usang.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', maxHeight: '520px', overflowY: 'auto', paddingRight: '5px' }}>
                  {newsList.length > 0 ? (
                    newsList.map((n) => (
                      <div key={n.id} style={{ display: 'flex', gap: 'var(--space-sm)', border: '1px solid var(--border-color)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-sm)', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', minWidth: 0 }}>
                          <img src={n.image} alt="" style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date} • {n.category}</span>
                              {n.images && n.images.length > 1 && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  color: '#0284c7',
                                  background: 'rgba(14, 165, 233, 0.1)',
                                  border: '1px solid rgba(14, 165, 233, 0.2)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  lineHeight: '1.2'
                                }}>
                                  📸 {n.images.length} Foto
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleNewsEditClick(n)} type="button" className="btn-action-edit">Edit</button>
                          <button onClick={() => handleNewsDelete(n.id)} type="button" className="btn-action-delete">Hapus</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginTop: 'var(--space-md)' }}>Belum ada berita yang diterbitkan.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
  );
}
