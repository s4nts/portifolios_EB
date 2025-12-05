import Image from 'next/image';
import BackButton from './BackButton';

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
}

/**
 * Layout para páginas de artigos individuais
 */
export default function ArticleLayout({
  children,
  title,
}: ArticleLayoutProps) {
  const safeTitle = title?.trim() || 'Artigo';

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4 flex items-center justify-between">
          <BackButton />
          <div className="relative w-12 h-12">
            <Image
              src="/images/logo.png"
              alt="Logo do site"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">{safeTitle}</h1>
        {children}
      </main>
    </div>
  );
}
