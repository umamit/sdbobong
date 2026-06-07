/**
 * Script Premium untuk Menambahkan Dokumen Pengetahuan Baru ke Supabase Vector (pgvector)
 * Menggunakan Google Gemini API 'text-embedding-004' untuk menghitung embedding.
 * 
 * Penggunaan:
 * node scripts/add-document.js "Konten informasi yang ingin dimasukkan..." "kategori-dokumen"
 */

const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Muat kredensial dari .env secara manual (agar aman dari ketergantungan dotenv)
const envPath = path.join(process.cwd(), '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        env[key] = value;
      }
    }
  });
}

const SUPABASE_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ ERROR: Kredensial Supabase tidak ditemukan di berkas .env!");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY tidak ditemukan di berkas .env!");
  process.exit(1);
}

// Ambil parameter dari baris perintah
const contentArg = process.argv[2];
const categoryArg = process.argv[3] || 'umum';

if (!contentArg) {
  console.log("\n✨ === PANDUAN PENGGUNAAN ADD-DOCUMENT ===");
  console.log("Silakan jalankan dengan argumen berikut:");
  console.log('node scripts/add-document.js "Isi konten teks dokumen..." "kategori"\n');
  console.log("Contoh:");
  console.log('node scripts/add-document.js "Kursus Bahasa Inggris LKB Taliabu diadakan setiap Selasa dan Kamis pukul 14.00 WIT di Aula Sekolah dengan biaya Rp 100.000/bulan." "brosur-kursus"\n');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function run() {
  try {
    console.log(`\n⏳ 1. Menghitung embedding untuk teks: "${contentArg.substring(0, 60)}..."`);
    
    // Hitung koordinat vektor makna (embedding) menggunakan model gemini-embedding-2
    const embedResponse = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: contentArg,
      config: { outputDimensionality: 1536 }
    });

    const embedding = embedResponse.embeddings?.[0]?.values;
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Gagal memperoleh array embedding dari Google Gemini API.");
    }

    console.log(`✅ Embedding berhasil dihitung! (${embedding.length} dimensi)`);
    console.log("⏳ 2. Mengirim data ke tabel 'school_documents' di Supabase...");

    const { data, error } = await supabase
      .from('school_documents')
      .insert({
        content: contentArg,
        metadata: { category: categoryArg, created_at: new Date().toISOString() },
        embedding: embedding
      })
      .select();

    if (error) {
      throw error;
    }

    console.log("\n🎉 === BERHASIL MENYIMPAN DOKUMEN KE KNOWLEDGE BASE! ===");
    console.log(`📍 ID Dokumen : ${data[0].id}`);
    console.log(`📍 Kategori   : ${categoryArg}`);
    console.log(`📍 Konten     : "${contentArg}"`);
    console.log("=========================================================\n");
    console.log("💡 Asisten virtual 'Aim AI' sekarang otomatis mengenali informasi ini saat dicari secara semantis!");

  } catch (err) {
    console.error("\n❌ TERJADI KESALAHAN:", err.message || err);
    process.exit(1);
  }
}

run();
