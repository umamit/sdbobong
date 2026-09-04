'use client';

import { useState, useEffect } from 'react';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('site_lang') || 'id';
    setLang(savedLang);

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'id',
              includedLanguages: 'id,en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (targetLang) => {
    setLang(targetLang);
    localStorage.setItem('site_lang', targetLang);

    const domain = window.location.hostname;
    document.cookie = `googtrans=/id/${targetLang}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/id/${targetLang}; path=/;`;

    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className={styles.switcherWrapper}>
      <button
        type="button"
        className={`${styles.langBtn} ${lang === 'id' ? styles.active : ''}`}
        onClick={() => changeLanguage('id')}
        title="Bahasa Indonesia"
        aria-label="Pilih Bahasa Indonesia"
      >
        <svg className={styles.flagIcon} viewBox="0 0 640 480" aria-hidden="true">
          <g fillRule="evenodd" strokeWidth="1pt">
            <path fill="#e70011" d="M0 0h640v240H0z" />
            <path fill="#fff" d="M0 240h640v240H0z" />
          </g>
        </svg>
        <span className={styles.langLabel}>ID</span>
      </button>

      <button
        type="button"
        className={`${styles.langBtn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => changeLanguage('en')}
        title="English Language"
        aria-label="Switch to English"
      >
        <svg className={styles.flagIcon} viewBox="0 0 640 480" aria-hidden="true">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path fill="#FFF" d="m75 0 245 180L565 0h75v50L395 240l245 190v50h-75L320 300 75 480H0v-50l245-190L0 50V0h75z" />
          <path fill="#C8102E" d="m400 270 240 180h-40L360 270h40zM240 210 0 30v40l200 140h40zm80 30L0 480h40l280-210v-30zm-80 0L640 0h-40L320 210v30z" />
          <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z" />
          <path fill="#C8102E" d="M270 0v480h100V0H270zM0 190v100h640V190H0z" />
        </svg>
        <span className={styles.langLabel}>EN</span>
      </button>
    </div>
  );
}
