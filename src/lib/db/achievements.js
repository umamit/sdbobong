import fs from 'fs';
import { isSupabaseEnabled, ACHIEVEMENTS_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';
import { prisma } from '../prisma.js';

export async function loadAchievements() {
  let localAchievements = [];
  if (fs.existsSync(ACHIEVEMENTS_JSON)) {
    try { localAchievements = JSON.parse(fs.readFileSync(ACHIEVEMENTS_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local achievements:", e); }
  }
  if (!isSupabaseEnabled()) return localAchievements;
  try {
    const supabaseAchievements = await prisma.achievement.findMany();
    const achievementsSeeded = await isTableSeeded("achievements");
    if ((!supabaseAchievements || supabaseAchievements.length === 0) && localAchievements.length > 0 && !achievementsSeeded) {
      for (const ach of localAchievements) {
        await prisma.achievement.create({
          data: { id: ach.id, title: ach.title, level: ach.level, year: ach.year, description: ach.description }
        });
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
  } catch (e) { console.error("Error loading achievements from Supabase via Prisma:", e.message || e); }
  return localAchievements;
}

export async function saveAchievements(achievementsList) {
  let localSaved = false;
  try { fs.writeFileSync(ACHIEVEMENTS_JSON, JSON.stringify(achievementsList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving achievements locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const ach of achievementsList) {
        await prisma.achievement.upsert({
          where: { id: ach.id },
          update: { title: ach.title, level: ach.level, year: ach.year, description: ach.description },
          create: { id: ach.id, title: ach.title, level: ach.level, year: ach.year, description: ach.description }
        });
      }
      const localIds = new Set(achievementsList.map(ach => ach.id));
      const supabaseAchievements = await prisma.achievement.findMany({
        select: { id: true }
      });
      if (supabaseAchievements) {
        for (const row of supabaseAchievements) {
          if (!localIds.has(row.id)) {
            await prisma.achievement.delete({
              where: { id: row.id }
            });
          }
        }
      }
      return true;
    } catch (e) { console.error("Error saving achievements to Supabase via Prisma:", e.message || e); return localSaved; }
  }
  return localSaved;
}
