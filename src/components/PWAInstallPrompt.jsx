'use client';

import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Defensively check browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    // 2. Check if already running in standalone mode (installed app)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator).standalone === true;

    if (isStandalone) {
      return;
    }

    // 3. Check if user dismissed prompt recently (within 7 days)
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed_time');
    if (dismissedTime) {
      const diffDays = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (diffDays < 7) {
        return;
      }
    }

    // 4. Detect mobile/smartphone screen size
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // 5. Detect iOS platform
    const iosDetect = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window).MSStream;
    setIsIos(iosDetect);

    // 6. Listen for beforeinstallprompt event (for Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install banner
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 7. For iOS, we can show a prompt after a short delay since it doesn't support beforeinstallprompt
    if (iosDetect) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    // Trigger standard install prompt
    deferredPrompt.prompt();

    // Wait for the user response
    const { outcome } = await deferredPrompt.userChoice;

    // We no longer need the prompt, clear it
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    // Keep dismissed state in localstorage for 7 days
    localStorage.setItem('pwa_prompt_dismissed_time', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating Bottom Install Prompt */}
      <div 
        className="pwa-prompt-container no-print" 
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          boxShadow: '0 15px 35px -5px rgba(11, 60, 93, 0.25), 0 8px 15px -8px rgba(11, 60, 93, 0.15)',
          border: '1px solid rgba(11, 60, 93, 0.08)',
          borderLeft: '6px solid var(--formal-blue, #0B3C5D)',
          padding: '16px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Logo / App Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <img 
              src="/images/logo_sekolah.png" 
              alt="App Icon" 
              style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
            />
          </div>

          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h4 style={{
              margin: '0 0 3px 0',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-heading, Outfit, sans-serif)',
              letterSpacing: '0.3px'
            }}>
              Pasang Aplikasi SDN Bobong
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.78rem',
              lineHeight: 1.4,
              color: '#475569',
              fontWeight: 500
            }}>
              Akses informasi sekolah & portal PPDB lebih cepat, hemat kuota, langsung dari layar HP Anda!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button 
            onClick={handleDismiss}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#64748b',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Nanti Saja
          </button>
          <button 
            onClick={handleInstallClick}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'var(--formal-blue, #0B3C5D)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(11, 60, 93, 0.2)',
              transition: 'transform 0.2s, background-color 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isIos ? 'Cara Pasang' : 'Pasang Sekarang'}
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal Guide */}
      {showIosGuide && (
        <div 
          className="no-print"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowIosGuide(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <img 
              src="/images/logo_sekolah.png" 
              alt="Logo" 
              style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '12px' }} 
            />

            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#0f172a'
            }}>
              Pasang di iPhone / iPad
            </h3>

            <p style={{
              margin: '0 0 20px 0',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              color: '#475569'
            }}>
              Ikuti petunjuk praktis di bawah untuk menambahkan ikon website ini di Layar Utama Apple Anda:
            </p>

            <div style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: 'var(--formal-blue, #0B3C5D)',
                  flexShrink: 0
                }}>
                  1
                </div>
                <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                  Tekan ikon <strong>Bagikan (Share)</strong> 📤 di bilah navigasi Safari.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: 'var(--formal-blue, #0B3C5D)',
                  flexShrink: 0
                }}>
                  2
                </div>
                <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                  Gulir ke bawah dan ketuk opsi <strong>Tambahkan ke Layar Utama</strong> ➕.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: 'var(--formal-blue, #0B3C5D)',
                  flexShrink: 0
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                  Ketuk tombol <strong>Tambah</strong> di sudut kanan atas untuk menyelesaikan.
                </span>
              </div>
            </div>

            <button 
              onClick={handleDismiss}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--formal-blue, #0B3C5D)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
