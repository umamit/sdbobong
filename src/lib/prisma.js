import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

let rawConnectionString = process.env.DIRECT_URL 
  || process.env.POSTGRES_URL_NON_POOLING 
  || process.env.DATABASE_URL 
  || process.env.POSTGRES_PRISMA_URL 
  || process.env.POSTGRES_URL || '';

// Clean connection string to prevent pg sslmode deprecation warning & self-signed cert chain error
let connectionString = rawConnectionString;
if (connectionString) {
  if (connectionString.includes('sslmode=require') || connectionString.includes('sslmode=prefer') || connectionString.includes('sslmode=verify-ca')) {
    connectionString = connectionString
      .replace(/sslmode=(require|prefer|verify-ca)/g, 'sslmode=no-verify');
  } else if (!connectionString.includes('sslmode=')) {
    connectionString += connectionString.includes('?') ? '&sslmode=no-verify' : '?sslmode=no-verify';
  }
}

const pool = connectionString
  ? new pg.Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

const adapter = pool ? new PrismaPg(pool) : null;

const basePrisma = globalForPrisma.prisma
  || (adapter
      ? new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        })
      : new PrismaClient());

export const prisma = basePrisma.$extends({
  result: {
    student: {
      anonymizedName: {
        needs: { name: true },
        compute(student) {
          if (!student.name) return "***";
          const trimmed = student.name.trim();
          if (trimmed.length <= 2) return trimmed + "***";
          return trimmed.substring(0, 2) + "***";
        }
      }
    },
    news: {
      formattedDate: {
        needs: { date: true },
        compute(news) {
          if (!news.date) return "";
          try {
            const dt = new Date(news.date);
            return isNaN(dt.getTime()) ? news.date : dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          } catch (e) { return news.date; }
        }
      }
    }
  },
  query: {
    news: {
      async findMany({ args, query }) {
        args.where = { deletedAt: null, ...(args.where || {}) };
        return query(args);
      },
      async delete({ args, query }) {
        return basePrisma.news.update({
          where: args.where,
          data: { deletedAt: new Date() }
        });
      }
    },
    teacher: {
      async findMany({ args, query }) {
        args.where = { deletedAt: null, ...(args.where || {}) };
        return query(args);
      },
      async delete({ args, query }) {
        return basePrisma.teacher.update({
          where: args.where,
          data: { deletedAt: new Date() }
        });
      }
    },
    student: {
      async findMany({ args, query }) {
        args.where = { deletedAt: null, ...(args.where || {}) };
        return query(args);
      },
      async delete({ args, query }) {
        return basePrisma.student.update({
          where: args.where,
          data: { deletedAt: new Date() }
        });
      }
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;
