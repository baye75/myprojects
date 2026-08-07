import type { Metadata } from 'next';

import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

/**
 * A Server Component: it renders once on the server and ships zero JavaScript
 * of its own. Only <LoginForm> below is marked 'use client', so only that
 * subtree becomes interactive JS in the browser.
 *
 * That is the pattern to copy — keep pages on the server, push 'use client'
 * as deep into the tree as you can.
 */
export default function LoginPage() {
  return (
    <main className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          Task<span>Flow</span>
        </div>
        <p className="auth__tagline">Your tasks, in a real database.</p>
        <LoginForm />
      </div>
    </main>
  );
}
