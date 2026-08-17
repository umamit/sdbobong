'use client';

import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';

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

export default function TeacherFlow({ 
  mounted, 
  kepalaSekolah, 
  komite, 
  tataUsaha, 
  bendahara, 
  dewanGuruList, 
  onSelectTeacher, 
  isValidNip 
}) {
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
        onSelect: onSelectTeacher,
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
        onSelect: onSelectTeacher,
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
        onSelect: onSelectTeacher,
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
        onSelect: onSelectTeacher,
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
    { id: 'ks-to-komite', source: 'kepala-sekolah', target: 'komite', type: 'smoothstep', style: { stroke: 'var(--primary)', strokeWidth: 2 } },
    { id: 'ks-to-tu', source: 'kepala-sekolah', target: 'tata-usaha', type: 'smoothstep', style: { stroke: 'var(--primary)', strokeWidth: 2 } },
    { id: 'ks-to-bendahara', source: 'kepala-sekolah', target: 'bendahara', type: 'smoothstep', style: { stroke: 'var(--primary)', strokeWidth: 2 } },
    { id: 'ks-to-dg', source: 'kepala-sekolah', target: 'dewan-guru-title', type: 'smoothstep', style: { stroke: 'var(--primary)', strokeWidth: 2 } }
  ];

  const gridVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 90, damping: 14 } }
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Manajemen</span>
          <h2>Struktur Organisasi</h2>
        </div>

        <div style={{ backgroundColor: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          {mounted ? (
            <div style={{ width: '100%', height: '380px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', position: 'relative' }}>
              <ReactFlow nodes={flowNodes} edges={flowEdges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.6} maxZoom={1.3} panOnScroll={true} zoomOnScroll={false} preventScrolling={false} nodesConnectable={false} nodesDraggable={false} elementsSelectable={false}>
                <Background color="#cbd5e1" gap={16} size={1} />
                <Controls showInteractive={false} style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'white' }} />
              </ReactFlow>
            </div>
          ) : (
            <div style={{ width: '100%', height: '380px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Memuat Bagan Organisasi...
            </div>
          )}

          {dewanGuruList.length > 0 && (
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)', marginTop: '-30px', zIndex: 2 }}></div>
              <motion.div variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', maxWidth: '850px', width: '100%', padding: '15px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1', boxSizing: 'border-box' }}>
                {dewanGuruList.map((guru) => (
                  <motion.div key={guru.id} onClick={() => onSelectTeacher(guru)} className="clickable-card" variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.3 }} style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px 10px', width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-sm)', boxSizing: 'border-box' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginBottom: '8px', border: '2px solid var(--primary-light)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={guru.image || '/images/teacher_1.png'} alt={guru.name} width="120" height="120" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.2, minHeight: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{guru.name}</div>
                    {isValidNip(guru.nip) && <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500', marginTop: '2px', marginBottom: '2px' }}>NIP. {guru.nip}</div>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>{guru.role}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
