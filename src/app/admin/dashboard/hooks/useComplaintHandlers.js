'use client';

import { useState } from 'react';

export default function useComplaintHandlers({
  initialComplaints = [],
  fetch,
  showToast,
  confirmDialog
}) {
  const [complaints, setComplaints] = useState(initialComplaints);

  const handleUpdateComplaintStatus = async (id, status, response) => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, response })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui status pengaduan');

      setComplaints(prev => prev.map(c => (c.id === id ? { ...c, status, response } : c)));
      showToast('success', 'Status & tanggapan pengaduan berhasil disimpan');
      return true;
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan tanggapan');
      return false;
    }
  };

  const handleDeleteComplaint = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Hapus Tiket Pengaduan',
      message: 'Apakah Anda yakin ingin menghapus tiket pengaduan ini secara permanen?',
      confirmText: 'Hapus',
      type: 'danger'
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/complaints?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengaduan');

      setComplaints(prev => prev.filter(c => c.id !== id));
      showToast('success', 'Tiket pengaduan berhasil dihapus');
    } catch (err) {
      showToast('error', err.message || 'Gagal menghapus tiket');
    }
  };

  return {
    complaints,
    setComplaints,
    handleUpdateComplaintStatus,
    handleDeleteComplaint
  };
}
