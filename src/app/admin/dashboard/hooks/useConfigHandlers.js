import usePageContentHandlers from './usePageContentHandlers';
import { compressImage } from './helpers';

/**
 * Handles global site configuration updates:
 * stats, announcements, maintenance, hero bg, contacts, db toggle, WA gateway.
 * Page-level content CRUD is delegated to usePageContentHandlers.
 */
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
  const pageContentHandlers = usePageContentHandlers({
    config, setConfig, pageContents, setPageContents,
    fetch, showToast, setIsProcessing, setProcessingMessage, router
  });

  const normalizeTeacherName = (name) => {
    if (!name) return '';
    let normalized = name.toLowerCase();
    normalized = normalized.replace(/\b(s\.?pd\.?i?\.?|m\.?pd\.?i?\.?|s\.?kom\.?|m\.?kom\.?|s\.?ag\.?|m\.?ag\.?|s\.?e\.?|m\.?e\.?|s\.?h\.?|m\.?h\.?|s\.?t\.?|m\.?t\.?|s\.?si\.?|m\.?si\.?|drs\.?|dra\.?|gr\.?)\b/gi, '');
    const prefixRegex = /^(ibu|bapak|pak|bu|sdri|sdr|haji|hajah|hj\.?|h\.?|ustad|ustadz|ustadzah)\s+/i;
    while (prefixRegex.test(normalized)) normalized = normalized.replace(prefixRegex, '');
    return normalized.replace(/[^a-z0-9]/gi, '').trim();
  };

  const handleStatsUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      action_type: 'stats',
      siswa_aktif: parseInt(form.siswa_aktif.value, 10) || 0,
      guru_staf: parseInt(form.guru_staf.value, 10) || 0,
      ruang_kelas: parseInt(form.ruang_kelas.value, 10) || 0,
      akreditasi: form.akreditasi.value.trim().toUpperCase() || 'B',
      rombel: parseInt(form.rombel.value, 10) || 0,
      uks: parseInt(form.uks.value, 10) || 0,
      gudang: parseInt(form.gudang.value, 10) || 0,
      toilet: parseInt(form.toilet.value, 10) || 0,
      cuci_tangan: parseInt(form.cuci_tangan.value, 10) || 0
    };
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Statistik sekolah berhasil disimpan.');
        setConfig(prev => ({ ...prev, stats: { ...(prev.stats || {}), ...payload } }));
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyimpan statistik.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleAnnouncementsUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const announcements = Array.from(form.elements).filter(el => el.name === 'announcements[]').map(el => el.value.trim()).filter(Boolean);
    const marquee_speed = parseInt(form.elements['marquee_speed']?.value || '40', 10);
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'announcements', announcements, marquee_speed }) });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi website berhasil disimpan.');
        setConfig(prev => ({ ...prev, marquee_announcements: announcements, marquee_speed }));
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
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'toggle_maintenance', maintenance_mode: isMaintenance }) });
      const data = await res.json();
      if (res.ok) {
        showToast('success', isMaintenance ? '🛠️ Mode Pemeliharaan AKTIF.' : '✅ Mode Pemeliharaan NONAKTIF.');
        setConfig(prev => ({ ...prev, stats: { ...(prev.stats || {}), maintenance_mode: isMaintenance } }));
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
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'toggle_allow_copy', allow_copy: isAllowCopy }) });
      const data = await res.json();
      if (res.ok) {
        showToast('success', isAllowCopy ? '🔓 Menyalin teks DIIZINKAN.' : '🔒 Menyalin teks DILARANG.');
        setConfig(prev => ({ ...prev, stats: { ...(prev.stats || {}), allow_copy: isAllowCopy } }));
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
    const file = form.hero_bg_image.files?.[0];
    if (!file) { showToast('danger', 'Silakan pilih berkas terlebih dahulu.'); return; }

    setIsProcessing(true);
    setProcessingMessage('Memproses berkas latar belakang...');
    try {
      if (file.type.startsWith('video/')) {
        const duration = await new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.playsInline = true;
          video.muted = true;
          video.onloadedmetadata = () => { 
            window.URL.revokeObjectURL(video.src); 
            resolve(video.duration); 
          };
          video.onerror = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(-1);
          };
          video.src = window.URL.createObjectURL(file);
          video.load();
        });
        
        if (duration === -1) {
          showToast('warning', 'Sistem tidak dapat membaca durasi video di browser ini. Unggah tetap dilanjutkan, pastikan durasi video Anda di bawah 10 detik.');
        } else if (duration > 10.5) {
          showToast('danger', `Durasi video ${duration.toFixed(1)}s melebihi batas maksimal 10 detik!`);
          return;
        }
        
        if (file.size > 3 * 1024 * 1024) {
          showToast('warning', 'Ukuran video cukup besar (>3MB). Disarankan mengompresi terlebih dahulu.');
        }
      }

      let uploadFile = file;
      if (file.type.startsWith('image/')) {
        showToast('info', 'Sedang mengompresi gambar latar belakang...');
        uploadFile = await compressImage(file);
      }

      const maxSize = uploadFile.type.startsWith('video/') ? 20 * 1024 * 1024 : 2 * 1024 * 1024;
      if (uploadFile.size > maxSize) {
        showToast('danger', `Ukuran berkas melebihi batas ${uploadFile.type.startsWith('video/') ? '20MB' : '2MB'}.`);
        return;
      }

      const formData = new FormData(form);
      formData.set('hero_bg_image', uploadFile);
      showToast('info', 'Sedang mengunggah berkas...');
      const res = await fetch('/api/config', { method: 'POST', body: formData });
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
    const wa_floating = form.wa_floating ? form.wa_floating.value.trim() : '';
    const email_sekolah = form.email_sekolah.value.trim();

    const matchedHumas = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_humas));
    const matchedOperator = teachers.find(t => t.name && normalizeTeacherName(t.name) === normalizeTeacherName(nama_operator));
    const nip_humas = matchedHumas ? matchedHumas.nip : (nama_humas === config?.ppdb_contacts?.nama_humas ? (config?.ppdb_contacts?.nip_humas || '') : '');
    const nip_operator = matchedOperator ? matchedOperator.nip : (nama_operator === config?.ppdb_contacts?.nama_operator ? (config?.ppdb_contacts?.nip_operator || '') : '');

    const clean_wa_humas = wa_humas.replace(/[^0-9]/g, '');
    const clean_wa_operator = wa_operator.replace(/[^0-9]/g, '');

    if (clean_wa_humas && !clean_wa_humas.startsWith('62')) { showToast('danger', 'Format No. WA Humas salah. Gunakan kode negara (contoh: 628xxxx).'); return; }
    if (clean_wa_operator && !clean_wa_operator.startsWith('62')) { showToast('danger', 'Format No. WA Operator salah. Gunakan kode negara.'); return; }

    try {
      const payload = { action_type: 'contacts', nama_humas, wa_humas: clean_wa_humas, jabatan_humas, nip_humas, nama_operator, wa_operator: clean_wa_operator, jabatan_operator, nip_operator, email_sekolah };
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Kontak PPDB Sekolah berhasil disimpan.');
        setConfig(prev => ({ ...prev, ppdb_contacts: { nama_humas, wa_humas: clean_wa_humas, jabatan_humas, nip_humas, nama_operator, wa_operator: clean_wa_operator, jabatan_operator, nip_operator, email_sekolah } }));
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
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'toggle_db', force_local_cache: shouldForceLocal }) });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', shouldForceLocal ? 'Beralih ke Mode Cache Lokal.' : 'Mode Supabase Cloud aktif.');
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
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'wa_gateway', ...gatewayData }) });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Setelan WhatsApp Gateway berhasil diperbarui!');
        setConfig(data.config);
        router.refresh();
        return true;
      }
      showToast('danger', data.error || 'Gagal memperbarui setelan WhatsApp Gateway.');
      return false;
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
      return false;
    }
  };

  return {
    config, setConfig, pageContents, setPageContents,
    ...pageContentHandlers,
    normalizeTeacherName,
    handleStatsUpdate,
    handleAnnouncementsUpdate,
    handleMaintenanceModeToggle,
    handleAllowCopyToggle,
    handleHeroBgUpdate,
    handleContactsUpdate,
    handleDbToggle,
    handleSaveWaGateway
  };
}
