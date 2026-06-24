import fs from 'fs';
import { supabase, isSupabaseEnabled, STUDENTS_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';

export async function loadStudents() {
  let localStudents = [];
  if (fs.existsSync(STUDENTS_JSON)) {
    try { localStudents = JSON.parse(fs.readFileSync(STUDENTS_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local students list:", e); }
  }
  if (!isSupabaseEnabled()) return localStudents;
  try {
    const { data: dbStudents, error } = await supabase.from("students_sdn_bobong").select("*");
    if (!error && dbStudents) {
      const studentsSeeded = await isTableSeeded("students");
      if (dbStudents.length === 0 && localStudents.length > 0 && !studentsSeeded) {
        for (const s of localStudents) {
          const packedAddress = s.grades ? `${s.address || ""}<!--GRADES:${JSON.stringify(s.grades)}-->` : s.address;
          await supabase.from("students_sdn_bobong").insert({ id: s.id, nisn: s.nisn, nis: s.nis, name: s.name, class: s.class, gender: s.gender, birth_place: s.birth_place, birth_date: s.birth_date, address: packedAddress, parent_name: s.parent_name, parent_phone: s.parent_phone, status: s.status });
        }
        await markTableSeeded("students");
        return localStudents;
      }
      if (dbStudents.length > 0 && !studentsSeeded) await markTableSeeded("students");
      const studList = dbStudents.map(s => {
        let address = s.address || "", grades = null;
        if (address.includes('<!--GRADES:')) {
          try { const match = address.match(/<!--GRADES:([\s\S]*?)-->/); if (match) { grades = JSON.parse(match[1]); address = address.replace(/<!--GRADES:[\s\S]*?-->/, '').trim(); } } catch (err) {}
        }
        return { id: s.id, nisn: s.nisn, nis: s.nis, name: s.name, class: s.class, gender: s.gender, birth_place: s.birth_place, birth_date: s.birth_date, address, parent_name: s.parent_name, parent_phone: s.parent_phone, status: s.status, grades };
      });
      try { fs.writeFileSync(STUDENTS_JSON, JSON.stringify(studList, null, 4), 'utf-8'); } catch (fsErr) {}
      return studList;
    }
  } catch (e) { console.error("Supabase loadStudents failed:", e.message || e); }
  return localStudents;
}

export async function saveStudents(studentsList) {
  let localSaved = false;
  try { fs.writeFileSync(STUDENTS_JSON, JSON.stringify(studentsList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving students locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const s of studentsList) {
        const packedAddress = s.grades ? `${s.address || ""}<!--GRADES:${JSON.stringify(s.grades)}-->` : s.address;
        const { error } = await supabase.from("students_sdn_bobong").upsert({ id: s.id, nisn: s.nisn, nis: s.nis, name: s.name, class: s.class, gender: s.gender, birth_place: s.birth_place, birth_date: s.birth_date, address: packedAddress, parent_name: s.parent_name, parent_phone: s.parent_phone, status: s.status });
        if (error) throw error;
      }
      const localIds = new Set(studentsList.map(s => s.id));
      const { data: dbStud, error: selectError } = await supabase.from("students_sdn_bobong").select("id");
      if (!selectError && dbStud) {
        for (const row of dbStud) {
          if (!localIds.has(row.id)) await supabase.from("students_sdn_bobong").delete().eq("id", row.id);
        }
      }
      return true;
    } catch (e) { console.error("Supabase saveStudents failed:", e.message || e); return localSaved; }
  }
  return localSaved;
}
