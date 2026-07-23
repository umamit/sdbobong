'use client';

import { useState } from 'react';
import { formatTanggal } from '../../lib/format';

export default function GradesClient() {
  const [nisn, setNisn] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!nisn.trim() || !birthDate.trim()) return;

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const res = await fetch(`/api/students/grades?nisn=${nisn.trim()}&birth_date=${birthDate.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat nilai siswa.");
      }

      setStudent(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (grades) => {
    if (!grades) return 0;
    const values = Object.values(grades).map(v => parseFloat(v) || 0);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(1);
  };

  const getPredikat = (score) => {
    const s = parseFloat(score);
    if (s >= 85) return { text: 'Sangat Baik (A)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (s >= 75) return { text: 'Baik (B)', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
    if (s >= 60) return { text: 'Cukup (C)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    return { text: 'Perlu Bimbingan (D)', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const getProgressBarColor = (score) => {
    const s = parseFloat(score) || 0;
    if (s >= 85) return '#10b981'; // Green
    if (s >= 75) return '#3b82f6'; // Blue
    if (s >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const subjects = [
    { key: 'ppkn', label: 'Pendidikan Pancasila' },
    { key: 'indonesia', label: 'Bahasa Indonesia' },
    { key: 'matematika', label: 'Matematika' },
    { key: 'ipas', label: 'IPAS (Ilmu Pengetahuan Alam & Sosial)' },
    { key: 'seni', label: 'Seni Budaya' },
    { key: 'pjok', label: 'PJOK' },
    { key: 'inggris', label: 'Bahasa Inggris' },
    { key: 'agama', label: 'Pendidikan Agama & Budi Pekerti' },
    { key: 'mulok', label: 'Muatan Lokal' }
  ];

  const averageScore = student && student.grades ? calculateAverage(student.grades) : 0;
  const predicate = getPredikat(averageScore);

  const hasGradesInputted = student && student.grades && Object.values(student.grades).some(v => v !== null && v !== '');

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)', position: 'relative' }}>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .card-print {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .grade-progress-bg {
            display: none !important;
          }
        }
      `}</style>

      {/* Query Search Panel */}
      <div 
        className="card-custom no-print" 
        style={{ 
          maxWidth: '600px', 
          margin: '0 auto var(--space-lg)', 
          padding: 'var(--space-md)',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '8px' }}>Cek Nilai Rapor Digital</h2>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
          Masukkan Nomor Induk Siswa Nasional (NISN) dan Tanggal Lahir untuk memverifikasi dan melihat rapor belajar siswa.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left' }}>
            <div>
              <label htmlFor="nisn" style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#444' }}>NISN Siswa (10 digit)</label>
              <input
                id="nisn"
                type="text"
                maxLength={10}
                value={nisn}
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="Contoh: 0142987162"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label htmlFor="birthDate" style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#444' }}>Tanggal Lahir Siswa</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%'
            }}
          >
            {loading ? 'Memeriksa Data...' : '🔍 Periksa Rapor'}
          </button>
        </form>

        {error && (
          <div 
            style={{ 
              marginTop: 'var(--space-sm)',
              padding: '10px 16px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#b91c1c', 
              fontSize: '0.9rem',
              border: '1px solid #ef4444',
              textAlign: 'left'
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Rapor Digital Output Sheet */}
      {student && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {hasGradesInputted ? (
            <div 
              className="card-custom card-print"
              style={{
                padding: 'var(--space-lg) var(--space-md)',
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}
            >
              {/* Print Action Header (no-print) */}
              <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  🖨️ Cetak Rapor Digital
                </button>
              </div>

              {/* Official Kop Surat */}
              <div style={{ textAlign: 'center', borderBottom: '3px double #333', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <img src="/images/kabupaten_logo.png" alt="Logo Kab" style={{ height: '70px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#111' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h4>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#111' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>SD NEGERI BOBONG</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', fontStyle: 'italic' }}>Alamat: Jalan Raya Bobong, Ibu Kota Kab. Pulau Taliabu, Maluku Utara</p>
                  </div>
                  <img src="/images/logo_sekolah.png" alt="Logo Sekolah" style={{ height: '70px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ margin: '0', color: '#111', fontWeight: 700, letterSpacing: '0.5px' }}>LAPORAN HASIL BELAJAR (RAPOR DIGITAL)</h3>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#555' }}>Kurikulum Merdeka - Fase Akademik Dasar</p>
              </div>

              {/* Student Metadata */}
              <div 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: 'var(--space-sm) var(--space-md)',
                  marginBottom: 'var(--space-md)',
                  backgroundColor: '#f8fafc'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: '#1e293b' }}>
                  <div>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '40%', padding: '4px 0' }}><strong>Nama Siswa</strong></td>
                          <td style={{ width: '5%' }}>:</td>
                          <td><strong>{student.name}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 0' }}><strong>NISN / NIS</strong></td>
                          <td>:</td>
                          <td>{student.nisn} / {student.nis}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 0' }}><strong>Kelas</strong></td>
                          <td>:</td>
                          <td>Kelas {student.class} (Enam)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '40%', padding: '4px 0' }}><strong>Jenis Kelamin</strong></td>
                          <td style={{ width: '5%' }}>:</td>
                          <td>{student.gender}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 0' }}><strong>Tempat, Tgl Lahir</strong></td>
                          <td>:</td>
                          <td>{student.birth_place}, {student.birth_date ? formatTanggal(student.birth_date) : ''}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 0' }}><strong>Status Sekolah</strong></td>
                          <td>:</td>
                          <td>
                            <span style={{ color: student.status === 'Aktif' ? '#16a34a' : '#2563eb', fontWeight: 600 }}>
                              {student.status || 'Aktif'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'var(--space-md)', color: '#1e293b', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 10px', textAlign: 'center', width: '8%', borderRight: '1px solid #cbd5e1' }}>No</th>
                    <th style={{ padding: '12px 10px', textAlign: 'left', width: '47%', borderRight: '1px solid #cbd5e1' }}>Mata Pelajaran</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', width: '15%', borderRight: '1px solid #cbd5e1' }}>Nilai Angka</th>
                    <th style={{ padding: '12px 10px', textAlign: 'left', width: '30%' }}>Predikat & Ketercapaian</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, index) => {
                    const score = student.grades[sub.key];
                    const gradeDetail = getPredikat(score);
                    const parsedScore = parseFloat(score) || 0;
                    return (
                      <tr key={sub.key} style={{ borderBottom: '1px solid #e2e8f0', height: '45px' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>{index + 1}</td>
                        <td style={{ padding: '8px 10px', borderRight: '1px solid #e2e8f0' }}>
                          <div><strong>{sub.label}</strong></div>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span>{score || '0'}</span>
                            <div className="grade-progress-bg" style={{ width: '80%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${parsedScore}%`, height: '100%', backgroundColor: getProgressBarColor(parsedScore) }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ 
                            color: score ? gradeDetail.color : '#94a3b8', 
                            fontWeight: 600, 
                            fontSize: '0.8rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: score ? gradeDetail.bg : 'transparent',
                            display: 'inline-block'
                          }}>
                            {score ? gradeDetail.text : 'Belum diisi'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary Score Panel */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  border: '2px solid #cbd5e1', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  marginBottom: 'var(--space-lg)'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>RATA-RATA NILAI</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Berdasarkan seluruh mata pelajaran Kurikulum Merdeka</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ margin: 0, fontSize: '2.5rem', color: predicate.color, fontWeight: '800' }}>{averageScore}</h1>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: predicate.color, padding: '2px 8px', borderRadius: '4px', backgroundColor: predicate.bg }}>
                    PREDIKAT: {predicate.text}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#111' }}>
                  <p style={{ margin: '0 0 65px' }}>Orang Tua/Wali Siswa,</p>
                  <p style={{ margin: '0' }}>..........................................</p>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#111' }}>
                  <p style={{ margin: '0' }}>Bobong, {formatTanggal(new Date())}</p>
                  <p style={{ margin: '0 0 65px' }}>Wali Kelas,</p>
                  <p style={{ margin: '0', textDecoration: 'underline' }}>..........................................</p>
                  <p style={{ margin: '0', fontSize: '0.8rem', color: '#444' }}>NIP. ..........................................</p>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="card-custom"
              style={{
                padding: 'var(--space-lg)',
                textAlign: 'center',
                border: '4px solid #f59e0b',
                background: 'white'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-sm)' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h2 style={{ color: '#d97706', marginBottom: '8px' }}>Rapor Belum Dipublikasikan</h2>
              <p style={{ color: '#555', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                Halo <strong>{student.name}</strong>, nilai rapor Anda belum dimasukkan atau belum dipublikasikan oleh administrator sekolah. Silakan hubungi wali kelas Anda untuk informasi hasil belajar secara manual.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
