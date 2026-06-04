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
      const record = records.find(r => r.id === recordId);
      const res = await fetch('/api/ppdb', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: recordId,
          nik: record ? (record.nik_siswa || record.nik) : null,
          status: newStatus
        })
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
      const record = records.find(r => r.id === recordId);
      const targetNik = record ? (record.nik_siswa || record.nik) : '';
      const res = await fetch(`/api/ppdb?id=${recordId}&nik=${targetNik}`, {
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .admin-dashboard-layout {
            --sidebar-width: 280px;
            --admin-bg: #f8fafc;
            --sidebar-bg: #0b0f19;
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --accent: #f59e0b;
            --emerald: #10b981;
            --rose: #ef4444;
            --violet: #8b5cf6;
            --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
            --card-shadow-hover: 0 20px 35px -5px rgba(99, 102, 241, 0.08), 0 10px 15px -5px rgba(99, 102, 241, 0.03);
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --radius-lg: 16px;
            --radius-md: 12px;
            --radius-sm: 8px;

            background-color: var(--admin-bg);
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--text-main);
            display: flex;
            height: 100vh;
            overflow: hidden;
            width: 100%;
        }
        .sidebar {
            width: var(--sidebar-width);
            background: linear-gradient(180deg, #0b0f19 0%, #0f172a 100%);
            color: #ffffff;
            position: fixed;
            top: 80px;
            bottom: 0;
            left: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255, 255, 255, 0.06);
            box-shadow: 10px 0 40px rgba(0, 0, 0, 0.25);
            transition: var(--transition-smooth);
        }
        .sidebar-brand {
            padding: 1.75rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 0.85rem;
        }
        .sidebar-brand img {
            width: 40px;
            height: 40px;
            filter: drop-shadow(0 4px 10px rgba(99, 102, 241, 0.3));
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            padding: 2px;
        }
        .sidebar-brand span {
            font-weight: 800;
            font-size: 1.15rem;
            letter-spacing: 0.05em;
            background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .sidebar-menu {
            list-style: none;
            padding: 1.5rem 0;
            margin: 0;
            flex: 1;
            overflow-y: auto;
        }
        .sidebar-menu::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-menu::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }
        .sidebar-item {
            margin-bottom: 6px;
            padding: 0 16px;
        }
        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.85rem 1.15rem;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: var(--transition-smooth);
            border-radius: var(--radius-md);
            cursor: pointer;
            border: 1px solid transparent;
        }
        .sidebar-link svg {
            width: 20px;
            height: 20px;
            color: #64748b;
            transition: var(--transition-smooth);
        }
        .sidebar-link:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transform: translateX(4px);
        }
        .sidebar-link:hover svg {
            color: #ffffff;
        }
        .sidebar-link.active {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.03) 100%);
            border: 1px solid rgba(99, 102, 241, 0.3);
            font-weight: 700;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
        }
        .sidebar-link.active svg {
            color: #818cf8;
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
        }
        .sidebar-footer {
            padding: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: #060910;
        }
        .btn-logout {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.875rem;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }
        .btn-logout svg {
            width: 18px;
            height: 18px;
        }
        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        }
        .main-wrapper {
            margin-left: var(--sidebar-width);
            margin-top: 80px;
            flex: 1;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 80px);
            overflow: hidden;
            background-color: var(--admin-bg);
        }
        .top-navbar {
            height: 80px;
            background-color: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2.5rem;
            padding-left: calc(var(--sidebar-width) + 2.5rem);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 110;
            box-sizing: border-box;
            transition: var(--transition-smooth);
        }
        .top-title h1 {
            font-size: 1.35rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.02em;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            color: #334155;
        }
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
            position: relative;
        }
        .user-avatar::after {
            content: '';
            position: absolute;
            bottom: 1px;
            right: 1px;
            width: 8px;
            height: 8px;
            background-color: var(--emerald);
            border: 1.5px solid white;
            border-radius: 50%;
        }
        .content-body {
            padding: 2rem 2.5rem;
            flex: 1;
            overflow-y: auto;
        }
        .content-body::-webkit-scrollbar {
            width: 6px;
        }
        .content-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .content-body::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        .content-body::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        .alert-toast {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 9999;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid transparent;
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 400px;
            backdrop-filter: blur(12px);
        }
        @keyframes slideInRight {
            from { transform: translateX(120%) scale(0.95); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        .alert-toast-success {
            background-color: rgba(236, 253, 245, 0.95);
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .alert-toast-danger {
            background-color: rgba(254, 242, 242, 0.95);
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .tab-pane {
            display: none;
            animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .overview-card {
            background-color: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
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
        }
        .overview-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
        }
        .overview-card.accent::after {
            background: linear-gradient(180deg, var(--emerald) 0%, #059669 100%);
        }
        .overview-card.warning::after {
            background: linear-gradient(180deg, var(--accent) 0%, #d97706 100%);
        }
        .overview-card.purple::after {
            background: linear-gradient(180deg, var(--violet) 0%, #7c3aed 100%);
        }
        .overview-card-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
            display: block;
        }
        .overview-card-value {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1;
            letter-spacing: -0.03em;
        }
        .pulse-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
            vertical-align: middle;
        }
        .pulse-dot.green {
            background-color: #10b981;
            animation: pulse-green 2s infinite;
        }
        .pulse-dot.amber {
            background-color: #f59e0b;
            animation: pulse-amber 2s infinite;
        }
        @keyframes pulse-green {
            0% {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
        }
        @keyframes pulse-amber {
            0% {
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
            }
            70% {
                box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
            }
        }
        .admin-table {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        .table-toolbar {
            padding: 1.5rem;
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .table-toolbar h3 {
            margin: 0;
            font-size: 1.15rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
        }
        .table-custom {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #ffffff;
            font-size: 0.85rem;
            text-align: left;
        }
        .table-custom th {
            background-color: #f8fafc;
            color: #475569;
            padding: 1rem 1.25rem;
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
        }
        .table-custom td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            color: #475569;
            vertical-align: middle;
        }
        .table-custom tr:hover td {
            background-color: #f8fafc;
        }
        .table-custom tr:last-child td {
            border-bottom: none;
        }
        .table-responsive {
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid #e2e8f0;
            margin: 0 1.5rem 1.5rem 1.5rem;
        }
        .status-badge-select {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 9999px;
            border: 1px solid transparent;
            cursor: pointer;
            outline: none;
            transition: var(--transition-smooth);
            appearance: none;
            -webkit-appearance: none;
            text-align: center;
        }
        .status-badge-select.pending {
            background-color: #fef3c7;
            color: #d97706;
            border-color: #fcd34d;
        }
        .status-badge-select.verified {
            background-color: #d1fae5;
            color: #059669;
            border-color: #6ee7b7;
        }
        .status-badge-select.rejected {
            background-color: #fee2e2;
            color: #dc2626;
            border-color: #fca5a5;
        }
        .status-badge-select:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            border-color: var(--primary);
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
            padding: 1.75rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            margin-bottom: 1.5rem;
        }
        .settings-card h3 {
            margin-top: 0;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.75rem;
            margin-bottom: 1.25rem;
            color: #0f172a;
            font-weight: 800;
            font-size: 1.15rem;
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
            border-radius: var(--radius-md);
            font-weight: 700;
            transition: var(--transition-smooth);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            padding: 0.65rem 1.25rem;
            font-size: 0.875rem;
            gap: 0.5rem;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn:active {
            transform: translateY(0);
        }
        .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        .btn-primary:hover {
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3);
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        }
        .btn-secondary {
            background-color: #f1f5f9;
            color: #334155;
            border: 1px solid #e2e8f0;
        }
        .btn-secondary:hover {
            background-color: #e2e8f0;
            color: #0f172a;
        }
        .btn-action-delete {
            background-color: #fee2e2;
            color: #ef4444;
            border: 1px solid #fca5a5;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.8rem;
            font-weight: 700;
        }
        .btn-action-delete:hover {
            background-color: #ef4444;
            color: white;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
            transform: translateY(-1px);
        }
        .form-control {
            border-radius: var(--radius-md);
            border: 1.5px solid #cbd5e1;
            padding: 0.7rem 1rem;
            font-family: inherit;
            transition: var(--transition-smooth);
            outline: none;
            font-size: 0.9rem;
            box-sizing: border-box;
            background: #ffffff;
            width: 100%;
            color: #0f172a;
        }
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 0.8rem;
            color: #475569;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .grid-2 {
                grid-template-columns: 1.2fr 0.8fr;
            }
        }
        .badge {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px;
            padding: 0.35rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 700;
        }
        @media (max-width: 768px) {
            .sidebar {
                width: 80px;
                top: 80px;
            }
            .sidebar-brand span, .sidebar-link span:last-child, .sidebar-footer button span:last-child {
                display: none;
            }
            .sidebar-brand {
                justify-content: center;
                padding: 1.5rem 0;
            }
            .sidebar-link {
                justify-content: center;
                padding: 1rem 0;
            }
            .main-wrapper {
                margin-left: 80px;
                margin-top: 80px;
                height: calc(100vh - 80px);
            }
            .top-navbar {
                padding-left: calc(80px + 1.5rem);
                padding-right: 1.5rem;
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <span>Ringkasan</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'ppdb' ? 'active' : ''}`} onClick={() => setActiveTab('ppdb')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span>Kelola PPDB</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span>Pengumuman & Stat</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
              <span>Kelola Berita</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 12 15c2.207 0 4.208.576 5.963 1.584ZM18 3.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3.193 9.48a9.011 9.011 0 0 1-6.078-.02A3.356 3.356 0 0 0 3 18.228a11.94 11.94 0 0 0 10.373 5.485c.01 0 .02 0 .03-.001-.13-.761-.203-1.547-.203-2.348 0-1.923.633-3.697 1.706-5.122Z" />
              </svg>
              <span>Kelola Guru & Staf</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <form onSubmit={handleLogout}>
            <button type="submit" className="btn-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
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
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
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
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card warning">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Zonasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Zonasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-6-1.25L3.61 18A.75.75 0 0 1 2.625 17.3V6.75a.75.75 0 0 1 .367-.65L9 2.75m0 12.75 6-3.75m0 3.75 6.39 3.05a.75.75 0 0 0 .993-.7V6.75a.75.75 0 0 0-.367-.65L15 2.75m0 9.5-6-3.75" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="overview-card purple">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Jalur Afirmasi / Prestasi</span>
                    <span className="overview-card-value">
                      {records.filter(r => r.jalur_ppdb === 'Afirmasi' || r.jalur_ppdb === 'Prestasi').length}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.75a1.125 1.125 0 0 1-1.125-1.125V11.25M9 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.75A1.125 1.125 0 0 1 12 13.125V11.25m-1.5-6h3a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
              <div className="settings-card">
                <h3>Selamat Datang di Panel Admin</h3>
                <p>Melalui panel kontrol ini, Anda memiliki akses penuh untuk mengelola pendaftaran PPDB daring, menambahkan berita kegiatan sekolah, memperbarui pengumuman berjalan, dan memantau statistik siswa yang ditampilkan di website SDN Bobong secara langsung.</p>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} onClick={() => setActiveTab('ppdb')}>Lihat Data PPDB</button>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }} onClick={() => setActiveTab('content')}>Edit Pengumuman</button>
                </div>
              </div>
              <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderColor: '#e2e8f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💻</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 800 }}>Status Server & Database</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sistem sinkronisasi data PPDB aktif:</p>
                <span className="badge" style={{
                  backgroundColor: dbStatus ? '#d1fae5' : '#fef3c7',
                  color: dbStatus ? '#065f46' : '#92400e',
                  border: dbStatus ? '1px solid #a7f3d0' : '1px solid #fcd34d',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 700
                }}>
                  <span className={`pulse-dot ${dbStatus ? 'green' : 'amber'}`}></span>
                  {dbStatus ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL CACHE ACTIVE (JSON)'}
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
