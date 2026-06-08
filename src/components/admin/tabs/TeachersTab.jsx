'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function TeachersTab() {
  const {
    activeTab,
    handleMakeContact,
    handleTeacherDelete,
    handleTeacherEditClick,
    setAddTeacherModalOpen,
    teachers
  } = useAdminDashboard();

  return (
    <section id="tab-teachers" className={`tab-pane ${activeTab === 'teachers' ? 'active' : ''}`}>
            <div>
              {/* Table List of Teachers */}
              <div className="settings-card" style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Daftar Guru & Staf Saat Ini</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Daftar pendidik yang terbit di halaman profil publik. Klik tombol **Edit** untuk memuat datanya.
                    </p>
                  </div>
                  <button 
                    onClick={() => setAddTeacherModalOpen(true)} 
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    ➕ Tambah Pendidik Baru
                  </button>
                </div>

                <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                  <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px', textAlign: 'center' }}>Foto</th>
                        <th>Nama Lengkap</th>
                        <th>Jabatan</th>
                        <th>Status</th>
                        <th style={{ width: '260px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length > 0 ? (
                        teachers.map((t) => (
                          <tr key={t.id}>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--border-color, #e2e8f0)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                backgroundColor: '#f8fafc',
                                margin: '0 auto',
                                flexShrink: 0
                              }}>
                                <img src={t.image || '/images/teacher_1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{t.name}</strong>
                              {t.nip && (
                                <><br /><span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>NIP. {t.nip}</span></>
                              )}
                              {t.details && (
                                <><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.details}</span></>
                              )}
                            </td>
                            <td>{t.role}</td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: t.status === 'PNS' ? 'var(--primary)' : (t.status === 'PPPK' || t.status === 'PPPK PW') ? '#E8FAF0' : '#FFF8E6',
                                color: t.status === 'PNS' ? 'white' : (t.status === 'PPPK' || t.status === 'PPPK PW') ? '#20BA5A' : '#D48408',
                                fontWeight: 600,
                                padding: '0.2rem 0.4rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                                <select 
                                  onChange={(e) => {
                                    const action = e.target.value;
                                    if (action === 'humas') handleMakeContact(t, 'humas');
                                    if (action === 'operator') handleMakeContact(t, 'operator');
                                    e.target.value = ''; // Reset select
                                  }} 
                                  className="form-control" 
                                  style={{ 
                                    padding: '0.25rem 0.5rem', 
                                    fontSize: '0.75rem', 
                                    width: 'auto',
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <option value="" disabled selected style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Set Kontak PPDB</option>
                                  <option value="humas" style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Jadikan Humas</option>
                                  <option value="operator" style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Jadikan Operator</option>
                                </select>
                                <button 
                                  onClick={() => handleTeacherEditClick(t)} 
                                  type="button" 
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}
                                >
                                  Edit
                                </button>
                                <button onClick={() => handleTeacherDelete(t.id)} type="button" className="btn-action-delete" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Belum ada data guru.
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
