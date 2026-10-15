import { NextResponse } from 'next/server';
import { FALLBACK_QUIZ } from './fallback';

export const dynamic = 'force-dynamic';

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

  const systemPrompt = `Kamu adalah Dr. Aisha Rahman, lulusan terbaik Harvard Graduate School of Education dengan spesialisasi Pendidikan Dasar (Elementary Education). Kamu memiliki 15 tahun pengalaman merancang soal kompetisi dan evaluasi berkualitas tinggi untuk siswa Sekolah Dasar di Indonesia Timur.

Konteks pembuatan soal:
Soal ini digunakan untuk persiapan kompetisi cerdas cermat SD yang berfokus pada tiga pilar: Literasi, Numerasi, dan Penguatan Karakter. Sesuai panduan kompetisi, soal disusun secara KONTEKSTUAL dengan tipe penalaran tingkat tinggi (HOTS — Higher Order Thinking Skills).

Keahlianmu:
- Merancang soal HOTS berbasis konteks nyata (Bloom's Taxonomy level 2–4: memahami, menerapkan, menganalisis)
- Memastikan distraktor (pilihan salah) terasa masuk akal namun jelas berbeda dari jawaban benar
- Menulis petunjuk belajar (hint) yang membimbing proses berpikir, bukan sekadar mengulang jawaban
- Menyajikan soal dalam konteks kehidupan nyata agar bermakna bagi siswa SD

ATURAN WAJIB OUTPUT:
1. Kembalikan HANYA objek JSON valid (tanpa markdown, tanpa teks tambahan).
2. Setiap soal harus memiliki tepat 4 pilihan jawaban di array "o".
3. Tentukan teks jawaban benar yang paling tepat pada field "correct_answer_text". Teks ini WAJIB persis sama dengan salah satu pilihan di dalam array "o".
4. Field "hint" berisi penjelasan edukatif yang membimbing proses berpikir dan menerangkan mengapa "correct_answer_text" adalah jawaban yang tepat.
5. AKURASI FAKTUAL: Pastikan hanya ada tepat SATU jawaban yang benar dan masuk akal. Tiga pilihan lain adalah pengecoh (distraktor) yang jelas salah atau tidak relevan.
6. KESELARASAN LOGIKA: Pertanyaan (q), pilihan (o), teks jawaban (correct_answer_text), dan penjelasan (hint) harus selaras total secara logika.

Format JSON wajib:
{"questions":[{"q":"...","o":["...","...","...","..."],"correct_answer_text":"...","hint":"..."}]}`;

  const userPrompt = `Buatkan 5 soal pilihan ganda HOTS (penalaran tingkat tinggi) untuk siswa SD kategori: "${category}".

Konteks lokal sekolah (gunakan sesekali untuk memperkaya soal pada kategori umum):
- Nama sekolah: SD Negeri Bobong
- Lokasi: Desa Bobong, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara
- Kepala Sekolah saat ini: ${kepalaSekolah}

Panduan cakupan materi per kategori (sesuai dokumen kompetisi resmi):
- "umum": Wawasan NKRI, geografi Indonesia Timur, budaya Maluku Utara, tokoh nasional, lingkungan hidup, kesehatan.
- "matematika": Operasi bilangan, pengukuran, geometri dasar, soal cerita kontekstual kehidupan sehari-hari anak SD.
- "ipa": Organ tubuh manusia, tumbuhan dan hewan, siklus air, cuaca, tata surya, lingkungan dan ekosistem.
- "bahasa": EYD/PUEBI, jenis kata, kalimat efektif, sinonim/antonim, cerita rakyat, membaca pemahaman.
- "literasi": Literasi Baca Tulis (menemukan informasi tersurat/tersirat, menganalisis ide pokok, fabel/cerita rakyat, membedakan fakta dan opini dari infografis/artikel), Literasi Finansial (struk belanja, brosur diskon), Literasi Digital (mengidentifikasi hoaks), Literasi Sains (fenomena alam, pengetahuan ilmiah), Literasi Budaya & Kewargaan (menghargai keberagaman, nilai Pancasila, partisipasi bermasyarakat).
- "numerasi": Bilangan & Operasi Hitung kontekstual (pecahan, desimal, persentase/diskon, rasio, skala), Geometri & Pengukuran (keliling/luas bidang datar, volume bangun ruang sederhana, estimasi waktu/jadwal), Data & Ketidakpastian (interpretasi diagram/grafik, mean, median, modus, peluang sederhana), Pemecahan Masalah Kontekstual.
- "karakter": Tujuh Kebiasaan Anak Indonesia Hebat (bangun pagi, beribadah, makan sehat bergizi, berolahraga, gemar belajar, bermasyarakat, tidur cepat), Delapan Dimensi Profil Lulusan (Beriman & Bertakwa kepada Tuhan YME, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Kreatif, Kesehatan, Komunikasi), Budaya Sekolah Aman & Nyaman (jujur/anti-contek, anti-perundungan/bullying, toleransi antarumat beragama, sopan santun, hak & kewajiban warga negara/murid).

Pastikan tingkat kesulitan bervariasi: 2 soal mudah, 2 soal sedang, 1 soal menantang (HOTS).`;

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
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) throw new Error('Groq API returned error status');

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);
    
    if (content && Array.isArray(content.questions) && content.questions.length > 0) {
      const validated = content.questions.map((q) => {
        if (!Array.isArray(q.o) || q.o.length === 0) return null;
        let cIdx = -1;
        if (q.correct_answer_text) {
          const t = q.correct_answer_text.trim().toLowerCase();
          // 1. Coba exact match terlebih dahulu
          cIdx = q.o.findIndex(opt => opt.trim().toLowerCase() === t);
          // 2. Jika tidak ada exact match, cari yang opsi lengkapnya termuat di teks jawaban (pilih opsi terpanjang)
          if (cIdx === -1) {
            const matches = q.o
              .map((opt, idx) => ({ idx, text: opt.trim().toLowerCase() }))
              .filter(item => t.includes(item.text) || item.text.includes(t))
              .sort((a, b) => b.text.length - a.text.length);
            if (matches.length > 0) cIdx = matches[0].idx;
          }
        }
        if (cIdx === -1 && typeof q.a === 'number' && q.a >= 0 && q.a < q.o.length) cIdx = q.a;
        return { q: q.q, o: q.o, a: cIdx !== -1 ? cIdx : 0, hint: q.hint || '' };
      }).filter(Boolean);
      if (validated.length > 0) return NextResponse.json({ questions: validated });
    }
    throw new Error('Invalid quiz format from AI');
  } catch (error) {
    console.error("AI Quiz Generator error, using fallback data:", error);
    const list = FALLBACK_QUIZ[category] || FALLBACK_QUIZ.umum;
    return NextResponse.json({ questions: list });
  }
}
