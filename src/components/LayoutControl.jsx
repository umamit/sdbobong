'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutControl() {
  const pathname = usePathname();

  useEffect(() => {
    // 0. Maintenance Mode Bypass Guard for Public Pages
    const isPublic = pathname && !pathname.startsWith('/admin') && !pathname.startsWith('/api');
    if (isPublic) {
      const getCookie = (name) => {
        if (typeof document === 'undefined') return '';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
      };

      const checkMaintenance = async () => {
        const isMaintenanceCookie = getCookie('maintenance_mode') === 'true';
        if (isMaintenanceCookie) {
          window.location.reload();
          return;
        }

        // Fallback check from public GET endpoint (no-store to bypass browser cache)
        try {
          const res = await fetch(`/api/config?t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.maintenance_mode) {
              document.cookie = "maintenance_mode=true; path=/; max-age=31536000; SameSite=Lax";
              window.location.reload();
            }
          }
        } catch (e) {
          console.error("Gagal memeriksa status pemeliharaan:", e);
        }
      };

      checkMaintenance();
    }

    // 1. Admin & Guru & Bypass Class Control
    const bypassPaths = ['/formulir-ppdb', '/ppdb-online/sukses', '/nilai'];
    const isBypass = pathname && bypassPaths.includes(pathname);
    
    if (isBypass) {
      document.documentElement.classList.add('allow-select');
      // IMPORTANT: bypass paths must NOT get is-admin class
      // is-admin triggers overflow: hidden on body (admin.css), causing blank PDF prints
      document.documentElement.classList.remove('is-admin');
    } else {
      document.documentElement.classList.remove('allow-select');
    }

    const isAdminOrGuru = pathname?.startsWith('/admin') || pathname?.startsWith('/guru');
    if (isAdminOrGuru) {
      document.documentElement.classList.add('is-admin');
      return;
    } else if (!isBypass) {
      document.documentElement.classList.remove('is-admin');
    }

    // 2. Premium Scroll Reveal Setup
    if (typeof window === 'undefined') return;

    // Register Service Worker for PWA (Offline capability)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    }

    // Check if browser supports IntersectionObserver
    const hasObserver = 'IntersectionObserver' in window;

    // Helper to make elements visible
    const revealElement = (el) => {
      el.classList.add('in-view');
    };

    if (!hasObserver) {
      // Fallback if IntersectionObserver is not supported: reveal everything instantly
      document.querySelectorAll('.reveal-on-scroll').forEach(revealElement);
      return;
    }

    // Set up a clean IntersectionObserver with high compatibility settings
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          intersectionObserver.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, {
      root: null, // use viewport
      rootMargin: '0px 0px -20px 0px', // trigger slightly before coming fully into view
      threshold: 0.02 // trigger when at least 2% of the element is visible
    });

    // Function to find and observe elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        // If it already has in-view, ignore
        if (el.classList.contains('in-view')) return;

        // Observe
        intersectionObserver.observe(el);
      });
    };

    // 1. Observe initially
    observeElements();

    // 2. Observe again at intervals to catch late-rendering or dynamic content
    const intervalId = setInterval(observeElements, 250);

    // 3. MutationObserver to instantly watch for dynamically loaded DOM elements
    let mutationObserver = null;
    if ('MutationObserver' in window) {
      mutationObserver = new MutationObserver(() => {
        observeElements();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // 4. Absolute Fail-safe: Reveal everything if still hidden after 1.2 seconds
    // This is the bulletproof "anti-blank" safety net
    const fallbackId = setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        if (!el.classList.contains('in-view')) {
          revealElement(el);
          intersectionObserver.unobserve(el);
        }
      });
    }, 1200);

    return () => {
      clearInterval(intervalId);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      intersectionObserver.disconnect();
      clearTimeout(fallbackId);
    };
  }, [pathname]);

  return null;
}
