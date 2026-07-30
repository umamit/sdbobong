'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * DynamicIslandToast - Apple HIG Dynamic Island Top Pill Notification
 * Renders a floating pill banner at top-center of the screen.
 * @param {boolean} open - Controls visibility
 * @param {string} title - Main notification title
 * @param {string} message - Description message
 * @param {'success'|'danger'|'info'|'warning'} type - Variant type
 * @param {function} onClose - Dismiss callback
 * @param {number} duration - Auto dismiss timeout in ms (default 4000)
 */
export default function DynamicIslandToast({
  open = false,
  title = '',
  message = '',
  type = 'info',
  onClose,
  duration = 4000,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !duration) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open || !mounted) return null;

  const typeColors = {
    success: { accent: '#34C759', bgGlow: 'rgba(52, 199, 89, 0.35)' },
    danger: { accent: '#FF3B30', bgGlow: 'rgba(255, 59, 48, 0.35)' },
    warning: { accent: '#FF9F0A', bgGlow: 'rgba(255, 159, 10, 0.35)' },
    info: { accent: '#007AFF', bgGlow: 'rgba(0, 122, 255, 0.35)' },
  };

  const current = typeColors[type] || typeColors.info;

  const iconMap = {
    success: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    danger: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return createPortal(
    <div className="dynamic-island-wrapper" role="alert" aria-live="assertive">
      <div
        className="dynamic-island-pill"
        style={{
          '--di-accent': current.accent,
          '--di-glow': current.bgGlow,
        }}
      >
        <div className="dynamic-island-icon">
          {iconMap[type] || iconMap.info}
        </div>
        <div className="dynamic-island-content">
          {title && <div className="dynamic-island-title">{title}</div>}
          {message && <div className="dynamic-island-message">{message}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            className="dynamic-island-close"
            onClick={onClose}
            aria-label="Tutup Notifikasi"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <style>{`
        .dynamic-island-wrapper {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          pointer-events: none;
          display: flex;
          justify-content: center;
          width: calc(100% - 32px);
          max-width: 420px;
        }

        .dynamic-island-pill {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 28px;
          padding: 10px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px var(--di-glow);
          animation: islandExpand 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          width: 100%;
        }

        @keyframes islandExpand {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .dynamic-island-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          background: var(--di-glow);
          color: var(--di-accent);
          box-shadow: inset 0 0 8px var(--di-glow);
        }

        .dynamic-island-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .dynamic-island-title {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dynamic-island-message {
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.3;
        }

        .dynamic-island-close {
          background: rgba(255, 255, 255, 0.12);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .dynamic-island-close:hover {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          transform: scale(1.1);
        }

        .dynamic-island-close:active {
          transform: scale(0.9);
        }
      `}</style>
    </div>,
    document.body
  );
}
