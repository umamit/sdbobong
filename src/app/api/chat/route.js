import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { loadWebConfig, loadTeachers, loadAchievements, supabase, isSupabaseEnabled } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid." }, { status: 400 });
    }

    // Ambil pesan terbaru dari pengguna
    const latestMessage = messages[messages.length - 1]?.content || "";

    // 1. Muat data dinamis dari database untuk pengetahuan asisten secara paralel
    const [config, teachersList, achievementsList] = await Promise.all([
      loadWebConfig(),
      loadTeachers(),
      loadAchievements()
    ]);

    const contacts = config.ppdb_contacts || {};
    const stats = config.stats || {};
    const profil = stats.page_contents?.profil || {};
    const faqs = config.faqs || [];
    const downloads = config.downloads || [];

    // Data default fallback jika data dinamis kosong
    const npsn = profil.npsn || "60200589";
    const statusSekolah = profil.status_sekolah || "Negeri";
    const akreditasi = profil.akreditasi || "B (Baik)";
    const kurikulum = profil.kurikulum_operasional || "Kurikulum Merdeka";
    const alamat = profil.alamat_lengkap || "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791";
    const skPendirian = profil.sk_pendirian || "04 Oktober 1971 (SK: 420/04/10/1971)";
    const kepemilikanLahan = profil.kepemilikan_lahan || "Pemerintah Daerah Kabupaten Pulau Taliabu";
    const namaHumas = contacts.nama_humas || "Ibu Husnita Usman, M.Pd.";
    const waHumas = contacts.wa_humas || "6281234567890";
    const namaOperator = contacts.nama_operator || "Bapak Kasmudin";
    const waOperator = contacts.wa_operator || "6281234567890";
    const emailSekolah = contacts.email_sekolah || "sdn.bobong.taliabu@gmail.com";

    // 2. Cek apakah GEMINI_API_KEY tersedia di environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ PERINGATAN: GEMINI_API_KEY tidak dikonfigurasi di server. Menggunakan Fallback AI SDN Bobong.");
      const reply = generateFallbackResponse(latestMessage, {
        npsn, statusSekolah, akreditasi, kurikulum, alamat, skPendirian,
        namaHumas, waHumas, namaOperator, waOperator, emailSekolah,
        stats, faqs, downloads
      });
      return NextResponse.json({ reply });
    }

    // 3. RAG (Retrieval-Augmented Generation) semantic search using pgvector
    let ragContext = "";
    if (apiKey && isSupabaseEnabled() && supabase) {
      try {
        console.log(`Generating embedding for user query: "${latestMessage}"`);
        const aiEmbedClient = new GoogleGenAI({ apiKey });
        const embedResponse = await aiEmbedClient.models.embedContent({
          model: 'gemini-embedding-2',
          contents: latestMessage,
          config: { outputDimensionality: 1536 }
        });

        const embedding = embedResponse.embeddings?.[0]?.values;
        if (embedding && Array.isArray(embedding)) {
          console.log("Embedding generated successfully. Querying match_documents RPC...");
          const { data: matchedDocs, error: rpcError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.65, // threshold for similarity matching
            match_count: 4         // fetch top 4 relevant chunks
          });

          if (rpcError) {
            console.error("Supabase RPC match_documents failed:", rpcError.message);
          } else if (matchedDocs && matchedDocs.length > 0) {
            console.log(`Successfully retrieved ${matchedDocs.length} matching documents for context.`);
            ragContext = matchedDocs.map((doc, i) => `[Dokumen Pendukung #${i + 1}]\n${doc.content}`).join("\n\n");
          } else {
            console.log("No matching documents found above similarity threshold.");
          }
        }
      } catch (embedError) {
        console.error("Error during RAG Embedding / Vector Search:", embedError.message || embedError);
      }
    }

    // 4. Format Data untuk Pengetahuan AI
    const listGuruText = teachersList && teachersList.length > 0
      ? teachersList.map(t => `- ${t.name} (${t.role || 'Tenaga Pendidik'})`).join('\n')
      : "- Ibu Husnita Usman, M.Pd. (Humas / Guru)\n- Bapak Kasmudin (Operator Sekolah)";

    const listPrestasiText = achievementsList && achievementsList.length > 0
      ? achievementsList.map(a => `- ${a.title} (Kategori: ${a.category || 'Prestasi'}): ${a.description || ''}`).join('\n')
      : "- Juara Harapan 1 Lomba Pramuka Tingkat Kabupaten\n- Juara 2 Lomba Menggambar Tingkat Kecamatan";

    const listFaqText = faqs && faqs.length > 0
      ? faqs.map(f => `Pertanyaan: ${f.question}\nJawaban: ${f.answer}`).join('\n\n')
      : "Hubungi kontak panitia untuk FAQ mendetail.";

    const listUnduhanText = downloads && downloads.length > 0
      ? downloads.map(d => `- Berkas: ${d.title} (Kategori: ${d.category}, Link: ${d.fileUrl})`).join('\n')
      : "- Formulir PPDB Offline (Tersedia di sekolah)";

    // 5. Susun System Instruction yang kaya data dan ramah
    const systemInstruction = `
Kamu adalah "aim AI", asisten virtual pintar dan ramah yang mewakili SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara.
Tugas utamamu adalah membantu pengunjung (khususnya wali murid, calon siswa, dan masyarakat umum) memberikan informasi yang akurat, lengkap, dan hangat mengenai sekolah kita.

=== GAYA KOMUNIKASI ===
- Sangat ramah, sopan, sabar, ceria, dan penuh rasa hormat.
- Gunakan bahasa Indonesia yang baik, santun, dan mudah dipahami oleh orang tua maupun anak-anak.
- Gunakan emoji yang relevan (seperti 🎒, 🏫, 📅, 👥, ✨) secara pas agar percakapan terasa hidup dan menyenangkan.
- Sapa pengunjung dengan panggilan hangat seperti "Bapak/Ibu" untuk orang tua murid, atau "Adik/Teman-teman" jika mereka adalah calon siswa.
- Selalu tawarkan bantuan tambahan di akhir jawabanmu dengan gaya bersahabat.

=== PENGETAHUAN RESMI SEKOLAH (DINAMIS DARI DATABASE) ===
1. Profil & Legalitas Resmi:
   - Nama Sekolah: SD Negeri Bobong
   - NPSN: ${npsn}
   - Status Sekolah: ${statusSekolah}
   - Akreditasi: ${akreditasi}
   - Kurikulum Operasional: ${kurikulum}
   - No. SK Pendirian: ${skPendirian}
   - Status Kepemilikan Lahan: ${kepemilikanLahan}
   - Alamat Lengkap: ${alamat}

2. Statistik Sekolah Saat Ini:
   - Jumlah Siswa Aktif: ${stats.siswa_aktif || 205} siswa
   - Jumlah Guru & Staf: ${stats.guru_staf || 14} orang
   - Jumlah Ruang Kelas: ${stats.ruang_kelas || 9} ruangan

3. Kontak Resmi Sekolah & Panitia PPDB:
   - Humas Sekolah: ${namaHumas} (Hubungi WhatsApp: +${waHumas})
   - Operator Sekolah: ${namaOperator} (Hubungi WhatsApp: +${waOperator})
   - Email Resmi Sekolah: ${emailSekolah}
   - Jika ingin menghubungi via WhatsApp, beri tahu mereka bahwa tombol WhatsApp melayang di sudut kanan bawah siap membantu menyambungkan langsung.

4. Sarana & Prasarana (Fasilitas):
   - Ruang Belajar: ${profil.ruang_belajar_desc || "9 Ruang Kelas belajar yang bersih, kondusif, dan nyaman untuk proses KBM."}
   - Ruang Guru: ${profil.ruang_guru_desc || "1 Ruang Guru dan Kepala Sekolah sebagai pusat koordinasi."}
   - Sanitasi: ${profil.sanitasi_desc || "2 Ruang Toilet bersih dan terawat untuk guru dan siswa."}
   - Gudang: ${profil.gudang_desc || "1 Ruang Gudang penyimpanan inventaris sekolah."}
   - Olahraga: ${profil.olahraga_desc || "Halaman olahraga dan upacara yang luas di tengah sekolah."}
   - Literasi: ${profil.literasi_desc || "Pojok baca kelas dan koleksi buku bacaan harian."}

5. Daftar Guru & Staf Aktif:
${listGuruText}

6. Prestasi Sekolah Terbaru:
${listPrestasiText}

7. Pusat Unduhan (Berkas yang Bisa Diunduh):
${listUnduhanText}

8. FAQ Sekolah (Pertanyaan Sering Ditanyakan):
${listFaqText}

9. Dokumen Khusus & Pengetahuan Tambahan (Pencarian Semantik):
${ragContext || "(Tidak ada dokumen tambahan spesifik yang terdeteksi untuk pertanyaan ini. Jawab berdasarkan pengetahuan sekolah standar di atas.)"}

=== ATURAN PPDB ONLINE & OFFLINE ===
- Pendaftaran PPDB Online dapat diakses langsung oleh wali murid melalui tombol "Pendaftaran" di menu atas, atau menuju ke link \`/ppdb-online\` di website ini.
- Pendaftaran PPDB Offline dapat dilakukan dengan datang langsung ke sekolah menemui panitia PPDB pada jam kerja (Senin - Sabtu pukul 08:00 - 12:00 WIT). Formulir pendaftaran offline juga dapat diunduh di halaman Unduh berkas di website ini.
- Biaya Pendaftaran: Rp 0 (Gratis! Sama sekali tidak dipungut biaya apa pun).

=== BATASAN AI ===
- Jika terdapat "9. Dokumen Khusus & Pengetahuan Tambahan" di atas yang relevan dengan pertanyaan pengunjung, berikan jawaban prioritas tinggi berdasarkan isi dokumen tersebut karena itu adalah info spesifik/terbaru.
- Fokuslah hanya pada informasi seputar SD Negeri Bobong, pendaftaran PPDB, kegiatan kesiswaan, prestasi, kurikulum, fasilitas, dan hal-hal umum terkait pendidikan dasar sekolah.
- Jika pengguna menanyakan hal di luar topik sekolah (politik praktis, hal-hal sensitif, teknologi tingkat lanjut yang tidak ada hubungannya, pemrograman rumit, dll.), arahkan kembali ke topik sekolah dengan sopan dan humoris/ramah. Contoh: "Wah, pertanyaan yang menarik! Tapi sebagai aim AI, saya lebih jago menceritakan serunya belajar di SD Negeri Bobong atau info pendaftaran PPDB nih. Apakah Bapak/Ibu ingin tahu syarat pendaftaran PPDB kita?"
`;

    // 5. Inisialisasi GoogleGenAI SDK v2 & Generate Content
    const ai = new GoogleGenAI({ apiKey });
    
    // Format histori pesan untuk SDK
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    const reply = response.text || "Maaf, saya tidak dapat merumuskan jawaban saat ini. Silakan coba lagi.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error in aim AI Chat Route:", error);
    return NextResponse.json({ 
      error: "Terjadi kesalahan internal pada server asisten.",
      details: error.message 
    }, { status: 500 });
  }
}

