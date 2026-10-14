'use client';

import { useState } from 'react';
import ComplaintsTable from './complaints/ComplaintsTable';
import ComplaintDetailModal from './complaints/ComplaintDetailModal';

export default function ComplaintsTab({ complaints = [], onUpdateStatus, onDeleteComplaint }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('Diproses');
  const [isSaving, setIsSaving] = useState(false);

  const filtered = complaints.filter(c => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTicket = (c.ticket_code || '').toLowerCase().includes(q);
      const matchMsg = (c.message || '').toLowerCase().includes(q);
      const matchName = (c.reporter_name || '').toLowerCase().includes(q);
      if (!matchTicket && !matchMsg && !matchName) return false;
    }
    return true;
  });

  const handleOpenDetail = (c) => {
    setSelectedComplaint(c);
    setResponseText(c.response || '');
    setNewStatus(c.status || 'Diproses');
  };

  const handleSaveResponse = async () => {
    if (!selectedComplaint) return;
    setIsSaving(true);
    try {
      await onUpdateStatus(selectedComplaint.id, newStatus, responseText);
      setSelectedComplaint(prev => ({ ...prev, status: newStatus, response: responseText }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
            Layanan Pengaduan &amp; Aspirasi Ramah Anak
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Pantau dan tindak lanjuti laporan murid/orang tua secara rahasia dan aman (Total: {complaints.length} laporan).
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <input
          type="text"
          placeholder="Cari nomor tiket, nama pelapor, atau isi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
        >
          <option value="ALL">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
        >
          <option value="ALL">Semua Kategori</option>
          <option value="Pencegahan Perundungan (Bullying)">Pencegahan Perundungan</option>
          <option value="Sarana & Fasilitas Belajar">Sarana &amp; Fasilitas</option>
          <option value="Saran & Peningkatan KBM">Saran &amp; KBM</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      {/* Complaints List Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
        <ComplaintsTable
          filtered={filtered}
          onOpenDetail={handleOpenDetail}
          onDeleteComplaint={onDeleteComplaint}
        />
      </div>

      {/* Modal Detail & Tanggapan */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        responseText={responseText}
        setResponseText={setResponseText}
        isSaving={isSaving}
        onClose={() => setSelectedComplaint(null)}
        onSave={handleSaveResponse}
      />
    </div>
  );
}
