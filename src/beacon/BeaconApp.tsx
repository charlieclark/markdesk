/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import BeaconButton from './BeaconButton';
import BeaconPanel, { TabId } from './BeaconPanel';
import BeaconModal from './BeaconModal';

interface Config {
  helpCenterUrl: string;
  position?: string;
  title?: string;
  autoShowModal?: boolean;
  modalDelay?: number;
  modalMaxAgeDays?: number;
}

export default function BeaconApp({ config }: { config: Config }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('answers');
  const [badgeCount, setBadgeCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string>();
  const [askPrefill, setAskPrefill] = useState<{ subject?: string; message?: string }>();
  const [modalEnabled, setModalEnabled] = useState(config.autoShowModal !== false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const helpCenterUrl = config.helpCenterUrl.replace(/\/$/, '');

  const checkUnseen = useCallback(() => {
    fetch(`${helpCenterUrl}/content/updates.json`)
      .then((res) => res.json())
      .then((updates: { date: string }[]) => {
        if (updates.length === 0) {
          setBadgeCount(0);
          return;
        }

        const lastSeen = localStorage.getItem('markdesk-last-seen-update');
        const lastDismissed = localStorage.getItem('markdesk-dismissed');

        let unseenCount = lastSeen
          ? updates.filter((u) => new Date(u.date) > new Date(lastSeen)).length
          : updates.length;

        if (lastDismissed && (!lastSeen || new Date(lastDismissed) >= new Date(lastSeen)) && unseenCount > 0) {
          unseenCount--;
        }

        setBadgeCount(unseenCount);
      })
      .catch(() => {});
  }, [helpCenterUrl]);

  useEffect(() => {
    checkUnseen();
  }, [checkUnseen]);

  // Scroll lock on mobile when panel is open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 440) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Public API
  useEffect(() => {
    (window as any).Markdesk = {
      open: (tab?: TabId) => {
        if (tab) setActiveTab(tab);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
      identify: (info: { email?: string }) => {
        if (info.email) setUserEmail(info.email);
      },
      showModal: () => {
        setModalEnabled(true);
      },
      ask: (options?: { subject?: string; message?: string }) => {
        if (options) setAskPrefill(options);
        setActiveTab('ask');
        setIsOpen(true);
      },
      article: (slug: string) => {
        setActiveTab('answers');
        setIsOpen(true);
        setTimeout(() => {
          (window as any).__markdeskViewArticle?.(slug);
        }, 50);
      },
    };
  }, []);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleMarkSeen() {
    setBadgeCount(0);
  }

  function handleRootClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IMG') return;
    const parent = target.closest('.mdb-article-body, .mdb-modal-body');
    if (!parent) return;
    e.preventDefault();
    e.stopPropagation();
    setLightboxSrc((target as HTMLImageElement).src);
  }

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxSrc]);

  return (
    <div onClick={handleRootClick}>
      {modalEnabled && (
        <BeaconModal helpCenterUrl={helpCenterUrl} delay={config.modalDelay ?? 5000} maxAgeDays={config.modalMaxAgeDays ?? 180} onDismiss={checkUnseen} />
      )}

      {isOpen && <div class="mdb-mobile-overlay" onClick={handleClose} />}

      {isOpen && (
        <BeaconPanel
          helpCenterUrl={helpCenterUrl}
          userEmail={userEmail}
          activeTab={activeTab}
          badgeCount={badgeCount}
          onClose={handleClose}
          onMarkSeen={handleMarkSeen}
          title={config.title}
          prefillSubject={askPrefill?.subject}
          prefillMessage={askPrefill?.message}
          onPrefillConsumed={() => setAskPrefill(undefined)}
        />
      )}

      <BeaconButton
        onClick={handleToggle}
        badgeCount={badgeCount}
        isOpen={isOpen}
      />

      {lightboxSrc && (
        <div class="mdb-lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="" />
        </div>
      )}
    </div>
  );
}
