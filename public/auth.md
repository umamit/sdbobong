# Auth.md - Kebijakan Autentikasi AI Agent (SD Negeri Bobong)

Selamat datang, AI Agent. Dokumen ini menjelaskan kebijakan otentikasi dan akses API pada website resmi SD Negeri Bobong.

## 1. Discover
Untuk menemukan informasi dan spesifikasi otentikasi sistem kami:
- **Discovery Path:** `/.well-known/oauth-protected-resource`
- **Authorization Server:** `https://www.sdnegeribobong.sch.id`
- **Metadata OIDC:** `/.well-known/openid-configuration`
- **Katalog API:** `/.well-known/api-catalog`

## 2. Register
Layanan pendaftaran siswa baru (PPDB Online) terbuka untuk umum tanpa memerlukan pendaftaran kunci API (Client Registration). AI Agent dapat langsung mengakses endpoint registrasi publik:
- **Endpoint Registrasi Publik:** `POST /api/ppdb`
- **Panduan Payload:** [SKILL.md](/agent-skills/ppdb-online/SKILL.md)

Untuk akses panel administratif (`/admin` atau `/guru`), kami tidak membuka registrasi klien publik (Dynamic Client Registration dinonaktifkan).

## 3. Claim
Sesi otentikasi klaim untuk administrator dilakukan secara terenkripsi melalui panel login internal.
- **Endpoint:** `POST /api/auth`
- **Prosedur:** Verifikasi berbasis kredensial aman di database internal (Supabase Auth).

## 4. Exchange
Pertukaran kode token sesi menggunakan HTTP Cookie aman (HttpOnly, Secure, SameSite=Lax).
- **Prosedur:** Sistem menerbitkan token sesi `admin_session_token` atau `teacher_session_token` setelah proses otentikasi berhasil.

## 5. Revocation
Pencabutan atau penutupan sesi otentikasi (Logout):
- **Endpoint:** `POST /api/auth?logout=true` atau penghapusan cookies sesi secara otomatis.

