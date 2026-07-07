require('dotenv/config');
const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:sdnbobong2026@db.qtqqwyicanoszwvkbzwc.supabase.co:6543/postgres?pgbouncer=true',
  },
});
