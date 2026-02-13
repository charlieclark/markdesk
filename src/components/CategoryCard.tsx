import Link from 'next/link';
import { Category } from '@/lib/types';

export default function CategoryCard({ category, articleCount }: { category: Category; articleCount: number }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block p-6 bg-white border border-border rounded-xl hover:shadow-md transition-shadow"
    >
      <div className="text-3xl mb-3">{category.icon}</div>
      <h2 className="text-lg font-semibold text-text mb-1">{category.title}</h2>
      <p className="text-sm text-text-secondary mb-2">{category.description}</p>
      <span className="text-xs text-text-secondary">
        {articleCount} {articleCount === 1 ? 'article' : 'articles'}
      </span>
    </Link>
  );
}
