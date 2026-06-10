'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function ContentTab() {
  const {
    B,
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
                      🛠️ Mode Pemeliharaan (Maintenance Mode)
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
                      📋 Salin Teks & Klik Kanan (Public Copy Permission)
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
                        defaultValue={ann}
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
                          style={{ width: '100%' }}
                          required
                        />
                      </div>
                    ))
                  )}

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)', padding: '0.5rem 1rem' }}>💾 Simpan Pengumuman</button>
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

                  <button type="submit" className="btn btn-secondary" style={{ marginTop: 'var(--space-xs)', width: '100%', padding: '0.5rem' }}>💾 Simpan Data Statistik</button>
                </form>
              </div>


            </div>
          </section>
  );
}
