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
  );
}
