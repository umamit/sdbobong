'use client';

const PAGE_TEMPLATES = {
  beranda: [
    { label: 'Sambutan Tahun Ajaran Baru', prompt: 'Buatkan sambutan hangat kepala sekolah menyambut tahun ajaran baru yang fokus pada karakter dan prestasi di SDN Bobong.' },
    { label: 'Pembaruan Visi Pendidikan', prompt: 'Tuliskan kutipan inspiratif dan pesan kepala sekolah tentang pentingnya kolaborasi guru dan orang tua murid.' }
  ],
  profil: [
    { label: 'Perumusan Visi Misi Baru', prompt: 'Rumuskan visi sekolah yang cerdas dan berbudaya, serta 5 poin misi penguatan karakter Profil Pelajar Pancasila.' },
    { label: 'Sejarah Singkat SDN Bobong', prompt: 'Tuliskan sejarah ringkas berdiri dan berkembangnya SD Negeri Bobong sebagai sekolah rujukan di Pulau Taliabu.' }
  ],
  akademik: [
    { label: 'Panduan Kurikulum Merdeka', prompt: 'Buatkan penjelasan komprehensif implementasi Kurikulum Merdeka dan Proyek P5 di SD Negeri Bobong.' },
    { label: 'Tata Tertib Pembelajaran', prompt: 'Susun poin tata tertib kehadiran, kerapian seragam, dan kedisiplinan siswa di kelas.' }
  ],
  kesiswaan: [
    { label: 'Karya Siswa & Proyek P5', prompt: 'Buatkan draf karya siswa baru: Miniatur Perahu Tradisional Taliabu, Proyek P5 Kearifan Lokal Kelas 4, dibuat dari anyaman pelepah sagu dan bambu.' },
    { label: 'Prestasi Juara Lomba Murid', prompt: 'Catat prestasi murid baru: Juara 1 Lomba Pidato Bahasa Indonesia Tingkat Kabupaten Pulau Taliabu Tahun 2026 yang diraih oleh siswa kelas 5.' },
    { label: 'Ekskul Klub Robotik & AI', prompt: 'Buatkan profil kegiatan ekskul baru: Klub Robotik & Komputer Cilik, jadwal latihan Jumat sore, melatih logika dasar.' },
    { label: 'Ekskul Seni Tari Daerah', prompt: 'Buatkan profil ekskul Seni Tari Tradisional Maluku Utara untuk melestarikan tarian khas daerah Pulau Taliabu.' }
  ],
  ppdb: [
    { label: 'Pengumuman Pembukaan PPDB', prompt: 'Buatkan teks sambutan resmi pembukaan pendaftaran peserta didik baru (PPDB) online & offline di SDN Bobong.' },
    { label: 'Persyaratan & Alur Seleksi', prompt: 'Susun rincian berkas persyaratan administrasi dan 4 tahapan alur penerimaan siswa baru.' }
  ]
};

export default function AIPageDraftGenerator({ subTab, aiPrompt, setAiPrompt, isGenerating, onGenerate }) {
  const templates = PAGE_TEMPLATES[subTab] || PAGE_TEMPLATES.beranda;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.5) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 'var(--space-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: '#60a5fa' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
        </span>
        <div>
          <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Asisten AI Konten Halaman <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>BETA</span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', marginTop: '2px' }}>
            Rumuskan teks deskripsi, sambutan, materi kurikulum, atau kegiatan baru untuk halaman <strong>{subTab.toUpperCase()}</strong>.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {templates.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setAiPrompt(item.prompt)}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600, color: '#f1f5f9', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder={`Tulis instruksi atau ide konten untuk halaman ${subTab} di sini...`}
          className="ai-prompt-input"
          style={{ width: '100%', minHeight: '76px', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button
          type="button"
          disabled={isGenerating || !aiPrompt.trim()}
          onClick={onGenerate}
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: aiPrompt.trim() ? 'pointer' : 'not-allowed', opacity: aiPrompt.trim() ? 1 : 0.6 }}
        >
          {isGenerating ? 'Merumuskan Konten AI...' : 'Buat Konten dengan AI'}
        </button>
      </div>

      <style jsx>{`
        .ai-prompt-input::placeholder {
          color: #94a3b8 !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
