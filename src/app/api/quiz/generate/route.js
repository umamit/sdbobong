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
  literasi: [
    { q: "Mana yang termasuk FAKTA dalam sebuah berita?", o: ["Film ini pasti akan sangat laris.", "Banjir merendam 500 rumah di Kota X pada Senin lalu.", "Menurut saya cuacanya sangat panas.", "Pertandingan itu pasti seru sekali."], a: 1, hint: "Fakta adalah pernyataan yang dapat dibuktikan kebenarannya, seperti data dan kejadian nyata — berbeda dari opini/pendapat." },
    { q: "Pesan berantai WhatsApp berisi klaim 'Minum air garam menyembuhkan semua penyakit' tanpa sumber jelas disebut...", o: ["Berita faktual", "Hoaks (informasi palsu)", "Literasi digital", "Iklan resmi"], a: 1, hint: "Hoaks adalah informasi palsu yang disebarkan tanpa sumber terpercaya. Selalu cek fakta dari sumber resmi sebelum membagikan." },
    { q: "Saat membaca teks, informasi yang TIDAK langsung tertulis namun dapat disimpulkan pembaca disebut...", o: ["Informasi tersurat", "Ide pokok", "Informasi tersirat", "Fakta utama"], a: 2, hint: "Informasi tersirat adalah makna tersembunyi yang harus disimpulkan sendiri oleh pembaca dari konteks teks." }
  ],
  numerasi: [
    { q: "Sebuah baju seharga Rp80.000 mendapat diskon 25%. Berapa harga setelah diskon?", o: ["Rp20.000", "Rp55.000", "Rp60.000", "Rp65.000"], a: 2, hint: "Diskon 25% dari Rp80.000 = Rp20.000. Harga setelah diskon: Rp80.000 − Rp20.000 = Rp60.000." },
    { q: "Keliling persegi panjang dengan panjang 10 cm dan lebar 6 cm adalah...", o: ["60 cm", "32 cm", "16 cm", "30 cm"], a: 1, hint: "Keliling = 2 × (panjang + lebar) = 2 × (10 + 6) = 32 cm." },
    { q: "Data nilai ulangan: 70, 80, 90, 80, 60. Berapakah nilai rata-rata (mean)?", o: ["75", "76", "80", "82"], a: 1, hint: "Mean = jumlah semua nilai ÷ banyak data = (70+80+90+80+60) ÷ 5 = 380 ÷ 5 = 76." }
  ],
  karakter: [
    { q: "Mana yang termasuk dalam 'Tujuh Kebiasaan Anak Indonesia Hebat'?", o: ["Bangun siang dan main gadget sepuasnya", "Bangun pagi, beribadah, makan sehat bergizi, dan berolahraga", "Belajar hanya saat mau ujian saja", "Tidur larut malam agar punya banyak waktu belajar"], a: 1, hint: "Tujuh kebiasaan: bangun pagi, beribadah, makan sehat bergizi, berolahraga, gemar belajar, bermasyarakat, dan tidur cepat." },
    { q: "Temanmu diejek dan dipermalukan oleh siswa lain di sekolah. Sikap yang benar adalah...", o: ["Ikut menertawakan agar tidak dikucilkan", "Pura-pura tidak melihat", "Membela korban dan melaporkan ke guru", "Mengajak teman lain untuk menjauh dari korban"], a: 2, hint: "Anti-perundungan (anti-bullying) adalah bagian dari Budaya Sekolah Aman dan Nyaman. Membela dan melapor ke guru adalah sikap yang tepat." },
    { q: "Saat ulangan, kamu tidak tahu jawaban. Sikap yang mencerminkan nilai KEJUJURAN adalah...", o: ["Mencontek catatan tersembunyi", "Bertanya pelan ke teman sebangku", "Mengerjakan semampunya dengan jujur", "Menyalin jawaban teman dengan cepat"], a: 2, hint: "Kejujuran (anti-contek) adalah karakter utama pelajar. Nilai yang didapat dengan jujur jauh lebih berharga meski tidak sempurna." }
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
2. Indeks jawaban benar "a" WAJIB DIACAK merata di antara 0, 1, 2, dan 3 lintas semua soal. Dilarang keras menaruh semua jawaban benar di indeks 0.
3. Setiap soal harus memiliki tepat 4 pilihan jawaban di array "o".
4. Field "hint" berisi penjelasan edukatif yang membimbing proses berpikir, bukan sekadar menyebut ulang jawaban.
5. AKURASI FAKTUAL & GENDER: Dilarang keras membuat kesalahan fakta. Gunakan gelar/sapaan sesuai gender tokoh. R.A. Kartini, Cut Nyak Dien, Martha Christina Tiahahu adalah pahlawan PEREMPUAN. Ir. Soekarno, Hatta, Ki Hajar Dewantara adalah pria. Periksa ulang setiap kalimat soal.
6. VALIDASI JAWABAN WAJIB: Sebelum menentukan indeks "a", bacalah ulang soal dan keempat pilihan. Pastikan: (a) tepat SATU jawaban yang benar secara faktual, (b) nilai "a" benar-benar merupakan indeks dari jawaban yang benar tersebut di dalam array "o", (c) tidak ada ambiguitas — ketiga pilihan lain JELAS salah.
7. KESELARASAN TOTAL (KOHERENSI): Pastikan pertanyaan (q), pilihan jawaban (o), dan penjelasan (hint) terikat dalam satu konteks logika yang sama. Jika pertanyaan menanyakan "langkah tindakan/solusi", maka seluruh pilihan jawaban (o) wajib berupa deskripsi langkah tindakan/solusi (bukan alasan/sebab). Sebaliknya, jika bertanya "alasan/mengapa", pilihan jawaban berupa penjelasan sebab.

Format JSON wajib:
{"questions":[{"q":"...","o":["...","...","...","..."],"a":1,"hint":"..."}]}`;

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
