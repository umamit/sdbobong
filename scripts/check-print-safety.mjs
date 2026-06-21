import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
let hasErrors = false;

console.log("🔍 Running Automated Print & PDF Export Safety Checks...");

// 1. Check style.css print media queries
const styleCssPath = path.join(projectRoot, 'public/css/style.css');
if (fs.existsSync(styleCssPath)) {
  const content = fs.readFileSync(styleCssPath, 'utf-8');
  
  // Check for forbidden display: block !important on generic div/span in print media
  const printBlocks = content.match(/@media\s+print\s*\{([\s\S]*?)\}/g) || [];
  printBlocks.forEach((block, idx) => {
    if (block.includes('display: block !important') && (block.includes('div') || block.includes('span') || block.includes('*'))) {
      // Check if it targets generic elements
      if (block.match(/(\.form-page\s+div|\.form-page\s+span|\*)\s*\{[^}]*display:\s*block\s*!important/)) {
        console.error(`❌ Error in style.css (@media print block ${idx + 1}): Found layout-breaking 'display: block !important' on generic elements inside form-page print styles!`);
        hasErrors = true;
      }
    }
    if (block.match(/overflow:\s*hidden\s*!important/)) {
      console.error(`❌ Error in style.css: Found forbidden 'overflow: hidden !important' inside @media print block ${idx + 1}!`);
      hasErrors = true;
    }
  });
}

// 2. Check page.js print overrides
const formulirPagePath = path.join(projectRoot, 'src/app/formulir-ppdb/page.js');
if (fs.existsSync(formulirPagePath)) {
  const content = fs.readFileSync(formulirPagePath, 'utf-8');
  
  if (content.match(/(\.form-page\s+div|\.form-page\s+span|\*)\s*\{[^}]*display:\s*block\s*!important/)) {
    console.error("❌ Error in src/app/formulir-ppdb/page.js: Found layout-breaking 'display: block !important' on generic elements inside inline styles!");
    hasErrors = true;
  }
  
  if (content.includes('overflow: hidden !important') && content.includes('@media print')) {
    console.error("❌ Error in src/app/formulir-ppdb/page.js: Found 'overflow: hidden !important' inside print media query!");
    hasErrors = true;
  }
  
  if (!content.includes('user-select: text !important')) {
    console.error("❌ Error in src/app/formulir-ppdb/page.js: Missing fail-safe 'user-select: text !important' override!");
    hasErrors = true;
  }
}

// 3. Check layout.js path bypasses
const layoutPath = path.join(projectRoot, 'src/app/layout.js');
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf-8');
  if (!content.includes('/formulir-ppdb')) {
    console.error("❌ Error in src/app/layout.js: '/formulir-ppdb' path is not bypassed in layout rules!");
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error("⚠️ Print safety verification FAILED! Please fix the errors listed above to prevent layout regressions on PDF exports.");
  process.exit(1);
} else {
  console.log("✅ Print & PDF Export safety verification PASSED successfully!");
  process.exit(0);
}
