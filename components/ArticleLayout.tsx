import BackButton from './BackButton';
import LogoImage from './LogoImage';

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  studentName: string;
}

/**
 * Layout para páginas de artigos individuais
 */
export default function ArticleLayout({
  children,
  title,
  studentName,
}: ArticleLayoutProps) {
  const safeTitle = title?.trim() || 'Artigo';
  const safeStudentName = studentName?.trim() || '';
  const displayTitle = safeStudentName 
    ? `${safeTitle} - ${safeStudentName}`
    : safeTitle;

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <LogoImage />
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {displayTitle}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
}
