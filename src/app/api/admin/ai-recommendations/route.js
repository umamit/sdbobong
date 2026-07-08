import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadWebConfig } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jayapura' });

  const seasons = [
    { months: [0, 1], name: 'Awal Tahun / Semester Genap' },
    { months: [2, 3, 4], name: 'Persiapan Kenaikan Kelas' },
    { months: [5, 6], name: 'Akhir Tahun Ajaran / PPDB' },
    { months: [7, 8], name: 'Tahun Ajaran Baru / MPLS' },
    { months: [9, 10, 11], name: 'Semester Ganjil' },
  ];
  const currentSeason = seasons.find(s => s.months.includes(month))?.name || 'Tahun Ajaran';

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    // Static fallback recommendations based on the season
    let recommendations = [];
    if (month === 5 || month === 6) { // PPDB season
      recommendations = [
        { icon: "🎒", title: "Panduan Lengkap Pendaftaran PPDB Online", description: "Tulis pengumuman syarat dokumen dan cara mendaftar PPDB Online." },
        { icon: "🎓", title: "Keseruan Wisuda Kelulusan Kelas 6", description: "Publikasikan warta dokumentasi foto wisuda pelepasan siswa kelas 6." },
        { icon: "📅", title: "Jadwal Pengisian Formulir Ulang", description: "Beri tahu orang tua tata cara daftar ulang siswa yang diterima." }
      ];
    } else if (month === 7 || month === 8) { // Back to school / MPLS
      recommendations = [
        { icon: "🏫", title: "Keceriaan Hari Pertama Masuk Sekolah & MPLS", description: "Dokumentasikan momen siswa menyambut tahun ajaran baru." },
        { icon: "📚", title: "Distribusi Buku Kurikulum Merdeka Baru", description: "Infokan pembagian buku teks pelajaran untuk siswa kelas 1-6." },
        { icon: "🤝", title: "Rapat Komite Orang Tua Murid", description: "Tulis undangan/warta pertemuan komite sekolah awal tahun." }
      ];
    } else { // Normal/Genap/Ganjil
      recommendations = [
        { icon: "🏆", title: "Prestasi Membanggakan Lomba Pramuka", description: "Ceritakan pencapaian regu pramuka meraih juara tingkat daerah." },
        { icon: "🧪", title: "Praktik IPA Seru Membuat Maket Gerhana", description: "Tampilkan aktivitas belajar siswa kelas 6 di laboratorium kelas." },
        { icon: "🕌", title: "Kegiatan Imtak Bersama Setiap Hari Jumat", description: "Bagikan warta pembiasaan karakter keagamaan siswa di mushola." }
      ];
    }
    return NextResponse.json({ recommendations }, { status: 200 });
  }

  try {
    const config = await loadWebConfig();

    const systemPrompt = `Kamu adalah asisten rekomendasi konten untuk website SD Negeri Bobong.
Berdasarkan musim/tahun ajaran saat ini, berikan 3 rekomendasi topik berita yang relevan dan menarik.

Format output JSON: { "recommendations": [{ "icon": "emoji", "title": "Judul rekomendasi", "description": "Deskripsi singkat (max 15 kata)" }] }
Hanya JSON valid, tanpa markdown.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Tanggal: ${dateStr}\nMusim: ${currentSeason}\n\nBeri 3 rekomendasi topik berita sekolah.` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const groqData = await groqRes.json();
    const replyText = groqData.choices?.[0]?.message?.content || "{}";
    const result = JSON.parse(replyText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("⚠️ AI Recommendations error:", error.message);
    return NextResponse.json({ recommendations: [] }, { status: 200 });
  }
}