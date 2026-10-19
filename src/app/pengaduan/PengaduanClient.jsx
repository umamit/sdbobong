'use client';

import { useState } from 'react';
import TicketTrackingModal from './TicketTrackingModal';

export default function PengaduanClient() {
  const [category, setCategory] = useState('Pencegahan Perundungan (Bullying)');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('message', message);
    formData.append('is_anonymous', String(isAnonymous));
    if (!isAnonymous) {
      formData.append('reporter_name', reporterName);
      formData.append('reporter_phone', reporterPhone);
    }

    try {
      const res = await fetch('/api/complaints', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim pengaduan.');
      setTicketResult(data.ticket_code);
      setMessage('');
      setReporterName('');
      setReporterPhone('');
    } catch (err) {
      setFeedback({ type: 'danger', msg: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', paddingBottom: '60px' }}>
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <span className="hero-subtitle" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sekolah Ramah Anak &amp; Zona Integritas
          </span>
          <h1 className="hero-title">Layanan Pengaduan &amp; Aspirasi</h1>
          <p className="hero-text" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Ruang komunikasi aman dan rahasia bagi murid dan orang tua untuk menyampaikan kendala belajar, sarana, atau pencegahan perundungan di lingkungan sekolah. Seluruh area sekolah terpantau kamera CCTV aktif 24 jam demi menjamin rasa aman dan perlindungan siswa.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '780px', margin: '-24px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div className="card card-custom" style={{ borderRadius: '16px', padding: '28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Formulir Laporan / Aspirasi</h2>
            <button type="button" onClick={() => setShowTrackModal(true)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
              Lacak Nomor Tiket ↗
            </button>
          </div>

          {ticketResult ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>Pengaduan Berhasil Dikirim</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#14532d' }}>Simpan kode tiket berikut untuk memantau proses tindak lanjut dari pihak sekolah:</p>
              <div style={{ display: 'inline-block', padding: '10px 20px', background: '#ffffff', border: '2px dashed #16a34a', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 900, color: '#15803d', letterSpacing: '0.05em' }}>
                {ticketResult}
              </div>
              <div style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => setTicketResult(null)} style={{ background: '#12a5b8', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  Kirim Laporan Lainnya
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Kategori Pengaduan *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}>
                  <option value="Pencegahan Perundungan (Bullying)">Pencegahan Perundungan (Anti-Bullying)</option>
                  <option value="Aspirasi Fasilitas / Sarana Rusak">Aspirasi Fasilitas &amp; Sarana Prasarana</option>
                  <option value="Layanan Guru & Pembelajaran">Layanan Pembelajaran &amp; Guru</option>
                  <option value="Lainnya">Pengaduan Umum Lainnya</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Uraian Pesan / Masalah *</label>
                <textarea rows="5" required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tuliskan secara jelas kejadian, tempat, atau aspirasi Anda..." style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Kirim sebagai Anonim (Identitas Dirahasiakan)
                </label>
                {!isAnonymous && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Nama Lengkap Pelapor</label>
                      <input type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Contoh: Budi Santoso" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Nomor WhatsApp</label>
                      <input type="text" value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} placeholder="Contoh: 0812xxxx" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }} />
                    </div>
                  </div>
                )}
              </div>

              {feedback && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.85rem' }}>
                  {feedback.msg}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} style={{ background: '#12a5b8', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '12px', fontSize: '0.95rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(18, 165, 184, 0.25)' }}>
                {isSubmitting ? 'Mengirim Pengaduan...' : 'Kirim Laporan Pengaduan'}
              </button>
            </form>
          )}
          <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Membutuhkan bantuan darurat tatap muka? Guru Piket bertugas di Kantor/Gerbang hari ini.
            </span>
            <a href="/hubungi-kami" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Lihat Jadwal Piket &rarr;
            </a>
          </div>
        </div>
      </div>

      {showTrackModal && <TicketTrackingModal onClose={() => setShowTrackModal(false)} />}
    </div>
  );
}
