'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function NewsModerationTab() {
  const { showToast, confirmDialog } = useAdminDashboard();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news/comments', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
      } else {
        showToast('error', data.error || 'Gagal mengambil data komentar');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi saat memuat komentar');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDeleteComment = async (id, nama) => {
    const confirmed = await confirmDialog({
      title: 'Hapus Komentar?',
      message: `Apakah Anda yakin ingin menghapus komentar dari "${nama}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      danger: true,
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/news/comments?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Komentar berhasil dihapus');
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        showToast('error', data.error || 'Gagal menghapus komentar');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan saat menghapus komentar');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredComments = comments.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.nama || '').toLowerCase().includes(q) ||
      (c.pesan || '').toLowerCase().includes(q) ||
      (c.news_title || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Info */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary-dark)' }}>
              Moderasi Komentar &amp; Reaksi Berita
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Kelola tanggapan publik dan pantau aktivitas keterlibatan orang tua murid pada artikel sekolah.
            </p>
          </div>
          
          <button
            onClick={fetchComments}
            disabled={loading}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Perbarui Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Komentar Masuk
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 0 0', color: 'var(--primary)' }}>
            {comments.length}
          </h3>
        </div>

        <div className="card" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Berita Dikomentari
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 0 0', color: '#10b981' }}>
            {new Set(comments.map(c => c.news_id)).size} Artikel
          </h3>
        </div>
      </div>

      {/* Filter & Table Area */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Cari komentar berdasarkan nama, kata kunci, atau judul berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-color)',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Table / List */}
        {loading ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat data komentar...
          </div>
        ) : filteredComments.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            {searchQuery ? 'Tidak ada komentar yang sesuai dengan pencarian.' : 'Belum ada komentar publik yang dikirimkan.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Pengirim</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Judul Berita</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Isi Komentar</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, width: '140px' }}>Waktu</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right', width: '90px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-dark)', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: 'var(--primary)', color: 'white',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.72rem', fontWeight: 800, flexShrink: 0
                        }}>
                          {item.nama.charAt(0).toUpperCase()}
                        </span>
                        {item.nama}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-color)', fontWeight: 600, verticalAlign: 'top', maxWidth: '220px' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.news_title}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-color)', verticalAlign: 'top', maxWidth: '320px', lineHeight: 1.5 }}>
                      {item.pesan}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                      {new Date(item.created_at).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', verticalAlign: 'top' }}>
                      <button
                        onClick={() => handleDeleteComment(item.id, item.nama)}
                        disabled={deletingId === item.id}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '5px 10px', fontSize: '0.78rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Hapus Komentar"
                      >
                        {deletingId === item.id ? 'Menghapus...' : 'Hapus'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
