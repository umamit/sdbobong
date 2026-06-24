/**
 * database.js — Entry Point (Refactored)
 * Re-exports all database functions from domain modules in src/lib/db/
 * Each module is under 800 lines as per AGENTS.md §3 constraints.
 */

// Core: supabase client, path constants, shared utilities
export {
  supabase,
  DATA_DIR,
  isServerless,
  WEBSITE_CONFIG_JSON,
  NEWS_JSON,
  TEACHERS_JSON,
  PENDAFTARAN_JSON,
  ACHIEVEMENTS_JSON,
  MESSAGES_JSON,
  GRADUATION_JSON,
  STUDENTS_JSON,
  isSupabaseEnabled,
  handlePhotoUpload,
  anonymizeName,
  cleanAddress,
  formatWaktuDaftar,
  packImagesIntoContent,
  unpackImagesFromContent,
  packBerkasIntoAlamat,
  unpackBerkasFromAlamat,
  formatBytes,
  getCachedConfig,
  setCachedConfig,
} from './db/core.js';

// Config: website config, seeding status
export {
  loadWebConfig,
  saveWebConfig,
  isTableSeeded,
  markTableSeeded,
} from './db/config.js';

// News
export {
  loadNews,
  saveNews,
  getAvailableNewsColumns,
} from './db/news.js';

// Teachers
export {
  loadTeachers,
  saveTeachers,
  sortTeachersList,
} from './db/teachers.js';

// Achievements
export {
  loadAchievements,
  saveAchievements,
} from './db/achievements.js';

// Messages
export {
  loadMessages,
  saveMessages,
} from './db/messages.js';

// Graduation
export {
  loadGraduation,
  saveGraduation,
} from './db/graduation.js';

// Students
export {
  loadStudents,
  saveStudents,
} from './db/students.js';

// Sync & PPDB column detection
export {
  syncLocalToSupabase,
  loadLocalStatuses,
  getAvailableSupabaseColumns,
} from './db/sync.js';

// Storage usage
export {
  getStorageUsage,
} from './db/storage.js';
