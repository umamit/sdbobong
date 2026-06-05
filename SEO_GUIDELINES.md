# Panduan Pengelolaan SEO: Robots.txt & Sitemap.xml
SD Negeri Bobong (sdnegeribobong.sch.id)

Dokumen ini berfungsi sebagai panduan standar (SOP) bagi tim pengembang (developer) dan administrator website dalam mengelola struktur pencarian SEO jika terjadi penambahan halaman atau perubahan struktur website di masa mendatang.

---

## 📋 Aturan Emas Pengembangan Rute Baru

Setiap kali Anda membuat atau menambahkan rute halaman baru di website SD Negeri Bobong, Anda wajib memisahkan rute tersebut menjadi dua kategori: **Halaman Publik** atau **Halaman Sensitif/Internal**.

### 1. Jika Menambahkan Halaman Publik Baru
> **Contoh**: `/kontak`, `/fasilitas`, `/prestasi`, `/galeri-baru`, atau `/pengumuman`
*   **Langkah 1: Daftarkan di Sitemap**
    Buka berkas `src/app/sitemap.js` dan tambahkan rute baru Anda ke dalam array `routes`.
    ```javascript
    const routes = [
      '',
      '/profil',
      '/akademik',
      '/kesiswaan',
      '/ppdb',
      '/berita',
      '/ppdb-online',
      '/formulir-ppdb',
      '/fasilitas' // <-- Contoh penambahan rute baru
    ]
    ```
*   **Langkah 2: Verifikasi Robots.txt**
    Secara default, `public/robots.txt` mengizinkan perayapan semua rute publik (`Allow: /`). Selama halaman baru tidak berada di bawah folder `/admin` atau `/api`, halaman tersebut akan otomatis diizinkan.

---

### 2. Jika Menambahkan Halaman Sensitif / Internal Baru
> **Contoh**: `/admin/keuangan`, `/admin/rekap-ppdb`, atau `/api/export-excel`
*   **Langkah 1: JANGAN Masukkan ke Sitemap**
    Pastikan rute internal tersebut **TIDAK PERNAH** dimasukkan ke dalam `src/app/sitemap.js`.
*   **Langkah 2: Daftarkan Pemblokiran di Robots.txt**
    Buka berkas `public/robots.txt` dan tambahkan aturan pemblokiran (`Disallow`) di bawah blok `User-agent: *`.
    ```text
    User-agent: *
    Allow: /
    Disallow: /admin
    Disallow: /admin/*
    Disallow: /api
    Disallow: /api/*
    Disallow: /ppdb-online/sukses
    Disallow: /admin/keuangan   # <-- Contoh penambahan pemblokiran rute baru
    ```

---

## 🛠️ Langkah Pengujian dan Penyebaran (Deployment)

Setelah melakukan perubahan pada `sitemap.js` atau `robots.txt`, lakukan langkah-langkah verifikasi berikut untuk memastikan website tidak mengalami kegagalan sistem (*break*):

1.  **Validasi Kompilasi Lokal**
    Jalankan perintah build lokal untuk mengonfirmasi bahwa Next.js berhasil merender sitemap dinamis:
    ```bash
    npm run build
    ```
    *(Pastikan proses selesai dengan pesan `Compiled successfully` tanpa ada pesan error).*

2.  **Commit dan Push ke GitHub**
    Simpan pekerjaan Anda dan kirimkan ke repositori GitHub utama agar otomatis ter-deploy ke Vercel:
    ```bash
    git add src/app/sitemap.js public/robots.txt
    git commit -m "feat: tambahkan rute [nama-rute] ke sitemap dan sesuaikan robots.txt"
    git push origin main
    ```

3.  **Verifikasi Live di Browser**
    Setelah Vercel selesai melakukan build ulang, buka tautan berikut di browser Anda untuk memastikan data telah diperbarui dengan benar:
    *   🌐 [robots.txt](https://sdnegeribobong.sch.id/robots.txt)
    *   🌐 [sitemap.xml](https://sdnegeribobong.sch.id/sitemap.xml)
