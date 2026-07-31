import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database SD Negeri Bobong...");

  const dataDir = path.join(process.cwd(), 'data');
  const configPath = path.join(dataDir, 'website_config.json');
  const teachersPath = path.join(dataDir, 'teachers.json');
  const newsPath = path.join(dataDir, 'news.json');

  // 1. Seed Global Website Config
  if (fs.existsSync(configPath)) {
    try {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      await prisma.config.upsert({
        where: { id: 'global_config' },
        update: {
          marquee_announcements: configData.marquee_announcements || [],
          stats: configData.stats || {},
          ppdb_contacts: configData.ppdb_contacts || {},
          force_local_cache: configData.force_local_cache === true,
          downloads: configData.downloads || [],
          faqs: configData.faqs || [],
          gallery: configData.gallery || [],
          popup_announcement: configData.popup_announcement || null
        },
        create: {
          id: 'global_config',
          marquee_announcements: configData.marquee_announcements || [],
          stats: configData.stats || {},
          ppdb_contacts: configData.ppdb_contacts || {},
          force_local_cache: false,
          downloads: configData.downloads || [],
          faqs: configData.faqs || [],
          gallery: configData.gallery || [],
          popup_announcement: configData.popup_announcement || null
        }
      });
      console.log("✅ Config global berhasil di-seed.");
    } catch (e) {
      console.error("❌ Gagal seed Config:", e.message);
    }
  }

  // 2. Seed Teachers
  if (fs.existsSync(teachersPath)) {
    try {
      const teachers = JSON.parse(fs.readFileSync(teachersPath, 'utf-8'));
      for (const t of teachers) {
        await prisma.teacher.upsert({
          where: { id: t.id },
          update: {
            name: t.name, role: t.role, details: t.details,
            status: t.status, image: t.image, nip: t.nip || null
          },
          create: {
            id: t.id, name: t.name, role: t.role, details: t.details,
            status: t.status, image: t.image, nip: t.nip || null
          }
        });
      }
      console.log(`✅ ${teachers.length} Data guru & staf berhasil di-seed.`);
    } catch (e) {
      console.error("❌ Gagal seed Teachers:", e.message);
    }
  }

  // 3. Seed News
  if (fs.existsSync(newsPath)) {
    try {
      const newsList = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
      for (const n of newsList) {
        await prisma.news.upsert({
          where: { id: n.id },
          update: {
            title: n.title, date: n.date, category: n.category,
            image: n.image, content: n.content, images: n.images || []
          },
          create: {
            id: n.id, title: n.title, date: n.date, category: n.category,
            image: n.image, content: n.content, images: n.images || []
          }
        });
      }
      console.log(`✅ ${newsList.length} Artikel berita berhasil di-seed.`);
    } catch (e) {
      console.error("❌ Gagal seed News:", e.message);
    }
  }

  console.log("🎉 Seeding database SD Negeri Bobong selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
