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
    const configStats = config?.stats || {};
    const visitorCount = configStats.visitor_count || 0;
    const maintenanceMode = configStats.maintenance_mode || false;
    const pageContents = configStats.page_contents || {};

    // Collect data points for AI analysis
    const dataPoints = [
      `Pengunjung website: ${visitorCount}`,
      `Mode pemeliharaan: ${maintenanceMode ? 'Aktif' : 'Nonaktif'}`,
      `Jumlah pengumuman marquee: ${(config.marquee_announcements || []).length}`,
      `Jumlah guru: ${configStats.guru_staf || '-'}`,
      `Jumlah siswa: ${configStats.siswa_aktif || '-'}`,
      `Jumlah ruang kelas: ${configStats.ruang_kelas || '-'}`,
    ];

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jayapura' });

    const systemPrompt = `Kamu adalah asisten AI dashboard untuk SD Negeri Bobong. 
Berikan ringkasan eksekutif singkat (maksimal 4 poin) dalam bahasa Indonesia yang hangat dan informatif.
Setiap poin maksimal 15 kata.
Gunakan emoji yang relevan.
Format output JSON: { "summary": [{ "icon": "emoji", "text": "kalimat ringkasan" }, ...] }
Jangan gunakan markdown, hanya JSON valid.`;

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
          { role: "user", content: `Hari ini: ${dateStr}\n\nData dashboard:\n${dataPoints.join('\n')}\n\nBuat ringkasan insight dashboard.` }
        ],
        temperature: 0.5,
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
    console.error("⚠️ AI Summary error:", error.message);
    return NextResponse.json({ summary: [] }, { status: 200 });
  }
}