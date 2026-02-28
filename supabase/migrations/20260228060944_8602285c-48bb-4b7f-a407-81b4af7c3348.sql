
-- Create storage bucket for PG listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('pg-images', 'pg-images', true);

-- Allow public read access to pg-images
CREATE POLICY "PG images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'pg-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload PG images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pg-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete PG images"
ON storage.objects FOR DELETE
USING (bucket_id = 'pg-images' AND auth.uid() IS NOT NULL);
