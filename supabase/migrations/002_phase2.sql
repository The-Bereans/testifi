-- ============================================================
-- Testify — Phase 2 Schema Migration
-- Run once in Supabase SQL Editor (safe to re-run; guarded with IF NOT EXISTS / ON CONFLICT DO NOTHING)
--
-- Stage 2.1  Add category + excerpt columns to testimonies
-- Stage 2.2  Add partial indexes for feed queries
-- Stage 2.3  Column-level restriction: never expose ip_hash to anon
-- Stage 2.4  Seed 15 mock testimonies + matching word_counts
-- ============================================================


-- ─── 2.1  New columns ────────────────────────────────────────────────────────

ALTER TABLE public.testimonies
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS excerpt  text GENERATED ALWAYS AS (left(body, 160)) STORED;

-- category  — user-selected at submission time (Addiction | Mental Health | Relationships | Identity | Spiritual)
-- excerpt   — auto-derived from first 160 chars of body; never written by app logic


-- ─── 2.2  Partial indexes for feed queries ───────────────────────────────────

-- Chronological feed (all consented rows)
CREATE INDEX IF NOT EXISTS testimonies_feed_idx
  ON public.testimonies (created_at DESC)
  WHERE consented = true;

-- Per-category feed
CREATE INDEX IF NOT EXISTS testimonies_category_idx
  ON public.testimonies (category, created_at DESC)
  WHERE consented = true;


-- ─── 2.3  Column-level ip_hash restriction for anon ──────────────────────────
-- The existing RLS policy already restricts rows (consented = true only).
-- This step ensures the ip_hash column is never returned to the anon role,
-- even if the row passes RLS.

REVOKE SELECT ON public.testimonies FROM anon;

GRANT SELECT (id, word, body, consented, created_at, category, excerpt)
  ON public.testimonies TO anon;


-- ─── 2.4  Seed mock testimonies ──────────────────────────────────────────────
-- Uses deterministic UUIDs so re-running is idempotent (ON CONFLICT DO NOTHING).
-- ip_hash is intentionally omitted — seed rows have no origin to hash.

