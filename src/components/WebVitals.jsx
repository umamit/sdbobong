'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Send metric to Google Analytics if available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
        event_label: metric.id, // id unique to current page load
        non_interaction: true, // avoids affecting bounce rate
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
      });
    }

    // Log to console in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric);
    }
  });

  return null;
}
