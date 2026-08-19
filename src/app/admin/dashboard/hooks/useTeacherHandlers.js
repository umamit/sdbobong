"use client";

import useTeacherMediaHandlers from './useTeacherMediaHandlers';
import useTeacherCrudHandlers from './useTeacherCrudHandlers';

export default function useTeacherHandlers(props) {
  const media = useTeacherMediaHandlers({ alertDialog: props.alertDialog });
  const crud = useTeacherCrudHandlers({
    ...props,
    teacherImageSelect: media.teacherImageSelect, teacherImageUrl: media.teacherImageUrl,
    setTeacherImageSelect: media.setTeacherImageSelect, setTeacherImageUrl: media.setTeacherImageUrl,
    setAvatarPreview: media.setAvatarPreview, editTeacherImageSelect: media.editTeacherImageSelect,
    editTeacherImageUrl: media.editTeacherImageUrl, setAddTeacherModalOpen: media.setAddTeacherModalOpen,
    setEditTeacherModalOpen: media.setEditTeacherModalOpen, editTeacherId: media.editTeacherId,
    setEditTeacherId: media.setEditTeacherId, setEditName: media.setEditName, setEditRole: media.setEditRole,
    setEditStatus: media.setEditStatus, setEditDetails: media.setEditDetails, setEditNip: media.setEditNip,
    setEditSubject: media.setEditSubject, setEditEducation: media.setEditEducation, setEditMotto: media.setEditMotto,
    setEditBio: media.setEditBio, setEditPassword: media.setEditPassword,
    setEditTeacherImageSelect: media.setEditTeacherImageSelect, setEditTeacherImageUrl: media.setEditTeacherImageUrl,
    setEditAvatarPreview: media.setEditAvatarPreview, setShowEditTeacherUrlInput: media.setShowEditTeacherUrlInput,
    setAddPassword: media.setAddPassword
  });
  return { ...media, ...crud };
}
