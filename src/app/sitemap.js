export default async function sitemap() {
  const baseUrl = 'https://sdnegeribobong.sch.id';
  const now = new Date();

  // =========================================================================
  // Rute halaman publik resmi SD Negeri Bobong (Next.js App Router)
  // JANGAN masukkan: /admin, /guru, /login, /ppdb-online/sukses, /api/*
  // =========================================================================

  const pages = [
    // ── Halaman Utama & Profil ─────────────────────────────────────────────
    { route: '',                        priority: 1.0, freq: 'weekly'  }, // Beranda
    { route: '/profil',                 priority: 0.9, freq: 'monthly' }, // Profil Sekolah
    { route: '/akademik',               priority: 0.8, freq: 'monthly' }, // Info Akademik
    { route: '/akademik/kalender',      priority: 0.8, freq: 'monthly' }, // Kalender Pendidikan
    { route: '/kesiswaan',              priority: 0.8, freq: 'monthly' }, // Kesiswaan & Ekstrakurikuler

    // ── Konten Dinamis & Informasi ───────────────────────────────────────
    { route: '/berita',                 priority: 0.8, freq: 'daily'   }, // Berita & Kegiatan
    { route: '/galeri',                 priority: 0.8, freq: 'weekly'  }, // Galeri Dokumentasi

    // ── PPDB ──────────────────────────────────────────────────────────────
    { route: '/ppdb',                   priority: 0.9, freq: 'weekly'  }, // Portal PPDB Utama
    { route: '/formulir-ppdb',          priority: 0.9, freq: 'monthly' }, // Formulir PPDB Offline / Cetak
    { route: '/ppdb-online',             priority: 0.9, freq: 'monthly' }, // Pendaftaran PPDB Daring

    // ── Layanan Akademik Siswa & Orang Tua ────────────────────────────────
    { route: '/nilai',                  priority: 0.7, freq: 'monthly' }, // Portal Cek Rapor
    { route: '/kelulusan',              priority: 0.7, freq: 'yearly'  }, // Pengumuman Kelulusan
    { route: '/unduh',                  priority: 0.7, freq: 'monthly' }, // Pusat Unduhan Berkas

    // ── Kontak & Interaksi ────────────────────────────────────────────────
    { route: '/hubungi-kami',           priority: 0.7, freq: 'yearly'  }, // Kontak & Lokasi
    { route: '/buku-tamu',              priority: 0.7, freq: 'weekly'  }, // Buku Tamu Digital
  ];

  return pages.map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
