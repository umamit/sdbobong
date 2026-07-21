/**
 * In-memory sliding-window rate limiter.
 * Per-instance (Vercel serverless), suitable for low-to-moderate traffic.
 *
 * Usage:
 *   import { rateLimit } from '../../../lib/rate-limit';
 *   const result = rateLimit(ip, { limit: 5, windowMs: 10 * 60 * 1000 });
 *   if (!result.allowed) return result.response;
 */

import { NextResponse } from 'next/server';

// Map<key, number[]> — stores timestamps of requests per IP
const store = new Map();

// Prune stale entries every 5 minutes to avoid memory leak
let lastPrune = Date.now();
function maybePrune(windowMs) {
  const now = Date.now();
  if (now - lastPrune < 5 * 60 * 1000) return;
  lastPrune = now;
  for (const [key, timestamps] of store.entries()) {
    const fresh = timestamps.filter(t => now - t < windowMs);
    if (fresh.length === 0) store.delete(key);
    else store.set(key, fresh);
  }
}

/**
 * @param {string} key        - Identifier (e.g. IP address)
 * @param {object} options
 * @param {number} options.limit     - Max allowed requests in window
 * @param {number} options.windowMs  - Window duration in milliseconds
 * @param {string} [options.message] - Custom error message (Indonesian)
 * @returns {{ allowed: boolean, response?: NextResponse }}
 */
export function rateLimit(key, { limit, windowMs, message }) {
  maybePrune(windowMs);

  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (store.get(key) || []).filter(t => t > windowStart);

  if (timestamps.length >= limit) {
    const retryAfterSec = Math.ceil(windowMs / 1000);
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: message ||
            `Terlalu banyak permintaan. Silakan coba lagi dalam ${Math.ceil(windowMs / 60000)} menit.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    };
  }

  timestamps.push(now);
  store.set(key, timestamps);

  return {
    allowed: true,
    response: null,
  };
}

/**
 * Extracts the real client IP from Next.js request headers.
 * Vercel sets x-real-ip; fallback to x-forwarded-for or 'unknown'.
 */
export function getClientIp(request) {
  return (
    request.headers.get('x-real-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}
