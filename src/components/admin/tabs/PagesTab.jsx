'use client';

import { useState } from 'react';
import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';
import BerandaSubTab from './pages/BerandaSubTab';
import ProfilSubTab from './pages/ProfilSubTab';
import AkademikSubTab from './pages/AkademikSubTab';
import KesiswaanSubTab from './pages/KesiswaanSubTab';
import PpdbSubTab from './pages/PpdbSubTab';
import AIPageDraftGenerator from './pages/AIPageDraftGenerator';
import AIPageDraftModal from './pages/AIPageDraftModal';
import { applyPageDraft } from './pages/pageDraftHelper';

export default function PagesTab() {
  const adminDashboardProps = useAdminDashboard();
  const { activePageSubTab, activeTab, submitPageContents, handleFieldChange, pageContents, showToast } = adminDashboardProps;
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subTab: activePageSubTab, prompt: aiPrompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal merumuskan draf.');
      setGeneratedDraft(data);
      setShowModal(true);
      showToast('success', 'Draf konten AI berhasil dibuat!');
    } catch (err) {
      showToast('danger', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    applyPageDraft(generatedDraft, activePageSubTab, handleFieldChange, pageContents);
    setAiPrompt('');
    setShowModal(false);
    showToast('success', 'Draf AI berhasil diterapkan ke form halaman!');
  };

  const SUB_TABS = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Sekolah' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'kesiswaan', label: 'Kesiswaan & Ekskul' },
    { id: 'ppdb', label: 'PPDB Portal' }
  ];

  return (
    <section id="tab-pages" className={`tab-pane ${activeTab === 'pages' ? 'active' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', borderBottom: '2px solid #e2e8f0', paddingBottom: 'var(--space-xs)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => adminDashboardProps.setActivePageSubTab(tab.id)}
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: activePageSubTab === tab.id ? 700 : 500, backgroundColor: activePageSubTab === tab.id ? 'var(--primary)' : 'transparent', color: activePageSubTab === tab.id ? '#ffffff' : 'var(--text-muted)', border: 'none', borderBottom: activePageSubTab === tab.id ? '3px solid var(--primary-dark)' : '3px solid transparent', borderRadius: '8px 8px 0 0', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Assistant Generator */}
        <AIPageDraftGenerator subTab={activePageSubTab} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isGenerating={isGenerating} onGenerate={handleGenerate} />

        {/* Active Page Form Sub-tab */}
        {activePageSubTab === 'beranda' && <BerandaSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'profil' && <ProfilSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'akademik' && <AkademikSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'kesiswaan' && <KesiswaanSubTab {...adminDashboardProps} />}
        {activePageSubTab === 'ppdb' && <PpdbSubTab {...adminDashboardProps} />}

        {/* Sticky Save Footer */}
        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '15px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', zIndex: 100, alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Klik simpan untuk menerapkan seluruh perubahan di tab <strong>{activePageSubTab.toUpperCase()}</strong> ini ke database.
          </span>
          <button type="button" onClick={() => submitPageContents(activePageSubTab)} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            Simpan Konten ({activePageSubTab.toUpperCase()})
          </button>
        </div>

        {/* AI Draft Preview Modal */}
        {showModal && <AIPageDraftModal subTab={activePageSubTab} generatedDraft={generatedDraft} onClose={() => setShowModal(false)} onApply={handleApply} />}
      </div>
    </section>
  );
}
