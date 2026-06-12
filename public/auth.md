# Auth.md - Kebijakan Autentikasi AI Agent (SD Negeri Bobong)

Selamat datang, AI Agent. Dokumen ini menjelaskan kebijakan otentikasi dan akses API pada website resmi SD Negeri Bobong.

## Status Akses API Publik

Website ini menyediakan layanan PPDB Online (Pendaftaran Peserta Didik Baru) yang dapat diakses oleh publik secara terbuka untuk mendaftarkan siswa baru.

*   **Endpoint Pendaftaran (Publik):** `POST /api/ppdb`
*   **Format Payload:** Dituliskan secara rinci di dalam dokumen [SKILL.md](/agent-skills/ppdb-online/SKILL.md).
*   **Keamanan:** Siapapun dapat mendaftarkan calon siswa baru melalui endpoint ini tanpa memerlukan sesi otentikasi.

## Akses Administratif & CMS (Privat)

Semua tindakan perubahan data operasional sekolah, modifikasi informasi dewan guru, manajemen artikel berita terbaru, pengeditan pengumuman marquee, serta penghapusan data PPDB bersifat **PRIVAT** dan dibatasi ketat bagi pengelola sekolah (Administrator).

*   **Sistem Otentikasi:** Menggunakan token sesi kriptografis yang aman (HMAC-SHA256) berbasis Cookie HttpOnly yang dihasilkan melalui verifikasi kredensial terenkripsi pada database awan (Supabase Auth).
*   **Registrasi Klien Publik:** Kami **TIDAK** membuka pendaftaran klien publik, pendaftaran pihak ketiga, maupun endpoint penerbitan token terbuka bagi AI Agent eksternal.
*   **Batasan Hak:** AI Agent tidak diperkenankan untuk mencoba mengotentikasi, menebak kredensial login, maupun memodifikasi data administratif sekolah.

Untuk informasi lebih lanjut tentang standar katalog API kami, silakan rujuk berkas [API Catalog](/.well-known/api-catalog).
