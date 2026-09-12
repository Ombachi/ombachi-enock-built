CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'site',
  subscribed boolean NOT NULL DEFAULT true,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entitlement_id uuid NOT NULL REFERENCES public.entitlements(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.download_events TO authenticated;
GRANT ALL ON public.download_events TO service_role;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers view own downloads" ON public.download_events FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_download_events_entitlement ON public.download_events(entitlement_id);
CREATE INDEX idx_entitlements_email ON public.entitlements(lower(email));
CREATE INDEX idx_orders_email ON public.orders(lower(customer_email));