/**
 * Mekanisme Fallback Anggun jika GEMINI_API_KEY belum dipasang.
 * Memberikan respons cerdas secara lokal tanpa memanggil API Google.
 */
function generateFallbackResponse(query, schoolData) {
  const q = query.toLowerCase();

  const welcomeMessage = `✨ Halo! Saya **aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫

Saat ini saya sedang berjalan dalam **Mode Demo / Pemeliharaan Sistem** oleh Administrator sekolah. Meskipun fitur kecerdasan penuh saya sedang dipersiapkan, saya tetap dapat membantu Anda menjawab beberapa informasi dasar mengenai sekolah secara otomatis! 👇`;

  if (q.includes("ppdb") || q.includes("daftar") || q.includes("syarat") || q.includes("registrasi")) {
    return `${welcomeMessage}
    
🎒 **Informasi Penerimaan Peserta Didik Baru (PPDB):**
1. **Biaya:** Gratis! Rp 0 tanpa dipungut biaya apa pun.
2. **Pendaftaran Online:** Anda bisa langsung mengklik menu **"Pendaftaran"** di navigasi atas atau kunjungi halaman \`/ppdb-online\`.
3. **Pendaftaran Offline:** Datang langsung ke sekolah menemui panitia PPDB pada hari kerja (Senin-Sabtu pukul 08.00-12.00 WIT).
4. **Berkas Penting:** Formulir pendaftaran dapat diunduh langsung di halaman **"Unduh Berkas"** (\`/unduh\`).

Ada yang ingin Anda tanyakan lagi mengenai PPDB sekolah kami? 😊`;
  }

  if (q.includes("kontak") || q.includes("telepon") || q.includes("whatsapp") || q.includes("wa") || q.includes("hubungi") || q.includes("nomor")) {
    return `${welcomeMessage}
    
📞 **Kontak Resmi Panitia PPDB & Sekolah:**
* **Humas Sekolah:** ${schoolData.namaHumas} (WA: +${schoolData.waHumas})
* **Operator Sekolah:** ${schoolData.namaOperator} (WA: +${schoolData.waOperator})
* **Email Resmi:** ${schoolData.emailSekolah}

💡 *Tips:* Anda juga dapat langsung mengklik **Tombol WhatsApp Melayang berwarna hijau** di pojok kanan bawah layar Anda untuk terhubung langsung dengan operator kami secara instan!`;
  }

  if (q.includes("alamat") || q.includes("lokasi") || q.includes("peta") || q.includes("di mana") || q.includes("dimana")) {
    return `${welcomeMessage}
    
📍 **Lokasi & Alamat SD Negeri Bobong:**
* **Alamat:** ${schoolData.alamat}
* **NPSN Resmi:** ${schoolData.npsn}
* Sekolah kami terletak sangat strategis di pusat ibukota Kabupaten Pulau Taliabu, Maluku Utara. Anda juga dapat melihat peta lokasinya langsung di bagian paling bawah halaman utama website ini! 🗺️`;
  }

  if (q.includes("fasilitas") || q.includes("ruangan") || q.includes("kelas") || q.includes("toilet") || q.includes("sarana") || q.includes("prasarana")) {
    return `${welcomeMessage}
    
🏫 **Sarana & Prasarana Sekolah:**
Sekolah kami memiliki berbagai fasilitas penunjang KBM yang memadai:
* **Ruang Belajar:** ${schoolData.stats.ruang_kelas || 9} Ruang Kelas kondusif yang nyaman.
* **Ruang Guru & Kepala Sekolah:** Pusat koordinasi administrasi.
* **Sanitasi:** Toilet bersih yang terawat baik untuk guru dan siswa.
* **Fasilitas Olahraga:** Halaman sekolah yang luas untuk olahraga dan upacara bendera.
* **Pojok Baca:** Tempat literasi membaca harian murid.`;
  }

  if (q.includes("biaya") || q.includes("bayar") || q.includes("gratis") || q.includes("spp") || q.includes("uang")) {
    return `${welcomeMessage}
    
💰 **Informasi Biaya Pendidikan:**
Seluruh biaya pendaftaran PPDB maupun proses belajar mengajar harian di SD Negeri Bobong adalah **100% GRATIS (Rp 0)** karena didukung penuh oleh dana BOS dan program Pemerintah Daerah. Jangan ragu untuk mendaftarkan putra-putri Anda! 🎒`;
  }

  // Jawaban Default jika kata kunci tidak cocok
  return `${welcomeMessage}
  
Saya dapat memberikan informasi instan mengenai hal-hal berikut:
1. 🎒 **Syarat & Cara PPDB** (ketik: *ppdb*, *daftar*, *syarat*)
2. 📞 **Kontak Panitia & Email** (ketik: *kontak*, *nomor*, *hubungi*)
3. 📍 **Alamat & Lokasi Sekolah** (ketik: *alamat*, *lokasi*, *npsn*)
4. 🏫 **Fasilitas & Ruang Kelas** (ketik: *fasilitas*, *kelas*, *lapangan*)
5. 💰 **Biaya Pendaftaran** (ketik: *biaya*, *bayar*)

Silakan ketik pertanyaan Anda atau klik tombol saran pertanyaan di bawah ini untuk memulai! 😊`;
}
