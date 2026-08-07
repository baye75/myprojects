import { createBrowserClient } from '@supabase/ssr';

import { env } from '@/lib/env';
import type { Database } from '@/types/database';

/**
 * Supabase client for CLIENT components ('use client').
 *
 * Reads the session from a cookie that the browser already has, so it knows
 * who is signed in. Cheap to call — `@supabase/ssr` reuses one instance under
 * the hood, so calling `createClient()` inside a hook is fine.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
