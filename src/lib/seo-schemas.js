export function generateWebSiteSchema() {
  const origin = 'https://www.sdnegeribobong.sch.id';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SD Negeri Bobong',
    alternateName: ['SDN Bobong', 'SD Negeri Bobong Taliabu', 'SDN Bobong Taliabu'],
    url: origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/berita?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateSchoolSchema(config = {}) {
  const origin = 'https://www.sdnegeribobong.sch.id';
  const contacts = config.ppdb_contacts || {};
  const phone = contacts.wa_operator ? `+${contacts.wa_operator.replace(/[^0-9]/g, '')}` : '+6281234567890';
  const npsn = config.stats?.page_contents?.profil?.npsn || '60200589';

  return {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization'],
    '@id': `${origin}/#school`,
    name: 'SD Negeri Bobong',
    alternateName: 'SDN Bobong',
    url: origin,
    logo: `${origin}/images/logo_sekolah_512.png`,
    image: `${origin}/images/logo_sekolah.png`,
    description: 'Sekolah Dasar Negeri rujukan di ibukota Kabupaten Pulau Taliabu, Maluku Utara dengan akreditasi B.',
    identifier: `NPSN:${npsn}`,
    telephone: phone,
    email: 'sdnegeribobong@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Mansur Sou, Desa Wayo',
      addressLocality: 'Kec. Taliabu Barat, Kab. Pulau Taliabu',
      addressRegion: 'Maluku Utara',
      postalCode: '97791',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.8797,
      longitude: 124.4789
    }
  };
}

export function generateFaqSchema(faqList = []) {
  if (!faqList || faqList.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

export function generateEventSchema(events = []) {
  const origin = 'https://www.sdnegeribobong.sch.id';
  if (!events || events.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.slice(0, 10).map((ev, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Event',
        name: ev.title || ev.name,
        startDate: ev.startDate || ev.date || new Date().toISOString(),
        endDate: ev.endDate || ev.startDate || ev.date || new Date().toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: 'Kampus SD Negeri Bobong',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bobong',
            addressRegion: 'Pulau Taliabu',
            addressCountry: 'ID'
          }
        },
        organizer: {
          '@type': 'School',
          name: 'SD Negeri Bobong',
          url: origin
        }
      }
    }))
  };
}
