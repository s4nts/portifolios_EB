import Link from "next/link";

interface ArticleListItemProps {
  title: string;
  slug: string;
  studentName: string;
  subtitle?: string;
}

/**
 * Componente que exibe um item da lista de artigos
 */
export default function ArticleListItem({
  title,
  slug,
  studentName,
  subtitle,
}: ArticleListItemProps) {
  const safeTitle = title?.trim() || "Portifólio";
  const safeSlug = slug?.trim() || "";
  const safeStudentName = studentName?.trim() || "";
  const safeSubtitle = subtitle?.trim();
  const displayTitle = safeStudentName 
    ? `${safeTitle} - ${safeStudentName}`
    : safeTitle;

  if (!safeSlug) {
    return null;
  }

  return (
    <article role="listitem">
      <Link
        href={`/articles/${safeSlug}`}
        className="group block p-6 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label={`Ver portifólio: ${displayTitle}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              {displayTitle}
            </h2>
            {safeSubtitle && (
              <p className="text-sm text-slate-500">{safeSubtitle}</p>
            )}
          </div>
          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
