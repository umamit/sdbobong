import { loadNews } from '../../../lib/database';
import BeritaSearchClient from '../BeritaSearchClient';
import { FramerWordReveal } from '../../../components/FramerReveal';
import { notFound } from 'next/navigation';
import { generateBreadcrumbSchema, parseIndoDateToIso } from '../../../lib/breadcrumbs';

export const revalidate = 60; // Cache 60s untuk efisiensi Fluid CPU Vercel

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const newsList = await loadNews().catch(() => []);
  const article = newsList.find(n => n.id === id || n.id.replace(/^news-/, '') === id.replace(/^news-/, ''));

  if (!article) {
    return { title: 'Artikel Tidak Ditemukan - SD Negeri Bobong' };
  }

  const cleanTitle = article.title.replace(/\s*\|\s*SD(N| Negeri) Bobong$/i, '').trim();
  const plainText = article.content
    ? article.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 155)
    : '';
  const origin = 'https://www.sdnegeribobong.sch.id';
  const canonicalUrl = `${origin}/berita/${article.id}`;
  const rawImages = article.images && article.images.length > 0 ? article.images : [article.image || '/images/logo_sekolah_512.png'];
  const ogImages = rawImages
    .filter(img => img && !img.startsWith('data:'))
    .map(img => ({ url: img.startsWith('http') ? img : `${origin}${img}`, alt: cleanTitle }));
  if (ogImages.length === 0) ogImages.push({ url: `${origin}/images/logo_sekolah_512.png`, alt: cleanTitle });
  const isoDateStr = parseIndoDateToIso(article.date);

  return {
    title: cleanTitle,
    description: plainText || cleanTitle,
    keywords: [article.category || 'Berita Sekolah', 'SD Negeri Bobong', 'SDN Bobong', 'Pulau Taliabu', cleanTitle],
    authors: [{ name: 'SD Negeri Bobong', url: origin }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: cleanTitle,
      description: plainText || cleanTitle,
      url: canonicalUrl,
      siteName: 'SD Negeri Bobong',
      locale: 'id_ID',
      images: ogImages,
      type: 'article',
      publishedTime: isoDateStr,
      modifiedTime: isoDateStr,
      section: article.category || 'Kegiatan Sekolah',
      authors: ['SD Negeri Bobong']
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: plainText || cleanTitle,
      images: ogImages.map(img => img.url)
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
  const cleanTitle = article.title.replace(/\s*\|\s*SD(N| Negeri) Bobong$/i, '').trim();
  const rawImages = article.images && article.images.length > 0 ? article.images : [article.image || '/images/logo_sekolah_512.png'];
  const images = rawImages
    .filter(img => img && !img.startsWith('data:'))
    .map(img => img.startsWith('http') ? img : `${origin}${img}`);
  if (images.length === 0) {
    images.push(`${origin}/images/logo_sekolah_512.png`);
  }
  const fullPlainText = article.content
    ? article.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
  const plainText = fullPlainText.substring(0, 155);
  const isoDateStr = parseIndoDateToIso(article.date);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${origin}/berita/${article.id}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${origin}/berita/${article.id}`
    },
    "headline": cleanTitle,
    "image": images,
    "datePublished": isoDateStr,
    "dateModified": isoDateStr,
    "articleSection": article.category || "Kegiatan",
    "inLanguage": "id-ID",
    "author": {
      "@type": "Organization",
      "name": "SD Negeri Bobong",
      "url": origin
    },
    "publisher": {
      "@type": "School",
      "name": "SD Negeri Bobong",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/images/logo_sekolah_512.png`
      }
    },
    "description": plainText || cleanTitle,
    "articleBody": fullPlainText || cleanTitle
  };

  const breadcrumbSchema = generateBreadcrumbSchema(`/berita/${article.id}`, { name: cleanTitle });
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
      />
      <section className="hero" style={{ padding: 'var(--space-lg) var(--space-sm)', minHeight: 'auto' }}>
        <div className="container hero-content">
          <div className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 800 }}><FramerWordReveal text="Berita Sekolah" /></div>
          <p className="hero-text" style={{ marginBottom: 0 }}>Kabar terkini dan dokumentasi aktivitas harian keluarga besar SD Negeri Bobong.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{article.category || 'Kabar SD Negeri Bobong'} • {article.date}</span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginTop: '6px' }}>{cleanTitle}</h1>
          </div>
          <BeritaSearchClient newsList={newsList} initialIsolatedId={article.id} />
        </div>
      </section>
    </>
  );
}
