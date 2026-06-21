'use client';

import React from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function PagesTab() {
  const {
    B,
    activePageSubTab,
    activeTab,
    config,
    ekskulPreviews,
    handleAddEkskul,
    handleAddKarya,
    handleAddKesiswaanPrestasi,
    handleAddP5Project,
    handleAddPPDBFaq,
    handleAddPPDBJadwal,
    handleAddSeragam,
    handleContactsUpdate,
    handleEkskulFileChange,
    handleFieldChange,
    handleHeroBgUpdate,
    handleKurikulumFileChange,
    handleP5FileChange,
    handleRemoveEkskul,
    handleRemoveKarya,
    handleRemoveKesiswaanPrestasi,
    handleRemoveP5Project,
    handleRemovePPDBFaq,
    handleRemovePPDBJadwal,
    handleRemoveSeragam,
    handleSejarahFileChange,
    handleUpdateEkskul,
    handleUpdateKarya,
    handleUpdateKesiswaanPrestasi,
    handleUpdateP5Project,
    handleUpdatePPDBFaq,
    handleUpdatePPDBJadwal,
    handleUpdateSeragam,
    kurikulumPreview,
    p5Previews,
    pageContents,
    sejarahPreview,
    setActivePageSubTab,
    setActiveTab,
    submitPageContents,
    syncNipHumas,
    syncNipOperator,
    teachers = [],
    normalizeTeacherName
  } = useAdminDashboard();

  const [inputNamaHumas, setInputNamaHumas] = React.useState('');
  const [inputNamaOperator, setInputNamaOperator] = React.useState('');

  React.useEffect(() => {
    if (config?.ppdb_contacts) {
      setInputNamaHumas(config.ppdb_contacts.nama_humas || '');
      setInputNamaOperator(config.ppdb_contacts.nama_operator || '');
    }
  }, [config]);

  const currentNipHumas = React.useMemo(() => {
    if (!inputNamaHumas) return "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(inputNamaHumas));
    return matched 
      ? matched.nip 
      : (inputNamaHumas === config?.ppdb_contacts?.nama_humas ? (config?.ppdb_contacts?.nip_humas || "") : "");
  }, [inputNamaHumas, teachers, normalizeTeacherName, config]);

  const currentNipOperator = React.useMemo(() => {
    if (!inputNamaOperator) return "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(inputNamaOperator));
    return matched 
      ? matched.nip 
      : (inputNamaOperator === config?.ppdb_contacts?.nama_operator ? (config?.ppdb_contacts?.nip_operator || "") : "");
  }, [inputNamaOperator, teachers, normalizeTeacherName, config]);

  return (
    <section id="tab-pages" className={`tab-pane ${activeTab === 'pages' ? 'active' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              
              {/* Premium Sub-Tab Pill Navigation */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: 'var(--space-xs)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                marginBottom: 'var(--space-xs)'
              }}>
                {[
                  { id: 'beranda', label: '🏠 Beranda' },
                  { id: 'profil', label: '📝 Profil Sekolah' },
                  { id: 'akademik', label: '📖 Akademik' },
                  { id: 'kesiswaan', label: '🎨 Kesiswaan & Ekskul' },
                  { id: 'ppdb', label: '🎓 PPDB Portal' }
                ].map(subTab => (
                  <button
                    key={subTab.id}
                    type="button"
                    onClick={() => setActivePageSubTab(subTab.id)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: activePageSubTab === subTab.id ? 700 : 500,
                      backgroundColor: activePageSubTab === subTab.id ? 'var(--primary)' : 'transparent',
                      color: activePageSubTab === subTab.id ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      borderBottom: activePageSubTab === subTab.id ? '3px solid var(--primary-dark)' : '3px solid transparent',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab description header */}
              <div style={{ padding: '0 0.5rem', marginBottom: 'var(--space-xs)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Mengedit konten dinamis (teks dan gambar) untuk halaman <strong>{activePageSubTab.toUpperCase()}</strong>. Tekan tombol Simpan di bagian bawah setelah melakukan perubahan.
                </p>
              </div>

              {/* ================= SUB-TAB: BERANDA ================= */}
              {activePageSubTab === 'beranda' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Hero Section (Bagian Atas)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Grup teks yang melayang di atas video/gambar latar belakang beranda.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Utama (Hero Title)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pageContents.beranda?.hero_title || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_title', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Sub-Judul (Hero Subtitle)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pageContents.beranda?.hero_subtitle || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_subtitle', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Pendukung (Hero Text)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.hero_text || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_text', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="settings-card" style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <h3>Ganti Background Selamat Datang (Hero Beranda)</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Unggah gambar atau video pendek latar belakang baru untuk banner ucapan selamat datang di halaman Beranda utama. Format gambar yang didukung: JPG, JPEG, PNG, SVG (Maks 2MB). Format video pendek yang didukung: MP4, WebM, OGG, MOV, M4V (Maks 10 detik & 20MB).
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {/* Preview */}
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Latar Belakang Saat Ini:</label>
                        {config?.stats?.hero_background && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(config?.stats?.hero_background) ? (
                          <video 
                            src={config?.stats?.hero_background}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ 
                              width: '100%', 
                              height: '150px', 
                              borderRadius: 'var(--radius-md)', 
                              border: '1px solid var(--border-color)', 
                              objectFit: 'cover',
                              backgroundColor: '#000'
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '150px', 
                            borderRadius: 'var(--radius-md)', 
                            border: '1px solid var(--border-color)', 
                            backgroundImage: `url('${config?.stats?.hero_background || "/images/hero_school.svg"}')`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center',
                            backgroundColor: '#e5e7eb'
                          }}></div>
                        )}
                      </div>

                      {/* Form */}
                      <form onSubmit={handleHeroBgUpdate} encType="multipart/form-data" style={{ flex: '2', minWidth: '300px' }}>
                        <input type="hidden" name="action_type" value="hero_bg" />
                        
                        <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                          <label htmlFor="hero_bg_image" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Pilih File Gambar atau Video Pendek (Maks 10 Detik)</label>
                          <input
                            type="file"
                            id="hero_bg_image"
                            name="hero_bg_image"
                            className="form-control"
                            accept=".png,.jpg,.jpeg,.svg,.mp4,.webm,.ogg,.mov,.m4v"
                            style={{ width: '100%' }}
                            required
                          />
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                            💡 <strong>Rekomendasi:</strong> Gunakan rasio lanskap berkualitas tinggi (minimal 1920x1080). Untuk video, pastikan berdurasi maksimal 10 detik agar tidak ditolak oleh sistem pengunggahan.
                          </p>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>📤 Unggah & Terapkan Background</button>
                      </form>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sambutan Kepala Sekolah</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Profil sambutan Kepala Sekolah yang berada di bagian tengah halaman utama.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Welcome Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.beranda?.welcome_badge || ''}
                          onChange={(e) => handleFieldChange('beranda', 'welcome_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Sambutan (Welcome Title)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.beranda?.welcome_title || ''}
                          onChange={(e) => handleFieldChange('beranda', 'welcome_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Kutipan Penting (Welcome Quote / Motto)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_quote || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_quote', e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Sambutan - Paragraf 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_p1 || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Sambutan - Paragraf 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_p2 || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: PROFIL ================= */}
              {activePageSubTab === 'profil' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Profil</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Judul dan deskripsi pendek pada banner atas halaman Profil Sekolah.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.banner_title || ''}
                          onChange={(e) => handleFieldChange('profil', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.banner_text || ''}
                          onChange={(e) => handleFieldChange('profil', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sejarah Sekolah & Visualisasi</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Profil sejarah pembentukan institusi sekolah beserta ilustrasi pendukung sejarah.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Sejarah Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.sejarah_badge || ''}
                          onChange={(e) => handleFieldChange('profil', 'sejarah_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Bagian Sejarah</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.sejarah_title || ''}
                          onChange={(e) => handleFieldChange('profil', 'sejarah_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Paragraf Sejarah 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.sejarah_p1 || ''}
                        onChange={(e) => handleFieldChange('profil', 'sejarah_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Paragraf Sejarah 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.sejarah_p2 || ''}
                        onChange={(e) => handleFieldChange('profil', 'sejarah_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Unggah Gambar Sejarah Baru (Mengganti Gambar)</label>
                      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                        <div style={{ 
                          width: '120px', 
                          height: '80px', 
                          borderRadius: '8px', 
                          border: '2px dashed var(--primary)', 
                          overflow: 'hidden', 
                          backgroundColor: '#f8fafc', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          flexShrink: 0
                        }}>
                          <img 
                            src={sejarahPreview || pageContents.profil?.sejarah_image || '/images/profil_sekolah.svg'} 
                            alt="Sejarah Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif"
                            onChange={handleSejarahFileChange}
                            style={{ width: '100%' }}
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                            Format yang didukung: png, jpg, jpeg, svg, gif (Maks. 1MB).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Visi & Misi</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Semboyan visi sekolah dan daftar urut misi sekolah berjalan.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Visi Sekolah (Teks Utama)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.visi || ''}
                        onChange={(e) => handleFieldChange('profil', 'visi', e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Misi Sekolah (Tulis Setiap Poin di Baris Baru)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.profil?.misi) ? pageContents.profil.misi.join('\n') : (pageContents.profil?.misi || '')}
                        onChange={(e) => handleFieldChange('profil', 'misi', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap misi dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                        💡 Tekan Enter untuk membuat butir misi baru. Spasi kosong di baris terakhir otomatis divalidasi dan diabaikan saat rendering.
                      </p>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Profil Administrasi & Legalitas</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Informasi administrasi, nomor NPSN, alamat, status sekolah, dan data Dapodik lainnya.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Nama Resmi Sekolah</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.nama_resmi || ''}
                          onChange={(e) => handleFieldChange('profil', 'nama_resmi', e.target.value)}
                          placeholder="SD Negeri Bobong"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>NPSN</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.npsn || ''}
                          onChange={(e) => handleFieldChange('profil', 'npsn', e.target.value)}
                          placeholder="60200589"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Status Sekolah</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.status_sekolah || ''}
                          onChange={(e) => handleFieldChange('profil', 'status_sekolah', e.target.value)}
                          placeholder="Negeri"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Tanggal & No. SK Pendirian</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.sk_pendirian || ''}
                          onChange={(e) => handleFieldChange('profil', 'sk_pendirian', e.target.value)}
                          placeholder="04 Oktober 1971 (SK: 420/04/10/1971)"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Akreditasi</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.akreditasi || ''}
                          onChange={(e) => handleFieldChange('profil', 'akreditasi', e.target.value)}
                          placeholder="B (Baik)"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Kurikulum Operasional</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.kurikulum_operasional || ''}
                          onChange={(e) => handleFieldChange('profil', 'kurikulum_operasional', e.target.value)}
                          placeholder="Kurikulum Merdeka"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Status Kepemilikan Lahan</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.kepemilikan_lahan || ''}
                          onChange={(e) => handleFieldChange('profil', 'kepemilikan_lahan', e.target.value)}
                          placeholder="Pemerintah Daerah Kabupaten Pulau Taliabu"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Pendek Sekolah (Tampil di Footer)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.footer_description || ''}
                          onChange={(e) => handleFieldChange('profil', 'footer_description', e.target.value)}
                          placeholder="SD Negeri Bobong adalah sekolah dasar negeri unggulan di Ibukota Kabupaten Pulau Taliabu, Maluku Utara..."
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Alamat Lengkap Sekolah</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.alamat_lengkap || ''}
                        onChange={(e) => handleFieldChange('profil', 'alamat_lengkap', e.target.value)}
                        placeholder="Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791"
                        rows="2"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sarana & Prasarana (Fasilitas)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Deskripsi fasilitas dan prasarana sekolah yang tampil di halaman profil.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Ruang Belajar</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.ruang_belajar_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'ruang_belajar_desc', e.target.value)}
                          placeholder="9 Ruang Kelas belajar (6 Rombel Aktif) yang bersih, kondusif, dan nyaman untuk proses KBM."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Ruang Guru</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.ruang_guru_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'ruang_guru_desc', e.target.value)}
                          placeholder="1 Ruang Guru dan Kepala Sekolah sebagai pusat administrasi, koordinasi, dan pelayanan pendidikan."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Fasilitas Sanitasi</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.sanitasi_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'sanitasi_desc', e.target.value)}
                          placeholder="2 Ruang Toilet bersih dan nyaman yang terawat dengan baik untuk guru dan murid."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Ruang Gudang</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.gudang_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'gudang_desc', e.target.value)}
                          placeholder="1 Ruang Gudang penyimpanan inventaris, peralatan belajar mengajar, serta perlengkapan sekolah."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Fasilitas Olahraga</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.olahraga_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'olahraga_desc', e.target.value)}
                          placeholder="Halaman Olahraga & Upacara yang luas di bagian tengah sekolah untuk melatih ketangkasan fisik siswa."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Pojok Baca & Literasi</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.literasi_desc || ''}
                          onChange={(e) => handleFieldChange('profil', 'literasi_desc', e.target.value)}
                          placeholder="Sekolah mengoptimalkan Pojok Baca Kelas dan koleksi literasi untuk meningkatkan minat baca murid harian."
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: AKADEMIK ================= */}
              {activePageSubTab === 'akademik' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Akademik</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Panduan Akademik.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.banner_title || ''}
                          onChange={(e) => handleFieldChange('akademik', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.akademik?.banner_text || ''}
                          onChange={(e) => handleFieldChange('akademik', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sistem & Penerapan Kurikulum</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Metode pembelajaran dan tags highlight yang mengindikasikan program prioritas sekolah.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Kurikulum Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.kurikulum_badge || ''}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Bagian Kurikulum</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.kurikulum_title || ''}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Kurikulum - Paragraf 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.akademik?.kurikulum_p1 || ''}
                        onChange={(e) => handleFieldChange('akademik', 'kurikulum_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Kurikulum - Paragraf 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.akademik?.kurikulum_p2 || ''}
                        onChange={(e) => handleFieldChange('akademik', 'kurikulum_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Unggah Gambar Kurikulum</label>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                          <div style={{ 
                            width: '100px', 
                            height: '65px', 
                            borderRadius: '6px', 
                            border: '2px dashed var(--primary)', 
                            overflow: 'hidden', 
                            backgroundColor: '#f8fafc', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            flexShrink: 0
                          }}>
                            <img 
                              src={kurikulumPreview || pageContents.akademik?.kurikulum_image || '/images/kurikulum_merdeka.svg'} 
                              alt="Kurikulum Preview" 
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={handleKurikulumFileChange}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Kurikulum Highlight Tags (Satu baris per Tag)</label>
                        <textarea
                          className="form-control"
                          value={Array.isArray(pageContents.akademik?.kurikulum_tags) ? pageContents.akademik.kurikulum_tags.join('\n') : (pageContents.akademik?.kurikulum_tags || '')}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_tags', e.target.value.split('\n'))}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card" style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #bfdbfe',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      right: '-20px',
                      bottom: '-20px',
                      fontSize: '7rem',
                      opacity: '0.08',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}>
                      📅
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      <h3 style={{ color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 Kalender Akademik Terpusat
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: '1.6', margin: 0, maxWidth: '90%' }}>
                        Untuk menghindari duplikasi dan memudahkan pengelolaan data, pengisian Kalender Akademik kini telah <strong>disatukan secara terpusat</strong> dengan agenda kegiatan sekolah.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)', alignItems: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('agenda')} 
                          className="btn btn-primary" 
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                          }}
                        >
                          📅 Kelola Kalender & Agenda Sekarang
                        </button>
                        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>
                          (Membuka tab <strong>Agenda Sekolah</strong> di sidebar kiri)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Projek Penguatan Profil Pelajar Pancasila (P5)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Kelola projek P5 yang dipublikasikan pada portal akademik.</p>
                      </div>
                      <button type="button" onClick={handleAddP5Project} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Projek P5
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.akademik?.p5_projects || []).map((proj, idx) => (
                        <div key={proj.id || idx} style={{ backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.95rem' }}>🎯 Projek #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveP5Project(idx)}
                              className="btn-action-delete"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              ✕ Hapus Projek
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Judul Projek</label>
                              <input
                                type="text"
                                placeholder='Contoh: Gaya Hidup Berkelanjutan: "Bahari Lestari"'
                                className="form-control"
                                value={proj.title || ''}
                                onChange={(e) => handleUpdateP5Project(idx, 'title', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Tema / Badge</label>
                              <input
                                type="text"
                                placeholder="Contoh: Gaya Hidup Berkelanjutan"
                                className="form-control"
                                value={proj.badge || ''}
                                onChange={(e) => handleUpdateP5Project(idx, 'badge', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Warna Tema (HEX / Picker)</label>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <input
                                  type="color"
                                  className="form-control"
                                  value={proj.color || '#1e40af'}
                                  onChange={(e) => handleUpdateP5Project(idx, 'color', e.target.value)}
                                  style={{ width: '38px', padding: '2px', height: '38px', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  placeholder="#1e40af"
                                  className="form-control"
                                  value={proj.color || ''}
                                  onChange={(e) => handleUpdateP5Project(idx, 'color', e.target.value)}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Deskripsi Projek</label>
                            <textarea
                              placeholder="Deskripsi lengkap mengenai fokus projek, tujuan, dan kearifan lokal yang diangkat..."
                              className="form-control"
                              value={proj.desc || ''}
                              onChange={(e) => handleUpdateP5Project(idx, 'desc', e.target.value)}
                              rows="3"
                              style={{ width: '100%', resize: 'vertical' }}
                            ></textarea>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Nilai Karakter / Skills (Satu baris per Skill)</label>
                              <textarea
                                placeholder="💡 Kepedulian&#10;🛠️ Gotong Royong"
                                className="form-control"
                                value={Array.isArray(proj.skills) ? proj.skills.join('\n') : (proj.skills || '')}
                                onChange={(e) => handleUpdateP5Project(idx, 'skills', e.target.value.split('\n'))}
                                rows="3"
                                style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
                              ></textarea>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Panduan/Tips Orang Tua di Rumah (Satu baris per Tips)</label>
                              <textarea
                                placeholder="Ajak anak memilah sampah...&#10;Dukung anak tampil..."
                                className="form-control"
                                value={Array.isArray(proj.parentGuide) ? proj.parentGuide.join('\n') : (proj.parentGuide || '')}
                                onChange={(e) => handleUpdateP5Project(idx, 'parentGuide', e.target.value.split('\n'))}
                                rows="3"
                                style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
                              ></textarea>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem' }}>Unggah Gambar Projek</label>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                              <div style={{ 
                                width: '120px', 
                                height: '70px', 
                                borderRadius: '6px', 
                                border: '2px dashed var(--primary)', 
                                overflow: 'hidden', 
                                backgroundColor: '#f8fafc', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <img 
                                  src={p5Previews[idx] || proj.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop'} 
                                  alt={`Projek ${idx + 1} Preview`} 
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="image/*"
                                  onChange={(e) => handleP5FileChange(idx, e.target.files[0])}
                                  style={{ width: '100%' }}
                                />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mendukung format gambar JPEG, PNG, GIF, SVG.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(pageContents.akademik?.p5_projects || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' }}>
                          Belum ada projek P5 kustom yang dibuat. Sistem akan otomatis menampilkan 3 projek P5 bawaan berkualitas tinggi di halaman publik akademik.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Tata Tertib Sekolah</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Daftar tata tertib kedisiplinan murid di lingkungan SDN Bobong.
                    </p>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Aturan & Disiplin (Satu baris per Aturan)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.akademik?.tata_tertib) ? pageContents.akademik.tata_tertib.join('\n') : (pageContents.akademik?.tata_tertib || '')}
                        onChange={(e) => handleFieldChange('akademik', 'tata_tertib', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap tata tertib dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Ketentuan Penggunaan Seragam Sekolah</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Aturan pemakaian seragam dan atribut sekolah berdasarkan hari.</p>
                      </div>
                      <button type="button" onClick={handleAddSeragam} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Seragam
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.akademik?.seragam || []).map((sg, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Hari Ketentuan"
                              className="form-control"
                              value={sg.days || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'days', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Jenis Pakaian Seragam"
                              className="form-control"
                              value={sg.type || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'type', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Atribut & Detail..."
                              className="form-control"
                              value={sg.details || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'details', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSeragam(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.akademik?.seragam || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada ketentuan seragam. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: KESISWAAN ================= */}
              {activePageSubTab === 'kesiswaan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Kesiswaan</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Kesiswaan & Ekstrakurikuler.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_title || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_text || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Kegiatan Ekstrakurikuler (Ekskul)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar kartu wadah pengembangan minat & bakat siswa.</p>
                      </div>
                      <button type="button" onClick={handleAddEkskul} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Ekskul Baru
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).map((ek, idx) => (
                        <div key={ek.id || idx} style={{ display: 'grid', gridTemplateColumns: '3fr 4fr 2.5fr 1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Kegiatan *</label>
                              <input
                                type="text"
                                placeholder="Nama Ekskul"
                                className="form-control"
                                value={ek.nama || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'nama', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, marginTop: '8px' }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jadwal Latihan *</label>
                              <input
                                type="text"
                                placeholder="Jadwal (e.g. Sabtu, 14.00 - 16.00)"
                                className="form-control"
                                value={ek.jadwal || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'jadwal', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deskripsi Kegiatan *</label>
                            <textarea
                              placeholder="Deskripsikan aktivitas ekskul..."
                              className="form-control"
                              value={ek.deskripsi || ''}
                              onChange={(e) => handleUpdateEkskul(idx, 'deskripsi', e.target.value)}
                              rows="4"
                              style={{ width: '100%', resize: 'vertical' }}
                            ></textarea>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Gambar / Logo Ekskul</label>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px' }}>
                              <div style={{ 
                                width: '55px', 
                                height: '55px', 
                                borderRadius: '8px', 
                                border: '1px solid #cbd5e1', 
                                overflow: 'hidden', 
                                backgroundColor: '#ffffff', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <img 
                                  src={ekskulPreviews[idx] || ek.image || '/images/ekskul_pramuka.svg'} 
                                  alt="Ekskul Preview" 
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleEkskulFileChange(idx, e.target.files[0])}
                                style={{ fontSize: '0.7rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0, textAlign: 'center' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Ekstra Wajib</label>
                            <input
                              type="checkbox"
                              checked={!!ek.is_wajib}
                              onChange={(e) => handleUpdateEkskul(idx, 'is_wajib', e.target.checked)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEkskul(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada data ekstrakurikuler. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Prestasi Hebat Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar raihan kejuaraan murid yang dipajang di halaman Kesiswaan.</p>
                      </div>
                      <button type="button" onClick={handleAddKesiswaanPrestasi} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Prestasi Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.prestasi || []).map((pr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Peringkat (e.g. 1st / Juara)"
                              className="form-control"
                              value={pr.rank || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'rank', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={pr.icon || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Tingkat Lomba"
                              className="form-control"
                              value={pr.level || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'level', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Juara / Lomba..."
                              className="form-control"
                              value={pr.title || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Detail / Deskripsi Prestasi..."
                              className="form-control"
                              value={pr.desc || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKesiswaanPrestasi(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.prestasi || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada prestasi murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Galeri Karya Kreatif Kreasi Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Etalase pameran kreasi seni, budaya, kerajinan tangan, atau puisi murid.</p>
                      </div>
                      <button type="button" onClick={handleAddKarya} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Karya Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.karya || []).map((kr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={kr.icon || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Judul Karya"
                              className="form-control"
                              value={kr.title || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Kategori / Tema (P5)"
                              className="form-control"
                              value={kr.category || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'category', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Penjelasan ringkas karya..."
                              className="form-control"
                              value={kr.desc || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKarya(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.karya || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada karya murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: PPDB ================= */}
              {activePageSubTab === 'ppdb' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner PPDB Portal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Penerimaan Peserta Didik Baru (PPDB).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.ppdb?.banner_title || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.ppdb?.banner_text || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Ketentuan Usia & Syarat Berkas Pendaftaran</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Persyaratan kriteria utama usia anak serta unggahan dokumen digital untuk mendaftar.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Aturan Ambang Batas Usia</label>
                      <textarea
                        className="form-control"
                        value={pageContents.ppdb?.syarat_usia || ''}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_usia', e.target.value)}
                        rows="3"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Daftar Berkas Persyaratan (Tulis Setiap Syarat di Baris Baru)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.ppdb?.syarat_berkas) ? pageContents.ppdb.syarat_berkas.join('\n') : (pageContents.ppdb?.syarat_berkas || '')}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_berkas', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap syarat berkas dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                        💡 Tekan Enter untuk membuat butir dokumen baru yang harus dilampirkan pendaftar.
                      </p>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Alur Pendaftaran (4 Langkah Sistematis)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Empat langkah panduan tahapan pendaftaran murid baru dari persiapan berkas hingga pengumuman kelulusan.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.alur_steps || []).map((step, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 4fr', gap: 'var(--space-md)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Langkah</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{step.num || (idx + 1)}</span>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Tahapan *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Penjelasan Singkat Aktivitas *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.desc || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Jadwal Penting Agenda PPDB</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Rentang tanggal pelaksanaan PPDB TA 2026/2027 berjalan.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBJadwal} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Jadwal
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.jadwal || []).map((jd, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Agenda / Kegiatan"
                              className="form-control"
                              value={jd.activity || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'activity', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Rentang Tanggal Pelaksanaan"
                              className="form-control"
                              value={jd.dates || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'dates', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBJadwal(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.jadwal || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada jadwal PPDB. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Tanya Jawab PPDB (FAQ)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Informasi tanya jawab umum yang sering ditanyakan oleh calon pendaftar.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBFaq} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris FAQ
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.ppdb?.faq || []).map((faqItem, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pertanyaan (Question) *</label>
                              <input
                                type="text"
                                placeholder="Ketik pertanyaan utama di sini..."
                                className="form-control"
                                value={faqItem.q || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'q', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jawaban (Answer) *</label>
                              <textarea
                                placeholder="Ketik jawaban penjelasan mendalam di sini..."
                                className="form-control"
                                value={faqItem.a || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'a', e.target.value)}
                                rows="3"
                                style={{ width: '100%', resize: 'vertical' }}
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBFaq(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.faq || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada daftar FAQ. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Relocated: Kelola Kontak Informasi & Humas PPDB */}
                  <div className="settings-card" style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <h3>Kelola Kontak Umum & Tombol WhatsApp Melayang</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Tentukan nomor WhatsApp tujuan untuk tombol melayang hijau dan alamat email resmi sekolah yang tampil di footer halaman publik.
                    </p>

                    <form onSubmit={handleContactsUpdate} key={config?.ppdb_contacts ? JSON.stringify(config?.ppdb_contacts) : 'empty'}>
                      {/* Hidden inputs to preserve existing humas/operator values during form submission */}
                      <input type="hidden" name="nama_humas" value={config?.ppdb_contacts?.nama_humas || ''} />
                      <input type="hidden" name="wa_humas" value={config?.ppdb_contacts?.wa_humas || ''} />
                      <input type="hidden" name="jabatan_humas" value={config?.ppdb_contacts?.jabatan_humas || ''} />
                      <input type="hidden" name="nip_humas" value={config?.ppdb_contacts?.nip_humas || ''} />
                      <input type="hidden" name="nama_operator" value={config?.ppdb_contacts?.nama_operator || ''} />
                      <input type="hidden" name="wa_operator" value={config?.ppdb_contacts?.wa_operator || ''} />
                      <input type="hidden" name="jabatan_operator" value={config?.ppdb_contacts?.jabatan_operator || ''} />
                      <input type="hidden" name="nip_operator" value={config?.ppdb_contacts?.nip_operator || ''} />

                      <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        <div className="form-group">
                          <label htmlFor="wa_floating" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>No. WhatsApp Tombol Melayang (Format: 628xxx)</label>
                          <input
                            type="text"
                            id="wa_floating"
                            name="wa_floating"
                            className="form-control"
                            defaultValue={config?.ppdb_contacts?.wa_floating || ''}
                            style={{ width: '100%' }}
                            placeholder="Contoh: 6281234567890"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email_sekolah" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Email Resmi Sekolah (Footer & Kontak)</label>
                          <input
                            type="email"
                            id="email_sekolah"
                            name="email_sekolah"
                            className="form-control"
                            defaultValue={config?.ppdb_contacts?.email_sekolah || 'admin@sdnegeribobong.sch.id'}
                            style={{ width: '100%' }}
                            placeholder="Contoh: admin@sdnegeribobong.sch.id"
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>💾 Simpan Kontak Umum & Tombol Melayang</button>
                    </form>
                  </div>
                </div>
              )}



              {/* Premium Sticky Save Footer Panel */}
              <div style={{
                marginTop: 'var(--space-lg)',
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'sticky',
                bottom: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                zIndex: 100,
                alignItems: 'center',
                gap: '15px',
                animation: 'slideUp 0.3s ease'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ⚠️ Klik simpan untuk menerapkan semua perubahan di tab <strong>{activePageSubTab.toUpperCase()}</strong> ini ke database.
                </span>
                <button
                  type="button"
                  onClick={() => submitPageContents(activePageSubTab)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px 0 rgba(30, 64, 175, 0.3)'
                  }}
                >
                  💾 Simpan Konten Halaman ({activePageSubTab.toUpperCase()})
                </button>
              </div>

            </div>
          </section>
  );
}
