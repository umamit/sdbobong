'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardClient({
  initialConfig,
  initialNewsList,
  initialTeachers,
  initialRecords,
  dbStatus
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState(initialRecords);
  const [config, setConfig] = useState(initialConfig);
  const [newsList, setNewsList] = useState(initialNewsList);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [toast, setToast] = useState(null);

  // States for Teacher form preview
  const [teacherImageSelect, setTeacherImageSelect] = useState('/images/teacher_1.svg');
  const [teacherImageUrl, setTeacherImageUrl] = useState('/images/teacher_1.svg');
  const [avatarPreview, setAvatarPreview] = useState('/images/teacher_1.svg');

  // Load active tab from URL query param if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    // Scroll to top to ensure toast is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (!confirm('Apakah Anda yakin ingin logout?')) return;
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        showToast('danger', 'Gagal logout.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      const res = await fetch('/api/ppdb', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recordId, status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Status pendaftar berhasil diperbarui menjadi: ${newStatus}`);
        setRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r));
      } else {
        showToast('danger', data.error || 'Gagal memperbarui status pendaftaran.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handlePPDBDelete = async (recordId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pendaftar ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/ppdb?id=${recordId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data pendaftar berhasil dihapus secara permanen.');
        setRecords(prev => prev.filter(r => r.id !== recordId));
      } else {
        showToast('danger', data.error || 'Gagal menghapus data pendaftaran.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleAnnouncementsUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const annInputs = Array.from(form.elements).filter(el => el.name === 'announcements[]');
    const announcements = annInputs.map(el => el.value.trim()).filter(val => val);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'announcements', announcements })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi website berhasil disimpan.');
        setConfig(prev => ({ ...prev, marquee_announcements: announcements }));
      } else {
        showToast('danger', data.error || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleStatsUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const siswa_aktif = parseInt(form.siswa_aktif.value, 10) || 0;
    const guru_staf = parseInt(form.guru_staf.value, 10) || 0;
    const ruang_kelas = parseInt(form.ruang_kelas.value, 10) || 0;
    const akreditasi = form.akreditasi.value.trim().toUpperCase() || 'B';

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'stats', siswa_aktif, guru_staf, ruang_kelas, akreditasi })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi website berhasil disimpan.');
        setConfig(prev => ({
          ...prev,
          stats: { siswa_aktif, guru_staf, ruang_kelas, akreditasi }
        }));
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data statistik.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleNewsAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Berita baru berhasil diterbitkan!');
        setNewsList(prev => [data.article, ...prev]);
        form.reset();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan berita baru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleNewsDelete = async (newsId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel berita ini?')) return;
    try {
      const res = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Artikel berita berhasil dihapus.');
        setNewsList(prev => prev.filter(n => n.id !== newsId));
      } else {
        showToast('danger', data.error || 'Gagal menghapus artikel berita.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleTeacherAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    if (teacherImageSelect !== 'custom') {
      formData.set('image', teacherImageSelect);
    } else {
      formData.set('image', teacherImageUrl);
    }

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil ditambahkan!');
        const role = data.teacher.role || '';
        if (role.toLowerCase().includes('kepala sekolah')) {
          setTeachers(prev => [data.teacher, ...prev]);
        } else {
          setTeachers(prev => [...prev, data.teacher]);
        }
        form.reset();
        setTeacherImageSelect('/images/teacher_1.svg');
        setTeacherImageUrl('/images/teacher_1.svg');
        setAvatarPreview('/images/teacher_1.svg');
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data guru baru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleTeacherDelete = async (teacherId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data guru ini?')) return;
    try {
      const res = await fetch(`/api/teachers?id=${teacherId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil dihapus.');
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
      } else {
        showToast('danger', data.error || 'Gagal menghapus data guru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Avatar selection helpers
  const handleTeacherImageSelectChange = (e) => {
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

  const handleTeacherImageUrlChange = (e) => {
    const val = e.target.value;
    setTeacherImageUrl(val);
    setAvatarPreview(val);
  };

  const handleTeacherPhotoChange = (e) => {
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

  const handleNewsPhotoChange = (e) => {
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
    }
  };

  const getPageTitle = () => {
    const titles = {
      overview: 'Ringkasan Dashboard',
      ppdb: 'Manajemen Data PPDB',
      content: 'Pengumuman & Statistik',
      news: 'Manajemen Berita Sekolah',
      teachers: 'Manajemen Guru & Kepala Sekolah'
    };
    return titles[activeTab] || 'Dashboard Admin';
  };

  return (
    <div className="admin-dashboard-layout">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
            --sidebar-width: 260px;
            --admin-bg: #f1f5f9;
            --primary-gradient: linear-gradient(180deg, #091e30 0%, #061521 100%);
            --accent-gradient: linear-gradient(135deg, #f5a623 0%, #d48408 100%);
            --teal-gradient: linear-gradient(135deg, #10b981 0%, #047857 100%);
            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            --card-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
            --transition-smooth: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-dashboard-layout {
            background-color: var(--admin-bg);
            margin: 0;
            padding: 0;
            font-family: var(--font-body);
            color: var(--text-main);
            display: flex;
            min-height: 100vh;
            width: 100%;
        }
        .sidebar {
            width: var(--sidebar-width);
            background: var(--primary-gradient);
            color: #ffffff;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
            transition: var(--transition-smooth);
        }
        .sidebar-brand {
            padding: 1.75rem 1.25rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 0.85rem;
        }
        .sidebar-brand img {
            width: 40px;
            height: 40px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        }
        .sidebar-brand span {
            font-family: var(--font-heading);
            font-weight: 800;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .sidebar-menu {
            list-style: none;
            padding: var(--space-sm) 0;
            margin: 0;
            flex: 1;
        }
        .sidebar-item {
            margin-bottom: 6px;
            padding: 0 12px;
        }
        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.85rem 1rem;
            color: rgba(255, 255, 255, 0.65);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition-smooth);
            border-radius: 10px;
            cursor: pointer;
        }
        .sidebar-link:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.06);
            transform: translateX(4px);
        }
        .sidebar-link.active {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(245, 166, 35, 0.2) 0%, rgba(245, 166, 35, 0.05) 100%);
            font-weight: 700;
            border-left: 4px solid var(--secondary);
            box-shadow: 0 4px 15px rgba(245, 166, 35, 0.05);
        }
        .sidebar-link.active span:first-child {
            filter: drop-shadow(0 0 8px var(--secondary));
        }
        .sidebar-footer {
            padding: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .btn-logout {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.8rem;
            background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.9rem;
            box-shadow: 0 4px 12 rgba(239, 68, 68, 0.15);
        }
        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
        }
        .main-wrapper {
            margin-left: var(--sidebar-width);
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--admin-bg);
        }
        .top-navbar {
            height: 75px;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 90;
        }
        .top-title h1 {
            font-family: var(--font-heading);
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--primary-dark);
            margin: 0;
            letter-spacing: -0.02em;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text-main);
        }
        .user-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: var(--accent-gradient);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            box-shadow: 0 4px 10px rgba(245, 166, 35, 0.25);
            position: relative;
        }
        .user-avatar::after {
            content: '';
            position: absolute;
            bottom: 1px;
            right: 1px;
            width: 9px;
            height: 9px;
            background-color: #10b981;
            border: 2px solid white;
            border-radius: 50%;
        }
        .content-body {
            padding: 2rem;
            flex: 1;
        }
        .alert-toast {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 9999;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 400px;
            backdrop-filter: blur(8px);
        }
        @keyframes slideInRight {
            from { transform: translateX(120%) scale(0.9); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        .alert-toast-success {
            background-color: rgba(236, 253, 245, 0.95);
            color: #065F46;
            border: 1px solid #A7F3D0;
        }
        .alert-toast-danger {
            background-color: rgba(254, 242, 242, 0.95);
            color: #991B1B;
            border: 1px solid #FCA5A5;
        }
        .tab-pane {
            display: none;
            animation: fadeIn 0.35s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .tab-pane.active {
            display: block;
        }
        .stats-overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .overview-card {
            background-color: #ffffff;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(226, 232, 240, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            transition: var(--transition-smooth);
        }
        .overview-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--card-shadow-hover);
            border-color: rgba(11, 60, 93, 0.15);
        }
        .overview-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--primary-gradient);
        }
        .overview-card.accent::after {
            background: var(--accent-gradient);
        }
        .overview-card-title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
            display: block;
        }
        .overview-card-value {
            font-size: 2.25rem;
            font-weight: 800;
            color: var(--primary-dark);
            line-height: 1;
            letter-spacing: -0.03em;
        }
        .admin-table {
            background: white;
            border-radius: 16px;
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(226, 232, 240, 0.8);
            overflow: hidden;
            margin-bottom: 2rem;
        }
        .table-toolbar {
            padding: 1.5rem;
            background-color: #ffffff;
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .table-toolbar h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--primary-dark);
            font-family: var(--font-heading);
            letter-spacing: -0.02em;
        }
        .table-custom {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #ffffff;
            font-size: 0.9rem;
            text-align: left;
        }
        .table-custom th {
            background-color: #f8fafc;
            color: #475569;
            padding: 1rem 1.25rem;
            font-family: var(--font-heading);
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
        }
        .table-custom td {
            padding: 1.1rem 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            color: #64748b;
            vertical-align: middle;
        }
        .table-custom tr:hover td {
            background-color: #f8fafc;
        }
        .table-custom tr:last-child td {
            border-bottom: none;
        }
        .table-responsive {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            margin-bottom: 1rem;
        }
        .status-badge-select {
            padding: 0.45rem var(--space-xs);
            font-size: 0.8rem;
            font-weight: 700;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            outline: none;
            transition: var(--transition-smooth);
        }
        .status-badge-select.pending {
            background-color: #FFFBEB;
            color: #D97706;
            border-color: #FCD34D;
        }
        .status-badge-select.verified {
            background-color: #ECFDF5;
            color: #059669;
            border-color: #A7F3D0;
        }
        .status-badge-select.rejected {
            background-color: #FEF2F2;
            color: #DC2626;
            border-color: #FCA5A5;
        }
        .status-badge-select:focus {
            box-shadow: 0 0 0 3px rgba(11, 60, 93, 0.12);
        }
        .settings-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 950px) {
            .settings-grid {
                grid-template-columns: 1.25fr 0.75fr;
            }
        }
        .settings-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(226, 232, 240, 0.8);
            margin-bottom: 1.5rem;
        }
        .settings-card h3 {
            margin-top: 0;
            border-bottom: 2px solid rgba(226, 232, 240, 0.5);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-md);
            color: var(--primary-dark);
            font-weight: 800;
            font-family: var(--font-heading);
            font-size: 1.3rem;
            letter-spacing: -0.02em;
        }
        .news-cms-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 950px) {
            .news-cms-grid {
                grid-template-columns: 1.1fr 0.9fr;
            }
        }
        .btn {
            border-radius: 10px;
            font-weight: 700;
            transition: var(--transition-smooth);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn-primary {
            background: var(--primary-gradient);
            color: white;
            box-shadow: 0 4px 10px rgba(11, 60, 93, 0.15);
        }
        .btn-primary:hover {
            box-shadow: 0 8px 20px rgba(11, 60, 93, 0.25);
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
        .btn-action-delete {
            background-color: #FEF2F2;
            color: #DC2626;
            border: 1px solid #FCA5A5;
            padding: 0.45rem 0.8rem;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.8rem;
            font-weight: 700;
        }
        .btn-action-delete:hover {
            background-color: #DC2626;
            color: white;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
            transform: translateY(-1px);
        }
        .form-control {
            border-radius: 10px;
            border: 1.5px solid #cbd5e1;
            padding: 0.75rem 1rem;
            font-family: var(--font-body);
            transition: var(--transition-smooth);
            outline: none;
            font-size: 0.9rem;
            box-sizing: border-box;
            background: #ffffff;
            width: 100%;
        }
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(11, 60, 93, 0.12);
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 0.85rem;
            color: #1e293b;
        }
        @media (max-width: 768px) {
            .sidebar {
                width: 70px;
            }
            .sidebar-brand span, .sidebar-link span:last-child, .sidebar-footer button span:last-child {
                display: none;
            }
            .sidebar-brand {
                justify-content: center;
                padding: var(--space-sm) 0;
            }
            .sidebar-link {
                justify-content: center;
                padding: 1rem 0;
            }
            .main-wrapper {
                margin-left: 70px;
            }
        }
      `}} />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo_sekolah.png" alt="Logo" />
          <span>SDN BOBONG</span>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <span>📊</span>
              <span>Ringkasan</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'ppdb' ? 'active' : ''}`} onClick={() => setActiveTab('ppdb')}>
              <span>📝</span>
              <span>Kelola PPDB</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              <span>⚙️</span>
              <span>Pengumuman & Stat</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
              <span>📰</span>
              <span>Kelola Berita</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
              <span>👨‍🏫</span>
              <span>Kelola Guru & Staf</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <form onSubmit={handleLogout}>
            <button type="submit" className="btn-logout">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        <header className="top-navbar">
          <div className="top-title">
            <h1 id="page-title">{getPageTitle()}</h1>
          </div>
          <div className="user-info">
            <div className="user-avatar">A</div>
            <span>Administrator</span>
          </div>
        </header>

        <main className="content-body">
          {/* Toast notifications */}
          {toast && (
            <div className={`alert-toast alert-toast-${toast.type}`}>
              {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
            </div>
          )}

          {/* ================= TAB: OVERVIEW ================= */}
          <section id="tab-overview" className={`tab-pane ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-overview-grid">
              <div className="overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Total Pendaftar PPDB</span>
                    <span className="overview-card-value">{records.length}</span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(9, 30, 48, 0.08)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    📝
                  </div>
                </div>
              </div>
              <div className="overview-card accent">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Pendaftar Terverifikasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.status === 'Terverifikasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    ✅
                  </div>
                </div>
              </div>
              <div className="overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Zonasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Zonasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 166, 35, 0.1)', color: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    🗺️
                  </div>
                </div>
              </div>
              <div className="overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Afirmasi / Prestasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Afirmasi' || r.jalur_ppdb === 'Prestasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    🏆
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 'var(--space-md)' }}>
              <div className="settings-card">
                <h3>Selamat Datang di Panel Admin</h3>
                <p>Melalui panel kontrol ini, Anda memiliki akses penuh untuk mengelola pendaftaran PPDB daring, menambahkan berita kegiatan sekolah, memperbarui pengumuman berjalan, dan memantau statistik siswa yang ditampilkan di website SDN Bobong secara langsung.</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: 'var(--space-xs)' }}>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setActiveTab('ppdb')}>Lihat Data Pendaftar PPDB</button>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setActiveTab('content')}>Edit Teks Pengumuman</button>
                </div>
              </div>
              <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderColor: 'var(--secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-dark)' }}>Status Server & Database</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Koneksi Supabase Cloud saat ini:</p>
                <span className="badge" style={{
                  backgroundColor: dbStatus ? '#D1FAE5' : '#FEF3C7',
                  color: dbStatus ? '#059669' : '#D97706',
                  border: dbStatus ? '1px solid #A7F3D0' : '1px solid #FCD34D',
                  fontSize: '0.9rem',
                  padding: '0.4rem 0.8rem',
                  fontWeight: 700
                }}>
                  {dbStatus ? 'TERKONEKSI (Supabase)' : 'FALLBACK (Berkas JSON Lokal)'}
                </span>
              </div>
            </div>
          </section>

          {/* ================= TAB: PPDB MANAGEMENT ================= */}
          <section id="tab-ppdb" class={`tab-pane ${activeTab === 'ppdb' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar">
                <h3>Daftar Lengkap Formulir Masuk</h3>
                <a href="/api/ppdb?export=true" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  📥 Ekspor Data ke Excel/CSV
                </a>
              </div>

              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                      <th>Nama Siswa (NIK)</th>
                      <th>Orang Tua (HP)</th>
                      <th>Lahir / Kelamin</th>
                      <th>Jalur</th>
                      <th>Alamat Lengkap</th>
                      <th>Tanggal Daftar</th>
                      <th style={{ width: '140px' }}>Status</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.map((r, idx) => (
                        <tr key={r.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td>
                            <strong style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{r.nama_lengkap}</strong><br />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>NIK: {r.nik_siswa || r.nik}</span>
                          </td>
                          <td>
                            <span>Ibu: {r.nama_ibu_kandung || r.nama_ibu}</span><br />
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>📞 {r.nomor_hp_orangtua || r.no_hp}</span>
                          </td>
                          <td>
                            <span>{r.tempat_lahir}, {r.tanggal_lahir}</span><br />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.jenis_kelamin}</span>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: '#E8F0FE', color: 'var(--primary)', fontWeight: 600, padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>
                              {r.jalur_ppdb}
                            </span>
                          </td>
                          <td style={{ maxWidth: '200px', wordWrap: 'break-word', fontSize: '0.8rem' }}>{r.alamat_domisili || r.alamat}</td>
                          <td style={{ fontSize: '0.75rem' }}>{r.waktu_daftar}</td>
                          <td>
                            <select
                              value={r.status}
                              className={`status-badge-select ${r.status === 'Terverifikasi' ? 'verified' : r.status === 'Ditolak' ? 'rejected' : 'pending'}`}
                              onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            >
                              <option value="Diterima Sistem">Diterima Sistem</option>
                              <option value="Terverifikasi">Terverifikasi</option>
                              <option value="Ditolak">Ditolak</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button onClick={() => handlePPDBDelete(r.id)} type="button" className="btn-action-delete">Hapus</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data pendaftar calon siswa baru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ================= TAB: CONTENT CONTROL ================= */}
          <section id="tab-content" className={`tab-pane ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="settings-grid">
              {/* Announcements */}
              <div className="settings-card">
                <h3>Edit Pengumuman Berjalan (Marquee Banner)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Teks pengumuman di bawah akan ditampilkan di bagian paling atas halaman website utama publik. Anda dapat memasukkan hingga 3 pengumuman sekaligus.
                </p>

                <form onSubmit={handleAnnouncementsUpdate}>
                  <input type="hidden" name="action_type" value="announcements" />
                  {config.marquee_announcements && config.marquee_announcements.map((ann, idx) => (
                    <div key={idx} className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label htmlFor={`announcement_${idx}`}>Pengumuman #{idx + 1}</label>
                      <input
                        type="text"
                        id={`announcement_${idx}`}
                        name="announcements[]"
                        className="form-control"
                        defaultValue={ann}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  ))}
                  {(!config.marquee_announcements || config.marquee_announcements.length === 0) && (
                    [0, 1, 2].map((idx) => (
                      <div key={idx} className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor={`announcement_${idx}`}>Pengumuman #{idx + 1}</label>
                        <input
                          type="text"
                          id={`announcement_${idx}`}
                          name="announcements[]"
                          className="form-control"
                          style={{ width: '100%' }}
                          required
                        />
                      </div>
                    ))
                  )}

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)', padding: '0.5rem 1rem' }}>💾 Simpan Pengumuman</button>
                </form>
              </div>

              {/* Statistics counter */}
              <div className="settings-card">
                <h3>Update Statistik Sekolah (Counter)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Ubah data angka untuk indikator statistik sekolah yang ditampilkan di halaman beranda utama.
                </p>

                <form onSubmit={handleStatsUpdate}>
                  <input type="hidden" name="action_type" value="stats" />

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="siswa_aktif" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Siswa Aktif</label>
                    <input
                      type="number"
                      id="siswa_aktif"
                      name="siswa_aktif"
                      className="form-control"
                      defaultValue={config.stats?.siswa_aktif || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="guru_staf" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Guru & Staf</label>
                    <input
                      type="number"
                      id="guru_staf"
                      name="guru_staf"
                      className="form-control"
                      defaultValue={config.stats?.guru_staf || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ruang_kelas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Ruang Kelas</label>
                    <input
                      type="number"
                      id="ruang_kelas"
                      name="ruang_kelas"
                      className="form-control"
                      defaultValue={config.stats?.ruang_kelas || 0}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="akreditasi" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Akreditasi</label>
                    <input
                      type="text"
                      id="akreditasi"
                      name="akreditasi"
                      className="form-control"
                      defaultValue={config.stats?.akreditasi || 'B'}
                      maxLength={2}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary" style={{ marginTop: 'var(--space-xs)', width: '100%', padding: '0.5rem' }}>💾 Simpan Data Statistik</button>
                </form>
              </div>
            </div>
          </section>

          {/* ================= TAB: NEWS MANAGEMENT ================= */}
          <section id="tab-news" className={`tab-pane ${activeTab === 'news' ? 'active' : ''}`}>
            <div className="news-cms-grid">
              {/* Form News */}
              <div className="settings-card">
                <h3>Tambah Berita / Kegiatan Baru</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  Isi formulir untuk menerbitkan artikel berita terbaru mengenai aktivitas sekolah di halaman utama.
                </p>

                <form onSubmit={handleNewsAdd} encType="multipart/form-data">
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_title" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Judul Berita *</label>
                    <input
                      type="text"
                      id="news_title"
                      name="title"
                      className="form-control"
                      placeholder="Contoh: Pembagian Rapor Semester Genap"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="news_date" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tanggal Publikasi *</label>
                      <input
                        type="text"
                        id="news_date"
                        name="date"
                        className="form-control"
                        placeholder="Contoh: 20 Jun 2026"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="news_category" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Kategori *</label>
                      <input
                        type="text"
                        id="news_category"
                        name="category"
                        className="form-control"
                        placeholder="Contoh: Kegiatan, Prestasi"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_image" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Pilih Ilustrasi Bawaan *</label>
                    <select id="news_image" name="image" className="form-control" style={{ width: '100%' }} required>
                      <option value="/images/news_hari_guru.svg">Hari Guru Nasional (Merah/Gold)</option>
                      <option value="/images/news_imunisasi.svg">Program Imunisasi / BIAS (Biru Medis)</option>
                      <option value="/images/news_kerja_bakti.svg">Sabtu Bersih / Lingkungan (Hijau Alam)</option>
                      <option value="/images/news_rapat_komite.svg">Musyawarah / Komite (Biru/Orange)</option>
                    </select>
                    <div style={{ marginTop: '10px' }}>
                      <label htmlFor="news_photo" style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.9rem' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB):</label>
                      <input
                        type="file"
                        id="news_photo"
                        name="photo"
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleNewsPhotoChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="news_content" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Isi Lengkap Artikel Berita *</label>
                    <textarea
                      id="news_content"
                      name="content"
                      rows={6}
                      className="form-control"
                      placeholder="Tuliskan berita lengkap di sini..."
                      style={{ width: '100%', resize: 'vertical' }}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-xs)', width: '100%', padding: '0.65rem' }}>📢 Terbitkan Berita</button>
                </form>
              </div>

              {/* List News */}
              <div className="settings-card">
                <h3>Daftar Berita Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar warta yang saat ini sedang aktif di halaman Berita & Galeri. Anda dapat menghapusnya jika artikel sudah usang.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', maxHeight: '520px', overflowY: 'auto', paddingRight: '5px' }}>
                  {newsList.length > 0 ? (
                    newsList.map((n) => (
                      <div key={n.id} style={{ display: 'flex', gap: 'var(--space-sm)', border: '1px solid var(--border-color)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-sm)', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', minWidth: 0 }}>
                          <img src={n.image} alt="" style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date} • {n.category}</span>
                          </div>
                        </div>
                        <button onClick={() => handleNewsDelete(n.id)} type="button" className="btn-action-delete">Hapus</button>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginTop: 'var(--space-md)' }}>Belum ada berita yang diterbitkan.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================= TAB: TEACHERS MANAGEMENT ================= */}
          <section id="tab-teachers" className={`tab-pane ${activeTab === 'teachers' ? 'active' : ''}`}>
            <div className="news-cms-grid">
              {/* Table List of Teachers */}
              <div className="settings-card" style={{ overflowX: 'auto' }}>
                <h3>Daftar Guru & Staf Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar pendidik yang terbit di halaman profil publik. Klik tombol **Edit** untuk memuat datanya ke form di samping.
                </p>

                <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                  <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px', textAlign: 'center' }}>Foto</th>
                        <th>Nama Lengkap</th>
                        <th>Jabatan</th>
                        <th>Status</th>
                        <th style={{ width: '110px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length > 0 ? (
                        teachers.map((t) => (
                          <tr key={t.id}>
                            <td style={{ textAlign: 'center' }}>
                              <img src={t.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                            </td>
                            <td>
                              <strong style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{t.name}</strong>
                              {t.details && (
                                <><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.details}</span></>
                              )}
                            </td>
                            <td>{t.role}</td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: t.status === 'PNS' ? 'var(--primary)' : t.status === 'PPPK' ? '#E8FAF0' : '#FFF8E6',
                                color: t.status === 'PNS' ? 'white' : t.status === 'PPPK' ? '#20BA5A' : '#D48408',
                                fontWeight: 600,
                                padding: '0.2rem 0.4rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                                <Link href={`/admin/teachers/edit/${t.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}>
                                  Edit
                                </Link>
                                <button onClick={() => handleTeacherDelete(t.id)} type="button" className="btn-action-delete" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Belum ada data guru.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Add / Edit Teacher */}
              <div className="settings-card">
                <h3 id="form-teacher-title">Tambah Guru / Staf Baru</h3>
                <p id="form-teacher-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  Isi formulir berikut untuk menambahkan data pendidik baru ke halaman profil.
                </p>

                <form id="form-teacher" onSubmit={handleTeacherAdd} encType="multipart/form-data">
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="teacher_name" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      id="teacher_name"
                      name="name"
                      className="form-control"
                      placeholder="Contoh: Fatimah, S.Pd.SD."
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="teacher_role" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Jabatan / Peran *</label>
                      <input
                        type="text"
                        id="teacher_role"
                        name="role"
                        className="form-control"
                        placeholder="Contoh: Wali Kelas 1, Guru Agama"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="teacher_status" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Status Kepegawaian *</label>
                      <select id="teacher_status" name="status" className="form-control" style={{ width: '100%' }} required>
                        <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                        <option value="PPPK">PPPK</option>
                        <option value="Honorer Daerah">Honorer Daerah</option>
                        <option value="Honorer Sekolah">Honorer Sekolah</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="teacher_details" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Pangkat / Keterangan Lain (Opsional)</label>
                    <input
                      type="text"
                      id="teacher_details"
                      name="details"
                      className="form-control"
                      placeholder="Contoh: Pembina Tk. I / IV-b, Guru Kelas Bawah"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Foto / Avatar *</label>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                        <img id="avatar-preview" src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <select
                          id="teacher_image_select"
                          value={teacherImageSelect}
                          className="form-control"
                          onChange={handleTeacherImageSelectChange}
                          style={{ marginBottom: '5px', width: '100%' }}
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
                          name="image"
                          className="form-control"
                          value={teacherImageUrl}
                          placeholder="Masukkan URL / path gambar custom"
                          style={{ display: teacherImageSelect === 'custom' ? 'block' : 'none', width: '100%' }}
                          onChange={handleTeacherImageUrlChange}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <label htmlFor="teacher_photo" style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '0.9rem' }}>Atau Unggah Foto Baru (.png, maks 1MB):</label>
                      <input
                        type="file"
                        id="teacher_photo"
                        name="photo"
                        className="form-control"
                        accept="image/png"
                        onChange={handleTeacherPhotoChange}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                    <button type="submit" id="btn-submit-teacher" className="btn btn-primary" style={{ flex: 1, padding: '0.65rem' }}>💾 Simpan Data Guru</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
