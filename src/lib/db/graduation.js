import fs from 'fs';
import { isSupabaseEnabled, GRADUATION_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';
import { prisma } from '../prisma.js';

export async function loadGraduation() {
  let localGraduation = [];
  if (fs.existsSync(GRADUATION_JSON)) {
    try { localGraduation = JSON.parse(fs.readFileSync(GRADUATION_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local graduation list:", e); }
  }
  if (!isSupabaseEnabled()) return localGraduation;
  try {
    const dbGraduation = await prisma.graduation.findMany();
    const graduationSeeded = await isTableSeeded("graduation");
    if ((!dbGraduation || dbGraduation.length === 0) && localGraduation.length > 0 && !graduationSeeded) {
      for (const g of localGraduation) {
        await prisma.graduation.create({
          data: { id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name }
        });
      }
      await markTableSeeded("graduation");
      return localGraduation;
    }
    if (dbGraduation && dbGraduation.length > 0 && !graduationSeeded) await markTableSeeded("graduation");
    if (dbGraduation) {
      const gradList = dbGraduation.map(g => ({ id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name }));
      try { fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8'); } catch (fsErr) {}
      return gradList;
    }
  } catch (e) { console.error("Supabase loadGraduation failed via Prisma:", e.message || e); }
  return localGraduation;
}

export async function saveGraduation(gradList) {
  let localSaved = false;
  try { fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving graduation locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const g of gradList) {
        await prisma.graduation.upsert({
          where: { id: g.id },
          update: { nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name },
          create: { id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name }
        });
      }
      const localIds = new Set(gradList.map(g => g.id));
      const dbGrad = await prisma.graduation.findMany({ select: { id: true } });
      if (dbGrad) {
        for (const row of dbGrad) {
          if (!localIds.has(row.id)) {
            await prisma.graduation.delete({ where: { id: row.id } });
          }
        }
      }
      return true;
    } catch (e) { console.error("Supabase saveGraduation failed via Prisma:", e.message || e); return localSaved; }
  }
  return localSaved;
}
