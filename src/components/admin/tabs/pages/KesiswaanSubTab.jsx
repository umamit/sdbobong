'use client';

import React from 'react';

export default function KesiswaanSubTab(props) {
  const {
    pageContents,
    handleFieldChange,
    ekskulPreviews,
    handleEkskulFileChange,
    handleAddEkskul,
    handleUpdateEkskul,
    handleRemoveEkskul,
    handleAddKesiswaanPrestasi,
    handleUpdateKesiswaanPrestasi,
    handleRemoveKesiswaanPrestasi,
    handleAddKarya,
    handleUpdateKarya,
    handleRemoveKarya
  } = props;

  return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Kesiswaan</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Kesiswaan & Ekstrakurikuler.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_title || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_text || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Kegiatan Ekstrakurikuler (Ekskul)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar kartu wadah pengembangan minat & bakat siswa.</p>
                      </div>
                      <button type="button" onClick={handleAddEkskul} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Ekskul Baru
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).map((ek, idx) => (
                        <div key={ek.id || idx} style={{ display: 'grid', gridTemplateColumns: '3fr 4fr 2.5fr 1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Kegiatan *</label>
                              <input
                                type="text"
                                placeholder="Nama Ekskul"
                                className="form-control"
                                value={ek.nama || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'nama', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, marginTop: '8px' }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jadwal Latihan *</label>
                              <input
                                type="text"
                                placeholder="Jadwal (e.g. Sabtu, 14.00 - 16.00)"
                                className="form-control"
                                value={ek.jadwal || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'jadwal', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deskripsi Kegiatan *</label>
                            <textarea
                              placeholder="Deskripsikan aktivitas ekskul..."
                              className="form-control"
                              value={ek.deskripsi || ''}
                              onChange={(e) => handleUpdateEkskul(idx, 'deskripsi', e.target.value)}
                              rows="4"
                              style={{ width: '100%', resize: 'vertical' }}
                            ></textarea>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Gambar / Logo Ekskul</label>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px' }}>
                              <div style={{ 
                                width: '55px', 
                                height: '55px', 
                                borderRadius: '8px', 
                                border: '1px solid #cbd5e1', 
                                overflow: 'hidden', 
                                backgroundColor: '#ffffff', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <img 
                                  src={ekskulPreviews[idx] || ek.image || '/images/ekskul_pramuka.svg'} 
                                  alt="Ekskul Preview" 
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleEkskulFileChange(idx, e.target.files[0])}
                                style={{ fontSize: '0.7rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0, textAlign: 'center' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Ekstra Wajib</label>
                            <input
                              type="checkbox"
                              checked={!!ek.is_wajib}
                              onChange={(e) => handleUpdateEkskul(idx, 'is_wajib', e.target.checked)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEkskul(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada data ekstrakurikuler. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Prestasi Hebat Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar raihan kejuaraan murid yang dipajang di halaman Kesiswaan.</p>
                      </div>
                      <button type="button" onClick={handleAddKesiswaanPrestasi} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Prestasi Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.prestasi || []).map((pr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Peringkat (e.g. 1st / Juara)"
                              className="form-control"
                              value={pr.rank || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'rank', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={pr.icon || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Tingkat Lomba"
                              className="form-control"
                              value={pr.level || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'level', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Juara / Lomba..."
                              className="form-control"
                              value={pr.title || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Detail / Deskripsi Prestasi..."
                              className="form-control"
                              value={pr.desc || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKesiswaanPrestasi(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.prestasi || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada prestasi murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Galeri Karya Kreatif Kreasi Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Etalase pameran kreasi seni, budaya, kerajinan tangan, atau puisi murid.</p>
                      </div>
                      <button type="button" onClick={handleAddKarya} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Karya Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.karya || []).map((kr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={kr.icon || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Judul Karya"
                              className="form-control"
                              value={kr.title || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Kategori / Tema (P5)"
                              className="form-control"
                              value={kr.category || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'category', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Penjelasan ringkas karya..."
                              className="form-control"
                              value={kr.desc || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKarya(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.karya || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada karya murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
  );
}
