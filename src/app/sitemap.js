export default async function sitemap() {
  // Ganti dengan nama domain resmi Anda nanti (misalnya https://sdn-bobong.sch.id)
  const baseUrl = 'https://sdn-bobong.sch.id'; 

  const routes = [
    '',
    '/profil',
    '/akademik',
    '/kesiswaan',
    '/ppdb',
    '/berita',
    '/ppdb-online'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
