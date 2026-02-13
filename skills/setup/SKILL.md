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

## Step 2: Clone and Set Up

```bash
git clone https://github.com/charlieclark/markdesk.git <directory-name>
cd <directory-name>
rm -rf .git
```

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
  allowedOrigins: ['<product-url>'],
  beacon: { title: 'Help' },
};

export default config;
```

## Step 4: Install Email Dependency

Based on the chosen email sender, install the appropriate package:

- **Resend**: `npm install resend`
- **SendGrid**: `npm install @sendgrid/mail`
- **Nodemailer**: `npm install nodemailer`

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Create .env

Copy `.env.example` to `.env` and fill in the relevant API key:

- **Resend**: Set `RESEND_API_KEY`
- **SendGrid**: Set `SENDGRID_API_KEY`
- **Nodemailer**: Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

Also set `NEXT_PUBLIC_SITE_URL` to the help center URL.

## Step 7: Explain Next Steps

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
