
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can like articles" ON public.article_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view likes" ON public.article_likes FOR SELECT USING (true);

CREATE UNIQUE INDEX idx_article_likes_unique ON public.article_likes (article_slug, session_id);

CREATE TABLE public.article_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  commenter_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can comment on articles" ON public.article_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view comments" ON public.article_comments FOR SELECT USING (true);
