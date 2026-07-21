'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCounter - Apple HIG animated number counter
 * Triggers count-up animation when element enters viewport
 * @param {number} target - Final value to count up to
 * @param {string} suffix - Optional suffix (e.g. "+", "%", "th")
 * @param {number} duration - Animation duration in ms (default 1800)
 */
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    // Non-numeric targets (e.g. "B" for akreditasi) — just show as-is
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
 * StatsCounter - Apple-style animated school statistics section
 * Shows animated counters for key school metrics.
 * Usage: <StatsCounter stats={statsObject} />
 * where statsObject comes from config.stats (loaded server-side on page.js)
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
      delay: 0,
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
      color: '#E5A900',
      delay: 100,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      ),
      value: stats.ruang_kelas ?? 9,
      suffix: '',
      label: 'Ruang Kelas',
      color: '#2A9D5C',
      delay: 200,
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
      color: '#FF9F0A',
      delay: 300,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
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
          whileHover={{ y: -6, scale: 1.02 }}
          style={{ '--card-accent': m.color }}
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
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .stats-counter-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stats-counter-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }
        .stats-counter-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--card-accent, #12A5B8);
          border-radius: 3px 3px 0 0;
          opacity: 0.8;
        }
        .stats-counter-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
        }

        .stats-counter-icon-wrap {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: var(--card-accent, #12A5B8);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .stats-counter-icon-wrap svg {
          width: 22px;
          height: 22px;
        }

        .stats-counter-value {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .stats-counter-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
      `}</style>
    </motion.div>
  );
}
