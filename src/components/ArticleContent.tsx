'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export default function ArticleContent({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxSrc, closeLightbox]);

  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      e.preventDefault();
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }

  return (
    <>
      <div
        ref={contentRef}
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleClick}
      />
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img src={lightboxSrc} alt="" />
        </div>
      )}
    </>
  );
}
