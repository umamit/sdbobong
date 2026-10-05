import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return NextResponse.json({ error: 'Groq API Key tidak terkonfigurasi di server.' }, { status: 500 });

  try {
    const { subTab, prompt } = await req.json();
    if (!prompt || !prompt.trim()) return NextResponse.json({ error: 'Prompt wajib diisi.' }, { status: 400 });

    let kepsekName = 'Kepala Sekolah SD Negeri Bobong';
    try {
      const { loadTeachers } = require('../../../../lib/database');
      const teachers = await loadTeachers().catch(() => []);
      const kepsek = teachers.find(t => (t.role || '').toLowerCase().includes('kepala sekolah'));
      if (kepsek) kepsekName = kepsek.name;
    } catch {
      // fallback
    }

    const systemInstruction = `
Kamu adalah asisten pengembang konten resmi untuk website SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara.
Tugas Anda adalah merumuskan draf konten yang terstruktur, formal, komunikatif, dan selaras dengan identitas sekolah dasar rujukan berakhlak mulia, cerdas, dan berbudaya.

Konteks Sekolah:
- Nama Sekolah: SD Negeri Bobong
- NPSN: 60200589
- Wilayah: Desa Wayo / Bobong, Kec. Taliabu Barat, Kab. Pulau Taliabu, Maluku Utara
- Nama Kepala Sekolah Aktif: "${kepsekName}"

Instruksi Output:
Kembalikan HANYA JSON objek valid tanpa pembungkus markdown (tanpa \`\`\`json).
Sesuaikan struktur JSON dengan parameter subTab:

1. Jika subTab == "beranda":
{
  "welcome_title": "Judul Sambutan Kepala Sekolah",
  "welcome_quote": "Kutipan inspiratif singkat",
  "welcome_p1": "Paragraf pembuka sambutan",
  "welcome_p2": "Paragraf penutup sambutan dan harapan",
  "hero_title": "Judul Hero Banner (opsional)",
  "hero_text": "Deskripsi singkat hero banner (opsional)"
}

2. Jika subTab == "profil":
{
  "visi": "Teks Visi Sekolah",
  "misi": ["Poin misi 1", "Poin misi 2", "Poin misi 3", "Poin misi 4"],
  "sejarah_title": "Judul Sejarah",
  "sejarah_p1": "Paragraf sejarah 1",
  "sejarah_p2": "Paragraf sejarah 2"
}

3. Jika subTab == "akademik":
{
  "kurikulum_title": "Judul Kurikulum Operasional",
  "kurikulum_p1": "Paragraf penjelasan kurikulum",
  "kurikulum_p2": "Paragraf implementasi P5 dan asesmen",
  "tata_tertib": ["Aturan tata tertib 1", "Aturan tata tertib 2", "Aturan tata tertib 3"]
}

4. Jika subTab == "kesiswaan":
Jika instruksi admin menyebutkan lomba, juara, piala, peringkat, medali, FLS2N, O2SN, atau prestasi murid:
{
  "mode": "prestasi",
  "rank": "Peringkat juara (misal: 1st, 2nd, 3rd, atau Harapan 1)",
  "title": "Nama Juara / Lomba (misal: Juara 1 Lomba Pidato Bahasa Indonesia)",
  "level": "Tingkat perlombaan (misal: Tingkat Kabupaten, Tingkat Provinsi, atau Tingkat Kecamatan)",
  "desc": "Detail lengkap prestasi, nama siswa peraih juara, dan momen kegiatan",
  "icon": "trophy" (bisa trophy, medal, atau award)
}
Jika instruksi mengenai karya siswa, kerajinan, lukisan, poster, puisi, atau proyek P5:
{
  "mode": "karya",
  "title": "Nama Judul Karya Siswa",
  "category": "Kategori / Tema P5 (misal: Proyek P5 - Kearifan Lokal Kelas 4)",
  "desc": "Penjelasan ringkas tentang karya seni/kerajinan buatan siswa",
  "icon": "crafts" (bisa crafts, art, poetry, atau book)
}
Jika instruksi mengenai ekstrakurikuler:
{
  "mode": "ekskul",
  "nama": "Nama Ekstrakurikuler Baru",
  "jadwal": "Jadwal Latihan (misal: Jumat, 15.00 - 17.00 WIT)",
  "deskripsi": "Deskripsi lengkap dan tujuan aktivitas kegiatan ekskul",
  "is_wajib": false
}
Jika umum:
{
  "mode": "umum",
  "banner_title": "Judul Banner Kesiswaan",
  "banner_text": "Deskripsi Banner Kesiswaan"
}

5. Jika subTab == "ppdb":
{
  "banner_title": "Judul Banner PPDB",
  "banner_text": "Deskripsi Pembukaan PPDB",
  "syarat_usia": "Deskripsi kriteria usia calon siswa",
  "syarat_berkas": ["Berkas 1", "Berkas 2", "Berkas 3", "Berkas 4"],
  "alur_steps": [
    { "title": "Pendaftaran Online/Offline", "desc": "Penjelasan langkah 1" },
    { "title": "Verifikasi Berkas", "desc": "Penjelasan langkah 2" },
    { "title": "Pengumuman Kelulusan", "desc": "Penjelasan langkah 3" },
    { "title": "Daftar Ulang Siswa", "desc": "Penjelasan langkah 4" }
  ]
}
`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Sub-halaman: ${subTab}. Instruksi admin: ${prompt}` }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error (${groqRes.status}): ${errText}`);
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content || '';
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Gagal membuat konten halaman AI:', error);
    return NextResponse.json({ error: error.message || 'Gagal merumuskan konten.' }, { status: 500 });
  }
}
