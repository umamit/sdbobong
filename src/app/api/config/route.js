import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../../lib/supabase/server';
import { loadWebConfig, saveWebConfig, handlePhotoUpload } from '../../../lib/database';

async function checkAuth() {
  try {
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
    let nama_humas, wa_humas, jabatan_humas;
    let nama_operator, wa_operator, jabatan_operator;
    let parsedFormData = null;

    if (contentType.includes('application/json')) {
      const body = await request.json();
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
      nama_operator = body.nama_operator;
      wa_operator = body.wa_operator;
      jabatan_operator = body.jabatan_operator;
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
        nama_operator = formData.get('nama_operator')?.toString().trim();
        wa_operator = formData.get('wa_operator')?.toString().trim();
        jabatan_operator = formData.get('jabatan_operator')?.toString().trim();
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
        nama_operator: nama_operator || '',
        wa_operator: wa_operator || '',
        jabatan_operator: jabatan_operator || ''
      };
    } else if (actionType === 'hero_bg') {
      const file = parsedFormData ? parsedFormData.get('hero_bg_image') : null;
      if (file && file.size > 0) {
        const uploadedUrl = await handlePhotoUpload(file, 'teachers', ['png', 'jpg', 'jpeg', 'svg']);
        if (uploadedUrl === 'INVALID_TYPE') {
          return NextResponse.json({ error: 'Format berkas tidak valid. Harus berupa gambar (png, jpg, jpeg, svg).' }, { status: 400 });
        } else if (uploadedUrl === 'ERROR') {
          return NextResponse.json({ error: 'Gagal menyimpan gambar di server.' }, { status: 500 });
        }
        config.stats = {
          ...(config.stats || {}),
          hero_background: uploadedUrl
        };
      } else {
        return NextResponse.json({ error: 'Silakan pilih gambar terlebih dahulu.' }, { status: 400 });
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

    return NextResponse.json({ success: true, config });
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + e.message }, { status: 500 });
  }
}
