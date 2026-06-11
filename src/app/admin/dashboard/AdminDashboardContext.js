// Created automatically via Refactor Context Script
'use client';



import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PremiumLoadingOverlay from '../../../components/PremiumLoadingOverlay';
import RichTextEditor from '../../../components/RichTextEditor';

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

// Client-side teacher sorting helpers matching the server-side logic in database.js
const getTeacherSortWeightClient = (teacher) => {
  const role = (teacher.role || "").toLowerCase();
  const details = (teacher.details || "").toLowerCase();

  // 1. Kepala Sekolah
  if (role.includes("kepala sekolah")) {
    return { priority: 1, classNum: 0 };
  }

  // 2. Tata Usaha
  if (role.includes("tata usaha") || role.includes("tu") || role.includes("koordinator tu")) {
    return { priority: 2, classNum: 0 };
  }

  // 3. Bendahara
  if (role.includes("bendahara")) {
    return { priority: 3, classNum: 0 };
  }

  // 4. Komite
  if (role.includes("komite")) {
    return { priority: 4, classNum: 0 };
  }

  // 5. Guru Kelas / Wali Kelas (Wali Kelas)
  let classMatch = role.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i) || details.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i);
  if (classMatch) {
    const rawClass = classMatch[1].toLowerCase();
    const romanMap = {
      'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
    };
    const classNum = romanMap[rawClass] || 99;
    return { priority: 5, classNum: classNum };
  }

  if (role.includes("guru kelas") || role.includes("wali kelas")) {
    return { priority: 5, classNum: 99 };
  }

  // 6. Guru Mata Pelajaran / Bidang Studi / generic Guru
  if (role.includes("guru") || details.includes("pendidik bidang studi") || details.includes("guru") || role.includes("bidang studi")) {
    return { priority: 6, classNum: 0 };
  }

  // 7. Others
  return { priority: 7, classNum: 0 };
};

const sortTeachersListClient = (teachersList) => {
  if (!Array.isArray(teachersList)) return [];
  return [...teachersList].sort((a, b) => {
    const weightA = getTeacherSortWeightClient(a);
    const weightB = getTeacherSortWeightClient(b);

    if (weightA.priority !== weightB.priority) {
      return weightA.priority - weightB.priority;
    }

    if (weightA.priority === 5) {
      if (weightA.classNum !== weightB.classNum) {
        return weightA.classNum - weightB.classNum;
      }
    }

    const nameA = (a.name || "").toLowerCase().trim();
    const nameB = (b.name || "").toLowerCase().trim();
    return nameA.localeCompare(nameB);
  });
};

// Initialize client-side Supabase client for Realtime subscription
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const clientSupabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;



export const AdminDashboardContext = createContext(null);


