import fs from 'fs';
import { isSupabaseEnabled, NEWS_JSON, packImagesIntoContent, unpackImagesFromContent, getFreshCachedNews, setCachedNews, invalidateNewsCache } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';
import { prisma } from '../prisma.js';

export async function getAvailableNewsColumns() {
  return ['id', 'title', 'date', 'category', 'image', 'content', 'images'];
}

function getNewsSortKey(item) {
  const dateStr = item.date || "";
  try {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return parts[0].length === 4
          ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime()
          : new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
      }
    }
    const monthsMap = {
      "jan":0,"feb":1,"mar":2,"apr":3,"mei":4,"jun":5,"jul":6,"agu":7,"sep":8,"okt":9,"nov":10,"des":11,
      "januari":0,"februari":1,"maret":2,"april":3,"juni":5,"juli":6,"agustus":7,"september":8,"oktober":9,"november":10,"desember":11
    };
    const parts = dateStr.toLowerCase().replace(/,/g,'').split(/\s+/);
    if (parts.length === 3) return new Date(parseInt(parts[2]), monthsMap[parts[1]] ?? 0, parseInt(parts[0])).getTime();
  } catch (e) {}
  const match = (item.id || "").match(/\d+/);
  if (match) { const val = parseInt(match[0]); return val < 100 ? new Date(2025, 11 - val, 1).getTime() : val * 1000; }
  return 0;
}

export async function loadNews() {
  const fresh = getFreshCachedNews();
  if (fresh) return fresh;

  let localNews = [];
  if (fs.existsSync(NEWS_JSON)) {
    try { localNews = JSON.parse(fs.readFileSync(NEWS_JSON, 'utf-8')).map(n => ({ ...n, images: n.images || (n.image ? [n.image] : []) })); }
    catch (e) { console.error("Error loading local news:", e); }
  }
  if (!isSupabaseEnabled()) {
    setCachedNews(localNews);
    return localNews;
  }
  try {
    const supabaseNews = await prisma.news.findMany();
    const newsSeeded = await isTableSeeded("news");
    if ((!supabaseNews || supabaseNews.length === 0) && localNews.length > 0 && !newsSeeded) {
      for (const article of localNews) {
        await prisma.news.create({
          data: {
            id: article.id,
            title: article.title,
            date: article.date,
            category: article.category,
            image: article.image,
            content: packImagesIntoContent(article.content, article.images || (article.image ? [article.image] : [])),
            images: article.images || (article.image ? [article.image] : [])
          }
        });
      }
      await markTableSeeded("news");
      setCachedNews(localNews);
      return localNews;
    }
    if (supabaseNews && supabaseNews.length > 0 && !newsSeeded) await markTableSeeded("news");
    if (supabaseNews) {
      const newsList = supabaseNews.map(n => {
        const localArticle = localNews.find(ln => ln.id === n.id);
        const fallbackImages = n.images ? (typeof n.images === 'string' ? JSON.parse(n.images) : n.images) : (localArticle?.images?.length > 0 ? localArticle.images : (n.image ? [n.image] : []));
        const unpacked = unpackImagesFromContent(n.content, fallbackImages);
        return { id: n.id, title: n.title, date: n.date, category: n.category, image: n.image, content: unpacked.cleanContent, images: unpacked.images };
      });
      newsList.sort((a, b) => getNewsSortKey(b) - getNewsSortKey(a));
      try { fs.writeFileSync(NEWS_JSON, JSON.stringify(newsList, null, 4), 'utf-8'); } catch (e) {}
      setCachedNews(newsList);
      return newsList;
    }
  } catch (e) { console.error("Error loading news from Supabase via Prisma:", e.message || e); }
  setCachedNews(localNews);
  return localNews;
}

export async function saveNews(newsList) {
  let localSaved = false;
  try { fs.writeFileSync(NEWS_JSON, JSON.stringify(newsList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving news locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const article of newsList) {
        const packedContent = packImagesIntoContent(article.content, article.images || (article.image ? [article.image] : []));
        const imagesPayload = article.images || (article.image ? [article.image] : []);
        await prisma.news.upsert({
          where: { id: article.id },
          update: {
            title: article.title,
            date: article.date,
            category: article.category,
            image: article.image,
            content: packedContent,
            images: imagesPayload
          },
          create: {
            id: article.id,
            title: article.title,
            date: article.date,
            category: article.category,
            image: article.image,
            content: packedContent,
            images: imagesPayload
          }
        });
      }
      const localIds = new Set(newsList.map(n => n.id));
      const supabaseNews = await prisma.news.findMany({ select: { id: true } });
      if (supabaseNews) {
        for (const row of supabaseNews) {
          if (!localIds.has(row.id)) {
            await prisma.news.delete({ where: { id: row.id } });
          }
        }
      }
      invalidateNewsCache();
      return true;
    } catch (e) { console.error("Error saving news to Supabase via Prisma:", e.message || e); return localSaved; }
  }
  invalidateNewsCache();
  return localSaved;
}
