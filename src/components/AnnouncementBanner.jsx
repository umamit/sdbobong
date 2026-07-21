'use client';

import styles from './AnnouncementBanner.module.css';

export default function AnnouncementBanner({ initialAnnouncements = [], initialSpeed = 40 }) {
  if (!initialAnnouncements || initialAnnouncements.length === 0) return null;

  // Calculate dynamic duration to keep velocity constant
  // Assuming a baseline of 300 characters takes 'initialSpeed' seconds.
  const totalChars = initialAnnouncements.join('   ').length;
  const dynamicDuration = Math.max(20, Math.round(totalChars * (initialSpeed / 300)));

  return (
    <div className={`${styles.announcementBanner} no-print public-layout-announcement`}>
      <div className={styles.marqueeContent} style={{ '--marquee-duration': `${dynamicDuration}s` }}>
        {initialAnnouncements.map((ann, idx) => (
          <span key={idx}>{ann}</span>
        ))}
      </div>
    </div>
  );
}
