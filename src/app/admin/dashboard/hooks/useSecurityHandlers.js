"use client";

import { useState, useEffect } from 'react';

export default function useSecurityHandlers({
  config, setConfig, fetch, showToast, initialAuditLogs = [], router
}) {
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [securitySearch, setSecuritySearch] = useState('');
  const [securityFilter, setSecurityFilter] = useState('all');
  const [blacklistIp, setBlacklistIp] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [blockDurationMin, setBlockDurationMin] = useState(5);
  const [autoPruneDays, setAutoPruneDays] = useState(0);
  const [purgeLogsConfirmation, setPurgeLogsConfirmation] = useState('');
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
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

  const refreshLogs = async () => {
    const logRes = await fetch(`/api/config/audit_logs?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache, no-store' } });
    if (logRes.ok) { const d = await logRes.json(); setAuditLogs(d.auditLogs || []); }
  };

  const handleResolveThreat = async (ip) => {
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'resolve_security_threat', ip }) });
      const data = await res.json();
      if (res.ok) { showToast('success', `Ancaman keamanan untuk IP ${ip} berhasil diselesaikan!`); setConfig(data.config); await refreshLogs(); router.refresh(); }
      else showToast('danger', data.error || 'Gagal menyelesaikan ancaman keamanan.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleRefreshAuditLogs = async () => {
    try { await refreshLogs(); showToast('success', 'Jurnal jejak audit berhasil diperbarui!'); }
    catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleAddBlacklist = async (e) => {
    e.preventDefault();
    if (!blacklistIp.trim()) { showToast('danger', 'Silakan masukkan alamat IP yang ingin diblokir.'); return; }
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'add_blacklist_ip', ip: blacklistIp.trim(), reason: blacklistReason.trim() || undefined }) });
      const data = await res.json();
      if (res.ok) { showToast('success', `IP ${blacklistIp} berhasil dimasukkan ke daftar hitam manual.`); setConfig(data.config); setBlacklistIp(''); setBlacklistReason(''); await refreshLogs(); router.refresh(); }
      else showToast('danger', data.error || 'Gagal menambahkan IP ke daftar hitam.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleRemoveBlacklist = async (ip) => {
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'remove_blacklist_ip', ip }) });
      const data = await res.json();
      if (res.ok) { showToast('success', `IP ${ip} berhasil dibebaskan dari daftar hitam.`); setConfig(data.config); await refreshLogs(); router.refresh(); }
      else showToast('danger', data.error || 'Gagal membebaskan IP dari daftar hitam.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleSaveSecuritySettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'update_security_settings', max_attempts: Number(maxAttempts), block_duration_min: Number(blockDurationMin), auto_prune_days: Number(autoPruneDays) }) });
      const data = await res.json();
      if (res.ok) { showToast('success', 'Konfigurasi kebijakan keamanan berhasil diperbarui!'); setConfig(data.config); await refreshLogs(); router.refresh(); }
      else showToast('danger', data.error || 'Gagal memperbarui konfigurasi kebijakan keamanan.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handlePurgeAuditLogs = async (e) => {
    e.preventDefault();
    if (purgeLogsConfirmation !== 'KOSONGKAN') { showToast('danger', 'Konfirmasi salah! Silakan ketik kata KOSONGKAN untuk melanjutkan.'); return; }
    try {
      const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action_type: 'purge_audit_logs' }) });
      const data = await res.json();
      if (res.ok) { showToast('success', 'Seluruh jurnal audit berhasil dikosongkan!'); setPurgeLogsConfirmation(''); setIsPurgeModalOpen(false); await refreshLogs(); router.refresh(); }
      else showToast('danger', data.error || 'Gagal mengosongkan jurnal audit.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  const handleExportCsv = () => { window.open('/api/config/audit_logs?export=true', '_blank'); showToast('success', 'Mengekspor jurnal audit ke format CSV...'); };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { showToast('danger', 'Konfirmasi password baru tidak cocok!'); return; }
    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { showToast('success', 'Password admin berhasil diubah!'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
      else showToast('danger', data.error || 'Gagal mengubah password.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
    finally { setIsChangingPassword(false); }
  };

  const filteredAuditLogs = (auditLogs || []).filter(log => {
    const q = securitySearch.toLowerCase();
    const s = (log.ip||'').toLowerCase().includes(q)||(log.action||'').toLowerCase().includes(q)||(log.details||'').toLowerCase().includes(q)||(log.username||'').toLowerCase().includes(q);
    const f = securityFilter==='all'||(securityFilter==='threats'&&log.status==='blocked')||(securityFilter==='success'&&log.status==='success')||(securityFilter==='failures'&&log.status==='failed');
    return s && f;
  });

  return {
    auditLogs, setAuditLogs, securitySearch, setSecuritySearch, securityFilter, setSecurityFilter,
    blacklistIp, setBlacklistIp, blacklistReason, setBlacklistReason,
    maxAttempts, setMaxAttempts, blockDurationMin, setBlockDurationMin, autoPruneDays, setAutoPruneDays,
    purgeLogsConfirmation, setPurgeLogsConfirmation, isPurgeModalOpen, setIsPurgeModalOpen,
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    isChangingPassword, setIsChangingPassword, activeThreats, filteredAuditLogs,
    handleResolveThreat, handleRefreshAuditLogs, handleAddBlacklist, handleRemoveBlacklist,
    handleSaveSecuritySettings, handlePurgeAuditLogs, handleExportCsv, handleChangePassword
  };
}
