export const FALLBACK_QUIZ = {
  umum: [
    { q: "Apa nama ibukota Kabupaten Pulau Taliabu?", o: ["Bobong", "Lede", "Gela", "Tabona"], a: 0, hint: "Ibukota Pulau Taliabu terletak di wilayah kecamatan Taliabu Barat." },
    { q: "Berapa jumlah warna pada bendera negara Indonesia?", o: ["1 warna", "2 warna", "3 warna", "4 warna"], a: 1, hint: "Bendera kita adalah Merah Putih — dua warna." },
    { q: "Hewan apa yang menjadi lambang negara Indonesia?", o: ["Singa", "Harimau", "Burung Garuda", "Gajah"], a: 2, hint: "Lambang negara Garuda Pancasila memuat perisai lima sila." }
  ],
  matematika: [
    { q: "Berapakah hasil dari 7 ditambah 8?", o: ["13", "14", "15", "16"], a: 2, hint: "Hitung maju setelah angka 8 sebanyak 7 langkah." },
    { q: "Jika ada 3 kotak pensil, tiap kotak berisi 5 pensil, berapa total pensilnya?", o: ["8", "12", "15", "20"], a: 2, hint: "Gunakan perkalian: 3 × 5 = 15." },
    { q: "Berapakah hasil dari 20 dikurangi 12?", o: ["6", "7", "8", "9"], a: 2, hint: "Kurangi 20 dengan 10 dulu, lalu kurangi lagi 2." }
  ],
  ipa: [
    { q: "Apa fungsi utama akar pada tumbuhan?", o: ["Membuat makanan", "Menyerap air dan mineral", "Menghasilkan oksigen", "Menyimpan biji"], a: 1, hint: "Akar menyerap air dan unsur hara dari tanah untuk kebutuhan tumbuhan." },
    { q: "Planet manakah yang paling dekat dengan Matahari?", o: ["Venus", "Bumi", "Merkurius", "Mars"], a: 2, hint: "Merkurius adalah planet pertama (terdekat) dari Matahari dalam tata surya kita." },
    { q: "Apa yang terjadi pada air saat dipanaskan hingga 100°C?", o: ["Membeku", "Menguap", "Mengembun", "Menyusut"], a: 1, hint: "Air berubah wujud dari cair menjadi gas (uap) pada suhu 100°C — disebut menguap." }
  ],
  bahasa: [
    { q: "Kata yang menyebut nama orang, tempat, atau benda disebut...", o: ["Kata kerja", "Kata sifat", "Kata benda", "Kata keterangan"], a: 2, hint: "Kata benda (nomina) adalah kata yang menyebut nama orang, tempat, atau benda." },
    { q: "Manakah penulisan kalimat yang benar?", o: ["aku pergi ke sekolah?", "Aku pergi ke sekolah.", "aku Pergi ke Sekolah.", "aku pergi ke sekolah"], a: 1, hint: "Kalimat berita diakhiri tanda titik dan huruf pertama ditulis kapital." },
    { q: "Apa antonim (lawan kata) dari kata 'rajin'?", o: ["Cerdas", "Malas", "Sigap", "Aktif"], a: 1, hint: "'Rajin' dan 'malas' adalah kata yang memiliki makna berlawanan (antonim)." }
  ],
  literasi: [
    { q: "Mana yang termasuk FAKTA dalam sebuah berita?", o: ["Film ini pasti akan sangat laris.", "Banjir merendam 500 rumah di Kota X pada Senin lalu.", "Menurut saya cuacanya sangat panas.", "Pertandingan itu pasti seru sekali."], a: 1, hint: "Fakta adalah pernyataan yang dapat dibuktikan kebenarannya, seperti data dan kejadian nyata — berbeda dari opini/pendapat." },
    { q: "Pesan berantai WhatsApp berisi klaim 'Minum air garam menyembuhkan semua penyakit' tanpa sumber jelas disebut...", o: ["Berita faktual", "Hoaks (informasi palsu)", "Literasi digital", "Iklan resmi"], a: 1, hint: "Hoaks adalah informasi palsu yang disebarkan tanpa sumber terpercaya. Selalu cek fakta dari sumber resmi sebelum membagikan." },
    { q: "Saat membaca teks, informasi yang TIDAK langsung tertulis namun dapat disimpulkan pembaca disebut...", o: ["Informasi tersurat", "Ide pokok", "Informasi tersirat", "Fakta utama"], a: 2, hint: "Informasi tersirat adalah makna tersembunyi yang harus disimpulkan sendiri oleh pembaca dari konteks teks." }
  ],
  numerasi: [
    { q: "Sebuah baju seharga Rp80.000 mendapat diskon 25%. Berapa harga setelah diskon?", o: ["Rp20.000", "Rp55.000", "Rp60.000", "Rp65.000"], a: 2, hint: "Diskon 25% dari Rp80.000 = Rp20.000. Harga setelah diskon: Rp80.000 − Rp20.000 = Rp60.000." },
    { q: "Keliling persegi panjang dengan panjang 10 cm dan lebar 6 cm adalah...", o: ["60 cm", "32 cm", "16 cm", "30 cm"], a: 1, hint: "Keliling = 2 × (panjang + lebar) = 2 × (10 + 6) = 32 cm." },
    { q: "Data nilai ulangan: 70, 80, 90, 80, 60. Berapakah nilai rata-rata (mean)?", o: ["75", "76", "80", "82"], a: 1, hint: "Mean = jumlah semua nilai ÷ banyak data = (70+80+90+80+60) ÷ 5 = 380 ÷ 5 = 76." }
  ],
  karakter: [
    { q: "Mana yang termasuk dalam 'Tujuh Kebiasaan Anak Indonesia Hebat'?", o: ["Bangun siang dan main gadget sepuasnya", "Bangun pagi, beribadah, makan sehat bergizi, dan berolahraga", "Belajar hanya saat mau ujian saja", "Tidur larut malam agar punya banyak waktu belajar"], a: 1, hint: "Tujuh kebiasaan: bangun pagi, beribadah, makan sehat bergizi, berolahraga, gemar belajar, bermasyarakat, dan tidur cepat." },
    { q: "Temanmu diejek dan dipermalukan oleh siswa lain di sekolah. Sikap yang benar adalah...", o: ["Ikut menertawakan agar tidak dikucilkan", "Pura-pura tidak melihat", "Membela korban dan melaporkan ke guru", "Mengajak teman lain untuk menjauh dari korban"], a: 2, hint: "Anti-perundungan (anti-bullying) adalah bagian dari Budaya Sekolah Aman dan Nyaman. Membela dan melapor ke guru adalah sikap yang tepat." },
    { q: "Saat ulangan, kamu tidak tahu jawaban. Sikap yang mencerminkan nilai KEJUJURAN adalah...", o: ["Mencontek catatan tersembunyi", "Bertanya pelan ke teman sebangku", "Mengerjakan semampunya dengan jujur", "Menyalin jawaban teman dengan cepat"], a: 2, hint: "Kejujuran (anti-contek) adalah karakter utama pelajar. Nilai yang didapat dengan jujur jauh lebih berharga meski tidak sempurna." }
  ]
};
