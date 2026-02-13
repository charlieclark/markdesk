import { categories } from '@/lib/categories';
import { getArticlesByCategory } from '@/lib/content';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const categoriesWithCounts = categories.map((cat) => ({
    category: cat,
    articleCount: getArticlesByCategory(cat.slug).length,
  }));

  const faqArticles = getArticlesByCategory('faq');

  return (
    <div>
      <section className="bg-primary text-white py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">How can we help?</h1>
          <p className="text-white/70 mb-6 sm:mb-8">Search our help center for answers</p>
          <SearchBar />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesWithCounts.map(({ category, articleCount }) => (
            <CategoryCard
              key={category.slug}
              category={category}
              articleCount={articleCount}
            />
          ))}
        </div>

        {faqArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text mb-4">Frequently Asked Questions</h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {faqArticles.map((article, i) => (
                <a
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className={`block px-5 py-4 hover:bg-bg-gray transition-colors${i < faqArticles.length - 1 ? ' border-b border-border' : ''}`}
                >
                  <div className="text-sm font-medium text-text">{article.title}</div>
                  {article.description && (
                    <div className="text-xs text-text-secondary mt-0.5">{article.description}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
