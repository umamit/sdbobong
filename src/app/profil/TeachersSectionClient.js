'use client';

import { useState } from 'react';

export default function TeachersSectionClient({ teachers }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

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
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Manajemen</span>
            <h2>Struktur Organisasi</h2>
          </div>

          {/* Petunjuk Geser untuk Smartphone */}
          <div className="mobile-scroll-hint" style={{
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '15px',
            border: '1px solid #BFDBFE'
          }}>
            <span>↔️ Geser ke samping untuk melihat bagan lengkap</span>
          </div>

          <div className="reveal-on-scroll" style={{ backgroundColor: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
            <div style={{ minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
              
              {/* Kepala Sekolah */}
              {kepalaSekolah ? (
                <div 
                  onClick={() => setSelectedTeacher(kepalaSekolah)}
                  className="clickable-card"
                  style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{kepalaSekolah.name}</div>
                  {isValidNip(kepalaSekolah.nip) && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 500, margin: '2px 0' }}>NIP. {kepalaSekolah.nip}</div>
                  )}
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{kepalaSekolah.role}</div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#e53e3e' }}>Tidak Ada</div>
                  <div style={{ fontSize: '0.8rem', color: '#c53030' }}>Kepala Sekolah</div>
                </div>
              )}

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)' }}></div>

              <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'center', width: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '18%', right: '18%', height: '2px', backgroundColor: 'var(--primary)', zIndex: 1 }}></div>

                {/* Left Box: Komite */}
                {komite ? (
                  <div 
                    onClick={() => setSelectedTeacher(komite)}
                    className="clickable-card"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{komite.name}</div>
                    {isValidNip(komite.nip) && (
                      <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500, margin: '1px 0' }}>NIP. {komite.nip}</div>
                    )}
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{komite.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Ketua Komite Sekolah</div>
                  </div>
                )}

                {/* Center Box: Tata Usaha */}
                {tataUsaha ? (
                  <div 
                    onClick={() => setSelectedTeacher(tataUsaha)}
                    className="clickable-card"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tataUsaha.name}</div>
                    {isValidNip(tataUsaha.nip) && (
                      <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500, margin: '1px 0' }}>NIP. {tataUsaha.nip}</div>
                    )}
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{tataUsaha.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Tata Usaha</div>
                  </div>
                )}

                {/* Right Box: Bendahara */}
                {bendahara ? (
                  <div 
                    onClick={() => setSelectedTeacher(bendahara)}
                    className="clickable-card"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{bendahara.name}</div>
                    {isValidNip(bendahara.nip) && (
                      <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500, margin: '1px 0' }}>NIP. {bendahara.nip}</div>
                    )}
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{bendahara.role}</div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '180px', zIndex: 2, marginTop: '18px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', width: '2px', height: '18px', backgroundColor: 'var(--primary)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e53e3e' }}>Tidak Ada</div>
                    <div style={{ fontSize: '0.75rem', color: '#c53030' }}>Bendahara</div>
                  </div>
                )}
              </div>

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)', marginTop: '10px' }}></div>

              {/* Dewan Guru */}
              <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '400px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Dewan Guru & Pendidik</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>Jajaran Tenaga Pendidik Sekolah</div>
              </div>

              <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--primary)' }}></div>

              {/* Grid of Teachers under Dewan Guru */}
              {dewanGuruList.length > 0 ? (
                <div style={{ 
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
                }}>
                  {dewanGuruList.map((guru) => (
                    <div 
                      key={guru.id} 
                      onClick={() => setSelectedTeacher(guru)}
                      className="clickable-card"
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
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', border: '2px dashed #fed7d7', padding: '0.75rem var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center', width: '280px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#e53e3e' }}>Tidak Ada</div>
                  <div style={{ fontSize: '0.8rem', color: '#c53030' }}>Guru & Pendidik</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Jajaran Detail PTK Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Daftar Staf</span>
            <h2>Pendidik & Tenaga Kependidikan</h2>
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

      {/* ================= BIOGRAPHY MODAL (GLASSMORPHIC) ================= */}
      {selectedTeacher && (
        <div 
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
          <div 
            className="modal-scale-up"
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
              ✕
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>🎓 Pendidikan Terakhir</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                    {selectedTeacher.education || 'Data belum diisi'}
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>📚 Mata Pelajaran / Rombel</div>
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
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>📝 Biografi Singkat</div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>
                  {selectedTeacher.bio || `${selectedTeacher.name} adalah bagian dari tenaga pendidik profesional di SD Negeri Bobong yang bertugas sebagai ${selectedTeacher.role || 'Tenaga Pendidik'}. Beliau berkomitmen untuk mewujudkan visi sekolah dalam mendidik generasi yang cerdas, berkarakter mulia, dan berbudaya.`}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
