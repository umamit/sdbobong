'use client';

export default function PiketScheduleForm({ currentDay, updateCurrentDayField, teachers = [] }) {
  if (!currentDay) return null;
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Jam Operasional</label>
          <input
            type="text"
            value={currentDay.jam || ''}
            onChange={(e) => updateCurrentDayField('jam', e.target.value)}
            placeholder="07.00 - 12.45 WIT"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Koordinator Piket</label>
          <input
            type="text"
            list="teacher-names-list"
            value={currentDay.koordinator || ''}
            onChange={(e) => updateCurrentDayField('koordinator', e.target.value)}
            placeholder="Pilih nama guru..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Anggota Guru Pendamping (Pisahkan koma)</label>
        <input
          type="text"
          value={Array.isArray(currentDay.anggota) ? currentDay.anggota.join(', ') : (currentDay.anggota || '')}
          onChange={(e) => updateCurrentDayField('anggota', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="Contoh: Guru A, Guru B"
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
        />
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

      <datalist id="teacher-names-list">
        {teachers.map(t => (
          <option key={t.id} value={t.name} />
        ))}
      </datalist>
    </>
  );
}
