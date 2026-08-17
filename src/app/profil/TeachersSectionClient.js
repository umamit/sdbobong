'use client';

import { useState, useEffect } from 'react';
import TeacherCard from './TeacherCard';
import TeacherModal from './TeacherModal';
import TeacherFlow from './TeacherFlow';

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

  const nonKomiteTeachers = teachers.filter(t => !(t.role || "").toLowerCase().includes("komite"));
  const dewanGuruList = teachers.filter(t => {
    const r = (t.role || "").toLowerCase();
    return !r.includes("kepala sekolah") && !r.includes("tata usaha") && !r.includes("koordinator tu") && !r.includes("komite") && !r.includes("bendahara");
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
        .clickable-card { cursor: pointer; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease !important; }
        .clickable-card:hover { transform: translateY(-5px) scale(1.02) !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; border-color: var(--primary) !important; }
        .modal-fade-in { animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {(mode === 'all' || mode === 'struktur') && (
        <TeacherFlow 
          mounted={mounted} 
          kepalaSekolah={kepalaSekolah} 
          komite={komite} 
          tataUsaha={tataUsaha} 
          bendahara={bendahara} 
          dewanGuruList={dewanGuruList} 
          onSelectTeacher={setSelectedTeacher} 
          isValidNip={isValidNip} 
        />
      )}

      {(mode === 'all' || mode === 'staf') && (
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Data PTK</span>
              <h2>Pendidik &amp; Tenaga Kependidikan</h2>
            </div>

            <div className="teachers-grid">
              {nonKomiteTeachers.length > 0 ? (
                nonKomiteTeachers.map((teacher) => (
                  <TeacherCard 
                    key={teacher.id} 
                    teacher={teacher} 
                    onSelect={setSelectedTeacher} 
                    getStatusBadgeStyle={getStatusBadgeStyle} 
                    isValidNip={isValidNip} 
                  />
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

      <TeacherModal 
        selectedTeacher={selectedTeacher} 
        onClose={() => setSelectedTeacher(null)} 
        getStatusBadgeStyle={getStatusBadgeStyle} 
        isValidNip={isValidNip} 
      />
    </>
  );
}
