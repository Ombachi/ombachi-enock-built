# Roadmap — The Library (marketplace)

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
