import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { loadNews, saveNews, handlePhotoUpload } from '../../../lib/database';

async function checkAuth() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const newsList = await loadNews();
    return NextResponse.json(newsList);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat berita: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    const date = formData.get('date')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    let image = formData.get('image')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    // Process photo upload
    const photoFile = formData.get('photo');
    const uploadedUrl = await handlePhotoUpload(photoFile, 'news', ['png', 'jpg', 'jpeg']);

    if (uploadedUrl === 'INVALID_TYPE') {
      return NextResponse.json({ error: "Jenis file tidak valid! Hanya file PNG, JPG, dan JPEG yang diperbolehkan." }, { status: 400 });
    } else if (uploadedUrl === 'ERROR') {
      return NextResponse.json({ error: "Gagal mengunggah foto." }, { status: 500 });
    } else if (uploadedUrl && uploadedUrl !== 'NO_FILE') {
      image = uploadedUrl;
    }

    if (!title || !date || !category || !image || !content) {
      return NextResponse.json({ error: "Semua kolom berita wajib diisi!" }, { status: 400 });
    }

    const newsList = await loadNews();
    const newArticle = {
      id: `news-${Math.floor(Date.now() / 1000)}`,
      title,
      date,
      category,
      image,
      content
    };

    newsList.unshift(newArticle);
    const saved = await saveNews(newsList);

    if (saved) {
      return NextResponse.json({ success: true, article: newArticle });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan berita baru ke database." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID berita tidak ditentukan." }, { status: 400 });
    }

    const newsList = await loadNews();
    const filteredList = newsList.filter(n => n.id !== id);

    if (filteredList.length === newsList.length) {
      return NextResponse.json({ error: "Artikel berita tidak ditemukan." }, { status: 404 });
    }

    const saved = await saveNews(filteredList);

    if (saved) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Gagal menghapus berita." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan server: " + e.message }, { status: 500 });
  }
}
