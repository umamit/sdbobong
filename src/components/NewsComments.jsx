'use client';

import { useState, useEffect, useCallback } from 'react';

// Format tanggal ISO ke "26 Jul 2026, 21:00"
function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

// Captcha aritmetika sederhana
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

export default function NewsComments({ newsId }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/comments?news_id=${newsId}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      // silent
    } finally {
      setLoadingComments(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi captcha
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError('Jawaban verifikasi salah. Silakan coba lagi.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/news/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news_id: newsId, nama: nama.trim(), pesan: pesan.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim komentar.');
        return;
      }

      // Optimistic prepend
      setComments((prev) => [data.comment, ...prev]);
      setNama('');
      setPesan('');
      setCaptchaInput('');
      setCaptcha(generateCaptcha());
      setSuccess(true);
      setShowForm(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.9rem',
    color: 'var(--text-color)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    background: 'white',
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>

      {/* Header baris komentar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Komentar
          {comments.length > 0 && (
            <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem' }}>
              {comments.length}
            </span>
          )}
        </span>

        {!showForm && (
          <button
            type="button"
            onClick={() => { setShowForm(true); setSuccess(false); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1.5px solid var(--primary)',
              background: 'transparent',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tulis Komentar
          </button>
        )}
      </div>

      {/* Pesan sukses */}
      {success && (
        <div style={{
          padding: '10px 14px', borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.1)', border: '1.5px solid rgba(16,185,129,0.25)',
          color: '#065f46', fontSize: '0.85rem', marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Komentar Anda berhasil dikirim!
        </div>
      )}

      {/* Form Komentar */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#f8fafc',
            border: '1.5px solid var(--border-color)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Nama */}
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                Nama Anda *
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Mis: Budi Santoso"
                maxLength={80}
                required
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(18, 165, 184, 0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Captcha */}
            <div style={{ minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                Verifikasi: {captcha.a} + {captcha.b} = ?
              </label>
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Jawaban"
                required
                style={{ ...inputStyle, width: '120px' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(18, 165, 184, 0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Pesan */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
              Komentar * <span style={{ fontWeight: 400, fontSize: '0.72rem' }}>({pesan.length}/500)</span>
            </label>
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Tulis komentar atau tanggapan Anda di sini..."
              rows={3}
              maxLength={500}
              required
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(18, 165, 184, 0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}

          {/* Tombol */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(''); }}
              style={{
                padding: '7px 16px', borderRadius: '8px', border: '1.5px solid var(--border-color)',
                background: 'white', color: 'var(--text-muted)', fontSize: '0.85rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '7px 18px', borderRadius: '8px', border: 'none',
                background: submitting ? '#94a3b8' : 'var(--primary)',
                color: 'white', fontSize: '0.85rem', fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Kirim
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Daftar Komentar */}
      {loadingComments ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>
          Belum ada komentar. Jadilah yang pertama!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--primary)', color: 'white',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {c.nama.charAt(0).toUpperCase()}
                  </span>
                  {c.nama}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-color)', lineHeight: 1.6 }}>
                {c.pesan}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Inline spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
