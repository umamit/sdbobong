import { NextResponse } from 'next/server';
import { loadWebConfig, loadTeachers, loadAchievements } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  let latestMessage = "";
  let config = {};
  let stats = {};
  let profil = {};
  let beranda = {};
  let ppdb = {};
  let akademik = {};
  let kesiswaan = {};
  let faqs = [];
  let downloads = [];
  let npsn = "60200589";
  let statusSekolah = "Negeri";
  let akreditasi = "B (Baik)";
  let kurikulum = "Kurikulum Merdeka";
  let alamat = "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791";
  let skPendirian = "04 Oktober 1971 (SK: 420/04/10/1971)";
  let kepemilikanLahan = "Pemerintah Daerah Kabupaten Pulau Taliabu";
  let namaHumas = "Ibu Husnita Usman, M.Pd.";
  let waHumas = "6281234567890";
  let namaOperator = "Bapak Kasmudin";
  let waOperator = "6281234567890";
  let emailSekolah = "humas@sdnegeribobong.sch.id";


  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid." }, { status: 400 });
    }

    // Ambil pesan terbaru dari pengguna
    latestMessage = messages[messages.length - 1]?.content || "";

    // 1. Muat data dinamis dari database untuk pengetahuan asisten secara paralel
    const [dbConfig, teachersList, achievementsList] = await Promise.all([
      loadWebConfig(),
      loadTeachers(),
      loadAchievements()
    ]);

    config = dbConfig || {};
    const contacts = config.ppdb_contacts || {};
    stats = config.stats || {};
    const pageContents = stats.page_contents || {};
    
    profil = pageContents.profil || {};
    beranda = pageContents.beranda || {};
    ppdb = pageContents.ppdb || {};
    akademik = pageContents.akademik || {};
    kesiswaan = pageContents.kesiswaan || {};
    
    faqs = config.faqs || [];
    downloads = config.downloads || [];

    // Data default fallback jika data dinamis kosong
    if (profil.npsn) npsn = profil.npsn;
    if (profil.status_sekolah) statusSekolah = profil.status_sekolah;
    if (profil.akreditasi) akreditasi = profil.akreditasi;
    if (profil.kurikulum_operasional) kurikulum = profil.kurikulum_operasional;
    if (profil.alamat_lengkap) alamat = profil.alamat_lengkap;
    if (profil.sk_pendirian) skPendirian = profil.sk_pendirian;
    if (profil.kepemilikan_lahan) kepemilikanLahan = profil.kepemilikan_lahan;
    if (contacts.nama_humas) namaHumas = contacts.nama_humas;
    if (contacts.wa_humas) waHumas = contacts.wa_humas;
    if (contacts.nama_operator) namaOperator = contacts.nama_operator;
    if (contacts.wa_operator) waOperator = contacts.wa_operator;
    if (contacts.email_sekolah) emailSekolah = contacts.email_sekolah;

    // 2. Cek apakah GROQ_API_KEY tersedia di environment
    const groqApiKey = process.env.GROQ_API_KEY;

    // Persiapkan data fallback
    const fallbackData = {
      npsn, statusSekolah, akreditasi, kurikulum, alamat, skPendirian, kepemilikanLahan,
      namaHumas, waHumas, namaOperator, waOperator, emailSekolah,
      stats, faqs, downloads,
      beranda, profil, ppdb, akademik, kesiswaan
    };

    if (!groqApiKey) {
      console.warn("⚠️ PERINGATAN: GROQ_API_KEY tidak dikonfigurasi di server. Menggunakan Fallback AI SDN Bobong.");
      const reply = generateFallbackResponse(latestMessage, fallbackData);
      return NextResponse.json({ reply });
    }

    // 3. Format Data untuk Pengetahuan AI
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

    // Format Data Halaman Publik
    const visiText = profil.visi || `"Terwujudnya peserta didik yang Cerdas dalam berpikir, Kokoh dalam Karakter akhlak mulia, serta luhur dalam Menjaga Nilai Budaya bangsa di era global."`;
    const misiList = profil.misi || [
      "Melaksanakan pembelajaran aktif, kreatif, efektif, dan menyenangkan untuk mengoptimalkan kecerdasan siswa.",
      "Menanamkan keimanan, takwaan, serta nilai budi pekerti luhur dalam aktivitas harian sekolah.",
      "Mengintegrasikan muatan lokal kebudayaan Maluku Utara dalam pembelajaran seni dan keterampilan daerah.",
      "Membina kemandirian dan rasa peduli lingkungan hidup melalui program Sabtu Bersih dan penghijauan sekolah.",
      "Menjalin hubungan kemitraan yang harmonis dengan orang tua siswa dan masyarakat sekitar demi kesuksesan belajar anak."
    ];
    const listMisiText = Array.isArray(misiList)
      ? misiList.map((m, idx) => `${idx + 1}. ${m}`).join('\n')
      : "-";
    
    const sejarahText = `${profil.sejarah_p1 || "SD Negeri Bobong didirikan secara resmi pada tanggal 04 Oktober 1971..."}\n\n${profil.sejarah_p2 || ""}`;

    const sambutanText = `
* Sambutan Kepala Sekolah: "${beranda.welcome_title || "Mendidik dengan Hati dan Budaya Taliabu"}"
* Kutipan/Quote: ${beranda.welcome_quote || "\"Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan lentera karakter anak...\""}
* Pengantar: ${beranda.welcome_p1 || ""}
* Isi Sambutan: ${beranda.welcome_p2 || ""}
    `.trim();

    const ppdbBannerTitle = ppdb.banner_title || "PPDB TA 2026/2027";
    const ppdbBannerTextVal = ppdb.banner_text || "Portal resmi Penerimaan Peserta Didik Baru SD Negeri Bobong secara daring dan transparan.";
    const ppdbUsiaText = ppdb.syarat_usia || "Calon peserta didik baru harus berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2026...";
    const ppdbBerkasList = ppdb.syarat_berkas || [
      "Scan Akta Kelahiran asli (Format PDF, 150KB - 350KB) *",
      "Scan Kartu Keluarga (KK) terbaru asli (Format PDF, 150KB - 350KB) *",
      "Scan KTP Orang Tua (Ayah & Ibu dijadikan 1 file PDF, 150KB - 350KB) *",
      "Scan SPTJM (Surat Pertanggungjawaban Mutlak) asli (Format PDF, 150KB - 350KB) *",
      "Scan KIP / PKH asli (Format PDF, 150KB - 350KB) (Opsional)",
      "Scan Ijazah TK / PAUD asli (Format PDF, 150KB - 350KB) (Opsional)",
      "Pas foto berwarna ukuran 3x4 (Latar Merah) sebanyak 2 lembar."
    ];
    const listPpdbBerkasText = Array.isArray(ppdbBerkasList)
      ? ppdbBerkasList.map(b => `- ${b}`).join('\n')
      : "-";

    const ppdbAlurList = ppdb.alur_steps || [
      { num: "1", title: "Persiapan Dokumen", desc: "Orang tua menyiapkan scan berkas persyaratan asli dalam format PDF." },
      { num: "2", title: "Pengisian Formulir", desc: "Klik tombol Daftar Daring untuk mengisi form." },
      { num: "3", title: "Verifikasi Berkas", desc: "Panitia PPDB memeriksa kelengkapan berkas." },
      { num: "4", title: "Pengumuman Kelulusan", desc: "Pengumuman siswa lolos seleksi." }
    ];
    const listPpdbAlurText = Array.isArray(ppdbAlurList)
      ? ppdbAlurList.map(a => `${a.num}. ${a.title}: ${a.desc}`).join('\n')
      : "-";

    const ppdbJadwalList = ppdb.jadwal || [
      { activity: "Pendaftaran Online/Offline", dates: "01 Juni - 30 Juni 2026" },
      { activity: "Verifikasi Berkas & Wawancara", dates: "01 Juli - 03 Juli 2026" },
      { activity: "Pengumuman Hasil Seleksi", dates: "06 Juli 2026" },
      { activity: "Daftar Ulang Siswa Baru", dates: "07 Juli - 10 Juli 2026" }
    ];
    const listPpdbJadwalText = Array.isArray(ppdbJadwalList)
      ? ppdbJadwalList.map(j => `- ${j.activity}: ${j.dates}`).join('\n')
      : "-";

    const ppdbFaqList = ppdb.faq || [
      { q: "Bagaimana jika anak belum berusia 6 tahun?", a: "Dapat dipertimbangkan jika memiliki potensi kecerdasan istimewa." },
      { q: "Apakah ada pungutan biaya?", a: "Tidak ada, gratis." }
    ];
    const listPpdbFaqText = Array.isArray(ppdbFaqList)
      ? ppdbFaqList.map(f => `Pertanyaan: ${f.q || f.question}\nJawaban: ${f.a || f.answer}`).join('\n\n')
      : "-";

    const akademikBannerTextVal = akademik.banner_text || "Panduan kurikulum, kalender pendidikan berjalan, serta tata tertib kedisiplinan siswa.";
    const kurikulumTitleVal = akademik.kurikulum_title || "Penerapan Kurikulum Merdeka";
    const kurikulumP1Val = akademik.kurikulum_p1 || "SD Negeri Bobong telah mengimplementasikan Kurikulum Merdeka secara bertahap...";
    const kurikulumP2Val = akademik.kurikulum_p2 || "Salah satu pilar utama kurikulum ini adalah Projek Penguatan Profil Pelajar Pancasila (P5)...";
    
    const akademikCalendarList = akademik.calendar || [
      { id: "juli", month: "Juli 2025", desc: "Hari Pertama Sekolah & MPLS", dates: "14 - 16 Juli 2025" }
    ];
    const listAkademikCalendarText = Array.isArray(akademikCalendarList)
      ? akademikCalendarList.map(c => `- [${c.month}] ${c.desc} (${c.dates})`).join('\n')
      : "-";

    const akademikTataTertibList = akademik.tata_tertib || [
      "Kehadiran: Siswa wajib hadir di sekolah paling lambat pukul 07.15 WIT.",
      "Atribut: Siswa harus mengenakan seragam lengkap."
    ];
    const listAkademikTataTertibText = Array.isArray(akademikTataTertibList)
      ? akademikTataTertibList.map(t => `- ${t}`).join('\n')
      : "-";

    const akademikSeragamList = akademik.seragam || [
      { days: "Senin - Selasa", type: "Nasional Merah Putih", details: "Lengkap dengan atribut" }
    ];
    const listAkademikSeragamText = Array.isArray(akademikSeragamList)
      ? akademikSeragamList.map(s => `- ${s.days}: Seragam ${s.type} (${s.details})`).join('\n')
      : "-";

    const akademikP5List = akademik.p5_projects || [
      { title: "Gaya Hidup Berkelanjutan", desc: "Bahari Lestari Pulau Taliabu..." },
      { title: "Kearifan Lokal", desc: "Anyaman Pandan & Seni Tari Taliabu..." },
      { title: "Kewirausahaan", desc: "Kantin Kreatif Olahan Sagu Taliabu..." }
    ];
    const listAkademikP5Text = Array.isArray(akademikP5List)
      ? akademikP5List.map(p => `- ${p.title || p.badge}: ${p.desc}`).join('\n')
      : "-";

    const kesiswaanBannerTextVal = kesiswaan.banner_text || "Wadah eksplorasi bakat, minat, serta apresiasi etalase prestasi siswa-siswi kami.";
    
    const kesiswaanEkskulList = kesiswaan.ekstrakurikuler || [
      { nama: "Pramuka", deskripsi: "Melatih kemandirian...", jadwal: "Sabtu, 14:00 - 16:00 WIT", is_wajib: true }
    ];
    const listKesiswaanEkskulText = Array.isArray(kesiswaanEkskulList)
      ? kesiswaanEkskulList.map(e => `- ${e.nama} (${e.is_wajib ? 'Wajib' : 'Pilihan'}): ${e.deskripsi} (Jadwal: ${e.jadwal})`).join('\n')
      : "-";

    const kesiswaanPrestasiList = kesiswaan.prestasi || [
      { rank: "1st", title: "Juara 1 Lomba Pidato", level: "Tingkat Kabupaten", desc: "Fahri Taliabu..." }
    ];
    const listKesiswaanPrestasiText = Array.isArray(kesiswaanPrestasiList)
      ? kesiswaanPrestasiList.map(p => `- [${p.rank}] ${p.title} (${p.level}): ${p.desc}`).join('\n')
      : "-";

    const kesiswaanKaryaList = kesiswaan.karya || [
      { title: "Lukisan Poster Laut Taliabu", category: "Cinta Lingkungan", desc: "Siswa kelas 5..." }
    ];
    const listKesiswaanKaryaText = Array.isArray(kesiswaanKaryaList)
      ? kesiswaanKaryaList.map(k => `- ${k.title} (${k.category}): ${k.desc}`).join('\n')
      : "-";

    // 4. Susun System Instruction yang kaya data dan ramah
    const systemInstruction = `
Kamu adalah "Aim AI", asisten virtual pintar dan ramah yang mewakili SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara.
Tugas utamamu adalah membantu pengunjung (khususnya wali murid, calon siswa, dan masyarakat umum) memberikan informasi yang akurat, lengkap, dan hangat mengenai sekolah kita.

=== GAYA KOMUNIKASI ===
- Sangat ramah, sopan, sabar, ceria, dan penuh rasa hormat.
- Gunakan bahasa Indonesia yang baik, santun, dan mudah dipahami oleh orang tua maupun anak-anak.
- Gunakan emoji yang relevan (seperti 🎒, 🏫, 📅, 👥, ✨) secara pas agar percakapan terasa hidup dan menyenangkan.
- Sapa pengunjung dengan panggilan hangat seperti "Bapak/Ibu" untuk orang tua murid, atau "Adik/Teman-teman" jika mereka adalah calon siswa.
- Selalu tawarkan bantuan tambahan di akhir jawabanmu dengan gaya bersahabat.

=== PENGETAHUAN RESMI SEKOLAH (DINAMIS DARI DATABASE) ===
1. Profil, Legalitas & Sejarah Resmi:
   - Nama Resmi Sekolah: SD Negeri Bobong
   - NPSN: ${npsn}
   - Status Sekolah: ${statusSekolah}
   - Akreditasi: ${akreditasi}
   - Kurikulum Operasional: ${kurikulum}
   - No. SK Pendirian: ${skPendirian}
   - Status Kepemilikan Lahan: ${kepemilikanLahan}
   - Alamat Lengkap: ${alamat}
   - Visi Sekolah: ${visiText}
   - Misi Sekolah:
${listMisiText}
   - Sejarah Singkat:
${sejarahText}

2. Sambutan Beranda Halaman Utama:
${sambutanText}

3. Statistik Sekolah Saat Ini:
   - Jumlah Siswa Aktif: ${stats.siswa_aktif || 205} siswa
   - Jumlah Guru & Staf: ${stats.guru_staf || 14} orang
   - Jumlah Ruang Kelas: ${stats.ruang_kelas || 9} ruangan
   - Jumlah Rombel: ${stats.rombel || 6} rombel
   - Toilet: ${stats.toilet || 2} unit
   - UKS: ${stats.uks || 1} unit
   - Gudang: ${stats.gudang || 1} unit
   - Cuci Tangan: ${stats.cuci_tangan || 4} area

4. Kontak Resmi Sekolah & Panitia PPDB:
   - Humas Sekolah: ${namaHumas} (Hubungi WhatsApp: +${waHumas})
   - Operator Sekolah: ${namaOperator} (Hubungi WhatsApp: +${waOperator})
   - Email Resmi Sekolah: ${emailSekolah}
   - Jika ingin menghubungi via WhatsApp, beri tahu mereka bahwa tombol WhatsApp melayang di sudut kanan bawah siap membantu menyambungkan langsung.

5. Sarana & Prasarana (Fasilitas):
   - Ruang Belajar: ${profil.ruang_belajar_desc || "9 Ruang Kelas belajar yang bersih, kondusif, dan nyaman untuk proses KBM."}
   - Ruang Guru: ${profil.ruang_guru_desc || "1 Ruang Guru dan Kepala Sekolah sebagai pusat koordinasi."}
   - Sanitasi: ${profil.sanitasi_desc || "2 Ruang Toilet bersih dan terawat untuk guru dan siswa."}
   - Gudang: ${profil.gudang_desc || "1 Ruang Gudang penyimpanan inventaris sekolah."}
   - Olahraga: ${profil.olahraga_desc || "Halaman olahraga dan upacara yang luas di tengah sekolah."}
   - Literasi: ${profil.literasi_desc || "Pojok baca kelas dan koleksi buku bacaan harian."}

6. Penerimaan Peserta Didik Baru (PPDB):
   - Judul Banner PPDB: ${ppdbBannerTitle}
   - Deskripsi: ${ppdbBannerTextVal}
   - Batas Usia: ${ppdbUsiaText}
   - Jadwal PPDB:
${listPpdbJadwalText}
   - Berkas Persyaratan PPDB:
${listPpdbBerkasText}
   - Alur Pendaftaran PPDB:
${listPpdbAlurText}
   - Tanya-Jawab (FAQ) PPDB Khusus:
${listPpdbFaqText}

7. Informasi Akademik & Kurikulum:
   - Deskripsi Akademik: ${akademikBannerTextVal}
   - Detail Kurikulum: ${kurikulumTitleVal} - ${kurikulumP1Val}
   - Proyek P5 (${kurikulumP2Val}):
${listAkademikP5Text}
   - Kalender Akademik Belajar:
${listAkademikCalendarText}
   - Tata Tertib Kedisiplinan:
${listAkademikTataTertibText}
   - Aturan Seragam Sekolah Harian:
${listAkademikSeragamText}

8. Kesiswaan & Kegiatan Ekstrakurikuler:
   - Deskripsi Kesiswaan: ${kesiswaanBannerTextVal}
   - Program Ekstrakurikuler:
${listKesiswaanEkskulText}
   - Prestasi Kesiswaan Halaman Publik:
${listKesiswaanPrestasiText}
   - Pojok Karya Siswa:
${listKesiswaanKaryaText}

9. Daftar Guru & Staf Aktif (Database):
${listGuruText}

10. Prestasi Sekolah Umum (Database):
${listPrestasiText}

11. Pusat Unduhan (Berkas yang Bisa Diunduh):
${listUnduhanText}

12. FAQ Sekolah Umum:
${listFaqText}

=== ATURAN PPDB ONLINE & OFFLINE ===
- Pendaftaran PPDB Online dapat diakses langsung oleh wali murid melalui tombol "Pendaftaran" di menu atas, atau menuju ke link \`/ppdb-online\` di website ini.
- Pendaftaran PPDB Offline dapat dilakukan dengan datang langsung ke sekolah menemui panitia PPDB pada jam kerja (Senin - Sabtu pukul 08:00 - 12:00 WIT). Formulir pendaftaran offline juga dapat diunduh di halaman Unduh berkas di website ini.
- Biaya Pendaftaran: Rp 0 (Gratis! Sama sekali tidak dipungut biaya apa pun).

=== BATASAN AI ===
- Fokuslah hanya pada informasi seputar SD Negeri Bobong, pendaftaran PPDB, kegiatan kesiswaan, prestasi, kurikulum, fasilitas, dan hal-hal umum terkait pendidikan dasar sekolah.
- Jika pengguna menanyakan hal di luar topik sekolah (politik praktis, hal-hal sensitif, teknologi tingkat lanjut yang tidak ada hubungannya, pemrograman rumit, dll.), arahkan kembali ke topik sekolah dengan sopan dan humoris/ramah. Contoh: "Wah, pertanyaan yang menarik! Tapi sebagai Aim AI, saya lebih jago menceritakan serunya belajar di SD Negeri Bobong atau info pendaftaran PPDB nih. Apakah Bapak/Ibu ingin tahu syarat pendaftaran PPDB kita?"
`;

    // 5. Kirim data ke API Groq menggunakan Fetch (Model Llama 3)
    let reply = "";
    let success = false;
    const modelsToTry = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
    let lastError = null;

    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Aim AI] Menghubungi Groq API menggunakan model: ${modelName}`);
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (!groqRes.ok) {
          const errText = await groqRes.text();
          throw new Error(`Groq API error (${groqRes.status}): ${errText}`);
        }

        const groqData = await groqRes.json();
        reply = groqData.choices?.[0]?.message?.content || "";
        if (reply) {
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} gagal:`, err.message || err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("Semua model Groq gagal merespons.");
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("⚠️ Error calling Groq API in chat route. Falling back to local responder:", error.message || error);
    try {
      // Re-load variables defensively for catch block fallback
      const [dbConfig] = await Promise.all([loadWebConfig()]);
      const config = dbConfig || {};
      const contacts = config.ppdb_contacts || {};
      const stats = config.stats || {};
      const pageContents = stats.page_contents || {};
      
      const profil = pageContents.profil || {};
      const beranda = pageContents.beranda || {};
      const ppdb = pageContents.ppdb || {};
      const akademik = pageContents.akademik || {};
      const kesiswaan = pageContents.kesiswaan || {};
      
      const faqs = config.faqs || [];
      const downloads = config.downloads || [];

      if (profil.npsn) npsn = profil.npsn;
      if (profil.status_sekolah) statusSekolah = profil.status_sekolah;
      if (profil.akreditasi) akreditasi = profil.akreditasi;
      if (profil.kurikulum_operasional) kurikulum = profil.kurikulum_operasional;
      if (profil.alamat_lengkap) alamat = profil.alamat_lengkap;
      if (profil.sk_pendirian) skPendirian = profil.sk_pendirian;
      if (contacts.nama_humas) namaHumas = contacts.nama_humas;
      if (contacts.wa_humas) waHumas = contacts.wa_humas;
      if (contacts.nama_operator) namaOperator = contacts.nama_operator;
      if (contacts.wa_operator) waOperator = contacts.wa_operator;
      if (contacts.email_sekolah) emailSekolah = contacts.email_sekolah;

      const fallbackData = {
        npsn, statusSekolah, akreditasi, kurikulum, alamat, skPendirian,
        namaHumas, waHumas, namaOperator, waOperator, emailSekolah,
        stats, faqs, downloads,
        beranda, profil, ppdb, akademik, kesiswaan
      };

      const reply = generateFallbackResponse(latestMessage, fallbackData);
      return NextResponse.json({ reply });
    } catch (fallbackError) {
      console.error("❌ Fatal fallback error:", fallbackError);
      return NextResponse.json({ 
        error: "Terjadi kesalahan internal pada server asisten.",
        details: error.message 
      }, { status: 500 });
    }
  }
}

