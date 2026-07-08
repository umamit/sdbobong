'use client';

import styles from './ChatWidget.module.css';

export default function QuickPrompts({ quickPrompts, onPromptClick, disabled }) {
  return (
    <div className={styles.aiQuickPrompts}>
      {quickPrompts.map((prompt, idx) => (
        <button 
          key={idx}
          className={styles.aiPromptBtn}
          onClick={() => onPromptClick(prompt.query)}
          disabled={disabled}
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}
