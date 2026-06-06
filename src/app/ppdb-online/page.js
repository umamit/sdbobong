'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleRadioChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      jenis_kelamin: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validations
    const requiredFields = [
      'nama_lengkap', 'nama_panggilan', 'nik', 'tempat_lahir', 'tanggal_lahir', 
      'jenis_kelamin', 'agama', 'anak_ke', 'dari_bersaudara', 'alamat', 'jalur_ppdb',
      'nama_ayah', 'pekerjaan_ayah', 'no_hp_ayah',
      'nama_ibu', 'pekerjaan_ibu', 'no_hp_ibu', 'no_hp'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMsg("Semua kolom bertanda bintang (*) wajib diisi!");
        return;
      }
    }

    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setErrorMsg("NIK harus terdiri dari 16 digit angka!");
      return;
    }

    const phoneFields = [
      { key: 'no_hp_ayah', label: 'Nomor HP Ayah' },
      { key: 'no_hp_ibu', label: 'Nomor HP Ibu' },
      { key: 'no_hp', label: 'Nomor HP Utama Kontak' }
    ];

    for (const p of phoneFields) {
      const val = formData[p.key];
      if (!/^08\d{8,12}$/.test(val)) {
        setErrorMsg(`Format ${p.label} tidak valid (harus dimulai dengan 08 dan berjumlah 10-14 digit)!`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ppdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Gagal mengirimkan formulir pendaftaran.");
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
          padding: '2.25rem var(--space-md)',
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
            {/* BAGIAN 1: DATA CALON PESERTA DIDIK */}
            <div className="form-card-section" style={{
              background: '#fcfcfd',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid var(--formal-blue)',
              borderRadius: '12px',
              padding: '1.5rem',
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
              padding: '1.5rem',
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
              padding: '1.5rem',
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
                  transition: 'transform 0.2s ease'
                }}
                disabled={isSubmitting}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {isSubmitting ? "⚡ Mengirim data pendaftaran..." : "✉️ Kirim Pendaftaran Online"}
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
      `}</style>
    </>
  );
}

