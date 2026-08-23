import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_QUIZ = {
  umum: [
    { q: "Apa nama ibukota Kabupaten Pulau Taliabu?", o: ["Bobong", "Lede", "Gela", "Tabona"], a: 0, hint: "Ibukota Pulau Taliabu terletak di wilayah kecamatan Taliabu Barat." },
    { q: "Berapa jumlah warna pada bendera negara Indonesia?", o: ["1 warna", "2 warna", "3 warna", "4 warna"], a: 1, hint: "Bendera kita adalah Merah Putih." },
    { q: "Hewan apa yang dikenal sebagai lambang negara Indonesia?", o: ["Singa", "Harimau", "Burung Garuda", "Gajah"], a: 2, hint: "Lambang ini memuat perisai Pancasila." }
  ],
  matematika: [
    { q: "Berapakah hasil dari 7 ditambah 8?", o: ["13", "14", "15", "16"], a: 2, hint: "Hitung maju setelah angka 8 sebanyak 7 kali." },
    { q: "Jika kamu punya 3 kotak pensil, masing-masing berisi 5 pensil. Berapa total pensilmu?", o: ["8 pensil", "12 pensil", "15 pensil", "20 pensil"], a: 2, hint: "Gunakan perkalian 3 dikali 5." },
    { q: "Berapakah hasil dari 20 dikurangi 12?", o: ["6", "7", "8", "9"], a: 2, hint: "Kurangi 20 dengan 10 lalu kurangi lagi dengan 2." }
  ]
};

export async function POST(req) {
  const groqApiKey = process.env.GROQ_API_KEY;
  let category = 'umum';

  try {
    const body = await req.json().catch(() => ({}));
    category = body.category || 'umum';
  } catch (e) {}

  // 1. Ambil nama Kepala Sekolah secara dinamis dari database dewan guru
  let kepalaSekolah = "Ibu Kepala Sekolah";
  try {
    const { loadTeachers } = require('../../../../lib/database');
    const teachers = await loadTeachers().catch(() => []);
    const kepsek = teachers.find(t => (t.role || "").toLowerCase().includes("kepala sekolah"));
    if (kepsek) kepalaSekolah = kepsek.name;
  } catch (dbErr) {}

  // 2. Jika Groq API tidak aktif, langsung kirim data fallback lokal
  if (!groqApiKey) {
    const list = FALLBACK_QUIZ[category] || FALLBACK_QUIZ.umum;
    return NextResponse.json({ questions: list });
  }

  // 3. Request ke Groq AI dengan sistem persona pakar pendidikan dasar
  const systemPrompt = `Kamu adalah Dr. Aisha Rahman, lulusan terbaik Harvard Graduate School of Education dengan spesialisasi Pendidikan Dasar (Elementary Education). Kamu memiliki 15 tahun pengalaman merancang kurikulum dan soal evaluasi berkualitas tinggi untuk siswa Sekolah Dasar di Indonesia Timur.

Keahlianmu:
- Merancang soal yang menantang namun tetap menyenangkan dan sesuai usia (bloom's taxonomy level 1-3 untuk SD)
- Memastikan distraktor (pilihan salah) terasa masuk akal namun jelas berbeda dari jawaban benar
- Menulis petunjuk belajar (hint) yang membimbing, bukan sekadar mengulang jawaban
- Menyeimbangkan soal berbasis hafalan, pemahaman, dan penerapan

ATURAN WAJIB OUTPUT:
1. Kembalikan HANYA objek JSON valid (tanpa markdown, tanpa teks tambahan).
2. Indeks jawaban benar "a" WAJIB DIACAK merata di antara 0, 1, 2, dan 3 lintas semua soal. Dilarang keras menaruh semua jawaban benar di indeks 0.
3. Setiap soal harus memiliki tepat 4 pilihan jawaban di array "o".
4. Field "hint" berisi penjelasan edukatif singkat mengapa jawaban itu benar, bukan sekadar menyebut ulang jawaban.

Format JSON wajib:
{"questions":[{"q":"...","o":["...","...","...","..."],"a":1,"hint":"..."}]}`;

  const userPrompt = `Buatkan 5 soal pilihan ganda berkualitas tinggi untuk siswa SD kategori: "${category}".

Konteks lokal sekolah (gunakan sesekali untuk memperkaya soal pada kategori umum):
- Nama sekolah: SD Negeri Bobong
- Lokasi: Desa Bobong, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara
- Kepala Sekolah saat ini: ${kepalaSekolah}

Panduan pembuatan soal per kategori:
- "umum": Wawasan NKRI, geografi Indonesia Timur, budaya Maluku, tokoh nasional, lingkungan hidup, kesehatan.
- "matematika": Operasi bilangan, pengukuran, geometri dasar, soal cerita kontekstual kehidupan sehari-hari anak SD.

Pastikan tingkat kesulitan bervariasi: 2 soal mudah, 2 soal sedang, 1 soal sedikit menantang.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) throw new Error('Groq API returned error status');

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);
    
    if (content && Array.isArray(content.questions)) {
      return NextResponse.json(content);
    }
    throw new Error('Invalid quiz format from AI');
  } catch (error) {
    console.error("AI Quiz Generator error, using fallback data:", error);
    const list = FALLBACK_QUIZ[category] || FALLBACK_QUIZ.umum;
    return NextResponse.json({ questions: list });
  }
}
