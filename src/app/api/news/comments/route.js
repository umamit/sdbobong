import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/news/comments?news_id=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('news_id');
  if (!newsId) return NextResponse.json({ error: 'news_id required' }, { status: 400 });

  try {
    const comments = await prisma.newsComment.findMany({
      where: { news_id: newsId },
      orderBy: { id: 'desc' },
      take: 20,
    });
    return NextResponse.json({ comments }, {
      headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
    });
  } catch (error) {
    console.error('[comments GET]', error);
    return NextResponse.json({ error: 'Gagal memuat komentar' }, { status: 500 });
  }
}

// POST /api/news/comments  { news_id, nama, pesan }
export async function POST(request) {
  try {
    const body = await request.json();
    const { news_id, nama, pesan } = body;

    if (!news_id) return NextResponse.json({ error: 'news_id wajib diisi' }, { status: 400 });

    const namaTrim = (nama || '').trim();
    const pesanTrim = (pesan || '').trim();

    if (namaTrim.length < 2) return NextResponse.json({ error: 'Nama minimal 2 karakter' }, { status: 400 });
    if (pesanTrim.length < 5) return NextResponse.json({ error: 'Komentar minimal 5 karakter' }, { status: 400 });
    if (namaTrim.length > 80) return NextResponse.json({ error: 'Nama terlalu panjang' }, { status: 400 });
    if (pesanTrim.length > 500) return NextResponse.json({ error: 'Komentar maksimal 500 karakter' }, { status: 400 });

    const comment = await prisma.newsComment.create({
      data: {
        news_id,
        nama: namaTrim,
        pesan: pesanTrim,
        created_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('[comments POST]', error);
    return NextResponse.json({ error: 'Gagal menyimpan komentar' }, { status: 500 });
  }
}
