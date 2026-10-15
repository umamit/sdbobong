export const siteMetadata = {
  metadataBase: new URL('https://www.sdnegeribobong.sch.id'),
  alternates: { canonical: 'https://www.sdnegeribobong.sch.id' },
  title: {
    default: 'SD Negeri Bobong - Berakhlak Mulia, Cerdas, dan Berbudaya',
    template: '%s | SD Negeri Bobong'
  },
  description: 'Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu. Menyediakan informasi profil sekolah, akademik, kesiswaan, PPDB online, dan berita terbaru.',
  applicationName: 'SD Negeri Bobong',
  keywords: ['SD Negeri Bobong', 'SDN Bobong', 'Sekolah Dasar Bobong', 'Pulau Taliabu', 'Pendidikan Taliabu', 'PPDB SD Bobong', 'Maluku Utara'],
  authors: [{ name: 'SD Negeri Bobong' }],
  creator: 'SD Negeri Bobong',
  publisher: 'SD Negeri Bobong',
  openGraph: {
    title: 'SD Negeri Bobong - Berakhlak Mulia, Cerdas, dan Berbudaya',
    description: 'Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara. Media informasi PPDB online, pengumuman, berita kegiatan, dan portal akademik.',
    url: 'https://www.sdnegeribobong.sch.id',
    siteName: 'SD Negeri Bobong',
    images: [{ url: '/images/logo_sekolah.png', width: 800, height: 800, alt: 'Logo SD Negeri Bobong' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SD Negeri Bobong - Berakhlak Mulia, Cerdas, dan Berbudaya',
    description: 'Website resmi SD Negeri Bobong, Kabupaten Pulau Taliabu, Maluku Utara. Media informasi PPDB online, pengumuman, berita kegiatan, dan portal akademik.',
    images: ['/images/logo_sekolah.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.png',
  },
};
