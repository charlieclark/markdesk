'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getConfig } from '@/lib/config';

const config = getConfig();
const STORAGE_KEY = 'markdesk-last-seen-update';

export default function Header() {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    fetch('/content/updates.json')
      .then((res) => res.json())
      .then((updates: { date: string }[]) => {
        if (!updates.length) return;
        const latestDate = updates[0].date;
        const lastSeen = localStorage.getItem(STORAGE_KEY);

        if (pathname.startsWith('/updates')) {
          localStorage.setItem(STORAGE_KEY, latestDate);
          setHasUnread(false);
        } else if (!lastSeen || new Date(latestDate) > new Date(lastSeen)) {
          setHasUnread(true);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const linkClass = (href: string) =>
    `${isActive(href) ? 'text-white font-medium underline underline-offset-4 decoration-2' : 'text-white/70'} hover:text-white transition-colors`;

  const updatesLink = (
    <Link href="/updates" className={`${linkClass('/updates')} relative`}>
      Updates
      {hasUnread && (
        <span className="absolute -top-1 -right-2.5 w-2 h-2 bg-red-400 rounded-full" />
      )}
    </Link>
  );

  return (
    <header className="bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white no-underline shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-lg font-bold whitespace-nowrap">{config.name} Help</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/" className={linkClass('/')}>
            Articles
          </Link>
          {updatesLink}
          <Link href="/contact" className={linkClass('/contact')}>
            Contact
          </Link>
          <a
            href={config.productUrl}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap"
          >
            Go to {config.name}
          </a>
        </nav>
        <nav className="flex sm:hidden items-center gap-4 text-sm">
          <Link href="/" className={linkClass('/')}>
            Articles
          </Link>
          {updatesLink}
          <Link href="/contact" className={linkClass('/contact')}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
