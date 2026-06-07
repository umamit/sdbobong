import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadWebConfig, saveWebConfig, handlePhotoUpload, saveNews, saveTeachers, saveAchievements } from '../../../lib/database';
import { verifyAdminToken } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    if (await verifyAdminToken(token)) {
      return true;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let actionType = '';
    let announcements = [];
    let siswa_aktif, guru_staf, ruang_kelas, akreditasi;
    let rombel, uks, gudang, toilet, cuci_tangan;
    let force_local_cache;
    let maintenance_mode;
    let nama_humas, wa_humas, jabatan_humas, nip_humas;
    let nama_operator, wa_operator, jabatan_operator, nip_operator;
    let wa_floating, email_sekolah;
    let parsedFormData = null;
    let parsedJsonBody = null;

    if (contentType.includes('application/json')) {
      parsedJsonBody = await request.json();
      const body = parsedJsonBody;
      actionType = body.action_type;
      announcements = body.announcements;
      siswa_aktif = body.siswa_aktif;
      guru_staf = body.guru_staf;
      ruang_kelas = body.ruang_kelas;
      akreditasi = body.akreditasi;
      rombel = body.rombel;
      uks = body.uks;
      gudang = body.gudang;
      toilet = body.toilet;
      cuci_tangan = body.cuci_tangan;
      force_local_cache = body.force_local_cache;
      maintenance_mode = body.maintenance_mode;
      
      nama_humas = body.nama_humas;
      wa_humas = body.wa_humas;
      jabatan_humas = body.jabatan_humas;
      nip_humas = body.nip_humas;
      nama_operator = body.nama_operator;
      wa_operator = body.wa_operator;
      jabatan_operator = body.jabatan_operator;
      nip_operator = body.nip_operator;
      wa_floating = body.wa_floating;
      email_sekolah = body.email_sekolah;
    } else {
      const formData = await request.formData();
      parsedFormData = formData;
      actionType = formData.get('action_type');
      if (actionType === 'announcements') {
        announcements = formData.getAll('announcements[]');
      } else if (actionType === 'stats') {
        siswa_aktif = parseInt(formData.get('siswa_aktif') || '0', 10);
        guru_staf = parseInt(formData.get('guru_staf') || '0', 10);
        ruang_kelas = parseInt(formData.get('ruang_kelas') || '0', 10);
        akreditasi = formData.get('akreditasi') || 'B';
        rombel = parseInt(formData.get('rombel') || '0', 10);
        uks = parseInt(formData.get('uks') || '0', 10);
        gudang = parseInt(formData.get('gudang') || '0', 10);
        toilet = parseInt(formData.get('toilet') || '0', 10);
        cuci_tangan = parseInt(formData.get('cuci_tangan') || '0', 10);
      } else if (actionType === 'toggle_db') {
        force_local_cache = formData.get('force_local_cache') === 'true';
      } else if (actionType === 'toggle_maintenance') {
        maintenance_mode = formData.get('maintenance_mode') === 'true';
      } else if (actionType === 'contacts') {
        nama_humas = formData.get('nama_humas')?.toString().trim();
        wa_humas = formData.get('wa_humas')?.toString().trim();
        jabatan_humas = formData.get('jabatan_humas')?.toString().trim();
        nip_humas = formData.get('nip_humas')?.toString().trim();
        nama_operator = formData.get('nama_operator')?.toString().trim();
        wa_operator = formData.get('wa_operator')?.toString().trim();
        jabatan_operator = formData.get('jabatan_operator')?.toString().trim();
        nip_operator = formData.get('nip_operator')?.toString().trim();
        wa_floating = formData.get('wa_floating')?.toString().trim();
        email_sekolah = formData.get('email_sekolah')?.toString().trim();
      }
    }

    const config = await loadWebConfig();

    if (actionType === 'announcements') {
      if (!Array.isArray(announcements)) {
        return NextResponse.json({ error: 'Format pengumuman tidak valid.' }, { status: 400 });
      }
      const cleanedAnn = announcements.map(a => String(a).trim()).filter(a => a);
      config.marquee_announcements = cleanedAnn;
    } else if (actionType === 'stats') {
      config.stats = {
        ...(config.stats || {}),
        siswa_aktif: isNaN(siswa_aktif) ? 0 : siswa_aktif,
        guru_staf: isNaN(guru_staf) ? 0 : guru_staf,
        ruang_kelas: isNaN(ruang_kelas) ? 0 : ruang_kelas,
        akreditasi: String(akreditasi).trim().toUpperCase() || 'B',
        rombel: isNaN(rombel) ? 0 : rombel,
        uks: isNaN(uks) ? 0 : uks,
        gudang: isNaN(gudang) ? 0 : gudang,
        toilet: isNaN(toilet) ? 0 : toilet,
        cuci_tangan: isNaN(cuci_tangan) ? 0 : cuci_tangan
      };
    } else if (actionType === 'toggle_db') {
      config.force_local_cache = force_local_cache === true;
    } else if (actionType === 'toggle_maintenance') {
      if (!config.stats) config.stats = {};
      config.stats.maintenance_mode = maintenance_mode === true;
    } else if (actionType === 'contacts') {
      config.ppdb_contacts = {
        nama_humas: nama_humas || '',
        wa_humas: wa_humas || '',
        jabatan_humas: jabatan_humas || '',
        nip_humas: nip_humas || '',
        nama_operator: nama_operator || '',
        wa_operator: wa_operator || '',
        jabatan_operator: jabatan_operator || '',
        nip_operator: nip_operator || '',
        wa_floating: wa_floating || '',
        email_sekolah: email_sekolah || ''
      };
    } else if (actionType === 'hero_bg') {
      const file = parsedFormData ? parsedFormData.get('hero_bg_image') : null;
      if (file && file.size > 0) {
        const uploadedUrl = await handlePhotoUpload(file, 'teachers', ['png', 'jpg', 'jpeg', 'svg', 'mp4', 'webm', 'ogg', 'mov', 'm4v']);
        if (uploadedUrl === 'INVALID_TYPE') {
          return NextResponse.json({ error: 'Format berkas tidak valid. Harus berupa gambar (png, jpg, jpeg, svg) atau video pendek (mp4, webm, ogg, mov, m4v).' }, { status: 400 });
        } else if (uploadedUrl === 'ERROR') {
          return NextResponse.json({ error: 'Gagal menyimpan berkas di server.' }, { status: 500 });
        }
        config.stats = {
          ...(config.stats || {}),
          hero_background: uploadedUrl
        };
      } else {
        return NextResponse.json({ error: 'Silakan pilih gambar atau video terlebih dahulu.' }, { status: 400 });
      }
    } else if (actionType === 'update_page_contents') {
      let pageName, pageDataStr;
      if (contentType.includes('application/json')) {
        pageName = parsedJsonBody ? parsedJsonBody.page_name : null;
        pageDataStr = parsedJsonBody ? JSON.stringify(parsedJsonBody.page_data) : null;
      } else {
        pageName = parsedFormData ? parsedFormData.get('page_name') : null;
        pageDataStr = parsedFormData ? parsedFormData.get('page_data') : null;
      }

      if (!pageName || !pageDataStr) {
        return NextResponse.json({ error: 'Data halaman tidak lengkap.' }, { status: 400 });
      }

      let pageData = {};
      try {
        pageData = typeof pageDataStr === 'string' ? JSON.parse(pageDataStr) : pageDataStr;
      } catch (e) {
        return NextResponse.json({ error: 'Format data halaman tidak valid.' }, { status: 400 });
      }

      // Pastikan stats dan page_contents terinisialisasi
      if (!config.stats) config.stats = {};
      if (!config.stats.page_contents) config.stats.page_contents = {};
      if (!config.stats.page_contents[pageName]) config.stats.page_contents[pageName] = {};

      // Proses file upload jika ada
      if (parsedFormData) {
        for (const [key, value] of parsedFormData.entries()) {
          if (value && typeof value === 'object' && value.size > 0) {
            const uploadedUrl = await handlePhotoUpload(value, 'teachers', ['png', 'jpg', 'jpeg', 'svg', 'gif']);
            if (uploadedUrl && uploadedUrl !== 'INVALID_TYPE' && uploadedUrl !== 'ERROR') {
              if (key === 'sejarah_image_file') {
                pageData.sejarah_image = uploadedUrl;
              } else if (key === 'kurikulum_image_file') {
                pageData.kurikulum_image = uploadedUrl;
              } else if (key.startsWith('ekskul_image_')) {
                const index = parseInt(key.split('_')[2], 10);
                if (pageData.ekstrakurikuler && pageData.ekstrakurikuler[index]) {
                  pageData.ekstrakurikuler[index].image = uploadedUrl;
                }
              } else if (key.startsWith('p5_image_')) {
                const index = parseInt(key.split('_')[2], 10);
                if (pageData.p5_projects && pageData.p5_projects[index]) {
                  pageData.p5_projects[index].image = uploadedUrl;
                }
              } else if (key.startsWith('gallery_image_')) {
                const parts = key.split('_');
                if (parts[2] === 'index') {
                  const index = parseInt(parts[3], 10);
                  if (pageData.gallery_items && pageData.gallery_items[index]) {
                    pageData.gallery_items[index].src = uploadedUrl;
                  }
                } else if (parts[2] === 'id') {
                  const targetId = parts.slice(3).join('_');
                  if (pageData.gallery_items) {
                    const item = pageData.gallery_items.find(g => g.id === targetId);
                    if (item) item.src = uploadedUrl;
                  }
                }
              }
            }
          }
        }
      }

      config.stats.page_contents[pageName] = pageData;
    } else if (actionType === 'downloads') {
      config.downloads = parsedJsonBody?.downloads || [];
    } else if (actionType === 'faqs') {
      config.faqs = parsedJsonBody?.faqs || [];
    } else if (actionType === 'gallery') {
      if (parsedJsonBody) {
        config.gallery = parsedJsonBody.gallery || [];
      } else if (parsedFormData) {
        const itemId = parsedFormData.get('item_id')?.toString().trim() || '';
        const title = parsedFormData.get('title')?.toString().trim() || '';
        const type = parsedFormData.get('type')?.toString().trim() || 'image';
        const date = parsedFormData.get('date')?.toString().trim() || new Date().toISOString().split('T')[0];
        const category = parsedFormData.get('category')?.toString().trim() || 'umum';
        let url = parsedFormData.get('url')?.toString().trim() || '';

        const file = parsedFormData.get('gallery_file');
        if (file && typeof file === 'object' && file.size > 0) {
          const uploadedUrl = await handlePhotoUpload(file, 'teachers', ['png', 'jpg', 'jpeg', 'svg', 'gif', 'mp4', 'webm', 'ogg', 'mov', 'm4v']);
          if (uploadedUrl === 'INVALID_TYPE') {
            return NextResponse.json({ error: 'Format berkas tidak valid. Harus berupa gambar (png, jpg, jpeg, svg, gif) atau video (mp4, webm, ogg, mov, m4v).' }, { status: 400 });
          } else if (uploadedUrl === 'ERROR') {
            return NextResponse.json({ error: 'Gagal mengunggah berkas ke server.' }, { status: 500 });
          }
          url = uploadedUrl;
        }

        const list = config.gallery || [];
        if (itemId) {
          // Edit existing item
          config.gallery = list.map(item => 
            item.id === itemId 
              ? { ...item, title, type, url: url || item.url, date, category } 
              : item
          );
        } else {
          // Add new item
          const newItem = {
            id: `gal-${Date.now()}`,
            title,
            type,
            url,
            date,
            category
          };
          config.gallery = [...list, newItem];
        }
      }
    } else if (actionType === 'resolve_security_threat') {
      const targetIp = parsedJsonBody?.ip;
      if (!targetIp) {
        return NextResponse.json({ error: 'IP target tidak ditentukan.' }, { status: 400 });
      }
      if (!config.suspicious_attempts) config.suspicious_attempts = [];
      const attemptIndex = config.suspicious_attempts.findIndex(a => a.ip === targetIp);
      if (attemptIndex !== -1) {
        config.suspicious_attempts[attemptIndex].attempts = 0;
        config.suspicious_attempts[attemptIndex].resolved = true;
        config.suspicious_attempts[attemptIndex].resolvedAt = new Date().toISOString();
        config.suspicious_attempts[attemptIndex].blockedUntil = null;
      }
    } else if (actionType === 'restore_backup') {
      const restoredConfig = parsedJsonBody?.config || parsedJsonBody?.restored_config;
      if (!restoredConfig || typeof restoredConfig !== 'object') {
        return NextResponse.json({ error: 'Data cadangan tidak valid.' }, { status: 400 });
      }
      // Overwrite config values
      if (restoredConfig.marquee_announcements) config.marquee_announcements = restoredConfig.marquee_announcements;
      if (restoredConfig.stats) config.stats = restoredConfig.stats;
      if (restoredConfig.ppdb_contacts) config.ppdb_contacts = restoredConfig.ppdb_contacts;
      if (typeof restoredConfig.force_local_cache !== 'undefined') config.force_local_cache = restoredConfig.force_local_cache;

      // Restore other collections (newsList, teachers, achievements) if provided in backup
      const newsList = parsedJsonBody?.newsList;
      const teachers = parsedJsonBody?.teachers;
      const achievements = parsedJsonBody?.achievements;

      if (Array.isArray(newsList)) {
        const savedNewsResult = await saveNews(newsList);
        if (!savedNewsResult) {
          return NextResponse.json({ error: 'Gagal memulihkan data berita ke database.' }, { status: 500 });
        }
      }
      if (Array.isArray(teachers)) {
        const savedTeachersResult = await saveTeachers(teachers);
        if (!savedTeachersResult) {
          return NextResponse.json({ error: 'Gagal memulihkan data guru/staf ke database.' }, { status: 500 });
        }
      }
      if (Array.isArray(achievements)) {
        const savedAchievementsResult = await saveAchievements(achievements);
        if (!savedAchievementsResult) {
          return NextResponse.json({ error: 'Gagal memulihkan data prestasi ke database.' }, { status: 500 });
        }
      }
    } else {
      return NextResponse.json({ error: 'Action type tidak dikenal.' }, { status: 400 });
    }

    const saved = await saveWebConfig(config);
    if (!saved) {
      return NextResponse.json({ error: "Gagal menyimpan konfigurasi ke database." }, { status: 500 });
    }

    // Create audit log based on actionType
    try {
      let details = `Memperbarui konfigurasi: ${actionType}`;
      if (actionType === 'announcements') details = 'Memperbarui pengumuman berjalan (marquee) sekolah';
      else if (actionType === 'stats') details = 'Memperbarui statistik dasar dan sarana prasarana sekolah';
      else if (actionType === 'toggle_db') details = force_local_cache ? 'Menonaktifkan sinkronisasi Supabase (Paksa Mode Lokal)' : 'Mengaktifkan kembali sinkronisasi Supabase';
      else if (actionType === 'toggle_maintenance') details = config.stats?.maintenance_mode ? 'Mengaktifkan Mode Pemeliharaan (mengunci akses publik)' : 'Menonaktifkan Mode Pemeliharaan (membuka akses publik)';
      else if (actionType === 'contacts') details = 'Memperbarui detail kontak PPDB humas dan operator sekolah';
      else if (actionType === 'hero_bg') details = 'Mengunggah dan mengubah media latar belakang (hero background)';
      else if (actionType === 'update_page_contents') details = `Memperbarui konten halaman informasi: ${pageName}`;
      else if (actionType === 'downloads') details = 'Memperbarui katalog berkas pusat unduhan publik';
      else if (actionType === 'faqs') details = 'Memperbarui daftar tanya jawab (FAQ) sekolah';
      else if (actionType === 'gallery') details = 'Memperbarui kumpulan foto galeri kegiatan siswa';
      else if (actionType === 'resolve_security_threat') details = `Menghapus pemblokiran dan menyelesaikan ancaman untuk IP: ${parsedJsonBody?.ip}`;
      else if (actionType === 'restore_backup') details = 'Melakukan pemulihan (restore) data website dari berkas cadangan JSON';

      const actionName = actionType === 'resolve_security_threat' ? 'SECURITY_RESOLVE' : `CONFIG_${actionType.toUpperCase()}`;
      await createAuditLog(actionName, details, request);
    } catch (auditErr) {
      console.error("Failed to write config audit log:", auditErr);
    }


    try {
      revalidatePath('/', 'layout');
    } catch (cacheErr) {
      console.error("Cache revalidation failed in config route:", cacheErr);
    }

    const response = NextResponse.json({
      success: true,
      config,
      newsList: Array.isArray(parsedJsonBody?.newsList) ? parsedJsonBody.newsList : undefined,
      teachers: Array.isArray(parsedJsonBody?.teachers) ? parsedJsonBody.teachers : undefined,
      achievements: Array.isArray(parsedJsonBody?.achievements) ? parsedJsonBody.achievements : undefined
    });

    response.cookies.set('maintenance_mode', (config.stats?.maintenance_mode === true) ? 'true' : 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax'
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const config = await loadWebConfig();
    const isMaintenance = config.stats?.maintenance_mode === true;
    
    const response = NextResponse.json({
      maintenance_mode: isMaintenance,
      ppdb_contacts: config.ppdb_contacts || {}
    });

    // Make sure public get also sets/corrects the cookie
    response.cookies.set('maintenance_mode', isMaintenance ? 'true' : 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax'
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
