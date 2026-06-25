import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: 'Groq API Key tidak terkonfigurasi.' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ sentiments: [] });
    }

    // Batch analyze up to 20 messages at a time
    const batch = messages.slice(0, 20);
    const messagesForAI = batch.map(m => ({
      id: m.id,
      name: m.name || 'Anonim',
      message: (m.message || '').substring(0, 200)
    }));

    const systemPrompt = `Kamu adalah asisten analisis sentimen untuk buku tamu SD Negeri Bobong.
Analisis sentimen setiap pesan dan berikan label: "positif", "negatif", "urgent", atau "netral".
"urgent" untuk pesan yang berisi keluhan serius, masalah mendesak, atau butuh tindakan segera.
"negatif" untuk kritik atau keluhan ringan.
"positif" untuk pujian, apresiasi, atau dukungan.
"netral" untuk pertanyaan umum atau informasi.

Format output JSON: { "sentiments": [{ "id": "message-id", "sentiment": "positif|negatif|urgent|netral", "reason": "alasan singkat (max 10 kata)" }] }
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
          { role: "user", content: `Analisis sentimen pesan-pesan berikut:\n${JSON.stringify(messagesForAI, null, 2)}` }
        ],
        temperature: 0.3,
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
    console.error("⚠️ AI Sentiment error:", error.message);
    return NextResponse.json({ sentiments: [] }, { status: 200 });
  }
}