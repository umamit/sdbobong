import { useState, useEffect } from 'react';
import { sortTeachersListClient } from './helpers';

export default function useSystemHandlers({
  config,
  setConfig,
  pageContents,
  setPageContents,
  newsList,
  setNewsList,
  teachers,
  setTeachers,
  achievements,
  setAchievements,
  initialAuditLogs = [],
  initialStorageInfo,
  fetch,
  showToast,
  setIsProcessing,
  setProcessingMessage,
  router
}) {
  // Global States
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTooltip, setChartTooltip] = useState({ show: false, x: 0, y: 0, title: '', value: '' });
  const [storageInfo, setStorageInfo] = useState(initialStorageInfo);

  // Security Tab States
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [securitySearch, setSecuritySearch] = useState('');
  const [securityFilter, setSecurityFilter] = useState('all');

  // Blacklist IP Form
  const [blacklistIp, setBlacklistIp] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [blockDurationMin, setBlockDurationMin] = useState(5);
  const [autoPruneDays, setAutoPruneDays] = useState(0);
  const [purgeLogsConfirmation, setPurgeLogsConfirmation] = useState('');
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (config?.security_settings) {
      setMaxAttempts(config.security_settings.max_attempts ?? 5);
      setBlockDurationMin(config.security_settings.block_duration_min ?? 5);
      setAutoPruneDays(config.security_settings.auto_prune_days ?? 0);
    }
  }, [config]);

  const activeThreats = (config?.suspicious_attempts || []).filter(a => a.attempts >= 3 && a.resolved !== true);

  // 1-Hour Session Auto-Logout Check
  useEffect(() => {
    let expiry = localStorage.getItem('admin_session_expiry');
    if (!expiry) {
      expiry = String(Date.now() + 60 * 60 * 1000);
      localStorage.setItem('admin_session_expiry', expiry);
    }

    const checkSessionExpiry = async () => {
      const now = Date.now();
      if (now >= Number(expiry)) {
        clearInterval(sessionCheckInterval);
        alert('Sesi login Anda telah habis (1 jam). Anda akan otomatis di-logout demi keamanan.');
        try {
          const res = await fetch('/api/auth', { method: 'DELETE' });
          if (res.ok) {
            localStorage.removeItem('admin_session_expiry');
            router.push('/admin/login');
            router.refresh();
          } else {
            window.location.href = '/admin/login';
          }
        } catch (err) {
          console.error("Gagal otomatis logout:", err);
          window.location.href = '/admin/login';
        }
      }
    };

    checkSessionExpiry();
    const sessionCheckInterval = setInterval(checkSessionExpiry, 15000);
    return () => clearInterval(sessionCheckInterval);
  }, [router]);

  // Load active tab from URL query param if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleMouseMove = (e, title, value) => {
    const container = e.currentTarget.closest('.analytics-card');
    if (container) {
      const rect = container.getBoundingClientRect();
      setChartTooltip({
        show: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        title,
        value
      });
    }
  };

  const handleMouseLeave = () => {
    setChartTooltip(prev => ({ ...prev, show: false }));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (!confirm('Apakah Anda yakin ingin logout?')) return;
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        localStorage.removeItem('admin_session_expiry');
        router.push('/admin/login');
        router.refresh();
      } else {
        showToast('danger', 'Gagal logout.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleResolveThreat = async (ip) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'resolve_security_threat',
          ip: ip
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Ancaman keamanan untuk IP ${ip} berhasil diselesaikan dan dibebaskan!`);
        setConfig(data.config);
        
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menyelesaikan ancaman keamanan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleRefreshAuditLogs = async () => {
    try {
      const logRes = await fetch('/api/config/audit_logs');
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData.auditLogs || []);
        showToast('success', 'Jurnal jejak audit berhasil diperbarui!');
      } else {
        showToast('danger', 'Gagal memuat ulang jurnal jejak audit.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan saat memuat ulang: ' + err.message);
    }
  };

  const handleAddBlacklist = async (e) => {
    e.preventDefault();
    if (!blacklistIp.trim()) {
      showToast('danger', 'Silakan masukkan alamat IP yang ingin diblokir.');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'add_blacklist_ip',
          ip: blacklistIp.trim(),
          reason: blacklistReason.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `IP ${blacklistIp} berhasil dimasukkan ke daftar hitam manual.`);
        setConfig(data.config);
        setBlacklistIp('');
        setBlacklistReason('');
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal menambahkan IP ke daftar hitam.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleRemoveBlacklist = async (ip) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'remove_blacklist_ip',
          ip: ip
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `IP ${ip} berhasil dibebaskan dari daftar hitam.`);
        setConfig(data.config);
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal membebaskan IP dari daftar hitam.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleSaveSecuritySettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'update_security_settings',
          max_attempts: Number(maxAttempts),
          block_duration_min: Number(blockDurationMin),
          auto_prune_days: Number(autoPruneDays)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Konfigurasi kebijakan keamanan berhasil diperbarui!');
        setConfig(data.config);
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal memperbarui konfigurasi kebijakan keamanan.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handlePurgeAuditLogs = async (e) => {
    e.preventDefault();
    if (purgeLogsConfirmation !== 'KOSONGKAN') {
      showToast('danger', 'Konfirmasi salah! Silakan ketik kata KOSONGKAN untuk melanjutkan.');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'purge_audit_logs'
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Seluruh jurnal audit berhasil dikosongkan!');
        setPurgeLogsConfirmation('');
        setIsPurgeModalOpen(false);
        const logRes = await fetch('/api/config/audit_logs');
        if (logRes.ok) {
          const logData = await logRes.json();
          setAuditLogs(logData.auditLogs || []);
        }
        router.refresh();
      } else {
        showToast('danger', data.error || 'Gagal mengosongkan jurnal audit.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/config/audit_logs?export=true', '_blank');
    showToast('success', 'Mengekspor jurnal audit ke format CSV...');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('danger', 'Konfirmasi password baru tidak cocok!');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Password admin berhasil diubah!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast('danger', data.error || 'Gagal mengubah password.');
      }
    } catch (err) {
      showToast('danger', 'Terjadi kesalahan: ' + err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleBackupExport = () => {
    try {
      const backupData = {
        version: '1.0',
        date: new Date().toISOString(),
        config: config,
        newsList: newsList,
        teachers: teachers,
        achievements: achievements
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `backup_sdn_bobong_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Berkas cadangan konfigurasi (JSON) berhasil diunduh!');
    } catch (err) {
      showToast('danger', 'Gagal melakukan ekspor: ' + err.message);
    }
  };

  const handleBackupRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        if (!backupData.config || typeof backupData.config !== 'object') {
          showToast('danger', 'Berkas cadangan tidak valid atau tidak memiliki format yang benar!');
          return;
        }

        const res = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'restore_backup',
            config: backupData.config,
            newsList: backupData.newsList || null,
            teachers: backupData.teachers || null,
            achievements: backupData.achievements || null
          })
        });

        const data = await res.json();
        if (res.ok) {
          showToast('success', 'Konfigurasi website berhasil dipulihkan dari berkas cadangan!');
          setConfig(data.config);
          if (data.config?.stats?.page_contents) {
            setPageContents(data.config.stats.page_contents);
          }
          
          if (data.newsList) {
            setNewsList(data.newsList);
          } else if (backupData.newsList) {
            setNewsList(backupData.newsList);
          }

          if (data.teachers) {
            setTeachers(sortTeachersListClient(data.teachers));
          } else if (backupData.teachers) {
            setTeachers(sortTeachersListClient(backupData.teachers));
          }

          if (data.achievements) {
            setAchievements(data.achievements);
          } else if (backupData.achievements) {
            setAchievements(backupData.achievements);
          }
          router.refresh();
        } else {
          showToast('danger', data.error || 'Gagal memulihkan dari berkas cadangan.');
        }
      } catch (err) {
        showToast('danger', 'Gagal membaca berkas cadangan: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Computations
  const filteredAuditLogs = (auditLogs || []).filter(log => {
    const query = securitySearch.toLowerCase();
    const matchesSearch = (log.ip || '').toLowerCase().includes(query) ||
                          (log.action || '').toLowerCase().includes(query) ||
                          (log.details || '').toLowerCase().includes(query) ||
                          (log.username || '').toLowerCase().includes(query);
    const matchesFilter = securityFilter === 'all' || 
                          (securityFilter === 'threats' && log.status === 'blocked') ||
                          (securityFilter === 'success' && log.status === 'success') ||
                          (securityFilter === 'failures' && log.status === 'failed');
    return matchesSearch && matchesFilter;
  });

  return {
    activeTab,
    setActiveTab,
    chartTooltip,
    setChartTooltip,
    storageInfo,
    setStorageInfo,
    auditLogs,
    setAuditLogs,
    securitySearch,
    setSecuritySearch,
    securityFilter,
    setSecurityFilter,
    blacklistIp,
    setBlacklistIp,
    blacklistReason,
    setBlacklistReason,
    maxAttempts,
    setMaxAttempts,
    blockDurationMin,
    setBlockDurationMin,
    autoPruneDays,
    setAutoPruneDays,
    purgeLogsConfirmation,
    setPurgeLogsConfirmation,
    isPurgeModalOpen,
    setIsPurgeModalOpen,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    setIsChangingPassword,
    activeThreats,
    handleMouseMove,
    handleMouseLeave,
    handleLogout,
    handleResolveThreat,
    handleRefreshAuditLogs,
    handleAddBlacklist,
    handleRemoveBlacklist,
    handleSaveSecuritySettings,
    handlePurgeAuditLogs,
    handleExportCsv,
    handleChangePassword,
    handleBackupExport,
    handleBackupRestore,
    filteredAuditLogs
  };
}
