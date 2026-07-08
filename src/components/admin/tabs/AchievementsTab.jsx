'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function AchievementsTab() {
  const {
    achDescription,
    achLevel,
    achTitle,
    achYear,
    achievements,
    activeTab,
    editingAchievementId,
    handleAchievementCancel,
    handleAchievementDelete,
    handleAchievementEdit,
    handleAchievementSubmit,
    setAchDescription,
    setAchLevel,
    setAchTitle,
    setAchYear
  } = useAdminDashboard();

  return (
    <section id="tab-achievements" className={`tab-pane ${activeTab === 'achievements' ? 'active' : ''}`}>
            <div className="news-cms-grid">
              {/* Form Add / Edit Achievement */}
              <div className="settings-card">
                <h3>{editingAchievementId ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  {editingAchievementId 
                    ? 'Ubah detail data prestasi guru sekolah yang dipilih.' 
                    : 'Tambahkan data pencapaian atau prestasi guru sekolah untuk ditampilkan pada halaman profil.'}
                </p>

                <form onSubmit={handleAchievementSubmit}>
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ach_title" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Nama/Judul Prestasi *</label>
                    <input
                      type="text"
                      id="ach_title"
                      className="form-control"
                      placeholder="Contoh: Guru Berprestasi I"
                      value={achTitle}
                      onChange={(e) => setAchTitle(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="ach_level" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tingkat Prestasi *</label>
                      <select 
                        id="ach_level" 
                        className="form-control" 
                        value={achLevel} 
                        onChange={(e) => setAchLevel(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      >
                        <option value="Tingkat Kabupaten">Tingkat Kabupaten</option>
                        <option value="Tingkat Provinsi">Tingkat Provinsi</option>
                        <option value="Tingkat Nasional">Tingkat Nasional</option>
                        <option value="Tingkat Internasional">Tingkat Internasional</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ach_year" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tahun Penghargaan *</label>
                      <input
                        type="text"
                        id="ach_year"
                        className="form-control"
                        placeholder="Contoh: 2025"
                        value={achYear}
                        onChange={(e) => setAchYear(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ach_desc" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Deskripsi / Keterangan *</label>
                    <textarea
                      id="ach_desc"
                      className="form-control"
                      placeholder="Jelaskan detail prestasi yang diraih..."
                      value={achDescription}
                      onChange={(e) => setAchDescription(e.target.value)}
                      rows="4"
                      style={{ width: '100%', resize: 'vertical' }}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                      {editingAchievementId ? '💾 Simpan Perubahan' : '➕ Tambah Prestasi'}
                    </button>
                    {editingAchievementId && (
                      <button type="button" onClick={handleAchievementCancel} className="btn btn-secondary">
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table List of Achievements */}
              <div className="settings-card" style={{ overflowX: 'auto' }}>
                <h3>Daftar Prestasi Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar pencapaian yang terbit di halaman profil. Klik **Edit** untuk mengedit atau **Hapus** untuk menghapus.
                </p>

                <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                  <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Tahun</th>
                        <th>Tingkat</th>
                        <th>Judul Prestasi</th>
                        <th>Keterangan</th>
                        <th style={{ width: '140px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achievements.length > 0 ? (
                        achievements.map((ach) => (
                          <tr key={ach.id}>
                            <td><strong>{ach.year}</strong></td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: (ach.level || "").toLowerCase().includes("nasional") 
                                  ? '#E8F5E9' 
                                  : (ach.level || "").toLowerCase().includes("provinsi") 
                                  ? '#E3F2FD' 
                                  : '#FFF8E6',
                                color: (ach.level || "").toLowerCase().includes("nasional") 
                                  ? '#2E7D32' 
                                  : (ach.level || "").toLowerCase().includes("provinsi") 
                                  ? '#1565C0' 
                                  : '#D48408',
                                fontWeight: 600,
                                padding: '0.2rem 0.4rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}>
                                {ach.level}
                              </span>
                            </td>
                            <td><strong style={{ color: 'var(--primary-dark)' }}>{ach.title}</strong></td>
                            <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{ach.description}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => handleAchievementEdit(ach)} 
                                  type="button" 
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleAchievementDelete(ach.id)} 
                                  type="button" 
                                  className="btn-action-delete" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Belum ada data prestasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
  );
}
