'use client';

import { useState } from 'react';
import ComplaintsTable from './complaints/ComplaintsTable';
import ComplaintDetailModal from './complaints/ComplaintDetailModal';
import PrintableComplaintSlip from './complaints/PrintableComplaintSlip';
import PrintableComplaintsRecap from './complaints/PrintableComplaintsRecap';

export default function ComplaintsTab({ complaints = [], config = {}, onUpdateStatus, onDeleteComplaint }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [printComplaint, setPrintComplaint] = useState(null);
  const [showRecapPrint, setShowRecapPrint] = useState(false);
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
        <div>
          <button
            type="button"
            onClick={() => setShowRecapPrint(true)}
            style={{ padding: '8px 16px', background: '#ffffff', color: 'var(--primary-dark)', border: '1px solid var(--primary)', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Cetak Rekap Aduan (PDF)
          </button>
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
        onPrint={() => setPrintComplaint(selectedComplaint)}
      />

      {/* Printable Single Slip Modal */}
      {printComplaint && (
        <PrintableComplaintSlip
          complaint={printComplaint}
          config={config}
          onClose={() => setPrintComplaint(null)}
        />
      )}

      {/* Printable Batch Recap Modal */}
      {showRecapPrint && (
        <PrintableComplaintsRecap
          complaints={filtered}
          config={config}
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          onClose={() => setShowRecapPrint(false)}
        />
      )}
    </div>
  );
}
