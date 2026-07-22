'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIOLATIONS = [
  { id: 1, text: "Tidak memakai atribut lengkap (topi, dasi, ikat pinggang, dll.)", points: 3 },
  { id: 2, text: "Tidak membawa perlengkapan belajar", points: 3 },
  { id: 3, text: "Terlambat datang ke sekolah", points: 5 },
  { id: 4, text: "Berlari atau bermain di kelas saat pelajaran", points: 5 },
  { id: 5, text: "Tidak mengerjakan tugas/PR tanpa alasan", points: 5 },
  { id: 6, text: "Membuang sampah sembarangan", points: 5 },
  { id: 7, text: "Berkata kasar atau tidak sopan", points: 10 },
  { id: 8, text: "Mengganggu teman saat belajar", points: 10 },
  { id: 9, text: "Membawa barang yang tidak berkaitan dengan pembelajaran tanpa izin", points: 10 },
  { id: 10, text: "Keluar kelas tanpa izin", points: 10 },
  { id: 11, text: "Tidak mengikuti upacara tanpa alasan yang sah", points: 10 },
  { id: 12, text: "Menggunakan telepon genggam tanpa izin guru", points: 15 },
  { id: 13, text: "Mencoret meja, kursi, atau dinding sekolah", points: 15 },
  { id: 14, text: "Menyontek saat ulangan", points: 20 },
  { id: 15, text: "Merusak fasilitas sekolah", points: 25 },
  { id: 16, text: "Berkelahi atau memukul teman", points: 25 },
  { id: 17, text: "Membolos pelajaran", points: 30 },
  { id: 18, text: "Melakukan perundungan (bullying) verbal maupun fisik", points: 30 },
  { id: 19, text: "Mengambil barang milik orang lain", points: 40 },
  { id: 20, text: "Melakukan perkelahian berat yang membahayakan", points: 50 }
];

const ACTIONS = [
  { min: 10, max: 19, label: "10 POIN", desc: "Teguran lisan dan pembinaan oleh wali kelas.", color: "#22c55e", bg: "rgba(34, 197, 94, 0.08)", border: "rgba(34, 197, 94, 0.15)" },
  { min: 20, max: 39, label: "20 POIN", desc: "Teguran tertulis dan pemberitahuan kepada orang tua.", color: "#eab308", bg: "rgba(234, 179, 8, 0.08)", border: "rgba(234, 179, 8, 0.15)" },
  { min: 40, max: 59, label: "40 POIN", desc: "Pemanggilan orang tua dan pembinaan oleh kepala sekolah/BK (jika ada).", color: "#f97316", bg: "rgba(249, 115, 22, 0.08)", border: "rgba(249, 115, 22, 0.15)" },
  { min: 60, max: 79, label: "60 POIN", desc: "Perjanjian pembinaan bersama orang tua dan pemantauan perilaku.", color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.15)" },
  { min: 80, max: 999, label: "80 POIN atau lebih", desc: "Penanganan khusus sesuai tata tertib sekolah dengan mengutamakan pembinaan dan pemulihan perilaku.", color: "#a855f7", bg: "rgba(168, 85, 247, 0.08)", border: "rgba(168, 85, 247, 0.15)" }
];

