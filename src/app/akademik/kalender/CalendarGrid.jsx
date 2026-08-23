'use client';

export default function CalendarGrid({ monthsConfig, getEventForDate }) {
  const daysInWeek = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];

  const renderMonthGrid = (year, monthIndex, monthName) => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalCells = [...blanks, ...days];
    
    const rows = [];
    let cells = [];
    totalCells.forEach((cell, index) => {
      if (index % 7 === 0 && index !== 0) { rows.push(cells); cells = []; }
      cells.push(cell);
    });
    if (cells.length > 0) {
      while (cells.length < 7) cells.push(null);
      rows.push(cells);
    }

    return (
      <div key={`${year}-${monthIndex}`} className="month-card glass-card">
        <h4 className="month-title">{monthName}</h4>
        <div className="calendar-grid">
          {daysInWeek.map((d, idx) => (
            <div key={d} className={`grid-header-cell ${idx === 0 ? 'sunday-label' : ''}`}>{d}</div>
          ))}
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="calendar-row">
              {row.map((day, cIdx) => {
                if (day === null) return <div key={cIdx} className="grid-cell empty"></div>;
                const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const event = getEventForDate(dateStr);
                const isSun = cIdx === 0;
                
                let cellClass = "";
                if (event) cellClass = `has-event event-${event.type}`;
                else if (isSun) cellClass = "sunday";

                return (
                  <div key={cIdx} className={`grid-cell ${cellClass}`} title={event ? `${event.title}` : undefined}>
                    <span className="day-number">{day}</span>
                    {event && <span className="event-dot"></span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="month-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {monthsConfig.map(m => renderMonthGrid(m.year, m.monthIndex, m.label))}
    </div>
  );
}
