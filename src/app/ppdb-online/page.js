'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitPpdbAction } from '../actions/ppdb';

export default function PPDBOnlineForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nama_panggilan: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    anak_ke: '',
    dari_bersaudara: '',
    alamat: '',
    jalur_ppdb: '',
    // Data Orang Tua
    nama_ayah: '',
    pekerjaan_ayah: '',
    no_hp_ayah: '',
    nama_ibu: '',
    pekerjaan_ibu: '',
    no_hp_ibu: '',
    no_hp: '', // No HP Utama Kontak
    // Data Wali (Opsional)
    nama_wali: '',
    pekerjaan_wali: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');

  // File States
  const [fileKk, setFileKk] = useState(null);
  const [fileAkta, setFileAkta] = useState(null);
  const [fileKtp, setFileKtp] = useState(null);
  const [fileSptjm, setFileSptjm] = useState(null);
  const [fileKip, setFileKip] = useState(null);
  const [fileIjazah, setFileIjazah] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };
      // Prefill main contact phone number if it's empty and parent numbers are filled
      if (name === 'no_hp_ayah' && !prev.no_hp) {
        updated.no_hp = value;
      } else if (name === 'no_hp_ibu' && !prev.no_hp && !updated.no_hp_ayah) {
        updated.no_hp = value;
      }
      return updated;
    });
  };

  const handleFileChange = (e, setter, label) => {
    const file = e.target.files[0];
    if (!file) {
      setter(null);
      return;
    }
    if (file.size > 350 * 1024) {
      setErrorMsg(`Ukuran berkas ${label} melebihi batas maksimal 350KB!`);
      e.target.value = ''; // Reset input
      setter(null);
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') {
      setErrorMsg(`Berkas ${label} harus berformat PDF!`);
      e.target.value = ''; // Reset input
      setter(null);
      return;
    }
    setErrorMsg('');
    setter(file);
  };

  const handleRadioChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      jenis_kelamin: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Sanitization helper
    const sanitizePhone = (phone) => {
      if (!phone) return '';
      let cleaned = phone.trim().replace(/[^\d+]/g, '');
      if (cleaned.startsWith('+62')) {
        cleaned = '0' + cleaned.substring(3);
      } else if (cleaned.startsWith('62')) {
        cleaned = '0' + cleaned.substring(2);
      }
      return cleaned.replace(/\D/g, '');
    };

    const cleanNik = formData.nik.replace(/\D/g, '');
    const cleanNoHpAyah = sanitizePhone(formData.no_hp_ayah);
    const cleanNoHpIbu = sanitizePhone(formData.no_hp_ibu);
    const cleanNoHp = sanitizePhone(formData.no_hp);

    // Update state with cleaned values so inputs reflect them
    const cleanedData = {
      ...formData,
      nik: cleanNik,
      no_hp_ayah: cleanNoHpAyah,
      no_hp_ibu: cleanNoHpIbu,
      no_hp: cleanNoHp
    };
    setFormData(cleanedData);

    // Client-side validations (using cleaned data)
    const requiredFields = [
      'nama_lengkap', 'nama_panggilan', 'nik', 'tempat_lahir', 'tanggal_lahir', 
      'jenis_kelamin', 'agama', 'anak_ke', 'dari_bersaudara', 'alamat', 'jalur_ppdb',
      'nama_ayah', 'pekerjaan_ayah', 'no_hp_ayah',
      'nama_ibu', 'pekerjaan_ibu', 'no_hp_ibu', 'no_hp'
    ];

    for (const field of requiredFields) {
      if (!cleanedData[field]) {
        setErrorMsg("Semua kolom bertanda bintang (*) wajib diisi!");
        return;
      }
    }

    if (cleanedData.nik.length !== 16 || !/^\d+$/.test(cleanedData.nik)) {
      setErrorMsg("NIK harus terdiri dari 16 digit angka!");
      return;
    }

    const phoneFields = [
      { key: 'no_hp_ayah', label: 'Nomor HP Ayah' },
      { key: 'no_hp_ibu', label: 'Nomor HP Ibu' },
      { key: 'no_hp', label: 'Nomor HP Utama Kontak' }
    ];

    for (const p of phoneFields) {
      const val = cleanedData[p.key];
      if (!/^08\d{8,12}$/.test(val)) {
        setErrorMsg(`Format ${p.label} tidak valid (harus dimulai dengan 08 dan berjumlah 10-14 digit)!`);
        return;
      }
    }

    // Validate Files
    if (!fileKk) {
      setErrorMsg("Berkas Kartu Keluarga (KK) wajib diunggah!");
      return;
    }
    if (!fileAkta) {
      setErrorMsg("Berkas Akta Kelahiran wajib diunggah!");
      return;
    }
    if (!fileKtp) {
      setErrorMsg("Berkas Scan KTP Orang Tua wajib diunggah!");
      return;
    }
    if (!fileSptjm) {
      setErrorMsg("Berkas Scan SPTJM wajib diunggah!");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      Object.entries(cleanedData).forEach(([key, val]) => {
        submissionData.append(key, val);
      });
      submissionData.append('website_url', websiteUrl);
      submissionData.append('berkas_kk', fileKk);
      submissionData.append('berkas_akta', fileAkta);
      submissionData.append('berkas_ktp', fileKtp);
      submissionData.append('berkas_sptjm', fileSptjm);
      if (fileKip) {
        submissionData.append('berkas_kip', fileKip);
      }
      if (fileIjazah) {
        submissionData.append('berkas_ijazah', fileIjazah);
      }

      const res = await submitPpdbAction(submissionData);

      if (res.error) {
        throw new Error(res.error);
      }

      // Store successful record in sessionStorage for receipt printout
      if (res.record) {
        sessionStorage.setItem('ppdb_receipt', JSON.stringify(res.record));
      }
      
      // Success redirect
      router.push('/ppdb-online/sukses');
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan koneksi internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="container section-padding">
        <div className="form-container" style={{
          maxWidth: '850px',
          margin: 'var(--space-md) auto',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          borderTop: '6px solid var(--formal-blue)'
        }}>
          <div className="form-title-section" style={{
            textAlign: 'center',
            marginBottom: '2rem',
            borderBottom: '2px dashed var(--border-color)',
            paddingBottom: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.5px' }}>
              FORMULIR PENDAFTARAN PPDB ONLINE
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 0, fontWeight: 500 }}>
              SD NEGERI BOBONG | TAHUN AJARAN 2026/2027
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Silakan isi data calon siswa baru dengan lengkap dan benar sesuai dengan berkas Kartu Keluarga asli.
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger" role="alert" style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: '#FDF2F2',
              color: '#9B1C1C',
              border: '1px solid #FBD5D5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Honeypot field (hidden from real users to trap spam bots) */}
            <input
              type="text"
              name="website_url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />
            {/* BAGIAN 1: DATA CALON PESERTA DIDIK */}
            <div className="form-card-section" style={{
              background: '#fcfcfd',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid var(--formal-blue)',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👤 A. DATA CALON PESERTA DIDIK
              </h3>

              {/* Nama Lengkap & Nama Panggilan */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="nama_lengkap" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nama Lengkap Calon Siswa *
                  </label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="nama_panggilan" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nama Panggilan *
                  </label>
                  <input
                    type="text"
                    id="nama_panggilan"
                    name="nama_panggilan"
                    className="form-control"
                    placeholder="Contoh: Budi"
                    value={formData.nama_panggilan}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* NIK & Jenis Kelamin */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="nik" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Nomor Induk Kependudukan (NIK) *
                  </label>
                  <input
                    type="text"
                    id="nik"
                    name="nik"
                    className="form-control"
                    placeholder="Harus 16 digit angka sesuai KK"
                    minLength={16}
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Jenis Kelamin *
                  </label>
                  <div className="radio-group" style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '0.45rem' }}>
                    <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="Laki-laki"
                        checked={formData.jenis_kelamin === 'Laki-laki'}
                        onChange={() => handleRadioChange('Laki-laki')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        required
                      />
                      Laki-laki
                    </label>
                    <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="Perempuan"
                        checked={formData.jenis_kelamin === 'Perempuan'}
                        onChange={() => handleRadioChange('Perempuan')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        required
                      />
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="tempat_lahir" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    id="tempat_lahir"
                    name="tempat_lahir"
                    className="form-control"
                    placeholder="Contoh: Bobong"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="tanggal_lahir" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    id="tanggal_lahir"
                    name="tanggal_lahir"
                    className="form-control"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Agama & Pilihan Jalur PPDB */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="agama" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Agama Calon Siswa *
                  </label>
                  <select
                    id="agama"
                    name="agama"
                    className="form-control"
                    value={formData.agama}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="jalur_ppdb" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Pilihan Jalur PPDB *
                  </label>
                  <select
                    id="jalur_ppdb"
                    name="jalur_ppdb"
                    className="form-control"
                    value={formData.jalur_ppdb}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>-- Pilih Jalur Pendaftaran --</option>
                    <option value="Zonasi">Zonasi (Kedekatan Tempat Tinggal)</option>
                    <option value="Afirmasi">Afirmasi (Keluarga Ekonomi Kurang Mampu)</option>
                    <option value="Perpindahan Tugas Orang Tua">Perpindahan Tugas Orang Tua / Wali</option>
                    <option value="Prestasi">Prestasi (Akademik / Non-Akademik)</option>
                  </select>
                </div>
              </div>

              {/* Jumlah Bersaudara */}
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="anak_ke" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Anak Ke- *
                  </label>
                  <input
                    type="number"
                    id="anak_ke"
                    name="anak_ke"
                    className="form-control"
                    placeholder="Contoh: 1"
                    min="1"
                    max="20"
                    value={formData.anak_ke}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="dari_bersaudara" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Dari ... Bersaudara *
                  </label>
                  <input
                    type="number"
                    id="dari_bersaudara"
                    name="dari_bersaudara"
                    className="form-control"
                    placeholder="Contoh: 3"
                    min="1"
                    max="20"
                    value={formData.dari_bersaudara}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="alamat" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                  Alamat Tinggal di Bobong *
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  rows="3"
                  className="form-control"
                  placeholder="Contoh: RT 03/RW 02, Desa Wayo, Kecamatan Taliabu Barat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* BAGIAN 2: DATA ORANG TUA KANDUNG */}
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

            {/* BAGIAN 4: UPLOAD BERKAS PENDUKUNG */}
            <div className="form-card-section" style={{
              background: '#fcfcfd',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid #16a34a',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📁 D. UPLOAD BERKAS PENDUKUNG (FORMAT PDF, 150KB - 350KB)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                Silakan unggah dokumen hasil scan dalam format <strong>PDF</strong> dengan ukuran file <strong>disarankan 150KB - 350KB</strong> (maksimal 350KB) untuk masing-masing berkas.
              </p>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="berkas_kk" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan Kartu Keluarga (KK) *
                  </label>
                  <input
                    type="file"
                    id="berkas_kk"
                    name="berkas_kk"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileKk, "Kartu Keluarga")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Wajib, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="berkas_akta" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan Akta Kelahiran *
                  </label>
                  <input
                    type="file"
                    id="berkas_akta"
                    name="berkas_akta"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileAkta, "Akta Kelahiran")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Wajib, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '0.5rem' }}>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="berkas_ktp" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan KTP Orang Tua (Ayah & Ibu dijadikan 1 PDF) *
                  </label>
                  <input
                    type="file"
                    id="berkas_ktp"
                    name="berkas_ktp"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileKtp, "KTP Orang Tua")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Wajib, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label htmlFor="berkas_sptjm" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan SPTJM *
                  </label>
                  <input
                    type="file"
                    id="berkas_sptjm"
                    name="berkas_sptjm"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileSptjm, "SPTJM")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Wajib, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '0.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="berkas_kip" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan KIP / PKH (Opsional)
                  </label>
                  <input
                    type="file"
                    id="berkas_kip"
                    name="berkas_kip"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileKip, "KIP/PKH")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Opsional, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="berkas_ijazah" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    Scan Ijazah TK / PAUD (Opsional)
                  </label>
                  <input
                    type="file"
                    id="berkas_ijazah"
                    name="berkas_ijazah"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setFileIjazah, "Ijazah TK/PAUD")}
                    style={{ 
                      padding: '0.5rem',
                      display: 'block',
                      width: '100%',
                      fontSize: '0.85rem',
                      color: '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Opsional, format PDF disarankan 150KB - 350KB (maks. 350KB)</small>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  minWidth: '280px', 
                  fontSize: '1.1rem', 
                  padding: '0.85rem 2rem', 
                  borderRadius: '30px',
                  fontWeight: 700,
                  boxShadow: '0 10px 15px -3px rgba(11, 60, 93, 0.3)',
                  transition: 'transform 0.2s ease',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isSubmitting ? (
                  <span className="btn-loading-container">
                    <span className="btn-spinner"></span>
                    Mengirim Formulir PPDB...
                  </span>
                ) : (
                  "✉️ Kirim Pendaftaran Online"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --formal-red: #800020;
          --formal-blue: #0B3C5D;
        }
        .form-container {
          padding: 2.25rem var(--space-md);
        }
        .form-card-section {
          padding: 1.5rem;
        }
        .form-control {
          width: 100%;
          padding: 0.75rem var(--space-xs);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: var(--transition-fast);
          background-color: var(--bg-main);
          box-sizing: border-box;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(11, 60, 93, 0.1);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xs);
        }
        @media (min-width: 600px) {
          .form-row {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-sm);
          }
        }
        @media (max-width: 600px) {
          .form-container {
            padding: 1.5rem var(--space-sm) !important;
            border-radius: 12px !important;
          }
          .form-card-section {
            padding: 1rem !important;
            border-radius: 8px !important;
          }
          .form-title-section h2 {
            font-size: 1.35rem !important;
          }
        }
      `}</style>
    </>
  );
}

