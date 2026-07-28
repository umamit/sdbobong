"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Apple HIG — Action Sheet & Context Menu Component
 * Bottom sheet khas iOS / macOS context dialog dengan backdrop blur.
 * Menerapkan Rule 10 (createPortal ke document.body + mounted state + position fixed inset 0).
 * 
 * @param {boolean} isOpen - Status terbuka
 * @param {function(): void} onClose - Handler penutupan
 * @param {string} [title] - Judul dialog opsional
 * @param {string} [subtitle] - Subjudul opsional
 * @param {Array<{id: string, label: string, icon?: React.ReactNode, isDestructive?: boolean, onClick: function(): void}>} actions - Daftar aksi
 */
export default function ActionSheet({ isOpen, onClose, title, subtitle, actions = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key listener to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'opacity 0.25s ease-out',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          borderRadius: 'var(--radius-2xl, 22px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
          overflow: 'hidden',
          animation: 'actionSheetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
          <div style={{ width: '36px', height: '5px', borderRadius: '999px', backgroundColor: 'rgba(0,0,0,0.15)' }} />
        </div>

        {/* Header (Title & Subtitle) */}
        {(title || subtitle) && (
          <div style={{ padding: '0.75rem 1.25rem 0.5rem 1.25rem', textAlign: 'center', borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))' }}>
            {title && <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #1d1d1f)' }}>{title}</h4>}
            {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-light, #86868b)' }}>{subtitle}</p>}
          </div>
        )}

        {/* Action List */}
        <div style={{ padding: '0.5rem 0' }}>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                action.onClick && action.onClick();
                onClose && onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 16px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: action.isDestructive ? 'var(--formal-red, #FF3B30)' : 'var(--primary, #12A5B8)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.04))',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {action.icon && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px' }}>
                  {action.icon}
                </span>
              )}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-xl, 18px)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-main, #1d1d1f)',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            Batal
          </button>
        </div>
      </div>

      <style>{`
        @keyframes actionSheetSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
