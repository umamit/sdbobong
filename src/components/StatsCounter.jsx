'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCounter - Apple HIG animated number counter
 * Triggers count-up animation when element enters viewport
 * @param {number|string} target - Final value to count up to
 * @param {string} suffix - Optional suffix (e.g. "+", "%", "th")
 * @param {number} duration - Animation duration in ms (default 2500)
 */
export function AnimatedCounter({ target, suffix = '', duration = 2500 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    // Non-numeric targets (e.g. "B" for akreditasi) — show directly
    if (typeof target !== 'number') {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Cubic ease-out

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return (
    <span ref={ref} className="stat-counter-animated" aria-label={`${target}${suffix}`}>
      {count}{suffix}
    </span>
  );
}

/**
 * StatsCounter - Apple HIG Glassmorphism Bento Grid Statistics Component
 * Shows animated counters for key school metrics with specular shine & ambient glow.
 */
export default function StatsCounter({ stats = {} }) {
  const metrics = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      value: stats.siswa_aktif ?? 205,
      suffix: '',
      label: 'Siswa Aktif',
      color: '#12A5B8',
      bgGlow: 'rgba(18, 165, 184, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(18, 165, 184, 0.4), rgba(18, 165, 184, 0.12))',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
      ),
      value: stats.guru_staf ?? 14,
      suffix: '',
      label: 'Guru & Staf',
      color: '#FFC83B',
      bgGlow: 'rgba(255, 200, 59, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(255, 200, 59, 0.4), rgba(255, 200, 59, 0.12))',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      ),
      value: stats.ruang_kelas ?? 9,
      suffix: '',
      label: 'Ruang Kelas',
      color: '#4CD964',
      bgGlow: 'rgba(76, 217, 100, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(76, 217, 100, 0.4), rgba(76, 217, 100, 0.12))',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      ),
      value: stats.akreditasi ?? 'B',
      suffix: '',
      label: 'Akreditasi',
      color: '#4CD964',
      bgGlow: 'rgba(76, 217, 100, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(76, 217, 100, 0.4), rgba(76, 217, 100, 0.12))',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className="stats-counter-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {metrics.map((m) => (
        <motion.div
          key={m.label}
          className="stats-counter-card"
          variants={cardVariants}
          style={{
            '--card-accent': m.color,
            '--card-glow': m.bgGlow,
            '--icon-bg': m.gradient,
          }}
        >
          <div className="stats-counter-icon-wrap" aria-hidden="true">
            {m.icon}
          </div>
          <div className="stats-counter-value">
            <AnimatedCounter target={m.value} suffix={m.suffix} />
          </div>
          <div className="stats-counter-label">{m.label}</div>
        </motion.div>
      ))}

      <style>{`
        .stats-counter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .stats-counter-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        .stats-counter-card {
          background: rgba(18, 165, 184, 0.04); /* Toska transparan tipis */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(18, 165, 184, 0.15);
          border-radius: var(--radius-xl, 18px);
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.35s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* Specular Shine Overlay on Hover */
        .stats-counter-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: left 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .stats-counter-card:hover::after {
          left: 170%;
        }

        .stats-counter-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25), 0 0 25px var(--card-glow);
        }

        .stats-counter-icon-wrap {
          width: 52px;
          height: 52px;
          background: var(--icon-bg);
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: var(--card-accent, #12A5B8);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 14px var(--card-glow);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stats-counter-card:hover .stats-counter-icon-wrap {
          transform: scale(1.1) rotate(4deg);
        }

        .stats-counter-icon-wrap svg {
          width: 26px;
          height: 26px;
        }

        .stats-counter-value {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: clamp(2.2rem, 5.5vw, 3rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        }

        .stats-counter-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
      `}</style>
    </motion.div>
  );
}
