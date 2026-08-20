import { prisma } from '../src/lib/prisma.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

async function runMigration() {
  console.log("=== Memulai Migrasi Gambar Base64 ke Supabase Storage ===");

  if (!supabase) {
    console.error("Error: Supabase URL atau Service Role Key tidak terkonfigurasi di env.");
    process.exit(1);
  }

  try {
    // 1. Ambil semua berita dari database
    const newsList = await prisma.news.findMany();
    console.log(`Ditemukan total ${newsList.length} berita di database.`);

    let migratedCount = 0;

    for (const article of newsList) {
      console.log(`\nMemeriksa berita: "${article.title}" (ID: ${article.id})`);
      
      let updatedImage = article.image;
      let updatedImages = [...(article.images || [])];
      let needsUpdate = false;

      // Check primary cover image
      if (article.image && article.image.startsWith('data:')) {
        console.log("-> Mendeteksi gambar utama berformat Base64. Mengunggah ke Supabase...");
        const publicUrl = await uploadBase64Image(article.image, article.id, "primary");
        if (publicUrl) {
          updatedImage = publicUrl;
          needsUpdate = true;
          console.log(`-> Sukses upload! URL baru: ${publicUrl}`);
        } else {
          console.error("-> Gagal mengunggah gambar utama.");
        }
      }

      // Check gallery images array
      if (article.images && article.images.length > 0) {
        for (let i = 0; i < updatedImages.length; i++) {
          const img = updatedImages[i];
          if (img && img.startsWith('data:')) {
            console.log(`-> Mendeteksi gambar galeri [${i}] berformat Base64. Mengunggah...`);
            const publicUrl = await uploadBase64Image(img, article.id, `gallery_${i}`);
            if (publicUrl) {
              updatedImages[i] = publicUrl;
              needsUpdate = true;
              console.log(`-> Sukses upload galeri [${i}]! URL baru: ${publicUrl}`);
            } else {
              console.error(`-> Gagal mengunggah gambar galeri [${i}].`);
            }
          }
        }
      }

      // 2. Jika ada perubahan, update database
      if (needsUpdate) {
        await prisma.news.update({
          where: { id: article.id },
          data: {
            image: updatedImage,
            images: updatedImages
          }
        });
        console.log(`✓ Sukses memperbarui artikel "${article.title}" di database.`);
        migratedCount++;
        
        // Jeda waktu singkat untuk mencegah EMAXCONNSESSION
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log("✓ Artikel ini sudah menggunakan URL normal. Tidak perlu migrasi.");
      }
    }

    console.log(`\n=== Migrasi Selesai! Berhasil memigrasi ${migratedCount} berita. ===`);
  } catch (err) {
    console.error("Terjadi error selama proses migrasi:", err);
  } finally {
    await prisma.$disconnect();
  }
}

async function uploadBase64Image(base64Str, articleId, prefix) {
  try {
    const parts = base64Str.split(',');
    if (parts.length < 2) return null;

    const meta = parts[0]; // e.g. "data:image/webp;base64"
    const base64Data = parts[1];

    const mimeMatch = meta.match(/data:(.*?);base64/);
    if (!mimeMatch) return null;
    const mimeType = mimeMatch[1]; // e.g. "image/webp"

    let ext = 'webp';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';

    const filename = `${Date.now()}_migrated_${articleId}_${prefix}.${ext}`;
    const buffer = Buffer.from(base64Data, 'base64');

    const { error } = await supabase.storage
      .from('news')
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error(`Upload error detail:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('news')
      .getPublicUrl(filename);

    return publicUrlData?.publicUrl || null;
  } catch (e) {
    console.error("Gagal melakukan parsing atau upload base64:", e.message || e);
    return null;
  }
}

runMigration();
