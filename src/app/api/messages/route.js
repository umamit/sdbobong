import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadMessages, saveMessages, isSupabaseEnabled, supabase } from '../../../lib/database';
import { prisma } from '../../../lib/prisma';
import { checkAuth } from '../../../lib/auth';
import { createAuditLog } from '../../../lib/audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


// GET: Returns approved guestbook entries for public, or all entries for admin
export async function GET() {
  try {
    const isAdmin = await checkAuth();
    const allMessages = await loadMessages();
    
    if (isAdmin) {
      return NextResponse.json(allMessages);
    } else {
      const approvedGuestbook = allMessages.filter(m => m.type === 'guestbook' && m.status === 'approved');
      return NextResponse.json(approvedGuestbook);
    }
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat pesan: " + e.message }, { status: 500 });
  }
}

// POST: Accepts new Guest Book or Feedback submission
export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.toString().trim();
    const role = body.role?.toString().trim();
    const type = body.type?.toString().trim(); // 'guestbook' or 'feedback'
    const message = body.message?.toString().trim();

    if (!name || !role || !type || !message) {
      return NextResponse.json({ error: "Semua kolom formulir wajib diisi!" }, { status: 400 });
    }

    if (!['guestbook', 'feedback'].includes(type)) {
      return NextResponse.json({ error: "Tipe pesan tidak valid!" }, { status: 400 });
    }

    const allowedRoles = ['Alumni', 'Wali Murid', 'Masyarakat', 'Siswa'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Kategori pengirim tidak valid!" }, { status: 400 });
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
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID pesan tidak ditentukan." }, { status: 400 });
    }

    const allMessages = await loadMessages();
    const msgToDelete = allMessages.find(m => m.id === id);
    const senderName = msgToDelete ? msgToDelete.name : id;
    const msgType = msgToDelete?.type === 'guestbook' ? 'Buku Tamu' : 'Saran';

    const filteredList = allMessages.filter(m => m.id !== id);

    if (filteredList.length === allMessages.length) {
      if (isSupabaseEnabled() && supabase) {
        try {
          await prisma.message.deleteMany({ where: { id } });
        } catch (dbErr) {
          console.error("Error direct delete from Prisma:", dbErr.message || dbErr);
        }
      }
      await createAuditLog('DELETE_MESSAGE', `Menghapus pesan ${msgType} (langsung dari DB) dari "${senderName}" (ID: ${id})`, request);
      try {
        revalidatePath('/buku-tamu');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in messages DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true, message: "Pesan sudah tidak ada." });
    }

    const saved = await saveMessages(filteredList);

    if (saved) {
      await createAuditLog('DELETE_MESSAGE', `Menghapus pesan ${msgType} dari "${senderName}" (ID: ${id})`, request);
      try {
        revalidatePath('/buku-tamu');
      } catch (cacheErr) {
        console.error("Cache revalidation failed in messages DELETE:", cacheErr);
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus pesan." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
