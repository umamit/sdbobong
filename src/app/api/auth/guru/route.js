import { NextResponse } from 'next/server';
import { sensitiveJson } from '../../../../lib/api-helper';
import { loadTeachers } from '../../../../lib/database';
import { createTeacherToken } from '../../../../lib/auth';
import { createAuditLog } from '../../../../lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const { nip, password } = await request.json();

    const cleanInputNip = (nip || '').toString().trim().replace(/\s+/g, '');
    const cleanInputPassword = (password || '').toString().trim();

    if (!cleanInputNip || !cleanInputPassword) {
      return sensitiveJson({ error: "NIP dan Password wajib diisi!" }, 400);
    }

    const teachersList = await loadTeachers(true);
    
    // Find teacher matching NIP
    const teacher = teachersList.find(t => {
      if (!t.nip) return false;
      const normalizedDbNip = t.nip.toString().replace(/\s+/g, '');
      return normalizedDbNip === cleanInputNip;
    });

    if (!teacher) {
      await createAuditLog('GURU_LOGIN_FAILED', `Gagal login guru: NIP ${nip} tidak ditemukan`, request);
      return sensitiveJson({ error: "NIP atau Password salah!" }, 401);
    }

    // Determine expected password
    const dbPassword = (teacher.password || '').toString().trim();
    const normalizedDbNip = teacher.nip.toString().replace(/\s+/g, '');
    const defaultPassword = teacher.nip.toString().trim(); // either raw with spaces or normalized

    let isMatch = false;
    if (dbPassword) {
      // Custom password exists
      isMatch = (cleanInputPassword === dbPassword);
    } else {
      // Default password: NIP itself (we accept both formatted NIP and normalized NIP)
      isMatch = (cleanInputPassword === defaultPassword || cleanInputPassword === normalizedDbNip);
    }

    if (!isMatch) {
      await createAuditLog('GURU_LOGIN_FAILED', `Gagal login guru: Password salah untuk NIP ${teacher.nip}`, request);
      return sensitiveJson({ error: "NIP atau Password salah!" }, 401);
    }

    // Successful login
    const response = sensitiveJson({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        role: teacher.role,
        nip: teacher.nip
      }
    });

    const secureToken = await createTeacherToken(teacher);
    response.cookies.set('teacher_session_token', secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14400 // 4 hours
    });

    await createAuditLog('GURU_LOGIN', `Guru "${teacher.name}" (NIP: ${teacher.nip}) berhasil masuk`, request);
    return response;

  } catch (e) {
    return sensitiveJson({ error: "Terjadi kesalahan server: " + e.message }, 500);
  }
}

export async function DELETE(request) {
  try {
    const response = sensitiveJson({ success: true });
    
    // Clear teacher session token cookie
    response.cookies.set('teacher_session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0
    });

    await createAuditLog('GURU_LOGOUT', `Guru keluar dari sistem (Sesi diakhiri secara manual)`, request);
    return response;
  } catch (e) {
    return sensitiveJson({ error: "Gagal logout: " + e.message }, 500);
  }
}
