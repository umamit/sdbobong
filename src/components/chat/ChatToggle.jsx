'use client';

import styles from './ChatWidget.module.css';

export default function ChatToggle({ isOpen, toggleChat, showBadge }) {
  return (
    <button 
      className={`${styles.aimAiTrigger} ${isOpen ? styles.active : ''}`}
      onClick={toggleChat}
      aria-label="Tanya Asisten Aim AI"
    >
      {isOpen ? (
        // Icon Silang (Tutup)
        <svg className={styles.aiIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        // Icon AI Robot/Chat Sparkle
        <svg className={`${styles.aiIcon} ${styles.animatePulse || ''}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-10 10c0 1.95.44 3.79 1.23 5.43L2 22l4.75-1.2A10 10 0 0 0 22 12 10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          <path d="M16 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" opacity="0.3"/>
        </svg>
      )}

      {/* Lencana Notifikasi */}
      {showBadge && !isOpen && (
        <span className={styles.aiBadgeDot}>
          <span className={styles.aiBadgePulse}></span>
        </span>
      )}
    </button>
  );
}
