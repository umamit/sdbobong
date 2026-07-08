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

const BUNDLED_DATA_DIR = path.join(process.cwd(), 'data');
export let DATA_DIR = BUNDLED_DATA_DIR;

export const isServerless = !!(
  process.env.VERCEL ||
  process.env.NOW_BUILDER ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.AWS_EXECUTION_ENV ||
  process.env.NETLIFY
);

if (isServerless) {
  DATA_DIR = '/tmp/sdn-bobong-data';
}

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (isServerless) {
    const filesToCopy = [
      'website_config.json','news.json','teachers.json','pendaftaran.json',
      'achievements.json','messages.json','graduation.json','students.json'
    ];
    filesToCopy.forEach(file => {
      const srcPath = path.join(BUNDLED_DATA_DIR, file);
      const destPath = path.join(DATA_DIR, file);
      if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
        try { fs.copyFileSync(srcPath, destPath); }
        catch (copyErr) { console.error(`Failed to copy ${file} to /tmp:`, copyErr); }
      }
    });
  }
} catch (err) {
  console.error("Error initializing database data directory:", err);
}

export const WEBSITE_CONFIG_JSON = path.join(DATA_DIR, 'website_config.json');
export const NEWS_JSON           = path.join(DATA_DIR, 'news.json');
export const TEACHERS_JSON       = path.join(DATA_DIR, 'teachers.json');
export const PENDAFTARAN_JSON    = path.join(DATA_DIR, 'pendaftaran.json');
export const ACHIEVEMENTS_JSON   = path.join(DATA_DIR, 'achievements.json');
export const MESSAGES_JSON       = path.join(DATA_DIR, 'messages.json');
export const GRADUATION_JSON     = path.join(DATA_DIR, 'graduation.json');
export const STUDENTS_JSON       = path.join(DATA_DIR, 'students.json');

// --- Shared cache for config ---
let cachedConfig = null;
export function getCachedConfig() { return cachedConfig; }
export function setCachedConfig(cfg) { cachedConfig = cfg; }

export function isSupabaseEnabled() {
  if (!supabase) return false;
  if (cachedConfig && cachedConfig.force_local_cache === true) return false;
  try {
    if (fs.existsSync(WEBSITE_CONFIG_JSON)) {
      const config = JSON.parse(fs.readFileSync(WEBSITE_CONFIG_JSON, 'utf-8'));
      if (config.force_local_cache === true) return false;
    }
  } catch (e) { console.error("Error reading force_local_cache:", e); }
  return true;
}

// --- Shared helper utilities ---

/**
 * Uploads a file either to Supabase Storage (if enabled) or falls back to local storage.
 * Note: When using Supabase Storage, the following buckets MUST be created and set to public read:
 * - 'teachers' (for teacher avatars, facilities, hero bg, gallery)
 * - 'news' (for news photos)
 * - 'ppdb_berkas' (for student registration PDFs)
 */
export async function handlePhotoUpload(fileObj, bucketName = 'teachers', allowedExts = ['png', 'jpg', 'jpeg']) {
  if (!fileObj || typeof fileObj === 'string' || !fileObj.name) return "NO_FILE";
  const extension = fileObj.name.split('.').pop().toLowerCase();
  if (!allowedExts.includes(extension)) return "INVALID_TYPE";
  const secureName = fileObj.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFilename = `${Date.now()}_${secureName}`;
  let buffer;
  try {
    buffer = Buffer.from(await fileObj.arrayBuffer());
  } catch (e) { console.error("Failed to read file buffer:", e); return "ERROR"; }

  if (isSupabaseEnabled()) {
    try {
      const { error } = await supabase.storage.from(bucketName).upload(uniqueFilename, buffer, { contentType: fileObj.type, upsert: true });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFilename);
      return publicUrlData.publicUrl;
    } catch (e) { console.error(`Supabase Storage upload to ${bucketName} failed:`, e.message || e); }
  }
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, uniqueFilename), buffer);
    return `/images/uploads/${uniqueFilename}`;
  } catch (e) { console.error("Local file save failed:", e); return "ERROR"; }
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
  const match = addressLower.match(/\b(desa|kelurahan|dusun)\s+([a-zA-Z\s]+)/);
  if (match) {
    const words = match[0].trim().split(/\s+/);
    return words.slice(0, Math.min(words.length, 3)).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  const villages = ['wayo','bobong','rongi','kilong','talo','walo','kilo','pencado','limbo'];
  for (const v of villages) {
    if (addressLower.includes(v)) return `Desa ${v.charAt(0).toUpperCase() + v.slice(1)}`;
  }
  const parts = address.split(',');
  if (parts.length > 0) {
    const words = parts[0].trim().split(/\s+/);
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : parts[0].trim();
  }
  return "Pulau Taliabu";
}

export function formatWaktuDaftar(rawWaktu) {
  if (!rawWaktu) return "";
  try {
    const dt = new Date(rawWaktu.split('.')[0].split('+')[0].replace('T', ' ').replace(/-/g, '/'));
    if (isNaN(dt.getTime())) return rawWaktu.substring(0, 16);
    const monthsId = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    return `${String(dt.getDate()).padStart(2,'0')} ${monthsId[dt.getMonth()]} ${dt.getFullYear()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')} WIT`;
  } catch (e) { return rawWaktu.substring(0, 16); }
}

export function packImagesIntoContent(content, images) {
  if (!images || !Array.isArray(images) || images.length === 0) return content;
  const cleanContent = (content || "").replace(/\n*<!--IMAGES_METADATA:[\s\S]*?-->$/, "");
  return `${cleanContent}\n<!--IMAGES_METADATA:${JSON.stringify(images)}-->`;
}

export function unpackImagesFromContent(content, fallbackImages) {
  if (typeof content !== 'string') return { cleanContent: content, images: fallbackImages || [] };
  const match = content.match(/<!--IMAGES_METADATA:([\s\S]*?)-->$/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) return { cleanContent: content.replace(/\n*<!--IMAGES_METADATA:[\s\S]*?-->$/, ""), images: parsed };
    } catch (e) { console.error("Error parsing images metadata:", e); }
  }
  return { cleanContent: content, images: fallbackImages || [] };
}

export function packBerkasIntoAlamat(alamat, berkas) {
  if (!berkas || typeof berkas !== 'object' || Object.keys(berkas).length === 0) return alamat;
  const cleanAlamat = (alamat || "").replace(/\n*<!--PPDB_FILES:[\s\S]*?-->$/, "");
  return `${cleanAlamat}\n<!--PPDB_FILES:${JSON.stringify(berkas)}-->`;
}

export function unpackBerkasFromAlamat(alamat) {
  if (typeof alamat !== 'string') return { cleanAlamat: alamat || "", berkas: {} };
  const match = alamat.match(/<!--PPDB_FILES:([\s\S]*?)-->$/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === 'object') return { cleanAlamat: alamat.replace(/\n*<!--PPDB_FILES:[\s\S]*?-->$/, ""), berkas: parsed };
    } catch (e) { console.error("Error parsing berkas metadata:", e); }
  }
  return { cleanAlamat: alamat, berkas: {} };
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + sizes[i];
}
