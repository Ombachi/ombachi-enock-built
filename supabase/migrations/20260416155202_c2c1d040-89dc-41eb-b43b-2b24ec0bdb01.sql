
-- Table to cache Medium RSS articles
CREATE TABLE public.cached_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  tag TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  medium_url TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Litu Soja',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cached_articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read articles
CREATE POLICY "Anyone can view cached articles"
ON public.cached_articles
FOR SELECT
TO public
USING (true);

-- Only service role can insert/update (edge function)
CREATE POLICY "Service role can manage articles"
ON public.cached_articles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
