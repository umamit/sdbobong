'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CalendarEventCard from '../CalendarEventCard';

// Load react-calendar dinamis di client-side saja untuk menghindari Hydration Mismatch
const ReactCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontWeight: 600 }}>
      Memuat Kalender Interaktif...
    </div>
  )
});

// Import basic style untuk react-calendar secara aman
import 'react-calendar/dist/Calendar.css';

export default function CalendarTab({ initialCalendar, currentMonth, countdowns, onEventClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsMap, setEventsMap] = useState({});

  useEffect(() => {
    const MONTH_MAP = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };

    const mapping = {};
    (initialCalendar || []).forEach(evt => {
      const datesStr = (evt.dates || '').toLowerCase();
      const monthStr = (evt.month || '').toLowerCase();
      const yearMatch = (datesStr + ' ' + monthStr).match(/\b(20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : '2026';
      
      let monthNum = null;
      for (const [name, num] of Object.entries(MONTH_MAP)) {
        if (datesStr.includes(name) || monthStr.includes(name)) { 
          monthNum = num; 
          break; 
        }
      }
      
      if (!monthNum) monthNum = '07'; // Fallback Juli

      // Deteksi hari
      const dayMatch = datesStr.match(/\b(\d{1,2})\b/);
      if (dayMatch) {
        const dayStr = dayMatch[1].padStart(2, '0');
        const formattedDate = `${year}-${monthNum}-${dayStr}`;
        mapping[formattedDate] = evt;
      }
    });
    setEventsMap(mapping);
  }, [initialCalendar]);

  // Format Date ke YYYY-MM-DD lokal
  const getLocalDateString = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = getLocalDateString(date);
      if (eventsMap[dateStr]) {
        return 'has-academic-event';
      }
    }
    return null;
  };

  const handleDayClick = (value) => {
    setSelectedDate(value);
    const dateStr = getLocalDateString(value);
    const matchedEvent = eventsMap[dateStr];
    if (matchedEvent) {
      onEventClick(matchedEvent);
    }
  };

  return (
    <div style={{ animation: 'tabFadeIn 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto var(--space-md) auto', fontSize: '0.95rem' }}>
        Akses agenda resmi sekolah dengan mudah. Klik tanggal bertanda di kalender atau pilih kartu kegiatan di bawah untuk melihat **Countdown Waktu Mundur** &amp; **Panduan Edukatif Orang Tua**!
      </p>

      {/* React Calendar Container */}
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto var(--space-md) auto', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1rem', boxShadow: 'var(--shadow-md)' }}>
        <ReactCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          onClickDay={handleDayClick}
          tileClassName={getTileClassName}
          locale="id-ID"
        />
      </div>

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

      <style jsx global>{`
        /* Custom Styling react-calendar agar menyatu dengan branding sekolah */
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: var(--font-heading) !important;
        }
        .react-calendar__tile--now {
          background: rgba(229, 169, 0, 0.15) !important; /* Kuning Emas Muted */
          color: var(--secondary-dark) !important;
          font-weight: 700;
          border-radius: 8px;
        }
        .react-calendar__tile--active {
          background: var(--primary) !important; /* Biru Toska */
          color: white !important;
          font-weight: bold;
          border-radius: 8px;
        }
        .react-calendar__tile:hover {
          border-radius: 8px;
        }
        .has-academic-event {
          position: relative;
          font-weight: 800 !important;
          color: var(--primary-dark) !important;
        }
        .has-academic-event::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent); /* Hijau Daun */
        }
      `}</style>
    </div>
  );
}

