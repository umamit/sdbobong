"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Apple HIG — Mobile Bottom Tab Bar Component (Optimized Touch Responsiveness)
 * Tab Bar navigasi bawah khas iOS App Store khusus tampilan mobile (<768px).
 * Mematuhi Rule 10 & Rule 14.
 */
export default function MobileBottomTabBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '';
  const [pendingPath, setPendingPath] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset pending state when actual navigation finishes
  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  // Bypass on print & admin pages
  const bypassPaths = ['/formulir-ppdb', '/ppdb/cetak', '/nilai'];
  const isAdminOrPrint = pathname.startsWith('/admin') || bypassPaths.includes(pathname);

  if (!mounted || isAdminOrPrint) return null;

  const navItems = [
    {
      id: 'home',
      label: 'Beranda',
      href: '/',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'berita',
      label: 'Berita',
      href: '/berita',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M9 12h6m-6 4h4" />
        </svg>
      ),
    },
    {
      id: 'ppdb',
      label: 'PPDB',
      href: '/ppdb-online',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 'galeri',
      label: 'Galeri',
      href: '/galeri',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      id: 'profil',
      label: 'Profil',
      href: '/profil',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const activePath = pendingPath || pathname;

  return createPortal(
    <nav
      className="mobile-bottom-tab-bar"
      aria-label="Navigasi Utama Mobile"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
        display: 'none', // Shown via CSS @media on mobile screens
        padding: '4px 6px calc(4px + env(safe-area-inset-bottom, 0px)) 6px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        {navItems.map((item) => {
          const isActive = item.href === '/' ? activePath === '/' : activePath.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setPendingPath(item.href)}
              className="tab-item-btn"
              style={{
                flex: 1,
                minHeight: '48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '4px 2px',
                borderRadius: '14px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary, #12A5B8)' : 'var(--text-light, #86868B)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.72rem',
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.12s ease, color 0.15s ease, background-color 0.15s ease',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isActive ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {item.icon}
              </span>
              <span style={{ transform: isActive ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-tab-bar {
            display: block !important;
          }
        }
        .tab-item-btn:active {
          transform: scale(0.90) !important;
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        :global([data-theme='dark']) .mobile-bottom-tab-bar {
          background-color: rgba(28, 28, 30, 0.92) !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        :global([data-theme='dark']) .tab-item-btn:active {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </nav>,
    document.body
  );
}
