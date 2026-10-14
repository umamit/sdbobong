import { NextResponse } from 'next/server';
import { loadComplaints, saveComplaint, handlePhotoUpload } from '../../../lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticket = searchParams.get('ticket')?.trim();

    const complaints = await loadComplaints();

    if (ticket) {
      const match = complaints.find(c => c.ticket_code.toUpperCase() === ticket.toUpperCase());
      if (!match) {
        return NextResponse.json({ error: 'Pengaduan dengan nomor tiket tersebut tidak ditemukan.' }, { status: 404 });
      }
      return NextResponse.json({
        complaint: {
          ticket_code: match.ticket_code,
          category: match.category,
          status: match.status,
          created_at: match.created_at,
          response: match.response,
          message: match.message
        }
      });
    }

    return NextResponse.json({ complaints });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal mengambil data pengaduan: ' + err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const category = formData.get('category')?.toString().trim();
    const message = formData.get('message')?.toString().trim();
    const isAnonymous = formData.get('is_anonymous') === 'true';
    const reporterName = formData.get('reporter_name')?.toString().trim() || null;
    const reporterPhone = formData.get('reporter_phone')?.toString().trim() || null;
    const photoFile = formData.get('photo');

    if (!category || !message) {
      return NextResponse.json({ error: 'Kategori dan rincian pesan pengaduan wajib diisi.' }, { status: 400 });
    }

    let photoUrl = null;
    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      photoUrl = await handlePhotoUpload(photoFile, 'complaints', ['png', 'jpg', 'jpeg']);
      if (photoUrl === 'INVALID_TYPE' || photoUrl === 'ERROR') {
        photoUrl = null;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `SDB-${Date.now().toString().slice(-4)}${randomSuffix}`;
    const id = `cmp-${Date.now()}`;

    const newRecord = {
      id,
      ticket_code: ticketCode,
      category,
      message,
      photo_url: photoUrl,
      is_anonymous: isAnonymous,
      reporter_name: isAnonymous ? 'Anonim' : reporterName,
      reporter_phone: isAnonymous ? null : reporterPhone,
      status: 'Menunggu',
      response: null,
      created_at: new Date().toISOString()
    };

    await saveComplaint(newRecord);

    return NextResponse.json({
      success: true,
      ticket_code: ticketCode,
      message: 'Laporan pengaduan berhasil dikirim secara aman.'
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal mengirim pengaduan: ' + err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, response } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID pengaduan wajib disertakan.' }, { status: 400 });
    }

    const complaints = await loadComplaints();
    const existing = complaints.find(c => c.id === id || c.ticket_code === id);
    if (!existing) {
      return NextResponse.json({ error: 'Pengaduan tidak ditemukan.' }, { status: 404 });
    }

    const updated = {
      ...existing,
      status: status || existing.status,
      response: response !== undefined ? response : existing.response,
      updated_at: new Date().toISOString()
    };

    await saveComplaint(updated);
    return NextResponse.json({ success: true, complaint: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memperbarui status pengaduan: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID pengaduan wajib disertakan.' }, { status: 400 });
    }

    const { deleteComplaint } = await import('../../../lib/database');
    await deleteComplaint(id);

    return NextResponse.json({ success: true, message: 'Tiket pengaduan berhasil dihapus.' });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menghapus pengaduan: ' + err.message }, { status: 500 });
  }
}
