'use client';



const SUGGESTION_PROMPTS = [
  { label: '🧹 Kerja Bakti / Sabtu Bersih', prompt: 'Kegiatan gotong royong kerja bakti Sabtu Bersih oleh siswa-siswi dan guru untuk membersihkan lingkungan sekolah dan kelas.' },
  { label: '🤝 Rapat Komite Sekolah', prompt: 'Musyawarah koordinasi komite sekolah bersama wali murid untuk membahas program kerja tahunan dan peningkatan sarana prasarana.' },
  { label: '🏆 Lomba Seni & Olahraga', prompt: 'Siswa-siswi SD Negeri Bobong berhasil meraih juara dalam perlombaan seni dan olahraga tingkat kabupaten.' },
  { label: '🩺 Program Imunisasi BIAS', prompt: 'Pelaksanaan kegiatan imunisasi Bulan Imunisasi Anak Sekolah (BIAS) bekerja sama dengan Puskesmas setempat.' },
];

export default function AIDraftGenerator({ aiPrompt, setAiPrompt, isGenerating, onGenerate }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glowing sphere decoration */}
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.8rem', animation: 'float 3s ease-in-out infinite' }}>🪄</span>
        <div>
          <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Asisten Draf Berita AI <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>BETA</span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
            Tulis topik pendek atau pilih template kegiatan di bawah untuk membuat draf berita lengkap dengan bantuan kecerdasan buatan.
          </p>
        </div>
      </div>

      {/* Suggestion tags/pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {SUGGESTION_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setAiPrompt(item.prompt)}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.1)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'; e.target.style.color = '#3b82f6'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.color = '#cbd5e1'; }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Prompt Area */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Tulis topik atau poin berita di sini (misal: Rapat komite membahas pengembangan laboratorium komputer baru)..."
          style={{ width: '100%', minHeight: '80px', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button
          type="button"
          disabled={isGenerating || !aiPrompt.trim()}
          onClick={onGenerate}
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: aiPrompt.trim() ? 'pointer' : 'not-allowed', opacity: aiPrompt.trim() ? 1 : 0.6, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s ease', transform: 'translateY(0)' }}
          onMouseEnter={(e) => { if (aiPrompt.trim() && !isGenerating) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)'; } }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'; }}
        >
          {isGenerating ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
              </svg>
              Merumuskan Draf AI...
            </>
          ) : (
            <><span>✨</span> Buat Draf dengan AI</>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
