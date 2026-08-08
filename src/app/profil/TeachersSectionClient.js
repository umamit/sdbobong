'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

// Custom Node for Teacher Cards in React Flow
const TeacherNodeCustom = ({ data }) => {
  const teacher = data.teacher;
  const isPlaceholder = data.isPlaceholder;
  const isKepalaSekolah = data.isKepalaSekolah;
  const label = data.label;

  const cardStyle = isPlaceholder
    ? {
        backgroundColor: '#fff5f5',
        color: '#e53e3e',
        border: '2px dashed #fed7d7',
        padding: '0.6rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        width: '210px',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.8rem',
      }
    : isKepalaSekolah
    ? {
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        width: '240px',
        boxShadow: 'var(--shadow-md)',
        cursor: 'pointer',
      }
    : {
        backgroundColor: 'var(--accent)',
        color: 'white',
        padding: '0.5rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        width: '180px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
      };

  return (
    <div
      onClick={!isPlaceholder ? () => data.onSelect(teacher) : undefined}
      className={!isPlaceholder ? 'clickable-card' : ''}
      style={{
        ...cardStyle,
        position: 'relative',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {data.hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: 'var(--primary)', width: '6px', height: '6px', border: '1px solid white' }}
        />
      )}
      
      {isPlaceholder ? (
        <>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Tidak Ada</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{label}</div>
        </>
      ) : (
        <>
          <div style={{ 
            fontWeight: 700, 
            fontFamily: 'var(--font-heading)', 
            fontSize: isKepalaSekolah ? '0.9rem' : '0.78rem', 
            lineHeight: 1.2,
            marginBottom: '4px'
          }}>
            {teacher.name}
          </div>
          {data.isValidNip(teacher.nip) && (
            <div style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 500, margin: '2px 0' }}>
              NIP. {teacher.nip}
            </div>
          )}
          <div style={{ fontSize: isKepalaSekolah ? '0.75rem' : '0.7rem', opacity: 0.9 }}>
            {teacher.role}
          </div>
        </>
      )}

      {data.hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: 'var(--primary)', width: '6px', height: '6px', border: '1px solid white' }}
        />
      )}
    </div>
  );
};

// Custom Node for Group Title Cards in React Flow
const TitleNodeCustom = ({ data }) => {
  return (
    <div style={{
      backgroundColor: 'var(--secondary)',
      color: 'var(--primary-dark)',
      padding: '0.6rem 1rem',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center',
      width: '260px',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'var(--primary)', width: '6px', height: '6px', border: '1px solid white' }}
      />
      <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.85rem' }}>{data.title}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 500 }}>{data.subtitle}</div>
    </div>
  );
};

const nodeTypes = {
  teacherNode: TeacherNodeCustom,
  titleNode: TitleNodeCustom
};

