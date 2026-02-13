import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = path.join(process.cwd(), 'content/articles');
const outputPath = path.join(process.cwd(), 'public/search-index.json');

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

function buildIndex() {
  const files = getMarkdownFiles(articlesDir);
  const entries = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      title: data.title,
      description: data.description || '',
      category: data.category,
      body: content
        .replace(/[#*`\[\]()>_~|]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 500),
      ...(data.faq ? { faq: true } : {}),
    };
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Search index built with ${entries.length} entries → ${outputPath}`);
}

buildIndex();
