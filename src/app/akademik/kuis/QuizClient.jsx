'use client';

import { useState, useEffect, useRef } from 'react';

const CATS = [
  { id: 'umum', label: 'Pengetahuan Umum', c: 'var(--primary)' },
  { id: 'matematika', label: 'Matematika', c: 'var(--secondary-dark)' },
  { id: 'ipa', label: 'IPA', c: 'var(--accent)' },
  { id: 'bahasa', label: 'Bahasa Indonesia', c: '#0A7E8D' },
  { id: 'sejarah', label: 'Sejarah & Budaya', c: '#B8860B' },
];
const TIMER = 15;

const StarIcon = ({ on }) => <svg viewBox="0 0 24 24" width="22" height="22" fill={on ? '#E5A900' : 'none'} stroke="#E5A900" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const TrophyIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M6 9a6 6 0 0 0 12 0M12 15v3m-4 3h8"/></svg>;
const LampIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M12 2a7 7 0 0 1 7 7c0 2.62-1.44 4.9-3.57 6.13L15 17H9l-.43-1.87A7 7 0 0 1 12 2z"/></svg>;

export default function QuizClient() {
  const [state, setState] = useState('select');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [explain, setExplain] = useState(false);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(TIMER);
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);

  useEffect(() => { const s = localStorage.getItem('quiz_hs'); if (s) setBest(+s); }, []);

  useEffect(() => {
    if (state !== 'quiz' || ans !== null) return;
    setTime(TIMER);
    const t = setInterval(() => setTime(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [idx, state, ans]);

  useEffect(() => {
    if (time === 0 && state === 'quiz' && ans === null) { setAns(-1); setExplain(true); }
  }, [time, state, ans]);

  const playBeep = (f) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; g.gain.setValueAtTime(0.1, ctx.currentTime);
      o.start(); o.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const startQuiz = async (catId) => {
    scoreRef.current = 0; setScore(0); setState('loading');
    try {
      const res = await fetch('/api/quiz/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: catId }) });
      const data = await res.json();
      setQuestions(data.questions || []); setIdx(0); setAns(null); setExplain(false); setState('quiz');
    } catch { setState('select'); }
  };

  const onAnswer = (i) => {
    if (ans !== null) return;
    setAns(i);
    if (questions[idx].a === i) { scoreRef.current += 20; setScore(scoreRef.current); playBeep(880); }
    else playBeep(220);
    setExplain(true);
  };

  const onNext = () => {
    if (idx + 1 < questions.length) { setIdx(i => i + 1); setAns(null); setExplain(false); }
    else {
      if (scoreRef.current > best) { setBest(scoreRef.current); localStorage.setItem('quiz_hs', scoreRef.current); }
      setState('result');
      import('canvas-confetti').then(c => c.default({ particleCount: 120, spread: 80, origin: { y: 0.6 } })).catch(() => {});
    }
  };

  const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
  const wrap = { maxWidth: '480px', margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', textAlign: 'center', fontFamily: 'var(--font-heading)' };

  return (
    <div style={wrap}>
      {state === 'select' && (
        <div>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>Cerdas Cermat SDN Bobong</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Pilih kategori untuk belajar sambil bermain!</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
            {CATS.map(cat => (
              <button key={cat.id} className="btn" style={{ background: cat.c, color: 'white', padding: '0.75rem 1rem', flex: '1 1 calc(50% - 0.65rem)', minWidth: '120px' }} onClick={() => startQuiz(cat.id)}>{cat.label}</button>
            ))}
          </div>
          {best > 0 && <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--accent-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}><TrophyIcon /> Skor Tertinggi: {best}</p>}
        </div>
      )}

      {state === 'loading' && <p style={{ padding: '2rem 0', fontWeight: 700, color: 'var(--primary)' }}>Mengumpulkan Soal AI untukmu...</p>}

      {state === 'quiz' && questions[idx] && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span>Soal {idx + 1}/{questions.length}</span>
            <span style={{ color: time <= 5 ? '#ef4444' : 'inherit', fontWeight: time <= 5 ? 700 : 400, transition: 'color 0.3s' }}>{time}s</span>
            <span>Skor: {score}</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem' }}>{questions[idx].q}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {questions[idx].o.map((opt, i) => {
              let bg = '#f8fafc', border = '1px solid #e2e8f0';
              if (ans !== null) {
                if (i === questions[idx].a) { bg = '#d1fae5'; border = '1px solid #10b981'; }
                else if (i === ans) { bg = '#fee2e2'; border = '1px solid #ef4444'; }
              }
              return <button key={i} className="btn" style={{ background: bg, border, color: '#334155', padding: '0.85rem 1rem', width: '100%', justifyContent: 'flex-start', fontSize: '0.9rem', textAlign: 'left' }} onClick={() => onAnswer(i)} disabled={ans !== null}>{opt}</button>;
            })}
          </div>
          {explain && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', fontSize: '0.8rem', color: '#1e3a8a' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, marginBottom: '0.3rem' }}><LampIcon /> Penjelasan AI:</p>
              {questions[idx].hint}
              <button className="btn" style={{ background: 'var(--primary)', color: 'white', width: '100%', marginTop: '0.75rem' }} onClick={onNext}>{idx + 1 === questions.length ? 'Lihat Hasil Akhir' : 'Lanjut'}</button>
            </div>
          )}
        </div>
      )}

      {state === 'result' && (
        <div>
          <h2 style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: '0.5rem' }}>Kuis Selesai!</h2>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0 1rem' }}>Skor Akhir: {score} / 100</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1.25rem' }}>{[1, 2, 3].map(n => <StarIcon key={n} on={n <= stars} />)}</div>
          <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', width: '100%' }} onClick={() => setState('select')}>Main Lagi</button>
        </div>
      )}
    </div>
  );
}
