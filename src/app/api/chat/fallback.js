/**
 * Mekanisme Fallback Anggun jika GROQ_API_KEY belum dipasang.
 * Memberikan respons cerdas secara lokal tanpa memanggil API Groq.
 */
export function generateFallbackResponse(query, schoolData) {
  const q = query.toLowerCase();

  const welcomeMessage = `✨ Halo! Saya **Aim AI**, Asisten Virtual resmi SD Negeri Bobong. 🏫
[Hari ini: ${schoolData.currentDate || '-'}]

Saat ini saya sedang berjalan dalam **Mode Demo / Pemeliharaan Sistem** oleh Administrator sekolah. Meskipun fitur kecerdasan penuh saya sedang dipersiapkan, saya tetap dapat membantu Anda menjawab beberapa informasi dasar mengenai sekolah secara otomatis! 👇`;

  const ppdb = schoolData.ppdb || {};
  const akademik = schoolData.akademik || {};
  const kesiswaan = schoolData.kesiswaan || {};
  const profil = schoolData.profil || {};
  const stats = schoolData.stats || {};

  const syaratUsia = ppdb.syarat_usia || "Calon peserta didik baru harus berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2026. Anak berusia 7 tahun akan diprioritaskan dalam penerimaan kuota utama.";
  
  const syaratBerkas = ppdb.syarat_berkas || [
    "Scan Akta Kelahiran asli *",
    "Scan Kartu Keluarga (KK) asli *",
    "Scan Ijazah TK / PAUD (Opsional)"
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
* **Pendaftaran Online:** Anda bisa langsung mengklik menu **"PPDB"** di navigasi atas dan pilih **Formulir Online**, atau kunjungi halaman \`/ppdb/daftar\`.
* **Pendaftaran Offline:** Datang langsung ke sekolah menemui panitia PPDB pada hari kerja (Senin-Sabtu pukul 08.00-12.00 WIT).
* **Pendaftaran Offline:** Formulir pendaftaran offline juga dapat diunduh di halaman Unduh berkas di website ini.

📝 **Berkas yang Diperlukan:**
${berkasText}${jadwalText}${alurText}

Ada yang ingin Anda tanyakan lagi mengenai PPDB sekolah kami? 😊`;
  }

  if (q.includes("kontak") || q.includes("telepon") || q.includes("whatsapp") || q.includes("wa") || q.includes("hubungi") || q.includes("nomor") || q.includes("humas") || q.includes("operator") || q.includes("panitia")) {
    const humasContactText = schoolData.waHumas && schoolData.waHumas !== "Belum ditentukan"
      ? `(WA: +${schoolData.waHumas})`
      : "";
    const operatorContactText = schoolData.waOperator && schoolData.waOperator !== "Belum ditentukan"
      ? `(WA: +${schoolData.waOperator})`
      : "";

    return `${welcomeMessage}
    
📞 **Kontak Resmi Panitia PPDB & Sekolah:**
* **Humas Sekolah:** ${schoolData.namaHumas} ${humasContactText}
* **Operator Sekolah:** ${schoolData.namaOperator} ${operatorContactText}
* **Email Resmi:** ${schoolData.emailSekolah}`;
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

  if (q.includes("berita") || q.includes("pengumuman") || q.includes("artikel") || q.includes("terbaru") || q.includes("kabar") || q.includes("info terkini") || q.includes("pesona")) {
    const newsList = schoolData.news || [];
    if (newsList && newsList.length > 0) {
      const sortedNews = [...newsList].sort((a, b) => {
        const valA = parseInt(a.id?.replace('news-', '') || 0, 10);
        const valB = parseInt(b.id?.replace('news-', '') || 0, 10);
        return valB - valA;
      });
      
      const newsText = sortedNews.slice(0, 3).map((n) => {
        const cleanContent = (n.content || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return `📰 **${n.title}** (${n.date || 'Terbaru'})\n${cleanContent.substring(0, 150)}...\n[Baca selengkapnya di menu Berita]`;
      }).join('\n\n');

      return `${welcomeMessage}
      
📢 **Berita & Pengumuman Terbaru Sekolah:**
${newsText}

Apakah ada informasi lain yang ingin Anda ketahui? 😊`;
    } else {
      return `${welcomeMessage}
      
📢 **Berita & Pengumuman Sekolah:**
Belum ada berita kegiatan terbaru yang diunggah saat ini. Silakan kunjungi menu **Berita** di atas untuk melihat warta terdahulu. 😊`;
    }
  }

  if (q.includes("kbm") || q.includes("jam") || q.includes("shift") || q.includes("sift") || q.includes("masuk") || q.includes("pulang") || q.includes("jadwal belajar") || q.includes("sekolah jam")) {
    return `${welcomeMessage}
    
📖 **Jadwal Kegiatan Belajar Mengajar (KBM) - Double Shift:**
Karena jumlah ruang kelas terbatas, SD Negeri Bobong membagi jadwal sekolah menjadi dua shift belajar:

🌅 **Shift Pagi (Kelas I, II, & III):**
* **Senin - Kamis:** Masuk pagi, pulang pukul 12.45 WIT.
* **Jumat:** Pulang pukul 11.00 WIT.
* **Sabtu:** Pulang pukul 12.45 WIT.

☀️ **Shift Siang (Kelas IV, V, & VI):**
* **Senin - Kamis:** Masuk siang pukul 12.45 WIT, pulang pukul 16.15 WIT.
* **Jumat & Sabtu:** **TIDAK ADA Shift Siang.** Semua siswa (termasuk Kelas IV, V, & VI) masuk pagi bersama. Hari Jumat pulang pukul 11.00 WIT dan hari Sabtu pulang pukul 12.45 WIT.

Ada yang ingin Anda tanyakan lagi mengenai jadwal KBM di sekolah? 😊`;
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
9. 📖 **Jadwal KBM & Shift Belajar** (ketik: *kbm*, *shift*, *masuk*, *pulang*)
10. 💰 **Biaya Pendaftaran** (ketik: *biaya*, *bayar*)
11. 📰 **Berita & Pengumuman Terbaru** (ketik: *berita*, *pengumuman*, *kabar*)

Silakan ketik pertanyaan Anda atau klik tombol saran pertanyaan di bawah ini untuk memulai! 😊`;
}
