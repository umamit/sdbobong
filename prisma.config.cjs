require('dotenv/config');
const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://postgres:sdnbobong2026@db.cffwfjkvuobpzhtdflkq.supabase.co:5432/postgres',
  },
});
