'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutControl() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Admin Class Control
    const isAdmin = pathname?.startsWith('/admin');
    if (isAdmin) {
      document.documentElement.classList.add('is-admin');
      return;
    } else {
      document.documentElement.classList.remove('is-admin');
    }

    // 2. IntersectionObserver for Premium Scroll Reveal
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Timeout to ensure Next.js has completed rendering and mounting the new DOM nodes
    const timeoutId = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Premium: only animate once
          }
        });
      }, {
        root: null, // viewport
        rootMargin: '0px 0px -40px 0px', // trigger slightly before fully entered
        threshold: 0.10 // 10% visible
      });

      revealElements.forEach((el) => {
        // Reset state for clean transitions when switching routes
        el.classList.remove('in-view');
        
        const rect = el.getBoundingClientRect();
        const isInViewport = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (isInViewport) {
          el.classList.add('in-view');
        } else {
          observer.observe(el);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
