/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface UpdateMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  showModal?: boolean;
}

interface BeaconUpdatesProps {
  helpCenterUrl: string;
  onMarkSeen: () => void;
  onViewUpdate: (slug: string) => void;
}

const badgeLabels: Record<string, string> = {
  new: 'New',
  improvement: 'Improvement',
  fix: 'Fix',
  'coming-soon': 'Coming Soon',
  announcement: 'Announcement',
};

export default function BeaconUpdates({ helpCenterUrl, onMarkSeen, onViewUpdate }: BeaconUpdatesProps) {
  const [updates, setUpdates] = useState<UpdateMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${helpCenterUrl}/content/updates.json`)
      .then((res) => res.json())
      .then((data: UpdateMeta[]) => {
        setUpdates(data);
        if (data.length > 0) {
          localStorage.setItem('markdesk-last-seen-update', data[0].date);
          onMarkSeen();
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [helpCenterUrl, onMarkSeen]);

  if (loading) {
    return <div class="mdb-empty">Loading updates...</div>;
  }

  if (updates.length === 0) {
    return <div class="mdb-empty">No updates yet. Check back soon!</div>;
  }

  return (
    <div>
      {updates.map((update) => (
        <div key={update.slug} class="mdb-update-item">
          <div class="mdb-update-meta">
            <span class={`mdb-update-badge ${update.category}`}>
              {badgeLabels[update.category] || 'Update'}
            </span>
            <span class="mdb-update-date">
              {new Date(update.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <a
            class="mdb-update-title"
            onClick={() => onViewUpdate(update.slug)}
          >
            {update.title}
          </a>
        </div>
      ))}
    </div>
  );
}
