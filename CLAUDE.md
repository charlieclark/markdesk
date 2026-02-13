# Markdesk

Open-source help center (Next.js site + Preact beacon widget). Repo: `github.com/charlieclark/markdesk`.

## Architecture

```
markdesk.config.ts               — Single source of truth for branding/settings
content/
  articles/{category}/*.md       — Help articles
  updates/*.md                   — Product updates
src/
  app/                           — Next.js pages and API routes
  beacon/                        — Preact widget (built separately via tsup)
  components/                    — React components for the help center site
  lib/                           — Config, types, content loading, categories, email
scripts/
  build-search-index.ts          — Generates public/search-index.json at build time
  build-beacon.ts                — Bundles beacon → public/beacon.js (~47KB IIFE)
  build-content.ts               — Pre-renders article/update content as static JSON
public/
  beacon.js                      — Generated (gitignored)
  search-index.json              — Generated (gitignored)
  content/                       — Generated (gitignored)
  images/articles/               — Article images
  images/updates/                — Update images
```

## Build

```
npm run build
```

Runs four steps in order:
1. `build:search` — generates `public/search-index.json` from article markdown
2. `build:content` — pre-renders article/update HTML as static JSON in `public/content/`
3. `build:beacon` — bundles `src/beacon/` into `public/beacon.js` via tsup (Preact IIFE with inlined CSS)
4. `next build` — builds the Next.js site

The beacon source (`src/beacon/`) and scripts are excluded from `tsconfig.json` because Preact's JSX pragma conflicts with React types.

## Configuration

All branding, email, and display settings are in `markdesk.config.ts`. The config is loaded via `src/lib/config.ts` which exports `getConfig()`.

Key settings:
- `name` — Product name (used in header, footer, metadata)
- `siteUrl` — Help center URL
- `productUrl` — Main product URL (header CTA, footer link)
- `supportEmail` / `fromEmail` — Contact form email addresses
- `colors.primary` — Primary brand color (injected as CSS variable)
- `emailSender` — `'sendgrid'` | `'resend'` | `'nodemailer'`
- `beacon.title` — Title shown in the beacon panel header

## Content

### Creating an article

1. Create a markdown file in `content/articles/{category}/`
2. Add frontmatter:

```yaml
---
title: "My Article Title"
slug: "my-article-title"
category: "getting-started"
description: "A short description for search and previews."
order: 5
faq: true          # optional — includes in FAQ section
createdAt: "2026-02-13"
updatedAt: "2026-02-13"
---

Article body in markdown here.
```

- `slug` must be unique across all articles (used in URLs: `/article/{slug}`)
- `category` must match the directory name and a slug in `src/lib/categories.ts`
- `order` controls sort order within the category (lower = first)
- `faq: true` makes the article appear in the FAQ section on the homepage and beacon
- Do NOT include an `# h1` heading in the body — the title is rendered from frontmatter
- Images go in `public/images/articles/` and are referenced as `/images/articles/filename.png`

### Available categories

Defined in `src/lib/categories.ts`: `getting-started`, `features`, `troubleshooting`.

There is also a virtual `faq` category — not a real directory, but articles with `faq: true` are collected and displayed as FAQ.

### Creating a product update

1. Create a markdown file in `content/updates/` named `{date}-{slug}.md`
2. Add frontmatter:

```yaml
---
title: "New Feature Name"
slug: "new-feature-name"
date: "2026-02-13"
category: "new"
showModal: true
---

Update body in markdown here.
```

- `category` is one of: `new`, `improvement`, `fix`, `announcement`, `coming-soon`
- `showModal: true` shows the update as a popup modal in the beacon for users who haven't dismissed it (updates older than 6 months are never shown in the modal)
- Images go in `public/images/updates/`

## Email Sender

The contact form supports three email providers configured via `markdesk.config.ts`:

- `sendgrid` — requires `SENDGRID_API_KEY` env var
- `resend` — requires `RESEND_API_KEY` env var
- `nodemailer` — requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` env vars

Email sender abstraction lives in `src/lib/email/`.

## Beacon Widget

### Embedding the beacon

```html
<script>
  window.MarkdeskConfig = {
    helpCenterUrl: 'https://help.example.com',
    title: 'Help',
    position: 'bottom-right',
  };
</script>
<script src="https://help.example.com/beacon.js" async></script>
```

### Beacon API (window.Markdesk)

```javascript
window.Markdesk.open('answers')   // Open beacon to Answers tab
window.Markdesk.open('updates')   // Open beacon to Updates tab
window.Markdesk.open('ask')       // Open beacon to Contact tab
window.Markdesk.close()
window.Markdesk.toggle()
window.Markdesk.identify({ email })  // Pre-fill contact form email
window.Markdesk.showModal()          // Enable modal (when autoShowModal is false)
window.Markdesk.article(slug)        // Open a specific article in the beacon
```

## API Routes

All API routes are CORS-enabled for cross-origin beacon requests.

- `GET /api/updates` — List all update metadata (sorted newest first)
- `GET /api/update/[slug]` — Full update content (HTML)
- `GET /api/article/[slug]` — Full article content (HTML)
- `POST /api/contact` — Contact form submission. Allowed origins: `siteUrl` + `allowedOrigins` from config + localhost in dev.

## Environment Variables

```
NEXT_PUBLIC_SITE_URL — Site URL (used for content rendering)

# Pick one based on emailSender config:
SENDGRID_API_KEY     — SendGrid API key
RESEND_API_KEY       — Resend API key
SMTP_HOST/PORT/USER/PASS — SMTP credentials for Nodemailer
```
