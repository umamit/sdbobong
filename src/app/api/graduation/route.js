import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadGraduation, saveGraduation, isSupabaseEnabled, supabase } from '../../../lib/database';
import { prisma } from '../../../lib/prisma';
import { checkAuth } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';
import { handleApiDelete } from '../../../lib/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


// GET: Checks graduation status (via query params) or returns the full graduation database for admin
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nisn = searchParams.get('nisn')?.trim();
    const noPeserta = searchParams.get('no_peserta')?.trim();

    const gradList = await loadGraduation();

    // If query params are provided, do a public search
    if (nisn || noPeserta) {
      const student = gradList.find(g => {
        const matchNisn = nisn && g.nisn?.toString().trim() === nisn;
        const matchNoPeserta = noPeserta && g.no_peserta?.toString().trim().toLowerCase() === noPeserta.toLowerCase();
        return matchNisn || matchNoPeserta;
      });

      if (!student) {
        return NextResponse.json({ error: "Siswa dengan NISN atau Nomor Peserta tersebut tidak ditemukan." }, { status: 404 });
      }

      return NextResponse.json(student);
    }

    // Otherwise, check if admin and return the full list
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized. Pencarian kelulusan memerlukan parameter NISN atau Nomor Peserta." }, { status: 401 });
    }

    return NextResponse.json(gradList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memproses data kelulusan: " + e.message }, { status: 500 });
  }
}

// POST: Add new student record (admin only)
export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const nisn = body.nisn?.toString().trim();
    const no_peserta = body.no_peserta?.toString().trim();
    const name = body.name?.toString().trim().toUpperCase();
    const status = body.status?.toString().trim(); // 'LULUS' or 'BELUM_LULUS'
    const sk_number = body.sk_number?.toString().trim();
    const birth_place = body.birth_place?.toString().trim();
    const birth_date = body.birth_date?.toString().trim();
    const parent_name = body.parent_name?.toString().trim().toUpperCase();

    if (!nisn || !no_peserta || !name || !status || !sk_number || !birth_place || !birth_date || !parent_name) {
      return NextResponse.json({ error: "Semua kolom data siswa wajib diisi!" }, { status: 400 });
    }

    if (!['LULUS', 'BELUM_LULUS'].includes(status)) {
      return NextResponse.json({ error: "Status kelulusan tidak valid (harus LULUS atau BELUM_LULUS)." }, { status: 400 });
    }

    const gradList = await loadGraduation();

    // Check for duplicates
    const duplicate = gradList.find(g => g.nisn === nisn || g.no_peserta.toLowerCase() === no_peserta.toLowerCase());
    if (duplicate) {
      return NextResponse.json({ error: `Siswa dengan NISN ${nisn} atau No Peserta ${no_peserta} sudah ada!` }, { status: 400 });
    }

    const newStudent = {
      id: `grad-${Date.now()}`,
      nisn,
      no_peserta,
      name,
      status,
      sk_number,
      birth_place,
      birth_date,
      parent_name
    };

    gradList.push(newStudent);
    const saved = await saveGraduation(gradList);

    if (saved) {
      await createAuditLog('CREATE_GRADUATE', `Menambahkan peserta kelulusan baru: "${name}" (NISN: ${nisn})`, request);
      try {
        revalidatePath('/kelulusan');
      } catch (cacheErr) {}
      return NextResponse.json({ success: true, student: newStudent });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data siswa baru ke database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

// PUT: Edit student record (admin only)
export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nisn, no_peserta, name, status, sk_number, birth_place, birth_date, parent_name } = body;

    if (!id || !nisn || !no_peserta || !name || !status || !sk_number || !birth_place || !birth_date || !parent_name) {
      return NextResponse.json({ error: "Semua kolom data siswa wajib diisi!" }, { status: 400 });
    }

    if (!['LULUS', 'BELUM_LULUS'].includes(status)) {
      return NextResponse.json({ error: "Status kelulusan tidak valid." }, { status: 400 });
    }

    const gradList = await loadGraduation();
    const index = gradList.findIndex(g => g.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan." }, { status: 404 });
    }

    // Check duplicate except self
    const duplicate = gradList.find(g => g.id !== id && (g.nisn === nisn || g.no_peserta.toLowerCase() === no_peserta.toLowerCase()));
    if (duplicate) {
      return NextResponse.json({ error: `Siswa lain dengan NISN ${nisn} atau No Peserta ${no_peserta} sudah ada!` }, { status: 400 });
    }

    gradList[index] = {
      id,
      nisn: nisn.trim(),
      no_peserta: no_peserta.trim(),
      name: name.trim().toUpperCase(),
      status: status.trim(),
      sk_number: sk_number.trim(),
      birth_place: birth_place.trim(),
      birth_date: birth_date.trim(),
      parent_name: parent_name.trim().toUpperCase()
    };

    const saved = await saveGraduation(gradList);

    if (saved) {
      await createAuditLog('UPDATE_GRADUATE', `Memperbarui data kelulusan siswa: "${name.trim().toUpperCase()}" (NISN: ${nisn.trim()})`, request);
      try {
        revalidatePath('/kelulusan');
      } catch (cacheErr) {}
      return NextResponse.json({ success: true, student: gradList[index] });
    } else {
      return NextResponse.json({ error: "Gagal memperbarui data siswa." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

// DELETE: Delete student record (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID data siswa tidak ditentukan." }, { status: 400 });
    }

    return handleApiDelete({
      request,
      id,
      loadFn: loadGraduation,
      saveFn: saveGraduation,
      prismaModel: prisma.graduation,
      auditAction: 'DELETE_GRADUATE',
      getItemName: (g) => `${g.name}${g.nisn ? ` (NISN: ${g.nisn})` : ''}`,
      revalidatePaths: ['/kelulusan']
    });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
