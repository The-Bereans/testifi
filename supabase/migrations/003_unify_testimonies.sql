-- ============================================================
-- Testify  Phase 3 Database Unification
-- Makes testimonies the single source of truth for all submissions.
--
-- Stage 1  Relax the body constraint (allow NULL for word-only rows)
-- Stage 2  Fix the generated excerpt column (NULL-safe CASE expression)
-- Stage 3  Migrate orphan word_counts rows → testimonies, retire table
-- ============================================================

BEGIN;

-- ─── Stage 1: Relax the body constraint ──────────────────────────────────────
-- body was NOT NULL; word-only submissions need it to be nullable.

ALTER TABLE public.testimonies
  ALTER COLUMN body DROP NOT NULL;

-- The original inline check was auto-named testimonies_body_check.
ALTER TABLE public.testimonies
  DROP CONSTRAINT IF EXISTS testimonies_body_check;

ALTER TABLE public.testimonies
  ADD CONSTRAINT testimonies_body_check
    CHECK (body IS NULL OR char_length(body) BETWEEN 1 AND 1000);


-- ─── Stage 2: Fix the generated excerpt column ───────────────────────────────
-- Generated columns can't be altered in-place in PostgreSQL; drop & recreate.
-- Old formula: left(body, 160)      → errors when body IS NULL.
-- New formula: CASE WHEN body IS NOT NULL THEN left(body, 160) END  → NULL-safe.

ALTER TABLE public.testimonies DROP COLUMN excerpt;

ALTER TABLE public.testimonies
  ADD COLUMN excerpt text
    GENERATED ALWAYS AS (
      CASE WHEN body IS NOT NULL THEN left(body, 160) END
    ) STORED;

-- The previous column-level grant (migration 002) covered the old excerpt
-- column object.  Re-grant so anon can still read the new column.
GRANT SELECT (excerpt) ON public.testimonies TO anon;


-- ─── Stage 3: Migrate orphan word_counts rows & retire the table ─────────────
-- Any word that reached word_counts but never produced a testimony row gets
-- a stub row: body NULL, consented false.  Words that already have at least
-- one testimony row are intentionally skipped the testimony IS the record.

INSERT INTO public.testimonies (word, body, consented)
SELECT wc.word, NULL, false
FROM   public.word_counts wc
WHERE  NOT EXISTS (
  SELECT 1 FROM public.testimonies t WHERE t.word = wc.word
);

-- Nothing depends on increment_word_count or word_counts after this point.
DROP FUNCTION IF EXISTS public.increment_word_count(text);
DROP TABLE    IF EXISTS public.word_counts;

COMMIT;
