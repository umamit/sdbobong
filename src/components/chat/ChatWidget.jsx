'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';
import { speakText, stopSpeaking, sendChatMessage, QUICK_PROMPTS } from './chatHelper';
import useSpeechRecognition from './useSpeechRecognition';

import ChatToggle from './ChatToggle';
import ChatWindow from './ChatWindow';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import QuickPrompts from './QuickPrompts';
import ChatInput from './ChatInput';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Selamat pagi! Ada yang bisa Aim bantu hari ini?';
  if (h >= 12 && h < 15) return 'Selamat siang! Ada yang ingin kamu tanyakan?';
  if (h >= 15 && h < 18) return 'Selamat sore! Ada info sekolah yang ingin kamu cari?';
  return 'Selamat malam! Ada yang bisa Aim bantu?';
}

export default function ChatWidget({ greetingEnabled = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya **Aim AI**, Asisten Virtual resmi SD Negeri Bobong.\n\nAda yang bisa saya bantu hari ini mengenai pendaftaran siswa baru (PPDB), profil sekolah, alamat, atau informasi guru dan prestasi kami?'
    }
  ]);
  const [streamingContent, setStreamingContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [activeSpeakingIndex, setActiveSpeakingIndex] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Pulihkan riwayat obrolan dari sessionStorage jika tersedia (Aman SSR)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('aim_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Simpan riwayat obrolan ke sessionStorage setiap kali ada pesan baru
  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem('aim_ai_chat_history', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

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
      stopSpeaking(setActiveSpeakingIndex);
    };
  }, []);

  // Tampilkan gelembung sapaan setelah 3 detik (hanya jika greetingEnabled & badge masih muncul)
  useEffect(() => {
    if (!greetingEnabled || !showBadge) return;
    const t = setTimeout(() => setShowGreeting(true), 3000);
    return () => clearTimeout(t);
  }, [greetingEnabled, showBadge]);

  // Auto-sembunyikan gelembung sapaan setelah 8 detik
  useEffect(() => {
    if (!showGreeting) return;
    const t = setTimeout(() => setShowGreeting(false), 8000);
    return () => clearTimeout(t);
  }, [showGreeting]);

  // Memutar suara otomatis jika sound diaktifkan
  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && isSoundEnabled) {
        speakText(lastMsg.content, messages.length - 1, setActiveSpeakingIndex);
      }
    }
  }, [messages, isSoundEnabled]);

  // STT Custom Hook
  const { isRecording, stopRecording, toggleRecording } = useSpeechRecognition({
    onResult: (transcript) => {
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
    },
    onRecordingChange: (recording) => {
      if (recording) {
        stopSpeaking(setActiveSpeakingIndex);
      }
    }
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (showBadge) setShowBadge(false);
  };

  const handleSpeakToggle = (text, index) => {
    if (activeSpeakingIndex === index) {
      stopSpeaking(setActiveSpeakingIndex);
    } else {
      speakText(text, index, setActiveSpeakingIndex);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage = { role: 'user', content: messageText };
    const historySnapshot = messages;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Tambahkan placeholder pesan asisten untuk streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    setStreamingContent('');

    const result = await sendChatMessage(historySnapshot, userMessage, {
      onChunk: (chunk, fullText) => {
        setStreamingContent(fullText);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
      }
    });

    if (!result.ok) {
      const isTimeout = result.error === 'timeout';
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: isTimeout
            ? 'Asisten membutuhkan waktu terlalu lama untuk merespons. Silakan coba lagi dalam beberapa saat.'
            : 'Maaf, terjadi kendala koneksi ke server asisten. Silakan periksa kembali koneksi internet Anda atau hubungi panitia PPDB langsung di WhatsApp.'
        };
        return updated;
      });
    }

    setStreamingContent('');
    setIsTyping(false);
  };

  return (
    <div className={`${styles.aimAiContainer} no-print`}>
      <ChatToggle
        isOpen={isOpen}
        toggleChat={toggleChat}
        showBadge={showBadge}
        showGreeting={showGreeting && !isOpen}
        greetingText={getGreeting()}
        onGreetingClick={() => { setShowGreeting(false); toggleChat(); }}
      />
      <ChatWindow isOpen={isOpen}>
        <ChatHeader 
          isSoundEnabled={isSoundEnabled} 
          toggleSound={() => {
            const nextVal = !isSoundEnabled;
            setIsSoundEnabled(nextVal);
            if (!nextVal) stopSpeaking(setActiveSpeakingIndex);
          }} 
          toggleChat={toggleChat} 
        />
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          activeSpeakingIndex={activeSpeakingIndex} 
          onSpeakToggle={handleSpeakToggle} 
          chatEndRef={chatEndRef} 
        />
        <QuickPrompts 
          quickPrompts={QUICK_PROMPTS} 
          onPromptClick={handleSendMessage} 
          disabled={isTyping} 
        />
        <ChatInput 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          isRecording={isRecording} 
          toggleRecording={() => toggleRecording(() => stopSpeaking(setActiveSpeakingIndex))} 
          onSend={handleSendMessage} 
          disabled={isTyping} 
          inputRef={inputRef} 
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
        />
      </ChatWindow>
    </div>
  );
}
