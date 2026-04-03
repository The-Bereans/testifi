-- ============================================================
-- Testify  Migration 005 — Drop body, unify testimony content into word
--
-- body was a separate optional extended-story column. It is redundant:
-- the testimony IS the word, whether a single keyword or a full sentence.
-- All content now lives in the word column (max 2000 chars).
--
-- Fixes: testimonies over 1000 chars being silently rejected.
-- ============================================================

BEGIN;

-- ─── Step 1: Drop the generated excerpt (derived from body) ──────────────────
-- Generated columns must be dropped before the column they reference.
ALTER TABLE public.testimonies DROP COLUMN IF EXISTS excerpt;

-- ─── Step 2: Drop body ───────────────────────────────────────────────────────
ALTER TABLE public.testimonies DROP COLUMN IF EXISTS body;

-- ─── Step 3: Add a length guard on word (2000 chars) ─────────────────────────
ALTER TABLE public.testimonies
  DROP CONSTRAINT IF EXISTS testimonies_word_length_check;

ALTER TABLE public.testimonies
  ADD CONSTRAINT testimonies_word_length_check
    CHECK (char_length(word) BETWEEN 1 AND 2000);

-- ─── Step 4: Recreate excerpt from word ──────────────────────────────────────
-- word is NOT NULL so the CASE guard is no longer needed.
ALTER TABLE public.testimonies
  ADD COLUMN excerpt text
    GENERATED ALWAYS AS (left(word, 160)) STORED;

-- Re-grant excerpt to anon (column object was recreated)
GRANT SELECT (excerpt) ON public.testimonies TO anon;

COMMIT;
