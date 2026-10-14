'use client';

export default function ComplaintDetailModal({ complaint, newStatus, setNewStatus, responseText, setResponseText, isSaving, onClose, onSave }) {
  if (!complaint) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Detail Pengaduan</span>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: 800 }}>
              Tiket: {complaint.ticket_code}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
          <div>
            <span style={{ fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Kategori:</span>
            <div style={{ color: '#0f172a' }}>{complaint.category}</div>
          </div>

          <div>
            <span style={{ fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Identitas Pelapor:</span>
            <div style={{ color: '#0f172a' }}>
              {complaint.is_anonymous ? 'Rahasia / Anonim (Identitas Terlindungi)' : `${complaint.reporter_name || 'Tidak ada'} (${complaint.reporter_phone || 'Tanpa telepon'})`}
            </div>
          </div>

          <div>
            <span style={{ fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Uraian Laporan:</span>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {complaint.message}
            </div>
          </div>

          {complaint.photo_url && (
            <div>
              <span style={{ fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Lampiran Foto Bukti:</span>
              <a href={complaint.photo_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', maxWidth: '200px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={complaint.photo_url} alt="Bukti Pengaduan" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </a>
            </div>
          )}

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Status Penanganan:</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px', fontSize: '0.88rem' }}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
            </select>

            <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
              Tanggapan Resmi Sekolah (Dapat dilihat pelapor via nomor tiket):
            </label>
            <textarea
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Tuliskan tindak lanjut atau tanggapan resmi dari dewan guru / pihak sekolah..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tutup
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              style={{ padding: '8px 20px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Tanggapan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
