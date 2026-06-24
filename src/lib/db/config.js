import fs from 'fs';
import { supabase, isSupabaseEnabled, setCachedConfig, WEBSITE_CONFIG_JSON } from './core.js';
import { mergeWithDefaults } from './config.defaults.js';

export async function isTableSeeded(tableName) {
  if (!isSupabaseEnabled()) return true;
  try {
    const { data, error } = await supabase.from("config_sdn_bobong").select("stats").eq("id", "global_config").single();
    if (!error && data && data.stats) return data.stats[`${tableName}_seeded`] === true;
  } catch (e) { console.error(`Error checking seeding status for ${tableName}:`, e); }
  return false;
}

export async function markTableSeeded(tableName) {
  if (!isSupabaseEnabled()) return;
  try {
    const { data, error } = await supabase.from("config_sdn_bobong").select("stats").eq("id", "global_config").single();
    if (!error && data) {
      const stats = data.stats || {};
      stats[`${tableName}_seeded`] = true;
      await supabase.from("config_sdn_bobong").update({ stats }).eq("id", "global_config");
      try {
        if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
          const localConfig = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
          if (!localConfig.stats) localConfig.stats = {};
          localConfig.stats[`${tableName}_seeded`] = true;
          fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(localConfig, null, 4), 'utf-8');
        }
      } catch (fsErr) {}
    }
  } catch (e) { console.error(`Error marking ${tableName} as seeded:`, e); }
}

