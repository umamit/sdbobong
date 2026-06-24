'use client';

import React from 'react';

export default function PpdbSubTab(props) {
  const {
    config,
    pageContents,
    handleFieldChange,
    teachers = [],
    normalizeTeacherName,
    handleContactsUpdate,
    handleAddSeragam,
    handleUpdateSeragam,
    handleRemoveSeragam,
    handleAddPPDBFaq,
    handleUpdatePPDBFaq,
    handleRemovePPDBFaq
  } = props;

  const [inputNamaHumas, setInputNamaHumas] = React.useState('');
  const [inputNamaOperator, setInputNamaOperator] = React.useState('');

  React.useEffect(() => {
    if (config?.ppdb_contacts) {
      setInputNamaHumas(config.ppdb_contacts.nama_humas || '');
      setInputNamaOperator(config.ppdb_contacts.nama_operator || '');
    }
  }, [config]);

  const currentNipHumas = React.useMemo(() => {
    if (!inputNamaHumas) return "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(inputNamaHumas));
    return matched 
      ? matched.nip 
      : (inputNamaHumas === config?.ppdb_contacts?.nama_humas ? (config?.ppdb_contacts?.nip_humas || "") : "");
  }, [inputNamaHumas, teachers, normalizeTeacherName, config]);

  const currentNipOperator = React.useMemo(() => {
    if (!inputNamaOperator) return "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(inputNamaOperator));
    return matched 
      ? matched.nip 
      : (inputNamaOperator === config?.ppdb_contacts?.nama_operator ? (config?.ppdb_contacts?.nip_operator || "") : "");
  }, [inputNamaOperator, teachers, normalizeTeacherName, config]);

  return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner PPDB Portal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Penerimaan Peserta Didik Baru (PPDB).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.ppdb?.banner_title || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.ppdb?.banner_text || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Ketentuan Usia & Syarat Berkas Pendaftaran</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Persyaratan kriteria utama usia anak serta unggahan dokumen digital untuk mendaftar.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Aturan Ambang Batas Usia</label>
                      <textarea
                        className="form-control"
                        value={pageContents.ppdb?.syarat_usia || ''}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_usia', e.target.value)}
                        rows="3"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Daftar Berkas Persyaratan (Tulis Setiap Syarat di Baris Baru)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.ppdb?.syarat_berkas) ? pageContents.ppdb.syarat_berkas.join('\n') : (pageContents.ppdb?.syarat_berkas || '')}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_berkas', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap syarat berkas dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                        💡 Tekan Enter untuk membuat butir dokumen baru yang harus dilampirkan pendaftar.
                      </p>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Alur Pendaftaran (4 Langkah Sistematis)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Empat langkah panduan tahapan pendaftaran murid baru dari persiapan berkas hingga pengumuman kelulusan.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.alur_steps || []).map((step, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 4fr', gap: 'var(--space-md)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Langkah</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{step.num || (idx + 1)}</span>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Tahapan *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Penjelasan Singkat Aktivitas *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.desc || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Jadwal Penting Agenda PPDB</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Rentang tanggal pelaksanaan PPDB TA 2026/2027 berjalan.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBJadwal} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Jadwal
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.jadwal || []).map((jd, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Agenda / Kegiatan"
                              className="form-control"
                              value={jd.activity || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'activity', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Rentang Tanggal Pelaksanaan"
                              className="form-control"
                              value={jd.dates || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'dates', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBJadwal(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.jadwal || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada jadwal PPDB. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Tanya Jawab PPDB (FAQ)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Informasi tanya jawab umum yang sering ditanyakan oleh calon pendaftar.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBFaq} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris FAQ
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.ppdb?.faq || []).map((faqItem, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pertanyaan (Question) *</label>
                              <input
                                type="text"
                                placeholder="Ketik pertanyaan utama di sini..."
                                className="form-control"
                                value={faqItem.q || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'q', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jawaban (Answer) *</label>
                              <textarea
                                placeholder="Ketik jawaban penjelasan mendalam di sini..."
                                className="form-control"
                                value={faqItem.a || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'a', e.target.value)}
                                rows="3"
                                style={{ width: '100%', resize: 'vertical' }}
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBFaq(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.faq || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada daftar FAQ. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Relocated: Kelola Kontak Informasi & Humas PPDB */}
                  <div className="settings-card" style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <h3>Kelola Kontak Umum & Tombol WhatsApp Melayang</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Tentukan nomor WhatsApp tujuan untuk tombol melayang hijau dan alamat email resmi sekolah yang tampil di footer halaman publik.
                    </p>

                    <form onSubmit={handleContactsUpdate} key={config?.ppdb_contacts ? JSON.stringify(config?.ppdb_contacts) : 'empty'}>
                      {/* Hidden inputs to preserve existing humas/operator values during form submission */}
                      <input type="hidden" name="nama_humas" value={config?.ppdb_contacts?.nama_humas || ''} />
                      <input type="hidden" name="wa_humas" value={config?.ppdb_contacts?.wa_humas || ''} />
                      <input type="hidden" name="jabatan_humas" value={config?.ppdb_contacts?.jabatan_humas || ''} />
                      <input type="hidden" name="nip_humas" value={config?.ppdb_contacts?.nip_humas || ''} />
                      <input type="hidden" name="nama_operator" value={config?.ppdb_contacts?.nama_operator || ''} />
                      <input type="hidden" name="wa_operator" value={config?.ppdb_contacts?.wa_operator || ''} />
                      <input type="hidden" name="jabatan_operator" value={config?.ppdb_contacts?.jabatan_operator || ''} />
                      <input type="hidden" name="nip_operator" value={config?.ppdb_contacts?.nip_operator || ''} />

                      <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        <div className="form-group">
                          <label htmlFor="wa_floating" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>No. WhatsApp Tombol Melayang (Format: 628xxx)</label>
                          <input
                            type="text"
                            id="wa_floating"
                            name="wa_floating"
                            className="form-control"
                            defaultValue={config?.ppdb_contacts?.wa_floating || ''}
                            style={{ width: '100%' }}
                            placeholder="Contoh: 6281234567890"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email_sekolah" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Email Resmi Sekolah (Footer & Kontak)</label>
                          <input
                            type="email"
                            id="email_sekolah"
                            name="email_sekolah"
                            className="form-control"
                            defaultValue={config?.ppdb_contacts?.email_sekolah || 'admin@sdnegeribobong.sch.id'}
                            style={{ width: '100%' }}
                            placeholder="Contoh: admin@sdnegeribobong.sch.id"
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>💾 Simpan Kontak Umum & Tombol Melayang</button>
                    </form>
                  </div>
                </div>
  );
}