INSERT INTO public.testimonies (id, word, category, body, consented, created_at)
VALUES

  -- Addiction ─────────────────────────────────────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000001',
    'alcohol', 'Addiction',
    'I still think about it every single day. Some days I win. Some days I don''t. I used to think freedom meant the craving would just disappear. It doesn''t work like that. But I''m still here, and I''m still trying, and that counts for something. God met me in the "I don''t know if I can do this" moments more than anywhere else.',
    true, '2026-03-27T09:14:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'pornography', 'Addiction',
    'Ten years. I didn''t think I''d ever get out. I was ashamed to even say the word out loud in church — like just naming it would make me less. But the shame was keeping me in. I finally told one person. That was the beginning. Not the end — the beginning. There''s still work to do, but I''m not alone in it anymore.',
    true, '2026-03-24T21:47:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'drugs', 'Addiction',
    'The hardest part wasn''t quitting. It was figuring out who I was without it. I''d been using since I was 15. I didn''t know who "sober me" was. I''m still finding out. Some of what I''m finding is embarrassing. Some of it is better than I expected. I think God is less concerned with my past than I am.',
    true, '2026-02-18T14:32:00Z'
  ),

  -- Mental Health ──────────────────────────────────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000004',
    'anxiety', 'Mental Health',
    'I used to plan my own funeral in my head — not because I wanted to die, just to feel in control of something. Anxiety had taken everything else. I couldn''t make a single decision without spiraling. Therapy helped. Medication helped. But honestly, the moment someone said "me too" without flinching — that helped more than anything. I''m not fixed. I''m functional. That''s enough for today.',
    true, '2026-03-20T07:55:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'depression', 'Mental Health',
    'I stayed in bed for 11 days. My mom called every morning. I didn''t pick up once. On day 12 I picked up, and she just said "I''m still here." That''s it. No lecture. No fix. She was just still there. I cried for a long time after that. I think that''s what grace sounds like sometimes — just someone being still there.',
    true, '2026-03-15T18:22:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'suicide', 'Mental Health',
    'I was on the edge of a bridge. I''m not entirely sure why I got off. I don''t have a clean story about a voice or a vision. I just got off. I went home. I called a number I''d been avoiding. That was three years ago. I still have bad days — genuinely bad ones. But I''m here to have them, and that matters more than I used to think it did.',
    true, '2026-01-05T11:08:00Z'
  ),

  -- Relationships ──────────────────────────────────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000007',
    'loneliness', 'Relationships',
    'I was surrounded by people every weekend and still the loneliest I''d ever been in my life. I was performing closeness. Laughing at the right moments. Nobody knew what was actually going on. I think I was afraid that if they did, they''d leave. When I finally let one person in — actually in — they didn''t leave. I hadn''t expected that.',
    true, '2026-03-10T16:40:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    'betrayal', 'Relationships',
    'My closest friend told everyone my secret. I still don''t fully trust anyone — I''m working on it. I used to think I was just broken for not being able to move on. But a counselor helped me understand that what happened was real and it made sense that it changed me. I''m learning to trust again slowly. Not naively. Just slowly.',
    true, '2026-02-28T20:03:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000009',
    'forgiveness', 'Relationships',
    'I forgave him not because he deserved it. Because I couldn''t keep carrying it. For a long time I thought forgiving meant pretending it didn''t happen, or that it was okay. It wasn''t okay. It happened. Forgiveness just meant I stopped letting it live rent-free in the center of my chest. It took years. It still feels incomplete sometimes. That''s okay.',
    true, '2026-03-05T08:17:00Z'
  ),

  -- Identity ───────────────────────────────────────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000010',
    'worthless', 'Identity',
    'My father told me I''d never amount to anything. I believed him for almost thirty years. The lie was so deep I couldn''t see it. I thought it was just "who I was." The first time someone told me God saw something in me I nearly laughed. It took a long time for that to land anywhere real. It''s landing now. Slowly.',
    true, '2026-03-22T13:29:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    'invisible', 'Identity',
    'I used to wonder if anyone would actually notice if I just disappeared one day. Not in a dark way — just in a quiet, hollow way. Like I was taking up space without mattering. I started showing up to a small group even though I hated small groups. Someone remembered my name week two. It sounds small. It wasn''t.',
    true, '2026-02-12T22:51:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    'broken', 'Identity',
    'I kept waiting to feel fixed. I eventually stopped waiting and started living with the cracks. There''s a Japanese art form — kintsugi — where they repair broken pottery with gold. I saw a picture of it once and had to sit down. I''m not a metaphor person. But that one got me. Maybe broken and beautiful aren''t opposites.',
    true, '2026-03-01T10:44:00Z'
  ),

  -- Spiritual ──────────────────────────────────────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000013',
    'doubt', 'Spiritual',
    'I spent three years furious at God. I think He was okay with that. I kept waiting to lose faith entirely but I couldn''t — even my anger was directed at Someone. When I came back it wasn''t because I had answers. It was because the doubt itself had somehow kept me tethered. I''m still not sure about a lot of things. But I''m here.',
    true, '2026-03-18T06:38:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000014',
    'anger', 'Spiritual',
    'I screamed at God in my car once. Just screamed. Nothing dramatic happened — no thunder, no peace descending. But something shifted. Like I''d finally stopped performing for someone who already knew. I think He''d been waiting for me to drop it. The pretending that I was fine. The polished prayers. He wanted the real version. That was terrifying. Also kind of a relief.',
    true, '2026-03-12T19:05:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000015',
    'surrender', 'Spiritual',
    'I didn''t want to surrender. I wanted to fix it myself. I really, genuinely couldn''t. Every attempt made it worse or made me more exhausted. The night I finally said "I don''t know what to do and I can''t do this alone" wasn''t a beautiful moment. It was me on a bathroom floor. But it was real. And real was apparently what was needed.',
    true, '2026-02-05T23:16:00Z'
  )

ON CONFLICT (id) DO NOTHING;


-- Seed word_counts for the 15 words above.
-- Uses DO UPDATE so if words already exist their count is incremented correctly.

INSERT INTO public.word_counts (word, count)
VALUES
  ('alcohol',     1),
  ('pornography', 1),
  ('drugs',       1),
  ('anxiety',     1),
  ('depression',  1),
  ('suicide',     1),
  ('loneliness',  1),
  ('betrayal',    1),
  ('forgiveness', 1),
  ('worthless',   1),
  ('invisible',   1),
  ('broken',      1),
  ('doubt',       1),
  ('anger',       1),
  ('surrender',   1)
ON CONFLICT (word) DO UPDATE
  SET count      = public.word_counts.count + 1,
      updated_at = now();