export function AdminDashboardProvider({
  children,
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
  initialMessages = [],
  initialGraduation = [],
  initialAuditLogs = [],
  initialStudents = [],
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Memproses...');

  // Intercept all write/mutation fetch requests to show premium loading overlay
  const fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : (input?.url || '');
    const method = (init?.method || 'GET').toUpperCase();
    const isAuthCall = method !== 'GET' && url.includes('/api/auth');

    if (method !== 'GET') {
      let msg = 'Sedang memproses...';
      if (url.includes('/api/auth/change-password')) {
        msg = 'Mengubah kata sandi admin...';
      } else if (url.includes('/api/config') && init?.body && typeof init.body === 'string' && init.body.includes('restore_backup')) {
        msg = 'Memulihkan data cadangan...';
      } else if (url.includes('/api/config')) {
        msg = 'Menyimpan konfigurasi sekolah...';
      } else if (url.includes('/api/teachers')) {
        msg = 'Memperbarui data guru & staf...';
      } else if (url.includes('/api/news')) {
        msg = 'Memproses berita & pengumuman...';
      } else if (url.includes('/api/achievements')) {
        msg = 'Menyimpan data prestasi siswa...';
      } else if (url.includes('/api/agenda')) {
        msg = 'Memperbarui agenda kegiatan...';
      } else if (url.includes('/api/messages')) {
        msg = 'Memproses kotak masuk & saran...';
      } else if (url.includes('/api/graduation')) {
        msg = 'Memperbarui data kelulusan...';
      } else if (url.includes('/api/ppdb')) {
        msg = 'Memperbarui status pendaftaran...';
      } else if (url.includes('/api/backup') || url.includes('backup')) {
        msg = 'Mencadangkan / memulihkan data...';
      } else if (url.includes('/api/auth')) {
        msg = 'Memproses keamanan sesi...';
      }

      setIsProcessing(true);
      setProcessingMessage(msg);
    }

    let response;
    try {
      response = await window.fetch(input, init);
      return response;
    } catch (err) {
      if (method !== 'GET') {
        setIsProcessing(false);
      }
      throw err;
    } finally {
      if (method !== 'GET') {
        // If it's a successful auth call, keep the loading overlay active until redirected.
        // Otherwise (non-auth calls, or if response is not ok), turn off the loading overlay.
        const shouldKeepLoading = isAuthCall && response && response.ok;
        if (!shouldKeepLoading) {
          setIsProcessing(false);
        }
      }
    }
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTooltip, setChartTooltip] = useState({ show: false, x: 0, y: 0, title: '', value: '' });

  const handleMouseMove = (e, title, value) => {
    const container = e.currentTarget.closest('.analytics-card');
    if (container) {
      const rect = container.getBoundingClientRect();
      setChartTooltip({
        show: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        title,
        value
      });
    }
  };

  const handleMouseLeave = () => {
    setChartTooltip(prev => ({ ...prev, show: false }));
  };
  const [records, setRecords] = useState(initialRecords);
  const [config, setConfig] = useState(initialConfig);
  const [newsList, setNewsList] = useState(initialNewsList);
  const [editingNews, setEditingNews] = useState(null);
  const [newsEditorKey, setNewsEditorKey] = useState(0);
  const [newsPhotos, setNewsPhotos] = useState([]);
  const [newsPhotoPreviews, setNewsPhotoPreviews] = useState([]);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [achievements, setAchievements] = useState(initialAchievements || []);
  const [messages, setMessages] = useState(initialMessages);
  const [graduation, setGraduation] = useState(initialGraduation);
  const [students, setStudents] = useState(initialStudents);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('Semua');
  const [studentGenderFilter, setStudentGenderFilter] = useState('Semua');
  const [studentStatusFilter, setStudentStatusFilter] = useState('Semua');

  // Modal and Form States
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form Fields
  const [studNisn, setStudNisn] = useState('');
  const [studNis, setStudNis] = useState('');
  const [studName, setStudName] = useState('');
  const [studClass, setStudClass] = useState('1A');
  const [studGender, setStudGender] = useState('Laki-laki');
  const [studBirthPlace, setStudBirthPlace] = useState('');
  const [studBirthDate, setStudBirthDate] = useState('');
  const [studAddress, setStudAddress] = useState('');
  const [studParentName, setStudParentName] = useState('');
  const [studParentPhone, setStudParentPhone] = useState('');
  const [studStatus, setStudStatus] = useState('Aktif');
  const [studGrades, setStudGrades] = useState({
    ppkn: '',
    indonesia: '',
    matematika: '',
    ipas: '',
    seni: '',
    pjok: '',
    inggris: '',
    agama: '',
    mulok: ''
  });

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
  const [p5Files, setP5Files] = useState({});
  const [p5Previews, setP5Previews] = useState({});

  // ================= NEW STATES FOR PREMIUM DASHBOARD UPGRADES =================
  // PPDB Filter & Pagination
  const [ppdbSearch, setPpdbSearch] = useState('');
  const [ppdbFilterJalur, setPpdbFilterJalur] = useState('Semua');
  const [ppdbFilterStatus, setPpdbFilterStatus] = useState('Semua');
  const [ppdbFilterTahun, setPpdbFilterTahun] = useState('Semua');
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

  // --- NEW INTEGRATED STATES FOR 5 EXTRA MAIN TABS ---
  // Downloads States
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [downloadTitle, setDownloadTitle] = useState('');
  const [downloadCategory, setDownloadCategory] = useState('PPDB');
  const [downloadFileUrl, setDownloadFileUrl] = useState('');
  const [downloadSearch, setDownloadSearch] = useState('');

  // FAQs States
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // Gallery States
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryType, setGalleryType] = useState('image');
  const [galleryCategory, setGalleryCategory] = useState('umum');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryDate, setGalleryDate] = useState('');
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState('');
  const [gallerySourceType, setGallerySourceType] = useState('url'); // 'url' or 'upload'

  // Messages States
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilterType, setMessageFilterType] = useState('all');
  const [messageFilterStatus, setMessageFilterStatus] = useState('all');

  // Graduation States
  const [gradSearch, setGradSearch] = useState('');
  const [gradModalOpen, setGradModalOpen] = useState(false);
  const [editingGrad, setEditingGrad] = useState(null);
  const [gradNisn, setGradNisn] = useState('');
  const [gradNoPeserta, setGradNoPeserta] = useState('');
  const [gradName, setGradName] = useState('');
  const [gradStatus, setGradStatus] = useState('LULUS');
  const [gradSkNumber, setGradSkNumber] = useState('');
  const [gradBirthPlace, setGradBirthPlace] = useState('');
  const [gradBirthDate, setGradBirthDate] = useState('');
  const [gradParentName, setGradParentName] = useState('');

  // Security Tab States
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [securitySearch, setSecuritySearch] = useState('');
  const [securityFilter, setSecurityFilter] = useState('all');

  // Security Form & Modal States
  const [blacklistIp, setBlacklistIp] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [blockDurationMin, setBlockDurationMin] = useState(5);
  const [autoPruneDays, setAutoPruneDays] = useState(0);
  const [purgeLogsConfirmation, setPurgeLogsConfirmation] = useState('');
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  useEffect(() => {
    if (config?.security_settings) {
      setMaxAttempts(config.security_settings.max_attempts ?? 5);
      setBlockDurationMin(config.security_settings.block_duration_min ?? 5);
      setAutoPruneDays(config.security_settings.auto_prune_days ?? 0);
    }
  }, [config]);

  const activeThreats = (config?.suspicious_attempts || []).filter(a => a.attempts >= 3 && a.resolved !== true);


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
    const name = config?.ppdb_contacts?.nama_humas || "";
    const matched = (teachers || []).find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(name));
    return matched ? matched.nip : (config?.ppdb_contacts?.nip_humas || "");
  })();

  const syncNipOperator = (() => {
    const name = config?.ppdb_contacts?.nama_operator || "";
    const matched = (teachers || []).find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(name));
    return matched ? matched.nip : (config?.ppdb_contacts?.nip_operator || "");
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


  const handleP5FileChange = (index, file) => {
    if (file) {
      setP5Files(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setP5Previews(prev => ({ ...prev, [index]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddP5Project = () => {
    const current = pageContents.akademik?.p5_projects || [];
    const updated = [
      ...current,
      {
        id: 'p5_' + Date.now(),
        title: '',
        badge: '',
        desc: '',
        parentGuide: [],
        skills: [],
        color: '#1E40AF',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop'
      }
    ];
    handleFieldChange('akademik', 'p5_projects', updated);
  };

  const handleUpdateP5Project = (index, key, val) => {
    const updated = [...(pageContents.akademik?.p5_projects || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('akademik', 'p5_projects', updated);
  };

  const handleRemoveP5Project = (index) => {
    const updated = (pageContents.akademik?.p5_projects || []).filter((_, i) => i !== index);
    handleFieldChange('akademik', 'p5_projects', updated);
    
    // Clean up file/preview attachments
    const updatedP5Files = { ...p5Files };
    delete updatedP5Files[index];
    setP5Files(updatedP5Files);

    const updatedP5Previews = { ...p5Previews };
    delete updatedP5Previews[index];
    setP5Previews(updatedP5Previews);
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
    setIsProcessing(true);
    setProcessingMessage(`Menyimpan konten halaman ${pageName.toUpperCase()}...`);
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
    } finally {
      setIsProcessing(false);
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
      Object.keys(p5Files).forEach(index => {
        filesToUpload[`p5_image_${index}`] = p5Files[index];
      });
    } else if (pageName === 'kesiswaan') {
      Object.keys(ekskulFiles).forEach(index => {
        filesToUpload[`ekskul_image_${index}`] = ekskulFiles[index];
      });
    }

    await handlePageContentsSave(pageName, dataToSave, filesToUpload);
    
    if (pageName === 'profil') {
      setSejarahFile(null);
    } else if (pageName === 'akademik') {
      setKurikulumFile(null);
      setP5Files({});
      setP5Previews({});
    } else if (pageName === 'kesiswaan') {
      setEkskulFiles({});
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
  const [editSubject, setEditSubject] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [editMotto, setEditMotto] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [addPassword, setAddPassword] = useState('');
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


  // 1-Hour Session Auto-Logout Check
  useEffect(() => {
    let expiry = localStorage.getItem('admin_session_expiry');
    // Safe default fallback if not set yet (1 hour from current initial access)
    if (!expiry) {
      expiry = String(Date.now() + 60 * 60 * 1000);
      localStorage.setItem('admin_session_expiry', expiry);
    }

    const checkSessionExpiry = async () => {
      const now = Date.now();
      if (now >= Number(expiry)) {
        clearInterval(sessionCheckInterval);
        alert('Sesi login Anda telah habis (1 jam). Anda akan otomatis di-logout demi keamanan.');
        try {
          const res = await fetch('/api/auth', { method: 'DELETE' });
          if (res.ok) {
            localStorage.removeItem('admin_session_expiry');
            router.push('/admin/login');
            router.refresh();
          } else {
            window.location.href = '/admin/login';
          }
        } catch (err) {
          console.error("Gagal otomatis logout:", err);
          window.location.href = '/admin/login';
        }
      }
    };

    // Run initial check immediately
    checkSessionExpiry();

    // Check periodically every 15 seconds
    const sessionCheckInterval = setInterval(checkSessionExpiry, 15000);

    return () => clearInterval(sessionCheckInterval);
  }, [router]);

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

  // Realtime subscription for PPDB and Guestbook
  useEffect(() => {
    if (!clientSupabase) return;

    console.log('Establishing Realtime connections...');

    // Listen to new registrations in ppdb_sdn_bobong table
    const ppdbChannel = clientSupabase
      .channel('ppdb-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ppdb_sdn_bobong' },
        (payload) => {
          console.log('Realtime PPDB INSERT payload:', payload);
          const newRecord = payload.new;
          if (newRecord) {
            // Ensure ID is set properly
            newRecord.id = newRecord.id || newRecord.nik_siswa || newRecord.nik;
            // Map status
            newRecord.status = newRecord.status || 'Diterima Sistem';
            // Auto calculate tahun_ajaran if missing
            if (!newRecord.tahun_ajaran && newRecord.waktu_daftar) {
              const year = parseInt(newRecord.waktu_daftar.substring(0, 4), 10);
              newRecord.tahun_ajaran = !isNaN(year) ? `${year}/${year + 1}` : '2026/2027';
            } else if (!newRecord.tahun_ajaran) {
              newRecord.tahun_ajaran = '2026/2027';
            }

            // Append to local records state
            setRecords(prev => {
              const exists = prev.some(r => (r.nik_siswa || r.nik || r.id) === (newRecord.nik_siswa || newRecord.nik || newRecord.id));
              if (exists) return prev;
              return [newRecord, ...prev];
            });

            showToast('success', `🔔 Pendaftar baru terdeteksi: ${newRecord.nama_lengkap}!`);
          }
        }
      )
      .subscribe();

    // Listen to new guestbook entries
    const guestbookChannel = clientSupabase
      .channel('guestbook-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_sdn_bobong' },
        (payload) => {
          console.log('Realtime Guestbook INSERT payload:', payload);
          const newMsg = payload.new;
          if (newMsg) {
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMsg.id);
              if (exists) return prev;
              return [newMsg, ...prev];
            });
            showToast('success', `✉️ Pesan baru di Buku Tamu dari: ${newMsg.nama}!`);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Realtime channels...');
      clientSupabase.removeChannel(ppdbChannel);
      clientSupabase.removeChannel(guestbookChannel);
    };
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
        localStorage.removeItem('admin_session_expiry');
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
    const marqueeSpeed = parseInt(form.elements['marquee_speed']?.value || '40', 10);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'announcements', announcements, marquee_speed: marqueeSpeed })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi website berhasil disimpan.');
        setConfig(prev => ({ 
          ...prev, 
          marquee_announcements: announcements,
          marquee_speed: marqueeSpeed
        }));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleMaintenanceModeToggle = async (e) => {
    const isMaintenance = e.target.checked;
    
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'toggle_maintenance', maintenance_mode: isMaintenance })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', isMaintenance ? '🛠️ Mode Pemeliharaan AKTIF. Seluruh halaman publik dikunci.' : '✅ Mode Pemeliharaan NONAKTIF. Website dapat diakses publik.');
        setConfig(prev => ({
          ...prev,
          stats: {
            ...(prev.stats || {}),
            maintenance_mode: isMaintenance
          }
        }));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal mengubah mode pemeliharaan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleAllowCopyToggle = async (e) => {
    const isAllowCopy = e.target.checked;
    
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'toggle_allow_copy', allow_copy: isAllowCopy })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', isAllowCopy ? '🔓 Menyalin teks di halaman publik SEKARANG DIIZINKAN.' : '🔒 Menyalin teks di halaman publik SEKARANG DILARANG.');
        setConfig(prev => ({
          ...prev,
          stats: {
            ...(prev.stats || {}),
            allow_copy: isAllowCopy
          }
        }));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal mengubah pengaturan izin salin teks.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // ================= NEW PREMIUM HANDLERS =================
  // --- 1. Downloads Handlers ---
  const handleSaveDownload = async (e) => {
    e.preventDefault();
    const list = config.downloads || [];
    let updatedList;
    if (editingDownload) {
      updatedList = list.map(item => item.id === editingDownload.id ? { ...item, title: downloadTitle, category: downloadCategory, fileUrl: downloadFileUrl } : item);
    } else {
      const newItem = {
        id: `dl-${Date.now()}`,
        title: downloadTitle,
        category: downloadCategory,
        fileUrl: downloadFileUrl,
        date: new Date().toISOString().split('T')[0]
      };
      updatedList = [...list, newItem];
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'downloads', downloads: updatedList })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Pusat Unduhan berhasil diperbarui!');
        setConfig(prev => ({ ...prev, downloads: updatedList }));
        setDownloadModalOpen(false);
        setEditingDownload(null);
        setDownloadTitle('');
        setDownloadFileUrl('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui Pusat Unduhan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteDownload = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berkas unduhan ini?')) return;
    const list = config.downloads || [];
    const updatedList = list.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'downloads', downloads: updatedList })
      });
      if (res.ok) {
        showToast('success', 'Berkas unduhan berhasil dihapus!');
        setConfig(prev => ({ ...prev, downloads: updatedList }));
        router.refresh();
      } else {
        showToast('danger', 'Gagal menghapus berkas unduhan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // --- 2. FAQs Handlers ---
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const list = config.faqs || [];
    let updatedList;
    if (editingFaq) {
      updatedList = list.map(item => item.id === editingFaq.id ? { ...item, question: faqQuestion, answer: faqAnswer } : item);
    } else {
      const newItem = {
        id: `faq-${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer
      };
      updatedList = [...list, newItem];
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'faqs', faqs: updatedList })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'FAQ Sekolah berhasil diperbarui!');
        setConfig(prev => ({ ...prev, faqs: updatedList }));
        setFaqModalOpen(false);
        setEditingFaq(null);
        setFaqQuestion('');
        setFaqAnswer('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui FAQ.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;
    const list = config.faqs || [];
    const updatedList = list.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'faqs', faqs: updatedList })
      });
      if (res.ok) {
        showToast('success', 'FAQ berhasil dihapus!');
        setConfig(prev => ({ ...prev, faqs: updatedList }));
        router.refresh();
      } else {
        showToast('danger', 'Gagal menghapus FAQ.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // --- 3. Gallery Handlers ---
  const getCleanVideoUrl = (url) => {
    if (!url) return '';
    let cleanUrl = url.trim();
    
    // Extract src from iframe string if present
    if (cleanUrl.includes('<iframe')) {
      const match = cleanUrl.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }
    
    // Extract video ID from youtube URLs
    let videoId = null;
    if (cleanUrl.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(cleanUrl);
        videoId = urlObj.searchParams.get('v');
      } catch (e) {
        const match = cleanUrl.match(/[?&]v=([^&#]+)/);
        if (match) videoId = match[1];
      }
    } else if (cleanUrl.includes('youtu.be/')) {
      const parts = cleanUrl.split('youtu.be/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    } else if (cleanUrl.includes('youtube.com/shorts/')) {
      const parts = cleanUrl.split('youtube.com/shorts/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    } else if (cleanUrl.includes('youtube.com/embed/')) {
      const parts = cleanUrl.split('youtube.com/embed/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return cleanUrl;
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      setProcessingMessage(editingGalleryItem ? 'Menyimpan perubahan...' : 'Menambahkan media galeri...');

      const formData = new FormData();
      formData.append('action_type', 'gallery');
      if (editingGalleryItem) {
        formData.append('item_id', editingGalleryItem.id);
      }
      formData.append('title', galleryTitle.trim());
      formData.append('type', galleryType);
      formData.append('category', galleryCategory);
      formData.append('date', galleryDate || new Date().toISOString().split('T')[0]);

      if (gallerySourceType === 'upload' && galleryFile) {
        formData.append('gallery_file', galleryFile);
      } else {
        const finalUrl = galleryType === 'video' ? getCleanVideoUrl(galleryUrl) : galleryUrl.trim();
        formData.append('url', finalUrl);
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', editingGalleryItem ? 'Galeri Kegiatan berhasil diperbarui!' : 'Media galeri berhasil ditambahkan!');
        if (data.config) {
          setConfig(data.config);
        }
        setGalleryModalOpen(false);
        setEditingGalleryItem(null);
        setGalleryTitle('');
        setGalleryUrl('');
        setGalleryDate('');
        setGalleryCategory('umum');
        setGalleryFile(null);
        setGalleryPreview('');
        setGallerySourceType('url');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui galeri.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;
    const list = config.gallery || [];
    const updatedList = list.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'gallery', gallery: updatedList })
      });
      if (res.ok) {
        showToast('success', 'Item galeri berhasil dihapus!');
        setConfig(prev => ({ ...prev, gallery: updatedList }));
        router.refresh();
      } else {
        showToast('danger', 'Gagal menghapus item galeri.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // --- 4. Messages / Guest Book / Feedback Handlers ---
  const handleModerateMessage = async (id, status) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Status pesan berhasil diperbarui menjadi ${status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}`);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui status pesan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Pesan berhasil dihapus secara permanen!');
        setMessages(prev => prev.filter(m => m.id !== id));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus pesan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // --- 5. Graduation Handlers ---
  const handleSaveGraduation = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingGrad ? editingGrad.id : `grad-${Date.now()}`,
      nisn: gradNisn,
      no_peserta: gradNoPeserta,
      name: gradName,
      status: gradStatus,
      sk_number: gradSkNumber,
      birth_place: gradBirthPlace,
      birth_date: gradBirthDate,
      parent_name: gradParentName
    };

    try {
      const res = await fetch('/api/graduation', {
        method: editingGrad ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Data kelulusan ${gradName} berhasil ${editingGrad ? 'diperbarui' : 'ditambahkan'}!`);
        if (editingGrad) {
          setGraduation(prev => prev.map(item => item.id === editingGrad.id ? payload : item));
        } else {
          setGraduation(prev => [payload, ...prev]);
        }
        setGradModalOpen(false);
        setEditingGrad(null);
        setGradNisn('');
        setGradNoPeserta('');
        setGradName('');
        setGradStatus('LULUS');
        setGradSkNumber('');
        setGradBirthPlace('');
        setGradBirthDate('');
        setGradParentName('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data kelulusan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteGraduation = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data kelulusan siswa ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/graduation?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data kelulusan berhasil dihapus secara permanen!');
        setGraduation(prev => prev.filter(item => item.id !== id));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus data kelulusan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studNisn || !studName || !studClass || !studGender) {
      showToast('danger', 'Kolom NISN, Nama Lengkap, Kelas, dan Jenis Kelamin wajib diisi!');
      return;
    }
    if (!/^\d{10}$/.test(studNisn)) {
      showToast('danger', 'NISN harus berupa 10 digit angka!');
      return;
    }

    const payload = {
      id: editingStudent ? editingStudent.id : `stud-${Math.floor(Date.now() / 1000)}`,
      nisn: studNisn,
      nis: studNis,
      name: studName,
      class: studClass,
      gender: studGender,
      birth_place: studBirthPlace,
      birth_date: studBirthDate,
      address: studAddress,
      parent_name: studParentName,
      parent_phone: studParentPhone,
      status: studStatus,
      grades: studGrades
    };

    try {
      const res = await fetch('/api/students', {
        method: editingStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Data siswa ${studName} berhasil ${editingStudent ? 'diperbarui' : 'ditambahkan'}!`);
        if (editingStudent) {
          setStudents(prev => prev.map(item => item.id === editingStudent.id ? payload : item));
        } else {
          setStudents(prev => [payload, ...prev]);
        }
        setStudentModalOpen(false);
        setEditingStudent(null);
        setStudNisn('');
        setStudNis('');
        setStudName('');
        setStudClass('1A');
        setStudGender('Laki-laki');
        setStudBirthPlace('');
        setStudBirthDate('');
        setStudAddress('');
        setStudParentName('');
        setStudParentPhone('');
        setStudStatus('Aktif');
        setStudGrades({
          ppkn: '',
          indonesia: '',
          matematika: '',
          ipas: '',
          seni: '',
          pjok: '',
          inggris: '',
          agama: '',
          mulok: ''
        });
        setStudParentName('');
        setStudParentPhone('');
        setStudStatus('Aktif');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan data siswa.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data siswa berhasil dihapus secara permanen!');
        setStudents(prev => prev.filter(item => item.id !== id));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus data siswa.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  // Filter students based on search and selected filters
  const filteredStudents = (students || []).filter(student => {
    const matchesSearch = studentSearch === '' || 
      (student.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.nisn || '').includes(studentSearch) ||
      (student.nis || '').includes(studentSearch) ||
      (student.address || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.parent_name || '').toLowerCase().includes(studentSearch.toLowerCase());

    const matchesClass = studentClassFilter === 'Semua' || student.class === studentClassFilter;
    const matchesGender = studentGenderFilter === 'Semua' || student.gender === studentGenderFilter;
    const matchesStatus = studentStatusFilter === 'Semua' || student.status === studentStatusFilter;

    return matchesSearch && matchesClass && matchesGender && matchesStatus;
  });

  // --- 6. Security & Audit Threat Resolution Handler ---
  const handleResolveThreat = async (ip) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'resolve_security_threat',
          ip: ip
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Ancaman keamanan untuk IP ${ip} berhasil diselesaikan dan dibebaskan!`);
        setConfig(data.config);
        
        // Fetch updated audit logs
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyelesaikan ancaman keamanan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleRefreshAuditLogs = async () => {
    try {
      const logRes = await fetch('/api/config/audit_logs');
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData.auditLogs || []);
        showToast('success', 'Jurnal jejak audit berhasil diperbarui!');
      } else {
        showToast('danger', 'Gagal memuat ulang jurnal jejak audit.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan saat memuat ulang: ' + err.message);
    }
  };

  // --- Security Blacklist, Policy, and Purge Action Handlers ---
  const handleAddBlacklist = async (e) => {
    e.preventDefault();
    if (!blacklistIp.trim()) {
      showToast('danger', 'Silakan masukkan alamat IP yang ingin diblokir.');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'add_blacklist_ip',
          ip: blacklistIp.trim(),
          reason: blacklistReason.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `IP ${blacklistIp} berhasil dimasukkan ke daftar hitam manual.`);
        setConfig(data.config);
        setBlacklistIp('');
        setBlacklistReason('');
        // Refresh audit logs
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menambahkan IP ke daftar hitam.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleRemoveBlacklist = async (ip) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'remove_blacklist_ip',
          ip: ip
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `IP ${ip} berhasil dibebaskan dari daftar hitam.`);
        setConfig(data.config);
        // Refresh audit logs
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal membebaskan IP dari daftar hitam.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleSaveSecuritySettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'update_security_settings',
          max_attempts: Number(maxAttempts),
          block_duration_min: Number(blockDurationMin),
          auto_prune_days: Number(autoPruneDays)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi kebijakan keamanan berhasil diperbarui!');
        setConfig(data.config);
        // Refresh audit logs
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui konfigurasi kebijakan keamanan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handlePurgeAuditLogs = async (e) => {
    e.preventDefault();
    if (purgeLogsConfirmation !== 'KOSONGKAN JURNAL AUDIT') {
      showToast('danger', 'Kata kunci konfirmasi salah. Silakan ketik KOSONGKAN JURNAL AUDIT dengan benar.');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'purge_audit_logs',
          confirmation: purgeLogsConfirmation
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Seluruh jurnal audit berhasil dikosongkan!');
        setPurgeLogsConfirmation('');
        setIsPurgeModalOpen(false);
        // Reload logs
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal mengosongkan jurnal audit.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/config/audit_logs?export=true', '_blank');
    showToast('success', 'Mengekspor jurnal audit ke format CSV...');
  };
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
            setTeachers(sortTeachersListClient(data.teachers));
          } else if (backupData.teachers) {
            setTeachers(sortTeachersListClient(backupData.teachers));
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
    const rombel = parseInt(form.rombel.value, 10) || 0;
    const uks = parseInt(form.uks.value, 10) || 0;
    const gudang = parseInt(form.gudang.value, 10) || 0;
    const toilet = parseInt(form.toilet.value, 10) || 0;
    const cuci_tangan = parseInt(form.cuci_tangan.value, 10) || 0;

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action_type: 'stats', 
          siswa_aktif, 
          guru_staf, 
          ruang_kelas, 
          akreditasi,
          rombel,
          uks,
          gudang,
          toilet,
          cuci_tangan
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi website berhasil disimpan.');
        setConfig(prev => ({
          ...prev,
          stats: { 
            siswa_aktif, 
            guru_staf, 
            ruang_kelas, 
            akreditasi,
            rombel,
            uks,
            gudang,
            toilet,
            cuci_tangan
          }
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

    setIsProcessing(true);
    setProcessingMessage('Memproses berkas latar belakang...');

    try {
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
    } finally {
      setIsProcessing(false);
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
    const email_sekolah = form.email_sekolah.value.trim();

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
          wa_floating: clean_wa_floating,
          email_sekolah
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
            wa_floating: clean_wa_floating,
            email_sekolah
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
    setIsProcessing(true);
    setProcessingMessage('Mempublikasikan berita baru...');
    
    const form = e.target;
    const formData = new FormData(form);

    // Remove singular photo field and default uncompressed photos field
    formData.delete('photo');
    formData.delete('photos');

    try {
      // Compress and append each multi-photo file
      if (newsPhotos.length > 0) {
        showToast('info', `Sedang mengompresi ${newsPhotos.length} foto berita...`);
        for (let i = 0; i < newsPhotos.length; i++) {
          try {
            const compressed = await compressImage(newsPhotos[i]);
            formData.append('photos', compressed, newsPhotos[i].name);
          } catch (compressErr) {
            console.error("Compression error:", compressErr);
            formData.append('photos', newsPhotos[i]);
          }
        }
      }

      console.log("=== formData.getAll('photos') di frontend (POST) ===");
      console.log(formData.getAll('photos'));
      console.log("Jumlah file yang akan dikirim (photos):", formData.getAll('photos').length);

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

        // Reset news photos state and previews
        setNewsPhotos([]);
        newsPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
        setNewsPhotoPreviews([]);

        setNewsEditorKey(prev => prev + 1);
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan berita baru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleNewsEditClick = (article) => {
    setEditingNews(article);
    setNewsEditorKey(prev => prev + 1);
    // Reset any selected files/previews
    setNewsPhotos([]);
    newsPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
    setNewsPhotoPreviews([]);

    // Smooth scroll to news form
    setTimeout(() => {
      const formElement = document.getElementById('news_form_section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNewsCancelEdit = () => {
    setEditingNews(null);
    setNewsEditorKey(prev => prev + 1);
    // Reset any selected files/previews
    setNewsPhotos([]);
    newsPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
    setNewsPhotoPreviews([]);
  };

  const handleNewsUpdate = async (e) => {
    e.preventDefault();
    if (!editingNews) return;

    setIsProcessing(true);
    setProcessingMessage('Menyimpan perubahan berita...');

    const form = e.target;
    const formData = new FormData(form);

    // Append editingNews id
    formData.append('id', editingNews.id);

    // Remove singular photo field and default uncompressed photos field
    formData.delete('photo');
    formData.delete('photos');

    try {
      // Compress and append each multi-photo file
      if (newsPhotos.length > 0) {
        showToast('info', `Sedang mengompresi ${newsPhotos.length} foto berita...`);
        for (let i = 0; i < newsPhotos.length; i++) {
          try {
            const compressed = await compressImage(newsPhotos[i]);
            formData.append('photos', compressed, newsPhotos[i].name);
          } catch (compressErr) {
            console.error("Compression error:", compressErr);
            formData.append('photos', newsPhotos[i]);
          }
        }
      }

      console.log("=== formData.getAll('photos') di frontend (PUT) ===");
      console.log(formData.getAll('photos'));
      console.log("Jumlah file yang akan dikirim (photos):", formData.getAll('photos').length);

      showToast('info', 'Sedang menyimpan perubahan berita...');
      const res = await fetch('/api/news', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Perubahan berita berhasil disimpan!');
        setNewsList(prev => prev.map(n => n.id === editingNews.id ? data.article : n));
        setEditingNews(null);
        form.reset();

        // Reset news photos state and previews
        setNewsPhotos([]);
        newsPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
        setNewsPhotoPreviews([]);

        setNewsEditorKey(prev => prev + 1);
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan perubahan berita.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsProcessing(false);
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
    setIsProcessing(true);
    setProcessingMessage('Menambahkan data guru & staf...');

    const form = e.target;
    const formData = new FormData(form);

    if (teacherImageSelect !== 'custom') {
      formData.set('image', teacherImageSelect);
    } else {
      formData.set('image', teacherImageUrl);
    }

    try {
      const photoFile = formData.get('photo');
      if (photoFile && photoFile instanceof File && photoFile.size > 0) {
        showToast('info', 'Sedang mengompresi foto guru...');
        const compressed = await compressImage(photoFile);
        formData.set('photo', compressed);
      }

      showToast('info', 'Sedang menyimpan data guru...');
      const res = await fetch('/api/teachers', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil ditambahkan!');
        setTeachers(prev => sortTeachersListClient([...prev, data.teacher]));
        form.reset();
        setAddPassword('');
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
    } finally {
      setIsProcessing(false);
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

  const handleSaveWaGateway = async (gatewayData) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'wa_gateway',
          ...gatewayData
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Setelan WhatsApp Gateway berhasil diperbarui!');
        setConfig(data.config);
        router.refresh();
        return true;
      } else {
        showToast('danger', data.error || 'Gagal memperbarui setelan WhatsApp Gateway.');
        return false;
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
      return false;
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
    setEditSubject(t.subject || '');
    setEditEducation(t.education || '');
    setEditMotto(t.motto || '');
    setEditBio(t.bio || '');
    setEditPassword('');
    
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
    setIsProcessing(true);
    setProcessingMessage('Memperbarui data guru & staf...');

    const form = e.target;
    const formData = new FormData(form);
    formData.set('id', editTeacherId);

    if (editTeacherImageSelect !== 'custom') {
      formData.set('image', editTeacherImageSelect);
    } else {
      formData.set('image', editTeacherImageUrl);
    }

    try {
      const photoFile = formData.get('photo');
      if (photoFile && photoFile instanceof File && photoFile.size > 0) {
        showToast('info', 'Sedang mengompresi foto guru...');
        const compressed = await compressImage(photoFile);
        formData.set('photo', compressed);
      }

      showToast('info', 'Sedang memperbarui data guru...');
      const res = await fetch('/api/teachers', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil diperbarui!');
        setTeachers(prev => sortTeachersListClient(prev.map(t => t.id === editTeacherId ? data.teacher : t)));
        setEditTeacherModalOpen(false);
        setEditPassword('');
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui data guru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleNewsPhotosChange = (e) => {
    console.log("=== e.target.files di frontend (Pilih Berkas) ===");
    console.log(e.target.files);
    console.log("Jumlah file terpilih di input HTML:", e.target.files ? e.target.files.length : 0);

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const validPreviews = [];
    const allowed = ['png', 'jpg', 'jpeg'];

    for (const file of files) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert(`Berkas "${file.name}" terlalu besar! Maksimal ukuran berkas adalah 1.5MB.`);
        continue;
      }
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowed.includes(extension)) {
        alert(`Jenis file untuk "${file.name}" tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.`);
        continue;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setNewsPhotos(prev => [...prev, ...validFiles]);
      setNewsPhotoPreviews(prev => [...prev, ...validPreviews]);
    }

    // Reset input so user can re-upload if deleted
    e.target.value = '';
  };

  const handleRemoveNewsPhoto = (index) => {
    if (newsPhotoPreviews[index]) {
      URL.revokeObjectURL(newsPhotoPreviews[index]);
    }
    setNewsPhotos(prev => prev.filter((_, i) => i !== index));
    setNewsPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Computed states for PPDB Search, Filter, and Pagination
  const availableTahunAjaran = Array.from(
    new Set([
      '2026/2027',
      ...records.map(r => r.tahun_ajaran || '2026/2027')
    ])
  ).filter(Boolean).sort();

  const filteredPPDB = records.filter(r => {
    const searchLower = ppdbSearch.toLowerCase();
    const matchesSearch = (r.nama_lengkap || '').toLowerCase().includes(searchLower) ||
                          (r.nik_siswa || r.nik || '').toLowerCase().includes(searchLower) ||
                          (r.nomor_hp_orangtua || r.no_hp || '').toLowerCase().includes(searchLower);
    const matchesJalur = ppdbFilterJalur === 'Semua' || r.jalur_ppdb === ppdbFilterJalur;
    const matchesStatus = ppdbFilterStatus === 'Semua' || r.status === ppdbFilterStatus;
    const matchesTahun = ppdbFilterTahun === 'Semua' || (r.tahun_ajaran === ppdbFilterTahun || (!r.tahun_ajaran && ppdbFilterTahun === '2026/2027'));
    return matchesSearch && matchesJalur && matchesStatus && matchesTahun;
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

  // Computed states for Downloads Tab Search
  const filteredDownloads = (config.downloads || []).filter(item => {
    const q = downloadSearch.toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.category || '').toLowerCase().includes(q);
  });

  // Computed states for FAQs Tab Search
  const filteredFaqs = (config.faqs || []).filter(item => {
    const q = faqSearch.toLowerCase();
    return (item.question || '').toLowerCase().includes(q) ||
           (item.answer || '').toLowerCase().includes(q);
  });

  // Computed states for Gallery Tab Search
  const filteredGallery = (config.gallery || []).filter(item => {
    const q = gallerySearch.toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.type || '').toLowerCase().includes(q) ||
           (item.category || 'umum').toLowerCase().includes(q);
  });

  // Computed states for Messages Tab Search
  const filteredMessages = messages.filter(item => {
    const q = messageSearch.toLowerCase();
    const matchesSearch = (item.name || '').toLowerCase().includes(q) ||
                          (item.message || '').toLowerCase().includes(q) ||
                          (item.role || '').toLowerCase().includes(q);
    const matchesType = messageFilterType === 'all' || item.type === messageFilterType;
    const matchesStatus = messageFilterStatus === 'all' || item.status === messageFilterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Computed states for Graduation Tab Search
  const filteredGraduation = graduation.filter(item => {
    const q = gradSearch.toLowerCase();
    return (item.name || '').toLowerCase().includes(q) ||
           (item.nisn || '').toLowerCase().includes(q) ||
           (item.no_peserta || '').toLowerCase().includes(q) ||
           (item.sk_number || '').toLowerCase().includes(q);
  });

  // Computed states for Audit Logs Search & Filter
  const filteredAuditLogs = (auditLogs || []).filter(log => {
    const q = securitySearch.toLowerCase();
    const action = (log.action || '').toLowerCase();
    const details = (log.details || '').toLowerCase();
    const username = (log.username || '').toLowerCase();
    const ip = (log.ip || '').toLowerCase();
    
    const matchesSearch = !q || 
      action.includes(q) || 
      details.includes(q) || 
      username.includes(q) || 
      ip.includes(q);

    if (!matchesSearch) return false;

    if (securityFilter === 'all') return true;
    if (securityFilter === 'auth') {
      return action.includes('login') || action.includes('logout') || action.includes('block') || action.includes('threat') || action.includes('security');
    }
    if (securityFilter === 'config') {
      return action.includes('config') || action.includes('maintenance') || action.includes('backup') || action.includes('restore');
    }
    if (securityFilter === 'ppdb') {
      return action.includes('ppdb');
    }
    if (securityFilter === 'content') {
      return action.includes('news') || action.includes('teacher') || action.includes('achievement') || action.includes('graduate') || action.includes('message');
    }
    return true;
  });

  const parseUserAgent = (ua) => {
    if (!ua) return "Perangkat Tidak Dikenal";
    let os = "Lainnya";
    let browser = "Lainnya";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("iPhone")) os = "iPhone";
    else if (ua.includes("iPad")) os = "iPad";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("Linux")) os = "Linux";

    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Opera")) browser = "Opera";
    return `${browser} (${os})`;
  };

  const getPageTitle = () => {
    const titles = {
      overview: 'Ringkasan Dashboard',
      ppdb: 'Manajemen Data PPDB',
      content: 'Pengumuman & Statistik',
      news: 'Manajemen Berita Sekolah',
      teachers: 'Manajemen Guru & Kepala Sekolah',
      achievements: 'Manajemen Prestasi Sekolah',
      pages: 'Kelola Konten Halaman',
      agenda: 'Sistem Agenda & Kegiatan Sekolah',
      downloads: 'Manajemen Pusat Unduhan',
      faqs: 'Manajemen FAQ & Hubungi',
      gallery: 'Manajemen Galeri Kegiatan',
      messages: 'Moderasi Kotak Masuk & Buku Tamu',
      graduation: 'Kelola Portal Kelulusan Siswa',
      security: 'Jejak Audit & Keamanan Sistem'
    };
    return titles[activeTab] || 'Dashboard Admin';
  };


    const value = {
    achDescription,
    achLevel,
    achTitle,
    achYear,
    achievements,
    activePageSubTab,
    activeTab,
    activeThreats,
    addTeacherModalOpen,
    agendaModalOpen,
    agendaSearch,
    auditLogs,
    autoPruneDays,
    availableTahunAjaran,
    avatarPreview,
    blacklistIp,
    blacklistReason,
    blockDurationMin,
    bulkDeleteConfirmText,
    calendarEvents,
    chartTooltip,
    config,
    confirmPassword,
    currentPassword,
    dbStatus,
    deleteIsBulk,
    deleteModalOpen,
    deleteTargetId,
    deleteTargetName,
    deleteTargetNik,
    downloadCategory,
    downloadFileUrl,
    downloadModalOpen,
    downloadSearch,
    downloadTitle,
    editAvatarPreview,
    editBio,
    editDetails,
    editEducation,
    editMotto,
    editName,
    editPassword,
    addPassword,
    setEditPassword,
    setAddPassword,
    editNip,
    editRole,
    editStatus,
    editSubject,
    editTeacherId,
    editTeacherImageSelect,
    editTeacherImageUrl,
    editTeacherModalOpen,
    editingAchievementId,
    editingDownload,
    editingEvent,
    editingFaq,
    editingGalleryItem,
    editingGrad,
    editingNews,
    editingStudent,
    ekskulFiles,
    ekskulPreviews,
    eventDates,
    eventDesc,
    eventMonth,
    eventTitle,
    executeDelete,
    faqAnswer,
    faqModalOpen,
    faqQuestion,
    faqSearch,
    fetch,
    filteredAuditLogs,
    filteredDownloads,
    filteredEvents,
    filteredFaqs,
    filteredGallery,
    filteredGraduation,
    filteredMessages,
    filteredPPDB,
    filteredStudents,
    galleryCategory,
    galleryDate,
    galleryFile,
    galleryModalOpen,
    galleryPreview,
    gallerySearch,
    gallerySourceType,
    galleryTitle,
    galleryType,
    galleryUrl,
    getCleanVideoUrl,
    getPageTitle,
    gradBirthDate,
    gradBirthPlace,
    gradModalOpen,
    gradName,
    gradNisn,
    gradNoPeserta,
    gradParentName,
    gradSearch,
    gradSkNumber,
    gradStatus,
    graduation,
    handleAchievementCancel,
    handleAchievementDelete,
    handleAchievementEdit,
    handleAchievementSubmit,
    handleAddBlacklist,
    handleAddEkskul,
    handleAddKarya,
    handleAddKesiswaanPrestasi,
    handleAddP5Project,
    handleAddPPDBFaq,
    handleAddPPDBJadwal,
    handleAddSeragam,
    handleAllowCopyToggle,
    handleAnnouncementsUpdate,
    handleBackupExport,
    handleBackupRestore,
    handleChangePassword,
    handleContactsUpdate,
    handleDbToggle,
    handleSaveWaGateway,
    handleDeleteAgendaEvent,
    handleDeleteAllPPDB,
    handleDeleteDownload,
    handleDeleteFaq,
    handleDeleteGalleryItem,
    handleDeleteGraduation,
    handleDeleteMessage,
    handleDeleteStudent,
    handleEditTeacherImageSelectChange,
    handleEditTeacherImageUrlChange,
    handleEditTeacherPhotoChange,
    handleEkskulFileChange,
    handleExportCsv,
    handleFieldChange,
    handleHeroBgUpdate,
    handleKurikulumFileChange,
    handleLogout,
    handleMaintenanceModeToggle,
    handleMakeContact,
    handleModerateMessage,
    handleMouseLeave,
    handleMouseMove,
    handleNewsAdd,
    handleNewsCancelEdit,
    handleNewsDelete,
    handleNewsEditClick,
    handleNewsPhotosChange,
    handleNewsUpdate,
    handleP5FileChange,
    handlePPDBDelete,
    handlePageContentsSave,
    handlePurgeAuditLogs,
    handleRefreshAuditLogs,
    handleRemoveBlacklist,
    handleRemoveEkskul,
    handleRemoveKarya,
    handleRemoveKesiswaanPrestasi,
    handleRemoveNewsPhoto,
    handleRemoveP5Project,
    handleRemovePPDBFaq,
    handleRemovePPDBJadwal,
    handleRemoveSeragam,
    handleResolveThreat,
    handleSaveAgendaEvent,
    handleSaveDownload,
    handleSaveFaq,
    handleSaveGalleryItem,
    handleSaveGraduation,
    handleSaveSecuritySettings,
    handleSaveStudent,
    handleSejarahFileChange,
    handleStatsUpdate,
    handleStatusChange,
    handleTeacherAdd,
    handleTeacherDelete,
    handleTeacherEditClick,
    handleTeacherImageSelectChange,
    handleTeacherImageUrlChange,
    handleTeacherPhotoChange,
    handleTeacherUpdateSubmit,
    handleUpdateEkskul,
    handleUpdateKarya,
    handleUpdateKesiswaanPrestasi,
    handleUpdateP5Project,
    handleUpdatePPDBFaq,
    handleUpdatePPDBJadwal,
    handleUpdateSeragam,
    isChangingPassword,
    isDetailModalOpen,
    isProcessing,
    isPurgeModalOpen,
    kurikulumFile,
    kurikulumPreview,
    maxAttempts,
    messageFilterStatus,
    messageFilterType,
    messageSearch,
    messages,
    newPassword,
    newsEditorKey,
    newsList,
    newsPhotoPreviews,
    newsPhotos,
    normalizeTeacherName,
    p5Files,
    p5Previews,
    pageContents,
    paginatedPPDB,
    parseUserAgent,
    ppdbFilterJalur,
    ppdbFilterStatus,
    ppdbFilterTahun,
    ppdbPage,
    ppdbPerPage,
    ppdbSearch,
    processingMessage,
    purgeLogsConfirmation,
    records,
    router,
    securityFilter,
    securitySearch,
    sejarahFile,
    sejarahPreview,
    selectedRecord,
    sendWhatsAppNotification,
    setAchDescription,
    setAchLevel,
    setAchTitle,
    setAchYear,
    setAchievements,
    setActivePageSubTab,
    setActiveTab,
    setAddTeacherModalOpen,
    setAgendaModalOpen,
    setAgendaSearch,
    setAuditLogs,
    setAutoPruneDays,
    setAvatarPreview,
    setBlacklistIp,
    setBlacklistReason,
    setBlockDurationMin,
    setBulkDeleteConfirmText,
    setChartTooltip,
    setConfig,
    setConfirmPassword,
    setCurrentPassword,
    setDeleteIsBulk,
    setDeleteModalOpen,
    setDeleteTargetId,
    setDeleteTargetName,
    setDeleteTargetNik,
    setDownloadCategory,
    setDownloadFileUrl,
    setDownloadModalOpen,
    setDownloadSearch,
    setDownloadTitle,
    setEditAvatarPreview,
    setEditBio,
    setEditDetails,
    setEditEducation,
    setEditMotto,
    setEditName,
    setEditNip,
    setEditRole,
    setEditStatus,
    setEditSubject,
    setEditTeacherId,
    setEditTeacherImageSelect,
    setEditTeacherImageUrl,
    setEditTeacherModalOpen,
    setEditingAchievementId,
    setEditingDownload,
    setEditingEvent,
    setEditingFaq,
    setEditingGalleryItem,
    setEditingGrad,
    setEditingNews,
    setEditingStudent,
    setEkskulFiles,
    setEkskulPreviews,
    setEventDates,
    setEventDesc,
    setEventMonth,
    setEventTitle,
    setFaqAnswer,
    setFaqModalOpen,
    setFaqQuestion,
    setFaqSearch,
    setGalleryCategory,
    setGalleryDate,
    setGalleryFile,
    setGalleryModalOpen,
    setGalleryPreview,
    setGallerySearch,
    setGallerySourceType,
    setGalleryTitle,
    setGalleryType,
    setGalleryUrl,
    setGradBirthDate,
    setGradBirthPlace,
    setGradModalOpen,
    setGradName,
    setGradNisn,
    setGradNoPeserta,
    setGradParentName,
    setGradSearch,
    setGradSkNumber,
    setGradStatus,
    setGraduation,
    setIsChangingPassword,
    setIsDetailModalOpen,
    setIsProcessing,
    setIsPurgeModalOpen,
    setKurikulumFile,
    setKurikulumPreview,
    setMaxAttempts,
    setMessageFilterStatus,
    setMessageFilterType,
    setMessageSearch,
    setMessages,
    setNewPassword,
    setNewsEditorKey,
    setNewsList,
    setNewsPhotoPreviews,
    setNewsPhotos,
    setP5Files,
    setP5Previews,
    setPageContents,
    setPpdbFilterJalur,
    setPpdbFilterStatus,
    setPpdbFilterTahun,
    setPpdbPage,
    setPpdbPerPage,
    setPpdbSearch,
    setProcessingMessage,
    setPurgeLogsConfirmation,
    setRecords,
    setSecurityFilter,
    setSecuritySearch,
    setSejarahFile,
    setSejarahPreview,
    setSelectedRecord,
    setShowEditTeacherUrlInput,
    setShowTeacherUrlInput,
    setStorageInfo,
    setStudAddress,
    setStudBirthDate,
    setStudBirthPlace,
    setStudClass,
    setStudGender,
    setStudGrades,
    setStudName,
    setStudNis,
    setStudNisn,
    setStudParentName,
    setStudParentPhone,
    setStudStatus,
    setStudentClassFilter,
    setStudentGenderFilter,
    setStudentModalOpen,
    setStudentSearch,
    setStudentStatusFilter,
    setStudents,
    setTeacherImageSelect,
    setTeacherImageUrl,
    setTeachers,
    setToast,
    showEditTeacherUrlInput,
    showTeacherUrlInput,
    showToast,
    storageInfo,
    studAddress,
    studBirthDate,
    studBirthPlace,
    studClass,
    studGender,
    studGrades,
    studName,
    studNis,
    studNisn,
    studParentName,
    studParentPhone,
    studStatus,
    studentClassFilter,
    studentGenderFilter,
    studentModalOpen,
    studentSearch,
    studentStatusFilter,
    students,
    submitPageContents,
    syncNipHumas,
    syncNipOperator,
    teacherImageSelect,
    teacherImageUrl,
    teachers,
    toast,
    totalPPDBPages
  };


  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
}

