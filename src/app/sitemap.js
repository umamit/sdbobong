import { loadNews } from '../lib/database.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function sitemap() {
  const baseUrl = 'https://www.sdnegeribobong.sch.id';
  const now = new Date();

  // =========================================================================
  // Rute halaman publik resmi SD Negeri Bobong (Next.js App Router)
  // JANGAN masukkan: /admin, /guru/login, /guru/dashboard, /login, /api/*
  // =========================================================================

  const pages = [
    // ── Halaman Utama & Profil ─────────────────────────────────────────────
    { route: '',                        priority: 1.0, freq: 'weekly'  }, // Beranda
    { route: '/profil',                 priority: 0.9, freq: 'monthly' }, // Profil Sekolah (Utama)
    { route: '/profil/sejarah',         priority: 0.8, freq: 'monthly' }, // Sejarah Sekolah
    { route: '/profil/visi-misi',       priority: 0.8, freq: 'monthly' }, // Visi & Misi
    { route: '/profil/struktur',        priority: 0.8, freq: 'monthly' }, // Struktur & Dewan Guru
    { route: '/profil/fasilitas',       priority: 0.8, freq: 'monthly' }, // Fasilitas & Denah
    { route: '/profil/standar-pelayanan', priority: 0.8, freq: 'monthly' }, // Standar Pelayanan Publik
    { route: '/akademik',               priority: 0.8, freq: 'monthly' }, // Info Akademik
    { route: '/akademik/kalender',      priority: 0.8, freq: 'monthly' }, // Kalender Pendidikan
    { route: '/akademik/kuis',          priority: 0.8, freq: 'weekly'  }, // Kuis Edukasi (Cerdas Cermat)
    { route: '/kesiswaan',              priority: 0.8, freq: 'monthly' }, // Kesiswaan & Ekstrakurikuler

    // ── Konten Dinamis & Informasi ───────────────────────────────────────
    { route: '/berita',                 priority: 0.8, freq: 'daily'   }, // Berita & Kegiatan
    { route: '/alumni',                 priority: 0.8, freq: 'weekly'  }, // Portal Alumni
    { route: '/galeri',                 priority: 0.8, freq: 'weekly'  }, // Galeri Dokumentasi

    // ── PPDB ──────────────────────────────────────────────────────────────
    { route: '/ppdb',                   priority: 0.9, freq: 'weekly'  }, // Portal PPDB Utama
    { route: '/formulir-ppdb',          priority: 0.9, freq: 'monthly' }, // Formulir PPDB Offline / Cetak
    { route: '/ppdb-online',             priority: 0.9, freq: 'monthly' }, // Pendaftaran PPDB Daring

    // ── Layanan Akademik Siswa & Orang Tua ────────────────────────────────
    { route: '/nilai',                  priority: 0.7, freq: 'monthly' }, // Portal Cek Rapor
    { route: '/kelulusan',              priority: 0.7, freq: 'yearly'  }, // Pengumuman Kelulusan
    { route: '/perpustakaan',           priority: 0.8, freq: 'weekly'  }, // Perpustakaan Digital & Buku SIBI
    { route: '/prestasi',               priority: 0.8, freq: 'monthly' }, // Papan Prestasi Siswa
    { route: '/unduh',                  priority: 0.7, freq: 'monthly' }, // Pusat Unduhan Berkas

    // ── Kontak & Interaksi ────────────────────────────────────────────────
    { route: '/hubungi-kami',           priority: 0.7, freq: 'yearly'  }, // Kontak & Lokasi
    { route: '/buku-tamu',              priority: 0.7, freq: 'weekly'  }, // Buku Tamu Digital
    { route: '/pengaduan',              priority: 0.7, freq: 'monthly' }, // Layanan Pengaduan & Aspirasi
  ];

  const staticEntries = pages.map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
    images: [`${baseUrl}/images/logo_sekolah_512.png`]
  }));

  // Fetch dynamic news articles for sitemap with images
  let newsEntries = [];
  const idMonths = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Ags: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 };
  try {
    const newsList = await loadNews().catch(() => []);
    newsEntries = newsList.map(n => {
      let mDate = now;
      if (n.date) {
        const parsed = new Date(n.date);
        if (!isNaN(parsed.getTime())) {
          mDate = parsed;
        } else {
          const parts = String(n.date).trim().split(/\s+/);
          if (parts.length >= 3) {
            const d = parseInt(parts[0], 10);
            const m = idMonths[parts[1]?.substring(0, 3)];
            const y = parseInt(parts[2], 10);
            if (!isNaN(d) && !isNaN(y) && m !== undefined) {
              mDate = new Date(Date.UTC(y, m, d));
            }
          }
        }
      }
      const itemImages = [];
      if (n.image && !n.image.startsWith('data:')) {
        itemImages.push(n.image.startsWith('http') ? n.image : `${baseUrl}${n.image}`);
      } else {
        itemImages.push(`${baseUrl}/images/logo_sekolah_512.png`);
      }

      return {
        url: `${baseUrl}/berita/${n.id}`,
        lastModified: mDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        images: itemImages
      };
    });
  } catch (e) {
    console.error("Error generating dynamic news sitemap entries:", e);
  }

  return [...staticEntries, ...newsEntries];
}

export default sitemap;
