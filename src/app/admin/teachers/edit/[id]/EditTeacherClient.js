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
      '/images/teacher_1.svg',
      '/images/teacher_2.svg',
      '/images/teacher_3.svg',
      '/images/teacher_4.svg',
      '/images/teacher_5.svg',
      '/images/teacher_6.svg',
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
      if (extension !== 'png' && file.type !== 'image/png') {
        alert('Jenis file tidak valid! Hanya berkas PNG (.png) yang diperbolehkan.');
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
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
            --primary-gradient: linear-gradient(135deg, #0b3c5d 0%, #07253b 100%);
            --accent-gradient: linear-gradient(135deg, #f5a623 0%, #d48408 100%);
            --card-shadow: 0 15px 35px rgba(7, 37, 59, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04);
        }
        body {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            margin: 0;
            padding: var(--space-md);
            font-family: var(--font-body);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
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
            margin-bottom: var(--space-md);
            transition: all 0.2s ease;
            font-size: 0.95rem;
        }
        .btn-back:hover {
            color: var(--primary);
            transform: translateX(-4px);
        }
        .settings-card {
            background: white;
            padding: var(--space-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(229, 231, 235, 0.6);
        }
        .settings-card h2 {
            margin-top: 0;
            color: var(--primary-dark);
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 800;
            border-bottom: 2px solid rgba(229, 231, 235, 0.4);
            padding-bottom: var(--space-sm);
            margin-bottom: var(--space-md);
            letter-spacing: -0.02em;
        }
        .form-control {
            border-radius: var(--radius-sm);
            border: 1.5px solid #cbd5e1;
            padding: 0.65rem 0.85rem;
            font-family: var(--font-body);
            transition: all 0.25s ease;
            outline: none;
            font-size: 0.9rem;
            box-sizing: border-box;
        }
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(11, 60, 93, 0.12);
        }
        .btn {
            border-radius: var(--radius-sm);
            font-weight: 600;
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
            box-shadow: 0 4px 10px rgba(11, 60, 93, 0.15);
        }
        .btn-primary:hover {
            box-shadow: 0 6px 15px rgba(11, 60, 93, 0.25);
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
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            Perbarui informasi guru di bawah ini. Tekan tombol Simpan Perubahan jika sudah selesai.
          </p>

          {errorMsg && (
            <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '0.9rem', backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '0.9rem', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}>
              {successMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="teacher_name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Nama Lengkap & Gelar *</label>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label htmlFor="teacher_role" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Jabatan / Peran *</label>
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
                <label htmlFor="teacher_status" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Status Kepegawaian *</label>
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
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="teacher_details" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Pangkat / Keterangan Lain (Opsional)</label>
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
            
            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Foto / Avatar *</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justify(content): 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
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
                    <option value="/images/teacher_1.svg">Ilustrasi Guru Laki-laki 1</option>
                    <option value="/images/teacher_2.svg">Ilustrasi Guru Perempuan 1</option>
                    <option value="/images/teacher_3.svg">Ilustrasi Guru Laki-laki 2</option>
                    <option value="/images/teacher_4.svg">Ilustrasi Guru Perempuan 2</option>
                    <option value="/images/teacher_5.svg">Ilustrasi Guru Laki-laki 3</option>
                    <option value="/images/teacher_6.svg">Ilustrasi Guru Perempuan 3</option>
                    <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                    <option value="/images/principal.svg">Ilustrasi Kepala Sekolah (principal.svg)</option>
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
                <label htmlFor="teacher_photo" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Atau Unggah Foto Baru (.png, maks 1MB):</label>
                <input
                  type="file"
                  id="teacher_photo"
                  name="photo"
                  className="form-control"
                  accept="image/png"
                  onChange={handlePhotoChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
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
    </>
  );
}
