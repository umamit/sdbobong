import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadMessages } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, name, role, type } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    const systemPrompt = `Kamu adalah asisten tata usaha SD Negeri Bobong yang sopan, ramah, dan profesional.
Berdasarkan pesan dari orang tua/wali/masyarakat, buat draf balasan yang:
1. Dimulai dengan salam "Assalamu'alaikum Wr. Wb." atau "Salam Sejahtera"
2. Menyapa pengirim dengan nama jika ada
3. Merespons isi pesan dengan informatif dan solutif
4. Menggunakan bahasa Indonesia yang formal namun hangat
5. Diakhiri dengan tanda tangan "Tim Tata Usaha SDN Bobong"

Format JSON: { "draft": "Isi balasan lengkap", "subject": "Subjek pesan singkat" }
Hanya JSON valid, tanpa markdown.`;

    const userContent = `Nama Pengirim: ${name || 'Tidak diketahui'}
Hubungan: ${role || '-'}
Jenis Pesan: ${type === 'feedback' ? 'Kotak Saran (Privat)' : 'Buku Tamu (Publik)'}
Isi Pesan: ${message}

Buat draf balasan yang sesuai.`;

    if (!groqApiKey) {
      // Fallback: generate a generic polite reply without AI
      const greeting = name ? `Yth. Bapak/Ibu ${name},` : 'Yth. Bapak/Ibu,';
      const fallbackDraft = `Assalamu'alaikum Wr. Wb.

${greeting}

Terima kasih telah menghubungi SD Negeri Bobong. Kami telah menerima pesan Anda dengan baik dan sangat menghargai perhatian serta kepedulian Anda terhadap kemajuan sekolah kami.

Terkait pesan yang Anda sampaikan, kami akan segera menindaklanjuti dan memberikan respons yang tepat sesegera mungkin. Apabila ada hal lain yang ingin ditanyakan, jangan ragu untuk menghubungi kami kembali.

Demikian, atas perhatian dan kepercayaan Bapak/Ibu kami ucapkan terima kasih.

Wassalamu'alaikum Wr. Wb.

Tim Tata Usaha SDN Bobong`;

      return NextResponse.json({
        draft: fallbackDraft,
        subject: `Re: Pesan dari ${name || 'Pengunjung Website'}`
      });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.5,
        max_tokens: 600,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error (${groqRes.status}): ${errText}`);
    }

    const groqData = await groqRes.json();
    const replyText = groqData.choices?.[0]?.message?.content || '{}';
    const result = JSON.parse(replyText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('⚠️ AI Reply Draft error:', error.message);
    return NextResponse.json({
      draft: 'Gagal membuat draf balasan. Silakan coba lagi.',
      subject: 'Balasan'
    }, { status: 200 });
  }
}
