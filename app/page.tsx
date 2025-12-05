import Header from '@/components/Header';
import ArticleListItem from '@/components/ArticleListItem';
import { getAllArticles } from '@/lib/contentLoader';

/**
 * Página inicial que lista todos os artigos disponíveis
 */
export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum artigo disponível no momento.</p>
          </div>
        ) : (
          <div className="space-y-4" role="list">
            {articles.map((article) => (
              <ArticleListItem
                key={article.slug}
                title={article.title}
                slug={article.slug}
                studentName={article.studentName}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
