'use client';

import { Button, PriorityBadge } from '@/components/ui';
import type { Task, TaskStatus } from '@/types/database';

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: null,
};

const PREV_STATUS: Record<TaskStatus, TaskStatus | null> = {
  todo: null,
  in_progress: 'todo',
  done: 'in_progress',
};

/**
 * One card. Presentational — it renders what it is given and calls the
 * handlers it is given. It does not know Supabase or TanStack Query exist.
 */
export function TaskCard({
  task,
  isPending,
  onMove,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  task: Task;
  isPending?: boolean;
  onMove: (status: TaskStatus) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}) {
  const next = NEXT_STATUS[task.status];
  const previous = PREV_STATUS[task.status];

  return (
    <article
      className={[
        'task',
        isDragging ? 'task--dragging' : '',
        isPending ? 'task--pending' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <h4 className="task__title">{task.title}</h4>
      {task.description && <p className="task__desc">{task.description}</p>}

      <div className="task__foot">
        <PriorityBadge priority={task.priority} />

        {/*
          Drag and drop is lovely with a mouse and impossible with a keyboard
          or a screen reader. These two buttons are the accessible equivalent
          of the same action — always ship both.
        */}
        <div className="task__move">
          <Button
            variant="ghost"
            size="sm"
            disabled={!previous}
            onClick={() => previous && onMove(previous)}
            aria-label={`Move "${task.title}" left`}
            title="Move left"
          >
            ←
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!next}
            onClick={() => next && onMove(next)}
            aria-label={`Move "${task.title}" right`}
            title="Move right"
          >
            →
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            aria-label={`Delete "${task.title}"`}
            title="Delete"
          >
            ✕
          </Button>
        </div>
      </div>
    </article>
  );
}
