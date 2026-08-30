import { NextResponse } from 'next/server';
import { loadWebConfig, loadTeachers, loadAchievements, loadNews, getFreshChatKnowledge, setChatKnowledge } from '../../../lib/database';
import { chatSchema, parseBody } from '../../../lib/validators';
import { generateFallbackResponse } from './fallback';

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
  let namaHumas = "Belum diset admin";
  let waHumas = "Belum diset admin";
  let namaOperator = "Belum diset admin";
  let waOperator = "Belum diset admin";
  let emailSekolah = "admin@sdnegeribobong.sch.id";
  let fallbackData = null;


  try {
    const parsed = await parseBody(req, chatSchema);
    if (!parsed.success) return parsed.error;
    const { messages } = parsed.data;

    // Ambil pesan terbaru dari pengguna
    latestMessage = messages[messages.length - 1]?.content || "";

    // 1. Muat data dinamis dari database untuk pengetahuan asisten secara paralel dengan cache global 5 menit
    let dbData = getFreshChatKnowledge();
    if (!dbData) {
      const [dbConfig, teachersList, achievementsList, newsList] = await Promise.all([
        loadWebConfig(),
        loadTeachers(),
        loadAchievements(),
        loadNews()
      ]);
      dbData = { dbConfig, teachersList, achievementsList, newsList };
      setChatKnowledge(dbData);
    }
    const { dbConfig, teachersList, achievementsList, newsList } = dbData;

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
    if (contacts.nama_humas !== undefined) {
      namaHumas = contacts.nama_humas && contacts.nama_humas.trim() !== "" ? contacts.nama_humas.trim() : "Belum ditetapkan / Belum ada";
    }
    if (contacts.wa_humas !== undefined) {
      waHumas = contacts.wa_humas && contacts.wa_humas.trim() !== "" ? contacts.wa_humas.trim() : "Belum ditentukan";
    }
    if (contacts.nama_operator !== undefined) {
      namaOperator = contacts.nama_operator && contacts.nama_operator.trim() !== "" ? contacts.nama_operator.trim() : "Belum ditetapkan / Belum ada";
    }
    if (contacts.wa_operator !== undefined) {
      waOperator = contacts.wa_operator && contacts.wa_operator.trim() !== "" ? contacts.wa_operator.trim() : "Belum ditentukan";
    }
    if (contacts.email_sekolah !== undefined) {
      emailSekolah = contacts.email_sekolah && contacts.email_sekolah.trim() !== "" ? contacts.email_sekolah.trim() : "Belum ditentukan";
    }

    // Dapatkan tanggal dan waktu aktual dalam zona waktu WIT (Waktu Indonesia Timur)
    const now = new Date();
    const currentDateText = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jayapura'
    }) + " WIT (Waktu Indonesia Timur)";

    // Format Pengumuman Berjalan (Marquee)
    const marqueeAnnouncements = config.marquee_announcements || [];
    const listMarqueeText = marqueeAnnouncements && marqueeAnnouncements.length > 0
      ? marqueeAnnouncements.map((m, idx) => `${idx + 1}. ${m}`).join('\n')
      : "Tidak ada pengumuman berjalan saat ini.";

    // 2. Cek apakah GROQ_API_KEY tersedia di environment
    const groqApiKey = process.env.GROQ_API_KEY;

    // Persiapkan data fallback
    fallbackData = {
      npsn, statusSekolah, akreditasi, kurikulum, alamat, skPendirian, kepemilikanLahan,
      namaHumas, waHumas, namaOperator, waOperator, emailSekolah,
      stats, faqs, downloads,
      beranda, profil, ppdb, akademik, kesiswaan,
      news: newsList,
      marquee: marqueeAnnouncements,
      currentDate: currentDateText
    };

    if (!groqApiKey) {
      console.warn("⚠️ PERINGATAN: GROQ_API_KEY tidak dikonfigurasi di server. Menggunakan Fallback AI SDN Bobong.");
      const reply = generateFallbackResponse(latestMessage, fallbackData);
      return NextResponse.json({ reply });
    }

    // 3. Format Data untuk Pengetahuan AI
    const listGuruText = teachersList && teachersList.length > 0
      ? teachersList.map(t => `- ${t.name} (${t.role || 'Tenaga Pendidik'})`).join('\n')
      : "- Data dewan guru terdaftar di database sekolah";

    const listPrestasiText = achievementsList && achievementsList.length > 0
      ? achievementsList.map(a => `- ${a.title} (Kategori: ${a.category || 'Prestasi'}): ${a.description || ''}`).join('\n')
      : "- Juara Harapan 1 Lomba Pramuka Tingkat Kabupaten\n- Juara 2 Lomba Menggambar Tingkat Kecamatan";

    const listFaqText = faqs && faqs.length > 0
      ? faqs.map(f => `Pertanyaan: ${f.question}\nJawaban: ${f.answer}`).join('\n\n')
      : "Hubungi kontak panitia untuk FAQ mendetail.";

    const listUnduhanText = downloads && downloads.length > 0
      ? downloads.map(d => `- Berkas: ${d.title} (Kategori: ${d.category}, Link: ${d.fileUrl})`).join('\n')
      : "- Formulir PPDB Offline (Tersedia di sekolah)";

    const listNewsText = newsList && newsList.length > 0
      ? [...newsList]
          .sort((a, b) => {
            const valA = parseInt(a.id?.replace('news-', '') || 0, 10);
            const valB = parseInt(b.id?.replace('news-', '') || 0, 10);
            return valB - valA;
          })
          .slice(0, 5)
          .map(n => {
            const cleanContent = (n.content || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
            return `- **Judul**: ${n.title}\n  **Tanggal**: ${n.date || 'Terbaru'}\n  **Kategori**: ${n.category || 'Kegiatan'}\n  **Ringkasan**: ${cleanContent.substring(0, 200)}...`;
          })
          .join('\n\n')
      : "Tidak ada berita kegiatan terbaru yang diunggah.";

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
      "Scan Kartu Keluarga (KK) asli (Format PDF, 150KB - 350KB) *",
      "Scan Ijazah TK / PAUD asli (Format PDF, 150KB - 350KB) (Opsional)"
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

    // 4. Susun System Instruction secara dinamis menggunakan RAG (Retrieval-Augmented Generation) Lokal
    const queryLower = latestMessage.toLowerCase();

    // Dapatkan history 3 pesan terakhir dari pengguna untuk pendeteksian konteks multi-turn
    const userHistoryMessages = messages.filter(m => m.role === 'user').slice(-3);
    const queryForRag = userHistoryMessages.map(m => m.content).join(" ").toLowerCase();

    // Rambu-rambu apakah user menyapa secara umum
    const isGenericGreeting = queryForRag.trim().length < 8 || 
      ['halo', 'hei', 'hy', 'hi', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'salam', 'tanya', 'ask'].some(kw => queryForRag.includes(kw));

    // Identifikasi data Kepala Sekolah secara presisi dari database dewan guru
    const kepalaSekolahObj = teachersList.find(t => t.role?.toLowerCase()?.includes('kepala sekolah')) || null;
    const namaKepalaSekolah = kepalaSekolahObj ? `${kepalaSekolahObj.name}${kepalaSekolahObj.nip ? ` (NIP: ${kepalaSekolahObj.nip})` : ''}` : "Belum diisi di database";

    // Base System Instruction (Selalu disertakan)
    let systemInstruction = `
Kamu adalah "Aim AI", asisten virtual pintar dan ramah yang mewakili SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara.
Tugas utamamu adalah membantu pengunjung (khususnya wali murid, calon siswa, dan masyarakat umum) memberikan informasi yang akurat, lengkap, dan hangat mengenai sekolah kita.

=== GAYA KOMUNIKASI ===
- Sangat ramah, sopan, sabar, ceria, dan penuh rasa hormat.
- Gunakan bahasa Indonesia yang baik, santun, dan mudah dipahami oleh orang tua maupun anak-anak.
- Jangan menggunakan emoji atau emotikon teks apapun dalam jawaban. Cukup teks biasa dan format markdown.
- Sapa pengunjung dengan panggilan hangat seperti "Bapak/Ibu" untuk orang tua murid, atau "Adik/Teman-teman" jika mereka adalah calon siswa.
- Selalu tawarkan bantuan tambahan di akhir jawabanmu dengan gaya bersahabat.

=== FORMAT JAWABAN ===
- Untuk pertanyaan sederhana: jawab langsung, singkat, maksimal 2-3 paragraf pendek.
- Untuk pertanyaan kompleks (alur PPDB, jadwal, kurikulum): gunakan bullet point atau daftar bernomor agar mudah dibaca.
- Gunakan **teks tebal** untuk nama, angka penting, istilah kunci, dan judul bagian.
- Jangan membuat jawaban terlalu panjang jika tidak perlu.
- Deteksi konteks penanya: jika terlihat seperti anak-anak atau siswa, gunakan bahasa yang lebih sederhana dan lebih santai.

=== PENGETAHUAN RESMI SEKOLAH (DINAMIS DARI DATABASE) ===
1. Profil & Kontak Ringkas Sekolah:
   - Nama Resmi Sekolah: SD Negeri Bobong
   - Kepala Sekolah Saat Ini: **${namaKepalaSekolah}**
   - NPSN: ${npsn}
   - Status Sekolah: ${statusSekolah}
   - Akreditasi: ${akreditasi}
   - Alamat Lengkap: ${alamat}
   - Humas Sekolah: ${namaHumas} (Hubungi WhatsApp: +${waHumas})
   - Operator Sekolah: ${namaOperator} (Hubungi WhatsApp: +${waOperator})
   - Email Resmi Sekolah: ${emailSekolah}
`;

    // RAG: 2. Visi, Misi, Sejarah & Sambutan
    const profilKeywords = ['profil', 'visi', 'misi', 'sejarah', 'sambutan', 'kepala sekolah', 'lahan', 'sk pendirian', 'didirikan', 'tentang', 'yayasan'];
    if (profilKeywords.some(kw => queryForRag.includes(kw)) || isGenericGreeting) {
      systemInstruction += `
2. Visi, Misi, Sejarah & Sambutan Utama:
   - Visi Sekolah: ${visiText}
   - Misi Sekolah:
${listMisiText}
   - Sejarah Singkat:
${sejarahText}
${sambutanText}
`;
    }

    // RAG: 3. Statistik Sekolah & Fasilitas
    const facilitiesKeywords = ['fasilitas', 'kelas', 'ruangan', 'toilet', 'uks', 'gudang', 'olahraga', 'lapangan', 'sarana', 'prasarana', 'jumlah siswa', 'jumlah guru', 'rombel', 'ruang', 'gedung'];
    if (facilitiesKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
3. Statistik Sekolah & Fasilitas:
   - Jumlah Siswa Aktif: ${stats.siswa_aktif || 205} siswa
   - Jumlah Guru & Staf: ${stats.guru_staf || 14} orang
   - Jumlah Ruang Kelas: ${stats.ruang_kelas || 9} ruangan
   - Jumlah Rombel: ${stats.rombel || 6} rombel
   - Toilet: ${stats.toilet || 2} unit
   - UKS: ${stats.uks || 1} unit
   - Gudang: ${stats.gudang || 1} unit
   - Cuci Tangan: ${stats.cuci_tangan || 4} area
   - Detail Sarana & Prasarana:
     * Ruang Belajar: ${profil.ruang_belajar_desc || "9 Ruang Kelas belajar yang bersih, kondusif, dan nyaman untuk proses KBM."}
     * Ruang Guru: ${profil.ruang_guru_desc || "1 Ruang Guru dan Kepala Sekolah sebagai pusat koordinasi."}
     * Sanitasi: ${profil.sanitasi_desc || "2 Ruang Toilet bersih dan terawat untuk guru dan siswa."}
     * Gudang: ${profil.gudang_desc || "1 Ruang Gudang penyimpanan inventaris sekolah."}
     * Olahraga: ${profil.olahraga_desc || "Halaman olahraga dan upacara yang luas di tengah sekolah."}
     * Literasi: ${profil.literasi_desc || "Pojok baca kelas dan koleksi buku bacaan harian."}
`;
    }

    // RAG: 4. PPDB
    const ppdbKeywords = ['ppdb', 'daftar', 'pendaftaran', 'masuk', 'syarat', 'berkas', 'biaya', 'umur', 'usia', 'formulir', 'daring', 'online', 'offline', 'gelombang'];
    if (ppdbKeywords.some(kw => queryForRag.includes(kw)) || isGenericGreeting) {
      systemInstruction += `
4. Penerimaan Peserta Didik Baru (PPDB):
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
`;
    }

    // RAG: 5. Akademik, Kurikulum & Jadwal
    const akademikKeywords = ['akademik', 'kurikulum', 'merdeka', 'p5', 'belajar', 'tata tertib', 'seragam', 'shift', 'jadwal', 'kbm', 'kalender', 'jumat', 'sabtu', 'pagi', 'siang'];
    if (akademikKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
5. Informasi Akademik, Kurikulum & Jadwal:
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
   - Jadwal Kegiatan Belajar Mengajar (KBM) Double-Shift:
     * Shift Pagi (Wajib untuk Kelas I, II, dan III):
       - Senin s.d. Kamis: Masuk pagi, pulang pukul 12:45 WIT.
       - Jumat: Pulang pukul 11:00 WIT (tidak ada shift siang).
       - Sabtu: Pulang pukul 12:45 WIT (tidak ada shift siang).
     * Shift Siang (Wajib untuk Kelas IV, V, dan VI):
       - Senin s.d. Kamis: Masuk siang pukul 12:45 WIT, pulang pukul 16:15 WIT.
       - Jumat dan Sabtu: TIDAK ADA Shift Siang. Seluruh siswa kelas siang (Kelas IV, V, VI) wajib masuk pagi bersama kelas pagi, dengan jadwal kepulangan hari Jumat jam 11:00 WIT dan hari Sabtu jam 12:45 WIT.
`;
    }

    // RAG: 6. Kesiswaan & Ekskul
    const kesiswaanKeywords = ['siswa', 'kesiswaan', 'ekstrakurikuler', 'ekskul', 'pramuka', 'karya', 'prestasi', 'lomba', 'juara'];
    if (kesiswaanKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
6. Kesiswaan, Ekstrakurikuler & Pojok Karya:
   - Deskripsi Kesiswaan: ${kesiswaanBannerTextVal}
   - Program Ekstrakurikuler:
${listKesiswaanEkskulText}
   - Prestasi Kesiswaan Halaman Publik:
${listKesiswaanPrestasiText}
   - Pojok Karya Siswa:
${listKesiswaanKaryaText}
`;
    }

    // RAG: 7. Dewan Guru (Dengan filtrasi pencarian spesifik nama)
    const guruKeywords = ['guru', 'staf', 'kepala sekolah', 'pengajar', 'pendidik', 'nip', 'pns', 'honorer'];
    const specificGuruMatch = teachersList.some(t => queryForRag.includes(t.name.toLowerCase()) || t.name.toLowerCase().split(' ').some(part => part.length > 2 && queryForRag.includes(part)));
    if (guruKeywords.some(kw => queryForRag.includes(kw)) || specificGuruMatch) {
      let listGuruText = "";
      const specificMatches = teachersList.filter(t => queryForRag.includes(t.name.toLowerCase()) || t.name.toLowerCase().split(' ').some(part => part.length > 2 && queryForRag.includes(part)));
      
      if (specificMatches.length > 0) {
        listGuruText = specificMatches.map(t => `- ${t.name} (${t.role || 'Tenaga Pendidik'}) - NIP: ${t.nip || 'Tidak ada'}`).join('\n');
      } else {
        listGuruText = teachersList.map(t => `- ${t.name} (${t.role || 'Tenaga Pendidik'})`).join('\n');
      }
      
      systemInstruction += `
7. Daftar Guru & Staf Aktif (Database):
${listGuruText}
`;
    }

    // RAG: 8. Prestasi Sekolah
    const prestasiKeywords = ['prestasi sekolah', 'akreditasi sekolah', 'piagam', 'penghargaan sekolah'];
    if (prestasiKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
8. Prestasi Sekolah Umum (Database):
${listPrestasiText}
`;
    }

    // RAG: 9. Unduhan
    const unduhanKeywords = ['unduh', 'download', 'berkas', 'file', 'dokumen', 'formulir pdf'];
    if (unduhanKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
9. Pusat Unduhan (Berkas yang Bisa Diunduh):
${listUnduhanText}
`;
    }

    // RAG: 10. FAQ
    const faqKeywords = ['tanya', 'jawab', 'faq', 'pertanyaan'];
    if (faqKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
10. FAQ Sekolah Umum:
${listFaqText}
`;
    }

    // RAG: 11. Berita
    const beritaKeywords = ['berita', 'kegiatan', 'warta', 'artikel', 'pengumuman', 'terbaru', 'info', 'marquee'];
    if (beritaKeywords.some(kw => queryForRag.includes(kw))) {
      systemInstruction += `
11. Berita & Pengumuman Terbaru (Database):
${listNewsText}

12. Pengumuman Berjalan (Marquee):
${listMarqueeText}
`;
    }

    // Append core boundaries
    systemInstruction += `
=== INFORMASI WAKTU SEKARANG (PENTING) ===
Hari ini adalah: ${currentDateText}
Selalu gunakan tanggal hari ini sebagai referensi untuk menentukan apakah suatu informasi atau agenda kegiatan di masa depan masih berlaku atau sudah lewat/usang/lampau. Jangan pernah menginformasikan agenda yang sudah lewat seolah-olah akan terjadi di masa depan.

=== ATURAN PPDB ONLINE & OFFLINE ===
- Pendaftaran PPDB Online dapat diakses langsung oleh wali murid melalui menu **PPDB → Formulir Online** di navigasi atas, atau menuju ke link \`/ppdb/daftar\` di website ini.
- Pendaftaran PPDB Offline dapat dilakukan dengan datang langsung ke sekolah menemui panitia PPDB pada jam kerja (Senin - Sabtu pukul 08:00 - 12:00 WIT). Formulir pendaftaran offline juga dapat diunduh di halaman Unduh berkas di website ini.
- Biaya Pendaftaran: Rp 0 (Gratis! Sama sekali tidak dipungut biaya apa pun).

=== BATASAN AI ===
- Fokuslah hanya pada informasi seputar SD Negeri Bobong, pendaftaran PPDB, kegiatan kesiswaan, prestasi, kurikulum, fasilitas, dan hal-hal umum terkait pendidikan dasar sekolah.
- Jika pengguna menanyakan hal di luar topik sekolah (politik praktis, hal-hal sensitif, teknologi tingkat lanjut yang tidak ada hubungannya, pemrograman rumit, dll.), arahkan kembali ke topik sekolah dengan sopan dan humoris/ramah. Contoh: "Wah, pertanyaan yang menarik! Tapi sebagai Aim AI, saya lebih jago menceritakan serunya belajar di SD Negeri Bobong atau info pendaftaran PPDB nih. Apakah Bapak/Ibu ingin tahu syarat pendaftaran PPDB kita?"
`;

    // 5. Kirim ke Groq dengan streaming
    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];
    const primaryModel = 'openai/gpt-oss-120b';
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: primaryModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800,
        stream: true
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error (${groqRes.status}): ${errText}`);
    }

    // Forward SSE dari Groq ke client sebagai plain text stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // simpan baris tidak lengkap di buffer
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (data === '[DONE]') { controller.close(); return; }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) controller.enqueue(encoder.encode(content));
              } catch { /* skip malformed SSE line */ }
            }
          }
        } catch (err) {
          controller.error(err);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error("⚠️ Error calling Groq API in chat route. Falling back to local responder:", error.message || error);
    try {
      const reply = generateFallbackResponse(latestMessage, fallbackData);
      return NextResponse.json({ reply });
    } catch (fallbackError) {
      console.error("❌ Fatal fallback error:", fallbackError);
      return NextResponse.json({ 
        reply: "Halo! Maaf, sistem asisten sekolah sedang mengalami kendala jaringan. Silakan hubungi panitia sekolah secara langsung di nomor WhatsApp Humas atau kunjungi halaman Hubungi Kami."
      });
    }
  }
}
