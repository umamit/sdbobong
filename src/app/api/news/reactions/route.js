import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/news/reactions?news_id=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('news_id');
  if (!newsId) return NextResponse.json({ error: 'news_id required' }, { status: 400 });

  try {
    const reactions = await prisma.newsReaction.findMany({
      where: { news_id: newsId },
      orderBy: { type: 'asc' },
    });
    return NextResponse.json({ reactions }, {
      headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
    });
  } catch (error) {
    console.error('[reactions GET]', error);
    return NextResponse.json({ reactions: [] }, { status: 200 });
  }
}

// POST /api/news/reactions  { news_id, type }
export async function POST(request) {
  try {
    const body = await request.json();
    const { news_id, type } = body;

    const VALID_TYPES = ['suka', 'keren', 'haru', 'semangat', 'informatif'];
    if (!news_id || !type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    // Upsert: tambah row jika belum ada, atau increment count
    const reaction = await prisma.newsReaction.upsert({
      where: { news_id_type: { news_id, type } },
      update: { count: { increment: 1 } },
      create: { news_id, type, count: 1 },
    });

    return NextResponse.json({ reaction });
  } catch (error) {
    console.error('[reactions POST]', error);
    return NextResponse.json({ error: 'Gagal menyimpan reaksi' }, { status: 500 });
  }
}
