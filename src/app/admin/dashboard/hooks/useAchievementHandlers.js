import { useState } from 'react';

export default function useAchievementHandlers({
  initialAchievements,
  fetch,
  showToast,
  router
}) {
  const [achievements, setAchievements] = useState(initialAchievements || []);
  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [achTitle, setAchTitle] = useState('');
  const [achLevel, setAchLevel] = useState('Tingkat Kabupaten');
  const [achYear, setAchYear] = useState('');
  const [achDescription, setAchDescription] = useState('');

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

  return {
    achievements,
    setAchievements,
    editingAchievementId,
    setEditingAchievementId,
    achTitle,
    setAchTitle,
    achLevel,
    setAchLevel,
    achYear,
    setAchYear,
    achDescription,
    setAchDescription,
    handleAchievementSubmit,
    handleAchievementEdit,
    handleAchievementCancel,
    handleAchievementDelete
  };
}
