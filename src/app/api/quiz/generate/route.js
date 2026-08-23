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

  // 3. Request ke Groq AI dengan instruksi ketat untuk anak SD & profil sekolah
  try {
    const prompt = `Buat 5 soal pilihan ganda interaktif untuk anak SD kategori: "${category}". 
Konteks Sekolah: SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara. Kepala Sekolah aktif saat ini adalah "${kepalaSekolah}".
Sesekali kamu boleh menyisipkan pertanyaan seputar nama sekolah atau nama Kepala Sekolah di atas untuk kategori umum.

PENTING: Indeks jawaban benar ("a") wajib DIACAK secara merata (bisa bernilai 0, 1, 2, atau 3). Dilarang keras meletakkan jawaban benar selalu di indeks 0 (opsi pertama).

Format output WAJIB berupa objek JSON valid dengan struktur:
{
  "questions": [
    {
      "q": "Pertanyaan yang mudah dipahami anak SD?",
      "o": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "a": 2,
      "hint": "Petunjuk belajar singkat, ramah, dan mendidik untuk anak."
    }
  ]
}
Catatan: "a" adalah index jawaban yang benar (0 untuk pilihan ke-1, 1 untuk ke-2, dst). Berikan 4 pilihan jawaban (o).`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
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
