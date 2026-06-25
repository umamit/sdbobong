import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadWebConfig } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: 'Groq API Key tidak terkonfigurasi.' }, { status: 500 });
  }

  try {
    const config = await loadWebConfig();
    const now = new Date();
    const month = now.getMonth();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jayapura' });

    // Context about current time of year
    const seasons = [
      { months: [0, 1], name: 'Awal Tahun / Semester Genap' },
      { months: [2, 3, 4], name: 'Persiapan Kenaikan Kelas' },
      { months: [5, 6], name: 'Akhir Tahun Ajaran / PPDB' },
      { months: [7, 8], name: 'Tahun Ajaran Baru / MPLS' },
      { months: [9, 10, 11], name: 'Semester Ganjil' },
    ];
    const currentSeason = seasons.find(s => s.months.includes(month))?.name || 'Tahun Ajaran';

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