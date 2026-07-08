'use client';

import React from 'react';

export default function AIDraftModal({ generatedDraft, onClose, onApply }) {
  if (!generatedDraft) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box', animation: 'modalFadeIn 0.3s ease-out' }}>
      <div style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', overflow: 'hidden', animation: 'modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

        {/* Modal Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #f8fafc)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✨</span> Rekomendasi Draf Berita AI
          </h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: 'var(--text-muted, #94a3b8)', cursor: 'pointer', padding: '4px', lineHeight: '1', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted, #94a3b8)'}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-main, #cbd5e1)' }}>
          {/* Info Alert */}
          <div style={{ padding: '12px 16px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', fontSize: '0.8rem', color: '#38bdf8', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '1rem' }}>ℹ️</span>
            <span>
              Draf ini dihasilkan secara otomatis. Jika Anda menyetujuinya, klik tombol <strong>&quot;Gunakan Draf Ini&quot;</strong> untuk mengisinya langsung ke form penerbitan. Anda tetap bisa mengedit judul, tanggal, kategori, gambar, maupun isi berita sebelum diterbitkan.
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
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}>{generatedDraft.category}</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Tanggal Publikasi (WIT)</label>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}>{generatedDraft.date}</div>
            </div>
          </div>

          {/* SEO Preview */}
          {(generatedDraft.seo_title || generatedDraft.seo_description) && (
            <div style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1rem' }}>🔍</span>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rekomendasi SEO untuk Google</label>
              </div>
              {generatedDraft.seo_title && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>SEO Title</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: generatedDraft.seo_title.length <= 60 ? '#10b981' : '#f59e0b', background: generatedDraft.seo_title.length <= 60 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: '10px' }}>
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
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: generatedDraft.seo_description.length <= 160 ? '#10b981' : '#f59e0b', background: generatedDraft.seo_description.length <= 160 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: '10px' }}>
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
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.6', maxHeight: '260px', overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: generatedDraft.content }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'rgba(255, 255, 255, 0.02)' }}>
          <button type="button" onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))', borderRadius: '8px', padding: '10px 18px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#f8fafc'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted, #94a3b8)'; }}
          >
            ✕ Batal
          </button>
          <button type="button" onClick={onApply}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'; }}
          >
            ✍️ Gunakan Draf Ini
          </button>
        </div>
      </div>

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
  );
}
