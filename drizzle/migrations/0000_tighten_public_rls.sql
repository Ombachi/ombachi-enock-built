-- Orders are created only by the server-side checkout function
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
DROP POLICY IF EXISTS "Anyone can add order items" ON public.order_items;

-- Unused public catalogues
DROP POLICY IF EXISTS "Anyone can view cached articles" ON public.cached_articles;
CREATE POLICY "Admins view cached articles" ON public.cached_articles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON public.collections;

-- Contact form: validated submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a valid contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(name)) BETWEEN 1 AND 200 AND length(email) <= 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(btrim(message)) BETWEEN 1 AND 5000);

-- Newsletter: valid emails, default subscribed state only
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe with a valid email" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (length(email) <= 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND subscribed = true AND unsubscribed_at IS NULL AND length(source) <= 50);

-- Page views: bounded analytics rows
DROP POLICY IF EXISTS "Anyone can record page views" ON public.page_views;
CREATE POLICY "Anyone can record bounded page views" ON public.page_views FOR INSERT TO anon, authenticated
WITH CHECK (length(path) BETWEEN 1 AND 2048 AND (referrer IS NULL OR length(referrer) <= 2048) AND (user_agent IS NULL OR length(user_agent) <= 1024)
  AND (session_id IS NULL OR length(session_id) <= 128) AND (event_type IS NULL OR length(event_type) <= 100)
  AND (event_data IS NULL OR pg_column_size(event_data) <= 8192));

-- Likes and comments: only on published posts
DROP POLICY IF EXISTS "Anyone can like articles" ON public.article_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.article_likes;
CREATE POLICY "Anyone can like published posts" ON public.article_likes FOR INSERT TO anon, authenticated
WITH CHECK (length(session_id) BETWEEN 1 AND 128 AND EXISTS (SELECT 1 FROM public.posts p WHERE p.slug = article_slug AND p.status = 'published'));
CREATE POLICY "Likes on published posts are viewable" ON public.article_likes FOR SELECT TO anon, authenticated
USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.posts p WHERE p.slug = article_slug AND p.status = 'published'));

DROP POLICY IF EXISTS "Anyone can comment on articles" ON public.article_comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.article_comments;
CREATE POLICY "Anyone can comment on published posts" ON public.article_comments FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(commenter_name)) BETWEEN 1 AND 100 AND length(btrim(comment_text)) BETWEEN 1 AND 2000
  AND EXISTS (SELECT 1 FROM public.posts p WHERE p.slug = article_slug AND p.status = 'published'));
CREATE POLICY "Comments on published posts are viewable" ON public.article_comments FOR SELECT TO anon, authenticated
USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.posts p WHERE p.slug = article_slug AND p.status = 'published'));