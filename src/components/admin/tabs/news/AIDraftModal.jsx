'use client';



export default function AIDraftModal({ generatedDraft, onClose, onApply }) {
  if (!generatedDraft) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box', animation: 'modalFadeIn 0.3s ease-out' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

        {/* Modal Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            Rekomendasi Draf Berita AI
          </h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', padding: '4px', lineHeight: '1', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', color: '#1e293b' }}>
          {/* Info Alert */}
          <div style={{ padding: '12px 16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '0.85rem', color: '#0369a1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>
              Draf ini dihasilkan secara otomatis. Jika Anda menyetujuinya, klik tombol <strong>&quot;Gunakan Draf Ini&quot;</strong> untuk mengisinya langsung ke form penerbitan. Anda tetap bisa mengedit judul, tanggal, kategori, gambar, maupun isi berita sebelum diterbitkan.
            </span>
          </div>

          {/* Title Preview */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Judul Berita</label>
            <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '1.05rem', lineHeight: '1.4' }}>
              {generatedDraft.title}
            </div>
          </div>

          {/* Info row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Kategori</label>
              <div style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.9rem', fontWeight: 600 }}>{generatedDraft.category}</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Tanggal Publikasi (WIT)</label>
              <div style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.9rem', fontWeight: 600 }}>{generatedDraft.date}</div>
            </div>
          </div>

          {/* SEO Preview */}
          {(generatedDraft.seo_title || generatedDraft.seo_description) && (
            <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rekomendasi SEO untuk Google</label>
              </div>
              {generatedDraft.seo_title && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>SEO Title</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: generatedDraft.seo_title.length <= 60 ? '#15803d' : '#b45309', background: generatedDraft.seo_title.length <= 60 ? '#dcfce7' : '#fef3c7', padding: '2px 8px', borderRadius: '10px', border: generatedDraft.seo_title.length <= 60 ? '1px solid #86efac' : '1px solid #fde68a' }}>
                      {generatedDraft.seo_title.length}/60
                    </span>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1d4ed8', fontWeight: 700, fontSize: '0.92rem' }}>
                    {generatedDraft.seo_title}
                  </div>
                </div>
              )}
              {generatedDraft.seo_description && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Meta Description</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: generatedDraft.seo_description.length <= 160 ? '#15803d' : '#b45309', background: generatedDraft.seo_description.length <= 160 ? '#dcfce7' : '#fef3c7', padding: '2px 8px', borderRadius: '10px', border: generatedDraft.seo_description.length <= 160 ? '1px solid #86efac' : '1px solid #fde68a' }}>
                      {generatedDraft.seo_description.length}/160
                    </span>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', fontSize: '0.85rem', lineHeight: '1.5', fontWeight: 500 }}>
                    {generatedDraft.seo_description}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Preview */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Isi Berita</label>
            <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.92rem', lineHeight: '1.65', maxHeight: '260px', overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: generatedDraft.content }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
          <button type="button" onClick={onClose}
            style={{ background: '#ffffff', color: '#475569', fontWeight: 600, border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 18px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.target.style.background = '#ffffff'; e.target.style.color = '#475569'; }}
          >
            Batal
          </button>
          <button type="button" onClick={onApply}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.35)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Gunakan Draf Ini
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
