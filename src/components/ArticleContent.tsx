export default function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
