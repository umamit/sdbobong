'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function GraduationTab() {
  const {
    activeTab,
    filteredGraduation,
    gradSearch,
    graduation,
    handleDeleteGraduation,
    setEditingGrad,
    setGradBirthDate,
    setGradBirthPlace,
    setGradModalOpen,
    setGradName,
    setGradNisn,
    setGradNoPeserta,
    setGradParentName,
    setGradSearch,
    setGradSkNumber,
    setGradStatus
  } = useAdminDashboard();

  return (
    <section id="tab-graduation" className={`tab-pane ${activeTab === 'graduation' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Kelulusan Mandiri Siswa Kelas 6</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kelola basis data kelulusan mandiri kelas 6. Siswa dapat mencari NISN mereka untuk mengecek kelulusan.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingGrad(null);
                    setGradNisn('');
                    setGradNoPeserta('');
                    setGradName('');
                    setGradStatus('LULUS');
                    setGradSkNumber('');
                    setGradBirthPlace('');
                    setGradBirthDate('');
                    setGradParentName('');
                    setGradModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ➕ Tambah Siswa Baru
                </button>
              </div>

              {/* Graduation Search Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari siswa berdasarkan NISN, nomor peserta ujian, nama lengkap, atau nomor SK..."
                  value={gradSearch}
                  onChange={(e) => setGradSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', left: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '110px' }}>NISN</th>
                      <th style={{ width: '140px' }}>No. Peserta</th>
                      <th>Nama Lengkap Siswa</th>
                      <th style={{ width: '220px' }}>TTL & Orang Tua</th>
                      <th style={{ width: '180px' }}>Nomor SK Kelulusan</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGraduation.length > 0 ? (
                      filteredGraduation.map((student, idx) => (
                        <tr key={student.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{student.nisn || '-'}</td>
                          <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{student.no_peserta || '-'}</td>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{student.name || '-'}</td>
                          <td style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                            <div>📍 {student.birth_place || '-'}, {student.birth_date || '-'}</div>
                            <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>Ortu: {student.parent_name || '-'}</div>
                          </td>
                          <td style={{ fontWeight: 500, color: '#1e293b', fontSize: '0.85rem' }}>📄 {student.sk_number || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: student.status?.toUpperCase() === 'LULUS' ? '#dcfce7' : '#fee2e2',
                              color: student.status?.toUpperCase() === 'LULUS' ? '#15803d' : '#b91c1c',
                              border: student.status?.toUpperCase() === 'LULUS' ? '1px solid #bbf7d0' : '1px solid #fecaca'
                            }}>
                              {student.status?.toUpperCase() === 'LULUS' ? '🎓 Lulus' : '❌ Tidak Lulus'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingGrad(student);
                                  setGradNisn(student.nisn || '');
                                  setGradNoPeserta(student.no_peserta || '');
                                  setGradName(student.name || '');
                                  setGradStatus(student.status || 'LULUS');
                                  setGradSkNumber(student.sk_number || '');
                                  setGradBirthPlace(student.birth_place || '');
                                  setGradBirthDate(student.birth_date || '');
                                  setGradParentName(student.parent_name || '');
                                  setGradModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1' }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGraduation(student.id)}
                                className="btn-action-delete"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0 }}
                              >
                                🗑️ Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data siswa kelas 6 yang cocok dengan pencarian Anda.
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
