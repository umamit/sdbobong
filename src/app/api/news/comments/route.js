import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/news/comments
// Jika ada ?news_id=xxx -> ambil komentar berita tertentu (maks 20)
// Jika tanpa news_id -> untuk Admin: ambil semua komentar beserta data judul beritanya
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('news_id');

  try {
    if (newsId) {
      const comments = await prisma.newsComment.findMany({
        where: { news_id: newsId },
        orderBy: { id: 'desc' },
        take: 20,
      });
      return NextResponse.json({ comments }, {
        headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
      });
    } else {
      // Ambil seluruh komentar untuk admin dashboard
      const comments = await prisma.newsComment.findMany({
        orderBy: { id: 'desc' },
      });

      // Ambil data judul berita pendukung
      const newsIds = [...new Set(comments.map(c => c.news_id))];
      const newsArticles = await prisma.news.findMany({
        where: { id: { in: newsIds } },
        select: { id: true, title: true }
      });

      const newsTitleMap = {};
      newsArticles.forEach(n => { newsTitleMap[n.id] = n.title; });

      const enrichedComments = comments.map(c => ({
        ...c,
        news_title: newsTitleMap[c.news_id] || 'Berita Telah Dihapus / Tidak Ditemukan'
      }));

      return NextResponse.json({ comments: enrichedComments }, {
        headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
      });
    }
  } catch (error) {
    console.error('[comments GET]', error);
    return NextResponse.json({ comments: [] }, { status: 200 });
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

// DELETE /api/news/comments?id=xxx (khusus admin moderasi)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');

  if (!idStr) return NextResponse.json({ error: 'id komentar wajib diisi' }, { status: 400 });

  try {
    const id = parseInt(idStr, 10);
    await prisma.newsComment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (error) {
    console.error('[comments DELETE]', error);
    return NextResponse.json({ error: 'Gagal menghapus komentar' }, { status: 500 });
  }
}