export default function DisciplinePoints() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalPoints = selectedIds.reduce((sum, id) => {
    const item = VIOLATIONS.find(v => v.id === id);
    return sum + (item ? item.points : 0);
  }, 0);

  const currentAction = ACTIONS.find(act => totalPoints >= act.min && totalPoints <= act.max);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedIds([]);
  };

  const filteredViolations = VIOLATIONS.filter(v => 
    v.text.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <span className="section-subtitle">Disiplin Hari Ini, Sukses Masa Depan</span>
          <h2>Sistem Poin Pelanggaran &amp; Pembinaan Siswa</h2>
          <p style={{ maxWidth: '700px', margin: '8px auto 0 auto', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Sistem poin ini bertujuan untuk membina perilaku siswa agar menjadi lebih baik, bukan sebagai hukuman semata. Urutan pelanggaran disusun dari poin terkecil hingga terbesar.
          </p>
        </div>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-md)', alignItems: 'start' }}>
          
          {/* KIRI: Daftar Pelanggaran & Pencarian */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Cari jenis pelanggaran (misal: 'terlambat', 'upacara', 'gadget')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 0.2s'
                }}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  &times;
                </button>
              )}
            </div>

            <div style={{ 
              maxHeight: '520px', 
              overflowY: 'auto', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {filteredViolations.length > 0 ? (
                <table className="table-custom" style={{ margin: 0, border: 'none', width: '100%' }}>
                  <thead>
                    <tr style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8fafc' }}>
                      <th style={{ width: '50px', textAlign: 'center' }}>Pilih</th>
                      <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                      <th>Jenis Pelanggaran</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredViolations.map((v) => {
                      const isSelected = selectedIds.includes(v.id);
                      return (
                        <tr 
                          key={v.id} 
                          onClick={() => toggleSelect(v.id)}
                          style={{ 
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(18, 165, 184, 0.05)' : 'transparent',
                            transition: 'background-color 0.15s'
                          }}
                        >
                          <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleSelect(v.id)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>{v.id}</td>
                          <td style={{ fontWeight: isSelected ? '600' : '400' }}>{v.text}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ 
                              display: 'inline-block',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              backgroundColor: v.points >= 30 ? '#fee2e2' : v.points >= 15 ? '#ffedd5' : '#f0fdf4',
                              color: v.points >= 30 ? '#ef4444' : v.points >= 15 ? '#f97316' : '#22c55e'
                            }}>
                              {v.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)' }}>
                  Tidak ada jenis pelanggaran yang cocok dengan "{search}"
                </div>
              )}
            </div>
          </div>

          {/* KANAN: Kalkulator, Hasil Akumulasi & Tindak Lanjut */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            
            {/* Box Kalkulator */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Kalkulator Kedisiplinan</span>
                {selectedIds.length > 0 && (
                  <button 
                    onClick={handleReset}
                    style={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      color: 'var(--primary-dark)', 
                      fontWeight: 600, 
                      cursor: 'pointer' 
                    }}
                  >
                    Reset Pilihan
                  </button>
                )}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: totalPoints > 0 ? 'var(--primary-dark)' : '#9ca3af' }}>
                  {totalPoints}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>Total Akumulasi Poin</span>
              </div>

              {selectedIds.length > 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Terpilih <strong>{selectedIds.length}</strong> jenis tindakan indisipliner.
                </p>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Ceklis daftar di kiri untuk mensimulasikan akumulasi pelanggaran siswa.
                </p>
              )}

              {/* Progress Bar Visual */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ 
                  width: `${Math.min(100, (totalPoints / 80) * 100)}%`, 
                  height: '100%', 
                  backgroundColor: totalPoints >= 60 ? '#ef4444' : totalPoints >= 40 ? '#f97316' : totalPoints >= 20 ? '#eab308' : '#22c55e',
                  transition: 'width 0.4s ease, background-color 0.4s'
                }} />
              </div>

              {/* Hasil Tindak Lanjut Dinamis */}
              <AnimatePresence mode="wait">
                {totalPoints > 0 ? (
                  <motion.div
                    key={currentAction ? currentAction.label : 'none'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: currentAction ? currentAction.bg : '#f8fafc',
                      border: `1px solid ${currentAction ? currentAction.border : 'var(--border-color)'}`,
                    }}
                  >
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '0.85rem', 
                      color: currentAction ? currentAction.color : '#64748b', 
                      marginBottom: '4px',
                      letterSpacing: '0.05em' 
                    }}>
                      TINDAK LANJUT SEGERA:
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {currentAction ? currentAction.desc : 'Belum mencapai batas minimal tindakan disipliner (di bawah 10 poin). Siswa mendapat teguran lisan di tempat.'}
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                    Belum ada simulasi poin yang terpilih.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Skala Poin Tindak Lanjut (Sidebar Box) */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>Skala Tindak Lanjut Poin</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ACTIONS.map((act, index) => {
                  const isActive = currentAction && currentAction.label === act.label;
                  return (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        padding: '8px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: isActive ? `1px solid ${act.color}` : '1px solid transparent',
                        backgroundColor: isActive ? act.bg : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ 
                        alignSelf: 'flex-start',
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        backgroundColor: act.color, 
                        color: 'white',
                        minWidth: '70px',
                        textAlign: 'center'
                      }}>
                        {act.label}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4', color: isActive ? 'var(--text-main)' : '#4b5563' }}>
                        {act.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Informasi Footer (Tujuan & Catatan) */}
        <div className="grid-3" style={{ marginTop: 'var(--space-md)', gap: 'var(--space-sm)' }}>
          {/* Tujuan Sistem Poin */}
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              Tujuan Sistem Poin
            </h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Membentuk karakter disiplin dan tanggung jawab siswa sejak dini.</li>
              <li>Menumbuhkan kesadaran mandiri akan ketertiban sekolah.</li>
              <li>Menciptatan lingkungan belajar yang aman, nyaman, dan menyenangkan bagi semua.</li>
            </ul>
          </div>

          {/* Catatan Penting */}
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
              Catatan Pembinaan
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
              Poin diakumulasikan selama tahun ajaran berjalan. Siswa yang menunjukkan perbaikan perilaku yang signifikan secara konsisten berhak mendapatkan <strong>pemutihan poin (reward)</strong> atas rekomendasi Wali Kelas dan disetujui Kepala Sekolah.
            </p>
          </div>

          {/* Pengingat Bersama */}
          <div style={{ 
            background: 'linear-gradient(135deg, #12a5b8 0%, #0c8597 100%)', 
            color: 'white', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-md)', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#ffffff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              💡 Ingat!
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.9)' }}>
              Setiap kesalahan adalah kesempatan berharga bagi anak untuk belajar menjadi lebih baik. Mari bersama-sama bersinergi menjaga nama baik diri, kelas, dan sekolah kita tercinta!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
