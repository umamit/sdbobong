import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadTeachers, saveTeachers } from '../../../../lib/db/teachers';
import { loadWebConfig, saveWebConfig } from '../../../../lib/db/config';
import { createAuditLog } from '../../../../lib/audit';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  // 1. Authenticate the user
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawTeachers = body.teachers;

    if (!Array.isArray(rawTeachers)) {
      return NextResponse.json({ error: 'Data guru harus berupa array/daftar.' }, { status: 400 });
    }

    console.log(`Starting bulk import of ${rawTeachers.length} teachers from Dapodik GTK...`);

    // Load existing teachers to merge images, passwords, and details
    const existingList = await loadTeachers(true); // Include passwords
    const existingMap = new Map();
    existingList.forEach(t => {
      if (t.nip) existingMap.set(`nip-${t.nip}`, t);
      existingMap.set(`name-${t.name.toLowerCase().trim()}`, t);
      existingMap.set(`id-${t.id}`, t);
    });

    const parsedTeachers = [];
    const seenIds = new Set();

    for (const raw of rawTeachers) {
      const name = (raw.nama || raw.name || '').toString().trim();
      if (!name) continue; // Skip teachers without a name

      const nip = (raw.nip || raw.nuptk || '').toString().trim();
      
      // Role mapping from Dapodik jenis_ptk
      let rawRole = (raw.jenis_ptk || raw.role || 'Guru Kelas').toString().trim();
      let role = 'Guru Kelas';
      if (rawRole.toLowerCase().includes('kepala sekolah')) {
        role = 'Kepala Sekolah';
      } else if (rawRole.toLowerCase().includes('tata usaha') || rawRole.toLowerCase().includes('administrasi') || rawRole.toLowerCase().includes('tenaga kependidikan')) {
        role = 'Tata Urusan Surat/Tata Usaha';
      } else if (rawRole.toLowerCase().includes('bendahara')) {
        role = 'Bendahara';
      } else if (rawRole.toLowerCase().includes('guru mapel') || rawRole.toLowerCase().includes('mata pelajaran')) {
        role = 'Guru Bidang Studi';
      } else if (rawRole.toLowerCase().includes('guru kelas')) {
        role = 'Guru Kelas';
      } else {
        role = rawRole; // fallback to raw string
      }

      // Kepegawaian & Status Keaktifan
      const status_kepegawaian = (raw.status_kepegawaian || raw.kepegawaian || 'PNS / ASN').toString().trim();
      const details = `Pendidik Keaktifan: Aktif (${status_kepegawaian})`;

      // Keaktifan
      let rawStatus = (raw.status || raw.keaktifan || 'Aktif').toString().trim();
      let status = 'Aktif';
      if (rawStatus.toLowerCase().includes('tidak') || rawStatus.toLowerCase().includes('non')) {
        status = 'Tidak Aktif';
      }

      // Check if teacher already exists in our database
      let existingTeacher = null;
      if (nip) existingTeacher = existingMap.get(`nip-${nip}`);
      if (!existingTeacher) existingTeacher = existingMap.get(`name-${name.toLowerCase().trim()}`);

      // Crucial: preserve existing images, password logins, and profile details (subject, education, bio)
      const image = existingTeacher && existingTeacher.image ? existingTeacher.image : '';
      const password = existingTeacher && existingTeacher.password ? existingTeacher.password : '';
      const subject = existingTeacher && existingTeacher.subject ? existingTeacher.subject : '';
      const education = existingTeacher && existingTeacher.education ? existingTeacher.education : '';
      const motto = existingTeacher && existingTeacher.motto ? existingTeacher.motto : '';
      const bio = existingTeacher && existingTeacher.bio ? existingTeacher.bio : '';

      // Construct a unique ID
      const baseNip = nip || Math.random().toString(36).substring(2, 10);
      let id = `teacher-${baseNip}`;

      // Prevent duplicate IDs within the imported payload itself
      if (seenIds.has(id)) {
        const cleanName = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10);
        id = `${id}-${cleanName}`;
      }
      seenIds.add(id);

      parsedTeachers.push({
        id,
        name,
        role,
        details,
        status,
        image,
        nip: nip || '',
        password,
        subject,
        education,
        motto,
        bio
      });
    }

    if (parsedTeachers.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data guru valid yang berhasil diproses.' }, { status: 400 });
    }

    // 2. Save the teachers to database and local cache
    const saved = await saveTeachers(parsedTeachers);

    if (saved) {
      // 3. Update the global config stats.guru_staf
      const activeCount = parsedTeachers.filter(t => t.status === 'Aktif').length;
      
      const config = await loadWebConfig();
      if (!config.stats) config.stats = {};
      config.stats.guru_staf = activeCount;

      await saveWebConfig(config);

      // 4. Create an audit log
      await createAuditLog(
        'SYNC_GTK_DAPODIK',
        `Melakukan sinkronisasi massal data dewan guru dari Dapodik (jumlah: ${parsedTeachers.length} guru, aktif: ${activeCount})`,
        request
      );

      // 5. Invalidate Next.js cache
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in bulk GTK sync:", cacheErr);
      }

      return NextResponse.json({
        success: true,
        count: parsedTeachers.length,
        activeCount: activeCount
      });
    } else {
      return NextResponse.json({ error: 'Gagal menyimpan data sinkronisasi guru ke database.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Error during bulk GTK sync:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server: ' + err.message }, { status: 500 });
  }
}
