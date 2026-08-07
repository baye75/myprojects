import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database, Project } from '@/types/database';

/**
 * The data layer for projects.
 *
 * Plain async functions. No React, no hooks, no components — this file would
 * work in a Node script. That separation is why you can swap Supabase for
 * your own Express API in Class 33 by rewriting one folder and nothing else.
 *
 * The client is a PARAMETER, not an import. There are two of them — one for
 * the browser, one for the server — and passing it in means these functions
 * work on both sides.
 */

export async function fetchProjects(
  supabase: SupabaseClient<Database>,
): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  // Supabase does NOT throw on failure — it hands back { data, error } and
  // carries on. Skip this check and `data` is null, and you crash somewhere
  // far away with a useless stack trace.
  if (error) throw new Error(error.message);

  return data;
}

export async function fetchProject(
  supabase: SupabaseClient<Database>,
  projectId: string,
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    // maybeSingle(): expect one row, tolerate zero. `single()` would treat
    // "not found" as an error — but here it just means 404, or RLS said no.
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}
