/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface UpdateWithContent {
  slug: string;
  title: string;
  date: string;
  category: string;
  content: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface BeaconModalProps {
  helpCenterUrl: string;
  delay?: number;
  maxAgeDays?: number;
  onDismiss?: () => void;
}

const badgeLabels: Record<string, string> = {
  new: 'New',
  improvement: 'Improvement',
  fix: 'Fix',
  'coming-soon': 'Coming Soon',
  announcement: 'Announcement',
};

export default function BeaconModal({ helpCenterUrl, delay = 5000, maxAgeDays = 180, onDismiss }: BeaconModalProps) {
  const [update, setUpdate] = useState<UpdateWithContent | null>(null);
  const [ready, setReady] = useState(delay <= 0);

  useEffect(() => {
    if (delay <= 0) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!ready) return;

    // Fetch updates and check for undismissed modal updates
    fetch(`${helpCenterUrl}/content/updates.json`)
      .then((res) => res.json())
      .then(async (updates) => {
        const dismissedDate = localStorage.getItem('markdesk-dismissed');
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - maxAgeDays);

        const modalUpdate = updates.find(
          (u: { showModal?: boolean; date: string }) =>
            u.showModal &&
            new Date(u.date) > cutoff &&
            (!dismissedDate || new Date(u.date) > new Date(dismissedDate))
        );

        if (!modalUpdate) return;

        const contentRes = await fetch(`${helpCenterUrl}/content/updates/${modalUpdate.slug}.json`);
        if (!contentRes.ok) return;
        const data = await contentRes.json();

        setUpdate({
          ...modalUpdate,
          content: data.content,
          ctaLabel: data.ctaLabel || modalUpdate.ctaLabel,
          ctaUrl: data.ctaUrl || modalUpdate.ctaUrl,
        });
      })
      .catch(() => {});
  }, [helpCenterUrl, ready]);

  function handleDismiss() {
    if (!update) return;
    localStorage.setItem('markdesk-dismissed', update.date);
    setUpdate(null);
    onDismiss?.();
  }

  if (!update) return null;

  return (
    <div class="mdb-modal-overlay" onClick={handleDismiss}>
      <div class="mdb-modal" onClick={(e) => e.stopPropagation()}>
        <div class="mdb-modal-header">
          <button class="mdb-modal-close" onClick={handleDismiss} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div class="mdb-modal-badge-row">
            <span class={`mdb-update-badge ${update.category}`}>
              {badgeLabels[update.category] || 'Update'}
            </span>
            <span class="mdb-update-date">
              {new Date(update.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div class="mdb-modal-title">{update.title}</div>
        </div>
        <div
          class="mdb-modal-body"
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
              handleDismiss();
              window.location.href = href;
            } else {
              anchor.target = '_blank';
              anchor.rel = 'noopener noreferrer';
            }
          }}
        />
        <div class={`mdb-modal-footer${update.ctaLabel && update.ctaUrl ? ' mdb-modal-footer-split' : ''}`}>
          {update.ctaLabel && update.ctaUrl && (
            <a
              class="mdb-modal-cta"
              href={update.ctaUrl}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                handleDismiss();
                window.location.href = update.ctaUrl!;
              }}
            >
              {update.ctaLabel}
            </a>
          )}
          <button class="mdb-modal-dismiss" onClick={handleDismiss}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
