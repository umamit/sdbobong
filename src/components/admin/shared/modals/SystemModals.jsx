import React from 'react';
import { useAdminDashboard } from '../../../../app/admin/dashboard/AdminDashboardContext';

export default function SystemModals() {
  const context = useAdminDashboard();
  if (!context) return null;

  const {
    isPurgeModalOpen,
    setIsPurgeModalOpen,
    purgeLogsConfirmation,
    setPurgeLogsConfirmation,
    handlePurgeAuditLogs
  } = context;

  return (
    <>
      {/* ================= MODAL: PURGE AUDIT LOGS ================= */}
      {isPurgeModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', zIndex: 1100, justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
          <div className="modal-content animate-slideUp" style={{ backgroundColor: '#1e293b', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ Kosongkan Jurnal Jejak Audit</h3>
              <button 
                type="button" 
                onClick={() => { setIsPurgeModalOpen(false); setPurgeLogsConfirmation(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handlePurgeAuditLogs} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', lineHeight: '1.5' }}>
                <strong>PERINGATAN KERAS!</strong> Tindakan ini akan menghapus seluruh rekaman jejak audit selamanya dari server (termasuk Supabase DB jika aktif). Tindakan ini tidak dapat dibatalkan.
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="purge_confirm" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Ketik frasa di bawah ini untuk mengonfirmasi:
                </label>
                <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em', marginBottom: '8px', padding: '0.45rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '6px', textAlign: 'center', userSelect: 'none' }}>
                  KOSONGKAN JURNAL AUDIT
                </div>
                <input
                  type="text"
                  id="purge_confirm"
                  className="form-control"
                  placeholder="Ketik persis frasa di atas..."
                  value={purgeLogsConfirmation}
                  onChange={(e) => setPurgeLogsConfirmation(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn-action-view" 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }} 
                  onClick={() => { setIsPurgeModalOpen(false); setPurgeLogsConfirmation(''); }}
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="btn-action-delete" 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                  disabled={purgeLogsConfirmation !== 'KOSONGKAN JURNAL AUDIT'}
                >
                  🧹 Kosongkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
