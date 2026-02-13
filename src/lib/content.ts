import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { Article, ArticleMeta, ProductUpdate, ProductUpdateMeta } from './types';

const articlesDir = path.join(process.cwd(), 'content/articles');
const updatesDir = path.join(process.cwd(), 'content/updates');

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
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

export function getAllArticleMetas(): ArticleMeta[] {
  const files = getMarkdownFiles(articlesDir);
  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug as string,
        title: data.title as string,
        category: data.category as string,
        description: (data.description as string) || '',
        order: (data.order as number) || 99,
        faq: (data.faq as boolean) || false,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  if (categorySlug === 'faq') {
    return getAllArticleMetas().filter((a) => a.faq);
  }
  return getAllArticleMetas().filter((a) => a.category === categorySlug);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const files = getMarkdownFiles(articlesDir);
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return {
        slug: data.slug,
        title: data.title,
        category: data.category,
        description: data.description || '',
        order: data.order || 99,
        faq: data.faq || false,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        content: await renderMarkdown(content),
      };
    }
  }
  return null;
}

export function getAllUpdateMetas(): ProductUpdateMeta[] {
  const files = getMarkdownFiles(updatesDir);
  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug as string,
        title: data.title as string,
        date: data.date as string,
        category: data.category,
        showModal: data.showModal || false,
        ...(data.ctaLabel && { ctaLabel: data.ctaLabel as string }),
        ...(data.ctaUrl && { ctaUrl: data.ctaUrl as string }),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getUpdateBySlug(slug: string): Promise<ProductUpdate | null> {
  const files = getMarkdownFiles(updatesDir);
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return {
        slug: data.slug,
        title: data.title,
        date: data.date,
        category: data.category,
        showModal: data.showModal || false,
        ...(data.ctaLabel && { ctaLabel: data.ctaLabel }),
        ...(data.ctaUrl && { ctaUrl: data.ctaUrl }),
        content: await renderMarkdown(content),
      };
    }
  }
  return null;
}

export function getAllArticlesForSearch(): { slug: string; title: string; description: string; category: string; body: string }[] {
  const files = getMarkdownFiles(articlesDir);
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      title: data.title,
      description: data.description || '',
      category: data.category,
      body: content.replace(/[#*`\[\]()>_~|]/g, '').substring(0, 500),
    };
  });
}
