'use client';

import { useEffect, useState } from 'react';

/**
 * LargeTitleHeader - iOS Collapsible Large Title Component
 * Shows a large bold title that scales smoothly on scroll
 * @param {string} badge - Category/Section badge text
 * @param {string} title - Primary Large Title
 * @param {string} subtitle - Description subtitle text
 * @param {React.ReactNode} action - Optional action button/element
 */
export default function LargeTitleHeader({
  badge,
  title = '',
  subtitle = '',
  action = null,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`ios-large-title-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ios-large-title-inner">
        {badge && (
          <div className="ios-title-badge">
            <span>{badge}</span>
          </div>
        )}
        <h1 className="ios-large-title">{title}</h1>
        {subtitle && <p className="ios-large-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="ios-title-action">{action}</div>}

      <style>{`
        .ios-large-title-wrap {
          padding: 2.5rem 0 1.5rem 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ios-large-title-wrap.is-scrolled {
          transform: scale(0.97) translateY(-6px);
          opacity: 0.88;
        }

        .ios-large-title-inner {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-width: 720px;
        }

        .ios-title-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(18, 165, 184, 0.15);
          border: 1px solid rgba(18, 165, 184, 0.3);
          color: #12A5B8;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          width: fit-content;
        }

        .ios-large-title {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-color, #ffffff);
          line-height: 1.1;
          margin: 0;
        }

        .ios-large-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          font-weight: 400;
          color: var(--text-muted, rgba(255, 255, 255, 0.75));
          line-height: 1.5;
          margin: 0;
        }

        .ios-title-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}
