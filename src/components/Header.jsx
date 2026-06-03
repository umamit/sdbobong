'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scrolling when menu is active on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu when navigation path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    { href: '/akademik', label: 'Akademik' },
    { href: '/kesiswaan', label: 'Kesiswaan' },
    { href: '/ppdb', label: 'PPDB' },
    { href: '/berita', label: 'Berita' }
  ];

  return (
    <header>
      <div className="container navbar">
        <Link href="/" className="logo-container">
          <img src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" className="school-logo" />
          <div className="logo-text">
            <span className="logo-title">SD NEGERI BOBONG</span>
            <span className="logo-subtitle">Pulau Taliabu</span>
          </div>
        </Link>

        {/* Hamburger Button for Mobile */}
        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka Menu Navigasi"
          aria-expanded={isOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navigation Links */}
        <nav className={`nav-menu-wrapper ${isOpen ? 'active' : ''}`}>
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="nav-item">
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
