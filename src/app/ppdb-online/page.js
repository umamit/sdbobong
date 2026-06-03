'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PPDBOnlineForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    nama_ibu: '',
    no_hp: '',
    alamat: '',
    jalur_ppdb: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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
    if (!formData.nama_lengkap || !formData.nik || !formData.tempat_lahir || !formData.tanggal_lahir || !formData.jenis_kelamin || !formData.nama_ibu || !formData.no_hp || !formData.alamat || !formData.jalur_ppdb) {
      setErrorMsg("Semua kolom formulir wajib diisi!");
      return;
    }

    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setErrorMsg("NIK harus terdiri dari 16 digit angka!");
      return;
    }

    if (!/^08\d{8,12}$/.test(formData.no_hp)) {
      setErrorMsg("Format nomor HP tidak valid (harus dimulai dengan 08 dan berjumlah 10-14 digit)!");
      return;
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
          maxWidth: '750px',
          margin: 'var(--space-md) auto',
          background: '#ffffff',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          borderTop: '5px solid var(--formal-blue)'
        }}>
          <div className="form-title-section" style={{
            textAlign: 'center',
            marginBottom: 'var(--space-md)',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: 'var(--space-sm)'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
              FORMULIR PPDB ONLINE 2026/2027
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 0 }}>
              Silakan isi data calon siswa baru dengan lengkap dan benar sesuai berkas Kartu Keluarga asli.
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger" role="alert" style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-sm)',
              fontSize: '0.9rem',
              fontWeight: 500,
              backgroundColor: '#FDF2F2',
              color: '#9B1C1C',
              border: '1px solid #FBD5D5'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nama Lengkap & NIK */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="nama_lengkap" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
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
                <label htmlFor="nik" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  className="form-control"
                  placeholder="Harus 16 digit angka"
                  minLength={16}
                  maxLength={16}
                  value={formData.nik}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="tempat_lahir" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
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
                <label htmlFor="tanggal_lahir" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
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

            {/* Jenis Kelamin & Nama Ibu Kandung */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                  Jenis Kelamin *
                </label>
                <div className="radio-group" style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '0.25rem' }}>
                  <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.95rem' }}>
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
                  <label className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.95rem' }}>
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
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="nama_ibu" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                  Nama Ibu Kandung *
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
            </div>

            {/* No HP/WhatsApp & Jalur PPDB */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="no_hp" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                  No. HP / WhatsApp Wali *
                </label>
                <input
                  type="tel"
                  id="no_hp"
                  name="no_hp"
                  className="form-control"
                  placeholder="Contoh: 081234567890"
                  value={formData.no_hp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <label htmlFor="jalur_ppdb" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
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

            {/* Alamat Lengkap */}
            <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
              <label htmlFor="alamat" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
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

            <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ minWidth: '250px', fontSize: '1.05rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim data..." : "✉️ Kirim Pendaftaran Online"}
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
