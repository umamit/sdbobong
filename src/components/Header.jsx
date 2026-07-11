'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');

  // Sync theme status on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.dispatchEvent(new Event('theme-changed'));
  };

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
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    {
      label: 'Akademik',
      dropdown: [
        { href: '/akademik', label: 'Informasi Akademik' },
        { href: '/akademik/kalender', label: 'Kalender Pendidikan' },
        { href: '/akademik/nilai', label: 'Portal Cek Rapor' },
        { href: '/akademik/kelulusan', label: 'Pengumuman Kelulusan' },
        { href: '/kesiswaan', label: 'Kesiswaan & Ekskul' }
      ]
    },
    {
      label: 'PPDB',
      dropdown: [
        { href: '/ppdb', label: 'Alur & Persyaratan' },
        { href: '/ppdb/daftar', label: 'Formulir Online' },
        { href: '/ppdb/cetak', label: 'Unduh Formulir (Offline)' }
      ]
    },
    {
      label: 'Informasi',
      dropdown: [
        { href: '/berita', label: 'Berita & Kegiatan' },
        { href: '/galeri', label: 'Galeri Sekolah' },
        { href: '/unduh', label: 'Pusat Unduhan' }
      ]
    },
    {
      label: 'Kontak',
      dropdown: [
        { href: '/kontak', label: 'Hubungi Kami' },
        { href: '/kontak/buku-tamu', label: 'Buku Tamu' }
      ]
    },
    { href: '/login', label: 'Login' }
  ];

  return (
    <header className={`${styles.header} taliabu-pattern-bg`}>
      <div className={`container ${styles.navbar}`}>
        <Link href="/" className={styles.logoContainer}>
          <Image src="/images/logo_sekolah.png" alt="Logo SD Negeri Bobong" className={styles.schoolLogo} width={60} height={60} priority />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SD NEGERI BOBONG</span>
            <span className={styles.logoSubtitle}>Pulau Taliabu</span>
          </div>
        </Link>

        {/* Hamburger Button for Mobile */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka Menu Navigasi"
          aria-expanded={isOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Navigation Links */}
        <nav className={styles.navMenuWrapper}>
          <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                const isSubActive = link.dropdown.some(sub => pathname === sub.href);
                const isThisDropdownOpen = activeDropdown === idx;
                return (
                  <li key={idx} className={`${styles.navItem} ${styles.navItemDropdown} ${isThisDropdownOpen ? styles.active : ''}`}>
                    <button
                      className={`${styles.navLink} ${styles.navDropdownToggle} ${isSubActive ? styles.active : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveDropdown(isThisDropdownOpen ? null : idx);
                      }}
                      aria-expanded={isThisDropdownOpen}
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
                          transform: isThisDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          opacity: 0.8
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <ul className={`${styles.dropdownMenu} ${isThisDropdownOpen ? styles.show : ''}`}>
                      {link.dropdown.map((subLink) => {
                        const isChildActive = pathname === subLink.href;
                        return (
                          <li key={subLink.href} className="dropdown-item">
                            <Link
                              href={subLink.href}
                              className={`${styles.dropdownLink} ${isChildActive ? styles.active : ''}`}
                              onClick={() => {
                                setActiveDropdown(null);
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
                <li key={link.href} className={styles.navItem}>
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Ubah Tema Gelap/Terang"
          title="Ubah Tema"
        >
          {theme === 'light' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: 'rotate(0deg)', transition: 'transform 0.5s ease' }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f5a623"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: 'rotate(180deg)', transition: 'transform 0.5s ease' }}
            >
              <circle cx="12" cy="12" r="5" fill="#f5a623"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
