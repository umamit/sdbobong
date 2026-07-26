'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FramerWordReveal } from '../../components/FramerReveal';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

export default function AlumniClient({ initialAlumni = [] }) {
  const [alumniList, setAlumniList] = useState(initialAlumni);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [tahunLulus, setTahunLulus] = useState('');
  const [sekolahLanjutan, setSekolahLanjutan] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [pesanKesan, setPesanKesan] = useState('');
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Unique years for filter
  const years = useMemo(() => {
    const set = new Set(alumniList.map(a => a.tahun_lulus).filter(Boolean));
    return ['Semua', ...Array.from(set).sort((a, b) => b - a)];
  }, [alumniList]);

  // Filtered Alumni
  const filteredAlumni = useMemo(() => {
    return alumniList.filter(a => {
      const matchesSearch =
        (a.nama_lengkap || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.sekolah_lanjutan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.pekerjaan || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = selectedYear === 'Semua' || a.tahun_lulus === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [alumniList, searchQuery, selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setFormError('Jawaban verifikasi salah. Silakan coba lagi.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: nama,
          tahun_lulus: tahunLulus,
          sekolah_lanjutan: sekolahLanjutan,
          pekerjaan,
          pesan_kesan: pesanKesan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Gagal mendaftar alumni');
        return;
      }

      setAlumniList(prev => [data.alumni, ...prev]);
      setFormSuccess(true);
      setNama('');
      setTahunLulus('');
      setSekolahLanjutan('');
      setPekerjaan('');
      setPesanKesan('');
      setCaptchaInput('');
      setCaptcha(generateCaptcha());
      setShowForm(false);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch {
      setFormError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const pillStyle = (isActive) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: isActive ? '1px solid var(--primary-dark)' : '1px solid var(--border-color)',
    backgroundColor: isActive ? 'var(--primary)' : 'white',
    color: isActive ? 'white' : 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  });

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
  };

  return (
    <>
      {/* Banner Hero */}
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            <FramerWordReveal text="Portal Alumni SD Negeri Bobong" />
          </h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>
            Wadah jejaring silaturahmi, rekapitulasi angkatan, dan jejak langkah inspiratif lulusan sekolah kami.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section-padding">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Action Header & Stat */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">Jejaring Lulusan</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem' }}>Direktori &amp; Pendataan Alumni</h2>
            </div>

            <button
              onClick={() => { setShowForm(!showForm); setFormSuccess(false); }}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '12px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {showForm ? 'Tutup Formulir' : 'Daftar Alumni Baru'}
            </button>
          </div>

          {/* Form Success Toast */}
          {formSuccess && (
            <div style={{
              padding: '14px 18px', borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid rgba(16, 185, 129, 0.3)',
              color: '#065f46', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Selamat! Data alumni Anda berhasil ditambahkan ke direktori resmi SD Negeri Bobong.
            </div>
          )}

          {/* Form Pendataan Alumni */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--primary-light, #818cf8)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  overflow: 'hidden'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Formulir Pendataan Alumni Mandiri</h3>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Silakan isi formulir di bawah ini untuk memperbarui database alumni SD Negeri Bobong.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Nama Lengkap *</label>
                    <input
                      type="text"
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      placeholder="Mis: Ahmad Dahlan"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Tahun Lulus (Angkatan) *</label>
                    <input
                      type="number"
                      value={tahunLulus}
                      onChange={e => setTahunLulus(e.target.value)}
                      placeholder="Mis: 2018"
                      min="1950"
                      max="2030"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Sekolah Lanjutan / PT Saat Ini</label>
                    <input
                      type="text"
                      value={sekolahLanjutan}
                      onChange={e => setSekolahLanjutan(e.target.value)}
                      placeholder="Mis: SMP Negeri 1 Bobong / Universitas Khairun"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Pekerjaan / Aktivitas Saat Ini</label>
                    <input
                      type="text"
                      value={pekerjaan}
                      onChange={e => setPekerjaan(e.target.value)}
                      placeholder="Mis: Mahasiswa / Pegawai Swasta / Pelajar"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Kesan, Pesan &amp; Motivasi untuk Adik Kelas</label>
                  <textarea
                    value={pesanKesan}
                    onChange={e => setPesanKesan(e.target.value)}
                    placeholder="Tuliskan cerita singkat, nostalgia, atau kata-kata motivasi..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Captcha & Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Verifikasi: {captcha.a} + {captcha.b} =
                    </span>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value)}
                      placeholder="?"
                      required
                      style={{ ...inputStyle, width: '80px', padding: '6px 10px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      {submitting ? 'Menyimpan...' : 'Kirim Data Alumni'}
                    </button>
                  </div>
                </div>

                {formError && (
                  <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>
                    ⚠️ {formError}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Filter & Search Bar */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nama alumni, sekolah lanjutan, atau pekerjaan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '40px' }}
                />
              </div>

              {years.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Angkatan:</span>
                  {years.map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setSelectedYear(y)}
                      style={pillStyle(selectedYear === y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Menampilkan <strong>{filteredAlumni.length}</strong> dari <strong>{alumniList.length}</strong> alumni terdata
              {selectedYear !== 'Semua' && ` · Angkatan ${selectedYear}`}
            </p>
          </div>

          {/* Alumni Grid Cards */}
          {filteredAlumni.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredAlumni.map(alumni => (
                <motion.div
                  key={alumni.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '42px', height: '42px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.1rem', fontWeight: 800
                        }}>
                          {alumni.nama_lengkap.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: 800 }}>{alumni.nama_lengkap}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lulusan {alumni.tahun_lulus}</span>
                        </div>
                      </div>
                    </div>

                    {alumni.sekolah_lanjutan && (
                      <p style={{ margin: '6px 0', fontSize: '0.85rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        <strong>Pendidikan:</strong> {alumni.sekolah_lanjutan}
                      </p>
                    )}

                    {alumni.pekerjaan && (
                      <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <strong>Aktivitas:</strong> {alumni.pekerjaan}
                      </p>
                    )}

                    {alumni.pesan_kesan && (
                      <div style={{
                        marginTop: '10px', padding: '10px 12px', borderRadius: '10px',
                        background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.83rem',
                        color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5
                      }}>
                        &ldquo;{alumni.pesan_kesan}&rdquo;
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              Belum ada data alumni yang cocok dengan pencarian atau filter angkatan ini.
            </div>
          )}

        </div>
      </section>
    </>
  );
}
