import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// Initialize Supabase Client with no-store fetch option to prevent Next.js 14 from caching database queries
export const supabase = (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("your-project-id"))
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      }
    })
  : null;

// Paths to local JSON configuration and caching databases
const BUNDLED_DATA_DIR = path.join(process.cwd(), 'data');
let DATA_DIR = BUNDLED_DATA_DIR;

// Detect read-only serverless environment (Vercel, Netlify, AWS Lambda)
const isServerless = !!(
  process.env.VERCEL ||
  process.env.NOW_BUILDER ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.AWS_EXECUTION_ENV ||
  process.env.NETLIFY
);

if (isServerless) {
  DATA_DIR = '/tmp/sdn-bobong-data';
}

// Ensure the directory exists and copy initial files if in serverless /tmp env
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (isServerless) {
    const filesToCopy = [
      'website_config.json',
      'news.json',
      'teachers.json',
      'pendaftaran.json',
      'achievements.json',
      'messages.json',
      'graduation.json',
      'students.json'
    ];
    filesToCopy.forEach(file => {
      const srcPath = path.join(BUNDLED_DATA_DIR, file);
      const destPath = path.join(DATA_DIR, file);
      if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
        try {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied bundled ${file} to serverless temp directory: ${destPath}`);
        } catch (copyErr) {
          console.error(`Failed to copy ${file} to /tmp:`, copyErr);
        }
      }
    });
  }
} catch (err) {
  console.error("Error initializing database data directory:", err);
}

export const WEBSITE_CONFIG_JSON = path.join(DATA_DIR, 'website_config.json');
export const NEWS_JSON = path.join(DATA_DIR, 'news.json');
export const TEACHERS_JSON = path.join(DATA_DIR, 'teachers.json');
export const PENDAFTARAN_JSON = path.join(DATA_DIR, 'pendaftaran.json');
export const ACHIEVEMENTS_JSON = path.join(DATA_DIR, 'achievements.json');
export const MESSAGES_JSON = path.join(DATA_DIR, 'messages.json');
export const GRADUATION_JSON = path.join(DATA_DIR, 'graduation.json');
export const STUDENTS_JSON = path.join(DATA_DIR, 'students.json');

// --- Helper Utilities ---

export async function handlePhotoUpload(fileObj, bucketName = 'teachers', allowedExts = ['png', 'jpg', 'jpeg']) {
  if (!fileObj || typeof fileObj === 'string' || !fileObj.name) {
    return "NO_FILE";
  }

  const extension = fileObj.name.split('.').pop().toLowerCase();
  if (!allowedExts.includes(extension)) {
    return "INVALID_TYPE";
  }

  const secureName = fileObj.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = Date.now().toString();
  const uniqueFilename = `${uniquePrefix}_${secureName}`;

  // 1. Try to upload to Supabase Storage
  if (isSupabaseEnabled()) {
    try {
      const arrayBuffer = await fileObj.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFilename, buffer, {
          contentType: fileObj.type,
          upsert: true
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueFilename);

      console.log(`File uploaded to Supabase Storage: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.error(`Supabase Storage upload to ${bucketName} failed:`, e.message || e, `. Falling back to local upload.`);
    }
  }

  // 2. Local Fallback
  try {
    const arrayBuffer = await fileObj.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);
    return `/images/uploads/${uniqueFilename}`;
  } catch (e) {
    console.error("Local file save failed:", e);
    return "ERROR";
  }
}

export function anonymizeName(name) {
  if (!name) return "***";
  name = name.trim();
  if (name.length <= 2) return name + "***";
  return name.substring(0, 2) + "***";
}

