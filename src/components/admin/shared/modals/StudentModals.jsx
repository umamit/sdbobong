import React from 'react';
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function StudentModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    studentModalOpen,
    editingStudent,
    studNisn,
    setStudNisn,
    studNis,
    setStudNis,
    studName,
    setStudName,
    studClass,
    setStudClass,
    studGender,
    setStudGender,
    studBirthPlace,
    setStudBirthPlace,
    studBirthDate,
    setStudBirthDate,
    studParentName,
    setStudParentName,
    studParentPhone,
    setStudParentPhone,
    studAddress,
    setStudAddress,
    studStatus,
    setStudStatus,
    studGrades,
    setStudGrades,
    handleSaveStudent,
    setStudentModalOpen,
    setEditingStudent
  } = context;

  return (
    <>
      {studentModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '650px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingStudent ? '✏️ Edit Data Siswa' : '➕ Tambah Siswa Baru'}</h3>
              <button 
                type="button" 
                onClick={() => {
                  setStudentModalOpen(false);
                  setEditingStudent(null);
                  setStudNisn('');
                  setStudNis('');
                  setStudName('');
                  setStudClass('1A');
                  setStudGender('Laki-laki');
                  setStudBirthPlace('');
                  setStudBirthDate('');
                  setStudAddress('');
                  setStudParentName('');
                  setStudParentPhone('');
                  setStudStatus('Aktif');
                  setStudGrades({
                    ppkn: '',
                    indonesia: '',
                    matematika: '',
                    ipas: '',
                    seni: '',
                    pjok: '',
                    inggris: '',
                    agama: '',
                    mulok: ''
                  });
                }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveStudent} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', boxSizing: 'border-box' }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_nisn" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NISN Siswa (10 Digit)</label>
                  <input
                    type="text"
                    id="stud_nisn"
                    className="form-control"
                    placeholder="Contoh: 0123456789"
                    maxLength={10}
                    value={studNisn}
                    onChange={(e) => setStudNisn(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_nis" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIS Lokal (Opsional)</label>
                  <input
                    type="text"
                    id="stud_nis"
                    className="form-control"
                    placeholder="Contoh: 2024001"
                    value={studNis}
                    onChange={(e) => setStudNis(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label htmlFor="stud_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    id="stud_name"
                    className="form-control"
                    placeholder="Tulis nama lengkap sesuai akta lahir/ijazah..."
                    value={studName}
                    onChange={(e) => setStudName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_class" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Kelas</label>
                  <select
                    id="stud_class"
                    className="form-control"
                    value={studClass}
                    onChange={(e) => setStudClass(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    {['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D'].map(cls => (
                      <option key={cls} value={cls}>Kelas {cls}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_gender" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jenis Kelamin</label>
                  <select
                    id="stud_gender"
                    className="form-control"
                    value={studGender}
                    onChange={(e) => setStudGender(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_birth_place" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tempat Lahir</label>
                  <input
                    type="text"
                    id="stud_birth_place"
                    className="form-control"
                    placeholder="Contoh: Bobong"
                    value={studBirthPlace}
                    onChange={(e) => setStudBirthPlace(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_birth_date" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tanggal Lahir</label>
                  <input
                    type="text"
                    id="stud_birth_date"
                    className="form-control"
                    placeholder="Contoh: 12 Desember 2012"
                    value={studBirthDate}
                    onChange={(e) => setStudBirthDate(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_parent_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    id="stud_parent_name"
                    className="form-control"
                    placeholder="Contoh: Usman"
                    value={studParentName}
                    onChange={(e) => setStudParentName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="stud_parent_phone" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>No. HP / WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    id="stud_parent_phone"
                    className="form-control"
                    placeholder="Contoh: 081234567890"
                    value={studParentPhone}
                    onChange={(e) => setStudParentPhone(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label htmlFor="stud_address" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Alamat Lengkap</label>
                  <textarea
                    id="stud_address"
                    className="form-control"
                    placeholder="Tulis alamat rumah lengkap siswa saat ini..."
                    value={studAddress}
                    onChange={(e) => setStudAddress(e.target.value)}
                    rows="2"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label htmlFor="stud_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Siswa</label>
                  <select
                    id="stud_status"
                    className="form-control"
                    value={studStatus}
                    onChange={(e) => setStudStatus(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="Aktif">🟢 Aktif</option>
                    <option value="Lulus">🎓 Lulus</option>
                    <option value="Pindah">🔴 Pindah Sekolah</option>
                    <option value="Cuti">🟡 Cuti / Non-Aktif</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    📊 Nilai Hasil Belajar Siswa (Kurikulum Merdeka)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                      { key: 'ppkn', label: 'PPKn' },
                      { key: 'indonesia', label: 'B. Indonesia' },
                      { key: 'matematika', label: 'Matematika' },
                      { key: 'ipas', label: 'IPAS' },
                      { key: 'seni', label: 'Seni Budaya' },
                      { key: 'pjok', label: 'PJOK' },
                      { key: 'inggris', label: 'B. Inggris' },
                      { key: 'agama', label: 'Pendidikan Agama' },
                      { key: 'mulok', label: 'Muatan Lokal' }
                    ].map((sub) => (
                      <div key={sub.key} className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor={`grade_${sub.key}`} style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                          {sub.label}
                        </label>
                        <input
                          type="number"
                          id={`grade_${sub.key}`}
                          className="form-control"
                          placeholder="0-100"
                          min="0"
                          max="100"
                          value={studGrades[sub.key] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (/^\d+$/.test(val) && parseInt(val) <= 100)) {
                              setStudGrades(prev => ({ ...prev, [sub.key]: val }));
                            }
                          }}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => {
                    setStudentModalOpen(false);
                    setEditingStudent(null);
                    setStudNisn('');
                    setStudNis('');
                    setStudName('');
                    setStudClass('1A');
                    setStudGender('Laki-laki');
                    setStudBirthPlace('');
                    setStudBirthDate('');
                    setStudAddress('');
                    setStudParentName('');
                    setStudParentPhone('');
                    setStudStatus('Aktif');
                    setStudGrades({
                      ppkn: '',
                      indonesia: '',
                      matematika: '',
                      ipas: '',
                      seni: '',
                      pjok: '',
                      inggris: '',
                      agama: '',
                      mulok: ''
                    });
                  }}
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
