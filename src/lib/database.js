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
    const filesToCopy = ['website_config.json', 'news.json', 'teachers.json', 'pendaftaran.json', 'achievements.json'];
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
      jabatan_operator: "Operator Sekolah SD Negeri Bobong"
    },
    force_local_cache: false
  };

  if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
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
          stats: data.stats || localConfig.stats,
          ppdb_contacts: data.ppdb_contacts || localConfig.ppdb_contacts,
          force_local_cache: data.force_local_cache === true
        };
        cachedConfig = dbConfig;
        
        try {
          fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(dbConfig, null, 4), 'utf-8');
        } catch (e) {}
        
        return dbConfig;
      } else if (error && error.code === 'PGRST116') {
        console.log("Config record not found in Supabase. Seeding config...");
        await supabase.from("config_sdn_bobong").insert({
          id: "global_config",
          marquee_announcements: localConfig.marquee_announcements,
          stats: localConfig.stats,
          ppdb_contacts: localConfig.ppdb_contacts,
          force_local_cache: localConfig.force_local_cache === true
        });
      }
    } catch (e) {
      console.error("Error loading web config from Supabase:", e.message || e);
    }
  }

  cachedConfig = localConfig;
  return localConfig;
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
  
  let localSaved = false;
  try {
    fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(config, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving config locally:", e);
  }

  if (supabase) {
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
    } catch (e) {
      console.error("Error saving config to Supabase:", e.message || e);
      return localSaved; // Fallback to local save status so missing tables do not crash the UI
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

export async function loadNews() {
  let localNews = [];
  if (fs.existsSync(NEWS_JSON)) {
    try {
      localNews = JSON.parse(fs.readFileSync(NEWS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local news:", e);
    }
  }

  if (!isSupabaseEnabled()) return localNews;

  try {
    const { data: supabaseNews, error } = await supabase.from("news_sdn_bobong").select("*");
    if (error) throw error;

    // Seeding if Supabase is empty
    if ((!supabaseNews || supabaseNews.length === 0) && localNews.length > 0) {
      console.log("Supabase news table is empty. Seeding from local JSON...");
      for (const article of localNews) {
        await supabase.from("news_sdn_bobong").insert({
          id: article.id,
          title: article.title,
          date: article.date,
          category: article.category,
          image: article.image,
          content: article.content
        });
      }
      return localNews;
    }

    if (supabaseNews) {
      const newsList = supabaseNews.map(n => ({
        id: n.id,
        title: n.title,
        date: n.date,
        category: n.category,
        image: n.image,
        content: n.content
      }));

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
      for (const article of newsList) {
        const { error } = await supabase.from("news_sdn_bobong").upsert({
          id: article.id,
          title: article.title,
          date: article.date,
          category: article.category,
          image: article.image,
          content: article.content
        });
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
      return false;
    }
  }
  return localSaved;
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

  if (!isSupabaseEnabled()) return localTeachers;

  try {
    const { data: supabaseTeachers, error } = await supabase.from("teachers_sdn_bobong").select("*");
    if (error) throw error;

    if ((!supabaseTeachers || supabaseTeachers.length === 0) && localTeachers.length > 0) {
      console.log("Supabase teachers table is empty. Seeding from local JSON...");
      for (const t of localTeachers) {
        await supabase.from("teachers_sdn_bobong").insert({
          id: t.id,
          name: t.name,
          role: t.role,
          details: t.details,
          status: t.status,
          image: t.image
        });
      }
      return localTeachers;
    }

    if (supabaseTeachers) {
      const teachersList = supabaseTeachers.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        details: t.details,
        status: t.status,
        image: t.image
      }));

      teachersList.sort((a, b) => {
        const roleA = (a.role || "").toLowerCase();
        const roleB = (b.role || "").toLowerCase();
        if (roleA.includes("kepala sekolah")) return -1;
        if (roleB.includes("kepala sekolah")) return 1;
        if (roleA.includes("tata usaha") || roleA.includes("tu")) return -1;
        if (roleB.includes("tata usaha") || roleB.includes("tu")) return 1;
        const matchA = (a.id || "").match(/\d+/);
        const matchB = (b.id || "").match(/\d+/);
        const idA = matchA ? parseInt(matchA[0]) : 9999;
        const idB = matchB ? parseInt(matchB[0]) : 9999;
        return idA - idB;
      });

      try {
        fs.writeFileSync(TEACHERS_JSON, JSON.stringify(teachersList, null, 4), 'utf-8');
      } catch (e) {
        console.error("Error writing teachers cache:", e);
      }

      return teachersList;
    }
  } catch (e) {
    console.error("Error loading teachers from Supabase:", e.message || e, ". Falling back to local cache.");
  }

  return localTeachers;
}

export async function saveTeachers(teachersList) {
  let localSaved = false;
  try {
    fs.writeFileSync(TEACHERS_JSON, JSON.stringify(teachersList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving teachers locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      for (const t of teachersList) {
        const { error } = await supabase.from("teachers_sdn_bobong").upsert({
          id: t.id,
          name: t.name,
          role: t.role,
          details: t.details,
          status: t.status,
          image: t.image
        });
        if (error) throw error;
      }

      const localIds = new Set(teachersList.map(t => t.id));
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
      return false;
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

    for (const [nik, localR] of Object.entries(localByNik)) {
      if (!supabaseByNik[nik]) {
        const supabaseData = {
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
          status: localR.status || "Diterima Sistem"
        };
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
      const localFormat = {
        id: String(supabaseR.id),
        nama_lengkap: supabaseR.nama_lengkap || "",
        nik: nik,
        tempat_lahir: supabaseR.tempat_lahir || "",
        tanggal_lahir: supabaseR.tanggal_lahir || "",
        jenis_kelamin: supabaseR.jenis_kelamin || "",
        nama_ibu: supabaseR.nama_ibu_kandung || "",
        no_hp: supabaseR.nomor_hp_orangtua || "",
        alamat: supabaseR.alamat_domisili || "",
        jalur_ppdb: supabaseR.jalur_ppdb || "Zonasi",
        waktu_daftar: supabaseR.waktu_daftar || "",
        status: supabaseR.status || "Diterima Sistem"
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
        localByNik[nik] = localFormat;
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
    if ((!supabaseAchievements || supabaseAchievements.length === 0) && localAchievements.length > 0) {
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
      return localAchievements;
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
      return false;
    }
  }
  return localSaved;
}

