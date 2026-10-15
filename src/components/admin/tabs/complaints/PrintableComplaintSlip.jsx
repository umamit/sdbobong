'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PrintableComplaintSlip({ complaint, config = {}, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add('print-detail-open');
    return () => {
      document.body.classList.remove('print-detail-open');
    };
  }, []);

  if (!mounted || !complaint) return null;

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
          Cetak Dokumen PDF
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
        >
          Tutup Pratinjau
        </button>
      </div>

      {/* Modal Printable Sheet Container */}
      <div style={{ background: '#ffffff', borderRadius: '12px', maxWidth: '780px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', userSelect: 'text' }}>
        <div id="print-slip-container" className="print-slip">
          
          {/* Kop Surat Kedinasan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '3px double #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
            <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
              <h3 style={{ margin: '2px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
              <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>SD NEGERI BOBONG</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara 97791</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: {schoolEmail}</p>
            </div>
            <img src="/images/logo_sekolah.png" alt="Logo Sekolah" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
          </div>

          {/* Judul Berkas */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline' }}>
              LEMBAR DISPOSISI &amp; CATATAN PENANGANAN PENGADUAN
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              Nomor Tiket Registrasi: <span style={{ color: 'var(--primary-dark)', letterSpacing: '0.5px' }}>{complaint.ticket_code}</span>
            </p>
          </div>

          {/* Tabel Metadata Pengaduan */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ width: '180px', padding: '6px 10px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>Kategori Pengaduan</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{complaint.category}</td>
                <td style={{ width: '140px', padding: '6px 10px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>Status Akhir</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{complaint.status}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>Tanggal Masuk</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>
                  {new Date(complaint.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td style={{ padding: '6px 10px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>Klasifikasi Pelapor</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>
                  {complaint.is_anonymous ? 'Rahasia / Anonim' : `${complaint.reporter_name || 'Wali Murid'} (${complaint.reporter_phone || '-'})`}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Uraian Masalah */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
              I. Uraian Laporan / Aspirasi Warga Sekolah:
            </div>
            <div style={{ padding: '12px 14px', border: '1px solid #94a3b8', borderRadius: '4px', background: '#ffffff', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: '80px' }}>
              {complaint.message}
            </div>
          </div>

          {/* Tanggapan Resmi & Disposisi */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
              II. Tindak Lanjut &amp; Catatan Tanggapan Pihak Sekolah:
            </div>
            <div style={{ padding: '12px 14px', border: '1px solid #94a3b8', borderRadius: '4px', background: '#ffffff', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: '80px' }}>
              {complaint.response || 'Belum ada tanggapan tertulis resmi yang tercatat di sistem.'}
            </div>
          </div>

          {/* Lembar Tanda Tangan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '30px', pageBreakInside: 'avoid' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <p style={{ margin: 0 }}>Mengetahui,</p>
              <p style={{ margin: '2px 0 55px 0', fontWeight: 600 }}>Tim Satgas / Operator Humas</p>
              <p style={{ margin: 0, fontWeight: 700, textDecoration: 'underline' }}>{config?.ppdb_contacts?.nama_operator || 'Petugas Pengaduan'}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>NIP. {config?.ppdb_contacts?.nip_operator || '-'}</p>
            </div>

            <div style={{ textAlign: 'center', width: '240px' }}>
              <p style={{ margin: 0 }}>Bobong, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p style={{ margin: '2px 0 55px 0', fontWeight: 600 }}>Kepala SD Negeri Bobong</p>
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
