import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function CategorySidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="w-full lg:w-56 shrink-0">
      <div className="lg:sticky lg:top-4">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  cat.slug === activeSlug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:text-text hover:bg-bg-gray'
                }`}
              >
                {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