export function cleanAddress(address) {
  if (!address) return "Pulau Taliabu";
  const addressLower = address.toLowerCase();

  // Match villages/subdistricts pattern
  const match = addressLower.match(/\b(desa|kelurahan|dusun)\s+([a-zA-Z\s]+)/);
  if (match) {
    const extracted = match[0].trim();
    const words = extracted.split(/\s+/);
    if (words.length > 3) {
      return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  // Fallback to village names
  const villages = ['wayo', 'bobong', 'rongi', 'kilong', 'talo', 'walo', 'kilo', 'pencado', 'limbo'];
  for (const v of villages) {
    if (addressLower.includes(v)) {
      return `Desa ${v.charAt(0).toUpperCase() + v.slice(1)}`;
    }
  }

  // Fallback splitting by comma
  const parts = address.split(',');
  if (parts.length > 0) {
    const firstPart = parts[0].trim();
    const words = firstPart.split(/\s+/);
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return firstPart;
  }
  return "Pulau Taliabu";
}

export function formatWaktuDaftar(rawWaktu) {
  if (!rawWaktu) return "";
  try {
    const cleanTime = rawWaktu.split('.')[0].split('+')[0].replace('T', ' ');
    const dt = new Date(cleanTime.replace(/-/g, '/'));
    if (isNaN(dt.getTime())) return rawWaktu.substring(0, 16);

    const day = String(dt.getDate()).padStart(2, '0');
    const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = monthsId[dt.getMonth()];
    const year = dt.getFullYear();
    const hour = String(dt.getHours()).padStart(2, '0');
    const minute = String(dt.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hour}:${minute} WIT`;
  } catch (e) {
    return rawWaktu.substring(0, 16);
  }
}

// --- Data Loading and Saving Helpers ---

let cachedConfig = null;

export async function loadWebConfig() {

  let localConfig = {
    marquee_announcements: [
      "📢 PENGUMUMAN: Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka! Silakan daftar online pada portal PPDB.",
      "📅 INFO: Jadwal Pembagian Rapor Semester Genap dilaksanakan pada 20 Juni 2026.",
      "🌟 PRESTASI: Selamat kepada Tim Pramuka SD Negeri Bobong meraih Juara Harapan 1 Lomba Tingkat Kabupaten!"
    ],
    stats: {
      siswa_aktif: 205,
      guru_staf: 14,
      ruang_kelas: 9,
      akreditasi: "B"
    },
    ppdb_contacts: {
      nama_humas: "Ibu Husnita Usman, M.Pd.",
      wa_humas: "6281234567890",
      jabatan_humas: "Pendidik Bidang Studi / Humas Sekolah",
      nama_operator: "Bapak Kasmudin",
      wa_operator: "6281234567890",
      jabatan_operator: "Operator Sekolah SD Negeri Bobong",
      email_sekolah: "sdn.bobong.taliabu@gmail.com"
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
      if (localConfig.stats?._downloads_fallback && !localConfig.downloads) {
        localConfig.downloads = localConfig.stats._downloads_fallback;
      }
      if (localConfig.stats?._faqs_fallback && !localConfig.faqs) {
        localConfig.faqs = localConfig.stats._faqs_fallback;
      }
      if (localConfig.stats?._gallery_fallback && !localConfig.gallery) {
        localConfig.gallery = localConfig.stats._gallery_fallback;
      }
      if (!localConfig.downloads) localConfig.downloads = [];
      if (!localConfig.faqs) localConfig.faqs = [];
      if (!localConfig.gallery) localConfig.gallery = [];
    } catch (e) {
      console.error("Error loading local web config:", e);
    }
  }

  if (supabase && localConfig.force_local_cache !== true) {
    try {
      const { data, error } = await supabase
        .from("config_sdn_bobong")
        .select("*")
        .eq("id", "global_config")
        .single();
      
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
        cachedConfig = dbConfig;
        
        try {
          fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(dbConfig, null, 4), 'utf-8');
        } catch (e) {}
        
        return dbConfig;
      } else if (error && error.code === 'PGRST116') {
        console.log("Config record not found in Supabase. Seeding config...");
        const seedData = {
          id: "global_config",
          marquee_announcements: localConfig.marquee_announcements,
          stats: localConfig.stats,
          ppdb_contacts: localConfig.ppdb_contacts,
          force_local_cache: localConfig.force_local_cache === true
        };
        try {
          await supabase.from("config_sdn_bobong").insert({
            ...seedData,
            downloads: localConfig.downloads,
            faqs: localConfig.faqs,
            gallery: localConfig.gallery
          });
        } catch (e2) {
          await supabase.from("config_sdn_bobong").insert(seedData);
        }
      }
    } catch (e) {
      console.error("Error loading web config from Supabase:", e.message || e);
    }
  }

  cachedConfig = localConfig;
  return localConfig;
}

export async function isTableSeeded(tableName) {
  if (!isSupabaseEnabled()) return true;
  try {
    const { data, error } = await supabase
      .from("config_sdn_bobong")
      .select("stats")
      .eq("id", "global_config")
      .single();
    if (!error && data && data.stats) {
      return data.stats[`${tableName}_seeded`] === true;
    }
  } catch (e) {
    console.error(`Error checking seeding status for ${tableName}:`, e);
  }
  return false;
}

export async function markTableSeeded(tableName) {
  if (!isSupabaseEnabled()) return;
  try {
    const { data, error } = await supabase
      .from("config_sdn_bobong")
      .select("stats")
      .eq("id", "global_config")
      .single();
    if (!error && data) {
      const stats = data.stats || {};
      stats[`${tableName}_seeded`] = true;
      await supabase
        .from("config_sdn_bobong")
        .update({ stats })
        .eq("id", "global_config");
      
      try {
        if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
          const localConfig = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
          if (!localConfig.stats) localConfig.stats = {};
          localConfig.stats[`${tableName}_seeded`] = true;
          fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(localConfig, null, 4), 'utf-8');
        }
      } catch (fsErr) {}
    }
  } catch (e) {
    console.error(`Error marking ${tableName} as seeded:`, e);
  }
}

let cachedSupabaseColumns = null;

export async function getAvailableSupabaseColumns() {
  if (cachedSupabaseColumns) return cachedSupabaseColumns;
  
  const defaultColumns = [
    'id', 'nama_lengkap', 'nik_siswa', 'tempat_lahir', 'tanggal_lahir', 
    'jenis_kelamin', 'nama_ibu_kandung', 'nomor_hp_orangtua', 'alamat_domisili', 
    'jalur_ppdb', 'waktu_daftar', 'status'
  ];
  
  if (!supabase || !isSupabaseEnabled()) {
    cachedSupabaseColumns = defaultColumns;
    return defaultColumns;
  }
  
  try {
    const newColumns = [
      'nama_panggilan', 'agama', 'anak_ke', 'dari_bersaudara', 
      'nama_ayah', 'pekerjaan_ayah', 'no_hp_ayah', 
      'pekerjaan_ibu', 'no_hp_ibu', 
      'nama_wali', 'pekerjaan_wali', 'tahun_ajaran',
      'berkas_kk', 'berkas_akta', 'berkas_ktp', 'berkas_sptjm', 'berkas_kip', 'berkas_ijazah'
    ];
    
    // Test all new columns at once to minimize queries
    const colsToProbe = newColumns.join(', ');
    const { error: probeError } = await supabase.from("ppdb_sdn_bobong")
      .select(`id, ${colsToProbe}`)
      .limit(0);
      
    if (!probeError) {
      cachedSupabaseColumns = [...defaultColumns, ...newColumns];
      return cachedSupabaseColumns;
    } else {
      // Test one-by-one to support partially upgraded tables
      const existing = [...defaultColumns];
      for (const col of newColumns) {
        const { error: colError } = await supabase.from("ppdb_sdn_bobong").select(col).limit(0);
        if (!colError) {
          existing.push(col);
        }
      }
      cachedSupabaseColumns = existing;
      return existing;
    }
  } catch (e) {
    console.error("Error probing Supabase columns:", e);
    cachedSupabaseColumns = defaultColumns;
    return defaultColumns;
  }
}

export function isSupabaseEnabled() {
  if (!supabase) return false;
  if (cachedConfig && cachedConfig.force_local_cache === true) {
    return false;
  }
  try {
    if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
      const config = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
      if (config.force_local_cache === true) {
        return false;
      }
    }
  } catch (e) {
    console.error("Error reading force_local_cache:", e);
  }
  return true;
}

export async function saveWebConfig(config) {
  cachedConfig = config;
  
  // Ensure stats object is initialized
  if (!config.stats) config.stats = {};
  
  // Save marquee_speed to stats JSONB column for seamless database fallback
  config.stats.marquee_speed = config.marquee_speed || 40;
  
  // Defensively secure downloads, faqs, and gallery data inside stats fallbacks
  if (config.downloads !== undefined) {
    config.stats._downloads_fallback = config.downloads;
  } else if (config.stats._downloads_fallback === undefined) {
    config.stats._downloads_fallback = [];
  }
  
  if (config.faqs !== undefined) {
    config.stats._faqs_fallback = config.faqs;
  } else if (config.stats._faqs_fallback === undefined) {
    config.stats._faqs_fallback = [];
  }
  
  if (config.gallery !== undefined) {
    config.stats._gallery_fallback = config.gallery;
  } else if (config.stats._gallery_fallback === undefined) {
    config.stats._gallery_fallback = [];
  }
  
  let localSaved = false;
  try {
    fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(config, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving config locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      const payload = {
        id: "global_config",
        marquee_announcements: config.marquee_announcements,
        stats: config.stats,
        ppdb_contacts: config.ppdb_contacts,
        force_local_cache: config.force_local_cache === true
      };
      
      const { error } = await supabase.from("config_sdn_bobong").upsert(payload);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Error saving config to Supabase:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

function getNewsSortKey(item) {
  const dateStr = item.date || "";
  try {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
        } else {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        }
      }
    }

    const monthsMap = {
      "jan": 0, "feb": 1, "mar": 2, "apr": 3, "mei": 4, "jun": 5,
      "jul": 6, "agu": 7, "sep": 8, "okt": 9, "nov": 10, "des": 11,
      "januari": 0, "februari": 1, "maret": 2, "april": 3, "mei": 4, "juni": 5,
      "juli": 6, "agustus": 7, "september": 8, "oktober": 9, "november": 10, "desember": 11
    };

    const parts = dateStr.toLowerCase().replace(/,/g, '').split(/\s+/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = monthsMap[parts[1]] !== undefined ? monthsMap[parts[1]] : 0;
      const year = parseInt(parts[2]);
      return new Date(year, month, day).getTime();
    }
  } catch (e) {}

  const match = (item.id || "").match(/\d+/);
  if (match) {
    const val = parseInt(match[0]);
    if (val < 100) {
      return new Date(2025, 11 - val, 1).getTime();
    }
    return val * 1000;
  }
  return 0;
}

export function packImagesIntoContent(content, images) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return content;
  }
  const cleanContent = (content || "").replace(/\n*<!--IMAGES_METADATA:[\s\S]*?-->$/, "");
  const serialized = JSON.stringify(images);
  return `${cleanContent}\n<!--IMAGES_METADATA:${serialized}-->`;
}

export function unpackImagesFromContent(content, fallbackImages) {
  if (typeof content !== 'string') {
    return { cleanContent: content, images: fallbackImages || [] };
  }
  const match = content.match(/<!--IMAGES_METADATA:([\s\S]*?)-->$/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        const cleanContent = content.replace(/\n*<!--IMAGES_METADATA:[\s\S]*?-->$/, "");
        return { cleanContent, images: parsed };
      }
    } catch (e) {
      console.error("Error parsing images metadata from content:", e);
    }
  }
  return { cleanContent: content, images: fallbackImages || [] };
}

export function packBerkasIntoAlamat(alamat, berkas) {
  if (!berkas || typeof berkas !== 'object' || Object.keys(berkas).length === 0) {
    return alamat;
  }
  const cleanAlamat = (alamat || "").replace(/\n*<!--PPDB_FILES:[\s\S]*?-->$/, "");
  const serialized = JSON.stringify(berkas);
  return `${cleanAlamat}\n<!--PPDB_FILES:${serialized}-->`;
}

export function unpackBerkasFromAlamat(alamat) {
  if (typeof alamat !== 'string') {
    return { cleanAlamat: alamat || "", berkas: {} };
  }
  const match = alamat.match(/<!--PPDB_FILES:([\s\S]*?)-->$/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === 'object') {
        const cleanAlamat = alamat.replace(/\n*<!--PPDB_FILES:[\s\S]*?-->$/, "");
        return { cleanAlamat, berkas: parsed };
      }
    } catch (e) {
      console.error("Error parsing berkas metadata from alamat:", e);
    }
  }
  return { cleanAlamat: alamat, berkas: {} };
}

let cachedNewsColumns = null;

export async function getAvailableNewsColumns() {
  if (cachedNewsColumns) return cachedNewsColumns;
  const defaultColumns = ['id', 'title', 'date', 'category', 'image', 'content'];
  if (!supabase || !isSupabaseEnabled()) {
    cachedNewsColumns = defaultColumns;
    return defaultColumns;
  }
  try {
    const { error } = await supabase.from("news_sdn_bobong").select("images").limit(0);
    if (!error) {
      cachedNewsColumns = [...defaultColumns, 'images'];
    } else {
      cachedNewsColumns = defaultColumns;
    }
  } catch (e) {
    cachedNewsColumns = defaultColumns;
  }
  return cachedNewsColumns;
}

export async function loadNews() {
  let localNews = [];
  if (fs.existsSync(NEWS_JSON)) {
    try {
      localNews = JSON.parse(fs.readFileSync(NEWS_JSON, 'utf-8')).map(n => ({
        ...n,
        images: n.images || (n.image ? [n.image] : [])
      }));
    } catch (e) {
      console.error("Error loading local news:", e);
    }
  }

  if (!isSupabaseEnabled()) return localNews;

  try {
    const { data: supabaseNews, error } = await supabase.from("news_sdn_bobong").select("*");
    if (error) throw error;

    // Seeding if Supabase is empty
    const newsSeeded = await isTableSeeded("news");
    if ((!supabaseNews || supabaseNews.length === 0) && localNews.length > 0 && !newsSeeded) {
      console.log("Supabase news table is empty. Seeding from local JSON...");
      const availableCols = await getAvailableNewsColumns();
      const hasImagesCol = availableCols.includes('images');

      for (const article of localNews) {
        const packedContent = packImagesIntoContent(article.content, article.images || (article.image ? [article.image] : []));
        const insertObj = {
          id: article.id,
          title: article.title,
          date: article.date,
          category: article.category,
          image: article.image,
          content: packedContent
        };
        if (hasImagesCol) {
          insertObj.images = article.images || (article.image ? [article.image] : []);
        }
        await supabase.from("news_sdn_bobong").insert(insertObj);
      }
      await markTableSeeded("news");
      return localNews;
    }

    if (supabaseNews && supabaseNews.length > 0 && !newsSeeded) {
      await markTableSeeded("news");
    }

    if (supabaseNews) {
      const newsList = supabaseNews.map(n => {
        const localArticle = localNews.find(ln => ln.id === n.id);
        const localImages = localArticle ? localArticle.images : null;

        const fallbackImages = n.images 
          ? (typeof n.images === 'string' ? JSON.parse(n.images) : n.images) 
          : (localImages && localImages.length > 0 ? localImages : (n.image ? [n.image] : []));

        const unpacked = unpackImagesFromContent(n.content, fallbackImages);

        return {
          id: n.id,
          title: n.title,
          date: n.date,
          category: n.category,
          image: n.image,
          content: unpacked.cleanContent,
          images: unpacked.images
        };
      });

      newsList.sort((a, b) => getNewsSortKey(b) - getNewsSortKey(a));

      try {
        fs.writeFileSync(NEWS_JSON, JSON.stringify(newsList, null, 4), 'utf-8');
      } catch (e) {
        console.error("Error writing news cache:", e);
      }

      return newsList;
    }
  } catch (e) {
    console.error("Error loading news from Supabase:", e.message || e, ". Falling back to local cache.");
  }

  return localNews;
}

export async function saveNews(newsList) {
  let localSaved = false;
  try {
    fs.writeFileSync(NEWS_JSON, JSON.stringify(newsList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving news locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      const availableCols = await getAvailableNewsColumns();
      const hasImagesCol = availableCols.includes('images');

      for (const article of newsList) {
        const packedContent = packImagesIntoContent(article.content, article.images || (article.image ? [article.image] : []));
        const payload = {
          id: article.id,
          title: article.title,
          date: article.date,
          category: article.category,
          image: article.image,
          content: packedContent
        };
        if (hasImagesCol) {
          payload.images = article.images || (article.image ? [article.image] : []);
        }
        const { error } = await supabase.from("news_sdn_bobong").upsert(payload);
        if (error) throw error;
      }

      const localIds = new Set(newsList.map(n => n.id));
      const { data: supabaseNews, error: selectError } = await supabase.from("news_sdn_bobong").select("id");
      if (selectError) throw selectError;

      if (supabaseNews) {
        const supabaseIds = new Set(supabaseNews.map(row => row.id));
        for (const deleteId of supabaseIds) {
          if (!localIds.has(deleteId)) {
            const { error: deleteError } = await supabase.from("news_sdn_bobong").delete().eq("id", deleteId);
            if (deleteError) throw deleteError;
          }
        }
      }
      return true; // Supabase write succeeded
    } catch (e) {
      console.error("Error saving news to Supabase:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

function getTeacherSortWeight(teacher) {
  const role = (teacher.role || "").toLowerCase();
  const details = (teacher.details || "").toLowerCase();

  // 1. Kepala Sekolah
  if (role.includes("kepala sekolah")) {
    return { priority: 1, classNum: 0 };
  }

  // 2. Tata Usaha
  if (role.includes("tata usaha") || role.includes("tu") || role.includes("koordinator tu")) {
    return { priority: 2, classNum: 0 };
  }

  // 3. Bendahara
  if (role.includes("bendahara")) {
    return { priority: 3, classNum: 0 };
  }

  // 4. Komite
  if (role.includes("komite")) {
    return { priority: 4, classNum: 0 };
  }

  // 5. Guru Kelas / Wali Kelas (Wali Kelas)
  let classMatch = role.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i) || details.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i);
  if (classMatch) {
    const rawClass = classMatch[1].toLowerCase();
    const romanMap = {
      'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
    };
    const classNum = romanMap[rawClass] || 99;
    return { priority: 5, classNum: classNum };
  }

  if (role.includes("guru kelas") || role.includes("wali kelas")) {
    return { priority: 5, classNum: 99 };
  }

  // 6. Guru Mata Pelajaran / Bidang Studi / generic Guru
  if (role.includes("guru") || details.includes("pendidik bidang studi") || details.includes("guru") || role.includes("bidang studi")) {
    return { priority: 6, classNum: 0 };
  }

  // 7. Others
  return { priority: 7, classNum: 0 };
}

export function sortTeachersList(teachersList) {
  if (!Array.isArray(teachersList)) return [];
  return [...teachersList].sort((a, b) => {
    const weightA = getTeacherSortWeight(a);
    const weightB = getTeacherSortWeight(b);

    if (weightA.priority !== weightB.priority) {
      return weightA.priority - weightB.priority;
    }

    if (weightA.priority === 5) {
      if (weightA.classNum !== weightB.classNum) {
        return weightA.classNum - weightB.classNum;
      }
    }

    const nameA = (a.name || "").toLowerCase().trim();
    const nameB = (b.name || "").toLowerCase().trim();
    return nameA.localeCompare(nameB);
  });
}

export async function loadTeachers() {
  let localTeachers = [];
  if (fs.existsSync(TEACHERS_JSON)) {
    try {
      localTeachers = JSON.parse(fs.readFileSync(TEACHERS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local teachers:", e);
    }
  }

  if (!isSupabaseEnabled()) {
    return sortTeachersList(localTeachers);
  }

  try {
    const { data: supabaseTeachers, error } = await supabase.from("teachers_sdn_bobong").select("*");
    if (error) throw error;

    // Check if NIP column exists in database dynamically
    let hasNipColumn = false;
    try {
      const { error: nipError } = await supabase.from("teachers_sdn_bobong").select("nip").limit(1);
      if (!nipError) {
        hasNipColumn = true;
      }
    } catch (e) {
      hasNipColumn = false;
    }

    const teachersSeeded = await isTableSeeded("teachers");
    if ((!supabaseTeachers || supabaseTeachers.length === 0) && localTeachers.length > 0 && !teachersSeeded) {
      console.log("Supabase teachers table is empty. Seeding from local JSON...");
      const sortedLocal = sortTeachersList(localTeachers);
      for (const t of sortedLocal) {
        const packedDetails = (t.subject || t.education || t.motto || t.bio)
          ? `${t.details || ""}<!--TEACHER_DETAILS:${JSON.stringify({ subject: t.subject || '', education: t.education || '', motto: t.motto || '', bio: t.bio || '' })}-->`
          : t.details;
        
        const insertObj = {
          id: t.id,
          name: t.name,
          role: t.role,
          details: packedDetails,
          status: t.status,
          image: t.image
        };
        if (hasNipColumn) {
          insertObj.nip = t.nip || "";
        }
        await supabase.from("teachers_sdn_bobong").insert(insertObj);
      }
      await markTableSeeded("teachers");
      return sortedLocal;
    }

    if (supabaseTeachers && supabaseTeachers.length > 0 && !teachersSeeded) {
      await markTableSeeded("teachers");
    }

    if (supabaseTeachers) {
      const teachersList = supabaseTeachers.map(t => {
        let details = t.details || "";
        let extra = {};
        if (details.includes('<!--TEACHER_DETAILS:')) {
          try {
            const match = details.match(/<!--TEACHER_DETAILS:([\s\S]*?)-->/);
            if (match && match[1]) {
              extra = JSON.parse(match[1]);
              details = details.replace(/<!--TEACHER_DETAILS:[\s\S]*?-->/, '').trim();
            }
          } catch (err) {
            console.error("Failed to parse teacher details for:", t.id, err);
          }
        }

        const obj = {
          id: t.id,
          name: t.name,
          role: t.role,
          details: details,
          status: t.status,
          image: t.image,
          subject: extra.subject || "",
          education: extra.education || "",
          motto: extra.motto || "",
          bio: extra.bio || ""
        };
        if (hasNipColumn) {
          obj.nip = t.nip || "";
        } else if (t.nip !== undefined) {
          obj.nip = t.nip || "";
        } else {
          // Fallback to local cached NIP if present
          const localMatch = localTeachers.find(lt => lt.id === t.id);
          if (localMatch && localMatch.nip) {
            obj.nip = localMatch.nip;
          }
        }
        return obj;
      });

      const sortedList = sortTeachersList(teachersList);

      try {
        fs.writeFileSync(TEACHERS_JSON, JSON.stringify(sortedList, null, 4), 'utf-8');
      } catch (e) {
        console.error("Error writing teachers cache:", e);
      }

      return sortedList;
    }
  } catch (e) {
    console.error("Error loading teachers from Supabase:", e.message || e, ". Falling back to local cache.");
  }

  return sortTeachersList(localTeachers);
}

export async function saveTeachers(teachersList) {
  const sortedList = sortTeachersList(teachersList);
  let localSaved = false;
  try {
    fs.writeFileSync(TEACHERS_JSON, JSON.stringify(sortedList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving teachers locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      // Check if NIP column exists in database dynamically
      let hasNipColumn = false;
      try {
        const { error: nipError } = await supabase.from("teachers_sdn_bobong").select("nip").limit(1);
        if (!nipError) {
          hasNipColumn = true;
        }
      } catch (e) {
        hasNipColumn = false;
      }

      for (const t of sortedList) {
        const packedDetails = (t.subject || t.education || t.motto || t.bio)
          ? `${t.details || ""}<!--TEACHER_DETAILS:${JSON.stringify({ subject: t.subject || '', education: t.education || '', motto: t.motto || '', bio: t.bio || '' })}-->`
          : t.details;

        const upsertObj = {
          id: t.id,
          name: t.name,
          role: t.role,
          details: packedDetails,
          status: t.status,
          image: t.image
        };
        if (hasNipColumn) {
          upsertObj.nip = t.nip || "";
        }
        const { error } = await supabase.from("teachers_sdn_bobong").upsert(upsertObj);
        if (error) throw error;
      }

      const localIds = new Set(sortedList.map(t => t.id));
      const { data: supabaseTeachers, error: selectError } = await supabase.from("teachers_sdn_bobong").select("id");
      if (selectError) throw selectError;

      if (supabaseTeachers) {
        const supabaseIds = new Set(supabaseTeachers.map(row => row.id));
        for (const deleteId of supabaseIds) {
          if (!localIds.has(deleteId)) {
            const { error: deleteError } = await supabase.from("teachers_sdn_bobong").delete().eq("id", deleteId);
            if (deleteError) throw deleteError;
          }
        }
      }
      return true; // Supabase write succeeded
    } catch (e) {
      console.error("Error saving teachers to Supabase:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

export function loadLocalStatuses() {
  const localStatuses = {};
  if (fs.existsSync(PENDAFTARAN_JSON)) {
    try {
      const localData = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
      for (const ld of localData) {
        const nik = ld.nik || ld.nik_siswa;
        if (nik) {
          localStatuses[String(nik)] = ld.status || "Diterima Sistem";
        }
      }
    } catch (e) {
      console.error("Error loading local statuses:", e);
    }
  }
  return localStatuses;
}

export async function syncLocalToSupabase() {
  if (!isSupabaseEnabled()) return;

  let localRecords = [];
  if (fs.existsSync(PENDAFTARAN_JSON)) {
    try {
      localRecords = JSON.parse(fs.readFileSync(PENDAFTARAN_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error reading local pendaftaran file:", e);
    }
  }

  const localByNik = {};
  for (const r of localRecords) {
    const nik = String(r.nik || r.nik_siswa || "").trim();
    if (nik) localByNik[nik] = r;
  }

  try {
    const { data: supabaseRecords, error } = await supabase.from("ppdb_sdn_bobong").select("*");
    if (error) throw error;

    const supabaseByNik = {};
    for (const r of (supabaseRecords || [])) {
      const nik = String(r.nik_siswa || r.nik || "").trim();
      if (nik) supabaseByNik[nik] = r;
    }

    let syncedToSupabaseCount = 0;
    const availableCols = await getAvailableSupabaseColumns();

    for (const [nik, localR] of Object.entries(localByNik)) {
      if (!supabaseByNik[nik]) {
        // Map all fields
        const fullMap = {
          nama_lengkap: localR.nama_lengkap || "",
          nik_siswa: nik,
          tempat_lahir: localR.tempat_lahir || "",
          tanggal_lahir: localR.tanggal_lahir || "",
          jenis_kelamin: localR.jenis_kelamin || "",
          nama_ibu_kandung: localR.nama_ibu || localR.nama_ibu_kandung || "",
          alamat_domisili: localR.alamat || localR.alamat_domisili || "",
          nomor_hp_orangtua: localR.no_hp || localR.nomor_hp_orangtua || "",
          jalur_ppdb: localR.jalur_ppdb || "Zonasi",
          waktu_daftar: localR.waktu_daftar || new Date().toISOString().replace('T', ' ').split('.')[0],
          status: localR.status || "Diterima Sistem",
          tahun_ajaran: localR.tahun_ajaran || (localR.waktu_daftar && /^\d{4}/.test(localR.waktu_daftar) ? `${localR.waktu_daftar.substring(0, 4)}/${parseInt(localR.waktu_daftar.substring(0, 4), 10) + 1}` : "2026/2027"),
          
          nama_panggilan: localR.nama_panggilan || "",
          agama: localR.agama || "",
          anak_ke: localR.anak_ke ? parseInt(localR.anak_ke, 10) : null,
          dari_bersaudara: localR.dari_bersaudara ? parseInt(localR.dari_bersaudara, 10) : null,
          nama_ayah: localR.nama_ayah || "",
          pekerjaan_ayah: localR.pekerjaan_ayah || "",
          no_hp_ayah: localR.no_hp_ayah || "",
          pekerjaan_ibu: localR.pekerjaan_ibu || "",
          no_hp_ibu: localR.no_hp_ibu || "",
          nama_wali: localR.nama_wali || "",
          pekerjaan_wali: localR.pekerjaan_wali || "",
          
          berkas_kk: localR.berkas_kk || "",
          berkas_akta: localR.berkas_akta || "",
          berkas_ktp: localR.berkas_ktp || "",
          berkas_sptjm: localR.berkas_sptjm || "",
          berkas_kip: localR.berkas_kip || "",
          berkas_ijazah: localR.berkas_ijazah || ""
        };

        // Filter based on columns actually present in the table
        const supabaseData = {};
        for (const [col, val] of Object.entries(fullMap)) {
          if (availableCols.includes(col)) {
            supabaseData[col] = val;
          }
        }

        // Check if we need to pack berkas into alamat_domisili (fallback for zero-migration)
        const missingBerkasCols = ['berkas_kk', 'berkas_akta', 'berkas_ktp', 'berkas_sptjm', 'berkas_kip', 'berkas_ijazah'].some(c => !availableCols.includes(c));
        if (missingBerkasCols) {
          const berkasData = {
            berkas_kk: localR.berkas_kk || "",
            berkas_akta: localR.berkas_akta || "",
            berkas_ktp: localR.berkas_ktp || "",
            berkas_sptjm: localR.berkas_sptjm || "",
            berkas_kip: localR.berkas_kip || "",
            berkas_ijazah: localR.berkas_ijazah || ""
          };
          const alamatBase = localR.alamat || localR.alamat_domisili || "";
          supabaseData.alamat_domisili = packBerkasIntoAlamat(alamatBase, berkasData);
        }

        try {
          await supabase.from("ppdb_sdn_bobong").insert(supabaseData);
          syncedToSupabaseCount++;
        } catch (e) {
          if (supabaseData.status) delete supabaseData.status;
          try {
            await supabase.from("ppdb_sdn_bobong").insert(supabaseData);
            syncedToSupabaseCount++;
          } catch (e2) {
            console.error(`Failed syncing local record NIK ${nik} to Supabase:`, e2.message || e2);
          }
        }
      } else {
        const supabaseR = supabaseByNik[nik];
        const localStatus = localR.status;
        const supabaseStatus = supabaseR.status;
        if (localStatus !== supabaseStatus) {
          if (["Terverifikasi", "Ditolak"].includes(localStatus) && !["Terverifikasi", "Ditolak"].includes(supabaseStatus)) {
            try {
              await supabase.from("ppdb_sdn_bobong").update({ status: localStatus }).eq("nik_siswa", nik);
            } catch (e) {
              console.error(`Error updating status in Supabase for NIK ${nik}:`, e.message || e);
            }
          } else if (["Terverifikasi", "Ditolak"].includes(supabaseStatus) && !["Terverifikasi", "Ditolak"].includes(localStatus)) {
            localR.status = supabaseStatus;
          }
        }
      }
    }

    for (const [nik, supabaseR] of Object.entries(supabaseByNik)) {
      const unpackedAlamat = unpackBerkasFromAlamat(supabaseR.alamat_domisili || "");
      const localFormat = {
        id: String(supabaseR.id),
        nama_lengkap: supabaseR.nama_lengkap || "",
        nama_panggilan: supabaseR.nama_panggilan || "",
        nik: nik,
        tempat_lahir: supabaseR.tempat_lahir || "",
        tanggal_lahir: supabaseR.tanggal_lahir || "",
        jenis_kelamin: supabaseR.jenis_kelamin || "",
        agama: supabaseR.agama || "",
        anak_ke: supabaseR.anak_ke !== undefined && supabaseR.anak_ke !== null ? String(supabaseR.anak_ke) : "",
        dari_bersaudara: supabaseR.dari_bersaudara !== undefined && supabaseR.dari_bersaudara !== null ? String(supabaseR.dari_bersaudara) : "",
        alamat: unpackedAlamat.cleanAlamat || "",
        jalur_ppdb: supabaseR.jalur_ppdb || "Zonasi",
        nama_ayah: supabaseR.nama_ayah || "",
        pekerjaan_ayah: supabaseR.pekerjaan_ayah || "",
        no_hp_ayah: supabaseR.no_hp_ayah || "",
        nama_ibu: supabaseR.nama_ibu_kandung || "",
        pekerjaan_ibu: supabaseR.pekerjaan_ibu || "",
        no_hp_ibu: supabaseR.no_hp_ibu || "",
        no_hp: supabaseR.nomor_hp_orangtua || "",
        nama_wali: supabaseR.nama_wali || "",
        pekerjaan_wali: supabaseR.pekerjaan_wali || "",
        waktu_daftar: supabaseR.waktu_daftar || "",
        status: supabaseR.status || "Diterima Sistem",
        tahun_ajaran: supabaseR.tahun_ajaran || "",
        berkas_kk: supabaseR.berkas_kk || unpackedAlamat.berkas.berkas_kk || "",
        berkas_akta: supabaseR.berkas_akta || unpackedAlamat.berkas.berkas_akta || "",
        berkas_ktp: supabaseR.berkas_ktp || unpackedAlamat.berkas.berkas_ktp || "",
        berkas_sptjm: supabaseR.berkas_sptjm || unpackedAlamat.berkas.berkas_sptjm || "",
        berkas_kip: supabaseR.berkas_kip || unpackedAlamat.berkas.berkas_kip || "",
        berkas_ijazah: supabaseR.berkas_ijazah || unpackedAlamat.berkas.berkas_ijazah || ""
      };

      if (localFormat.waktu_daftar && localFormat.waktu_daftar.includes('T')) {
        try {
          localFormat.waktu_daftar = localFormat.waktu_daftar.replace('T', ' ').split('+')[0].split('.')[0];
        } catch (e) {}
      }

      if (localByNik[nik]) {
        const existingLocal = localByNik[nik];
        if (["Terverifikasi", "Ditolak"].includes(existingLocal.status)) {
          localFormat.status = existingLocal.status;
        }
        // Merge remaining local-only details if any
        localByNik[nik] = { ...existingLocal, ...localFormat };
      } else {
        localByNik[nik] = localFormat;
      }
    }

    const mergedRecords = Object.values(localByNik);
    mergedRecords.sort((a, b) => {
      const dateA = a.waktu_daftar || "";
      const dateB = b.waktu_daftar || "";
      return dateB.localeCompare(dateA);
    });

    try {
      fs.writeFileSync(PENDAFTARAN_JSON, JSON.stringify(mergedRecords, null, 4), 'utf-8');
      if (syncedToSupabaseCount > 0) {
        console.log(`Sync: ${syncedToSupabaseCount} local records uploaded to Supabase.`);
      }
    } catch (e) {
      console.error("Error saving merged records locally:", e);
    }

  } catch (e) {
    console.error("Error during Supabase sync check:", e.message || e);
  }
}

export async function loadAchievements() {
  let localAchievements = [];
  if (fs.existsSync(ACHIEVEMENTS_JSON)) {
    try {
      localAchievements = JSON.parse(fs.readFileSync(ACHIEVEMENTS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local achievements:", e);
    }
  }

  if (!isSupabaseEnabled()) return localAchievements;

  try {
    const { data: supabaseAchievements, error } = await supabase.from("achievements_sdn_bobong").select("*");
    if (error) throw error;

    // Seeding if Supabase is empty
    const achievementsSeeded = await isTableSeeded("achievements");
    if ((!supabaseAchievements || supabaseAchievements.length === 0) && localAchievements.length > 0 && !achievementsSeeded) {
      console.log("Supabase achievements table is empty. Seeding from local JSON...");
      for (const ach of localAchievements) {
        await supabase.from("achievements_sdn_bobong").insert({
          id: ach.id,
          title: ach.title,
          level: ach.level,
          year: ach.year,
          description: ach.description
        });
      }
      await markTableSeeded("achievements");
      return localAchievements;
    }

    if (supabaseAchievements && supabaseAchievements.length > 0 && !achievementsSeeded) {
      await markTableSeeded("achievements");
    }

    if (supabaseAchievements) {
      const achievementsList = supabaseAchievements.map(ach => ({
        id: ach.id,
        title: ach.title,
        level: ach.level,
        year: ach.year,
        description: ach.description
      }));

      achievementsList.sort((a, b) => String(b.year || "").localeCompare(String(a.year || "")));

      try {
        fs.writeFileSync(ACHIEVEMENTS_JSON, JSON.stringify(achievementsList, null, 4), 'utf-8');
      } catch (e) {
        console.error("Error writing achievements cache:", e);
      }

      return achievementsList;
    }
  } catch (e) {
    console.error("Error loading achievements from Supabase (table may not exist yet, falling back):", e.message || e);
  }

  return localAchievements;
}

export async function saveAchievements(achievementsList) {
  let localSaved = false;
  try {
    fs.writeFileSync(ACHIEVEMENTS_JSON, JSON.stringify(achievementsList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving achievements locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      for (const ach of achievementsList) {
        const { error } = await supabase.from("achievements_sdn_bobong").upsert({
          id: ach.id,
          title: ach.title,
          level: ach.level,
          year: ach.year,
          description: ach.description
        });
        if (error) throw error;
      }

      const localIds = new Set(achievementsList.map(ach => ach.id));
      const { data: supabaseAchievements, error: selectError } = await supabase.from("achievements_sdn_bobong").select("id");
      if (selectError) throw selectError;

      if (supabaseAchievements) {
        const supabaseIds = new Set(supabaseAchievements.map(row => row.id));
        for (const deleteId of supabaseIds) {
          if (!localIds.has(deleteId)) {
            const { error: deleteError } = await supabase.from("achievements_sdn_bobong").delete().eq("id", deleteId);
            if (deleteError) throw deleteError;
          }
        }
      }
      return true; // Supabase write succeeded
    } catch (e) {
      console.error("Error saving achievements to Supabase:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

// --- Storage Calculation Helpers ---

function getDirSize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (e) {
    console.error("Error getting directory size:", e);
  }
  return size;
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getStorageUsage() {
  let supabaseSize = 0;
  let localSize = 0;
  let supabaseError = null;
  const supabaseActive = isSupabaseEnabled();

  // 1. Calculate local storage size
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    localSize = getDirSize(uploadDir);
  } catch (e) {
    console.error("Failed to calculate local storage size:", e);
  }

  // 2. Calculate Supabase storage size if active
  if (supabaseActive) {
    try {
      let bucketsList = ['teachers', 'news'];
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (!error && buckets && buckets.length > 0) {
          bucketsList = buckets.map(b => b.name);
        }
      } catch (bucketErr) {
        console.warn("Could not list buckets, falling back to default buckets list:", bucketErr);
      }

      for (const bucket of bucketsList) {
        try {
          const { data: files, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });
          if (error) {
            console.error(`Error listing bucket ${bucket}:`, error);
            continue;
          }
          if (files) {
            for (const file of files) {
              supabaseSize += file.metadata?.size || file.size || 0;
            }
          }
        } catch (fileErr) {
          console.error(`Failed to list files in bucket ${bucket}:`, fileErr);
        }
      }
    } catch (e) {
      console.error("Failed to calculate Supabase storage size:", e);
      supabaseError = e.message || String(e);
    }
  }

  const totalSize = supabaseActive ? supabaseSize : localSize;

  return {
    supabaseSize,
    localSize,
    supabaseFormatted: formatBytes(supabaseSize),
    localFormatted: formatBytes(localSize),
    totalSize,
    totalFormatted: formatBytes(totalSize),
    isSupabaseActive: supabaseActive,
    error: supabaseError
  };
}

export async function loadMessages() {
  let localMessages = [];
  if (fs.existsSync(MESSAGES_JSON)) {
    try {
      localMessages = JSON.parse(fs.readFileSync(MESSAGES_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local messages:", e);
    }
  }

  if (!isSupabaseEnabled()) return localMessages;

  try {
    const { data: dbMessages, error } = await supabase.from("messages_sdn_bobong").select("*");
    if (!error && dbMessages) {
      const messagesSeeded = await isTableSeeded("messages");
      if (dbMessages.length === 0 && localMessages.length > 0 && !messagesSeeded) {
        console.log("Supabase messages table is empty. Seeding from local JSON...");
        for (const m of localMessages) {
          await supabase.from("messages_sdn_bobong").insert({
            id: m.id,
            name: m.name,
            role: m.role,
            type: m.type,
            message: m.message,
            status: m.status,
            date: m.date
          });
        }
        await markTableSeeded("messages");
        return localMessages;
      }

      if (dbMessages && dbMessages.length > 0 && !messagesSeeded) {
        await markTableSeeded("messages");
      }

      const messagesList = dbMessages.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        type: m.type,
        message: m.message,
        status: m.status,
        date: m.date
      }));
      try {
        fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8');
      } catch (fsErr) {}
      return messagesList;
    }
  } catch (e) {
    console.error("Supabase loadMessages failed, falling back to local:", e.message || e);
  }

  return localMessages;
}

export async function saveMessages(messagesList) {
  let localSaved = false;
  try {
    fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving messages locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      for (const m of messagesList) {
        const { error } = await supabase.from("messages_sdn_bobong").upsert({
          id: m.id,
          name: m.name,
          role: m.role,
          type: m.type,
          message: m.message,
          status: m.status,
          date: m.date
        });
        if (error) throw error;
      }
      
      const localIds = new Set(messagesList.map(m => m.id));
      const { data: dbMessages, error: selectError } = await supabase.from("messages_sdn_bobong").select("id");
      if (!selectError && dbMessages) {
        for (const row of dbMessages) {
          if (!localIds.has(row.id)) {
            await supabase.from("messages_sdn_bobong").delete().eq("id", row.id);
          }
        }
      }
      return true;
    } catch (e) {
      console.error("Supabase saveMessages failed:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

export async function loadGraduation() {
  let localGraduation = [];
  if (fs.existsSync(GRADUATION_JSON)) {
    try {
      localGraduation = JSON.parse(fs.readFileSync(GRADUATION_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local graduation list:", e);
    }
  }

  if (!isSupabaseEnabled()) return localGraduation;

  try {
    const { data: dbGraduation, error } = await supabase.from("graduation_sdn_bobong").select("*");
    if (!error && dbGraduation) {
      const graduationSeeded = await isTableSeeded("graduation");
      if (dbGraduation.length === 0 && localGraduation.length > 0 && !graduationSeeded) {
        console.log("Supabase graduation table is empty. Seeding from local JSON...");
        for (const g of localGraduation) {
          await supabase.from("graduation_sdn_bobong").insert({
            id: g.id,
            nisn: g.nisn,
            no_peserta: g.no_peserta,
            name: g.name,
            status: g.status,
            sk_number: g.sk_number,
            birth_place: g.birth_place,
            birth_date: g.birth_date,
            parent_name: g.parent_name
          });
        }
        await markTableSeeded("graduation");
        return localGraduation;
      }

      if (dbGraduation && dbGraduation.length > 0 && !graduationSeeded) {
        await markTableSeeded("graduation");
      }

      const gradList = dbGraduation.map(g => ({
        id: g.id,
        nisn: g.nisn,
        no_peserta: g.no_peserta,
        name: g.name,
        status: g.status,
        sk_number: g.sk_number,
        birth_place: g.birth_place,
        birth_date: g.birth_date,
        parent_name: g.parent_name
      }));
      try {
        fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8');
      } catch (fsErr) {}
      return gradList;
    }
  } catch (e) {
    console.error("Supabase loadGraduation failed, falling back to local:", e.message || e);
  }

  return localGraduation;
}

export async function saveGraduation(gradList) {
  let localSaved = false;
  try {
    fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving graduation locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      for (const g of gradList) {
        const { error } = await supabase.from("graduation_sdn_bobong").upsert({
          id: g.id,
          nisn: g.nisn,
          no_peserta: g.no_peserta,
          name: g.name,
          status: g.status,
          sk_number: g.sk_number,
          birth_place: g.birth_place,
          birth_date: g.birth_date,
          parent_name: g.parent_name
        });
        if (error) throw error;
      }

      const localIds = new Set(gradList.map(g => g.id));
      const { data: dbGrad, error: selectError } = await supabase.from("graduation_sdn_bobong").select("id");
      if (!selectError && dbGrad) {
        for (const row of dbGrad) {
          if (!localIds.has(row.id)) {
            await supabase.from("graduation_sdn_bobong").delete().eq("id", row.id);
          }
        }
      }
      return true;
    } catch (e) {
      console.error("Supabase saveGraduation failed:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

export async function loadStudents() {
  let localStudents = [];
  if (fs.existsSync(STUDENTS_JSON)) {
    try {
      localStudents = JSON.parse(fs.readFileSync(STUDENTS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local students list:", e);
    }
  }

  if (!isSupabaseEnabled()) return localStudents;

  try {
    const { data: dbStudents, error } = await supabase.from("students_sdn_bobong").select("*");
    if (!error && dbStudents) {
      const studentsSeeded = await isTableSeeded("students");
      if (dbStudents.length === 0 && localStudents.length > 0 && !studentsSeeded) {
        console.log("Supabase students table is empty. Seeding from local JSON...");
        for (const s of localStudents) {
          const packedAddress = (s.grades)
            ? `${s.address || ""}<!--GRADES:${JSON.stringify(s.grades)}-->`
            : s.address;
          await supabase.from("students_sdn_bobong").insert({
            id: s.id,
            nisn: s.nisn,
            nis: s.nis,
            name: s.name,
            class: s.class,
            gender: s.gender,
            birth_place: s.birth_place,
            birth_date: s.birth_date,
            address: packedAddress,
            parent_name: s.parent_name,
            parent_phone: s.parent_phone,
            status: s.status
          });
        }
        await markTableSeeded("students");
        return localStudents;
      }

      if (dbStudents && dbStudents.length > 0 && !studentsSeeded) {
        await markTableSeeded("students");
      }

      const studList = dbStudents.map(s => {
        let address = s.address || "";
        let grades = null;
        if (address.includes('<!--GRADES:')) {
          try {
            const match = address.match(/<!--GRADES:([\s\S]*?)-->/);
            if (match && match[1]) {
              grades = JSON.parse(match[1]);
              address = address.replace(/<!--GRADES:[\s\S]*?-->/, '').trim();
            }
          } catch (err) {
            console.error("Failed to parse student grades for:", s.id, err);
          }
        }
        return {
          id: s.id,
          nisn: s.nisn,
          nis: s.nis,
          name: s.name,
          class: s.class,
          gender: s.gender,
          birth_place: s.birth_place,
          birth_date: s.birth_date,
          address: address,
          parent_name: s.parent_name,
          parent_phone: s.parent_phone,
          status: s.status,
          grades: grades
        };
      });
      try {
        fs.writeFileSync(STUDENTS_JSON, JSON.stringify(studList, null, 4), 'utf-8');
      } catch (fsErr) {}
      return studList;
    }
  } catch (e) {
    console.error("Supabase loadStudents failed, falling back to local:", e.message || e);
  }

  return localStudents;
}

export async function saveStudents(studentsList) {
  let localSaved = false;
  try {
    fs.writeFileSync(STUDENTS_JSON, JSON.stringify(studentsList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving students locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      for (const s of studentsList) {
        const packedAddress = (s.grades)
          ? `${s.address || ""}<!--GRADES:${JSON.stringify(s.grades)}-->`
          : s.address;
        const { error } = await supabase.from("students_sdn_bobong").upsert({
          id: s.id,
          nisn: s.nisn,
          nis: s.nis,
          name: s.name,
          class: s.class,
          gender: s.gender,
          birth_place: s.birth_place,
          birth_date: s.birth_date,
          address: packedAddress,
          parent_name: s.parent_name,
          parent_phone: s.parent_phone,
          status: s.status
        });
        if (error) throw error;
      }

      const localIds = new Set(studentsList.map(s => s.id));
      const { data: dbStud, error: selectError } = await supabase.from("students_sdn_bobong").select("id");
      if (!selectError && dbStud) {
        for (const row of dbStud) {
          if (!localIds.has(row.id)) {
            await supabase.from("students_sdn_bobong").delete().eq("id", row.id);
          }
        }
      }
      return true;
    } catch (e) {
      console.error("Supabase saveStudents failed:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}


