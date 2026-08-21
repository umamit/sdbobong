# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ppdb.spec.js >> SDN Bobong Public Portals E2E Tests >> should navigate to Grades portal, submit invalid NISN, and show error message
- Location: e2e/ppdb.spec.js:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]: INFO SEKOLAH
    - generic [ref=e7]:
      - generic [ref=e8]: "INFO SEKOLAH: Pantau terus informasi terbaru, kegiatan, dan pengumuman SD Negeri Bobong melalui website resmi sekolah."
      - generic [ref=e11]: "SEMANGAT BELAJAR: Raih prestasi, bangun karakter, dan jadilah generasi hebat bersama SD Negeri Bobong!"
      - generic [ref=e14]: "AYO BERSAMA: Ciptakan lingkungan sekolah yang aman, nyaman, disiplin, dan menyenangkan untuk belajar dan berkembang."
      - generic [ref=e17]: Presensi Guru dan Perangkat Ajar, bisa diakses melalui bilah navigasi Akademik
  - banner [ref=e21]:
    - generic [ref=e22]:
      - link "Logo SD Negeri Bobong SD NEGERI BOBONGPulau Taliabu" [ref=e23]:
        - /url: /
        - img "Logo SD Negeri Bobong" [ref=e24]
        - generic [ref=e25]: SD NEGERI BOBONGPulau Taliabu
      - button "Buka Menu Navigasi" [ref=e26]
      - navigation [ref=e27]:
        - list [ref=e28]:
          - listitem [ref=e29]:
            - link "Beranda" [ref=e30]:
              - /url: /
          - listitem [ref=e31]:
            - button "Profil" [ref=e32]
          - listitem [ref=e35]:
            - button "Akademik" [ref=e36]
          - listitem [ref=e39]:
            - button "PPDB" [ref=e40]
          - listitem [ref=e43]:
            - button "Informasi" [ref=e44]
          - listitem [ref=e47]:
            - button "Kontak" [ref=e48]
          - listitem [ref=e51]:
            - link "Login" [ref=e52]:
              - /url: /login
      - button "Ubah Tema Gelap/Terang" [ref=e53]
  - main [ref=e56]:
    - generic [ref=e58]:
      - heading "Portal Rapor Digital" [level=1] [ref=e59]
      - paragraph [ref=e60]: Halaman resmi untuk memeriksa hasil belajar dan rapor akademik siswa SD Negeri Bobong secara aman dan mandiri.
    - generic [ref=e62]:
      - heading "Cek Nilai Rapor Digital" [level=2] [ref=e63]
      - paragraph [ref=e64]: Masukkan Nomor Induk Siswa Nasional (NISN) dan Tanggal Lahir untuk memverifikasi dan melihat rapor belajar siswa.
      - generic [ref=e65]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]: NISN Siswa (10 digit)
            - textbox "NISN Siswa (10 digit)" [ref=e69]:
              - /placeholder: "Contoh: 0142987162"
              - text: "9999999999"
          - generic [ref=e70]:
            - generic [ref=e71]: Tanggal Lahir Siswa
            - textbox "Tanggal Lahir Siswa" [ref=e72]: 2015-12-31
        - button "Periksa Rapor" [ref=e73]
  - contentinfo [ref=e77]:
    - generic [ref=e81]:
      - generic [ref=e82]:
        - link [ref=e83]:
          - /url: /
          - img "Logo SD Negeri Bobong" [ref=e84]
          - text: SD NEGERI BOBONG
        - paragraph [ref=e85]: SD Negeri Bobong adalah sekolah dasar negeri unggulan di Ibukota Kabupaten Pulau Taliabu, Maluku Utara. Berdedikasi mencetak generasi yang berakhlak mulia, cerdas, dan berbudaya luhur.
        - generic [ref=e94]:
          - generic [ref=e95]: Total Pengunjung
          - generic [ref=e96]: ...
      - generic [ref=e97]:
        - heading "Navigasi Cepat" [level=3] [ref=e98]
        - list [ref=e99]:
          - listitem [ref=e100]:
            - link "Beranda" [ref=e101]:
              - /url: /
          - listitem [ref=e102]:
            - link "Profil Sekolah" [ref=e103]:
              - /url: /profil
          - listitem [ref=e104]:
            - link "Informasi Akademik" [ref=e105]:
              - /url: /akademik
          - listitem [ref=e106]:
            - link "Presensi Online (Kehadiran) ↗" [ref=e107]:
              - /url: https://presensi.sdnegeribobong.sch.id
          - listitem [ref=e108]:
            - link "Perangkat Ajar (Modul RPP) ↗" [ref=e109]:
              - /url: https://ajar.sdnegeribobong.sch.id
          - listitem [ref=e110]:
            - link "Portal Cek Rapor" [ref=e111]:
              - /url: /akademik/nilai
          - listitem [ref=e112]:
            - link "Kesiswaan & Ekskul" [ref=e113]:
              - /url: /kesiswaan
          - listitem [ref=e114]:
            - link "Informasi PPDB" [ref=e115]:
              - /url: /ppdb
          - listitem [ref=e116]:
            - link "Formulir PPDB Online" [ref=e117]:
              - /url: /ppdb/daftar
          - listitem [ref=e118]:
            - link "Formulir PPDB Offline" [ref=e119]:
              - /url: /ppdb/cetak
          - listitem [ref=e120]:
            - link "Berita Sekolah" [ref=e121]:
              - /url: /berita
          - listitem [ref=e122]:
            - link "Portal Alumni" [ref=e123]:
              - /url: /alumni
          - listitem [ref=e124]:
            - link "Hubungi Kami" [ref=e125]:
              - /url: /kontak
      - generic [ref=e126]:
        - heading "Kontak Sekolah" [level=3] [ref=e127]
        - generic [ref=e128]:
          - link "Jl. Mansur Sou, Desa Wayo, Kec. Taliabu Barat, Kab. Pulau Taliabu, Provinsi Maluku Utara, 97791" [ref=e129]:
            - /url: https://maps.google.com/?q=SD+Negeri+Bobong+Pulau+Taliabu
          - 'link "NPSN: 60200589 (Sekolah Kita)" [ref=e132]':
            - /url: https://sekolah.data.kemendikdasmen.go.id/profil-sekolah/20537440-2AF5-E011-B59C-D593D31F215F
          - link "admin@sdnegeribobong.sch.id" [ref=e136]:
            - /url: mailto:admin@sdnegeribobong.sch.id
    - generic [ref=e140]:
      - text: "Naungan & Program Resmi:"
      - generic [ref=e142]:
        - generic [ref=e143]:
          - link [ref=e144]:
            - /url: https://taliabukab.go.id
            - img "Logo Pemda Taliabu" [ref=e145]
            - text: Pemerintah Kabupaten Pulau Taliabu
          - generic "Dinas Pendidikan Kabupaten Pulau Taliabu" [ref=e146]:
            - img "Logo Dinas Pendidikan" [ref=e147]
            - text: Dinas Pendidikan Taliabu
          - link [ref=e148]:
            - /url: https://kemendikdasmen.go.id
            - img "Pendidikan Bermutu Untuk Semua" [ref=e149]
            - text: Pendidikan Bermutu Untuk Semua
          - link [ref=e150]:
            - /url: https://kemendikdasmen.go.id
            - img "Kemendikdasmen Ramah" [ref=e151]
            - text: Kemendikdasmen Ramah
          - link [ref=e152]:
            - /url: https://kemendikdasmen.go.id
            - img "Rumah Pendidikan" [ref=e153]
            - text: Rumah Pendidikan
          - generic "Kurikulum Merdeka - Merdeka Belajar" [ref=e154]:
            - img "Logo Kurikulum Merdeka" [ref=e155]
            - text: Kurikulum Merdeka
        - generic [ref=e156]:
          - link [ref=e157]:
            - /url: https://taliabukab.go.id
            - img "Logo Pemda Taliabu" [ref=e158]
            - text: Pemerintah Kabupaten Pulau Taliabu
          - generic "Dinas Pendidikan Kabupaten Pulau Taliabu" [ref=e159]:
            - img "Logo Dinas Pendidikan" [ref=e160]
            - text: Dinas Pendidikan Taliabu
          - link [ref=e161]:
            - /url: https://kemendikdasmen.go.id
            - img "Pendidikan Bermutu Untuk Semua" [ref=e162]
            - text: Pendidikan Bermutu Untuk Semua
          - link [ref=e163]:
            - /url: https://kemendikdasmen.go.id
            - img "Kemendikdasmen Ramah" [ref=e164]
            - text: Kemendikdasmen Ramah
          - link [ref=e165]:
            - /url: https://kemendikdasmen.go.id
            - img "Rumah Pendidikan" [ref=e166]
            - text: Rumah Pendidikan
          - generic "Kurikulum Merdeka - Merdeka Belajar" [ref=e167]:
            - img "Logo Kurikulum Merdeka" [ref=e168]
            - text: Kurikulum Merdeka
    - generic [ref=e170]:
      - link "Developed by Ibra Digital Engineering" [ref=e172]:
        - /url: https://ibradigital.id
      - paragraph [ref=e173]:
        - text: © 2026 SD Negeri Bobong. Hak Cipta Dilindungi Undang-Undang. |
        - link "Login" [ref=e174]:
          - /url: /login
        - text: • v3.8.6
  - generic [ref=e175]:
    - button "Tanya Asisten Aim AI" [ref=e176]
    - generic [ref=e179]:
      - generic [ref=e180]:
        - generic [ref=e181]:
          - img "Logo Aim AI" [ref=e183]
          - generic [ref=e184]:
            - heading "Aim AI" [level=4] [ref=e185]
            - text: Asisten Virtual Sekolah
        - generic [ref=e186]:
          - button "Aktifkan Pengisi Suara Otomatis" [ref=e187] [cursor=pointer]
          - button "Tutup Chat" [ref=e192]
      - generic [ref=e196]:
        - img "Avatar AI" [ref=e197]
        - generic [ref=e198]:
          - paragraph [ref=e199]:
            - text: Halo! Saya
            - strong [ref=e200]: Aim AI
            - text: ", Asisten Virtual resmi SD Negeri Bobong."
          - paragraph [ref=e201]
          - paragraph [ref=e202]: Ada yang bisa saya bantu hari ini mengenai pendaftaran siswa baru (PPDB), profil sekolah, alamat, atau informasi guru dan prestasi kami?
      - generic [ref=e203]:
        - button "Cara Daftar PPDB?" [ref=e204]
        - button "Kontak Panitia?" [ref=e205]
        - button "Alamat Sekolah?" [ref=e206]
        - button "Biaya Pendaftaran?" [ref=e207]
        - button "Jadwal Sekolah?" [ref=e208]
        - button "Prestasi Siswa?" [ref=e209]
        - button "Ekstrakurikuler?" [ref=e210]
        - button "Profil Sekolah?" [ref=e211]
      - generic [ref=e212]:
        - button "Input Lewat Suara" [ref=e213]
        - textbox "Tulis pertanyaan Anda..." [ref=e217]
        - button "Kirim Pesan" [disabled] [ref=e218]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('SDN Bobong Public Portals E2E Tests', () => {
  4  | 
  5  |   test('should navigate to Grades portal, submit invalid NISN, and show error message', async ({ page }) => {
  6  |     // Go to Grades lookup page
  7  |     await page.goto('/nilai');
  8  | 
  9  |     // Verify page header title is rendered
  10 |     await expect(page.locator('h1')).toContainText('Portal Rapor Digital');
  11 | 
  12 |     // Fill in invalid NISN and birthdate
  13 |     await page.fill('#nisn', '9999999999');
  14 |     await page.fill('#birthDate', '2015-12-31');
  15 | 
  16 |     // Wait for API response then expect error message to appear
  17 |     await Promise.all([
> 18 |       page.waitForResponse(resp => resp.url().includes('/api/students/grades') && resp.status() === 404),
     |            ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  19 |       page.click('button[type="submit"]'),
  20 |     ]);
  21 | 
  22 |     // Expect an error alert to be rendered due to invalid data
  23 |     const errorAlert = page.locator('text=tidak ditemukan');
  24 |     await expect(errorAlert).toBeVisible();
  25 |   });
  26 | 
  27 |   test('should navigate to PPDB info page and check active accordion sections', async ({ page }) => {
  28 |     // Go to PPDB Info portal page
  29 |     await page.goto('/ppdb');
  30 | 
  31 |     // Check main banner
  32 |     await expect(page.locator('h1')).toBeVisible();
  33 | 
  34 |     // Verify FAQ accordion click triggers expansion
  35 |     const firstFaqButton = page.locator('button:has-text("Bagaimana jika")').first();
  36 |     if (await firstFaqButton.count() > 0) {
  37 |       await firstFaqButton.click();
  38 |       
  39 |       // Ensure the corresponding answer text becomes visible
  40 |       await expect(page.locator('text=Calon siswa yang berusia kurang')).toBeVisible();
  41 |     }
  42 |   });
  43 | 
  44 | });
  45 | 
```