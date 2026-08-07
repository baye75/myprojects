-- ===========================================================================
-- TaskFlow — database schema
-- IoTBTech React Deep Dive · Day 4
--
-- HOW TO RUN
--   1. Supabase dashboard → SQL Editor → New query
--   2. Paste this entire file
--   3. Run
--
-- Safe to run more than once.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1. TABLES
--
-- Three tables. Read them like three spreadsheets:
--   profiles → one row per human
--   projects → one row per board
--   tasks    → one row per card
-- ---------------------------------------------------------------------------

-- profiles ------------------------------------------------------------------
-- Supabase keeps its own private `auth.users` table that we cannot touch.
-- `profiles` is OUR copy of the bits we need, and it is safe to join against.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);

-- projects ------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 3 and 60),
  description text check (char_length(description) <= 500),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on public.projects (owner_id);

-- tasks ---------------------------------------------------------------------
--
-- `project_id` is a FOREIGN KEY: it points at a row in `projects`.
-- That is the "relational" in relational database. Two consequences:
--   * Postgres refuses a task whose project does not exist.
--   * `on delete cascade` — delete a project and its tasks go with it.
--     No orphan rows, ever, without you writing any code.
--
-- The `check` constraints are validation the client CANNOT bypass.
-- We will write the same rules again in Zod, for nice error messages.
-- Two layers on purpose: Zod is UX, the database is truth.
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null check (char_length(title) between 3 and 120),
  description text check (char_length(description) <= 2000),
  status      text not null default 'todo'
                check (status in ('todo', 'in_progress', 'done')),
  priority    text not null default 'medium'
                check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date    date,
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes are how a database stays fast as rows pile up.
-- Every column you filter or sort on regularly deserves one.
create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists tasks_project_status_idx on public.tasks (project_id, status);


-- ---------------------------------------------------------------------------
-- 2. TRIGGERS — automation that lives in the database
--
-- A trigger is "when X happens to this table, also do Y". It runs no matter
-- who caused X: your app, another app, or someone in the dashboard.
-- ---------------------------------------------------------------------------

-- Keep `updated_at` honest without trusting the client to send it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();


-- When somebody signs up, Supabase inserts into `auth.users`.
-- This trigger reacts to that and gives the new user:
--   1. a profile row
--   2. a starter project
--   3. three sample tasks, so the board is never empty on first login
--
-- `security definer` = run with the function owner's rights, not the caller's.
-- Needed because a brand-new user has no permission to write these rows yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project_id uuid;
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.projects (name, description, owner_id)
  values ('My First Board', 'Your starter board. Rename it, or make your own.', new.id)
  returning id into v_project_id;

  insert into public.tasks (project_id, title, description, status, priority, created_by)
  values
    (v_project_id, 'Welcome to TaskFlow',
     'This row lives in a real Postgres database. Refresh the page — it stays.',
     'done', 'low', new.id),
    (v_project_id, 'Move me to In Progress',
     'Changing status writes to the database and updates the board.',
     'todo', 'medium', new.id),
    (v_project_id, 'Add a task of your own',
     'Use the form above. React Hook Form validates it, Zod defines the rules.',
     'todo', 'high', new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY — the most important section in this file
--
-- Our anon key sits in the browser where anybody can read it. RLS is what
-- makes that safe. Once enabled, Postgres returns NOTHING from a table unless
-- a policy explicitly allows this specific user to see this specific row.
--
-- Deny by default. That is why `enable row level security` comes first — a
-- table with RLS on and no policies is locked, not open.
--
-- Security lives HERE, not in a React `if`. A React `if` can be deleted in
-- DevTools. This cannot.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;


-- Helper: does the signed-in user own this project?
--
-- Why a function instead of inlining the subquery in every task policy?
--   * written once, so the rule cannot drift between policies
--   * `security definer` sidesteps recursive policy evaluation
--   * `stable` lets Postgres call it once per query instead of per row
create or replace function public.owns_project(p_project_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = p_project_id
      and p.owner_id = (select auth.uid())
  );
$$;

-- `auth.uid()` is the id of whoever is making the request, taken from their
-- login token. Wrapping it as `(select auth.uid())` is a Supabase performance
-- convention: it is evaluated once per query rather than once per row.


-- profiles -------------------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using ((select auth.uid()) = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);


-- projects -------------------------------------------------------------------
--
-- `using`      → which existing rows you may see / change
-- `with check` → what a row is allowed to look like AFTER you write it
--
-- Both are needed on update: `using` stops you editing someone else's project,
-- `with check` stops you handing your own project to someone else.
drop policy if exists "projects: read own" on public.projects;
create policy "projects: read own"
  on public.projects for select
  using ((select auth.uid()) = owner_id);

drop policy if exists "projects: insert own" on public.projects;
create policy "projects: insert own"
  on public.projects for insert
  with check ((select auth.uid()) = owner_id);

drop policy if exists "projects: update own" on public.projects;
create policy "projects: update own"
  on public.projects for update
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "projects: delete own" on public.projects;
create policy "projects: delete own"
  on public.projects for delete
  using ((select auth.uid()) = owner_id);


-- tasks ----------------------------------------------------------------------
-- "You may touch a task only if you own the project it belongs to."
drop policy if exists "tasks: read in own projects" on public.tasks;
create policy "tasks: read in own projects"
  on public.tasks for select
  using (public.owns_project(project_id));

drop policy if exists "tasks: insert in own projects" on public.tasks;
create policy "tasks: insert in own projects"
  on public.tasks for insert
  with check (
    public.owns_project(project_id)
    and created_by = (select auth.uid())
  );

drop policy if exists "tasks: update in own projects" on public.tasks;
create policy "tasks: update in own projects"
  on public.tasks for update
  using (public.owns_project(project_id))
  with check (public.owns_project(project_id));

drop policy if exists "tasks: delete in own projects" on public.tasks;
create policy "tasks: delete in own projects"
  on public.tasks for delete
  using (public.owns_project(project_id));


-- ---------------------------------------------------------------------------
-- 4. REALTIME (optional — homework)
--
-- Uncomment, then subscribe in the client with
--   supabase.channel('tasks').on('postgres_changes', …)
-- to make two browsers show the same board live.
-- ---------------------------------------------------------------------------

-- alter publication supabase_realtime add table public.tasks;


-- ===========================================================================
-- DONE.
--
-- Check your work: Table Editor should show profiles / projects / tasks,
-- all empty, and NONE of them carrying a red "Unrestricted" badge.
-- That badge means RLS is off and the table is readable by the entire
-- internet. If you ever see it on a real project, that is an incident.
-- ===========================================================================
