'use client';

import React from 'react';

export default function ParentWaliSection({ formData, handleChange }) {
  return (
    <>
            <div className="form-card-section" style={{
              background: '#fcfcfd',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid var(--formal-red)',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👨‍👩‍👧 B. DATA ORANG TUA KANDUNG
              </h3>

              {/* Ayah: Nama Lengkap & Pekerjaan */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="nama_ayah" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nama Lengkap Ayah Kandung *
                  </label>
                  <input
                    type="text"
                    id="nama_ayah"
                    name="nama_ayah"
                    className="form-control"
                    placeholder="Nama lengkap ayah kandung"
                    value={formData.nama_ayah}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="pekerjaan_ayah" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Pekerjaan Ayah *
                  </label>
                  <input
                    type="text"
                    id="pekerjaan_ayah"
                    name="pekerjaan_ayah"
                    className="form-control"
                    placeholder="Contoh: PNS, Nelayan, Wiraswasta"
                    value={formData.pekerjaan_ayah}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Ayah: No HP */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="no_hp_ayah" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    No. HP / WhatsApp Ayah *
                  </label>
                  <input
                    type="tel"
                    id="no_hp_ayah"
                    name="no_hp_ayah"
                    className="form-control"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={formData.no_hp_ayah}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ display: 'none' }}>
                  {/* Empty cell for grid layout alignment */}
                </div>
              </div>

              {/* Ibu: Nama Lengkap & Pekerjaan */}
              <div className="form-row" style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="nama_ibu" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nama Lengkap Ibu Kandung *
                  </label>
                  <input
                    type="text"
                    id="nama_ibu"
                    name="nama_ibu"
                    className="form-control"
                    placeholder="Nama lengkap ibu kandung"
                    value={formData.nama_ibu}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="pekerjaan_ibu" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Pekerjaan Ibu *
                  </label>
                  <input
                    type="text"
                    id="pekerjaan_ibu"
                    name="pekerjaan_ibu"
                    className="form-control"
                    placeholder="Contoh: Ibu Rumah Tangga, Guru, Pedagang"
                    value={formData.pekerjaan_ibu}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Ibu: No HP & No HP Utama */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="no_hp_ibu" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    No. HP / WhatsApp Ibu *
                  </label>
                  <input
                    type="tel"
                    id="no_hp_ibu"
                    name="no_hp_ibu"
                    className="form-control"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={formData.no_hp_ibu}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="no_hp" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nomor HP Utama Kontak * (Untuk Informasi PPDB)
                  </label>
                  <input
                    type="tel"
                    id="no_hp"
                    name="no_hp"
                    className="form-control"
                    placeholder="Prefill otomatis dari HP Ayah/Ibu"
                    value={formData.no_hp}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN 3: DATA WALI (OPSIONAL) */}
            <div className="form-card-section" style={{
              background: '#fcfcfd',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid #64748b',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤝 C. DATA WALI (OPSIONAL - JIKA ADA)
              </h3>

              {/* Wali: Nama & Pekerjaan */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="nama_wali" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nama Lengkap Wali (Jika Ada)
                  </label>
                  <input
                    type="text"
                    id="nama_wali"
                    name="nama_wali"
                    className="form-control"
                    placeholder="Isi jika calon siswa diasuh oleh Wali"
                    value={formData.nama_wali}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="pekerjaan_wali" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Pekerjaan Wali
                  </label>
                  <input
                    type="text"
                    id="pekerjaan_wali"
                    name="pekerjaan_wali"
                    className="form-control"
                    placeholder="Pekerjaan wali calon siswa"
                    value={formData.pekerjaan_wali}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
    </>
  );
}
