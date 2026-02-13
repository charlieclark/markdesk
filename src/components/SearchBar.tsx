'use client';

import { useState, useEffect, useRef } from 'react';
import type { SearchEntry } from '@/lib/types';

interface SearchIndex {
  entries: SearchEntry[];
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchEntry[]) => setIndex({ entries: data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!index || query.length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matched = index.entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q) ||
          entry.body.toLowerCase().includes(q)
      )
      .slice(0, 8);
    setResults(matched);
  }, [query, index]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-text bg-white shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 text-left">
          {results.map((result) => (
            <a
              key={result.slug}
              href={`/article/${result.slug}`}
              className="block px-4 py-3 hover:bg-bg-gray transition-colors border-b border-border last:border-b-0"
            >
              <div className="text-sm font-medium text-text">{result.title}</div>
              {result.description && (
                <div className="text-xs text-text-secondary mt-0.5 truncate">
                  {result.description}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border p-4 z-50 text-left">
          <p className="text-sm text-text-secondary text-center">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-center mt-2">
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
            {' '}for help
          </p>
        </div>
      )}
    </div>
  );
}
