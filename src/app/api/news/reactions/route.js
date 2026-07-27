import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/database';

export const dynamic = 'force-dynamic';

// GET /api/news/reactions?news_id=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('news_id');
  if (!newsId) return NextResponse.json({ error: 'news_id required' }, { status: 400 });

  try {
    if (!supabase) return NextResponse.json({ reactions: [] }, { status: 200 });

    const { data: reactions, error } = await supabase
      .from('news_reactions_sdn_bobong')
      .select('*')
      .eq('news_id', newsId)
      .order('type', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ reactions: reactions || [] }, {
      headers: { 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }
    });
  } catch (error) {
    console.error('[reactions GET]', error?.message || error);
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

    if (!supabase) return NextResponse.json({ error: 'Layanan database sedang tidak tersedia' }, { status: 503 });

    // Fetch existing reaction row
    const { data: existing } = await supabase
      .from('news_reactions_sdn_bobong')
      .select('*')
      .eq('news_id', news_id)
      .eq('type', type)
      .single();

    let reaction;
    if (existing) {
      const { data, error } = await supabase
        .from('news_reactions_sdn_bobong')
        .update({ count: (existing.count || 0) + 1 })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      reaction = data;
    } else {
      const { data, error } = await supabase
        .from('news_reactions_sdn_bobong')
        .insert([{ news_id, type, count: 1 }])
        .select()
        .single();
      if (error) throw error;
      reaction = data;
    }

    return NextResponse.json({ reaction });
  } catch (error) {
    console.error('[reactions POST]', error?.message || error);
    return NextResponse.json({ error: 'Gagal menyimpan reaksi' }, { status: 500 });
  }
}
