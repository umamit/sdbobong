import { NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { verifyAdminToken, verifyTeacherToken } from './lib/auth';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Clone request headers to inject pathname for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', path);

  // 1. Markdown Content Negotiation (Accept: text/markdown) for Agents
  const acceptHeader = request.headers.get('accept') || '';
  const isMarkdownRequest = acceptHeader.includes('text/markdown');

  if (isMarkdownRequest) {
    let markdownContent = '';
    const cleanPath = path.replace(/\/$/, '') || '/';

    if (cleanPath === '/' || cleanPath === '') {
      markdownContent = `# SD Negeri Bobong\n\nSelamat Datang di Website Resmi SD Negeri Bobong. "Cerdas, Berkarakter, dan Berbudaya." Kami berkomitmen menyelenggarakan pendidikan dasar yang inklusif, adaptif, dan berlandaskan kearifan lokal di Kabupaten Pulau Taliabu.\n\n## Statistik Sekolah\n- **Siswa Aktif:** 205 Siswa\n- **Guru & Staf:** 14 Guru & Staf\n- **Ruang Kelas:** 9 Kelas\n- **Akreditasi:** B\n\n## Sambutan Kepala Sekolah\n> "Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan lentera karakter anak agar siap bersaing tanpa melupakan akar budaya leluhurnya."\n\nAssalamualaikum Wr. Wb., Salam Sejahtera untuk kita semua. Selamat datang di website resmi SD Negeri Bobong. Sebagai sekolah yang berada di pusat ibukota Kabupaten Pulau Taliabu, kami berkomitmen untuk terus berinovasi dalam mengimplementasikan kurikulum nasional yang relevan dengan perkembangan zaman.\n\n## Menu Utama & Rute Publik\n- [Profil Sekolah](https://sdnegeribobong.sch.id/profil) - Visi, Misi, Sejarah, dan Struktur Organisasi.\n- [Akademik](https://sdnegeribobong.sch.id/akademik) - Kurikulum, Jadwal Belajar, dan Tata Tertib Sekolah.\n- [Kesiswaan](https://sdnegeribobong.sch.id/kesiswaan) - Ekstrakurikuler, Organisasi Siswa, dan Prestasi.\n- [PPDB Online](https://sdnegeribobong.sch.id/ppdb) - Informasi Pendaftaran Peserta Didik Baru.\n- [Berita & Kegiatan](https://sdnegeribobong.sch.id/berita) - Kabar terkini dan kegiatan terbaru sekolah.\n\n## Kontak Sekolah\n- **Alamat:** Bobong, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara.\n- **Hubungi Operator WA:** [https://wa.me/6281234567890](https://wa.me/6281234567890)`;
    } else if (cleanPath === '/profil') {
      markdownContent = `# Profil - SD Negeri Bobong\n\n## Visi Sekolah\nMewujudkan insan yang cerdas, unggul dalam iptek, berkarakter mulia, dan berakar pada budaya kearifan lokal Taliabu.\n\n## Misi Sekolah\n1. Menyelenggarakan proses pembelajaran yang inovatif, menyenangkan, dan berorientasi pada profil pelajar Pancasila.\n2. Meningkatkan kompetensi guru dan tenaga kependidikan dalam pemanfaatan teknologi informasi.\n3. Menanamkan nilai-nilai kepemimpinan, kejujuran, dan sopan santun dalam keseharian.\n4. Melestarikan seni, budaya, dan kearifan lokal Pulau Taliabu melalui kegiatan kokurikuler dan ekstrakurikuler.\n\n## Sejarah Singkat\nSD Negeri Bobong didirikan sebagai salah satu sekolah dasar perintis di Taliabu Barat untuk memberikan layanan pendidikan dasar berkualitas bagi anak-anak di Pulau Taliabu. Seiring perkembangan daerah, sekolah terus berkembang menjadi salah satu sekolah dasar rujukan di ibukota kabupaten.`;
    } else if (cleanPath === '/akademik') {
      markdownContent = `# Akademik - SD Negeri Bobong\n\n## Kurikulum\nSD Negeri Bobong menerapkan **Kurikulum Merdeka** secara penuh untuk mendukung pembelajaran yang berpusat pada siswa (student-centered), berdiferensiasi, serta integrasi proyek penguatan profil pelajar Pancasila (P5).\n\n## Jadwal Kegiatan Pembelajaran\n- **Senin - Kamis:** 07:15 - 12:45 WIT\n- **Jumat:** 07:15 - 11:00 WIT (Kegiatan Keagamaan & Olahraga Bersama)\n- **Sabtu:** Libur (Kegiatan Pengembangan Diri / Ekstrakurikuler)\n\n## Tata Tertib Sekolah\n1. Siswa wajib hadir paling lambat 15 menit sebelum bel masuk berbunyi (07:00 WIT).\n2. Menggunakan seragam sekolah lengkap, rapi, dan sesuai dengan ketentuan hari yang berlaku.\n3. Menjaga kebersihan, ketertiban, dan keasrian lingkungan sekolah.\n4. Dilarang membawa barang yang tidak berkaitan dengan kegiatan belajar mengajar.`;
    } else if (cleanPath === '/kesiswaan') {
      markdownContent = `# Kesiswaan - SD Negeri Bobong\n\n## Kegiatan Ekstrakurikuler\nGuna menyalurkan minat dan bakat peserta didik, SD Negeri Bobong menyelenggarakan berbagai program ekstrakurikuler:\n- **Pramuka (Wajib):** Melatih kepemimpinan, kemandirian, dan kerja sama tim.\n- **Seni Tari & Musik Tradisional:** Melestarikan kesenian daerah Pulau Taliabu.\n- **Olahraga:** Atletik, Sepak Bola, dan Bulu Tangkis.\n- **Sains & Matematika Club:** Mempersiapkan siswa menghadapi kompetisi sains nasional (OSN).\n\n## Organisasi & Kepemimpinan\nSiswa dilatih untuk memimpin melalui perwakilan kelas, penugasan petugas upacara hari Senin, serta keterlibatan aktif dalam kegiatan kebersihan dan gotong royong sekolah.`;
    } else if (cleanPath === '/ppdb' || cleanPath === '/ppdb-online') {
      markdownContent = `# PPDB Online - SD Negeri Bobong\n\nSelamat datang di Sistem Penerimaan Peserta Didik Baru (PPDB) Online SD Negeri Bobong.\n\n## Persyaratan Pendaftaran\n1. Berusia minimal 6 tahun pada awal tahun ajaran baru.\n2. Mengisi formulir pendaftaran secara online atau offline di sekolah.\n3. Melampirkan Fotokopi Akta Kelahiran anak.\n4. Melampirkan Fotokopi Kartu Keluarga (KK).\n5. Melampirkan Fotokopi KTP orang tua / wali.\n\n## Alur Pendaftaran\n1. **Pendaftaran:** Mengisi formulir secara lengkap melalui website resmi.\n2. **Verifikasi Berkas:** Menyerahkan berkas persyaratan fisik ke panitia PPDB di sekolah.\n3. **Pengumuman:** Hasil seleksi akan diumumkan secara online di website ini dan papan pengumuman sekolah.\n4. **Daftar Ulang:** Melakukan konfirmasi dan daftar ulang bagi siswa yang dinyatakan diterima.`;
    } else if (cleanPath === '/berita') {
      markdownContent = `# Berita & Kegiatan - SD Negeri Bobong\n\nIkuti kabar terbaru, pengumuman resmi, dan dokumentasi berbagai kegiatan menarik yang diselenggarakan oleh SD Negeri Bobong di Kabupaten Pulau Taliabu.\n\n## Kategori Berita\n- **Pengumuman Resmi:** Informasi libur sekolah, pembagian rapor, dan PPDB.\n- **Kegiatan Sekolah:** Dokumentasi upacara bendera, karya wisata, proyek P5, dan perlombaan.\n- **Prestasi Siswa:** Kebanggaan sekolah atas pencapaian siswa di bidang akademik dan non-akademik.`;
    }

    if (markdownContent) {
      const tokenCount = Math.ceil(markdownContent.length / 4);
      return new NextResponse(markdownContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'x-markdown-tokens': String(tokenCount),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        }
      });
    }
  }

  // 2. Anti-cloning / anti-scraping logic: Block scraper bots, command line tools, and crawlers
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  const blockedAgents = [
    'httrack',          // Web site cloner
    'wget',             // CLI downloader
    'curl',             // CLI downloader
    'scrapy',           // Python scraping framework
    'python',           // Python requests/urllib
    'urllib',           // Python urllib
    'axios',            // JS HTTP client (often used in scripts)
    'node-fetch',       // JS HTTP client
    'go-http-client',   // Go HTTP library
    'postman',          // API client testing (often used to reverse engineer APIs)
    'java',             // Java HTTP clients
    'libwww',           // Perl/general web library
    'webcopy',          // Cyotek WebCopy cloner
    'teleport',         // Teleport Pro site cloner
    'offline explorer', // Offline Explorer site cloner
    'website extractor',// Website extractor cloner
    'site-sucker',      // SiteSucker macOS site cloner
    'sitesucker',       // SiteSucker macOS site cloner
    'ia_archiver'       // Archive.org crawler (optional, but prevents snapshot cloning)
  ];

  const isPublicAsset = path === '/robots.txt' || path === '/sitemap.xml' || path === '/security.txt' || path === '/favicon.ico' || path === '/favicon.png' || path.startsWith('/images/');
  const isBlocked = blockedAgents.some(agent => userAgent.includes(agent)) && !path.startsWith('/.well-known') && !isPublicAsset;
  if (isBlocked) {
    return new NextResponse('Access Denied: Scraping, cloning, and automated bots are not allowed on this website.', { 
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 2. Protect administrative dashboard routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check if the service role key cookie exists and is valid
    const adminToken = request.cookies.get('admin_session_token')?.value;
    const isValidToken = await verifyAdminToken(adminToken);

    if (isValidToken) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    }

    const { user, response } = await updateSession(request);

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const finalResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

    response.cookies.getAll().forEach(cookie => {
      finalResponse.cookies.set(cookie);
    });

    return finalResponse;
  }

  // 3. Protect teacher dashboard routes
  if (path.startsWith('/guru') && path !== '/guru/login') {
    const teacherToken = request.cookies.get('teacher_session_token')?.value;
    const isValidTeacher = await verifyTeacherToken(teacherToken);

    if (isValidTeacher) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    }

    return NextResponse.redirect(new URL('/guru/login', request.url));
  }

  // 4. For public pages, we bypass updateSession to optimize speed and database limits
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (images folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
