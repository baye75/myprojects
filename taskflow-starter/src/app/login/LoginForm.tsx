'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Field, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

/**
 * Sign in / sign up.
 *
 * Deliberately written with plain `useState` — count them: five pieces of
 * state, one handler, manual loading and error tracking, for a form with TWO
 * fields. Now imagine a twelve-field form.
 *
 * Later tonight you will build the task form with React Hook Form + Zod and
 * it will be shorter than this despite doing more. That contrast is the point.
 */
export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isSignUp = mode === 'signup';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    // Three lines and we have authentication. That is what Supabase is for.
    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setIsPending(false);
      return;
    }

    /*
     * router.refresh() is NOT optional.
     *
     * Supabase just wrote the session into a cookie. Server Components have
     * already rendered without it, so without this line you sign in
     * successfully and the middleware bounces you straight back to /login —
     * the classic Next + Supabase bug.
     *
     * refresh() re-runs the server parts of the current route, this time with
     * the cookie in hand.
     */
    router.refresh();
    router.push('/projects');
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        hint={isSignUp ? 'At least 6 characters.' : undefined}
      >
        <Input
          id="password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <p className="auth__message auth__message--error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Working…' : isSignUp ? 'Create account' : 'Sign in'}
      </Button>

      <p className="auth__switch">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(isSignUp ? 'signin' : 'signup');
            setError(null);
          }}
        >
          {isSignUp ? 'Sign in' : 'Create one'}
        </button>
      </p>
    </form>
  );
}
