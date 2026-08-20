import { NextResponse } from 'next/server';
import { sensitiveJson } from '../../../../lib/api-helper';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '../../../../lib/supabase/server';
import { verifyAdminToken } from '../../../../lib/auth';
import { changePasswordSchema, parseBody } from '../../../../lib/validators';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    const isLocalAdminSession = await verifyAdminToken(token);

    // Get current user in Supabase (if any)
    let supabaseUser = null;
    let supabase = null;
    try {
      supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      supabaseUser = user;
    } catch (e) {}

    // Must be a valid admin session and have a Supabase user
    if (!isLocalAdminSession || !supabaseUser) {
      return sensitiveJson({ error: 'Unauthorized: Akses ditolak.' }, 401);
    }

    const parsed = await parseBody(request, changePasswordSchema);
    if (!parsed.success) return parsed.error;
    const { currentPassword, newPassword } = parsed.data;

    // 2. Case: Supabase Auth Session
    if (supabaseUser) {
      const email = supabaseUser.email;
      
      // Re-authenticate user to confirm current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword
      });

      if (signInError) {
        return sensitiveJson({ error: 'Password saat ini salah!' }, 400);
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        return sensitiveJson({ error: 'Gagal memperbarui password di Supabase: ' + updateError.message }, 500);
      }

      return sensitiveJson({ success: true, message: 'Password admin Supabase berhasil diperbarui!' });
    }

    return sensitiveJson({ error: 'Terjadi kesalahan pemrosesan.' }, 500);
  } catch (err) {
    return sensitiveJson({ error: 'Terjadi kesalahan server: ' + err.message }, 500);
  }
}
