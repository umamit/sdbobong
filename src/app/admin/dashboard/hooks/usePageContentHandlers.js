'use client';

import { useState, useEffect } from 'react';
import { compressImage } from './helpers';

/**
 * Handles CRUD operations for dynamic page content sections
 * (Akademik, Kesiswaan, PPDB sub-pages) and their associated file uploads.
 */
export default function usePageContentHandlers({
  config,
  setConfig,
  pageContents,
  setPageContents,
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
  const [spFiles, setSpFiles] = useState({});
  const [spPreviews, setSpPreviews] = useState({});
  const [spPdfFiles, setSpPdfFiles] = useState({});

  useEffect(() => {
    if (config?.stats?.page_contents) {
      const pcs = JSON.parse(JSON.stringify(config.stats.page_contents));
      if (pcs.profil?.standar_pelayanan_list) {
        pcs.profil.standar_pelayanan_list = pcs.profil.standar_pelayanan_list.map((item, idx) => ({
          ...item,
          id: item.id || `sp-${idx}-${Date.now()}`
        }));
      }
      setPageContents(pcs);
    }
  }, [config]);

  const handleFieldChange = (page, key, value) => {
    setPageContents(prev => ({
      ...prev,
      [page]: { ...prev[page], [key]: value }
    }));
  };

  // --- P5 Projects ---
  const handleP5FileChange = (index, file) => {
    if (!file) return;
    setP5Files(prev => ({ ...prev, [index]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setP5Previews(prev => ({ ...prev, [index]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAddP5Project = () => {
    const updated = [
      ...(pageContents.akademik?.p5_projects || []),
      { id: 'p5_' + Date.now(), title: '', badge: '', desc: '', parentGuide: [], skills: [], color: '#1E40AF', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop' }
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

  // --- Seragam ---
  const handleAddSeragam = () => {
    const updated = [...(pageContents.akademik?.seragam || []), { days: '', type: '', details: '' }];
    handleFieldChange('akademik', 'seragam', updated);
  };

  const handleUpdateSeragam = (index, key, val) => {
    const updated = [...(pageContents.akademik?.seragam || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('akademik', 'seragam', updated);
  };

  const handleRemoveSeragam = (index) => {
    handleFieldChange('akademik', 'seragam', (pageContents.akademik?.seragam || []).filter((_, i) => i !== index));
  };

  // --- Jadwal KBM ---
  const handleAddJadwalKbm = () => {
    const updated = [...(pageContents.akademik?.jadwal_kbm || []), { id: 'kbm_' + Date.now(), kelas: '', hari: '', keterangan: '' }];
    handleFieldChange('akademik', 'jadwal_kbm', updated);
  };

  const handleUpdateJadwalKbm = (index, key, val) => {
    const updated = [...(pageContents.akademik?.jadwal_kbm || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('akademik', 'jadwal_kbm', updated);
  };

  const handleRemoveJadwalKbm = (index) => {
    handleFieldChange('akademik', 'jadwal_kbm', (pageContents.akademik?.jadwal_kbm || []).filter((_, i) => i !== index));
  };

  // --- Ekstrakurikuler ---
  const handleAddEkskul = () => {
    const updated = [...(pageContents.kesiswaan?.ekstrakurikuler || []), { id: 'ekskul_' + Date.now(), nama: '', deskripsi: '', jadwal: '', is_wajib: false, image: '/images/ekskul_pramuka.svg' }];
    handleFieldChange('kesiswaan', 'ekstrakurikuler', updated);
  };

  const handleUpdateEkskul = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.ekstrakurikuler || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'ekstrakurikuler', updated);
  };

  const handleRemoveEkskul = (index) => {
    handleFieldChange('kesiswaan', 'ekstrakurikuler', (pageContents.kesiswaan?.ekstrakurikuler || []).filter((_, i) => i !== index));
  };

  const handleEkskulFileChange = (index, file) => {
    if (!file) return;
    setEkskulFiles(prev => ({ ...prev, [index]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setEkskulPreviews(prev => ({ ...prev, [index]: reader.result }));
    reader.readAsDataURL(file);
  };

  // --- Prestasi Kesiswaan ---
  const handleAddKesiswaanPrestasi = () => {
    const updated = [...(pageContents.kesiswaan?.prestasi || []), { rank: '', title: '', level: '', desc: '', icon: 'trophy' }];
    handleFieldChange('kesiswaan', 'prestasi', updated);
  };

  const handleUpdateKesiswaanPrestasi = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.prestasi || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'prestasi', updated);
  };

  const handleRemoveKesiswaanPrestasi = (index) => {
    handleFieldChange('kesiswaan', 'prestasi', (pageContents.kesiswaan?.prestasi || []).filter((_, i) => i !== index));
  };

  // --- Karya Siswa ---
  const handleAddKarya = () => {
    const updated = [...(pageContents.kesiswaan?.karya || []), { icon: 'art', title: '', category: '', desc: '' }];
    handleFieldChange('kesiswaan', 'karya', updated);
  };

  const handleUpdateKarya = (index, key, val) => {
    const updated = [...(pageContents.kesiswaan?.karya || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('kesiswaan', 'karya', updated);
  };

  const handleRemoveKarya = (index) => {
    handleFieldChange('kesiswaan', 'karya', (pageContents.kesiswaan?.karya || []).filter((_, i) => i !== index));
  };

  // --- PPDB FAQ & Jadwal ---
  const handleAddPPDBFaq = () => {
    handleFieldChange('ppdb', 'faq', [...(pageContents.ppdb?.faq || []), { q: '', a: '' }]);
  };

  const handleUpdatePPDBFaq = (index, key, val) => {
    const updated = [...(pageContents.ppdb?.faq || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('ppdb', 'faq', updated);
  };

  const handleRemovePPDBFaq = (index) => {
    handleFieldChange('ppdb', 'faq', (pageContents.ppdb?.faq || []).filter((_, i) => i !== index));
  };

  const handleAddPPDBJadwal = () => {
    handleFieldChange('ppdb', 'jadwal', [...(pageContents.ppdb?.jadwal || []), { activity: '', dates: '' }]);
  };

  const handleUpdatePPDBJadwal = (index, key, val) => {
    const updated = [...(pageContents.ppdb?.jadwal || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('ppdb', 'jadwal', updated);
  };

  const handleRemovePPDBJadwal = (index) => {
    handleFieldChange('ppdb', 'jadwal', (pageContents.ppdb?.jadwal || []).filter((_, i) => i !== index));
  };

  // --- File change handlers ---
  const handleSejarahFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSejarahFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSejarahPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKurikulumFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setKurikulumFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setKurikulumPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSpFileChange = (id, file) => {
    if (!file) return;
    setSpFiles(prev => ({ ...prev, [id]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setSpPreviews(prev => ({ ...prev, [id]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSpPdfFileChange = (id, file) => {
    if (!file) return;
    setSpPdfFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleAddSpItem = () => {
    handleFieldChange('profil', 'standar_pelayanan_list', [
      ...(pageContents.profil?.standar_pelayanan_list || []),
      { id: 'sp-' + Date.now(), title: '', image: '', pdf: '', biaya: '', waktu: '', alur: '', kontak: '' }
    ]);
  };

  const handleUpdateSpItem = (index, key, val) => {
    const updated = [...(pageContents.profil?.standar_pelayanan_list || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleFieldChange('profil', 'standar_pelayanan_list', updated);
  };

  const handleRemoveSpItem = (index, id) => {
    handleFieldChange('profil', 'standar_pelayanan_list', (pageContents.profil?.standar_pelayanan_list || []).filter((_, i) => i !== index));
    setSpFiles(prev => { const n = { ...prev }; delete n[id]; return n; });
    setSpPreviews(prev => { const n = { ...prev }; delete n[id]; return n; });
    setSpPdfFiles(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  // --- Save ---
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
            // Gunakan resolusi 2500px & kualitas 92% (High-Fidelity) untuk infografis agar teks tajam
            // namun ukurannya tetap di bawah batas 4.5MB Vercel.
            const compressed = key.startsWith('sp_image_')
              ? await compressImage(file, 2500, 2500, 0.92)
              : await compressImage(file);
            formData.append(key, compressed);
          } else {
            formData.append(key, file);
          }
        }
      }

      const res = await fetch('/api/config', { method: 'POST', body: formData });
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
      if (sejarahFile) filesToUpload['sejarah_image_file'] = sejarahFile;
      Object.keys(spFiles).forEach(id => { filesToUpload[`sp_image_${id}`] = spFiles[id]; });
      Object.keys(spPdfFiles).forEach(id => { filesToUpload[`sp_pdf_${id}`] = spPdfFiles[id]; });
    } else if (pageName === 'akademik') {
      if (kurikulumFile) filesToUpload['kurikulum_image_file'] = kurikulumFile;
      Object.keys(p5Files).forEach(index => { filesToUpload[`p5_image_${index}`] = p5Files[index]; });
    } else if (pageName === 'kesiswaan') {
      Object.keys(ekskulFiles).forEach(index => { filesToUpload[`ekskul_image_${index}`] = ekskulFiles[index]; });
    }

    await handlePageContentsSave(pageName, dataToSave, filesToUpload);

    if (pageName === 'profil') {
      setSejarahFile(null);
      setSpFiles({});
      setSpPreviews({});
      setSpPdfFiles({});
    }
    else if (pageName === 'akademik') { setKurikulumFile(null); setP5Files({}); setP5Previews({}); }
    else if (pageName === 'kesiswaan') setEkskulFiles({});
  };

  return {
    activePageSubTab, setActivePageSubTab,
    sejarahFile, setSejarahFile, sejarahPreview, setSejarahPreview,
    kurikulumFile, setKurikulumFile, kurikulumPreview, setKurikulumPreview,
    ekskulFiles, setEkskulFiles, ekskulPreviews, setEkskulPreviews,
    p5Files, setP5Files, p5Previews, setP5Previews,
    spFiles, setSpFiles, spPreviews, setSpPreviews,
    spPdfFiles, setSpPdfFiles,
    handleSpFileChange, handleSpPdfFileChange,
    handleAddSpItem, handleUpdateSpItem, handleRemoveSpItem,
    handleFieldChange,
    handleP5FileChange, handleAddP5Project, handleUpdateP5Project, handleRemoveP5Project,
    handleAddSeragam, handleUpdateSeragam, handleRemoveSeragam,
    handleAddJadwalKbm, handleUpdateJadwalKbm, handleRemoveJadwalKbm,
    handleAddEkskul, handleUpdateEkskul, handleRemoveEkskul, handleEkskulFileChange,
    handleAddKesiswaanPrestasi, handleUpdateKesiswaanPrestasi, handleRemoveKesiswaanPrestasi,
    handleAddKarya, handleUpdateKarya, handleRemoveKarya,
    handleAddPPDBFaq, handleUpdatePPDBFaq, handleRemovePPDBFaq,
    handleAddPPDBJadwal, handleUpdatePPDBJadwal, handleRemovePPDBJadwal,
    handleSejarahFileChange, handleKurikulumFileChange,
    handlePageContentsSave, submitPageContents
  };
}
