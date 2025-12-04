import Link from 'next/link';

interface ArticleListItemProps {
  title: string;
  slug: string;
  subtitle?: string;
}

export default function ArticleListItem({
  title,
  slug,
  subtitle,
}: ArticleListItemProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="block p-6 bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </Link>
  );
}
