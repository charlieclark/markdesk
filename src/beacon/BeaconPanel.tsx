/** @jsxImportSource preact */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { X } from "lucide-react";
import BeaconSearch from "./BeaconSearch";
import BeaconArticle from "./BeaconArticle";
import BeaconContact from "./BeaconContact";
import BeaconUpdates from "./BeaconUpdates";
import BeaconUpdateDetail from "./BeaconUpdateDetail";

export type TabId = "answers" | "ask" | "updates";

interface BeaconPanelProps {
  helpCenterUrl: string;
  userId?: string;
  userEmail?: string;
  activeTab: TabId;
  badgeCount: number;
  onClose: () => void;
  onMarkSeen: () => void;
  title?: string;
}

export default function BeaconPanel({
  helpCenterUrl,
  userId,
  userEmail,
  activeTab: initialTab,
  badgeCount,
  onClose,
  onMarkSeen,
  title,
}: BeaconPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [viewingArticle, setViewingArticle] = useState<string | null>(null);
  const [viewingUpdate, setViewingUpdate] = useState<string | null>(null);

  // Expose article viewer for the public API
  useEffect(() => {
    (window as any).__markdeskViewArticle = (slug: string) => {
      setViewingArticle(slug);
    };
    return () => {
      delete (window as any).__markdeskViewArticle;
    };
  }, []);

  return (
    <div class="mdb-panel">
      <div class="mdb-header">
        <span class="mdb-header-title">{title || 'Help'}</span>
        <button class="mdb-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div class="mdb-tabs">
        <button
          class={`mdb-tab ${activeTab === "answers" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("answers");
            setViewingArticle(null);
          }}
        >
          Answers
        </button>
        <button
          class={`mdb-tab ${activeTab === "ask" ? "active" : ""}`}
          onClick={() => setActiveTab("ask")}
        >
          Ask
        </button>
        <button
          class={`mdb-tab ${activeTab === "updates" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("updates");
            setViewingUpdate(null);
          }}
        >
          Updates
          {badgeCount > 0 && (
            <span class="mdb-tab-badge">
              {badgeCount > 9 ? "9+" : badgeCount}
            </span>
          )}
        </button>
      </div>

      <div class="mdb-content">
        {activeTab === "answers" && !viewingArticle && (
          <BeaconSearch
            helpCenterUrl={helpCenterUrl}
            onViewArticle={setViewingArticle}
            onSwitchToAsk={() => setActiveTab("ask")}
          />
        )}
        {activeTab === "answers" && viewingArticle && (
          <BeaconArticle
            slug={viewingArticle}
            helpCenterUrl={helpCenterUrl}
            onBack={() => setViewingArticle(null)}
            onSwitchToAsk={() => setActiveTab("ask")}
          />
        )}
        {activeTab === "ask" && (
          <BeaconContact
            helpCenterUrl={helpCenterUrl}
            userId={userId}
            userEmail={userEmail}
          />
        )}
        {activeTab === "updates" && !viewingUpdate && (
          <BeaconUpdates
            helpCenterUrl={helpCenterUrl}
            userId={userId}
            onMarkSeen={onMarkSeen}
            onViewUpdate={setViewingUpdate}
          />
        )}
        {activeTab === "updates" && viewingUpdate && (
          <BeaconUpdateDetail
            slug={viewingUpdate}
            helpCenterUrl={helpCenterUrl}
            onBack={() => setViewingUpdate(null)}
          />
        )}
      </div>

      <a
        class="mdb-footer-link"
        href={helpCenterUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Help Center →
      </a>
    </div>
  );
}
