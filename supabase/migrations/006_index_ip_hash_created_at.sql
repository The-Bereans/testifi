-- Speed up per-IP rate-limit queries (ip_hash + created_at window scan)
CREATE INDEX IF NOT EXISTS testimonies_ip_hash_created_at_idx
  ON public.testimonies (ip_hash, created_at DESC);
