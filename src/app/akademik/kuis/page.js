'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KuisEdukasi() {
  const [gameState, setGameState] = useState('select_category'); // 'select_category' | 'loading' | 'quiz' | 'result'
  const [category, setCategory] = useState('umum');
  const [questions, setQuestions] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('quiz_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const playBeep = (freq) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const startQuiz = async (cat) => {
    setCategory(cat);
    setGameState('loading');
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat })
      });
      const data = await res.json();
      setQuestions(data.questions || []);
      setCurrIdx(0);
      setScore(0);
      setSelectedAns(null);
      setShowExplanation(false);
      setGameState('quiz');
    } catch (err) {
      setGameState('select_category');
    }
  };

  const handleAnswer = (idx) => {
    if (selectedAns !== null) return;
    setSelectedAns(idx);
    const correct = questions[currIdx].a === idx;
    if (correct) {
      setScore(s => s + 20);
      playBeep(880); // Chime
    } else {
      playBeep(220); // Buzz
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currIdx + 1 < questions.length) {
      setCurrIdx(c => c + 1);
      setSelectedAns(null);
      setShowExplanation(false);
    } else {
      const finalScore = score + (questions[currIdx].a === selectedAns ? 20 : 0);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('quiz_high_score', String(finalScore));
      }
      setGameState('result');
      // Confetti trigger
      import('canvas-confetti').then((c) => {
        c.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }).catch(() => {});
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '1.5rem', background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
      {gameState === 'select_category' && (
        <div>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>Cerdas Cermat SDN Bobong</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Pilih Kategori untuk Belajar Sambil Bermain!</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '1rem' }} onClick={() => startQuiz('umum')}>Pengetahuan Umum</button>
            <button className="btn" style={{ background: 'var(--secondary-dark)', color: 'white', padding: '1rem' }} onClick={() => startQuiz('matematika')}>Matematika Dasar</button>
          </div>
          {highScore > 0 && <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--accent-dark)', fontWeight: 700 }}>🏆 Skor Tertinggi: {highScore}</p>}
        </div>
      )}

      {gameState === 'loading' && (
        <div style={{ padding: '2rem 0' }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Mengumpulkan Soal AI untukmu...</p>
        </div>
      )}

      {gameState === 'quiz' && questions[currIdx] && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <span>Soal {currIdx + 1} dari {questions.length}</span>
            <span>Skor: {score}</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem' }}>{questions[currIdx].q}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {questions[currIdx].o.map((opt, i) => {
              let bg = '#f8fafc';
              let border = '1px solid #e2e8f0';
              if (selectedAns !== null) {
                if (i === questions[currIdx].a) { bg = '#d1fae5'; border = '1px solid #10b981'; }
                else if (i === selectedAns) { bg = '#fee2e2'; border = '1px solid #ef4444'; }
              }
              return (
                <button key={i} className="btn" style={{ background: bg, border, color: '#334155', padding: '0.85rem 1rem', width: '100%', justifyContent: 'flex-start', fontSize: '0.9rem', textAlign: 'left' }} onClick={() => handleAnswer(i)} disabled={selectedAns !== null}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', fontSize: '0.8rem', color: '#1e3a8a' }}>
              💡 <strong>Penjelasan AI:</strong> {questions[currIdx].hint}
              <button className="btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', marginTop: '1rem' }} onClick={handleNext}>
                {currIdx + 1 === questions.length ? 'Lihat Hasil Akhir' : 'Lanjut'}
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'result' && (
        <div>
          <h2 style={{ color: 'var(--accent)', fontWeight: 800 }}>Kuis Selesai! 🎉</h2>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '1rem 0' }}>Skor Akhir: {score} / 100</p>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{score >= 80 ? '⭐⭐⭐' : score >= 60 ? '⭐⭐' : '⭐'}</div>
          <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', width: '100%' }} onClick={() => setGameState('select_category')}>Main Lagi</button>
        </div>
      )}
    </div>
  );
}
