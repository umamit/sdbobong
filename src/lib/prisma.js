import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

function fixSupabaseConnectionString(urlStr) {
  if (!urlStr) return urlStr;
  try {
    const url = new URL(urlStr);
    if (url.username && url.username.includes('.')) {
      const parts = url.username.split('.');
      const projectRef = parts[1];
      if (url.port === '5432' && url.hostname.includes('pooler.supabase.com')) {
        url.hostname = `db.${projectRef}.supabase.co`;
        url.username = parts[0];
      }
    }
    return url.toString();
  } catch (e) {
    return urlStr;
  }
}

const rawConnectionString = process.env.DIRECT_URL 
  || process.env.POSTGRES_URL_NON_POOLING 
  || process.env.DATABASE_URL 
  || process.env.POSTGRES_PRISMA_URL 
  || process.env.POSTGRES_URL;

const connectionString = fixSupabaseConnectionString(rawConnectionString);

const pool = connectionString
  ? new pg.Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false }
    })
  : null;

const adapter = pool ? new PrismaPg(pool) : null;

export const prisma = globalForPrisma.prisma
  || (adapter
      ? new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        })
      : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
