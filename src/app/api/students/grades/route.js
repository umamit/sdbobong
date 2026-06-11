import { NextResponse } from 'next/server';
import { loadStudents } from '../../../../lib/database';

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
    return NextResponse.json({
      success: true,
      student: {
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
