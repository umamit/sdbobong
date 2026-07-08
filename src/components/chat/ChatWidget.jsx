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
      content: '✨ Halo! Saya **Aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫\n\nAda yang bisa saya bantu hari ini mengenai pendaftaran siswa baru (PPDB), profil sekolah, alamat, atau informasi guru dan prestasi kami? 😊'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [activeSpeakingIndex, setActiveSpeakingIndex] = useState(null);

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
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (!nextOpen) {
      stopSpeaking(setActiveSpeakingIndex);
      if (isRecording) {
        stopRecording();
      }
    }
    if (showBadge) {
      setShowBadge(false);
    }
  };

  const handleSpeakToggle = (text, index) => {
    if (activeSpeakingIndex === index) {
      stopSpeaking(setActiveSpeakingIndex);
    } else {
      speakText(text, index, setActiveSpeakingIndex);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;
    if (!textToSend) setInputValue('');
    stopSpeaking(setActiveSpeakingIndex);
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const result = await sendChatMessage(messages, userMessage);
    if (result.ok && result.reply) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
    } else {
      const isTimeout = result.error === 'timeout';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: isTimeout 
          ? '⏱️ Asisten membutuhkan waktu terlalu lama untuk merespons. Silakan coba lagi dalam beberapa saat ya! 😊'
          : '⚠️ Maaf, terjadi kendala koneksi ke server asisten. Silakan periksa kembali koneksi internet Anda atau hubungi panitia PPDB langsung di WhatsApp! 😊' 
      }]);
    }
    setIsTyping(false);
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
