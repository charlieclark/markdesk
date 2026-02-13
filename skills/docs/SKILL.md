---
name: markdesk-docs
description: Write help articles and product updates for your Markdesk help center
triggers:
  - write a help article
  - create a product update
  - document a feature
  - write a changelog entry
  - write documentation
  - add a help doc
  - create help content
---

# Markdesk Docs Skill

You are helping the user create help center content (articles and/or product updates) for their Markdesk-powered help center.

## Step 1: Gather Context

Look for the user's main project repository (not the help center) and run:

```bash
git log --oneline -30
```

Show the user the recent commits and ask which changes they want to document. If they want details on specific commits, use `git show <hash>`.

## Step 2: Ask Content Type

Use `AskUserQuestion` to ask:

**What type of content do you want to create?**
- **Help article** — Documentation explaining how to use a feature
- **Product update** — Changelog entry announcing a change
- **Both** — Create both a help article and a product update

## Step 3: Ask About Images

Ask if the user has any screenshots or images to include. If yes:

- Copy images to the appropriate directory in the help center project:
  - Articles: `public/images/articles/`
  - Updates: `public/images/updates/`
- Name files as `{slug}-{number}.{ext}` (e.g., `my-feature-1.png`)
- Reference in markdown as `![Alt text](/images/articles/{slug}-1.png)`

## Step 4: Category Selection (for articles)

If creating a help article, read the categories from `src/lib/categories.ts` in the help center project dynamically. Do NOT hardcode category names.

Use `AskUserQuestion` to ask:
1. Which category should this article belong to?
2. Should it appear in the FAQ section? (`faq: true`)

## Step 5: Generate Help Article

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

## Step 6: Generate Product Update

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

## Step 7: Verify

After creating the content:
1. List the files created
2. Show the frontmatter for each
3. Remind the user to run `npm run build` in the help center to regenerate the search index and content
