'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function AlumniTab() {
  const { showToast, confirmDialog } = useAdminDashboard();
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alumni', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setAlumniList(data.alumni || []);
      } else {
        showToast('error', data.error || 'Gagal mengambil data alumni');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi saat memuat alumni');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleDelete = async (id, nama) => {
    const confirmed = await confirmDialog({
      title: 'Hapus Data Alumni?',
      message: `Apakah Anda yakin ingin menghapus data alumni "${nama}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      danger: true,
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/alumni?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Data alumni berhasil dihapus');
        setAlumniList(prev => prev.filter(a => a.id !== id));
      } else {
        showToast('error', data.error || 'Gagal menghapus data alumni');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem saat menghapus alumni');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAlumni = alumniList.filter(a => {
    const q = searchQuery.toLowerCase();
    return (
      (a.nama_lengkap || '').toLowerCase().includes(q) ||
      (a.tahun_lulus || '').toLowerCase().includes(q) ||
      (a.sekolah_lanjutan || '').toLowerCase().includes(q) ||
      (a.pekerjaan || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Info */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary-dark)' }}>
              Kelola Data Alumni Sekolah
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Pantau direktori alumni terdata, rekapitulasi angkatan lulusan, dan kelola integritas data.
            </p>
          </div>
          
          <button
            onClick={fetchAlumni}
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
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Alumni Terdata
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 0 0', color: 'var(--primary)' }}>
            {alumniList.length}
          </h3>
        </div>

        <div className="card" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Jumlah Angkatan Lulusan
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 0 0', color: '#10b981' }}>
            {new Set(alumniList.map(a => a.tahun_lulus)).size} Angkatan
          </h3>
        </div>
      </div>

      {/* Search & Table */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Cari nama alumni, angkatan, sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px',
              border: '1.5px solid var(--border-color)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data alumni...</div>
        ) : filteredAlumni.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            Belum ada data alumni terdaftar.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Nama Alumni</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Angkatan</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Pendidikan Lanjutan</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Pekerjaan / Aktivitas</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Pesan &amp; Kesan</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumni.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-dark)', verticalAlign: 'top' }}>
                      {item.nama_lengkap}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)', verticalAlign: 'top' }}>
                      {item.tahun_lulus}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-color)', verticalAlign: 'top' }}>
                      {item.sekolah_lanjutan || '-'}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-color)', verticalAlign: 'top' }}>
                      {item.pekerjaan || '-'}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.83rem', verticalAlign: 'top', maxWidth: '240px' }}>
                      {item.pesan_kesan || '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', verticalAlign: 'top' }}>
                      <button
                        onClick={() => handleDelete(item.id, item.nama_lengkap)}
                        disabled={deletingId === item.id}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '5px 10px', fontSize: '0.78rem', borderRadius: '6px', cursor: 'pointer' }}
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
