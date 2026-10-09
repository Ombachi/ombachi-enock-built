# Roadmap — The Library (marketplace)

## Site presentation and compliance (Sep 2026)
- [x] Role-led hero with a single accessible H1
- [x] Route-specific titles and descriptions
- [x] Contact thank-you page
- [x] Consent-gated analytics and cookie preferences

## Done (frontend, no backend required)
- Product/collection data model + types
- Seed catalogue fallback (works while backend paused)
- /library browse: search, format/category filters, sort
- /library/:slug product detail with SEO + OG + JSON-LD + share
- /library/collections/:slug curated collections
- Cart (localStorage) + /cart page
- Navbar "Library" link, Writing section cross-link

## Pending (requires backend resumed)
- Apply migration: products, collections, orders, order_items, downloads, entitlements + RLS/GRANTs
- Swap seed fallback -> live queries (already wired, auto-activates)
- Admin panels: products, inventory, orders/shipping
- M-PESA STK push + Stripe checkout edge functions
- /account: orders + My Library downloads
- Analytics events: product view, add to cart, checkout, purchase

## Search / polish / feeds (Aug 2026)
- [x] Site-wide search (posts + library) in Navbar, Cmd+K
- [x] Related reading on post pages
- [x] Reading progress bar + estimated read time
- [x] RSS edge function `supabase/functions/rss` — pending deploy (backend paused)
- [x] sitemap.xml generator (`scripts/generate-sitemap.ts`, predev/prebuild)
- [ ] Transactional email — blocked on a verified sending domain
- [x] Newsletter capture (footer/home section; writes to `newsletter_subscribers` when backend is live, queues locally otherwise)
- [ ] Migration: `newsletter_subscribers` table + RLS/GRANTs (blocked: database paused)

## Responsive media and commerce environment (Oct 2026)
- [ ] Bundle Hero, About, and Passions photos directly for external hosting and verify image loading
- [x] Responsive AVIF/WebP sources for hero and heavy section photography
- [x] Requested page titles and descriptions
- [x] Editorial article thumbnails and publication book-jacket fallbacks
- [ ] Preview/production order tagging (blocked: database paused)
- [x] Circular portrait favicon and web-app icons
