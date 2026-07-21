export default function robots() {
  const baseUrl = 'https://sdnegeribobong.sch.id';

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
