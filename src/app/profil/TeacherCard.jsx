'use client';

export default function TeacherCard({ teacher, onSelect, getStatusBadgeStyle, isValidNip }) {
  return (
    <div 
      onClick={() => onSelect(teacher)}
      className="teacher-card clickable-card"
      style={{ border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}
    >
      <div className="teacher-img-container">
        <img 
          src={teacher.image || '/images/teacher_1.png'} 
          alt={`Foto ${teacher.name}`} 
          className="teacher-img" 
          width="240"
          height="240"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="teacher-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="teacher-role">{teacher.role}</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{teacher.name}</h3>
        {isValidNip(teacher.nip) && (
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginBottom: teacher.details ? '0.15rem' : '0' }}>
            NIP. {teacher.nip}
          </div>
        )}
        {teacher.details && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{teacher.details}</p>
        )}
        <div style={{ marginTop: 'auto' }}>
          <span className="teacher-status" style={getStatusBadgeStyle(teacher.status)}>
            {teacher.status}
          </span>
        </div>
      </div>
    </div>
  );
}
