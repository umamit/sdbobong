import React from 'react';
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function EventModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    agendaModalOpen,
    editingEvent,
    eventMonth,
    setEventMonth,
    eventDates,
    setEventDates,
    eventDesc,
    setEventDesc,
    handleSaveAgendaEvent,
    setAgendaModalOpen,
    setEditingEvent
  } = context;

  return (
    <>
      {agendaModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '550px', width: '100%', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingEvent ? '✏️ Edit Agenda Kegiatan' : '➕ Tambah Agenda Sekolah Baru'}</h3>
              <button 
                type="button" 
                onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }} 
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveAgendaEvent} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_month" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Bulan & Tahun</label>
                  <input
                    type="text"
                    id="event_month"
                    className="form-control"
                    placeholder="Contoh: Juli 2025"
                    value={eventMonth}
                    onChange={(e) => setEventMonth(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_dates" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Rentang Tanggal</label>
                  <input
                    type="text"
                    id="event_dates"
                    className="form-control"
                    placeholder="Contoh: 14 - 19 Juli 2025"
                    value={eventDates}
                    onChange={(e) => setEventDates(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="event_desc" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Deskripsi Kegiatan</label>
                  <textarea
                    id="event_desc"
                    className="form-control"
                    placeholder="Tulis nama kegiatan akademis atau detail agenda sekolah di sini..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows="3"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem' }} 
                  onClick={() => { setAgendaModalOpen(false); setEditingEvent(null); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  💾 Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
