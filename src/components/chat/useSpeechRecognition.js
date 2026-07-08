'use client';

import { useState, useRef } from 'react';

export default function useSpeechRecognition({ onResult, onRecordingChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = (stopSpeaking) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('⚠️ Browser Anda tidak mendukung input suara (Speech Recognition). Silakan gunakan Google Chrome!');
      return;
    }

    if (stopSpeaking) {
      stopSpeaking();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      if (onRecordingChange) onRecordingChange(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('[PWA Speech STT Error]', event.error);
      setIsRecording(false);
      if (onRecordingChange) onRecordingChange(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (onRecordingChange) onRecordingChange(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (onRecordingChange) onRecordingChange(false);
  };

  const toggleRecording = (stopSpeaking) => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(stopSpeaking);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording
  };
}
