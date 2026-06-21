# Aturan Optimasi & Keamanan (Security-First Performance Optimization)

Mulai dari sekarang, lakukan optimasi performa pada proyek Next.js App Router ini dengan prinsip Security-First. Setiap perubahan kode untuk mempercepat situs (seperti perbaikan TTFB, LCP, atau TBT) wajib mempertahankan dan mematuhi aturan keamanan berikut:

1. **Jangan pernah mengubah variabel lingkungan sensitif menjadi `NEXT_PUBLIC_`** demi kemudahan akses klien.
2. **Optimasi file `middleware.js` tidak boleh melonggarkan** proteksi rute autentikasi atau bypass URL.
3. **Penggunaan caching atau CDN header tidak boleh membocorkan data pribadi user** (ikuti aturan cache-control privat).
4. **Setiap penghentian blocking script tidak boleh menonaktifkan kebijakan Content Security Policy (CSP)** yang ketat.
5. **Jalankan pemindaian celah keamanan internal (regresi siber) otomatis** setiap kali Anda selesai memperbarui kode untuk memastikan tidak ada celah keamanan baru yang tercipta.

# Aturan Cetak & Ekspor PDF (Print & PDF Export Safety Rules)

Setiap kali melakukan pembaruan kode, pembuatan halaman cetak baru, atau optimalisasi UI, patuhi aturan berikut untuk menjamin fungsionalitas cetak/PDF tidak rusak:

1. **Bypass Aturan Anti-Copy (`user-select: none`) untuk Halaman Cetak**:
   Halaman yang didesain untuk dicetak atau disimpan sebagai PDF (seperti `/formulir-ppdb`, `/nilai`, bukti pendaftaran) wajib memiliki gaya `user-select: text !important` secara global pada tingkat *screen* & *print*, dan tidak boleh terpengaruh oleh skrip proteksi anti-copy.
2. **Hindari `display: block !important` pada Kontainer Layout Cetak**:
   Dalam gaya `@media print`, hindari memaksa tipe tampilan (`display: block !important`) pada tag generik seperti `div` atau `span` yang menjadi bagian dari tata letak Flexbox/Grid (seperti KOP surat, baris formulir, dan kolom tanda tangan) agar struktur halaman tidak bertumpuk ke bawah secara berantakan.
3. **Batasi Tinggi Halaman dan Overflow**:
   Hindari menyetel `overflow: hidden !important` pada `html` atau `body` selama pencetakan untuk mencegah dokumen terpotong atau halaman cetak/PDF menjadi kosong (*blank page*).
4. **Verifikasi Batasan Halaman**:
   Pastikan formulir cetak satu lembar tetap pas dalam batasan kertas A4 dengan menjaga jarak margin cetak (`@page { margin: 10mm 15mm; }`) dan padding vertikal yang minimal.

