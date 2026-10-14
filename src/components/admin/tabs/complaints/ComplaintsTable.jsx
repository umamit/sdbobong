'use client';

export default function ComplaintsTable({ filtered = [], onOpenDetail, onDeleteComplaint }) {
  if (filtered.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Belum ada laporan pengaduan yang sesuai filter.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
            <th style={{ padding: '12px 16px' }}>Nomor Tiket</th>
            <th style={{ padding: '12px 16px' }}>Kategori</th>
            <th style={{ padding: '12px 16px' }}>Pelapor</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px' }}>Tanggal</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => {
            const isDone = c.status === 'Selesai';
            const isProcess = c.status === 'Diproses';
            const statusBg = isDone ? '#dcfce7' : isProcess ? '#fef9c3' : '#fee2e2';
            const statusColor = isDone ? '#15803d' : isProcess ? '#a16207' : '#b91c1c';

            return (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                  {c.ticket_code}
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>
                  {c.category}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {c.is_anonymous ? (
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                      Rahasia / Anonim
                    </span>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.reporter_name || 'Warga Sekolah'}</div>
                      {c.reporter_phone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.reporter_phone}</div>}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', background: statusBg, color: statusColor, fontSize: '0.75rem', fontWeight: 700 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.8rem' }}>
                  {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(c)}
                    style={{ padding: '6px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginRight: '6px' }}
                  >
                    Tanggapi
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteComplaint(c.id)}
                    style={{ padding: '6px 10px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
