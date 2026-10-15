'use client';

export default function PiketScheduleForm({ currentDay, updateCurrentDayField, teachers = [] }) {
  if (!currentDay) return null;

  const currentMembers = Array.isArray(currentDay.anggota) ? currentDay.anggota : [];

  const handleAddMember = (teacherName) => {
    if (!teacherName) return;
    if (!currentMembers.includes(teacherName)) {
      updateCurrentDayField('anggota', [...currentMembers, teacherName]);
    }
  };

  const handleRemoveMember = (nameToRemove) => {
    updateCurrentDayField('anggota', currentMembers.filter(m => m !== nameToRemove));
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Jam Operasional
          </label>
          <input
            type="text"
            value={currentDay.jam || ''}
            onChange={(e) => updateCurrentDayField('jam', e.target.value)}
            placeholder="07.00 - 12.45 WIT"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Koordinator Piket Utama (Pilih Guru)
          </label>
          <select
            value={currentDay.koordinator || ''}
            onChange={(e) => updateCurrentDayField('koordinator', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            <option value="">-- Pilih Koordinator Guru --</option>
            {teachers.map(t => (
              <option key={t.id} value={t.name}>{t.name} ({t.role || 'Guru'})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          Anggota Guru Pendamping
        </label>
        
        {/* Badges Anggota Terpilih */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px', minHeight: '32px' }}>
          {currentMembers.length > 0 ? (
            currentMembers.map((member) => (
              <span
                key={member}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(18, 165, 184, 0.1)',
                  color: 'var(--primary-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid rgba(18, 165, 184, 0.2)'
                }}
              >
                <span>{member}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#ef4444' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 0' }}>Belum ada anggota yang dipilih.</span>
          )}
        </div>

        {/* Dropdown untuk Tambah Anggota */}
        <select
          value=""
          onChange={(e) => {
            handleAddMember(e.target.value);
            e.target.value = '';
          }}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px dashed #94a3b8', fontSize: '0.85rem', backgroundColor: '#f8fafc', cursor: 'pointer' }}
        >
          <option value="" disabled>+ Pilih Guru dari Daftar untuk Ditambahkan sebagai Anggota...</option>
          {teachers
            .filter(t => t.name !== currentDay.koordinator && !currentMembers.includes(t.name))
            .map(t => (
              <option key={t.id} value={t.name}>{t.name} ({t.role || 'Guru'})</option>
            ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Pos Layanan</label>
        <input
          type="text"
          value={currentDay.posLayanan || ''}
          onChange={(e) => updateCurrentDayField('posLayanan', e.target.value)}
          placeholder="Pintu Gerbang Utama & Ruang Guru"
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Fokus Tugas</label>
        <textarea
          rows="2"
          value={currentDay.tugas || ''}
          onChange={(e) => updateCurrentDayField('tugas', e.target.value)}
          placeholder="Uraian tugas..."
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
        />
      </div>
    </>
  );
}
