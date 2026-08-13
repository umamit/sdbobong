'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function TeacherSyncModal({ isOpen, onClose, onSyncSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('json'); // default is JSON
  const [token, setToken] = useState('');
  const [dapodikUrl, setDapodikUrl] = useState('http://localhost:5774');
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedTeachers, setParsedTeachers] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('dapodik_ws_token') || '';
      const storedUrl = localStorage.getItem('dapodik_ws_url') || 'http://localhost:5774';
      setToken(storedToken);
      setDapodikUrl(storedUrl);
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSaveCredentials = (newToken, newUrl) => {
    setToken(newToken);
    setDapodikUrl(newUrl);
    localStorage.setItem('dapodik_ws_token', newToken);
    localStorage.setItem('dapodik_ws_url', newUrl);
  };

  // Natively parse CSV format for GTK
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const header = lines[0];
    let sep = ',';
    if (header.includes(';')) sep = ';';
    else if (header.includes('\t')) sep = '\t';

    const headers = header.split(sep).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(sep).map(c => c.trim().replace(/['"]/g, ''));
      if (cols.length < headers.length) continue;

      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx];
      });
      rows.push(obj);
    }

    return rows.map(r => {
      const namaKey = Object.keys(r).find(k => k.includes('nama') || k === 'name');
      const nipKey = Object.keys(r).find(k => k.includes('nip') || k.includes('nuptk'));
      const ptkKey = Object.keys(r).find(k => k.includes('ptk') || k.includes('jenis') || k.includes('jabatan') || k.includes('role'));
      const kepegawaianKey = Object.keys(r).find(k => k.includes('kepegawaian') || k.includes('status') || k.includes('pegawai'));

      return {
        nama: r[namaKey] || '',
        nip: r[nipKey] || '',
        jenis_ptk: r[ptkKey] || 'Guru Kelas',
        status_kepegawaian: r[kepegawaianKey] || 'PNS / ASN'
      };
    }).filter(t => t.nama);
  };

  const handleParseInput = () => {
    setStatus('idle');
    setErrorMessage('');
    setParsedTeachers([]);

    if (!inputText.trim()) {
      setStatus('error');
      setErrorMessage('Input tidak boleh kosong!');
      return;
    }

    try {
      if (activeTab === 'json') {
        const parsed = JSON.parse(inputText);
        let teacherArray = [];

        if (Array.isArray(parsed)) {
          teacherArray = parsed;
        } else if (parsed.data && Array.isArray(parsed.data)) {
          teacherArray = parsed.data;
        } else if (parsed.rows && Array.isArray(parsed.rows)) {
          teacherArray = parsed.rows;
        } else {
          throw new Error('Format JSON tidak valid. Harus berupa array dewan guru.');
        }

        const mapped = teacherArray.map(t => ({
          nama: t.nama || t.name || '',
          nip: t.nip || t.nuptk || '',
          jenis_ptk: t.jenis_ptk || t.role || 'Guru Kelas',
          status_kepegawaian: t.status_kepegawaian || t.kepegawaian || 'PNS / ASN'
        })).filter(t => t.nama);

        if (mapped.length === 0) {
          throw new Error('Tidak ditemukan data guru valid di dalam JSON.');
        }

        setParsedTeachers(mapped);
        setStatus('success');
      } else {
        const mapped = parseCSV(inputText);
        if (mapped.length === 0) {
          throw new Error('Gagal membaca data CSV GTK. Pastikan kolom header benar.');
        }
        setParsedTeachers(mapped);
        setStatus('success');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Gagal memproses data input.');
    }
  };

  const handleDirectConnect = async () => {
    setStatus('connecting');
    setErrorMessage('');
    setParsedTeachers([]);

    if (!token.trim()) {
      setStatus('error');
      setErrorMessage('Token Web Service Dapodik harus diisi!');
      return;
    }

    const targetUrl = `${dapodikUrl}/dapodik/api/v1/getGtk?token=${token.trim()}`;

    try {
      console.log(`Connecting directly to ${targetUrl}...`);
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      let teacherArray = [];

      if (Array.isArray(data)) {
        teacherArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        teacherArray = data.data;
      } else if (data.rows && Array.isArray(data.rows)) {
        teacherArray = data.rows;
      } else {
        throw new Error('Format Web Service tidak dikenal. Harus mengembalikan array.');
      }

      const mapped = teacherArray.map(t => ({
        nama: t.nama || t.name || '',
        nip: t.nip || t.nuptk || '',
        jenis_ptk: t.jenis_ptk || t.role || 'Guru Kelas',
        status_kepegawaian: t.status_kepegawaian || t.kepegawaian || 'PNS / ASN'
      })).filter(t => t.nama);

      if (mapped.length === 0) {
        throw new Error('Tidak ditemukan data guru aktif di Web Service.');
      }

      setParsedTeachers(mapped);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(
        'Koneksi gagal. Browser memblokir request langsung (CORS/Mixed Content) atau server lokal Dapodik tidak menyala. Gunakan Metode Salin-Tempel JSON GTK di samping!'
      );
    }
  };

  const handleStartSync = async () => {
    if (parsedTeachers.length === 0) return;
    setIsSyncing(true);

    try {
      const response = await fetch('/api/teachers/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teachers: parsedTeachers }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengirim data sinkronisasi ke server.');
      }

      alert(`Sinkronisasi Dewan Guru Berhasil! ${result.count} guru terproses. Jumlah aktif: ${result.activeCount} guru.`);
      if (onSyncSuccess) onSyncSuccess();
      onClose();
    } catch (err) {
      alert(`Gagal Sinkronisasi Guru: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setInputText(evt.target.result);
      setTimeout(() => {
        setStatus('idle');
      }, 100);
    };
    reader.readAsText(file);
  };

  const webServiceTargetUrl = `${dapodikUrl}/dapodik/api/v1/getGtk?token=${token || 'TOKEN_ANDA'}`;

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '650px',
        maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(18, 165, 184, 0.1)', color: '#12A5B8' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Sinkronisasi Guru (GTK) Dapodik</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafb', padding: '0 1rem' }}>
          {[
            { id: 'json', label: 'Salin-Tempel JSON GTK Web Service' },
            { id: 'csv', label: 'Upload CSV Dewan Guru' },
            { id: 'direct', label: 'Koneksi Langsung (Fetch)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatus('idle');
                setParsedTeachers([]);
                setInputText('');
              }}
              style={{
                padding: '0.9rem 1rem',
                border: 'none',
                background: 'none',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#12A5B8' : '#64748b',
                borderBottom: activeTab === tab.id ? '2.5px solid #12A5B8' : 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {activeTab === 'json' && (
            <>
              <div style={{ backgroundColor: 'rgba(18, 165, 184, 0.05)', border: '1px solid rgba(18, 165, 184, 0.15)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#0e707d', lineHeight: '1.5' }}>
                <strong>Cara Sinkronisasi GTK Bebas CORS:</strong><br />
                1. Klik tombol di bawah untuk membuka endpoint Web Service GTK lokal Anda di tab baru.<br />
                2. Copy seluruh data teks JSON dewan guru yang muncul (Ctrl+A kemudian Ctrl+C).<br />
                3. Paste (tempelkan) hasilnya di kotak teks di bawah, lalu klik **Proses Data**.
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Dapodik Server IP/Port</label>
                  <input 
                    type="text" 
                    value={dapodikUrl} 
                    onChange={(e) => handleSaveCredentials(token, e.target.value)}
                    className="form-control" 
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Dapodik Token</label>
                  <input 
                    type="password" 
                    placeholder="Masukkan token Web Service..." 
                    value={token}
                    onChange={(e) => handleSaveCredentials(e.target.value, dapodikUrl)}
                    className="form-control" 
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  />
                </div>
                <a 
                  href={webServiceTargetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-end', padding: '7px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', gap: '4px', alignItems: 'center' }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                  Buka Data GTK
                </a>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tempel Output JSON GTK</label>
                <textarea
                  placeholder="Tempel data JSON guru di sini..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ width: '100%', height: '140px', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.75rem', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                onClick={handleParseInput}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                Proses Data JSON Guru
              </button>
            </>
          )}

          {activeTab === 'csv' && (
            <>
              <div style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
                <strong>Import CSV GTK:</strong> Ekspor data GTK dari Dapodik lokal ke file CSV. Pastikan kolom memuat judul header seperti: <code>nama</code>, <code>nip</code>/<code>nuptk</code>, <code>jenis_ptk</code>/<code>role</code>, dan <code>status_kepegawaian</code>.
              </div>

              <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafb', cursor: 'pointer', position: 'relative' }}>
                <input 
                  type="file" 
                  accept=".csv,.txt" 
                  onChange={handleFileUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#64748b" strokeWidth="2" style={{ marginBottom: '8px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Pilih file CSV Guru Anda</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>atau seret file ke sini</span>
              </div>

              {inputText && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Pratinjau Data Mentah</label>
                  <textarea
                    readOnly
                    value={inputText.substring(0, 800) + (inputText.length > 800 ? '...\n[Data terpotong untuk pratinjau]' : '')}
                    style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.75rem', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
                  />
                </div>
              )}

              <button 
                onClick={handleParseInput}
                disabled={!inputText}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                Proses Data CSV Guru
              </button>
            </>
          )}

          {activeTab === 'direct' && (
            <>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#b45309', lineHeight: '1.5' }}>
                <strong>Koneksi Langsung Web Service GTK:</strong> Tarik data guru secara otomatis langsung dari browser Anda ke komputer lokal Dapodik. Jika diblokir CORS, gunakan **Tab Salin-Tempel JSON** di tab pertama.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>IP/Domain & Port Dapodik</label>
                  <input 
                    type="text" 
                    value={dapodikUrl} 
                    onChange={(e) => handleSaveCredentials(token, e.target.value)}
                    className="form-control" 
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Token Web Service GTK</label>
                  <input 
                    type="password" 
                    placeholder="Masukkan token..." 
                    value={token}
                    onChange={(e) => handleSaveCredentials(e.target.value, dapodikUrl)}
                    className="form-control" 
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <button 
                onClick={handleDirectConnect}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                </svg>
                Tarik Data Guru dari Dapodik
              </button>
            </>
          )}

          {status === 'connecting' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem', color: '#12A5B8', fontSize: '0.85rem', fontWeight: 600 }}>
              <span className="pulse-dot green"></span> Menghubungkan ke Web Service GTK Dapodik...
            </div>
          )}

          {status === 'error' && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                Data Berhasil Diproses! Terdeteksi {parsedTeachers.length} guru/staff siap disinkronisasikan.
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px 10px' }}>Nama Lengkap</th>
                      <th style={{ padding: '8px 10px' }}>NIP / NUPTK</th>
                      <th style={{ padding: '8px 10px' }}>Peran / Jabatan</th>
                      <th style={{ padding: '8px 10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTeachers.slice(0, 10).map((t, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{t.nama}</td>
                        <td style={{ padding: '8px 10px' }}>{t.nip || '-'}</td>
                        <td style={{ padding: '8px 10px' }}>{t.jenis_ptk}</td>
                        <td style={{ padding: '8px 10px' }}>{t.status_kepegawaian}</td>
                      </tr>
                    ))}
                    {parsedTeachers.length > 10 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', fontStyle: 'italic', backgroundColor: '#fafafb' }}>
                          Dan {parsedTeachers.length - 10} guru lainnya...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          backgroundColor: '#fafafb'
        }}>
          <button 
            onClick={onClose} 
            disabled={isSyncing}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          >
            Batal
          </button>
          <button 
            onClick={handleStartSync}
            disabled={parsedTeachers.length === 0 || isSyncing}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isSyncing ? (
              <>
                <span className="pulse-dot green"></span> Menyimpan...
              </>
            ) : (
              <>
                Mulai Sinkronisasi Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
