// Hand-written types matching the schema in supabase/schema.sql.
// Run `npx supabase gen types typescript` after linking the project to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      word_counts: {
        Row:    { id: number; word: string; count: number; updated_at: string };
        Insert: { id?: number; word: string; count?: number; updated_at?: string };
        Update: { id?: number; word?: string; count?: number; updated_at?: string };
        Relationships: [];
      };
      testimonies: {
        Row:    { id: string; word: string; body: string; category: string | null; excerpt: string | null; consented: boolean; created_at: string; ip_hash: string | null };
        Insert: { id?: string; word: string; body: string; category?: string | null; consented?: boolean; created_at?: string; ip_hash?: string | null };
        Update: { id?: string; word?: string; body?: string; category?: string | null; consented?: boolean; ip_hash?: string | null };
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
    Functions: {
      increment_word_count: {
        Args:    { p_word: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
