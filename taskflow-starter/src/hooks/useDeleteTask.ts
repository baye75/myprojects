'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '@/lib/api/tasks';
import { taskKeys } from '@/lib/query-keys';
import { createClient } from '@/lib/supabase/client';

/**
 * Delete a task — written for you, in the SIMPLE style.
 *
 * Fire the request, wait for it, invalidate the list. Correct, but the card
 * sits on screen until the server answers.
 *
 * HOMEWORK: once you have finished TODO 7, come back and make this one
 * optimistic too. It is the same three beats — cancel, save the previous
 * list, filter the row out, roll back in onError, resync in onSettled — only
 * with `.filter()` instead of `.map()`.
 */
export function useDeleteTask(projectId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(supabase, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId) });
    },
  });
}
