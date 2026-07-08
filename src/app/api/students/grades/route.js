import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loadStudents, saveStudents } from '../../../../lib/database';
import { verifyAdminToken, verifyTeacherToken } from '../../../../lib/auth';
import { createAuditLog } from '../../../../lib/audit';
import { sensitiveJson } from '../../../../lib/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nisn = searchParams.get('nisn')?.trim();
    const birthDate = searchParams.get('birth_date')?.trim(); // Expected: YYYY-MM-DD

    if (!nisn || !birthDate) {
      return NextResponse.json({ error: "NISN dan Tanggal Lahir wajib diisi!" }, { status: 400 });
    }

    const studentsList = await loadStudents();
    
    // Find matching student by NISN and birth_date
    const student = studentsList.find(
      s => s.nisn === nisn && s.birth_date === birthDate
    );

    if (!student) {
      return NextResponse.json({ error: "Siswa dengan NISN dan Tanggal Lahir tersebut tidak ditemukan!" }, { status: 404 });
    }

    // Return only public non-sensitive data and grades
    return sensitiveJson({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        nisn: student.nisn,
        nis: student.nis,
        class: student.class,
        gender: student.gender,
        birth_place: student.birth_place,
        birth_date: student.birth_date,
        status: student.status,
        grades: student.grades || null
      }
    });

  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // 1. Authenticate the user (Admin or Teacher)
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session_token')?.value;
    const teacherToken = cookieStore.get('teacher_session_token')?.value;

    let actorType = null;
    let actorName = 'System';

    if (adminToken && (await verifyAdminToken(adminToken))) {
      actorType = 'admin';
      actorName = 'Administrator';
    } else if (teacherToken) {
      const teacherPayload = await verifyTeacherToken(teacherToken);
      if (teacherPayload) {
        actorType = 'teacher';
        actorName = `Guru "${teacherPayload.name}"`;
      }
    }

    if (!actorType) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const body = await request.json();
    const studentId = body.studentId?.toString().trim();
    const grades = body.grades;

    if (!studentId || !grades) {
      return NextResponse.json({ error: "ID Siswa dan Nilai Rapor wajib dikirimkan!" }, { status: 400 });
    }

    // 3. Validate grades (0-100 or empty/null)
    const subjectKeys = ['ppkn', 'indonesia', 'matematika', 'ipas', 'seni', 'pjok', 'inggris', 'agama', 'mulok'];
    const sanitizedGrades = {};

    for (const key of subjectKeys) {
      const val = grades[key];
      if (val !== undefined && val !== null && val !== '') {
        const num = Number(val);
        if (isNaN(num) || num < 0 || num > 100) {
          return NextResponse.json({ error: `Nilai mata pelajaran "${key}" harus berupa angka antara 0 sampai 100!` }, { status: 400 });
        }
        sanitizedGrades[key] = Math.round(num).toString();
      } else {
        sanitizedGrades[key] = '';
      }
    }

    // 4. Load & Update student
    const studentsList = await loadStudents();
    const studentIndex = studentsList.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan!" }, { status: 404 });
    }

    const student = studentsList[studentIndex];
    studentsList[studentIndex].grades = sanitizedGrades;

    const saved = await saveStudents(studentsList);
    if (!saved) {
      return NextResponse.json({ error: "Gagal menyimpan nilai rapor ke database." }, { status: 500 });
    }

    // 5. Log audit trail and return
    await createAuditLog(
      'UPDATE_GRADES',
      `Nilai rapor siswa "${student.name}" (Kelas ${student.class}, NISN: ${student.nisn}) diperbarui oleh ${actorName}`,
      request
    );

    return NextResponse.json({
      success: true,
      student: studentsList[studentIndex]
    });

  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
