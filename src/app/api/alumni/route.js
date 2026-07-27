import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { loadAlumni, createAlumniRecord, deleteAlumniRecord, invalidateAlumniCache } from '../../../lib/database';

export const dynamic = 'force-dynamic';

// GET /api/alumni?year=2020&search=budi
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const search = searchParams.get('search');

  try {
    let alumni = await loadAlumni();

    if (year && year !== 'Semua') {
      alumni = alumni.filter(a => String(a.tahun_lulus) === String(year));
    }

    if (search) {
      const q = search.toLowerCase();
      alumni = alumni.filter(a =>
        (a.nama_lengkap || '').toLowerCase().includes(q) ||
        (a.sekolah_lanjutan || '').toLowerCase().includes(q) ||
        (a.pekerjaan || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ alumni }, {
      headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
    });
  } catch (error) {
    console.error('[alumni GET error]', error);
    // Graceful fallback according to Rule 16
    return NextResponse.json({ alumni: [] }, { status: 200 });
  }
}

// POST /api/alumni (Pendaftaran Alumni Baru)
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_lengkap, tahun_lulus, sekolah_lanjutan, pekerjaan, pesan_kesan } = body;

    const namaTrim = (nama_lengkap || '').trim();
    const tahunTrim = (tahun_lulus || '').trim();
    const sekolahTrim = (sekolah_lanjutan || '').trim();
    const pekerjaanTrim = (pekerjaan || '').trim();
    const pesanTrim = (pesan_kesan || '').trim();

    if (namaTrim.length < 2) {
      return NextResponse.json({ error: 'Nama lengkap minimal 2 karakter' }, { status: 400 });
    }

    if (!tahunTrim || isNaN(tahunTrim) || parseInt(tahunTrim, 10) < 1950 || parseInt(tahunTrim, 10) > 2030) {
      return NextResponse.json({ error: 'Tahun lulus tidak valid' }, { status: 400 });
    }

    const newAlumni = await createAlumniRecord({
      nama_lengkap: namaTrim,
      tahun_lulus: tahunTrim,
      sekolah_lanjutan: sekolahTrim || null,
      pekerjaan: pekerjaanTrim || null,
      pesan_kesan: pesanTrim || null,
      status: 'Pending',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ alumni: newAlumni }, { status: 201 });
  } catch (error) {
    console.error('[alumni POST error]', error);
    return NextResponse.json({ error: 'Gagal mendaftarkan alumni' }, { status: 500 });
  }
}

// PATCH /api/alumni?id=xxx (Ubah Status Alumni oleh Admin: Approved / Rejected)
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');

  if (!idStr) return NextResponse.json({ error: 'ID alumni wajib diisi' }, { status: 400 });

  try {
    const id = parseInt(idStr, 10);
    const body = await request.json();
    const { status } = body;

    if (!status || !['Approved', 'Pending', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    let updated = null;
    try {
      updated = await prisma.alumni.update({
        where: { id },
        data: { status },
      });
    } catch (e) {
      console.error("Prisma update alumni failed, invalidating cache:", e);
    }
    invalidateAlumniCache();

    return NextResponse.json({ alumni: updated || { id, status } });
  } catch (error) {
    console.error('[alumni PATCH error]', error);
    return NextResponse.json({ error: 'Gagal menyetujui status alumni' }, { status: 500 });
  }
}

// DELETE /api/alumni?id=xxx (Hapus data oleh Admin)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');

  if (!idStr) return NextResponse.json({ error: 'ID alumni wajib diisi' }, { status: 400 });

  try {
    const id = parseInt(idStr, 10);
    await deleteAlumniRecord(id);
    return NextResponse.json({ success: true, message: 'Data alumni berhasil dihapus' });
  } catch (error) {
    console.error('[alumni DELETE error]', error);
    return NextResponse.json({ error: 'Gagal menghapus data alumni' }, { status: 500 });
  }
}
