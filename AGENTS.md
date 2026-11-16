# Architecture decisions

- Gate optional first-party analytics behind browser-persisted consent and a shared consent event, so route tracking and custom events follow one privacy choice.
- Render Hero, About, and Passions photos through imported local assets, without Lovable-only responsive image sources, so Vite deployments remain self-contained on external hosting.
- Serve publication downloads and native PDF views through same-origin Vercel file routes that verify signed paid orders and matching order items; keep HTML sandboxed and PDFs top-level to avoid storage framing restrictions.