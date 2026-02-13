---
name: markdesk-setup
description: Set up a Markdesk help center for your project
triggers:
  - create a help center
  - set up markdesk
  - add a help center
  - scaffold help center
  - install markdesk
---

# Markdesk Setup Skill

You are setting up a new Markdesk help center for the user. Follow these steps:

## Step 1: Gather Information

Use `AskUserQuestion` to ask the user the following (you can batch multiple questions):

1. **Project directory name** — What should the help center directory be called? (default: `help-center`)
2. **Brand name** — What is your product/company name?
3. **Product URL** — What is your main product URL? (e.g., `https://example.com`)
4. **Help center URL** — Where will the help center be hosted? (e.g., `https://help.example.com`)
5. **Primary color** — What is your brand's primary color? (hex code, default: `#4b68af`)
6. **Email sender** — Which email provider do you want to use for the contact form?
   - Resend (recommended)
   - SendGrid
   - Nodemailer (SMTP)
7. **Support email** — What email should contact form submissions go to?

## Step 2: Clone and Clean Up

Clone the repo, remove git history, and delete files that are specific to the Markdesk project (not part of the help center template):

```bash
git clone https://github.com/charlieclark/markdesk.git <directory-name>
cd <directory-name>
rm -rf .git
rm -rf skills/
rm -rf docs/
rm -rf .github/
```

These deleted files are:
- `skills/` — Vercel Skills for scaffolding markdesk (not needed in the user's project)
- `docs/` — GitHub Pages marketing site for the markdesk project
- `.github/` — GitHub Actions workflow for the markdesk marketing site

## Step 3: Update Configuration

Edit `markdesk.config.ts` with the user's answers:

```ts
import type { MarkdeskConfig } from './src/lib/config';

const config: MarkdeskConfig = {
  name: '<brand-name>',
  siteUrl: '<help-center-url>',
  productUrl: '<product-url>',
  supportEmail: '<support-email>',
  fromEmail: '<support-email>',
  colors: { primary: '<primary-color>' },
  emailSender: '<chosen-sender>',
  footer: { termsUrl: '', privacyUrl: '' },
  allowedOrigins: ['<product-domain>'],
  beacon: { title: 'Help' },
};

export default config;
```

## Step 4: Rewrite README

Replace `README.md` with a project-specific README. Use this template, filling in the user's brand name and URLs:

```markdown
# <Brand Name> Help Center

Help center for <Brand Name>, built with [Markdesk](https://github.com/charlieclark/markdesk).

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

Runs in order:
1. Generates search index from articles
2. Pre-renders article/update content as static JSON
3. Bundles beacon widget into `public/beacon.js`
4. Builds the Next.js site

## Content

### Adding a help article

Create a markdown file in `content/articles/{category}/`:

\`\`\`yaml
---
title: "Article Title"
slug: "article-slug"
category: "getting-started"
description: "Short description."
order: 1
faq: false
createdAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
---

Article content here.
\`\`\`

### Adding a product update

Create a markdown file in `content/updates/` named `YYYY-MM-DD-slug.md`:

\`\`\`yaml
---
title: "Update Title"
slug: "update-slug"
date: "YYYY-MM-DD"
category: "new"
showModal: true
---

Update content here.
\`\`\`

### Categories

Edit `src/lib/categories.ts` to customize. Defaults: `getting-started`, `features`, `troubleshooting`.

## Beacon

Embed on your site:

\`\`\`html
<script>
  window.MarkdeskConfig = {
    helpCenterUrl: '<help-center-url>',
    title: 'Help',
  };
</script>
<script src="<help-center-url>/beacon.js" async></script>
\`\`\`

## Deployment

Deploy to Vercel, Netlify, or any Node.js host that supports Next.js.
```

## Step 5: Install Email Dependency

Based on the chosen email sender, install the appropriate package:

- **Resend**: `npm install resend`
- **SendGrid**: `npm install @sendgrid/mail`
- **Nodemailer**: `npm install nodemailer`

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Create .env

Copy `.env.example` to `.env` and fill in the relevant API key:

- **Resend**: Set `RESEND_API_KEY`
- **SendGrid**: Set `SENDGRID_API_KEY`
- **Nodemailer**: Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

Also set `NEXT_PUBLIC_SITE_URL` to the help center URL.

## Step 8: Explain Next Steps

Tell the user:

1. **Add content** — Create help articles in `content/articles/{category}/` and product updates in `content/updates/`. See `CLAUDE.md` for the frontmatter format.
2. **Customize categories** — Edit `src/lib/categories.ts` to match your product's topic areas.
3. **Embed the beacon** — Add the beacon script to your main app:
   ```html
   <script>
     window.MarkdeskConfig = {
       helpCenterUrl: '<help-center-url>',
       title: 'Help',
     };
   </script>
   <script src="<help-center-url>/beacon.js" async></script>
   ```
4. **Run locally** — `npm run dev` to preview at `http://localhost:3000`
5. **Deploy** — Deploy to Vercel, Netlify, or any Node.js host. Run `npm run build` to generate all assets.
6. **Write docs** — Use the `markdesk-docs` skill to generate help articles from your codebase changes.
