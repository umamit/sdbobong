'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditTeacherClient({ teacher }) {
  const router = useRouter();
  const [name, setName] = useState(teacher.name || '');
  const [role, setRole] = useState(teacher.role || '');
  const [status, setStatus] = useState(teacher.status || 'PNS');
  const [details, setDetails] = useState(teacher.details || '');
  
  const [teacherImageSelect, setTeacherImageSelect] = useState('');
  const [teacherImageUrl, setTeacherImageUrl] = useState(teacher.image || '');
  const [avatarPreview, setAvatarPreview] = useState(teacher.image || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Initial select binding
  useEffect(() => {
    const defaultAvatars = [
      '/images/teacher_1.png',
      '/images/teacher_2.jpg',
      '/images/teacher_3.png',
      '/images/teacher_4.jpg',
      '/images/teacher_5.png',
      '/images/teacher_7.jpg',
      '/images/principal.svg'
    ];

    if (defaultAvatars.includes(teacher.image)) {
      setTeacherImageSelect(teacher.image);
    } else {
      setTeacherImageSelect('custom');
    }
  }, [teacher.image]);

  const handleImageSelectChange = (e) => {
    const val = e.target.value;
    setTeacherImageSelect(val);
    
    const fileInput = document.getElementById('teacher_photo');
    if (fileInput) fileInput.value = '';

    if (val === 'custom') {
      setAvatarPreview(teacherImageUrl);
    } else {
      setTeacherImageUrl(val);
      setAvatarPreview(val);
    }
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setTeacherImageUrl(val);
    setAvatarPreview(val);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 1MB.');
        e.target.value = '';
        return;
      }
      const extension = file.name.split('.').pop().toLowerCase();
      const allowed = ['png', 'jpg', 'jpeg'];
      if (!allowed.includes(extension)) {
        alert('Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.target);
    formData.set('id', teacher.id);
    
    if (teacherImageSelect !== 'custom') {
      formData.set('image', teacherImageSelect);
    } else {
      formData.set('image', teacherImageUrl);
    }

    try {
      const res = await fetch('/api/teachers', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Data guru berhasil diperbarui!');
        setTimeout(() => {
          router.push('/admin/dashboard?tab=teachers');
          router.refresh();
        }, 1000);
      } else {
        setErrorMsg(data.error || 'Gagal menyimpan perubahan data guru.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan server: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-edit-teacher-layout">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');


        .admin-edit-teacher-layout {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            --accent-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            --card-shadow: 0 15px 35px rgba(99, 102, 241, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04);
            --radius-md: 12px;
            --radius-sm: 8px;

            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            margin: 0;
            padding: 2rem;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--text-main);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
            width: 100%;
        }
        .container {
            width: 100%;
            max-width: 600px;
        }
        .btn-back {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-dark);
            text-decoration: none;
            font-weight: 700;
            margin-bottom: 1.5rem;
            transition: all 0.2s ease;
            font-size: 0.95rem;
        }
        .btn-back:hover {
            color: var(--primary);
            transform: translateX(-4px);
        }
        .settings-card {
            background: white;
            padding: 2rem;
            border-radius: var(--radius-md);
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(229, 231, 235, 0.6);
        }
        .settings-card h2 {
            margin-top: 0;
            color: #0f172a;
            font-family: inherit;
            font-size: 1.35rem;
            font-weight: 800;
            border-bottom: 2px solid rgba(229, 231, 235, 0.4);
            padding-bottom: 0.75rem;
            margin-bottom: 1.25rem;
            letter-spacing: -0.02em;
        }
        .form-control {
            border-radius: var(--radius-sm);
            border: 1.5px solid #cbd5e1;
            padding: 0.65rem 0.85rem;
            font-family: inherit;
            transition: all 0.25s ease;
            outline: none;
            font-size: 0.9rem;
            box-sizing: border-box;
            background: #ffffff;
            color: #0f172a;
        }
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .btn {
            border-radius: var(--radius-sm);
            font-weight: 700;
            transition: all 0.2s ease;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .btn:hover {
            transform: translateY(-1px);
        }
        .btn-primary {
            background: var(--primary-gradient);
            color: white;
            border: none;
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.15);
        }
        .btn-primary:hover {
            box-shadow: 0 6px 15px rgba(99, 102, 241, 0.25);
        }
        .btn-secondary {
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        .btn-secondary:hover {
            background-color: #e2e8f0;
            color: #1e293b;
        }
      `}} />

      <div className="container">
        <Link href="/admin/dashboard?tab=teachers" className="btn-back">
          <span>←</span> Kembali ke Dashboard
        </Link>
        
        <div className="settings-card">
          <h2>✏️ Edit Data Guru / Staf</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Perbarui informasi guru di bawah ini. Tekan tombol Simpan Perubahan jika sudah selesai.
          </p>

          {errorMsg && (
            <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}>
              {successMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="teacher_name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>Nama Lengkap & Gelar *</label>
              <input
                type="text"
                id="teacher_name"
                name="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="teacher_role" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>Jabatan / Peran *</label>
                <input
                  type="text"
                  id="teacher_role"
                  name="role"
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="teacher_status" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>Status Kepegawaian *</label>
                <select
                  id="teacher_status"
                  name="status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Honorer Daerah">Honorer Daerah</option>
                  <option value="Honorer Sekolah">Honorer Sekolah</option>
                  <option value="Komite Sekolah">Komite Sekolah</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="teacher_details" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>Pangkat / Keterangan Lain (Opsional)</label>
              <input
                type="text"
                id="teacher_details"
                name="details"
                className="form-control"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>Foto / Avatar (Pilih Stok / Unggah)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                  <img id="avatar-preview" src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <select
                    id="teacher_image_select"
                    className="form-control"
                    value={teacherImageSelect}
                    onChange={handleImageSelectChange}
                    style={{ width: '100%', marginBottom: '5px' }}
                  >
                    <option value="/images/teacher_1.png">Stok Ilustrasi Pria (Default)</option>
                    <option value="/images/teacher_2.jpg">Stok Ilustrasi Wanita Berhijab (Default)</option>
                    <option value="/images/teacher_3.png">Stok Ilustrasi Wanita (Tanpa Hijab)</option>
                    <option value="/images/teacher_4.jpg">Template Pas Foto Hijab (Merah)</option>
                    <option value="/images/teacher_5.png">Template Pas Foto Hijab (Putih)</option>
                    <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                    <option value="/images/principal.svg">Stok Ilustrasi Kepala Sekolah (principal.svg)</option>
                    <option value="custom">-- Input URL Gambar Kustom --</option>
                  </select>
                  
                  <input
                    type="text"
                    id="teacher_image_url"
                    className="form-control"
                    value={teacherImageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Masukkan URL / path gambar custom"
                    style={{ width: '100%', display: teacherImageSelect === 'custom' ? 'block' : 'none' }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="teacher_photo" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB - Opsional):</label>
                <input
                  type="file"
                  id="teacher_photo"
                  name="photo"
                  className="form-control"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handlePhotoChange}
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                  💡 <strong>Rekomendasi:</strong> Gunakan foto format kotak/persegi (1:1) atau rasio potret agar kartu struktur organisasi di halaman Profil terlihat rapi dan simetris tanpa terpotong secara paksa oleh CSS.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                {isSubmitting ? 'Menyimpan...' : '💾 Simpan Perubahan'}
              </button>
              <Link href="/admin/dashboard?tab=teachers" className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
