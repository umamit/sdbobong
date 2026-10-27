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

export function parseIndoDateToIso(dateStr) {
  const fallback = new Date().toISOString();
  if (!dateStr) return fallback;
  try {
    const raw = String(dateStr).trim();
    if (raw.includes('-')) {
      const parts = raw.split('-');
      if (parts.length === 3) {
        const d = parts[0].length === 4
          ? new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)))
          : new Date(Date.UTC(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)));
        if (!isNaN(d.getTime())) return d.toISOString();
      }
    }
    const monthsMap = {
      jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, maret: 2,
      apr: 3, april: 3, mei: 4, jun: 5, juni: 5, jul: 6, juli: 6,
      agu: 7, ags: 7, agustus: 7, sep: 8, september: 8, okt: 9, oktober: 9,
      nov: 10, november: 10, des: 11, desember: 11
    };
    const parts = raw.toLowerCase().replace(/,/g, '').split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const month = monthsMap[parts[1]] ?? monthsMap[parts[1]?.substring(0, 3)];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(year) && month !== undefined) {
        const d = new Date(Date.UTC(year, month, day));
        if (!isNaN(d.getTime())) return d.toISOString();
      }
    }
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  } catch {}
  return fallback;
}

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
