'use client';

import { useState, useCallback } from 'react';
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

  const [sentiments, setSentiments] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeSentiment = useCallback(async () => {
    if (messages.length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/ai-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const data = await res.json();
      if (data?.sentiments?.length > 0) {
        const map = {};
        data.sentiments.forEach(s => { map[s.id] = s; });
        setSentiments(prev => ({ ...prev, ...map }));
      }
    } catch (e) {
      console.error('Sentiment analysis error:', e);
    } finally {
      setAnalyzing(false);
    }
  }, [messages]);

  // --- AI Reply Draft ---
  const [replyModal, setReplyModal] = useState(null); // { msg, draft, subject, loading }

  const handleGenerateReply = useCallback(async (msg) => {
    setReplyModal({ msg, draft: null, subject: null, loading: true });
    try {
      const res = await fetch('/api/admin/reply-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg.message,
          name: msg.name,
          role: msg.role,
          type: msg.type
        })
      });
      const data = await res.json();
      setReplyModal({ msg, draft: data.draft || 'Gagal membuat draf.', subject: data.subject || 'Balasan', loading: false });
    } catch (e) {
      setReplyModal({ msg, draft: 'Terjadi kesalahan. Coba lagi.', subject: 'Balasan', loading: false });
    }
  }, []);

  const getSentimentBadge = (msgId) => {
    const s = sentiments[msgId];
    if (!s) return null;
    const colors = {
      positif: { bg: '#d1fae5', text: '#065f46', icon: '😊' },
      negatif: { bg: '#fee2e2', text: '#991b1b', icon: '😟' },
      urgent: { bg: '#fef3c7', text: '#92400e', icon: '🔴' },
      netral: { bg: '#e2e8f0', text: '#475569', icon: '😐' },
    };
    const c = colors[s.sentiment] || colors.netral;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 700,
        backgroundColor: c.bg,
        color: c.text,
        marginLeft: '6px'
      }}>
        {c.icon} {s.sentiment}
      </span>
    );
  };

  return (
    <section id="tab-messages" className={`tab-pane ${activeTab === 'messages' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Kotak Masuk Hubungi Kami & Buku Tamu</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Moderasi pesan testimoni Buku Tamu dan baca pesan privat/saran yang dikirimkan oleh publik.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeSentiment}
                  disabled={analyzing || messages.length === 0}
                  style={{
                    background: analyzing ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: analyzing || messages.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: analyzing || messages.length === 0 ? 0.6 : 1,
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {analyzing ? (
                    <>⏳ Menganalisis...</>
                  ) : (
                    <>🤖 Analisis Sentimen AI</>
                  )}
                </button>
              </div>

              {/* AI Reply Draft Modal */}
              {replyModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999, padding: '20px', boxSizing: 'border-box'
                }}>
                  <div style={{
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', width: '100%', maxWidth: '600px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4)', overflow: 'hidden'
                  }}>
                    <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, border: 'none', padding: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🧠 Draf Balasan AI
                        {replyModal.msg.name && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>untuk {replyModal.msg.name}</span>}
                      </h3>
                      <button type="button" onClick={() => setReplyModal(null)}
                        style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ padding: '20px 22px' }}>
                      {replyModal.loading ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                          ⏳ Merumuskan draf balasan...
                        </div>
                      ) : (
                        <>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Pesan Asli</label>
                          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '14px', maxHeight: '80px', overflowY: 'auto' }}>
                            {replyModal.msg.message}
                          </div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Draf Balasan</label>
                          <textarea
                            readOnly
                            value={replyModal.draft}
                            style={{
                              width: '100%', minHeight: '180px', padding: '12px 14px',
                              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px', color: '#e2e8f0', fontSize: '0.87rem',
                              lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => { navigator.clipboard.writeText(replyModal.draft); }}
                              style={{
                                background: 'rgba(255,255,255,0.06)', color: '#cbd5e1',
                                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                                padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600
                              }}
                            >
                              📋 Salin Teks
                            </button>
                            {(replyModal.msg.no_hp || replyModal.msg.no_hp_ayah || replyModal.msg.no_hp_ibu) && (
                              <a
                                href={`https://wa.me/${(replyModal.msg.no_hp || replyModal.msg.no_hp_ayah || '').replace(/[^0-9]/g,'').replace(/^0/,'62')}?text=${encodeURIComponent(replyModal.draft)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                  background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                                  color: '#fff', border: 'none', borderRadius: '8px',
                                  padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700,
                                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px'
                                }}
                              >
                                📲 Kirim via WhatsApp
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                              {msg.name || '-'}
                              {getSentimentBadge(msg.id)}
                            </div>
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
                                onClick={() => handleGenerateReply(msg)}
                                style={{
                                  padding: '0.3rem 0.5rem', fontSize: '0.75rem', margin: 0,
                                  width: '100%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                  color: '#fff', border: 'none', borderRadius: '6px',
                                  cursor: 'pointer', fontWeight: 700, marginBottom: '4px'
                                }}
                              >
                                🧠 Draf Balasan AI
                              </button>
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
