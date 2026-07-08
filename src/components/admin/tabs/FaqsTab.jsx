'use client';


import { useAdminDashboard } from '../../../app/admin/dashboard/AdminDashboardContext';

export default function FaqsTab() {
  const {
    activeTab,
    faqSearch,
    filteredFaqs,
    handleDeleteFaq,
    setEditingFaq,
    setFaqAnswer,
    setFaqModalOpen,
    setFaqQuestion,
    setFaqSearch
  } = useAdminDashboard();

  return (
    <section id="tab-faqs" className={`tab-pane ${activeTab === 'faqs' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Kelola FAQ Sekolah</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Sunting daftar tanya jawab umum untuk membantu calon siswa, alumni, dan orang tua wali murid.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
                    setFaqQuestion('');
                    setFaqAnswer('');
                    setFaqModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ➕ Tambah FAQ Baru
                </button>
              </div>

              {/* FAQs Search Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari FAQ berdasarkan pertanyaan atau jawaban..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', left: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '300px' }}>Pertanyaan</th>
                      <th>Jawaban</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, idx) => (
                        <tr key={faq.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary-dark)', verticalAlign: 'top' }}>❓ {faq.question || '-'}</td>
                          <td style={{ fontWeight: 500, color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5', verticalAlign: 'top' }}>{faq.answer || '-'}</td>
                          <td style={{ verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFaq(faq);
                                  setFaqQuestion(faq.question || '');
                                  setFaqAnswer(faq.answer || '');
                                  setFaqModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1' }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="btn-action-delete"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0 }}
                              >
                                🗑️ Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada FAQ yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
  );
}
