import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseEnabled, formatBytes } from './core.js';

function getDirSize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      size += stats.isDirectory() ? getDirSize(filePath) : stats.size;
    }
  } catch (e) { console.error("Error getting directory size:", e); }
  return size;
}

export async function getStorageUsage() {
  let supabaseSize = 0, localSize = 0, supabaseError = null;
  const supabaseActive = isSupabaseEnabled();
  try { localSize = getDirSize(path.join(process.cwd(), 'public', 'images', 'uploads')); }
  catch (e) { console.error("Failed to calculate local storage size:", e); }
  if (supabaseActive) {
    try {
      let bucketsList = ['teachers', 'news'];
      try { const { data: buckets, error } = await supabase.storage.listBuckets(); if (!error && buckets?.length > 0) bucketsList = buckets.map(b => b.name); } catch (e) {}
      for (const bucket of bucketsList) {
        try {
          const { data: files, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });
          if (error) { console.error(`Error listing bucket ${bucket}:`, error); continue; }
          if (files) { for (const file of files) supabaseSize += file.metadata?.size || file.size || 0; }
        } catch (e) { console.error(`Failed to list files in bucket ${bucket}:`, e); }
      }
    } catch (e) { console.error("Failed to calculate Supabase storage size:", e); supabaseError = e.message || String(e); }
  }
  const totalSize = supabaseActive ? supabaseSize : localSize;
  return { supabaseSize, localSize, supabaseFormatted: formatBytes(supabaseSize), localFormatted: formatBytes(localSize), totalSize, totalFormatted: formatBytes(totalSize), isSupabaseActive: supabaseActive, error: supabaseError };
}
