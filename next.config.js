const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtqqwyicanoszwvkbzwc.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://qtqqwyicanoszwvkbzwc.supabase.co https://*.supabase.co https://images.unsplash.com https://*.unsplash.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://qtqqwyicanoszwvkbzwc.supabase.co wss://qtqqwyicanoszwvkbzwc.supabase.co https://api.groq.com https://vitals.vercel-insights.com; frame-src 'self' https://www.google.com https://*.google.com https://drive.google.com https://docs.google.com https://www.youtube.com https://*.youtube.com https://www.facebook.com https://*.facebook.com; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests;",
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills", </.well-known/mcp/server-card.json>; rel="mcp-server-card", </.well-known/openid-configuration>; rel="openid-configuration", </.well-known/oauth-authorization-server>; rel="oauth-authorization-server", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/beranda',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
