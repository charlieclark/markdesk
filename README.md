# Markdesk

Open-source help center with an embeddable beacon widget. Built with Next.js and Preact.

## Features

- **Help articles** — Markdown-based articles organized by category with full-text search
- **Product updates** — Changelog entries with badge categories (new, improvement, fix, etc.)
- **Beacon widget** — Embeddable Preact widget (~47KB) with search, articles, contact form, and update notifications
- **Contact form** — Built-in contact form with support for SendGrid, Resend, or Nodemailer
- **Configurable** — Single config file for branding, colors, email, and more

## Quick Start

```bash
# Clone the repo
git clone https://github.com/charlieclark/markdesk.git my-help-center
cd my-help-center
rm -rf .git

# Install dependencies
npm install

# Configure
# Edit markdesk.config.ts with your branding and settings

# Set up environment variables
cp .env.example .env
# Fill in your email sender API key

# Run locally
npm run dev
```

## Configuration

All settings live in `markdesk.config.ts`:

```ts
{
  name: 'My Product',              // Brand name
  siteUrl: 'https://help.example.com',  // Help center URL
  productUrl: 'https://example.com',    // Main product URL
  supportEmail: 'support@example.com',  // Where contact form emails go
  fromEmail: 'help@example.com',        // Sender email address
  colors: { primary: '#4b68af' },       // Primary brand color
  emailSender: 'resend',               // 'sendgrid' | 'resend' | 'nodemailer'
  footer: { termsUrl: '', privacyUrl: '' },
  allowedOrigins: [],                   // Additional CORS origins for beacon
  beacon: { title: 'Help' },           // Beacon panel title
}
```

## Content

### Creating an article

Create a markdown file in `content/articles/{category}/`:

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

### Categories

Default categories (edit `src/lib/categories.ts` to customize):
- `getting-started` — Getting Started
- `features` — Features
- `troubleshooting` — Troubleshooting

### Creating a product update

Create a markdown file in `content/updates/` named `{date}-{slug}.md`:

```yaml
---
title: "New Feature Name"
slug: "new-feature-name"
date: "2026-02-13"
category: "new"       # new | improvement | fix | announcement | coming-soon
showModal: true       # show as popup in beacon
---

Update body in markdown here.
```

## Beacon Widget

The beacon is a self-contained Preact widget that can be embedded on any site.

### Installation

Add to your site's HTML:

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

### API

```javascript
window.Markdesk.open('answers')   // Open to Answers tab
window.Markdesk.open('updates')   // Open to Updates tab
window.Markdesk.open('ask')       // Open to Contact tab
window.Markdesk.close()
window.Markdesk.toggle()
window.Markdesk.identify({ email })  // Pre-fill contact form email
window.Markdesk.showModal()          // Enable modal (when autoShowModal is false)
window.Markdesk.article(slug)        // Open a specific article
```

## Email Setup

Configure `emailSender` in `markdesk.config.ts` and set the corresponding environment variable:

| Sender | Config value | Env variable |
|--------|-------------|--------------|
| [Resend](https://resend.com) | `'resend'` | `RESEND_API_KEY` |
| [SendGrid](https://sendgrid.com) | `'sendgrid'` | `SENDGRID_API_KEY` |
| SMTP / Nodemailer | `'nodemailer'` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |

## Build

```bash
npm run build
```

Runs in order:
1. `build:search` — generates search index from articles
2. `build:content` — pre-renders article/update content as static JSON
3. `build:beacon` — bundles beacon widget into `public/beacon.js`
4. `next build` — builds the Next.js site

## Deployment

Deploy to Vercel, Netlify, or any Node.js hosting that supports Next.js.

## License

MIT
