import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticleMetas, getArticleBySlug } from '@/lib/content';
import { getCategoryBySlug } from '@/lib/categories';
import CategorySidebar from '@/components/CategorySidebar';
import ArticleContent from '@/components/ArticleContent';
import ArticleFeedback from '@/components/ArticleFeedback';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllArticleMetas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategoryBySlug(article.category);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <CategorySidebar activeSlug={article.category} />
        <div className="flex-1 min-w-0">
          <nav className="text-sm text-text-secondary mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-text transition-colors">
              Home
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-text transition-colors"
                >
                  {category.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-text">{article.title}</span>
          </nav>

          <h1 className="text-2xl font-bold text-text mb-2">{article.title}</h1>
          {article.updatedAt && (
            <p className="text-xs text-text-secondary mb-6">
              Last updated:{' '}
              {new Date(article.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <ArticleContent html={article.content} />
          <ArticleFeedback />

          <div className="mt-10 p-6 bg-bg-gray rounded-xl text-center">
            <p className="text-sm font-medium text-text mb-1">Still need help?</p>
            <p className="text-xs text-text-secondary mb-3">
              Our team is here to answer your questions.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-white text-sm px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
