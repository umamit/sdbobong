import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';

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
    const { prompt } = await req.json();
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt atau topik berita wajib diisi.' }, { status: 400 });
    }

    // Tanggal hari ini zona WIT (Waktu Indonesia Timur) untuk default tanggal artikel
    const now = new Date();
    const currentDateText = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jayapura'
    });

    const systemInstruction = `
Kamu adalah asisten administratif sekolah SD Negeri Bobong yang bertugas membantu menulis draf berita/artikel kegiatan sekolah untuk dipublikasikan di website sekolah.
Tugas Anda adalah membuat draf berita premium, rapi, bernada hangat, dan formal-ceria berdasarkan petunjuk dari pengguna. Kamu juga WAJIB menghasilkan judul dan deskripsi SEO untuk Google Search.

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
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Buat draf berita berdasarkan informasi/instruksi berikut: ${prompt}` }
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
    console.error("⚠️ Gagal membuat draf berita AI:", error.message || error);
    return NextResponse.json({ 
      error: "Gagal membuat draf berita. Silakan coba beberapa saat lagi.",
      details: error.message 
    }, { status: 500 });
  }
}
