'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherModal({ selectedTeacher, onClose, getStatusBadgeStyle, isValidNip }) {
  return (
    <AnimatePresence>
      {selectedTeacher && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="modal-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
            boxSizing: 'border-box'
          }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '24px',
              padding: '2rem',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.3)',
              position: 'relative',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Circular Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.08)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(15, 23, 42, 0.15)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(15, 23, 42, 0.08)'}
            >
              &times;
            </button>

            {/* Profile Header Grid */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                flexShrink: 0
              }}>
                <img 
                  src={selectedTeacher.image || '/images/teacher_1.png'} 
                  alt={selectedTeacher.name} 
                  width="100"
                  height="100"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span className="badge" style={{ ...getStatusBadgeStyle(selectedTeacher.status), display: 'inline-block', marginBottom: '6px' }}>
                  {selectedTeacher.status}
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 4px 0', fontWeight: 800 }}>
                  {selectedTeacher.name}
                </h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                  {selectedTeacher.role}
                </div>
                {isValidNip(selectedTeacher.nip) && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>
                    NIP. {selectedTeacher.nip}
                  </div>
                )}
                {selectedTeacher.details && (
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', fontStyle: 'italic' }}>
                    {selectedTeacher.details}
                  </div>
                )}
              </div>
            </div>

            {/* Biography Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Education and Subjects */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    Pendidikan Terakhir
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                    {selectedTeacher.education || 'Data belum diisi'}
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    Mata Pelajaran / Rombel
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                    {selectedTeacher.subject || 'Data belum diisi'}
                  </div>
                </div>
              </div>

              {/* Motto / Quote */}
              {selectedTeacher.motto && (
                <div style={{ 
                  backgroundColor: 'var(--accent-bg)', 
                  border: '1px solid var(--border-color)', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  fontStyle: 'italic'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
                    "{selectedTeacher.motto}"
                  </p>
                </div>
              )}

              {/* Biography Text */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Biografi Singkat
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>
                  {selectedTeacher.bio || `${selectedTeacher.name} adalah bagian dari tenaga pendidik profesional di SD Negeri Bobong yang bertugas sebagai ${selectedTeacher.role || 'Tenaga Pendidik'}. Beliau berkomitmen untuk mewujudkan visi sekolah dalam mendidik generasi yang cerdas, berkarakter mulia, dan berbudaya.`}
                </p>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
