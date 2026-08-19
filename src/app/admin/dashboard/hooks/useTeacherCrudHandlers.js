"use client";

import { compressImage, sortTeachersListClient } from './helpers';

export default function useTeacherCrudHandlers({
  teachers, setTeachers, config, setConfig, fetch, showToast,
  setIsProcessing, setProcessingMessage, router, confirmDialog,
  teacherImageSelect, teacherImageUrl, setTeacherImageSelect, setTeacherImageUrl, setAvatarPreview,
  editTeacherImageSelect, editTeacherImageUrl, setAddTeacherModalOpen, setEditTeacherModalOpen,
  editTeacherId, setEditName, setEditRole, setEditStatus, setEditDetails, setEditNip,
  setEditSubject, setEditEducation, setEditMotto, setEditBio, setEditPassword,
  setEditTeacherId, setEditTeacherImageSelect, setEditTeacherImageUrl, setEditAvatarPreview,
  setShowEditTeacherUrlInput, setAddPassword
}) {
  const normalizeTeacherName = (name) => {
    if (!name) return '';
    let n = name.toLowerCase();
    n = n.replace(/(s\.?pd\.?i?\.?|m\.?pd\.?i?\.?|s\.?kom\.?|m\.?kom\.?|s\.?ag\.?|m\.?ag\.?|s\.?e\.?|m\.?e\.?|s\.?h\.?|m\.?h\.?|s\.?t\.?|m\.?t\.?|s\.?si\.?|m\.?si\.?|drs\.?|dra\.?|gr\.?)/gi, '');
    const px = /^(ibu|bapak|pak|bu|sdri|sdr|haji|hajah|hj\.?|h\.?|ustad|ustadz|ustadzah)\s+/i;
    while (px.test(n)) n = n.replace(px, '');
    return n.replace(/[^a-z0-9]/gi, '').trim();
  };

  const handleTeacherAdd = async (e) => {
    e.preventDefault(); setIsProcessing(true); setProcessingMessage('Menambahkan data guru & staf...');
    const form = e.target; const formData = new FormData(form);
    if (teacherImageSelect !== 'custom') formData.set('image', teacherImageSelect); else formData.set('image', teacherImageUrl);
    try {
      const photoFile = formData.get('photo');
      if (photoFile && photoFile instanceof File && photoFile.size > 0) { showToast('info', 'Sedang mengompresi foto guru...'); formData.set('photo', await compressImage(photoFile)); }
      showToast('info', 'Sedang menyimpan data guru...');
      const res = await fetch('/api/teachers', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil ditambahkan!');
        setTeachers(prev => sortTeachersListClient([...prev, data.teacher]));
        form.reset(); setAddPassword(''); setTeacherImageSelect('/images/teacher_1.png'); setTeacherImageUrl('/images/teacher_1.png'); setAvatarPreview('/images/teacher_1.png'); setAddTeacherModalOpen(false); router.refresh();
      } else showToast('danger', data.error || 'Gagal menyimpan data guru baru.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
    finally { setIsProcessing(false); }
  };

  const handleTeacherDelete = async (teacherId) => {
    const isConfirmed = confirmDialog ? await confirmDialog({ title: 'Hapus Data Guru', message: 'Apakah Anda yakin ingin menghapus data guru ini?', type: 'danger' }) : confirm('Apakah Anda yakin ingin menghapus data guru ini?');
    if (!isConfirmed) return;
    try {
      const targetTeacher = teachers.find(t => t.id === teacherId);
      const res = await fetch(`/api/teachers?id=${teacherId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil dihapus.');
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        if (targetTeacher && config?.ppdb_contacts) {
          const nn = normalizeTeacherName(targetTeacher.name);
          let uc = { ...config.ppdb_contacts }; let nu = false;
          if (nn && nn === normalizeTeacherName(config.ppdb_contacts.nama_humas)) { uc.nama_humas=''; uc.nip_humas=''; uc.wa_humas=''; uc.jabatan_humas=''; nu=true; }
          if (nn && nn === normalizeTeacherName(config.ppdb_contacts.nama_operator)) { uc.nama_operator=''; uc.nip_operator=''; uc.wa_operator=''; uc.jabatan_operator=''; nu=true; }
          if (nu) { await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'contacts', ...uc }) }); setConfig(prev => ({ ...prev, ppdb_contacts: uc })); }
        }
        router.refresh();
      } else showToast('danger', data.error || 'Gagal menghapus data guru.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleTeacherEditClick = (t) => {
    setEditTeacherId(t.id); setEditName(t.name||''); setEditRole(t.role||''); setEditStatus(t.status||'PNS');
    setEditDetails(t.details||''); setEditNip(t.nip||''); setEditSubject(t.subject||''); setEditEducation(t.education||'');
    setEditMotto(t.motto||''); setEditBio(t.bio||''); setEditPassword('');
    const defs = ['/images/teacher_1.png','/images/teacher_2.jpg','/images/teacher_3.png','/images/teacher_4.jpg','/images/teacher_5.png','/images/teacher_7.jpg','/images/principal.svg'];
    if (defs.includes(t.image)) { setEditTeacherImageSelect(t.image); setEditTeacherImageUrl(t.image); }
    else { setEditTeacherImageSelect('custom'); setEditTeacherImageUrl(t.image||''); }
    setEditAvatarPreview(t.image||''); setShowEditTeacherUrlInput(false); setEditTeacherModalOpen(true);
  };

  const handleTeacherUpdateSubmit = async (e) => {
    e.preventDefault(); setIsProcessing(true); setProcessingMessage('Memperbarui data guru & staf...');
    const form = e.target; const formData = new FormData(form);
    formData.set('id', editTeacherId);
    if (editTeacherImageSelect !== 'custom') formData.set('image', editTeacherImageSelect); else formData.set('image', editTeacherImageUrl);
    try {
      const photoFile = formData.get('photo');
      if (photoFile && photoFile instanceof File && photoFile.size > 0) { showToast('info', 'Sedang mengompresi foto guru...'); formData.set('photo', await compressImage(photoFile)); }
      showToast('info', 'Sedang memperbarui data guru...');
      const res = await fetch('/api/teachers', { method: 'PUT', body: formData });
      const data = await res.json();
      if (res.ok) { showToast('success', 'Data guru berhasil diperbarui!'); setTeachers(prev => sortTeachersListClient(prev.map(t => t.id === editTeacherId ? data.teacher : t))); setEditTeacherModalOpen(false); setEditPassword(''); router.refresh(); }
      else showToast('danger', data.error || 'Gagal memperbarui data guru.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
    finally { setIsProcessing(false); }
  };

  const handleMakeContact = async (teacher, type) => {
    const contactName = type === 'humas' ? 'Humas PPDB' : 'Operator Dapodik/Sekolah';
    const cur = type === 'humas' ? config.ppdb_contacts?.wa_humas : config.ppdb_contacts?.wa_operator;
    const phone = window.prompt(`Jadikan ${teacher.name} sebagai ${contactName}.
Masukkan nomor WhatsApp beliau (Format: 628xxx):`, cur||'');
    if (phone === null) return;
    if (!phone.trim()) { showToast('danger', 'Nomor WhatsApp wajib diisi.'); return; }
    const cp = phone.replace(/[^0-9]/g, '');
    if (!cp.startsWith('628')) { showToast('danger', 'Format nomor WhatsApp salah. Harus diawali dengan 628.'); return; }
    try {
      const uc = type === 'humas' ? { ...config.ppdb_contacts, nama_humas: teacher.name, wa_humas: cp, jabatan_humas: teacher.role||'Humas Sekolah', nip_humas: teacher.nip||'' } : { ...config.ppdb_contacts, nama_operator: teacher.name, wa_operator: cp, jabatan_operator: teacher.role||'Operator Sekolah', nip_operator: teacher.nip||'' };
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'contacts', ...uc }) });
      const data = await res.json();
      if (res.ok) { showToast('success', `${teacher.name} berhasil diatur sebagai ${contactName}.`); setConfig(prev => ({ ...prev, ppdb_contacts: uc })); router.refresh(); }
      else showToast('danger', data.error || `Gagal mengatur ${contactName}.`);
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  return { normalizeTeacherName, handleTeacherAdd, handleTeacherDelete, handleTeacherEditClick, handleTeacherUpdateSubmit, handleMakeContact };
}
