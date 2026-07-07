'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✨ Halo! Saya **Aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫\n\nAda yang bisa saya bantu hari ini mengenai pendaftaran siswa baru (PPDB), profil sekolah, alamat, atau informasi guru dan prestasi kami? 😊'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice States
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSpeakingIndex, setActiveSpeakingIndex] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

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

  // Hentikan suara jika asisten ditutup atau dilepaskan
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Memutar suara otomatis jika sound diaktifkan
  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && isSoundEnabled) {
        speakText(lastMsg.content, messages.length - 1);
      }
    }
  }, [messages]);

  const toggleChat = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (!nextOpen) {
      stopSpeaking();
      if (isRecording) {
        stopRecording();
      }
    }
    if (showBadge) {
      setShowBadge(false);
    }
  };

  // Helper TTS: Menghentikan Pembacaan Suara
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeakingIndex(null);
  };

  // Helper TTS: Membersihkan markdown & ekspansi singkatan agar pengucapan terdengar natural
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    let text = rawText;

    // 1. Bersihkan formatting markdown
    text = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // bersihkan bold
      .replace(/\*(.*?)\*/g, '$1')     // bersihkan italic
      .replace(/__(.*?)__/g, '$1')     // bersihkan underline
      .replace(/_(.*?)_/g, '$1')       // bersihkan italic-2
      .replace(/`([^`]+)`/g, '$1');    // bersihkan inline code

    // 2. Ekspansi singkatan akademis, gelar, mata uang, & istilah administratif agar fasih
    const expansions = [
      { pattern: /\bS\.?Pd\b\.?/gi, replacement: 'Sarjana Pendidikan' },
      { pattern: /\bM\.?Pd\b\.?/gi, replacement: 'Magister Pendidikan' },
      { pattern: /\bS\.?Kom\b\.?/gi, replacement: 'Sarjana Computer' },
      { pattern: /\bS\.?T\b\.?/gi, replacement: 'Sarjana Teknik' },
      { pattern: /\bS\.?E\b\.?/gi, replacement: 'Sarjana Ekonomi' },
      { pattern: /\bS\.?Sos\b\.?/gi, replacement: 'Sarjana Ilmu Sosial' },
      { pattern: /\bH\b\.?\s+(?=[A-Z])/g, replacement: 'Haji ' },
      { pattern: /\bHj\b\.?\s+(?=[A-Z])/gi, replacement: 'Hajah ' },
      { pattern: /\bPPDB\b/gi, replacement: 'P P D B' }, // Dieja per huruf agar tidak dibaca 'pepedeb'
      { pattern: /\bSDN\b/gi, replacement: 'S D N' },     // Dieja per huruf
      { pattern: /\bSD\b/gi, replacement: 'S D' },       // Dieja per huruf
      { pattern: /\bAI\b/gi, replacement: 'A I' },       // Dieja per huruf
      { pattern: /\bSMP\b/gi, replacement: 'S M P' },
      { pattern: /\bSMA\b/gi, replacement: 'S M A' },
      { pattern: /\bSMK\b/gi, replacement: 'S M K' },
      { pattern: /\bPTN\b/gi, replacement: 'P T N' },
      { pattern: /\bPTS\b/gi, replacement: 'P T S' },
      { pattern: /\bKec\b\.?/gi, replacement: 'Kecamatan' },
      { pattern: /\bKab\b\.?/gi, replacement: 'Kabupaten' },
      { pattern: /\bProv\b\.?/gi, replacement: 'Provinsi' },
      { pattern: /\bJl\b\.?/gi, replacement: 'Jalan' },
      { pattern: /\bNo\b\.?/gi, replacement: 'Nomor' },
      { pattern: /\bWA\b/gi, replacement: 'WhatsApp' },
      { pattern: /\bTelp\b\.?/gi, replacement: 'Telepon' },
      { pattern: /\bHp\b\.?/gi, replacement: 'Handphone' },
      { pattern: /\bRp\.?\s*(\d+)/gi, replacement: '$1 Rupiah' }, 
      { pattern: /\bWIB\b/gi, replacement: 'Waktu Indonesia Barat' },
      { pattern: /\bWITA\b/gi, replacement: 'Waktu Indonesia Tengah' },
      { pattern: /\bWIT\b/gi, replacement: 'Waktu Indonesia Timur' },
      { pattern: /\bTh\.?/gi, replacement: 'Tahun' },
      { pattern: /\bTgl\.?/gi, replacement: 'Tanggal' },
      { pattern: /\bKls\b\.?/gi, replacement: 'Kelas' },
      { pattern: /\bKurmer\b/gi, replacement: 'Kurikulum Merdeka' },
    ];

    expansions.forEach(({ pattern, replacement }) => {
      text = text.replace(pattern, replacement);
    });

    // 3. Hapus titik pemisah ribuan pada nominal angka agar dibaca utuh (misal: "50.000" -> "50000" dibaca lima puluh ribu)
    text = text.replace(/(\d+)\.(\d{3})/g, '$1$2');
    text = text.replace(/(\d+)\.(\d{3})/g, '$1$2');

    // 4. Konversi emotikon & emoji spesifik menjadi kata-kata pendukung yang relevan
    text = text
      .replace(/✨/g, '')
      .replace(/🏫/g, ' di sekolah ')
      .replace(/🎒/g, ' tas sekolah ')
      .replace(/📞/g, ' hubungi telepon ')
      .replace(/📍/g, ' berlokasi di ')
      .replace(/💰/g, ' biaya ')
      .replace(/😊|👍|👋|🤖|📝|📅|✉️|📧|💬|ℹ️/g, ' ') // hapus emoji umum dengan spasi penengah
      .replace(/⚠️/g, ' Peringatan! ')
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, ''); // hapus emoji sisa lainnya

    // 5. Bersihkan spasi ganda berlebih hasil pembersihan regex
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  };

  // Helper TTS: Melisankan Balasan Asisten dengan Kalibrasi Suara Premium & Jeda Nafas Alami
  const speakText = (text, index) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Hentikan suara yang sedang aktif
    stopSpeaking();
    setActiveSpeakingIndex(index);

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      setActiveSpeakingIndex(null);
      return;
    }

    // Pemilihan suara premium berbasis peringkat skor (Edge Neural -> Apple Siri/Damayanti -> Google -> Microsoft Desktop -> Fallback)
    let bestVoice = null;
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      const idVoices = voices.filter(v => 
        v.lang.startsWith('id') || 
        v.lang.includes('ID') || 
        v.lang.toLowerCase().includes('indonesia')
      );

      if (idVoices.length > 0) {
        const voiceScores = idVoices.map(voice => {
          const name = voice.name.toLowerCase();
          let score = 0;
          
          if (name.includes('natural') || name.includes('neural')) {
            score += 100;
          }
          if (name.includes('damayanti') || name.includes('siri')) {
            score += 90;
          }
          if (name.includes('google')) {
            score += 80;
          }
          if (name.includes('microsoft') || name.includes('gadis') || name.includes('ardi')) {
            score += 70;
          }
          if (voice.localService) {
            score += 10;
          }
          return { voice, score };
        });

        voiceScores.sort((a, b) => b.score - a.score);
        bestVoice = voiceScores[0].voice;
        console.log('[Aim AI TTS] Menggunakan suara:', bestVoice.name, 'Skor kualitas:', voiceScores[0].score);
      }
    }

    // Memecah teks menjadi potongan kalimat logis berdasarkan tanda baca utama (. ! ? ; \n)
    const clauses = cleanedText
      .replace(/([.!?;\n])\s*/g, "$1|")
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (clauses.length === 0) {
      setActiveSpeakingIndex(null);
      return;
    }

    // Mengantrekan (queue) setiap potongan kalimat secara berurutan ke SpeechSynthesis
    clauses.forEach((clause, idx) => {
      const utterance = new SpeechSynthesisUtterance(clause);
      utterance.lang = 'id-ID';

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Kalibrasi akustik ultra-realistis
      utterance.rate = 0.92;   // Tempo santai, sopan, dan berwibawa
      utterance.pitch = 1.05;  // Frekuensi hangat, ramah, dan jernih
      utterance.volume = 1.0;  // Volume penuh

      // Sinkronisasi animasi equalizer visual:
      // Hanya matikan animasi jika kalimat paling terakhir di antrean telah selesai diucapkan
      if (idx === clauses.length - 1) {
        utterance.onend = () => {
          setActiveSpeakingIndex(null);
        };
        utterance.onerror = (e) => {
          console.error('[Aim AI TTS End Error]', e);
          setActiveSpeakingIndex(null);
        };
      } else {
        // Untuk kalimat non-terakhir, jika ada error krisis, pastikan state reset
        utterance.onerror = (e) => {
          console.error('[Aim AI TTS Mid Error]', e);
          stopSpeaking();
        };
      }

      window.speechSynthesis.speak(utterance);
    });
  };

  // Helper STT: Memulai Perekaman Suara (Speech-to-Text)
  const startRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('⚠️ Browser Anda tidak mendukung input suara (Speech Recognition). Silakan gunakan Google Chrome!');
      return;
    }

    stopSpeaking();

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event) => {
      console.error('[PWA Speech STT Error]', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue('');
    }

    // Hentikan suara yang sedang berbunyi sebelum merespon yang baru
    stopSpeaking();

    // 1. Tambahkan pesan pengguna ke chat
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 2. Kirim ke API Route /api/chat dengan timeout 30 detik
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

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
      const isTimeout = err.name === 'AbortError';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: isTimeout
          ? '⏱️ Asisten membutuhkan waktu terlalu lama untuk merespons. Silakan coba lagi dalam beberapa saat ya! 😊'
          : '⚠️ Waduh, jaringan sepertinya terputus. Silakan periksa kembali koneksi internet Anda dan coba lagi ya! 😊'
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
        aria-label="Tanya Asisten Aim AI"
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
              <img src="/images/logo_sekolah.png" alt="Logo Aim AI" className="ai-avatar" />
              <span className="ai-online-indicator"></span>
            </div>
            <div className="ai-title-details">
              <h4>Aim AI</h4>
              <span className="ai-subtitle">Asisten Virtual Sekolah</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Global TTS Sound Toggle */}
            <button 
              className={`ai-sound-btn ${isSoundEnabled ? 'active' : ''}`}
              onClick={() => {
                const newVal = !isSoundEnabled;
                setIsSoundEnabled(newVal);
                if (!newVal) stopSpeaking();
              }}
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
                marginRight: '8px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                opacity: isSoundEnabled ? 1 : 0.6,
                backgroundColor: isSoundEnabled ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
              }}
            >
              {isSoundEnabled ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              )}
            </button>
            <button className="ai-close-btn" onClick={toggleChat} title="Tutup Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Area Percakapan */}
        <div className="ai-messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message-bubble ${msg.role}`}>
              {msg.role === 'assistant' && (
                <img src="/images/logo_sekolah.png" alt="Avatar" className="ai-message-avatar" />
              )}
              <div className="ai-message-bubble-body" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="ai-message-content">
                  {renderMessageContent(msg.content)}
                </div>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className={`ai-bubble-speak-btn ${activeSpeakingIndex === index ? 'speaking' : ''}`}
                      onClick={() => {
                        if (activeSpeakingIndex === index) {
                          stopSpeaking();
                        } else {
                          speakText(msg.content, index);
                        }
                      }}
                      title={activeSpeakingIndex === index ? "Hentikan Suara" : "Dengarkan Jawaban"}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: activeSpeakingIndex === index ? 'var(--primary-color)' : '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px 0px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginTop: '4px',
                        alignSelf: 'flex-start',
                        transition: 'color 0.2s ease',
                        opacity: 0.8
                      }}
                    >
                      {activeSpeakingIndex === index ? (
                        <>
                          <span className="ai-voice-equalizer">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                          <span>Berhenti membaca</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px' }}>
                            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                          </svg>
                          <span>Dengarkan suara</span>
                        </>
                      )}
                    </button>
                    {activeSpeakingIndex === index && (
                      <div className="equalizer-container">
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                      </div>
                    )}
                  </div>
                )}
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
            placeholder={isRecording ? "Mendengarkan suara Anda..." : "Tanyakan sesuatu tentang sekolah..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          
          {/* Microphone button for STT */}
          <button
            type="button"
            className={`ai-mic-btn ${isRecording ? 'recording' : ''} mic-pulse-button ${isRecording ? 'listening' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? "Selesai Merekam" : "Bicara Bahasa Indonesia"}
            disabled={isTyping}
            style={{
              background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'none',
              border: 'none',
              color: isRecording ? '#ef4444' : '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              marginRight: '4px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {isRecording && <span className="ai-mic-pulse"></span>}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8"/>
            </svg>
          </button>

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
