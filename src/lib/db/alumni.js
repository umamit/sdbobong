import fs from 'fs';
import path from 'path';
import { isSupabaseEnabled } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';
import { prisma } from '../prisma.js';

export const ALUMNI_JSON = path.join(process.cwd(), 'data', 'alumni.json');

let cachedAlumni = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

export function getFreshCachedAlumni() {
  if (cachedAlumni && (Date.now() - cacheTime < CACHE_TTL)) {
    return cachedAlumni;
  }
  return null;
}

export function invalidateAlumniCache() {
  cachedAlumni = null;
  cacheTime = 0;
}

export function setCachedAlumni(data) {
  cachedAlumni = data;
  cacheTime = Date.now();
}

export async function loadAlumni() {
  const fresh = getFreshCachedAlumni();
  if (fresh) return fresh;

  let localAlumni = [];
  if (fs.existsSync(ALUMNI_JSON)) {
    try {
      localAlumni = JSON.parse(fs.readFileSync(ALUMNI_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local alumni:", e);
    }
  }

  if (!isSupabaseEnabled()) {
    setCachedAlumni(localAlumni);
    return localAlumni;
  }

  try {
    const supabaseAlumni = await prisma.alumni.findMany({
      orderBy: { id: 'desc' }
    });

    const alumniSeeded = await isTableSeeded("alumni");
    if ((!supabaseAlumni || supabaseAlumni.length === 0) && localAlumni.length > 0 && !alumniSeeded) {
      for (const item of localAlumni) {
        await prisma.alumni.create({
          data: {
            nama_lengkap: item.nama_lengkap,
            tahun_lulus: String(item.tahun_lulus),
            sekolah_lanjutan: item.sekolah_lanjutan || null,
            pekerjaan: item.pekerjaan || null,
            pesan_kesan: item.pesan_kesan || null,
            foto: item.foto || null,
            status: item.status || 'Approved',
            created_at: item.created_at || new Date().toISOString()
          }
        });
      }
      await markTableSeeded("alumni");
      const freshSupabase = await prisma.alumni.findMany({ orderBy: { id: 'desc' } });
      setCachedAlumni(freshSupabase);
      return freshSupabase;
    }

    if (supabaseAlumni && supabaseAlumni.length > 0 && !alumniSeeded) {
      await markTableSeeded("alumni");
    }

    const result = supabaseAlumni && supabaseAlumni.length > 0 ? supabaseAlumni : localAlumni;
    setCachedAlumni(result);
    return result;
  } catch (e) {
    console.error("Error loading alumni from Supabase via Prisma, falling back to local:", e.message || e);
    setCachedAlumni(localAlumni);
    return localAlumni;
  }
}

export async function createAlumniRecord(alumniData) {
  invalidateAlumniCache();

  let localAlumni = [];
  if (fs.existsSync(ALUMNI_JSON)) {
    try { localAlumni = JSON.parse(fs.readFileSync(ALUMNI_JSON, 'utf-8')); } catch (e) {}
  }

  const newRecord = {
    id: localAlumni.length > 0 ? Math.max(...localAlumni.map(a => a.id || 0)) + 1 : 1,
    nama_lengkap: alumniData.nama_lengkap,
    tahun_lulus: String(alumniData.tahun_lulus),
    sekolah_lanjutan: alumniData.sekolah_lanjutan || null,
    pekerjaan: alumniData.pekerjaan || null,
    pesan_kesan: alumniData.pesan_kesan || null,
    foto: alumniData.foto || null,
    status: alumniData.status || 'Pending',
    created_at: alumniData.created_at || new Date().toISOString()
  };

  localAlumni.unshift(newRecord);
  try {
    fs.writeFileSync(ALUMNI_JSON, JSON.stringify(localAlumni, null, 4), 'utf-8');
  } catch (e) {
    console.error("Error saving local alumni record:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      const created = await prisma.alumni.create({
        data: {
          nama_lengkap: alumniData.nama_lengkap,
          tahun_lulus: String(alumniData.tahun_lulus),
          sekolah_lanjutan: alumniData.sekolah_lanjutan || null,
          pekerjaan: alumniData.pekerjaan || null,
          pesan_kesan: alumniData.pesan_kesan || null,
          foto: alumniData.foto || null,
          status: alumniData.status || 'Pending',
          created_at: newRecord.created_at
        }
      });
      return created;
    } catch (e) {
      console.error("Error saving alumni to Supabase via Prisma:", e.message || e);
    }
  }
  return newRecord;
}

export async function deleteAlumniRecord(id) {
  invalidateAlumniCache();

  // Remove from local JSON
  if (fs.existsSync(ALUMNI_JSON)) {
    try {
      const local = JSON.parse(fs.readFileSync(ALUMNI_JSON, 'utf-8'));
      const filtered = local.filter(a => Number(a.id) !== Number(id));
      fs.writeFileSync(ALUMNI_JSON, JSON.stringify(filtered, null, 4), 'utf-8');
    } catch (e) {
      console.error("Error removing alumni from local JSON:", e);
    }
  }

  // Remove from Supabase via Prisma — gracefully ignore P2025 (record not found)
  if (isSupabaseEnabled()) {
    try {
      await prisma.alumni.delete({ where: { id: Number(id) } });
    } catch (e) {
      if (e?.code !== 'P2025') {
        console.error("Error deleting alumni from Supabase:", e.message || e);
      }
    }
  }

  return true;
}
