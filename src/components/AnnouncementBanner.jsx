'use client';

import { useState, useEffect } from 'react';
import styles from './AnnouncementBanner.module.css';

export default function AnnouncementBanner({ initialAnnouncements = [], initialSpeed = 40 }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [speed, setSpeed] = useState(initialSpeed);

  useEffect(() => {
    async function fetchLatestConfig() {
      try {
        // Fetch config without cache to ensure we get the absolute latest from server/db
        const res = await fetch('/api/config', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.marquee_announcements && Array.isArray(data.marquee_announcements)) {
            setAnnouncements(data.marquee_announcements);
          }
          if (data.marquee_speed) {
            setSpeed(data.marquee_speed);
          }
        }
      } catch (e) {
        console.error('Failed to fetch latest marquee config client-side:', e);
      }
    }
    
    // Add a slight delay to allow the page to mount smoothly
    const timer = setTimeout(() => {
      fetchLatestConfig();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!announcements || announcements.length === 0) return null;

  // Calculate dynamic duration to keep velocity constant
  // Assuming a baseline of 300 characters takes 'speed' seconds.
  const totalChars = announcements.join('   ').length;
  const dynamicDuration = Math.max(20, Math.round(totalChars * (speed / 300)));

  return (
    <div className={`${styles.announcementBanner} no-print public-layout-announcement`}>
      <div className={styles.marqueeContent} style={{ '--marquee-duration': `${dynamicDuration}s` }}>
        {announcements.map((ann, idx) => (
          <span key={idx}>{ann}</span>
        ))}
      </div>
    </div>
  );
}
