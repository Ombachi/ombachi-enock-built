# Responsive media, metadata, and preview-safe commerce

## Build
- Convert the existing hero, portrait, and passion photography into responsive AVIF and WebP renditions while retaining JPEG fallbacks.
- Add reusable responsive image markup with `srcset` and accurate `sizes` for full-width hero images, About imagery, passion cards, and other heavy section assets.
- Add editorial article thumbnails with category-led fallback artwork, and replace empty publication covers with a typographic book jacket showing title, Ombachi Enock, and the publication category/imprint.
- Apply the requested page titles and descriptions to Home, project case studies, cart, checkout, account, 404, and admin; keep admin excluded from search indexing.
- Tag new orders as `preview` or `production` using a client origin/mode signal validated and persisted by the secure order function, without creating a second backend.
- Create circular 32×32 and 192×192 portrait icons from the existing professional headshot, wire favicon and web-app manifest references, and preserve the existing social image.

## Technical details
- Generated media will live beside project assets and use `<picture>` with AVIF first, WebP second, and JPEG fallback.
- Preview tagging will require an additive database column plus generated type alignment and edge-function payload handling; existing orders remain valid.
- Verify compilation, current preview rendering, responsive image selection, metadata, publication fallbacks, and checkout request shape without submitting a real payment.
