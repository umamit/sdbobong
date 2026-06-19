# Aturan Optimasi & Keamanan (Security-First Performance Optimization)

Mulai dari sekarang, lakukan optimasi performa pada proyek Next.js App Router ini dengan prinsip Security-First. Setiap perubahan kode untuk mempercepat situs (seperti perbaikan TTFB, LCP, atau TBT) wajib mempertahankan dan mematuhi aturan keamanan berikut:

1. **Jangan pernah mengubah variabel lingkungan sensitif menjadi `NEXT_PUBLIC_`** demi kemudahan akses klien.
2. **Optimasi file `middleware.js` tidak boleh melonggarkan** proteksi rute autentikasi atau bypass URL.
3. **Penggunaan caching atau CDN header tidak boleh membocorkan data pribadi user** (ikuti aturan cache-control privat).
4. **Setiap penghentian blocking script tidak boleh menonaktifkan kebijakan Content Security Policy (CSP)** yang ketat.
5. **Jalankan pemindaian celah keamanan internal (regresi siber) otomatis** setiap kali Anda selesai memperbarui kode untuk memastikan tidak ada celah keamanan baru yang tercipta.
