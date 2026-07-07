export default async function sitemap() {
  const baseUrl = 'https://sdnegeribobong.sch.id';
  const now = new Date();

  // =========================================================================
  // PANDUAN PENGEMBANGAN (SEO):
  // Jika menambahkan halaman publik baru, tambahkan ke array pages di bawah.
  // priority: 1.0 = sangat penting → 0.5 = rendah
  // changeFrequency: 'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never'
  // JANGAN masukkan: /admin, /guru, /ppdb-online/sukses, /api/*
  // =========================================================================

  const pages = [
    // ── Halaman Utama ─────────────────────────────────────────────────────
    { route: '',               priority: 1.0, freq: 'weekly'  }, // Beranda
    { route: '/profil',        priority: 0.8, freq: 'monthly' }, // Profil Sekolah
    { route: '/akademik',      priority: 0.8, freq: 'monthly' }, // Info Akademik
    { route: '/kesiswaan',     priority: 0.7, freq: 'monthly' }, // Kesiswaan

    // ── Konten Dinamis ────────────────────────────────────────────────────
    { route: '/berita',        priority: 0.9, freq: 'daily'   }, // Berita & Pengumuman
    { route: '/galeri',        priority: 0.7, freq: 'weekly'  }, // Galeri Foto

    // ── PPDB ──────────────────────────────────────────────────────────────
    { route: '/ppdb',          priority: 0.9, freq: 'monthly' }, // Info PPDB
    { route: '/ppdb-online',   priority: 0.9, freq: 'monthly' }, // Form Pendaftaran Online

    // ── Layanan Publik ────────────────────────────────────────────────────
    { route: '/nilai',         priority: 0.7, freq: 'monthly' }, // Cek Nilai Siswa
    { route: '/kelulusan',     priority: 0.7, freq: 'yearly'  }, // Cek Kelulusan
    { route: '/unduh',         priority: 0.6, freq: 'monthly' }, // Unduh Dokumen
    { route: '/formulir-ppdb', priority: 0.6, freq: 'yearly'  }, // Cetak Formulir PPDB

    // ── Interaksi ─────────────────────────────────────────────────────────
    { route: '/buku-tamu',     priority: 0.6, freq: 'weekly'  }, // Buku Tamu
    { route: '/hubungi-kami',  priority: 0.6, freq: 'yearly'  }, // Kontak
  ];

  return pages.map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
