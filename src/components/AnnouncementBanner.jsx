'use client';

import styles from './AnnouncementBanner.module.css';

export default function AnnouncementBanner({ initialAnnouncements = [], initialSpeed = 40 }) {
  if (!initialAnnouncements || initialAnnouncements.length === 0) return null;

  // Strip unicode emojis from announcements for clean SVG rendering
  const cleanAnnouncements = initialAnnouncements.map(ann => 
    ann.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}]/gu, '').trim()
  );

  // Calculate dynamic duration to keep scrolling speed consistent
  const totalChars = cleanAnnouncements.join(' ').length;
  const dynamicDuration = Math.max(25, Math.round(totalChars * (initialSpeed / 250)));

  // Render exact array without duplication when 1 announcement item is present
  const marqueeItems = cleanAnnouncements;

  return (
    <div className={`${styles.announcementBanner} no-print public-layout-announcement`}>
      {/* Fixed Left Badge Label */}
      <div className={styles.badgeLabel}>
        <span className={styles.liveDot}></span>
        <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8 4a2 2 0 0 1-4 0" />
        </svg>
        <span>INFO SEKOLAH</span>
      </div>

      {/* Marquee Ticker Track */}
      <div className={styles.tickerTrack}>
        <div className={styles.marqueeContent} style={{ '--marquee-duration': `${dynamicDuration}s` }}>
          {marqueeItems.map((ann, idx) => (
            <span key={idx} className={styles.announcementItem}>
              <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{ann}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
