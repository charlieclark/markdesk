/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Search } from 'lucide-react';

interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  faq?: boolean;
}

interface BeaconSearchProps {
  helpCenterUrl: string;
  onViewArticle: (slug: string) => void;
  onSwitchToAsk?: () => void;
}

export default function BeaconSearch({ helpCenterUrl, onViewArticle, onSwitchToAsk }: BeaconSearchProps) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [results, setResults] = useState<SearchEntry[]>([]);

  useEffect(() => {
    fetch(`${helpCenterUrl}/search-index.json`)
      .then((res) => res.json())
      .then((data: SearchEntry[]) => setEntries(data))
      .catch(() => {});
  }, [helpCenterUrl]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      entries
        .filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.body.toLowerCase().includes(q)
        )
        .slice(0, 6)
    );
  }, [query, entries]);

  return (
    <div>
      <div class="mdb-search-wrap">
        <span class="mdb-search-icon">
          <Search size={14} color="#9ca3af" />
        </span>
        <input
          type="text"
          class="mdb-search-input"
          placeholder="Search for answers..."
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        />
      </div>

      {results.length > 0 && (
        <ul class="mdb-search-results">
          {results.map((r) => (
            <li key={r.slug} class="mdb-result-item">
              <a class="mdb-result-link" onClick={() => onViewArticle(r.slug)}>
                <div class="mdb-result-title">{r.title}</div>
                {r.description && <div class="mdb-result-desc">{r.description}</div>}
              </a>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && (
        <div class="mdb-empty">
          <div>No results found for &ldquo;{query}&rdquo;</div>
          {onSwitchToAsk && (
            <a
              style={{ display: 'block', marginTop: '8px', color: '#000', cursor: 'pointer', fontWeight: '500' }}
              onClick={onSwitchToAsk}
            >
              Contact us for help
            </a>
          )}
        </div>
      )}

      {query.length < 2 && entries.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: '#727272', marginBottom: '8px' }}>
            Frequently asked questions
          </div>
          <ul class="mdb-search-results">
            {entries.filter((e) => e.faq).map((e) => (
              <li key={e.slug} class="mdb-result-item">
                <a class="mdb-result-link" onClick={() => onViewArticle(e.slug)}>
                  <div class="mdb-result-title">{e.title}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
