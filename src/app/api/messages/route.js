import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadMessages, saveMessages, isSupabaseEnabled, supabase } from '../../../lib/database';
import { prisma } from '../../../lib/prisma';
import { checkAuth } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';
import { handleApiDelete, sensitiveJson } from '../../../lib/api-helper';
import { messageSchema, parseBody } from '../../../lib/validators';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


// GET: Returns approved guestbook entries for public, or all entries for admin
export async function GET() {
  try {
    const isAdmin = await checkAuth();
    const allMessages = await loadMessages();
    
    if (isAdmin) {
      return sensitiveJson(allMessages);
    } else {
      const approvedGuestbook = allMessages.filter(m => m.type === 'guestbook' && m.status === 'approved');
      return sensitiveJson(approvedGuestbook);
    }
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat pesan: " + e.message }, { status: 500 });
  }
}

// POST: Accepts new Guest Book or Feedback submission
export async function POST(request) {
  try {
    const parsed = await parseBody(request, messageSchema);
    if (!parsed.success) return parsed.error;
    const { name, role, type, message } = parsed.data;

    const allowedRoles = ['Alumni', 'Wali Murid', 'Masyarakat', 'Siswa'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Kategori pengirim tidak valid!' }, { status: 400 });
    }

    const allMessages = await loadMessages();
    const newMsg = {
      id: `msg-${Date.now()}`,
      name,
      role,
      type,
      message,
      status: 'pending', // must be moderated by admin
      date: new Date().toISOString()
    };

    allMessages.unshift(newMsg);
    const saved = await saveMessages(allMessages);

    if (saved) {
      try {
        revalidatePath('/buku-tamu');
        revalidatePath('/kontak/buku-tamu');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in messages POST:", cacheErr);
      }
      return NextResponse.json({ success: true, message: newMsg });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan pesan ke database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

// PUT: Moderates a message status (admin only)
export async function PUT(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status moderasi wajib ditentukan." }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: "Status moderasi tidak valid." }, { status: 400 });
    }

    const allMessages = await loadMessages();
    const index = allMessages.findIndex(m => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
    }

    allMessages[index].status = status;
    const saved = await saveMessages(allMessages);

    if (saved) {
      const targetMsg = allMessages[index];
      const labelStatus = status === 'approved' ? 'menyetujui' : (status === 'rejected' ? 'menolak' : 'menangguhkan');
      await createAuditLog('MODERATE_MESSAGE', `Mengubah status moderasi pesan (${labelStatus}) dari "${targetMsg.name}"`, request);
      try {
        revalidatePath('/buku-tamu');
        revalidatePath('/kontak/buku-tamu');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in messages PUT:", cacheErr);
      }
      return NextResponse.json({ success: true, message: allMessages[index] });
    } else {
      return NextResponse.json({ error: "Gagal merubah status moderasi pesan." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

// DELETE: Deletes a message (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID pesan tidak ditentukan." }, { status: 400 });
    }

    return handleApiDelete({
      request,
      id,
      loadFn: loadMessages,
      saveFn: saveMessages,
      prismaModel: prisma.message,
      auditAction: 'DELETE_MESSAGE',
      getItemName: (m) => `pesan ${m.type === 'guestbook' ? 'Buku Tamu' : 'Saran'} dari "${m.name}" (ID: ${m.id})`,
      revalidatePaths: ['/buku-tamu', '/kontak/buku-tamu']
    });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
