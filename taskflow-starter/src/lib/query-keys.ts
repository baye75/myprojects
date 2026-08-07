/**
 * Query keys — the cache-key factory.
 *
 * A query key is the ADDRESS of something in the TanStack Query cache.
 *
 * You could type `['tasks', projectId]` by hand in every file. One day you
 * will type `['task', projectId]`, singular, and lose an hour wondering why
 * the list refuses to refresh after a mutation.
 *
 * So the addresses are written once, here. This is called a key factory and
 * it is the single most common convention in professional React Query code.
 *
 * `as const` is what makes it useful: it freezes the arrays into exact
 * literal types, so TypeScript catches a mismatch instead of your users.
 */

export const taskKeys = {
  all: ['tasks'] as const,
  list: (projectId: string) => [...taskKeys.all, 'list', projectId] as const,
  detail: (taskId: string) => [...taskKeys.all, 'detail', taskId] as const,
};

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (projectId: string) => [...projectKeys.all, 'detail', projectId] as const,
};

/**
 * Keys nest on purpose. Because every task key starts with 'tasks',
 *
 *   queryClient.invalidateQueries({ queryKey: taskKeys.all })
 *
 * invalidates every task query at once — lists and details — while
 *
 *   queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId) })
 *
 * refreshes only the one board. Prefix matching gives you both for free.
 */
