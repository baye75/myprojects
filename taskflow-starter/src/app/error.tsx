'use client';

import { ErrorPanel } from '@/components/ui';

/**
 * Global error boundary.
 *
 * MUST be a client component. Error boundaries rely on React lifecycle
 * behaviour that only exists in the browser, so a server `error.tsx` throws
 * "Error components must be Client Components" at build time.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container">
      <ErrorPanel message={error.message} onRetry={reset} />
    </div>
  );
}


