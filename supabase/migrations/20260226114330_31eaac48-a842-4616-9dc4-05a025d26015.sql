-- Fix: change restrictive SELECT policy to permissive
DROP POLICY IF EXISTS "PG listings are publicly readable" ON public.pg_listings;
CREATE POLICY "PG listings are publicly readable"
  ON public.pg_listings
  FOR SELECT
  USING (true);