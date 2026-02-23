---
name: markdesk
description: Set up a Markdesk help center or write help articles and product updates
triggers:
  - create a help center
  - set up markdesk
  - add a help center
  - scaffold help center
  - install markdesk
  - write a help article
  - create a product update
  - document a feature
  - write a changelog entry
  - write documentation
  - add a help doc
  - create help content
---

# Markdesk Skill

This skill handles two workflows: **setup** (scaffolding a new help center) and **docs** (writing help articles and product updates).

## Routing

First, determine which workflow to run:

1. Look for a `markdesk.config.ts` file in the current working directory or any sibling directories. If one exists with real values (not the placeholder `example.com` defaults), the user already has a help center set up — go to **Docs Workflow**.
2. If no configured help center is found, go to **Setup Workflow**.
3. If the user's message explicitly mentions setup/scaffolding/installing, go to **Setup Workflow** regardless.
4. If the user's message explicitly mentions writing docs/articles/updates, go to **Docs Workflow** regardless.

---

## Setup Workflow

You are setting up a new Markdesk help center for the user.

### Step 1: Gather Information

Use `AskUserQuestion` to ask the user the following (you can batch multiple questions):

1. **Project directory name** — What should the help center directory be called? (default: `help-center`)
2. **Brand name** — What is your product/company name?
3. **Product URL** — What is your main product URL? (e.g., `https://example.com`)
4. **Help center URL** — What subdomain will the help center live on? (e.g., `https://help.example.com`). Markdesk is a standalone Next.js site and must be deployed on its own subdomain, not a subpath.
5. **Primary color** — What is your brand's primary color? (hex code, default: `#4b68af`)
6. **Email sender** — Which email provider do you want to use for the contact form?
   - Resend (recommended)
   - SendGrid
   - Nodemailer (SMTP)
7. **Support email** — What email should contact form submissions go to?

### Step 2: Clone and Clean Up

Clone the repo, rename the remote to `markdesk` (so the user can pull updates later), and delete files that are specific to the Markdesk project (not part of the help center template):

```bash
git clone https://github.com/charlieclark/markdesk.git <directory-name>
cd <directory-name>
git remote rename origin markdesk
rm -rf skills/
rm -rf docs/
rm -rf .github/
```

These deleted files are:
- `skills/` — Vercel Skills for scaffolding markdesk (not needed in the user's project)
- `docs/` — GitHub Pages marketing site for the markdesk project
- `.github/` — GitHub Actions workflow for the markdesk marketing site

### Step 3: Update Configuration

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
  beacon: {
    title: 'Help',
    autoShowModal: true,
    modalDelay: 5000,
    modalMaxAgeDays: 180,
  },
};

export default config;
```

### Step 4: Rewrite README

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

## Updating Markdesk

Pull the latest source code from the Markdesk project:

\`\`\`bash
git fetch markdesk
git merge markdesk/main
npm install
\`\`\`

## Deployment

Deploy to Vercel, Netlify, or any Node.js host that supports Next.js.
```

### Step 5: Install Email Dependency

Based on the chosen email sender, install the appropriate package:

- **Resend**: `npm install resend`
- **SendGrid**: `npm install @sendgrid/mail`
- **Nodemailer**: `npm install nodemailer`

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Create .env

Copy `.env.example` to `.env` and fill in the relevant API key:

- **Resend**: Set `RESEND_API_KEY`
- **SendGrid**: Set `SENDGRID_API_KEY`
- **Nodemailer**: Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

Also set `NEXT_PUBLIC_SITE_URL` to the help center URL.

### Step 8: Explain Next Steps

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
6. **Push to your own repo** — Add your own remote and push:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
7. **Update markdesk** — Pull the latest markdesk source code anytime:
   ```bash
   git fetch markdesk
   git merge markdesk/main
   npm install
   ```

---

## Docs Workflow

You are helping the user create help center content (articles and/or product updates) for their Markdesk-powered help center.

### Step 1: Gather Context

Look for the user's main project repository (not the help center) and run:

```bash
git log --oneline -30
```

Show the user the recent commits and ask which changes they want to document. If they want details on specific commits, use `git show <hash>`.

### Step 2: Ask Content Type

Use `AskUserQuestion` to ask:

**What type of content do you want to create?**
- **Help article** — Documentation explaining how to use a feature
- **Product update** — Changelog entry announcing a change
- **Both** — Create both a help article and a product update

### Step 3: Ask About Images

Ask if the user has any screenshots or images to include. Users can:

- **Drag and drop images** directly into the chat — the image path will be provided (e.g. `/Users/name/Desktop/screenshot.png`)
- **Provide file paths** to existing images on disk

When the user provides images (via drag-and-drop or path):

1. Copy each image to the appropriate directory in the help center project:
   - Articles: `public/images/articles/`
   - Updates: `public/images/updates/`
2. Rename to a clean slug-based filename: `{slug}-{number}.{ext}` (e.g., `my-feature-1.png`)
3. Reference in markdown as `![Alt text](/images/articles/{slug}-1.png)` or `![Alt text](/images/updates/{slug}-1.png)`

**Important — macOS screenshot filenames:** macOS screenshots have spaces in the filename (e.g. `Screenshot 2026-02-13 at 12.17.27 PM.png`). Always quote the source path when copying:

```bash
cp "/Users/name/Desktop/Screenshot 2026-02-13 at 12.17.27 PM.png" public/images/updates/my-feature-1.png
```

### Step 4: Category Selection (for articles)

If creating a help article, read the categories from `src/lib/categories.ts` in the help center project dynamically. Do NOT hardcode category names.

Use `AskUserQuestion` to ask:
1. Which category should this article belong to?
2. Should it appear in the FAQ section? (`faq: true`)

### Step 5: Generate Help Article

Create the file at `content/articles/{category}/{slug}.md` in the help center project.

Frontmatter format:

```yaml
---
title: "Article Title"
slug: "article-slug"
category: "category-slug"
description: "Short description for search and previews."
order: 99
faq: false
createdAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
---
```

Rules:
- **Unique slug** — Check existing articles to avoid duplicate slugs
- **No h1** — Do NOT include an `# h1` heading in the body (the title is rendered from frontmatter)
- **Today's date** — Use today's date for `createdAt` and `updatedAt`
- **Clear writing** — Write in a clear, concise, helpful tone
- **Practical content** — Include step-by-step instructions where appropriate
- **Images** — Reference as `/images/articles/filename.png`

### Step 6: Generate Product Update

Create the file at `content/updates/YYYY-MM-DD-{slug}.md` in the help center project.

Frontmatter format:

```yaml
---
title: "Update Title"
slug: "update-slug"
date: "YYYY-MM-DD"
category: "new"
showModal: true
---
```

Rules:
- **Date in filename** — Use today's date in the filename: `YYYY-MM-DD-{slug}.md`
- **Category** — One of: `new`, `improvement`, `fix`, `announcement`, `coming-soon`
- **showModal** — Set to `true` to show as a popup notification in the beacon widget
- **Concise** — Keep updates brief and focused on what changed and why it matters
- **No duplicate images** — If an image appears in the content body, don't repeat it

### Step 7: Verify

After creating the content:
1. List the files created
2. Show the frontmatter for each
3. Remind the user to run `npm run build` in the help center to regenerate the search index and content
