import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth';
import { loadStudents, saveStudents } from '../../../../lib/db/students';
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
    const rawStudents = body.students;

    if (!Array.isArray(rawStudents)) {
      return NextResponse.json({ error: 'Data siswa harus berupa array/daftar.' }, { status: 400 });
    }

    console.log(`Starting bulk import of ${rawStudents.length} students from Dapodik...`);

    // Load existing students to merge grades and other custom fields
    const existingList = await loadStudents();
    const existingMap = new Map();
    existingList.forEach(s => {
      // Map by unique identifier combinations to find existing matches
      if (s.nisn) existingMap.set(`nisn-${s.nisn}`, s);
      if (s.nis) existingMap.set(`nis-${s.nis}`, s);
      existingMap.set(`id-${s.id}`, s);
    });

    const parsedStudents = [];
    const seenIds = new Set();

    for (const raw of rawStudents) {
      // Map columns from Dapodik
      const name = (raw.nama || raw.name || '').toString().trim();
      if (!name) continue; // Skip students without a name

      const nisn = (raw.nisn || '').toString().trim();
      const nis = (raw.nipd || raw.nis || '').toString().trim();

      // Normalize gender (L / P to Laki-laki / Perempuan)
      let gender = (raw.jk || raw.gender || 'L').toString().trim().toUpperCase();
      if (gender === 'L' || gender === 'LAKI-LAKI') {
        gender = 'Laki-laki';
      } else if (gender === 'P' || gender === 'PEREMPUAN') {
        gender = 'Perempuan';
      } else {
        gender = 'Laki-laki'; // default fallback
      }

      const birth_place = (raw.tempat_lahir || raw.birth_place || 'BOBONG').toString().trim();
      const birth_date = (raw.tanggal_lahir || raw.birth_date || '').toString().trim();
      const address = (raw.alamat_jalan || raw.address || 'Desa Wayo, Taliabu Barat').toString().trim();
      
      // Parent name (mother's name is usually in Dapodik, fallback to father)
      const parent_name = (raw.nama_ibu_kandung || raw.parent_name || raw.nama_ayah || '').toString().trim();
      const parent_phone = (raw.nomor_telepon_seluler || raw.parent_phone || '').toString().trim();
      const status = (raw.status || 'Aktif').toString().trim();

      // Rombel/Class mapping (e.g. "Kelas 2 - Rombel 2B" -> "2B")
      let rawClass = (raw.rombel || raw.class || '1A').toString().trim();
      let studentClass = '1A';
      const classMatch = rawClass.match(/([1-6])\s*[-_\s]?\s*([A-D])/i);
      if (classMatch) {
        studentClass = `${classMatch[1]}${classMatch[2].toUpperCase()}`;
      } else {
        // Fallback: match first digit 1-6 and letter A-D
        const digitMatch = rawClass.match(/[1-6]/);
        const letterMatch = rawClass.match(/[A-D]/i);
        if (digitMatch && letterMatch) {
          studentClass = `${digitMatch[0]}${letterMatch[0].toUpperCase()}`;
        }
      }

      // Check if we already have an existing record to preserve grades (nilai)
      let existingStudent = null;
      if (nisn) existingStudent = existingMap.get(`nisn-${nisn}`);
      if (!existingStudent && nis) existingStudent = existingMap.get(`nis-${nis}`);

      const grades = existingStudent ? existingStudent.grades : null;

      // Construct a unique ID
      const baseNis = nisn || nis || Math.random().toString(36).substring(2, 10);
      let id = `student-${baseNis}`;

      // Prevent duplicate IDs within the imported payload itself
      if (seenIds.has(id)) {
        const cleanName = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10);
        id = `${id}-${cleanName}`;
      }
      seenIds.add(id);

      parsedStudents.push({
        id,
        nisn: nisn || nis || '',
        nis: nis || nisn || '',
        name,
        class: studentClass,
        gender,
        birth_place,
        birth_date,
        address,
        parent_name,
        parent_phone,
        status,
        grades
      });
    }

    if (parsedStudents.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data siswa valid yang berhasil diproses.' }, { status: 400 });
    }

    // 2. Save the students to database and local cache
    const saved = await saveStudents(parsedStudents);

    if (saved) {
      // 3. Update the global config stats.siswa_aktif
      const activeCount = parsedStudents.filter(s => s.status === 'Aktif').length;
      
      const config = await loadWebConfig();
      if (!config.stats) config.stats = {};
      config.stats.siswa_aktif = activeCount;

      await saveWebConfig(config);

      // 4. Create an audit log
      await createAuditLog(
        'SYNC_DAPODIK',
        `Melakukan sinkronisasi massal data siswa dari Dapodik (jumlah: ${parsedStudents.length} siswa, aktif: ${activeCount})`,
        request
      );

      // 5. Invalidate Next.js cache
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in bulk sync:", cacheErr);
      }

      return NextResponse.json({
        success: true,
        count: parsedStudents.length,
        activeCount: activeCount
      });
    } else {
      return NextResponse.json({ error: 'Gagal menyimpan data sinkronisasi ke database.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Error during bulk sync:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server: ' + err.message }, { status: 500 });
  }
}
