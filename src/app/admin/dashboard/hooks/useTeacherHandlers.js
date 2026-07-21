import { useState } from 'react';
import { compressImage, sortTeachersListClient } from './helpers';

export default function useTeacherHandlers({
  teachers,
  setTeachers,
  config,
  setConfig,
  fetch,
  showToast,
  setIsProcessing,
  setProcessingMessage,
  router,
  confirmDialog,
  alertDialog
}) {
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
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

  const [teacherImageSelect, setTeacherImageSelect] = useState('/images/teacher_1.png');
  const [teacherImageUrl, setTeacherImageUrl] = useState('/images/teacher_1.png');
  const [avatarPreview, setAvatarPreview] = useState('/images/teacher_1.png');

  const normalizeTeacherName = (name) => {
    if (!name) return "";
    let normalized = name.toLowerCase();
    
    normalized = normalized.replace(/\b(s\.?pd\.?i?\.?|m\.?pd\.?i?\.?|s\.?kom\.?|m\.?kom\.?|s\.?ag\.?|m\.?ag\.?|s\.?e\.?|m\.?e\.?|s\.?h\.?|m\.?h\.?|s\.?t\.?|m\.?t\.?|s\.?si\.?|m\.?si\.?|drs\.?|dra\.?|gr\.?)\b/gi, "");
    
    const prefixRegex = /^(ibu|bapak|pak|bu|sdri|sdr|haji|hajah|hj\.?|h\.?|ustad|ustadz|ustadzah)\s+/i;
    while (prefixRegex.test(normalized)) {
      normalized = normalized.replace(prefixRegex, "");
    }
    
    return normalized
      .replace(/[^a-z0-9]/gi, "")
      .trim();
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
    const isConfirmed = confirmDialog
      ? await confirmDialog({ title: 'Hapus Data Guru', message: 'Apakah Anda yakin ingin menghapus data guru ini?', type: 'danger' })
      : confirm('Apakah Anda yakin ingin menghapus data guru ini?');

    if (!isConfirmed) return;
    try {
      const targetTeacher = teachers.find(t => t.id === teacherId);
      const res = await fetch(`/api/teachers?id=${teacherId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Data guru berhasil dihapus.');
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        
        if (targetTeacher && config?.ppdb_contacts) {
          const nameNormalized = normalizeTeacherName(targetTeacher.name);
          const humasNameNormalized = normalizeTeacherName(config.ppdb_contacts.nama_humas);
          const operatorNameNormalized = normalizeTeacherName(config.ppdb_contacts.nama_operator);
          
          let needsConfigUpdate = false;
          let updatedContacts = { ...config.ppdb_contacts };
          
          if (nameNormalized && nameNormalized === humasNameNormalized) {
            updatedContacts.nama_humas = "";
            updatedContacts.nip_humas = "";
            updatedContacts.wa_humas = "";
            updatedContacts.jabatan_humas = "";
            needsConfigUpdate = true;
          }
          if (nameNormalized && nameNormalized === operatorNameNormalized) {
            updatedContacts.nama_operator = "";
            updatedContacts.nip_operator = "";
            updatedContacts.wa_operator = "";
            updatedContacts.jabatan_operator = "";
            needsConfigUpdate = true;
          }
          
          if (needsConfigUpdate) {
            await fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action_type: 'contacts',
                ...updatedContacts
              })
            });
            setConfig(prev => ({
              ...prev,
              ppdb_contacts: updatedContacts
            }));
          }
        }
        
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menghapus data guru.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

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
        if (alertDialog) {
          alertDialog({ title: 'Ukuran Foto Terlalu Besar', message: 'Ukuran file foto terlalu besar! Maksimal ukuran file adalah 1MB.', type: 'warning' });
        } else {
          alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 1MB.');
        }
        e.target.value = '';
        return;
      }
      const extension = file.name.split('.').pop().toLowerCase();
      const allowed = ['png', 'jpg', 'jpeg'];
      if (!allowed.includes(extension)) {
        if (alertDialog) {
          alertDialog({ title: 'Jenis Berkas Tidak Valid', message: 'Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.', type: 'warning' });
        } else {
          alert('Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.');
        }
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
        if (alertDialog) {
          alertDialog({ title: 'Ukuran Foto Terlalu Besar', message: 'Ukuran file foto terlalu besar! Maksimal ukuran file adalah 1MB.', type: 'warning' });
        } else {
          alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 1MB.');
        }
        e.target.value = '';
        return;
      }
      const extension = file.name.split('.').pop().toLowerCase();
      const allowed = ['png', 'jpg', 'jpeg'];
      if (!allowed.includes(extension)) {
        if (alertDialog) {
          alertDialog({ title: 'Jenis Berkas Tidak Valid', message: 'Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.', type: 'warning' });
        } else {
          alert('Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.');
        }
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

  const handleMakeContact = async (teacher, type) => {
    const contactName = type === 'humas' ? 'Humas PPDB' : 'Operator Dapodik/Sekolah';
    const currentPhone = type === 'humas' ? config.ppdb_contacts?.wa_humas : config.ppdb_contacts?.wa_operator;
    const defaultPhone = currentPhone || "";
    
    const phone = window.prompt(`Jadikan ${teacher.name} sebagai ${contactName}.\nMasukkan nomor WhatsApp beliau (Format: 628xxx):`, defaultPhone);
    
    if (phone === null) return;
    
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

  return {
    teachers,
    setTeachers,
    addTeacherModalOpen,
    setAddTeacherModalOpen,
    editTeacherModalOpen,
    setEditTeacherModalOpen,
    editTeacherId,
    setEditTeacherId,
    editName,
    setEditName,
    editRole,
    setEditRole,
    editStatus,
    setEditStatus,
    editDetails,
    setEditDetails,
    editNip,
    setEditNip,
    editSubject,
    setEditSubject,
    editEducation,
    setEditEducation,
    editMotto,
    setEditMotto,
    editBio,
    setEditBio,
    editPassword,
    setEditPassword,
    addPassword,
    setAddPassword,
    editTeacherImageSelect,
    setEditTeacherImageSelect,
    editTeacherImageUrl,
    setEditTeacherImageUrl,
    editAvatarPreview,
    setEditAvatarPreview,
    showTeacherUrlInput,
    setShowTeacherUrlInput,
    showEditTeacherUrlInput,
    setShowEditTeacherUrlInput,
    teacherImageSelect,
    setTeacherImageSelect,
    teacherImageUrl,
    setTeacherImageUrl,
    avatarPreview,
    setAvatarPreview,
    handleTeacherAdd,
    handleTeacherDelete,
    handleTeacherImageSelectChange,
    handleTeacherImageUrlChange,
    handleTeacherPhotoChange,
    handleTeacherEditClick,
    handleEditTeacherImageSelectChange,
    handleEditTeacherImageUrlChange,
    handleEditTeacherPhotoChange,
    handleTeacherUpdateSubmit,
    handleMakeContact,
    normalizeTeacherName
  };
}
