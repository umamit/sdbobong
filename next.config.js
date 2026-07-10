const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  serverExternalPackages: ['@prisma/client', 'pg'],
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
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/guru/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
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
            value: "default-src 'self'; media-src 'self' blob: data: https://qtqqwyicanoszwvkbzwc.supabase.co https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://qtqqwyicanoszwvkbzwc.supabase.co https://*.supabase.co https://images.unsplash.com https://*.unsplash.com https://img.youtube.com https://*.youtube.com https://*.ytimg.com https://drive.google.com https://*.google.com https://*.googleusercontent.com https://*.fbcdn.net https://*.facebook.com https://www.google-analytics.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://qtqqwyicanoszwvkbzwc.supabase.co wss://qtqqwyicanoszwvkbzwc.supabase.co https://api.groq.com https://vitals.vercel-insights.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.cloudflareinsights.com; frame-src 'self' https://www.google.com https://*.google.com https://drive.google.com https://docs.google.com https://www.youtube.com https://*.youtube.com https://www.facebook.com https://*.facebook.com; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests;",
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
      {
        source: '/ppdb-online',
        destination: '/ppdb/daftar',
        permanent: true,
      },
      {
        source: '/ppdb-online/sukses',
        destination: '/ppdb/daftar/sukses',
        permanent: true,
      },
      {
        source: '/formulir-ppdb',
        destination: '/ppdb/cetak',
        permanent: true,
      },
      {
        source: '/nilai',
        destination: '/akademik/nilai',
        permanent: true,
      },
      {
        source: '/kelulusan',
        destination: '/akademik/kelulusan',
        permanent: true,
      },
      {
        source: '/hubungi-kami',
        destination: '/kontak',
        permanent: true,
      },
      {
        source: '/buku-tamu',
        destination: '/kontak/buku-tamu',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ppdb/daftar',
        destination: '/ppdb-online',
      },
      {
        source: '/ppdb/daftar/sukses',
        destination: '/ppdb-online/sukses',
      },
      {
        source: '/ppdb/cetak',
        destination: '/formulir-ppdb',
      },
      {
        source: '/akademik/nilai',
        destination: '/nilai',
      },
      {
        source: '/akademik/kelulusan',
        destination: '/kelulusan',
      },
      {
        source: '/kontak',
        destination: '/hubungi-kami',
      },
      {
        source: '/kontak/buku-tamu',
        destination: '/buku-tamu',
      }
    ]
  },
}

module.exports = nextConfig
