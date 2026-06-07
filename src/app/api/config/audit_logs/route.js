import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '../../../../lib/supabase/server';
import { verifyAdminToken } from '../../../../lib/auth';
import { loadAuditLogs } from '../../../../lib/audit';

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
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auditLogs = await loadAuditLogs();
    return NextResponse.json({ auditLogs });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
