import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');
let hasErrors = false;
const MAX_LINES = 150;

console.log("🔍 Running Automated File Length Limit Checks (< 150 lines)...");

// Legacy files that are exempt from the 150 line limit for backward compatibility.
// Any new files or refactored files MUST stay under 150 lines.
const EXEMPT_FILES = [
  'src/proxy.js',
  'src/app/page.js',
  'src/app/error.js',
  'src/app/not-found.js',
  'src/app/global-error.js',
  'src/app/guru/dashboard/GuruDashboardClient.js',
  'src/app/guru/login/page.js',
  'src/app/profil/TeacherFlow.jsx',
  'src/app/profil/page.js',
  'src/app/profil/TeacherModal.jsx',
  'src/app/profil/sejarah/page.js',
  'src/app/profil/visi-misi/page.js',
  'src/app/nilai/GradesClient.js',
  'src/app/hubungi-kami/ContactClient.js',
  'src/app/unduh/DownloadClient.js',
  'src/app/buku-tamu/BukuTamuClient.js',
  'src/app/formulir-ppdb/page.js',
  'src/app/admin/teachers/edit/[id]/EditTeacherClient.js',
  'src/app/admin/dashboard/AdminDashboardClient.js',
  'src/app/admin/dashboard/page.js',
  'src/app/admin/dashboard/AdminDashboardContext.js',
  'src/app/admin/dashboard/hooks/useConfigHandlers.js',
  'src/app/admin/dashboard/hooks/usePpdbHandlers.js',
  'src/app/admin/dashboard/hooks/useTeacherHandlers.js',
  'src/app/admin/dashboard/hooks/useContentUtilityHandlers.js',
  'src/app/admin/dashboard/hooks/useStudentHandlers.js',
  'src/app/admin/dashboard/hooks/usePageContentHandlers.js',
  'src/app/admin/dashboard/hooks/useSystemHandlers.js',
  'src/app/admin/dashboard/hooks/useGalleryHandlers.js',
  'src/app/admin/dashboard/hooks/useNewsHandlers.js',
  'src/app/admin/login/page.js',
  'src/app/akademik/page.js',
  'src/app/akademik/kalender/page.js',
  'src/app/alumni/AlumniClient.js',
  'src/app/actions/ppdb.js',
  'src/app/berita/BeritaSearchClient.js',
  'src/app/kelulusan/GraduationClient.js',
  'src/app/api/graduation/route.js',
  'src/app/api/messages/route.js',
  'src/app/api/chat/route.js',
  'src/app/api/chat/fallback.js',
  'src/app/api/config/route.js',
  'src/app/api/auth/route.js',
  'src/app/api/admin/ppdb-anomaly/route.js',
  'src/app/api/ppdb/route.js',
  'src/app/api/teachers/route.js',
  'src/app/api/teachers/bulk/route.js',
  'src/app/api/students/route.js',
  'src/app/api/students/bulk/route.js',
  'src/app/api/news/route.js',
  'src/app/login/page.js',
  'src/app/ppdb-online/page.js',
  'src/app/ppdb-online/ParentWaliSection.js',
  'src/app/ppdb-online/sukses/page.js',
  'src/app/galeri/GalleryClient.js',
  'src/components/Header.jsx',
  'src/components/RichTextEditor.jsx',
  'src/components/StatsCounter.jsx',
  'src/components/LayoutControl.jsx',
  'src/components/InteractiveFacilityMap.jsx',
  'src/components/AnnouncementModal.jsx',
  'src/components/NewsComments.jsx',
  'src/components/Footer.module.css',
  'src/components/MobileBottomTabBar.jsx',
  'src/components/PWAInstallPrompt.jsx',
  'src/components/MaintenanceView.jsx',
  'src/components/NewsCard.jsx',
  'src/components/PPDBPortal.jsx',
  'src/components/Header.module.css',
  'src/components/WebMcpShim.jsx',
  'src/components/NewsReactions.jsx',
  'src/components/FacilityMapSvg.jsx',
  'src/components/DisciplinePoints.jsx',
  'src/components/ui/DynamicIslandToast.jsx',
  'src/components/ui/ContextMenu.jsx',
  'src/components/ui/ActionSheet.jsx',
  'src/components/ui/AppleConfirmModal.jsx',
  'src/components/chat/ChatWidget.jsx',
  'src/components/chat/chatHelper.js',
  'src/components/chat/ChatWidget.module.css',
  'src/components/admin/tabs/NewsModerationTab.jsx',
  'src/components/admin/tabs/TeachersTab.jsx',
  'src/components/admin/tabs/GalleryTab.jsx',
  'src/components/admin/tabs/OverviewCharts.jsx',
  'src/components/admin/tabs/AchievementsTab.jsx',
  'src/components/admin/tabs/GraduationTab.jsx',
  'src/components/admin/tabs/AlumniTab.jsx',
  'src/components/admin/tabs/StudentsTab.jsx',
  'src/components/admin/tabs/OverviewTab.jsx',
  'src/components/admin/tabs/PpdbTab.jsx',
  'src/components/admin/tabs/MessagesTab.jsx',
  'src/components/admin/tabs/ContentTab.jsx',
  'src/components/admin/tabs/SecurityTab.jsx',
  'src/components/admin/tabs/NewsTab.jsx',
  'src/components/admin/tabs/pages/PpdbSubTab.jsx',
  'src/components/admin/tabs/pages/KesiswaanSubTab.jsx',
  'src/components/admin/tabs/pages/ProfilSubTab.jsx',
  'src/components/admin/tabs/pages/AkademikSubTab.jsx',
  'src/components/admin/tabs/pages/BerandaSubTab.jsx',
  'src/components/admin/shared/Sidebar.jsx',
  'src/components/admin/shared/AdminErrorBoundary.jsx',
  'src/components/admin/shared/modals/ContentUtilityModals.jsx',
  'src/components/admin/shared/modals/PpdbModals.jsx',
  'src/components/admin/shared/modals/DapodikSyncModal.jsx',
  'src/components/admin/shared/modals/TeacherModals.jsx',
  'src/components/admin/shared/modals/GraduationModals.jsx',
  'src/components/admin/shared/modals/StudentModals.jsx',
  'src/components/admin/shared/modals/TeacherSyncModal.jsx',
  'src/components/academic/AcademicEventModal.jsx',
  'src/components/academic/CalendarTab.jsx',
  'src/lib/validators.js',
  'src/lib/audit.js',
  'src/lib/db/core.js',
  'src/lib/db/sync.js',
  'src/lib/db/config.js',
  'src/lib/db/news.js',
  'src/lib/db/alumni.js',
  'src/lib/db/config.defaults.js',
  'src/data/facilitiesData.js'
];

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.css'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        // If the file ends with a newline, ignore the final trailing empty element
        if (lines.length > 0 && lines[lines.length - 1] === '') {
          lines.pop();
        }
        const lineCount = lines.length;
        if (lineCount > MAX_LINES) {
          const relativePath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
          if (EXEMPT_FILES.includes(relativePath)) {
            // legacy file warning, not an error
            console.log(`⚠️ Legacy file ${relativePath} has ${lineCount} lines (limit is ${MAX_LINES})`);
          } else {
            console.error(`❌ Error: File ${relativePath} has ${lineCount} lines, which exceeds the limit of ${MAX_LINES} lines!`);
            hasErrors = true;
          }
        }
      }
    }
  }
}

checkDirectory(srcDir);

if (hasErrors) {
  console.error("⚠️ File length verification FAILED! Please refactor and split files exceeding 150 lines.");
  process.exit(1);
} else {
  console.log("✅ All new and non-exempt files under src/ are within the 150-line limit!");
  process.exit(0);
}
