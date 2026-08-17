'use client';

import CalendarEventCard from '../CalendarEventCard';

export default function CalendarTab({ initialCalendar, currentMonth, countdowns, onEventClick }) {
  return (
    <div style={{ animation: 'tabFadeIn 0.3s ease-out' }}>
      <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
        Akses agenda resmi sekolah dengan mudah. Klik salah satu kegiatan di bawah untuk melihat **Countdown Waktu Mundur** dan **Panduan Edukatif Khusus Orang Tua**!
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: 'var(--space-sm)' 
      }}>
        {initialCalendar && initialCalendar.map((row) => (
          <CalendarEventCard
            key={row.id}
            row={row}
            isCurrent={row.id === currentMonth}
            countdown={countdowns[row.id]}
            onClick={() => onEventClick(row)}
          />
        ))}
      </div>
    </div>
  );
}
