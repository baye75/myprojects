import Link from 'next/link';

import { EmptyState, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="container">
      <EmptyState
        title="404 — nothing here"
        description="That page does not exist, or it belongs to someone else."
        action={
          <Link href="/projects">
            <Button variant="secondary" size="sm">
              Back to projects
            </Button>
          </Link>
        }
      />
    </div>
  );
}
