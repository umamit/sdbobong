/**
 * config.defaults.js — Single Source of Truth untuk Shape Config
 *
 * TUJUAN:
 *   Setiap kali struktur config berubah (tambah field, rename key, dst.),
 *   cukup update file ini. Tidak perlu berburu ke 21+ file yang pakai config.
 *
 * CARA PAKAI:
 *   import { mergeWithDefaults, DEFAULT_CONFIG, DEFAULT_STATS, DEFAULT_PAGE_CONTENTS } from '@/lib/db/config.defaults';
 *   const config = mergeWithDefaults(rawConfig);
 *
 * ATURAN:
 *   - Semua key WAJIB ada di sini dengan nilai default yang aman (tidak undefined).
 *   - Nilai default hanya untuk fallback — DB/Supabase tetap jadi sumber utama.
 *   - Jangan taruh logika bisnis di sini, hanya shape & nilai kosong/default.
 */

// ===========================================================================
// DEFAULT: stats.page_contents — konten teks tiap halaman publik
// ===========================================================================
export const DEFAULT_PAGE_CONTENTS = {
  beranda: {
    hero_subtitle: 'Membangun Masa Depan di Jantung Taliabu',
    hero_title: 'Selamat Datang di Website Resmi SD Negeri Bobong',
    hero_text: '"Cerdas, Berkarakter, dan Berbudaya." Kami berkomitmen menyelenggarakan pendidikan dasar yang inklusif, adaptif, dan berlandaskan kearifan lokal di Kabupaten Pulau Taliabu.',
    welcome_badge: 'Sambutan Kepala Sekolah',
    welcome_title: 'Mendidik dengan Hati dan Budaya Taliabu',
    welcome_quote: '"Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan lentera karakter anak agar siap bersaing tanpa melupakan akar budaya leluhurnya."',
    welcome_p1: 'Assalamualaikum Wr. Wb., Salam Sejahtera untuk kita semua. Selamat datang di website resmi SD Negeri Bobong.',
    welcome_p2: 'Sebagai sekolah yang berada di pusat ibukota Kabupaten Pulau Taliabu, kami berkomitmen untuk terus berinovasi dalam mengimplementasikan kurikulum nasional yang relevan dengan perkembangan zaman.',
  },
  profil: {
    banner_title: 'Profil Sekolah',
    banner_text: 'Mengenal lebih dekat SD Negeri Bobong — visi, misi, sejarah, dan fasilitas.',
    npsn: '60200589',
    tahun_berdiri: '1978',
    status: 'Negeri',
    akreditasi: 'B',
    kurikulum: 'Kurikulum Merdeka',
    kepala_sekolah: '',
    nip_kepala: '',
    visi: '',
    misi: [],
    sejarah: '',
  },
  akademik: {
    banner_title: 'Akademik',
    banner_text: 'Informasi kurikulum, jadwal, dan program akademik SD Negeri Bobong.',
  },
  kesiswaan: {
    banner_title: 'Kesiswaan',
    banner_text: 'Ekstrakurikuler, prestasi, dan karya siswa SD Negeri Bobong.',
    ekstrakurikuler: [],
    prestasi: [],
    karya: [],
  },
  ppdb: {
    banner_title: 'Penerimaan Peserta Didik Baru',
    banner_text: 'Informasi lengkap PPDB SD Negeri Bobong.',
    syarat: [],
    jadwal: [],
  },
};

// ===========================================================================
// DEFAULT: config.stats — statistik sekolah & pengaturan sistem
// ===========================================================================
export const DEFAULT_STATS = {
  // Statistik utama
  siswa_aktif: 205,
  guru_staf: 14,
  ruang_kelas: 9,
  akreditasi: 'B',
  rombel: 6,
  uks: 1,
  gudang: 1,
  toilet: 2,
  cuci_tangan: 4,

  // Pengaturan tampilan
  hero_background: '',       // URL gambar/video hero (kosong = gradient default)
  allow_copy: false,         // Izinkan copy-paste konten publik
  maintenance_mode: false,   // Mode pemeliharaan
  marquee_speed: 40,         // Kecepatan teks berjalan (detik)
  visitor_count: 0,          // Counter pengunjung

  // Fallback data (diisi otomatis oleh saveWebConfig)
  _downloads_fallback: [],
  _faqs_fallback: [],
  _gallery_fallback: [],

  // Konten halaman (sub-objek per halaman)
  page_contents: DEFAULT_PAGE_CONTENTS,
};

