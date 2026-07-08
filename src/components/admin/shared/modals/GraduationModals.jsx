
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function GraduationModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    gradModalOpen,
    editingGrad,
    gradNisn,
    setGradNisn,
    gradNoPeserta,
    setGradNoPeserta,
    gradName,
    setGradName,
    gradBirthPlace,
    setGradBirthPlace,
    gradBirthDate,
    setGradBirthDate,
    gradParentName,
    setGradParentName,
    gradStatus,
    setGradStatus,
    gradSkNumber,
    setGradSkNumber,
    handleSaveGraduation,
    setGradModalOpen,
    setEditingGrad
  } = context;

  return (
    <>
      {gradModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '650px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingGrad ? '✏️ Edit Data Kelulusan Siswa' : '➕ Tambah Data Kelulusan Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setGradModalOpen(false); setEditingGrad(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveGraduation} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', boxSizing: 'border-box' }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_nisn" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NISN Siswa</label>
                  <input
                    type="text"
                    id="grad_nisn"
                    className="form-control"
                    placeholder="Contoh: 0123456789 (10 digit)"
                    value={gradNisn}
                    onChange={(e) => setGradNisn(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_no_peserta" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>No. Peserta Ujian</label>
                  <input
                    type="text"
                    id="grad_no_peserta"
                    className="form-control"
                    placeholder="Contoh: DN-27/D-SD/06/001"
                    value={gradNoPeserta}
                    onChange={(e) => setGradNoPeserta(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label htmlFor="grad_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    id="grad_name"
                    className="form-control"
                    placeholder="Tulis nama lengkap siswa kelas 6..."
                    value={gradName}
                    onChange={(e) => setGradName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_birth_place" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tempat Lahir</label>
                  <input
                    type="text"
                    id="grad_birth_place"
                    className="form-control"
                    placeholder="Contoh: Bobong"
                    value={gradBirthPlace}
                    onChange={(e) => setGradBirthPlace(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_birth_date" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tanggal Lahir</label>
                  <input
                    type="text"
                    id="grad_birth_date"
                    className="form-control"
                    placeholder="Contoh: 12 Desember 2012"
                    value={gradBirthDate}
                    onChange={(e) => setGradBirthDate(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_parent_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    id="grad_parent_name"
                    className="form-control"
                    placeholder="Contoh: Usman Bobong"
                    value={gradParentName}
                    onChange={(e) => setGradParentName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="grad_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Kelulusan</label>
                  <select
                    id="grad_status"
                    className="form-control"
                    value={gradStatus}
                    onChange={(e) => setGradStatus(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="LULUS">🎓 LULUS</option>
                    <option value="BELUM_LULUS">❌ TIDAK LULUS</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label htmlFor="grad_sk_number" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nomor Surat Keputusan (SK) Kelulusan Kepala Sekolah</label>
                  <input
                    type="text"
                    id="grad_sk_number"
                    className="form-control"
                    placeholder="Contoh: 421.2/024/SDN-BB/VI/2026"
                    value={gradSkNumber}
                    onChange={(e) => setGradSkNumber(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => { setGradModalOpen(false); setEditingGrad(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
