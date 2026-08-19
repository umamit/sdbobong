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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
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
  const [cooldown, setCooldown] = useState(0);

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

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Hentikan suara jika asisten ditutup atau dilepaskan
  useEffect(() => {
    return () => {
      stopSpeaking(setActiveSpeakingIndex);
    };
  }, []);

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
    if (!messageText || isTyping || cooldown > 0) return;

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
    setCooldown(15); // Set a 15-second cooldown after responding
  };

  return (
    <div className={`${styles.aimAiContainer} no-print`}>
      <ChatToggle isOpen={isOpen} toggleChat={toggleChat} showBadge={showBadge} />
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
          disabled={isTyping || cooldown > 0} 
        />
        <ChatInput 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          isRecording={isRecording} 
          toggleRecording={() => toggleRecording(() => stopSpeaking(setActiveSpeakingIndex))} 
          onSend={handleSendMessage} 
          disabled={isTyping || cooldown > 0} 
          cooldown={cooldown}
          inputRef={inputRef} 
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
        />
        <div className={styles.aiFooterNote}>
          Jeda bertanya ideal: 15-20 detik agar performa AI maksimal.
        </div>
      </ChatWindow>
    </div>
  );
}