// ===========================================================================
// DEFAULT: config — shape lengkap objek config website
// ===========================================================================
export const DEFAULT_CONFIG = {
  marquee_announcements: [
    '📢 PENGUMUMAN: Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka!',
    '📅 INFO: Jadwal Pembagian Rapor Semester Genap dilaksanakan pada 20 Juni 2026.',
    '🌟 PRESTASI: Selamat kepada Tim Pramuka SD Negeri Bobong meraih Juara Harapan 1!',
  ],
  marquee_speed: 40,
  stats: DEFAULT_STATS,
  ppdb_contacts: {
    nama_humas: 'Belum diset admin',
    wa_humas: '',
    jabatan_humas: '',
    wa_floating: '',
    nama_operator: 'Belum diset admin',
    wa_operator: '',
    jabatan_operator: '',
    email_sekolah: 'admin@sdnegeribobong.sch.id',
  },
  downloads: [],
  faqs: [],
  gallery: [],
  force_local_cache: false,

  // Security (diisi oleh admin, bukan publik)
  suspicious_attempts: [],
  manual_blacklist: [],
  security_settings: {},
};

// ===========================================================================
// HELPER: mergeWithDefaults
// Merge config dari DB/file dengan DEFAULT_CONFIG secara aman (deep merge).
// Gunakan ini di setiap page/component yang butuh config lengkap.
// ===========================================================================
export function mergeWithDefaults(rawConfig = {}) {
  // Normalize suspicious_attempts: pastikan selalu array (bisa jadi objek {} dari data lama)
  let normalizedAttempts = rawConfig.suspicious_attempts;
  if (!normalizedAttempts || !Array.isArray(normalizedAttempts)) {
    normalizedAttempts = [];
  }

  const merged = {
    ...DEFAULT_CONFIG,
    ...rawConfig,
    suspicious_attempts: normalizedAttempts,
    stats: {
      ...DEFAULT_STATS,
      ...(rawConfig.stats || {}),
      page_contents: {
        ...DEFAULT_PAGE_CONTENTS,
        ...(rawConfig.stats?.page_contents || {}),
        // Deep merge per halaman agar satu halaman tidak menghapus default halaman lain
        beranda: { ...DEFAULT_PAGE_CONTENTS.beranda, ...(rawConfig.stats?.page_contents?.beranda || {}) },
        profil:  { ...DEFAULT_PAGE_CONTENTS.profil,  ...(rawConfig.stats?.page_contents?.profil  || {}) },
        akademik:  { ...DEFAULT_PAGE_CONTENTS.akademik,  ...(rawConfig.stats?.page_contents?.akademik  || {}) },
        kesiswaan: { ...DEFAULT_PAGE_CONTENTS.kesiswaan, ...(rawConfig.stats?.page_contents?.kesiswaan || {}) },
        ppdb:      { ...DEFAULT_PAGE_CONTENTS.ppdb,      ...(rawConfig.stats?.page_contents?.ppdb      || {}) },
      },
    },
    ppdb_contacts: {
      ...DEFAULT_CONFIG.ppdb_contacts,
      ...(rawConfig.ppdb_contacts || {}),
    },
  };
  return merged;
}

/**
 * PANDUAN PENGEMBANGAN:
 *
 * Tambah field baru di config?
 *   1. Tambahkan di DEFAULT_CONFIG atau DEFAULT_STATS dengan nilai default yang aman.
 *   2. Tidak perlu update 21 file lain — mergeWithDefaults() otomatis menyebarkan default.
 *
 * Rename key lama?
 *   1. Tambah alias di mergeWithDefaults() untuk backward compatibility.
 *   2. Hapus alias setelah semua data di DB sudah dimigrasikan.
 *
 * Tambah halaman baru dengan konten dinamis?
 *   1. Tambah entry di DEFAULT_PAGE_CONTENTS.
 *   2. Tambah deep merge di mergeWithDefaults() → stats.page_contents.
 */
