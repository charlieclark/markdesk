/**
 * Pre-renders article and update content as static JSON files.
 *
 * Output:
 *   public/content/articles/{slug}.json  — { title, content }
 *   public/content/updates/{slug}.json   — { title, content, date, category }
 *   public/content/updates.json          — [{ slug, title, date, category, showModal }]
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const configModule = require('../markdesk.config');
const markdeskConfig = configModule.default || configModule;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || markdeskConfig.siteUrl;
const articlesDir = path.join(process.cwd(), 'content/articles');
const updatesDir = path.join(process.cwd(), 'content/updates');
const outArticles = path.join(process.cwd(), 'public/content/articles');
const outUpdates = path.join(process.cwd(), 'public/content/updates');
const outUpdatesIndex = path.join(process.cwd(), 'public/content/updates.json');

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function renderMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

function absolutifyPaths(html: string, origin: string): string {
  return html.replace(/(src|href)="(\/[^"]+)"/g, `$1="${origin}$2"`);
}

async function buildArticles() {
  fs.mkdirSync(outArticles, { recursive: true });
  const files = getMarkdownFiles(articlesDir);
  let count = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const html = await renderMarkdown(content);
    const json = {
      title: data.title,
      content: absolutifyPaths(html, SITE_URL),
    };
    fs.writeFileSync(
      path.join(outArticles, `${data.slug}.json`),
      JSON.stringify(json)
    );
    count++;
  }

  console.log(`Built ${count} article content files → ${outArticles}`);
}

async function buildUpdates() {
  fs.mkdirSync(outUpdates, { recursive: true });
  const files = getMarkdownFiles(updatesDir);
  const metas: { slug: string; title: string; date: string; category: string; showModal?: boolean; ctaLabel?: string; ctaUrl?: string }[] = [];
  let count = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const html = await renderMarkdown(content);
    const json: Record<string, unknown> = {
      title: data.title,
      content: absolutifyPaths(html, SITE_URL),
      date: data.date,
      category: data.category,
    };
    if (data.ctaLabel) json.ctaLabel = data.ctaLabel;
    if (data.ctaUrl) json.ctaUrl = data.ctaUrl;
    fs.writeFileSync(
      path.join(outUpdates, `${data.slug}.json`),
      JSON.stringify(json)
    );

    const meta: Record<string, unknown> = {
      slug: data.slug,
      title: data.title,
      date: data.date,
      category: data.category,
      showModal: data.showModal || false,
    };
    if (data.ctaLabel) meta.ctaLabel = data.ctaLabel;
    if (data.ctaUrl) meta.ctaUrl = data.ctaUrl;
    metas.push(meta as typeof metas[number]);
    count++;
  }

  // Sort newest first
  metas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  fs.writeFileSync(outUpdatesIndex, JSON.stringify(metas));

  console.log(`Built ${count} update content files + index → ${outUpdates}`);
}

async function main() {
  await buildArticles();
  await buildUpdates();
}

main().catch(console.error);
