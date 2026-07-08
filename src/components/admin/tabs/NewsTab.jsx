'use client';

import React, { useState } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';
import RichTextEditor from '../../../components/RichTextEditor';
import AIContentRecommendations from '../../admin/ai/AIContentRecommendations';

export default function NewsTab() {
  const {
    activeTab,
    editingNews,
    handleNewsAdd,
    handleNewsCancelEdit,
    handleNewsDelete,
    handleNewsEditClick,
    handleNewsPhotosChange,
    handleNewsUpdate,
    handleRemoveNewsPhoto,
    newsEditorKey,
    newsList,
    newsPhotoPreviews,
    showToast
  } = useAdminDashboard();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleGenerateDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-news-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan draf berita.');
      }
      setGeneratedDraft(data);
      setShowPreviewModal(true);
      showToast('success', 'Draf berita AI berhasil dibuat!');
    } catch (err) {
      console.error(err);
      showToast('danger', err.message || 'Terjadi kesalahan saat menghubungi server AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyDraft = () => {
    if (!generatedDraft) return;

    // Populate title
    const titleInput = document.getElementById('news_title');
    if (titleInput) {
      titleInput.value = generatedDraft.title;
    }

    // Populate category
    const categoryInput = document.getElementById('news_category');
    if (categoryInput) {
      categoryInput.value = generatedDraft.category;
    }

    // Populate date
    const dateInput = document.getElementById('news_date');
    if (dateInput) {
      dateInput.value = generatedDraft.date;
    }

    // Populate rich text editor content
    const editorDiv = document.querySelector('.editor-workspace');
    if (editorDiv) {
      editorDiv.innerHTML = generatedDraft.content;
      editorDiv.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Show SEO info in a toast if available
    if (generatedDraft.seo_title || generatedDraft.seo_description) {
      console.info('[SEO Draft] seo_title:', generatedDraft.seo_title);
      console.info('[SEO Draft] seo_description:', generatedDraft.seo_description);
    }

    // Reset prompt and close modal
    setAiPrompt('');
    setShowPreviewModal(false);
    showToast('success', 'Draf berita AI berhasil diterapkan ke formulir!');

    // Smooth scroll to news form
    setTimeout(() => {
      const formElement = document.getElementById('news_form_section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section id="tab-news" className={`tab-pane ${activeTab === 'news' ? 'active' : ''}`}>
            <div className="news-cms-grid news-stacked-layout">
              <AIContentRecommendations />
              {/* ASISTEN AI PEMBUAT DRAF BERITA SEKOLAH */}
              {!editingNews && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background glowing sphere decoration */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)',
                    pointerEvents: 'none'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.8rem', animation: 'float 3s ease-in-out infinite' }}>🪄</span>
                    <div>
                      <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Asisten Draf Berita AI <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>BETA</span>
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                        Tulis topik pendek atau pilih template kegiatan di bawah untuk membuat draf berita lengkap dengan bantuan kecerdasan buatan.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion tags/pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { label: '🧹 Kerja Bakti / Sabtu Bersih', prompt: 'Kegiatan gotong royong kerja bakti Sabtu Bersih oleh siswa-siswi dan guru untuk membersihkan lingkungan sekolah dan kelas.' },
                      { label: '🤝 Rapat Komite Sekolah', prompt: 'Musyawarah koordinasi komite sekolah bersama wali murid untuk membahas program kerja tahunan dan peningkatan sarana prasarana.' },
                      { label: '🏆 Lomba Seni & Olahraga', prompt: 'Siswa-siswi SD Negeri Bobong berhasil meraih juara dalam perlombaan seni dan olahraga tingkat kabupaten.' },
                      { label: '🩺 Program Imunisasi BIAS', prompt: 'Pelaksanaan kegiatan imunisasi Bulan Imunisasi Anak Sekolah (BIAS) bekerja sama dengan Puskesmas setempat.' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiPrompt(item.prompt)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '20px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          color: '#cbd5e1',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                          e.target.style.color = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#cbd5e1';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Prompt Area */}
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Tulis topik atau poin berita di sini (misal: Rapat komite membahas pengembangan laboratorium komputer baru)..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px 16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      type="button"
                      disabled={isGenerating || !aiPrompt.trim()}
                      onClick={handleGenerateDraft}
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: aiPrompt.trim() ? 'pointer' : 'not-allowed',
                        opacity: aiPrompt.trim() ? 1 : 0.6,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.2s ease',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        if (aiPrompt.trim() && !isGenerating) {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
                          </svg>
                          Merumuskan Draf AI...
                        </>
                      ) : (
                        <>
                          <span>✨</span> Buat Draf dengan AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* Local Styles for animation */}
                  <style jsx>{`
                    @keyframes float {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-4px); }
                    }
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}

              {/* MODAL PREVIEW DRAF BERITA AI */}
              {showPreviewModal && generatedDraft && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '20px',
                  boxSizing: 'border-box',
                  animation: 'modalFadeIn 0.3s ease-out'
                }}>
                  <div style={{
                    background: 'var(--bg-card, #1e293b)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '750px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                    animation: 'modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}>
                    {/* Modal Header */}
                    <div style={{
                      padding: '18px 24px',
                      borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                      <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #f8fafc)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✨</span> Rekomendasi Draf Berita AI
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(false)}
                        style={{
                          border: 'none',
                          background: 'none',
                          fontSize: '1.5rem',
                          color: 'var(--text-muted, #94a3b8)',
                          cursor: 'pointer',
                          padding: '4px',
                          lineHeight: '1',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted, #94a3b8)'}
                      >
                        &times;
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div style={{
                      padding: '24px',
                      overflowY: 'auto',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      color: 'var(--text-main, #cbd5e1)'
                    }}>
                      {/* Warning Alert */}
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(14, 165, 233, 0.1)',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '1rem' }}>ℹ️</span>
                        <span>
                          Draf ini dihasilkan secara otomatis. Jika Anda menyetujuinya, klik tombol <strong>"Gunakan Draf Ini"</strong> untuk mengisinya langsung ke form penerbitan. Anda tetap bisa mengedit judul, tanggal, kategori, gambar, maupun isi berita sebelum diterbitkan.
                        </span>
                      </div>

                      {/* Title Preview */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Judul Berita</label>
                        <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem' }}>
                          {generatedDraft.title}
                        </div>
                      </div>

                      {/* Info row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Kategori</label>
                          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}>
                            {generatedDraft.category}
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Tanggal Publikasi (WIT)</label>
                          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}>
                            {generatedDraft.date}
                          </div>
                        </div>
                      </div>

                      {/* SEO Preview — only shown when AI returned seo_title or seo_description */}
                      {(generatedDraft.seo_title || generatedDraft.seo_description) && (
                        <div style={{
                          padding: '14px 16px',
                          background: 'rgba(16, 185, 129, 0.06)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '10px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1rem' }}>🔍</span>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rekomendasi SEO untuk Google</label>
                          </div>
                          {generatedDraft.seo_title && (
                            <div style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>SEO Title</span>
                                <span style={{
                                  fontSize: '0.68rem', fontWeight: 700,
                                  color: generatedDraft.seo_title.length <= 60 ? '#10b981' : '#f59e0b',
                                  background: generatedDraft.seo_title.length <= 60 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                  padding: '1px 6px', borderRadius: '10px'
                                }}>
                                  {generatedDraft.seo_title.length}/60
                                </span>
                              </div>
                              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem' }}>
                                {generatedDraft.seo_title}
                              </div>
                            </div>
                          )}
                          {generatedDraft.seo_description && (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Meta Description</span>
                                <span style={{
                                  fontSize: '0.68rem', fontWeight: 700,
                                  color: generatedDraft.seo_description.length <= 160 ? '#10b981' : '#f59e0b',
                                  background: generatedDraft.seo_description.length <= 160 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                  padding: '1px 6px', borderRadius: '10px'
                                }}>
                                  {generatedDraft.seo_description.length}/160
                                </span>
                              </div>
                              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                {generatedDraft.seo_description}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content Preview */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Isi Berita</label>
                        <div 
                          style={{ 
                            padding: '16px', 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            borderRadius: '8px', 
                            color: '#e2e8f0', 
                            fontSize: '0.92rem', 
                            lineHeight: '1.6',
                            maxHeight: '260px',
                            overflowY: 'auto'
                          }}
                          dangerouslySetInnerHTML={{ __html: generatedDraft.content }}
                        />
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                      padding: '16px 24px',
                      borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '12px',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(false)}
                        style={{
                          background: 'transparent',
                          color: 'var(--text-muted, #94a3b8)',
                          fontWeight: 600,
                          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                          borderRadius: '8px',
                          padding: '10px 18px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.05)';
                          e.target.style.color = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'var(--text-muted, #94a3b8)';
                        }}
                      >
                        ✕ Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyDraft}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          fontWeight: 700,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 22px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        ✍️ Gunakan Draf Ini
                      </button>
                    </div>
                  </div>

                  {/* Keyframe Styles for modal */}
                  <style jsx>{`
                    @keyframes modalFadeIn {
                      from { opacity: 0; }
                      to { opacity: 1; }
                    }
                    @keyframes modalSlideUp {
                      from { transform: translateY(20px); opacity: 0; }
                      to { transform: translateY(0); opacity: 1; }
                    }
                  `}</style>
                </div>
              )}
              {/* Form News */}
              <div id="news_form_section" className="settings-card">
                <h3>{editingNews ? 'Edit Berita / Kegiatan Sekolah' : 'Tambah Berita / Kegiatan Baru'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  Isi formulir untuk {editingNews ? 'memperbarui' : 'menerbitkan'} artikel berita terbaru mengenai aktivitas sekolah di halaman utama.
                </p>

                <form onSubmit={editingNews ? handleNewsUpdate : handleNewsAdd} key={editingNews ? `edit-${editingNews.id}-${newsEditorKey}` : 'new'} encType="multipart/form-data">
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_title" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Judul Berita *</label>
                    <input
                      type="text"
                      id="news_title"
                      name="title"
                      className="form-control"
                      placeholder="Contoh: Pembagian Rapor Semester Genap"
                      defaultValue={editingNews ? editingNews.title : ''}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="news_date" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tanggal Publikasi *</label>
                      <input
                        type="text"
                        id="news_date"
                        name="date"
                        className="form-control"
                        placeholder="Contoh: 20 Jun 2026"
                        defaultValue={editingNews ? editingNews.date : ''}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="news_category" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Kategori *</label>
                      <input
                        type="text"
                        id="news_category"
                        name="category"
                        className="form-control"
                        placeholder="Contoh: Kegiatan, Prestasi"
                        defaultValue={editingNews ? editingNews.category : ''}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_image" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Pilih Ilustrasi Bawaan *</label>
                    <select id="news_image" name="image" className="form-control" defaultValue={editingNews ? editingNews.image : '/images/news_hari_guru.svg'} style={{ width: '100%' }} required>
                      {editingNews && editingNews.image && !['/images/news_hari_guru.svg', '/images/news_imunisasi.svg', '/images/news_kerja_bakti.svg', '/images/news_rapat_komite.svg'].includes(editingNews.image) && (
                        <option value={editingNews.image}>Gambar Unggahan Saat Ini ({editingNews.image.split('/').pop()})</option>
                      )}
                      <option value="/images/news_hari_guru.svg">Hari Guru Nasional (Merah/Gold)</option>
                      <option value="/images/news_imunisasi.svg">Program Imunisasi / BIAS (Biru Medis)</option>
                      <option value="/images/news_kerja_bakti.svg">Sabtu Bersih / Lingkungan (Hijau Alam)</option>
                      <option value="/images/news_rapat_komite.svg">Musyawarah / Komite (Biru/Orange)</option>
                    </select>
                    <div style={{ marginTop: '10px' }}>
                      <label htmlFor="news_photo" style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.9rem' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1.5MB per berkas):</label>
                      <input
                        type="file"
                        id="news_photo"
                        name="photos"
                        multiple
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleNewsPhotosChange}
                        style={{ width: '100%' }}
                      />
                      {editingNews ? (
                        <p style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '6px', marginBottom: '10px', fontWeight: 500 }}>
                          ℹ️ <strong>Foto Saat Ini:</strong> Berita ini sudah memiliki {editingNews.images ? editingNews.images.length : 1} foto. Mengunggah foto baru di atas akan menggantikan galeri foto saat ini. Kosongkan jika ingin mempertahankan foto saat ini.
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: '10px' }}>
                          💡 <strong>Multi-Upload:</strong> Anda dapat memilih beberapa foto sekaligus untuk membuat galeri dokumentasi dalam satu postingan berita!
                        </p>
                      )}

                      {/* Glassmorphic Multi Photo Preview Area */}
                      {newsPhotoPreviews.length > 0 && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                        }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📸 Foto terpilih ({newsPhotoPreviews.length}):
                          </p>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', 
                            gap: '8px' 
                          }}>
                            {newsPhotoPreviews.map((previewUrl, index) => (
                              <div key={index} style={{ 
                                position: 'relative', 
                                aspectRatio: '1/1', 
                                borderRadius: '6px', 
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}>
                                <img 
                                  src={previewUrl} 
                                  alt={`Preview ${index}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewsPhoto(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                    transition: 'background 0.2s, transform 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = '#ef4444';
                                    e.target.style.transform = 'scale(1.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                                    e.target.style.transform = 'none';
                                  }}
                                  title="Hapus foto ini"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_content" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Isi Lengkap Artikel Berita *</label>
                    <RichTextEditor key={newsEditorKey} defaultValue={editingNews ? editingNews.content : ''} placeholder="Tuliskan isi berita lengkap di sini... Anda bisa menebalkan teks, membuat daftar list, meratakan teks, serta menyisipkan tautan web." />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                    {editingNews && (
                      <button type="button" onClick={handleNewsCancelEdit} className="btn" style={{ flex: 1, padding: '0.65rem', backgroundColor: '#64748b', color: '#ffffff', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>✕ Batal Edit</button>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ flex: editingNews ? 2 : 1, padding: '0.65rem' }}>
                      {editingNews ? '💾 Simpan Perubahan' : '📢 Terbitkan Berita'}
                    </button>
                  </div>
                </form>
              </div>

              {/* List News */}
              <div className="settings-card">
                <h3>Daftar Berita Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar warta yang saat ini sedang aktif di halaman Berita Sekolah. Anda dapat menghapusnya jika artikel sudah usang.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', maxHeight: '520px', overflowY: 'auto', paddingRight: '5px' }}>
                  {newsList.length > 0 ? (
                    newsList.map((n) => (
                      <div key={n.id} style={{ display: 'flex', gap: 'var(--space-sm)', border: '1px solid var(--border-color)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-sm)', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', minWidth: 0 }}>
                          <img src={n.image} alt="" style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date} • {n.category}</span>
                              {n.images && n.images.length > 1 && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  color: '#0284c7',
                                  background: 'rgba(14, 165, 233, 0.1)',
                                  border: '1px solid rgba(14, 165, 233, 0.2)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  lineHeight: '1.2'
                                }}>
                                  📸 {n.images.length} Foto
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleNewsEditClick(n)} type="button" className="btn-action-edit">Edit</button>
                          <button onClick={() => handleNewsDelete(n.id)} type="button" className="btn-action-delete">Hapus</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginTop: 'var(--space-md)' }}>Belum ada berita yang diterbitkan.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
  );
}
