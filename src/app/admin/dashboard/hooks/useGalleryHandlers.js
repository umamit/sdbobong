import { useState } from 'react';

export default function useGalleryHandlers({
  config,
  setConfig,
  fetch,
  showToast,
  setIsProcessing,
  setProcessingMessage,
  router,
  confirmDialog
}) {
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
    const isConfirmed = confirmDialog
      ? await confirmDialog({ title: 'Hapus Foto/Video Galeri', message: 'Apakah Anda yakin ingin menghapus item galeri ini?', type: 'danger' })
      : confirm('Apakah Anda yakin ingin menghapus item galeri ini?');

    if (!isConfirmed) return;
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

  return {
    galleryModalOpen,
    setGalleryModalOpen,
    editingGalleryItem,
    setEditingGalleryItem,
    galleryTitle,
    setGalleryTitle,
    galleryType,
    setGalleryType,
    galleryCategory,
    setGalleryCategory,
    galleryUrl,
    setGalleryUrl,
    galleryDate,
    setGalleryDate,
    gallerySearch,
    setGallerySearch,
    galleryFile,
    setGalleryFile,
    galleryPreview,
    setGalleryPreview,
    gallerySourceType,
    setGallerySourceType,
    handleSaveGalleryItem,
    handleDeleteGalleryItem
  };
}
