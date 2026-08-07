import Link from 'next/link';

import { EmptyState } from '@/components/ui';
import { fetchProjects } from '@/lib/api/projects';
import { createClient } from '@/lib/supabase/server';

/**
 * /projects — a SERVER COMPONENT.
 *
 * Look at what is missing: no 'use client', no useEffect, no useState, no
 * loading flag. It is an async function that runs on the server, talks to the
 * database, and sends finished HTML down the wire.
 *
 * Three consequences:
 *   1. The page has content before React has even loaded in the browser.
 *   2. This code is not in your JS bundle — the browser downloads less.
 *   3. It runs closer to the database, so the query is fast.
 *
 * THE RULE: server by default. Add 'use client' only when you need a hook, an
 * event handler, or a browser API — and push it as deep into the tree as you
 * can. Every 'use client' is a decision to ship more JavaScript.
 */
export default async function ProjectsPage() {
  const supabase = await createClient();
  const projects = await fetchProjects(supabase);

  return (
    <>
      <div className="page-head">
        <h1>Your projects</h1>
        <p>Every board below is yours alone — Row Level Security guarantees it.</p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Sign up creates a starter board automatically. If you are seeing this, check your database trigger."
        />
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description ?? 'No description.'}</p>
              <div className="project-card__meta">
                {new Date(project.created_at).toISOString().slice(0, 10)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
