import { redirect } from 'next/navigation';

import { Navbar } from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/server';

/**
 * `(app)` is a ROUTE GROUP.
 *
 * The brackets mean "group these routes so they can share a layout, but do
 * NOT put the folder name in the URL". So this file wraps /projects and
 * /projects/[id], while /login stays outside it with no navbar.
 *
 * The middleware already redirects signed-out visitors, but we check again
 * here — that is not paranoia, it is defence in depth. This is also where we
 * get the user object the navbar needs.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="shell">
      <Navbar email={user.email ?? 'signed in'} />
      <main className="container">{children}</main>
    </div>
  );
}
