'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    setIsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    {
      label: 'Akademik & Kesiswaan',
      dropdown: [
        { href: '/akademik', label: 'Akademik' },
        { href: '/kesiswaan', label: 'Kesiswaan' }
      ]
    },
    { href: '/galeri', label: 'Galeri' },
    { href: '/unduh', label: 'Unduhan' },
    { href: '/buku-tamu', label: 'Buku Tamu' },
    { href: '/kelulusan', label: 'Kelulusan' },
    { href: '/hubungi-kami', label: 'Hubungi' },
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
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                const isSubActive = link.dropdown.some(sub => pathname === sub.href);
                return (
                  <li key={idx} className={`nav-item nav-item-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                    <button
                      className={`nav-link nav-dropdown-toggle ${isSubActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      aria-expanded={isDropdownOpen}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        width: '100%',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        color: 'inherit',
                        padding: 'inherit'
                      }}
                    >
                      {link.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          opacity: 0.8
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                      {link.dropdown.map((subLink) => {
                        const isChildActive = pathname === subLink.href;
                        return (
                          <li key={subLink.href} className="dropdown-item">
                            <Link
                              href={subLink.href}
                              className={`dropdown-link ${isChildActive ? 'active' : ''}`}
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setIsOpen(false);
                              }}
                            >
                              {subLink.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }

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
