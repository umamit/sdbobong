'use client';



export default function BerandaSubTab(props) {
  const {
    config,
    pageContents,
    handleHeroBgUpdate,
    handleFieldChange
  } = props;

  return (
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
                      Unggah gambar atau video pendek latar belakang baru untuk banner ucapan selamat datang di halaman Beranda utama. Format gambar yang didukung: JPG, JPEG, PNG, SVG (Maks 2MB). Format video pendek yang didukung: MP4, WebM, OGG, MOV, M4V (Maks 30 detik & 20MB).
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {/* Preview */}
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Latar Belakang Saat Ini:</label>
                        {config?.stats?.hero_background && (/\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(config?.stats?.hero_background) || /^data:video\//i.test(config?.stats?.hero_background)) ? (
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
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <span><strong>Rekomendasi:</strong> Gunakan rasio lanskap berkualitas tinggi (minimal 1920x1080). Untuk video, pastikan berdurasi maksimal 10 detik agar tidak ditolak oleh sistem pengunggahan.</span>
                          </p>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          Unggah & Terapkan Background
                        </button>
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

                  {/* Inovasi Digital Management Card */}
                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <div>
                        <h3>Inovasi Digital Sekolah</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          Kelola item inovasi digital yang ditampilkan di bawah Sarana Prasarana halaman utama.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={props.handleAddInovasi}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Inovasi
                      </button>
                    </div>

                    {(pageContents.beranda?.inovasi_list || []).length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                        Belum ada item inovasi digital. Klik "Tambah Inovasi" di atas untuk menambahkan.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(pageContents.beranda?.inovasi_list || []).map((item, idx) => (
                          <div
                            key={item.id || idx}
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: '#f8fafc',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '12px',
                              alignItems: 'center'
                            }}
                          >
                            {/* Label */}
                            <div style={{ flex: '2', minWidth: '150px' }}>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Nama Inovasi</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contoh: Website Sekolah"
                                value={item.label || ''}
                                onChange={(e) => props.handleUpdateInovasi(idx, 'label', e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem' }}
                              />
                            </div>

                            {/* Status */}
                            <div style={{ flex: '1', minWidth: '100px' }}>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Status</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contoh: Aktif"
                                value={item.value || ''}
                                onChange={(e) => props.handleUpdateInovasi(idx, 'value', e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem' }}
                              />
                            </div>

                            {/* Warna Aksen */}
                            <div style={{ flex: '1', minWidth: '110px' }}>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Warna Aksen</label>
                              <select
                                className="form-control"
                                value={item.color || '#12A5B8'}
                                onChange={(e) => props.handleUpdateInovasi(idx, 'color', e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem' }}
                              >
                                <option value="#FFC83B">Kuning Emas (Logo)</option>
                                <option value="#12A5B8">Biru Toska (Logo)</option>
                                <option value="#2A9D5C">Hijau Daun (Logo)</option>
                                <option value="#FF3B30">Merah Peringatan</option>
                              </select>
                            </div>

                            {/* Delete Action */}
                            <div style={{ display: 'flex', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => props.handleRemoveInovasi(idx)}
                                style={{
                                  padding: '8px',
                                  borderRadius: '6px',
                                  borderColor: '#ef4444',
                                  color: '#ef4444',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                                title="Hapus Inovasi"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
  );
}