/**
 * Mekanisme Fallback Anggun jika GROQ_API_KEY belum dipasang.
 * Memberikan respons cerdas secara lokal tanpa memanggil API Groq.
 */
function generateFallbackResponse(query, schoolData) {
  const q = query.toLowerCase();

  const welcomeMessage = `✨ Halo! Saya **Aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫

Saat ini saya sedang berjalan dalam **Mode Demo / Pemeliharaan Sistem** oleh Administrator sekolah. Meskipun fitur kecerdasan penuh saya sedang dipersiapkan, saya tetap dapat membantu Anda menjawab beberapa informasi dasar mengenai sekolah secara otomatis! 👇`;

  const ppdb = schoolData.ppdb || {};
  const akademik = schoolData.akademik || {};
  const kesiswaan = schoolData.kesiswaan || {};
  const profil = schoolData.profil || {};
  const stats = schoolData.stats || {};

  const syaratUsia = ppdb.syarat_usia || "Calon peserta didik baru harus berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2026. Anak berusia 7 tahun akan diprioritaskan dalam penerimaan kuota utama.";
  
  const syaratBerkas = ppdb.syarat_berkas || [
    "Scan Akta Kelahiran asli *",
    "Scan Kartu Keluarga (KK) terbaru *",
    "Scan KTP Orang Tua (Ayah & Ibu dijadikan 1 file PDF) *",
    "Scan SPTJM (Surat Pertanggungjawaban Mutlak) asli *",
    "Scan KIP / PKH (Opsional)",
    "Scan Ijazah TK / PAUD (Opsional)",
    "Pas foto berwarna ukuran 3x4 latar merah sebanyak 2 lembar."
  ];

  const alurSteps = ppdb.alur_steps || [];
  const jadwal = ppdb.jadwal || [];

  if (q.includes("ppdb") || q.includes("daftar") || q.includes("syarat") || q.includes("registrasi")) {
    let berkasText = syaratBerkas.map((b, i) => `${i + 1}. ${b}`).join('\n');
    let jadwalText = jadwal.length > 0 
      ? '\n\n📅 **Jadwal PPDB:**\n' + jadwal.map(j => `- ${j.activity}: ${j.dates}`).join('\n') 
      : "";
    let alurText = alurSteps.length > 0 
      ? '\n\n🔄 **Alur PPDB:**\n' + alurSteps.map(a => `${a.num}. ${a.title}: ${a.desc}`).join('\n') 
      : "";

    return `${welcomeMessage}
    
🎒 **Informasi Penerimaan Peserta Didik Baru (PPDB):**
* **Batas Usia:** ${syaratUsia}
* **Biaya:** Gratis! Rp 0 tanpa dipungut biaya apa pun.
* **Pendaftaran Online:** Anda bisa langsung mengklik menu **"Pendaftaran"** di navigasi atas atau kunjungi halaman \`/ppdb-online\`.
* **Pendaftaran Offline:** Datang langsung ke sekolah menemui panitia PPDB pada hari kerja (Senin-Sabtu pukul 08.00-12.00 WIT).

📝 **Berkas yang Diperlukan:**
${berkasText}${jadwalText}${alurText}

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
* **Ruang Belajar:** ${stats.ruang_kelas || 9} Ruang Kelas kondusif yang nyaman.
* **Ruang Guru & Kepala Sekolah:** Pusat koordinasi administrasi.
* **Sanitasi:** Toilet bersih yang terawat baik untuk guru dan siswa.
* **Fasilitas Olahraga:** Halaman sekolah yang luas untuk olahraga dan upacara bendera.
* **Pojok Baca:** Tempat literasi membaca harian murid.`;
  }

  if (q.includes("visi") || q.includes("misi") || q.includes("tujuan")) {
    const visiVal = profil.visi || `"Terwujudnya peserta didik yang Cerdas dalam berpikir, Kokoh dalam Karakter akhlak mulia, serta luhur dalam Menjaga Nilai Budaya bangsa di era global."`;
    const misiList = profil.misi || [
      "Melaksanakan pembelajaran aktif, kreatif, efektif, dan menyenangkan untuk mengoptimalkan kecerdasan siswa.",
      "Menanamkan keimanan, takwaan, serta nilai budi pekerti luhur dalam aktivitas harian sekolah."
    ];
    let misiText = misiList.map((m, i) => `${i + 1}. ${m}`).join('\n');
    return `${welcomeMessage}
    
🎯 **Visi & Misi SD Negeri Bobong:**
* **Visi:**
  ${visiVal}
  
* **Misi:**
${misiText}

Apakah ada informasi lain tentang profil sekolah yang ingin Anda ketahui? 😊`;
  }

  if (q.includes("kurikulum") || q.includes("p5") || q.includes("merdeka") || q.includes("akademik") || q.includes("belajar") || q.includes("seragam") || q.includes("tertib") || q.includes("tata tertib")) {
    const kurikulumTitle = akademik.kurikulum_title || "Penerapan Kurikulum Merdeka";
    const kurikulumP1 = akademik.kurikulum_p1 || "SD Negeri Bobong telah mengimplementasikan Kurikulum Merdeka secara bertahap...";
    const p5Projects = akademik.p5_projects || [];
    let p5Text = p5Projects.map(p => `- **${p.title || p.badge}**: ${p.desc}`).join('\n');
    const seragam = akademik.seragam || [];
    let seragamText = seragam.map(s => `- **${s.days}**: ${s.type} (${s.details})`).join('\n');

    return `${welcomeMessage}
    
📚 **Informasi Akademik & Kurikulum:**
* **Kurikulum:** ${kurikulumTitle}
  ${kurikulumP1}
  
* **Projek P5 (Profil Pelajar Pancasila):**
${p5Text || "- Gaya Hidup Berkelanjutan\n- Kearifan Lokal\n- Kewirausahaan"}

👔 **Panduan Seragam Harian:**
${seragamText || "- Senin-Selasa: Merah Putih\n- Rabu-Kamis: Batik\n- Jumat: Olahraga/Busana Muslim\n- Sabtu: Pramuka"}

Ada yang bisa saya bantu lagi mengenai informasi belajar di kelas? 📝`;
  }

  if (q.includes("ekskul") || q.includes("ekstrakurikuler") || q.includes("pramuka") || q.includes("olahraga") || q.includes("tari") || q.includes("dokter") || q.includes("uks")) {
    const ekskul = kesiswaan.ekstrakurikuler || [];
    let ekskulText = ekskul.map(e => `- **${e.nama}** (${e.is_wajib ? 'Wajib' : 'Pilihan'}): ${e.deskripsi} (Jadwal: ${e.jadwal})`).join('\n');

    return `${welcomeMessage}
    
🎒 **Kegiatan Ekstrakurikuler:**
Berikut adalah program pengembangan minat dan bakat siswa di SD Negeri Bobong:
${ekskulText || "- Gerakan Pramuka (Wajib bagi kelas 3-6)\n- Dokter Kecil & UKS\n- Klub Olahraga (Sepak Bola & Bulu Tangkis)\n- Seni Tari Tradisional Maluku Utara"}

Ada ekskul tertentu yang ingin ditanyakan detailnya? 🏃✨`;
  }

  if (q.includes("prestasi") || q.includes("juara") || q.includes("piala")) {
    const prestasi = kesiswaan.prestasi || [];
    let prestasiText = prestasi.map(p => `- **[${p.rank}] ${p.title}** (${p.level}): ${p.desc}`).join('\n');

    return `${welcomeMessage}
    
🏆 **Prestasi Siswa SD Negeri Bobong:**
Siswa-siswi kami telah mengukir berbagai prestasi gemilang:
${prestasiText || "- Juara 1 Lomba Pidato Tingkat Kabupaten\n- Juara 2 Kaligrafi Tingkat Kecamatan\n- Juara Harapan 1 Pramuka Tingkat Kabupaten"}

Kami sangat bangga dengan dedikasi dan prestasi luar biasa dari anak-anak kami! 🌟`;
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
4. 🏫 **Visi & Misi Sekolah** (ketik: *visi*, *misi*)
5. 📚 **Kurikulum & Panduan Seragam** (ketik: *kurikulum*, *p5*, *seragam*)
6. 🏃 **Ekstrakurikuler / Ekskul** (ketik: *ekskul*, *pramuka*)
7. 🏆 **Prestasi Siswa** (ketik: *prestasi*, *juara*)
8. 🏫 **Fasilitas & Ruang Kelas** (ketik: *fasilitas*, *kelas*, *lapangan*)
9. 💰 **Biaya Pendaftaran** (ketik: *biaya*, *bayar*)

Silakan ketik pertanyaan Anda atau klik tombol saran pertanyaan di bawah ini untuk memulai! 😊`;
}