export default function TeachersSectionClient({ teachers, mode = 'all' }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isValidNip = (n) => {
    if (!n) return false;
    const cleaned = n.toString().replace(/\s+/g, '');
    return cleaned.length > 0 && /^\d+$/.test(cleaned);
  };

  const kepalaSekolah = teachers.find(t => (t.role || "").toLowerCase().includes("kepala sekolah")) || null;
  const tataUsaha = teachers.find(t =>
    (t.role || "").toLowerCase().includes("tata usaha") ||
    (t.role || "").toLowerCase().includes("koordinator tu")
  ) || null;
  const komite = teachers.find(t => (t.role || "").toLowerCase().includes("komite")) || null;
  const bendahara = teachers.find(t => (t.role || "").toLowerCase().includes("bendahara")) || null;
  
  const nonKomiteTeachers = teachers.filter(t =>
    !(t.role || "").toLowerCase().includes("komite")
  );

  const dewanGuruList = teachers.filter(t => {
    const r = (t.role || "").toLowerCase();
    return !r.includes("kepala sekolah") &&
           !r.includes("tata usaha") &&
           !r.includes("koordinator tu") &&
           !r.includes("komite") &&
           !r.includes("bendahara");
  });

  const getStatusBadgeStyle = (status) => {
    const isPNS = status === 'PNS';
    const isPPPK = status === 'PPPK' || status === 'PPPK PW';
    const isKomite = status === 'Komite Sekolah';

    if (isPNS) {
      return { backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' };
    } else if (isPPPK) {
      return { backgroundColor: '#E8FAF0', color: '#20BA5A', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 };
    } else if (isKomite) {
      return { backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 };
    } else {
      return { backgroundColor: '#FFF8E6', color: '#D48408', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 };
    }
  };

  // Build nodes and edges dynamically for React Flow
  const flowNodes = [
    {
      id: 'kepala-sekolah',
      type: 'teacherNode',
      position: { x: 230, y: 10 },
      data: {
        teacher: kepalaSekolah,
        isPlaceholder: !kepalaSekolah,
        isKepalaSekolah: true,
        label: 'Plt. Kepala Sekolah',
        hasTarget: false,
        hasSource: true,
        onSelect: setSelectedTeacher,
        isValidNip
      }
    },
    {
      id: 'komite',
      type: 'teacherNode',
      position: { x: 10, y: 130 },
      data: {
        teacher: komite,
        isPlaceholder: !komite,
        isKepalaSekolah: false,
        label: 'Ketua Komite Sekolah',
        hasTarget: true,
        hasSource: false,
        onSelect: setSelectedTeacher,
        isValidNip
      }
    },
    {
      id: 'tata-usaha',
      type: 'teacherNode',
      position: { x: 250, y: 130 },
      data: {
        teacher: tataUsaha,
        isPlaceholder: !tataUsaha,
        isKepalaSekolah: false,
        label: 'Tata Usaha',
        hasTarget: true,
        hasSource: false,
        onSelect: setSelectedTeacher,
        isValidNip
      }
    },
    {
      id: 'bendahara',
      type: 'teacherNode',
      position: { x: 490, y: 130 },
      data: {
        teacher: bendahara,
        isPlaceholder: !bendahara,
        isKepalaSekolah: false,
        label: 'Bendahara',
        hasTarget: true,
        hasSource: false,
        onSelect: setSelectedTeacher,
        isValidNip
      }
    },
    {
      id: 'dewan-guru-title',
      type: 'titleNode',
      position: { x: 210, y: 250 },
      data: {
        title: 'Pendidik & Tenaga Kependidikan',
        subtitle: 'Daftar PTK SD Negeri Bobong'
      }
    }
  ];

  const flowEdges = [
    {
      id: 'ks-to-komite',
      source: 'kepala-sekolah',
      target: 'komite',
      type: 'smoothstep',
      style: { stroke: 'var(--primary)', strokeWidth: 2 }
    },
    {
      id: 'ks-to-tu',
      source: 'kepala-sekolah',
      target: 'tata-usaha',
      type: 'smoothstep',
      style: { stroke: 'var(--primary)', strokeWidth: 2 }
    },
    {
      id: 'ks-to-bendahara',
      source: 'kepala-sekolah',
      target: 'bendahara',
      type: 'smoothstep',
      style: { stroke: 'var(--primary)', strokeWidth: 2 }
    },
    {
      id: 'ks-to-dg',
      source: 'kepala-sekolah',
      target: 'dewan-guru-title',
      type: 'smoothstep',
      style: { stroke: 'var(--primary)', strokeWidth: 2 }
    }
  ];

  return (
    <>
      <style>{`
        .clickable-card {
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease !important;
        }
        .clickable-card:hover {
          transform: translateY(-5px) scale(1.02) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          border-color: var(--primary) !important;
        }
        .modal-fade-in {
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-scale-up {
          animation: modalScaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Bagan Organisasi */}
      {(mode === 'all' || mode === 'struktur') && (
        <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Manajemen</span>
            <h2>Struktur Organisasi</h2>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: 'var(--space-md)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)', 
            boxShadow: 'var(--shadow-sm)'
          }}>
            {mounted ? (
              <div style={{ 
                width: '100%', 
                height: '380px', 
                backgroundColor: '#f8fafc', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <ReactFlow
                  nodes={flowNodes}
                  edges={flowEdges}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  minZoom={0.6}
                  maxZoom={1.3}
                  panOnScroll={true}
                  zoomOnScroll={false}
                  preventScrolling={false}
                  nodesConnectable={false}
                  nodesDraggable={false}
                  elementsSelectable={false}
                >
                  <Background color="#cbd5e1" gap={16} size={1} />
                  <Controls 
                    showInteractive={false} 
                    style={{ 
                      boxShadow: 'var(--shadow-sm)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }} 
                  />
                </ReactFlow>
              </div>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '380px', 
                backgroundColor: '#f8fafc', 
                borderRadius: 'var(--radius-sm)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                Memuat Bagan Organisasi...
              </div>
            )}

            {/* Dewan Guru Sub Grid (Interlocking HTML Grid) */}
            {dewanGuruList.length > 0 && (
              <div style={{ 
                marginTop: '30px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '15px' 
              }}>
                <div style={{ 
                  width: '2px', 
                  height: '20px', 
                  backgroundColor: 'var(--primary)', 
                  marginTop: '-30px',
                  zIndex: 2
                }}></div>
                <motion.div 
                  variants={gridVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                  style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '15px', 
                    justifyContent: 'center', 
                    maxWidth: '850px', 
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed #cbd5e1',
                    boxSizing: 'border-box'
                  }}
                >
                  {dewanGuruList.map((guru) => (
                    <motion.div 
                      key={guru.id} 
                      onClick={() => setSelectedTeacher(guru)}
                      className="clickable-card"
                      variants={cardVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      style={{ 
                        backgroundColor: 'white', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '12px 10px', 
                        width: '180px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        textAlign: 'center', 
                        boxShadow: 'var(--shadow-sm)',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        marginBottom: '8px', 
                        border: '2px solid var(--primary-light)',
                        backgroundColor: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                           src={guru.image || '/images/teacher_1.png'} 
                           alt={guru.name} 
                           width="120"
                           height="120"
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                           loading="lazy"
                           decoding="async"
                        />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.2, minHeight: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {guru.name}
                      </div>
                      {isValidNip(guru.nip) && (
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500', marginTop: '2px', marginBottom: '2px' }}>
                          NIP. {guru.nip}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                        {guru.role}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

          </div>
        </div>
      </section>
      )}

      {/* Jajaran Detail PTK Grid */}
      {(mode === 'all' || mode === 'staf') && (
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Data PTK</span>
            <h2>Pendidik &amp; Tenaga Kependidikan</h2>
          </div>

          <div className="teachers-grid">
            {nonKomiteTeachers.length > 0 ? (
              nonKomiteTeachers.map((teacher, index) => (
                <div 
                  key={teacher.id} 
                  onClick={() => setSelectedTeacher(teacher)}
                  className="teacher-card clickable-card"
                  style={{ border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="teacher-img-container">
                    <img 
                      src={teacher.image} 
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
                      <span className={`teacher-status`} style={getStatusBadgeStyle(teacher.status)}>
                        {teacher.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Belum ada data pendidik dan staf.
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ================= BIOGRAPHY MODAL (GLASSMORPHIC) ================= */}
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
            onClick={() => setSelectedTeacher(null)}
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
                onClick={() => setSelectedTeacher(null)}
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
                  backgroundColor: 'rgba(79, 70, 229, 0.05)', 
                  borderLeft: '4px solid var(--primary)', 
                  padding: '1rem', 
                  borderRadius: '0 12px 12px 0',
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
    </>
  );
}
