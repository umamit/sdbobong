const PATH_LABELS = {
  profil: 'Profil',
  sejarah: 'Sejarah Singkat',
  visi: 'Visi & Misi',
  guru: 'Tenaga Pendidik',
  sarpras: 'Sarana & Prasarana',
  prestasi: 'Prestasi Sekolah',
  'standar-pelayanan': 'Standar Pelayanan Publik',
  akademik: 'Akademik',
  kurikulum: 'Kurikulum Merdeka',
  kalender: 'Kalender Pendidikan',
  ekstrakurikuler: 'Ekstrakurikuler',
  berita: 'Kabar & Berita',
  ppdb: 'PPDB Online',
  alur: 'Alur & Persyaratan',
  jadwal: 'Jadwal & Kuota',
  daftar: 'Pendaftaran Siswa Baru',
  kontak: 'Hubungi Kami',
  faq: 'Tanya Jawab (FAQ)'
};

export function generateBreadcrumbSchema(pathname = '', customLastItem = null) {
  const origin = 'https://www.sdnegeribobong.sch.id';
  const cleanPath = (pathname || '').split('?')[0].split('#')[0];
  const segments = cleanPath.split('/').filter(Boolean);

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Beranda',
      item: `${origin}/`
    }
  ];

  let currentPath = '';
  segments.forEach((seg, idx) => {
    currentPath += `/${seg}`;
    const position = idx + 2;
    const isLast = idx === segments.length - 1;

    let name = PATH_LABELS[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (isLast && customLastItem?.name) {
      name = customLastItem.name;
    }

    itemListElement.push({
      '@type': 'ListItem',
      position,
      name,
      item: `${origin}${currentPath}`
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}
