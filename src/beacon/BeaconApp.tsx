/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import BeaconButton from './BeaconButton';
import BeaconPanel, { TabId } from './BeaconPanel';
import BeaconModal from './BeaconModal';

interface Config {
  helpCenterUrl: string;
  position?: string;
  userId?: string;
  title?: string;
}

interface UserInfo {
  name?: string;
  email?: string;
  userId?: string;
  showModal?: boolean;
}

export default function BeaconApp({ config }: { config: Config }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('answers');
  const [badgeCount, setBadgeCount] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  const helpCenterUrl = config.helpCenterUrl.replace(/\/$/, '');
  const userId = userInfo.userId || config.userId;

  // Check for unseen updates (logged-in users only)
  const checkUnseen = useCallback(() => {
    if (!userId) return;

    fetch(`${helpCenterUrl}/content/updates.json`)
      .then((res) => res.json())
      .then((updates: { date: string }[]) => {
        if (updates.length === 0) {
          setBadgeCount(0);
          return;
        }

        const lastSeen = localStorage.getItem(
          `markdesk-last-seen-update-${userId}`
        );
        const lastDismissed = localStorage.getItem(
          `markdesk-dismissed-${userId}`
        );

        let unseenCount = lastSeen
          ? updates.filter((u) => new Date(u.date) > new Date(lastSeen)).length
          : updates.length;

        // If the user dismissed a modal update that's among the unseen, subtract 1
        if (lastDismissed && (!lastSeen || new Date(lastDismissed) >= new Date(lastSeen)) && unseenCount > 0) {
          unseenCount--;
        }

        setBadgeCount(unseenCount);
      })
      .catch(() => {});
  }, [userId, helpCenterUrl]);

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
      identify: (info: UserInfo) => {
        if (!info.userId && info.name) {
          info.userId = info.name;
        }
        setUserInfo(info);
      },
      article: (slug: string) => {
        setActiveTab('answers');
        setIsOpen(true);
        // Slight delay to let panel render before setting article
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

  return (
    <div>
      {userId && userInfo.showModal !== false && (
        <BeaconModal helpCenterUrl={helpCenterUrl} userId={userId} onDismiss={checkUnseen} />
      )}

      {isOpen && <div class="mdb-mobile-overlay" onClick={handleClose} />}

      {isOpen && (
        <BeaconPanel
          helpCenterUrl={helpCenterUrl}
          userId={userId}
          userEmail={userInfo.email}
          activeTab={activeTab}
          badgeCount={badgeCount}
          onClose={handleClose}
          onMarkSeen={handleMarkSeen}
          title={config.title}
        />
      )}

      <BeaconButton
        onClick={handleToggle}
        badgeCount={badgeCount}
        isOpen={isOpen}
      />
    </div>
  );
}
