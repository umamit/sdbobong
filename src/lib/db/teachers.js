import fs from 'fs';
import { supabase, isSupabaseEnabled, TEACHERS_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';

function getTeacherSortWeight(teacher) {
  const role = (teacher.role || "").toLowerCase();
  const details = (teacher.details || "").toLowerCase();
  if (role.includes("kepala sekolah")) return { priority: 1, classNum: 0 };
  if (role.includes("tata usaha") || role.includes("tu") || role.includes("koordinator tu")) return { priority: 2, classNum: 0 };
  if (role.includes("bendahara")) return { priority: 3, classNum: 0 };
  if (role.includes("komite")) return { priority: 4, classNum: 0 };
  const classMatch = role.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i) || details.match(/kelas\s*(1|2|3|4|5|6|iii|ii|i|vi|v|iv)/i);
  if (classMatch) {
    const romanMap = { 'i':1,'ii':2,'iii':3,'iv':4,'v':5,'vi':6,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6 };
    return { priority: 5, classNum: romanMap[classMatch[1].toLowerCase()] || 99 };
  }
  if (role.includes("guru kelas") || role.includes("wali kelas")) return { priority: 5, classNum: 99 };
  if (role.includes("guru") || details.includes("pendidik bidang studi") || details.includes("guru") || role.includes("bidang studi")) return { priority: 6, classNum: 0 };
  return { priority: 7, classNum: 0 };
}

export function sortTeachersList(teachersList) {
  if (!Array.isArray(teachersList)) return [];
  return [...teachersList].sort((a, b) => {
    const wA = getTeacherSortWeight(a), wB = getTeacherSortWeight(b);
    if (wA.priority !== wB.priority) return wA.priority - wB.priority;
    if (wA.priority === 5 && wA.classNum !== wB.classNum) return wA.classNum - wB.classNum;
    return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
  });
}

export async function loadTeachers(includePassword = false) {
  let localTeachers = [];
  if (fs.existsSync(TEACHERS_JSON)) {
    try { localTeachers = JSON.parse(fs.readFileSync(TEACHERS_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local teachers:", e); }
  }
  const cleanList = (list) => includePassword ? list : list.map(({ password, ...rest }) => rest);
  if (!isSupabaseEnabled()) return cleanList(sortTeachersList(localTeachers));

  try {
    const { data: supabaseTeachers, error } = await supabase.from("teachers_sdn_bobong").select("*");
    if (error) throw error;
    let hasNipColumn = false;
    try { const { error: nipError } = await supabase.from("teachers_sdn_bobong").select("nip").limit(1); if (!nipError) hasNipColumn = true; } catch (e) {}
    const teachersSeeded = await isTableSeeded("teachers");
    if ((!supabaseTeachers || supabaseTeachers.length === 0) && localTeachers.length > 0 && !teachersSeeded) {
      const sortedLocal = sortTeachersList(localTeachers);
      for (const t of sortedLocal) {
        const packedDetails = (t.subject || t.education || t.motto || t.bio || t.password)
          ? `${t.details || ""}<!--TEACHER_DETAILS:${JSON.stringify({ subject: t.subject||'', education: t.education||'', motto: t.motto||'', bio: t.bio||'', password: t.password||'' })}-->`
          : t.details;
        const insertObj = { id: t.id, name: t.name, role: t.role, details: packedDetails, status: t.status, image: t.image };
        if (hasNipColumn) insertObj.nip = t.nip || "";
        await supabase.from("teachers_sdn_bobong").insert(insertObj);
      }
      await markTableSeeded("teachers");
      return cleanList(sortedLocal);
    }
    if (supabaseTeachers && supabaseTeachers.length > 0 && !teachersSeeded) await markTableSeeded("teachers");
    if (supabaseTeachers) {
      const teachersList = supabaseTeachers.map(t => {
        let details = t.details || "", extra = {};
        if (details.includes('<!--TEACHER_DETAILS:')) {
          try { const match = details.match(/<!--TEACHER_DETAILS:([\s\S]*?)-->/); if (match) { extra = JSON.parse(match[1]); details = details.replace(/<!--TEACHER_DETAILS:[\s\S]*?-->/, '').trim(); } } catch (err) {}
        }
        const obj = { id: t.id, name: t.name, role: t.role, details, status: t.status, image: t.image, subject: extra.subject||"", education: extra.education||"", motto: extra.motto||"", bio: extra.bio||"" };
        if (includePassword || extra.password) obj.password = extra.password || "";
        if (hasNipColumn) obj.nip = t.nip || "";
        else { const localMatch = localTeachers.find(lt => lt.id === t.id); if (localMatch?.nip) obj.nip = localMatch.nip; }
        return obj;
      });
      const sortedList = sortTeachersList(teachersList);
      try { fs.writeFileSync(TEACHERS_JSON, JSON.stringify(sortedList, null, 4), 'utf-8'); } catch (e) {}
      return cleanList(sortedList);
    }
  } catch (e) { console.error("Error loading teachers from Supabase:", e.message || e); }
  return cleanList(sortTeachersList(localTeachers));
}

export async function saveTeachers(teachersList) {
  const existingTeachers = await loadTeachers(true);
  const sortedList = sortTeachersList(teachersList).map(t => {
    const existing = existingTeachers.find(et => et.id === t.id);
    return { ...t, password: t.password !== undefined ? t.password : (existing?.password || "") };
  });
  let localSaved = false;
  try { fs.writeFileSync(TEACHERS_JSON, JSON.stringify(sortedList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving teachers locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      let hasNipColumn = false;
      try { const { error: nipError } = await supabase.from("teachers_sdn_bobong").select("nip").limit(1); if (!nipError) hasNipColumn = true; } catch (e) {}
      for (const t of sortedList) {
        const packedDetails = (t.subject || t.education || t.motto || t.bio || t.password)
          ? `${t.details || ""}<!--TEACHER_DETAILS:${JSON.stringify({ subject: t.subject||'', education: t.education||'', motto: t.motto||'', bio: t.bio||'', password: t.password||'' })}-->`
          : t.details;
        const upsertObj = { id: t.id, name: t.name, role: t.role, details: packedDetails, status: t.status, image: t.image };
        if (hasNipColumn) upsertObj.nip = t.nip || "";
        const { error } = await supabase.from("teachers_sdn_bobong").upsert(upsertObj);
        if (error) throw error;
      }
      const localIds = new Set(sortedList.map(t => t.id));
      const { data: supabaseTeachers, error: selectError } = await supabase.from("teachers_sdn_bobong").select("id");
      if (selectError) throw selectError;
      if (supabaseTeachers) {
        for (const row of supabaseTeachers) {
          if (!localIds.has(row.id)) { const { error: deleteError } = await supabase.from("teachers_sdn_bobong").delete().eq("id", row.id); if (deleteError) throw deleteError; }
        }
      }
      return true;
    } catch (e) { console.error("Error saving teachers to Supabase:", e.message || e); return localSaved; }
  }
  return localSaved;
}
