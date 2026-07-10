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
    { route: '',                        priority: 1.0, freq: 'weekly'  }, // Beranda
    { route: '/profil',                 priority: 0.8, freq: 'monthly' }, // Profil Sekolah
    { route: '/akademik',               priority: 0.8, freq: 'monthly' }, // Info Akademik
    { route: '/kesiswaan',              priority: 0.7, freq: 'monthly' }, // Kesiswaan

    // ── Konten Dinamis ────────────────────────────────────────────────────
    { route: '/berita',                 priority: 0.9, freq: 'daily'   }, // Berita & Kegiatan
    { route: '/galeri',                 priority: 0.7, freq: 'weekly'  }, // Galeri Sekolah

    // ── PPDB ──────────────────────────────────────────────────────────────
    { route: '/ppdb',                   priority: 0.9, freq: 'monthly' }, // Info PPDB
    { route: '/ppdb/daftar',            priority: 0.9, freq: 'monthly' }, // Formulir Pendaftaran Online
    { route: '/ppdb/cetak',             priority: 0.6, freq: 'yearly'  }, // Formulir Offline / Cetak

    // ── Layanan Publik ────────────────────────────────────────────────────
    { route: '/akademik/nilai',         priority: 0.7, freq: 'monthly' }, // Portal Cek Rapor
    { route: '/akademik/kelulusan',     priority: 0.7, freq: 'yearly'  }, // Pengumuman Kelulusan
    { route: '/unduh',                  priority: 0.6, freq: 'monthly' }, // Pusat Unduhan

    // ── Kontak & Interaksi ────────────────────────────────────────────────
    { route: '/kontak',                 priority: 0.6, freq: 'yearly'  }, // Hubungi Kami
    { route: '/kontak/buku-tamu',       priority: 0.6, freq: 'weekly'  }, // Buku Tamu
  ];

  return pages.map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
