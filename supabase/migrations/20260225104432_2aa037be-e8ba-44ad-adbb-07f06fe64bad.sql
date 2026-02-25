
-- Create pg_listings table to store admin-created PG listings
CREATE TABLE public.pg_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  rent INTEGER NOT NULL DEFAULT 0,
  deposit INTEGER NOT NULL DEFAULT 0,
  gender TEXT NOT NULL DEFAULT 'boys',
  food TEXT NOT NULL DEFAULT 'veg',
  images TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT false,
  distance DOUBLE PRECISION NOT NULL DEFAULT 0,
  owner_phone TEXT NOT NULL DEFAULT '',
  owner_whatsapp TEXT NOT NULL DEFAULT '',
  rules TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  room_sharing INTEGER NOT NULL DEFAULT 2,
  bathroom_type TEXT NOT NULL DEFAULT 'shared',
  rooms JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pg_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read listings (public data)
CREATE POLICY "PG listings are publicly readable"
  ON public.pg_listings FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (admin use)
CREATE POLICY "Authenticated users can insert listings"
  ON public.pg_listings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update listings"
  ON public.pg_listings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete listings"
  ON public.pg_listings FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Timestamp trigger
CREATE TRIGGER update_pg_listings_updated_at
  BEFORE UPDATE ON public.pg_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
