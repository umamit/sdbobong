'use client';

import { useState, useEffect } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function ContentTab() {
  const {
    activeTab,
    config,
    handleAllowCopyToggle,
    handleAnnouncementsUpdate,
    handleMaintenanceModeToggle,
    handleStatsUpdate
  } = useAdminDashboard();



  return (
    <section id="tab-content" className={`tab-pane ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="settings-grid">
              {/* Mode Pemeliharaan (Maintenance Mode) */}
              <div className="settings-card" style={{ gridColumn: 'span 2', borderColor: config?.stats?.maintenance_mode ? '#f59e0b' : 'var(--border-color)', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div style={{ flex: '1', minWidth: '280px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: config?.stats?.maintenance_mode ? '#f59e0b' : 'var(--text-color)', transition: 'color 0.3s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      Mode Pemeliharaan (Maintenance Mode)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
                      Saat diaktifkan, seluruh halaman publik akan dikunci otomatis dan dialihkan ke halaman pemeliharaan premium. Anda sebagai admin tetap bisa mengakses dashboard ini secara penuh.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'inline-block', position: 'relative', width: '50px', height: '28px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!config?.stats?.maintenance_mode}
                        onChange={handleMaintenanceModeToggle}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: config?.stats?.maintenance_mode ? '#f59e0b' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '34px',
                        boxShadow: config?.stats?.maintenance_mode ? '0 0 10px rgba(245, 158, 11, 0.4)' : 'none'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '20px', width: '20px',
                          left: config?.stats?.maintenance_mode ? '26px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Salin Teks Halaman Publik (Public Copy Permission) */}
              <div className="settings-card" style={{ gridColumn: 'span 2', borderColor: config?.stats?.allow_copy ? '#10b981' : 'var(--border-color)', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div style={{ flex: '1', minWidth: '280px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: config?.stats?.allow_copy ? '#10b981' : 'var(--text-color)', transition: 'color 0.3s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Salin Teks & Klik Kanan (Public Copy Permission)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
                      Saat dinonaktifkan (Default), proteksi anti-plagiasi aktif untuk mencegah pengunjung menyalin tulisan, mengakses menu klik kanan, atau menyeret gambar di halaman publik. Aktifkan agar pengunjung dapat menyalin materi pelajaran atau pengumuman secara bebas.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'inline-block', position: 'relative', width: '50px', height: '28px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!config?.stats?.allow_copy}
                        onChange={handleAllowCopyToggle}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: config?.stats?.allow_copy ? '#10b981' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '34px',
                        boxShadow: config?.stats?.allow_copy ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '20px', width: '20px',
                          left: config?.stats?.allow_copy ? '26px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="settings-card">
                <h3>Edit Pengumuman Berjalan (Marquee Banner)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Teks pengumuman di bawah akan ditampilkan di bagian paling atas halaman website utama publik. Anda dapat memasukkan hingga 3 pengumuman sekaligus.
                </p>

                <form onSubmit={handleAnnouncementsUpdate}>
                  <input type="hidden" name="action_type" value="announcements" />
                  {config?.marquee_announcements && config?.marquee_announcements.map((ann, idx) => (
                    <div key={idx} className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label htmlFor={`announcement_${idx}`}>Pengumuman #{idx + 1}</label>
                      <input
                        type="text"
                        id={`announcement_${idx}`}
                        name="announcements[]"
                        className="form-control"
                        value={ann}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig(prev => {
                            const newAnn = [...(prev?.marquee_announcements || [])];
                            newAnn[idx] = val;
                            return { ...prev, marquee_announcements: newAnn };
                          });
                        }}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  ))}
                  {(!config?.marquee_announcements || config?.marquee_announcements.length === 0) && (
                    [0, 1, 2].map((idx) => (
                      <div key={idx} className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor={`announcement_${idx}`}>Pengumuman #{idx + 1}</label>
                        <input
                          type="text"
                          id={`announcement_${idx}`}
                          name="announcements[]"
                          className="form-control"
                          value={config?.marquee_announcements?.[idx] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig(prev => {
                              const newAnn = [...(prev?.marquee_announcements || ['', '', ''])];
                              newAnn[idx] = val;
                              return { ...prev, marquee_announcements: newAnn };
                            });
                          }}
                          style={{ width: '100%' }}
                          required
                        />
                      </div>
                    ))
                  )}



                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Simpan Pengumuman
                  </button>
                </form>
              </div>

              {/* Statistics counter */}
              <div className="settings-card">
                <h3>Update Statistik Sekolah (Counter)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Ubah data angka untuk indikator statistik sekolah yang ditampilkan di halaman beranda utama.
                </p>

                <form onSubmit={handleStatsUpdate}>
                  <input type="hidden" name="action_type" value="stats" />

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="siswa_aktif" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Siswa Aktif</label>
                    <input
                      type="number"
                      id="siswa_aktif"
                      name="siswa_aktif"
                      className="form-control"
                      defaultValue={config?.stats?.siswa_aktif || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="guru_staf" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Guru & Staf</label>
                    <input
                      type="number"
                      id="guru_staf"
                      name="guru_staf"
                      className="form-control"
                      defaultValue={config?.stats?.guru_staf || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ruang_kelas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Ruang Kelas</label>
                    <input
                      type="number"
                      id="ruang_kelas"
                      name="ruang_kelas"
                      className="form-control"
                      defaultValue={config?.stats?.ruang_kelas || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="akreditasi" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Akreditasi</label>
                    <input
                      type="text"
                      id="akreditasi"
                      name="akreditasi"
                      className="form-control"
                      defaultValue={config?.stats?.akreditasi || 'B'}
                      maxLength={2}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="rombel" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Rombongan Belajar (Rombel)</label>
                    <input
                      type="number"
                      id="rombel"
                      name="rombel"
                      className="form-control"
                      defaultValue={config?.stats?.rombel || 6}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="uks" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Unit Kesehatan Sekolah (UKS)</label>
                    <input
                      type="number"
                      id="uks"
                      name="uks"
                      className="form-control"
                      defaultValue={config?.stats?.uks || 1}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="gudang" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Gudang</label>
                    <input
                      type="number"
                      id="gudang"
                      name="gudang"
                      className="form-control"
                      defaultValue={config?.stats?.gudang || 1}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="toilet" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Kamar Mandi / WC</label>
                    <input
                      type="number"
                      id="toilet"
                      name="toilet"
                      className="form-control"
                      defaultValue={config?.stats?.toilet || 2}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="cuci_tangan" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Area Cuci Tangan</label>
                    <input
                      type="number"
                      id="cuci_tangan"
                      name="cuci_tangan"
                      className="form-control"
                      defaultValue={config?.stats?.cuci_tangan || 4}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary" style={{ marginTop: 'var(--space-xs)', width: '100%', padding: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Simpan Data Statistik
                  </button>
                </form>
              </div>


              {/* Pengaturan Pop-Up Pengumuman Penting */}
              <div className="settings-card" style={{ gridColumn: 'span 2' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  Banner Pop-Up Pengumuman Penting
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Banner ini akan otomatis muncul sebagai jendela pop-up saat pengunjung pertama kali membuka website.
                </p>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const popupData = {
                    enabled: form.popup_enabled.checked,
                    title: form.popup_title.value,
                    badge: form.popup_badge.value,
                    content: form.popup_content.value,
                    link: form.popup_link.value,
                    link_label: form.popup_link_label.value,
                  };

                  try {
                    const res = await fetch('/api/config', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action_type: 'popup_announcement', popup_announcement: popupData })
                    });
                    if (res.ok) {
                      showToast('success', 'Pengaturan Banner Pop-Up Pengumuman berhasil disimpan!');
                    } else {
                      showToast('error', 'Gagal menyimpan pengumuman pop-up');
                    }
                  } catch {
                    showToast('error', 'Terjadi kesalahan sistem');
                  }
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <input
                      type="checkbox"
                      id="popup_enabled"
                      name="popup_enabled"
                      defaultChecked={!!config?.popup_announcement?.enabled}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="popup_enabled" style={{ fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      Aktifkan Pop-Up Pengumuman Ini Di Website
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Judul Pengumuman *</label>
                      <input
                        type="text"
                        name="popup_title"
                        className="form-control"
                        defaultValue={config?.popup_announcement?.title || ''}
                        placeholder="Mis: Pendaftaran PPDB Tahun Ajaran 2026/2027 Resmi Dibuka!"
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Label / Badge</label>
                      <input
                        type="text"
                        name="popup_badge"
                        className="form-control"
                        defaultValue={config?.popup_announcement?.badge || 'Pengumuman Penting'}
                        placeholder="Mis: PENTING / PPDB / INFO DARURAT"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Isi Pengumuman / Pesan Singkat *</label>
                    <textarea
                      name="popup_content"
                      className="form-control"
                      rows={3}
                      defaultValue={config?.popup_announcement?.content || ''}
                      placeholder="Tuliskan detail pengumuman yang ingin disampaikan kepada pengunjung..."
                      required
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Tautan Tombol Aksi (Opsional)</label>
                      <input
                        type="text"
                        name="popup_link"
                        className="form-control"
                        defaultValue={config?.popup_announcement?.link || ''}
                        placeholder="Mis: /ppdb/daftar atau /berita"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Teks Tombol Aksi</label>
                      <input
                        type="text"
                        name="popup_link_label"
                        className="form-control"
                        defaultValue={config?.popup_announcement?.link_label || 'Lihat Selengkapnya →'}
                        placeholder="Mis: Daftar Sekarang →"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem', fontWeight: 700 }}>
                    Simpan Pengaturan Pop-Up
                  </button>
                </form>
              </div>

            </div>
          </section>
  );
}
