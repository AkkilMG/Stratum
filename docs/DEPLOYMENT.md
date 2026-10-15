# Deployment

The wiki is a static Next.js export (`output: "export"`) published to **GitHub Pages**
and served from the custom domain **https://wiki.stratum.arkynox.com**.

- Canonical domain: `wiki.stratum.arkynox.com`
- `docs.stratum.arkynox.com` → **301 redirect** to the canonical domain (Cloudflare)
- `https://akkilmg.github.io/Stratum` → redirects to the canonical domain automatically

Because the site is served from the **root of a custom domain**, `basePath`/`assetPrefix`
are empty. They are env-driven (`NEXT_PUBLIC_BASE_PATH`) and the deploy workflow does not
set them, so the build emits root-relative asset URLs.

## 1. DNS (Cloudflare)

Add these records in the Cloudflare dashboard for `stratum.arkynox.com`:

| Type  | Name   | Target                        | Proxy                     |
| ----- | ------ | ----------------------------- | ------------------------- |
| CNAME | `wiki` | `akkilmg.github.io`           | **DNS only** (grey cloud) |
| CNAME | `docs` | `wiki.stratum.arkynox.com`    | **Proxied** (orange cloud)|

`wiki` must be **DNS only**. Cloudflare's proxy in front of GitHub Pages can break the
Let's Encrypt certificate GitHub provisions and cause redirect loops. `docs` is proxied so
Cloudflare can serve the redirect at the edge.

### Redirect `docs.*` → `wiki.*`

In **Rules → Redirect Rules → Create rule → Single Redirect**:

- **When incoming requests match:** Custom filter expression
  `http.host eq "docs.stratum.arkynox.com"`
- **Then:** Static redirect
  - URL: `https://wiki.stratum.arkynox.com`
  - Preserve query string: on
  - Type: **301**
- **Preserve path:** use a dynamic redirect target
  `concat("https://wiki.stratum.arkynox.com", http.request.uri.path)`
  so deep links map 1:1 (e.g. `/en/guide/search/` stays `/en/guide/search/`).

## 2. GitHub repository settings

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Custom domain:** `wiki.stratum.arkynox.com` → **Save** (this writes/keeps `public/CNAME`).
3. Enable **Enforce HTTPS** (available once the certificate is issued).
4. Recommended: **verify** the domain (Settings → Pages → Domain verification) to prevent takeover.

> The repository is private; GitHub Pages on private repositories requires a paid plan
> (Pro / Team / Enterprise).

## 3. Automated deploy

`.github/workflows/deploy-wiki.yml` runs on pushes to the `wiki` branch:

1. `npm ci`
2. `npm run build` (static export to `out/`)
3. `touch out/.nojekyll` (belt-and-suspenders; `public/.nojekyll` is also committed)
4. `actions/configure-pages` (with `enablement: true`)
5. upload `out/` and deploy to GitHub Pages

Re-run the workflow from **Actions → Deploy Wiki → Run workflow** after changing settings.

## 4. Verify

```shell
npm run lint
npm run typecheck
npm run build
```

Then confirm `out/CNAME` contains `wiki.stratum.arkynox.com` and check:

- `https://wiki.stratum.arkynox.com/` → serves the site
- `https://wiki.stratum.arkynox.com/en/guide/search/` → deep link works
- `https://docs.stratum.arkynox.com/en/guide/search/` → 301 to the same path on `wiki.*`
- `https://wiki.stratum.arkynox.com/sitemap.xml` and `/robots.txt` resolve

## Files that reference the domain

- `public/CNAME` — GitHub Pages custom domain
- `lib/config.ts` — `siteConfig.url` (single source of truth)
- `app/layout.tsx` — `metadataBase` (imports `siteConfig`)
- `app/sitemap.ts`, `app/robots.ts` — generated from `siteConfig.url`
