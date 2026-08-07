import { headers } from 'next/headers';

export default async function robots() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // If the request is for the internal subdomains, block all crawlers completely!
  if (host.includes('presensi') || host.includes('ajar')) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        }
      ]
    };
  }

  const baseUrl = 'https://www.sdnegeribobong.sch.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/guru',
          '/guru/',
          '/login',
          '/api/',
          '/ppdb-online/sukses',
          '/ppdb/daftar/sukses',
          '/_next/'
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Anthropic-AI',
          'Claude-Web',
          'Google-Extended',
          'Gemini-AI',
          'CCBot',
          'omgili',
          'Omgilibot',
          'FacebookBot',
          'PerplexityBot',
          'YouBot',
          'cohere-ai',
          'Bytespider'
        ],
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
