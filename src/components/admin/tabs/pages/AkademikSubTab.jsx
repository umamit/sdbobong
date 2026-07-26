'use client';



export default function AkademikSubTab(props) {
  const {
    pageContents,
    handleFieldChange,
    kurikulumPreview,
    handleKurikulumFileChange,
    p5Previews,
    handleP5FileChange,
    handleAddP5Project,
    handleUpdateP5Project,
    handleRemoveP5Project,
    handleAddSeragam,
    handleUpdateSeragam,
    handleRemoveSeragam,
    handleAddJadwalKbm,
    handleUpdateJadwalKbm,
    handleRemoveJadwalKbm
  } = props;

  return (
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
                      right: '-10px',
                      bottom: '-10px',
                      opacity: '0.08',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      color: 'var(--primary-dark)'
                    }}>
                      <svg width="112" height="112" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                    </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <h3 style={{ color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Agenda Akademik Terpusat
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: '1.6', margin: 0, maxWidth: '90%' }}>
                          Untuk menghindari duplikasi dan memudahkan pengelolaan data, pengisian Agenda Akademik kini telah <strong>disatukan secara terpusat</strong> dengan agenda kegiatan sekolah.
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Kelola Agenda Akademik Sekarang
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
                        <button type="button" onClick={handleAddP5Project} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Tambah Projek P5
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {(pageContents.akademik?.p5_projects || []).map((proj, idx) => (
                          <div key={proj.id || idx} style={{ backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.95rem' }}>Projek #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveP5Project(idx)}
                                className="btn-action-delete"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                              >
                                Hapus Projek
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
                                placeholder="Kepedulian&#10;Gotong Royong"
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
                        <h3 style={{ margin: 0 }}>Jadwal Kegiatan Belajar Mengajar (KBM) Harian</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Kelola rincian waktu belajar harian per tingkat kelas / kelompok kelas.</p>
                      </div>
                      <button type="button" onClick={handleAddJadwalKbm} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Jadwal KBM
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.akademik?.jadwal_kbm || []).map((kbm, idx) => (
                        <div key={kbm.id || idx} style={{ backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>Jadwal #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveJadwalKbm(idx)}
                              className="btn-action-delete"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                              Hapus Jadwal
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Tingkat / Kelompok Kelas</label>
                              <input
                                type="text"
                                placeholder="Contoh: Kelas I & II (Fase A)"
                                className="form-control"
                                value={kbm.kelas || ''}
                                onChange={(e) => handleUpdateJadwalKbm(idx, 'kelas', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Hari & Jam Belajar (Baris Baru untuk Hari Baru)</label>
                              <textarea
                                placeholder="Contoh: Senin - Kamis: 07.15 - 11.45 WIT&#10;Jumat: 07.15 - 10.30 WIT"
                                className="form-control"
                                value={kbm.hari || ''}
                                onChange={(e) => handleUpdateJadwalKbm(idx, 'hari', e.target.value)}
                                rows="2"
                                style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                              ></textarea>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'block', marginBottom: '2px', fontWeight: 600, fontSize: '0.8rem' }}>Keterangan Tambahan</label>
                            <input
                              type="text"
                              placeholder="Contoh: Jam Belajar Lebih Singkat, Istirahat Pukul 09.15 - 09.45 WIT"
                              className="form-control"
                              value={kbm.keterangan || ''}
                              onChange={(e) => handleUpdateJadwalKbm(idx, 'keterangan', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      ))}
                      {(pageContents.akademik?.jadwal_kbm || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0', margin: 0 }}>
                          Belum ada jadwal KBM kustom. Klik "Tambah Jadwal KBM" untuk membuat jadwal baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Ketentuan Penggunaan Seragam Sekolah</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Aturan pemakaian seragam dan atribut sekolah berdasarkan hari.</p>
                      </div>
                      <button type="button" onClick={handleAddSeragam} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Baris Seragam
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
  );
}
