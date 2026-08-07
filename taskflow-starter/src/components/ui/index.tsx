/**
 * Presentational building blocks.
 *
 * Nothing in here knows about Supabase, TanStack Query or forms — they take
 * props and render markup. That is the point: dumb components are the ones
 * you can reuse, test and read at a glance.
 *
 * `forwardRef` matters on the inputs: React Hook Form hands you a `ref` to
 * read the value from the DOM, and a component that swallows the ref quietly
 * breaks the whole form.
 */
import { forwardRef, type ReactNode } from 'react';

import type { TaskPriority } from '@/types/database';

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Field — label + control + error, wired for screen readers                  */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span className="field__hint" id={`${htmlFor}-hint`}>
          {hint}
        </span>
      )}
      {/*
        role="alert" makes a screen reader announce the message the moment it
        appears. Without it, a blind user submits, hears nothing, and has no
        idea why the form did not go through.
      */}
      {error && (
        <p className="field__error" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inputs                                                                     */
/* -------------------------------------------------------------------------- */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`input ${className}`.trim()} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`textarea ${className}`.trim()} {...props} />;
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = '', children, ...props }, ref) {
  return (
    <select ref={ref} className={`select ${className}`.trim()} {...props}>
      {children}
    </select>
  );
});

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`badge badge--${priority}`}>{priority}</span>;
}

/* -------------------------------------------------------------------------- */
/* The three states everyone forgets                                          */
/* -------------------------------------------------------------------------- */

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: string }) {
  return <div className="skeleton" style={{ height, width }} />;
}

export function BoardSkeleton() {
  return (
    <div className="board" aria-busy="true" aria-label="Loading tasks">
      {[0, 1, 2].map((column) => (
        <div className="column" key={column}>
          <div className="column__head">
            <Skeleton height={12} width="90px" />
          </div>
          <div className="column__list">
            {[0, 1].map((row) => (
              <Skeleton key={row} height={72} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} height={118} />
      ))}
    </div>
  );
}

export function ErrorPanel({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="panel panel--error" role="alert">
      <h3>{title}</h3>
      <p>
        The request did not go through. If the list is empty but you can see rows in
        Supabase, suspect Row Level Security first.
      </p>
      {message && <code>{message}</code>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

/**
 * Placeholder shown where a TODO has not been implemented yet.
 * Delete the `<TodoPanel />` as you complete each step.
 */
export function TodoPanel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="panel panel--todo">
      <h3>{id} — not built yet</h3>
      <p>{children}</p>
    </div>
  );
}
