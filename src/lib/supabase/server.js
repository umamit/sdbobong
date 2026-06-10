import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        async getAll() {
          const resolvedStore = await cookieStore;
          return resolvedStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedStore = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) =>
              resolvedStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if handled by middleware
          }
        },
      },
    }
  );
}
