---
name: ppdb-online
description: Mendaftarkan calon siswa baru (PPDB) secara online ke SD Negeri Bobong.
---

# PPDB Online SDN Bobong

Skill ini memungkinkan agen AI untuk mendaftarkan calon siswa baru secara otomatis ke SD Negeri Bobong menggunakan API publik yang tersedia.

## Alur Pendaftaran (How-To)

Untuk mendaftarkan siswa baru, kirimkan permintaan HTTP POST ke `/api/ppdb` dengan format payload JSON berikut:

### Endpoint
`POST https://sdnegeribobong.sch.id/api/ppdb`

### Format Payload (JSON)
| Nama Kolom | Tipe Data | Deskripsi | Contoh |
| :--- | :--- | :--- | :--- |
| `nama_lengkap` | string | Nama lengkap calon siswa | "Andi Pratama" |
| `nik` | string (16 digit) | Nomor Induk Kependudukan (NIK) siswa | "1234567890123456" |
| `tempat_lahir` | string | Tempat lahir siswa | "Bobong" |
| `tanggal_lahir` | string (YYYY-MM-DD) | Tanggal lahir siswa | "2019-05-12" |
| `jenis_kelamin` | string | Jenis kelamin ("Laki-laki" atau "Perempuan") | "Laki-laki" |
| `nama_ibu` | string | Nama lengkap ibu kandung | "Siti Aminah" |
| `no_hp` | string | Nomor HP/WhatsApp orang tua yang aktif | "08123456789" |
| `alamat` | string | Alamat domisili lengkap | "RT 02, Desa Bobong, Taliabu Barat" |
| `jalur_ppdb` | string | Jalur pendaftaran ("Zonasi", "Afirmasi", "Perpindahan Orang Tua", "Prestasi") | "Zonasi" |

### Contoh Payload
```json
{
  "nama_lengkap": "Andi Pratama",
  "nik": "1234567890123456",
  "tempat_lahir": "Bobong",
  "tanggal_lahir": "2019-05-12",
  "jenis_kelamin": "Laki-laki",
  "nama_ibu": "Siti Aminah",
  "no_hp": "081234567890",
  "alamat": "RT 02, Desa Bobong, Taliabu Barat",
  "jalur_ppdb": "Zonasi"
}
```

### Respon Sukses (HTTP 200 OK)
```json
{
  "success": true
}
```

### Respon Error (HTTP 400 atau 500)
```json
{
  "error": "NIK harus terdiri dari 16 digit angka!"
}
```
