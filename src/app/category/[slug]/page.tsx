import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/lib/categories';
import { getArticlesByCategory } from '@/lib/content';
import CategorySidebar from '@/components/CategorySidebar';
import ArticleList from '@/components/ArticleList';
import type { Metadata } from 'next';

const faqCategory = {
  slug: 'faq',
  title: 'FAQ',
  description: 'Frequently asked questions.',
  icon: '❓',
};

export function generateStaticParams() {
  return [...categories, faqCategory].map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = slug === 'faq' ? faqCategory : getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = slug === 'faq' ? faqCategory : getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <CategorySidebar activeSlug={slug} />
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="text-3xl mb-2 block">{category.icon}</span>
            <h1 className="text-2xl font-bold text-text">{category.title}</h1>
            <p className="text-text-secondary mt-1">{category.description}</p>
          </div>
          <ArticleList articles={articles} />
        </div>
      </div>
    </div>
  );
}
