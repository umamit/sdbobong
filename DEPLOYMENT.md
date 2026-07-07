# 🚀 Panduan Deploy SD Negeri Bobong ke Vercel

Panduan ini memastikan semua environment variables dan konfigurasi terpasang dengan benar sebelum deploy ke production.

---

## 1. Prerequisites

- Akun Vercel (vercel.com)
- Repository sudah di-push ke GitHub
- Project Supabase sudah aktif
- Akun Groq (groq.com) untuk Aim AI

---

## 2. Environment Variables Wajib

Buka **Vercel Dashboard → Project → Settings → Environment Variables**, lalu tambahkan semua variabel berikut:

### Supabase (Database & Auth)

| Variable | Contoh Nilai | Keterangan |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | Anon/Public key |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1Ni...` | **Service Role Key** — jangan prefix NEXT_PUBLIC! |

CAUTION: `SUPABASE_KEY` (service role key) TIDAK BOLEH menggunakan prefix `NEXT_PUBLIC_`.

### Prisma ORM (PostgreSQL via Supabase)

| Variable | Contoh Nilai | Keterangan |
|----------|-------------|-----------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:6543/postgres?pgbouncer=true` | Untuk Prisma query (via PgBouncer) |
| `DIRECT_URL` | `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres` | Untuk migrasi schema (langsung) |

Kedua variabel ini WAJIB ada. Tanpa DATABASE_URL, semua query Prisma akan error di production.

Cara mendapatkan nilai ini:
1. Buka Supabase Dashboard -> Project Settings -> Database
2. Pilih tab Connection String
3. Pilih mode Transaction -> copy untuk DATABASE_URL
4. Pilih mode Session -> copy untuk DIRECT_URL

### Groq AI (Chatbot Aim AI)

| Variable | Contoh Nilai | Keterangan |
|----------|-------------|-----------|
| `GROQ_API_KEY` | `gsk_xxxxxxxxxxxx` | API key dari console.groq.com |

---

## 3. Checklist Pre-Deploy

- [ ] Semua 6 environment variables sudah diisi di Vercel
- [ ] `npm run build` berhasil di lokal tanpa error
- [ ] Prisma schema sudah disinkronisasi: `npx prisma db push`
- [ ] File sensitif tidak ada di .gitignore yang terlewat
- [ ] `vercel.json` sudah ada

---

## 4. Konfigurasi vercel.json (Sudah Ada)

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "framework": "nextjs"
}
```

---

## 5. Perintah Deploy

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod
```

Atau cukup push ke branch `main` — Vercel akan auto-deploy jika sudah terhubung ke GitHub.

---

## 6. Post-Deploy: Verifikasi

Setelah deploy berhasil, cek endpoint berikut:

```bash
# Cek header keamanan
curl -I https://www.sdnegeribobong.sch.id

# Cek halaman publik
curl https://www.sdnegeribobong.sch.id/api/news | jq '.length'

# Cek auth (harus return 401)
curl https://www.sdnegeribobong.sch.id/api/teachers
```

---

## 7. Troubleshooting Umum

| Error | Penyebab | Solusi |
|-------|---------|--------|
| `PrismaClientInitializationError` | `DATABASE_URL` kosong | Tambahkan env var di Vercel |
| `Invalid API key` (Supabase) | `SUPABASE_KEY` salah | Gunakan service_role key, bukan anon key |
| `AuthApiError: Invalid login` | Supabase auth URL salah | Pastikan `NEXT_PUBLIC_SUPABASE_URL` benar |
| Gambar tidak tampil | Supabase storage bucket private | Set bucket ke public di Supabase Dashboard |
| Chatbot tidak respons | `GROQ_API_KEY` kosong/expired | Regenerate key di console.groq.com |

---

## 8. Prisma: Migrasi Schema di Production

Jika ada perubahan schema Prisma setelah deploy:

```bash
# Dari lokal (dengan DIRECT_URL yang benar)
npx prisma db push

# Atau generate ulang client
npx prisma generate
```

Note: Vercel tidak menjalankan `prisma migrate` otomatis. Selalu jalankan dari lokal sebelum deploy jika ada perubahan schema.
