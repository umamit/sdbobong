'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';
import PremiumLoadingOverlay from '../../PremiumLoadingOverlay';

export default function Modals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    addTeacherModalOpen,
    agendaModalOpen,
    avatarPreview,
    bulkDeleteConfirmText,
    config,
    deleteIsBulk,
    deleteModalOpen,
    deleteTargetName,
    downloadCategory,
    downloadFileUrl,
    downloadModalOpen,
    downloadTitle,
    editAvatarPreview,
    editDetails,
    editName,
    editNip,
    editRole,
    editStatus,
    editTeacherImageSelect,
    editTeacherImageUrl,
    editTeacherModalOpen,
    editingDownload,
    editingEvent,
    editingFaq,
    editingGalleryItem,
    editingGrad,
    editingStudent,
    eventDates,
    eventDesc,
    eventMonth,
    executeDelete,
    faqAnswer,
    faqModalOpen,
    faqQuestion,
    galleryCategory,
    galleryDate,
    galleryModalOpen,
    galleryPreview,
    gallerySourceType,
    galleryTitle,
    galleryType,
    galleryUrl,
    gradBirthDate,
    gradBirthPlace,
    gradModalOpen,
    gradName,
    gradNisn,
    gradNoPeserta,
    gradParentName,
    gradSkNumber,
    gradStatus,
    handleEditTeacherImageSelectChange,
    handleEditTeacherImageUrlChange,
    handleEditTeacherPhotoChange,
    handlePurgeAuditLogs,
    handleSaveAgendaEvent,
    handleSaveDownload,
    handleSaveFaq,
    handleSaveGalleryItem,
    handleSaveGraduation,
    handleSaveStudent,
    handleTeacherAdd,
    handleTeacherImageSelectChange,
    handleTeacherImageUrlChange,
    handleTeacherPhotoChange,
    handleTeacherUpdateSubmit,
    isDetailModalOpen,
    isPurgeModalOpen,
    purgeLogsConfirmation,
    selectedRecord,
    setAddTeacherModalOpen,
    setAgendaModalOpen,
    setBulkDeleteConfirmText,
    setDeleteIsBulk,
    setDeleteModalOpen,
    setDeleteTargetId,
    setDeleteTargetName,
    setDeleteTargetNik,
    setDownloadCategory,
    setDownloadFileUrl,
    setDownloadModalOpen,
    setDownloadTitle,
    setEditDetails,
    setEditName,
    setEditNip,
    setEditRole,
    setEditStatus,
    setEditTeacherModalOpen,
    setEditingDownload,
    setEditingEvent,
    setEditingFaq,
    setEditingGalleryItem,
    setEditingGrad,
    setEditingStudent,
    setEventDates,
    setEventDesc,
    setEventMonth,
    setFaqAnswer,
    setFaqModalOpen,
    setFaqQuestion,
    setGalleryCategory,
    setGalleryDate,
    setGalleryFile,
    setGalleryModalOpen,
    setGalleryPreview,
    setGallerySourceType,
    setGalleryTitle,
    setGalleryType,
    setGalleryUrl,
    setGradBirthDate,
    setGradBirthPlace,
    setGradModalOpen,
    setGradName,
    setGradNisn,
    setGradNoPeserta,
    setGradParentName,
    setGradSkNumber,
    setGradStatus,
    setIsDetailModalOpen,
    setIsPurgeModalOpen,
    setPurgeLogsConfirmation,
    setSelectedRecord,
    setStudAddress,
    setStudBirthDate,
    setStudBirthPlace,
    setStudClass,
    setStudGender,
    setStudName,
    setStudNis,
    setStudNisn,
    setStudParentName,
    setStudParentPhone,
    setStudStatus,
    setStudentModalOpen,
    studAddress,
    studBirthDate,
    studBirthPlace,
    studClass,
    studGender,
    studName,
    studNis,
    studNisn,
    studParentName,
    studParentPhone,
    studStatus,
    studentModalOpen,
    teacherImageSelect,
    teacherImageUrl
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

      {/* ================= DETAIL MODAL PPDB & CETAK BUKTI ================= */}
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
              
              {/* Slip layout inside a card */}
              <div id="print-slip-container" className="print-slip" style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                {/* Kop Surat Sekolah */}
                <div className="print-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '3px double #0f172a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                  <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" className="print-logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
                  <div className="print-title" style={{ flexGrow: 1, textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
                    <h3 style={{ margin: '1px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SD NEGERI BOBONG</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500, lineHeight: '1.4' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: {config.ppdb_contacts?.email_sekolah || 'sdn.bobong.taliabu@gmail.com'}</p>
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

                 {/* Grid Fields Manual -> Terisi Otomatis */}
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
                    { label: "KTP Orang Tua", field: "berkas_ktp", icon: "🪪" },
                    { label: "SPTJM", field: "berkas_sptjm", icon: "✍️" },
                    { label: "KIP / PKH (Opsional)", field: "berkas_kip", icon: "💳" }
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

                {/* Catatan / Keterangan tambahan di slip */}
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>⚠️ INSTRUKSI DAFTAR ULANG:</h5>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#475569', lineHeight: '1.6' }}>
                    <li>Simpan atau cetak bukti pendaftaran elektronik ini secara fisik.</li>
                    <li>Bawa bukti pendaftaran ini beserta berkas kelengkapan (FC Akta Lahir, FC Kartu Keluarga, FC KTP Orang Tua, SPTJM) ke SDN Bobong.</li>
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

      {/* ================= MODAL: ADD / EDIT AGENDA EVENT ================= */}
      {agendaModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingEvent ? '✏️ Edit Agenda Kegiatan' : '➕ Tambah Agenda Sekolah Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveAgendaEvent} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_month" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Bulan & Tahun</label>
                  <input
                    type="text"
                    id="event_month"
                    className="form-control"
                    placeholder="Contoh: Juli 2025"
                    value={eventMonth}
                    onChange={(e) => setEventMonth(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_dates" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Rentang Tanggal</label>
                  <input
                    type="text"
                    id="event_dates"
                    className="form-control"
                    placeholder="Contoh: 14 - 19 Juli 2025"
                    value={eventDates}
                    onChange={(e) => setEventDates(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_desc" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Deskripsi Kegiatan</label>
                  <textarea
                    id="event_desc"
                    className="form-control"
                    placeholder="Tulis nama kegiatan akademis atau detail agenda sekolah di sini..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows="3"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT DOWNLOAD ================= */}
      {downloadModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingDownload ? '✏️ Edit Berkas Unduhan' : '➕ Tambah Berkas Unduhan Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setDownloadModalOpen(false); setEditingDownload(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveDownload} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="dl_title" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Berkas / Judul Dokumen</label>
                  <input
                    type="text"
                    id="dl_title"
                    className="form-control"
                    placeholder="Contoh: Kalender Akademik 2025/2026"
                    value={downloadTitle}
                    onChange={(e) => setDownloadTitle(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="dl_category" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Kategori</label>
                  <select
                    id="dl_category"
                    className="form-control"
                    value={downloadCategory}
                    onChange={(e) => setDownloadCategory(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="Kurikulum">Kurikulum</option>
                    <option value="Pendaftaran">Pendaftaran (PPDB)</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Sarpras">Sarpras</option>
                    <option value="Umum">Umum / Lainnya</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="dl_url" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tautan Berkas (URL/PDF/Drive)</label>
                  <input
                    type="text"
                    id="dl_url"
                    className="form-control"
                    placeholder="Contoh: /downloads/kalender_akademik.pdf atau URL GDrive"
                    value={downloadFileUrl}
                    onChange={(e) => setDownloadFileUrl(e.target.value)}
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
                  onClick={() => { setDownloadModalOpen(false); setEditingDownload(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT FAQ ================= */}
      {faqModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingFaq ? '✏️ Edit FAQ' : '➕ Tambah FAQ Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setFaqModalOpen(false); setEditingFaq(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveFaq} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="faq_ques" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pertanyaan</label>
                  <textarea
                    id="faq_ques"
                    className="form-control"
                    placeholder="Contoh: Bagaimana prosedur pendaftaran siswa baru di SDN Bobong?"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    rows="2"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="faq_ans" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jawaban</label>
                  <textarea
                    id="faq_ans"
                    className="form-control"
                    placeholder="Tuliskan penjelasan atau jawaban lengkap di sini..."
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    rows="4"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => { setFaqModalOpen(false); setEditingFaq(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT GALLERY ITEM ================= */}
      {galleryModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingGalleryItem ? '✏️ Edit Item Galeri' : '➕ Tambah Media Galeri Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setGalleryModalOpen(false); setEditingGalleryItem(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveGalleryItem} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="gal_title" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Judul Kegiatan / Dokumentasi</label>
                  <input
                    type="text"
                    id="gal_title"
                    className="form-control"
                    placeholder="Contoh: Upacara Bendera HUT RI ke-78"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="gal_type" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tipe Media</label>
                  <select
                    id="gal_type"
                    className="form-control"
                    value={galleryType}
                    onChange={(e) => setGalleryType(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="image">🖼️ FOTO (Gambar)</option>
                    <option value="video">🎥 VIDEO (Youtube Embed / MP4)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="gal_category" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Kategori Media</label>
                  <select
                    id="gal_category"
                    className="form-control"
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  >
                    <option value="umum">📁 UMUM (Dokumentasi Lainnya)</option>
                    <option value="akademik">📖 AKADEMIK (Kegiatan Belajar)</option>
                    <option value="pramuka">⛺ PRAMUKA (Kegiatan Kepanduan)</option>
                    <option value="upacara">🎖️ UPACARA (Upacara & Peringatan Hari Besar)</option>
                    <option value="sarana">🏫 SARANA (Fasilitas & Infrastruktur)</option>
                  </select>
                </div>

                {/* Media Source Selector */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Sumber Media</label>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setGallerySourceType('url')}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: gallerySourceType === 'url' ? '#ffffff' : 'transparent',
                        color: gallerySourceType === 'url' ? 'var(--primary)' : '#64748b',
                        boxShadow: gallerySourceType === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      🔗 Tautan Link (Copas)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGallerySourceType('upload')}
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: gallerySourceType === 'upload' ? '#ffffff' : 'transparent',
                        color: gallerySourceType === 'upload' ? 'var(--primary)' : '#64748b',
                        boxShadow: gallerySourceType === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      📤 Unggah File Lokal
                    </button>
                  </div>
                </div>

                {gallerySourceType === 'url' ? (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="gal_url" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                      {galleryType === 'video' ? 'Tautan Video Youtube (URL)' : 'Tautan Gambar (URL)'}
                    </label>
                    <input
                      type="text"
                      id="gal_url"
                      className="form-control"
                      placeholder={galleryType === 'video' ? "Contoh: https://www.youtube.com/embed/XXXXX atau https://youtu.be/XXXXX" : "Contoh: https://images.unsplash.com/... atau path/link gambar"}
                      value={galleryUrl}
                      onChange={(e) => setGalleryUrl(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required={gallerySourceType === 'url'}
                    />
                  </div>
                ) : (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="gal_file" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                      {galleryType === 'video' ? 'Pilih Berkas Video (MP4/WebM)' : 'Pilih Berkas Gambar (PNG/JPG/JPEG/GIF)'}
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input
                        type="file"
                        id="gal_file"
                        accept={galleryType === 'video' ? "video/*" : "image/*"}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setGalleryFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setGalleryPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{
                          padding: '0.5rem',
                          border: '1px dashed #cbd5e1',
                          borderRadius: '8px',
                          width: '100%',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                        required={gallerySourceType === 'upload' && !editingGalleryItem}
                      />
                      {galleryPreview && (
                        <div style={{ marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', maxWidth: '100%', height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                          {galleryType === 'video' ? (
                            <video src={galleryPreview} controls style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                          ) : (
                            <img src={galleryPreview} alt="Preview media" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="gal_date" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Tanggal Kegiatan</label>
                  <input
                    type="date"
                    id="gal_date"
                    className="form-control"
                    value={galleryDate}
                    onChange={(e) => setGalleryDate(e.target.value)}
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
                  onClick={() => { setGalleryModalOpen(false); setEditingGalleryItem(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT GRADUATION STUDENT ================= */}
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

      {/* ================= MODAL: ADD / EDIT STUDENT ================= */}
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
                  setStudClass('1');
                  setStudGender('Laki-laki');
                  setStudBirthPlace('');
                  setStudBirthDate('');
                  setStudAddress('');
                  setStudParentName('');
                  setStudParentPhone('');
                  setStudStatus('Aktif');
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
                  <label htmlFor="stud_nis" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIS Lokal</label>
                  <input
                    type="text"
                    id="stud_nis"
                    className="form-control"
                    placeholder="Contoh: 2024001"
                    value={studNis}
                    onChange={(e) => setStudNis(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
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
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
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
                    setStudClass('1');
                    setStudGender('Laki-laki');
                    setStudBirthPlace('');
                    setStudBirthDate('');
                    setStudAddress('');
                    setStudParentName('');
                    setStudParentPhone('');
                    setStudStatus('Aktif');
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

      {/* ================= MODAL: PURGE AUDIT LOGS ================= */}
      {isPurgeModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#1e293b', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ Kosongkan Jurnal Jejak Audit</h3>
              <button 
                type="button" 
                onClick={() => { setIsPurgeModalOpen(false); setPurgeLogsConfirmation(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handlePurgeAuditLogs} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', lineHeight: '1.5' }}>
                <strong>PERINGATAN KERAS!</strong> Tindakan ini akan menghapus seluruh rekaman jejak audit selamanya dari server (termasuk Supabase DB jika aktif). Tindakan ini tidak dapat dibatalkan.
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="purge_confirm" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Ketik frasa di bawah ini untuk mengonfirmasi:
                </label>
                <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em', marginBottom: '8px', padding: '0.45rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '6px', textAlign: 'center', userSelect: 'none' }}>
                  KOSONGKAN JURNAL AUDIT
                </div>
                <input
                  type="text"
                  id="purge_confirm"
                  className="form-control"
                  placeholder="Ketik persis frasa di atas..."
                  value={purgeLogsConfirmation}
                  onChange={(e) => setPurgeLogsConfirmation(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn-action-view" 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }} 
                  onClick={() => { setIsPurgeModalOpen(false); setPurgeLogsConfirmation(''); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn-action-delete" 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                  disabled={purgeLogsConfirmation !== 'KOSONGKAN JURNAL AUDIT'}
                >
                  🧹 Kosongkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
