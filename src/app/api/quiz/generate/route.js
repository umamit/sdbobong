import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_QUIZ = {
  umum: [
    { q: "Apa nama ibukota Kabupaten Pulau Taliabu?", o: ["Bobong", "Lede", "Gela", "Tabona"], a: 0, hint: "Ibukota Pulau Taliabu terletak di wilayah kecamatan Taliabu Barat." },
    { q: "Berapa jumlah warna pada bendera negara Indonesia?", o: ["1 warna", "2 warna", "3 warna", "4 warna"], a: 1, hint: "Bendera kita adalah Merah Putih — dua warna." },
    { q: "Hewan apa yang menjadi lambang negara Indonesia?", o: ["Singa", "Harimau", "Burung Garuda", "Gajah"], a: 2, hint: "Lambang negara Garuda Pancasila memuat perisai lima sila." }
  ],
  matematika: [
    { q: "Berapakah hasil dari 7 ditambah 8?", o: ["13", "14", "15", "16"], a: 2, hint: "Hitung maju setelah angka 8 sebanyak 7 langkah." },
    { q: "Jika ada 3 kotak pensil, tiap kotak berisi 5 pensil, berapa total pensilnya?", o: ["8", "12", "15", "20"], a: 2, hint: "Gunakan perkalian: 3 × 5 = 15." },
    { q: "Berapakah hasil dari 20 dikurangi 12?", o: ["6", "7", "8", "9"], a: 2, hint: "Kurangi 20 dengan 10 dulu, lalu kurangi lagi 2." }
  ],
  ipa: [
    { q: "Apa fungsi utama akar pada tumbuhan?", o: ["Membuat makanan", "Menyerap air dan mineral", "Menghasilkan oksigen", "Menyimpan biji"], a: 1, hint: "Akar menyerap air dan unsur hara dari tanah untuk kebutuhan tumbuhan." },
    { q: "Planet manakah yang paling dekat dengan Matahari?", o: ["Venus", "Bumi", "Merkurius", "Mars"], a: 2, hint: "Merkurius adalah planet pertama (terdekat) dari Matahari dalam tata surya kita." },
    { q: "Apa yang terjadi pada air saat dipanaskan hingga 100°C?", o: ["Membeku", "Menguap", "Mengembun", "Menyusut"], a: 1, hint: "Air berubah wujud dari cair menjadi gas (uap) pada suhu 100°C — disebut menguap." }
  ],
  bahasa: [
    { q: "Kata yang menyebut nama orang, tempat, atau benda disebut...", o: ["Kata kerja", "Kata sifat", "Kata benda", "Kata keterangan"], a: 2, hint: "Kata benda (nomina) adalah kata yang menyebut nama orang, tempat, atau benda." },
    { q: "Manakah penulisan kalimat yang benar?", o: ["aku pergi ke sekolah?", "Aku pergi ke sekolah.", "aku Pergi ke Sekolah.", "aku pergi ke sekolah"], a: 1, hint: "Kalimat berita diakhiri tanda titik dan huruf pertama ditulis kapital." },
    { q: "Apa antonim (lawan kata) dari kata 'rajin'?", o: ["Cerdas", "Malas", "Sigap", "Aktif"], a: 1, hint: "'Rajin' dan 'malas' adalah kata yang memiliki makna berlawanan (antonim)." }
  ],
  sejarah: [
    { q: "Siapakah proklamator kemerdekaan Republik Indonesia?", o: ["Soeharto dan Adam Malik", "Soekarno dan Hatta", "Sutan Sjahrir dan Tan Malaka", "Agus Salim dan Wahid Hasyim"], a: 1, hint: "Ir. Soekarno dan Drs. Mohammad Hatta memproklamirkan kemerdekaan pada 17 Agustus 1945." },
    { q: "Rempah paling terkenal dari Maluku Utara, terutama dari Ternate dan Tidore, adalah...", o: ["Merica", "Kayu Manis", "Cengkih", "Kunyit"], a: 2, hint: "Cengkih adalah komoditas rempah utama yang membuat Maluku Utara terkenal di dunia sejak abad pertengahan." },
    { q: "Siapakah pahlawan nasional dari Maluku yang dikenal sebagai Kapitan Pattimura?", o: ["Sultan Baab Ullah", "Thomas Matulessy", "Silas Papare", "Martha Christina Tiahahu"], a: 1, hint: "Kapitan Pattimura adalah nama Thomas Matulessy, pahlawan Maluku yang berjuang melawan penjajah Belanda." }
  ]
};

export async function POST(req) {
  const groqApiKey = process.env.GROQ_API_KEY;
  let category = 'umum';

  try {
    const body = await req.json().catch(() => ({}));
    category = body.category || 'umum';
  } catch (e) {}

  // 1. Ambil nama Kepala Sekolah dari konfigurasi website
  let kepalaSekolah = "Ibu Kepala Sekolah";
  try {
    const { loadWebConfig } = require('../../../../lib/database');
    const config = await loadWebConfig().catch(() => null);
    if (config?.profil?.kepala_sekolah) kepalaSekolah = config.profil.kepala_sekolah;
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
5. WAJIB AKURAT SECARA FAKTUAL: Dilarang keras membuat kesalahan fakta, terutama gelar/sapaan gender tokoh. Contoh wajib dipatuhi: R.A. Kartini adalah "beliau" atau "ia" (perempuan, BUKAN "Bapak"). Cut Nyak Dien, Martha Christina Tiahahu adalah pahlawan perempuan. Ir. Soekarno, Hatta, Ki Hajar Dewantara adalah pria ("Bapak/Beliau"). Periksa ulang setiap kalimat soal sebelum menghasilkan output.

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
- "ipa": Organ tubuh manusia, tumbuhan dan hewan, siklus air, cuaca, tata surya, lingkungan dan ekosistem.
- "bahasa": EYD/PUEBI, jenis kata, kalimat efektif, sinonim/antonim, cerita rakyat, membaca pemahaman.
- "sejarah": Perjuangan kemerdekaan Indonesia, tokoh-tokoh Maluku Utara, kerajaan Ternate dan Tidore, budaya lokal Maluku.

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
