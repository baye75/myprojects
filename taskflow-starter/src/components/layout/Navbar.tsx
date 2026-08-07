'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export function Navbar({ email }: { email: string }) {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  async function signOut() {
    await supabase.auth.signOut();

    // Wipe the cache on the way out. Without this, the next person to sign in
    // on this machine gets a flash of the previous user's tasks before the
    // refetch lands. Small detail, real privacy bug.
    queryClient.clear();

    router.refresh();
    router.push('/login');
  }

  return (
    <header className="navbar">
      <Link href="/projects" className="navbar__brand">
        Task<span>Flow</span>
      </Link>
      <div className="navbar__spacer" />
      <span className="navbar__user">{email}</span>
      <Button variant="ghost" onClick={signOut}>
        Sign out
      </Button>
    </header>
  );
}
