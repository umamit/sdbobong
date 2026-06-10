import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '../../../../lib/supabase/server';
import { verifyAdminToken } from '../../../../lib/auth';
import { loadAuditLogs } from '../../../../lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAuth() {
  try {
    const cookieStore = await cookies();
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

export async function GET(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auditLogs = await loadAuditLogs();
    
    // Check search params for export parameter
    const { searchParams } = new URL(request.url);
    const isExport = searchParams.get('export') === 'true';

    if (isExport) {
      const escapeCsvValue = (val) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = [];
      // Header row
      csvRows.push(['No', 'Tanggal & Waktu', 'Pengguna', 'Aktivitas', 'Detail Jejak Log', 'Alamat IP', 'Perangkat (User Agent)'].map(escapeCsvValue).join(','));
      
      auditLogs.forEach((log, index) => {
        csvRows.push([
          index + 1,
          log.timestamp,
          log.username || 'Admin SDN Bobong',
          log.action,
          log.details,
          log.ip,
          log.userAgent
        ].map(escapeCsvValue).join(','));
      });

      const csvContent = "\uFEFF" + csvRows.join('\r\n'); // Add UTF-8 BOM for proper Excel rendering

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=jurnal_audit_sdn_bobong_${new Date().toISOString().split('T')[0]}.csv`,
        }
      });
    }

    return NextResponse.json({ auditLogs });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
