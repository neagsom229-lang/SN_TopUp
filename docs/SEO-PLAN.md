# SEO & Open Graph Prerendering Plan

## Problem

Social media scrapers (Facebook, Telegram, Twitter, LinkedIn) do not execute client-side JavaScript (React/SPAs) when previewing shared links. Consequently, shared links relying solely on client-side React Helmet or dynamic document titles miss critical Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card meta tags.

## Recommended Solution (Vite Prerender / SSG)

1. **Build-Time Prerendering**: Use `vite-plugin-prerender` or a post-build node script that reads the generated `dist/index.html` and injects per-route dynamic meta tags (including game titles, descriptions, and Open Graph tags) for static game slugs generated from the games database/catalog at build time.
2. **Static Asset Routing**: Ensure static files like `robots.txt` and `sitemap.xml` are placed in `apps/web/public/` so they are served directly by the web server/CDN without triggering the SPA HTML fallback catch-all route.
3. **Semantic HTML & Descriptive Links**: Maintain explicit anchor texts (no generic "Click here") and valid ARIA landmarks across all pages to satisfy accessibility and SEO crawling requirements.
