'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Import client-side helpers
import { clientSupabase } from './hooks/helpers';

// Import custom hooks
import useConfigHandlers from './hooks/useConfigHandlers';
import useTeacherHandlers from './hooks/useTeacherHandlers';
import useNewsHandlers from './hooks/useNewsHandlers';
import useGalleryHandlers from './hooks/useGalleryHandlers';
import usePpdbHandlers from './hooks/usePpdbHandlers';
import useStudentHandlers from './hooks/useStudentHandlers';
import useGraduationHandlers from './hooks/useGraduationHandlers';
import useEventHandlers from './hooks/useEventHandlers';
import useAchievementHandlers from './hooks/useAchievementHandlers';
import useContentUtilityHandlers from './hooks/useContentUtilityHandlers';
import useSystemHandlers from './hooks/useSystemHandlers';

export const AdminDashboardContext = createContext(null);

export function AdminDashboardProvider({
  children,
  initialConfig,
  initialNewsList,
  initialTeachers,
  initialAchievements,
  initialRecords,
  dbStatus,
  initialStorageInfo = {
    supabaseSize: 0,
    localSize: 0,
    supabaseFormatted: '0 B',
    localFormatted: '0 B',
    totalSize: 0,
    totalFormatted: '0 B',
    isSupabaseActive: false
  },
  initialMessages = [],
  initialGraduation = [],
  initialAuditLogs = [],
  initialStudents = [],
}) {
  const router = useRouter();

  // Shared Core List States
  const [config, setConfig] = useState(initialConfig);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [pageContents, setPageContents] = useState({});

  // Global UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Memproses...');
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Intercept all write/mutation fetch requests to show premium loading overlay
  const customFetch = async (input, init) => {
    const url = typeof input === 'string' ? input : (input?.url || '');
    const method = (init?.method || 'GET').toUpperCase();
    const isAuthCall = method !== 'GET' && url.includes('/api/auth');

    if (method !== 'GET') {
      let msg = 'Sedang memproses...';
      if (url.includes('/api/auth/change-password')) {
        msg = 'Mengubah kata sandi admin...';
      } else if (url.includes('/api/config') && init?.body && typeof init.body === 'string' && init.body.includes('restore_backup')) {
        msg = 'Memulihkan data cadangan...';
      } else if (url.includes('/api/config')) {
        msg = 'Menyimpan konfigurasi sekolah...';
      } else if (url.includes('/api/teachers')) {
        msg = 'Memperbarui data guru & staf...';
      } else if (url.includes('/api/news')) {
        msg = 'Memproses berita & pengumuman...';
      } else if (url.includes('/api/achievements')) {
        msg = 'Menyimpan data prestasi siswa...';
      } else if (url.includes('/api/agenda')) {
        msg = 'Memperbarui agenda kegiatan...';
      } else if (url.includes('/api/messages')) {
        msg = 'Memproses kotak masuk & saran...';
      } else if (url.includes('/api/graduation')) {
        msg = 'Memperbarui data kelulusan...';
      } else if (url.includes('/api/ppdb')) {
        msg = 'Memperbarui status pendaftaran...';
      } else if (url.includes('/api/backup') || url.includes('backup')) {
        msg = 'Mencadangkan / memulihkan data...';
      } else if (url.includes('/api/auth')) {
        msg = 'Memproses keamanan sesi...';
      }

      setIsProcessing(true);
      setProcessingMessage(msg);
    }

    let response;
    try {
      response = await window.fetch(input, init);
      return response;
    } catch (err) {
      if (method !== 'GET') {
        setIsProcessing(false);
      }
      throw err;
    } finally {
      if (method !== 'GET') {
        const shouldKeepLoading = isAuthCall && response && response.ok;
        if (!shouldKeepLoading) {
          setIsProcessing(false);
        }
      }
    }
  };

  // 1. Config Handlers Hook
  const configStuff = useConfigHandlers({
    config,
    setConfig,
    pageContents,
    setPageContents,
    teachers,
    fetch: customFetch,
    showToast,
    setIsProcessing,
    setProcessingMessage,
    router
  });

  // 2. Teacher Handlers Hook
  const teacherStuff = useTeacherHandlers({
    teachers,
    setTeachers,
    config,
    setConfig,
    fetch: customFetch,
    showToast,
    setIsProcessing,
    setProcessingMessage,
    router
  });

  // 3. News Handlers Hook
  const newsStuff = useNewsHandlers({
    initialNewsList,
    fetch: customFetch,
    showToast,
    setIsProcessing,
    setProcessingMessage,
    router
  });

  // 4. Gallery Handlers Hook
  const galleryStuff = useGalleryHandlers({
    config,
    setConfig,
    fetch: customFetch,
    showToast,
    setIsProcessing,
    setProcessingMessage,
    router
  });

  // 5. Achievement Handlers Hook
  const achievementStuff = useAchievementHandlers({
    initialAchievements,
    fetch: customFetch,
    showToast,
    router
  });

  // 6. PPDB Handlers Hook
  const ppdbStuff = usePpdbHandlers({
    initialRecords,
    fetch: customFetch,
    showToast,
    router
  });

  // 7. Student Handlers Hook
  const studentStuff = useStudentHandlers({
    initialStudents,
    fetch: customFetch,
    showToast,
    router
  });

  // 8. Graduation Handlers Hook
  const graduationStuff = useGraduationHandlers({
    initialGraduation,
    fetch: customFetch,
    showToast,
    router
  });

  // 9. Event (Agenda) Handlers Hook
  const eventStuff = useEventHandlers({
    pageContents,
    setPageContents,
    handlePageContentsSave: configStuff.handlePageContentsSave,
    showToast
  });

  // 10. Content Utility Handlers Hook (Downloads, FAQ, Messages)
  const contentUtilityStuff = useContentUtilityHandlers({
    config,
    setConfig,
    initialMessages,
    fetch: customFetch,
    showToast,
    router
  });

  // 11. System Handlers Hook (Audit logs, password, backups, session, active tab)
  const systemStuff = useSystemHandlers({
    config,
    setConfig,
    pageContents,
    setPageContents,
    newsList: newsStuff.newsList,
    setNewsList: newsStuff.setNewsList,
    teachers,
    setTeachers,
    achievements: achievementStuff.achievements,
    setAchievements: achievementStuff.setAchievements,
    initialAuditLogs,
    initialStorageInfo,
    fetch: customFetch,
    showToast,
    setIsProcessing,
    setProcessingMessage,
    router
  });

  // Computed derived states for PPDB contact NIP alignment
  const syncNipHumas = (() => {
    const name = config?.ppdb_contacts?.nama_humas || "";
    if (!name) return "";
    const matched = (teachers || []).find(t => t.name && configStuff.normalizeTeacherName(t.name) === configStuff.normalizeTeacherName(name));
    return matched ? matched.nip : "";
  })();

  const syncNipOperator = (() => {
    const name = config?.ppdb_contacts?.nama_operator || "";
    if (!name) return "";
    const matched = (teachers || []).find(t => t.name && configStuff.normalizeTeacherName(t.name) === configStuff.normalizeTeacherName(name));
    return matched ? matched.nip : "";
  })();

  // Sync body class with detail modal open state for robust print preview styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (ppdbStuff.isDetailModalOpen) {
        document.body.classList.add('print-detail-open');
      } else {
        document.body.classList.remove('print-detail-open');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('print-detail-open');
      }
    };
  }, [ppdbStuff.isDetailModalOpen]);

  // Realtime subscription for PPDB and Guestbook
  useEffect(() => {
    if (!clientSupabase) return;

    console.log('Establishing Realtime connections...');

    // Listen to new registrations in ppdb_sdn_bobong table
    const ppdbChannel = clientSupabase
      .channel('ppdb-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ppdb_sdn_bobong' },
        (payload) => {
          console.log('Realtime PPDB INSERT payload:', payload);
          const newRecord = payload.new;
          if (newRecord) {
            newRecord.id = newRecord.id || newRecord.nik_siswa || newRecord.nik;
            newRecord.status = newRecord.status || 'Diterima Sistem';
            if (!newRecord.tahun_ajaran && newRecord.waktu_daftar) {
              const year = parseInt(newRecord.waktu_daftar.substring(0, 4), 10);
              newRecord.tahun_ajaran = !isNaN(year) ? `${year}/${year + 1}` : '2026/2027';
            } else if (!newRecord.tahun_ajaran) {
              newRecord.tahun_ajaran = '2026/2027';
            }

            ppdbStuff.setRecords(prev => {
              const exists = prev.some(r => (r.nik_siswa || r.nik || r.id) === (newRecord.nik_siswa || newRecord.nik || newRecord.id));
              if (exists) return prev;
              return [newRecord, ...prev];
            });

            showToast('success', `🔔 Pendaftar baru terdeteksi: ${newRecord.nama_lengkap}!`);
          }
        }
      )
      .subscribe();

    // Listen to new guestbook entries
    const guestbookChannel = clientSupabase
      .channel('guestbook-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_sdn_bobong' },
        (payload) => {
          console.log('Realtime Guestbook INSERT payload:', payload);
          const newMsg = payload.new;
          if (newMsg) {
            contentUtilityStuff.setMessages(prev => {
              const exists = prev.some(m => m.id === newMsg.id);
              if (exists) return prev;
              return [newMsg, ...prev];
            });
            showToast('success', `✉️ Pesan baru di Buku Tamu dari: ${newMsg.nama}!`);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Realtime channels...');
      clientSupabase.removeChannel(ppdbChannel);
      clientSupabase.removeChannel(guestbookChannel);
    };
  }, []);

  const value = {
    // Global properties
    router,
    isProcessing,
    setIsProcessing,
    processingMessage,
    setProcessingMessage,
    fetch: customFetch,
    toast,
    setToast,
    showToast,
    dbStatus,

    // Shared States
    config,
    setConfig,
    teachers,
    setTeachers,
    pageContents,
    setPageContents,
    syncNipHumas,
    syncNipOperator,

    // Config Hook outputs
    ...configStuff,

    // Teacher Hook outputs
    ...teacherStuff,

    // News Hook outputs
    ...newsStuff,

    // Gallery Hook outputs
    ...galleryStuff,

    // Achievement Hook outputs
    ...achievementStuff,

    // PPDB Hook outputs
    ...ppdbStuff,

    // Student Hook outputs
    ...studentStuff,

    // Graduation Hook outputs
    ...graduationStuff,

    // Event Hook outputs
    ...eventStuff,

    // Content Utilities outputs
    ...contentUtilityStuff,

    // System outputs
    ...systemStuff
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
}
