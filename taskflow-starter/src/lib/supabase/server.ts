import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { env } from '@/lib/env';
import type { Database } from '@/types/database';

/**
 * Supabase client for SERVER components, route handlers and server actions.
 *
 * Same database, different door. This one reads the session out of the
 * request's cookies instead of the browser's.
 *
 * Note the `await cookies()` — in Next.js 15 that function became async.
 * Tutorials written for Next 14 call it without `await` and will not compile.
 *
 * Never make this a module-level singleton: every request has different
 * cookies, so every request needs its own client.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components are not allowed to write cookies.
            // Safe to ignore: the middleware refreshes the session instead.
          }
        },
      },
    },
  );
}
