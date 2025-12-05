import Link from "next/link";

interface ArticleListItemProps {
  title: string;
  slug: string;
  subtitle?: string;
}

/**
 * Componente que exibe um item da lista de artigos
 */
export default function ArticleListItem({
  title,
  slug,
  subtitle,
}: ArticleListItemProps) {
  const safeTitle = title?.trim() || "Artigo sem título";
  const safeSlug = slug?.trim() || "";
  const safeSubtitle = subtitle?.trim();

  if (!safeSlug) {
    return null;
  }

  return (
    <article role="listitem">
      <Link
        href={`/articles/${safeSlug}`}
        className="block p-6 bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        aria-label={`Ver artigo: ${safeTitle}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {safeTitle}
        </h2>
        {safeSubtitle && (
          <p className="text-sm text-gray-600">{safeSubtitle}</p>
        )}
      </Link>
    </article>
  );
}
