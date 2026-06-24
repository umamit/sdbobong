'use client';

import React from 'react';

export default function ProfilSubTab(props) {
  const {
    pageContents,
    handleFieldChange,
    sejarahPreview,
    handleSejarahFileChange
  } = props;

  return (
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
  );
}
