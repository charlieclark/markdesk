import Link from 'next/link';
import { ProductUpdateMeta } from '@/lib/types';
import UpdateBadge from './UpdateBadge';

export default function UpdateCard({ update }: { update: ProductUpdateMeta }) {
  return (
    <Link
      href={`/updates/${update.slug}`}
      className="block p-5 rounded-xl border border-border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-2">
        <UpdateBadge category={update.category} />
        <time className="text-xs text-text-secondary">
          {new Date(update.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
      <h3 className="text-base font-semibold text-text">{update.title}</h3>
    </Link>
  );
}