export async function loadWebConfig() {
  let localConfig = {
    marquee_announcements: [
      "📢 PENGUMUMAN: Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka! Silakan daftar online pada portal PPDB.",
      "📅 INFO: Jadwal Pembagian Rapor Semester Genap dilaksanakan pada 20 Juni 2026.",
      "🌟 PRESTASI: Selamat kepada Tim Pramuka SD Negeri Bobong meraih Juara Harapan 1 Lomba Tingkat Kabupaten!"
    ],
    stats: { siswa_aktif: 205, guru_staf: 14, ruang_kelas: 9, akreditasi: "B" },
    ppdb_contacts: {
      nama_humas: "Ibu Husnita Usman, M.Pd.", wa_humas: "6281234567890",
      jabatan_humas: "Pendidik Bidang Studi / Humas Sekolah",
      nama_operator: "Bapak Kasmudin", wa_operator: "6281234567890",
      jabatan_operator: "Operator Sekolah SD Negeri Bobong",
      email_sekolah: "admin@sdnegeribobong.sch.id"
    },
    downloads: [
      { id: "dl-1", title: "Brosur Informasi PPDB 2026/2027", category: "PPDB", fileUrl: "/files/brosur-ppdb-2026.pdf", date: "2026-05-01" },
      { id: "dl-2", title: "Kalender Akademik 2026/2027", category: "Akademik", fileUrl: "/files/kalender-akademik-2026.pdf", date: "2026-05-15" },
      { id: "dl-3", title: "Formulir Pendaftaran PPDB Offline", category: "PPDB", fileUrl: "/formulir-ppdb", date: "2026-05-01" }
    ],
    faqs: [
      { id: "faq-1", question: "Kapan pendaftaran PPDB online SDN Bobong dibuka?", answer: "Pendaftaran PPDB online SDN Bobong dibuka mulai tanggal 1 Mei hingga 30 Juni 2026 untuk Tahun Ajaran 2026/2027." },
      { id: "faq-2", question: "Apakah pendaftaran di SDN Bobong dipungut biaya?", answer: "Sama sekali tidak. Seluruh proses pendaftaran dan seleksi PPDB di SDN Bobong gratis tanpa biaya apa pun (Rp 0)." },
      { id: "faq-3", question: "Bagaimana cara memeriksa hasil pengumuman kelulusan kelas 6?", answer: "Anda dapat mengunjungi halaman 'Kelulusan' di website ini dan memasukkan nomor NISN atau nomor ujian peserta untuk melihat status kelulusan secara mandiri." }
    ],
    gallery: [
      { id: "gal-1", title: "Upacara Bendera Hari Senin", type: "image", url: "https://qtqqwyicanoszwvkbzwc.supabase.co/storage/v1/object/public/teachers/1780580723652_corey-agopian-5y4ljzRrDFA-unsplash.jpg", date: "2026-05-24" },
      { id: "gal-2", title: "Kegiatan Belajar Mengajar Outdoor", type: "image", url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800", date: "2026-05-18" },
      { id: "gal-3", title: "Lomba Pramuka Tingkat Kabupaten", type: "image", url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800", date: "2026-05-10" }
    ],
    force_local_cache: false
  };

  if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
      localConfig = { ...localConfig, ...loaded };
      if (localConfig.stats?._downloads_fallback && !localConfig.downloads) localConfig.downloads = localConfig.stats._downloads_fallback;
      if (localConfig.stats?._faqs_fallback && !localConfig.faqs) localConfig.faqs = localConfig.stats._faqs_fallback;
      if (localConfig.stats?._gallery_fallback && !localConfig.gallery) localConfig.gallery = localConfig.stats._gallery_fallback;
      if (!localConfig.downloads) localConfig.downloads = [];
      if (!localConfig.faqs) localConfig.faqs = [];
      if (!localConfig.gallery) localConfig.gallery = [];
    } catch (e) { console.error("Error loading local web config:", e); }
  }

  if (supabase && localConfig.force_local_cache !== true) {
    try {
      const { data, error } = await supabase.from("config_sdn_bobong").select("*").eq("id", "global_config").single();
      if (!error && data) {
        const dbConfig = {
          marquee_announcements: data.marquee_announcements || localConfig.marquee_announcements,
          marquee_speed: data.stats?.marquee_speed || data.marquee_speed || localConfig.marquee_speed || 40,
          stats: data.stats || localConfig.stats,
          ppdb_contacts: data.ppdb_contacts || localConfig.ppdb_contacts,
          force_local_cache: data.force_local_cache === true,
          downloads: data.downloads || data.stats?._downloads_fallback || localConfig.downloads || [],
          faqs: data.faqs || data.stats?._faqs_fallback || localConfig.faqs || [],
          gallery: data.gallery || data.stats?._gallery_fallback || localConfig.gallery || []
        };
        const safeDbConfig = mergeWithDefaults(dbConfig);
        setCachedConfig(safeDbConfig);
        try { fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(safeDbConfig, null, 4), 'utf-8'); } catch (e) {}
        return safeDbConfig;
      } else if (error && error.code === 'PGRST116') {
        const seedData = { id: "global_config", marquee_announcements: localConfig.marquee_announcements, stats: localConfig.stats, ppdb_contacts: localConfig.ppdb_contacts, force_local_cache: localConfig.force_local_cache === true };
        try { await supabase.from("config_sdn_bobong").insert({ ...seedData, downloads: localConfig.downloads, faqs: localConfig.faqs, gallery: localConfig.gallery }); }
        catch (e2) { await supabase.from("config_sdn_bobong").insert(seedData); }
      }
    } catch (e) { console.error("Error loading web config from Supabase:", e.message || e); }
  }

  const safeLocalConfig = mergeWithDefaults(localConfig);
  setCachedConfig(safeLocalConfig);
  return safeLocalConfig;
}

export async function saveWebConfig(config) {
  setCachedConfig(config);
  if (!config.stats) config.stats = {};
  config.stats.marquee_speed = config.marquee_speed || 40;
  if (config.downloads !== undefined) config.stats._downloads_fallback = config.downloads;
  else if (config.stats._downloads_fallback === undefined) config.stats._downloads_fallback = [];
  if (config.faqs !== undefined) config.stats._faqs_fallback = config.faqs;
  else if (config.stats._faqs_fallback === undefined) config.stats._faqs_fallback = [];
  if (config.gallery !== undefined) config.stats._gallery_fallback = config.gallery;
  else if (config.stats._gallery_fallback === undefined) config.stats._gallery_fallback = [];

  let localSaved = false;
  try { fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(config, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving config locally:", e); }

  if (isSupabaseEnabled()) {
    try {
      const { error } = await supabase.from("config_sdn_bobong").upsert({
        id: "global_config",
        marquee_announcements: config.marquee_announcements,
        stats: config.stats,
        ppdb_contacts: config.ppdb_contacts,
        force_local_cache: config.force_local_cache === true
      });
      if (error) throw error;
      return true;
    } catch (e) { console.error("Error saving config to Supabase:", e.message || e); return localSaved; }
  }
  return localSaved;
}
