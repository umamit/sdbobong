import fs from 'fs';
import { supabase, isSupabaseEnabled, ACHIEVEMENTS_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';

export async function loadAchievements() {
  let localAchievements = [];
  if (fs.existsSync(ACHIEVEMENTS_JSON)) {
    try { localAchievements = JSON.parse(fs.readFileSync(ACHIEVEMENTS_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local achievements:", e); }
  }
  if (!isSupabaseEnabled()) return localAchievements;
  try {
    const { data: supabaseAchievements, error } = await supabase.from("achievements_sdn_bobong").select("*");
    if (error) throw error;
    const achievementsSeeded = await isTableSeeded("achievements");
    if ((!supabaseAchievements || supabaseAchievements.length === 0) && localAchievements.length > 0 && !achievementsSeeded) {
      for (const ach of localAchievements) {
        await supabase.from("achievements_sdn_bobong").insert({ id: ach.id, title: ach.title, level: ach.level, year: ach.year, description: ach.description });
      }
      await markTableSeeded("achievements");
      return localAchievements;
    }
    if (supabaseAchievements && supabaseAchievements.length > 0 && !achievementsSeeded) await markTableSeeded("achievements");
    if (supabaseAchievements) {
      const achievementsList = supabaseAchievements.map(ach => ({ id: ach.id, title: ach.title, level: ach.level, year: ach.year, description: ach.description }));
      achievementsList.sort((a, b) => String(b.year || "").localeCompare(String(a.year || "")));
      try { fs.writeFileSync(ACHIEVEMENTS_JSON, JSON.stringify(achievementsList, null, 4), 'utf-8'); } catch (e) {}
      return achievementsList;
    }
  } catch (e) { console.error("Error loading achievements from Supabase:", e.message || e); }
  return localAchievements;
}

export async function saveAchievements(achievementsList) {
  let localSaved = false;
  try { fs.writeFileSync(ACHIEVEMENTS_JSON, JSON.stringify(achievementsList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving achievements locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const ach of achievementsList) {
        const { error } = await supabase.from("achievements_sdn_bobong").upsert({ id: ach.id, title: ach.title, level: ach.level, year: ach.year, description: ach.description });
        if (error) throw error;
      }
      const localIds = new Set(achievementsList.map(ach => ach.id));
      const { data: supabaseAchievements, error: selectError } = await supabase.from("achievements_sdn_bobong").select("id");
      if (selectError) throw selectError;
      if (supabaseAchievements) {
        for (const row of supabaseAchievements) {
          if (!localIds.has(row.id)) { const { error: deleteError } = await supabase.from("achievements_sdn_bobong").delete().eq("id", row.id); if (deleteError) throw deleteError; }
        }
      }
      return true;
    } catch (e) { console.error("Error saving achievements to Supabase:", e.message || e); return localSaved; }
  }
  return localSaved;
}
