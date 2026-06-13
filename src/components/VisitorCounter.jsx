'use client';

import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function updateAndFetchCount() {
      try {
        const res = await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.visitor_count !== undefined) {
            setCount(data.visitor_count);
          }
        }
      } catch (err) {
        console.error('Error updating visitor count:', err);
      } finally {
        setLoading(false);
      }
    }

    updateAndFetchCount();
  }, []);

  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0.6rem 1.2rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '1.2rem',
        transition: 'transform 0.3s ease, background 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
      className="visitor-counter-container"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      {/* Pulse indicator */}
      <span style={{
        display: 'block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#10B981', // Emerald green
        position: 'relative',
      }}>
        <span style={{
          display: 'block',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: '#10B981',
          position: 'absolute',
          top: 0,
          left: 0,
          animation: 'visitorPulse 2s infinite',
        }} />
      </span>

      {/* SVG Icon */}
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="var(--secondary, #328CC1)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>

      {/* Counter text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          color: '#9CA3AF', 
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Total Pengunjung
        </span>
        <span style={{ 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          color: '#FFFFFF',
          fontFamily: 'monospace',
          lineHeight: '1.2'
        }}>
          {loading ? (
            <span style={{ opacity: 0.5 }}>...</span>
          ) : count !== null ? (
            count.toLocaleString('id-ID')
          ) : (
            '--'
          )}
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes visitorPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
