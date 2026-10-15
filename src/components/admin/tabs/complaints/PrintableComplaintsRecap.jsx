'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PrintableComplaintsRecap({ complaints = [], config = {}, filterCategory = 'ALL', filterStatus = 'ALL', onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add('print-detail-open');
    return () => {
      document.body.classList.remove('print-detail-open');
    };
  }, []);

  if (!mounted) return null;

  const schoolEmail = config?.ppdb_contacts?.email_sekolah || 'admin@sdnegeribobong.sch.id';
  const kepalaSekolah = config?.stats?.page_contents?.profil?.kepala_sekolah || 'HUSNITA USMAN, S.Pd., M.Pd';
  const nipKepala = config?.stats?.page_contents?.profil?.nip_kepala || '199610272019032006';

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      
      {/* Floating Toolbar (Hidden during print) */}
      <div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '14px', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{ padding: '8px 18px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Cetak Rekapitulasi (PDF)
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
        >
          Tutup
        </button>
      </div>

      {/* Sheet Container */}
      <div style={{ background: '#ffffff', borderRadius: '12px', maxWidth: '960px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', userSelect: 'text' }}>
        <div id="print-slip-container" className="print-slip">
          
          {/* Kop Surat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '3px double #0f172a', paddingBottom: '16px', marginBottom: '18px' }}>
            <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
              <h3 style={{ margin: '2px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
              <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>SD NEGERI BOBONG</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara 97791 | Email: {schoolEmail}</p>
            </div>
            <img src="/images/logo_sekolah.png" alt="Logo Sekolah" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />
          </div>

          {/* Judul Rekap */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline' }}>
              REKAPITULASI LAPORAN PENGADUAN &amp; ASPIRASI WARGA SEKOLAH
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569' }}>
              Kategori: {filterCategory === 'ALL' ? 'Semua Kategori' : filterCategory} | Status: {filterStatus === 'ALL' ? 'Semua Status' : filterStatus} | Total: {complaints.length} Laporan
            </p>
          </div>

          {/* Tabel Rekap Data */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderTop: '1px solid #94a3b8', borderBottom: '1px solid #94a3b8' }}>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', width: '35px' }}>No</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '105px' }}>No. Tiket</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '80px' }}>Tanggal</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '110px' }}>Pelapor</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '130px' }}>Kategori</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Uraian Pengaduan</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '75px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map((c, idx) => (
                  <tr key={c.id}>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#0f172a' }}>{c.ticket_code}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                      {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                      {c.is_anonymous ? 'Rahasia / Anonim' : (c.reporter_name || 'Wali Murid')}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{c.category}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', lineHeight: 1.4 }}>
                      <div>{c.message}</div>
                      {c.response && (
                        <div style={{ marginTop: '4px', color: '#0369a1', fontStyle: 'italic', fontSize: '0.72rem' }}>
                          Tindak lanjut: {c.response}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>{c.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', border: '1px solid #cbd5e1' }}>
                    Tidak ada catatan pengaduan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tanda Tangan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '20px', pageBreakInside: 'avoid' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <p style={{ margin: 0 }}>Mengetahui,</p>
              <p style={{ margin: '2px 0 50px 0', fontWeight: 600 }}>Tim Penanganan Pengaduan</p>
              <p style={{ margin: 0, fontWeight: 700, textDecoration: 'underline' }}>{config?.ppdb_contacts?.nama_operator || 'Petugas Humas'}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>NIP. {config?.ppdb_contacts?.nip_operator || '-'}</p>
            </div>

            <div style={{ textAlign: 'center', width: '240px' }}>
              <p style={{ margin: 0 }}>Bobong, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p style={{ margin: '2px 0 50px 0', fontWeight: 600 }}>Kepala SD Negeri Bobong</p>
              <p style={{ margin: 0, fontWeight: 700, textDecoration: 'underline' }}>{kepalaSekolah}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>NIP. {nipKepala}</p>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
