
-- Drop existing restrictive storage policies
DROP POLICY IF EXISTS "PG images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload PG images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete PG images" ON storage.objects;

-- Recreate as PERMISSIVE policies
CREATE POLICY "PG images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pg-images');

CREATE POLICY "Authenticated users can upload PG images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pg-images');

CREATE POLICY "Authenticated users can delete PG images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pg-images');
