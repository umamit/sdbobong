import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadTeachers } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  // 1. Cek otentikasi admin/guru
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: 'Groq API Key tidak terkonfigurasi di server.' }, { status: 500 });
  }

  try {
    const { prompt, tone = 'formal' } = await req.json();
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt atau topik berita wajib diisi.' }, { status: 400 });
    }

    const TONE_GUIDES = {
      formal: 'Bernada resmi, kedinasan, tertib, dan lugas sesuai standar penulisan pers publikasi sekolah formal.',
      inspiratif: 'Bernada inspiratif, memotivasi, mengapresiasi kerja keras siswa/guru, dan menonjolkan nilai prestasi serta karakter budi pekerti.',
      santai: 'Bernada liputan ceria, dinamis, bersahabat, penuh kehangatan interaksi warga sekolah, dan menarik bagi siswa serta orang tua.'
    };
    const toneGuide = TONE_GUIDES[tone] || TONE_GUIDES.formal;

    // Tanggal hari ini zona WIT (Waktu Indonesia Timur) untuk default tanggal artikel
    const now = new Date();
    const currentDateText = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jayapura'
    });

    // Muat daftar guru untuk menyuntikkan nama Kepala Sekolah yang aktif di database ke dalam prompt AI
    let kepalaSekolahName = "HUSNITA USMAN, S.Pd., M.Pd";
    try {
      const teachers = await loadTeachers().catch(() => []);
      const kepsek = teachers.find(t => (t.role || "").toLowerCase().includes("kepala sekolah") || (t.role || "").toLowerCase().includes("kepsek"));
      if (kepsek && kepsek.name) {
        kepalaSekolahName = kepsek.name;
      }
    } catch (dbErr) {
      console.warn("Failed to load teachers for news draft generation context:", dbErr);
    }

    const systemInstruction = `
Kamu adalah asisten administratif sekolah SD Negeri Bobong yang bertugas membantu menulis draf berita/artikel kegiatan sekolah untuk dipublikasikan di website sekolah.
Tugas Anda adalah membuat draf berita premium dan rapi berdasarkan petunjuk dari pengguna.
Gaya Bahasa & Nada Tulisan: ${toneGuide}
Kamu juga WAJIB menghasilkan judul dan deskripsi SEO untuk Google Search.

PENTING & WAJIB:
Di setiap draf berita yang kamu buat, kamu WAJIB selalu menyertakan arahan, sambutan, pernyataan, atau apresiasi resmi dari Kepala Sekolah SD Negeri Bobong, yaitu: "${kepalaSekolahName}".
Contoh penyertaan: Berikan satu paragraf atau kutipan langsung mengenai apresiasi Kepala Sekolah terhadap kegiatan tersebut, komitmen sekolah, atau harapan bagi masa depan murid. Dilarang mengarang nama Kepala Sekolah lain atau melewatkan nama beliau.

Format keluaran harus berupa JSON objek yang valid dengan struktur berikut:
{
  "title": "Judul Berita Ciri Khas SD Negeri Bobong yang Menarik",
  "category": "Kategori berita (misalnya: Kegiatan, Prestasi, Pengumuman, Akademik)",
  "date": "Tanggal berita, gunakan default ini: ${currentDateText}",
  "content": "Isi lengkap berita dalam format tag HTML standar rich text. Gunakan paragraf <p style=\\"text-align: justify;\\">, cetak tebal <b> untuk penekanan, sub-judul menggunakan <h3> atau <h4>, dan daftar list menggunakan <ul>/<li> jika diperlukan. Berikan paragraf pembuka yang baik, isi berita secara mendetail, dan paragraf penutup/harapan yang hangat. Jangan gunakan tag <html> atau <body>.",
  "seo_title": "Judul halaman untuk Google Search yang deskriptif dan menarik klik. Maksimal 60 karakter. Sertakan nama sekolah di akhir jika muat, misalnya '| SDN Bobong'.",
  "seo_description": "Deskripsi meta halaman untuk mesin pencari. Maksimal 160 karakter. Harus ringkas, informatif, mencerminkan isi berita, dan mendorong pembaca untuk mengklik."
}

PENTING: Hanya kembalikan objek JSON mentah yang valid, tanpa teks markdown pembungkus (tanpa \`\`\`json).
`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Buat draf berita (${tone}) berdasarkan informasi/instruksi berikut: ${prompt}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error (${groqRes.status}): ${errText}`);
    }

    const groqData = await groqRes.json();
    const replyText = groqData.choices?.[0]?.message?.content || "";

    if (!replyText) {
      throw new Error("Groq API tidak mengembalikan konten.");
    }

    const draft = JSON.parse(replyText);
    return NextResponse.json(draft);

  } catch (error) {
    console.error("[NewsAI] Gagal membuat draf berita AI:", error.message || error);
    return NextResponse.json({ 
      error: "Gagal membuat draf berita. Silakan coba beberapa saat lagi.",
      details: error.message 
    }, { status: 500 });
  }
}
