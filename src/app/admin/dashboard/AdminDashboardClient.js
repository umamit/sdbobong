'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Client-side image compression using HTML5 Canvas (Zero-dependency, lightweight)
const compressImage = (file, maxW = 1920, maxH = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(file);
      return;
    }

    // Skip if not a compressable image or is vector/animated format (SVG, GIF)
    const isImage = file.type.startsWith('image/');
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    if (!isImage || isSvg || isGif) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down dimensions if exceeding max boundaries
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Use compressed file only if it's smaller than the original
          if (blob.size < file.size) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export default function AdminDashboardClient({
  initialConfig,
  initialNewsList,
  initialTeachers,
  initialAchievements,
  initialRecords,
  dbStatus,
  initialStorageInfo = {
    supabaseSize: 0,
    localSize: 0,
    supabaseFormatted: '0 B',
    localFormatted: '0 B',
    totalSize: 0,
    totalFormatted: '0 B',
    isSupabaseActive: false
  },
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState(initialRecords);
  const [config, setConfig] = useState(initialConfig);
  const [newsList, setNewsList] = useState(initialNewsList);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [achievements, setAchievements] = useState(initialAchievements || []);
  const [toast, setToast] = useState(null);
  const [storageInfo, setStorageInfo] = useState(initialStorageInfo);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetNik, setDeleteTargetNik] = useState('');
  const [deleteTargetName, setDeleteTargetName] = useState('');
  const [deleteIsBulk, setDeleteIsBulk] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);

  // States for Page Contents dynamic editor
  const [pageContents, setPageContents] = useState({});
  const [activePageSubTab, setActivePageSubTab] = useState('beranda');
  
  const [sejarahFile, setSejarahFile] = useState(null);
  const [sejarahPreview, setSejarahPreview] = useState('');
  const [kurikulumFile, setKurikulumFile] = useState(null);
  const [kurikulumPreview, setKurikulumPreview] = useState('');
  const [ekskulFiles, setEkskulFiles] = useState({});
  const [ekskulPreviews, setEkskulPreviews] = useState({});
  const [galleryFiles, setGalleryFiles] = useState({});
  const [galleryPreviews, setGalleryPreviews] = useState({});

  // ================= NEW STATES FOR PREMIUM DASHBOARD UPGRADES =================
  // PPDB Filter & Pagination
  const [ppdbSearch, setPpdbSearch] = useState('');
  const [ppdbFilterJalur, setPpdbFilterJalur] = useState('Semua');
  const [ppdbFilterStatus, setPpdbFilterStatus] = useState('Semua');
  const [ppdbPage, setPpdbPage] = useState(1);
  const [ppdbPerPage, setPpdbPerPage] = useState(10);

  // PPDB Detailed View
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Admin Account Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Agenda Management
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = add, else = event object
  const [eventTitle, setEventTitle] = useState('');
  const [eventDates, setEventDates] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventMonth, setEventMonth] = useState('Juli 2025');

  useEffect(() => {
    if (config?.stats?.page_contents) {
      setPageContents(config.stats.page_contents);
    }
  }, [config]);

  const normalizeTeacherName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/\b(s\.?pd\.?|m\.?pd\.?|s\.?kom\.?|gr\.?|h\.)\b/gi, "")
      .replace(/[^a-z0-9]/gi, "")
      .trim();
  };

  const syncNipHumas = (() => {
    const name = config.ppdb_contacts?.nama_humas || "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(name));
    return matched ? matched.nip : (config.ppdb_contacts?.nip_humas || "");
  })();

  const syncNipOperator = (() => {
    const name = config.ppdb_contacts?.nama_operator || "";
    const matched = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(name));
    return matched ? matched.nip : (config.ppdb_contacts?.nip_operator || "");
  })();

  const handleFieldChange = (page, key, value) => {
    setPageContents(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [key]: value
      }
    }));
  };

  const handleAddCalendar = () => {
    const current = pageContents.akademik?.calendar || [];
    const updated = [...current, { id: 'cal_' + Date.now(), month: '', dates: '', desc: '' }];
    handleFieldChange('akademik', 'calendar', updated);
  };
  const handleUpdateCalendar = (index, key, val) => {
    const updated = [...(pageContents.akademik?.calendar || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('akademik', 'calendar', updated);
  };
  const handleRemoveCalendar = (index) => {
    const updated = (pageContents.akademik?.calendar || []).filter((_, i) => i !== index);
    handleFieldChange('akademik', 'calendar', updated);
  };

  const handleAddSeragam = () => {
    const current = pageContents.akademik?.seragam || [];
    const updated = [...current, { days: '', type: '', details: '' }];
    handleFieldChange('akademik', 'seragam', updated);
  };
  const handleUpdateSeragam = (index, key, val) => {
    const updated = [...(pageContents.akademik?.seragam || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('akademik', 'seragam', updated);
  };
  const handleRemoveSeragam = (index) => {
    const updated = (pageContents.akademik?.seragam || []).filter((_, i) => i !== index);
    handleFieldChange('akademik', 'seragam', updated);
  };

  const handleAddEkskul = () => {
    const current = pageContents.kesiswaan?.ekstrakurikuler || [];
    const updated = [...current, { id: 'ekskul_' + Date.now(), nama: '', deskripsi: '', jadwal: '', is_wajib: false, image: '/images/ekskul_pramuka.svg' }];
    handleFieldChange('kesiswaan', 'ekstrakurikuler', updated);
  };
  const handleUpdateEkskul = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.ekstrakurikuler || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'ekstrakurikuler', updated);
  };
  const handleRemoveEkskul = (index) => {
    const updated = (pageContents.kesiswaan?.ekstrakurikuler || []).filter((_, i) => i !== index);
    handleFieldChange('kesiswaan', 'ekstrakurikuler', updated);
  };

  const handleAddKesiswaanPrestasi = () => {
    const current = pageContents.kesiswaan?.prestasi || [];
    const updated = [...current, { rank: '', title: '', level: '', desc: '', icon: '🏆' }];
    handleFieldChange('kesiswaan', 'prestasi', updated);
  };
  const handleUpdateKesiswaanPrestasi = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.prestasi || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'prestasi', updated);
  };
  const handleRemoveKesiswaanPrestasi = (index) => {
    const updated = (pageContents.kesiswaan?.prestasi || []).filter((_, i) => i !== index);
    handleFieldChange('kesiswaan', 'prestasi', updated);
  };

  const handleAddKarya = () => {
    const current = pageContents.kesiswaan?.karya || [];
    const updated = [...current, { icon: '🎨', title: '', category: '', desc: '' }];
    handleFieldChange('kesiswaan', 'karya', updated);
  };
  const handleUpdateKarya = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.karya || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'karya', updated);
  };
  const handleRemoveKarya = (index) => {
    const updated = (pageContents.kesiswaan?.karya || []).filter((_, i) => i !== index);
    handleFieldChange('kesiswaan', 'karya', updated);
  };

  const handleAddPPDBFaq = () => {
    const current = pageContents.ppdb?.faq || [];
    const updated = [...current, { q: '', a: '' }];
    handleFieldChange('ppdb', 'faq', updated);
  };
  const handleUpdatePPDBFaq = (index, key, val) => {
    const updated = [...(pageContents.ppdb?.faq || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('ppdb', 'faq', updated);
  };
  const handleRemovePPDBFaq = (index) => {
    const updated = (pageContents.ppdb?.faq || []).filter((_, i) => i !== index);
    handleFieldChange('ppdb', 'faq', updated);
  };
  
  const handleAddGalleryItem = () => {
    const current = pageContents.galeri?.gallery_items || [
      { id: 'gallery_1', src: '/images/gallery_1.svg', alt: 'Suasana Belajar di Ruang Kelas Baru' },
      { id: 'gallery_2', src: '/images/gallery_2.svg', alt: 'Upacara Bendera Hari Senin' },
      { id: 'gallery_3', src: '/images/gallery_3.svg', alt: 'Latihan Tari Tradisional Maluku Utara' },
      { id: 'gallery_4', src: '/images/gallery_4.svg', alt: 'Praktek Pembelajaran Olahraga di Lapangan' },
      { id: 'gallery_5', src: '/images/gallery_5.svg', alt: 'Kegiatan Membaca Buku di Perpustakaan' },
      { id: 'gallery_6', src: '/images/gallery_6.svg', alt: 'Pemberian Materi Kemah Pramuka' }
    ];
    const updated = [...current, { id: 'g_' + Date.now(), src: '/images/gallery_1.svg', alt: '' }];
    handleFieldChange('galeri', 'gallery_items', updated);
  };

  const handleUpdateGalleryItem = (index, key, val) => {
    const current = pageContents.galeri?.gallery_items || [
      { id: 'gallery_1', src: '/images/gallery_1.svg', alt: 'Suasana Belajar di Ruang Kelas Baru' },
      { id: 'gallery_2', src: '/images/gallery_2.svg', alt: 'Upacara Bendera Hari Senin' },
      { id: 'gallery_3', src: '/images/gallery_3.svg', alt: 'Latihan Tari Tradisional Maluku Utara' },
      { id: 'gallery_4', src: '/images/gallery_4.svg', alt: 'Praktek Pembelajaran Olahraga di Lapangan' },
      { id: 'gallery_5', src: '/images/gallery_5.svg', alt: 'Kegiatan Membaca Buku di Perpustakaan' },
      { id: 'gallery_6', src: '/images/gallery_6.svg', alt: 'Pemberian Materi Kemah Pramuka' }
    ];
    const updated = [...current];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('galeri', 'gallery_items', updated);
  };

  const handleRemoveGalleryItem = (index) => {
    const current = pageContents.galeri?.gallery_items || [
      { id: 'gallery_1', src: '/images/gallery_1.svg', alt: 'Suasana Belajar di Ruang Kelas Baru' },
      { id: 'gallery_2', src: '/images/gallery_2.svg', alt: 'Upacara Bendera Hari Senin' },
      { id: 'gallery_3', src: '/images/gallery_3.svg', alt: 'Latihan Tari Tradisional Maluku Utara' },
      { id: 'gallery_4', src: '/images/gallery_4.svg', alt: 'Praktek Pembelajaran Olahraga di Lapangan' },
      { id: 'gallery_5', src: '/images/gallery_5.svg', alt: 'Kegiatan Membaca Buku di Perpustakaan' },
      { id: 'gallery_6', src: '/images/gallery_6.svg', alt: 'Pemberian Materi Kemah Pramuka' }
    ];
    const updated = current.filter((_, i) => i !== index);
    handleFieldChange('galeri', 'gallery_items', updated);
  };

  const handleGalleryFileChange = (index, file) => {
    if (file) {
      setGalleryFiles(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => ({ ...prev, [index]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPPDBJadwal = () => {
    const current = pageContents.ppdb?.jadwal || [];
    const updated = [...current, { activity: '', dates: '' }];
    handleFieldChange('ppdb', 'jadwal', updated);
  };
  const handleUpdatePPDBJadwal = (index, key, val) => {
    const updated = [...(pageContents.ppdb?.jadwal || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('ppdb', 'jadwal', updated);
  };
  const handleRemovePPDBJadwal = (index) => {
    const updated = (pageContents.ppdb?.jadwal || []).filter((_, i) => i !== index);
    handleFieldChange('ppdb', 'jadwal', updated);
  };

  const handlePageContentsSave = async (pageName, updatedData, fileFields = {}) => {
    try {
      const formData = new FormData();
      formData.append('action_type', 'update_page_contents');
      formData.append('page_name', pageName);
      formData.append('page_data', JSON.stringify(updatedData));
      
      showToast('info', 'Menyiapkan berkas media...');

      // Append any file uploads, compressing images on the fly
      for (const key of Object.keys(fileFields)) {
        if (fileFields[key]) {
          const file = fileFields[key];
          if (file instanceof File) {
            const compressed = await compressImage(file);
            formData.append(key, compressed);
          } else {
            formData.append(key, file);
          }
        }
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Konten halaman ${pageName.toUpperCase()} berhasil diperbarui!`);
        setConfig(data.config);
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan konten halaman.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const submitPageContents = async (pageName) => {
    const dataToSave = { ...pageContents[pageName] };
    const filesToUpload = {};

    if (pageName === 'profil') {
      if (sejarahFile) {
        filesToUpload['sejarah_image_file'] = sejarahFile;
      }
    } else if (pageName === 'akademik') {
      if (kurikulumFile) {
        filesToUpload['kurikulum_image_file'] = kurikulumFile;
      }
    } else if (pageName === 'kesiswaan') {
      Object.keys(ekskulFiles).forEach(index => {
        filesToUpload[`ekskul_image_${index}`] = ekskulFiles[index];
      });
    } else if (pageName === 'galeri') {
      Object.keys(galleryFiles).forEach(index => {
        const items = dataToSave.gallery_items || [];
        const item = items[index];
        if (item && item.id) {
          filesToUpload[`gallery_image_id_${item.id}`] = galleryFiles[index];
        } else {
          filesToUpload[`gallery_image_index_${index}`] = galleryFiles[index];
        }
      });
    }

    await handlePageContentsSave(pageName, dataToSave, filesToUpload);
    
    if (pageName === 'profil') {
      setSejarahFile(null);
    } else if (pageName === 'akademik') {
      setKurikulumFile(null);
    } else if (pageName === 'kesiswaan') {
      setEkskulFiles({});
    } else if (pageName === 'galeri') {
      setGalleryFiles({});
      setGalleryPreviews({});
    }
  };

  // States for Achievements form
  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [achTitle, setAchTitle] = useState('');
  const [achLevel, setAchLevel] = useState('Tingkat Kabupaten');
  const [achYear, setAchYear] = useState('');
  const [achDescription, setAchDescription] = useState('');

  // States for Teacher form preview
  const [teacherImageSelect, setTeacherImageSelect] = useState('/images/teacher_1.png');
  const [teacherImageUrl, setTeacherImageUrl] = useState('/images/teacher_1.png');
  const [avatarPreview, setAvatarPreview] = useState('/images/teacher_1.png');

  // States for Edit Teacher Modal
  const [editTeacherModalOpen, setEditTeacherModalOpen] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('PNS');
  const [editDetails, setEditDetails] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editTeacherImageSelect, setEditTeacherImageSelect] = useState('');
  const [editTeacherImageUrl, setEditTeacherImageUrl] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState('');
  const [showTeacherUrlInput, setShowTeacherUrlInput] = useState(false);
  const [showEditTeacherUrlInput, setShowEditTeacherUrlInput] = useState(false);

  const handleSejarahFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSejarahFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSejarahPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKurikulumFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKurikulumFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKurikulumPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEkskulFileChange = (index, file) => {
    if (file) {
      setEkskulFiles(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEkskulPreviews(prev => ({ ...prev, [index]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  // Load active tab from URL query param if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  // Sync body class with detail modal open state for robust print preview styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDetailModalOpen) {
        document.body.classList.add('print-detail-open');
      } else {
        document.body.classList.remove('print-detail-open');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('print-detail-open');
      }
    };
  }, [isDetailModalOpen]);

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
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui status pendaftaran.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const sendWhatsAppNotification = (record) => {
    if (!record) return;
    const phone = record.nomor_hp_orangtua || record.no_hp || '';
    if (!phone) {
      showToast('danger', 'Gagal: Nomor HP orang tua tidak ditemukan.');
      return;
    }

    // Format phone to international format 62...
    let cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '62' + cleanedPhone.slice(1);
    } else if (cleanedPhone.startsWith('62')) {
      // already correct
    } else if (cleanedPhone.length > 0) {
      cleanedPhone = '62' + cleanedPhone;
    }

    if (!cleanedPhone) {
      showToast('danger', 'Gagal: Nomor HP tidak valid.');
      return;
    }

    let message = '';
    const studentName = record.nama_lengkap || '';
    const nik = record.nik_siswa || record.nik || '';

    if (record.status === 'Diterima Sistem') {
      message = `Halo Bapak/Ibu Orang Tua dari *${studentName}*,\n\nKami menginformasikan bahwa berkas pendaftaran PPDB TA 2026/2027 di SD Negeri Bobong atas nama anak Anda telah kami terima dalam sistem dengan NIK: *${nik}*.\n\nHarap menunggu proses verifikasi berkas lebih lanjut oleh panitia sekolah. Terima kasih. 🙏\n\n-- Panitia PPDB SDN Bobong`;
    } else if (record.status === 'Terverifikasi') {
      message = `Selamat Bapak/Ibu Orang Tua dari *${studentName}*! 🎉\n\nBerkas pendaftaran PPDB TA 2026/2027 anak Anda di SD Negeri Bobong dengan NIK: *${nik}* dinyatakan *TERVERIFIKASI & MEMENUHI SYARAT*.\n\nMohon pantau pengumuman kelulusan akhir di portal PPDB kami secara berkala. Terima kasih. 😊\n\n-- Panitia PPDB SDN Bobong`;
    } else if (record.status === 'Ditolak') {
      message = `Halo Bapak/Ibu Orang Tua dari *${studentName}*,\n\nKami menginformasikan bahwa berkas pendaftaran PPDB TA 2026/2027 di SD Negeri Bobong atas nama anak Anda saat ini dinyatakan *DITOLAK / BELUM MEMENUHI SYARAT*.\n\nSilakan periksa kembali kelengkapan berkas Anda atau hubungi sekretariat panitia PPDB sekolah untuk informasi lebih lanjut. Terima kasih.\n\n-- Panitia PPDB SDN Bobong`;
    } else {
      message = `Halo Bapak/Ibu Orang Tua dari *${studentName}*,\n\nHubungi Panitia PPDB SD Negeri Bobong terkait status pendaftaran anak Anda dengan NIK: *${nik}*. Terima kasih.`;
    }

    const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    showToast('success', `Membuka WhatsApp untuk mengirim notifikasi ke nomor ${cleanedPhone}`);
  };

  const handlePPDBDelete = (recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;
    setDeleteTargetId(recordId);
    setDeleteTargetNik(record.nik_siswa || record.nik || '');
    setDeleteTargetName(record.nama_lengkap || '');
    setDeleteIsBulk(false);
    setDeleteModalOpen(true);
  };

  const handleDeleteAllPPDB = () => {
    setDeleteTargetId('all');
    setDeleteTargetNik('');
    setDeleteTargetName('Semua Pendaftar');
    setDeleteIsBulk(true);
    setDeleteModalOpen(true);
  };

  const executeDelete = async (scope) => {
    try {
      if (deleteIsBulk) {
        // Bulk delete
        const res = await fetch(`/api/ppdb?all=true&scope=${scope}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok) {
          showToast('success', `Semua data pendaftar berhasil dihapus secara permanen (Metode: ${scope === 'both' ? 'Lokal & Supabase' : scope === 'local' ? 'Hanya Lokal' : 'Hanya Supabase'}).`);
          setRecords([]);
          router.refresh();
        } else {
          showToast('danger', data.error || 'Gagal menghapus semua data pendaftaran.');
        }
      } else {
        // Individual delete
        const res = await fetch(`/api/ppdb?id=${deleteTargetId}&nik=${deleteTargetNik}&scope=${scope}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok) {
          showToast('success', `Data pendaftar berhasil dihapus secara permanen (Metode: ${scope === 'both' ? 'Lokal & Supabase' : scope === 'local' ? 'Hanya Lokal' : 'Hanya Supabase'}).`);
          setRecords(prev => prev.filter(r => r.id !== deleteTargetId));
          router.refresh();
        } else {
          showToast('danger', data.error || 'Gagal menghapus data pendaftaran.');
        }
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      // Close modal and reset state
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetNik('');
      setDeleteTargetName('');
      setDeleteIsBulk(false);
      setBulkDeleteConfirmText('');
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
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // ================= NEW PREMIUM HANDLERS =================
  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('danger', 'Konfirmasi password baru tidak cocok!');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Password admin berhasil diubah!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast('danger', data.error || 'Gagal mengubah password.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Export Website Configuration Backup (JSON)
  const handleBackupExport = () => {
    try {
      const backupData = {
        version: '1.0',
        date: new Date().toISOString(),
        config: config,
        newsList: newsList,
        teachers: teachers,
        achievements: achievements
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `backup_sdn_bobong_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Berkas cadangan konfigurasi (JSON) berhasil diunduh!');
    } catch (err) {
      showToast('danger', 'Gagal melakukan ekspor: ' + err.message);
    }
  };

  // Import Website Configuration Backup (JSON)
  const handleBackupRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        if (!backupData.config || typeof backupData.config !== 'object') {
          showToast('danger', 'Berkas cadangan tidak valid atau tidak memiliki format yang benar!');
          return;
        }

        const res = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'restore_backup',
            config: backupData.config,
            newsList: backupData.newsList || null,
            teachers: backupData.teachers || null,
            achievements: backupData.achievements || null
          })
        });

        const data = await res.json();
        if (res.ok) {
          showToast('success', 'Konfigurasi website berhasil dipulihkan dari berkas cadangan!');
          setConfig(data.config);
          if (data.config?.stats?.page_contents) {
            setPageContents(data.config.stats.page_contents);
          }
          
          // Also optionally restore lists if available in backup / response
          if (data.newsList) {
            setNewsList(data.newsList);
          } else if (backupData.newsList) {
            setNewsList(backupData.newsList);
          }

          if (data.teachers) {
            setTeachers(data.teachers);
          } else if (backupData.teachers) {
            setTeachers(backupData.teachers);
          }

          if (data.achievements) {
            setAchievements(data.achievements);
          } else if (backupData.achievements) {
            setAchievements(backupData.achievements);
          }
          router.refresh();
        } else {
          showToast('danger', data.error || 'Gagal memulihkan dari berkas cadangan.');
        }
      } catch (err) {
        showToast('danger', 'Gagal membaca berkas cadangan: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  // Agenda Event Save Handler
  const handleSaveAgendaEvent = async (e) => {
    e.preventDefault();
    const currentCalendar = pageContents.akademik?.calendar || [];
    let updatedCalendar = [];

    if (editingEvent) {
      // Edit existing event
      updatedCalendar = currentCalendar.map(evt =>
        evt.id === editingEvent.id
          ? { ...evt, month: eventMonth, dates: eventDates, desc: eventDesc }
          : evt
      );
    } else {
      // Add new event
      const newEvt = {
        id: 'cal_' + Date.now(),
        month: eventMonth,
        dates: eventDates,
        desc: eventDesc
      };
      updatedCalendar = [...currentCalendar, newEvt];
    }

    const updatedAkademik = {
      ...pageContents.akademik,
      calendar: updatedCalendar
    };

    setPageContents(prev => ({
      ...prev,
      akademik: updatedAkademik
    }));

    await handlePageContentsSave('akademik', updatedAkademik);

    setAgendaModalOpen(false);
    setEditingEvent(null);
    setEventDates('');
    setEventDesc('');
  };

  // Agenda Event Delete Handler
  const handleDeleteAgendaEvent = async (eventId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) return;

    const currentCalendar = pageContents.akademik?.calendar || [];
    const updatedCalendar = currentCalendar.filter(evt => evt.id !== eventId);

    const updatedAkademik = {
      ...pageContents.akademik,
      calendar: updatedCalendar
    };

    setPageContents(prev => ({
      ...prev,
      akademik: updatedAkademik
    }));

    await handlePageContentsSave('akademik', updatedAkademik);
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
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data statistik.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleHeroBgUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fileInput = form.hero_bg_image;
    const file = fileInput.files?.[0];

    if (!file) {
      showToast('danger', 'Silakan pilih berkas terlebih dahulu.');
      return;
    }

    // Client-side validation for video duration
    if (file.type.startsWith('video/')) {
      const checkVideoDuration = () => {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
          };
          video.onerror = () => {
            resolve(-1);
          };
          video.src = window.URL.createObjectURL(file);
        });
      };

      const duration = await checkVideoDuration();
      if (duration === -1) {
        showToast('danger', 'Format video tidak terbaca atau rusak.');
        return;
      }
      if (duration > 10.5) { // 10.5 second buffer
        showToast('danger', `Durasi video adalah ${duration.toFixed(1)} detik. Maksimal durasi video yang diperbolehkan adalah 10 detik!`);
        return;
      }

      // Friendly educational warning for large videos > 3MB
      if (file.size > 3 * 1024 * 1024) {
        showToast('warning', 'Pemberitahuan: Ukuran berkas video cukup besar (>3MB). Sangat disarankan untuk mengompresi video terlebih dahulu sebelum mengunggah agar halaman beranda tetap ringan dimuat oleh pengunjung.');
      }
    }

    let uploadFile = file;
    if (file.type.startsWith('image/')) {
      showToast('info', 'Sedang mengompresi gambar latar belakang...');
      uploadFile = await compressImage(file);
    }

    // Limit maximum file size (20MB for video, 2MB for image after compression)
    const maxSize = uploadFile.type.startsWith('video/') ? 20 * 1024 * 1024 : 2 * 1024 * 1024;
    if (uploadFile.size > maxSize) {
      const sizeLabel = uploadFile.type.startsWith('video/') ? '20MB' : '2MB';
      showToast('danger', `Ukuran berkas melebihi batas maksimal (${sizeLabel}). Silakan kompresi berkas terlebih dahulu.`);
      return;
    }

    const formData = new FormData(form);
    formData.set('hero_bg_image', uploadFile);

    try {
      showToast('info', 'Sedang mengunggah berkas...');
      const res = await fetch('/api/config', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Background selamat datang berhasil diperbarui!');
        setConfig(data.config);
        form.reset();
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui background.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleContactsUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nama_humas = form.nama_humas.value.trim();
    const wa_humas = form.wa_humas.value.trim();
    const jabatan_humas = form.jabatan_humas.value.trim();
    const nama_operator = form.nama_operator.value.trim();
    const wa_operator = form.wa_operator.value.trim();
    const jabatan_operator = form.jabatan_operator.value.trim();
    const wa_floating = form.wa_floating.value.trim();

    // Dynamically look up current teacher list NIP
    const matchedHumas = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_humas));
    const matchedOperator = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_operator));

    const nip_humas = matchedHumas ? matchedHumas.nip : "";
    const nip_operator = matchedOperator ? matchedOperator.nip : "";

    const clean_wa_humas = wa_humas.replace(/[^0-9]/g, '');
    const clean_wa_operator = wa_operator.replace(/[^0-9]/g, '');
    const clean_wa_floating = wa_floating.replace(/[^0-9]/g, '');

    if (clean_wa_humas && !clean_wa_humas.startsWith('62')) {
      showToast('danger', 'Format No. WhatsApp Humas salah. Harus menggunakan format kode negara (contoh: 6281234567890).');
      return;
    }
    if (clean_wa_operator && !clean_wa_operator.startsWith('62')) {
      showToast('danger', 'Format No. WhatsApp Operator salah. Harus menggunakan format kode negara (contoh: 6281234567890).');
      return;
    }
    if (clean_wa_floating && !clean_wa_floating.startsWith('62')) {
      showToast('danger', 'Format No. WhatsApp Tombol Melayang salah. Harus menggunakan format kode negara (contoh: 6281234567890).');
      return;
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'contacts',
          nama_humas,
          wa_humas: clean_wa_humas,
          jabatan_humas,
          nip_humas,
          nama_operator,
          wa_operator: clean_wa_operator,
          jabatan_operator,
          nip_operator,
          wa_floating: clean_wa_floating
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Kontak PPDB & Tombol Melayang berhasil disimpan.');
        setConfig(prev => ({
          ...prev,
          ppdb_contacts: {
            nama_humas,
            wa_humas: clean_wa_humas,
            jabatan_humas,
            nip_humas,
            nama_operator,
            wa_operator: clean_wa_operator,
            jabatan_operator,
            nip_operator,
            wa_floating: clean_wa_floating
          }
        }));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data kontak.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleMakeContact = async (teacher, type) => {
    const contactName = type === 'humas' ? 'Humas PPDB' : 'Operator Dapodik/Sekolah';
    const currentPhone = type === 'humas' ? config.ppdb_contacts?.wa_humas : config.ppdb_contacts?.wa_operator;
    const defaultPhone = currentPhone || "";
    
    const phone = window.prompt(`Jadikan ${teacher.name} sebagai ${contactName}.\nMasukkan nomor WhatsApp beliau (Format: 628xxx):`, defaultPhone);
    
    if (phone === null) return; // User cancelled
    
    if (!phone.trim()) {
      showToast('danger', 'Nomor WhatsApp wajib diisi.');
      return;
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanedPhone.startsWith('628')) {
      showToast('danger', 'Format nomor WhatsApp salah. Harus diawali dengan 628 (contoh: 6281234567890).');
      return;
    }

    try {
      let updatedContacts;
      if (type === 'humas') {
        updatedContacts = {
          ...config.ppdb_contacts,
          nama_humas: teacher.name,
          wa_humas: cleanedPhone,
          jabatan_humas: teacher.role || 'Humas Sekolah',
          nip_humas: teacher.nip || ""
        };
      } else {
        updatedContacts = {
          ...config.ppdb_contacts,
          nama_operator: teacher.name,
          wa_operator: cleanedPhone,
          jabatan_operator: teacher.role || 'Operator Sekolah',
          nip_operator: teacher.nip || ""
        };
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'contacts',
          ...updatedContacts
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `${teacher.name} berhasil diatur sebagai ${contactName}.`);
        setConfig(prev => ({
          ...prev,
          ppdb_contacts: updatedContacts
        }));
        router.refresh();
      } else {
        showToast('danger', data.error || `Gagal mengatur ${contactName}.`);
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleNewsAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const photoFile = formData.get('photo');
    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      showToast('info', 'Sedang mengompresi ilustrasi berita...');
      const compressed = await compressImage(photoFile);
      formData.set('photo', compressed);
    }

    try {
      showToast('info', 'Sedang mempublikasikan berita...');
      const res = await fetch('/api/news', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Berita baru berhasil diterbitkan!');
        setNewsList(prev => [data.article, ...prev]);
        form.reset();
        router.refresh();
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
        router.refresh();
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

    const photoFile = formData.get('photo');
    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      showToast('info', 'Sedang mengompresi foto guru...');
      const compressed = await compressImage(photoFile);
      formData.set('photo', compressed);
    }

    try {
      showToast('info', 'Sedang menyimpan data guru...');
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
        setTeacherImageSelect('/images/teacher_1.png');
        setTeacherImageUrl('/images/teacher_1.png');
        setAvatarPreview('/images/teacher_1.png');
        setAddTeacherModalOpen(false);
        router.refresh();
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
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus data guru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();

    if (!achTitle.trim() || !achLevel.trim() || !achYear.trim() || !achDescription.trim()) {
      showToast('danger', 'Semua kolom wajib diisi!');
      return;
    }

    try {
      const isEditing = !!editingAchievementId;
      const url = '/api/achievements';
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        title: achTitle,
        level: achLevel,
        year: achYear,
        description: achDescription
      };

      if (isEditing) {
        body.id = editingAchievementId;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Gagal menyimpan data prestasi.");
      }

      if (isEditing) {
        setAchievements(prev => prev.map(a => a.id === editingAchievementId ? resData.achievement : a));
        showToast('success', 'Berhasil memperbarui data prestasi.');
      } else {
        setAchievements(prev => [...prev, resData.achievement]);
        showToast('success', 'Berhasil menambahkan prestasi baru.');
      }

      handleAchievementCancel();
      router.refresh();
    } catch (err) {
      showToast('danger', err.message || "Terjadi kesalahan koneksi.");
    }
  };

  const handleAchievementEdit = (ach) => {
    setEditingAchievementId(ach.id);
    setAchTitle(ach.title);
    setAchLevel(ach.level);
    setAchYear(ach.year);
    setAchDescription(ach.description);
  };

  const handleAchievementCancel = () => {
    setEditingAchievementId(null);
    setAchTitle('');
    setAchLevel('Tingkat Kabupaten');
    setAchYear('');
    setAchDescription('');
  };

  const handleAchievementDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) return;

    try {
      const response = await fetch(`/api/achievements?id=${id}`, {
        method: 'DELETE'
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Gagal menghapus data prestasi.");
      }

      setAchievements(prev => prev.filter(a => a.id !== id));
      showToast('success', 'Berhasil menghapus data prestasi.');
      router.refresh();
    } catch (err) {
      showToast('danger', err.message || "Terjadi kesalahan koneksi.");
    }
  };

  const handleDbToggle = async (shouldForceLocal) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'toggle_db',
          force_local_cache: shouldForceLocal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', shouldForceLocal ? 'Berhasil beralih ke Mode Cache Lokal (Offline).' : 'Berhasil mengaktifkan Mode Supabase Cloud.');
        setConfig(data.config);
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui status database.');
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

  // Edit teacher helpers
  const handleTeacherEditClick = (t) => {
    setEditTeacherId(t.id);
    setEditName(t.name || '');
    setEditRole(t.role || '');
    setEditStatus(t.status || 'PNS');
    setEditDetails(t.details || '');
    setEditNip(t.nip || '');
    
    const defaultAvatars = [
      '/images/teacher_1.png',
      '/images/teacher_2.jpg',
      '/images/teacher_3.png',
      '/images/teacher_4.jpg',
      '/images/teacher_5.png',
      '/images/teacher_7.jpg',
      '/images/principal.svg'
    ];

    if (defaultAvatars.includes(t.image)) {
      setEditTeacherImageSelect(t.image);
      setEditTeacherImageUrl(t.image);
    } else {
      setEditTeacherImageSelect('custom');
      setEditTeacherImageUrl(t.image || '');
    }
    setEditAvatarPreview(t.image || '');
    setShowEditTeacherUrlInput(false);
    setEditTeacherModalOpen(true);
  };

  const handleEditTeacherImageSelectChange = (e) => {
    const val = e.target.value;
    setEditTeacherImageSelect(val);

    const fileInput = document.getElementById('edit_teacher_photo');
    if (fileInput) fileInput.value = '';

    if (val === 'custom') {
      setEditAvatarPreview(editTeacherImageUrl);
    } else {
      setEditTeacherImageUrl(val);
      setEditAvatarPreview(val);
    }
  };

  const handleEditTeacherImageUrlChange = (e) => {
    const val = e.target.value;
    setEditTeacherImageUrl(val);
    setEditAvatarPreview(val);
  };

  const handleEditTeacherPhotoChange = (e) => {
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
        setEditAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.set('id', editTeacherId);

    if (editTeacherImageSelect !== 'custom') {
      formData.set('image', editTeacherImageSelect);
    } else {
      formData.set('image', editTeacherImageUrl);
    }

    const photoFile = formData.get('photo');
    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      showToast('info', 'Sedang mengompresi foto guru...');
      const compressed = await compressImage(photoFile);
      formData.set('photo', compressed);
    }

    try {
      showToast('info', 'Sedang memperbarui data guru...');
      const res = await fetch('/api/teachers', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil diperbarui!');
        // Update the teachers local state
        setTeachers(prev => prev.map(t => t.id === editTeacherId ? data.teacher : t));
        setEditTeacherModalOpen(false);
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui data guru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
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

  // Computed states for PPDB Search, Filter, and Pagination
  const filteredPPDB = records.filter(r => {
    const searchLower = ppdbSearch.toLowerCase();
    const matchesSearch = (r.nama_lengkap || '').toLowerCase().includes(searchLower) ||
                          (r.nik_siswa || r.nik || '').toLowerCase().includes(searchLower) ||
                          (r.nomor_hp_orangtua || r.no_hp || '').toLowerCase().includes(searchLower);
    const matchesJalur = ppdbFilterJalur === 'Semua' || r.jalur_ppdb === ppdbFilterJalur;
    const matchesStatus = ppdbFilterStatus === 'Semua' || r.status === ppdbFilterStatus;
    return matchesSearch && matchesJalur && matchesStatus;
  });

  const totalPPDBPages = Math.ceil(filteredPPDB.length / ppdbPerPage) || 1;
  const paginatedPPDB = filteredPPDB.slice((ppdbPage - 1) * ppdbPerPage, ppdbPage * ppdbPerPage);

  // Computed states for Agenda Search
  const calendarEvents = pageContents.akademik?.calendar || [];
  const filteredEvents = calendarEvents.filter(evt => {
    const query = agendaSearch.toLowerCase();
    return (evt.month || '').toLowerCase().includes(query) ||
           (evt.dates || '').toLowerCase().includes(query) ||
           (evt.desc || '').toLowerCase().includes(query);
  });

  const getPageTitle = () => {
    const titles = {
      overview: 'Ringkasan Dashboard',
      ppdb: 'Manajemen Data PPDB',
      content: 'Pengumuman & Statistik',
      news: 'Manajemen Berita Sekolah',
      teachers: 'Manajemen Guru & Kepala Sekolah',
      achievements: 'Manajemen Prestasi Sekolah',
      pages: 'Kelola Konten Halaman',
      agenda: 'Sistem Agenda & Kegiatan Sekolah'
    };
    return titles[activeTab] || 'Dashboard Admin';
  };

  return (
    <div className={`admin-dashboard-layout ${isDetailModalOpen ? 'print-detail-open' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .print-only {
            display: none;
        }

        .no-screen {
            display: none !important;
        }


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
            font-size: 0.95rem;
            letter-spacing: 0.02em;
            background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
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
        .overview-card.cyan::after {
            background: linear-gradient(180deg, #06b6d4 0%, #0891b2 100%);
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
            overflow-x: auto;
            border: 1px solid #e2e8f0;
            margin: 0 1.5rem 1.5rem 1.5rem;
            -webkit-overflow-scrolling: touch;
        }
        /* Database Toggle Switch */
        .db-toggle-container {
            margin-top: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            box-sizing: border-box;
        }
        .db-toggle-label {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-main);
            text-align: left;
        }
        .db-toggle-desc {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 500;
            margin-top: 2px;
            text-align: left;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        input:checked + .slider {
          background-color: var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(20px);
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
        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
        .btn-danger:hover {
            box-shadow: 0 6px 18px rgba(239, 68, 68, 0.3);
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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

        /* PREMIUM STYLES FOR DASHBOARD UPGRADES */
        .analytics-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.75rem;
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: 1.2fr 1.8fr;
            gap: 2rem;
            align-items: center;
        }
        @media (max-width: 1024px) {
            .analytics-grid {
                grid-template-columns: 1fr;
            }
        }
        .donut-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        .donut-legends {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }
        .legend-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--text-main);
        }
        .legend-color-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }

        .bar-chart-container {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }
        .chart-bar-item {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }
        .chart-bar-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .chart-bar-bg {
            background-color: #f1f5f9;
            height: 10px;
            border-radius: 9999px;
            overflow: hidden;
            width: 100%;
        }
        .chart-bar-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 1s ease-out;
        }

        /* Search, Filter, Pagination */
        .filter-toolbar {
            background-color: #ffffff;
            border-radius: var(--radius-md);
            padding: 1.25rem;
            border: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: 2fr 1.2fr 1.2fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--card-shadow);
        }
        @media (max-width: 768px) {
            .filter-toolbar {
                grid-template-columns: 1fr;
            }
        }
        
        .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
            font-size: 0.85rem;
            color: var(--text-muted);
        }
        .pagination-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .btn-pagination {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 600;
            color: var(--text-main);
            transition: var(--transition-smooth);
        }
        .btn-pagination:hover:not(:disabled) {
            background: #f1f5f9;
            border-color: #94a3b8;
        }
        .btn-pagination:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-pagination.active {
            background: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
        }

        /* Unified & Adaptive Print Styles */
        @media print {
            /* General resets for print */
            html, body {
                height: auto !important;
                overflow: visible !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }

            /* Force exact colors and backgrounds on print */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            /* 1. SCENARIO A: Printing the Individual Student Registration Slip (Modal is Open) */
            body:has(#print-slip-container), 
            body.print-detail-open {
                background: #ffffff !important;
                color: #000000 !important;
            }
            
            /* Completely hide non-printable layout containers when printing the slip */
            body.print-detail-open .sidebar,
            body.print-detail-open .main-wrapper,
            body:has(#print-slip-container) .sidebar,
            body:has(#print-slip-container) .main-wrapper {
                display: none !important;
            }

            /* Reset ancestral containers to standard block flow during print to avoid flexbox/height constraints */
            .admin-dashboard-layout.print-detail-open,
            body.print-detail-open .admin-dashboard-layout,
            body.print-detail-open .modal-backdrop,
            body.print-detail-open .modal-content,
            body:has(#print-slip-container) .admin-dashboard-layout,
            body:has(#print-slip-container) .modal-backdrop,
            body:has(#print-slip-container) .modal-content {
                position: static !important;
                display: block !important;
                width: 100% !important;
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: #ffffff !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }

            body.print-detail-open .modal-content > div,
            body:has(#print-slip-container) .modal-content > div {
                overflow: visible !important;
                padding: 0 !important;
                height: auto !important;
                background: #ffffff !important;
            }

            #print-slip-container {
                position: static !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                overflow: visible !important;
            }

            /* Hide everything under body in scenario A, except the print-slip-container */
            body:has(#print-slip-container) * {
                visibility: hidden !important;
            }
            body.print-detail-open * {
                visibility: hidden !important;
            }

            body:has(#print-slip-container) #print-slip-container,
            body:has(#print-slip-container) #print-slip-container *,
            body.print-detail-open #print-slip-container,
            body.print-detail-open #print-slip-container * {
                visibility: visible !important;
            }

            /* 2. SCENARIO B: Printing the Active Tab (Student Registration List / Tables) directly */
            body:not(:has(#print-slip-container)):not(.print-detail-open) .admin-dashboard-layout {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .main-wrapper {
                margin-left: 0 !important;
                margin-top: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                background-color: #ffffff !important;
                padding: 0 !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .content-body {
                padding: 1.5rem 0 !important;
                height: auto !important;
                overflow: visible !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .admin-table {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: #ffffff !important;
                overflow: visible !important;
                display: block !important;
                width: 100% !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-responsive {
                overflow: visible !important;
                margin: 0 !important;
                border: none !important;
                display: block !important;
                width: 100% !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom {
                border-collapse: collapse !important;
                width: 100% !important;
                display: table !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td {
                border: 1px solid #cbd5e1 !important;
                padding: 8px 10px !important;
                color: #0f172a !important;
                background: #ffffff !important;
                font-size: 0.8rem !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th {
                background-color: #f1f5f9 !important;
                font-weight: 700 !important;
            }

            /* Hide interactive Actions column from printed table */
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th:last-child,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td:last-child,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th.no-print,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td.no-print {
                display: none !important;
            }

            /* Universal Hides for Print */
            .no-print,
            .sidebar,
            .top-navbar,
            .table-filters,
            .pagination-container,
            .btn-pagination,
            .table-toolbar .btn,
            .table-toolbar button,
            .modal-backdrop:not(.print-detail-open) {
                display: none !important;
            }

            /* Print-only elements show up */
            .print-only {
                display: block !important;
            }

            .no-screen {
                display: table-row !important;
            }

            .table-custom tr {
                page-break-inside: avoid !important;
                keep-together: always !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom thead {
                display: table-header-group !important;
            }
        }
        
        .print-slip {
            background-color: #ffffff;
            color: #1e293b;
            font-family: 'Plus Jakarta Sans', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem;
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
        }
        .print-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            border-bottom: 3px double #0f172a;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }
        .print-logo {
            width: 75px;
            height: 75px;
            object-fit: contain;
        }
        .print-title {
            flex-grow: 1;
            text-align: center;
        }
        .print-title h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .print-title h3 {
            margin: 4px 0 0 0;
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--primary-dark);
        }
        .print-title p {
            margin: 4px 0 0 0;
            font-size: 0.75rem;
            color: #64748b;
        }
        
        .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .print-field {
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 0.5rem;
        }
        .print-field-label {
            font-size: 0.75rem;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .print-field-value {
            font-size: 1rem;
            font-weight: 600;
            color: #0f172a;
            margin-top: 2px;
        }
        
        .print-footer-signature {
            margin-top: 4rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
        }
        .signature-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 120px;
        }
      `}} />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo_sekolah.png" alt="Logo" />
          <span>SD NEGERI BOBONG</span>
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
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0V9M5.25 18.75V9m3.75-5.25a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM12 9V5.25" />
              </svg>
              <span>Kelola Prestasi</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.952 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918M4.157 7.582A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253" />
              </svg>
              <span>Kelola Konten Halaman</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className={`sidebar-link ${activeTab === 'agenda' ? 'active' : ''}`} onClick={() => setActiveTab('agenda')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span>Agenda Sekolah</span>
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
              <div className="overview-card cyan">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="overview-card-title">Storage Terpakai</span>
                    <span className="overview-card-value">{storageInfo.totalFormatted || '0 B'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {storageInfo.isSupabaseActive ? 'Supabase Storage Aktif' : 'Penyimpanan Lokal Aktif'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Supabase: {storageInfo.supabaseFormatted || '0 B'} | Lokal: {storageInfo.localFormatted || '0 B'}
                    </span>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC SVG ANALYTICS CHARTS */}
            {(() => {
              const maleCount = records.filter(r => {
                const jk = r.jenis_kelamin || '';
                return jk.toLowerCase().startsWith('l') || jk === 'Laki-laki';
              }).length;
              const femaleCount = records.filter(r => {
                const jk = r.jenis_kelamin || '';
                return jk.toLowerCase().startsWith('p') || jk === 'Perempuan';
              }).length;
              const totalGender = maleCount + femaleCount;
              const malePercent = totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 50;
              const femalePercent = totalGender > 0 ? Math.round((femaleCount / totalGender) * 100) : 50;

              // Radius 40 => Circumference = 2 * PI * 40 = 251.32
              const maleDash = (malePercent / 100) * 251.32;
              const femaleDash = (femalePercent / 100) * 251.32;

              // Jalur PPDB stats
              const totalPPDB = records.length;
              const zonasi = records.filter(r => r.jalur_ppdb === 'Zonasi').length;
              const afirmasi = records.filter(r => r.jalur_ppdb === 'Afirmasi').length;
              const prestasi = records.filter(r => r.jalur_ppdb === 'Prestasi').length;
              const perpindahan = records.filter(r => r.jalur_ppdb === 'Perpindahan' || r.jalur_ppdb?.toLowerCase().includes('pindah')).length;

              const zonasiPct = totalPPDB > 0 ? Math.round((zonasi / totalPPDB) * 100) : 0;
              const afirmasiPct = totalPPDB > 0 ? Math.round((afirmasi / totalPPDB) * 100) : 0;
              const prestasiPct = totalPPDB > 0 ? Math.round((prestasi / totalPPDB) * 100) : 0;
              const perpindahanPct = totalPPDB > 0 ? Math.round((perpindahan / totalPPDB) * 100) : 0;

              return (
                <div className="analytics-card" style={{ marginTop: '1.5rem' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}>📊 Analisis Data PPDB Real-time</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visualisasi statistik pendaftar siswa baru berdasarkan gender dan jalur masuk.</p>
                  </div>

                  <div className="analytics-grid">
                    {/* Donut Chart */}
                    <div className="donut-container" style={{ borderRight: '1px solid #f1f5f9', paddingRight: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>Sebaran Jenis Kelamin</h4>
                      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                        <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
                          {totalGender > 0 ? (
                            <>
                              <circle 
                                cx="50" cy="50" r="40" fill="transparent" 
                                stroke="#6366f1" strokeWidth="12" 
                                strokeDasharray={`${maleDash} 251.32`} 
                              />
                              <circle 
                                cx="50" cy="50" r="40" fill="transparent" 
                                stroke="#8b5cf6" strokeWidth="12" 
                                strokeDasharray={`${femaleDash} 251.32`} 
                                strokeDashoffset={-maleDash} 
                              />
                            </>
                          ) : (
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#94a3b8" strokeWidth="12" />
                          )}
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>{totalGender}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Siswa</span>
                        </div>
                      </div>

                      <div className="donut-legends">
                        <div className="legend-item">
                          <span style={{ fontWeight: 600 }}><span className="legend-color-dot" style={{ backgroundColor: '#6366f1' }}></span>Laki-laki</span>
                          <span style={{ fontWeight: 700, color: '#475569' }}>{maleCount} ({malePercent}%)</span>
                        </div>
                        <div className="legend-item">
                          <span style={{ fontWeight: 600 }}><span className="legend-color-dot" style={{ backgroundColor: '#8b5cf6' }}></span>Perempuan</span>
                          <span style={{ fontWeight: 700, color: '#475569' }}>{femaleCount} ({femalePercent}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bar-chart-container">
                      <h4 style={{ margin: 0, color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>Distribusi Jalur Pendaftaran</h4>
                      
                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>🛣️ Jalur Zonasi</span>
                          <span>{zonasi} Pendaftar ({zonasiPct}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{ width: `${zonasiPct}%`, backgroundColor: '#f59e0b' }}></div>
                        </div>
                      </div>

                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>❤️ Jalur Afirmasi</span>
                          <span>{afirmasi} Pendaftar ({afirmasiPct}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{ width: `${afirmasiPct}%`, backgroundColor: '#10b981' }}></div>
                        </div>
                      </div>

                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>🏆 Jalur Prestasi</span>
                          <span>{prestasi} Pendaftar ({prestasiPct}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{ width: `${prestasiPct}%`, backgroundColor: '#8b5cf6' }}></div>
                        </div>
                      </div>

                      <div className="chart-bar-item">
                        <div className="chart-bar-info">
                          <span>💼 Perpindahan Tugas Orang Tua</span>
                          <span>{perpindahan} Pendaftar ({perpindahanPct}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{ width: `${perpindahanPct}%`, backgroundColor: '#06b6d4' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
 
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
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Koneksi database sinkronisasi saat ini:</p>
                <span className="badge" style={{
                  backgroundColor: dbStatus === 'active' ? '#d1fae5' : dbStatus === 'disabled' ? '#fee2e2' : '#fef3c7',
                  color: dbStatus === 'active' ? '#065f46' : dbStatus === 'disabled' ? '#991b1b' : '#b45309',
                  border: dbStatus === 'active' ? '1px solid #a7f3d0' : dbStatus === 'disabled' ? '1px solid #fca5a5' : '1px solid #fcd34d',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span className={`pulse-dot ${dbStatus === 'active' ? 'green' : dbStatus === 'disabled' ? 'red' : 'amber'}`}></span>
                  {dbStatus === 'active' 
                    ? 'SUPABASE CLOUD ACTIVE' 
                    : dbStatus === 'forced_local'
                      ? 'LOCAL CACHE FORCE ACTIVE' 
                      : dbStatus === 'disabled'
                        ? 'LOCAL CACHE ACTIVE (NO CREDENTIALS)'
                        : 'LOCAL CACHE ACTIVE (AUTO FALLBACK)'
                  }
                </span>
                
                {/* Interactive Toggle Switch */}
                <div className="db-toggle-container">
                  <div style={{ textAlign: 'left' }}>
                    <div className="db-toggle-label">Gunakan Database Cloud</div>
                    <div className="db-toggle-desc">Hubungkan ke Supabase Cloud secara real-time</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      disabled={dbStatus === 'disabled'} 
                      checked={dbStatus === 'active' || (dbStatus !== 'forced_local' && dbStatus !== 'disabled')} 
                      onChange={(e) => handleDbToggle(!e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
              {/* CHANGE PASSWORD FORM CARD */}
              <div className="settings-card">
                <h3>🔐 Ganti Password Admin</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Perbarui kata sandi untuk akun administrator Anda secara aman. Sesi Anda akan tetap aktif setelah perubahan selesai.
                </p>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Password Saat Ini</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan password saat ini..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Password Baru (Min 6 Karakter)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru..."
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1rem', marginTop: '0.5rem', alignSelf: 'flex-start' }}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Memproses...' : '🔐 Perbarui Password'}
                  </button>
                </form>
              </div>

              {/* BACKUP & RESTORE CONFIG CARD */}
              <div className="settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3>💾 Cadangan & Pemulihan Konfigurasi</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Ekspor seluruh pengaturan konten teks, gambar, pengumuman berjalan, dan statistik sekolah ke berkas JSON cadangan lokal. Anda dapat memulihkannya kapan saja untuk mengembalikan data ke kondisi yang dicadangkan.
                  </p>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#1e3a8a', marginBottom: '1.25rem', fontWeight: 500 }}>
                    💡 <strong>Tips:</strong> Disarankan melakukan pencadangan (export) sebelum Anda melakukan perubahan teks berskala besar di halaman website!
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>1. Simpan Cadangan Berkas</h4>
                    <button 
                      type="button" 
                      onClick={handleBackupExport}
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem 1.2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      📥 Ekspor Cadangan (.json)
                    </button>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>2. Pulihkan Dari Cadangan</h4>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleBackupRestore}
                        style={{ display: 'none' }}
                        id="backup-restore-input"
                      />
                      <button 
                        type="button"
                        onClick={() => document.getElementById('backup-restore-input').click()}
                        className="btn btn-danger"
                        style={{ padding: '0.6rem 1.2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#ef4444' }}
                      >
                        📤 Unggah & Pulihkan Cadangan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= TAB: PPDB MANAGEMENT ================= */}
          {/* ================= TAB: PPDB MANAGEMENT ================= */}
          <section id="tab-ppdb" className={`tab-pane ${activeTab === 'ppdb' ? 'active' : ''}`}>
            <div className="admin-table">
              {/* Print-Only Official School Header */}
              <div className="print-only" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '3px double #0f172a', paddingBottom: '1.5rem' }}>
                  <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" style={{ width: '70px', height: '75px', objectFit: 'contain' }} />
                  <div style={{ flexGrow: 1, textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
                    <h3 style={{ margin: '1px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SD NEGERI BOBONG</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', fontWeight: 500, lineHeight: '1.4' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: sdn.bobong@gmail.com</p>
                  </div>
                  <img src="/images/logo_sekolah.png" alt="Logo Sekolah" style={{ width: '70px', height: '75px', objectFit: 'contain' }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '1px' }}>LAPORAN DAFTAR LENGKAP FORMULIR MASUK SISWA (PPDB)</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569' }}>Tahun Ajaran: 2026/2027</p>
                </div>
              </div>

              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3>Daftar Lengkap Formulir Masuk</h3>
                <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => window.print()} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                  >
                    🖨️ Cetak Laporan (PDF)
                  </button>
                  <a href="/api/ppdb?export=true" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    📥 Ekspor Data ke Excel/CSV
                  </a>
                  {records.length > 0 && (
                    <button 
                      onClick={handleDeleteAllPPDB} 
                      className="btn btn-danger" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🗑️ Hapus Semua Data
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Filter Toolbar */}
              <div className="table-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Cari Calon Siswa</label>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, NIK, atau nomor HP..."
                    value={ppdbSearch}
                    onChange={(e) => { setPpdbSearch(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', bottom: '0.7rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
                </div>
                
                <div style={{ minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Jalur</label>
                  <select
                    value={ppdbFilterJalur}
                    onChange={(e) => { setPpdbFilterJalur(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value="Semua">Semua Jalur</option>
                    <option value="Zonasi">Zonasi</option>
                    <option value="Afirmasi">Afirmasi</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Perpindahan Tugas Orang Tua">Perpindahan Tugas Orang Tua</option>
                  </select>
                </div>

                <div style={{ minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Status</label>
                  <select
                    value={ppdbFilterStatus}
                    onChange={(e) => { setPpdbFilterStatus(e.target.value); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Diterima Sistem">Diterima Sistem</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div style={{ minWidth: '100px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Halaman</label>
                  <select
                    value={ppdbPerPage}
                    onChange={(e) => { setPpdbPerPage(Number(e.target.value)); setPpdbPage(1); }}
                    className="form-control"
                    style={{ width: '100%', height: '42px', boxSizing: 'border-box' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table */}
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
                      <th className="no-print" style={{ width: '240px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPPDB.length > 0 ? (
                      filteredPPDB.map((r, idx) => {
                        const displayIndex = idx + 1;
                        const isRowOnCurrentPage = idx >= (ppdbPage - 1) * ppdbPerPage && idx < ppdbPage * ppdbPerPage;
                        return (
                          <tr key={r.id || idx} className={isRowOnCurrentPage ? '' : 'no-screen'}>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{displayIndex}</td>
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
                              <div className="no-print">
                                <select
                                  value={r.status}
                                  className={`status-badge-select ${r.status === 'Terverifikasi' ? 'verified' : r.status === 'Ditolak' ? 'rejected' : 'pending'}`}
                                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                >
                                  <option value="Diterima Sistem">Diterima Sistem</option>
                                  <option value="Terverifikasi">Terverifikasi</option>
                                  <option value="Ditolak">Ditolak</option>
                                </select>
                              </div>
                              <span className="print-only" style={{ fontWeight: 600, color: r.status === 'Terverifikasi' ? '#059669' : r.status === 'Ditolak' ? '#dc2626' : '#d97706' }}>
                                {r.status}
                              </span>
                            </td>
                            <td className="no-print" style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedRecord(r); setIsDetailModalOpen(true); }}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                                  title="Lihat Detail & Cetak Bukti"
                                >
                                  👁️ Detail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendWhatsAppNotification(r)}
                                  className="btn"
                                  style={{
                                    padding: '0.35rem 0.7rem',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                                  }}
                                  title="Kirim Notifikasi Status PPDB lewat WhatsApp"
                                >
                                  💬 WA
                                </button>
                                <button onClick={() => handlePPDBDelete(r.id)} type="button" className="btn-action-delete" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0 }}>Hapus</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum ada data pendaftar calon siswa baru yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Premium Pagination System */}
              {totalPPDBPages > 1 && (
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Menampilkan <strong>{Math.min(filteredPPDB.length, (ppdbPage - 1) * ppdbPerPage + 1)}-{Math.min(filteredPPDB.length, ppdbPage * ppdbPerPage)}</strong> dari total <strong>{filteredPPDB.length}</strong> pendaftar
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn-pagination"
                      disabled={ppdbPage === 1}
                      onClick={() => setPpdbPage(prev => Math.max(1, prev - 1))}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: ppdbPage === 1 ? '#f1f5f9' : '#ffffff', cursor: ppdbPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                    >
                      ◀️ Prev
                    </button>
                    {Array.from({ length: totalPPDBPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`btn-pagination ${ppdbPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setPpdbPage(i + 1)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: ppdbPage === i + 1 ? 'var(--primary)' : '#ffffff',
                          color: ppdbPage === i + 1 ? '#ffffff' : '#1e293b',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn-pagination"
                      disabled={ppdbPage === totalPPDBPages}
                      onClick={() => setPpdbPage(prev => Math.min(totalPPDBPages, prev + 1))}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: ppdbPage === totalPPDBPages ? '#f1f5f9' : '#ffffff', cursor: ppdbPage === totalPPDBPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                    >
                      Next ▶️
                    </button>
                  </div>
                </div>
              )}
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

              {/* PPDB Contacts Config */}
              <div className="settings-card" style={{ gridColumn: 'span 2' }}>
                <h3>Kelola Kontak Informasi & Humas PPDB</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Konfigurasikan nama, jabatan, dan nomor WhatsApp panitia PPDB yang akan ditampilkan pada portal PPDB utama publik.
                </p>

                {(!config.ppdb_contacts?.nama_humas || !config.ppdb_contacts?.wa_humas || !config.ppdb_contacts?.nama_operator || !config.ppdb_contacts?.wa_operator) && (
                  <div style={{
                    backgroundColor: '#FDF2F2',
                    color: '#9B1C1C',
                    border: '1px solid #FBD5D5',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginBottom: 'var(--space-md)',
                    fontWeight: 600
                  }}>
                    ⚠️ Peringatan: Kontak PPDB belum lengkap! Tulisan peringatan merah akan muncul di halaman publik jika bagian ini kosong.
                  </div>
                )}

                 <form onSubmit={handleContactsUpdate} key={config?.ppdb_contacts ? JSON.stringify(config.ppdb_contacts) : 'empty'}>
                  <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    {/* Humas */}
                    <div>
                      <h4 style={{ color: 'var(--primary-dark)', marginBottom: 'var(--space-xs)', borderBottom: '2px solid var(--secondary)', paddingBottom: '4px', fontSize: '0.95rem' }}>1. Kontak Informasi & Humas</h4>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="nama_humas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Nama Humas</label>
                        <input
                          type="text"
                          id="nama_humas"
                          name="nama_humas"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.nama_humas || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: Ibu Husnita Usman, M.Pd."
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="jabatan_humas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Jabatan Humas</label>
                        <input
                          type="text"
                          id="jabatan_humas"
                          name="jabatan_humas"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.jabatan_humas || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: Pendidik Bidang Studi / Humas"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="nip_humas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>NIP Humas (Disinkronkan Otomatis)</label>
                        <input
                          type="text"
                          id="nip_humas"
                          name="nip_humas"
                          className="form-control"
                          value={syncNipHumas}
                          style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', border: '1px solid #cbd5e1' }}
                          placeholder="Terisi otomatis dari daftar guru"
                          readOnly
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '500', display: 'block', marginTop: '3px' }}>
                          ℹ️ NIP disinkronkan langsung dari daftar guru & staf berdasarkan nama Humas.
                        </span>
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="wa_humas" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>No. WhatsApp (Gunakan Format Angka: 628xxx)</label>
                        <input
                          type="text"
                          id="wa_humas"
                          name="wa_humas"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.wa_humas || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: 6281234567890"
                        />
                      </div>
                    </div>

                    {/* Operator */}
                    <div>
                      <h4 style={{ color: 'var(--primary-dark)', marginBottom: 'var(--space-xs)', borderBottom: '2px solid var(--secondary)', paddingBottom: '4px', fontSize: '0.95rem' }}>2. Kontak Dukungan Teknis & Operator</h4>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="nama_operator" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Nama Operator</label>
                        <input
                          type="text"
                          id="nama_operator"
                          name="nama_operator"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.nama_operator || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: Bapak Kasmudin"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="jabatan_operator" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Jabatan Operator</label>
                        <input
                          type="text"
                          id="jabatan_operator"
                          name="jabatan_operator"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.jabatan_operator || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: Operator Sekolah"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="nip_operator" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>NIP Operator (Disinkronkan Otomatis)</label>
                        <input
                          type="text"
                          id="nip_operator"
                          name="nip_operator"
                          className="form-control"
                          value={syncNipOperator}
                          style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', border: '1px solid #cbd5e1' }}
                          placeholder="Terisi otomatis dari daftar guru"
                          readOnly
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '500', display: 'block', marginTop: '3px' }}>
                          ℹ️ NIP disinkronkan langsung dari daftar guru & staf berdasarkan nama Operator.
                        </span>
                      </div>
                      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label htmlFor="wa_operator" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>No. WhatsApp (Gunakan Format Angka: 628xxx)</label>
                        <input
                          type="text"
                          id="wa_operator"
                          name="wa_operator"
                          className="form-control"
                          defaultValue={config.ppdb_contacts?.wa_operator || ''}
                          style={{ width: '100%' }}
                          placeholder="Contoh: 6281234567890"
                        />
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: 'var(--space-md) 0' }} />
                  
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <h4 style={{ color: 'var(--primary-dark)', marginBottom: 'var(--space-xs)', borderBottom: '2px solid var(--secondary)', paddingBottom: '4px', fontSize: '0.95rem' }}>3. WhatsApp Tombol Melayang (Floating Button)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>
                      Tentukan nomor WhatsApp tujuan untuk tombol melayang hijau yang tampil di sudut kanan bawah semua halaman publik. Jika dikosongkan, tombol melayang akan otomatis menggunakan nomor <strong>Operator Sekolah</strong> di atas sebagai cadangan.
                    </p>
                    <div className="form-group" style={{ maxWidth: '500px' }}>
                      <label htmlFor="wa_floating" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>No. WhatsApp Tombol Melayang (Gunakan Format Angka: 628xxx)</label>
                      <input
                        type="text"
                        id="wa_floating"
                        name="wa_floating"
                        className="form-control"
                        defaultValue={config.ppdb_contacts?.wa_floating || ''}
                        style={{ width: '100%' }}
                        placeholder="Contoh: 6281234567890"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>💾 Simpan Kontak PPDB & Tombol Melayang</button>
                </form>
              </div>

              {/* Welcome Background Config */}
              <div className="settings-card" style={{ gridColumn: 'span 2' }}>
                <h3>Ganti Background Selamat Datang (Hero Beranda)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Unggah gambar atau video pendek latar belakang baru untuk banner ucapan selamat datang di halaman Beranda utama. Format gambar yang didukung: JPG, JPEG, PNG, SVG (Maks 2MB). Format video pendek yang didukung: MP4, WebM, OGG, MOV, M4V (Maks 10 detik & 20MB).
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Preview */}
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Latar Belakang Saat Ini:</label>
                    {config.stats?.hero_background && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(config.stats.hero_background) ? (
                      <video 
                        src={config.stats.hero_background}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ 
                          width: '100%', 
                          height: '150px', 
                          borderRadius: 'var(--radius-md)', 
                          border: '1px solid var(--border-color)', 
                          objectFit: 'cover',
                          backgroundColor: '#000'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '150px', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border-color)', 
                        backgroundImage: `url('${config.stats?.hero_background || "/images/hero_school.svg"}')`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        backgroundColor: '#e5e7eb'
                      }}></div>
                    )}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleHeroBgUpdate} encType="multipart/form-data" style={{ flex: '2', minWidth: '300px' }}>
                    <input type="hidden" name="action_type" value="hero_bg" />
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label htmlFor="hero_bg_image" style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>Pilih File Gambar atau Video Pendek (Maks 10 Detik)</label>
                      <input
                        type="file"
                        id="hero_bg_image"
                        name="hero_bg_image"
                        className="form-control"
                        accept=".png,.jpg,.jpeg,.svg,.mp4,.webm,.ogg,.mov,.m4v"
                        style={{ width: '100%' }}
                        required
                      />
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                        💡 <strong>Rekomendasi:</strong> Gunakan rasio lanskap berkualitas tinggi (minimal 1920x1080). Untuk video, pastikan berdurasi maksimal 10 detik agar tidak ditolak oleh sistem pengunggahan.
                      </p>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>📤 Unggah & Terapkan Background</button>
                  </form>
                </div>
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
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                        💡 <strong>Rekomendasi:</strong> Gunakan rasio landscape horizontal (16:9) agar tampilan spanduk dan galeri berita terlihat seimbang.
                      </p>
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
            <div>
              {/* Table List of Teachers */}
              <div className="settings-card" style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Daftar Guru & Staf Saat Ini</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Daftar pendidik yang terbit di halaman profil publik. Klik tombol **Edit** untuk memuat datanya.
                    </p>
                  </div>
                  <button 
                    onClick={() => setAddTeacherModalOpen(true)} 
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    ➕ Tambah Pendidik Baru
                  </button>
                </div>

                <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                  <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px', textAlign: 'center' }}>Foto</th>
                        <th>Nama Lengkap</th>
                        <th>Jabatan</th>
                        <th>Status</th>
                        <th style={{ width: '260px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length > 0 ? (
                        teachers.map((t) => (
                          <tr key={t.id}>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--border-color, #e2e8f0)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                backgroundColor: '#f8fafc',
                                margin: '0 auto',
                                flexShrink: 0
                              }}>
                                <img src={t.image || '/images/teacher_1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{t.name}</strong>
                              {t.nip && (
                                <><br /><span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>NIP. {t.nip}</span></>
                              )}
                              {t.details && (
                                <><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.details}</span></>
                              )}
                            </td>
                            <td>{t.role}</td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: t.status === 'PNS' ? 'var(--primary)' : (t.status === 'PPPK' || t.status === 'PPPK PW') ? '#E8FAF0' : '#FFF8E6',
                                color: t.status === 'PNS' ? 'white' : (t.status === 'PPPK' || t.status === 'PPPK PW') ? '#20BA5A' : '#D48408',
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
                                <select 
                                  onChange={(e) => {
                                    const action = e.target.value;
                                    if (action === 'humas') handleMakeContact(t, 'humas');
                                    if (action === 'operator') handleMakeContact(t, 'operator');
                                    e.target.value = ''; // Reset select
                                  }} 
                                  className="form-control" 
                                  style={{ 
                                    padding: '0.25rem 0.5rem', 
                                    fontSize: '0.75rem', 
                                    width: 'auto',
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <option value="" disabled selected style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Set Kontak PPDB</option>
                                  <option value="humas" style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Jadikan Humas</option>
                                  <option value="operator" style={{ backgroundColor: 'white', color: 'var(--text-main)' }}>Jadikan Operator</option>
                                </select>
                                <button 
                                  onClick={() => handleTeacherEditClick(t)} 
                                  type="button" 
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}
                                >
                                  Edit
                                </button>
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
            </div>
          </section>

          {/* ================= TAB: ACHIEVEMENTS MANAGEMENT ================= */}
          <section id="tab-achievements" className={`tab-pane ${activeTab === 'achievements' ? 'active' : ''}`}>
            <div className="news-cms-grid">
              {/* Form Add / Edit Achievement */}
              <div className="settings-card">
                <h3>{editingAchievementId ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  {editingAchievementId 
                    ? 'Ubah detail data prestasi guru sekolah yang dipilih.' 
                    : 'Tambahkan data pencapaian atau prestasi guru sekolah untuk ditampilkan pada halaman profil.'}
                </p>

                <form onSubmit={handleAchievementSubmit}>
                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ach_title" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Nama/Judul Prestasi *</label>
                    <input
                      type="text"
                      id="ach_title"
                      className="form-control"
                      placeholder="Contoh: Guru Berprestasi I"
                      value={achTitle}
                      onChange={(e) => setAchTitle(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label htmlFor="ach_level" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tingkat Prestasi *</label>
                      <select 
                        id="ach_level" 
                        className="form-control" 
                        value={achLevel} 
                        onChange={(e) => setAchLevel(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      >
                        <option value="Tingkat Kabupaten">Tingkat Kabupaten</option>
                        <option value="Tingkat Provinsi">Tingkat Provinsi</option>
                        <option value="Tingkat Nasional">Tingkat Nasional</option>
                        <option value="Tingkat Internasional">Tingkat Internasional</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ach_year" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tahun Penghargaan *</label>
                      <input
                        type="text"
                        id="ach_year"
                        className="form-control"
                        placeholder="Contoh: 2025"
                        value={achYear}
                        onChange={(e) => setAchYear(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                    <label htmlFor="ach_desc" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Deskripsi / Keterangan *</label>
                    <textarea
                      id="ach_desc"
                      className="form-control"
                      placeholder="Jelaskan detail prestasi yang diraih..."
                      value={achDescription}
                      onChange={(e) => setAchDescription(e.target.value)}
                      rows="4"
                      style={{ width: '100%', resize: 'vertical' }}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                      {editingAchievementId ? '💾 Simpan Perubahan' : '➕ Tambah Prestasi'}
                    </button>
                    {editingAchievementId && (
                      <button type="button" onClick={handleAchievementCancel} className="btn btn-secondary">
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table List of Achievements */}
              <div className="settings-card" style={{ overflowX: 'auto' }}>
                <h3>Daftar Prestasi Saat Ini</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Daftar pencapaian yang terbit di halaman profil. Klik **Edit** untuk mengedit atau **Hapus** untuk menghapus.
                </p>

                <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                  <table className="table-custom" style={{ fontSize: '0.85rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Tahun</th>
                        <th>Tingkat</th>
                        <th>Judul Prestasi</th>
                        <th>Keterangan</th>
                        <th style={{ width: '140px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achievements.length > 0 ? (
                        achievements.map((ach) => (
                          <tr key={ach.id}>
                            <td><strong>{ach.year}</strong></td>
                            <td>
                              <span className="badge" style={{
                                backgroundColor: (ach.level || "").toLowerCase().includes("nasional") 
                                  ? '#E8F5E9' 
                                  : (ach.level || "").toLowerCase().includes("provinsi") 
                                  ? '#E3F2FD' 
                                  : '#FFF8E6',
                                color: (ach.level || "").toLowerCase().includes("nasional") 
                                  ? '#2E7D32' 
                                  : (ach.level || "").toLowerCase().includes("provinsi") 
                                  ? '#1565C0' 
                                  : '#D48408',
                                fontWeight: 600,
                                padding: '0.2rem 0.4rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}>
                                {ach.level}
                              </span>
                            </td>
                            <td><strong style={{ color: 'var(--primary-dark)' }}>{ach.title}</strong></td>
                            <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{ach.description}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => handleAchievementEdit(ach)} 
                                  type="button" 
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleAchievementDelete(ach.id)} 
                                  type="button" 
                                  className="btn-action-delete" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Belum ada data prestasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* ================= TAB: PAGES CONTENT MANAGEMENT ================= */}
          <section id="tab-pages" className={`tab-pane ${activeTab === 'pages' ? 'active' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              
              {/* Premium Sub-Tab Pill Navigation */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: 'var(--space-xs)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                marginBottom: 'var(--space-xs)'
              }}>
                {[
                  { id: 'beranda', label: '🏠 Beranda' },
                  { id: 'profil', label: '📝 Profil Sekolah' },
                  { id: 'akademik', label: '📖 Akademik' },
                  { id: 'kesiswaan', label: '🎨 Kesiswaan & Ekskul' },
                  { id: 'ppdb', label: '🎓 PPDB Portal' },
                  { id: 'galeri', label: '📸 Galeri Kegiatan' }
                ].map(subTab => (
                  <button
                    key={subTab.id}
                    type="button"
                    onClick={() => setActivePageSubTab(subTab.id)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: activePageSubTab === subTab.id ? 700 : 500,
                      backgroundColor: activePageSubTab === subTab.id ? 'var(--primary)' : 'transparent',
                      color: activePageSubTab === subTab.id ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      borderBottom: activePageSubTab === subTab.id ? '3px solid var(--primary-dark)' : '3px solid transparent',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab description header */}
              <div style={{ padding: '0 0.5rem', marginBottom: 'var(--space-xs)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Mengedit konten dinamis (teks dan gambar) untuk halaman <strong>{activePageSubTab.toUpperCase()}</strong>. Tekan tombol Simpan di bagian bawah setelah melakukan perubahan.
                </p>
              </div>

              {/* ================= SUB-TAB: BERANDA ================= */}
              {activePageSubTab === 'beranda' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Hero Section (Bagian Atas)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Grup teks yang melayang di atas video/gambar latar belakang beranda.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Utama (Hero Title)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pageContents.beranda?.hero_title || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_title', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Sub-Judul (Hero Subtitle)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pageContents.beranda?.hero_subtitle || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_subtitle', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Pendukung (Hero Text)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.hero_text || ''}
                        onChange={(e) => handleFieldChange('beranda', 'hero_text', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sambutan Kepala Sekolah</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Profil sambutan Kepala Sekolah yang berada di bagian tengah halaman utama.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Welcome Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.beranda?.welcome_badge || ''}
                          onChange={(e) => handleFieldChange('beranda', 'welcome_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Sambutan (Welcome Title)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.beranda?.welcome_title || ''}
                          onChange={(e) => handleFieldChange('beranda', 'welcome_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Kutipan Penting (Welcome Quote / Motto)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_quote || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_quote', e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Sambutan - Paragraf 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_p1 || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Sambutan - Paragraf 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.beranda?.welcome_p2 || ''}
                        onChange={(e) => handleFieldChange('beranda', 'welcome_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: PROFIL ================= */}
              {activePageSubTab === 'profil' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Profil</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Judul dan deskripsi pendek pada banner atas halaman Profil Sekolah.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.banner_title || ''}
                          onChange={(e) => handleFieldChange('profil', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.profil?.banner_text || ''}
                          onChange={(e) => handleFieldChange('profil', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sejarah Sekolah & Visualisasi</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Profil sejarah pembentukan institusi sekolah beserta ilustrasi pendukung sejarah.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Sejarah Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.sejarah_badge || ''}
                          onChange={(e) => handleFieldChange('profil', 'sejarah_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Bagian Sejarah</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.profil?.sejarah_title || ''}
                          onChange={(e) => handleFieldChange('profil', 'sejarah_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Paragraf Sejarah 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.sejarah_p1 || ''}
                        onChange={(e) => handleFieldChange('profil', 'sejarah_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Paragraf Sejarah 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.sejarah_p2 || ''}
                        onChange={(e) => handleFieldChange('profil', 'sejarah_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Unggah Gambar Sejarah Baru (Mengganti Gambar)</label>
                      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                        <div style={{ 
                          width: '120px', 
                          height: '80px', 
                          borderRadius: '8px', 
                          border: '2px dashed var(--primary)', 
                          overflow: 'hidden', 
                          backgroundColor: '#f8fafc', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          flexShrink: 0
                        }}>
                          <img 
                            src={sejarahPreview || pageContents.profil?.sejarah_image || '/images/profil_sekolah.svg'} 
                            alt="Sejarah Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif"
                            onChange={handleSejarahFileChange}
                            style={{ width: '100%' }}
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                            Format yang didukung: png, jpg, jpeg, svg, gif (Maks. 1MB).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Visi & Misi</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Semboyan visi sekolah dan daftar urut misi sekolah berjalan.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Visi Sekolah (Teks Utama)</label>
                      <textarea
                        className="form-control"
                        value={pageContents.profil?.visi || ''}
                        onChange={(e) => handleFieldChange('profil', 'visi', e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Misi Sekolah (Tulis Setiap Poin di Baris Baru)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.profil?.misi) ? pageContents.profil.misi.join('\n') : (pageContents.profil?.misi || '')}
                        onChange={(e) => handleFieldChange('profil', 'misi', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap misi dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                        💡 Tekan Enter untuk membuat butir misi baru. Spasi kosong di baris terakhir otomatis divalidasi dan diabaikan saat rendering.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: AKADEMIK ================= */}
              {activePageSubTab === 'akademik' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Akademik</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Panduan Akademik.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.banner_title || ''}
                          onChange={(e) => handleFieldChange('akademik', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.akademik?.banner_text || ''}
                          onChange={(e) => handleFieldChange('akademik', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Sistem & Penerapan Kurikulum</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Metode pembelajaran dan tags highlight yang mengindikasikan program prioritas sekolah.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Label Kecil (Kurikulum Badge)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.kurikulum_badge || ''}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_badge', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Bagian Kurikulum</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.akademik?.kurikulum_title || ''}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Kurikulum - Paragraf 1</label>
                      <textarea
                        className="form-control"
                        value={pageContents.akademik?.kurikulum_p1 || ''}
                        onChange={(e) => handleFieldChange('akademik', 'kurikulum_p1', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Isi Kurikulum - Paragraf 2</label>
                      <textarea
                        className="form-control"
                        value={pageContents.akademik?.kurikulum_p2 || ''}
                        onChange={(e) => handleFieldChange('akademik', 'kurikulum_p2', e.target.value)}
                        rows="4"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Unggah Gambar Kurikulum</label>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                          <div style={{ 
                            width: '100px', 
                            height: '65px', 
                            borderRadius: '6px', 
                            border: '2px dashed var(--primary)', 
                            overflow: 'hidden', 
                            backgroundColor: '#f8fafc', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            flexShrink: 0
                          }}>
                            <img 
                              src={kurikulumPreview || pageContents.akademik?.kurikulum_image || '/images/kurikulum_merdeka.svg'} 
                              alt="Kurikulum Preview" 
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={handleKurikulumFileChange}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Kurikulum Highlight Tags (Satu baris per Tag)</label>
                        <textarea
                          className="form-control"
                          value={Array.isArray(pageContents.akademik?.kurikulum_tags) ? pageContents.akademik.kurikulum_tags.join('\n') : (pageContents.akademik?.kurikulum_tags || '')}
                          onChange={(e) => handleFieldChange('akademik', 'kurikulum_tags', e.target.value.split('\n'))}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Kalender Akademik</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Agenda dan rentang tanggal pelaksanaan aktivitas di SD Negeri Bobong.</p>
                      </div>
                      <button type="button" onClick={handleAddCalendar} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Kalender
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.akademik?.calendar || []).map((cal, idx) => (
                        <div key={cal.id || idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Bulan & Tahun"
                              className="form-control"
                              value={cal.month || ''}
                              onChange={(e) => handleUpdateCalendar(idx, 'month', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Rentang Tanggal"
                              className="form-control"
                              value={cal.dates || ''}
                              onChange={(e) => handleUpdateCalendar(idx, 'dates', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Kegiatan Akademik..."
                              className="form-control"
                              value={cal.desc || ''}
                              onChange={(e) => handleUpdateCalendar(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCalendar(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.akademik?.calendar || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada agenda kalender akademik. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Tata Tertib Sekolah</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Daftar tata tertib kedisiplinan murid di lingkungan SDN Bobong.
                    </p>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Aturan & Disiplin (Satu baris per Aturan)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.akademik?.tata_tertib) ? pageContents.akademik.tata_tertib.join('\n') : (pageContents.akademik?.tata_tertib || '')}
                        onChange={(e) => handleFieldChange('akademik', 'tata_tertib', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap tata tertib dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Ketentuan Penggunaan Seragam Sekolah</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Aturan pemakaian seragam dan atribut sekolah berdasarkan hari.</p>
                      </div>
                      <button type="button" onClick={handleAddSeragam} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Seragam
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.akademik?.seragam || []).map((sg, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Hari Ketentuan"
                              className="form-control"
                              value={sg.days || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'days', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Jenis Pakaian Seragam"
                              className="form-control"
                              value={sg.type || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'type', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Atribut & Detail..."
                              className="form-control"
                              value={sg.details || ''}
                              onChange={(e) => handleUpdateSeragam(idx, 'details', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSeragam(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.akademik?.seragam || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada ketentuan seragam. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: KESISWAAN ================= */}
              {activePageSubTab === 'kesiswaan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner Kesiswaan</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Kesiswaan & Ekstrakurikuler.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_title || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.kesiswaan?.banner_text || ''}
                          onChange={(e) => handleFieldChange('kesiswaan', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Kegiatan Ekstrakurikuler (Ekskul)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar kartu wadah pengembangan minat & bakat siswa.</p>
                      </div>
                      <button type="button" onClick={handleAddEkskul} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Ekskul Baru
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).map((ek, idx) => (
                        <div key={ek.id || idx} style={{ display: 'grid', gridTemplateColumns: '3fr 4fr 2.5fr 1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Kegiatan *</label>
                              <input
                                type="text"
                                placeholder="Nama Ekskul"
                                className="form-control"
                                value={ek.nama || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'nama', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, marginTop: '8px' }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jadwal Latihan *</label>
                              <input
                                type="text"
                                placeholder="Jadwal (e.g. Sabtu, 14.00 - 16.00)"
                                className="form-control"
                                value={ek.jadwal || ''}
                                onChange={(e) => handleUpdateEkskul(idx, 'jadwal', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deskripsi Kegiatan *</label>
                            <textarea
                              placeholder="Deskripsikan aktivitas ekskul..."
                              className="form-control"
                              value={ek.deskripsi || ''}
                              onChange={(e) => handleUpdateEkskul(idx, 'deskripsi', e.target.value)}
                              rows="4"
                              style={{ width: '100%', resize: 'vertical' }}
                            ></textarea>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Gambar / Logo Ekskul</label>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px' }}>
                              <div style={{ 
                                width: '55px', 
                                height: '55px', 
                                borderRadius: '8px', 
                                border: '1px solid #cbd5e1', 
                                overflow: 'hidden', 
                                backgroundColor: '#ffffff', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <img 
                                  src={ekskulPreviews[idx] || ek.image || '/images/ekskul_pramuka.svg'} 
                                  alt="Ekskul Preview" 
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleEkskulFileChange(idx, e.target.files[0])}
                                style={{ fontSize: '0.7rem', width: '100%' }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0, textAlign: 'center' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Ekstra Wajib</label>
                            <input
                              type="checkbox"
                              checked={!!ek.is_wajib}
                              onChange={(e) => handleUpdateEkskul(idx, 'is_wajib', e.target.checked)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEkskul(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.ekstrakurikuler || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada data ekstrakurikuler. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Daftar Prestasi Hebat Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daftar raihan kejuaraan murid yang dipajang di halaman Kesiswaan.</p>
                      </div>
                      <button type="button" onClick={handleAddKesiswaanPrestasi} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Prestasi Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.prestasi || []).map((pr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Peringkat (e.g. 1st / Juara)"
                              className="form-control"
                              value={pr.rank || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'rank', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={pr.icon || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Tingkat Lomba"
                              className="form-control"
                              value={pr.level || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'level', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Juara / Lomba..."
                              className="form-control"
                              value={pr.title || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Detail / Deskripsi Prestasi..."
                              className="form-control"
                              value={pr.desc || ''}
                              onChange={(e) => handleUpdateKesiswaanPrestasi(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKesiswaanPrestasi(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.prestasi || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada prestasi murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Galeri Karya Kreatif Kreasi Murid</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Etalase pameran kreasi seni, budaya, kerajinan tangan, atau puisi murid.</p>
                      </div>
                      <button type="button" onClick={handleAddKarya} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Karya Murid
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.kesiswaan?.karya || []).map((kr, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Ikon Emoji"
                              className="form-control"
                              value={kr.icon || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'icon', e.target.value)}
                              style={{ width: '100%', textAlign: 'center' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Judul Karya"
                              className="form-control"
                              value={kr.title || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'title', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Kategori / Tema (P5)"
                              className="form-control"
                              value={kr.category || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'category', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Penjelasan ringkas karya..."
                              className="form-control"
                              value={kr.desc || ''}
                              onChange={(e) => handleUpdateKarya(idx, 'desc', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveKarya(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.kesiswaan?.karya || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada karya murid kustom. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: PPDB ================= */}
              {activePageSubTab === 'ppdb' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <h3>Header Banner PPDB Portal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Banner atas yang terletak pada halaman Penerimaan Peserta Didik Baru (PPDB).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Judul Banner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pageContents.ppdb?.banner_title || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_title', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi Singkat Banner</label>
                        <textarea
                          className="form-control"
                          value={pageContents.ppdb?.banner_text || ''}
                          onChange={(e) => handleFieldChange('ppdb', 'banner_text', e.target.value)}
                          rows="2"
                          style={{ width: '100%', resize: 'vertical' }}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Ketentuan Usia & Syarat Berkas Pendaftaran</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Persyaratan kriteria utama usia anak serta unggahan dokumen digital untuk mendaftar.
                    </p>
                    
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Aturan Ambang Batas Usia</label>
                      <textarea
                        className="form-control"
                        value={pageContents.ppdb?.syarat_usia || ''}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_usia', e.target.value)}
                        rows="3"
                        style={{ width: '100%', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem' }}>Daftar Berkas Persyaratan (Tulis Setiap Syarat di Baris Baru)</label>
                      <textarea
                        className="form-control"
                        value={Array.isArray(pageContents.ppdb?.syarat_berkas) ? pageContents.ppdb.syarat_berkas.join('\n') : (pageContents.ppdb?.syarat_berkas || '')}
                        onChange={(e) => handleFieldChange('ppdb', 'syarat_berkas', e.target.value.split('\n'))}
                        rows="6"
                        placeholder="Tulis setiap syarat berkas dalam baris baru..."
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
                      ></textarea>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                        💡 Tekan Enter untuk membuat butir dokumen baru yang harus dilampirkan pendaftar.
                      </p>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3>Alur Pendaftaran (4 Langkah Sistematis)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                      Empat langkah panduan tahapan pendaftaran murid baru dari persiapan berkas hingga pengumuman kelulusan.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.alur_steps || []).map((step, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 4fr', gap: 'var(--space-md)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Langkah</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{step.num || (idx + 1)}</span>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Tahapan *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.title || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Penjelasan Singkat Aktivitas *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={step.desc || ''}
                              onChange={(e) => {
                                const updated = [...(pageContents.ppdb?.alur_steps || [])];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                handleFieldChange('ppdb', 'alur_steps', updated);
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Jadwal Penting Agenda PPDB</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Rentang tanggal pelaksanaan PPDB TA 2026/2027 berjalan.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBJadwal} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris Jadwal
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {(pageContents.ppdb?.jadwal || []).map((jd, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3.5fr 4fr auto', gap: 'var(--space-xs)', alignItems: 'center', backgroundColor: '#f8fafc', padding: 'var(--space-sm)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Nama Agenda / Kegiatan"
                              className="form-control"
                              value={jd.activity || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'activity', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                              type="text"
                              placeholder="Rentang Tanggal Pelaksanaan"
                              className="form-control"
                              value={jd.dates || ''}
                              onChange={(e) => handleUpdatePPDBJadwal(idx, 'dates', e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBJadwal(idx)}
                            className="btn-action-delete"
                            style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.jadwal || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada jadwal PPDB. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0 }}>Tanya Jawab PPDB (FAQ)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Informasi tanya jawab umum yang sering ditanyakan oleh calon pendaftar.</p>
                      </div>
                      <button type="button" onClick={handleAddPPDBFaq} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        ➕ Tambah Baris FAQ
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {(pageContents.ppdb?.faq || []).map((faqItem, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-sm)', alignItems: 'start', backgroundColor: '#f8fafc', padding: 'var(--space-md)', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pertanyaan (Question) *</label>
                              <input
                                type="text"
                                placeholder="Ketik pertanyaan utama di sini..."
                                className="form-control"
                                value={faqItem.q || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'q', e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jawaban (Answer) *</label>
                              <textarea
                                placeholder="Ketik jawaban penjelasan mendalam di sini..."
                                className="form-control"
                                value={faqItem.a || ''}
                                onChange={(e) => handleUpdatePPDBFaq(idx, 'a', e.target.value)}
                                rows="3"
                                style={{ width: '100%', resize: 'vertical' }}
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePPDBFaq(idx)}
                            className="btn-action-delete"
                            style={{ alignSelf: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      {(pageContents.ppdb?.faq || []).length === 0 && (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada daftar FAQ. Klik tombol di kanan atas untuk menambahkan baris baru.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SUB-TAB: GALERI ================= */}
              {activePageSubTab === 'galeri' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', animation: 'fadeIn 0.25s ease' }}>
                  <div className="settings-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: 0, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          📸 Kelola Galeri Kegiatan Sekolah
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                          Tambahkan, edit deskripsi, atau ganti foto-foto dokumentasi kegiatan SD Negeri Bobong yang tampil di halaman depan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="btn btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)'
                        }}
                      >
                        ➕ Tambah Foto Baru
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      {(pageContents.galeri?.gallery_items || [
                        { id: 'gallery_1', src: '/images/gallery_1.svg', alt: 'Suasana Belajar di Ruang Kelas Baru' },
                        { id: 'gallery_2', src: '/images/gallery_2.svg', alt: 'Upacara Bendera Hari Senin' },
                        { id: 'gallery_3', src: '/images/gallery_3.svg', alt: 'Latihan Tari Tradisional Maluku Utara' },
                        { id: 'gallery_4', src: '/images/gallery_4.svg', alt: 'Praktek Pembelajaran Olahraga di Lapangan' },
                        { id: 'gallery_5', src: '/images/gallery_5.svg', alt: 'Kegiatan Membaca Buku di Perpustakaan' },
                        { id: 'gallery_6', src: '/images/gallery_6.svg', alt: 'Pemberian Materi Kemah Pramuka' }
                      ]).map((item, idx) => {
                        const previewSrc = galleryPreviews[idx] || item.src;
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              overflow: 'hidden',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                            }}
                          >
                            <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f1f5f9' }}>
                              <img
                                src={previewSrc}
                                alt={item.alt || 'Pratinjau Foto'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/images/gallery_1.svg'; }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                display: 'flex',
                                gap: '6px'
                              }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryItem(idx)}
                                  className="btn-action-delete"
                                  style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                                  title="Hapus Foto"
                                >
                                  🗑️
                                </button>
                              </div>
                              <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                                color: '#ffffff',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backdropFilter: 'blur(4px)'
                              }}>
                                #{idx + 1}
                              </div>
                            </div>

                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flexGrow: 1 }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  Keterangan Foto (Alt Text)
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Deskripsi singkat kegiatan..."
                                  value={item.alt || ''}
                                  onChange={(e) => handleUpdateGalleryItem(idx, 'alt', e.target.value)}
                                  style={{ width: '100%', fontSize: '0.85rem' }}
                                />
                              </div>

                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  Ganti Berkas Gambar
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="file"
                                    id={`gallery-file-${idx}`}
                                    accept="image/*"
                                    onChange={(e) => handleGalleryFileChange(idx, e.target.files[0])}
                                    style={{ display: 'none' }}
                                  />
                                  <label
                                    htmlFor={`gallery-file-${idx}`}
                                    className="btn btn-secondary"
                                    style={{
                                      padding: '0.4rem 0.8rem',
                                      fontSize: '0.75rem',
                                      margin: 0,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      width: '100%',
                                      justifyContent: 'center',
                                      transition: 'all 0.2s ease',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                      <polyline points="17 8 12 3 7 8" />
                                      <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span>Pilih & Unggah Gambar</span>
                                  </label>
                                </div>
                                {galleryFiles[idx] && (
                                  <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#10b981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ✅ Siap diunggah: {galleryFiles[idx].name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Sticky Save Footer Panel */}
              <div style={{
                marginTop: 'var(--space-lg)',
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'sticky',
                bottom: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                zIndex: 100,
                alignItems: 'center',
                gap: '15px',
                animation: 'slideUp 0.3s ease'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ⚠️ Klik simpan untuk menerapkan semua perubahan di tab <strong>{activePageSubTab.toUpperCase()}</strong> ini ke database.
                </span>
                <button
                  type="button"
                  onClick={() => submitPageContents(activePageSubTab)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px 0 rgba(30, 64, 175, 0.3)'
                  }}
                >
                  💾 Simpan Konten Halaman ({activePageSubTab.toUpperCase()})
                </button>
              </div>

            </div>
          </section>

          {/* ================= TAB: AGENDA SEKOLAH ================= */}
          <section id="tab-agenda" className={`tab-pane ${activeTab === 'agenda' ? 'active' : ''}`}>
            <div className="admin-table">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0 }}>Daftar Agenda Kegiatan & Kalender Akademik</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kelola jadwal kegiatan sekolah, libur nasional, dan agenda penting lainnya.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventMonth('Juli 2025');
                    setEventDates('');
                    setEventDesc('');
                    setAgendaModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ➕ Tambah Agenda Baru
                </button>
              </div>

              {/* Agenda Search Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari agenda kegiatan berdasarkan bulan, tanggal, atau deskripsi kegiatan..."
                  value={agendaSearch}
                  onChange={(e) => setAgendaSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', left: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
              </div>

              {/* Table or Grid */}
              <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
                <table className="table-custom" style={{ fontSize: '0.9rem', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                      <th style={{ width: '180px' }}>Bulan / Tahun</th>
                      <th style={{ width: '220px' }}>Rentang Tanggal</th>
                      <th>Nama Kegiatan / Deskripsi Agenda</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((evt, idx) => (
                        <tr key={evt.id || idx}>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{evt.month || '-'}</td>
                          <td style={{ fontWeight: 500, color: 'var(--primary)' }}>📅 {evt.dates || '-'}</td>
                          <td style={{ fontWeight: 500, color: '#1e293b' }}>{evt.desc || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEvent(evt);
                                  setEventMonth(evt.month || 'Juli 2025');
                                  setEventDates(evt.dates || '');
                                  setEventDesc(evt.desc || '');
                                  setAgendaModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', border: '1px solid #cbd5e1' }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAgendaEvent(evt.id)}
                                className="btn-action-delete"
                                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', margin: 0 }}
                              >
                                🗑️ Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Tidak ada agenda sekolah yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL WITH OPTIONS */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
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
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
              Konfirmasi Penghapusan
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {deleteIsBulk 
                ? 'Pilih lokasi/cakupan database untuk mengosongkan SEMUA data pendaftar:' 
                : `Pilih lokasi/cakupan database untuk menghapus data pendaftaran dari "${deleteTargetName}":`
              }
            </p>

            {deleteIsBulk && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', fontSize: '0.8rem', color: '#c2410c', textAlign: 'left' }}>
                <strong>Pemberitahuan Keamanan:</strong> Menghapus seluruh data pendaftaran memerlukan konfirmasi tertulis. Silakan ketik kata kunci <strong>HAPUS SEMUA</strong> di bawah untuk mengaktifkan pilihan hapus:
                <input 
                  type="text" 
                  id="bulk-delete-confirm-input" 
                  placeholder="Ketik HAPUS SEMUA" 
                  value={bulkDeleteConfirmText}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    marginTop: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                  onChange={(e) => setBulkDeleteConfirmText(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                id="btn-del-both"
                disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                className="btn btn-danger" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  fontSize: '0.9rem',
                  opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                }}
                onClick={() => executeDelete('both')}
              >
                🗑️ Hapus dari Lokal & Supabase (Semua)
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  id="btn-del-local"
                  disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '0.75rem', 
                    fontSize: '0.85rem',
                    color: '#dc2626',
                    borderColor: '#fca5a5',
                    backgroundColor: '#fef2f2',
                    opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                  }}
                  onClick={() => executeDelete('local')}
                >
                  🖥️ Hanya Lokal
                </button>
                <button 
                  id="btn-del-supabase"
                  disabled={deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA'}
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '0.75rem', 
                    fontSize: '0.85rem',
                    color: '#2563eb',
                    borderColor: '#bfdbfe',
                    backgroundColor: '#eff6ff',
                    opacity: (deleteIsBulk && bulkDeleteConfirmText !== 'HAPUS SEMUA') ? 0.5 : 1
                  }}
                  onClick={() => executeDelete('supabase')}
                >
                  ☁️ Hanya Supabase
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'left', lineHeight: '1.4', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                💡 <em>Catatan: Disarankan menghapus dari "Keduanya". Jika hanya dihapus dari salah satu, data dapat tersinkronisasi kembali saat halaman disegarkan karena sinkronisasi otomatis.</em>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetNik('');
                  setDeleteTargetName('');
                  setDeleteIsBulk(false);
                  setBulkDeleteConfirmText('');
                }}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ADD TEACHER MODAL */}
      {addTeacherModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
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
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
                ➕ Tambah Guru / Staf Baru
              </h3>
              <button 
                onClick={() => setAddTeacherModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1,
                  padding: '4px'
                }}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Isi formulir berikut untuk menambahkan data pendidik baru ke halaman profil.
            </p>

            <form id="form-teacher" onSubmit={handleTeacherAdd} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="teacher_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  id="teacher_name"
                  name="name"
                  className="form-control"
                  placeholder="Contoh: Fatimah, S.Pd.SD."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="teacher_role" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jabatan / Peran *</label>
                  <input
                    type="text"
                    id="teacher_role"
                    name="role"
                    className="form-control"
                    placeholder="Contoh: Wali Kelas 1, Guru Agama"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Kepegawaian *</label>
                  <select id="teacher_status" name="status" className="form-control" style={{ width: '100%', boxSizing: 'border-box' }} required>
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PPPK PW">PPPK PW</option>
                    <option value="Honorer Daerah">Honorer Daerah</option>
                    <option value="Honorer Sekolah">Honorer Sekolah</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="teacher_details" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pangkat / Keterangan Lain (Opsional)</label>
                <input
                  type="text"
                  id="teacher_details"
                  name="details"
                  className="form-control"
                  placeholder="Contoh: Pembina Tk. I / IV-b, Guru Kelas Bawah"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="teacher_nip" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIP (Nomor Induk Pegawai - Opsional)</label>
                <input
                  type="text"
                  id="teacher_nip"
                  name="nip"
                  className="form-control"
                  placeholder="Contoh: 19820311 200904 2 001"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Foto / Avatar (Pilih Stok / Unggah)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                    <img id="avatar-preview" src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      id="teacher_image_select"
                      value={teacherImageSelect}
                      className="form-control"
                      onChange={handleTeacherImageSelectChange}
                      style={{ marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}
                    >
                      <option value="/images/teacher_1.png">Stok Ilustrasi Pria (Default)</option>
                      <option value="/images/teacher_2.jpg">Stok Ilustrasi Wanita Berhijab (Default)</option>
                      <option value="/images/teacher_3.png">Stok Ilustrasi Wanita (Tanpa Hijab)</option>
                      <option value="/images/teacher_4.jpg">Template Pas Foto Hijab (Merah)</option>
                      <option value="/images/teacher_5.png">Template Pas Foto Hijab (Putih)</option>
                      <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                      <option value="/images/principal.svg">Stok Ilustrasi Kepala Sekolah (principal.svg)</option>
                      <option value="custom">Foto Kustom / Unggahan Aktif</option>
                    </select>

                    <input
                      type="hidden"
                      id="teacher_image_url"
                      name="image"
                      value={teacherImageUrl}
                      onChange={handleTeacherImageUrlChange}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label htmlFor="teacher_photo" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.85rem', color: '#64748b' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB - Opsional):</label>
                  <input
                    type="file"
                    id="teacher_photo"
                    name="photo"
                    className="form-control"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleTeacherPhotoChange}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                    💡 <strong>Rekomendasi:</strong> Gunakan foto format kotak/persegi (1:1) atau rasio potret agar kartu struktur organisasi di halaman Profil terlihat rapi dan simetris tanpa terpotong secara paksa oleh CSS.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => setAddTeacherModalOpen(false)}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  id="btn-submit-teacher" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM EDIT TEACHER MODAL */}
      {editTeacherModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
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
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
                ✏️ Edit Data Guru / Staf
              </h3>
              <button 
                onClick={() => setEditTeacherModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1,
                  padding: '4px'
                }}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Perbarui informasi guru di bawah ini. Tekan tombol Simpan Perubahan jika sudah selesai.
            </p>

            <form id="form-edit-teacher" onSubmit={handleTeacherUpdateSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="edit_teacher_name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  id="edit_teacher_name"
                  name="name"
                  className="form-control"
                  placeholder="Contoh: Fatimah, S.Pd.SD."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="edit_teacher_role" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Jabatan / Peran *</label>
                  <input
                    type="text"
                    id="edit_teacher_role"
                    name="role"
                    className="form-control"
                    placeholder="Contoh: Wali Kelas 1, Guru Agama"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_teacher_status" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Status Kepegawaian *</label>
                  <select 
                    id="edit_teacher_status" 
                    name="status" 
                    className="form-control" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    required
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PPPK PW">PPPK PW</option>
                    <option value="Honorer Daerah">Honorer Daerah</option>
                    <option value="Honorer Sekolah">Honorer Sekolah</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_details" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Pangkat / Keterangan Lain (Opsional)</label>
                <input
                  type="text"
                  id="edit_teacher_details"
                  name="details"
                  className="form-control"
                  placeholder="Contoh: Pembina Tk. I / IV-b, Guru Kelas Bawah"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_teacher_nip" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>NIP (Nomor Induk Pegawai - Opsional)</label>
                <input
                  type="text"
                  id="edit_teacher_nip"
                  name="nip"
                  className="form-control"
                  placeholder="Contoh: 19820311 200904 2 001"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={editNip}
                  onChange={(e) => setEditNip(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Foto / Avatar (Pilih Stok / Unggah)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-main)' }}>
                    <img id="edit-avatar-preview" src={editAvatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      id="edit_teacher_image_select"
                      value={editTeacherImageSelect}
                      className="form-control"
                      onChange={handleEditTeacherImageSelectChange}
                      style={{ marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}
                    >
                      <option value="/images/teacher_1.png">Stok Ilustrasi Pria (Default)</option>
                      <option value="/images/teacher_2.jpg">Stok Ilustrasi Wanita Berhijab (Default)</option>
                      <option value="/images/teacher_3.png">Stok Ilustrasi Wanita (Tanpa Hijab)</option>
                      <option value="/images/teacher_4.jpg">Template Pas Foto Hijab (Merah)</option>
                      <option value="/images/teacher_5.png">Template Pas Foto Hijab (Putih)</option>
                      <option value="/images/teacher_7.jpg">Foto Ibu Guru Husnita (teacher_7.jpg)</option>
                      <option value="/images/principal.svg">Stok Ilustrasi Kepala Sekolah (principal.svg)</option>
                      <option value="custom">Foto Kustom / Unggahan Aktif</option>
                    </select>

                    <input
                      type="hidden"
                      id="edit_teacher_image_url"
                      name="image"
                      value={editTeacherImageUrl}
                      onChange={handleEditTeacherImageUrlChange}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label htmlFor="edit_teacher_photo" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.85rem', color: '#64748b' }}>Atau Unggah Foto Baru (.png, .jpg, .jpeg, maks 1MB - Opsional):</label>
                  <input
                    type="file"
                    id="edit_teacher_photo"
                    name="photo"
                    className="form-control"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleEditTeacherPhotoChange}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                    💡 <strong>Rekomendasi:</strong> Gunakan foto format kotak/persegi (1:1) atau rasio potret agar kartu struktur organisasi di halaman Profil terlihat rapi dan simetris tanpa terpotong secara paksa oleh CSS.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => setEditTeacherModalOpen(false)}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  id="btn-edit-submit-teacher" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DETAIL MODAL PPDB & CETAK BUKTI ================= */}
      {isDetailModalOpen && selectedRecord && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '850px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>
            
            {/* Modal Header (No Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary-dark)', color: '#ffffff', borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>🔍 Lembar Detail Pendaftaran Calon Siswa</h3>
              <button 
                type="button" 
                onClick={() => { setIsDetailModalOpen(false); setSelectedRecord(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = 1}
                onMouseOut={(e) => e.target.style.opacity = 0.8}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Printable Slip */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
              
              {/* Slip layout inside a card */}
              <div id="print-slip-container" className="print-slip" style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                {/* Kop Surat Sekolah */}
                <div className="print-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '3px double #0f172a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                  <img src="/images/logo_pemda_taliabu.png" alt="Logo Pemda" className="print-logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
                  <div className="print-title" style={{ flexGrow: 1, textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' }}>PEMERINTAH KABUPATEN PULAU TALIABU</h2>
                    <h3 style={{ margin: '1px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                    <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SD NEGERI BOBONG</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500, lineHeight: '1.4' }}>Alamat: Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>NPSN: 60200589 | Email: sdn.bobong@gmail.com</p>
                  </div>
                  <img src="/images/logo_sekolah.png" alt="Logo Sekolah" className="print-logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '1px' }}>BUKTI PENDAFTARAN CALON SISWA BARU (PPDB)</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Tahun Ajaran: 2026/2027</p>
                </div>

                {/* Subtitle Section 1 */}
                <div style={{ borderLeft: '4px solid var(--primary-dark)', paddingLeft: '8px', marginBottom: '1.25rem', textAlign: 'left' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>A. DATA UTAMA PENDAFTARAN ONLINE (SISTEM)</h5>
                </div>

                {/* Grid Fields */}
                <div className="print-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                  
                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>ID Pendaftaran</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.id || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Waktu Pendaftaran</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.waktu_daftar || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Lengkap Calon Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2px' }}>{selectedRecord.nama_lengkap || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nomor Induk Kependudukan (NIK)</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nik_siswa || selectedRecord.nik || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Tempat, Tanggal Lahir</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.tempat_lahir || '-'}, {selectedRecord.tanggal_lahir || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jenis Kelamin</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.jenis_kelamin || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jalur Seleksi PPDB</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
                      <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        🚀 {selectedRecord.jalur_ppdb || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Status Kelulusan Verifikasi</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px', color: selectedRecord.status === 'Terverifikasi' ? '#16a34a' : selectedRecord.status === 'Ditolak' ? '#dc2626' : '#ea580c' }}>
                      <span style={{ backgroundColor: selectedRecord.status === 'Terverifikasi' ? '#f0fdf4' : selectedRecord.status === 'Ditolak' ? '#fef2f2' : '#fff7ed', border: '1px solid currentColor', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        {selectedRecord.status || 'Diterima Sistem'}
                      </span>
                    </div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Ibu Kandung</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedRecord.nama_ibu_kandung || selectedRecord.nama_ibu || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>No. HP Orang Tua / Wali</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>📞 {selectedRecord.nomor_hp_orangtua || selectedRecord.no_hp || '-'}</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', gridColumn: 'span 2' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Alamat Tempat Tinggal (Domisili)</div>
                    <div className="print-field-value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '2px', lineHeight: '1.4' }}>{selectedRecord.alamat_domisili || selectedRecord.alamat || '-'}</div>
                  </div>
                </div>

                {/* Subtitle Section 2 */}
                <div style={{ borderLeft: '4px solid #475569', paddingLeft: '8px', marginBottom: '1.25rem', marginTop: '2.5rem', textAlign: 'left' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>B. DATA PENDUKUNG VERIFIKASI (Diisi Manual / Saat Daftar Ulang)</h5>
                </div>

                {/* Grid Fields Manual */}
                <div className="print-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Lengkap Ayah Kandung</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>........................................................................</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Pekerjaan Orang Tua</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>........................................................................</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Agama Calon Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>........................................................................</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Asal Sekolah (TK / PAUD)</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>........................................................................</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Nama Panggilan Siswa</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>........................................................................</div>
                  </div>

                  <div className="print-field" style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                    <div className="print-field-label" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Jumlah Bersaudara (Anak Ke)</div>
                    <div className="print-field-value" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '4px' }}>Anak Ke ........ Dari ........ Bersaudara</div>
                  </div>
                </div>

                {/* Catatan / Keterangan tambahan di slip */}
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>⚠️ INSTRUKSI DAFTAR ULANG:</h5>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#475569', lineHeight: '1.6' }}>
                    <li>Simpan atau cetak bukti pendaftaran elektronik ini secara fisik.</li>
                    <li>Bawa bukti pendaftaran ini beserta berkas kelengkapan (FC Akta Lahir, FC Kartu Keluarga, FC KTP Orang Tua) ke SDN Bobong.</li>
                    <li>Serahkan seluruh berkas ke Panitia PPDB di ruang sekretariat pada jam kerja (08:00 - 12:00 WITA) untuk validasi berkas fisik.</li>
                  </ol>
                </div>

                {/* Signature Block */}
                <div className="print-footer-signature" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center' }}>
                  <div className="signature-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '120px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Pendaftar / Orang Tua</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, borderTop: '1px solid #94a3b8', width: '150px', paddingTop: '4px' }}>{selectedRecord.nama_ibu_kandung || selectedRecord.nama_ibu || 'Orang Tua Wali'}</span>
                  </div>
                  <div className="signature-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '120px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Panitia PPDB SDN Bobong</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, borderTop: '1px solid #94a3b8', width: '150px', paddingTop: '4px' }}>Nama Petugas Verifikator</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer (No Print) */}
            <div className="no-print" style={{ display: 'flex', gap: '0.75rem', padding: '1.25rem 1.75rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff', borderRadius: '0 0 16px 16px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => { setIsDetailModalOpen(false); setSelectedRecord(null); }}
              >
                ✕ Tutup Detail
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => window.print()}
              >
                🖨️ Cetak Bukti Pendaftaran (Slip)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT AGENDA EVENT ================= */}
      {agendaModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingEvent ? '✏️ Edit Agenda Kegiatan' : '➕ Tambah Agenda Sekolah Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveAgendaEvent} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_month" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Bulan & Tahun</label>
                  <input
                    type="text"
                    id="event_month"
                    className="form-control"
                    placeholder="Contoh: Juli 2025"
                    value={eventMonth}
                    onChange={(e) => setEventMonth(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_dates" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Rentang Tanggal</label>
                  <input
                    type="text"
                    id="event_dates"
                    className="form-control"
                    placeholder="Contoh: 14 - 19 Juli 2025"
                    value={eventDates}
                    onChange={(e) => setEventDates(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_desc" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Deskripsi Kegiatan</label>
                  <textarea
                    id="event_desc"
                    className="form-control"
                    placeholder="Tulis nama kegiatan akademis atau detail agenda sekolah di sini..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows="3"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

