'use client';

import { useState, useEffect } from 'react';
import { submitMessageAction } from '../actions/messages';

export default function BukuTamuClient({ initialApprovedMessages }) {
  const [activeTab, setActiveTab] = useState('buku-tamu'); // 'buku-tamu' or 'saran'
  
  // CAPTCHA State
  const [captchaChallenge, setCaptchaChallenge] = useState({ numA: 0, numB: 0, answer: 0 });
  const [gtAnswer, setGtAnswer] = useState('');
  const [srAnswer, setSrAnswer] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaChallenge({ numA: a, numB: b, answer: a + b });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Guest Book State
  const [gtName, setGtName] = useState('');
  const [gtRole, setGtRole] = useState('Alumni');
  const [gtMessage, setGtMessage] = useState('');
  const [gtWebsiteUrl, setGtWebsiteUrl] = useState('');
  const [gtStatus, setGtStatus] = useState({ type: '', text: '' }); // { type: 'success'|'error', text: '' }

  // Feedback/Saran State
  const [srName, setSrName] = useState('');
  const [srRole, setSrRole] = useState('Wali Murid');
  const [srMessage, setSrMessage] = useState('');
  const [srWebsiteUrl, setSrWebsiteUrl] = useState('');
  const [srStatus, setSrStatus] = useState({ type: '', text: '' });

  const roles = ['Alumni', 'Wali Murid', 'Masyarakat', 'Siswa'];

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    setGtStatus({ type: 'loading', text: 'Mengirim pesan Anda...' });

    if (parseInt(gtAnswer, 10) !== captchaChallenge.answer) {
      setGtStatus({ type: 'error', text: 'Jawaban verifikasi keamanan (CAPTCHA) salah! Silakan coba lagi.' });
      generateCaptcha();
      setGtAnswer('');
      return;
    }

    try {
      const res = await submitMessageAction({
        name: gtName,
        role: gtRole,
        type: 'guestbook',
        message: gtMessage,
        website_url: gtWebsiteUrl
      });

      if (res.error) throw new Error(res.error);

      setGtStatus({
        type: 'success',
        text: 'Kesan & pesan Anda berhasil dikirim! Pesan Anda akan muncul di halaman ini setelah ditinjau dan disetujui oleh admin sekolah.'
      });
      setGtName('');
      setGtMessage('');
      setGtWebsiteUrl('');
      setGtAnswer('');
      generateCaptcha();
    } catch (err) {
      setGtStatus({ type: 'error', text: err.message });
      generateCaptcha();
      setGtAnswer('');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSrStatus({ type: 'loading', text: 'Mengirim saran Anda...' });

    if (parseInt(srAnswer, 10) !== captchaChallenge.answer) {
      setSrStatus({ type: 'error', text: 'Jawaban verifikasi keamanan (CAPTCHA) salah! Silakan coba lagi.' });
      generateCaptcha();
      setSrAnswer('');
      return;
    }

    try {
      const res = await submitMessageAction({
        name: srName,
        role: srRole,
        type: 'feedback',
        message: srMessage,
        website_url: srWebsiteUrl
      });

      if (res.error) throw new Error(res.error);

      setSrStatus({
        type: 'success',
        text: 'Saran Anda berhasil terkirim langsung secara privat ke Kotak Masuk Admin. Terima kasih atas masukan konstruktif Anda untuk kemajuan SDN Bobong!'
      });
      setSrName('');
      setSrMessage('');
      setSrWebsiteUrl('');
      setSrAnswer('');
      generateCaptcha();
    } catch (err) {
      setSrStatus({ type: 'error', text: err.message });
      generateCaptcha();
      setSrAnswer('');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Alumni': return '#3b82f6';
      case 'Wali Murid': return '#10b981';
      case 'Siswa': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)' }}>
      <div className="grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
        
        {/* Left Column: Interactive Tabbed Form */}
        <div>
          {/* Tab Selector */}
          <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: 'var(--space-md)' }}>
            <button
              onClick={() => setActiveTab('buku-tamu')}
              style={{
                flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'buku-tamu' ? 'var(--primary-color)' : 'white',
                color: activeTab === 'buku-tamu' ? 'white' : 'var(--text-color)'
              }}
            >
              📝 Isi Buku Tamu
            </button>
            <button
              onClick={() => setActiveTab('saran')}
              style={{
                flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'saran' ? 'var(--primary-color)' : 'white',
                color: activeTab === 'saran' ? 'white' : 'var(--text-color)'
              }}
            >
              🔒 Kotak Saran Privat
            </button>
          </div>

          {/* Guestbook Form */}
          {activeTab === 'buku-tamu' && (
            <div className="card-custom" style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '4px' }}>Tulis Kesan & Pesan</h2>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
                Bagikan pengalaman, kenangan, atau pesan motivasi Anda untuk guru, siswa, dan kerabat SDN Bobong.
              </p>

              {gtStatus.text && (
                <div 
                  style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: 'var(--space-md)',
                    fontSize: '0.9rem',
                    backgroundColor: gtStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : gtStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: gtStatus.type === 'success' ? '#047857' : gtStatus.type === 'error' ? '#b91c1c' : '#1d4ed8',
                    border: `1px solid ${gtStatus.type === 'success' ? '#10b981' : gtStatus.type === 'error' ? '#ef4444' : '#3b82f6'}`
                  }}
                >
                  {gtStatus.text}
                </div>
              )}

              <form onSubmit={handleGuestbookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {/* Honeypot field (hidden from real users to trap spam bots) */}
                <input
                  type="text"
                  name="website_url"
                  value={gtWebsiteUrl}
                  onChange={(e) => setGtWebsiteUrl(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={gtName}
                    onChange={(e) => setGtName(e.target.value)}
                    placeholder="Contoh: Husnita Usman"
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Kategori Pengirim</label>
                  <select
                    value={gtRole}
                    onChange={(e) => setGtRole(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Kesan & Pesan</label>
                  <textarea
                    required
                    rows="4"
                    value={gtMessage}
                    onChange={(e) => setGtMessage(e.target.value)}
                    placeholder="Tuliskan kesan atau pesan penyemangat Anda di sini..."
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  ></textarea>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>
                    Verifikasi Keamanan: Berapakah {captchaChallenge.numA} + {captchaChallenge.numB}?
                  </label>
                  <input
                    type="number"
                    required
                    value={gtAnswer}
                    onChange={(e) => setGtAnswer(e.target.value)}
                    placeholder="Ketik jawaban angka..."
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={gtStatus.type === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {gtStatus.type === 'loading' ? (
                    <span className="btn-loading-container">
                      <span className="btn-spinner"></span>
                      Mengirim Kesan & Pesan...
                    </span>
                  ) : (
                    'Kirim Buku Tamu'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Private Feedback Form */}
          {activeTab === 'saran' && (
            <div className="card-custom" style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '4px' }}>Kotak Saran Privat</h2>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
                Kirimkan saran, kritik, atau aduan langsung ke manajemen SDN Bobong secara privat (hanya bisa dibaca oleh admin/sekolah).
              </p>

              {srStatus.text && (
                <div 
                  style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: 'var(--space-md)',
                    fontSize: '0.9rem',
                    backgroundColor: srStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : srStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: srStatus.type === 'success' ? '#047857' : srStatus.type === 'error' ? '#b91c1c' : '#1d4ed8',
                    border: `1px solid ${srStatus.type === 'success' ? '#10b981' : srStatus.type === 'error' ? '#ef4444' : '#3b82f6'}`
                  }}
                >
                  {srStatus.text}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {/* Honeypot field (hidden from real users to trap spam bots) */}
                <input
                  type="text"
                  name="website_url"
                  value={srWebsiteUrl}
                  onChange={(e) => setSrWebsiteUrl(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Nama Pengirim (Bisa Anonim)</label>
                  <input
                    type="text"
                    value={srName}
                    onChange={(e) => setSrName(e.target.value)}
                    placeholder="Ketik nama atau kosongkan untuk anonim..."
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Kategori Anda</label>
                  <select
                    value={srRole}
                    onChange={(e) => setSrRole(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Saran Konstruktif Anda</label>
                  <textarea
                    required
                    rows="4"
                    value={srMessage}
                    onChange={(e) => setSrMessage(e.target.value)}
                    placeholder="Sampaikan masukan, usulan fasilitas, kurikulum, atau kritik membangun Anda..."
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  ></textarea>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>
                    Verifikasi Keamanan: Berapakah {captchaChallenge.numA} + {captchaChallenge.numB}?
                  </label>
                  <input
                    type="number"
                    required
                    value={srAnswer}
                    onChange={(e) => setSrAnswer(e.target.value)}
                    placeholder="Ketik jawaban angka..."
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={srStatus.type === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {srStatus.type === 'loading' ? (
                    <span className="btn-loading-container">
                      <span className="btn-spinner"></span>
                      Mengirim Saran Privat...
                    </span>
                  ) : (
                    'Kirim Saran Privat'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Public approved Guestbook messages */}
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: 'var(--space-sm)' }}>
            Kesan & Pesan Pengunjung ({initialApprovedMessages.length})
          </h2>

          {initialApprovedMessages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
              {initialApprovedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="card-custom"
                  style={{
                    padding: 'var(--space-md)',
                    background: 'white',
                    borderLeft: `4px solid ${getRoleBadgeColor(msg.role)}`,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                    <div>
                      <h4 style={{ margin: '0', fontSize: '1.05rem', color: 'var(--text-color)' }}>{msg.name}</h4>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'white', 
                          backgroundColor: getRoleBadgeColor(msg.role),
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginTop: '2px'
                        }}
                      >
                        {msg.role}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      {msg.date ? new Date(msg.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0', fontSize: '0.95rem', color: '#555', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{msg.message}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-custom" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: '#666', background: 'white' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Buku tamu masih kosong</p>
              <p style={{ fontSize: '0.9rem' }}>Jadilah yang pertama menuliskan kesan & pesan Anda tentang SD Negeri Bobong!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
