import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllUpdateMetas, getUpdateBySlug } from '@/lib/content';
import ArticleContent from '@/components/ArticleContent';
import UpdateBadge from '@/components/UpdateBadge';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllUpdateMetas().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug);
  if (!update) return {};
  return { title: update.title };
}

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug);
  if (!update) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/updates"
        className="text-sm text-text-secondary hover:text-text transition-colors mb-6 inline-flex items-center gap-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All Updates
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-3 mb-3">
          <UpdateBadge category={update.category} />
          <time className="text-sm text-text-secondary">
            {new Date(update.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-2xl font-bold text-text mb-6">{update.title}</h1>
        <ArticleContent html={update.content} />
        {update.ctaLabel && update.ctaUrl && (
          <div className="mt-10 p-6 bg-bg-gray rounded-xl text-center">
            <a
              href={update.ctaUrl}
              className="inline-block bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              {update.ctaLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
