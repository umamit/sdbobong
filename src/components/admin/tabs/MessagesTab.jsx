'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function MessagesTab() {
  const {
    activeTab,
    filteredMessages,
    handleDeleteMessage,
    handleModerateMessage,
    messageFilterStatus,
    messageFilterType,
    messageSearch,
    messages,
    setMessageFilterStatus,
    setMessageFilterType,
    setMessageSearch
  } = useAdminDashboard();

  return (
    <section id="tab-messages" className={`tab-pane ${activeTab === 'messages' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Kotak Masuk Hubungi Kami & Buku Tamu</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Moderasi pesan testimoni Buku Tamu dan baca pesan privat/saran yang dikirimkan oleh publik.</p>
                </div>
              </div>

              {/* Messages Filters Row */}
              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                
                {/* Search Bar */}
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Cari pengirim, isi pesan, atau hubungan..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
                </div>

                {/* Filter Type Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="msg-filter-type" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Tipe:</label>
                  <select
                    id="msg-filter-type"
                    value={messageFilterType}
                    onChange={(e) => setMessageFilterType(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.5rem', borderRadius: '8px', minWidth: '130px' }}
                  >
                    <option value="all">📁 Semua</option>
                    <option value="guestbook">💬 Buku Tamu</option>
                    <option value="feedback">🔒 Kotak Saran</option>
                  </select>
                </div>

                {/* Filter Status Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="msg-filter-status" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status:</label>
                  <select
                    id="msg-filter-status"
                    value={messageFilterStatus}
                    onChange={(e) => setMessageFilterStatus(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.5rem', borderRadius: '8px', minWidth: '130px' }}
                  >
                    <option value="all">📂 Semua</option>
                    <option value="pending">⏳ Menunggu</option>
                    <option value="approved">✅ Disetujui</option>
                    <option value="rejected">❌ Ditolak</option>
                  </select>
                </div>

              </div>

              {/* Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '180px' }}>Nama & Hubungan</th>
                      <th style={{ width: '130px', textAlign: 'center' }}>Tipe Saluran</th>
                      <th>Isi Pesan / Kritik & Saran</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Tanggal</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '220px', textAlign: 'center' }}>Moderasi / Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((msg, idx) => (
                        <tr key={msg.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                            <div>{msg.name || '-'}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '2px' }}>👤 {msg.role || '-'}</div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge" style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: msg.type === 'feedback' ? '#fee2e2' : '#f0fdf4',
                              color: msg.type === 'feedback' ? '#991b1b' : '#166534',
                              border: msg.type === 'feedback' ? '1px solid #fecaca' : '1px solid #bbf7d0'
                            }}>
                              {msg.type === 'feedback' ? '🔒 PRIVATE' : '💬 PUBLIC'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                            {msg.message || '-'}
                          </td>
                          <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                            {msg.created_at ? msg.created_at.split('T')[0] : (msg.date || '-')}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {msg.type === 'feedback' ? (
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>n/a (Privat)</span>
                            ) : (
                              <span className="badge" style={{ 
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: msg.status === 'approved' ? '#dcfce7' : msg.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                color: msg.status === 'approved' ? '#15803d' : msg.status === 'rejected' ? '#b91c1c' : '#a16207',
                                border: msg.status === 'approved' ? '1px solid #bbf7d0' : msg.status === 'rejected' ? '1px solid #fecaca' : '1px solid #fef08a'
                              }}>
                                {msg.status === 'approved' ? '✅ Disetujui' : msg.status === 'rejected' ? '❌ Ditolak' : '⏳ Menunggu'}
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexDirection: 'column' }}>
                              {msg.type === 'guestbook' && (
                                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '4px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleModerateMessage(msg.id, 'approved')}
                                    disabled={msg.status === 'approved'}
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.75rem', opacity: msg.status === 'approved' ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}
                                  >
                                    👍 Setujui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleModerateMessage(msg.id, 'rejected')}
                                    disabled={msg.status === 'rejected'}
                                    className="btn-action-delete"
                                    style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', opacity: msg.status === 'rejected' ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', margin: 0 }}
                                  >
                                    👎 Tolak
                                  </button>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="btn-action-delete"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0, width: '100%', alignSelf: 'center' }}
                              >
                                🗑️ Hapus Permanen
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada pesan masuk yang cocok dengan filter atau pencarian Anda.
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
