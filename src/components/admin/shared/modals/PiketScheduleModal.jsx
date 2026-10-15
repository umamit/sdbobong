'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { JADWAL_PIKET_DATA } from '../../../../data/piketData';
import PiketScheduleForm from './PiketScheduleForm';

export default function PiketScheduleModal({ isOpen, onClose, config, teachers = [], onSaveSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      const existing = (Array.isArray(config?.piket_schedule) && config.piket_schedule.length > 0)
        ? config.piket_schedule
        : JADWAL_PIKET_DATA;
      setSchedule(JSON.parse(JSON.stringify(existing)));
    }
  }, [isOpen, config]);

  if (!isOpen || !mounted) return null;

  const currentDay = schedule.find(s => s.hariIndex === selectedDayIndex) || schedule[0];

  const updateCurrentDayField = (field, value) => {
    setSchedule(prev => prev.map(s => s.hariIndex === selectedDayIndex ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: 'piket_schedule', piket_schedule: schedule })
      });
      const data = await res.json();
      if (res.ok) {
        if (onSaveSuccess) onSaveSuccess(schedule);
        onClose();
      } else {
        alert(data.error || 'Gagal menyimpan jadwal piket.');
      }
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '720px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Header Modal */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>Kelola Jadwal Piket &amp; Kontak Guru</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Atur guru piket harian, jam tugas, dan pos layanan sekolah.</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#94a3b8' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', background: '#f8fafc', padding: '10px 24px', borderBottom: '1px solid #e2e8f0', gap: '8px', overflowX: 'auto' }}>
          {schedule.map(s => (
            <button key={s.hari} type="button" onClick={() => setSelectedDayIndex(s.hariIndex)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', background: selectedDayIndex === s.hariIndex ? 'var(--primary)' : '#ffffff', color: selectedDayIndex === s.hariIndex ? '#ffffff' : '#475569', boxShadow: selectedDayIndex === s.hariIndex ? '0 2px 4px rgba(18, 165, 184, 0.25)' : 'none' }}>
              {s.hari}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PiketScheduleForm currentDay={currentDay} updateCurrentDayField={updateCurrentDayField} teachers={teachers} />
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
          <button type="button" onClick={() => { if (confirm('Kembalikan susunan jadwal ke pengaturan standar sekolah?')) setSchedule(JSON.parse(JSON.stringify(JADWAL_PIKET_DATA))); }} style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Reset ke Default
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
            <button type="button" onClick={handleSave} disabled={isSaving} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer' }}>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
