'use client';



export default function ProfilSubTab(props) {
  const {
    pageContents,
    handleFieldChange,
    sejarahPreview,
    handleSejarahFileChange,
    spPreviews,
    handleSpFileChange,
    handleSpPdfFileChange,
    handleAddSpItem,
    handleUpdateSpItem,
    handleRemoveSpItem
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
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <span>Tekan Enter untuk membuat butir misi baru. Spasi kosong di baris terakhir otomatis divalidasi dan diabaikan saat rendering.</span>
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

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <div>
                        <h3>Daftar Standar Pelayanan Publik</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          Kelola multi-media infografis poster Canva dan dokumen PDF standar pelayanan sekolah.
                        </p>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleAddSpItem}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Tambah Layanan
                      </button>
                    </div>

                    {(pageContents.profil?.standar_pelayanan_list || []).length === 0 ? (
                      <div style={{ padding: 'var(--space-md)', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                        Belum ada standar pelayanan. Klik tombol "Tambah Layanan" untuk menambahkan.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {(pageContents.profil.standar_pelayanan_list || []).map((item, index) => (
                          <div key={item.id || index} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', backgroundColor: '#f8fafc', position: 'relative' }}>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSpItem(index, item.id)}
                              style={{ 
                                position: 'absolute', top: '10px', right: '10px', 
                                border: 'none', backgroundColor: 'transparent', 
                                color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                              Hapus
                            </button>

                            <div className="form-group" style={{ marginBottom: '12px', width: '80%' }}>
                              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Nama/Judul Pelayanan</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={item.title || ''} 
                                onChange={(e) => handleUpdateSpItem(index, 'title', e.target.value)}
                                placeholder="Contoh: Legalisir Ijazah, Mutasi Siswa Masuk"
                                style={{ width: '100%' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: '12px' }}>
                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Poster Layanan (PNG/JPG)</label>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                  <div style={{ 
                                    width: '60px', height: '80px', borderRadius: '4px', border: '1px dashed var(--primary)', 
                                    overflow: 'hidden', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0
                                  }}>
                                    <img 
                                      src={spPreviews[item.id] || item.image || '/images/standar_pelayanan.png'} 
                                      alt="Poster" 
                                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                    />
                                  </div>
                                  <input 
                                    type="file" 
                                    className="form-control" 
                                    accept="image/*"
                                    onChange={(e) => handleSpFileChange(item.id, e.target.files[0])}
                                    style={{ flex: 1 }}
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Brosur PDF Dokumen Pelayanan</label>
                                <input 
                                  type="file" 
                                  className="form-control" 
                                  accept="application/pdf"
                                  onChange={(e) => handleSpPdfFileChange(item.id, e.target.files[0])}
                                />
                                {item.pdf && (
                                  <p style={{ fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>
                                    Aktif: <a href={item.pdf} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Lihat PDF</a>
                                  </p>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: '12px' }}>
                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Biaya Pelayanan</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={item.biaya || ''} 
                                  onChange={(e) => handleUpdateSpItem(index, 'biaya', e.target.value)}
                                  placeholder="Gratis (Rp 0,-)"
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Waktu Pelayanan</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={item.waktu || ''} 
                                  onChange={(e) => handleUpdateSpItem(index, 'waktu', e.target.value)}
                                  placeholder="1 Hari Kerja / 10 Menit Proses"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Alur Layanan Singkat</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={item.alur || ''} 
                                  onChange={(e) => handleUpdateSpItem(index, 'alur', e.target.value)}
                                  placeholder="Serahkan syarat ke loket TU, tunggu verifikasi, ambil berkas."
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Kontak Pengaduan/Pelaksana</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={item.kontak || ''} 
                                  onChange={(e) => handleUpdateSpItem(index, 'kontak', e.target.value)}
                                  placeholder="Operator / Humas (0812xxxx)"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
  );
}
