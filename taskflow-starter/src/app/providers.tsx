'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: ReactNode }) {
  /*
   * `useState(() => new QueryClient())` — not `new QueryClient()` directly.
   *
   * Written inline, a new cache would be built on every render and every
   * cached response would be thrown away. The lazy initialiser runs once per
   * component instance, so the cache survives re-renders.
   *
   * It also has to be created *inside* a component rather than at module
   * scope. On the server, module scope is shared between requests — a
   * module-level client would let one user's data leak into another's page.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long a response is considered fresh. Within this window,
            // React Query serves the cache and does not hit the network.
            staleTime: 30_000,

            // Retry failed requests (with backoff) before showing an error.
            retry: 1,

            // Refetch when the user comes back to the tab — the data may have
            // changed while they were away.
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Bottom-left flower icon. Open it to watch your cache go fresh → stale.
          Dev-only: excluded from the production bundle automatically. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
