'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AppleConfirmModal - Apple HIG Glassmorphism Confirmation & Alert Dialog
 * Rendered to document.body via React.createPortal per Rule 10.
 */
export default function AppleConfirmModal({
  isOpen,
  title = 'Konfirmasi Aksi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Lanjutkan',
  cancelText = 'Batal',
  type = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const isAlertOnly = !cancelText;

  const getTheme = () => {
    if (type === 'danger') {
      return {
        badgeBg: '#FEE2E2',
        badgeColor: '#EF4444',
        btnBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        btnShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        ),
      };
    }
    if (type === 'warning') {
      return {
        badgeBg: '#FEF3C7',
        badgeColor: '#D97706',
        btnBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        btnShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      };
    }
    return {
      badgeBg: '#E0F2FE',
      badgeColor: '#0284C7',
      btnBg: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      btnShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    };
  };

  const theme = getTheme();

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel || onConfirm}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          zIndex: 9999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          key="modal-card"
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '410px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
            padding: '28px 24px 22px 24px',
            textAlign: 'center',
            boxSizing: 'border-box',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
          }}
        >
          {/* Icon Badge */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: theme.badgeBg,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            {theme.icon}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#0F172A',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>

          {/* Description Message */}
          <p
            style={{
              fontSize: '0.92rem',
              color: '#475569',
              margin: '0 0 24px 0',
              lineHeight: 1.55,
              whiteSpace: 'pre-line',
            }}
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {!isAlertOnly && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#94A3B8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '14px',
                border: 'none',
                background: theme.btnBg,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: theme.btnShadow,
                transition: 'transform 0.15s ease, filter 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.filter = 'brightness(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
