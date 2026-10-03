const PATH_LABELS = {
  profil: 'Profil',
  sejarah: 'Sejarah Singkat',
  visi: 'Visi & Misi',
  'visi-misi': 'Visi & Misi',
  guru: 'Tenaga Pendidik',
  struktur: 'Struktur & Dewan Guru',
  sarpras: 'Sarana & Prasarana',
  fasilitas: 'Fasilitas & Denah',
  prestasi: 'Prestasi Sekolah',
  'standar-pelayanan': 'Standar Pelayanan Publik',
  akademik: 'Akademik',
  kurikulum: 'Kurikulum Merdeka',
  kalender: 'Kalender Pendidikan',
  kuis: 'Kuis Edukasi',
  ekstrakurikuler: 'Ekstrakurikuler',
  kesiswaan: 'Kesiswaan & Ekstrakurikuler',
  berita: 'Kabar & Berita',
  alumni: 'Portal Alumni',
  galeri: 'Galeri Dokumentasi',
  ppdb: 'PPDB Online',
  'ppdb-online': 'Pendaftaran PPDB Daring',
  'formulir-ppdb': 'Formulir PPDB Offline',
  alur: 'Alur & Persyaratan',
  jadwal: 'Jadwal & Kuota',
  daftar: 'Pendaftaran Siswa Baru',
  nilai: 'Portal Rapor Siswa',
  kelulusan: 'Pengumuman Kelulusan',
  unduh: 'Pusat Unduhan Berkas',
  kontak: 'Hubungi Kami',
  'hubungi-kami': 'Kontak & Lokasi',
  'buku-tamu': 'Buku Tamu Digital',
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
