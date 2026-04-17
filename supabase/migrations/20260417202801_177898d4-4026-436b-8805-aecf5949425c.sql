
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  event_type TEXT DEFAULT 'pageview',
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);
CREATE INDEX idx_page_views_session ON public.page_views(session_id);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can record analytics events
CREATE POLICY "Anyone can record page views"
ON public.page_views
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users (you, when you sign in) can read analytics
CREATE POLICY "Only authenticated users can view analytics"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);
