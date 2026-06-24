import fs from 'fs';
import { supabase, isSupabaseEnabled, GRADUATION_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';

export async function loadGraduation() {
  let localGraduation = [];
  if (fs.existsSync(GRADUATION_JSON)) {
    try { localGraduation = JSON.parse(fs.readFileSync(GRADUATION_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local graduation list:", e); }
  }
  if (!isSupabaseEnabled()) return localGraduation;
  try {
    const { data: dbGraduation, error } = await supabase.from("graduation_sdn_bobong").select("*");
    if (!error && dbGraduation) {
      const graduationSeeded = await isTableSeeded("graduation");
      if (dbGraduation.length === 0 && localGraduation.length > 0 && !graduationSeeded) {
        for (const g of localGraduation) {
          await supabase.from("graduation_sdn_bobong").insert({ id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name });
        }
        await markTableSeeded("graduation");
        return localGraduation;
      }
      if (dbGraduation.length > 0 && !graduationSeeded) await markTableSeeded("graduation");
      const gradList = dbGraduation.map(g => ({ id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name }));
      try { fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8'); } catch (fsErr) {}
      return gradList;
    }
  } catch (e) { console.error("Supabase loadGraduation failed:", e.message || e); }
  return localGraduation;
}

export async function saveGraduation(gradList) {
  let localSaved = false;
  try { fs.writeFileSync(GRADUATION_JSON, JSON.stringify(gradList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving graduation locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const g of gradList) {
        const { error } = await supabase.from("graduation_sdn_bobong").upsert({ id: g.id, nisn: g.nisn, no_peserta: g.no_peserta, name: g.name, status: g.status, sk_number: g.sk_number, birth_place: g.birth_place, birth_date: g.birth_date, parent_name: g.parent_name });
        if (error) throw error;
      }
      const localIds = new Set(gradList.map(g => g.id));
      const { data: dbGrad, error: selectError } = await supabase.from("graduation_sdn_bobong").select("id");
      if (!selectError && dbGrad) {
        for (const row of dbGrad) {
          if (!localIds.has(row.id)) await supabase.from("graduation_sdn_bobong").delete().eq("id", row.id);
        }
      }
      return true;
    } catch (e) { console.error("Supabase saveGraduation failed:", e.message || e); return localSaved; }
  }
  return localSaved;
}
