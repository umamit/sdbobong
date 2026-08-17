'use client';

import { createPortal } from 'react-dom';

export default function AcademicEventModal({ 
  selectedEvent, 
  onClose, 
  mounted, 
  countdowns, 
  activeMplsDay, 
  setActiveMplsDay, 
  MPLS_RUNDOWN, 
  getParentTips 
}) {
  if (!selectedEvent || !mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 37, 59, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '16px var(--space-sm)',
      overflowY: 'auto',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '2px solid white',
        position: 'relative',
        animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        margin: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          padding: 'var(--space-md)',
          color: 'white',
          position: 'relative'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Agenda Akademik {selectedEvent.month}
          </span>
          <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
            {selectedEvent.desc}
          </h3>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: '1 1 auto' }}>
          
          {/* Target Date and countdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Tanggal Pelaksanaan</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{selectedEvent.dates}</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Hitung Mundur Acara</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 800, marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{countdowns[selectedEvent.id] || "Mempersiapkan..."}</span>
              </div>
            </div>
          </div>

          {/* Detailed MPLS Rundown Timeline */}
          {(selectedEvent.id === 'juli' || 
            (selectedEvent.desc && selectedEvent.desc.toLowerCase().includes('mpls')) ||
            (selectedEvent.title && selectedEvent.title.toLowerCase().includes('mpls'))) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff' }}>
              <h4 style={{ color: 'var(--primary-dark)', fontSize: '0.95rem', margin: '0 0 4px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                Rundown Harian MPLS:
              </h4>
              
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid var(--border-color)', scrollbarWidth: 'thin' }}>
                {MPLS_RUNDOWN.map((dayData, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMplsDay(idx)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: activeMplsDay === idx ? dayData.color : '#f1f5f9',
                      color: activeMplsDay === idx ? '#ffffff' : '#475569',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {dayData.day}
                  </button>
                ))}
              </div>

              {/* Active Day Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '6px', borderLeft: `3px solid ${MPLS_RUNDOWN[activeMplsDay].color}`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  <span>Tema: {MPLS_RUNDOWN[activeMplsDay].theme}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {MPLS_RUNDOWN[activeMplsDay].activities.map((act, actIdx) => (
                    <div key={actIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.725rem',
                        whiteSpace: 'nowrap',
                        border: '1px solid #e2e8f0'
                      }}>
                        {act.time}
                      </span>
                      <span style={{ color: '#334155', fontWeight: 500, lineHeight: 1.4, paddingTop: '1px' }}>
                        {act.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parents Prep Guide */}
          <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid var(--secondary)', padding: '15px', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            <h4 style={{ color: 'var(--secondary-dark)', fontSize: '0.95rem', margin: '0 0 8px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Panduan Persiapan Orang Tua di Rumah:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.6 }}>
              {getParentTips(selectedEvent.id).map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '12px var(--space-md)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#F9FAFB', flexShrink: 0 }}>
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={onClose}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
          >
            Mengerti
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
