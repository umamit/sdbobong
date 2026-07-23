'use client';

import { useState, useEffect } from 'react';
import { formatTanggal } from '../../lib/format';

export default function GraduationClient() {
  const [query, setQuery] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Generate confetti particles on graduation success
  useEffect(() => {
    if (student && student.status?.toUpperCase() === 'LULUS') {
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];
      const particles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: `${Math.random() * 8 + 6}px`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 3 + 2}s`
      }));
      setConfetti(particles);
    } else {
      setConfetti([]);
    }
  }, [student]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      // Determine if query looks like NISN (10 digits) or exam number
      let url = '/api/graduation?';
      if (/^\d+$/.test(query.trim())) {
        url += `nisn=${query.trim()}`;
      } else {
        url += `no_peserta=${query.trim()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat hasil kelulusan.");
      }

      setStudent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)', position: 'relative' }}>
      
      {/* CSS Confetti Fall Overlay */}
      {student && student.status?.toUpperCase() === 'LULUS' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
          <style>{`
            @keyframes fall {
              0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
          {confetti.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: '-20px',
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `fall ${p.duration} linear infinite`,
                animationDelay: p.delay,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      )}

      {/* Query Search Panel */}
      <div 
        className="card-custom" 
        style={{ 
          maxWidth: '600px', 
          margin: '0 auto var(--space-lg)', 
          padding: 'var(--space-md)',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '8px' }}>Cek Status Kelulusan Anda</h2>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
          Masukkan Nomor Induk Siswa Nasional (NISN) atau Nomor Peserta Ujian Anda untuk melihat hasil kelulusan resmi.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            placeholder="Ketik NISN (10 digit) atau No Peserta Ujian..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Memeriksa...' : 'Cari'}
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
              border: '1px solid #ef4444'
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Graduation Results Letter/Certificate */}
      {student && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {student.status?.toUpperCase() === 'LULUS' ? (
            <div 
              className="card-custom"
              style={{
                padding: 'var(--space-lg) var(--space-md)',
                background: 'white',
                border: '10px solid #10b981',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative Ribbon/Star badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px dashed #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(-15deg)',
                color: '#f59e0b',
                fontWeight: '800',
                fontSize: '1.2rem',
                backgroundColor: 'rgba(245, 158, 11, 0.05)'
              }}>
                LULUS ⭐
              </div>

              {/* Official Letterhead (KOP SURAT) */}
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

              {/* Letter Title */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ margin: '0', textDecoration: 'underline', color: '#111' }}>SURAT KEPUTUSAN KELULUSAN</h3>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Nomor: {student.sk_number}</p>
              </div>

              {/* Letter Opener */}
              <p style={{ color: '#333', lineHeight: '1.6', marginBottom: 'var(--space-sm)' }}>
                Kepala Sekolah, SD Negeri Bobong, berdasarkan kriteria kelulusan dan hasil rapat dewan pendidik tentang penentuan kelulusan siswa kelas VI Tahun Ajaran 2025/2026 tanggal 15 Juni 2026, menetapkan bahwa:
              </p>

              {/* Student Details Box */}
              <div 
                style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.03)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: 'var(--space-sm) var(--space-md)',
                  marginBottom: 'var(--space-md)' 
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.05rem', color: '#111' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '35%', padding: '6px 0' }}><strong>NAMA LENGKAP</strong></td>
                      <td style={{ width: '5%', padding: '6px 0' }}>:</td>
                      <td style={{ padding: '6px 0', letterSpacing: '0.5px' }}><strong>{student.name}</strong></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0' }}><strong>NISN</strong></td>
                      <td>:</td>
                      <td style={{ padding: '6px 0' }}>{student.nisn}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0' }}><strong>NO. PESERTA UJIAN</strong></td>
                      <td>:</td>
                      <td style={{ padding: '6px 0' }}>{student.no_peserta}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0' }}><strong>TEMPAT, TGL LAHIR</strong></td>
                      <td>:</td>
                      <td style={{ padding: '6px 0' }}>{student.birth_place}, {student.birth_date ? formatTanggal(student.birth_date) : ''}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0' }}><strong>NAMA ORANG TUA / WALI</strong></td>
                      <td>:</td>
                      <td style={{ padding: '6px 0' }}>{student.parent_name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Decision Statement */}
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: 'var(--space-sm)', 
                  border: '2px solid #10b981', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  marginBottom: 'var(--space-md)'
                }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 'bold', color: '#047857' }}>DINYATAKAN:</p>
                <h1 style={{ margin: '0', fontSize: '2.5rem', color: '#047857', fontWeight: '800', letterSpacing: '1.5px' }}>LULUS</h1>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#065f46' }}>Dari Satuan Pendidikan SD Negeri Bobong Tahun Ajaran 2025/2026</p>
              </div>

              {/* Letter Footer/Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                <div />
                <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#111' }}>
                  <p style={{ margin: '0' }}>Bobong, 15 Juni 2026</p>
                  <p style={{ margin: '0 0 60px' }}><strong>Kepala Sekolah, SD Negeri Bobong,</strong></p>
                  <p style={{ margin: '0', textDecoration: 'underline' }}><strong>KASMUDIN, S.Pd.SD</strong></p>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#444' }}>NIP. 19780112 200801 1 015</p>
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
              <h2 style={{ color: '#d97706', marginBottom: '8px' }}>Status Belum Dipublikasikan</h2>
              <p style={{ color: '#555', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto var(--space-md)' }}>
                Halo <strong>{student.name}</strong>, status kelulusan Anda saat ini belum dipublikasikan secara mandiri di portal website. Silakan hubungi wali kelas Anda atau datang langsung ke sekolah untuk mendapatkan informasi kelulusan resmi.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
