"use client";

import { sortTeachersListClient } from './helpers';

export default function useBackupHandlers({
  config, setConfig, newsList, setNewsList, teachers, setTeachers,
  achievements, setAchievements, records, setRecords, students, setStudents,
  graduation, setGraduation, messages, setMessages, setPageContents, fetch, showToast, router
}) {
  const handleBackupExport = () => {
    try {
      const backupData = { version: '1.0', date: new Date().toISOString(), config, newsList, teachers, achievements, ppdbList: records||[], students: students||[], graduation: graduation||[], messages: messages||[] };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const a = document.createElement('a');
      a.setAttribute('href', jsonString);
      a.setAttribute('download', `backup_sdn_bobong_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(a); a.click(); a.remove();
      showToast('success', 'Berkas cadangan konfigurasi & kesiswaan (JSON) berhasil diunduh!');
    } catch (err) { showToast('danger', 'Gagal melakukan ekspor: ' + err.message); }
  };

  const handleBackupRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        if (!backupData.config || typeof backupData.config !== 'object') { showToast('danger', 'Berkas cadangan tidak valid!'); return; }
        const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'restore_backup', config: backupData.config, newsList: backupData.newsList||null, teachers: backupData.teachers||null, achievements: backupData.achievements||null, ppdbList: backupData.ppdbList||null, students: backupData.students||null, graduation: backupData.graduation||null, messages: backupData.messages||null }) });
        const data = await res.json();
        if (res.ok) {
          showToast('success', 'Konfigurasi & data kesiswaan berhasil dipulihkan dari berkas cadangan!');
          setConfig(data.config);
          if (data.config?.stats?.page_contents) setPageContents(data.config.stats.page_contents);
          if (data.newsList) setNewsList(data.newsList); else if (backupData.newsList) setNewsList(backupData.newsList);
          if (data.teachers) setTeachers(sortTeachersListClient(data.teachers)); else if (backupData.teachers) setTeachers(sortTeachersListClient(backupData.teachers));
          if (data.achievements) setAchievements(data.achievements); else if (backupData.achievements) setAchievements(backupData.achievements);
          if (data.ppdbList) setRecords(data.ppdbList); else if (backupData.ppdbList) setRecords(backupData.ppdbList);
          if (data.students) setStudents(data.students); else if (backupData.students) setStudents(backupData.students);
          if (data.graduation) setGraduation(data.graduation); else if (backupData.graduation) setGraduation(backupData.graduation);
          if (data.messages) setMessages(data.messages); else if (backupData.messages) setMessages(backupData.messages);
          router.refresh();
        } else showToast('danger', data.error || 'Gagal memulihkan dari berkas cadangan.');
      } catch (err) { showToast('danger', 'Gagal membaca berkas cadangan: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return { handleBackupExport, handleBackupRestore };
}
