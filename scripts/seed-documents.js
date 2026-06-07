/**
 * Script Premium untuk Melakukan Seeding Massal (Bulk Seed) Pengetahuan Sekolah
 * Memasukkan dokumen-dokumen penting seperti Brosur Kursus Bahasa Inggris dari luar sekolah,
 * ketentuan seragam, jam belajar, dan kegiatan ekstrakurikuler ke database Supabase pgvector.
 * 
 * Penggunaan:
 * node scripts/seed-documents.js
 */

const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Muat kredensial dari .env secara manual
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

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error("❌ ERROR: Kredensial Supabase atau GEMINI_API_KEY tidak lengkap di berkas .env!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Kumpulan dokumen pengetahuan sekolah yang sangat kaya data
const SEED_DOCUMENTS = [
  {
    category: "brosur-kursus",
    content: "INFORMASI BROSUR KURSUS BAHASA INGGRIS (MITRA LUAR SEKOLAH - LKB TALIABU): SD Negeri Bobong bekerjasama dengan Lembaga Kursus Bahasa Inggris Taliabu (LKB Taliabu) membuka kelas kursus intensif interaktif bagi siswa SDN Bobong dan umum. Pendaftaran dibuka untuk kelas Basic (kelas 1-3 SD) dan kelas Intermediate (kelas 4-6 SD). Program menggunakan metode fun learning, bernyanyi, game interaktif, dan bermain peran agar anak cerdas melafalkan percakapan harian. Jadwal kursus diadakan setiap hari Selasa dan Kamis sore pukul 14:00 - 16:00 WIT bertempat di Aula Serbaguna SDN Bobong. Biaya kursus sangat terjangkau yaitu Rp 100.000 per bulan dengan biaya pendaftaran awal Rp 25.000 (sudah termasuk modul panduan belajar eksklusif dan sertifikat kelulusan level). Pendaftaran dapat dilakukan langsung melalui Panitia LKB Taliabu via WhatsApp di nomor +6281245678901 (Ibu Sarah) atau mendaftar di loket khusus depan gerbang sekolah setiap jam pulang sekolah."
  },
  {
    category: "jam-belajar",
    content: "TATA TERTIB JAM BELAJAR MENGAJAR SD NEGERI BOBONG: Jam operasional sekolah dimulai dari hari Senin s.d. Sabtu. Setiap siswa diwajibkan hadir di sekolah paling lambat pukul 07:15 WIT untuk mengikuti kegiatan pembacaan doa bersama, literasi pagi, atau menyanyikan lagu wajib nasional di halaman sekolah. Proses Belajar Mengajar (KBM) dimulai tepat pukul 07:30 WIT. Jam kepulangan siswa adalah sebagai berikut: Kelas 1 dan Kelas 2 pulang pukul 10:45 WIT; Kelas 3 pulang pukul 12:15 WIT; Kelas 4, Kelas 5, dan Kelas 6 pulang pukul 12:45 WIT. Khusus hari Jumat seluruh kelas pulang serentak pukul 11:00 WIT setelah kerja bakti bersih lingkungan atau senam sehat bersama seluruh guru."
  },
  {
    category: "seragam",
    content: "KETENTUAN SERAGAM RESMI SISWA SDN BOBONG: Senin dan Selasa menggunakan seragam kemeja Putih dengan celana/rok Merah lengkap dengan dasi merah, topi berlogo sekolah, ikat pinggang hitam, kaos kaki putih, dan sepatu hitam polos. Rabu dan Kamis menggunakan seragam Pramuka lengkap dengan seluruh atribut gerakan pramuka, setangan leher merah-putih (hasduk), kaos kaki hitam, dan sepatu hitam. Jumat menggunakan kaos olahraga sekolah (untuk kegiatan jasmani sehat pagi) dan setelah itu diperbolehkan memakai busana Muslim/Muslimah sekolah yang rapi, bersih, dan sopan. Sabtu menggunakan baju kemeja Batik khas SDN Bobong dengan celana/rok putih, kaos kaki putih, dan sepatu hitam."
  },
  {
    category: "ekstrakurikuler",
    content: "DAFTAR KEGIATAN EKSTRAKURIKULER SD NEGERI BOBONG: Untuk menunjang kreativitas dan minat bakat siswa, SDN Bobong menyediakan beberapa kegiatan ekstrakurikuler unggulan yang dapat diikuti secara gratis oleh siswa kelas 3 s.d. 6: (1) Pramuka (Wajib bagi seluruh siswa sebagai pilar kepemimpinan dan disiplin), diadakan setiap Sabtu sore pukul 15.30 WIT. (2) Sanggar Tari Tradisional (Fokus pelestarian seni budaya Pulau Taliabu dan Maluku Utara), diadakan setiap Rabu sore pukul 16:00 WIT. (3) Klub Matematika dan Sains (Persiapan kompetisi Olimpiade Sains Nasional - OSN), diadakan setiap Selasa sore pukul 14.30 WIT. (4) Klub Sepak Bola & Atletik (Pelatihan fisik dan kompetisi turnamen antarsekolah), diadakan setiap Jumat sore pukul 15:30 WIT."
  }
];

async function seed() {
  console.log("\n🚀 Memulai Seeding Massal Dokumen Pengetahuan RAG (SDN Bobong)...");
  console.log(`Menyiapkan ${SEED_DOCUMENTS.length} dokumen untuk diproses...\n`);

  for (let i = 0; i < SEED_DOCUMENTS.length; i++) {
    const doc = SEED_DOCUMENTS[i];
    console.log(`⏳ [${i + 1}/${SEED_DOCUMENTS.length}] Memproses Dokumen (Kategori: ${doc.category}):`);
    console.log(`   Isi: "${doc.content.substring(0, 80)}..."`);

    try {
      // 1. Hitung embedding vektor menggunakan gemini-embedding-2
      const embedResponse = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: doc.content,
        config: { outputDimensionality: 1536 }
      });

      const embedding = embedResponse.embeddings?.[0]?.values;
      if (!embedding || !Array.isArray(embedding)) {
        throw new Error(`Gagal menghitung embedding untuk kategori ${doc.category}`);
      }

      // 2. Simpan ke database
      const { error } = await supabase
        .from('school_documents')
        .insert({
          content: doc.content,
          metadata: { category: doc.category, created_at: new Date().toISOString() },
          embedding: embedding
        });

      if (error) throw error;
      console.log(`   ✅ BERHASIL dimasukkan ke Supabase!\n`);

    } catch (err) {
      console.error(`   ❌ GAGAL memproses dokumen ini:`, err.message || err);
      console.log();
    }
  }

  console.log("==================================================================");
  console.log("🎉 SEEDING MASAL SELESAI!");
  console.log("aim AI kini siap menjawab pertanyaan dengan akurat berdasarkan dokumen baru!");
  console.log("==================================================================\n");
}

seed();
