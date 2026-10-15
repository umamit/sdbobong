'use client';

import { useState, useEffect } from 'react';
import { JADWAL_PIKET_DATA, getPiketHariIni } from '../../data/piketData';

export default function PiketHarianWidget({ operatorPhone = '+6282292111638', piketSchedule = [] }) {
  const [piketToday, setPiketToday] = useState(null);
  const [activeTab, setActiveTab] = useState('today');

  const scheduleList = (Array.isArray(piketSchedule) && piketSchedule.length > 0) ? piketSchedule : JADWAL_PIKET_DATA;

  useEffect(() => {
    setPiketToday(getPiketHariIni(piketSchedule));
  }, [piketSchedule]);

  const cleanPhone = operatorPhone.replace(/[^0-9]/g, '');

  return (
    <div className="card-custom" style={{ padding: 'var(--space-md)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      {/* Header Widget */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(18, 165, 184, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: 800 }}>Guru Piket &amp; Layanan Sekolah</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Penyambutan tamu, surat izin, dan penanganan darurat</span>
          </div>
        </div>

        {/* Tab switcher: Hari Ini vs Sepekan */}
        <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '3px', borderRadius: '8px', gap: '3px', border: '1px solid var(--border-color)' }}>
          <button type="button" onClick={() => setActiveTab('today')} style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'today' ? 'var(--primary)' : 'transparent', color: activeTab === 'today' ? '#ffffff' : 'var(--text-muted)' }}>Hari Ini</button>
          <button type="button" onClick={() => setActiveTab('week')} style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'week' ? 'var(--primary)' : 'transparent', color: activeTab === 'week' ? '#ffffff' : 'var(--text-muted)' }}>Jadwal Sepekan</button>
        </div>
      </div>

      {/* Tab Hari Ini */}
      {activeTab === 'today' && (
        <div>
          {piketToday?.isLibur ? (
            <div style={{ background: 'var(--bg-main, #f8fafc)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Hari Minggu — Libur Sekolah</div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{piketToday.pesan}</p>
            </div>
          ) : (
            <div style={{ background: 'rgba(18, 165, 184, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(18, 165, 184, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'var(--primary)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700 }}>
                  Piket Hari {piketToday?.hari || 'Ini'}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                  {piketToday?.jam}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', marginBottom: '8px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Koordinator Piket:</div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{piketToday?.koordinator}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                  Anggota: {(piketToday?.anggota || []).join(', ')}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Pos Layanan:</strong> {piketToday?.posLayanan}
              </div>

              <a
                href={`https://wa.me/${cleanPhone}?text=Halo%20Bapak%2FIbu%20Guru%20Piket%20SDN%20Bobong%2C%20saya%20wali%20murid%20ingin%20berkonsultasi...`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>Hubungi Guru Piket via WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tab Jadwal Sepekan */}
      {activeTab === 'week' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
          {scheduleList.map((p) => (
            <div key={p.hari} style={{ padding: '8px 10px', background: 'var(--bg-main, #f8fafc)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '2px' }}>
                <span>{p.hari} ({p.jam})</span>
                <span style={{ color: 'var(--secondary)' }}>{p.koordinator}</span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Anggota: {(p.anggota || []).join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
