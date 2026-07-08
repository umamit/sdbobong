'use client';

import styles from './ChatWidget.module.css';

export default function ChatWindow({ isOpen, children }) {
  return (
    <div className={`${styles.aimAiWindow} ${isOpen ? styles.open : ''}`}>
      {children}
    </div>
  );
}
