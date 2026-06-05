export default async function sitemap() {
  const baseUrl = 'https://sdnegeribobong.sch.id'; 

  const routes = [
    '',
    '/profil',
    '/akademik',
    '/kesiswaan',
    '/ppdb',
    '/berita',
    '/ppdb-online',
    '/formulir-ppdb'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
