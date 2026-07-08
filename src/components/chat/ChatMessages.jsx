'use client';

import styles from './ChatWidget.module.css';

export default function ChatMessages({ messages, isTyping, activeSpeakingIndex, onSpeakToggle, chatEndRef }) {
  
  // Helper untuk mengubah format teks markdown sederhana menjadi HTML (tebal, baris baru, bullet points)
  const renderMessageContent = (content) => {
    if (!content) return '';
    
    // Pecah berdasarkan baris baru
    const lines = content.split('\n');
    
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      let isBullet = trimmed.startsWith('*') || trimmed.startsWith('-');
      let key = idx;

      // Handle bullet points
      if (isBullet) {
        trimmed = trimmed.substring(1).trim();
      }

      // Handle bold formatting (**teks**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          parts.push(trimmed.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < trimmed.length) {
        parts.push(trimmed.substring(lastIndex));
      }

      const contentNode = parts.length > 0 ? parts : trimmed;

      if (isBullet) {
        return (
          <li key={key} style={{ marginLeft: '1.2rem', marginBottom: '4px', listStyleType: 'disc' }}>
            {contentNode}
          </li>
        );
      }

      return (
        <p key={key} style={{ marginBottom: line === '' ? '0.75rem' : '4px', minHeight: line === '' ? '8px' : 'auto' }}>
          {contentNode}
        </p>
      );
    });
  };

  return (
    <div className={styles.aiMessagesArea}>
      {messages.map((msg, index) => {
        const isAssistant = msg.role === 'assistant';
        const isSpeaking = activeSpeakingIndex === index;

        return (
          <div 
            key={index}
            className={`${styles.aiMessageBubble} ${isAssistant ? styles.assistant : styles.user}`}
          >
            {isAssistant && (
              <img src="/images/logo_sekolah.png" alt="Avatar AI" width="32" height="32" className={styles.aiMessageAvatar} />
            )}
            <div className={styles.aiMessageContent}>
              {/* Equalizer animation for speaking assistant bubble */}
              {isAssistant && index > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                  <button
                    onClick={() => onSpeakToggle(msg.content, index)}
                    title={isSpeaking ? "Hentikan Suara" : "Dengarkan Suara"}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.6,
                      color: 'inherit'
                    }}
                  >
                    {isSpeaking ? (
                      <div className={styles.aiVoiceEqualizer}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    )}
                  </button>
                </div>
              )}
              {renderMessageContent(msg.content)}
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className={`${styles.aiMessageBubble} ${styles.assistant}`}>
          <img src="/images/logo_sekolah.png" alt="Avatar AI" width="32" height="32" className={styles.aiMessageAvatar} />
          <div className={styles.aiMessageContent} style={{ padding: 0 }}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}
