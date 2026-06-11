'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function StudentsTab() {
  const {
    activeTab,
    filteredStudents,
    handleDeleteStudent,
    setEditingStudent,
    setStudAddress,
    setStudBirthDate,
    setStudBirthPlace,
    setStudClass,
    setStudGender,
    setStudGrades,
    setStudName,
    setStudNis,
    setStudNisn,
    setStudParentName,
    setStudParentPhone,
    setStudStatus,
    setStudentClassFilter,
    setStudentGenderFilter,
    setStudentModalOpen,
    setStudentSearch,
    setStudentStatusFilter,
    studentClassFilter,
    studentGenderFilter,
    studentSearch,
    studentStatusFilter,
    students
  } = useAdminDashboard();

  return (
    <section id="tab-students" className={`tab-pane ${activeTab === 'students' ? 'active' : ''}`}>
            <div className="admin-table">
              
              {/* Premium Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#dcfce7', color: '#15803d', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>👥</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Siswa Aktif</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>👦</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Laki-laki (Aktif)</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.gender === 'Laki-laki' && s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#fce7f3', color: '#be185d', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>👧</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Perempuan (Aktif)</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.gender === 'Perempuan' && s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', color: '#475569', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>🏫</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sebaran Kelas</h4>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {[1, 2, 3, 4, 5, 6].map(cls => (
                        <span key={cls} title={`Kelas ${cls}`} style={{ display: 'inline-block', padding: '2px 4px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155' }}>
                          K{cls}:{students.filter(s => s.class?.startsWith(String(cls)) && s.status === 'Aktif').length}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Daftar Database Siswa SDN Bobong</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kelola basis data lengkap seluruh siswa terdaftar, riwayat perpindahan, dan status akademik.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setStudNisn('');
                    setStudNis('');
                    setStudName('');
                    setStudClass('1');
                    setStudGender('Laki-laki');
                    setStudBirthPlace('');
                    setStudBirthDate('');
                    setStudAddress('');
                    setStudParentName('');
                    setStudParentPhone('');
                    setStudStatus('Aktif');
                    setStudentModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ➕ Tambah Siswa Baru
                </button>
              </div>

              {/* Search & Multi Filter Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Cari siswa berdasarkan NISN, NIS, nama lengkap, alamat, atau nama orang tua..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  
                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Filter Kelas</label>
                    <select
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', height: '40px' }}
                    >
                      <option value="Semua">Semua Kelas</option>
                      {['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D'].map(cls => (
                        <option key={cls} value={cls}>Kelas {cls}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Filter Jenis Kelamin</label>
                    <select
                      value={studentGenderFilter}
                      onChange={(e) => setStudentGenderFilter(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', height: '40px' }}
                    >
                      <option value="Semua">Semua Gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Filter Status</label>
                    <select
                      value={studentStatusFilter}
                      onChange={(e) => setStudentStatusFilter(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', height: '40px' }}
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Lulus">Lulus</option>
                      <option value="Pindah">Pindah</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Responsive Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '110px' }}>NISN / NIS</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Kelas</th>
                      <th>Nama Lengkap Siswa</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>L/P</th>
                      <th style={{ width: '220px' }}>TTL & Alamat</th>
                      <th style={{ width: '200px' }}>Orang Tua & Kontak</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((stud, idx) => (
                        <tr key={stud.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{stud.nisn || '-'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>NIS: {stud.nis || '-'}</div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#1e293b', fontWeight: 800 }}>
                              {stud.class || '-'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{stud.name || '-'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>
                            <span style={{ 
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              backgroundColor: stud.gender === 'Laki-laki' ? '#e0f2fe' : '#fce7f3',
                              color: stud.gender === 'Laki-laki' ? '#0369a1' : '#be185d'
                            }}>
                              {stud.gender === 'Laki-laki' ? 'L' : 'P'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                            <div>📍 {stud.birth_place || '-'}, {stud.birth_date || '-'}</div>
                            <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>🏠 {stud.address || '-'}</div>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                            <div style={{ fontWeight: 600 }}>👨‍👦 {stud.parent_name || '-'}</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>📞 {stud.parent_phone || '-'}</div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: 
                                stud.status === 'Aktif' ? '#dcfce7' : 
                                stud.status === 'Lulus' ? '#e0f2fe' : 
                                stud.status === 'Pindah' ? '#fee2e2' : '#f1f5f9',
                              color: 
                                stud.status === 'Aktif' ? '#15803d' : 
                                stud.status === 'Lulus' ? '#0369a1' : 
                                stud.status === 'Pindah' ? '#b91c1c' : '#475569',
                              border: 
                                stud.status === 'Aktif' ? '1px solid #bbf7d0' : 
                                stud.status === 'Lulus' ? '1px solid #bae6fd' : 
                                stud.status === 'Pindah' ? '1px solid #fecaca' : '1px solid #cbd5e1'
                            }}>
                              {stud.status || 'Aktif'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStudent(stud);
                                  setStudNisn(stud.nisn || '');
                                  setStudNis(stud.nis || '');
                                  setStudName(stud.name || '');
                                  setStudClass(stud.class || '1');
                                  setStudGender(stud.gender || 'Laki-laki');
                                  setStudBirthPlace(stud.birth_place || '');
                                  setStudBirthDate(stud.birth_date || '');
                                  setStudAddress(stud.address || '');
                                  setStudParentName(stud.parent_name || '');
                                  setStudParentPhone(stud.parent_phone || '');
                                  setStudStatus(stud.status || 'Aktif');
                                  const g = stud.grades || {};
                                  setStudGrades({
                                    ppkn: g.ppkn || '',
                                    indonesia: g.indonesia || '',
                                    matematika: g.matematika || '',
                                    ipas: g.ipas || '',
                                    seni: g.seni || '',
                                    pjok: g.pjok || '',
                                    inggris: g.inggris || '',
                                    agama: g.agama || '',
                                    mulok: g.mulok || ''
                                  });
                                  setStudentModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1' }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(stud.id)}
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
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data siswa yang cocok dengan kriteria pencarian Anda.
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
