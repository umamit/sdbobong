'use client';

export default function ExistingPhotosManager({ existingImages, onRemoveImage }) {
  if (!existingImages || existingImages.length === 0) return null;

  return (
    <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Foto Galeri Saat Ini ({existingImages.length}):
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px' }}>
        {existingImages.map((imgUrl, index) => (
          <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <img src={imgUrl} alt={`Foto lama ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.95)', color: '#ffffff', border: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}
              title="Hapus foto ini dari galeri berita"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', margin: '6px 0 0 0' }}>
        Klik tombol silang pada foto untuk menghapusnya dari postingan berita.
      </p>
    </div>
  );
}
