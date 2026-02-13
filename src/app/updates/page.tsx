import { getAllUpdateMetas } from '@/lib/content';
import UpdateCard from '@/components/UpdateCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Updates',
  description: 'Latest product updates, new features, and improvements.',
};

export default function UpdatesPage() {
  const updates = getAllUpdateMetas();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-text mb-2">Product Updates</h1>
      <p className="text-text-secondary mb-8">
        Stay up to date with the latest features, improvements, and fixes.
      </p>
      <div className="space-y-4">
        {updates.map((update) => (
          <UpdateCard key={update.slug} update={update} />
        ))}
      </div>
      {updates.length === 0 && (
        <p className="text-text-secondary text-sm">No updates yet. Check back soon!</p>
      )}
    </div>
  );
}
