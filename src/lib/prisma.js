import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

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
