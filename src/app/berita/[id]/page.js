import { loadNews } from '../../../lib/database';
import BeritaSearchClient from '../BeritaSearchClient';
import { FramerWordReveal } from '../../../components/FramerReveal';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Cache 60s untuk efisiensi Fluid CPU Vercel

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const newsList = await loadNews().catch(() => []);
  const article = newsList.find(n => n.id === id || n.id.replace(/^news-/, '') === id.replace(/^news-/, ''));

  if (!article) {
    return { title: 'Artikel Tidak Ditemukan - SD Negeri Bobong' };
  }

  const plainText = article.content ? article.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').substring(0, 150) : '';
  const origin = 'https://www.sdnegeribobong.sch.id';
  const imageUrl = article.image && !article.image.startsWith('data:')
    ? (article.image.startsWith('http') ? article.image : `${origin}${article.image}`)
    : `${origin}/images/logo_sekolah_512.png`;

  return {
    title: `${article.title} - SD Negeri Bobong`,
    description: plainText || article.title,
    openGraph: {
      title: article.title,
      description: plainText || article.title,
      images: [imageUrl],
      type: 'article',
    }
  };
}

export default async function BeritaDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const newsList = await loadNews().catch(() => []);
  const cleanId = id.replace(/^news-/, '');
  const article = newsList.find(n => n.id === id || n.id.replace(/^news-/, '') === cleanId);

  if (!article) {
    notFound();
  }

  // Generate LD+JSON Schema for Google NewsArticle
  const origin = 'https://www.sdnegeribobong.sch.id';
  const rawImages = article.images && article.images.length > 0 ? article.images : [article.image || '/images/logo_sekolah_512.png'];
  const images = rawImages
    .filter(img => img && !img.startsWith('data:'))
    .map(img => img.startsWith('http') ? img : `${origin}${img}`);
  if (images.length === 0) {
    images.push(`${origin}/images/logo_sekolah_512.png`);
  }
  const plainText = article.content ? article.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').substring(0, 150) : '';
  
  let publishDate = new Date();
  if (article.date) {
    const parsed = new Date(article.date);
    if (!isNaN(parsed.getTime())) {
      publishDate = parsed;
    }
  }
  const isoDateStr = publishDate.toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `https://www.sdnegeribobong.sch.id/berita/${article.id}`,
    "headline": article.title,
    "image": images,
    "datePublished": isoDateStr,
    "dateModified": isoDateStr,
    "author": {
      "@type": "Organization",
      "name": "SD Negeri Bobong",
      "url": "https://www.sdnegeribobong.sch.id"
    },
    "publisher": {
      "@type": "School",
      "name": "SD Negeri Bobong",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.sdnegeribobong.sch.id/images/logo_sekolah_512.png"
      }
    },
    "description": plainText || article.title
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}><FramerWordReveal text="Berita Sekolah" /></h1>
          <p className="hero-text" style={{ marginBottom: 0 }}>Kabar terkini dan dokumentasi aktivitas harian keluarga besar SD Negeri Bobong.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Kabar SD Negeri Bobong</span>
            <h2>Kabar & Artikel Sekolah</h2>
          </div>
          <BeritaSearchClient newsList={newsList} initialIsolatedId={article.id} />
        </div>
      </section>
    </>
  );
}
