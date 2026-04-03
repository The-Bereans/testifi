-- Stage 1.2 Add testimony_type column
-- Safe to run on an existing database; existing rows default to 'salvation'.

-- Add testimony_type column, defaulting existing rows to 'salvation'
ALTER TABLE testimonies
  ADD COLUMN testimony_type TEXT NOT NULL DEFAULT 'salvation';

-- Add a check constraint to enforce valid values
ALTER TABLE testimonies
  ADD CONSTRAINT testimonies_type_check
  CHECK (testimony_type IN (
    'salvation', 'healing', 'deliverance',
    'provision', 'restoration', 'freedom', 'other'
  ));
