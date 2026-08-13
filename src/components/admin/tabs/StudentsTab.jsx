'use client';


import { useState } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';
import DapodikSyncModal from '../shared/modals/DapodikSyncModal';

export default function StudentsTab() {
  const [isDapodikModalOpen, setIsDapodikModalOpen] = useState(false);
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
                  <div style={{ backgroundColor: '#dcfce7', color: '#15803d', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Siswa Aktif</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Laki-laki (Aktif)</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.gender === 'Laki-laki' && s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#fce7f3', color: '#be185d', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Perempuan (Aktif)</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{students.filter(s => s.gender === 'Perempuan' && s.status === 'Aktif').length} Siswa</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', color: '#475569', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
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

              {/* Title & Add Button Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Data Induk Siswa Sekolah</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Kelola biodata, NISN/NIS, domisili, data orang tua, dan nilai akademik siswa secara mandiri.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setIsDapodikModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fafafb', color: '#334155', border: '1px solid #cbd5e1' }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    Sinkronisasi Dapodik
                  </button>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Tambah Siswa Baru
                  </button>
                </div>
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
                  <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  
                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Filter Kelas</label>
                    <select
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="form-control"
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '9999px',
                        padding: '0 2.5rem 0 1.25rem',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25rem',
                        cursor: 'pointer'
                      }}
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
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '9999px',
                        padding: '0 2.5rem 0 1.25rem',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25rem',
                        cursor: 'pointer'
                      }}
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
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '9999px',
                        padding: '0 2.5rem 0 1.25rem',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25rem',
                        cursor: 'pointer'
                      }}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {stud.birth_place || '-'}, {stud.birth_date || '-'}
                            </div>
                            <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                              {stud.address || '-'}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {stud.parent_name || '-'}
                            </div>
                            <div style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              {stud.parent_phone || '-'}
                            </div>
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
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(stud.id)}
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
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data siswa yang cocok dengan kriteria pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <DapodikSyncModal 
              isOpen={isDapodikModalOpen} 
              onClose={() => setIsDapodikModalOpen(false)}
              onSyncSuccess={() => {
                // Refresh context to load updated students and statistics
                window.location.reload();
              }}
            />
          </section>
  );
}
