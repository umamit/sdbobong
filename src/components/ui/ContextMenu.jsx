'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * ContextMenu - iOS Floating Context Menu Sheet Component
 * Portaled to document.body (Rule 10).
 * @param {boolean} open - Visibility toggle
 * @param {{x: number, y: number}} position - Click coordinates
 * @param {Array<{label: string, icon: React.ReactNode, onClick: function, destructive?: boolean}>} items - Action items
 * @param {function} onClose - Close handler
 */
export default function ContextMenu({
  open = false,
  position = { x: 0, y: 0 },
  items = [],
  onClose,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = () => {
      if (onClose) onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted || !items.length) return null;

  // Ensure menu stays within screen boundaries
  const menuWidth = 220;
  const posX = Math.min(Math.max(16, position.x), window.innerWidth - menuWidth - 16);
  const posY = Math.min(position.y, window.innerHeight - (items.length * 44 + 30));

  return createPortal(
    <div className="ios-context-backdrop" onClick={onClose}>
      <div
        className="ios-context-menu"
        style={{
          top: `${posY}px`,
          left: `${posX}px`,
          width: `${menuWidth}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className={`ios-context-item ${item.destructive ? 'is-destructive' : ''}`}
            onClick={() => {
              item.onClick();
              if (onClose) onClose();
            }}
          >
            <span className="ios-context-label">{item.label}</span>
            {item.icon && <span className="ios-context-icon">{item.icon}</span>}
          </button>
        ))}
      </div>

      <style>{`
        .ios-context-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99998;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: contextFade 0.2s ease forwards;
        }

        @keyframes contextFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ios-context-menu {
          position: fixed;
          z-index: 99999;
          background: rgba(30, 41, 59, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 16px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
          animation: contextPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes contextPop {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }

        .ios-context-item {
          background: transparent;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .ios-context-item:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .ios-context-item:active {
          transform: scale(0.97);
        }

        .ios-context-item.is-destructive {
          color: #FF3B30;
        }

        .ios-context-item.is-destructive:hover {
          background: rgba(255, 59, 48, 0.2);
        }

        .ios-context-icon {
          display: flex;
          align-items: center;
          opacity: 0.85;
        }
      `}</style>
    </div>,
    document.body
  );
}
