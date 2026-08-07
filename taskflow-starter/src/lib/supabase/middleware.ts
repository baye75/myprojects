import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { env } from '@/lib/env';
import type { Database } from '@/types/database';

/** Routes reachable without being signed in. */
const PUBLIC_PATHS = ['/login', '/auth'];

/**
 * Runs on the server BEFORE every matching request.
 *
 * Two jobs:
 *   1. Refresh the login token if it is about to expire, and write the new
 *      cookie onto the response. (Server Components cannot set cookies —
 *      this is the only place it can happen.)
 *   2. Guard the routes. One file protects the whole app, so no component
 *      ever has to ask "is there a user?".
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use getUser(), not getSession(). getUser() verifies the token with
  // Supabase; getSession() only decodes whatever is in the cookie, which the
  // browser could have tampered with. On the server, always verify.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    return NextResponse.redirect(url);
  }

  return response;
}
