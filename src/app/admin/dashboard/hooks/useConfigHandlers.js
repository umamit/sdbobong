import { useState, useEffect } from 'react';
import { compressImage } from './helpers';

export default function useConfigHandlers({
  config,
  setConfig,
  pageContents,
  setPageContents,
  teachers = [],
  fetch,
  showToast,
  setIsProcessing,
  setProcessingMessage,
  router
}) {
  const [activePageSubTab, setActivePageSubTab] = useState('beranda');
  
  const [sejarahFile, setSejarahFile] = useState(null);
  const [sejarahPreview, setSejarahPreview] = useState('');
  const [kurikulumFile, setKurikulumFile] = useState(null);
  const [kurikulumPreview, setKurikulumPreview] = useState('');
  const [ekskulFiles, setEkskulFiles] = useState({});
  const [ekskulPreviews, setEkskulPreviews] = useState({});
  const [p5Files, setP5Files] = useState({});
  const [p5Previews, setP5Previews] = useState({});

  useEffect(() => {
    if (config?.stats?.page_contents) {
      setPageContents(config.stats.page_contents);
    }
  }, [config]);

  const normalizeTeacherName = (name) => {
    if (!name) return "";
    let normalized = name.toLowerCase();
    
    // Remove common academic titles/suffixes
    normalized = normalized.replace(/\b(s\.?pd\.?i?\.?|m\.?pd\.?i?\.?|s\.?kom\.?|m\.?kom\.?|s\.?ag\.?|m\.?ag\.?|s\.?e\.?|m\.?e\.?|s\.?h\.?|m\.?h\.?|s\.?t\.?|m\.?t\.?|s\.?si\.?|m\.?si\.?|drs\.?|dra\.?|gr\.?)\b/gi, "");
    
    // Remove honorific prefixes (can be multiple, e.g., "Ibu Hj.")
    const prefixRegex = /^(ibu|bapak|pak|bu|sdri|sdr|haji|hajah|hj\.?|h\.?|ustad|ustadz|ustadzah)\s+/i;
    while (prefixRegex.test(normalized)) {
      normalized = normalized.replace(prefixRegex, "");
    }
    
    return normalized
      .replace(/[^a-z0-9]/gi, "")
      .trim();
  };

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
        if (duration > 10.5) {
          showToast('danger', `Durasi video adalah ${duration.toFixed(1)} detik. Maksimal durasi video yang diperbolehkan adalah 10 detik!`);
          return;
        }

        if (file.size > 3 * 1024 * 1024) {
          showToast('warning', 'Pemberitahuan: Ukuran berkas video cukup besar (>3MB). Sangat disarankan untuk mengompresi video terlebih dahulu sebelum mengunggah agar halaman beranda tetap ringan dimuat oleh pengunjung.');
        }
      }

      let uploadFile = file;
      if (file.type.startsWith('image/')) {
        showToast('info', 'Sedang mengompresi gambar latar belakang...');
        uploadFile = await compressImage(file);
      }

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

    const matchedHumas = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_humas));
    const matchedOperator = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_operator));

    const nip_humas = matchedHumas 
      ? matchedHumas.nip 
      : (nama_humas === config?.ppdb_contacts?.nama_humas ? (config?.ppdb_contacts?.nip_humas || "") : "");
      
    const nip_operator = matchedOperator 
      ? matchedOperator.nip 
      : (nama_operator === config?.ppdb_contacts?.nama_operator ? (config?.ppdb_contacts?.nip_operator || "") : "");

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
        showToast('danger', data.error || 'Gagal menyimpan kontak PPDB.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
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

  return {
    config,
    setConfig,
    pageContents,
    setPageContents,
    activePageSubTab,
    setActivePageSubTab,
    sejarahFile,
    setSejarahFile,
    sejarahPreview,
    setSejarahPreview,
    kurikulumFile,
    setKurikulumFile,
    kurikulumPreview,
    setKurikulumPreview,
    ekskulFiles,
    setEkskulFiles,
    ekskulPreviews,
    setEkskulPreviews,
    p5Files,
    setP5Files,
    p5Previews,
    setP5Previews,
    handleFieldChange,
    handleP5FileChange,
    handleAddP5Project,
    handleUpdateP5Project,
    handleRemoveP5Project,
    handleAddSeragam,
    handleUpdateSeragam,
    handleRemoveSeragam,
    handleAddEkskul,
    handleUpdateEkskul,
    handleRemoveEkskul,
    handleAddKesiswaanPrestasi,
    handleUpdateKesiswaanPrestasi,
    handleRemoveKesiswaanPrestasi,
    handleAddKarya,
    handleUpdateKarya,
    handleRemoveKarya,
    handleAddPPDBFaq,
    handleUpdatePPDBFaq,
    handleRemovePPDBFaq,
    handleAddPPDBJadwal,
    handleUpdatePPDBJadwal,
    handleRemovePPDBJadwal,
    handlePageContentsSave,
    submitPageContents,
    handleSejarahFileChange,
    handleKurikulumFileChange,
    handleEkskulFileChange,
    handleAnnouncementsUpdate,
    handleMaintenanceModeToggle,
    handleAllowCopyToggle,
    handleHeroBgUpdate,
    handleContactsUpdate,
    handleDbToggle,
    handleSaveWaGateway,
    normalizeTeacherName
  };
}
