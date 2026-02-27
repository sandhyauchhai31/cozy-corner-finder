
-- Drop all existing restrictive policies on pg_listings
DROP POLICY IF EXISTS "PG listings are publicly readable" ON public.pg_listings;
DROP POLICY IF EXISTS "Authenticated users can insert listings" ON public.pg_listings;
DROP POLICY IF EXISTS "Authenticated users can update listings" ON public.pg_listings;
DROP POLICY IF EXISTS "Authenticated users can delete listings" ON public.pg_listings;

-- Recreate as PERMISSIVE policies
CREATE POLICY "PG listings are publicly readable"
ON public.pg_listings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert listings"
ON public.pg_listings FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update listings"
ON public.pg_listings FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete listings"
ON public.pg_listings FOR DELETE
USING (auth.uid() IS NOT NULL);
