'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✨ Halo! Saya **aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫\n\nAda yang bisa saya bantu hari ini mengenai pendaftaran siswa baru (PPDB), profil sekolah, alamat, atau informasi guru dan prestasi kami? 😊'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Fokuskan input saat jendela chat dibuka
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (showBadge) {
      setShowBadge(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue('');
    }

    // 1. Tambahkan pesan pengguna ke chat
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 2. Kirim ke API Route /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '⚠️ Maaf, terjadi sedikit kendala koneksi ke server asisten. Silakan coba kirim ulang pertanyaan Anda atau hubungi panitia PPDB langsung melalui WhatsApp di pojok kanan bawah ya! 😊' 
        }]);
      }
    } catch (err) {
      console.error("Gagal mengirim pesan chat:", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Waduh, jaringan sepertinya terputus. Silakan periksa kembali koneksi internet Anda dan coba lagi ya! 😊' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // List saran pertanyaan cepat (Quick Prompts)
  const quickPrompts = [
    { label: '🎒 Cara Daftar PPDB?', query: 'Bagaimana cara mendaftar PPDB online maupun offline di SDN Bobong?' },
    { label: '📞 Kontak Panitia?', query: 'Siapa kontak resmi panitia PPDB yang bisa dihubungi di WhatsApp?' },
    { label: '📍 Alamat Sekolah?', query: 'Di mana alamat lengkap dan lokasi peta SD Negeri Bobong?' },
    { label: '💰 Biaya Pendaftaran?', query: 'Berapa biaya pendaftaran masuk ke sekolah SD Negeri Bobong?' }
  ];

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
    <div className="aim-ai-container no-print">
      
      {/* 1. Tombol Aktivasi Melayang (Floating AI Button) */}
      <button 
        className={`aim-ai-trigger ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Tanya Asisten aim AI"
      >
        {isOpen ? (
          // Icon Silang (Tutup)
          <svg className="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Icon AI Robot/Chat Sparkle
          <svg className="ai-icon animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-10 10c0 1.95.44 3.79 1.23 5.43L2 22l4.75-1.2A10 10 0 0 0 22 12 10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
            <path d="M16 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" opacity="0.3"/>
          </svg>
        )}

        {/* Lencana Notifikasi Penarik Minat */}
        {showBadge && !isOpen && (
          <span className="ai-badge-dot">
            <span className="ai-badge-pulse"></span>
          </span>
        )}
      </button>

      {/* 2. Jendela Chat Virtual (Chat Window) */}
      <div className={`aim-ai-window ${isOpen ? 'open' : ''}`}>
        
        {/* Header Jendela Chat */}
        <div className="ai-header">
          <div className="ai-header-profile">
            <div className="ai-avatar-container">
              <img src="/images/logo_sekolah.png" alt="Logo aim AI" className="ai-avatar" />
              <span className="ai-online-indicator"></span>
            </div>
            <div className="ai-title-details">
              <h4>aim AI</h4>
              <span className="ai-subtitle">Asisten Virtual Sekolah</span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={toggleChat} title="Tutup Chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Area Percakapan */}
        <div className="ai-messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message-bubble ${msg.role}`}>
              {msg.role === 'assistant' && (
                <img src="/images/logo_sekolah.png" alt="Avatar" className="ai-message-avatar" />
              )}
              <div className="ai-message-content">
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}

          {/* Animasi Indikator AI Mengetik */}
          {isTyping && (
            <div className="ai-message-bubble assistant typing">
              <img src="/images/logo_sekolah.png" alt="Avatar" className="ai-message-avatar animate-bounce" />
              <div className="ai-message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Saran Pertanyaan Cepat (Quick Prompts) */}
        <div className="ai-quick-prompts">
          {quickPrompts.map((prompt, idx) => (
            <button 
              key={idx} 
              className="ai-prompt-btn"
              onClick={() => handleSendMessage(prompt.query)}
              disabled={isTyping}
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Form Input Teks */}
        <div className="ai-input-form">
          <input
            ref={inputRef}
            type="text"
            className="ai-chat-input"
            placeholder="Tanyakan sesuatu tentang sekolah..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button 
            className="ai-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Kirim Pesan"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
}
