-- ============================================================
-- Testify  Database Schema
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================

-- Enable pgcrypto for uuid_generate_v4()
create extension if not exists "pgcrypto";

-- ─── word_counts ──────────────────────────────────────────────────────────────
-- One row per canonical word; count incremented atomically on each submission.

create table if not exists public.word_counts (
  id          serial primary key,
  word        text    not null unique,
  count       integer not null default 1,
  updated_at  timestamptz not null default now()
);

-- Index for fast ORDER BY count DESC (word cloud query)
create index if not exists word_counts_count_idx on public.word_counts (count desc);

-- RLS: anyone can read; only service role can write
alter table public.word_counts enable row level security;

create policy "word_counts_read" on public.word_counts
  for select using (true);

-- ─── testimonies ─────────────────────────────────────────────────────────────
-- Full story submissions. consented=true means the user agreed to share.

create table if not exists public.testimonies (
  id          uuid    primary key default gen_random_uuid(),
  word        text    not null,
  body        text    not null check (char_length(body) between 1 and 1000),
  category    text,
  excerpt     text    generated always as (left(body, 160)) stored,
  consented   boolean not null default false,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

-- category: user-selected at submission time (Addiction | Mental Health | Relationships | Identity | Spiritual)
-- excerpt:  auto-derived from first 160 chars of body  never written by app logic

-- Index for feed queries filtered by word
create index if not exists testimonies_word_idx     on public.testimonies (word);
create index if not exists testimonies_created_idx  on public.testimonies (created_at desc);

-- Partial indexes for feed and per-category queries (consented rows only)
create index if not exists testimonies_feed_idx
  on public.testimonies (created_at desc)
  where consented = true;

create index if not exists testimonies_category_idx
  on public.testimonies (category, created_at desc)
  where consented = true;

-- RLS: public can read consented rows only; only service role can insert
alter table public.testimonies enable row level security;

create policy "testimonies_read_consented" on public.testimonies
  for select using (consented = true);

-- Column-level restriction: ip_hash is never readable by the anon role
revoke select on public.testimonies from anon;
grant select (id, word, body, consented, created_at, category, excerpt)
  on public.testimonies to anon;

-- ─── waitlist ────────────────────────────────────────────────────────────────
-- Waitlist email signups.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;
-- No public read policy  only accessible via service role

-- ─── Helpers ─────────────────────────────────────────────────────────────────
-- Atomic upsert used by the submission API to avoid race conditions.

create or replace function public.increment_word_count(p_word text)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.word_counts (word, count)
  values (p_word, 1)
  on conflict (word) do update
    set count      = public.word_counts.count + 1,
        updated_at = now();
end;
$$;
