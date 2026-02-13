/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ArrowLeft } from 'lucide-react';

interface BeaconUpdateDetailProps {
  slug: string;
  helpCenterUrl: string;
  onBack: () => void;
}

interface UpdateData {
  title: string;
  content: string;
  date: string;
  category: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const badgeLabels: Record<string, string> = {
  new: 'New',
  improvement: 'Improvement',
  fix: 'Fix',
  'coming-soon': 'Coming Soon',
  announcement: 'Announcement',
};

export default function BeaconUpdateDetail({ slug, helpCenterUrl, onBack }: BeaconUpdateDetailProps) {
  const [update, setUpdate] = useState<UpdateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${helpCenterUrl}/content/updates/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: UpdateData) => setUpdate(data))
      .catch(() => {
        setUpdate({ title: 'Error', content: '<p>Failed to load update.</p>', date: '', category: '' });
      })
      .finally(() => setLoading(false));
  }, [slug, helpCenterUrl]);

  if (loading) {
    return <div class="mdb-empty">Loading...</div>;
  }

  if (!update) return null;

  return (
    <div>
      <button class="mdb-article-back" onClick={onBack}>
        <ArrowLeft size={12} />
        Back
      </button>
      {update.category && (
        <div class="mdb-update-meta" style={{ marginBottom: '8px' }}>
          <span class={`mdb-update-badge ${update.category}`}>
            {badgeLabels[update.category] || 'Update'}
          </span>
          {update.date && (
            <span class="mdb-update-date">
              {new Date(update.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      )}
      <div class="mdb-article-title">{update.title}</div>
      <div
        class="mdb-article-body"
        dangerouslySetInnerHTML={{ __html: update.content }}
        onClick={(e: MouseEvent) => {
          let target = e.target as HTMLElement | null;
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          if (!target) return;
          const anchor = target as HTMLAnchorElement;
          const href = anchor.getAttribute('href') || '';
          if (new URL(href, window.location.origin).hostname === window.location.hostname) {
            e.preventDefault();
            window.location.href = href;
          } else {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
          }
        }}
      />
      {update.ctaLabel && update.ctaUrl && (
        <div class="mdb-update-cta">
          <a
            class="mdb-update-cta-btn"
            href={update.ctaUrl}
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              window.location.href = update.ctaUrl!;
            }}
          >
            {update.ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
