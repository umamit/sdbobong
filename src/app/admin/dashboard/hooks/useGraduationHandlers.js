import { useState } from 'react';

export default function useGraduationHandlers({
  initialGraduation,
  fetch,
  showToast,
  router,
  confirmDialog
}) {
  const [graduation, setGraduation] = useState(initialGraduation);
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
    const isConfirmed = confirmDialog
      ? await confirmDialog({ title: 'Hapus Data Kelulusan', message: 'Apakah Anda yakin ingin menghapus data kelulusan siswa ini secara permanen?', type: 'danger' })
      : confirm('Apakah Anda yakin ingin menghapus data kelulusan siswa ini secara permanen?');

    if (!isConfirmed) return;
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

  // Computations
  const filteredGraduation = graduation.filter(item => {
    const q = gradSearch.toLowerCase();
    return (item.name || '').toLowerCase().includes(q) ||
           (item.nisn || '').toLowerCase().includes(q) ||
           (item.no_peserta || '').toLowerCase().includes(q) ||
           (item.sk_number || '').toLowerCase().includes(q);
  });

  return {
    graduation,
    setGraduation,
    gradSearch,
    setGradSearch,
    gradModalOpen,
    setGradModalOpen,
    editingGrad,
    setEditingGrad,
    gradNisn,
    setGradNisn,
    gradNoPeserta,
    setGradNoPeserta,
    gradName,
    setGradName,
    gradStatus,
    setGradStatus,
    gradSkNumber,
    setGradSkNumber,
    gradBirthPlace,
    setGradBirthPlace,
    gradBirthDate,
    setGradBirthDate,
    gradParentName,
    setGradParentName,
    handleSaveGraduation,
    handleDeleteGraduation,
    filteredGraduation
  };
}
