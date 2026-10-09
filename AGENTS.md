# Architecture decisions

- Gate optional first-party analytics behind browser-persisted consent and a shared consent event, so route tracking and custom events follow one privacy choice.
- Render Hero, About, and Passions photos through imported local assets, without Lovable-only responsive image sources, so Vite deployments remain self-contained on external hosting.