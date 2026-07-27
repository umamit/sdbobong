import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

// GET /api/news/comments
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('news_id');

  try {
    if (!supabase) return NextResponse.json({ comments: [] }, { status: 200 });

    if (newsId) {
      const { data: comments, error } = await supabase
        .from('news_comments_sdn_bobong')
        .select('*')
        .eq('news_id', newsId)
        .order('id', { ascending: false })
        .limit(20);

      if (error) throw error;

      return NextResponse.json({ comments: comments || [] }, {
        headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
      });
    } else {
      const { data: comments, error } = await supabase
        .from('news_comments_sdn_bobong')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      const newsIds = [...new Set((comments || []).map(c => c.news_id))];
      let newsTitleMap = {};

      if (newsIds.length > 0) {
        const { data: newsArticles } = await supabase
          .from('news_sdn_bobong')
          .select('id, title')
          .in('id', newsIds);

        (newsArticles || []).forEach(n => { newsTitleMap[n.id] = n.title; });
      }

      const enrichedComments = (comments || []).map(c => ({
        ...c,
        news_title: newsTitleMap[c.news_id] || 'Berita Telah Dihapus / Tidak Ditemukan'
      }));

      return NextResponse.json({ comments: enrichedComments }, {
        headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
      });
    }
  } catch (error) {
    console.error('[comments GET]', error?.message || error);
    return NextResponse.json({ comments: [] }, { status: 200 });
  }
}

// POST /api/news/comments
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

    if (!supabase) return NextResponse.json({ error: 'Layanan database sedang tidak tersedia' }, { status: 503 });

    const { data: comment, error } = await supabase
      .from('news_comments_sdn_bobong')
      .insert([
        {
          news_id,
          nama: namaTrim,
          pesan: pesanTrim,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('[comments POST]', error?.message || error);
    return NextResponse.json({ error: 'Gagal menyimpan komentar' }, { status: 500 });
  }
}

// DELETE /api/news/comments?id=xxx
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');

  if (!idStr) return NextResponse.json({ error: 'id komentar wajib diisi' }, { status: 400 });

  try {
    const id = parseInt(idStr, 10);
    if (!supabase) return NextResponse.json({ error: 'Database tidak aktif' }, { status: 503 });

    const { error } = await supabase
      .from('news_comments_sdn_bobong')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (error) {
    console.error('[comments DELETE]', error?.message || error);
    return NextResponse.json({ error: 'Gagal menghapus komentar' }, { status: 500 });
  }
}
