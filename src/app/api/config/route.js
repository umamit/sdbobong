import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { loadWebConfig, WEBSITE_CONFIG_JSON } from '../../../lib/database';
import fs from 'fs';

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

    if (contentType.includes('application/json')) {
      const body = await request.json();
      actionType = body.action_type;
      announcements = body.announcements;
      siswa_aktif = body.siswa_aktif;
      guru_staf = body.guru_staf;
      ruang_kelas = body.ruang_kelas;
      akreditasi = body.akreditasi;
    } else {
      const formData = await request.formData();
      actionType = formData.get('action_type');
      if (actionType === 'announcements') {
        announcements = formData.getAll('announcements[]');
      } else if (actionType === 'stats') {
        siswa_aktif = parseInt(formData.get('siswa_aktif') || '0', 10);
        guru_staf = parseInt(formData.get('guru_staf') || '0', 10);
        ruang_kelas = parseInt(formData.get('ruang_kelas') || '0', 10);
        akreditasi = formData.get('akreditasi') || 'B';
      }
    }

    const config = loadWebConfig();

    if (actionType === 'announcements') {
      if (!Array.isArray(announcements)) {
        return NextResponse.json({ error: 'Format pengumuman tidak valid.' }, { status: 400 });
      }
      const cleanedAnn = announcements.map(a => String(a).trim()).filter(a => a);
      config.marquee_announcements = cleanedAnn;
    } else if (actionType === 'stats') {
      config.stats = {
        siswa_aktif: isNaN(siswa_aktif) ? 0 : siswa_aktif,
        guru_staf: isNaN(guru_staf) ? 0 : guru_staf,
        ruang_kelas: isNaN(ruang_kelas) ? 0 : ruang_kelas,
        akreditasi: String(akreditasi).trim().toUpperCase() || 'B'
      };
    } else {
      return NextResponse.json({ error: 'Action type tidak dikenal.' }, { status: 400 });
    }

    fs.writeFileSync(WEBSITE_CONFIG_JSON, JSON.stringify(config, null, 4), 'utf-8');
    return NextResponse.json({ success: true, config });
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + e.message }, { status: 500 });
  }
}
