import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import { loadStudents, saveStudents, supabase, isSupabaseEnabled } from '../../../lib/database';
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

export async function GET() {
  try {
    const studentsList = await loadStudents();
    return NextResponse.json(studentsList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat data siswa: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const nisn = body.nisn?.toString().trim();
    const nis = body.nis?.toString().trim();
    const name = body.name?.toString().trim();
    const studentClass = body.class?.toString().trim();
    const gender = body.gender?.toString().trim();
    const birth_place = body.birth_place?.toString().trim() || "";
    const birth_date = body.birth_date?.toString().trim() || "";
    const address = body.address?.toString().trim() || "";
    const parent_name = body.parent_name?.toString().trim() || "";
    const parent_phone = body.parent_phone?.toString().trim() || "";
    const status = body.status?.toString().trim() || "Aktif";

    if (!nisn || !nis || !name || !studentClass || !gender) {
      return NextResponse.json({ error: "Kolom NISN, NIS, Nama Lengkap, Kelas, dan Jenis Kelamin wajib diisi!" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(nisn)) {
      return NextResponse.json({ error: "NISN harus berupa 10 digit angka saja!" }, { status: 400 });
    }

    if (!/^[1-6]$/.test(studentClass)) {
      return NextResponse.json({ error: "Kelas harus bernilai antara 1 sampai 6!" }, { status: 400 });
    }

    if (gender !== "Laki-laki" && gender !== "Perempuan") {
      return NextResponse.json({ error: "Jenis kelamin harus Laki-laki atau Perempuan!" }, { status: 400 });
    }

    const studentsList = await loadStudents();

    // Check duplicate NISN
    const duplicateNisn = studentsList.find(s => s.nisn === nisn);
    if (duplicateNisn) {
      return NextResponse.json({ error: `Siswa dengan NISN ${nisn} sudah terdaftar atas nama ${duplicateNisn.name}!` }, { status: 400 });
    }

    // Check duplicate NIS
    const duplicateNis = studentsList.find(s => s.nis === nis);
    if (duplicateNis) {
      return NextResponse.json({ error: `Siswa dengan NIS ${nis} sudah terdaftar atas nama ${duplicateNis.name}!` }, { status: 400 });
    }

    const newStudent = {
      id: `stud-${Math.floor(Date.now() / 1000)}`,
      nisn,
      nis,
      name,
      class: studentClass,
      gender,
      birth_place,
      birth_date,
      address,
      parent_name,
      parent_phone,
      status
    };

    studentsList.push(newStudent);
    const saved = await saveStudents(studentsList);

    if (saved) {
      await createAuditLog('CREATE_STUDENT', `Menambahkan data siswa baru: "${name}" (NISN: ${nisn}, Kelas ${studentClass})`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in students POST:", cacheErr);
      }
      return NextResponse.json({ success: true, student: newStudent });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data siswa ke database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = body.id?.toString().trim();
    const nisn = body.nisn?.toString().trim();
    const nis = body.nis?.toString().trim();
    const name = body.name?.toString().trim();
    const studentClass = body.class?.toString().trim();
    const gender = body.gender?.toString().trim();
    const birth_place = body.birth_place?.toString().trim() || "";
    const birth_date = body.birth_date?.toString().trim() || "";
    const address = body.address?.toString().trim() || "";
    const parent_name = body.parent_name?.toString().trim() || "";
    const parent_phone = body.parent_phone?.toString().trim() || "";
    const status = body.status?.toString().trim() || "Aktif";

    if (!id) {
      return NextResponse.json({ error: "ID siswa tidak ditentukan." }, { status: 400 });
    }

    if (!nisn || !nis || !name || !studentClass || !gender) {
      return NextResponse.json({ error: "Kolom NISN, NIS, Nama Lengkap, Kelas, dan Jenis Kelamin wajib diisi!" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(nisn)) {
      return NextResponse.json({ error: "NISN harus berupa 10 digit angka saja!" }, { status: 400 });
    }

    if (!/^[1-6]$/.test(studentClass)) {
      return NextResponse.json({ error: "Kelas harus bernilai antara 1 sampai 6!" }, { status: 400 });
    }

    if (gender !== "Laki-laki" && gender !== "Perempuan") {
      return NextResponse.json({ error: "Jenis kelamin harus Laki-laki atau Perempuan!" }, { status: 400 });
    }

    const studentsList = await loadStudents();
    const studentIndex = studentsList.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan." }, { status: 404 });
    }

    // Check duplicate NISN (with other students)
    const duplicateNisn = studentsList.find(s => s.nisn === nisn && s.id !== id);
    if (duplicateNisn) {
      return NextResponse.json({ error: `Siswa dengan NISN ${nisn} sudah terdaftar atas nama ${duplicateNisn.name}!` }, { status: 400 });
    }

    // Check duplicate NIS (with other students)
    const duplicateNis = studentsList.find(s => s.nis === nis && s.id !== id);
    if (duplicateNis) {
      return NextResponse.json({ error: `Siswa dengan NIS ${nis} sudah terdaftar atas nama ${duplicateNis.name}!` }, { status: 400 });
    }

    // Update fields
    studentsList[studentIndex].nisn = nisn;
    studentsList[studentIndex].nis = nis;
    studentsList[studentIndex].name = name;
    studentsList[studentIndex].class = studentClass;
    studentsList[studentIndex].gender = gender;
    studentsList[studentIndex].birth_place = birth_place;
    studentsList[studentIndex].birth_date = birth_date;
    studentsList[studentIndex].address = address;
    studentsList[studentIndex].parent_name = parent_name;
    studentsList[studentIndex].parent_phone = parent_phone;
    studentsList[studentIndex].status = status;

    const saved = await saveStudents(studentsList);

    if (saved) {
      await createAuditLog('UPDATE_STUDENT', `Memperbarui data siswa: "${name}" (NISN: ${nisn}, Kelas ${studentClass})`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in students PUT:", cacheErr);
      }
      return NextResponse.json({ success: true, student: studentsList[studentIndex] });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan perubahan data siswa." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID siswa tidak ditentukan." }, { status: 400 });
    }

    const studentsList = await loadStudents();
    const studentToDelete = studentsList.find(s => s.id === id);
    const studentName = studentToDelete ? studentToDelete.name : id;
    const studentNisn = studentToDelete ? studentToDelete.nisn : '';

    const filteredList = studentsList.filter(s => s.id !== id);

    if (filteredList.length === studentsList.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await supabase.from("students_sdn_bobong").delete().eq("id", id);
        } catch (dbErr) {
          console.error("Error direct delete from Supabase:", dbErr.message);
        }
      }
      await createAuditLog('DELETE_STUDENT', `Menghapus data siswa (langsung dari DB): "${studentName}" (NISN: ${studentNisn})`, request);
      return NextResponse.json({ success: true, message: "Data siswa sudah tidak ada." });
    }

    const saved = await saveStudents(filteredList);

    if (saved) {
      await createAuditLog('DELETE_STUDENT', `Menghapus data siswa: "${studentName}" (NISN: ${studentNisn})`, request);
      try {
        revalidatePath('/', 'layout');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in students DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus data siswa." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
