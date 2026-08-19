"use client";

import { useState, useEffect } from 'react';

export default function useOverviewHandlers({
  fetch,
  showToast,
  initialStorageInfo,
  router,
  confirmDialog,
  alertDialog
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTooltip, setChartTooltip] = useState({ show: false, x: 0, y: 0, title: '', value: '' });
  const [storageInfo, setStorageInfo] = useState(initialStorageInfo);

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
        if (alertDialog) {
          await alertDialog({ title: 'Sesi Login Berakhir', message: 'Sesi login Anda telah habis (1 jam). Anda akan otomatis di-logout demi keamanan.', type: 'warning' });
        } else {
          alert('Sesi login Anda telah habis (1 jam). Anda akan otomatis di-logout demi keamanan.');
        }
        try {
          const res = await fetch('/api/auth', { method: 'DELETE' });
          if (res.ok) { localStorage.removeItem('admin_session_expiry'); router.push('/admin/login'); router.refresh(); }
          else window.location.href = '/admin/login';
        } catch (err) { console.error('Gagal otomatis logout:', err); window.location.href = '/admin/login'; }
      }
    };
    checkSessionExpiry();
    const sessionCheckInterval = setInterval(checkSessionExpiry, 15000);
    return () => clearInterval(sessionCheckInterval);
  }, [router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, []);

  const handleMouseMove = (e, title, value) => {
    const container = e.currentTarget.closest('.analytics-card');
    if (container) {
      const rect = container.getBoundingClientRect();
      setChartTooltip({ show: true, x: e.clientX - rect.left, y: e.clientY - rect.top, title, value });
    }
  };

  const handleMouseLeave = () => setChartTooltip(prev => ({ ...prev, show: false }));

  const handleLogout = async (e) => {
    e.preventDefault();
    const isConfirmed = confirmDialog
      ? await confirmDialog({ title: 'Logout Admin', message: 'Apakah Anda yakin ingin keluar dari Dashboard Admin?', confirmText: 'Logout', cancelText: 'Batal', type: 'warning' })
      : confirm('Apakah Anda yakin ingin logout?');
    if (!isConfirmed) return;
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) { localStorage.removeItem('admin_session_expiry'); router.push('/admin/login'); router.refresh(); }
      else showToast('danger', 'Gagal logout.');
    } catch (err) { showToast('danger', 'Terjadi kesalahan: ' + err.message); }
  };

  return { activeTab, setActiveTab, chartTooltip, setChartTooltip, storageInfo, setStorageInfo, handleMouseMove, handleMouseLeave, handleLogout };
}
