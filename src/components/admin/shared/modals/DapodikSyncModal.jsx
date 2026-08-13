'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function DapodikSyncModal({ isOpen, onClose, onSyncSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('json'); // default is JSON (pasted Web Service)
  const [token, setToken] = useState('');
  const [dapodikUrl, setDapodikUrl] = useState('http://localhost:5774');
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load stored credentials from localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('dapodik_ws_token') || '';
      const storedUrl = localStorage.getItem('dapodik_ws_url') || 'http://localhost:5774';
      setToken(storedToken);
      setDapodikUrl(storedUrl);
    }
  }, []);

  if (!isOpen || !mounted) return null;

  // Store credentials to localStorage on change
  const handleSaveCredentials = (newToken, newUrl) => {
    setToken(newToken);
    setDapodikUrl(newUrl);
    localStorage.setItem('dapodik_ws_token', newToken);
    localStorage.setItem('dapodik_ws_url', newUrl);
  };

  // Natively parse CSV format
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    // Auto-detect separator: comma, semicolon, or tab
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
      const nisnKey = Object.keys(r).find(k => k.includes('nisn'));
      const nisKey = Object.keys(r).find(k => k.includes('nis') || k.includes('nipd') || k.includes('no_induk'));
      const jkKey = Object.keys(r).find(k => k.includes('jk') || k.includes('jenis_kelamin') || k.includes('sex') || k.includes('gender'));
      const tmpLahirKey = Object.keys(r).find(k => k.includes('tempat') || k.includes('lahir_tempat') || k.includes('tmp_lahir'));
      const tglLahirKey = Object.keys(r).find(k => k.includes('tanggal') || k.includes('lahir_tanggal') || k.includes('tgl_lahir'));
      const alamatKey = Object.keys(r).find(k => k.includes('alamat') || k.includes('jalan') || k.includes('domisili'));
      const rombelKey = Object.keys(r).find(k => k.includes('rombel') || k.includes('kelas') || k.includes('class'));
      const parentKey = Object.keys(r).find(k => k.includes('ibu') || k.includes('ayah') || k.includes('orang_tua') || k.includes('ortu'));

      return {
        nama: r[namaKey] || '',
        nisn: r[nisnKey] || '',
        nis: r[nisKey] || '',
        jk: r[jkKey] || '',
        tempat_lahir: r[tmpLahirKey] || '',
        tanggal_lahir: r[tglLahirKey] || '',
        alamat_jalan: r[alamatKey] || '',
        rombel: r[rombelKey] || '',
        nama_ibu_kandung: r[parentKey] || ''
      };
    }).filter(s => s.nama);
  };

  const handleParseInput = () => {
    setStatus('idle');
    setErrorMessage('');
    setParsedStudents([]);

    if (!inputText.trim()) {
      setStatus('error');
      setErrorMessage('Input tidak boleh kosong!');
      return;
    }

    try {
      if (activeTab === 'json') {
        const parsed = JSON.parse(inputText);
        let studentArray = [];

        if (Array.isArray(parsed)) {
          studentArray = parsed;
        } else if (parsed.data && Array.isArray(parsed.data)) {
          studentArray = parsed.data;
        } else if (parsed.rows && Array.isArray(parsed.rows)) {
          studentArray = parsed.rows;
        } else {
          throw new Error('Format JSON tidak valid. Harus berupa array siswa atau memiliki properti array "data"/"rows".');
        }

        const mapped = studentArray.map(s => ({
          nama: s.nama || s.name || '',
          nisn: s.nisn || '',
          nis: s.nipd || s.nis || '',
          jk: s.jk || s.gender || '',
          tempat_lahir: s.tempat_lahir || s.birth_place || '',
          tanggal_lahir: s.tanggal_lahir || s.birth_date || '',
          alamat_jalan: s.alamat_jalan || s.address || '',
          rombel: s.rombel || s.class || '',
          nama_ibu_kandung: s.nama_ibu_kandung || s.parent_name || s.nama_ayah || ''
        })).filter(s => s.nama);

        if (mapped.length === 0) {
          throw new Error('Tidak ditemukan data siswa valid di dalam JSON.');
        }

        setParsedStudents(mapped);
        setStatus('success');
      } else {
        // Parse CSV
        const mapped = parseCSV(inputText);
        if (mapped.length === 0) {
          throw new Error('Gagal membaca data CSV. Pastikan kolom header benar.');
        }
        setParsedStudents(mapped);
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
    setParsedStudents([]);

    if (!token.trim()) {
      setStatus('error');
      setErrorMessage('Token Web Service Dapodik harus diisi!');
      return;
    }

    const targetUrl = `${dapodikUrl}/dapodik/api/v1/getSiswa?token=${token.trim()}`;

    try {
      console.log(`Connecting directly to ${targetUrl}...`);
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      let studentArray = [];

      if (Array.isArray(data)) {
        studentArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        studentArray = data.data;
      } else if (data.rows && Array.isArray(data.rows)) {
        studentArray = data.rows;
      } else {
        throw new Error('Format Web Service tidak dikenal. Harus mengembalikan array.');
      }

      const mapped = studentArray.map(s => ({
        nama: s.nama || s.name || '',
        nisn: s.nisn || '',
        nis: s.nipd || s.nis || '',
        jk: s.jk || s.gender || '',
        tempat_lahir: s.tempat_lahir || s.birth_place || '',
        tanggal_lahir: s.tanggal_lahir || s.birth_date || '',
        alamat_jalan: s.alamat_jalan || s.address || '',
        rombel: s.rombel || s.class || '',
        nama_ibu_kandung: s.nama_ibu_kandung || s.parent_name || s.nama_ayah || ''
      })).filter(s => s.nama);

      if (mapped.length === 0) {
        throw new Error('Tidak ditemukan data siswa aktif di Web Service.');
      }

      setParsedStudents(mapped);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(
        'Koneksi gagal. Browser memblokir request langsung (CORS/Mixed Content) atau server lokal Dapodik tidak menyala. Gunakan Metode Salin-Tempel JSON di samping!'
      );
    }
  };

  const handleStartSync = async () => {
    if (parsedStudents.length === 0) return;
    setIsSyncing(true);

    try {
      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: parsedStudents }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengirim data sinkronisasi ke server.');
      }

      // Success
      alert(`Sinkronisasi Berhasil! ${result.count} siswa terproses. Jumlah aktif: ${result.activeCount} siswa.`);
      if (onSyncSuccess) onSyncSuccess();
      onClose();
    } catch (err) {
      alert(`Gagal Sinkronisasi: ${err.message}`);
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
      // Automatically trigger parse
      setTimeout(() => {
        setStatus('idle');
      }, 100);
    };
    reader.readAsText(file);
  };

  const webServiceTargetUrl = `${dapodikUrl}/dapodik/api/v1/getSiswa?token=${token || 'TOKEN_ANDA'}`;

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
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Pusat Sinkronisasi Dapodik</h3>
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
            { id: 'json', label: 'Salin-Tempel JSON Web Service' },
            { id: 'csv', label: 'Upload CSV Dapodik' },
            { id: 'direct', label: 'Koneksi Langsung (Fetch)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatus('idle');
                setParsedStudents([]);
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
                <strong>Cara Penggunaan Bebas CORS:</strong><br />
                1. Klik tombol buka tautan untuk membuka Web Service Dapodik lokal Anda di tab baru.<br />
                2. Copy seluruh teks hasil JSON yang muncul di tab baru tersebut (Ctrl+A lalu Ctrl+C).<br />
                3. Paste (tempelkan) hasilnya di kotak teks di bawah, lalu klik <strong>Proses Data</strong>.
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
                    placeholder="Masukkan token Web Service Anda..." 
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
                  Buka Data Dapodik
                </a>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tempel Output JSON Web Service</label>
                <textarea
                  placeholder="Tempel data JSON di sini (diawali dengan [ atau { )..."
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
                Proses Data JSON
              </button>
            </>
          )}

          {activeTab === 'csv' && (
            <>
              <div style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
                <strong>Import CSV:</strong> Ekspor data siswa dari Dapodik lokal Anda ke file CSV. Pastikan kolom memuat judul header seperti: <code>nama</code>, <code>nisn</code>, <code>nis</code>/<code>nipd</code>, <code>jk</code>/<code>jenis kelamin</code>, dan <code>rombel</code>.
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
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Pilih file CSV Dapodik Anda</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>atau seret file ke sini</span>
              </div>

              {inputText && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Pratinjau Data Mentah File</label>
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
                Proses Data CSV
              </button>
            </>
          )}

          {activeTab === 'direct' && (
            <>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#b45309', lineHeight: '1.5' }}>
                <strong>Koneksi Langsung Web Service:</strong><br />
                Metode ini melakukan penarikan data dinamis langsung dari browser Anda ke Dapodik lokal. <br />
                <span style={{ fontWeight: 700 }}>Catatan Keamanan:</span> Metode ini hanya dapat berfungsi jika browser Anda mengizinkan koneksi HTTP lokal dari situs HTTPS. Jika terjadi kegagalan CORS, harap gunakan **Metode Salin-Tempel JSON** di tab pertama.
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
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Token Aplikasi Web Service</label>
                  <input 
                    type="password" 
                    placeholder="Masukkan token Web Service Anda..." 
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
                Tarik Data dari Dapodik Lokal
              </button>
            </>
          )}

          {/* Status Indicators & Parsing Output */}
          {status === 'connecting' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem', color: '#12A5B8', fontSize: '0.85rem', fontWeight: 600 }}>
              <span className="pulse-dot green"></span> Menghubungkan ke Web Service Dapodik lokal...
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
                Data Berhasil Diproses! Terdeteksi {parsedStudents.length} siswa siap disinkronisasikan.
              </div>

              {/* Data Preview Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px 10px' }}>Nama Lengkap</th>
                      <th style={{ padding: '8px 10px' }}>NISN</th>
                      <th style={{ padding: '8px 10px' }}>Kelas</th>
                      <th style={{ padding: '8px 10px' }}>JK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedStudents.slice(0, 10).map((s, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{s.nama}</td>
                        <td style={{ padding: '8px 10px' }}>{s.nisn}</td>
                        <td style={{ padding: '8px 10px' }}>{s.rombel || '1A'}</td>
                        <td style={{ padding: '8px 10px' }}>{s.jk}</td>
                      </tr>
                    ))}
                    {parsedStudents.length > 10 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', fontStyle: 'italic', backgroundColor: '#fafafb' }}>
                          Dan {parsedStudents.length - 10} siswa lainnya...
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
            disabled={parsedStudents.length === 0 || isSyncing}
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
