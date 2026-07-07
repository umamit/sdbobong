import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');
let hasErrors = false;
const MAX_LINES = 800;

console.log("🔍 Running Automated File Length Limit Checks (< 800 lines)...");

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
        const lines = content.split('\n').length;
        if (lines > MAX_LINES) {
          const relativePath = path.relative(projectRoot, fullPath);
          console.error(`❌ Error: File ${relativePath} has ${lines} lines, which exceeds the limit of ${MAX_LINES} lines!`);
          hasErrors = true;
        }
      }
    }
  }
}

checkDirectory(srcDir);

if (hasErrors) {
  console.error("⚠️ File length verification FAILED! Please refactor and split files exceeding 800 lines.");
  process.exit(1);
} else {
  console.log("✅ All files under src/ are within the 800-line limit!");
  process.exit(0);
}
