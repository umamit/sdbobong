import React from 'react';
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function ContentUtilityModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    downloadModalOpen,
    editingDownload,
    downloadTitle,
    setDownloadTitle,
    downloadCategory,
    setDownloadCategory,
    downloadFileUrl,
    setDownloadFileUrl,
    handleSaveDownload,
    setDownloadModalOpen,
    setEditingDownload,
    faqModalOpen,
    editingFaq,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    handleSaveFaq,
    setFaqModalOpen,
    setEditingFaq,
    galleryModalOpen,
    editingGalleryItem,
    galleryTitle,
    setGalleryTitle,
    galleryType,
    setGalleryType,
    galleryCategory,
    setGalleryCategory,
    gallerySourceType,
    setGallerySourceType,
    galleryUrl,
    setGalleryUrl,
    galleryPreview,
    setGalleryPreview,
    setGalleryFile,
    galleryDate,
    setGalleryDate,
    handleSaveGalleryItem,
    setGalleryModalOpen,
    setEditingGalleryItem
  } = context;

  return (
    <>
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
    </>
  );
}
