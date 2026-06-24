import { useState } from 'react';

export default function usePpdbHandlers({
  initialRecords,
  fetch,
  showToast,
  router
}) {
  const [records, setRecords] = useState(initialRecords);
  const [ppdbSearch, setPpdbSearch] = useState('');
  const [ppdbFilterJalur, setPpdbFilterJalur] = useState('Semua');
  const [ppdbFilterStatus, setPpdbFilterStatus] = useState('Semua');
  const [ppdbFilterTahun, setPpdbFilterTahun] = useState('Semua');
  const [ppdbPage, setPpdbPage] = useState(1);
  const [ppdbPerPage, setPpdbPerPage] = useState(10);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // PPDB Delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetNik, setDeleteTargetNik] = useState('');
  const [deleteTargetName, setDeleteTargetName] = useState('');
  const [deleteIsBulk, setDeleteIsBulk] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');

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

    let cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '62' + cleanedPhone.slice(1);
    } else if (cleanedPhone.startsWith('62')) {
      // correct
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
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetNik('');
      setDeleteTargetName('');
      setDeleteIsBulk(false);
      setBulkDeleteConfirmText('');
    }
  };

  // Computations
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

  return {
    records,
    setRecords,
    ppdbSearch,
    setPpdbSearch,
    ppdbFilterJalur,
    setPpdbFilterJalur,
    ppdbFilterStatus,
    setPpdbFilterStatus,
    ppdbFilterTahun,
    setPpdbFilterTahun,
    ppdbPage,
    setPpdbPage,
    ppdbPerPage,
    setPpdbPerPage,
    selectedRecord,
    setSelectedRecord,
    isDetailModalOpen,
    setIsDetailModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteTargetId,
    setDeleteTargetId,
    deleteTargetNik,
    setDeleteTargetNik,
    deleteTargetName,
    setDeleteTargetName,
    deleteIsBulk,
    setDeleteIsBulk,
    bulkDeleteConfirmText,
    setBulkDeleteConfirmText,
    handleStatusChange,
    sendWhatsAppNotification,
    handlePPDBDelete,
    handleDeleteAllPPDB,
    executeDelete,
    availableTahunAjaran,
    filteredPPDB,
    totalPPDBPages,
    paginatedPPDB
  };
}
