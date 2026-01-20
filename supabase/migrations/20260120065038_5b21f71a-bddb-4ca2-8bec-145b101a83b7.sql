-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_pgs table
CREATE TABLE public.saved_pgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pg_id TEXT NOT NULL,
  pg_name TEXT NOT NULL,
  pg_location TEXT,
  pg_price INTEGER,
  pg_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pg_id)
);

-- Create checkouts table
CREATE TABLE public.checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pg_id TEXT NOT NULL,
  pg_name TEXT NOT NULL,
  pg_location TEXT,
  pg_price INTEGER,
  check_in_date DATE,
  check_out_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_pgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Saved PGs policies
CREATE POLICY "Users can view their saved PGs" ON public.saved_pgs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save PGs" ON public.saved_pgs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved PGs" ON public.saved_pgs
  FOR DELETE USING (auth.uid() = user_id);

-- Checkouts policies
CREATE POLICY "Users can view their checkouts" ON public.checkouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create checkouts" ON public.checkouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their checkouts" ON public.checkouts
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checkouts_updated_at
  BEFORE UPDATE ON public.checkouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();