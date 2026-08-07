/**
 * Types that mirror `supabase/schema.sql`.
 *
 * In a real project you generate this file instead of writing it:
 *
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * It is hand-written here so you can read it, but the shape is exactly what
 * the generator produces. Every table gets three views of itself:
 *
 *   Row    — what comes back when you SELECT
 *   Insert — what you are allowed to send when you INSERT
 *            (columns with a database default are optional here)
 *   Update — what you are allowed to change, so everything is optional
 */

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/** Convenience aliases — these are the types you use in components. */
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];

/**
 * Handed to `createClient<Database>()` so that every `.from('tasks')` call is
 * type-checked. Misspell a table or a column and TypeScript stops you before
 * the browser does.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
        };
        Relationships: [];
      };

      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
        Relationships: [];
      };

      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          due_date: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      owns_project: {
        Args: { p_project_id: string };
        Returns: boolean;
      };
    };

    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
