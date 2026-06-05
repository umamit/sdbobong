export default async function sitemap() {
  const baseUrl = 'https://sdnegeribobong.sch.id'; 

  // =========================================================================
  // PANDUAN PENGEMBANGAN (SEO):
  // Jika Anda menambahkan halaman publik baru (misalnya '/kontak', '/fasilitas', dll.),
  // silakan tambahkan rute tersebut ke dalam array `routes` di bawah ini.
  // Ini memastikan Googlebot dapat mengindeks halaman tersebut melalui sitemap.xml.
  // =========================================================================
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
