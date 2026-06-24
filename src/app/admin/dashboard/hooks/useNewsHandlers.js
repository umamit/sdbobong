import { useState } from 'react';
import { compressImage } from './helpers';

export default function useNewsHandlers({
  initialNewsList,
  fetch,
  showToast,
  setIsProcessing,
  setProcessingMessage,
  router
}) {
  const [newsList, setNewsList] = useState(initialNewsList);
  const [editingNews, setEditingNews] = useState(null);
  const [newsEditorKey, setNewsEditorKey] = useState(0);
  const [newsPhotos, setNewsPhotos] = useState([]);
  const [newsPhotoPreviews, setNewsPhotoPreviews] = useState([]);

  const handleNewsAdd = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage('Mempublikasikan berita baru...');
    
    const form = e.target;
    const formData = new FormData(form);

    formData.delete('photo');
    formData.delete('photos');

    try {
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
    setNewsPhotos([]);
    newsPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
    setNewsPhotoPreviews([]);

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
    formData.append('id', editingNews.id);

    formData.delete('photo');
    formData.delete('photos');

    try {
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

  const handleNewsPhotosChange = (e) => {
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

    e.target.value = '';
  };

  const handleRemoveNewsPhoto = (index) => {
    if (newsPhotoPreviews[index]) {
      URL.revokeObjectURL(newsPhotoPreviews[index]);
    }
    setNewsPhotos(prev => prev.filter((_, i) => i !== index));
    setNewsPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return {
    newsList,
    setNewsList,
    editingNews,
    setEditingNews,
    newsEditorKey,
    setNewsEditorKey,
    newsPhotos,
    setNewsPhotos,
    newsPhotoPreviews,
    setNewsPhotoPreviews,
    handleNewsAdd,
    handleNewsEditClick,
    handleNewsCancelEdit,
    handleNewsUpdate,
    handleNewsDelete,
    handleNewsPhotosChange,
    handleRemoveNewsPhoto
  };
}
