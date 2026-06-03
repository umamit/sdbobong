/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig
