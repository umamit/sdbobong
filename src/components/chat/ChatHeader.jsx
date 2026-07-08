'use client';

import styles from './ChatWidget.module.css';

export default function ChatHeader({ isSoundEnabled, toggleSound, toggleChat }) {
  return (
    <div className={styles.aiHeader}>
      <div className={styles.aiHeaderProfile}>
        <div className={styles.aiAvatarContainer}>
          <img src="/images/logo_sekolah.png" alt="Logo Aim AI" width="36" height="36" className={styles.aiAvatar} />
          <span className={styles.aiOnlineIndicator}></span>
        </div>
        <div className={styles.aiTitleDetails}>
          <h4>Aim AI</h4>
          <span className={styles.aiSubtitle}>Asisten Virtual Sekolah</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Global TTS Sound Toggle */}
        <button 
          className={`${styles.aiSoundBtn} ${isSoundEnabled ? styles.active : ''}`}
          onClick={toggleSound}
          title={isSoundEnabled ? "Matikan Pengisi Suara Otomatis" : "Aktifkan Pengisi Suara Otomatis"}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isSoundEnabled ? 1 : 0.6,
            transition: 'all 0.2s ease'
          }}
        >
          {isSoundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {/* Close Button */}
        <button 
          className={styles.aiCloseBtn}
          onClick={toggleChat}
          aria-label="Tutup Chat"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
