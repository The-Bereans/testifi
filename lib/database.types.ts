// Hand-written types matching the schema in supabase/schema.sql.
// Run `npx supabase gen types typescript` after linking the project to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      testimonies: {
        Row:    { id: string; word: string; body: string | null; category: string | null; excerpt: string | null; consented: boolean; created_at: string; ip_hash: string | null; testimony_type: string };
        Insert: { id?: string; word: string; body?: string | null; category?: string | null; consented?: boolean; created_at?: string; ip_hash?: string | null; testimony_type?: string };
        Update: { id?: string; word?: string; body?: string | null; category?: string | null; consented?: boolean; ip_hash?: string | null; testimony_type?: string };
        Relationships: [];
      };
      waitlist: {
        Row:    { id: string; email: string; created_at: string; ip_hash: string | null };
        Insert: { id?: string; email: string; created_at?: string; ip_hash?: string | null };
        Update: { id?: string; email?: string; ip_hash?: string | null };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
