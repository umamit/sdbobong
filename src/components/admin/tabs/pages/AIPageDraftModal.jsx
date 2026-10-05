import { renderKesiswaanPreview } from './AIPageDraftKesiswaanPreview';

export default function AIPageDraftModal({ subTab, generatedDraft, onClose, onApply }) {
  if (!generatedDraft) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            Draf Konten AI ({subTab.toUpperCase()})
          </h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', color: '#1e293b' }}>
          <div style={{ padding: '10px 14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '0.82rem', color: '#0369a1' }}>
            Tinjau draf hasil rumusan AI di bawah. Klik <strong>&quot;Terapkan ke Form Ini&quot;</strong> untuk memasukkan data ke form halaman yang aktif.
          </div>

          {/* Sub-tab Specific Previews */}
          {subTab === 'beranda' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Judul Sambutan</label>
                <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{generatedDraft.welcome_title}</div>
              </div>
              {generatedDraft.welcome_quote && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Kutipan Sambutan</label>
                  <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontStyle: 'italic' }}>&quot;{generatedDraft.welcome_quote}&quot;</div>
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Isi Sambutan</label>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '6px' }}>{generatedDraft.welcome_p1}</div>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}>{generatedDraft.welcome_p2}</div>
              </div>
            </div>
          )}

          {subTab === 'profil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {generatedDraft.visi && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Visi Sekolah</label>
                  <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{generatedDraft.visi}</div>
                </div>
              )}
              {Array.isArray(generatedDraft.misi) && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Poin Misi</label>
                  <ul style={{ margin: 0, paddingLeft: '20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 20px', fontSize: '0.88rem' }}>
                    {generatedDraft.misi.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {subTab === 'akademik' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Kurikulum</label>
                <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{generatedDraft.kurikulum_title}</div>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}>{generatedDraft.kurikulum_p1}</div>
              </div>
              {Array.isArray(generatedDraft.tata_tertib) && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Tata Tertib</label>
                  <ul style={{ margin: 0, paddingLeft: '20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 20px', fontSize: '0.88rem' }}>
                    {generatedDraft.tata_tertib.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {subTab === 'kesiswaan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {renderKesiswaanPreview(generatedDraft)}
            </div>
          )}

          {subTab === 'ppdb' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Judul & Teks Pengantar</label>
                <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>{generatedDraft.banner_title}</div>
                <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '6px', fontSize: '0.88rem' }}>{generatedDraft.banner_text}</div>
              </div>
              {Array.isArray(generatedDraft.syarat_berkas) && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Syarat Berkas</label>
                  <ul style={{ margin: 0, paddingLeft: '20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 18px', fontSize: '0.88rem' }}>
                    {generatedDraft.syarat_berkas.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#f8fafc' }}>
          <button type="button" onClick={onClose} style={{ background: '#ffffff', color: '#475569', fontWeight: 600, border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>Batal</button>
          <button type="button" onClick={onApply} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '6px', padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Terapkan ke Form Ini
          </button>
        </div>
      </div>
    </div>
  );
}
