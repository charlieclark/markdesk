import Link from 'next/link';
import { ArticleMeta } from '@/lib/types';

export default function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) {
    return <p className="text-text-secondary text-sm">No articles in this category yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={`/article/${article.slug}`}
            className="block p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <h3 className="text-base font-medium text-text">{article.title}</h3>
            {article.description && (
              <p className="text-sm text-text-secondary mt-1">{article.description}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
