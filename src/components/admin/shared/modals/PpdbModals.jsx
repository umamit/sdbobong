
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function PpdbModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    deleteModalOpen,
    deleteIsBulk,
    deleteTargetName,
    bulkDeleteConfirmText,
    setBulkDeleteConfirmText,
    executeDelete,
    setDeleteModalOpen,
    setDeleteTargetId,
    setDeleteTargetNik,
    setDeleteTargetName,
    setDeleteIsBulk,
    isDetailModalOpen,
    selectedRecord,
    setIsDetailModalOpen,
    setSelectedRecord,
    config
  } = context;

  return (
    <>
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
              Konfirmasi Penghapusan
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {deleteIsBulk 
                ? 'Pilih lokasi/cakupan database untuk mengosongkan SEMUA data pendaftar:' 
                : `Pilih lokasi/cakupan database untuk menghapus data pendaftaran dari "${deleteTargetName}":`
              }
            </p>

            {deleteIsBulk && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', fontSize: '0.8rem', color: '#c2410c', textAlign: 'left' }}>
                <strong>Pemberitahuan Keamanan:</strong> Menghapus seluruh data pendaftaran memerlukan konfirmasi tertulis. Silakan ketik kata kunci <strong>HAPUS SEMUA</strong> di bawah untuk mengaktifkan pilihan hapus:
                <input 
                  type="text" 
                  id="bulk-delete-confirm-input" 
                  placeholder="Ketik HAPUS SEMUA" 
                  value={bulkDeleteConfirmText}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    marginTop: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                  onChange={(e) => setBulkDeleteConfirmText(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                id="btn-del-both"
                disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                className="btn btn-danger" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  fontSize: '0.9rem',
                  opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                }}
                onClick={() => executeDelete('both')}
              >
                🗑️ Hapus dari Lokal & Supabase (Semua)
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  id="btn-del-local"
                  disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '0.75rem', 
                    fontSize: '0.85rem',
                    color: '#dc2626',
                    borderColor: '#fca5a5',
                    backgroundColor: '#fef2f2',
                    opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                  }}
                  onClick={() => executeDelete('local')}
                >
                  🖥️ Hanya Lokal
                </button>
                <button 
                  id="btn-del-supabase"
                  disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '0.75rem', 
                    fontSize: '0.85rem',
                    color: '#2563eb',
                    borderColor: '#bfdbfe',
                    backgroundColor: '#eff6ff',
                    opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                  }}
                  onClick={() => executeDelete('supabase')}
                >
                  ☁️ Hanya Supabase
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'left', lineHeight: '1.4', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                💡 <em>Catatan: Disarankan menghapus dari "Keduanya". Jika hanya dihapus dari salah satu, data dapat tersinkronisasi kembali saat halaman disegarkan karena sinkronisasi otomatis.</em>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetNik('');
                  setDeleteTargetName('');
                  setDeleteIsBulk(false);
                  setBulkDeleteConfirmText('');
                }}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedRecord && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '850px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>
            
            {/* Modal Header (No Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary-dark)', color: '#ffffff', borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>🔍 Lembar Detail Pendaftaran Calon Siswa</h3>
              <button 
                type="button" 
                onClick={() => { setIsDetailModalOpen(false); setSelectedRecord(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = 1}
                onMouseOut={(e) => e.target.style.opacity = 0.8}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Printable Slip */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
              
              <div id="print-slip-container" className="print-slip" style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                {/* Kop Surat Sekolah */}
                <div className="print-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '3px double #0f172a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                  <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" className="print-logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
                  <div className="print-title" style={{ flexGrow: 1, textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
                    <h3 style={{ margin: '1px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SD NEGERI BOBONG</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500, lineHeight: '1.4' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: {config.ppdb_contacts?.email_sekolah || 'admin@sdnegeribobong.sch.id'}</p>
                  </div>
                  <img src="/images/logo_sekolah.png" alt="Logo Sekolah" className="print-logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '1px' }}>BUKTI PENDAFTARAN CALON SISWA BARU (PPDB)</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Tahun Ajaran: 2026/2027</p>
                </div>

                {/* Subtitle Section 1 */}
                <div style={{ borderLeft: '4px solid var(--primary-dark)', paddingLeft: '8px', marginBottom: '1.25rem', textAlign: 'left' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>A. DATA UTAMA PENDAFTARAN ONLINE (SISTEM)</h5>
                </div>

                {/* Grid Fields */}
                <div className="print-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                  
                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>ID Pendaftaran</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.id || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Waktu Pendaftaran</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.waktu_daftar || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Lengkap Calon Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2px' }}>{selectedRecord.nama_lengkap || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nomor Induk Kependudukan (NIK)</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nik_siswa || selectedRecord.nik || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Tempat, Tanggal Lahir</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.tempat_lahir || '-'}, {selectedRecord.tanggal_lahir || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jenis Kelamin</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.jenis_kelamin || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jalur Seleksi PPDB</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
                      <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        🚀 {selectedRecord.jalur_ppdb || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Status Kelulusan Verifikasi</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px', color: selectedRecord.status === 'Terverifikasi' ? '#16a34a' : selectedRecord.status === 'Ditolak' ? '#dc2626' : '#ea580c' }}>
                      <span style={{ backgroundColor: selectedRecord.status === 'Terverifikasi' ? '#f0fdf4' : selectedRecord.status === 'Ditolak' ? '#fef2f2' : '#fff7ed', border: '1px solid currentColor', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        {selectedRecord.status || 'Diterima Sistem'}
                      </span>
                    </div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Ibu Kandung</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nama_ibu_kandung || selectedRecord.nama_ibu || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>No. HP Orang Tua / Wali</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>📞 {selectedRecord.nomor_hp_orangtua || selectedRecord.no_hp || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', gridColumn: 'span 2' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Alamat Tempat Tinggal (Domisili)</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px', lineHeight: '1.4' }}>{selectedRecord.alamat_domisili || selectedRecord.alamat || '-'}</div>
                  </div>
                </div>

                {/* Subtitle Section 2 */}
                <div style={{ borderLeft: '4px solid #475569', paddingLeft: '8px', marginBottom: '1.25rem', marginTop: '2.5rem', textAlign: 'left' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>B. DATA PENDUKUNG VERIFIKASI (Diisi Manual / Saat Daftar Ulang)</h5>
                </div>

                <div className="print-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Lengkap Ayah Kandung</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nama_ayah || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Pekerjaan Ayah</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.pekerjaan_ayah || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>No. HP / WA Ayah</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.no_hp_ayah || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Pekerjaan Ibu</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.pekerjaan_ibu || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>No. HP / WA Ibu</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.no_hp_ibu || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Agama Calon Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.agama || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Panggilan Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nama_panggilan || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jumlah Bersaudara</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                      Anak ke {selectedRecord.anak_ke || '-'} dari {selectedRecord.dari_bersaudara || '-'} bersaudara
                    </div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Wali (Jika Ada)</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nama_wali || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Pekerjaan Wali</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.pekerjaan_wali || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem', gridColumn: 'span 2' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Asal Sekolah (TK / PAUD)</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#475569', marginTop: '4px' }}>
                      {selectedRecord.asal_sekolah || '....................................................................................................................'}
                    </div>
                  </div>
                </div>

                {/* Subtitle Section 3 (No Print) */}
                <div className="no-print" style={{ borderLeft: '4px solid #16a34a', paddingLeft: '8px', marginBottom: '1.25rem', marginTop: '2.5rem', textAlign: 'left' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>C. DOKUMEN PENDUKUNG (UNGGAHAN ONLINE)</h5>
                </div>

                {/* Grid Dokumen (No Print) */}
                <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: "Kartu Keluarga", field: "berkas_kk", icon: "📋" },
                    { label: "Akta Kelahiran", field: "berkas_akta", icon: "👶" },
                    { label: "Ijazah TK / PAUD (Opsional)", field: "berkas_ijazah", icon: "🎓" }
                  ].map((doc, idx) => {
                    const url = selectedRecord[doc.field];
                    return (
                      <div key={idx} style={{ 
                        background: '#ffffff', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '10px', 
                        padding: '1rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                            {doc.label}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                            <span>{doc.icon}</span>
                            <span style={{ fontSize: '0.8rem', color: url ? '#1e293b' : '#94a3b8', fontStyle: url ? 'normal' : 'italic' }}>
                              {url ? 'PDF Terunggah' : 'Belum diunggah'}
                            </span>
                          </div>
                        </div>
                        {url ? (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn"
                            style={{ 
                              marginTop: '1rem',
                              padding: '0.5rem 1rem', 
                              fontSize: '0.8rem', 
                              fontWeight: 700, 
                              textAlign: 'center', 
                              color: '#0b3c5d', 
                              backgroundColor: '#f0f9ff', 
                              border: '1px solid #bae6fd', 
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#e0f2fe';
                              e.currentTarget.style.borderColor = '#7dd3fc';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0f9ff';
                              e.currentTarget.style.borderColor = '#bae6fd';
                            }}
                          >
                            👁️ Buka Dokumen
                          </a>
                        ) : (
                          <div style={{ 
                            marginTop: '1rem',
                            padding: '0.5rem', 
                            fontSize: '0.8rem', 
                            textAlign: 'center', 
                            color: '#94a3b8', 
                            backgroundColor: '#f8fafc', 
                            border: '1px dashed #cbd5e1', 
                            borderRadius: '6px'
                          }}>
                            Tidak Tersedia
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>⚠️ INSTRUKSI DAFTAR ULANG:</h5>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#475569', lineHeight: '1.6' }}>
                    <li>Simpan atau cetak bukti pendaftaran elektronik ini secara fisik.</li>
                    <li>Bawa bukti pendaftaran ini beserta berkas kelengkapan (FC Akta Lahir, FC Kartu Keluarga, FC Ijazah TK jika ada, dan Pas Foto 3x4) ke SDN Bobong.</li>
                    <li>Serahkan seluruh berkas ke Panitia PPDB di ruang sekretariat pada jam kerja (08:00 - 12:00 WITA) untuk validasi berkas fisik.</li>
                  </ol>
                </div>

                {/* Signature Block */}
                <div className="print-footer-signature" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center' }}>
                  <div className="signature-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '120px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Pendaftar / Orang Tua</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, borderTop: '1px solid #94a3b8', width: '150px', paddingTop: '4px' }}>{selectedRecord.nama_ibu_kandung || selectedRecord.nama_ibu || 'Orang Tua Wali'}</span>
                  </div>
                  <div className="signature-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '120px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Panitia PPDB SDN Bobong</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, borderTop: '1px solid #94a3b8', width: '150px', paddingTop: '4px' }}>Nama Petugas Verifikator</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer (No Print) */}
            <div className="no-print" style={{ display: 'flex', gap: '0.75rem', padding: '1.25rem 1.75rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff', borderRadius: '0 0 16px 16px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => { setIsDetailModalOpen(false); setSelectedRecord(null); }}
              >
                ✕ Tutup Detail
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => window.print()}
              >
                🖨️ Cetak Bukti Pendaftaran (Slip)
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
