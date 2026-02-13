/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ArrowLeft } from 'lucide-react';

interface BeaconArticleProps {
  slug: string;
  helpCenterUrl: string;
  onBack: () => void;
  onSwitchToAsk?: () => void;
}

interface ArticleData {
  title: string;
  content: string;
}

export default function BeaconArticle({ slug, helpCenterUrl, onBack, onSwitchToAsk }: BeaconArticleProps) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${helpCenterUrl}/content/articles/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: ArticleData) => setArticle(data))
      .catch(() => {
        setArticle({ title: 'Error', content: '<p>Failed to load article.</p>' });
      })
      .finally(() => setLoading(false));
  }, [slug, helpCenterUrl]);

  if (loading) {
    return <div class="mdb-empty">Loading...</div>;
  }

  if (!article) return null;

  return (
    <div>
      <button class="mdb-article-back" onClick={onBack}>
        <ArrowLeft size={12} />
        Back
      </button>
      <div class="mdb-article-title">{article.title}</div>
      <div
        class="mdb-article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
        onClick={(e: MouseEvent) => {
          let target = e.target as HTMLElement | null;
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          if (!target) return;
          const anchor = target as HTMLAnchorElement;
          const href = anchor.getAttribute('href');
          if (!href) return;
          const match = href.match(new RegExp(`^${helpCenterUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/article/([\\w-]+)`));
          if (match) {
            e.preventDefault();
            (window as any).__markdeskViewArticle?.(match[1]);
          } else {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
          }
        }}
      />
      {onSwitchToAsk && (
        <div class="mdb-article-contact">
          <div class="mdb-article-contact-title">Still need help?</div>
          <div class="mdb-article-contact-desc">Our team is here to answer your questions.</div>
          <button class="mdb-article-contact-btn" onClick={onSwitchToAsk}>Contact us</button>
        </div>
      )}
    </div>
  );
}
