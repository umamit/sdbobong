'use client';

export default function RpeTable({ activeRpe, semester, totalJm, totalMte, totalMe }) {
  return (
    <div className="rpe-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Analisis Rincian Pekan Efektif (RPE)</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Rekapitulasi perhitungan alokasi waktu efektif belajar mengajar untuk {semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'}.
          </p>
        </div>
        <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', fontWeight: 700 }}>
          {semester === 'ganjil' ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)'}
        </span>
      </div>

      <div className="table-responsive" style={{ border: 'none', boxShadow: 'none', borderRadius: 0, marginBottom: '1.5rem' }}>
        <table className="table-custom" style={{ width: '100%', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>No</th>
              <th>Nama Bulan</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Jumlah Minggu</th>
              <th style={{ width: '180px', textAlign: 'center' }}>Minggu Tidak Efektif</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Minggu Efektif</th>
              <th>Keterangan Kegiatan Penting</th>
            </tr>
          </thead>
          <tbody>
            {activeRpe.map((item, index) => (
              <tr key={item.id}>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{index + 1}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{item.bulan}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.jm} Minggu</td>
                <td style={{ textAlign: 'center', color: item.mte > 0 ? '#b91c1c' : '#64748b', fontWeight: 600 }}>{item.mte} Minggu</td>
                <td style={{ textAlign: 'center', color: 'var(--success-color)', fontWeight: 700 }}>{item.me} Minggu</td>
                <td style={{ fontSize: '0.85rem', color: '#475569' }}>{item.ket}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
              <td colSpan={2} style={{ textAlign: 'right', color: 'var(--primary-dark)' }}>Total Kumulatif:</td>
              <td style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>{totalJm} Minggu</td>
              <td style={{ textAlign: 'center', color: '#b91c1c' }}>{totalMte} Minggu</td>
              <td style={{ textAlign: 'center', color: 'var(--success-color)' }}>{totalMe} Minggu</td>
              <td style={{ fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                Total Hari Belajar Efektif = {totalMe} Pekan Belajar Terstruktur
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: '#f0fdfa', borderRadius: '12px', border: '1px solid #ccfbf1', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h5 style={{ margin: 0, color: '#0f766e', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Kesimpulan Alokasi Waktu Efektif:
        </h5>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#115e59', lineHeight: 1.5 }}>
          Berdasarkan perhitungan di atas, terdapat total <strong>{totalMe} Pekan Efektif</strong> pada {semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'}. 
          Dengan alokasi waktu pembelajaran tatap muka yang tersedia adalah sekitar <strong>{totalMe * 30} JP</strong> untuk menyelesaikan seluruh capaian pembelajaran (CP) Kurikulum Merdeka.
        </p>
      </div>
    </div>
  );
}
