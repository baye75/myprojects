import { redirect } from 'next/navigation';

/**
 * `/` has nothing to show. The middleware has already decided whether there
 * is a session, so by the time we get here we can just forward.
 */
export default function HomePage() {
  redirect('/projects');
}
