'use client';

import { useState, type ReactNode } from 'react';

import type { TaskStatus } from '@/types/database';

export const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'done', label: 'Done' },
];

/**
 * A drop target.
 *
 * Native HTML5 drag and drop — no library. `preventDefault` on dragOver is
 * the non-obvious bit: without it the browser refuses the drop and nothing
 * happens, which is a very quiet way to lose twenty minutes.
 */
export function TaskColumn({
  status,
  label,
  count,
  onDropTask,
  children,
}: {
  status: TaskStatus;
  label: string;
  count: number;
  onDropTask: (status: TaskStatus) => void;
  children: ReactNode;
}) {
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      className={`column ${isOver ? 'column--over' : ''}`.trim()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        onDropTask(status);
      }}
      aria-label={label}
    >
      <div className="column__head">
        <span className={`column__dot column__dot--${status}`} />
        <span className="column__title">{label}</span>
        <span className="column__count">{count}</span>
      </div>
      <div className="column__list">{children}</div>
    </section>
  );
}
