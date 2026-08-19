"use client";

import { useState } from 'react';

export default function useTeacherMediaHandlers({ alertDialog }) {
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

  const validatePhoto = (file, e) => {
    if (file.size > 1024 * 1024) {
      const msg = 'Ukuran file foto terlalu besar! Maksimal ukuran file adalah 1MB.';
      if (alertDialog) alertDialog({ title: 'Ukuran Foto Terlalu Besar', message: msg, type: 'warning' }); else alert(msg);
      e.target.value = ''; return false;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['png','jpg','jpeg'].includes(ext)) {
      const msg = 'Jenis file tidak valid! Hanya berkas PNG (.png), JPG (.jpg), dan JPEG (.jpeg) yang diperbolehkan.';
      if (alertDialog) alertDialog({ title: 'Jenis Berkas Tidak Valid', message: msg, type: 'warning' }); else alert(msg);
      e.target.value = ''; return false;
    }
    return true;
  };

  const handleTeacherImageSelectChange = (e) => {
    const val = e.target.value; setTeacherImageSelect(val);
    const fi = document.getElementById('teacher_photo'); if (fi) fi.value = '';
    if (val === 'custom') setAvatarPreview(teacherImageUrl); else { setTeacherImageUrl(val); setAvatarPreview(val); }
  };
  const handleTeacherImageUrlChange = (e) => { setTeacherImageUrl(e.target.value); setAvatarPreview(e.target.value); };
  const handleTeacherPhotoChange = (e) => {
    const file = e.target.files[0]; if (!file || !validatePhoto(file, e)) return;
    const reader = new FileReader(); reader.onload = (ev) => setAvatarPreview(ev.target.result); reader.readAsDataURL(file);
  };
  const handleEditTeacherImageSelectChange = (e) => {
    const val = e.target.value; setEditTeacherImageSelect(val);
    const fi = document.getElementById('edit_teacher_photo'); if (fi) fi.value = '';
    if (val === 'custom') setEditAvatarPreview(editTeacherImageUrl); else { setEditTeacherImageUrl(val); setEditAvatarPreview(val); }
  };
  const handleEditTeacherImageUrlChange = (e) => { setEditTeacherImageUrl(e.target.value); setEditAvatarPreview(e.target.value); };
  const handleEditTeacherPhotoChange = (e) => {
    const file = e.target.files[0]; if (!file || !validatePhoto(file, e)) return;
    const reader = new FileReader(); reader.onload = (ev) => setEditAvatarPreview(ev.target.result); reader.readAsDataURL(file);
  };

  return {
    addTeacherModalOpen, setAddTeacherModalOpen, editTeacherModalOpen, setEditTeacherModalOpen,
    editTeacherId, setEditTeacherId, editName, setEditName, editRole, setEditRole,
    editStatus, setEditStatus, editDetails, setEditDetails, editNip, setEditNip,
    editSubject, setEditSubject, editEducation, setEditEducation, editMotto, setEditMotto,
    editBio, setEditBio, editPassword, setEditPassword, addPassword, setAddPassword,
    editTeacherImageSelect, setEditTeacherImageSelect, editTeacherImageUrl, setEditTeacherImageUrl,
    editAvatarPreview, setEditAvatarPreview, showTeacherUrlInput, setShowTeacherUrlInput,
    showEditTeacherUrlInput, setShowEditTeacherUrlInput,
    teacherImageSelect, setTeacherImageSelect, teacherImageUrl, setTeacherImageUrl,
    avatarPreview, setAvatarPreview,
    handleTeacherImageSelectChange, handleTeacherImageUrlChange, handleTeacherPhotoChange,
    handleEditTeacherImageSelectChange, handleEditTeacherImageUrlChange, handleEditTeacherPhotoChange
  };
}
