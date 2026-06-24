import React from 'react';
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function TeacherModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    addTeacherModalOpen,
    editTeacherModalOpen,
    editName,
    setEditName,
    editRole,
    setEditRole,
    editStatus,
    setEditStatus,
    editDetails,
    setEditDetails,
    editNip,
    setEditNip,
    editPassword,
    setEditPassword,
    addPassword,
    setAddPassword,
    editEducation,
    setEditEducation,
    editSubject,
    setEditSubject,
    editMotto,
    setEditMotto,
    editBio,
    setEditBio,
    avatarPreview,
    teacherImageSelect,
    handleTeacherImageSelectChange,
    teacherImageUrl,
    handleTeacherImageUrlChange,
    handleTeacherPhotoChange,
    setAddTeacherModalOpen,
    handleTeacherAdd,
    editAvatarPreview,
    editTeacherImageSelect,
    handleEditTeacherImageSelectChange,
    editTeacherImageUrl,
    handleEditTeacherImageUrlChange,
    handleEditTeacherPhotoChange,
    setEditTeacherModalOpen,
    handleTeacherUpdateSubmit
  } = context;

  return (
    <>
      {/* CUSTOM ADD TEACHER MODAL */}
      {addTeacherModalOpen && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
                ➕ Tambah Guru / Staf Baru
              </h3>
              <button 
                onClick={() => setAddTeacherModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1,
                  padding: '4px'
                }}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Isi formulir berikut untuk menambahkan data pendidik baru ke halaman profil.
            </p>

            <form id="form-teacher" onSubmit={handleTeacherAdd} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="teacher_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  id="teacher_name"
                  name="name"
                  className="form-control"
                  placeholder="Contoh: Fatimah, S.Pd.SD."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="teacher_role" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jabatan / Peran *</label>
                  <input
                    type="text"
                    id="teacher_role"
                    name="role"
                    className="form-control"
                    placeholder="Contoh: Wali Kelas 1, Guru Agama"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Kepegawaian *</label>
                  <select id="teacher_status" name="status" className="form-control" style={{ width: '100%', boxSizing: 'border-box' }} required>
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PPPK PW">PPPK PW</option>
                    <option value="Honorer Daerah">Honorer Daerah</option>
                    <option value="Honorer Sekolah">Honorer Sekolah</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="teacher_details" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pangkat / Keterangan Lain (Opsional)</label>
                <input
                  type="text"
                  id="teacher_details"
                  name="details"
                  className="form-control"
                  placeholder="Contoh: Pembina Tk. I / IV-b, Guru Kelas Bawah"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="teacher_nip" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIP (Nomor Induk Pegawai - Opsional)</label>
                <input
                  type="text"
                  id="teacher_nip"
                  name="nip"
                  className="form-control"
                  placeholder="Contoh: 19820311 200904 2 001"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="teacher_password" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Password Login Guru (Opsional)</label>
                <input
                  type="password"
                  id="teacher_password"
                  name="password"
                  className="form-control"
                  placeholder="Kosongkan untuk menyetel default sama dengan NIP"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="teacher_education" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Riwayat Pendidikan</label>
                  <input
                    type="text"
                    id="teacher_education"
                    name="education"
                    className="form-control"
                    placeholder="Contoh: S1 Pendidikan Guru SD, Universitas Khairun"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher_subject" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Mata Pelajaran yang Diajar</label>
                  <input
                    type="text"
                    id="teacher_subject"
                    name="subject"
                    className="form-control"
                    placeholder="Contoh: Tematik, Matematika Kelas Tinggi"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="teacher_motto" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pesan Motivasi / Motto Hidup</label>
                <input
                  type="text"
                  id="teacher_motto"
                  name="motto"
                  className="form-control"
                  placeholder="Contoh: Belajar sepanjang hayat untuk mencerdaskan generasi bangsa."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="teacher_bio" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Biografi Singkat</label>
                <textarea
                  id="teacher_bio"
                  name="bio"
                  className="form-control"
                  placeholder="Tulis biografi singkat guru di sini..."
                  rows="3"
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Foto / Avatar (Pilih Stok / Unggah)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                    <img id="avatar-preview" src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      id="teacher_image_select"
                      value={teacherImageSelect}
                      className="form-control"
                      onChange={handleTeacherImageSelectChange}
                      style={{ marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}
                    >
                      <option value="/images/teacher_1.png">Stok Ilustrasi Pria (Default)</option>
                      <option value="/images/teacher_2.jpg">Stok Ilustrasi Wanita Berhijab (Default)</option>
                      <option value="/images/teacher_3.png">Stok Ilustrasi Wanita (Tanpa Hijab)</option>
                      <option value="/images/teacher_4.jpg">Template Pas Foto Hijab (Merah)</option>
                      <option value="/images/teacher_5.png">Template Pas Foto Hijab (Putih)</option>
                      <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                      <option value="/images/principal.svg">Stok Ilustrasi Kepala Sekolah (principal.svg)</option>
                      <option value="custom">Foto Kustom / Unggahan Aktif</option>
                    </select>

                    <input
                      type="hidden"
                      id="teacher_image_url"
                      name="image"
                      value={teacherImageUrl}
                      onChange={handleTeacherImageUrlChange}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label htmlFor="teacher_photo" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.85rem', color: '#64748b' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB - Opsional):</label>
                  <input
                    type="file"
                    id="teacher_photo"
                    name="photo"
                    className="form-control"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleTeacherPhotoChange}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                    💡 <strong>Rekomendasi:</strong> Gunakan foto format kotak/persegi (1:1) atau rasio potret agar kartu struktur organisasi di halaman Profil terlihat rapi dan simetris tanpa terpotong secara paksa oleh CSS.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => setAddTeacherModalOpen(false)}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  id="btn-submit-teacher" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM EDIT TEACHER MODAL */}
      {editTeacherModalOpen && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
                ✏️ Edit Data Guru / Staf
              </h3>
              <button 
                onClick={() => setEditTeacherModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1,
                  padding: '4px'
                }}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Perbarui informasi guru di bawah ini. Tekan tombol Simpan Perubahan jika sudah selesai.
            </p>

            <form id="form-edit-teacher" onSubmit={handleTeacherUpdateSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="edit_teacher_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  id="edit_teacher_name"
                  name="name"
                  className="form-control"
                  placeholder="Contoh: Fatimah, S.Pd.SD."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="edit_teacher_role" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jabatan / Peran *</label>
                  <input
                    type="text"
                    id="edit_teacher_role"
                    name="role"
                    className="form-control"
                    placeholder="Contoh: Wali Kelas 1, Guru Agama"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_teacher_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Kepegawaian *</label>
                  <select 
                    id="edit_teacher_status" 
                    name="status" 
                    className="form-control" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    required
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PPPK PW">PPPK PW</option>
                    <option value="Honorer Daerah">Honorer Daerah</option>
                    <option value="Honorer Sekolah">Honorer Sekolah</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_details" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pangkat / Keterangan Lain (Opsional)</label>
                <input
                  type="text"
                  id="edit_teacher_details"
                  name="details"
                  className="form-control"
                  placeholder="Contoh: Pembina Tk. I / IV-b, Guru Kelas Bawah"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_nip" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIP (Nomor Induk Pegawai - Opsional)</label>
                <input
                  type="text"
                  id="edit_teacher_nip"
                  name="nip"
                  className="form-control"
                  placeholder="Contoh: 19820311 200904 2 001"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editNip}
                  onChange={(e) => setEditNip(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_password" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Reset / Ubah Password Guru (Opsional)</label>
                <input
                  type="password"
                  id="edit_teacher_password"
                  name="password"
                  className="form-control"
                  placeholder="Biarkan kosong untuk mempertahankan password lama"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="edit_teacher_education" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Riwayat Pendidikan</label>
                  <input
                    type="text"
                    id="edit_teacher_education"
                    name="education"
                    className="form-control"
                    placeholder="Contoh: S1 Pendidikan Guru SD"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_teacher_subject" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Mata Pelajaran yang Diajar</label>
                  <input
                    type="text"
                    id="edit_teacher_subject"
                    name="subject"
                    className="form-control"
                    placeholder="Contoh: Tematik"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_motto" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pesan Motivasi / Motto Hidup</label>
                <input
                  type="text"
                  id="edit_teacher_motto"
                  name="motto"
                  className="form-control"
                  placeholder="Contoh: Belajar sepanjang hayat."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_bio" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Biografi Singkat</label>
                <textarea
                  id="edit_teacher_bio"
                  name="bio"
                  className="form-control"
                  placeholder="Tulis biografi singkat guru..."
                  rows="3"
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Foto / Avatar (Pilih Stok / Unggah)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                    <img id="edit-avatar-preview" src={editAvatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      id="edit_teacher_image_select"
                      value={editTeacherImageSelect}
                      className="form-control"
                      onChange={handleEditTeacherImageSelectChange}
                      style={{ marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}
                    >
                      <option value="/images/teacher_1.png">Stok Ilustrasi Pria (Default)</option>
                      <option value="/images/teacher_2.jpg">Stok Ilustrasi Wanita Berhijab (Default)</option>
                      <option value="/images/teacher_3.png">Stok Ilustrasi Wanita (Tanpa Hijab)</option>
                      <option value="/images/teacher_4.jpg">Template Pas Foto Hijab (Merah)</option>
                      <option value="/images/teacher_5.png">Template Pas Foto Hijab (Putih)</option>
                      <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                      <option value="/images/principal.svg">Stok Ilustrasi Kepala Sekolah (principal.svg)</option>
                      <option value="custom">Foto Kustom / Unggahan Aktif</option>
                    </select>

                    <input
                      type="hidden"
                      id="edit_teacher_image_url"
                      name="image"
                      value={editTeacherImageUrl}
                      onChange={handleEditTeacherImageUrlChange}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label htmlFor="edit_teacher_photo" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.85rem', color: '#64748b' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB - Opsional):</label>
                  <input
                    type="file"
                    id="edit_teacher_photo"
                    name="photo"
                    className="form-control"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleEditTeacherPhotoChange}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                    💡 <strong>Rekomendasi:</strong> Gunakan foto format kotak/persegi (1:1) atau rasio potret agar kartu struktur organisasi di halaman Profil terlihat rapi dan simetris tanpa terpotong secara paksa oleh CSS.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => setEditTeacherModalOpen(false)}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  id="btn-edit-submit-teacher" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
