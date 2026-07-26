'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function AnnouncementModal() {
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ambil konfigurasi popup pengumuman dari API
    async function fetchAnnouncement() {
      try {
        const res = await fetch('/api/config?t=' + Date.now());
        const data = await res.json();
        const popup = data.config?.popup_announcement;

        if (popup && popup.enabled) {
          // Cek apakah user sudah menutup pengumuman di sesi ini
          const dismissed = sessionStorage.getItem('popup_dismissed_id');
          const popupId = popup.title || 'default_popup';

          if (dismissed !== popupId) {
            setAnnouncement(popup);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error('Gagal memuat pengumuman popup:', err);
      }
    }

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    if (announcement) {
      const popupId = announcement.title || 'default_popup';
      sessionStorage.setItem('popup_dismissed_id', popupId);
    }
    setIsOpen(false);
  };

  if (!mounted || !isOpen || !announcement) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            padding: '1.75rem 1.5rem 1.5rem 1.5rem',
            color: 'white',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Tutup Pengumuman"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {announcement.badge || 'Pengumuman Penting'}
          </span>

          <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>
            {announcement.title}
          </h3>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {announcement.content}
          </p>

          {/* Action Button & Close Option */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600 }}
            >
              Tutup
            </button>

            {announcement.link && (
              <Link
                href={announcement.link}
                onClick={handleClose}
                className="btn btn-primary"
                style={{ padding: '9px 20px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}
              >
                {announcement.link_label || 'Lihat Selengkapnya →'}
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>,
    document.body
  );
}
