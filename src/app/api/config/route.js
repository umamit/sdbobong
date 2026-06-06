import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadWebConfig, saveWebConfig, handlePhotoUpload, saveNews, saveTeachers, saveAchievements } from '../../../lib/database';
import { verifyAdminToken } from '../../../lib/auth';

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
    let force_local_cache;
    let nama_humas, wa_humas, jabatan_humas, nip_humas;
    let nama_operator, wa_operator, jabatan_operator, nip_operator;
    let wa_floating;
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
      force_local_cache = body.force_local_cache;
      
      nama_humas = body.nama_humas;
      wa_humas = body.wa_humas;
      jabatan_humas = body.jabatan_humas;
      nip_humas = body.nip_humas;
      nama_operator = body.nama_operator;
      wa_operator = body.wa_operator;
      jabatan_operator = body.jabatan_operator;
      nip_operator = body.nip_operator;
      wa_floating = body.wa_floating;
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
      } else if (actionType === 'toggle_db') {
        force_local_cache = formData.get('force_local_cache') === 'true';
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
        akreditasi: String(akreditasi).trim().toUpperCase() || 'B'
      };
    } else if (actionType === 'toggle_db') {
      config.force_local_cache = force_local_cache === true;
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
        wa_floating: wa_floating || ''
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
      config.gallery = parsedJsonBody?.gallery || [];
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

    try {
      revalidatePath('/', 'layout');
    } catch (cacheErr) {
      console.error("Cache revalidation failed in config route:", cacheErr);
    }

    return NextResponse.json({
      success: true,
      config,
      newsList: Array.isArray(parsedJsonBody?.newsList) ? parsedJsonBody.newsList : undefined,
      teachers: Array.isArray(parsedJsonBody?.teachers) ? parsedJsonBody.teachers : undefined,
      achievements: Array.isArray(parsedJsonBody?.achievements) ? parsedJsonBody.achievements : undefined
    });
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + e.message }, { status: 500 });
  }
}
