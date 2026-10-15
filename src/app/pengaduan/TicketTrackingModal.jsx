'use client';

import { useState } from 'react';

export default function TicketTrackingModal({ onClose }) {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(`/api/complaints?ticket=${encodeURIComponent(ticketInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tiket tidak ditemukan.');
      setResult(data.complaint);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memeriksa tiket pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
      <div className="card card-custom" style={{ borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>Lacak Status Pengaduan</h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Contoh: SDB-12345678"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
            required
          />
          <button type="submit" disabled={loading} style={{ background: '#12a5b8', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Mengecek...' : 'Lacak'}
          </button>
        </form>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.82rem', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}

        {result && (
          <div style={{ background: 'var(--bg-main, #f8fafc)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Nomor Tiket:</span>
              <strong style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>{result.ticket_code}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Kategori:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{result.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: result.status === 'Selesai' ? '#dcfce7' : result.status === 'Diproses' ? '#e0f2fe' : '#fef3c7',
                color: result.status === 'Selesai' ? '#15803d' : result.status === 'Diproses' ? '#0369a1' : '#b45309'
              }}>
                {result.status}
              </span>
            </div>
            {result.response && (
              <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ display: 'block', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Tanggapan Sekolah:</span>
                <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-card, #ffffff)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  {result.response}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
