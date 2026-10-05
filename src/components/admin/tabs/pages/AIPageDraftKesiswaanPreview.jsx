export function renderKesiswaanPreview(draft) {
  if (draft.mode === 'prestasi' || draft.rank) {
    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Peringkat</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700, color: '#047857' }}>{draft.rank}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Tingkat Lomba</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{draft.level}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Nama Kejuaraan</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>{draft.title}</div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Detail / Deskripsi Prestasi</label>
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}>{draft.desc}</div>
        </div>
      </>
    );
  }

  if (draft.mode === 'karya' || (draft.category && draft.title && !draft.rank)) {
    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Nama Judul Karya</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>{draft.title}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Kategori / Tema (P5)</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, color: '#0284c7' }}>{draft.category}</div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Penjelasan Ringkas Karya</label>
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}>{draft.desc}</div>
        </div>
      </>
    );
  }

  if (draft.nama) {
    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Nama Ekskul Baru</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>{draft.nama}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Jadwal Latihan</label>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{draft.jadwal}</div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Deskripsi Kegiatan</label>
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}>{draft.deskripsi}</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Banner Kesiswaan</label>
      <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>{draft.banner_title}</div>
      <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '6px', fontSize: '0.88rem' }}>{draft.banner_text}</div>
    </div>
  );
}
