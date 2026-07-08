'use client';

import styles from './ChatWidget.module.css';

export default function ChatInput({ 
  inputValue, 
  setInputValue, 
  isRecording, 
  toggleRecording, 
  onSend, 
  disabled, 
  inputRef,
  onKeyDown 
}) {
  return (
    <div className={styles.aiInputForm}>
      {/* Voice microphone (STT) */}
      <button 
        className={`${styles.aiSendBtn} ${styles.aiMicBtn} ${isRecording ? styles.recording : ''}`}
        onClick={toggleRecording}
        title={isRecording ? "Hentikan Perekaman" : "Input Lewat Suara"}
        style={{
          backgroundColor: isRecording ? '#EF4444' : 'var(--primary-color)',
        }}
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path>
        </svg>
        {isRecording && <span className={styles.aiMicPulse}></span>}
      </button>

      {/* Chat Input Field */}
      <input
        ref={inputRef}
        type="text"
        className={styles.aiChatInput}
        placeholder={isRecording ? "Sedang mendengarkan suara Anda..." : "Tulis pertanyaan Anda..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled || isRecording}
      />

      {/* Send Button */}
      <button 
        className={styles.aiSendBtn}
        onClick={() => onSend()}
        disabled={disabled || !inputValue.trim() || isRecording}
        aria-label="Kirim Pesan"
        type="button"
      >
        <svg viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
}
